/**
 * services.jsx
 * ─────────────────────────────────────────────────────────────
 * CRUD operations for all EduStream tables.
 * Place at: lib/services.jsx
 *
 * Every function throws on error so callers can try/catch.
 */

import { supabase } from './supabase';

// ============================================================
// COURSES
// ============================================================
export const CourseService = {

  /** All published courses (public listing) */
  async list({ category } = {}) {
    let query = supabase
      .from('courses')
      .select(`*, profiles:instructor_id (full_name, avatar_url)`)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /** Single course with lessons */
  async get(courseId) {
    const { data, error } = await supabase
      .from('courses')
      .select(`*, lessons (*)`)
      .eq('id', courseId)
      .single();
    if (error) throw error;
    return data;
  },

  /** Instructor's own courses */
  async listMine(instructorId) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  /** Create course */
  async create({ instructorId, title, description, category, thumbnailUrl }) {
    const { data, error } = await supabase
      .from('courses')
      .insert({ instructor_id: instructorId, title, description, category, thumbnail_url: thumbnailUrl })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** Update course */
  async update(courseId, updates) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** Delete course */
  async remove(courseId) {
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (error) throw error;
  },
};

// ============================================================
// LESSONS
// ============================================================
export const LessonService = {

  async listByCourse(courseId) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order');
    if (error) throw error;
    return data;
  },

  async create({ courseId, title, contentType, videoUrl, audioUrl, notesUrl, duration, sortOrder }) {
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
    return data;
  },

  async update(lessonId, updates) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', lessonId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(lessonId) {
    const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
    if (error) throw error;
  },
};

// ============================================================
// ENROLLMENTS
// ============================================================
export const EnrollmentService = {

  async enroll(studentId, courseId) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ student_id: studentId, course_id: courseId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getMyCourses(studentId) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`*, courses (*)`)
      .eq('student_id', studentId);
    if (error) throw error;
    return data;
  },

  async updateProgress(studentId, courseId, progress) {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ progress })
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async isEnrolled(studentId, courseId) {
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

  async listByCourse(courseId) {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`*, questions (*)`)
      .eq('course_id', courseId);
    if (error) throw error;
    return data;
  },

  async submitAttempt({ quizId, studentId, score, answers }) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({ quiz_id: quizId, student_id: studentId, score, answers })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getMyAttempts(studentId, quizId) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId)
      .eq('quiz_id', quizId)
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// ============================================================
// ASSIGNMENTS & SUBMISSIONS
// ============================================================
export const AssignmentService = {

  async listByCourse(courseId) {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('course_id', courseId)
      .order('due_date');
    if (error) throw error;
    return data;
  },

  async create({ courseId, title, description, dueDate }) {
    const { data, error } = await supabase
      .from('assignments')
      .insert({ course_id: courseId, title, description, due_date: dueDate })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async submit({ assignmentId, studentId, fileUrl }) {
    const { data, error } = await supabase
      .from('submissions')
      .upsert({ assignment_id: assignmentId, student_id: studentId, file_url: fileUrl })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async gradeSubmission(submissionId, { grade, feedback }) {
    const { data, error } = await supabase
      .from('submissions')
      .update({ grade, feedback })
      .eq('id', submissionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getSubmissions(assignmentId) {
    const { data, error } = await supabase
      .from('submissions')
      .select(`*, profiles:student_id (full_name, email)`)
      .eq('assignment_id', assignmentId);
    if (error) throw error;
    return data;
  },
};

// ============================================================
// LIVE CLASSES
// ============================================================
export const LiveClassService = {

  async listByCourse(courseId) {
    const { data, error } = await supabase
      .from('live_classes')
      .select('*')
      .eq('course_id', courseId)
      .order('scheduled_time');
    if (error) throw error;
    return data;
  },

  async getUpcoming(studentId) {
    const { data, error } = await supabase
      .from('live_classes')
      .select(`*, courses!inner(title, enrollments!inner(student_id))`)
      .eq('courses.enrollments.student_id', studentId)
      .gte('scheduled_time', new Date().toISOString())
      .order('scheduled_time')
      .limit(10);
    if (error) throw error;
    return data;
  },

  async create({ courseId, title, meetingLink, scheduledTime, durationMins }) {
    const { data, error } = await supabase
      .from('live_classes')
      .insert({ course_id: courseId, title, meeting_link: meetingLink, scheduled_time: scheduledTime, duration_mins: durationMins })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// DOWNLOADS
// ============================================================
export const DownloadService = {

  async markDownloaded(userId, lessonId) {
    const { data, error } = await supabase
      .from('downloads')
      .upsert({ user_id: userId, lesson_id: lessonId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getMyDownloads(userId) {
    const { data, error } = await supabase
      .from('downloads')
      .select(`*, lessons (title, content_type, duration, courses (title))`)
      .eq('user_id', userId)
      .order('downloaded_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// ============================================================
// QOE LOGS
// ============================================================
export const QoEService = {

  async log({ userId, lessonId, bandwidth, latency, packetLoss, selectedMode }) {
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
    return data;
  },

  /** Decide mode based on current network metrics */
  selectMode({ bandwidth, latency, packetLoss }) {
    if (bandwidth > 5000 && latency < 150 && packetLoss < 1) return 'hd_video';
    if (bandwidth > 1500 && latency < 300 && packetLoss < 3) return 'sd_video';
    if (bandwidth > 300  && latency < 600 && packetLoss < 8) return 'audio_only';
    return 'text';
  },

  async getHistory(userId, limit = 50) {
    const { data, error } = await supabase
      .from('qoe_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },
};

// ============================================================
// RECOMMENDATIONS
// ============================================================
export const RecommendationService = {

  async getForUser(userId, limit = 5) {
    const { data, error } = await supabase
      .from('recommendations')
      .select(`*, courses (id, title, description, thumbnail_url, category, profiles:instructor_id (full_name))`)
      .eq('user_id', userId)
      .order('recommendation_score', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async upsert({ userId, courseId, score }) {
    const { data, error } = await supabase
      .from('recommendations')
      .upsert({ user_id: userId, course_id: courseId, recommendation_score: score })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// MESSAGES
// ============================================================
export const MessageService = {

  /** Conversation between two users */
  async getConversation(userA, userB) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userA},receiver_id.eq.${userB}),and(sender_id.eq.${userB},receiver_id.eq.${userA})`)
      .order('sent_at');
    if (error) throw error;
    return data;
  },

  async send({ senderId, receiverId, message }) {
    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id: senderId, receiver_id: receiverId, message })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async markRead(senderId, receiverId) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false);
    if (error) throw error;
  },

  /** Subscribe to real-time new messages */
  subscribeToConversation(userA, userB, onMessage) {
    return supabase
      .channel(`messages:${[userA, userB].sort().join('_')}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'messages',
          filter: `receiver_id=eq.${userB}`,
        },
        (payload) => onMessage(payload.new)
      )
      .subscribe();
  },
};

// ============================================================
// NOTIFICATIONS
// ============================================================
export const NotificationService = {

  async getMyNotifications(userId, { onlyUnread = false } = {}) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (onlyUnread) query = query.eq('is_read', false);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async markRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    if (error) throw error;
  },

  async markAllRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
  },

  /** Subscribe to real-time notifications */
  subscribeToNotifications(userId, onNotification) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => onNotification(payload.new)
      )
      .subscribe();
  },
};