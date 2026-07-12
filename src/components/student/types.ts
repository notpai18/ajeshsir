/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared prop types for all student section components.
 * Extracted from StudentDashboardContent to enable per-section files.
 */

import React from 'react';
import type { ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement } from '../../types';

// ─── Common to every section ──────────────────────────────────────────────────
export interface SectionBaseProps {
  currentExamInfo: ExamInfo | undefined;
  selectedExam: string;
  availableSubjects: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSubject: string;
  setSelectedSubject: (s: string) => void;
}

// ─── Section-specific prop interfaces ─────────────────────────────────────────

export interface NotesSectionProps extends SectionBaseProps {
  filteredNotes: Note[];
  noteViewMode: 'grid' | 'list';
  setNoteViewMode: (m: 'grid' | 'list') => void;
  noteSort: 'recent' | 'popular' | 'alphabetical' | 'size';
  setNoteSort: (s: 'recent' | 'popular' | 'alphabetical' | 'size') => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (v: boolean) => void;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: (v: boolean) => void;
  sortDropdownRef: React.RefObject<HTMLDivElement>;
  searchInputRef: React.RefObject<HTMLInputElement>;
  studiedNotes: Set<string>;
  toggleStudied: (id: string) => void;
  setActivePdfViewer: (v: { title: string; fileUrl: string } | null) => void;
  handleDownloadFile: (noteId: string, fileName: string) => void;
  notes: Note[];
}

export interface VideosSectionProps extends SectionBaseProps {
  filteredVideos: Video[];
  setActiveVideoModal: (v: Video | null) => void;
}

export interface PYQSectionProps extends SectionBaseProps {
  filteredPyqs: PYQ[];
  selectedDifficulty: string;
  setSelectedDifficulty: (d: string) => void;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  setActivePdfViewer: (v: { title: string; fileUrl: string } | null) => void;
  triggerDownload: (fileName: string) => void;
}

export interface SheetsSectionProps extends SectionBaseProps {
  filteredSheets: PracticeSheet[];
  setActivePdfViewer: (v: { title: string; fileUrl: string } | null) => void;
  triggerDownload: (fileName: string) => void;
}

export interface DoubtsSectionProps {
  currentExamInfo: ExamInfo | undefined;
  faqs: FAQ[];
  doubts: Doubt[];
  notes: Note[];
  onAddDoubt: (doubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt'>) => Promise<void>;
}

export interface ResourcesSectionProps {
  currentExamInfo: ExamInfo | undefined;
  triggerDownload: (fileName: string) => void;
}
