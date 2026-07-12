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
  Check,
  Target,
  Library
} from 'lucide-react';
import { ExamType, ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement, AnnouncementCategory } from '../types';
import { VideoWatchModal } from './VideoWatchModal';
import { PDFViewer } from './pdf/PDFViewer';
import { extractYouTubeId, getYoutubeThumbnail } from '../lib/youtube';
import type { PDFDocumentInfo } from './pdf/PDFContext';
import { PremiumCard } from './PremiumCard';
import { SUBJECTS, SUBJECT_BADGE } from '../constants/subjects';
import { PremiumBreadcrumb } from './PremiumBreadcrumb';
import { EmptyState } from './ui/EmptyState';
import { SubjectBadge } from './ui/SubjectBadge';
import { DifficultyChip } from './ui/DifficultyChip';
import { CARD, INPUT, PRIMARY_BTN, GHOST_BTN, MICRO, BACK_BTN, FIELD_LABEL, PILL_SOFT, PILL_GHOST, PILL_GOLD } from './ui/tokens';
import { NotesSection } from './student/NotesSection';
import { VideosSection } from './student/VideosSection';
import { PYQSection } from './student/PYQSection';
import { SheetsSection } from './student/SheetsSection';
import { DoubtsSection } from './student/DoubtsSection';
import { ResourcesSection } from './student/ResourcesSection';
import { StudentHome } from './student/StudentHome';

/* ─── Announcement category map (local to StudentDashboard) ─────────────── */
const ANN_CAT: Record<AnnouncementCategory, { label: string; cls: string }> = {
  general: { label: 'General', cls: 'bg-[#EFE7D8] text-[#6E645A]' },
  exam: { label: 'Exam', cls: 'bg-[#F4E4E4] text-[#4A0E1B]' },
  resource: { label: 'Resource', cls: 'bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]' },
  schedule: { label: 'Schedule', cls: 'bg-[#F4E2E5] text-[#7C2532]' }
};

interface StudentDashboardProps {
  exams: ExamInfo[];
  notes: Note[];
  videos: Video[];
  pyqs: PYQ[];
  practiceSheets: PracticeSheet[];
  doubts: Doubt[];
  faqs: FAQ[];
  announcements: Announcement[];
  onAddDoubt: (doubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt'>) => Promise<void>;
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

  // Doubt Form State — REMOVED (DoubtsSection is now self-contained)
  // onAddDoubt is passed directly as prop

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
    { id: 'notes' as const, title: 'Study Notes', desc: 'Rigorous mechanism summaries and multi-concept chapter breakdowns.', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png" alt="Notes" className="h-10 w-10" />, count: notes.filter(n => n.course === selectedExam).length, unit: 'notes' },
    { id: 'videos' as const, title: 'Video Lectures', desc: 'Conceptual recordings exploring complex chemical and numerical ideas.', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clapper%20Board.png" alt="Videos" className="h-10 w-10" />, count: videos.filter(v => v.course === selectedExam).length, unit: 'lectures' },
    { id: 'pyqs' as const, title: 'Previous Year Questions', desc: 'Original exam questions with step-by-step analytical solutions.', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Page%20Facing%20Up.png" alt="PYQs" className="h-10 w-10" />, count: pyqs.filter(p => p.course === selectedExam).length, unit: 'sets' },
    { id: 'sheets' as const, title: 'Practice Sheets', desc: 'Chapter drills graded by complexity to build proficiency.', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png" alt="Practice Sheets" className="h-10 w-10" />, count: practiceSheets.filter(s => s.course === selectedExam).length, unit: 'sheets' },
    { id: 'doubts' as const, title: 'Doubts & FAQ', desc: 'Ask the professor a direct question or browse common answers.', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png" alt="Doubts" className="h-10 w-10 drop-shadow-sm" />, count: null, unit: '' },
    { id: 'resources' as const, title: 'Additional Resources', desc: 'Syllabus blueprints, formula sheets and reference constants.', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Card%20Index%20Dividers.png" alt="Resources" className="h-10 w-10" />, count: null, unit: '' }
  ];

  return (
    <div className="dash-root min-h-screen bg-[#F6F2EA] dark:bg-[#1A1817] py-12 text-[#22201F] dark:text-[#F6F2EA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= LANDING PAGE (REDESIGNED V2) ================= */}
        {!selectedExam && (
          <StudentHome
            exams={exams}
            notes={notes}
            videos={videos}
            practiceSheets={practiceSheets}
            pyqs={pyqs}
            sortedAnnouncements={sortedAnnouncements}
            renderExamIcon={renderExamIcon}
            setSelectedExam={setSelectedExam}
          />
        )}

        {/* ================= BREADCRUMBS ================= */}
        {(selectedExam || activeCategory) && (
          <PremiumBreadcrumb
            backLabel={activeCategory ? 'Back to categories' : 'Back to library'}
            onBack={activeCategory ? handleBackToCategories : handleBackToExams}
            items={[
              { id: 'lib', label: 'Library', onClick: handleBackToExams },
              ...(selectedExam ? [{ id: 'exam', label: currentExamInfo?.title || selectedExam, onClick: handleBackToCategories }] : []),
              ...(activeCategory ? [{ id: 'cat', label: activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) }] : [])
            ]}
          />
        )}


        {/* ================= STEP 2: CATEGORY DASHBOARD ================= */}
        {selectedExam && !activeCategory && (
          <div>

            <div className="mb-10 rounded-[32px] bg-gradient-to-br from-[#4A0E1B] to-[#7C2532] p-8 shadow-[0_8px_30px_rgba(34,32,31,0.15)] relative overflow-hidden">
              {/* Decorative background shapes */}
              <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-20 h-52 w-52 rounded-full bg-[#D9C2A2]/10 blur-3xl" />
              
              <div className="relative z-10 flex items-center gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#F6F2EA] shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] backdrop-blur-sm border border-white/10">
                  {renderExamIcon(currentExamInfo?.icon)}
                </span>
                <div>
                  <h2 className="dash-serif text-3xl font-semibold text-[#F6F2EA] sm:text-4xl">
                    {currentExamInfo?.title} Library
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#F6F2EA]/80">{currentExamInfo?.description}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
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
                      <span className="dash-mono rounded-full border border-[#7C2532] bg-[#4A0E1B] px-2.5 py-1 text-[11px] font-medium text-[#F7F3EC] shadow-sm">
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

        {/* ================= NOTES SECTION ================= */}
        {selectedExam && activeCategory === 'notes' && (
          <NotesSection
            currentExamInfo={currentExamInfo}
            selectedExam={selectedExam}
            availableSubjects={availableSubjects}
            filteredNotes={filteredNotes}
            notes={notes}
            noteViewMode={noteViewMode}
            setNoteViewMode={setNoteViewMode}
            noteSort={noteSort}
            setNoteSort={setNoteSort}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            isSortDropdownOpen={isSortDropdownOpen}
            setIsSortDropdownOpen={setIsSortDropdownOpen}
            sortDropdownRef={sortDropdownRef}
            searchInputRef={searchInputRef}
            studiedNotes={studiedNotes}
            toggleStudied={toggleStudied}
            setActivePdfViewer={setActivePdfViewer}
            handleDownloadFile={handleDownloadFile}
          />
        )}

        {/* ================= VIDEOS SECTION ================= */}
        {selectedExam && activeCategory === 'videos' && (
          <VideosSection
            currentExamInfo={currentExamInfo}
            selectedExam={selectedExam}
            availableSubjects={availableSubjects}
            filteredVideos={filteredVideos}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            setActiveVideoModal={setActiveVideoModal}
          />
        )}

        {/* ================= PYQ SECTION ================= */}
        {selectedExam && activeCategory === 'pyqs' && (
          <PYQSection
            currentExamInfo={currentExamInfo}
            selectedExam={selectedExam}
            availableSubjects={availableSubjects}
            filteredPyqs={filteredPyqs}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            setActivePdfViewer={setActivePdfViewer}
            triggerDownload={triggerDownload}
          />
        )}

        {/* ================= SHEETS SECTION ================= */}
        {selectedExam && activeCategory === 'sheets' && (
          <SheetsSection
            currentExamInfo={currentExamInfo}
            selectedExam={selectedExam}
            availableSubjects={availableSubjects}
            filteredSheets={filteredSheets}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            setActivePdfViewer={setActivePdfViewer}
            triggerDownload={triggerDownload}
          />
        )}

        {/* ================= DOUBTS SECTION ================= */}
        {selectedExam && activeCategory === 'doubts' && (
          <DoubtsSection
            currentExamInfo={currentExamInfo}
            doubts={doubts}
            faqs={faqs}
            notes={notes}
            onAddDoubt={onAddDoubt}
          />
        )}


        {/* ================= RESOURCES SECTION ================= */}
        {selectedExam && activeCategory === 'resources' && (
          <ResourcesSection
            currentExamInfo={currentExamInfo}
            triggerDownload={triggerDownload}
          />
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
