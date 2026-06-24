/**
 * services.ts
 * ─────────────────────────────────────────────────────────────
 * CRUD operations for all EduStream tables.
 * Place at: src/lib/services.ts
 *
 * Every function throws on error so callers can try/catch.
 */

import { supabase } from './supabase';

// ============================================================
// SHARED TYPES
// ============================================================

export interface Profile {
  full_name: string;
  avatar_url?: string;
  email?: string;
}

export interface Course {
  id: string;
  instructor_id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url?: string;
  status: 'draft' | 'published';
  created_at: string;
  profiles?: Profile;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content_type: 'video' | 'audio' | 'notes';
  video_url?: string;
  audio_url?: string;
  notes_url?: string;
  duration?: number;
  sort_order: number;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  progress: number;
  courses?: Course;
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  options: string[];
  correct_index: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  score: number;
  answers: Record<string, number>;
  submitted_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  grade?: number;
  feedback?: string;
  profiles?: Profile;
}

export interface LiveClass {
  id: string;
  course_id: string;
  title: string;
  meeting_link: string;
  scheduled_time: string;
  duration_mins: number;
  courses?: Pick<Course, 'title'>;
}

export interface Download {
  id: string;
  user_id: string;
  lesson_id: string;
  downloaded_at: string;
  lessons?: Lesson & { courses?: Pick<Course, 'title'> };
}

export type QoEMode = 'hd_video' | 'sd_video' | 'audio_only' | 'text';

export interface QoELog {
  id: string;
  user_id: string;
  lesson_id: string;
  bandwidth: number;
  latency: number;
  packet_loss: number;
  selected_mode: QoEMode;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  course_id: string;
  recommendation_score: number;
  courses?: Course & { profiles?: Profile };
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  sent_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

// ============================================================
// PARAM TYPES
// ============================================================

export interface CreateCourseParams {
  instructorId: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
}

export interface CreateLessonParams {
  courseId: string;
  title: string;
  contentType: Lesson['content_type'];
  videoUrl?: string;
  audioUrl?: string;
  notesUrl?: string;
  duration?: number;
  sortOrder: number;
}

export interface CreateAssignmentParams {
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface SubmitAssignmentParams {
  assignmentId: string;
  studentId: string;
  fileUrl: string;
}

export interface GradeSubmissionParams {
  grade: number;
  feedback: string;
}

export interface CreateLiveClassParams {
  courseId: string;
  title: string;
  meetingLink: string;
  scheduledTime: string;
  durationMins: number;
}

export interface SubmitQuizAttemptParams {
  quizId: string;
  studentId: string;
  score: number;
  answers: Record<string, number>;
}

export interface QoEMetrics {
  bandwidth: number;
  latency: number;
  packetLoss: number;
}

export interface LogQoEParams extends QoEMetrics {
  userId: string;
  lessonId: string;
  selectedMode: QoEMode;
}

export interface UpsertRecommendationParams {
  userId: string;
  courseId: string;
  score: number;
}

export interface SendMessageParams {
  senderId: string;
  receiverId: string;
  message: string;
}

// ============================================================
// COURSES
// ============================================================

export const CourseService = {

  async list({ category }: { category?: string } = {}): Promise<Course[]> {
    let query = supabase
      .from('courses')
      .select(`*, profiles:instructor_id (full_name, avatar_url)`)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    if (error) throw error;
    return data as Course[];
  },

  async get(courseId: string): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .select(`*, lessons (*)`)
      .eq('id', courseId)
      .single();
    if (error) throw error;
    return data as Course;
  },

  async listMine(instructorId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Course[];
  },

  async create({ instructorId, title, description, category, thumbnailUrl }: CreateCourseParams): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert({ instructor_id: instructorId, title, description, category, thumbnail_url: thumbnailUrl })
      .select()
      .single();
    if (error) throw error;
    return data as Course;
  },

  async update(courseId: string, updates: Partial<Course>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId)
      .select()
      .single();
    if (error) throw error;
    return data as Course;
  },

  async remove(courseId: string): Promise<void> {
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (error) throw error;
  },
};

// ============================================================
// LESSONS
// ============================================================

export const LessonService = {

  async listByCourse(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order');
    if (error) throw error;
    return data as Lesson[];
  },

  async create({ courseId, title, contentType, videoUrl, audioUrl, notesUrl, duration, sortOrder }: CreateLessonParams): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        course_id: courseId, title, content_type: contentType,
        video_url: videoUrl, audio_url: audioUrl, notes_url: notesUrl,
        duration, sort_order: sortOrder,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Lesson;
  },

  async update(lessonId: string, updates: Partial<Lesson>): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', lessonId)
      .select()
      .single();
    if (error) throw error;
    return data as Lesson;
  },

  async remove(lessonId: string): Promise<void> {
    const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
    if (error) throw error;
  },
};

// ============================================================
// ENROLLMENTS
// ============================================================

export const EnrollmentService = {

  async enroll(studentId: string, courseId: string): Promise<Enrollment> {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ student_id: studentId, course_id: courseId })
      .select()
      .single();
    if (error) throw error;
    return data as Enrollment;
  },

  async getMyCourses(studentId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`*, courses (*)`)
      .eq('student_id', studentId);
    if (error) throw error;
    return data as Enrollment[];
  },

  async updateProgress(studentId: string, courseId: string, progress: number): Promise<Enrollment> {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ progress })
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .select()
      .single();
    if (error) throw error;
    return data as Enrollment;
  },

  async isEnrolled(studentId: string, courseId: string): Promise<boolean> {
    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .maybeSingle();
    return !!data;
  },
};

// ============================================================
// QUIZZES & ATTEMPTS
// ============================================================

export const QuizService = {

  async listByCourse(courseId: string): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`*, questions (*)`)
      .eq('course_id', courseId);
    if (error) throw error;
    return data as Quiz[];
  },

  async submitAttempt({ quizId, studentId, score, answers }: SubmitQuizAttemptParams): Promise<QuizAttempt> {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({ quiz_id: quizId, student_id: studentId, score, answers })
      .select()
      .single();
    if (error) throw error;
    return data as QuizAttempt;
  },

  async getMyAttempts(studentId: string, quizId: string): Promise<QuizAttempt[]> {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId)
      .eq('quiz_id', quizId)
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return data as QuizAttempt[];
  },
};

// ============================================================
// ASSIGNMENTS & SUBMISSIONS
// ============================================================

export const AssignmentService = {

  async listByCourse(courseId: string): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('course_id', courseId)
      .order('due_date');
    if (error) throw error;
    return data as Assignment[];
  },

  async create({ courseId, title, description, dueDate }: CreateAssignmentParams): Promise<Assignment> {
    const { data, error } = await supabase
      .from('assignments')
      .insert({ course_id: courseId, title, description, due_date: dueDate })
      .select()
      .single();
    if (error) throw error;
    return data as Assignment;
  },

  async submit({ assignmentId, studentId, fileUrl }: SubmitAssignmentParams): Promise<Submission> {
    const { data, error } = await supabase
      .from('submissions')
      .upsert({ assignment_id: assignmentId, student_id: studentId, file_url: fileUrl })
      .select()
      .single();
    if (error) throw error;
    return data as Submission;
  },

  async gradeSubmission(submissionId: string, { grade, feedback }: GradeSubmissionParams): Promise<Submission> {
    const { data, error } = await supabase
      .from('submissions')
      .update({ grade, feedback })
      .eq('id', submissionId)
      .select()
      .single();
    if (error) throw error;
    return data as Submission;
  },

  async getSubmissions(assignmentId: string): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select(`*, profiles:student_id (full_name, email)`)
      .eq('assignment_id', assignmentId);
    if (error) throw error;
    return data as Submission[];
  },
};

// ============================================================
// LIVE CLASSES
// ============================================================

export const LiveClassService = {

  async listByCourse(courseId: string): Promise<LiveClass[]> {
    const { data, error } = await supabase
      .from('live_classes')
      .select('*')
      .eq('course_id', courseId)
      .order('scheduled_time');
    if (error) throw error;
    return data as LiveClass[];
  },

  async getUpcoming(studentId: string): Promise<LiveClass[]> {
    const { data, error } = await supabase
      .from('live_classes')
      .select(`*, courses!inner(title, enrollments!inner(student_id))`)
      .eq('courses.enrollments.student_id', studentId)
      .gte('scheduled_time', new Date().toISOString())
      .order('scheduled_time')
      .limit(10);
    if (error) throw error;
    return data as LiveClass[];
  },

  async create({ courseId, title, meetingLink, scheduledTime, durationMins }: CreateLiveClassParams): Promise<LiveClass> {
    const { data, error } = await supabase
      .from('live_classes')
      .insert({
        course_id: courseId, title, meeting_link: meetingLink,
        scheduled_time: scheduledTime, duration_mins: durationMins,
      })
      .select()
      .single();
    if (error) throw error;
    return data as LiveClass;
  },
};

// ============================================================
// DOWNLOADS
// ============================================================

export const DownloadService = {

  async markDownloaded(userId: string, lessonId: string): Promise<Download> {
    const { data, error } = await supabase
      .from('downloads')
      .upsert({ user_id: userId, lesson_id: lessonId })
      .select()
      .single();
    if (error) throw error;
    return data as Download;
  },

  async getMyDownloads(userId: string): Promise<Download[]> {
    const { data, error } = await supabase
      .from('downloads')
      .select(`*, lessons (title, content_type, duration, courses (title))`)
      .eq('user_id', userId)
      .order('downloaded_at', { ascending: false });
    if (error) throw error;
    return data as Download[];
  },
};

// ============================================================
// QOE LOGS
// ============================================================

export const QoEService = {

  async log({ userId, lessonId, bandwidth, latency, packetLoss, selectedMode }: LogQoEParams): Promise<QoELog> {
    const { data, error } = await supabase
      .from('qoe_logs')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        bandwidth,
        latency,
        packet_loss: packetLoss,
        selected_mode: selectedMode,
      })
      .select()
      .single();
    if (error) throw error;
    return data as QoELog;
  },

  selectMode({ bandwidth, latency, packetLoss }: QoEMetrics): QoEMode {
    if (bandwidth > 5000 && latency < 150 && packetLoss < 1) return 'hd_video';
    if (bandwidth > 1500 && latency < 300 && packetLoss < 3) return 'sd_video';
    if (bandwidth > 300  && latency < 600 && packetLoss < 8) return 'audio_only';
    return 'text';
  },

  async getHistory(userId: string, limit = 50): Promise<QoELog[]> {
    const { data, error } = await supabase
      .from('qoe_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as QoELog[];
  },
};

// ============================================================
// RECOMMENDATIONS
// ============================================================

export const RecommendationService = {

  async getForUser(userId: string, limit = 5): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from('recommendations')
      .select(`*, courses (id, title, description, thumbnail_url, category, profiles:instructor_id (full_name))`)
      .eq('user_id', userId)
      .order('recommendation_score', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as Recommendation[];
  },

  async upsert({ userId, courseId, score }: UpsertRecommendationParams): Promise<Recommendation> {
    const { data, error } = await supabase
      .from('recommendations')
      .upsert({ user_id: userId, course_id: courseId, recommendation_score: score })
      .select()
      .single();
    if (error) throw error;
    return data as Recommendation;
  },
};

// ============================================================
// MESSAGES
// ============================================================

export const MessageService = {

  async getConversation(userA: string, userB: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userA},receiver_id.eq.${userB}),and(sender_id.eq.${userB},receiver_id.eq.${userA})`)
      .order('sent_at');
    if (error) throw error;
    return data as Message[];
  },

  async send({ senderId, receiverId, message }: SendMessageParams): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id: senderId, receiver_id: receiverId, message })
      .select()
      .single();
    if (error) throw error;
    return data as Message;
  },

  async markRead(senderId: string, receiverId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false);
    if (error) throw error;
  },

  subscribeToConversation(
    userA: string,
    userB: string,
    onMessage: (message: Message) => void
  ) {
    return supabase
      .channel(`messages:${[userA, userB].sort().join('_')}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userB}`,
        },
        (payload) => onMessage(payload.new as Message)
      )
      .subscribe();
  },
};

// ============================================================
// NOTIFICATIONS
// ============================================================

export const NotificationService = {

  async getMyNotifications(userId: string, { onlyUnread = false }: { onlyUnread?: boolean } = {}): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (onlyUnread) query = query.eq('is_read', false);
    const { data, error } = await query;
    if (error) throw error;
    return data as Notification[];
  },

  async markRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    if (error) throw error;
  },

  async markAllRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
  },

  subscribeToNotifications(
    userId: string,
    onNotification: (notification: Notification) => void
  ) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => onNotification(payload.new as Notification)
      )
      .subscribe();
  },
};