/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  ArrowLeft,
  FileText,
  Video as VideoIcon,
  HelpCircle,
  FolderOpen,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Send,
  FileSpreadsheet,
  Award,
  Compass,
  Activity,
  BookOpen,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { ExamType, ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement } from '../types';
import { FileUpload } from './FileUpload';
import { uploadDoubtAttachment } from '../services/doubtsService';
import { VideoWatchModal } from './VideoWatchModal';
import { extractYouTubeId, getYoutubeThumbnail } from '../lib/youtube';

// ─── Card thumbnail helper (maxresdefault → hqdefault fallback) ───────────────
function CardThumbnail({
  src,
  alt,
  fallbackId,
}: {
  src: string;
  alt: string;
  fallbackId: string | null;
}) {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [errored, setErrored] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(src);
    setErrored(false);
  }, [src]);

  const handleError = () => {
    if (!errored && fallbackId && imgSrc.includes('maxresdefault')) {
      setImgSrc(getYoutubeThumbnail(fallbackId, 'hqdefault'));
      setErrored(true);
    }
  };

  if (!imgSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0f0f0f]">
        <VideoIcon size={24} className="text-white/20" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
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
    const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Doubt Form State
  const [doubtForm, setDoubtForm] = useState({
    name: '',
    email: '',
    subject: '',
    question: '',
  });
  const [doubtFile, setDoubtFile] = useState<File | null>(null);
  const [doubtSubmitted, setDoubtSubmitted] = useState(false);
<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false);
=======
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachmentDataUrl, setAttachmentDataUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
>>>>>>> 2f7d4fd (Update dashboards and types)

  // Dynamic Lucide helper mapping for Exam Icons
  const renderExamIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="h-6 w-6 text-blue-500" />;
      case 'Award': return <Award className="h-6 w-6 text-indigo-500" />;
      case 'Activity': return <Activity className="h-6 w-6 text-emerald-500" />;
      case 'BookOpen': return <BookOpen className="h-6 w-6 text-teal-500" />;
      case 'GraduationCap': return <GraduationCap className="h-6 w-6 text-purple-500" />;
      default: return <BookOpen className="h-6 w-6 text-blue-500" />;
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

  // SUBJECT filters dynamically computed based on active contents
  const availableSubjects = useMemo(() => {
    if (!selectedExam) return ['All'];
    let list: string[] = [];
    if (activeCategory === 'notes') {
      list = notes.filter(n => n.course === selectedExam).map(n => n.subject);
    } else if (activeCategory === 'videos') {
      list = videos.filter(v => v.course === selectedExam).map(v => v.subject);
    } else if (activeCategory === 'pyqs') {
      list = pyqs.filter(p => p.course === selectedExam).map(p => p.subject);
    } else if (activeCategory === 'sheets') {
      list = practiceSheets.filter(p => p.course === selectedExam).map(p => p.subject);
    }
    return ['All', ...Array.from(new Set(list))];
  }, [selectedExam, activeCategory, notes, videos, pyqs, practiceSheets]);

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

  // Handle Doubt Submission
  const handleDoubtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtForm.name || !doubtForm.email || !doubtForm.question) return;

<<<<<<< HEAD
    setIsSubmitting(true);
    try {
      let finalAttachmentName = undefined;
      let finalAttachmentUrl = undefined;
      
      if (doubtFile) {
        const res = await uploadDoubtAttachment(doubtFile);
        finalAttachmentName = res.name;
        finalAttachmentUrl = res.url;
      }

      onAddDoubt({
        name: doubtForm.name,
        email: doubtForm.email,
        subject: doubtForm.subject || `${currentExamInfo?.title || ''} - General Query`,
        question: doubtForm.question,
        attachmentName: finalAttachmentName,
        attachmentUrl: finalAttachmentUrl,
      });
=======
    onAddDoubt({
      name: doubtForm.name,
      email: doubtForm.email,
      subject: doubtForm.subject || `${currentExamInfo?.title || ''} - General Query`,
      question: doubtForm.question,
      attachmentName: doubtForm.attachmentName || undefined,
      attachmentDataUrl: attachmentDataUrl || undefined
    });

    setDoubtSubmitted(true);
    setDoubtForm({ name: '', email: '', subject: '', question: '', attachmentName: '' });
    setImagePreview(null);
    setAttachedFile(null);
    setAttachmentDataUrl(null);
>>>>>>> 2f7d4fd (Update dashboards and types)

      setDoubtSubmitted(true);
      setDoubtForm({
        name: '',
        email: '',
        subject: '',
        question: '',
      });
      setDoubtFile(null);

      setTimeout(() => {
        setDoubtSubmitted(false);
      }, 6000);
    } catch (err: any) {
      console.error('Error uploading doubt attachment:', err);
      let errMsg = err.message || 'Unknown error occurred.';
      if (errMsg.includes('row-level security policy') || errMsg.includes('RLS')) errMsg = 'Storage policy rejected upload.';
      alert(`Doubt submission failed: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openFile = (fileUrl: string) => {
    if (fileUrl && fileUrl.startsWith('http')) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert("File not found or invalid URL.");
    }
  };

  const handleDownloadFile = (noteId: string, fileName: string) => {
    onIncrementNoteDownload(noteId);
    openFile(fileName);
  };

  return (
    <div className="bg-[#F5F5F7] py-12 transition-colors duration-300 text-[#1D1D1F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ================= READ-ONLY NOTICES STRIP ================= */}
        {!selectedExam && announcements.length > 0 && (
          <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 p-4 shadow-sm relative">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#0071E3]" />
            <div className="flex items-center space-x-3 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[#0071E3]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              </span>
              <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-black text-[#0071E3]">
                Professor Announcements
              </h3>
            </div>
            <div className="space-y-3">
              {[...announcements].sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              }).slice(0, 3).map(ann => (
                <div key={ann.id} className="bg-white/60 rounded-lg p-3 text-sm text-[#1D1D1F] border border-white flex items-start space-x-2">
                  {ann.pinned && (
                    <span className="mt-0.5 text-orange-500 shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11V5.5C16 3.567 14.433 2 12.5 2C10.567 2 9 3.567 9 5.5V11L7 13V15H11V21L12.5 23L14 21V15H18V13L16 11Z"/></svg>
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-[#1D1D1F] text-[13px]">{ann.title}</p>
                    <p className="mt-1 text-[#86868B] text-xs leading-relaxed">{ann.body}</p>
                    <div className="mt-2 flex items-center text-[10px] font-semibold text-[#86868B] space-x-3">
                      <span className="bg-white px-2 py-0.5 rounded-full border border-gray-100">{new Date(ann.createdAt).toLocaleDateString()}</span>
                      {ann.category !== 'general' && <span className="bg-blue-50 text-[#0071E3] px-2 py-0.5 rounded-full capitalize">{ann.category}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= BREADCRUMBS ================= */}
        {(selectedExam || activeCategory) && (
          <nav className="mb-6 flex flex-wrap items-center space-x-2 text-[0.85rem] font-medium text-[#86868B]">
            <button onClick={handleBackToExams} className="hover:text-[#0066CC]">Library</button>
            {selectedExam && (
              <>
                <span>/</span>
                <button onClick={handleBackToCategories} className={`hover:text-[#0066CC] ${!activeCategory ? 'text-[#0066CC] font-medium' : ''}`}>
                  {currentExamInfo?.title}
                </button>
              </>
            )}
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-[#0066CC] font-medium">
                  {activeCategory}
                </span>
              </>
            )}
          </nav>
        )}

        {/* ================= STEP 1: EXAM SELECTION ================= */}
        {!selectedExam && (
          <div>
            <div className="text-center mb-12">
              <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#0071E3]">
                Course Repositories
              </p>
              <h2 className="mt-2 text-3xl font-display font-extrabold tracking-tight text-[#1D1D1F] sm:text-4xl">
                Choose Your Examination
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-[#86868B]">
                Select your academic category below to unlock a highly organized directory of learning materials.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => {
                const getEmoji = (id: string) => {
                  switch(id) {
                    case 'jee-main': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Alembic.png';
                    case 'jee-advanced': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Test%20Tube.png';
                    case 'neet': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Stethoscope.png';
                    case 'net': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Microscope.png';
                    case 'msc-entrance': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Graduation%20Cap.png';
                    default: return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png';
                  }
                };
                
                return (
                  <div
                    key={exam.id}
                    onClick={() => setSelectedExam(exam.id)}
                    className="group relative cursor-pointer rounded-[12px] bg-[#FFFFFF] p-8 transition-all duration-300 hover:bg-[#F5F5F7] hover:-translate-y-1 hover:rotate-1 shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-0"
                    id={`exam-card-${exam.id}`}
                  >
                    
                    <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#F5F5F7] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.05]">
                      <img src={getEmoji(exam.id)} alt={exam.title} className="h-10 w-10 object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.3)]" />
                    </div>
                    
                    <h3 className="relative text-xl font-display font-bold tracking-tight text-[#1D1D1F] mb-3">
                      {exam.title}
                    </h3>
                    <p className="relative text-sm leading-relaxed text-[#86868B] line-clamp-3">
                      {exam.description}
                    </p>
                    
                    <div className="relative mt-8 flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-black text-[#0071E3] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                      <span>Explore Course</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: CATEGORY DASHBOARD ================= */}
        {selectedExam && !activeCategory && (
          <div>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b-2 border-[#E5E5EA] pb-8 mb-10">
              <div className="space-y-1.5">
                <button
                  onClick={handleBackToExams}
                  className="inline-flex items-center space-x-1.5 text-[0.85rem] font-medium text-blue-500 hover:text-blue-400"
                  id="back-to-exams-btn"
                >
                  <ArrowLeft size={14} />
                  <span>Back to examinations</span>
                </button>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1D1D1F]">
                  {currentExamInfo?.title} Library
                </h2>
                <p className="text-sm font-normal leading-relaxed text-[#86868B]">
                  {currentExamInfo?.description}
                </p>
              </div>
            </div>

            {/* Core Resource Categories */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Category 1: Notes */}
              <div
                onClick={() => setActiveCategory('notes')}
                className="group cursor-pointer rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-blue-200 hover:-translate-y-0.5"
                id="cat-card-notes"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png" alt="Notes" className="h-10 w-10 drop-shadow-md" />
                <h3 className="mt-4 text-[1rem] font-semibold text-[#1D1D1F]">Study Notes</h3>
                <p className="mt-1.5 text-[0.9rem] font-light text-[#6E6E73] leading-relaxed">
                  Rigorous, chemical mechanism summaries and multi-concept chapter breakdowns.
                </p>
              </div>

              {/* Category 2: Videos */}
              <div
                onClick={() => setActiveCategory('videos')}
                className="group cursor-pointer rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-blue-200 hover:-translate-y-0.5"
                id="cat-card-videos"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clapper%20Board.png" alt="Videos" className="h-10 w-10 drop-shadow-md" />
                <h3 className="mt-4 text-[1rem] font-semibold text-[#1D1D1F]">Video Lectures</h3>
                <p className="mt-1.5 text-[0.9rem] font-light text-[#6E6E73] leading-relaxed">
                  Conceptual video recordings exploring complex chemical and numerical formulations.
                </p>
              </div>

              {/* Category 3: PYQs */}
              <div
                onClick={() => setActiveCategory('pyqs')}
                className="group cursor-pointer rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-blue-200 hover:-translate-y-0.5"
                id="cat-card-pyqs"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Page%20Facing%20Up.png" alt="PYQs" className="h-10 w-10 drop-shadow-md" />
                <h3 className="mt-4 text-[1rem] font-semibold text-[#1D1D1F]">Previous Year Questions</h3>
                <p className="mt-1.5 text-[0.9rem] font-light text-[#6E6E73] leading-relaxed">
                  Original exam questions alongside comprehensive step-by-step analytical solutions.
                </p>
              </div>

              {/* Category 4: Practice Sheets */}
              <div
                onClick={() => setActiveCategory('sheets')}
                className="group cursor-pointer rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-blue-200 hover:-translate-y-0.5"
                id="cat-card-sheets"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png" alt="Practice Sheets" className="h-10 w-10 drop-shadow-md" />
                <h3 className="mt-4 text-[1rem] font-semibold text-[#1D1D1F]">Practice Sheets</h3>
                <p className="mt-1.5 text-[0.9rem] font-light text-[#6E6E73] leading-relaxed">
                  Selected chapter drills categorized by complexity levels to expand chemical proficiency.
                </p>
              </div>

              {/* Category 5: Doubts */}
              <div
                onClick={() => setActiveCategory('doubts')}
                className="group cursor-pointer rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-blue-200 hover:-translate-y-0.5"
                id="cat-card-doubts"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png" alt="Doubts" className="h-10 w-10 drop-shadow-md" />
                <h3 className="mt-4 text-[1rem] font-semibold text-[#1D1D1F]">Doubts Submission</h3>
                <p className="mt-1.5 text-[0.9rem] font-light text-[#6E6E73] leading-relaxed">
                  Ask a direct academic question and browse frequently answered conceptual sheets.
                </p>
              </div>

              

            </div>
          </div>
        )}

        {/* ================= STEP 3: SUB-RESOURCE PAGES ================= */}
        
        {/* NOTES EXPLORER */}
        {selectedExam && activeCategory === 'notes' && (
          <div>
            {/* Header with Search and Filter */}
            <div className="flex flex-col space-y-4 border-b-2 border-[#E5E5EA] pb-6 mb-8">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1.5 text-[0.85rem] font-medium text-blue-500 hover:text-blue-400">
                  <ArrowLeft size={14} />
                  <span>Back to Categories</span>
                </button>
                <span className="text-[0.85rem] font-medium text-[#86868B]">{currentExamInfo?.title} • Study Notes</span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="relative md:col-span-8">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-[#86868B]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes by title, chapter or concepts..."
                    className="w-full rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-[#FFFFFF]:border-blue-400"
                  />
                </div>
                <div className="relative md:col-span-4">
                  <Filter size={14} className="absolute left-3.5 top-3.5 text-[#86868B]" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-[#FFFFFF]:border-blue-400"
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject} Only</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* List */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 rounded-[12px] border border-dashed border-[#E5E5EA]">
                <p className="text-sm text-[#86868B]">No study notes found matching your filters.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Organize by Subject then Chapter */}
                {Array.from(new Set(filteredNotes.map(n => n.subject))).map((subj) => (
                  <div key={subj} className="space-y-4">
                    <h3 className="border-b-2 border-[#E5E5EA] pb-2 text-lg font-bold text-[#1D1D1F]">
                      {subj}
                    </h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      {filteredNotes.filter(n => n.subject === subj).map((note) => (
                        <div key={note.id} className="group rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-5 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]">
                          <div className="flex items-start justify-between">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <FileText size={18} />
                            </div>
                            <span className="font-mono text-[9px] font-bold text-[#86868B] uppercase">
                              {note.chapter}
                            </span>
                          </div>

                          <h4 className="mt-4 text-sm font-bold text-[#1D1D1F] line-clamp-1">{note.title}</h4>
                          <p className="mt-1 text-xs text-[#86868B] line-clamp-2">{note.description}</p>
                          
                          <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                            <span className="font-mono text-[10px] text-[#86868B]">{note.fileSize} • {note.downloadCount || 0} views</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openFile(note.fileUrl )}
                                className="inline-flex items-center space-x-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#86868B] hover:bg-[#F5F5F7]:bg-slate-800"
                              >
                                <Eye size={12} />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDownloadFile(note.id, note.fileUrl)}
                                className="inline-flex items-center space-x-1 rounded-lg bg-blue-500 text-white px-2.5 py-1.5 text-[11px] font-semibold hover:bg-blue-600"
                              >
                                <Download size={12} />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LECTURES EXPLORER */}
        {selectedExam && activeCategory === 'videos' && (
          <div>
            <div className="flex flex-col space-y-4 border-b-2 border-[#E5E5EA] pb-6 mb-8">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1.5 text-[0.85rem] font-medium text-blue-500 hover:text-blue-400">
                  <ArrowLeft size={14} />
                  <span>Back to Categories</span>
                </button>
                <span className="text-[0.85rem] font-medium text-[#86868B]">{currentExamInfo?.title} • Video Lectures</span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="relative md:col-span-8">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-[#86868B]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lectures..."
                    className="w-full rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-[#FFFFFF]:border-blue-400"
                  />
                </div>
                <div className="relative md:col-span-4">
                  <Filter size={14} className="absolute left-3.5 top-3.5 text-[#86868B]" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-[#FFFFFF]:border-blue-400"
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject} Only</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="text-center py-12 rounded-[12px] border border-dashed border-[#E5E5EA]">
                <p className="text-sm text-[#86868B]">No lecture recordings found matching your filters.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => {
                  const ytId = extractYouTubeId(video.youtubeLink);
                  const thumbSrc = ytId
                    ? getYoutubeThumbnail(ytId, 'maxresdefault')
                    : (video.thumbnail || '');
                  return (
                  <div key={video.id} className="group overflow-hidden rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]">
                    {/* Thumbnail with YouTube auto-generated image */}
                    <div className="relative aspect-video w-full bg-[#0f0f0f] overflow-hidden">
                      <CardThumbnail src={thumbSrc} alt={video.title} fallbackId={ytId} />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFFFFF]/90 text-blue-600 shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 ml-0.5">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded bg-black/72 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
                        {video.duration}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[9px] font-bold text-blue-600">
                          {video.subject}
                        </span>
                        <span className="font-mono text-[9px] text-[#86868B] uppercase">{video.chapter}</span>
                      </div>
                      <h4 className="mt-3.5 text-sm font-bold text-[#1D1D1F] line-clamp-1">{video.title}</h4>
                      <p className="mt-1 text-xs text-[#86868B] line-clamp-2">{video.description}</p>
                      
                      <button
                        onClick={() => setActiveVideoModal(video)}
                        className="mt-5 w-full inline-flex items-center justify-center space-x-2 rounded-[12px] bg-gray-900 text-white px-3 py-2.5 text-xs font-semibold hover:bg-gray-800 transition-colors"
                      >
                        <VideoIcon size={13} />
                        <span>Watch Lecture</span>
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PYQ EXPLORER */}
        {selectedExam && activeCategory === 'pyqs' && (
          <div>
            <div className="flex flex-col space-y-4 border-b-2 border-[#E5E5EA] pb-6 mb-8">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1.5 text-[0.85rem] font-medium text-blue-500 hover:text-blue-400">
                  <ArrowLeft size={14} />
                  <span>Back to Categories</span>
                </button>
                <span className="text-[0.85rem] font-medium text-[#86868B]">{currentExamInfo?.title} • PYQs</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div className="relative sm:col-span-2">
                  <Search size={16} className="absolute left-3.5 top-3 text-[#86868B]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by chapter..."
                    className="w-full rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/30 pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:bg-[#FFFFFF]:border-blue-400"
                  />
                </div>
                <div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/30 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-[#FFFFFF]"
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject === 'All' ? 'All Subjects' : subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/30 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-[#FFFFFF]"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredPyqs.length === 0 ? (
              <div className="text-center py-12 rounded-[12px] border border-dashed border-[#E5E5EA]">
                <p className="text-sm text-[#86868B]">No PYQ booklets found matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#E5E5EA] bg-[#F5F5F7]/60 font-mono text-[10px] uppercase tracking-wider text-[#86868B]">
                        <th className="px-6 py-4">Subject & Chapter</th>
                        <th className="px-6 py-4">Year</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4 text-right">Question Paper</th>
                        <th className="px-6 py-4 text-right">Step Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredPyqs.map((pyq) => (
                        <tr key={pyq.id} className="hover:bg-[#F5F5F7]/40:bg-slate-850/20 text-xs">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-[#1D1D1F]">{pyq.subject}</span>
                            <span className="block text-[#86868B] text-[11px] mt-0.5">{pyq.chapter}</span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-[#86868B]">{pyq.year}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                              pyq.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                              pyq.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              {pyq.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex space-x-1.5 justify-end">
                              <button
                                onClick={() => openFile(pyq.questionUrl )}
                                className="p-1.5 text-[#86868B] hover:text-blue-500"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => openFile(pyq.questionUrl)}
                                className="inline-flex items-center space-x-1 rounded bg-blue-50 text-blue-600 px-2 py-1 font-semibold text-[10px] hover:bg-blue-100"
                              >
                                <Download size={10} />
                                <span>Question ({pyq.questionSize})</span>
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex space-x-1.5 justify-end">
                              <button
                                onClick={() => openFile(pyq.solutionUrl )}
                                className="p-1.5 text-[#86868B] hover:text-emerald-500"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => openFile(pyq.solutionUrl)}
                                className="inline-flex items-center space-x-1 rounded bg-emerald-50 text-emerald-600 px-2 py-1 font-semibold text-[10px] hover:bg-emerald-100"
                              >
                                <Download size={10} />
                                <span>Solution ({pyq.solutionSize})</span>
                              </button>
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

        {/* PRACTICE SHEETS */}
        {selectedExam && activeCategory === 'sheets' && (
          <div>
            <div className="flex flex-col space-y-4 border-b-2 border-[#E5E5EA] pb-6 mb-8">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1.5 text-[0.85rem] font-medium text-blue-500 hover:text-blue-400">
                  <ArrowLeft size={14} />
                  <span>Back to Categories</span>
                </button>
                <span className="text-[0.85rem] font-medium text-[#86868B]">{currentExamInfo?.title} • Practice Sheets</span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="relative md:col-span-8">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-[#86868B]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or chapter..."
                    className="w-full rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-[#FFFFFF]"
                  />
                </div>
                <div className="relative md:col-span-4">
                  <Filter size={14} className="absolute left-3.5 top-3.5 text-[#86868B]" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-[#FFFFFF]"
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject} Only</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredSheets.length === 0 ? (
              <div className="text-center py-12 rounded-[12px] border border-dashed border-[#E5E5EA]">
                <p className="text-sm text-[#86868B]">No practice drills found matching your filters.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredSheets.map((sheet) => (
                  <div key={sheet.id} className="group rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-5 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]">
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <FileText size={18} />
                      </div>
                      <span className="font-mono text-[9px] font-bold text-[#86868B] uppercase">
                        {sheet.chapter} • {sheet.subject}
                      </span>
                    </div>

                    <h4 className="mt-4 text-sm font-bold text-[#1D1D1F]">{sheet.title}</h4>
                    <p className="mt-1 text-xs text-[#86868B] leading-relaxed">{sheet.description}</p>
                    
                    <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                      <span className="font-mono text-[10px] text-[#86868B]">File size: {sheet.fileSize}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openFile(sheet.fileUrl )}
                          className="inline-flex items-center space-x-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#86868B] hover:bg-[#F5F5F7]:bg-slate-800"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => openFile(sheet.fileUrl)}
                          className="inline-flex items-center space-x-1 rounded-lg bg-blue-500 text-white px-2.5 py-1.5 text-[11px] font-semibold hover:bg-blue-600"
                        >
                          <Download size={12} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DOUBT SUBMISSION PAGE */}
        {selectedExam && activeCategory === 'doubts' && (
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#E5E5EA] pb-6 mb-8">
              <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1 font-semibold text-xs text-blue-500 hover:text-blue-400">
                <ArrowLeft size={12} />
                <span>Back to Categories</span>
              </button>
              <span className="font-mono text-xs text-[#86868B] uppercase">{currentExamInfo?.title} • Doubt Clarification</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
              
              {/* Doubt Submission Form */}
              <div className="lg:col-span-7">
                <div className="rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]">
                  <h3 className="text-base font-bold text-[#1D1D1F] mb-1.5">
                    Submit Academic Doubt
                  </h3>
                  <p className="text-xs text-[#86868B] mb-6">
                    Explain your concept difficulty or problem blocker. Professor Ajesh Joe will review and provide step-by-step guidance.
                  </p>

                  {doubtSubmitted && (
                    <div className="mb-6 flex items-center space-x-2.5 rounded-[12px] bg-green-50 px-4 py-3 text-xs text-green-800 border border-green-150 animate-fade-in">
                      <span className="text-base">✓</span>
                      <span>Doubt submitted successfully. You can monitor its response under the Professor Dashboard or refresh this page.</span>
                    </div>
                  )}

                  <form onSubmit={handleDoubtSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="student-name" className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="student-name"
                          required
                          value={doubtForm.name}
                          onChange={(e) => setDoubtForm({ ...doubtForm, name: e.target.value })}
                          className="mt-1.5 block w-full rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/40 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-[#FFFFFF]"
                          placeholder="e.g. Siddharth"
                        />
                      </div>
                      <div>
                        <label htmlFor="student-email" className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="student-email"
                          required
                          value={doubtForm.email}
                          onChange={(e) => setDoubtForm({ ...doubtForm, email: e.target.value })}
                          className="mt-1.5 block w-full rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/40 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-[#FFFFFF]"
                          placeholder="e.g. sid@mail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="doubt-subject" className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
                        Subject & Topic (or Chapter)
                      </label>
                      <input
                        type="text"
                        id="doubt-subject"
                        required
                        value={doubtForm.subject}
                        onChange={(e) => setDoubtForm({ ...doubtForm, subject: e.target.value })}
                        className="mt-1.5 block w-full rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/40 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-[#FFFFFF]"
                        placeholder={`e.g. ${currentExamInfo?.title} Physics - Rotational Dynamics`}
                      />
                    </div>

                    <div>
                      <label htmlFor="doubt-question" className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">
                        Your Question Details
                      </label>
                      <textarea
                        id="doubt-question"
                        required
                        rows={4}
                        value={doubtForm.question}
                        onChange={(e) => setDoubtForm({ ...doubtForm, question: e.target.value })}
                        className="mt-1.5 block w-full rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7]/40 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-[#FFFFFF]"
                        placeholder="State the numerical problem or concept blocker clearly..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-2">
                        Attachment (Optional)
                      </label>
<<<<<<< HEAD
                      <FileUpload
                        value={doubtFile}
                        onFileSelect={(f) => setDoubtFile(f)}
                        placeholder="Upload screenshot or PDF"
                        accept="image/*,.pdf"
                      />
=======

                      {/* Hidden file input — accepts any file */}
                      <input
                        ref={imageInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setAttachedFile(file);
                          setDoubtForm({ ...doubtForm, attachmentName: file.name });
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const dataUrl = ev.target?.result as string;
                            setAttachmentDataUrl(dataUrl);
                            if (file.type.startsWith('image/')) {
                              setImagePreview(dataUrl);
                            } else {
                              setImagePreview(null);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />

                      {attachedFile ? (
                        attachedFile.type.startsWith('image/') && imagePreview ? (
                          /* Image preview card */
                          <div className="mt-1 rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7] overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Attachment preview"
                              className="w-full max-h-52 object-contain p-2"
                            />
                            <div className="flex items-center justify-between px-3 py-2 border-t border-[#E5E5EA] bg-white">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <svg className="w-3.5 h-3.5 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="text-[10px] text-[#86868B] truncate">{attachedFile.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => { setImagePreview(null); setAttachedFile(null); setAttachmentDataUrl(null); setDoubtForm({ ...doubtForm, attachmentName: '' }); if (imageInputRef.current) imageInputRef.current.value = ''; }}
                                className="text-[10px] font-semibold text-red-500 hover:text-red-600 shrink-0 ml-2"
                              >Remove</button>
                            </div>
                          </div>
                        ) : (
                          /* Generic file card */
                          <div className="mt-1 flex items-center gap-3 rounded-[12px] border-2 border-[#E5E5EA] bg-[#F5F5F7] px-4 py-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1D1D1F] truncate">{attachedFile.name}</p>
                              <p className="text-[10px] text-[#86868B] mt-0.5">{(attachedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => { setAttachedFile(null); setAttachmentDataUrl(null); setImagePreview(null); setDoubtForm({ ...doubtForm, attachmentName: '' }); if (imageInputRef.current) imageInputRef.current.value = ''; }}
                              className="text-[10px] font-semibold text-red-500 hover:text-red-600 shrink-0"
                            >Remove</button>
                          </div>
                        )
                      ) : (
                        /* Upload drop zone */
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="mt-1 w-full rounded-[12px] border-2 border-dashed border-[#C7C7CC] bg-[#F5F5F7] hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center py-6 gap-1.5 group"
                        >
                          <svg className="w-7 h-7 text-[#C7C7CC] group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-[11px] font-semibold text-[#86868B] group-hover:text-blue-500 transition-colors">Click to attach a file</span>
                          <span className="text-[10px] text-[#C7C7CC]">Images, PDF, DOCX, XLSX and more</span>
                        </button>
                      )}
>>>>>>> 2f7d4fd (Update dashboards and types)
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center space-x-1.5 rounded-[12px] bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
                        id="student-doubt-submit-btn"
                      >
                        <Send size={12} />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit Academic Doubt'}</span>
                      </button>
                    </div>

                  </form>
                </div>
              </div>

              {/* Accordion FAQ Area */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#1D1D1F]">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-[#86868B] mt-1">
                    Quick references regarding library downloads, syllabus revisions, and academic response timelines.
                  </p>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="w-full flex items-center justify-between px-4 py-3.5 text-left text-xs font-bold text-[#1D1D1F] hover:bg-[#F5F5F7]:bg-slate-850/50"
                        >
                          <span>{faq.question}</span>
                          {isExpanded ? <ChevronUp size={14} className="text-[#86868B]" /> : <ChevronDown size={14} className="text-[#86868B]" />}
                        </button>
                        {isExpanded && (
                          <div className="border-t-2 border-[#E5E5EA]/60 px-4 py-3 text-xs leading-relaxed text-[#86868B]">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ADDITIONAL RESOURCES */}
        {selectedExam && activeCategory === 'resources' && (
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#E5E5EA] pb-6 mb-8">
              <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1 font-semibold text-xs text-blue-500 hover:text-blue-400">
                <ArrowLeft size={12} />
                <span>Back to Categories</span>
              </button>
              <span className="font-mono text-xs text-[#86868B] uppercase">{currentExamInfo?.title} • Additions</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              
              <div className="rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-6">
                <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Syllabus Blueprints & Topic Weights
                </h3>
                <p className="mt-2 text-xs text-[#86868B] leading-relaxed">
                  A carefully mapped matrix detailing the chapter distribution, sub-topic weights, and relative question occurrence frequencies compiled from the past 10 years of entrance examinations.
                </p>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => openFile('syllabus-blueprints.pdf')}
                    className="inline-flex items-center space-x-1 rounded-lg bg-blue-50 px-2.5 py-1.5 font-semibold text-[11px] text-blue-600 hover:bg-blue-100"
                  >
                    <Download size={11} />
                    <span>Download Matrix (820 KB)</span>
                  </button>
                </div>
              </div>

              <div className="rounded-[12px] border-2 border-[#E5E5EA] bg-[#FFFFFF] p-6">
                <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  Formula & Fundamental Constant Sheets
                </h3>
                <p className="mt-2 text-xs text-[#86868B] leading-relaxed">
                  A rapid-revision pocket formula PDF covering electromagnetic vectors, rotational momentums, coordinate calculus limits, and key physical constants (Planck, Boltzmann, Speed of Light).
                </p>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => openFile('formula-pocket-sheets.pdf')}
                    className="inline-flex items-center space-x-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 font-semibold text-[11px] text-indigo-600 hover:bg-indigo-100"
                  >
                    <Download size={11} />
                    <span>Download Sheets (1.4 MB)</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ================= Premium YouTube Watch Modal ================= */}
      {activeVideoModal && (
        <VideoWatchModal
          video={activeVideoModal}
          playlist={filteredVideos}
          onClose={() => setActiveVideoModal(null)}
          onSelectVideo={(v) => setActiveVideoModal(v)}
        />
      )}



    </div>
  );
}
