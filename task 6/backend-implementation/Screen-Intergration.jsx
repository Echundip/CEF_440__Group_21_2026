/**
 * screen_integrations.jsx
 * ─────────────────────────────────────────────────────────────
 * Copy-paste examples showing how each existing screen
 * connects to the Supabase backend.
 */

import { useEffect, useState, useRef } from 'react';
import { useAuth }                     from '../hooks/useAuth';
import { supabase }                    from '../lib/supabase';
import {
  CourseService,
  LessonService,
  EnrollmentService,
  QuizService,
  AssignmentService,
  LiveClassService,
  DownloadService,
  QoEService,
  RecommendationService,
  MessageService,
  NotificationService,
} from '../lib/services';
import { StorageService } from '../lib/storage';

// ============================================================
// LOGIN SCREEN
// ============================================================
export function LoginScreenIntegration() {
  const { signIn } = useAuth();

  async function handleLogin(email, password) {
    try {
      await signIn({ email, password });
      // Navigation handled by auth state listener in your navigator
    } catch (err) {
      alert(err.message);
    }
  }
}

// ============================================================
// REGISTER SCREEN
// ============================================================
export function RegisterScreenIntegration() {
  const { signUp } = useAuth();

  async function handleRegister(fullName, email, password, role) {
    try {
      await signUp({ email, password, fullName, role });
      alert('Check your email to confirm your account.');
    } catch (err) {
      alert(err.message);
    }
  }
}

// ============================================================
// STUDENT DASHBOARD
// ============================================================
export function StudentDashboardIntegration() {
  const { profile } = useAuth();
  const [enrollments,      setEnrollments]      = useState([]);
  const [recommendations,  setRecommendations]  = useState([]);
  const [notifications,    setNotifications]    = useState([]);

  useEffect(() => {
    if (!profile) return;

    async function load() {
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
    const sub = NotificationService.subscribeToNotifications(profile.id, (n) => {
      setNotifications((prev) => [n, ...prev]);
    });
    return () => supabase.removeChannel(sub);
  }, [profile]);
}

// ============================================================
// COURSE LIST SCREEN
// ============================================================
export function CourseListIntegration() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    CourseService.list().then(setCourses).catch(console.error);
  }, []);

  async function filterByCategory(category) {
    const data = await CourseService.list({ category });
    setCourses(data);
  }
}

// ============================================================
// COURSE DETAILS SCREEN
// ============================================================
export function CourseDetailsIntegration({ courseId }) {
  const { profile } = useAuth();
  const [course,    setCourse]    = useState(null);
  const [enrolled,  setEnrolled]  = useState(false);

  useEffect(() => {
    async function load() {
      const [c, isEnrolled] = await Promise.all([
        CourseService.get(courseId),
        EnrollmentService.isEnrolled(profile.id, courseId),
      ]);
      setCourse(c);
      setEnrolled(isEnrolled);
    }
    load();
  }, [courseId, profile]);

  async function enroll() {
    await EnrollmentService.enroll(profile.id, courseId);
    setEnrolled(true);
  }
}

// ============================================================
// LEARNING SCREEN  (QoE adaptive streaming)
// ============================================================
export function LearningScreenIntegration({ lessonId }) {
  const { profile } = useAuth();
  const [lesson,        setLesson]        = useState(null);
  const [playbackMode,  setPlaybackMode]  = useState('hd_video');
  const logIntervalRef = useRef(null);

  useEffect(() => {
    supabase.from('lessons').select('*').eq('id', lessonId).single()
      .then(({ data }) => setLesson(data));

    // Log QoE every 30 seconds
    logIntervalRef.current = setInterval(() => {
      measureAndLogQoE();
    }, 30000);

    return () => clearInterval(logIntervalRef.current);
  }, [lessonId]);

  async function measureAndLogQoE() {
    // Replace with your real network measurement (e.g. NetInfo + ping)
    const metrics = {
      bandwidth:  await measureBandwidth(),   // kbps
      latency:    await measureLatency(),     // ms
      packetLoss: await measurePacketLoss(),  // %
    };

    const mode = QoEService.selectMode(metrics);

    if (mode !== playbackMode) setPlaybackMode(mode);

    await QoEService.log({
      userId:      profile.id,
      lessonId,
      bandwidth:   metrics.bandwidth,
      latency:     metrics.latency,
      packetLoss:  metrics.packetLoss,
      selectedMode: mode,
    });
  }

  // Stubs — replace with actual measurements
  async function measureBandwidth()  { return 8000; }
  async function measureLatency()    { return 80;   }
  async function measurePacketLoss() { return 0.2;  }
}

// ============================================================
// QOE MONITORING SCREEN
// ============================================================
export function QoEMonitoringIntegration() {
  const { profile } = useAuth();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!profile) return;
    QoEService.getHistory(profile.id, 100).then(setLogs);
  }, [profile]);
}

// ============================================================
// DOWNLOADS SCREEN
// ============================================================
export function DownloadsScreenIntegration() {
  const { profile } = useAuth();
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    if (!profile) return;
    DownloadService.getMyDownloads(profile.id).then(setDownloads);
  }, [profile]);

  async function handleDownload(lessonId) {
    await DownloadService.markDownloaded(profile.id, lessonId);
    // Trigger actual file download to device using expo-file-system here
  }
}

// ============================================================
// PROFILE SCREEN
// ============================================================
export function ProfileScreenIntegration() {
  const { profile, updateProfile } = useAuth();

  async function handleAvatarUpload(fileUri) {
    await StorageService.uploadProfileImage(profile.id, fileUri);
    // profile.avatar_url is updated inside uploadProfileImage
  }

  async function handleSave(updates) {
    await updateProfile(updates);
  }
}

// ============================================================
// INSTRUCTOR DASHBOARD
// ============================================================
export function InstructorDashboardIntegration() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!profile) return;
    CourseService.listMine(profile.id).then(setCourses);
  }, [profile]);
}

// ============================================================
// CREATE COURSE SCREEN
// ============================================================
export function CreateCourseIntegration() {
  const { profile } = useAuth();

  async function handleCreate({ title, description, category, thumbnailUri }) {
    let thumbnailUrl = null;
    if (thumbnailUri) {
      const { publicUrl } = await StorageService.uploadThumbnail(profile.id, thumbnailUri);
      thumbnailUrl = publicUrl;
    }
    const course = await CourseService.create({
      instructorId: profile.id,
      title,
      description,
      category,
      thumbnailUrl,
    });
    return course;
  }
}

// ============================================================
// UPLOAD CONTENT SCREEN
// ============================================================
export function UploadContentIntegration() {
  const { profile } = useAuth();

  async function handleLessonUpload({ courseId, title, videoUri, audioUri, notesUri, duration }) {
    const [videoResult, audioResult, notesResult] = await Promise.all([
      videoUri ? StorageService.uploadCourseVideo(profile.id, videoUri, 'lesson.mp4') : null,
      audioUri ? StorageService.uploadCourseAudio(profile.id, audioUri, 'lesson.mp3') : null,
      notesUri ? StorageService.uploadCourseNotes(profile.id, notesUri, 'notes.pdf')  : null,
    ]);

    await LessonService.create({
      courseId,
      title,
      contentType: videoUri ? 'video' : audioUri ? 'audio' : 'text',
      videoUrl:    videoResult?.path  ?? null,
      audioUrl:    audioResult?.path  ?? null,
      notesUrl:    notesResult?.path  ?? null,
      duration,
      sortOrder:   0,
    });
  }
}

// ============================================================
// ASSIGNMENTS SCREEN
// ============================================================
export function AssignmentsScreenIntegration({ courseId }) {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    AssignmentService.listByCourse(courseId).then(setAssignments);
  }, [courseId]);

  async function handleSubmit(assignmentId, fileUri) {
    const { path } = await StorageService.uploadAssignment(profile.id, fileUri, 'submission.pdf');
    await AssignmentService.submit({
      assignmentId,
      studentId: profile.id,
      fileUrl:   path,
    });
  }
}

// ============================================================
// LIVE CLASSES SCREEN
// ============================================================
export function LiveClassesScreenIntegration({ courseId }) {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    LiveClassService.listByCourse(courseId).then(setClasses);
  }, [courseId]);
}

// ============================================================
// MESSAGES SCREEN
// ============================================================
export function MessagesScreenIntegration({ otherUserId }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!profile) return;

    MessageService.getConversation(profile.id, otherUserId).then(setMessages);
    MessageService.markRead(otherUserId, profile.id);

    // Real-time subscription
    const sub = MessageService.subscribeToConversation(
      profile.id,
      otherUserId,
      (newMsg) => setMessages((prev) => [...prev, newMsg])
    );
    return () => supabase.removeChannel(sub);
  }, [profile, otherUserId]);

  async function handleSend(text) {
    await MessageService.send({
      senderId:   profile.id,
      receiverId: otherUserId,
      message:    text,
    });
  }
}

// ============================================================
// CALENDAR SCREEN
// ============================================================
export function CalendarScreenIntegration() {
  const { profile } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!profile) return;
    // Combine assignments + live classes for enrolled courses
    async function load() {
      const enrollments = await EnrollmentService.getMyCourses(profile.id);
      const courseIds   = enrollments.map((e) => e.course_id);

      const [{ data: assignments }, { data: liveClasses }] = await Promise.all([
        supabase.from('assignments').select('*, courses(title)').in('course_id', courseIds),
        supabase.from('live_classes').select('*, courses(title)').in('course_id', courseIds).gte('scheduled_time', new Date().toISOString()),
      ]);

      setEvents([
        ...(assignments  ?? []).map((a) => ({ ...a, eventType: 'assignment' })),
        ...(liveClasses  ?? []).map((l) => ({ ...l, eventType: 'live_class' })),
      ]);
    }
    load();
  }, [profile]);
}

// ============================================================
// ANALYTICS SCREEN  (instructor)
// ============================================================
export function AnalyticsScreenIntegration() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!profile) return;
    async function load() {
      // Use the analytics views created in 05_analytics_views.sql
      const [{ data: completion }, { data: qoe }, { data: modes }] = await Promise.all([
        supabase.from('v_course_completion').select('*'),
        supabase.from('v_avg_qoe').select('*').single(),
        supabase.from('v_mode_distribution').select('*'),
      ]);
      setStats({ completion, qoe, modes });
    }
    load();
  }, [profile]);
}