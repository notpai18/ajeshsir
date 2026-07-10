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
  Stethoscope,
  Hexagon,
  Star,
  LayoutGrid,
  List,
  ArrowDownUp,
  Library,
} from 'lucide-react';
import { ExamType, ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement, AnnouncementCategory } from '../types';
import { ResourceCard, ResourcePageLayout, ResourceHero, ResourceToolbar, ResourceEmptyState, ResourceGrid } from './resources';
import { BreadcrumbBar } from './BreadcrumbBar';
import { ExamHero, QuickAccessGrid, FeaturedResource, ResourceOverview, RecentUpdates, DownloadsLeaderboard, ExamSearchToolbar } from './exam';
import { VideoWatchModal } from './VideoWatchModal';
import { PDFViewer } from './pdf/PDFViewer';
import { FileUpload } from './FileUpload';
import { uploadDoubtAttachment } from '../services/doubtsService';
import { extractYouTubeId, getYoutubeThumbnail } from '../lib/youtube';
import type { PDFDocumentInfo } from './pdf/PDFContext';

import { SUBJECTS, SUBJECT_BADGE } from '../constants/subjects';

/* ------------------------------------------------------------------ *
 * Design tokens — shared "Professor's Study" system (see DESIGN_SYSTEM.md)
 * ------------------------------------------------------------------ */
const CARD =
  'rounded-2xl border border-[#EAE1D2] bg-white shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]';
const INPUT =
  'w-full rounded-xl border border-[#E3D8C5] bg-[#FBF7F0] px-3.5 py-2.5 text-sm text-[#22201F] placeholder:text-[#B3A996] outline-none transition focus:border-[#4A0E1B]/50 focus:bg-white focus:ring-4 focus:ring-[#4A0E1B]/10';
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A0E1B] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#380A14] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4A0E1B]/20 disabled:opacity-50';
const GHOST_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#E3D8C5] bg-white px-4 py-2.5 text-xs font-semibold text-[#4A443E] transition-colors hover:bg-[#F6F2EA]';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F]';
const BACK_BTN =
  'inline-flex items-center gap-1.5 text-xs font-bold text-[#4A0E1B] transition-colors hover:text-[#380A14]';
const FIELD_LABEL = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A7E6F]';
const PILL_SOFT =
  'inline-flex items-center gap-1.5 rounded-lg bg-[#F4E7E5] px-2.5 py-1.5 text-[11px] font-bold text-[#4A0E1B] transition-colors hover:bg-[#EEDAD7]';
const PILL_GHOST =
  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#6E645A] transition-colors hover:bg-[#F6F2EA] hover:text-[#22201F]';
const PILL_GOLD =
  'inline-flex items-center gap-1.5 rounded-lg bg-[#F7EFD9] px-2.5 py-1.5 text-[11px] font-bold text-[#8A6A16] transition-colors hover:bg-[#F1E6C9]';

const ANN_CAT: Record<AnnouncementCategory, { label: string; cls: string }> = {
  general: { label: 'General', cls: 'bg-[#EFE7D8] text-[#6E645A]' },
  exam: { label: 'Exam', cls: 'bg-[#F4E4E4] text-[#4A0E1B]' },
  resource: { label: 'Resource', cls: 'bg-[#F7EFD9] text-[#8A6A16]' },
  schedule: { label: 'Schedule', cls: 'bg-[#F4E2E5] text-[#7C2532]' }
};

/* ─── Subject badge component ────────────────────────────────────────────── */
function SubjectBadge({ subject }: { subject: string }) {
  const s = SUBJECT_BADGE[subject as keyof typeof SUBJECT_BADGE];
  if (!s) return <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A7E6F]">{subject}</span>;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.emoji} {s.label}
    </span>
  );
}

function DifficultyChip({ level }: { level: 'Easy' | 'Medium' | 'Hard' }) {
  const map = {
    Easy: 'bg-[#F7EFD9] text-[#8A6A16]',
    Medium: 'bg-[#F4E2E5] text-[#7C2532]',
    Hard: 'bg-[#F4E4E4] text-[#4A0E1B]'
  } as const;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${map[level]}`}>{level}</span>;
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EFD9] text-[#8A6A16]">
        <Search size={22} />
      </div>
      <p className="mt-4 text-sm font-semibold text-[#22201F]">Nothing found</p>
      <p className="mt-1 max-w-sm text-sm text-[#8A7E6F]">{label}</p>
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
  const [resourceViewMode, setResourceViewMode] = useState<'grid' | 'list'>('grid');
  const [resourceSort, setResourceSort] = useState<'recent' | 'popular'>('recent');

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
    <div className="dash-root min-h-screen bg-[#F6F2EA] py-12 text-[#22201F]">
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
                  <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-[#4A0E1B] bg-white text-[#4A0E1B]">
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#D9C2A2]/30 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 hover:border-[#D9C2A2] hover:shadow-[0_0_12px_rgba(217,194,162,0.3)] hover:-translate-y-0.5 transition-all duration-300 animate-[fadeInUp_0.8s_ease-out_forwards]"
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
                  className="group relative flex w-full max-w-[340px] flex-col overflow-hidden rounded-[24px] border border-[#EAE1D2] bg-white p-6 text-left shadow-[0_4px_12px_rgba(34,32,31,0.04)] transition-all duration-[220ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_20px_40px_rgba(74,14,27,0.12)] sm:w-[calc(50%-12px)] lg:w-[340px] h-[230px]"
                >
                  <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 bg-[#C9A13B] transition-transform duration-[220ms] ease-out group-hover:scale-x-100 origin-left"></div>
                  
                  <div className="flex items-start justify-between w-full">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#F4E7E5] text-[#4A0E1B] transition-colors duration-[220ms] ease-out group-hover:bg-[#F7EFD9] group-hover:text-[#8A6A16]">
                      {renderExamIcon(exam.icon)}
                    </span>
                    <span className="dash-mono rounded-full border border-[#EFE7D8] bg-[#FBF7F0] px-2.5 py-1 text-[10px] font-medium text-[#8A7E6F]">
                      {notes.filter(n => n.course === exam.id).length + videos.filter(v => v.course === exam.id).length + practiceSheets.filter(s => s.course === exam.id).length + pyqs.filter(p => p.course === exam.id).length} Resources
                    </span>
                  </div>
                  
                  <h3 className="dash-serif mt-5 text-xl font-bold text-[#22201F]">{exam.title}</h3>
                  <p className="mt-2 text-sm text-[#8A7E6F] line-clamp-1">{exam.description}</p>
                  
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
          <BreadcrumbBar
            backLabel={activeCategory ? "Back to " + (currentExamInfo?.title || "Library") : "Back to Library"}
            onBack={activeCategory ? handleBackToCategories : handleBackToExams}
            items={[
              { id: 'lib', label: 'Library', icon: <Library size={12} />, onClick: handleBackToExams },
              ...(selectedExam ? [{ 
                id: 'exam', 
                label: currentExamInfo?.title || '', 
                icon: <FlaskConical size={12} />, 
                onClick: activeCategory ? handleBackToCategories : undefined 
              }] : []),
              ...(activeCategory ? [{ 
                id: 'cat', 
                label: activeCategory === 'pyqs' ? 'PYQs' : activeCategory, 
                icon: activeCategory === 'notes' ? <BookOpen size={12} /> : 
                      activeCategory === 'videos' ? <VideoIcon size={12} /> : 
                      activeCategory === 'pyqs' ? <FileSpreadsheet size={12} /> :
                      activeCategory === 'sheets' ? <FileText size={12} /> :
                      activeCategory === 'doubts' ? <HelpCircle size={12} /> : <FolderOpen size={12} />
              }] : [])
            ]}
          />
        )}

        {/* ================= STEP 2: CATEGORY DASHBOARD ================= */}
        {selectedExam && !activeCategory && (
          <div className="animate-[fadeInUp_0.4s_ease-out_forwards]">

            <ExamHero
              title={currentExamInfo?.title || ''}
              description={currentExamInfo?.description || ''}
              stats={{
                notes: notes.filter(n => n.course === selectedExam).length,
                videos: videos.filter(v => v.course === selectedExam).length,
                pyqs: pyqs.filter(p => p.course === selectedExam).length,
                sheets: practiceSheets.filter(s => s.course === selectedExam).length,
                downloads: [...notes, ...pyqs, ...practiceSheets].reduce((acc, curr) => acc + (('downloadCount' in curr ? curr.downloadCount : 0) as number), 0)
              }}
            />

            <ExamSearchToolbar
              onSearch={setSearchQuery}
              selectedSubject={selectedSubject}
              onSubjectSelect={setSelectedSubject}
            />

            <QuickAccessGrid
              categories={categoryCards}
                onSelectCategory={(id: string) => setActiveCategory(id as any)}
            />
            
            <div className="mt-16 space-y-16">
              <FeaturedResource 
                item={notes.filter(n => n.course === selectedExam)[0]} 
                onPreview={() => {
                  const item = notes.filter(n => n.course === selectedExam)[0];
                  if(item) setActivePdfViewer({ title: item.title, fileUrl: item.fileUrl });
                }}
                onDownload={() => {
                  const item = notes.filter(n => n.course === selectedExam)[0];
                  if(item) handleDownloadFile(item.id, item.fileUrl);
                }}
              />

              <ResourceOverview 
                notesCount={notes.filter(n => n.course === selectedExam).length}
                videosCount={videos.filter(v => v.course === selectedExam).length}
                pyqsCount={pyqs.filter(p => p.course === selectedExam).length}
                sheetsCount={practiceSheets.filter(s => s.course === selectedExam).length}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentUpdates updates={announcements.filter(a => a.category === 'exam' || a.category === 'resource')} />
                <DownloadsLeaderboard items={[...notes].filter(n => n.course === selectedExam).sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0)).slice(0, 5)} />
              </div>
            </div>
          </div>
        )}

{/* ================= NOTES EXPLORER ================= */}
        {selectedExam && activeCategory === 'notes' && (
          <ResourcePageLayout
            onBack={handleBackToCategories}
            hero={
              <ResourceHero
                courseTitle={currentExamInfo?.title}
                title="Study Notes"
                description="Access high-quality study materials, comprehensive chapter summaries, and class notes."
                totalCount={notes.filter(n => n.course === selectedExam).length}
                totalLabel="Total Notes"
              />
            }
            toolbar={
              <ResourceToolbar
                subjects={availableSubjects}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortMode={resourceSort}
                onSortToggle={() => setResourceSort(s => s === 'recent' ? 'popular' : 'recent')}
                sortLabel={resourceSort === 'recent' ? 'Recently Added' : 'Most Popular'}
                viewMode={resourceViewMode}
                onViewModeChange={setResourceViewMode}
              />
            }
          >
            {filteredNotes.length === 0 ? (
              <ResourceEmptyState label="No study notes match your search or subject filter." />
            ) : (
              <ResourceGrid viewMode={resourceViewMode}>
                {filteredNotes.map((note) => (
                  <ResourceCard
                    key={note.id}
                    icon={FileText}
                    title={note.title}
                    description={note.description}
                    chapter={note.chapter}
                    subject={note.subject}
                    metadata={[
                      note.fileSize,
                      `${note.downloadCount || 0} downloads`
                    ]}
                    actions={[
                      {
                        icon: Eye,
                        label: 'View',
                        onClick: () => setActivePdfViewer({ title: note.title, fileUrl: note.fileUrl }),
                        variant: 'ghost'
                      },
                      {
                        icon: Download,
                        label: 'Download',
                        onClick: () => handleDownloadFile(note.id, note.fileUrl),
                        variant: 'primary'
                      }
                    ]}
                  />
                ))}
              </ResourceGrid>
            )}
          </ResourcePageLayout>
        )}

        {/* ================= LECTURES EXPLORER ================= */}
        {selectedExam && activeCategory === 'videos' && (
          <ResourcePageLayout
            onBack={handleBackToCategories}
            hero={
              <ResourceHero
                courseTitle={currentExamInfo?.title}
                title="Video Lectures"
                description="Watch curated chemistry lectures from Prof. Ajesh Joe."
                totalCount={videos.filter(v => v.course === selectedExam).length}
                totalLabel="Total Videos"
              />
            }
            toolbar={
              <ResourceToolbar
                subjects={availableSubjects}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortMode={resourceSort}
                onSortToggle={() => setResourceSort(s => s === 'recent' ? 'popular' : 'recent')}
                sortLabel={resourceSort === 'recent' ? 'Recently Added' : 'Most Popular'}
                viewMode={resourceViewMode}
                onViewModeChange={setResourceViewMode}
              />
            }
          >
            {filteredVideos.length === 0 ? (
              <ResourceEmptyState label="No lecture recordings match your search or subject filter." />
            ) : (
              <ResourceGrid viewMode={resourceViewMode}>
                {filteredVideos.map((video) => (
                  <ResourceCard
                    key={video.id}
                    icon={VideoIcon}
                    title={video.title}
                    description={video.description}
                    chapter={video.chapter}
                    subject={video.subject}
                    image={video.thumbnail || getYoutubeThumbnail(extractYouTubeId(video.youtubeLink), 'hqdefault')}
                    metadata={[
                      `Duration: ${video.duration}`
                    ]}
                    actions={[
                      {
                        icon: Play,
                        label: 'Watch',
                        onClick: () => setActiveVideoModal(video),
                        variant: 'primary'
                      },
                      {
                        icon: Paperclip,
                        label: 'Bookmark',
                        onClick: () => alert('Bookmarked'),
                        variant: 'secondary'
                      }
                    ]}
                  />
                ))}
              </ResourceGrid>
            )}
          </ResourcePageLayout>
        )}

        {/* ================= PYQ EXPLORER ================= */}
        {selectedExam && activeCategory === 'pyqs' && (
          <ResourcePageLayout
            onBack={handleBackToCategories}
            hero={
              <ResourceHero
                courseTitle={currentExamInfo?.title}
                title="Previous Year Questions"
                description="Original exam questions with step-by-step analytical solutions."
                totalCount={pyqs.filter(p => p.course === selectedExam).length}
                totalLabel="Total Sets"
              />
            }
            toolbar={
              <ResourceToolbar
                subjects={availableSubjects}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortMode={resourceSort}
                onSortToggle={() => setResourceSort(s => s === 'recent' ? 'popular' : 'recent')}
                sortLabel={resourceSort === 'recent' ? 'Recently Added' : 'Most Popular'}
                viewMode={resourceViewMode}
                onViewModeChange={setResourceViewMode}
                extraFilters={
                  <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="w-full sm:w-auto rounded-lg border border-[#E3D8C5] bg-[#FBF7F0] px-3 py-2 text-xs text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:bg-white focus:ring-2 focus:ring-[#4A0E1B]/10">
                    <option value="All">All difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                }
              />
            }
          >
            {filteredPyqs.length === 0 ? (
              <ResourceEmptyState label="No PYQ booklets match your search or filters." />
            ) : (
              <ResourceGrid viewMode={resourceViewMode}>
                {filteredPyqs.map((pyq) => (
                  <ResourceCard
                    key={pyq.id}
                    icon={FileSpreadsheet}
                    title={`${pyq.chapter} - ${pyq.year}`}
                    description={`Previous year question paper for ${pyq.chapter} from ${pyq.year}. Difficulty: ${pyq.difficulty}.`}
                    chapter={pyq.chapter}
                    subject={pyq.subject}
                    badges={[
                      <span key="year" className="inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold bg-[#F4E2E5] text-[#7C2532]">{pyq.year}</span>,
                      <span key="diff" className="inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold bg-[#F7EFD9] text-[#8A6A16]">{pyq.difficulty}</span>
                    ]}
                    metadata={[
                      `Q: ${pyq.questionSize} | Sol: ${pyq.solutionSize}`,
                      `Solutions Available`
                    ]}
                    actions={[
                      {
                        icon: Eye,
                        label: 'View Paper',
                        onClick: () => setActivePdfViewer({ title: `PYQ Question · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.questionUrl }),
                        variant: 'ghost'
                      },
                      {
                        icon: Download,
                        label: 'Download',
                        onClick: () => triggerDownload(pyq.questionUrl),
                        variant: 'primary'
                      },
                      {
                        icon: Eye,
                        label: 'Solutions',
                        onClick: () => setActivePdfViewer({ title: `PYQ Solution · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.solutionUrl }),
                        variant: 'secondary'
                      }
                    ]}
                  />
                ))}
              </ResourceGrid>
            )}
          </ResourcePageLayout>
        )}

        {/* ================= PRACTICE SHEETS ================= */}
        {selectedExam && activeCategory === 'sheets' && (
          <ResourcePageLayout
            onBack={handleBackToCategories}
            hero={
              <ResourceHero
                courseTitle={currentExamInfo?.title}
                title="Practice Sheets"
                description="Chapter drills graded by complexity to build proficiency."
                totalCount={practiceSheets.filter(s => s.course === selectedExam).length}
                totalLabel="Total Sheets"
              />
            }
            toolbar={
              <ResourceToolbar
                subjects={availableSubjects}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortMode={resourceSort}
                onSortToggle={() => setResourceSort(s => s === 'recent' ? 'popular' : 'recent')}
                sortLabel={resourceSort === 'recent' ? 'Recently Added' : 'Most Popular'}
                viewMode={resourceViewMode}
                onViewModeChange={setResourceViewMode}
              />
            }
          >
            {filteredSheets.length === 0 ? (
              <ResourceEmptyState label="No practice drills match your search or subject filter." />
            ) : (
              <ResourceGrid viewMode={resourceViewMode}>
                {filteredSheets.map((sheet) => (
                  <ResourceCard
                    key={sheet.id}
                    icon={FileText}
                    title={sheet.title}
                    description={sheet.description}
                    chapter={sheet.chapter}
                    subject={sheet.subject}
                    metadata={[
                      `Size: ${sheet.fileSize}`
                    ]}
                    actions={[
                      {
                        icon: Eye,
                        label: 'Open Sheet',
                        onClick: () => setActivePdfViewer({ title: sheet.title, fileUrl: sheet.fileUrl }),
                        variant: 'ghost'
                      },
                      {
                        icon: Download,
                        label: 'Download',
                        onClick: () => triggerDownload(sheet.fileUrl),
                        variant: 'primary'
                      }
                    ]}
                  />
                ))}
              </ResourceGrid>
            )}
          </ResourcePageLayout>
        )}

{/* ================= DOUBT SUBMISSION ================= */}
        {selectedExam && activeCategory === 'doubts' && (
          <div>
            <button onClick={handleBackToCategories} className={BACK_BTN}><ArrowLeft size={14} /> Back to categories</button>
            <div className="mt-4 mb-8">
              <p className={MICRO}>{currentExamInfo?.title} · Doubt clarification</p>
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F]">Ask a doubt</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Doubt form */}
              <div className="lg:col-span-7">
                <div className={`${CARD} p-6`}>
                  <h3 className="dash-serif text-lg font-semibold text-[#22201F]">Submit an academic doubt</h3>
                  <p className="mt-1 text-xs text-[#8A7E6F]">
                    Explain your concept difficulty or problem blocker. Prof. Ajesh Joe will review it and provide step-by-step guidance.
                  </p>

                  {doubtSubmitted && (
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#E7D7AE] bg-[#F7EFD9] px-4 py-3 text-sm text-[#8A6A16]">
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
                <h3 className="dash-serif text-lg font-semibold text-[#22201F]">Frequently asked questions</h3>
                <p className="mt-1 text-xs text-[#8A7E6F]">Quick references on downloads, syllabus revisions and response timelines.</p>
                <div className="mt-5 space-y-2.5">
                  {faqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div key={faq.id} className="overflow-hidden rounded-xl border border-[#EAE1D2] bg-white">
                        <button
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-[#22201F] transition-colors hover:bg-[#FBF7F0]"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown size={16} className={`shrink-0 text-[#8A7E6F] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="border-t border-[#F2ECDF] px-4 py-3.5 text-sm leading-relaxed text-[#5A534B]">{faq.answer}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Answered Doubts Feed */}
            {doubts.filter(d => d.isAnswered).length > 0 && (
              <div className="mt-12">
                <h3 className="dash-serif text-xl font-semibold text-[#22201F] mb-6">Recent Answered Queries</h3>
                <div className="space-y-6">
                  {doubts.filter(d => d.isAnswered).map(doubt => (
                    <div key={doubt.id} className={`${CARD} p-6`}>
                      <div className="flex flex-col gap-6">
                        {/* Student Question (Right aligned like iMessage) */}
                        <div className="flex justify-end">
                          <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-tr-sm bg-[#4A0E1B] text-white p-4 shadow-sm">
                            <p className="text-xs text-white/70 mb-1 font-semibold">{doubt.name} • {doubt.subject}</p>
                            <p className="text-sm leading-relaxed">{doubt.question}</p>
                            {doubt.attachmentUrl && (
                              <a href={doubt.attachmentUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs hover:bg-white/20 transition-colors">
                                <FileText size={14} /> Attached File
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Professor Reply (Left aligned like iMessage) */}
                        <div className="flex justify-start">
                          <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-tl-sm bg-[#FBF6EA] border border-[#F7EFD9] text-[#3A342E] p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A13B] text-white font-bold text-[10px]">AJ</span>
                              <p className="text-xs font-bold text-[#8A6A16]">Prof. Ajesh Joe</p>
                            </div>
                            
                            {/* Rich Replies */}
                            {doubt.replies && doubt.replies.length > 0 ? (
                              <div className="space-y-4">
                                {doubt.replies.map((reply, idx) => (
                                  <div key={reply.id}>
                                    <div 
                                      className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1"
                                      dangerouslySetInnerHTML={{ __html: reply.reply_text || '' }} 
                                    />
                                    {/* Images */}
                                    {reply.image_urls && reply.image_urls.length > 0 && (
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        {reply.image_urls.map((url, i) => (
                                          <img key={i} src={url} alt="reply" className="h-32 w-auto rounded-lg object-cover shadow-sm border border-[#EFE7D8]" />
                                        ))}
                                      </div>
                                    )}
                                    {/* Videos */}
                                    {reply.video_urls && reply.video_urls.length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        {reply.video_urls.map((url, i) => (
                                          <video key={i} src={url} controls className="h-48 w-auto rounded-lg shadow-sm border border-[#EFE7D8]" />
                                        ))}
                                      </div>
                                    )}
                                    {/* Audio */}
                                    {reply.audio_urls && reply.audio_urls.length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        {reply.audio_urls.map((url, i) => (
                                          <audio key={i} src={url} controls className="w-full max-w-sm" />
                                        ))}
                                      </div>
                                    )}
                                    {/* Docs */}
                                    {reply.attachment_urls && reply.attachment_urls.length > 0 && (
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        {reply.attachment_urls.map((url, i) => (
                                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#EAE1D2] bg-white px-3 py-2 text-xs font-semibold text-[#8A6A16] hover:bg-[#FBF6EA]">
                                            <Download size={14} /> Download Attachment {i + 1}
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed">{doubt.answerText}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

                {/* ================= ADDITIONAL RESOURCES ================= */}
        {selectedExam && activeCategory === 'resources' && (
          <ResourcePageLayout
            onBack={handleBackToCategories}
            hero={
              <ResourceHero
                courseTitle={currentExamInfo?.title}
                title="Additional Resources"
                description="Syllabus blueprints, formula sheets, reference books and lab manuals."
                totalCount={2}
                totalLabel="Total Items"
              />
            }
            toolbar={
              <ResourceToolbar
                subjects={['All']}
                selectedSubject={'All'}
                onSubjectChange={() => {}}
                searchQuery={''}
                onSearchChange={() => {}}
                viewMode={resourceViewMode}
                onViewModeChange={setResourceViewMode}
              />
            }
          >
            <ResourceGrid viewMode={resourceViewMode}>
              <ResourceCard
                icon={FileSpreadsheet}
                title="Syllabus blueprints & topic weights"
                description="A mapped matrix of chapter distribution, sub-topic weights and question-occurrence frequencies compiled from the past 10 years of entrance examinations."
                chapter="General"
                subject="All"
                metadata={["820 KB"]}
                actions={[
                  {
                    icon: Download,
                    label: 'Download',
                    onClick: () => triggerDownload('syllabus-blueprints.pdf'),
                    variant: 'primary'
                  }
                ]}
              />
              <ResourceCard
                icon={BookOpen}
                title="Formula & fundamental constant sheets"
                description="A rapid-revision pocket PDF covering electromagnetic vectors, rotational momenta, calculus limits and key physical constants."
                chapter="Reference"
                subject="All"
                metadata={["1.4 MB"]}
                actions={[
                  {
                    icon: Download,
                    label: 'Download',
                    onClick: () => triggerDownload('formula-pocket-sheets.pdf'),
                    variant: 'primary'
                  }
                ]}
              />
            </ResourceGrid>
          </ResourcePageLayout>
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
