/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ExamType = 'jee-main' | 'jee-advanced' | 'neet' | 'net' | 'msc-entrance';

// Re-export SubjectType as the canonical subject type for the whole app
export type { SubjectType } from './constants/subjects';

export interface QuickStat {
  icon: string;
  value: string;
  label: string;
}

export interface ExamInfo {
  id: ExamType;
  title: string;
  description: string;
  icon: string; // lucide icon name
  heroTitle?: string;
  heroDescription?: string;
  themeGradient?: string;
  filters?: string[];
  quickStats?: QuickStat[];
}

export interface Note {
  id: string;
  course: ExamType;
  subject: string; // constrained to SubjectType at runtime via SUBJECTS constant
  chapter: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  downloadCount: number;
  tags?: string[];
  difficulty?: 'Easy' | 'Moderate' | 'Hard';
  year?: number;
  isAdvanced?: boolean;
}

export interface Video {
  id: string;
  course: ExamType;
  subject: string;
  chapter: string;
  title: string;
  youtubeLink: string;
  thumbnail: string;
  description: string;
  duration: string;
}

export interface PYQ {
  id: string;
  course: ExamType;
  subject: string;
  chapter: string;
  year: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionUrl: string;
  solutionUrl: string;
  questionSize: string;
  solutionSize: string;
}

export interface PracticeSheet {
  id: string;
  course: ExamType;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
}

export interface DoubtReply {
  id: string;
  doubt_id: string;
  professor_id: string;
  reply_text?: string;
  image_urls: string[];
  video_urls: string[];
  audio_urls: string[];
  attachment_urls: string[];
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  reply_order: number;
}

export interface Doubt {
  id: string;
  name: string;
  email: string;
  subject: string;
  question: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentDataUrl?: string;
  answerText?: string;
  isAnswered: boolean;
  createdAt: string;
  replies?: DoubtReply[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type AnnouncementCategory = 'general' | 'exam' | 'resource' | 'schedule';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  pinned: boolean;
  createdAt: string;
}
