-- ============================================================
-- EduStream — Analytics Views
-- Migration: 05_analytics_views.sql
-- ============================================================

-- ── Active users in last 24 h (via QoE logs) ─────────────────
CREATE OR REPLACE VIEW public.v_active_users_24h AS
SELECT COUNT(DISTINCT user_id) AS active_users
FROM public.qoe_logs
WHERE timestamp >= NOW() - INTERVAL '24 hours';

-- ── Course completion rates ───────────────────────────────────
CREATE OR REPLACE VIEW public.v_course_completion AS
SELECT
  c.id                                      AS course_id,
  c.title,
  COUNT(e.id)                               AS total_enrolled,
  COUNT(e.id) FILTER (WHERE e.progress = 100) AS completed,
  ROUND(
    COUNT(e.id) FILTER (WHERE e.progress = 100)::NUMERIC
    / NULLIF(COUNT(e.id), 0) * 100, 2
  )                                          AS completion_rate_pct
FROM public.courses c
LEFT JOIN public.enrollments e ON e.course_id = c.id
GROUP BY c.id, c.title;

-- ── Average QoE metrics ───────────────────────────────────────
CREATE OR REPLACE VIEW public.v_avg_qoe AS
SELECT
  ROUND(AVG(bandwidth)::NUMERIC, 2)    AS avg_bandwidth_kbps,
  ROUND(AVG(latency)::NUMERIC, 2)      AS avg_latency_ms,
  ROUND(AVG(packet_loss)::NUMERIC, 4)  AS avg_packet_loss_pct
FROM public.qoe_logs
WHERE timestamp >= NOW() - INTERVAL '7 days';

-- ── Playback mode distribution ────────────────────────────────
CREATE OR REPLACE VIEW public.v_mode_distribution AS
SELECT
  selected_mode,
  COUNT(*)                                       AS event_count,
  ROUND(COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER () * 100, 2) AS pct
FROM public.qoe_logs
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY selected_mode
ORDER BY event_count DESC;

-- ── Enrollment counts per course ─────────────────────────────
CREATE OR REPLACE VIEW public.v_enrollment_counts AS
SELECT
  c.id, c.title, c.category,
  COUNT(e.id) AS enrollment_count
FROM public.courses c
LEFT JOIN public.enrollments e ON e.course_id = c.id
GROUP BY c.id, c.title, c.category
ORDER BY enrollment_count DESC;

-- ── Quiz performance per course ───────────────────────────────
CREATE OR REPLACE VIEW public.v_quiz_performance AS
SELECT
  c.id AS course_id,
  c.title AS course_title,
  q.id AS quiz_id,
  q.title AS quiz_title,
  q.total_marks,
  COUNT(qa.id)                         AS total_attempts,
  ROUND(AVG(qa.score)::NUMERIC, 2)     AS avg_score,
  ROUND(MAX(qa.score)::NUMERIC, 2)     AS highest_score,
  ROUND(MIN(qa.score)::NUMERIC, 2)     AS lowest_score
FROM public.courses c
JOIN public.quizzes q ON q.course_id = c.id
LEFT JOIN public.quiz_attempts qa ON qa.quiz_id = q.id
GROUP BY c.id, c.title, q.id, q.title, q.total_marks;

-- ── Assignment submission rates ───────────────────────────────
CREATE OR REPLACE VIEW public.v_assignment_submissions AS
SELECT
  a.id AS assignment_id,
  a.title,
  a.due_date,
  c.title AS course_title,
  COUNT(e.student_id)                        AS total_enrolled,
  COUNT(s.id)                                AS submitted,
  ROUND(
    COUNT(s.id)::NUMERIC / NULLIF(COUNT(e.student_id), 0) * 100, 2
  )                                           AS submission_rate_pct
FROM public.assignments a
JOIN public.courses c ON c.id = a.course_id
LEFT JOIN public.enrollments e ON e.course_id = c.id
LEFT JOIN public.submissions s ON s.assignment_id = a.id
GROUP BY a.id, a.title, a.due_date, c.title;