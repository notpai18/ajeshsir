/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ExamType = 'jee-main' | 'jee-advanced' | 'neet' | 'net' | 'msc-entrance';

export interface ExamInfo {
  id: ExamType;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface Note {
  id: string;
  course: ExamType;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  downloadCount: number;
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

export interface Doubt {
  id: string;
  name: string;
  email: string;
  subject: string;
  question: string;
  attachmentName?: string;
  answerText?: string;
  isAnswered: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
