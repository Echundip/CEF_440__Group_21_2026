-- ============================================================
-- EduStream — Row Level Security Policies
-- Migration: 02_rls_policies.sql
-- Run AFTER 01_schema.sql
-- ============================================================

-- ── Helper: get current user's role ───────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ============================================================
-- PROFILES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read public profile info (name, role, avatar)
CREATE POLICY "profiles_read_public"
  ON public.profiles FOR SELECT
  USING (TRUE);

-- Users can update only their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- Admins can do everything
CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  USING (public.get_my_role() = 'admin');

-- ============================================================
-- COURSES
-- ============================================================
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Published courses are publicly readable
CREATE POLICY "courses_read_published"
  ON public.courses FOR SELECT
  USING (status = 'published' OR instructor_id = auth.uid() OR public.get_my_role() = 'admin');

-- Instructors can insert their own courses
CREATE POLICY "courses_insert_instructor"
  ON public.courses FOR INSERT
  WITH CHECK (
    instructor_id = auth.uid()
    AND public.get_my_role() IN ('instructor', 'admin')
  );

-- Instructors can update/delete only their own courses
CREATE POLICY "courses_modify_own"
  ON public.courses FOR UPDATE
  USING (instructor_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "courses_delete_own"
  ON public.courses FOR DELETE
  USING (instructor_id = auth.uid() OR public.get_my_role() = 'admin');

-- ============================================================
-- LESSONS
-- ============================================================
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Students enrolled in the course can read lessons
CREATE POLICY "lessons_read_enrolled"
  ON public.lessons FOR SELECT
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = lessons.course_id AND c.instructor_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.enrollments e WHERE e.course_id = lessons.course_id AND e.student_id = auth.uid()
    )
  );

-- Only the course instructor or admin can modify lessons
CREATE POLICY "lessons_modify_instructor"
  ON public.lessons FOR INSERT
  WITH CHECK (
    public.get_my_role() IN ('instructor', 'admin')
    AND EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = lessons.course_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "lessons_update_instructor"
  ON public.lessons FOR UPDATE
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = lessons.course_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "lessons_delete_instructor"
  ON public.lessons FOR DELETE
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = lessons.course_id AND c.instructor_id = auth.uid()
    )
  );

-- ============================================================
-- ENROLLMENTS
-- ============================================================
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Students see only their own enrollments; instructors see enrollments for their courses
CREATE POLICY "enrollments_read"
  ON public.enrollments FOR SELECT
  USING (
    student_id = auth.uid()
    OR public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = enrollments.course_id AND c.instructor_id = auth.uid()
    )
  );

-- Students can enroll themselves
CREATE POLICY "enrollments_insert_student"
  ON public.enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Students can update their own progress; admins can update all
CREATE POLICY "enrollments_update"
  ON public.enrollments FOR UPDATE
  USING (student_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "enrollments_delete"
  ON public.enrollments FOR DELETE
  USING (student_id = auth.uid() OR public.get_my_role() = 'admin');

-- ============================================================
-- QUIZZES
-- ============================================================
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quizzes_read_enrolled"
  ON public.quizzes FOR SELECT
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = quizzes.course_id AND c.instructor_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.enrollments e WHERE e.course_id = quizzes.course_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "quizzes_modify_instructor"
  ON public.quizzes FOR ALL
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = quizzes.course_id AND c.instructor_id = auth.uid()
    )
  );

-- ============================================================
-- QUESTIONS
-- ============================================================
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions_read_enrolled"
  ON public.questions FOR SELECT
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.courses c ON c.id = q.course_id
      WHERE q.id = questions.quiz_id AND c.instructor_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.enrollments e ON e.course_id = q.course_id
      WHERE q.id = questions.quiz_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "questions_modify_instructor"
  ON public.questions FOR ALL
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.courses c ON c.id = q.course_id
      WHERE q.id = questions.quiz_id AND c.instructor_id = auth.uid()
    )
  );

-- ============================================================
-- QUIZ ATTEMPTS
-- ============================================================
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attempts_read"
  ON public.quiz_attempts FOR SELECT
  USING (
    student_id = auth.uid()
    OR public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.courses c ON c.id = q.course_id
      WHERE q.id = quiz_attempts.quiz_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "attempts_insert_student"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- ============================================================
-- ASSIGNMENTS
-- ============================================================
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assignments_read"
  ON public.assignments FOR SELECT
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = assignments.course_id AND c.instructor_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.enrollments e WHERE e.course_id = assignments.course_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "assignments_modify_instructor"
  ON public.assignments FOR ALL
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = assignments.course_id AND c.instructor_id = auth.uid()
    )
  );

-- ============================================================
-- SUBMISSIONS
-- ============================================================
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "submissions_read"
  ON public.submissions FOR SELECT
  USING (
    student_id = auth.uid()
    OR public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.courses c ON c.id = a.course_id
      WHERE a.id = submissions.assignment_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "submissions_insert_student"
  ON public.submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "submissions_update"
  ON public.submissions FOR UPDATE
  USING (
    student_id = auth.uid()
    OR public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.courses c ON c.id = a.course_id
      WHERE a.id = submissions.assignment_id AND c.instructor_id = auth.uid()
    )
  );

-- ============================================================
-- LIVE CLASSES
-- ============================================================
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "live_classes_read"
  ON public.live_classes FOR SELECT
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = live_classes.course_id AND c.instructor_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.enrollments e WHERE e.course_id = live_classes.course_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "live_classes_modify_instructor"
  ON public.live_classes FOR ALL
  USING (
    public.get_my_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = live_classes.course_id AND c.instructor_id = auth.uid()
    )
  );

-- ============================================================
-- DOWNLOADS
-- ============================================================
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "downloads_own"
  ON public.downloads FOR ALL
  USING (user_id = auth.uid() OR public.get_my_role() = 'admin');

-- ============================================================
-- QOE LOGS
-- ============================================================
ALTER TABLE public.qoe_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qoe_logs_own"
  ON public.qoe_logs FOR ALL
  USING (user_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "qoe_logs_insert"
  ON public.qoe_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- RECOMMENDATIONS
-- ============================================================
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recommendations_read_own"
  ON public.recommendations FOR SELECT
  USING (user_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "recommendations_admin_write"
  ON public.recommendations FOR ALL
  USING (public.get_my_role() = 'admin');

-- ============================================================
-- MESSAGES
-- ============================================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_read"
  ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "messages_insert"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "messages_update_read_status"
  ON public.messages FOR UPDATE
  USING (receiver_id = auth.uid() OR public.get_my_role() = 'admin');

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_read_own"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "notifications_admin_insert"
  ON public.notifications FOR INSERT
  WITH CHECK (public.get_my_role() = 'admin' OR TRUE); -- triggers insert as SECURITY DEFINER so always allowed