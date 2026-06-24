export type Role = 'student' | 'instructor'| 'admin';

export type DeliveryMode = 'video-hd' | 'video-sd' | 'audio' | 'text';

export type NetworkQuality = 'good' | 'moderate' | 'poor';

export interface QoEMetrics {
  quality: NetworkQuality;
  bandwidthMbps: number;
  latencyMs: number;
  packetLossPct: number;
  connectionType: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMin: number;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  description: string;
  progress: number; // 0..1
  color: string;
  modules: Module[];
  enrolledStudents: number;
}

export interface DownloadItem {
  id: string;
  title: string;
  type: 'PDF' | 'Notes' | 'Lecture' | 'Audio';
  sizeMb: number;
  course: string;
}
