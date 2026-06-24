-- ============================================================
-- EduStream — Supabase PostgreSQL Schema
-- Migration: 01_schema.sql
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Enable required extensions ────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT UNIQUE NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  avatar_url    TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Auto-create profile on signup ─────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT,
  thumbnail_url   TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status     ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category   ON public.courses(category);

-- ============================================================
-- 3. LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  content_type  TEXT NOT NULL DEFAULT 'video' CHECK (content_type IN ('video', 'audio', 'text', 'mixed')),
  video_url     TEXT,
  audio_url     TEXT,
  notes_url     TEXT,
  duration      INTEGER,   -- seconds
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.lessons(course_id);

-- ============================================================
-- 4. ENROLLMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress      NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course  ON public.enrollments(course_id);

-- ============================================================
-- 5. QUIZZES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quizzes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  total_marks   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_course ON public.quizzes(course_id);

-- ============================================================
-- 6. QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id         UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question        TEXT NOT NULL,
  option_a        TEXT NOT NULL,
  option_b        TEXT NOT NULL,
  option_c        TEXT NOT NULL,
  option_d        TEXT NOT NULL,
  correct_answer  TEXT NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
  marks           INTEGER NOT NULL DEFAULT 1,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_questions_quiz ON public.questions(quiz_id);

-- ============================================================
-- 7. QUIZ ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id       UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score         NUMERIC(6,2) NOT NULL DEFAULT 0,
  answers       JSONB,   -- {question_id: chosen_answer, …}
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_quiz    ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON public.quiz_attempts(student_id);

-- ============================================================
-- 8. ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  due_date      TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_course ON public.assignments(course_id);

-- ============================================================
-- 9. SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id   UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url        TEXT,
  grade           NUMERIC(5,2),
  feedback        TEXT,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student    ON public.submissions(student_id);

-- ============================================================
-- 10. LIVE CLASSES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.live_classes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id       UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title           TEXT,
  meeting_link    TEXT NOT NULL,
  scheduled_time  TIMESTAMPTZ NOT NULL,
  duration_mins   INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_classes_course ON public.live_classes(course_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_time   ON public.live_classes(scheduled_time);

-- ============================================================
-- 11. DOWNLOADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.downloads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id       UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  downloaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_downloads_user   ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_lesson ON public.downloads(lesson_id);

-- ============================================================
-- 12. QOE LOGS  (adaptive streaming events)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.qoe_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id       UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  bandwidth       NUMERIC(10,2),   -- kbps
  latency         NUMERIC(8,2),    -- ms
  packet_loss     NUMERIC(5,2),    -- %
  selected_mode   TEXT NOT NULL CHECK (selected_mode IN ('hd_video', 'sd_video', 'audio_only', 'text')),
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qoe_user      ON public.qoe_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_qoe_timestamp ON public.qoe_logs(timestamp DESC);

-- ============================================================
-- 13. RECOMMENDATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recommendations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id             UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  recommendation_score  NUMERIC(5,4) NOT NULL DEFAULT 0 CHECK (recommendation_score >= 0 AND recommendation_score <= 1),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user  ON public.recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_score ON public.recommendations(recommendation_score DESC);

-- ============================================================
-- 14. MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message       TEXT NOT NULL,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender   ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at  ON public.messages(sent_at DESC);

-- ============================================================
-- 15. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT,
  type        TEXT CHECK (type IN ('assignment', 'live_class', 'enrollment', 'quiz', 'system')),
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user    ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread  ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================================
-- HELPER: auto-notify on enrollment
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_on_enrollment()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  course_title TEXT;
BEGIN
  SELECT title INTO course_title FROM public.courses WHERE id = NEW.course_id;
  INSERT INTO public.notifications (user_id, title, body, type)
  VALUES (
    NEW.student_id,
    'Enrollment Confirmed',
    'You have been enrolled in ' || course_title,
    'enrollment'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_enrollment_created ON public.enrollments;
CREATE TRIGGER on_enrollment_created
  AFTER INSERT ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_enrollment();

-- ============================================================
-- HELPER: auto-notify on new assignment
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_on_assignment()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, body, type)
  SELECT e.student_id,
         'New Assignment: ' || NEW.title,
         'A new assignment has been posted in your course.',
         'assignment'
  FROM public.enrollments e
  WHERE e.course_id = NEW.course_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_assignment_created ON public.assignments;
CREATE TRIGGER on_assignment_created
  AFTER INSERT ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_assignment();

-- ============================================================
-- HELPER: auto-notify on new live class
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_on_live_class()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, body, type)
  SELECT e.student_id,
         'Live Class: ' || COALESCE(NEW.title, 'Upcoming Session'),
         'A live class is scheduled for ' || TO_CHAR(NEW.scheduled_time, 'Mon DD, YYYY HH12:MI AM'),
         'live_class'
  FROM public.enrollments e
  WHERE e.course_id = NEW.course_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_live_class_created ON public.live_classes;
CREATE TRIGGER on_live_class_created
  AFTER INSERT ON public.live_classes
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_live_class();