import { colors } from '../theme/colors';
import { Course, DownloadItem, QoEMetrics } from './types';

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to Mobile App Development',
    instructor: 'Dr. A. Mbarga',
    category: 'Computer Engineering',
    description:
      'Learn to build cross-platform mobile applications, covering UI design, navigation, state management and offline-first patterns suited for low-bandwidth environments.',
    progress: 0.62,
    color: colors.navy,
    enrolledStudents: 184,
    modules: [
      {
        id: 'm1',
        title: 'Getting Started',
        lessons: [
          { id: 'l1', title: 'What is a mobile app?', durationMin: 8, completed: true },
          { id: 'l2', title: 'Setting up your environment', durationMin: 14, completed: true },
          { id: 'l3', title: 'Your first screen', durationMin: 17, completed: false },
        ],
      },
      {
        id: 'm2',
        title: 'Building UIs',
        lessons: [
          { id: 'l4', title: 'Layout & styling', durationMin: 20, completed: false },
          { id: 'l5', title: 'Navigation patterns', durationMin: 16, completed: false },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'Networks & Quality of Experience',
    instructor: 'Prof. N. Foncha',
    category: 'Telecommunications',
    description:
      'Understand bandwidth, latency and packet loss, and how adaptive streaming improves the learning experience on unstable mobile networks.',
    progress: 0.30,
    color: colors.navyLight,
    enrolledStudents: 142,
    modules: [
      {
        id: 'm3',
        title: 'Network Fundamentals',
        lessons: [
          { id: 'l6', title: 'Bandwidth vs latency', durationMin: 12, completed: true },
          { id: 'l7', title: 'Measuring packet loss', durationMin: 15, completed: false },
        ],
      },
      {
        id: 'm4',
        title: 'Adaptive Delivery',
        lessons: [
          { id: 'l8', title: 'HD / SD / Audio / Text modes', durationMin: 18, completed: false },
          { id: 'l9', title: 'QoE-driven switching', durationMin: 22, completed: false },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'Database Systems with Firebase',
    instructor: 'Dr. E. Tabe',
    category: 'Software Engineering',
    description:
      'Design realtime data models, secure access rules and offline persistence using Firebase for resilient mobile applications.',
    progress: 0.0,
    color: colors.accent,
    enrolledStudents: 97,
    modules: [
      {
        id: 'm5',
        title: 'Realtime Data',
        lessons: [
          { id: 'l10', title: 'Collections & documents', durationMin: 13, completed: false },
          { id: 'l11', title: 'Offline sync', durationMin: 19, completed: false },
        ],
      },
    ],
  },
];

export const downloads: DownloadItem[] = [
  { id: 'd1', title: 'Lecture 3 - Your first screen', type: 'Lecture', sizeMb: 42.5, course: 'Mobile App Development' },
  { id: 'd2', title: 'Networks - Slides (PDF)', type: 'PDF', sizeMb: 3.1, course: 'Networks & QoE' },
  { id: 'd3', title: 'Adaptive delivery - Notes', type: 'Notes', sizeMb: 0.8, course: 'Networks & QoE' },
  { id: 'd4', title: 'Firebase intro - Audio', type: 'Audio', sizeMb: 9.4, course: 'Database Systems' },
];

export const defaultQoE: QoEMetrics = {
  quality: 'moderate',
  bandwidthMbps: 1.2,
  latencyMs: 120,
  packetLossPct: 3,
  connectionType: '3G / HSPA+',
};

export const qoePresets: Record<string, QoEMetrics> = {
  good: { quality: 'good', bandwidthMbps: 8.4, latencyMs: 35, packetLossPct: 0.2, connectionType: '4G LTE' },
  moderate: { quality: 'moderate', bandwidthMbps: 1.2, latencyMs: 120, packetLossPct: 3, connectionType: '3G / HSPA+' },
  poor: { quality: 'poor', bandwidthMbps: 0.18, latencyMs: 480, packetLossPct: 14, connectionType: '2G / EDGE' },
};
