/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { useLightbox, ClickableImage, type LightboxImage } from './ImageLightbox';
import { DoubtThread } from './doubts/DoubtThread';

/* ------------------------------------------------------------------ *
 * Design tokens — a warm, light "professor's study" system built on
 * the chosen palette: Deep Maroon #4A0E1B · Charcoal #22201F · Sand #D9C2A2
 * ------------------------------------------------------------------ */
// CARD constant deprecated. We use PremiumCard component for visual consistency.
const INPUT =
  'w-full rounded-input border border-[#D9C2A2]/40 bg-white dark:bg-[#22201F] dark:bg-[#22201F] px-3.5 py-2.5 text-sm text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] placeholder:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/30 outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10';
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-btn bg-[#4A0E1B] hover:bg-[#7C2532] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-all shadow-soft-sm hover:-translate-y-0.5 duration-200 disabled:opacity-50';
const GHOST_BTN =
  'inline-flex items-center justify-center gap-2 rounded-btn border border-[#D9C2A2]/40 bg-white dark:bg-[#22201F] dark:bg-[#22201F] px-4 py-2.5 text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] transition-all hover:bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] hover:-translate-y-0.5 duration-200';
const ROW_BTN =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 transition-colors hover:bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] hover:text-[#4A0E1B]';
const ROW_BTN_DANGER =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#4A0E1B]/80 transition-colors hover:bg-[#4A0E1B]/8 hover:text-[#4A0E1B]';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60';

const EXAM_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'jee-main': { bg: 'bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#38151A]', text: 'text-[#4A0E1B]', dot: 'bg-[#4A0E1B]' },
  'jee-advanced': { bg: 'bg-[#F4E2E5]', text: 'text-[#7C2532]', dot: 'bg-[#7C2532]' },
  neet: { bg: 'bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D]', text: 'text-[#8A6A16]', dot: 'bg-[#C9A13B]' },
  net: { bg: 'bg-[#ECE7E0]', text: 'text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]', dot: 'bg-[#22201F]' },
  'msc-entrance': { bg: 'bg-[#EFE7D8]', text: 'text-[#6E5A2E]', dot: 'bg-[#C4A87F]' }
};

const ANN_CAT: Record<AnnouncementCategory, { label: string; cls: string }> = {
  general: { label: 'General', cls: 'bg-[#EFE7D8] text-[#6E645A]' },
  exam: { label: 'Exam', cls: 'bg-[#F4E4E4] text-[#4A0E1B]' },
  resource: { label: 'Resource', cls: 'bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D] text-[#8A6A16]' },
  schedule: { label: 'Schedule', cls: 'bg-[#F4E2E5] text-[#7C2532]' }
};

/* ------------------------------------------------------------------ *
 * Subject badge — single source of truth styling from SUBJECT_BADGE
 * ------------------------------------------------------------------ */
function SubjectBadge({ subject }: { subject: string }) {
  const s = SUBJECT_BADGE[subject as keyof typeof SUBJECT_BADGE];
  if (!s) return <span className="text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{subject}</span>;
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
    Easy: 'bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D] text-[#8A6A16]',
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
      <p className="mt-4 text-3xl font-bold leading-none tabular-nums text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{value}</p>
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
        <span className="dash-mono shrink-0 text-xs tabular-nums text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{sub}</span>
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D] text-[#8A6A16]">{icon}</div>
      <h4 className="dash-serif mt-4 text-base font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{title}</h4>
      <p className="mt-1 max-w-sm text-sm text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{message}</p>
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
      <div className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} overflow-hidden rounded-modal border border-[#D9C2A2]/30 bg-white dark:bg-[#22201F] dark:bg-[#22201F] shadow-soft-xl`}>
        <div className="flex items-start justify-between gap-4 border-b border-[#D9C2A2]/20 px-6 py-5">
          <div>
            <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 transition-colors hover:bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">
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
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{label}</span>
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
      <span className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
        YouTube URL
        <span className="normal-case font-normal text-[#A79A88] tracking-normal">
          — supports all formats (watch, youtu.be, embed, shorts)
        </span>
      </span>
      <div className="relative">
        <input
          type="url"
          className={`w-full rounded-xl border bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] px-3.5 py-2.5 pr-10 text-sm text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] placeholder:text-[#B3A996] outline-none transition ${
            showError
              ? 'border-[#B23B2E]/60 focus:border-[#B23B2E]/80 focus:ring-4 focus:ring-[#B23B2E]/10'
              : showOk
              ? 'border-[#8A6A16]/60 focus:border-[#8A6A16]/80 focus:ring-4 focus:ring-[#8A6A16]/10 bg-white dark:bg-[#22201F] dark:bg-[#22201F]'
              : 'border-[#E3D8C5] focus:border-[#4A0E1B]/50 focus:bg-white dark:bg-[#22201F] dark:bg-[#22201F] focus:ring-4 focus:ring-[#4A0E1B]/10'
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
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#F7EFD9] bg-[#FBF6EA] dark:bg-[#2A2726] dark:bg-[#2A2726] p-3">
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
            <p className="mt-0.5 font-mono text-[10px] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] break-all">
              Video ID: <span className="text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] font-semibold">{videoId}</span>
            </p>
            <p className="mt-1 text-[10px] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
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
  onAddAnnouncement: (a: Omit<Announcement, 'id' | 'createdAt'>) => void;
  onEditAnnouncement: (id: string, a: Partial<Announcement>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onTogglePinAnnouncement: (id: string) => void;
}

import { uploadFile } from '../services/storageService';
import { AnswerDoubtModal } from './doubts/AnswerDoubtModal';

type Tab = 'overview' | 'notes' | 'videos' | 'pyqs' | 'sheets' | 'doubts' | 'announcements' | 'settings';
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
  name: 'Prof. Ajesh Joe',
  role: 'Repository Editor',
  designation: 'Professor of Chemistry',
  office: 'Room 402-B, Science Block II'
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

  // ─── Image Lightbox ───────────────────────────────────────────────────────────
  const { open: openLightbox, lightbox } = useLightbox();

  // ─── PDF Viewer ─────────────────────────────────────────────────────────────
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentInfo | null>(null);
  const openPDF = useCallback((info: PDFDocumentInfo) => setPdfDoc(info), []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [pyqQuestionFile, setPyqQuestionFile] = useState<File | null>(null);
  const [pyqSolutionFile, setPyqSolutionFile] = useState<File | null>(null);
  const [sheetFile, setSheetFile] = useState<File | null>(null);

  // Doubts inbox
  const [doubtsTab, setDoubtsTab] = useState<'unanswered' | 'answered' | 'all'>('unanswered');
  const [replyingDoubtId, setReplyingDoubtId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Per-section search + filters
  const [queries, setQueries] = useState({ notes: '', videos: '', pyqs: '', sheets: '', doubts: '' });
  const [filters, setFilters] = useState({ noteExam: 'all', videoExam: 'all', pyqExam: 'all', pyqDiff: 'all', sheetExam: 'all' });
  const setQuery = (k: keyof typeof queries, v: string) => setQueries((q) => ({ ...q, [k]: v }));
  const setFilter = (k: keyof typeof filters, v: string) => setFilters((f) => ({ ...f, [k]: v }));

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

  /* ---------------- Derived data ---------------- */
  const pendingDoubtsCount = doubts.filter((d) => !d.isAnswered).length;
  const totalResources = notes.length + videos.length + pyqs.length + practiceSheets.length;
  const totalDownloads = notes.reduce((s, n) => s + n.downloadCount, 0);

  const examTitle = (id: string) => exams.find((e) => e.id === id)?.title ?? id;

  const topNotes = useMemo(() => [...notes].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 5), [notes]);
  const maxDownload = topNotes[0]?.downloadCount ?? 0;

  const libraryByExam = useMemo(() => {
    return exams
      .map((e) => ({
        id: e.id,
        label: e.title,
        count:
          notes.filter((n) => n.course === e.id).length +
          videos.filter((v) => v.course === e.id).length +
          pyqs.filter((p) => p.course === e.id).length +
          practiceSheets.filter((s) => s.course === e.id).length
      }))
      .sort((a, b) => b.count - a.count);
  }, [exams, notes, videos, pyqs, practiceSheets]);
  const maxExam = Math.max(1, ...libraryByExam.map((x) => x.count));

  const recentUploads = useMemo(() => {
    const list = [
      ...notes.map((n) => ({ type: 'Note' as const, title: n.title, course: n.course, detail: n.chapter })),
      ...videos.map((v) => ({ type: 'Video' as const, title: v.title, course: v.course, detail: v.chapter })),
      ...pyqs.map((p) => ({ type: 'PYQ' as const, title: `${p.chapter} · ${p.year}`, course: p.course, detail: `${p.difficulty} difficulty` })),
      ...practiceSheets.map((s) => ({ type: 'Sheet' as const, title: s.title, course: s.course, detail: s.chapter }))
    ];
    return list.slice(-6).reverse();
  }, [notes, videos, pyqs, practiceSheets]);

  const typeIcon: Record<string, React.ReactNode> = {
    Note: <FileText size={13} />,
    Video: <VideoIcon size={13} />,
    PYQ: <FileSpreadsheet size={13} />,
    Sheet: <ClipboardList size={13} />
  };

  const notesFiltered = useMemo(() => {
    const q = queries.notes.trim().toLowerCase();
    return notes.filter((n) => {
      if (filters.noteExam !== 'all' && n.course !== filters.noteExam) return false;
      return !q || [n.title, n.chapter, n.subject].some((f) => f.toLowerCase().includes(q));
    });
  }, [notes, filters.noteExam, queries.notes]);

  const videosFiltered = useMemo(() => {
    const q = queries.videos.trim().toLowerCase();
    return videos.filter((v) => {
      if (filters.videoExam !== 'all' && v.course !== filters.videoExam) return false;
      return !q || [v.title, v.chapter, v.subject].some((f) => f.toLowerCase().includes(q));
    });
  }, [videos, filters.videoExam, queries.videos]);

  const pyqsFiltered = useMemo(() => {
    const q = queries.pyqs.trim().toLowerCase();
    return pyqs.filter((p) => {
      if (filters.pyqExam !== 'all' && p.course !== filters.pyqExam) return false;
      if (filters.pyqDiff !== 'all' && p.difficulty !== filters.pyqDiff) return false;
      return !q || [p.chapter, p.subject, String(p.year)].some((f) => f.toLowerCase().includes(q));
    });
  }, [pyqs, filters.pyqExam, filters.pyqDiff, queries.pyqs]);

  const sheetsFiltered = useMemo(() => {
    const q = queries.sheets.trim().toLowerCase();
    return practiceSheets.filter((s) => {
      if (filters.sheetExam !== 'all' && s.course !== filters.sheetExam) return false;
      return !q || [s.title, s.chapter, s.subject].some((f) => f.toLowerCase().includes(q));
    });
  }, [practiceSheets, filters.sheetExam, queries.sheets]);

  const doubtsFiltered = useMemo(() => {
    const q = queries.doubts.trim().toLowerCase();
    return [...doubts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((d) => {
        if (doubtsTab === 'unanswered' && d.isAnswered) return false;
        if (doubtsTab === 'answered' && !d.isAnswered) return false;
        return !q || [d.name, d.subject, d.question, d.email].some((f) => f.toLowerCase().includes(q));
      });
  }, [doubts, doubtsTab, queries.doubts]);

  const annSorted = useMemo(
    () =>
      [...announcements].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [announcements]
  );

  /* ---------------- Helpers ---------------- */
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

  const goAnswer = (id: string) => {
    setActiveTab('doubts');
    setDoubtsTab('unanswered');
    setReplyingDoubtId(id);
    setReplyText('');
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
  const handleReplySubmit = (id: string) => {
    if (!replyText.trim()) return;
    onReplyDoubt(id, { reply_text: replyText });
    setReplyText('');
    setReplyingDoubtId(null);
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
    <div className="dash-root min-h-[85vh] bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">
      {/* ─── In-app PDF Viewer overlay ─── */}
      {pdfDoc && <PDFViewer docInfo={pdfDoc} onClose={() => setPdfDoc(null)} />}
      {/* ─── Image Lightbox ─── */}
      {lightbox}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ============ TOP HEADER ============ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={MICRO}>Professor workspace</p>
            <h1 className="dash-serif mt-1 text-3xl font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] sm:text-[2rem]">{pageTitle[activeTab]}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">
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
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#D9C2A2]/30 bg-white dark:bg-[#22201F] dark:bg-[#22201F] p-1.5 shadow-soft-lg">
                  {quickAdd.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.fn();
                        setQuickAddOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] transition-colors hover:bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817]"
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

        <div className="grid gap-7 lg:grid-cols-12">
          {/* ============ SIDEBAR ============ */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <PremiumCard padding="small">
                {/* Profile */}
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#4A0E1B]/8 to-[#C9A13B]/8 border border-[#D9C2A2]/20 p-3">
                  <div className="dash-serif flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4A0E1B] text-base font-semibold text-[#D9C2A2]">
                    {initials(profile.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{profile.name}</h3>
                    <span className="text-[11px] font-medium text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">{profile.role}</span>
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
                          active ? 'bg-[#4A0E1B]/8 text-[#4A0E1B]' : 'text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 hover:bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]'
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

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] px-3.5 py-3 text-[11px] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
                <Check size={14} className="text-[#8A6A16]" />
                Changes save automatically to this browser.
              </div>
            </div>
          </aside>

          {/* ============ MAIN ============ */}
          <main className="lg:col-span-9">
            {/* ---------- OVERVIEW ---------- */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Hero band */}
                <div className="relative overflow-hidden rounded-hero bg-gradient-to-r from-[#4A0E1B] to-[#7C2532] p-6 text-white shadow-soft-xl border border-[#D9C2A2]/20 sm:p-7">
                  <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#C9A13B]/20 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-14 right-24 h-36 w-36 rounded-full bg-white dark:bg-[#22201F] dark:bg-[#22201F]/10 blur-2xl" />
                  <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-md">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D9C2A2]">Repository health</p>
                      <h2 className="dash-serif mt-2 text-2xl font-semibold leading-snug">A living library across {exams.length} exam tracks</h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">Everything students download flows from here. Keep it fresh and clear their doubts to keep engagement high.</p>
                    </div>
                    <div className="flex shrink-0 gap-7 sm:gap-9">
                      {[
                        { v: totalResources, l: 'Resources' },
                        { v: totalDownloads.toLocaleString(), l: 'Downloads' },
                        { v: pendingDoubtsCount, l: 'Open doubts' }
                      ].map((m) => (
                        <div key={m.l}>
                          <p className="dash-serif text-3xl font-semibold tabular-nums">{m.v}</p>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#D9C2A2]">{m.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <StatCard icon={<FileText size={17} />} label="Study Notes" value={notes.length} sub={`${totalDownloads.toLocaleString()} total downloads`} />
                  <StatCard icon={<VideoIcon size={17} />} label="Lectures" value={videos.length} sub="Video walkthroughs" />
                  <StatCard icon={<FileSpreadsheet size={17} />} label="PYQ Sets" value={pyqs.length} sub="With worked solutions" />
                  <StatCard icon={<ClipboardList size={17} />} label="Practice Sheets" value={practiceSheets.length} sub="Chapter-wise drills" />
                </div>

                {/* Analytics */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <PremiumCard padding="large" accentLine>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Most downloaded notes</h3>
                        <p className="text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">What students reach for most</p>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#38151A] text-[#4A0E1B]">
                        <TrendingUp size={17} />
                      </span>
                    </div>
                    {topNotes.length === 0 ? (
                      <p className="py-8 text-center text-sm text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">No notes yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {topNotes.map((n) => (
                          <Bar key={n.id} label={n.title} sub={`${n.downloadCount.toLocaleString()}`} value={n.downloadCount} max={maxDownload} />
                        ))}
                      </div>
                    )}
                  </PremiumCard>

                  <PremiumCard padding="large" accentLine>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Library by exam</h3>
                        <p className="text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">How your content is spread</p>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D] text-[#8A6A16]">
                        <LayoutDashboard size={17} />
                      </span>
                    </div>
                    <div className="space-y-4">
                      {libraryByExam.map((e) => (
                        <Bar
                          key={e.id}
                          label={e.label}
                          sub={`${e.count} item${e.count === 1 ? '' : 's'}`}
                          value={e.count}
                          max={maxExam}
                          barClass={(EXAM_STYLES[e.id] ?? EXAM_STYLES['jee-main']).dot}
                        />
                      ))}
                    </div>
                  </PremiumCard>
                </div>

                {/* Attention + recent */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <PremiumCard padding="large" accentLine>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Needs your attention</h3>
                      {pendingDoubtsCount > 0 && (
                        <span className="rounded-full bg-[#F4E4E4] px-2.5 py-1 text-[10px] font-bold text-[#4A0E1B]">{pendingDoubtsCount} unanswered</span>
                      )}
                    </div>
                    {pendingDoubtsCount === 0 ? (
                      <div className="flex flex-col items-center py-6 text-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D] text-[#8A6A16]">
                          <Check size={20} />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">You're all caught up</p>
                        <p className="text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Every student doubt has an answer.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {doubts
                           .filter((d) => !d.isAnswered)
                           .slice(0, 4)
                           .map((d) => (
                             <button
                               key={d.id}
                               onClick={() => goAnswer(d.id)}
                               className="flex w-full items-start gap-3 rounded-xl border border-[#EFE7D8] dark:border-[#4A433E] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] p-3 text-left transition-colors hover:border-[#E3D1CD] hover:bg-[#F8EEEC]"
                             >
                               <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#22201F] dark:bg-[#22201F] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] ring-1 ring-[#EAE1D2]">
                                 <User size={14} />
                               </span>
                               <span className="min-w-0 flex-1">
                                 <span className="flex items-center justify-between gap-2">
                                   <span className="truncate text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{d.name}</span>
                                   <span className="dash-mono shrink-0 text-[10px] text-[#A79A88]">{fmtDate(d.createdAt)}</span>
                                 </span>
                                 <span className="line-clamp-1 text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{d.question}</span>
                               </span>
                               <ArrowRight size={15} className="mt-1 shrink-0 text-[#C0A98B]" />
                             </button>
                           ))}
                      </div>
                    )}
                  </PremiumCard>

                  <PremiumCard padding="large" accentLine>
                    <h3 className="dash-serif mb-4 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Recent uploads</h3>
                    {recentUploads.length === 0 ? (
                      <p className="py-8 text-center text-sm text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Nothing uploaded yet.</p>
                    ) : (
                      <div className="space-y-1">
                        {recentUploads.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 border-b border-[#F2ECDF] dark:border-[#383330] dark:border-[#383330] py-2.5 last:border-0">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#38151A] text-[#4A0E1B]">{typeIcon[item.type]}</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{item.title}</p>
                              <p className="truncate text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{item.detail}</p>
                            </div>
                            <ExamChip course={item.course} label={examTitle(item.course)} />
                          </div>
                        ))}
                      </div>
                    )}
                  </PremiumCard>
                </div>
              </div>
            )}

            {/* ---------- NOTES ---------- */}
            {activeTab === 'notes' && (
              <ResourceSection
                title="notes"
                count={notesFiltered.length}
                total={notes.length}
                onAdd={openAddNote}
                addLabel="Add note"
                toolbar={
                  <Toolbar
                    placeholder="Search notes, chapters, subjects…"
                    query={queries.notes}
                    onQuery={(v) => setQuery('notes', v)}
                    selects={
                      <select className={`${INPUT} sm:w-44`} value={filters.noteExam} onChange={(e) => setFilter('noteExam', e.target.value)}>
                        {examOptions}
                      </select>
                    }
                  />
                }
              >
                {notesFiltered.length === 0 ? (
                  <EmptyState icon={<FileText size={22} />} title="No notes here yet" message="Add your first study note or adjust the filters above." action={<button className={PRIMARY_BTN} onClick={openAddNote}><Plus size={15} /> Add note</button>} />
                ) : (
                  <Table head={['Exam & subject', 'Title & chapter', 'Downloads', '']}>
                    {notesFiltered.map((n) => (
                      <tr key={n.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726] dark:bg-[#2A2726] dark:hover:bg-[#2A2726]">
                        <td className="px-5 py-3.5">
                          <ExamChip course={n.course} label={examTitle(n.course)} />
                          <span className="mt-1 block"><SubjectBadge subject={n.subject} /></span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{n.title}</span>
                          <span className="mt-0.5 block text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{n.chapter}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="dash-mono inline-flex items-center gap-1.5 text-sm font-medium tabular-nums text-[#4A443E]">
                            <Download size={13} className="text-[#8A6A16]" />
                            {n.downloadCount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <RowActions
                            onView={n.fileUrl ? () => openPDF({ title: n.title, fileUrl: n.fileUrl, fileSize: n.fileSize, entityType: 'note', entityId: n.id, isProfessor: true, downloadCount: n.downloadCount, onDelete: () => { askDelete('this note', () => onDeleteNote(n.id)); setPdfDoc(null); } }) : undefined}
                            onEdit={() => openEditNote(n)}
                            onDelete={() => askDelete('this note', () => onDeleteNote(n.id))}
                          />
                        </td>
                      </tr>
                    ))}
                  </Table>
                )}
              </ResourceSection>
            )}

            {/* ---------- VIDEOS ---------- */}
            {activeTab === 'videos' && (
              <ResourceSection
                title="lectures"
                count={videosFiltered.length}
                total={videos.length}
                onAdd={openAddVideo}
                addLabel="Add lecture"
                toolbar={
                  <Toolbar
                    placeholder="Search lectures, chapters, subjects…"
                    query={queries.videos}
                    onQuery={(v) => setQuery('videos', v)}
                    selects={
                      <select className={`${INPUT} sm:w-44`} value={filters.videoExam} onChange={(e) => setFilter('videoExam', e.target.value)}>
                        {examOptions}
                      </select>
                    }
                  />
                }
              >
                {videosFiltered.length === 0 ? (
                  <EmptyState icon={<VideoIcon size={22} />} title="No lectures here yet" message="Publish a video lecture or adjust the filters above." action={<button className={PRIMARY_BTN} onClick={openAddVideo}><Plus size={15} /> Add lecture</button>} />
                ) : (
                  <Table head={['Exam & subject', 'Lecture & chapter', 'Duration', '']}>
                    {videosFiltered.map((v) => (
                      <tr key={v.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726] dark:bg-[#2A2726] dark:hover:bg-[#2A2726]">
                        <td className="px-5 py-3.5">
                          <ExamChip course={v.course} label={examTitle(v.course)} />
                          <span className="mt-1 block"><SubjectBadge subject={v.subject} /></span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{v.title}</span>
                          <span className="mt-0.5 block text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{v.chapter}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="dash-mono text-sm tabular-nums text-[#4A443E]">{v.duration}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <RowActions onEdit={() => openEditVideo(v)} onDelete={() => askDelete('this lecture', () => onDeleteVideo(v.id))} />
                        </td>
                      </tr>
                    ))}
                  </Table>
                )}
              </ResourceSection>
            )}

            {/* ---------- PYQS ---------- */}
            {activeTab === 'pyqs' && (
              <ResourceSection
                title="PYQ sets"
                count={pyqsFiltered.length}
                total={pyqs.length}
                onAdd={openAddPyq}
                addLabel="Add PYQ"
                toolbar={
                  <Toolbar
                    placeholder="Search by chapter, subject, year…"
                    query={queries.pyqs}
                    onQuery={(v) => setQuery('pyqs', v)}
                    selects={
                      <>
                        <select className={`${INPUT} sm:w-40`} value={filters.pyqExam} onChange={(e) => setFilter('pyqExam', e.target.value)}>
                          {examOptions}
                        </select>
                        <select className={`${INPUT} sm:w-36`} value={filters.pyqDiff} onChange={(e) => setFilter('pyqDiff', e.target.value)}>
                          <option value="all">All levels</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </>
                    }
                  />
                }
              >
                {pyqsFiltered.length === 0 ? (
                  <EmptyState icon={<FileSpreadsheet size={22} />} title="No PYQs here yet" message="Add a previous-year booklet or adjust the filters above." action={<button className={PRIMARY_BTN} onClick={openAddPyq}><Plus size={15} /> Add PYQ</button>} />
                ) : (
                  <Table head={['Exam & subject', 'Chapter & year', 'Difficulty', '']}>
                    {pyqsFiltered.map((p) => (
                      <tr key={p.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726] dark:bg-[#2A2726] dark:hover:bg-[#2A2726]">
                        <td className="px-5 py-3.5">
                          <ExamChip course={p.course} label={examTitle(p.course)} />
                          <span className="mt-1 block"><SubjectBadge subject={p.subject} /></span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{p.chapter}</span>
                          <span className="dash-mono mt-0.5 block text-xs tabular-nums text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Year {p.year}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <DifficultyChip level={p.difficulty} />
                        </td>
                        <td className="px-5 py-3.5">
                          <RowActions
                            onView={p.questionUrl ? () => openPDF({ title: `${p.chapter} · ${p.year} (Question)`, fileUrl: p.questionUrl, fileSize: p.questionSize, entityType: 'pyq', entityId: p.id, isProfessor: true, onDelete: () => { askDelete('this PYQ', () => onDeletePyq(p.id)); setPdfDoc(null); } }) : undefined}
                            onEdit={() => openEditPyq(p)}
                            onDelete={() => askDelete('this PYQ', () => onDeletePyq(p.id))}
                          />
                        </td>
                      </tr>
                    ))}
                  </Table>
                )}
              </ResourceSection>
            )}

            {/* ---------- SHEETS ---------- */}
            {activeTab === 'sheets' && (
              <ResourceSection
                title="sheets"
                count={sheetsFiltered.length}
                total={practiceSheets.length}
                onAdd={openAddSheet}
                addLabel="Add sheet"
                toolbar={
                  <Toolbar
                    placeholder="Search sheets, chapters, subjects…"
                    query={queries.sheets}
                    onQuery={(v) => setQuery('sheets', v)}
                    selects={
                      <select className={`${INPUT} sm:w-44`} value={filters.sheetExam} onChange={(e) => setFilter('sheetExam', e.target.value)}>
                        {examOptions}
                      </select>
                    }
                  />
                }
              >
                {sheetsFiltered.length === 0 ? (
                  <EmptyState icon={<ClipboardList size={22} />} title="No practice sheets yet" message="Add a drill or adjust the filters above." action={<button className={PRIMARY_BTN} onClick={openAddSheet}><Plus size={15} /> Add sheet</button>} />
                ) : (
                  <Table head={['Exam & subject', 'Title', 'Chapter', '']}>
                    {sheetsFiltered.map((s) => (
                      <tr key={s.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726] dark:bg-[#2A2726] dark:hover:bg-[#2A2726]">
                        <td className="px-5 py-3.5">
                          <ExamChip course={s.course} label={examTitle(s.course)} />
                          <span className="mt-1 block"><SubjectBadge subject={s.subject} /></span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{s.title}</td>
                        <td className="px-5 py-3.5 text-sm text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{s.chapter}</td>
                        <td className="px-5 py-3.5">
                          <RowActions
                            onView={s.fileUrl ? () => openPDF({ title: s.title, fileUrl: s.fileUrl, fileSize: s.fileSize, entityType: 'sheet', entityId: s.id, isProfessor: true, onDelete: () => { askDelete('this sheet', () => onDeletePracticeSheet(s.id)); setPdfDoc(null); } }) : undefined}
                            onEdit={() => openEditSheet(s)}
                            onDelete={() => askDelete('this sheet', () => onDeletePracticeSheet(s.id))}
                          />
                        </td>
                      </tr>
                    ))}
                  </Table>
                )}
              </ResourceSection>
            )}

            {/* ---------- DOUBTS ---------- */}
            {activeTab === 'doubts' && (
              <div className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="inline-flex rounded-xl border border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#4A433E] bg-white dark:bg-[#22201F] dark:bg-[#22201F] p-1">
                    {(['unanswered', 'answered', 'all'] as const).map((t) => {
                      const c = t === 'unanswered' ? doubts.filter((d) => !d.isAnswered).length : t === 'answered' ? doubts.filter((d) => d.isAnswered).length : doubts.length;
                      const active = doubtsTab === t;
                      return (
                        <button
                          key={t}
                          onClick={() => setDoubtsTab(t)}
                          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition-colors ${active ? 'bg-[#4A0E1B] text-white' : 'text-[#6E645A] hover:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]'}`}
                        >
                          {t} <span className={active ? 'text-white/70' : 'text-[#A79A88]'}>({c})</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="relative sm:w-72">
                    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
                    <input className={`${INPUT} pl-10`} placeholder="Search doubts…" value={queries.doubts} onChange={(e) => setQuery('doubts', e.target.value)} />
                  </div>
                </div>

                {doubtsFiltered.length === 0 ? (
                  <EmptyState
                    icon={<Inbox size={22} />}
                    title={doubtsTab === 'unanswered' ? 'Inbox zero' : 'Nothing to show'}
                    message={doubtsTab === 'unanswered' ? 'There are no unanswered doubts right now. Beautifully done.' : 'No doubts match this view.'}
                  />
                ) : (
                  <div className="space-y-4">
                    {doubtsFiltered.map((doubt) => (
                      <React.Fragment key={doubt.id}>
                        <DoubtThread
                          doubt={doubt}
                          onReply={() => setReplyingDoubtId(doubt.id)}
                          onDeleteDoubt={() => askDelete('this ticket', () => onDeleteDoubt(doubt.id))}
                          openLightbox={openLightbox}
                          isProfessorView={true}
                        />
                        {replyingDoubtId === doubt.id && (
                          <AnswerDoubtModal
                            doubt={doubt}
                            onClose={() => setReplyingDoubtId(null)}
                            onPublish={async (data) => {
                              await onReplyDoubt(doubt.id, data);
                              setReplyingDoubtId(null);
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---------- ANNOUNCEMENTS ---------- */}
            {activeTab === 'announcements' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
                    {announcements.length} notice{announcements.length === 1 ? '' : 's'} · pinned ones show first for students
                  </p>
                  <button className={PRIMARY_BTN} onClick={openAddAnnouncement}>
                    <Plus size={15} /> New announcement
                  </button>
                </div>

                {annSorted.length === 0 ? (
                  <EmptyState icon={<Megaphone size={22} />} title="No announcements yet" message="Post exam dates, new uploads or study tips for your students." action={<button className={PRIMARY_BTN} onClick={openAddAnnouncement}><Plus size={15} /> New announcement</button>} />
                ) : (
                  <div className="space-y-4">
                    {annSorted.map((a) => (
                      <PremiumCard key={a.id} padding="medium" className={a.pinned ? 'ring-1 ring-[#4A0E1B]/15' : ''}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${ANN_CAT[a.category].cls}`}>{ANN_CAT[a.category].label}</span>
                            {a.pinned && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#4A0E1B]">
                                <Pin size={11} /> Pinned
                              </span>
                            )}
                          </div>
                          <span className="dash-mono shrink-0 text-[11px] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{fmtDate(a.createdAt)}</span>
                        </div>
                        <h4 className="dash-serif mt-3 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{a.title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD] dark:text-[#C7BCAD]">{a.body}</p>
                        <div className="mt-4 flex items-center gap-1 border-t border-[#F2ECDF] dark:border-[#383330] dark:border-[#383330] pt-3">
                          <button className={ROW_BTN} onClick={() => onTogglePinAnnouncement(a.id)}>
                            {a.pinned ? <PinOff size={13} /> : <Pin size={13} />} {a.pinned ? 'Unpin' : 'Pin'}
                          </button>
                          <button className={ROW_BTN} onClick={() => openEditAnnouncement(a)}>
                            <Pencil size={13} /> Edit
                          </button>
                          <button className={ROW_BTN_DANGER} onClick={() => askDelete('this announcement', () => onDeleteAnnouncement(a.id))}>
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </PremiumCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---------- SETTINGS ---------- */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <PremiumCard padding="large" accentLine>
                  <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Profile</h3>
                  <p className="text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Shown across the professor workspace.</p>
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
                  <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Data</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD] dark:text-[#C7BCAD]">
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
            <label className="flex items-center gap-2.5 rounded-xl border border-[#EFE7D8] dark:border-[#4A433E] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] px-3.5 py-3">
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
            <p className="text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD] dark:text-[#C7BCAD]">{confirm.message}</p>
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
        <p className="text-sm text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
          <span className="font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{count}</span>
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
            <tr className="border-b border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726]">
              {head.map((h, i) => (
                <th key={i} className={`px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] ${i === head.length - 1 ? 'text-right' : ''}`}>
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
        <button onClick={onView} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] transition-colors hover:bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#38151A] hover:text-[#4A0E1B]" aria-label="View PDF">
          <Eye size={15} />
        </button>
      )}
      <button onClick={onEdit} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] transition-colors hover:bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#38151A] hover:text-[#4A0E1B]" aria-label="Edit">
        <Pencil size={15} />
      </button>
      <button onClick={onDelete} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] transition-colors hover:bg-[#F6E5E1] hover:text-[#B23B2E]" aria-label="Delete">
        <Trash2 size={15} />
      </button>
    </div>
  );
}
