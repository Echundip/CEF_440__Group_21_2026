/**
 * screen_integrations.ts
 * ─────────────────────────────────────────────────────────────
 * Copy-paste examples showing how each existing screen
 * connects to the Supabase backend.
 */

import { useEffect, useRef, useState } from 'react';
import { useAuth } from './UseAuth';
import { supabase } from './supabase';
import {
  Assignment,
  AssignmentService,
  CourseService,
  Download,
  DownloadService,
  Enrollment,
  EnrollmentService,
  LiveClass,
  LiveClassService,
  LessonService,
  Message,
  MessageService,
  Notification,
  NotificationService,
  QoELog,
  QoEMetrics,
  QoEMode,
  QoEService,
  Recommendation,
  RecommendationService,
} from './Services';
import { StorageService } from './Storage';

// ============================================================
// LOCAL TYPES
// ============================================================

interface CalendarAssignment extends Assignment {
  eventType: 'assignment';
  courses?: { title: string };
}

interface CalendarLiveClass extends LiveClass {
  eventType: 'live_class';
  courses?: { title: string };
}

type CalendarEvent = CalendarAssignment | CalendarLiveClass;

interface AnalyticsStats {
  completion: CourseCompletionRow[] | null;
  qoe: AvgQoERow | null;
  modes: ModeDistributionRow[] | null;
}

interface CourseCompletionRow {
  course_id: string;
  title: string;
  completion_rate: number;
}

interface AvgQoERow {
  avg_bandwidth: number;
  avg_latency: number;
  avg_packet_loss: number;
}

interface ModeDistributionRow {
  selected_mode: QoEMode;
  count: number;
}

// ============================================================
// LOGIN SCREEN
// ============================================================
export function LoginScreenIntegration() {
  const { signIn } = useAuth();

  async function handleLogin(email: string, password: string): Promise<void> {
    try {
      await signIn({ email, password });
      // Navigation handled by auth state listener in your navigator
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return { handleLogin };
}

// ============================================================
// REGISTER SCREEN
// ============================================================
export function RegisterScreenIntegration() {
  const { signUp } = useAuth();

  async function handleRegister(
    fullName: string,
    email: string,
    password: string,
    role: 'student' | 'instructor' | 'admin',
  ): Promise<void> {
    try {
      await signUp({ email, password, fullName, role });
      alert('Check your email to confirm your account.');
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return { handleRegister };
}

// ============================================================
// STUDENT DASHBOARD
// ============================================================
export function StudentDashboardIntegration() {
  const { profile } = useAuth();
  const [enrollments,     setEnrollments]     = useState<Enrollment[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [notifications,   setNotifications]   = useState<Notification[]>([]);

  useEffect(() => {
    if (!profile) return;

    async function load(): Promise<void> {
      const [enroll, recs, notifs] = await Promise.all([
        EnrollmentService.getMyCourses(profile.id),
        RecommendationService.getForUser(profile.id),
        NotificationService.getMyNotifications(profile.id, { onlyUnread: true }),
      ]);
      setEnrollments(enroll);
      setRecommendations(recs);
      setNotifications(notifs);
    }
    load();

    // Real-time notifications
    const sub = NotificationService.subscribeToNotifications(
      profile.id,
      (n: Notification) => setNotifications((prev) => [n, ...prev]),
    );
    return () => { supabase.removeChannel(sub); };
  }, [profile]);

  return { enrollments, recommendations, notifications };
}

// ============================================================
// COURSE LIST SCREEN
// ============================================================
export function CourseListIntegration() {
  const [courses, setCourses] = useState<Awaited<ReturnType<typeof CourseService.list>>>([]);

  useEffect(() => {
    CourseService.list().then(setCourses).catch(console.error);
  }, []);

  async function filterByCategory(category: string): Promise<void> {
    const data = await CourseService.list({ category });
    setCourses(data);
  }

  return { courses, filterByCategory };
}

// ============================================================
// COURSE DETAILS SCREEN
// ============================================================
export function CourseDetailsIntegration({ courseId }: { courseId: string }) {
  const { profile } = useAuth();
  const [course,   setCourse]   = useState<Awaited<ReturnType<typeof CourseService.get>> | null>(null);
  const [enrolled, setEnrolled] = useState<boolean>(false);

  useEffect(() => {
    if (!profile) return;

    async function load(): Promise<void> {
      const [c, isEnrolled] = await Promise.all([
        CourseService.get(courseId),
        EnrollmentService.isEnrolled(profile.id, courseId),
      ]);
      setCourse(c);
      setEnrolled(isEnrolled);
    }
    load();
  }, [courseId, profile]);

  async function enroll(): Promise<void> {
    if (!profile) return;
    await EnrollmentService.enroll(profile.id, courseId);
    setEnrolled(true);
  }

  return { course, enrolled, enroll };
}

// ============================================================
// LEARNING SCREEN  (QoE adaptive streaming)
// ============================================================
export function LearningScreenIntegration({ lessonId }: { lessonId: string }) {
  const { profile } = useAuth();
  const [lesson,       setLesson]       = useState<Record<string, unknown> | null>(null);
  const [playbackMode, setPlaybackMode] = useState<QoEMode>('hd_video');
  const logIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single()
      .then(({ data }) => setLesson(data));

    // Log QoE every 30 seconds
    logIntervalRef.current = setInterval(() => {
      measureAndLogQoE();
    }, 30_000);

    return () => {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    };
  }, [lessonId]);

  async function measureAndLogQoE(): Promise<void> {
    if (!profile) return;

    const metrics: QoEMetrics = {
      bandwidth:  await measureBandwidth(),
      latency:    await measureLatency(),
      packetLoss: await measurePacketLoss(),
    };

    const mode = QoEService.selectMode(metrics);
    if (mode !== playbackMode) setPlaybackMode(mode);

    await QoEService.log({
      userId:       profile.id,
      lessonId,
      bandwidth:    metrics.bandwidth,
      latency:      metrics.latency,
      packetLoss:   metrics.packetLoss,
      selectedMode: mode,
    });
  }

  // Stubs — replace with actual network measurements
  async function measureBandwidth():  Promise<number> { return 8000; }
  async function measureLatency():    Promise<number> { return 80;   }
  async function measurePacketLoss(): Promise<number> { return 0.2;  }

  return { lesson, playbackMode };
}

// ============================================================
// QOE MONITORING SCREEN
// ============================================================
export function QoEMonitoringIntegration() {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<QoELog[]>([]);

  useEffect(() => {
    if (!profile) return;
    QoEService.getHistory(profile.id, 100).then(setLogs);
  }, [profile]);

  return { logs };
}

// ============================================================
// DOWNLOADS SCREEN
// ============================================================
export function DownloadsScreenIntegration() {
  const { profile } = useAuth();
  const [downloads, setDownloads] = useState<Download[]>([]);

  useEffect(() => {
    if (!profile) return;
    DownloadService.getMyDownloads(profile.id).then(setDownloads);
  }, [profile]);

  async function handleDownload(lessonId: string): Promise<void> {
    if (!profile) return;
    await DownloadService.markDownloaded(profile.id, lessonId);
    // Trigger actual file download to device using expo-file-system here
  }

  return { downloads, handleDownload };
}

// ============================================================
// PROFILE SCREEN
// ============================================================
export function ProfileScreenIntegration() {
  const { profile, updateProfile } = useAuth();

  async function handleAvatarUpload(fileUri: string): Promise<void> {
    if (!profile) return;
    await StorageService.uploadProfileImage(profile.id, fileUri);
    // profile.avatar_url is updated inside uploadProfileImage
  }

  async function handleSave(updates: Record<string, unknown>): Promise<void> {
    await updateProfile(updates);
  }

  return { profile, handleAvatarUpload, handleSave };
}

// ============================================================
// INSTRUCTOR DASHBOARD
// ============================================================
export function InstructorDashboardIntegration() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Awaited<ReturnType<typeof CourseService.listMine>>>([]);

  useEffect(() => {
    if (!profile) return;
    CourseService.listMine(profile.id).then(setCourses);
  }, [profile]);

  return { courses };
}

// ============================================================
// CREATE COURSE SCREEN
// ============================================================
export function CreateCourseIntegration() {
  const { profile } = useAuth();

  async function handleCreate({
    title,
    description,
    category,
    thumbnailUri,
  }: {
    title: string;
    description: string;
    category: string;
    thumbnailUri?: string;
  }) {
    if (!profile) return;

    let thumbnailUrl: string | null = null;
    if (thumbnailUri) {
      const { publicUrl } = await StorageService.uploadThumbnail(profile.id, thumbnailUri);
      thumbnailUrl = publicUrl;
    }

    const course = await CourseService.create({
      instructorId: profile.id,
      title,
      description,
      category,
      thumbnailUrl: thumbnailUrl ?? undefined,
    });

    return course;
  }

  return { handleCreate };
}

// ============================================================
// UPLOAD CONTENT SCREEN
// ============================================================
export function UploadContentIntegration() {
  const { profile } = useAuth();

  async function handleLessonUpload({
    courseId,
    title,
    videoUri,
    audioUri,
    notesUri,
    duration,
  }: {
    courseId: string;
    title: string;
    videoUri?: string;
    audioUri?: string;
    notesUri?: string;
    duration?: number;
  }): Promise<void> {
    if (!profile) return;

    const [videoResult, audioResult, notesResult] = await Promise.all([
      videoUri ? StorageService.uploadCourseVideo(profile.id, videoUri, 'lesson.mp4') : null,
      audioUri ? StorageService.uploadCourseAudio(profile.id, audioUri, 'lesson.mp3') : null,
      notesUri ? StorageService.uploadCourseNotes(profile.id, notesUri, 'notes.pdf')  : null,
    ]);

    await LessonService.create({
      courseId,
      title,
      contentType: videoUri ? 'video' : audioUri ? 'audio' : 'notes',
      videoUrl:    videoResult?.path  ?? undefined,
      audioUrl:    audioResult?.path  ?? undefined,
      notesUrl:    notesResult?.path  ?? undefined,
      duration,
      sortOrder:   0,
    });
  }

  return { handleLessonUpload };
}

// ============================================================
// ASSIGNMENTS SCREEN
// ============================================================
export function AssignmentsScreenIntegration({ courseId }: { courseId: string }) {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    AssignmentService.listByCourse(courseId).then(setAssignments);
  }, [courseId]);

  async function handleSubmit(assignmentId: string, fileUri: string): Promise<void> {
    if (!profile) return;
    const { path } = await StorageService.uploadAssignment(profile.id, fileUri, 'submission.pdf');
    await AssignmentService.submit({
      assignmentId,
      studentId: profile.id,
      fileUrl:   path,
    });
  }

  return { assignments, handleSubmit };
}

// ============================================================
// LIVE CLASSES SCREEN
// ============================================================
export function LiveClassesScreenIntegration({ courseId }: { courseId: string }) {
  const [classes, setClasses] = useState<LiveClass[]>([]);

  useEffect(() => {
    LiveClassService.listByCourse(courseId).then(setClasses);
  }, [courseId]);

  return { classes };
}

// ============================================================
// MESSAGES SCREEN
// ============================================================
export function MessagesScreenIntegration({ otherUserId }: { otherUserId: string }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!profile) return;

    MessageService.getConversation(profile.id, otherUserId).then(setMessages);
    MessageService.markRead(otherUserId, profile.id);

    // Real-time subscription
    const sub = MessageService.subscribeToConversation(
      profile.id,
      otherUserId,
      (newMsg: Message) => setMessages((prev) => [...prev, newMsg]),
    );
    return () => { supabase.removeChannel(sub); };
  }, [profile, otherUserId]);

  async function handleSend(text: string): Promise<void> {
    if (!profile) return;
    await MessageService.send({
      senderId:   profile.id,
      receiverId: otherUserId,
      message:    text,
    });
  }

  return { messages, handleSend };
}

// ============================================================
// CALENDAR SCREEN
// ============================================================
export function CalendarScreenIntegration() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (!profile) return;

    async function load(): Promise<void> {
      const enrollments = await EnrollmentService.getMyCourses(profile.id);
      const courseIds   = enrollments.map((e: Enrollment) => e.course_id);

      const [{ data: assignments }, { data: liveClasses }] = await Promise.all([
        supabase
          .from('assignments')
          .select('*, courses(title)')
          .in('course_id', courseIds),
        supabase
          .from('live_classes')
          .select('*, courses(title)')
          .in('course_id', courseIds)
          .gte('scheduled_time', new Date().toISOString()),
      ]);

      setEvents([
        ...(assignments ?? []).map((a: Assignment) => ({ ...a, eventType: 'assignment' as const })),
        ...(liveClasses ?? []).map((l: LiveClass)  => ({ ...l, eventType: 'live_class'  as const })),
      ]);
    }
    load();
  }, [profile]);

  return { events };
}

// ============================================================
// ANALYTICS SCREEN  (instructor)
// ============================================================
export function AnalyticsScreenIntegration() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<AnalyticsStats>({ completion: null, qoe: null, modes: null });

  useEffect(() => {
    if (!profile) return;

    async function load(): Promise<void> {
      const [{ data: completion }, { data: qoe }, { data: modes }] = await Promise.all([
        supabase.from('v_course_completion').select('*'),
        supabase.from('v_avg_qoe').select('*').single(),
        supabase.from('v_mode_distribution').select('*'),
      ]);

      setStats({
        completion: completion as CourseCompletionRow[] | null,
        qoe:        qoe        as AvgQoERow            | null,
        modes:      modes      as ModeDistributionRow[] | null,
      });
    }
    load();
  }, [profile]);

  return { stats };
}