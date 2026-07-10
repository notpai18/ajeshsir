/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared types for Professor Dashboard sections
 */

import type {
  ExamInfo,
  Note,
  Video,
  PYQ,
  PracticeSheet,
  Doubt,
  Announcement
} from '../../types';

export interface ProfessorDashboardSharedProps {
  exams: ExamInfo[];
  notes: Note[];
  videos: Video[];
  pyqs: PYQ[];
  practiceSheets: PracticeSheet[];
  doubts: Doubt[];
  announcements: Announcement[];
  onAddNote: (note: Omit<Note, 'id' | 'downloadCount'>) => void;
  onEditNote: (id: string, note: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onAddVideo: (video: Omit<Video, 'id'>) => void;
  onEditVideo: (id: string, video: Partial<Video>) => void;
  onDeleteVideo: (id: string) => void;
  onAddPyq: (pyq: Omit<PYQ, 'id' | 'questionSize' | 'solutionSize'>) => void;
  onEditPyq: (id: string, pyq: Partial<PYQ>) => void;
  onDeletePyq: (id: string) => void;
  onAddPracticeSheet: (sheet: Omit<PracticeSheet, 'id' | 'fileSize'>) => void;
  onEditPracticeSheet: (id: string, sheet: Partial<PracticeSheet>) => void;
  onDeletePracticeSheet: (id: string) => void;
  onReplyDoubt: (id: string, replyData: { reply_text?: string; image_urls?: string[]; video_urls?: string[]; audio_urls?: string[]; attachment_urls?: string[]; }) => void;
  onDeleteDoubt: (id: string) => void;
  onAddAnnouncement: (a: Omit<Announcement, 'id' | 'createdAt'>) => void;
  onEditAnnouncement: (id: string, a: Partial<Announcement>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onTogglePinAnnouncement: (id: string) => void;
}
