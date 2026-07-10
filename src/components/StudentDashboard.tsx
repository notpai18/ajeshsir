/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  FileText,
  Video as VideoIcon,
  HelpCircle,
  FolderOpen,
  Download,
  Eye,
  ChevronDown,
  ChevronRight,
  X,
  ExternalLink,
  Send,
  FileSpreadsheet,
  Award,
  Compass,
  Activity,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Megaphone,
  Pin,
  Play,
  Paperclip,
  CheckCircle2,
  Atom,
  FlaskConical,
  LayoutGrid,
  List,
  ArrowDownUp
} from 'lucide-react';
import { ExamType, ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement, AnnouncementCategory } from '../types';
import { VideoWatchModal } from './VideoWatchModal';
import { PDFViewer } from './pdf/PDFViewer';
import { FileUpload } from './FileUpload';
import { uploadDoubtAttachment } from '../services/doubtsService';
import { extractYouTubeId, getYoutubeThumbnail } from '../lib/youtube';
import type { PDFDocumentInfo } from './pdf/PDFContext';
import { PremiumCard } from './PremiumCard';
import { SUBJECTS, SUBJECT_BADGE } from '../constants/subjects';

/* ------------------------------------------------------------------ *
 * Design tokens — shared "Professor's Study" system (see DESIGN_SYSTEM.md)
 * ------------------------------------------------------------------ */
const CARD =
  'rounded-2xl border border-[#EAE1D2] dark:border-[#383330] bg-white dark:bg-[#22201F] shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]';
const INPUT =
  'w-full rounded-xl border border-[#E3D8C5] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2725] px-3.5 py-2.5 text-sm text-[#22201F] dark:text-[#F6F2EA] placeholder:text-[#B3A996] dark:text-[#7A6F62] outline-none transition focus:border-[#4A0E1B]/50 focus:bg-white dark:bg-[#22201F] focus:ring-4 focus:ring-[#4A0E1B]/10';
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A0E1B] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#380A14] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4A0E1B]/20 disabled:opacity-50';
const GHOST_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#E3D8C5] dark:border-[#4A433E] bg-white dark:bg-[#22201F] px-4 py-2.5 text-xs font-semibold text-[#4A443E] dark:text-[#C7BCAD] transition-colors hover:bg-[#F6F2EA] dark:hover:bg-[#1A1817] dark:bg-[#1A1817]';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F] dark:text-[#A89F91]';
const BACK_BTN =
  'inline-flex items-center gap-1.5 text-xs font-bold text-[#4A0E1B] dark:text-[#F4E7E5] transition-colors hover:text-[#380A14]';
const FIELD_LABEL = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A7E6F] dark:text-[#A89F91]';
const PILL_SOFT =
  'inline-flex items-center gap-1.5 rounded-lg bg-[#F4E7E5] dark:bg-[#380A14] px-2.5 py-1.5 text-[11px] font-bold text-[#4A0E1B] dark:text-[#F4E7E5] transition-colors hover:bg-[#EEDAD7]';
const PILL_GHOST =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#6E645A] transition-colors hover:bg-[#F6F2EA] dark:hover:bg-[#1A1817] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA]';
const PILL_GOLD =
  'inline-flex items-center gap-1.5 rounded-lg bg-[#F7EFD9] dark:bg-[#362A0D] px-2.5 py-1.5 text-[11px] font-bold text-[#8A6A16] dark:text-[#E8CD82] transition-colors hover:bg-[#F1E6C9]';

const ANN_CAT: Record<AnnouncementCategory, { label: string; cls: string }> = {
  general: { label: 'General', cls: 'bg-[#EFE7D8] text-[#6E645A]' },
  exam: { label: 'Exam', cls: 'bg-[#F4E4E4] text-[#4A0E1B] dark:text-[#F4E7E5]' },
  resource: { label: 'Resource', cls: 'bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16] dark:text-[#E8CD82]' },
  schedule: { label: 'Schedule', cls: 'bg-[#F4E2E5] text-[#7C2532]' }
};

/* ─── Subject badge component ────────────────────────────────────────────── */
function SubjectBadge({ subject }: { subject: string }) {
  const s = SUBJECT_BADGE[subject as keyof typeof SUBJECT_BADGE];
  if (!s) return <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A7E6F] dark:text-[#A89F91]">{subject}</span>;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.emoji} {s.label}
    </span>
  );
}

function DifficultyChip({ level }: { level: 'Easy' | 'Medium' | 'Hard' }) {
  const map = {
    Easy: 'bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16] dark:text-[#E8CD82]',
    Medium: 'bg-[#F4E2E5] text-[#7C2532]',
    Hard: 'bg-[#F4E4E4] text-[#4A0E1B] dark:text-[#F4E7E5]'
  } as const;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${map[level]}`}>{level}</span>;
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] dark:bg-[#2A2725] px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16] dark:text-[#E8CD82]">
        <Search size={22} />
      </div>
      <p className="mt-4 text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA]">Nothing found</p>
      <p className="mt-1 max-w-sm text-sm text-[#8A7E6F] dark:text-[#A89F91]">{label}</p>
    </div>
  );
}

interface StudentDashboardProps {
  exams: ExamInfo[];
  notes: Note[];
  videos: Video[];
  pyqs: PYQ[];
  practiceSheets: PracticeSheet[];
  doubts: Doubt[];
  faqs: FAQ[];
  announcements: Announcement[];
  onAddDoubt: (doubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt'>) => void;
  onIncrementNoteDownload: (id: string) => void;
}

export default function StudentDashboard({
  exams,
  notes,
  videos,
  pyqs,
  practiceSheets,
  doubts,
  faqs,
  announcements,
  onAddDoubt,
  onIncrementNoteDownload
}: StudentDashboardProps) {
  // Navigation States within student portal
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [activeCategory, setActiveCategory] = useState<'notes' | 'videos' | 'pyqs' | 'sheets' | 'doubts' | 'resources' | null>(null);

  // Filter/Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // Interactive Overlays
  const [activeVideoModal, setActiveVideoModal] = useState<Video | null>(null);
  const [activePdfViewer, setActivePdfViewer] = useState<{ title: string; fileUrl: string } | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Notes View & Sort States
  const [noteViewMode, setNoteViewMode] = useState<'grid' | 'list'>('grid');
  const [noteSort, setNoteSort] = useState<'recent' | 'popular'>('recent');

  // Doubt Form State
  const [doubtForm, setDoubtForm] = useState({
    name: '',
    email: '',
    subject: '',
    question: ''
  });
  const [doubtFile, setDoubtFile] = useState<File | null>(null);
  const [doubtSubmitted, setDoubtSubmitted] = useState(false);
  const [doubtSubmitting, setDoubtSubmitting] = useState(false);

  // Dynamic Lucide helper mapping for Exam Icons (all rendered in maroon on a tinted tile)
  const renderExamIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Compass': return <Compass size={22} />;
      case 'Award': return <Award size={22} />;
      case 'Activity': return <Activity size={22} />;
      case 'BookOpen': return <BookOpen size={22} />;
      case 'GraduationCap': return <GraduationCap size={22} />;
      default: return <BookOpen size={22} />;
    }
  };

  const currentExamInfo = useMemo(() => {
    return exams.find(e => e.id === selectedExam);
  }, [exams, selectedExam]);

  // RESET state on nav back
  const handleBackToExams = () => {
    setSelectedExam(null);
    setActiveCategory(null);
    setSearchQuery('');
    setSelectedSubject('All');
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
    setSearchQuery('');
    setSelectedSubject('All');
  };

  // SUBJECT filters — always the canonical three subjects (+ 'All')
  const availableSubjects = useMemo(() => {
    return ['All', ...SUBJECTS];
  }, []);

  // Dynamic filtering algorithms
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (note.course !== selectedExam) return false;
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [notes, selectedExam, searchQuery, selectedSubject]);

  const filteredVideos = useMemo(() => {
    return videos.filter(vid => {
      if (vid.course !== selectedExam) return false;
      const matchesSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            vid.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            vid.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || vid.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [videos, selectedExam, searchQuery, selectedSubject]);

  const filteredPyqs = useMemo(() => {
    return pyqs.filter(pyq => {
      if (pyq.course !== selectedExam) return false;
      const matchesSearch = pyq.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || pyq.subject === selectedSubject;
      const matchesDifficulty = selectedDifficulty === 'All' || pyq.difficulty === selectedDifficulty;
      const matchesYear = selectedYear === 'All' || pyq.year.toString() === selectedYear;
      return matchesSearch && matchesSubject && matchesDifficulty && matchesYear;
    });
  }, [pyqs, selectedExam, searchQuery, selectedSubject, selectedDifficulty, selectedYear]);

  const filteredSheets = useMemo(() => {
    return practiceSheets.filter(sheet => {
      if (sheet.course !== selectedExam) return false;
      const matchesSearch = sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sheet.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || sheet.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [practiceSheets, selectedExam, searchQuery, selectedSubject]);

  // Handle Doubt Submission — uploads attachment to Supabase (main's flow), then submits
  const handleDoubtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtForm.name || !doubtForm.email || !doubtForm.question || doubtSubmitting) return;

    setDoubtSubmitting(true);
    try {
      let attachmentUrl: string | undefined;
      let attachmentName: string | undefined;
      if (doubtFile) {
        const uploaded = await uploadDoubtAttachment(doubtFile);
        attachmentUrl = uploaded.url;
        attachmentName = uploaded.name;
      }

      onAddDoubt({
        name: doubtForm.name,
        email: doubtForm.email,
        subject: doubtForm.subject || `${currentExamInfo?.title || ''} - General Query`,
        question: doubtForm.question,
        attachmentName,
        attachmentUrl
      });

      setDoubtSubmitted(true);
      setDoubtForm({ name: '', email: '', subject: '', question: '' });
      setDoubtFile(null);
      setTimeout(() => setDoubtSubmitted(false), 6000);
    } catch (err) {
      console.error('[StudentDashboard] doubt submit failed:', err);
      alert('Could not submit your doubt right now. Please try again.');
    } finally {
      setDoubtSubmitting(false);
    }
  };

  const handleDownloadFile = (noteId: string, fileName: string) => {
    onIncrementNoteDownload(noteId);
    triggerDownload(fileName);
  };

  const triggerDownload = (fileName: string) => {
    // Elegant simulation of a local PDF download
    const element = document.createElement('a');
    const file = new Blob([`Simulated academic repository download for: ${fileName}.`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sortedAnnouncements = useMemo(() => {
    return [...announcements].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [announcements]);

  const recentUploads = useMemo(() => {
    return [
      ...notes.slice(0, 2).map(n => ({ type: 'Note', title: n.title, course: n.course })),
      ...videos.slice(0, 2).map(v => ({ type: 'Video', title: v.title, course: v.course }))
    ].slice(0, 3);
  }, [notes, videos]);

  const popularResources = useMemo(() => {
    return [...notes].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0)).slice(0, 4);
  }, [notes]);

  // Category cards (Step 2) with live counts for the selected exam
  const categoryCards = [
    { id: 'notes' as const, title: 'Study Notes', desc: 'Rigorous mechanism summaries and multi-concept chapter breakdowns.', icon: <BookOpen size={20} />, count: notes.filter(n => n.course === selectedExam).length, unit: 'notes' },
    { id: 'videos' as const, title: 'Video Lectures', desc: 'Conceptual recordings exploring complex chemical and numerical ideas.', icon: <VideoIcon size={20} />, count: videos.filter(v => v.course === selectedExam).length, unit: 'lectures' },
    { id: 'pyqs' as const, title: 'Previous Year Questions', desc: 'Original exam questions with step-by-step analytical solutions.', icon: <FileSpreadsheet size={20} />, count: pyqs.filter(p => p.course === selectedExam).length, unit: 'sets' },
    { id: 'sheets' as const, title: 'Practice Sheets', desc: 'Chapter drills graded by complexity to build proficiency.', icon: <FileText size={20} />, count: practiceSheets.filter(s => s.course === selectedExam).length, unit: 'sheets' },
    { id: 'doubts' as const, title: 'Doubts & FAQ', desc: 'Ask the professor a direct question or browse common answers.', icon: <HelpCircle size={20} />, count: null, unit: '' },
    { id: 'resources' as const, title: 'Additional Resources', desc: 'Syllabus blueprints, formula sheets and reference constants.', icon: <FolderOpen size={20} />, count: null, unit: '' }
  ];

  return (
    <div className="dash-root min-h-screen bg-[#F6F2EA] dark:bg-[#1A1817] py-12 text-[#22201F] dark:text-[#F6F2EA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= LANDING PAGE (REDESIGNED V2) ================= */}
        {!selectedExam && (
          <div className="flex flex-col gap-6 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A0E1B] to-[#7C2532] p-7 text-white shadow-[0_22px_44px_-24px_rgba(74,14,27,0.75)] sm:p-10 animate-[fadeInUp_0.8s_ease-out_forwards]">
              <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-20 h-52 w-52 rounded-full bg-[#D9C2A2]/10 blur-3xl" />

              <div className="relative flex flex-col items-center gap-7 text-center md:flex-row md:items-center md:gap-9 md:text-left">
                {/* Academic Icon */}
                <div className="relative shrink-0 animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                  <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#EAD3AE] to-[#D9C2A2] shadow-lg sm:h-32 sm:w-32">
                    <Atom className="text-[#4A0E1B] dark:text-[#F4E7E5]" size={48} strokeWidth={1.5} />
                  </div>
                  <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-[#4A0E1B] bg-white dark:bg-[#22201F] text-[#4A0E1B] dark:text-[#F4E7E5]">
                    <BookOpen size={18} />
                  </span>
                </div>

                {/* Identity / Text */}
                <div className="max-w-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D9C2A2] animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>COURSE REPOSITORIES</p>
                  <h1 className="dash-serif mt-2 text-3xl font-semibold leading-tight sm:text-[2.5rem] animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>Choose Your Examination</h1>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                    Organize your chemistry resources by examination and access carefully curated notes, lectures, PYQs, and practice material.
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                    {[
                      { icon: <Compass size={13} />, text: '5 Examination Tracks' },
                      { icon: <FileText size={13} />, text: '24 Study Notes' },
                      { icon: <VideoIcon size={13} />, text: '18 Video Lectures' },
                      { icon: <BookOpen size={13} />, text: '12 Practice Sheets' },
                      { icon: <FileSpreadsheet size={13} />, text: 'PYQs Included' }
                    ].map((chip, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#D9C2A2]/30 bg-white dark:bg-[#22201F]/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 hover:border-[#D9C2A2] hover:shadow-[0_0_12px_rgba(217,194,162,0.3)] hover:-translate-y-0.5 transition-all duration-300 animate-[fadeInUp_0.8s_ease-out_forwards]"
                        style={{ animationDelay: `${0.5 + i * 0.1}s`, animationFillMode: 'both' }}
                      >
                        <span className="text-[#D9C2A2]">{chip.icon}</span>
                        {chip.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Examination Grid */}
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExam(exam.id)}
                  className="group relative flex w-full max-w-[340px] flex-col overflow-hidden rounded-[24px] border border-[#EAE1D2] dark:border-[#383330] bg-white dark:bg-[#22201F] p-6 text-left shadow-[0_4px_12px_rgba(34,32,31,0.04)] transition-all duration-[220ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_20px_40px_rgba(74,14,27,0.12)] sm:w-[calc(50%-12px)] lg:w-[340px] h-[230px]"
                >
                  <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 bg-[#C9A13B] transition-transform duration-[220ms] ease-out group-hover:scale-x-100 origin-left"></div>
                  
                  <div className="flex items-start justify-between w-full">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#F4E7E5] dark:bg-[#380A14] text-[#4A0E1B] dark:text-[#F4E7E5] transition-colors duration-[220ms] ease-out group-hover:bg-[#F7EFD9] dark:group-hover:bg-[#362A0D] dark:hover:bg-[#362A0D] dark:bg-[#362A0D] group-hover:text-[#8A6A16] dark:group-hover:text-[#E8CD82] dark:text-[#E8CD82]">
                      {renderExamIcon(exam.icon)}
                    </span>
                    <span className="dash-mono rounded-full border border-[#EFE7D8] dark:border-[#332E2C] bg-[#FBF7F0] dark:bg-[#2A2725] px-2.5 py-1 text-[10px] font-medium text-[#8A7E6F] dark:text-[#A89F91]">
                      {notes.filter(n => n.course === exam.id).length + videos.filter(v => v.course === exam.id).length + practiceSheets.filter(s => s.course === exam.id).length + pyqs.filter(p => p.course === exam.id).length} Resources
                    </span>
                  </div>
                  
                  <h3 className="dash-serif mt-5 text-xl font-bold text-[#22201F] dark:text-[#F6F2EA]">{exam.title}</h3>
                  <p className="mt-2 text-sm text-[#8A7E6F] dark:text-[#A89F91] line-clamp-1">{exam.description}</p>
                  
                  <div className="mt-auto pt-4 flex items-center text-[#4A0E1B] dark:text-[#F4E7E5] font-bold text-xs uppercase tracking-widest">
                    Explore <ArrowRight size={14} className="ml-1.5 transition-transform duration-[220ms] ease-out group-hover:translate-x-2" />
                  </div>
                </button>
              ))}
            </div>

            {/* Supporting Panels - Redesigned Bento Grid */}
            <div className="mt-12 grid gap-6 grid-cols-1 lg:grid-cols-12 items-stretch border-t border-[#EAE1D2] dark:border-[#383330] pt-10">
              
              {/* Featured Announcements - Prominent Brand Card */}
              <div className="lg:col-span-6 xl:col-span-5 rounded-[24px] bg-[#4A0E1B] p-6 sm:p-8 shadow-[0_22px_44px_-24px_rgba(74,14,27,0.75)] relative overflow-hidden flex flex-col">
                 <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#D9C2A2]/20 blur-2xl" />
                 <div className="pointer-events-none absolute -bottom-14 right-24 h-36 w-36 rounded-full bg-[#D9C2A2]/10 blur-2xl" />
                 
                 <div className="relative z-10 flex items-center justify-between mb-8">
                   <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9C2A2]">Latest Announcements</h3>
                   <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#380A14] text-[#D9C2A2]">
                     <Megaphone size={14} />
                   </span>
                 </div>
                 
                 <div className="relative z-10 flex-1 space-y-5">
                   {sortedAnnouncements.filter(a => a.pinned).slice(0, 2).map((ann, idx) => (
                     <div key={ann.id} className={`${idx !== 0 ? 'pt-5 border-t border-[#7A1F2B]' : ''}`}>
                       <p className="dash-serif text-xl font-bold text-white leading-tight">{ann.title}</p>
                       <p className="mt-2.5 text-sm text-[#F4E7E5]/80 line-clamp-2 leading-relaxed font-medium">{ann.body}</p>
                     </div>
                   ))}
                   {sortedAnnouncements.filter(a => a.pinned).length === 0 && (
                     <p className="text-sm text-[#D9C2A2]/70 italic">No pinned announcements at this time.</p>
                   )}
                 </div>
                 
                 <div className="relative z-10 mt-8 pt-5 border-t border-[#7A1F2B]/50">
                    <button className="text-xs font-bold uppercase tracking-widest text-[#D9C2A2] hover:text-white transition-colors flex items-center group">
                      View All Updates <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                    </button>
                 </div>
              </div>

              {/* Right Side Grid - 3 cards */}
              <div className="lg:col-span-6 xl:col-span-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                
                {/* Quick Statistics */}
                <div className="rounded-[24px] border border-[#EAE1D2] dark:border-[#383330] bg-white dark:bg-[#22201F] p-6 shadow-[0_4px_12px_rgba(34,32,31,0.02)] flex flex-col transition-all duration-[220ms] hover:border-[#D9C2A2]">
                  <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F] dark:text-[#A89F91]">Platform Stats</h3>
                  <div className="flex-1 flex flex-col justify-center gap-4.5">
                    <div className="flex items-center justify-between group"><span className="text-sm font-semibold text-[#5A534B] dark:text-[#A89F91]">Study Notes</span><span className="dash-mono text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{notes.length}</span></div>
                    <div className="h-px w-full bg-[#F2ECDF]" />
                    <div className="flex items-center justify-between group"><span className="text-sm font-semibold text-[#5A534B] dark:text-[#A89F91]">Video Lectures</span><span className="dash-mono text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{videos.length}</span></div>
                    <div className="h-px w-full bg-[#F2ECDF]" />
                    <div className="flex items-center justify-between group"><span className="text-sm font-semibold text-[#5A534B] dark:text-[#A89F91]">Practice Sheets</span><span className="dash-mono text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{practiceSheets.length}</span></div>
                    <div className="h-px w-full bg-[#F2ECDF]" />
                    <div className="flex items-center justify-between group"><span className="text-sm font-semibold text-[#5A534B] dark:text-[#A89F91]">PYQs</span><span className="dash-mono text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{pyqs.length}</span></div>
                  </div>
                </div>

                {/* Popular Resources */}
                <div className="rounded-[24px] border border-[#EAE1D2] dark:border-[#383330] bg-white dark:bg-[#22201F] p-6 shadow-[0_4px_12px_rgba(34,32,31,0.02)] flex flex-col transition-all duration-[220ms] hover:border-[#D9C2A2]">
                  <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F] dark:text-[#A89F91]">Popular Now</h3>
                  <div className="flex-1 flex flex-col gap-4">
                    {popularResources.slice(0, 4).map(res => (
                      <div key={res.id} className="cursor-pointer group flex items-start gap-3.5" onClick={() => setActivePdfViewer({ title: res.title, fileUrl: res.fileUrl })}>
                         <span className="flex mt-0.5 shrink-0 h-8 w-8 items-center justify-center rounded-[10px] bg-[#F4E7E5] dark:bg-[#380A14] text-[#4A0E1B] dark:text-[#F4E7E5] transition-colors group-hover:bg-[#4A0E1B] dark:group-hover:bg-[#5C1122] group-hover:text-white">
                           <Download size={12} />
                         </span>
                         <div>
                           <p className="text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] line-clamp-1 group-hover:text-[#4A0E1B] dark:group-hover:text-[#F4E7E5] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5] transition-colors">{res.title}</p>
                           <p className="text-[11px] font-medium text-[#8A7E6F] dark:text-[#A89F91] mt-1">{res.course.toUpperCase()}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recently Added (Full width at bottom of right grid) */}
                <div className="rounded-[24px] border border-[#EAE1D2] dark:border-[#383330] bg-white dark:bg-[#22201F] p-6 shadow-[0_4px_12px_rgba(34,32,31,0.02)] sm:col-span-2 transition-all duration-[220ms] hover:border-[#D9C2A2]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F] dark:text-[#A89F91]">Recently Added</h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C0A98B] dark:text-[#A89F91]">Latest Updates</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {recentUploads.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#F2ECDF] dark:border-[#2A2725] hover:border-[#EAE1D2] dark:border-[#383330] hover:bg-[#FBF7F0] dark:hover:bg-[#2A2725] dark:bg-[#2A2725] hover:shadow-sm transition-all cursor-pointer">
                         <span className="flex shrink-0 h-9 w-9 items-center justify-center rounded-[10px] bg-[#FBF7F0] dark:bg-[#2A2725] border border-[#EAE1D2] dark:border-[#383330] text-[#4A0E1B] dark:text-[#F4E7E5]">
                           {item.type === 'Note' ? <BookOpen size={14} /> : <VideoIcon size={14} />}
                         </span>
                         <div className="min-w-0">
                           <p className="text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] truncate">{item.title}</p>
                           <p className="text-[11px] font-medium text-[#8A7E6F] dark:text-[#A89F91] mt-1">{item.type}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ================= BREADCRUMBS ================= */}
        {(selectedExam || activeCategory) && (
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#8A7E6F] dark:text-[#A89F91]">
            <button onClick={handleBackToExams} className="transition-colors hover:text-[#4A0E1B] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5]">Library</button>
            {selectedExam && (
              <>
                <ChevronRight size={13} className="text-[#C0A98B] dark:text-[#A89F91]" />
                <button
                  onClick={handleBackToCategories}
                  className={`transition-colors hover:text-[#4A0E1B] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5] ${!activeCategory ? 'text-[#4A0E1B] dark:text-[#F4E7E5]' : ''}`}
                >
                  {currentExamInfo?.title}
                </button>
              </>
            )}
            {activeCategory && (
              <>
                <ChevronRight size={13} className="text-[#C0A98B] dark:text-[#A89F91]" />
                <span className="capitalize text-[#4A0E1B] dark:text-[#F4E7E5]">{activeCategory}</span>
              </>
            )}
          </nav>
        )}

        {/* ================= STEP 2: CATEGORY DASHBOARD ================= */}
        {selectedExam && !activeCategory && (
          <div>
            <button onClick={handleBackToExams} className={`${BACK_BTN} mb-4`} id="back-to-exams-btn">
              <ArrowLeft size={14} /> Back to examinations
            </button>

            <div className="mb-10 border-b border-[#EAE1D2] dark:border-[#383330] pb-8">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4E7E5] to-[#F3EAD8] text-[#4A0E1B] dark:text-[#F4E7E5]">
                  {renderExamIcon(currentExamInfo?.icon)}
                </span>
                <h2 className="dash-serif text-3xl font-semibold text-[#22201F] dark:text-[#F6F2EA] sm:text-4xl">
                  {currentExamInfo?.title} Library
                </h2>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8A7E6F] dark:text-[#A89F91]">{currentExamInfo?.description}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryCards.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`${CARD} group w-full p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:-rotate-1`}
                  id={`cat-card-${cat.id}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#380A14] text-[#4A0E1B] dark:text-[#F4E7E5]">{cat.icon}</span>
                    {cat.count !== null && (
                      <span className="dash-mono rounded-full border border-[#EFE7D8] dark:border-[#332E2C] bg-[#FBF7F0] dark:bg-[#2A2725] px-2.5 py-1 text-[11px] font-medium text-[#8A7E6F] dark:text-[#A89F91]">
                        {cat.count} {cat.unit}
                      </span>
                    )}
                  </div>
                  <h3 className="dash-serif mt-4 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">{cat.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#8A7E6F] dark:text-[#A89F91]">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= NOTES EXPLORER ================= */}
        {selectedExam && activeCategory === 'notes' && (
          <div className="animate-[fadeInUp_0.4s_ease-out_forwards]">
            <button onClick={handleBackToCategories} className={`${BACK_BTN} mb-4`}><ArrowLeft size={14} /> Back to categories</button>
            
            {/* 1. Premium Hero */}
            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#4A0E1B] to-[#7C2532] p-6 sm:p-8 text-white shadow-[0_12px_24px_-12px_rgba(74,14,27,0.5)] mb-8">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D9C2A2]">
                    {currentExamInfo?.title}
                  </p>
                  <h2 className="dash-serif mt-1 text-2xl md:text-3xl font-semibold">Study Notes</h2>
                  <p className="mt-2 text-sm text-white/70 max-w-md">
                    Access high-quality study materials, comprehensive chapter summaries, and class notes.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <div className="rounded-2xl bg-white dark:bg-[#22201F]/10 p-4 backdrop-blur-md border border-white/20 text-center min-w-[100px]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#D9C2A2]">Total</p>
                    <p className="dash-mono text-2xl font-bold mt-1">{notes.filter(n => n.course === selectedExam).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Unified Toolbar & 3. Subject Navigation */}
            <div className={`${CARD} mb-6 flex flex-col p-2 sm:flex-row sm:items-center sm:justify-between gap-2 overflow-hidden`}>
              <div className="flex flex-1 items-center gap-1 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar pl-2">
                {availableSubjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-[11px] font-bold transition-all ${
                      selectedSubject === subject
                        ? 'bg-[#4A0E1B] text-white shadow-md'
                        : 'text-[#6E645A] hover:bg-[#F6F2EA] dark:hover:bg-[#1A1817] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA]'
                    }`}
                  >
                    {subject === 'All' ? 'All' : subject}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 border-t border-[#F2ECDF] dark:border-[#2A2725] pt-2 sm:border-none sm:pt-0 pl-2 pr-2">
                {/* Search */}
                <div className="relative w-full sm:w-56 lg:w-64">
                  <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B3A996] dark:text-[#7A6F62]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full rounded-lg border border-[#E3D8C5] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2725] py-2 pl-9 pr-3 text-xs text-[#22201F] dark:text-[#F6F2EA] placeholder:text-[#B3A996] dark:text-[#7A6F62] outline-none transition focus:border-[#4A0E1B]/50 focus:bg-white dark:bg-[#22201F] focus:ring-2 focus:ring-[#4A0E1B]/10"
                  />
                </div>
                
                {/* Sort Toggle (Visual) */}
                <button 
                  onClick={() => setNoteSort(s => s === 'recent' ? 'popular' : 'recent')}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E3D8C5] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2725] text-[#6E645A] transition-colors hover:bg-white dark:bg-[#22201F] hover:text-[#22201F] dark:text-[#F6F2EA]"
                  title={`Sort: ${noteSort === 'recent' ? 'Recently Added' : 'Most Popular'}`}
                >
                  <ArrowDownUp size={14} />
                </button>

                {/* View Toggle (Visual) */}
                <div className="flex h-9 shrink-0 items-center rounded-lg border border-[#E3D8C5] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2725] p-1">
                  <button
                    onClick={() => setNoteViewMode('grid')}
                    className={`flex h-full w-8 items-center justify-center rounded-md transition-all ${noteViewMode === 'grid' ? 'bg-white dark:bg-[#22201F] text-[#4A0E1B] dark:text-[#F4E7E5] shadow-sm' : 'text-[#8A7E6F] dark:text-[#A89F91] hover:text-[#22201F] dark:text-[#F6F2EA]'}`}
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    onClick={() => setNoteViewMode('list')}
                    className={`flex h-full w-8 items-center justify-center rounded-md transition-all ${noteViewMode === 'list' ? 'bg-white dark:bg-[#22201F] text-[#4A0E1B] dark:text-[#F4E7E5] shadow-sm' : 'text-[#8A7E6F] dark:text-[#A89F91] hover:text-[#22201F] dark:text-[#F6F2EA]'}`}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Notes Grid & 5. Premium Note Card */}
            {filteredNotes.length === 0 ? (
              <EmptyState label="No study notes match your search or subject filter." />
            ) : (
              <div className={`grid gap-5 ${noteViewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredNotes.map((note) => (
                  <div key={note.id} className={`${CARD} flex flex-col p-5 group transition-all duration-[220ms] hover:-translate-y-1 hover:shadow-[0_12px_24px_-12px_rgba(34,32,31,0.15)]`}>
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#380A14] text-[#4A0E1B] dark:text-[#F4E7E5] transition-colors group-hover:bg-[#4A0E1B] dark:group-hover:bg-[#5C1122] group-hover:text-white">
                        <FileText size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                          <span className="inline-block rounded-full border border-[#EFE7D8] dark:border-[#332E2C] bg-[#FBF7F0] dark:bg-[#2A2725] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#8A7E6F] dark:text-[#A89F91]">
                            {note.chapter}
                          </span>
                          <SubjectBadge subject={note.subject} />
                        </div>
                        <h4 className="text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] truncate group-hover:text-[#4A0E1B] dark:group-hover:text-[#F4E7E5] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5] transition-colors">
                          {note.title}
                        </h4>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-xs leading-relaxed text-[#8A7E6F] dark:text-[#A89F91] line-clamp-2 min-h-[2.5rem]">
                      {note.description}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-[#F2ECDF] dark:border-[#2A2725] pt-4">
                      <div className="flex flex-col">
                        <span className="dash-mono text-[10px] text-[#A79A88]">{note.fileSize}</span>
                        <span className="dash-mono text-[10px] text-[#A79A88]">{note.downloadCount || 0} downloads</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setActivePdfViewer({ title: note.title, fileUrl: note.fileUrl })} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E3D8C5] dark:border-[#4A433E] bg-white dark:bg-[#22201F] text-[#6E645A] transition-colors hover:bg-[#F6F2EA] dark:hover:bg-[#1A1817] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA]">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleDownloadFile(note.id, note.fileUrl)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4E7E5] dark:bg-[#380A14] text-[#4A0E1B] dark:text-[#F4E7E5] transition-colors hover:bg-[#EEDAD7]">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= LECTURES EXPLORER ================= */}
        {selectedExam && activeCategory === 'videos' && (
          <div>
            <button onClick={handleBackToCategories} className={BACK_BTN}><ArrowLeft size={14} /> Back to categories</button>
            <div className="mt-4 mb-6">
              <p className={MICRO}>{currentExamInfo?.title} · Video lectures</p>
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA]">Video lectures</h2>
            </div>

            <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996] dark:text-[#7A6F62]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search lectures…" className={`${INPUT} pl-10`} />
              </div>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={`${INPUT} sm:w-52`}>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject === 'All' ? 'All subjects' : subject}</option>
                ))}
              </select>
            </div>

            {filteredVideos.length === 0 ? (
              <EmptyState label="No lecture recordings match your search or subject filter." />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => (
                  <div key={video.id} className={`${CARD} group flex flex-col overflow-hidden`}>
                    <div className="relative aspect-video w-full overflow-hidden bg-[#EFE7D8]">
                      <img
                        src={video.thumbnail || getYoutubeThumbnail(extractYouTubeId(video.youtubeLink), 'hqdefault')}
                        alt={video.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-[#22201F]/25 opacity-80 transition-opacity group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-[#22201F]/95 text-[#4A0E1B] dark:text-[#F4E7E5] shadow-lg transition-transform group-hover:scale-105">
                          <Play size={20} className="ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      <span className="dash-mono absolute bottom-2 right-2 rounded-md bg-[#22201F]/80 px-1.5 py-0.5 text-[10px] font-medium text-white">{video.duration}</span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2">
                        <SubjectBadge subject={video.subject} />
                        <span className={MICRO}>{video.chapter}</span>
                      </div>
                      <h4 className="mt-3.5 text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] line-clamp-1">{video.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-[#8A7E6F] dark:text-[#A89F91] line-clamp-2">{video.description}</p>
                      <button onClick={() => setActiveVideoModal(video)} className={`${PRIMARY_BTN} mt-5 w-full`}>
                        <VideoIcon size={14} /> Watch lecture
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= PYQ EXPLORER ================= */}
        {selectedExam && activeCategory === 'pyqs' && (
          <div>
            <button onClick={handleBackToCategories} className={BACK_BTN}><ArrowLeft size={14} /> Back to categories</button>
            <div className="mt-4 mb-6">
              <p className={MICRO}>{currentExamInfo?.title} · Previous year questions</p>
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA]">Previous year questions</h2>
            </div>

            <div className="mb-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative lg:col-span-2">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996] dark:text-[#7A6F62]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by chapter…" className={`${INPUT} pl-10`} />
              </div>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={INPUT}>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject === 'All' ? 'All' : subject}</option>
                ))}
              </select>
              <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className={INPUT}>
                <option value="All">All difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {filteredPyqs.length === 0 ? (
              <EmptyState label="No PYQ booklets match your search or filters." />
            ) : (
              <div className={`${CARD} overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#EAE1D2] dark:border-[#383330] bg-[#FBF7F0] dark:bg-[#2A2725]">
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Subject & chapter</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Year</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Difficulty</th>
                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Question paper</th>
                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Step solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECDF]">
                      {filteredPyqs.map((pyq) => (
                        <tr key={pyq.id} className="transition-colors hover:bg-[#FBF7F0] dark:hover:bg-[#2A2725] dark:bg-[#2A2725]">
                          <td className="px-5 py-3.5">
                            <SubjectBadge subject={pyq.subject} />
                            <span className="mt-0.5 block text-xs text-[#8A7E6F] dark:text-[#A89F91]">{pyq.chapter}</span>
                          </td>
                          <td className="px-5 py-3.5 dash-mono text-xs font-medium tabular-nums text-[#6E645A]">{pyq.year}</td>
                          <td className="px-5 py-3.5"><DifficultyChip level={pyq.difficulty} /></td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex justify-end gap-1.5">
                              <button onClick={() => setActivePdfViewer({ title: `PYQ Question · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.questionUrl })} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F4E7E5] dark:hover:bg-[#380A14] dark:bg-[#380A14] hover:text-[#4A0E1B] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5]"><Eye size={15} /></button>
                              <button onClick={() => triggerDownload(pyq.questionUrl)} className={PILL_SOFT}><Download size={11} /> {pyq.questionSize}</button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex justify-end gap-1.5">
                              <button onClick={() => setActivePdfViewer({ title: `PYQ Solution · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.solutionUrl })} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F7EFD9] dark:hover:bg-[#362A0D] dark:bg-[#362A0D] hover:text-[#8A6A16] dark:text-[#E8CD82]"><Eye size={15} /></button>
                              <button onClick={() => triggerDownload(pyq.solutionUrl)} className={PILL_GOLD}><Download size={11} /> {pyq.solutionSize}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= PRACTICE SHEETS ================= */}
        {selectedExam && activeCategory === 'sheets' && (
          <div>
            <button onClick={handleBackToCategories} className={BACK_BTN}><ArrowLeft size={14} /> Back to categories</button>
            <div className="mt-4 mb-6">
              <p className={MICRO}>{currentExamInfo?.title} · Practice sheets</p>
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA]">Practice sheets</h2>
            </div>

            <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996] dark:text-[#7A6F62]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by title or chapter…" className={`${INPUT} pl-10`} />
              </div>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={`${INPUT} sm:w-52`}>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject === 'All' ? 'All' : subject}</option>
                ))}
              </select>
            </div>

            {filteredSheets.length === 0 ? (
              <EmptyState label="No practice drills match your search or subject filter." />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredSheets.map((sheet) => (
                  <div key={sheet.id} className={`${CARD} flex flex-col p-5`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16] dark:text-[#E8CD82]"><FileText size={18} /></span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full border border-[#EFE7D8] dark:border-[#332E2C] bg-[#FBF7F0] dark:bg-[#2A2725] px-2.5 py-1 text-[10px] font-bold text-[#8A7E6F] dark:text-[#A89F91]">{sheet.chapter}</span>
                        <SubjectBadge subject={sheet.subject} />
                      </div>
                    </div>
                    <h4 className="mt-4 text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{sheet.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#8A7E6F] dark:text-[#A89F91]">{sheet.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#F2ECDF] dark:border-[#2A2725] pt-4">
                      <span className="dash-mono text-[11px] text-[#A79A88]">File size · {sheet.fileSize}</span>
                      <div className="flex gap-1.5">
                        <button onClick={() => setActivePdfViewer({ title: sheet.title, fileUrl: sheet.fileUrl })} className={PILL_GHOST}><Eye size={12} /> View</button>
                        <button onClick={() => triggerDownload(sheet.fileUrl)} className={PILL_SOFT}><Download size={12} /> Download</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= DOUBT SUBMISSION ================= */}
        {selectedExam && activeCategory === 'doubts' && (
          <div>
            <button onClick={handleBackToCategories} className={BACK_BTN}><ArrowLeft size={14} /> Back to categories</button>
            <div className="mt-4 mb-8">
              <p className={MICRO}>{currentExamInfo?.title} · Doubt clarification</p>
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA]">Ask a doubt</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Doubt form */}
              <div className="lg:col-span-7">
                <div className={`${CARD} p-6`}>
                  <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Submit an academic doubt</h3>
                  <p className="mt-1 text-xs text-[#8A7E6F] dark:text-[#A89F91]">
                    Explain your concept difficulty or problem blocker. Prof. Ajesh Joe will review it and provide step-by-step guidance.
                  </p>

                  {doubtSubmitted && (
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#E7D7AE] bg-[#F7EFD9] dark:bg-[#362A0D] px-4 py-3 text-sm text-[#8A6A16] dark:text-[#E8CD82]">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                      <span>Doubt submitted. The professor will review it and post a step-by-step response.</span>
                    </div>
                  )}

                  <form onSubmit={handleDoubtSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className={FIELD_LABEL}>Your name</span>
                        <input type="text" required value={doubtForm.name} onChange={(e) => setDoubtForm({ ...doubtForm, name: e.target.value })} className={INPUT} placeholder="e.g. Siddharth" />
                      </label>
                      <label className="block">
                        <span className={FIELD_LABEL}>Your email</span>
                        <input type="email" required value={doubtForm.email} onChange={(e) => setDoubtForm({ ...doubtForm, email: e.target.value })} className={INPUT} placeholder="e.g. sid@mail.com" />
                      </label>
                    </div>

                    <label className="block">
                      <span className={FIELD_LABEL}>Subject & topic (or chapter)</span>
                      <input type="text" required value={doubtForm.subject} onChange={(e) => setDoubtForm({ ...doubtForm, subject: e.target.value })} className={INPUT} placeholder={`e.g. ${currentExamInfo?.title} — Rotational Dynamics`} />
                    </label>

                    <label className="block">
                      <span className={FIELD_LABEL}>Your question details</span>
                      <textarea required rows={4} value={doubtForm.question} onChange={(e) => setDoubtForm({ ...doubtForm, question: e.target.value })} className={INPUT} placeholder="State the numerical problem or concept blocker clearly…" />
                    </label>

                    <div>
                      <span className={FIELD_LABEL}>Attachment (optional)</span>
                      <FileUpload
                        value={doubtFile}
                        onFileSelect={setDoubtFile}
                        accept="image/*,.pdf"
                        placeholder="Click or drag an image / PDF to attach"
                      />
                    </div>

                    <button type="submit" disabled={doubtSubmitting} className={`${PRIMARY_BTN} w-full`} id="student-doubt-submit-btn">
                      <Send size={13} /> {doubtSubmitting ? 'Submitting…' : 'Submit academic doubt'}
                    </button>
                  </form>
                </div>
              </div>

              {/* FAQ */}
              <div className="lg:col-span-5">
                <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Frequently asked questions</h3>
                <p className="mt-1 text-xs text-[#8A7E6F] dark:text-[#A89F91]">Quick references on downloads, syllabus revisions and response timelines.</p>
                <div className="mt-5 space-y-2.5">
                  {faqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div key={faq.id} className="overflow-hidden rounded-xl border border-[#EAE1D2] dark:border-[#383330] bg-white dark:bg-[#22201F]">
                        <button
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] transition-colors hover:bg-[#FBF7F0] dark:hover:bg-[#2A2725] dark:bg-[#2A2725]"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown size={16} className={`shrink-0 text-[#8A7E6F] dark:text-[#A89F91] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="border-t border-[#F2ECDF] dark:border-[#2A2725] px-4 py-3.5 text-sm leading-relaxed text-[#5A534B] dark:text-[#A89F91]">{faq.answer}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ADDITIONAL RESOURCES ================= */}
        {selectedExam && activeCategory === 'resources' && (
          <div>
            <button onClick={handleBackToCategories} className={BACK_BTN}><ArrowLeft size={14} /> Back to categories</button>
            <div className="mt-4 mb-8">
              <p className={MICRO}>{currentExamInfo?.title} · Additional resources</p>
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA]">Additional resources</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className={`${CARD} flex flex-col p-6`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#380A14] text-[#4A0E1B] dark:text-[#F4E7E5]"><FileSpreadsheet size={20} /></span>
                <h3 className="dash-serif mt-4 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Syllabus blueprints & topic weights</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#8A7E6F] dark:text-[#A89F91]">
                  A mapped matrix of chapter distribution, sub-topic weights and question-occurrence frequencies compiled from the past 10 years of entrance examinations.
                </p>
                <div className="mt-5 flex justify-end">
                  <button onClick={() => triggerDownload('syllabus-blueprints.pdf')} className={PILL_SOFT}><Download size={12} /> Download matrix (820 KB)</button>
                </div>
              </div>

              <div className={`${CARD} flex flex-col p-6`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16] dark:text-[#E8CD82]"><BookOpen size={20} /></span>
                <h3 className="dash-serif mt-4 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Formula & fundamental constant sheets</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#8A7E6F] dark:text-[#A89F91]">
                  A rapid-revision pocket PDF covering electromagnetic vectors, rotational momenta, calculus limits and key physical constants (Planck, Boltzmann, speed of light).
                </p>
                <div className="mt-5 flex justify-end">
                  <button onClick={() => triggerDownload('formula-pocket-sheets.pdf')} className={PILL_SOFT}><Download size={12} /> Download sheets (1.4 MB)</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= WATCH VIDEO MODAL (real, from main) ================= */}
      {activeVideoModal && (
        <VideoWatchModal
          video={activeVideoModal}
          playlist={filteredVideos}
          onClose={() => setActiveVideoModal(null)}
          onSelectVideo={(v) => setActiveVideoModal(v)}
        />
      )}

      {/* ================= PDF VIEWER (real, from main) ================= */}
      {activePdfViewer && (
        <PDFViewer
          docInfo={{ title: activePdfViewer.title, fileUrl: activePdfViewer.fileUrl, isProfessor: false }}
          onClose={() => setActivePdfViewer(null)}
        />
      )}

    </div>
  );
}
