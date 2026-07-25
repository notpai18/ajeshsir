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
  originalFilename?: string;
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
  questionOriginalFilename?: string;
  solutionOriginalFilename?: string;
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
  originalFilename?: string;
}

/**
 * Moderation-aware status model for doubts.
 * Primary states (new moderation workflow):
 *   pending_approval → approved → answered
 *                    ↘ rejected
 * Legacy states kept for backward compatibility:
 *   submitted / awaiting / needs-followup
 */
export type DoubtStatus =
  // ── New moderation states ──
  | 'pending_approval'  // submitted by student, awaiting professor review
  | 'approved'          // professor approved; publicly visible
  | 'rejected'          // professor rejected; only visible to submitter
  | 'answered'          // approved + professor replied
  // ── Legacy states (backward compat) ──
  | 'submitted'         // old: just sent, not yet seen by professor
  | 'awaiting'          // old: seen by prof, no reply yet
  | 'needs-followup';   // old: student replied again after an answer

export interface DoubtReply {
  id: string;
  doubt_id: string;
  professor_id: string;  // 'student' when the student replies
  reply_text?: string;
  image_urls: string[];
  video_urls: string[];
  audio_urls: string[];
  attachment_urls: string[];
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  reply_order: number;
  attachment_names?: string[];
  image_names?: string[];
  video_names?: string[];
  audio_names?: string[];
}

export interface Doubt {
  id: string;
  name: string;
  email: string;
  subject: string;
  topic?: string;        // optional chapter/topic tag
  question: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentDataUrl?: string;
  answerText?: string;
  /** Legacy binary field — kept for backward compat, derive status from it */
  isAnswered: boolean;
  /** Explicit status — takes precedence over isAnswered when present */
  status?: DoubtStatus;
  createdAt: string;
  replies?: DoubtReply[];
  /** Moderation audit fields */
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
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
