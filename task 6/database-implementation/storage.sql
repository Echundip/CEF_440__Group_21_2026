-- ============================================================
-- EduStream — Supabase Storage Configuration
-- Migration: 03_storage.sql
-- ============================================================
-- NOTE: Bucket creation is best done via the Supabase Dashboard
-- (Storage → New Bucket) or the Management API.
-- The policies below must be run in the SQL Editor.
-- ============================================================

-- ── Create buckets via SQL (Supabase ≥ v2.x) ─────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('profile-images',  'profile-images',  TRUE,  5242880,   ARRAY['image/jpeg','image/png','image/webp']),
  ('thumbnails',      'thumbnails',      TRUE,  5242880,   ARRAY['image/jpeg','image/png','image/webp']),
  ('course-videos',   'course-videos',   FALSE, 2147483648, ARRAY['video/mp4','video/webm','video/quicktime']),
  ('course-audio',    'course-audio',    FALSE, 524288000,  ARRAY['audio/mpeg','audio/mp4','audio/ogg','audio/wav']),
  ('course-notes',    'course-notes',    FALSE, 52428800,   ARRAY['application/pdf','text/plain']),
  ('assignments',     'assignments',     FALSE, 104857600,  ARRAY['application/pdf','image/jpeg','image/png','application/zip'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE RLS POLICIES
-- ============================================================

-- ── profile-images (public read, own write) ───────────────────
CREATE POLICY "profile_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "profile_images_own_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "profile_images_own_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "profile_images_own_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- ── thumbnails (public read, instructor write) ────────────────
CREATE POLICY "thumbnails_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');

CREATE POLICY "thumbnails_instructor_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'thumbnails'
    AND (
      public.get_my_role() IN ('instructor', 'admin')
      AND auth.uid()::TEXT = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "thumbnails_instructor_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'thumbnails'
    AND (
      public.get_my_role() IN ('instructor', 'admin')
      AND auth.uid()::TEXT = (storage.foldername(name))[1]
    )
  );

-- ── course-videos (enrolled read, instructor write) ───────────
CREATE POLICY "course_videos_enrolled_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'course-videos'
    AND (
      public.get_my_role() = 'admin'
      OR auth.uid()::TEXT = (storage.foldername(name))[1]  -- instructor owns folder
      OR EXISTS (
        SELECT 1 FROM public.enrollments e
        JOIN public.lessons l ON l.course_id = e.course_id
        WHERE e.student_id = auth.uid()
          AND l.video_url ILIKE '%' || name || '%'
      )
    )
  );

CREATE POLICY "course_videos_instructor_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-videos'
    AND public.get_my_role() IN ('instructor', 'admin')
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "course_videos_instructor_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-videos'
    AND (
      public.get_my_role() = 'admin'
      OR auth.uid()::TEXT = (storage.foldername(name))[1]
    )
  );

-- ── course-audio (same pattern as videos) ────────────────────
CREATE POLICY "course_audio_enrolled_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'course-audio'
    AND (
      public.get_my_role() = 'admin'
      OR auth.uid()::TEXT = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM public.enrollments e
        JOIN public.lessons l ON l.course_id = e.course_id
        WHERE e.student_id = auth.uid()
          AND l.audio_url ILIKE '%' || name || '%'
      )
    )
  );

CREATE POLICY "course_audio_instructor_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-audio'
    AND public.get_my_role() IN ('instructor', 'admin')
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- ── course-notes (same pattern) ───────────────────────────────
CREATE POLICY "course_notes_enrolled_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'course-notes'
    AND (
      public.get_my_role() = 'admin'
      OR auth.uid()::TEXT = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM public.enrollments e
        JOIN public.lessons l ON l.course_id = e.course_id
        WHERE e.student_id = auth.uid()
          AND l.notes_url ILIKE '%' || name || '%'
      )
    )
  );

CREATE POLICY "course_notes_instructor_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-notes'
    AND public.get_my_role() IN ('instructor', 'admin')
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- ── assignments (students upload, instructor/admin read all) ──
CREATE POLICY "assignments_student_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assignments'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "assignments_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'assignments'
    AND (
      auth.uid()::TEXT = (storage.foldername(name))[1]
      OR public.get_my_role() IN ('instructor', 'admin')
    )
  );