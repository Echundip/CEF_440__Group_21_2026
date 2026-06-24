-- ============================================================
-- EduStream — Seed Data
-- Migration: 04_seed.sql
-- !! Run AFTER schema + RLS migrations !!
-- !! Create auth users first via Dashboard or Auth API !!
-- ============================================================
-- STEP 1: Go to Supabase → Authentication → Users → Add User
--   Create these emails with any password (e.g. "password123"):
--     admin@edustream.edu
--     instructor1@edustream.edu
--     instructor2@edustream.edu
--     student1@edustream.edu
--     student2@edustream.edu
-- STEP 2: Copy their UUIDs and replace the placeholders below.
-- ============================================================

-- ── 1. Update profiles with roles & names ─────────────────────
-- Replace each <UUID_...> with the actual UUID from Auth → Users

UPDATE public.profiles SET full_name = 'Admin User',       role = 'admin'      WHERE email = 'admin@edustream.edu';
UPDATE public.profiles SET full_name = 'Dr. Makane',       role = 'instructor' WHERE email = 'instructor1@edustream.edu';
UPDATE public.profiles SET full_name = 'Dr. Fortunee',     role = 'instructor' WHERE email = 'instructor2@edustream.edu';
UPDATE public.profiles SET full_name = 'Student One',      role = 'student'    WHERE email = 'student1@edustream.edu';
UPDATE public.profiles SET full_name = 'Student Two',      role = 'student'    WHERE email = 'student2@edustream.edu';

-- ── 2. Courses ────────────────────────────────────────────────
-- Uses sub-selects so you don't need to hardcode UUIDs here
INSERT INTO public.courses (instructor_id, title, description, category, status)
VALUES
  (
    (SELECT id FROM public.profiles WHERE email = 'instructor1@edustream.edu'),
    'Mobile Application Development',
    'Build cross-platform mobile apps using React Native and Expo from the ground up.',
    'Computer Science',
    'published'
  ),
  (
    (SELECT id FROM public.profiles WHERE email = 'instructor2@edustream.edu'),
    'Intro to Machine Learning',
    'Practical ML with Python: regression, classification, and neural networks.',
    'Engineering',
    'published'
  ),
  (
    (SELECT id FROM public.profiles WHERE email = 'instructor1@edustream.edu'),
    'Organic Chemistry II',
    'Advanced organic reactions, mechanisms, and laboratory techniques.',
    'Sciences',
    'published'
  ),
  (
    (SELECT id FROM public.profiles WHERE email = 'instructor2@edustream.edu'),
    'Constitutional Law',
    'Foundations of constitutional interpretation and landmark case studies.',
    'Law',
    'published'
  ),
  (
    (SELECT id FROM public.profiles WHERE email = 'instructor1@edustream.edu'),
    'Advanced Calculus',
    'Multivariable calculus, vector analysis, and series convergence.',
    'Mathematics',
    'draft'
  );

-- ── 3. Lessons ────────────────────────────────────────────────
INSERT INTO public.lessons (course_id, title, content_type, video_url, audio_url, notes_url, duration, sort_order)
SELECT
  c.id,
  'Introduction & Setup',
  'mixed',
  'https://storage.example.com/course-videos/' || c.id || '/lesson1.mp4',
  'https://storage.example.com/course-audio/' || c.id || '/lesson1.mp3',
  'https://storage.example.com/course-notes/' || c.id || '/lesson1.pdf',
  1800,
  1
FROM public.courses c WHERE c.title = 'Mobile Application Development';

INSERT INTO public.lessons (course_id, title, content_type, video_url, audio_url, notes_url, duration, sort_order)
SELECT
  c.id,
  'Navigation & Routing',
  'video',
  'https://storage.example.com/course-videos/' || c.id || '/lesson2.mp4',
  NULL,
  'https://storage.example.com/course-notes/' || c.id || '/lesson2.pdf',
  2400,
  2
FROM public.courses c WHERE c.title = 'Mobile Application Development';

INSERT INTO public.lessons (course_id, title, content_type, video_url, audio_url, notes_url, duration, sort_order)
SELECT
  c.id,
  'Supervised Learning Fundamentals',
  'mixed',
  'https://storage.example.com/course-videos/' || c.id || '/lesson1.mp4',
  'https://storage.example.com/course-audio/' || c.id || '/lesson1.mp3',
  'https://storage.example.com/course-notes/' || c.id || '/lesson1.pdf',
  3000,
  1
FROM public.courses c WHERE c.title = 'Intro to Machine Learning';

-- ── 4. Enrollments ────────────────────────────────────────────
INSERT INTO public.enrollments (student_id, course_id, progress)
SELECT
  (SELECT id FROM public.profiles WHERE email = 'student1@edustream.edu'),
  c.id,
  CASE c.title
    WHEN 'Mobile Application Development' THEN 65.0
    WHEN 'Intro to Machine Learning'       THEN 30.0
    ELSE 0
  END
FROM public.courses c
WHERE c.title IN ('Mobile Application Development', 'Intro to Machine Learning', 'Organic Chemistry II')
ON CONFLICT DO NOTHING;

INSERT INTO public.enrollments (student_id, course_id, progress)
SELECT
  (SELECT id FROM public.profiles WHERE email = 'student2@edustream.edu'),
  c.id,
  CASE c.title
    WHEN 'Constitutional Law' THEN 80.0
    ELSE 10.0
  END
FROM public.courses c
WHERE c.title IN ('Constitutional Law', 'Intro to Machine Learning')
ON CONFLICT DO NOTHING;

-- ── 5. Quiz + Questions ───────────────────────────────────────
INSERT INTO public.quizzes (course_id, title, total_marks)
SELECT id, 'React Native Basics Quiz', 10
FROM public.courses WHERE title = 'Mobile Application Development';

INSERT INTO public.questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, marks, sort_order)
SELECT
  q.id,
  'What command initialises a new Expo project?',
  'expo init my-app',
  'npx create-expo-app my-app',
  'react-native init my-app',
  'npm start my-app',
  'b',
  2,
  1
FROM public.quizzes q
JOIN public.courses c ON c.id = q.course_id
WHERE c.title = 'Mobile Application Development';

INSERT INTO public.questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, marks, sort_order)
SELECT
  q.id,
  'Which component replaces a <div> in React Native?',
  'Section',
  'Container',
  'View',
  'Box',
  'c',
  2,
  2
FROM public.quizzes q
JOIN public.courses c ON c.id = q.course_id
WHERE c.title = 'Mobile Application Development';

-- ── 6. Assignment ─────────────────────────────────────────────
INSERT INTO public.assignments (course_id, title, description, due_date)
SELECT
  id,
  'Build a To-Do App',
  'Create a working To-Do application using React Native with AsyncStorage persistence.',
  NOW() + INTERVAL '14 days'
FROM public.courses WHERE title = 'Mobile Application Development';

-- ── 7. Live Class ─────────────────────────────────────────────
INSERT INTO public.live_classes (course_id, title, meeting_link, scheduled_time, duration_mins)
SELECT
  id,
  'Q&A Session — Week 3',
  'https://meet.google.com/abc-defg-hij',
  NOW() + INTERVAL '3 days',
  60
FROM public.courses WHERE title = 'Mobile Application Development';

-- ── 8. QoE Log samples ────────────────────────────────────────
INSERT INTO public.qoe_logs (user_id, bandwidth, latency, packet_loss, selected_mode)
SELECT
  (SELECT id FROM public.profiles WHERE email = 'student1@edustream.edu'),
  unnest(ARRAY[12000, 800, 3500, 500]) AS bandwidth,
  unnest(ARRAY[45, 220, 80, 950])      AS latency,
  unnest(ARRAY[0.1, 2.5, 0.8, 8.2])   AS packet_loss,
  unnest(ARRAY['hd_video', 'sd_video', 'sd_video', 'audio_only']::TEXT[]) AS selected_mode;

-- ── 9. Recommendations ────────────────────────────────────────
INSERT INTO public.recommendations (user_id, course_id, recommendation_score)
SELECT
  (SELECT id FROM public.profiles WHERE email = 'student1@edustream.edu'),
  c.id,
  CASE c.title
    WHEN 'Advanced Calculus'          THEN 0.91
    WHEN 'Constitutional Law'         THEN 0.74
    ELSE 0.55
  END
FROM public.courses c
WHERE c.title IN ('Advanced Calculus', 'Constitutional Law', 'Intro to Machine Learning')
ON CONFLICT DO NOTHING;

-- ── 10. Messages ──────────────────────────────────────────────
INSERT INTO public.messages (sender_id, receiver_id, message)
VALUES (
  (SELECT id FROM public.profiles WHERE email = 'student1@edustream.edu'),
  (SELECT id FROM public.profiles WHERE email = 'instructor1@edustream.edu'),
  'Hello Dr. Makane, I had a question about the navigation assignment.'
),
(
  (SELECT id FROM public.profiles WHERE email = 'instructor1@edustream.edu'),
  (SELECT id FROM public.profiles WHERE email = 'student1@edustream.edu'),
  'Hi! Of course — please go ahead and ask.'
);