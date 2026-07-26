/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement } from './types';
import { SUBJECTS } from './constants/subjects';

export const EXAMS: ExamInfo[] = [
  {
    id: 'jee-main',
    title: 'JEE Main',
    description: 'Comprehensive resources for JEE Main Physical & Organic Chemistry, including concept sheets and mock drills.',
    icon: 'Atom',
    heroTitle: 'JEE Main Chemistry Notes',
    heroDescription: 'Access chapter-wise Chemistry notes for JEE Main covering Physical, Organic and Inorganic Chemistry with formula sheets, NCERT concepts and previous year important topics.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '145', label: 'Notes' },
      { icon: 'Library', value: '18', label: 'Chapters' },
      { icon: 'FileText', value: '42', label: 'Formula Sheets' },
      { icon: 'Target', value: '650+', label: 'PYQs' }
    ]
  },
  {
    id: 'jee-advanced',
    title: 'JEE Advanced',
    description: 'Advanced-level problem-solving notes, multi-concept derivation guides, and deep-dive lectures.',
    icon: 'FlaskConical',
    heroTitle: 'JEE Advanced Chemistry Notes',
    heroDescription: 'Advanced conceptual notes with derivations, multi-concept problems, mechanisms, shortcut techniques and high-level practice for IIT-JEE Advanced.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '82', label: 'Notes' },
      { icon: 'Library', value: '16', label: 'Chapters' },
      { icon: 'FileText', value: '31', label: 'Formula Sheets' },
      { icon: 'Target', value: '980+', label: 'Advanced Problems' }
    ]
  },
  {
    id: 'neet',
    title: 'NEET Chemistry',
    description: 'Conceptual theory notes, formula sheets, and speed-accuracy practice booklets specialized for medical aspirants.',
    icon: 'Stethoscope',
    heroTitle: 'NEET Chemistry Notes',
    heroDescription: 'NCERT-focused Chemistry notes for NEET with concise theory, important reactions, diagrams, formula sheets and one-liners.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '96', label: 'Notes' },
      { icon: 'Library', value: '15', label: 'Chapters' },
      { icon: 'FileText', value: '35', label: 'NCERT Summaries' },
      { icon: 'Target', value: '520+', label: 'PYQs' }
    ]
  },
  {
    id: 'net',
    title: 'CSIR NET',
    description: 'Postgraduate-level quantum chemistry, thermodynamics, and molecular spectroscopy resources.',
    icon: 'Hexagon',
    heroTitle: 'CSIR NET Chemistry Notes',
    heroDescription: 'Postgraduate Chemistry notes for CSIR NET covering advanced Physical, Organic, Inorganic and Analytical Chemistry.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '58', label: 'Notes' },
      { icon: 'Library', value: '12', label: 'Modules' },
      { icon: 'FileText', value: '24', label: 'Spectroscopy Sheets' },
      { icon: 'Target', value: '420', label: 'Practice Problems' }
    ]
  },
  {
    id: 'msc-entrance',
    title: 'M.Sc Entrance',
    description: 'Unified syllabus notes for IIT JAM, TIFR, and central university entrance tests in physical sciences.',
    icon: 'GraduationCap',
    heroTitle: 'M.Sc Chemistry Entrance Notes',
    heroDescription: 'Comprehensive Chemistry notes for IIT JAM, CUET PG, TIFR, BHU, CUSAT and other M.Sc entrance examinations.',
    themeGradient: 'from-[#4A0E1B] to-[#2D0810]',
    filters: ['All', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry'],
    quickStats: [
      { icon: 'BookOpen', value: '74', label: 'Notes' },
      { icon: 'Library', value: '14', label: 'Chapters' },
      { icon: 'FileText', value: '28', label: 'Formula Sheets' },
      { icon: 'Target', value: '710', label: 'Previous Questions' }
    ]
  }
];

// Re-export for convenience
export { SUBJECTS };

export const INITIAL_NOTES: Note[] = [];
export const INITIAL_VIDEOS: Video[] = [];
export const INITIAL_PYQS: PYQ[] = [];
export const INITIAL_PRACTICE_SHEETS: PracticeSheet[] = [];
export const INITIAL_DOUBTS: Doubt[] = [];
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];
export const INITIAL_FAQS: FAQ[] = [];
