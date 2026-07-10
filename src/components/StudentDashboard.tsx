/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowLeft,
  FileText,
  Video as VideoIcon,
  HelpCircle,
  FolderOpen,
  Download,
  Eye,
  Bookmark,
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
  Stethoscope,
  Hexagon,
  Star,
  LayoutGrid,
  List,
  ArrowDownUp,
  Check
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
  'rounded-2xl border border-[#EAE1D2] dark:border-[#4A433E] bg-white dark:bg-[#22201F] shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]';
const INPUT =
  'w-full rounded-xl border border-[#E3D8C5] bg-[#FBF7F0] dark:bg-[#2A2726] px-3.5 py-2.5 text-sm text-[#22201F] dark:text-[#F6F2EA] placeholder:text-[#B3A996] outline-none transition focus:border-[#4A0E1B]/50 focus:bg-white dark:bg-[#22201F] focus:ring-4 focus:ring-[#4A0E1B]/10';
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A0E1B] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#380A14] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4A0E1B]/20 disabled:opacity-50';
const GHOST_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#E3D8C5] bg-white dark:bg-[#22201F] px-4 py-2.5 text-xs font-semibold text-[#4A443E] transition-colors hover:bg-[#F6F2EA] dark:bg-[#1A1817]';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F] dark:text-[#A89F91]';
const BACK_BTN =
  'inline-flex items-center gap-1.5 text-xs font-bold text-[#4A0E1B] transition-colors hover:text-[#380A14]';
const FIELD_LABEL = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A7E6F] dark:text-[#A89F91]';
const PILL_SOFT =
  'inline-flex items-center gap-1.5 rounded-lg bg-[#F4E7E5] dark:bg-[#38151A] px-2.5 py-1.5 text-[11px] font-bold text-[#4A0E1B] transition-colors hover:bg-[#EEDAD7]';
const PILL_GHOST =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#6E645A] transition-colors hover:bg-[#F6F2EA] dark:bg-[#1A1817] hover:text-[#22201F] dark:text-[#F6F2EA]';
const PILL_GOLD =
  'inline-flex items-center gap-1.5 rounded-lg bg-[#F7EFD9] dark:bg-[#362A0D] px-2.5 py-1.5 text-[11px] font-bold text-[#8A6A16] transition-colors hover:bg-[#F1E6C9]';

const ANN_CAT: Record<AnnouncementCategory, { label: string; cls: string }> = {
  general: { label: 'General', cls: 'bg-[#EFE7D8] text-[#6E645A]' },
  exam: { label: 'Exam', cls: 'bg-[#F4E4E4] text-[#4A0E1B]' },
  resource: { label: 'Resource', cls: 'bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]' },
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

function DifficultyChip({ level }: { level: 'Easy' | 'Moderate' | 'Hard' }) {
  const map = {
    Easy: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
    Moderate: 'bg-[#FFF8E1] text-[#F57F17] border-[#FFECB3]',
    Hard: 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]',
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold border ${map[level]}`}>{level}</span>;
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] dark:bg-[#2A2726] px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]">
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

export default function StudentDashboard(props: StudentDashboardProps) {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboardContent {...props} />} />
      <Route path="/:examId" element={<StudentDashboardContent {...props} />} />
      <Route path="/:examId/:categoryId" element={<StudentDashboardContent {...props} />} />
    </Routes>
  );
}

function StudentDashboardContent({
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
  const { examId, categoryId } = useParams();
  const navigate = useNavigate();

  // Navigation States within student portal derived from URL
  const selectedExam = examId || null;
  const activeCategory = categoryId as 'notes' | 'videos' | 'pyqs' | 'sheets' | 'doubts' | 'resources' | null;

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
  const [noteSort, setNoteSort] = useState<'recent' | 'popular' | 'alphabetical' | 'size'>('recent');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  // Ref for click-outside detection for custom sort dropdown
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ref and logic for "/" search hotkey
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Progress State
  const [studiedNotes, setStudiedNotes] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('studiedNotes') || '[]')); } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('studiedNotes', JSON.stringify([...studiedNotes]));
  }, [studiedNotes]);

  const toggleStudied = (id: string) => {
    setStudiedNotes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  // Dynamic Lucide helper mapping for Exam Icons
  const renderExamIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Atom': return <Atom strokeWidth={1.5} size={28} />;
      case 'FlaskConical': return (
        <div className="relative">
          <FlaskConical strokeWidth={1.5} size={28} />
          <Star strokeWidth={1.5} size={10} className="absolute -top-1 -right-1" />
        </div>
      );
      case 'Stethoscope': return <Stethoscope strokeWidth={1.5} size={28} />;
      case 'Hexagon': return <Hexagon strokeWidth={1.5} size={28} />;
      case 'GraduationCap': return <GraduationCap strokeWidth={1.5} size={28} />;
      default: return <BookOpen strokeWidth={1.5} size={28} />;
    }
  };

  const getExamColor = (examId: string) => {
    switch (examId) {
      case 'jee-main': return '#C0713D';
      case 'jee-advanced': return '#6B2737';
      case 'neet': return '#6B7D5A';
      case 'net': return '#4A5A6B';
      case 'msc-entrance': return '#A87B2E';
      default: return '#4A0E1B';
    }
  };

  const currentExamInfo = useMemo(() => {
    return exams.find(e => e.id === selectedExam);
  }, [exams, selectedExam]);

  // RESET state on nav back
  const handleBackToExams = () => {
    navigate('/resources');
    setSearchQuery('');
    setSelectedSubject('All');
  };

  const handleBackToCategories = () => {
    navigate(`/resources/${selectedExam}`);
    setSearchQuery('');
    setSelectedSubject('All');
  };

  const setSelectedExam = (id: string) => navigate(`/resources/${id}`);
  const setActiveCategory = (id: string) => navigate(`/resources/${selectedExam}/${id}`);

  // SUBJECT filters — always the canonical three subjects (+ 'All')
  const availableSubjects = useMemo(() => {
    return ['All', ...SUBJECTS];
  }, []);

  // Dynamic filtering algorithms
  const filteredNotes = useMemo(() => {
    const filtered = notes.filter(note => {
      if (note.course !== selectedExam) return false;
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || 
                             note.subject === selectedSubject || 
                             (note.tags && note.tags.includes(selectedSubject));
      return matchesSearch && matchesSubject;
    });

    // Apply Sorting
    return filtered.sort((a, b) => {
      if (noteSort === 'popular') return (b.downloadCount || 0) - (a.downloadCount || 0);
      if (noteSort === 'alphabetical') return a.title.localeCompare(b.title);
      if (noteSort === 'size') {
        const sizeA = parseFloat(a.fileSize) || 0;
        const sizeB = parseFloat(b.fileSize) || 0;
        return sizeB - sizeA;
      }
      // 'recent' by default - using ID or mock date (here we'll just reverse order for recent simulation)
      return -1; // Assuming initial order is from data source
    });
  }, [notes, selectedExam, searchQuery, selectedSubject, noteSort]);

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
                    <Atom className="text-[#4A0E1B]" size={48} strokeWidth={1.5} />
                  </div>
                  <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-[#4A0E1B] bg-white dark:bg-[#22201F] text-[#4A0E1B]">
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
                  className="group relative flex w-full max-w-[340px] flex-col overflow-hidden rounded-[24px] border border-[#EAE1D2] dark:border-[#4A433E] bg-white dark:bg-[#22201F] p-6 text-left shadow-[0_4px_12px_rgba(34,32,31,0.04)] transition-all duration-[220ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_20px_40px_rgba(74,14,27,0.12)] sm:w-[calc(50%-12px)] lg:w-[340px] h-[230px]"
                >
                  <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 bg-[#C9A13B] transition-transform duration-[220ms] ease-out group-hover:scale-x-100 origin-left"></div>
                  
                  <div className="flex items-start justify-between w-full">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#F4E7E5] dark:bg-[#38151A] text-[#4A0E1B] transition-colors duration-[220ms] ease-out group-hover:bg-[#F7EFD9] dark:bg-[#362A0D] group-hover:text-[#8A6A16]">
                      {renderExamIcon(exam.icon)}
                    </span>
                    <span className="dash-mono rounded-full border border-[#EFE7D8] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] px-2.5 py-1 text-[10px] font-medium text-[#8A7E6F] dark:text-[#A89F91]">
                      {notes.filter(n => n.course === exam.id).length + videos.filter(v => v.course === exam.id).length + practiceSheets.filter(s => s.course === exam.id).length + pyqs.filter(p => p.course === exam.id).length} Resources
                    </span>
                  </div>
                  
                  <h3 className="dash-serif mt-5 text-xl font-bold text-[#22201F] dark:text-[#F6F2EA]">{exam.title}</h3>
                  <p className="mt-2 text-sm text-[#8A7E6F] dark:text-[#A89F91] line-clamp-1">{exam.description}</p>
                  
                  <div className="mt-auto pt-4 flex items-center text-[#4A0E1B] font-bold text-xs uppercase tracking-widest">
                    Explore <ArrowRight size={14} className="ml-1.5 transition-transform duration-[220ms] ease-out group-hover:translate-x-2" />
                  </div>
                </button>
              ))}
            </div>


          </div>
        )}

        {/* ================= BREADCRUMBS ================= */}
        {(selectedExam || activeCategory) && (
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#8A7E6F] dark:text-[#A89F91]">
            <button onClick={handleBackToExams} className="transition-colors hover:text-[#4A0E1B]">Library</button>
            {selectedExam && (
              <>
                <ChevronRight size={13} className="text-[#C0A98B]" />
                <button
                  onClick={handleBackToCategories}
                  className={`transition-colors hover:text-[#4A0E1B] ${!activeCategory ? 'text-[#4A0E1B]' : ''}`}
                >
                  {currentExamInfo?.title}
                </button>
              </>
            )}
            {activeCategory && (
              <>
                <ChevronRight size={13} className="text-[#C0A98B]" />
                <span className="capitalize text-[#4A0E1B]">{activeCategory}</span>
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

            <div className="mb-10 border-b border-[#EAE1D2] dark:border-[#4A433E] pb-8">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4E7E5] to-[#F3EAD8] text-[#4A0E1B]">
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
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#38151A] text-[#4A0E1B]">{cat.icon}</span>
                    {cat.count !== null && (
                      <span className="dash-mono rounded-full border border-[#EFE7D8] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] px-2.5 py-1 text-[11px] font-medium text-[#8A7E6F] dark:text-[#A89F91]">
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
          <div key={selectedExam} className="animate-[fadeInUp_0.4s_ease-out_forwards]">
            
            {/* Dynamic Breadcrumbs */}
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-[#8A7E6F] dark:text-[#A89F91]">
              <button onClick={handleBackToExams} className="transition-colors hover:text-[#4A0E1B]">Library</button>
              <span>›</span>
              <button onClick={handleBackToCategories} className="transition-colors hover:text-[#4A0E1B]">{currentExamInfo?.title}</button>
              <span>›</span>
              <span className="text-[#22201F] dark:text-[#F6F2EA]">Study Notes</span>
            </div>
            
            {/* 1. Premium Hero */}
            <div className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br ${currentExamInfo?.themeGradient || 'from-[#4A0E1B] to-[#7C2532]'} p-6 sm:p-8 text-white shadow-[0_12px_24px_-12px_rgba(74,14,27,0.5)] mb-8`}>
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="dash-serif text-2xl md:text-3xl font-semibold">{currentExamInfo?.heroTitle || 'Study Notes'}</h2>
                  <p className="mt-2 text-sm text-white/70 max-w-md">
                    {currentExamInfo?.heroDescription || 'Access chapter-wise Chemistry notes for JEE Main covering Physical, Organic and Inorganic Chemistry with formula sheets, NCERT concepts and previous year important topics.'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <div className="rounded-[12px] bg-[#5A2436] p-4 text-center min-w-[160px]">
                    <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#A8909A]">Total Notes</p>
                    <p className="dash-mono text-[32px] font-bold text-white mt-2 leading-none">{notes.filter(n => n.course === selectedExam).length}</p>
                    
                    <div className="mt-[8px] text-left w-full">
                      <div className="text-[11px] font-medium text-[#C9B8C0] mb-1">
                        Progress
                      </div>
                      <div className="h-[6px] w-full bg-[#4A1D2D] rounded-[3px] overflow-hidden">
                        <div 
                          className="h-full bg-[#E8B4A8] transition-all duration-500 ease-out" 
                          style={{ width: `${Math.max(5, Math.round((notes.filter(n => n.course === selectedExam && studiedNotes.has(n.id)).length / Math.max(1, notes.filter(n => n.course === selectedExam).length)) * 100))}%`, borderRadius: '3px' }} 
                        />
                      </div>
                      <div className="mt-1 text-[11px] font-medium text-[#C9B8C0]">
                        {notes.filter(n => n.course === selectedExam && studiedNotes.has(n.id)).length} / {notes.filter(n => n.course === selectedExam).length} reviewed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Unified Toolbar & 3. Subject Navigation */}
            <div className="my-[20px] flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-[16px] bg-[#FFFFFF] rounded-[16px] py-[10px] px-[16px] shadow-[0_2px_8px_rgba(90,36,54,0.05),0_1px_2px_rgba(90,36,54,0.04)] border border-[#F0E9E2]">
              
              {/* LEFT GROUP - Subject tabs */}
              <div className="flex relative bg-[#F7F2EC] rounded-[12px] p-[4px] gap-[2px] w-full sm:w-auto overflow-x-auto no-scrollbar">
                {(currentExamInfo?.filters || availableSubjects).map((subject) => {
                  const isActive = selectedSubject === subject;
                  let Icon = LayoutGrid;
                  if (subject === 'Physical Chemistry') Icon = Atom;
                  else if (subject === 'Organic Chemistry') Icon = Hexagon;
                  else if (subject === 'Inorganic Chemistry') Icon = FlaskConical;
                  
                  return (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`relative z-10 flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-semibold rounded-[9px] transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 active:scale-95 ${
                        isActive
                          ? 'text-[#FFFFFF]'
                          : 'text-[#6B5D54] hover:bg-[#EFE6DC] hover:text-[#3A2E28]'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="subject-pill"
                          className="absolute inset-0 bg-[#5A2436] rounded-[9px] shadow-[0_2px_6px_rgba(90,36,54,0.35)] -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <Icon size={14} className={`transition-colors duration-[250ms] ${isActive ? 'text-[#F3D9CE]' : 'text-[#B8A99C]'}`} />
                      {subject}
                    </button>
                  );
                })}
              </div>
              
              {/* RIGHT GROUP - Search, Sort, View */}
              <div className="flex flex-col sm:flex-row items-center gap-[10px] w-full sm:w-auto">
                {/* Search */}
                <div className={`relative flex items-center transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isSearchFocused ? 'w-full sm:w-[320px]' : 'w-full sm:w-[240px]'}`}>
                  <Search size={16} className={`pointer-events-none absolute left-[12px] transition-colors duration-[250ms] ${isSearchFocused ? 'text-[#5A2436]' : 'text-[#B8A99C]'}`} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full h-[40px] rounded-[10px] border-[1.5px] border-transparent bg-[#FAF6F1] pl-[38px] pr-[14px] text-[13px] text-[#22201F] dark:text-[#F6F2EA] placeholder:text-[#B0A296] outline-none transition-all duration-[250ms] focus:border-[#D9A9A0] focus:bg-[#FFFFFF] focus:shadow-[0_0_0_4px_rgba(217,169,160,0.15)]"
                  />
                  {!searchQuery && !isSearchFocused && (
                    <div className="pointer-events-none absolute right-[12px] flex h-[20px] items-center justify-center rounded-[4px] bg-[#EBE3DC] px-[6px] text-[11px] font-bold text-[#C4B6AA]">
                      /
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-[10px] w-full sm:w-auto">
                  {/* Custom Sort Dropdown */}
                  <div className="relative w-full sm:w-auto" ref={sortDropdownRef}>
                    <button
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className={`h-[40px] w-full sm:w-auto flex items-center justify-between gap-[8px] rounded-[10px] border-[1.5px] bg-[#FAF6F1] px-[14px] text-[13px] font-medium text-[#3A2E28] transition-all duration-[250ms] ${
                        isSortDropdownOpen
                          ? 'border-[#D9A9A0] bg-white dark:bg-[#22201F] shadow-[0_0_0_4px_rgba(217,169,160,0.15)]'
                          : 'border-[#F0E9E2] hover:border-[#D9C7B8]'
                      }`}
                    >
                      <span className="whitespace-nowrap">
                        {noteSort === 'recent' ? 'Most Recent' : 
                         noteSort === 'popular' ? 'Most Downloaded' :
                         noteSort === 'alphabetical' ? 'Alphabetical A-Z' : 'File Size'}
                      </span>
                      <ChevronDown size={12} className={`text-[#8A7A6D] transition-transform duration-[200ms] ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
  
                    <AnimatePresence>
                      {isSortDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 top-[calc(100%+8px)] z-50 w-full sm:min-w-[180px] rounded-[10px] bg-white dark:bg-[#22201F] p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#F0E9E2]"
                        >
                          {[
                            { id: 'recent', label: 'Most Recent' },
                            { id: 'popular', label: 'Most Downloaded' },
                            { id: 'alphabetical', label: 'Alphabetical A-Z' },
                            { id: 'size', label: 'File Size' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                setNoteSort(opt.id as any);
                                setIsSortDropdownOpen(false);
                              }}
                              className="flex w-full items-center justify-between rounded-[6px] px-[12px] py-[8px] text-left text-[13px] text-[#3A2E28] transition-colors hover:bg-[#F7F2EC]"
                            >
                              {opt.label}
                              {noteSort === opt.id && <Check size={14} className="text-[#5A2436]" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
  
                  {/* Grid/List View Toggle */}
                  <div className="flex relative bg-[#F7F2EC] rounded-[10px] p-[3px] h-[40px] shrink-0 ml-auto sm:ml-0">
                    <button
                      onClick={() => setNoteViewMode('grid')}
                      className={`relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded-[7px] transition-colors duration-[200ms] active:scale-95 ${noteViewMode === 'grid' ? 'text-[#5A2436]' : 'text-[#B8A99C] hover:bg-black/5'}`}
                    >
                      {noteViewMode === 'grid' && (
                        <motion.div 
                          layoutId="view-pill"
                          className="absolute inset-0 bg-white dark:bg-[#22201F] rounded-[7px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <LayoutGrid size={14} />
                    </button>
                    <button
                      onClick={() => setNoteViewMode('list')}
                      className={`relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded-[7px] transition-colors duration-[200ms] active:scale-95 ${noteViewMode === 'list' ? 'text-[#5A2436]' : 'text-[#B8A99C] hover:bg-black/5'}`}
                    >
                      {noteViewMode === 'list' && (
                        <motion.div 
                          layoutId="view-pill"
                          className="absolute inset-0 bg-white dark:bg-[#22201F] rounded-[7px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <List size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Notes Grid & 5. Premium Note Card */}
            {filteredNotes.length === 0 ? (
              <EmptyState label="No study notes match your search or subject filter." />
            ) : (
              <div className={`grid gap-[20px] ${noteViewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredNotes.map((note, idx) => {
                  let customStyles = { bg: '#F4E7E5', text: '#4A0E1B' }; // fallback
                  if (note.title === 'First and Second Law Applications') customStyles = { bg: '#FDECEA', text: '#C0392B' };
                  else if (note.title === 'Chemical and Ionic Equilibrium') customStyles = { bg: '#EAF4EC', text: '#3C8C5B' };
                  else if (note.title === 'Cells, EMF, and Nernst Equation') customStyles = { bg: '#EAF0FB', text: '#3A5FA6' };
                  else if (note.title === 'Rate Laws and Reaction Order') customStyles = { bg: '#FBF0E4', text: '#B8792E' };
                  else {
                    const iconColors = [
                      { bg: '#F4E7E5', text: '#4A0E1B' },
                      { bg: '#E8F5E9', text: '#2E7D32' },
                      { bg: '#E3F2FD', text: '#1565C0' },
                      { bg: '#FFF3E0', text: '#E65100' },
                    ];
                    customStyles = iconColors[idx % iconColors.length];
                  }
                  
                  return (
                  <div key={note.id} className="flex flex-col h-full p-[20px] rounded-[16px] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] transition-all duration-[0.15s] ease-[ease] group">
                    <div className="flex items-start gap-4">
                      <span 
                        className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px]"
                        style={{ backgroundColor: customStyles.bg, color: customStyles.text }}
                      >
                        <FileText size={20} />
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="mb-[12px] flex flex-wrap items-center gap-[8px]">
                          <span className="inline-flex items-center rounded-full bg-[#F4F4F4] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A]">
                            Topic: {note.chapter}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#F4F4F4] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#D4A24C' }} />
                            {note.subject}
                          </span>
                        </div>
                        <h4 className="text-[15px] font-bold text-[#22201F] dark:text-[#F6F2EA] line-clamp-2 leading-[1.3]">
                          {note.title}
                        </h4>
                      </div>
                    </div>
                    
                    <p className="mt-[12px] text-[13px] leading-[1.5] text-[#5C5C5C] line-clamp-2">
                      {note.description}
                    </p>
                    
                    <div className="mt-auto pt-[16px]">
                      <div className="h-[1px] w-full bg-[#EEE8E0] mb-[16px]" />
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group/check">
                          <input 
                            type="checkbox" 
                            checked={studiedNotes.has(note.id)} 
                            onChange={() => toggleStudied(note.id)}
                            className="h-[14px] w-[14px] rounded border-[#C0A98B] text-[#5A2436] focus:ring-[#5A2436]/30 cursor-pointer"
                          />
                          <span className={`text-[11px] font-bold uppercase tracking-[0.05em] transition-colors ${studiedNotes.has(note.id) ? 'text-[#5A2436]' : 'text-[#8B8B8B] group-hover/check:text-[#4A4A4A]'}`}>
                            MARK REVIEWED
                          </span>
                        </label>
  
                        <div className="flex gap-[8px]">
                          <button onClick={() => setActivePdfViewer({ title: note.title, fileUrl: note.fileUrl })} className="flex h-[40px] items-center justify-center rounded-[8px] border border-[#E0D5CC] bg-white dark:bg-[#22201F] px-[16px] text-[13px] font-bold text-[#5A2436] transition-all hover:bg-[#F9F7F5]">
                            <Eye size={14} className="mr-1.5" /> View
                          </button>
                          <button onClick={() => handleDownloadFile(note.id, note.fileUrl)} className="flex h-[40px] items-center justify-center rounded-[8px] bg-[#F3D9CE] px-[16px] text-[13px] font-bold text-[#8A3D2C] transition-all hover:bg-[#EBD2C7]">
                            <Download size={14} className="mr-1.5" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
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
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-[#22201F]/95 text-[#4A0E1B] shadow-lg transition-transform group-hover:scale-105">
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
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
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
                      <tr className="border-b border-[#EAE1D2] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726]">
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Subject & chapter</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Year</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Difficulty</th>
                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Question paper</th>
                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91]">Step solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECDF]">
                      {filteredPyqs.map((pyq) => (
                        <tr key={pyq.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726]">
                          <td className="px-5 py-3.5">
                            <SubjectBadge subject={pyq.subject} />
                            <span className="mt-0.5 block text-xs text-[#8A7E6F] dark:text-[#A89F91]">{pyq.chapter}</span>
                          </td>
                          <td className="px-5 py-3.5 dash-mono text-xs font-medium tabular-nums text-[#6E645A]">{pyq.year}</td>
                          <td className="px-5 py-3.5"><DifficultyChip level={pyq.difficulty} /></td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex justify-end gap-1.5">
                              <button onClick={() => setActivePdfViewer({ title: `PYQ Question · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.questionUrl })} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F4E7E5] dark:bg-[#38151A] hover:text-[#4A0E1B]"><Eye size={15} /></button>
                              <button onClick={() => triggerDownload(pyq.questionUrl)} className={PILL_SOFT}><Download size={11} /> {pyq.questionSize}</button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex justify-end gap-1.5">
                              <button onClick={() => setActivePdfViewer({ title: `PYQ Solution · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.solutionUrl })} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F7EFD9] dark:bg-[#362A0D] hover:text-[#8A6A16]"><Eye size={15} /></button>
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
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
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
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]"><FileText size={18} /></span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full border border-[#EFE7D8] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] px-2.5 py-1 text-[10px] font-bold text-[#8A7E6F] dark:text-[#A89F91]">{sheet.chapter}</span>
                        <SubjectBadge subject={sheet.subject} />
                      </div>
                    </div>
                    <h4 className="mt-4 text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{sheet.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#8A7E6F] dark:text-[#A89F91]">{sheet.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#F2ECDF] dark:border-[#383330] pt-4">
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
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#E7D7AE] bg-[#F7EFD9] dark:bg-[#362A0D] px-4 py-3 text-sm text-[#8A6A16]">
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
                      <div key={faq.id} className="overflow-hidden rounded-xl border border-[#EAE1D2] dark:border-[#4A433E] bg-white dark:bg-[#22201F]">
                        <button
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726]"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown size={16} className={`shrink-0 text-[#8A7E6F] dark:text-[#A89F91] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="border-t border-[#F2ECDF] dark:border-[#383330] px-4 py-3.5 text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD]">{faq.answer}</div>
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
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#38151A] text-[#4A0E1B]"><FileSpreadsheet size={20} /></span>
                <h3 className="dash-serif mt-4 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Syllabus blueprints & topic weights</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#8A7E6F] dark:text-[#A89F91]">
                  A mapped matrix of chapter distribution, sub-topic weights and question-occurrence frequencies compiled from the past 10 years of entrance examinations.
                </p>
                <div className="mt-5 flex justify-end">
                  <button onClick={() => triggerDownload('syllabus-blueprints.pdf')} className={PILL_SOFT}><Download size={12} /> Download matrix (820 KB)</button>
                </div>
              </div>

              <div className={`${CARD} flex flex-col p-6`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]"><BookOpen size={20} /></span>
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
