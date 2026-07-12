/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Video as VideoIcon,
  FileSpreadsheet,
  ClipboardList,
  HelpCircle,
  Megaphone,
  Settings as SettingsIcon,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
  X,
  Search,
  Send,
  User,
  Pin,
  PinOff,
  Download,
  TrendingUp,
  ArrowRight,
  Inbox,
  Calendar,
  AlertTriangle,
  Check,
  CornerDownRight,
  RotateCcw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { PDFViewer } from './pdf/PDFViewer';
import type { PDFDocumentInfo } from './pdf/PDFContext';
import { FileUpload } from './FileUpload';
import { PremiumCard } from './PremiumCard';
import {
  ExamType,
  ExamInfo,
  Note,
  Video,
  PYQ,
  PracticeSheet,
  Doubt,
  Announcement,
  AnnouncementCategory
} from '../types';
import { extractYouTubeId, getYoutubeThumbnail, isValidYouTubeUrl } from '../lib/youtube';
import { SUBJECTS, SUBJECT_BADGE } from '../constants/subjects';

/* ------------------------------------------------------------------ *
 * Design tokens — a warm, light "professor's study" system built on
 * the chosen palette: Deep Maroon #4A0E1B · Charcoal #22201F · Sand #D9C2A2
 * ------------------------------------------------------------------ */
// CARD constant deprecated. We use PremiumCard component for visual consistency.
const INPUT = 'w-full rounded-input border border-[#22201F]/20 bg-white dark:bg-[#22201F] px-3.5 py-2.5 text-sm text-[#22201F] dark:text-[#F6F2EA] placeholder:text-[#8A7E6F] dark:placeholder:text-[#F6F2EA]/50 outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10';
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-btn bg-[#4A0E1B] hover:bg-[#7C2532] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-all shadow-soft-sm hover:-translate-y-0.5 duration-200 disabled:opacity-50';
const GHOST_BTN =
  'inline-flex items-center justify-center gap-2 rounded-btn border border-[#22201F]/20 bg-white dark:bg-[#22201F] px-4 py-2.5 text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA] transition-all hover:bg-[#F7F3EC] dark:bg-[#1A1817] hover:-translate-y-0.5 duration-200';
const ROW_BTN =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA]/80 transition-colors hover:bg-[#F7F3EC] dark:bg-[#1A1817] hover:text-[#4A0E1B]';
const ROW_BTN_DANGER =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#4A0E1B]/80 transition-colors hover:bg-[#4A0E1B]/8 hover:text-[#4A0E1B]';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#22201F] dark:text-[#F6F2EA]/60';

const EXAM_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'jee-main': { bg: 'bg-[#F4E7E5] dark:bg-[#38151A]', text: 'text-[#4A0E1B]', dot: 'bg-[#4A0E1B]' },
  'jee-advanced': { bg: 'bg-[#F4E2E5]', text: 'text-[#7C2532]', dot: 'bg-[#7C2532]' },
  neet: { bg: 'bg-[#F7EFD9] dark:bg-[#362A0D]', text: 'text-[#8A6A16]', dot: 'bg-[#C9A13B]' },
  net: { bg: 'bg-[#ECE7E0]', text: 'text-[#22201F] dark:text-[#F6F2EA]', dot: 'bg-[#22201F]' },
  'msc-entrance': { bg: 'bg-[#EFE7D8]', text: 'text-[#6E5A2E]', dot: 'bg-[#C4A87F]' }
};

const ANN_CAT: Record<AnnouncementCategory, { label: string; cls: string }> = {
  general: { label: 'General', cls: 'bg-[#EFE7D8] text-[#6E645A]' },
  exam: { label: 'Exam', cls: 'bg-[#F4E4E4] text-[#4A0E1B]' },
  resource: { label: 'Resource', cls: 'bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]' },
  schedule: { label: 'Schedule', cls: 'bg-[#F4E2E5] text-[#7C2532]' }
};

/* ------------------------------------------------------------------ *
 * Subject badge — single source of truth styling from SUBJECT_BADGE
 * ------------------------------------------------------------------ */
function SubjectBadge({ subject }: { subject: string }) {
  const s = SUBJECT_BADGE[subject as keyof typeof SUBJECT_BADGE];
  if (!s) return <span className="text-xs text-[#8A7E6F] dark:text-[#A89F91]">{subject}</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Small presentational helpers
 * ------------------------------------------------------------------ */
function ExamChip({ course, label }: { course: string; label: string }) {
  const s = EXAM_STYLES[course] ?? EXAM_STYLES['jee-main'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

function DifficultyChip({ level }: { level: 'Easy' | 'Medium' | 'Hard' }) {
  const map = {
    Easy: 'bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]',
    Medium: 'bg-[#F4E2E5] text-[#7C2532]',
    Hard: 'bg-[#F4E4E4] text-[#4A0E1B]'
  } as const;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${map[level]}`}>{level}</span>;
}

function StatCard({
  icon,
  label,
  value,
  sub
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <PremiumCard padding="medium">
      <div className="flex items-center justify-between">
        <PremiumCard.Category>{label}</PremiumCard.Category>
        <PremiumCard.Icon className="h-10 w-10 rounded-full">{icon}</PremiumCard.Icon>
      </div>
      <p className="mt-4 text-3xl font-bold leading-none tabular-nums text-[#22201F] dark:text-[#F6F2EA]">{value}</p>
      {sub && <PremiumCard.Metadata className="mt-2 block">{sub}</PremiumCard.Metadata>}
    </PremiumCard>
  );
}

function Bar({
  label,
  sub,
  value,
  max,
  barClass = 'bg-[#4A0E1B]'
}: {
  label: string;
  sub: string;
  value: number;
  max: number;
  barClass?: string;
  key?: React.Key;
}) {
  const pct = max > 0 && value > 0 ? Math.max(5, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-semibold text-[#3A342E]">{label}</span>
        <span className="dash-mono shrink-0 text-xs tabular-nums text-[#8A7E6F] dark:text-[#A89F91]">{sub}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#F0E9DB]">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
  action
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] dark:bg-[#2A2726] px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]">{icon}</div>
      <h4 className="dash-serif mt-4 text-base font-semibold text-[#22201F] dark:text-[#F6F2EA]">{title}</h4>
      <p className="mt-1 max-w-sm text-sm text-[#8A7E6F] dark:text-[#A89F91]">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-[#22201F]/40 backdrop-blur-[2px]" />
      <div className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} overflow-hidden rounded-modal border border-[#22201F]/20 bg-white dark:bg-[#22201F] shadow-soft-xl`}>
        <div className="flex items-start justify-between gap-4 border-b border-[#22201F]/20 px-6 py-5">
          <div>
            <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-[#22201F] dark:text-[#F6F2EA]/60">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#22201F] dark:text-[#F6F2EA]/60 transition-colors hover:bg-[#F7F3EC] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA]">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[72vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A7E6F] dark:text-[#A89F91]">{label}</span>
      {children}
    </div>
  );
}

/* ─── YouTubeLinkField — smart URL input with live validation preview ───────── */
function YouTubeLinkField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [touched, setTouched] = React.useState(false);
  const [thumbError, setThumbError] = React.useState(false);

  const videoId = extractYouTubeId(value);
  const isValid = !!videoId;
  const showError = touched && value.length > 0 && !isValid;
  const showOk = touched && isValid;
  const thumbSrc = videoId ? getYoutubeThumbnail(videoId, 'maxresdefault') : null;

  return (
    <div className="block">
      <span className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A7E6F] dark:text-[#A89F91]">
        YouTube URL
        <span className="normal-case font-normal text-[#A79A88] tracking-normal">
          — supports all formats (watch, youtu.be, embed, shorts)
        </span>
      </span>
      <div className="relative">
        <input
          type="url"
          className={`w-full rounded-xl border bg-[#FBF7F0] dark:bg-[#2A2726] px-3.5 py-2.5 pr-10 text-sm text-[#22201F] dark:text-[#F6F2EA] placeholder:text-[#B3A996] outline-none transition ${
            showError
              ? 'border-[#B23B2E]/60 focus:border-[#B23B2E]/80 focus:ring-4 focus:ring-[#B23B2E]/10'
              : showOk
              ? 'border-[#8A6A16]/60 focus:border-[#8A6A16]/80 focus:ring-4 focus:ring-[#8A6A16]/10 bg-white dark:bg-[#22201F]'
              : 'border-[#E3D8C5] focus:border-[#4A0E1B]/50 focus:bg-white dark:bg-[#22201F] focus:ring-4 focus:ring-[#4A0E1B]/10'
          }`}
          required
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setThumbError(false);
          }}
          onBlur={() => setTouched(true)}
          placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
        />
        {showOk && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A6A16]">
            <CheckCircle2 size={16} />
          </span>
        )}
        {showError && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B23B2E]">
            <AlertCircle size={16} />
          </span>
        )}
      </div>

      {showError && (
        <p className="mt-1.5 text-[11px] text-[#B23B2E]">
          Couldn't extract a video ID from this URL. Please paste a valid YouTube link.
        </p>
      )}

      {showOk && thumbSrc && !thumbError && (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#F7EFD9] bg-[#FBF6EA] dark:bg-[#2A2726] p-3">
          <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-[#0f0f0f]">
            <img
              src={thumbSrc}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={() => setThumbError(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5 drop-shadow ml-0.5 opacity-90">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A6A16]">
              ✓ Valid YouTube URL
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-[#8A7E6F] dark:text-[#A89F91] break-all">
              Video ID: <span className="text-[#22201F] dark:text-[#F6F2EA] font-semibold">{videoId}</span>
            </p>
            <p className="mt-1 text-[10px] text-[#8A7E6F] dark:text-[#A89F91]">
              Thumbnail auto-generated · No manual upload needed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Props
 * ------------------------------------------------------------------ */
interface ProfessorDashboardProps {

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
  onMarkSeen?: (id: string) => Promise<void>;
  onAddAnnouncement: (a: Omit<Announcement, 'id' | 'createdAt'>) => void;
  onEditAnnouncement: (id: string, a: Partial<Announcement>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onTogglePinAnnouncement: (id: string) => void;
}

import { OverviewSection } from './professor/OverviewSection';
import { NotesSection } from './professor/NotesSection';
import { VideosSection } from './professor/VideosSection';
import { PYQSection } from './professor/PYQSection';
import { SheetsSection } from './professor/SheetsSection';
import { DoubtsSection } from './professor/DoubtsSection';
import { AnnouncementsSection } from './professor/AnnouncementsSection';
import { StatisticsSection } from './professor/StatisticsSection';
import { uploadFile } from '../services/storageService';
import { AnswerDoubtModal } from './doubts/AnswerDoubtModal';

type Tab = 'overview' | 'notes' | 'videos' | 'pyqs' | 'sheets' | 'doubts' | 'announcements' | 'statistics' | 'settings';
type ModalKind =
  | 'add-note'
  | 'edit-note'
  | 'add-video'
  | 'edit-video'
  | 'add-pyq'
  | 'edit-pyq'
  | 'add-sheet'
  | 'edit-sheet'
  | 'add-announcement'
  | 'edit-announcement'
  | null;

interface ConfirmState {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

const DEFAULT_PROFILE = {
  name: 'Ajesh Joe',
  role: 'Repository Editor',
  designation: 'Professor of Chemistry',
  office: 'Brilliant Study Centre Pala'
};

export default function ProfessorDashboard({
  exams,
  notes,
  videos,
  pyqs,
  practiceSheets,
  doubts,
  announcements,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onAddPyq,
  onEditPyq,
  onDeletePyq,
  onAddPracticeSheet,
  onEditPracticeSheet,
  onDeletePracticeSheet,
  onReplyDoubt,
  onDeleteDoubt,
  onMarkSeen,
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onTogglePinAnnouncement
}: ProfessorDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  // ─── PDF Viewer ─────────────────────────────────────────────────────────────
  const navigate = useNavigate();
  const openPDF = useCallback((info: PDFDocumentInfo) => {
    navigate(`/viewer/${encodeURIComponent(info.title)}`, { state: { url: info.fileUrl, name: info.title } });
  }, [navigate]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [pyqQuestionFile, setPyqQuestionFile] = useState<File | null>(null);
  const [pyqSolutionFile, setPyqSolutionFile] = useState<File | null>(null);
  const [sheetFile, setSheetFile] = useState<File | null>(null);


  // Profile / settings (persisted independently, self-contained)
  const [profile, setProfile] = useState(() => {
    try {
      const s = localStorage.getItem('prof_portal_settings_v1');
      return s ? { ...DEFAULT_PROFILE, ...JSON.parse(s) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('prof_portal_settings_v1', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Forms
  const [noteForm, setNoteForm] = useState({ course: 'jee-main' as ExamType, subject: 'Physical Chemistry', chapter: '', title: '', description: '', fileUrl: '', fileSize: '' });
  const [videoForm, setVideoForm] = useState({ course: 'jee-main' as ExamType, subject: 'Physical Chemistry', chapter: '', title: '', youtubeLink: '', description: '', duration: '' });
  const [pyqForm, setPyqForm] = useState({ course: 'jee-main' as ExamType, subject: 'Physical Chemistry', chapter: '', year: new Date().getFullYear() - 1, difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard', questionUrl: '', solutionUrl: '', questionSize: '', solutionSize: '' });
  const [sheetForm, setSheetForm] = useState({ course: 'jee-main' as ExamType, subject: 'Physical Chemistry', chapter: '', title: '', description: '', fileUrl: '', fileSize: '' });
  const [annForm, setAnnForm] = useState({ title: '', body: '', category: 'general' as AnnouncementCategory, pinned: false });

/* ---------------- Helpers ---------------- */
  const pendingDoubtsCount = doubts.filter((d) => !d.isAnswered).length;
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const today = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const initials = (name: string) =>
    name.replace(/prof\.?/i, '').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'AJ';

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItemId(null);
  };

  const askDelete = (what: string, onConfirm: () => void) =>
    setConfirm({
      title: `Delete ${what}?`,
      message: `This permanently removes it from your repository. Students will no longer see it. This can't be undone.`,
      confirmLabel: 'Delete',
      onConfirm
    });

  /* ---------------- Open helpers ---------------- */
  const openAddNote = () => {
    setNoteForm({ course: 'jee-main', subject: 'Physical Chemistry', chapter: '', title: '', description: '', fileUrl: '', fileSize: '' });
    setNoteFile(null);
    setActiveTab('notes');
    setActiveModal('add-note');
  };
  const openEditNote = (n: Note) => {
    setNoteForm({ course: n.course, subject: n.subject, chapter: n.chapter, title: n.title, description: n.description, fileUrl: n.fileUrl, fileSize: n.fileSize || '' });
    setNoteFile(null);
    setSelectedItemId(n.id);
    setActiveModal('edit-note');
  };
  const openAddVideo = () => {
    setVideoForm({ course: 'jee-main', subject: 'Physical Chemistry', chapter: '', title: '', youtubeLink: '', description: '', duration: '' });
    setActiveTab('videos');
    setActiveModal('add-video');
  };
  const openEditVideo = (v: Video) => {
    setVideoForm({ course: v.course, subject: v.subject, chapter: v.chapter, title: v.title, youtubeLink: v.youtubeLink, description: v.description, duration: v.duration });
    setSelectedItemId(v.id);
    setActiveModal('edit-video');
  };
  const openAddPyq = () => {
    setPyqForm({ course: 'jee-main', subject: 'Physical Chemistry', chapter: '', year: new Date().getFullYear() - 1, difficulty: 'Medium', questionUrl: '', solutionUrl: '', questionSize: '', solutionSize: '' });
    setPyqQuestionFile(null);
    setPyqSolutionFile(null);
    setActiveTab('pyqs');
    setActiveModal('add-pyq');
  };
  const openEditPyq = (p: PYQ) => {
    setPyqForm({ course: p.course, subject: p.subject, chapter: p.chapter, year: p.year, difficulty: p.difficulty, questionUrl: p.questionUrl, solutionUrl: p.solutionUrl, questionSize: p.questionSize || '', solutionSize: p.solutionSize || '' });
    setPyqQuestionFile(null);
    setPyqSolutionFile(null);
    setSelectedItemId(p.id);
    setActiveModal('edit-pyq');
  };
  const openAddSheet = () => {
    setSheetForm({ course: 'jee-main', subject: 'Physical Chemistry', chapter: '', title: '', description: '', fileUrl: '', fileSize: '' });
    setSheetFile(null);
    setActiveTab('sheets');
    setActiveModal('add-sheet');
  };
  const openEditSheet = (s: PracticeSheet) => {
    setSheetForm({ course: s.course, subject: s.subject, chapter: s.chapter, title: s.title, description: s.description, fileUrl: s.fileUrl, fileSize: s.fileSize || '' });
    setSheetFile(null);
    setSelectedItemId(s.id);
    setActiveModal('edit-sheet');
  };
  const openAddAnnouncement = () => {
    setAnnForm({ title: '', body: '', category: 'general', pinned: false });
    setActiveTab('announcements');
    setActiveModal('add-announcement');
  };
  const openEditAnnouncement = (a: Announcement) => {
    setAnnForm({ title: a.title, body: a.body, category: a.category, pinned: a.pinned });
    setSelectedItemId(a.id);
    setActiveModal('edit-announcement');
  };

  

  /* ---------------- Submit handlers ---------------- */
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalUrl = noteForm.fileUrl || 'uploaded_document.pdf';
      let finalSize = noteForm.fileSize || '2.5 MB';
      if (noteFile) {
        const res = await uploadFile(noteFile, 'notes-pdfs');
        finalUrl = res.url;
        finalSize = res.size;
      }
      if (activeModal === 'add-note') {
        onAddNote({ ...noteForm, fileUrl: finalUrl, fileSize: finalSize });
      } else if (selectedItemId) {
        onEditNote(selectedItemId, { ...noteForm, fileUrl: finalUrl, fileSize: finalSize });
      }
      closeModal();
    } catch (err: any) {
      console.error('Supabase Upload Error:', err);
      let errMsg = err.message || 'Unknown error occurred.';
      if (errMsg.includes('row-level security policy') || errMsg.includes('RLS')) errMsg = 'Storage policy rejected upload (Permission Denied).';
      else if (errMsg.includes('bucket not found') || errMsg.includes('Bucket not found')) errMsg = 'Bucket not found.';
      else if (errMsg.includes('already exists')) errMsg = 'File already exists.';
      else if (errMsg.includes('mime type') || errMsg.includes('content type')) errMsg = 'Invalid file type.';
      else if (errMsg.includes('size limit') || errMsg.includes('too large')) errMsg = 'File too large.';
      else if (errMsg.includes('JWT') || errMsg.includes('Auth')) errMsg = 'Authentication required.';
      alert(`Upload failed: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-generate thumbnail from the YouTube URL
    const videoId = extractYouTubeId(videoForm.youtubeLink);
    const autoThumbnail = videoId
      ? getYoutubeThumbnail(videoId, 'maxresdefault')
      : 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80';
    if (activeModal === 'add-video') {
      onAddVideo({
        ...videoForm,
        youtubeLink: videoForm.youtubeLink || 'https://youtube.com',
        thumbnail: autoThumbnail,
        duration: videoForm.duration || '45:00'
      });
    } else if (selectedItemId) {
      onEditVideo(selectedItemId, { ...videoForm, thumbnail: autoThumbnail });
    }
    closeModal();
  };
  const handlePyqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalQUrl = pyqForm.questionUrl || 'uploaded_pyq_question.pdf';
      let finalQSize = pyqForm.questionSize || '1.2 MB';
      if (pyqQuestionFile) {
        const res = await uploadFile(pyqQuestionFile, 'pyqs');
        finalQUrl = res.url;
        finalQSize = res.size;
      }
      let finalSUrl = pyqForm.solutionUrl || 'uploaded_pyq_solution.pdf';
      let finalSSize = pyqForm.solutionSize || '2.0 MB';
      if (pyqSolutionFile) {
        const res = await uploadFile(pyqSolutionFile, 'pyqs');
        finalSUrl = res.url;
        finalSSize = res.size;
      }
      if (activeModal === 'add-pyq') {
        onAddPyq({ ...pyqForm, year: Number(pyqForm.year), questionUrl: finalQUrl, solutionUrl: finalSUrl });
      } else if (selectedItemId) {
        onEditPyq(selectedItemId, { ...pyqForm, year: Number(pyqForm.year), questionUrl: finalQUrl, solutionUrl: finalSUrl, questionSize: finalQSize, solutionSize: finalSSize });
      }
      closeModal();
    } catch (err: any) {
      console.error('Supabase Upload Error:', err);
      let errMsg = err.message || 'Unknown error occurred.';
      if (errMsg.includes('row-level security policy') || errMsg.includes('RLS')) errMsg = 'Storage policy rejected upload (Permission Denied).';
      else if (errMsg.includes('bucket not found') || errMsg.includes('Bucket not found')) errMsg = 'Bucket not found.';
      else if (errMsg.includes('already exists')) errMsg = 'File already exists.';
      else if (errMsg.includes('mime type') || errMsg.includes('content type')) errMsg = 'Invalid file type.';
      else if (errMsg.includes('size limit') || errMsg.includes('too large')) errMsg = 'File too large.';
      else if (errMsg.includes('JWT') || errMsg.includes('Auth')) errMsg = 'Authentication required.';
      alert(`Upload failed: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSheetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalUrl = sheetForm.fileUrl || 'uploaded_practice_sheet.pdf';
      let finalSize = sheetForm.fileSize || '1.5 MB';
      if (sheetFile) {
        const res = await uploadFile(sheetFile, 'practice-sheets');
        finalUrl = res.url;
        finalSize = res.size;
      }
      if (activeModal === 'add-sheet') {
        onAddPracticeSheet({ ...sheetForm, fileUrl: finalUrl });
      } else if (selectedItemId) {
        onEditPracticeSheet(selectedItemId, { ...sheetForm, fileUrl: finalUrl, fileSize: finalSize });
      }
      closeModal();
    } catch (err: any) {
      console.error('Supabase Upload Error:', err);
      let errMsg = err.message || 'Unknown error occurred.';
      if (errMsg.includes('row-level security policy') || errMsg.includes('RLS')) errMsg = 'Storage policy rejected upload (Permission Denied).';
      else if (errMsg.includes('bucket not found') || errMsg.includes('Bucket not found')) errMsg = 'Bucket not found.';
      else if (errMsg.includes('already exists')) errMsg = 'File already exists.';
      else if (errMsg.includes('mime type') || errMsg.includes('content type')) errMsg = 'Invalid file type.';
      else if (errMsg.includes('size limit') || errMsg.includes('too large')) errMsg = 'File too large.';
      else if (errMsg.includes('JWT') || errMsg.includes('Auth')) errMsg = 'Authentication required.';
      alert(`Upload failed: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === 'add-announcement') {
      onAddAnnouncement(annForm);
    } else if (selectedItemId) {
      onEditAnnouncement(selectedItemId, annForm);
    }
    closeModal();
  };
const resetDemoData = () => {
    ['prof_portal_notes_v1', 'prof_portal_videos_v1', 'prof_portal_pyqs_v1', 'prof_portal_sheets_v1', 'prof_portal_doubts_v1', 'prof_portal_announcements_v1'].forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
    window.location.reload();
  };

  /* ---------------- Nav + page copy ---------------- */
  const NAV: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
    { id: 'notes', label: 'Study Notes', icon: <FileText size={17} /> },
    { id: 'videos', label: 'Video Lectures', icon: <VideoIcon size={17} /> },
    { id: 'pyqs', label: 'PYQ Library', icon: <FileSpreadsheet size={17} /> },
    { id: 'sheets', label: 'Practice Sheets', icon: <ClipboardList size={17} /> },
    { id: 'doubts', label: 'Student Doubts', icon: <HelpCircle size={17} />, badge: pendingDoubtsCount },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone size={17} /> },
    { id: 'statistics', label: 'Usage Statistics', icon: <TrendingUp size={17} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={17} /> }
  ];

  const pageTitle: Record<Tab, string> = {
    overview: `${greeting}, ${profile.name}`,
    notes: 'Study Notes',
    videos: 'Video Lectures',
    pyqs: 'PYQ Library',
    sheets: 'Practice Sheets',
    doubts: 'Student Doubts',
    announcements: 'Announcements',
    statistics: 'Usage Statistics',
    settings: 'Settings'
  };
  const pageSub: Record<Tab, string> = {
    overview: today,
    notes: 'Create, organise and update downloadable notes',
    videos: 'Curate the lecture library students learn from',
    pyqs: 'Previous-year questions with worked solutions',
    sheets: 'Targeted practice drills by chapter',
    doubts: 'Answer academic questions from students',
    announcements: 'Broadcast notices to everyone in the portal',
    statistics: 'Monitor student engagement and platform health',
    settings: 'Your profile and repository controls'
  };

  const quickAdd = [
    { label: 'Study note', icon: <FileText size={15} />, fn: openAddNote },
    { label: 'Video lecture', icon: <VideoIcon size={15} />, fn: openAddVideo },
    { label: 'PYQ booklet', icon: <FileSpreadsheet size={15} />, fn: openAddPyq },
    { label: 'Practice sheet', icon: <ClipboardList size={15} />, fn: openAddSheet },
    { label: 'Announcement', icon: <Megaphone size={15} />, fn: openAddAnnouncement }
  ];

  const examOptions = (
    <>
      <option value="all">All exams</option>
      {exams.map((e) => (
        <option key={e.id} value={e.id}>
          {e.title}
        </option>
      ))}
    </>
  );

  return (
    <div className="dash-root min-h-[85vh] bg-[#F7F3EC] dark:bg-[#1A1817] text-[#22201F] dark:text-[#F6F2EA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ============ TOP HEADER ============ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={MICRO}>Professor workspace</p>
            <h1 className="dash-serif mt-1 text-3xl font-semibold text-[#22201F] dark:text-[#F6F2EA] sm:text-[2rem]">{pageTitle[activeTab]}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#22201F] dark:text-[#F6F2EA]/60">
              {activeTab === 'overview' && <Calendar size={14} />}
              {pageSub[activeTab]}
            </p>
          </div>

          <div className="relative">
            <button className={PRIMARY_BTN} onClick={() => setQuickAddOpen((o) => !o)} id="quick-add-btn">
              <Plus size={15} /> Add resource <ChevronDown size={14} className={`transition-transform ${quickAddOpen ? 'rotate-180' : ''}`} />
            </button>
            {quickAddOpen && (
              <>
                <button className="fixed inset-0 z-40 cursor-default" aria-hidden onClick={() => setQuickAddOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#22201F]/20 bg-white dark:bg-[#22201F] p-1.5 shadow-soft-lg">
                  {quickAdd.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.fn();
                        setQuickAddOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] transition-colors hover:bg-[#F7F3EC] dark:bg-[#1A1817]"
                    >
                      <span className="text-[#8A6A16]">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <div className="grid gap-7 md:grid-cols-12">
          {/* ============ SIDEBAR ============ */}
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-24 lg:top-28">
              <PremiumCard padding="small">
                {/* Profile */}
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#4A0E1B]/8 to-[#C9A13B]/8 border border-[#22201F]/20 p-3">
                  {profile.name === 'Ajesh Joe' ? (
                    <img 
                      src="/ajesh-joe.png" 
                      alt="Ajesh Joe" 
                      className="h-11 w-11 shrink-0 rounded-xl object-cover object-top border border-[#4A0E1B]/20 dark:border-[#F6F2EA]/10 shadow-sm"
                    />
                  ) : (
                    <div className="dash-serif flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4A0E1B] text-base font-semibold text-[#D9C2A2]">
                      {initials(profile.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{profile.name}</h3>
                    <span className="text-[11px] font-medium text-[#22201F] dark:text-[#F6F2EA]/60">{profile.role}</span>
                  </div>
                </div>

                {/* Nav */}
                <nav className="space-y-0.5">
                  {NAV.map((item) => {
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        id={`sidebar-tab-${item.id}`}
                        className={`group relative flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                          active ? 'bg-[#4A0E1B]/8 text-[#4A0E1B]' : 'text-[#22201F] dark:text-[#F6F2EA]/80 hover:bg-[#F7F3EC] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA]'
                        }`}
                      >
                        {active && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#4A0E1B]" />}
                        <span className={active ? 'text-[#4A0E1B]' : 'text-[#4A0E1B]/60 group-hover:text-[#4A0E1B]'}>{item.icon}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                        {!!item.badge && item.badge > 0 && (
                          <span className="rounded-full bg-[#4A0E1B] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">{item.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </PremiumCard>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#22201F]/15 dark:border-[#F6F2EA]/10 bg-[#FBF7F0] dark:bg-[#2A2726] px-3.5 py-3 text-[11px] text-[#8A7E6F] dark:text-[#A89F91]">
                <Check size={14} className="text-[#8A6A16]" />
                Changes save automatically to this browser.
              </div>
            </div>
          </aside>

          {/* ============ MAIN ============ */}
          <main className="md:col-span-8 lg:col-span-9">
            
            {/* ---------- OVERVIEW ---------- */}
            {activeTab === 'overview' && (
              <OverviewSection 
                exams={exams} notes={notes} videos={videos} pyqs={pyqs} practiceSheets={practiceSheets} doubts={doubts}
                onNavigateToDoubt={(id) => { setActiveTab('doubts'); }} 
              />
            )}

            {/* ---------- NOTES ---------- */}
            {activeTab === 'notes' && (
              <NotesSection 
                exams={exams} notes={notes}
                openAddNote={openAddNote} openEditNote={openEditNote} askDelete={askDelete} onDeleteNote={onDeleteNote}
                openPDF={openPDF}
              />
            )}

            {/* ---------- VIDEOS ---------- */}
            {activeTab === 'videos' && (
              <VideosSection 
                exams={exams} videos={videos}
                openAddVideo={openAddVideo} openEditVideo={openEditVideo} askDelete={askDelete} onDeleteVideo={onDeleteVideo}
              />
            )}

            {/* ---------- PYQS ---------- */}
            {activeTab === 'pyqs' && (
              <PYQSection 
                exams={exams} pyqs={pyqs}
                openAddPyq={openAddPyq} openEditPyq={openEditPyq} askDelete={askDelete} onDeletePyq={onDeletePyq}
                openPDF={openPDF}
              />
            )}

            {/* ---------- SHEETS ---------- */}
            {activeTab === 'sheets' && (
              <SheetsSection 
                exams={exams} practiceSheets={practiceSheets}
                openAddSheet={openAddSheet} openEditSheet={openEditSheet} askDelete={askDelete} onDeletePracticeSheet={onDeletePracticeSheet}
                openPDF={openPDF}
              />
            )}

            {/* ---------- DOUBTS ---------- */}
            {activeTab === 'doubts' && (
              <DoubtsSection 
                doubts={doubts}
                askDelete={askDelete} onDeleteDoubt={onDeleteDoubt} onReplyDoubt={onReplyDoubt} onMarkSeen={onMarkSeen}
              />
            )}

            {/* ---------- ANNOUNCEMENTS ---------- */}
            {activeTab === 'announcements' && (
              <AnnouncementsSection 
                announcements={announcements}
                openAddAnnouncement={openAddAnnouncement} openEditAnnouncement={openEditAnnouncement}
                onTogglePinAnnouncement={onTogglePinAnnouncement} askDelete={askDelete} onDeleteAnnouncement={onDeleteAnnouncement}
              />
            )}

            {/* ---------- STATISTICS ---------- */}
            {activeTab === 'statistics' && (
              <StatisticsSection />
            )}

            {/* ---------- SETTINGS ---------- */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <PremiumCard padding="large" accentLine>
                  <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Profile</h3>
                  <p className="text-xs text-[#8A7E6F] dark:text-[#A89F91]">Shown across the professor workspace.</p>
                  <div className="mt-5 grid max-w-xl gap-4 sm:grid-cols-2">
                    <Field label="Display name">
                      <input className={INPUT} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </Field>
                    <Field label="Role label">
                      <input className={INPUT} value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
                    </Field>
                    <Field label="Designation">
                      <input className={INPUT} value={profile.designation} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} />
                    </Field>
                    <Field label="Office / office hours">
                      <input className={INPUT} value={profile.office} onChange={(e) => setProfile({ ...profile, office: e.target.value })} />
                    </Field>
                  </div>
                </PremiumCard>

                <PremiumCard padding="large" accentLine>
                  <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Data</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD]">
                    Notes, videos, PYQs, sheets, doubts and announcements are stored in this browser only. Resetting restores the original sample library.
                  </p>
                  <button
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E6C9C4] bg-[#FBF0EE] px-4 py-2.5 text-xs font-bold text-[#B23B2E] transition-colors hover:bg-[#F6E5E1]"
                    onClick={() =>
                      setConfirm({
                        title: 'Reset all content?',
                        message: 'This clears every note, video, PYQ, sheet, doubt and announcement in this browser and restores the sample data. This cannot be undone.',
                        confirmLabel: 'Reset everything',
                        onConfirm: resetDemoData
                      })
                    }
                  >
                    <RotateCcw size={14} /> Reset to sample data
                  </button>
                </PremiumCard>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============ MODALS ============ */}
      {(activeModal === 'add-note' || activeModal === 'edit-note') && (
        <Modal title={activeModal === 'add-note' ? 'Add study note' : 'Edit study note'} subtitle="Downloadable PDF shown in the student library" onClose={closeModal}>
          <form onSubmit={handleNoteSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Exam / course">
                <select className={INPUT} value={noteForm.course} onChange={(e) => setNoteForm({ ...noteForm, course: e.target.value as ExamType })}>
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </Field>
              <Field label="Subject">
                <select className={INPUT} required value={noteForm.subject} onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Chapter">
              <input className={INPUT} required value={noteForm.chapter} onChange={(e) => setNoteForm({ ...noteForm, chapter: e.target.value })} placeholder="e.g. Electrostatics" />
            </Field>
            <Field label="Document title">
              <input className={INPUT} required value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} placeholder="Gauss's Law Formulations" />
            </Field>
            <Field label="Short description">
              <textarea className={INPUT} required rows={3} value={noteForm.description} onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })} placeholder="A breakdown of electric fluxes and Gaussian integrations…" />
            </Field>
            <Field label="PDF Document">
              <FileUpload 
                value={noteFile || noteForm.fileUrl} 
                onFileSelect={(f) => setNoteFile(f)} 
                placeholder="Upload note PDF" 
              />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={GHOST_BTN} onClick={closeModal} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className={PRIMARY_BTN} disabled={isSubmitting}>{isSubmitting ? 'Uploading...' : (activeModal === 'add-note' ? 'Add note' : 'Save changes')}</button>
            </div>
          </form>
        </Modal>
      )}

      {(activeModal === 'add-video' || activeModal === 'edit-video') && (
        <Modal title={activeModal === 'add-video' ? 'Add video lecture' : 'Edit video lecture'} subtitle="Paste a YouTube URL — the player will embed directly in the student portal" onClose={closeModal}>
          <form onSubmit={handleVideoSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Exam / course">
                <select className={INPUT} value={videoForm.course} onChange={(e) => setVideoForm({ ...videoForm, course: e.target.value as ExamType })}>
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </Field>
              <Field label="Subject">
                <select className={INPUT} required value={videoForm.subject} onChange={(e) => setVideoForm({ ...videoForm, subject: e.target.value })}>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Chapter">
                <input className={INPUT} required value={videoForm.chapter} onChange={(e) => setVideoForm({ ...videoForm, chapter: e.target.value })} placeholder="e.g. Optics" />
              </Field>
              <Field label="Duration">
                <input className={INPUT} required value={videoForm.duration} onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })} placeholder="e.g. 45:12" />
              </Field>
            </div>
            <Field label="Lecture title">
              <input className={INPUT} required value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="Visualizing Gauss's Law" />
            </Field>

            {/* YouTube URL field with live validation and thumbnail preview */}
            <YouTubeLinkField
              value={videoForm.youtubeLink}
              onChange={(v) => setVideoForm({ ...videoForm, youtubeLink: v })}
            />

            <Field label="Description">
              <textarea className={INPUT} required rows={2} value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} placeholder="An intuitive, geometric lecture on…" />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={GHOST_BTN} onClick={closeModal}>Cancel</button>
              <button type="submit" className={PRIMARY_BTN}>{activeModal === 'add-video' ? 'Publish lecture' : 'Save changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {(activeModal === 'add-pyq' || activeModal === 'edit-pyq') && (
        <Modal title={activeModal === 'add-pyq' ? 'Add PYQ booklet' : 'Edit PYQ booklet'} subtitle="Previous-year questions with solutions" onClose={closeModal}>
          <form onSubmit={handlePyqSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Exam / course">
                <select className={INPUT} value={pyqForm.course} onChange={(e) => setPyqForm({ ...pyqForm, course: e.target.value as ExamType })}>
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </Field>
              <Field label="Subject">
                <select className={INPUT} required value={pyqForm.subject} onChange={(e) => setPyqForm({ ...pyqForm, subject: e.target.value })}>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Year">
                <input className={INPUT} type="number" required value={pyqForm.year} onChange={(e) => setPyqForm({ ...pyqForm, year: Number(e.target.value) })} />
              </Field>
              <Field label="Difficulty">
                <select className={INPUT} value={pyqForm.difficulty} onChange={(e) => setPyqForm({ ...pyqForm, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </Field>
            </div>
            <Field label="Chapter">
              <input className={INPUT} required value={pyqForm.chapter} onChange={(e) => setPyqForm({ ...pyqForm, chapter: e.target.value })} placeholder="e.g. Rotational Dynamics" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Question PDF">
                <FileUpload 
                  value={pyqQuestionFile || pyqForm.questionUrl} 
                  onFileSelect={(f) => setPyqQuestionFile(f)} 
                  placeholder="Upload question PDF" 
                />
              </Field>
              <Field label="Solution PDF">
                <FileUpload 
                  value={pyqSolutionFile || pyqForm.solutionUrl} 
                  onFileSelect={(f) => setPyqSolutionFile(f)} 
                  placeholder="Upload solution PDF" 
                />
              </Field>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={GHOST_BTN} onClick={closeModal} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className={PRIMARY_BTN} disabled={isSubmitting}>{isSubmitting ? 'Uploading...' : (activeModal === 'add-pyq' ? 'Publish PYQ' : 'Save changes')}</button>
            </div>
          </form>
        </Modal>
      )}

      {(activeModal === 'add-sheet' || activeModal === 'edit-sheet') && (
        <Modal title={activeModal === 'add-sheet' ? 'Add practice sheet' : 'Edit practice sheet'} subtitle="Chapter-wise practice drill" onClose={closeModal}>
          <form onSubmit={handleSheetSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Exam / course">
                <select className={INPUT} value={sheetForm.course} onChange={(e) => setSheetForm({ ...sheetForm, course: e.target.value as ExamType })}>
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </Field>
              <Field label="Subject">
                <select className={INPUT} required value={sheetForm.subject} onChange={(e) => setSheetForm({ ...sheetForm, subject: e.target.value })}>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Chapter">
              <input className={INPUT} required value={sheetForm.chapter} onChange={(e) => setSheetForm({ ...sheetForm, chapter: e.target.value })} placeholder="e.g. Fluid Mechanics" />
            </Field>
            <Field label="Sheet title">
              <input className={INPUT} required value={sheetForm.title} onChange={(e) => setSheetForm({ ...sheetForm, title: e.target.value })} placeholder="Electrostatic Potential Drill" />
            </Field>
            <Field label="Description">
              <textarea className={INPUT} required rows={3} value={sheetForm.description} onChange={(e) => setSheetForm({ ...sheetForm, description: e.target.value })} placeholder="45 targeted MCQs with dielectric-insertion questions…" />
            </Field>
            <Field label="Practice Sheet PDF">
              <FileUpload 
                value={sheetFile || sheetForm.fileUrl} 
                onFileSelect={(f) => setSheetFile(f)} 
                placeholder="Upload practice sheet PDF" 
              />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={GHOST_BTN} onClick={closeModal} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className={PRIMARY_BTN} disabled={isSubmitting}>{isSubmitting ? 'Uploading...' : (activeModal === 'add-sheet' ? 'Upload sheet' : 'Save changes')}</button>
            </div>
          </form>
        </Modal>
      )}

      {(activeModal === 'add-announcement' || activeModal === 'edit-announcement') && (
        <Modal title={activeModal === 'add-announcement' ? 'New announcement' : 'Edit announcement'} subtitle="Broadcast a notice to everyone in the portal" onClose={closeModal}>
          <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
            <Field label="Title">
              <input className={INPUT} required value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} placeholder="New JEE Advanced notes are live" />
            </Field>
            <Field label="Category">
              <select className={INPUT} value={annForm.category} onChange={(e) => setAnnForm({ ...annForm, category: e.target.value as AnnouncementCategory })}>
                <option value="general">General</option>
                <option value="exam">Exam</option>
                <option value="resource">Resource</option>
                <option value="schedule">Schedule</option>
              </select>
            </Field>
            <Field label="Message">
              <textarea className={INPUT} required rows={4} value={annForm.body} onChange={(e) => setAnnForm({ ...annForm, body: e.target.value })} placeholder="Share the details students need to know…" />
            </Field>
            <label className="flex items-center gap-2.5 rounded-xl border border-[#EFE7D8] dark:border-[#F6F2EA]/10 bg-[#FBF7F0] dark:bg-[#2A2726] px-3.5 py-3">
              <input type="checkbox" className="h-4 w-4 accent-[#4A0E1B]" checked={annForm.pinned} onChange={(e) => setAnnForm({ ...annForm, pinned: e.target.checked })} />
              <span className="text-sm font-medium text-[#3A342E]">Pin to the top of the board</span>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={GHOST_BTN} onClick={closeModal}>Cancel</button>
              <button type="submit" className={PRIMARY_BTN}>{activeModal === 'add-announcement' ? 'Post announcement' : 'Save changes'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm dialog */}
      {confirm && (
        <Modal title={confirm.title} onClose={() => setConfirm(null)}>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBF0EE] text-[#B23B2E]">
              <AlertTriangle size={18} />
            </span>
            <p className="text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD]">{confirm.message}</p>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button className={GHOST_BTN} onClick={() => setConfirm(null)}>Cancel</button>
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-[#B23B2E] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#98311F]"
              onClick={() => {
                confirm.onConfirm();
                setConfirm(null);
              }}
            >
              {confirm.confirmLabel}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Section scaffolding (kept below the main component)
 * ------------------------------------------------------------------ */
function ResourceSection({
  title,
  count,
  total,
  onAdd,
  addLabel,
  toolbar,
  children
}: {
  title: string;
  count: number;
  total: number;
  onAdd: () => void;
  addLabel: string;
  toolbar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#8A7E6F] dark:text-[#A89F91]">
          <span className="font-semibold text-[#22201F] dark:text-[#F6F2EA]">{count}</span>
          {count === total ? '' : ` of ${total}`} {title}
        </p>
        <button className={PRIMARY_BTN} onClick={onAdd}>
          <Plus size={15} /> {addLabel}
        </button>
      </div>
      {toolbar}
      {children}
    </div>
  );
}

function Toolbar({
  placeholder,
  query,
  onQuery,
  selects
}: {
  placeholder: string;
  query: string;
  onQuery: (v: string) => void;
  selects: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
        <input className={`${INPUT} pl-10`} placeholder={placeholder} value={query} onChange={(e) => onQuery(e.target.value)} />
      </div>
      {selects}
    </div>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <PremiumCard padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#22201F]/15 dark:border-[#F6F2EA]/10 bg-[#FBF7F0] dark:bg-[#2A2726]">
              {head.map((h, i) => (
                <th key={i} className={`px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91] ${i === head.length - 1 ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2ECDF]">{children}</tbody>
        </table>
      </div>
    </PremiumCard>
  );
}

function RowActions({ onView, onEdit, onDelete }: { onView?: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      {onView && (
        <button onClick={onView} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F4E7E5] dark:bg-[#38151A] hover:text-[#4A0E1B]" aria-label="View PDF">
          <Eye size={15} />
        </button>
      )}
      <button onClick={onEdit} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F4E7E5] dark:bg-[#38151A] hover:text-[#4A0E1B]" aria-label="Edit">
        <Pencil size={15} />
      </button>
      <button onClick={onDelete} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F6E5E1] hover:text-[#B23B2E]" aria-label="Delete">
        <Trash2 size={15} />
      </button>
    </div>
  );
}
