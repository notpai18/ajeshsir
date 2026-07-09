/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
  X,
  ExternalLink,
  Send,
  FileSpreadsheet,
  Award,
  Compass,
  Activity,
  BookOpen,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { ExamType, ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ } from '../types';

interface StudentDashboardProps {
  exams: ExamInfo[];
  notes: Note[];
  videos: Video[];
  pyqs: PYQ[];
  practiceSheets: PracticeSheet[];
  doubts: Doubt[];
  faqs: FAQ[];
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

  // Doubt Form State
  const [doubtForm, setDoubtForm] = useState({
    name: '',
    email: '',
    subject: '',
    question: '',
    attachmentName: ''
  });
  const [doubtSubmitted, setDoubtSubmitted] = useState(false);

  // Dynamic Lucide helper mapping for Exam Icons
  const renderExamIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="h-6 w-6 text-[#F1E194]" />;
      case 'Award': return <Award className="h-6 w-6 text-indigo-500" />;
      case 'Activity': return <Activity className="h-6 w-6 text-emerald-500" />;
      case 'BookOpen': return <BookOpen className="h-6 w-6 text-teal-500" />;
      case 'GraduationCap': return <GraduationCap className="h-6 w-6 text-purple-500" />;
      default: return <BookOpen className="h-6 w-6 text-[#F1E194]" />;
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
  const handleDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtForm.name || !doubtForm.email || !doubtForm.question) return;

    onAddDoubt({
      name: doubtForm.name,
      email: doubtForm.email,
      subject: doubtForm.subject || `${currentExamInfo?.title || ''} - General Query`,
      question: doubtForm.question,
      attachmentName: doubtForm.attachmentName || undefined
    });

    setDoubtSubmitted(true);
    setDoubtForm({
      name: '',
      email: '',
      subject: '',
      question: '',
      attachmentName: ''
    });

    setTimeout(() => {
      setDoubtSubmitted(false);
    }, 6000);
  };

  const handleDownloadFile = (noteId: string, fileName: string) => {
    onIncrementNoteDownload(noteId);
    triggerDownload(fileName);
  };

  const triggerDownload = (fileName: string) => {
    // Elegant simulation of a local PDF download
    const element = document.createElement("a");
    const file = new Blob([`Simulated academic repository download for: ${fileName}.`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-[#111112] py-12 transition-colors duration-300 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ================= BREADCRUMBS ================= */}
        {(selectedExam || activeCategory) && (
          <nav className="mb-6 flex flex-wrap items-center space-x-2 font-sans uppercase tracking-[0.2em] font-black text-[11px] font-medium uppercase tracking-wider text-gray-400 ">
            <button onClick={handleBackToExams} className="hover:text-[#F1E194]">Library</button>
            {selectedExam && (
              <>
                <span>/</span>
                <button onClick={handleBackToCategories} className={`hover:text-[#F1E194] ${!activeCategory ? 'text-[#F1E194] -[#F1E194] font-bold' : ''}`}>
                  {currentExamInfo?.title}
                </button>
              </>
            )}
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-[#F1E194] -[#F1E194] font-bold">
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
              <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#F1E194]">
                Course Repositories
              </p>
              <h2 className="mt-2 text-3xl font-display font-extrabold tracking-tight text-white sm:text-4xl">
                Choose Your Examination
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-gray-400">
                Select your academic category below to unlock a highly organized directory of learning materials.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => {
                const getEmoji = (id: string) => {
                  switch(id) {
                    case 'jee-main': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Alembic.png';
                    case 'jee-advanced': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Test%20Tube.png';
                    case 'neet': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals%20and%20nature/Stethoscope.png';
                    case 'net': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Microscope.png';
                    case 'msc-entrance': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Graduation%20Cap.png';
                    default: return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png';
                  }
                };
                
                return (
                  <div
                    key={exam.id}
                    onClick={() => setSelectedExam(exam.id)}
                    className="group relative cursor-pointer rounded-[12px] bg-[#1c1c1e] p-8 transition-all duration-300 hover:bg-[#232325] hover:-translate-y-1 hover:rotate-1 shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-0"
                    id={`exam-card-${exam.id}`}
                  >
                    
                    <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#111112] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.05]">
                      <img src={getEmoji(exam.id)} alt={exam.title} className="h-10 w-10 object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.3)]" />
                    </div>
                    
                    <h3 className="relative text-xl font-display font-bold tracking-tight text-white mb-3">
                      {exam.title}
                    </h3>
                    <p className="relative text-sm leading-relaxed text-gray-400 line-clamp-3">
                      {exam.description}
                    </p>
                    
                    <div className="relative mt-8 flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-black text-[#F1E194] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b-2 border-gray-800 pb-8 mb-10 ">
              <div className="space-y-1.5">
                <button
                  onClick={handleBackToExams}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-400 hover:text-[#F1E194] "
                  id="back-to-exams-btn"
                >
                  <ArrowLeft size={14} />
                  <span>Back to examinations</span>
                </button>
                <h2 className="text-3xl font-extrabold text-white ">
                  {currentExamInfo?.title} Library
                </h2>
                <p className="text-sm text-gray-400 ">
                  {currentExamInfo?.description}
                </p>
              </div>
            </div>

            {/* Core Resource Categories */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Category 1: Notes */}
              <div
                onClick={() => setActiveCategory('notes')}
                className="group cursor-pointer rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-gray-800 hover:-translate-y-0.5  "
                id="cat-card-notes"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png" alt="Notes" className="h-10 w-10" />
                <h3 className="mt-4 text-base font-bold text-white ">Study Notes</h3>
                <p className="mt-1.5 text-xs text-gray-400  leading-relaxed">
                  Rigorous, mathematical proof summaries and multi-concept chapter breakdowns.
                </p>
              </div>

              {/* Category 2: Videos */}
              <div
                onClick={() => setActiveCategory('videos')}
                className="group cursor-pointer rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-gray-800 hover:-translate-y-0.5  "
                id="cat-card-videos"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clapper%20Board.png" alt="Videos" className="h-10 w-10" />
                <h3 className="mt-4 text-base font-bold text-white ">Video Lectures</h3>
                <p className="mt-1.5 text-xs text-gray-400  leading-relaxed">
                  Conceptual video recordings exploring complex chemical and numerical formulations.
                </p>
              </div>

              {/* Category 3: PYQs */}
              <div
                onClick={() => setActiveCategory('pyqs')}
                className="group cursor-pointer rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-gray-800 hover:-translate-y-0.5  "
                id="cat-card-pyqs"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Page%20Facing%20Up.png" alt="PYQs" className="h-10 w-10" />
                <h3 className="mt-4 text-base font-bold text-white ">Previous Year Questions</h3>
                <p className="mt-1.5 text-xs text-gray-400  leading-relaxed">
                  Original exam questions alongside comprehensive step-by-step analytical solutions.
                </p>
              </div>

              {/* Category 4: Practice Sheets */}
              <div
                onClick={() => setActiveCategory('sheets')}
                className="group cursor-pointer rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-gray-800 hover:-translate-y-0.5  "
                id="cat-card-sheets"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png" alt="Practice Sheets" className="h-10 w-10" />
                <h3 className="mt-4 text-base font-bold text-white ">Practice Sheets</h3>
                <p className="mt-1.5 text-xs text-gray-400  leading-relaxed">
                  Selected chapter drills categorized by complexity levels to expand chemical proficiency.
                </p>
              </div>

              {/* Category 5: Doubts */}
              <div
                onClick={() => setActiveCategory('doubts')}
                className="group cursor-pointer rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-all hover:border-gray-800 hover:-translate-y-0.5  "
                id="cat-card-doubts"
              >
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png" alt="Practice Sheets" className="h-10 w-10" />
                            <span className="font-sans uppercase tracking-[0.2em] font-black text-[9px] font-bold text-gray-400  uppercase">
                              {note.chapter}
                            </span>
                          </div>

                          <h4 className="mt-4 text-sm font-bold text-white  line-clamp-1">{note.title}</h4>
                          <p className="mt-1 text-xs text-gray-400  line-clamp-2">{note.description}</p>
                          
                          <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4 ">
                            <span className="font-sans uppercase tracking-[0.2em] font-black text-[10px] text-gray-400 ">{note.fileSize} • {note.downloadCount || 0} views</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setActivePdfViewer({ title: note.title, fileUrl: note.fileUrl })}
                                className="inline-flex items-center space-x-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-gray-400 hover:bg-[#111112]  :bg-slate-800"
                              >
                                <Eye size={12} />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDownloadFile(note.id, note.fileUrl)}
                                className="inline-flex items-center space-x-1 rounded-lg bg-[#5B0E14] text-white px-2.5 py-1.5 text-[11px] font-semibold hover:bg-[#5B0E14]"
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
            <div className="flex flex-col space-y-4 border-b-2 border-gray-800 pb-6 mb-8 ">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1 font-semibold text-xs text-gray-400 hover:text-[#F1E194]">
                  <ArrowLeft size={12} />
                  <span>Back to Categories</span>
                </button>
                <span className="font-sans uppercase tracking-[0.2em] font-black text-xs text-gray-400 uppercase">{currentExamInfo?.title} • Video Lectures</span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="relative md:col-span-8">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lectures..."
                    className="w-full rounded-[12px] border-2 border-gray-800 bg-[#111112]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-red-950 focus:bg-[#1c1c1e]   :border-blue-400"
                  />
                </div>
                <div className="relative md:col-span-4">
                  <Filter size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border-2 border-gray-800 bg-[#111112]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-red-950 focus:bg-[#1c1c1e]   :border-blue-400"
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject} Only</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="text-center py-12 rounded-[12px] border border-dashed border-gray-800 ">
                <p className="text-sm text-gray-400 ">No lecture recordings found matching your filters.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="group overflow-hidden rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]  ">
                    {/* Thumbnail placeholder with play button overlay */}
                    <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1c1c1e]/90 text-[#F1E194] shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 ml-0.5">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded bg-black/72 px-1.5 py-0.5 font-sans uppercase tracking-[0.2em] font-black text-[10px] font-bold text-white uppercase">
                        {video.duration}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-[#1c1c1e] px-2 py-0.5 font-sans uppercase tracking-[0.2em] font-black text-[9px] font-bold text-[#F1E194]  -[#F1E194]">
                          {video.subject}
                        </span>
                        <span className="font-sans uppercase tracking-[0.2em] font-black text-[9px] text-gray-400  uppercase">{video.chapter}</span>
                      </div>
                      <h4 className="mt-3.5 text-sm font-bold text-white  line-clamp-1">{video.title}</h4>
                      <p className="mt-1 text-xs text-gray-400  line-clamp-2">{video.description}</p>
                      
                      <button
                        onClick={() => setActiveVideoModal(video)}
                        className="mt-5 w-full inline-flex items-center justify-center space-x-2 rounded-[12px] bg-gray-900 text-white px-3 py-2.5 text-xs font-semibold hover:bg-gray-800 -[#111112]  :bg-[#1c1c1e]"
                      >
                        <VideoIcon size={13} />
                        <span>Watch Lecture</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PYQ EXPLORER */}
        {selectedExam && activeCategory === 'pyqs' && (
          <div>
            <div className="flex flex-col space-y-4 border-b-2 border-gray-800 pb-6 mb-8 ">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1 font-semibold text-xs text-gray-400 hover:text-[#F1E194]">
                  <ArrowLeft size={12} />
                  <span>Back to Categories</span>
                </button>
                <span className="font-sans uppercase tracking-[0.2em] font-black text-xs text-gray-400 uppercase">{currentExamInfo?.title} • PYQs</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div className="relative sm:col-span-2">
                  <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by chapter..."
                    className="w-full rounded-[12px] border-2 border-gray-800 bg-[#111112]/30 pl-10 pr-4 py-2 text-sm outline-none focus:border-red-950 focus:bg-[#1c1c1e]   :border-blue-400"
                  />
                </div>
                <div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border-2 border-gray-800 bg-[#111112]/30 px-3.5 py-2 text-sm outline-none focus:border-red-950 focus:bg-[#1c1c1e]  "
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
                    className="w-full appearance-none rounded-[12px] border-2 border-gray-800 bg-[#111112]/30 px-3.5 py-2 text-sm outline-none focus:border-red-950 focus:bg-[#1c1c1e]  "
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
              <div className="text-center py-12 rounded-[12px] border border-dashed border-gray-800 ">
                <p className="text-sm text-gray-400 ">No PYQ booklets found matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]  ">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-800 bg-[#111112]/60 font-sans uppercase tracking-[0.2em] font-black text-[10px] uppercase tracking-wider text-gray-400  ">
                        <th className="px-6 py-4">Subject & Chapter</th>
                        <th className="px-6 py-4">Year</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4 text-right">Question Paper</th>
                        <th className="px-6 py-4 text-right">Step Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 ">
                      {filteredPyqs.map((pyq) => (
                        <tr key={pyq.id} className="hover:bg-[#111112]/40 :bg-slate-850/20 text-xs">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-white ">{pyq.subject}</span>
                            <span className="block text-gray-400  text-[11px] mt-0.5">{pyq.chapter}</span>
                          </td>
                          <td className="px-6 py-4 font-sans uppercase tracking-[0.2em] font-black font-bold text-gray-400 ">{pyq.year}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                              pyq.difficulty === 'Easy' ? 'bg-green-50 text-green-700  ' :
                              pyq.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700  ' :
                              'bg-[#1c1c1e] text-red-700  '
                            }`}>
                              {pyq.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex space-x-1.5 justify-end">
                              <button
                                onClick={() => setActivePdfViewer({ title: `PYQ Question - ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.questionUrl })}
                                className="p-1.5 text-gray-400 hover:text-[#F1E194]"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => triggerDownload(pyq.questionUrl)}
                                className="inline-flex items-center space-x-1 rounded bg-[#1c1c1e] text-[#F1E194] px-2 py-1 font-semibold text-[10px] hover:bg-[#5B0E14]"
                              >
                                <Download size={10} />
                                <span>Question ({pyq.questionSize})</span>
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex space-x-1.5 justify-end">
                              <button
                                onClick={() => setActivePdfViewer({ title: `PYQ Solution - ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.solutionUrl })}
                                className="p-1.5 text-gray-400 hover:text-emerald-500"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => triggerDownload(pyq.solutionUrl)}
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
            <div className="flex flex-col space-y-4 border-b-2 border-gray-800 pb-6 mb-8 ">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1 font-semibold text-xs text-gray-400 hover:text-[#F1E194]">
                  <ArrowLeft size={12} />
                  <span>Back to Categories</span>
                </button>
                <span className="font-sans uppercase tracking-[0.2em] font-black text-xs text-gray-400 uppercase">{currentExamInfo?.title} • Practice Sheets</span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="relative md:col-span-8">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or chapter..."
                    className="w-full rounded-[12px] border-2 border-gray-800 bg-[#111112]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-red-950 focus:bg-[#1c1c1e]  "
                  />
                </div>
                <div className="relative md:col-span-4">
                  <Filter size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border-2 border-gray-800 bg-[#111112]/30 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-red-950 focus:bg-[#1c1c1e]  "
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject} Only</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredSheets.length === 0 ? (
              <div className="text-center py-12 rounded-[12px] border border-dashed border-gray-800 ">
                <p className="text-sm text-gray-400 ">No practice drills found matching your filters.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredSheets.map((sheet) => (
                  <div key={sheet.id} className="group rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] p-5 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]  ">
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600  ">
                        <FileText size={18} />
                      </div>
                      <span className="font-sans uppercase tracking-[0.2em] font-black text-[9px] font-bold text-gray-400  uppercase">
                        {sheet.chapter} • {sheet.subject}
                      </span>
                    </div>

                    <h4 className="mt-4 text-sm font-bold text-white ">{sheet.title}</h4>
                    <p className="mt-1 text-xs text-gray-400  leading-relaxed">{sheet.description}</p>
                    
                    <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4 ">
                      <span className="font-sans uppercase tracking-[0.2em] font-black text-[10px] text-gray-400 ">File size: {sheet.fileSize}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setActivePdfViewer({ title: sheet.title, fileUrl: sheet.fileUrl })}
                          className="inline-flex items-center space-x-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-gray-400 hover:bg-[#111112]  :bg-slate-800"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => triggerDownload(sheet.fileUrl)}
                          className="inline-flex items-center space-x-1 rounded-lg bg-[#5B0E14] text-white px-2.5 py-1.5 text-[11px] font-semibold hover:bg-[#5B0E14]"
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
            <div className="flex items-center justify-between border-b-2 border-gray-800 pb-6 mb-8 ">
              <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1 font-semibold text-xs text-gray-400 hover:text-[#F1E194]">
                <ArrowLeft size={12} />
                <span>Back to Categories</span>
              </button>
              <span className="font-sans uppercase tracking-[0.2em] font-black text-xs text-gray-400 uppercase">{currentExamInfo?.title} • Doubt Clarification</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
              
              {/* Doubt Submission Form */}
              <div className="lg:col-span-7">
                <div className="rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]  ">
                  <h3 className="text-base font-bold text-white  mb-1.5">
                    Submit Academic Doubt
                  </h3>
                  <p className="text-xs text-gray-400  mb-6">
                    Explain your concept difficulty or problem blocker. Professor Ajesh Joe will review and provide step-by-step guidance.
                  </p>

                  {doubtSubmitted && (
                    <div className="mb-6 flex items-center space-x-2.5 rounded-[12px] bg-green-50 px-4 py-3 text-xs text-green-800 border border-green-150    animate-fade-in">
                      <span className="text-base">✓</span>
                      <span>Doubt submitted successfully. You can monitor its response under the Professor Dashboard or refresh this page.</span>
                    </div>
                  )}

                  <form onSubmit={handleDoubtSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="student-name" className="block text-[10px] font-bold text-gray-400  uppercase tracking-wider">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="student-name"
                          required
                          value={doubtForm.name}
                          onChange={(e) => setDoubtForm({ ...doubtForm, name: e.target.value })}
                          className="mt-1.5 block w-full rounded-[12px] border-2 border-gray-800 bg-[#111112]/40 px-3 py-2 text-xs outline-none focus:border-red-950 focus:bg-[#1c1c1e]  "
                          placeholder="e.g. Siddharth"
                        />
                      </div>
                      <div>
                        <label htmlFor="student-email" className="block text-[10px] font-bold text-gray-400  uppercase tracking-wider">
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="student-email"
                          required
                          value={doubtForm.email}
                          onChange={(e) => setDoubtForm({ ...doubtForm, email: e.target.value })}
                          className="mt-1.5 block w-full rounded-[12px] border-2 border-gray-800 bg-[#111112]/40 px-3 py-2 text-xs outline-none focus:border-red-950 focus:bg-[#1c1c1e]  "
                          placeholder="e.g. sid@mail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="doubt-subject" className="block text-[10px] font-bold text-gray-400  uppercase tracking-wider">
                        Subject & Topic (or Chapter)
                      </label>
                      <input
                        type="text"
                        id="doubt-subject"
                        required
                        value={doubtForm.subject}
                        onChange={(e) => setDoubtForm({ ...doubtForm, subject: e.target.value })}
                        className="mt-1.5 block w-full rounded-[12px] border-2 border-gray-800 bg-[#111112]/40 px-3 py-2 text-xs outline-none focus:border-red-950 focus:bg-[#1c1c1e]  "
                        placeholder={`e.g. ${currentExamInfo?.title} Physics - Rotational Dynamics`}
                      />
                    </div>

                    <div>
                      <label htmlFor="doubt-question" className="block text-[10px] font-bold text-gray-400  uppercase tracking-wider">
                        Your Question Details
                      </label>
                      <textarea
                        id="doubt-question"
                        required
                        rows={4}
                        value={doubtForm.question}
                        onChange={(e) => setDoubtForm({ ...doubtForm, question: e.target.value })}
                        className="mt-1.5 block w-full rounded-[12px] border-2 border-gray-800 bg-[#111112]/40 px-3 py-2 text-xs outline-none focus:border-red-950 focus:bg-[#1c1c1e]  "
                        placeholder="State the numerical problem or concept blocker clearly..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400  uppercase tracking-wider">
                        Attachment (Optional)
                      </label>
                      <div className="mt-1.5 flex items-center space-x-3">
                        <input
                          type="text"
                          readOnly
                          value={doubtForm.attachmentName}
                          placeholder="No file selected (Optional)"
                          className="block w-full rounded-[12px] border-2 border-gray-800 bg-[#111112]/20 px-3 py-2 text-xs text-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setDoubtForm({ ...doubtForm, attachmentName: 'doubt-concept-diagram.png' })}
                          className="flex-shrink-0 rounded-[12px] bg-[#111112] border-2 border-gray-800 px-3 py-2 text-[11px] font-semibold text-gray-400 hover:bg-gray-100   "
                        >
                          Select File
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center space-x-1.5 rounded-[12px] bg-[#5B0E14] py-2.5 text-xs font-semibold text-white hover:bg-red-900"
                        id="student-doubt-submit-btn"
                      >
                        <Send size={12} />
                        <span>Submit Academic Doubt</span>
                      </button>
                    </div>

                  </form>
                </div>
              </div>

              {/* Accordion FAQ Area */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white ">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-gray-400  mt-1">
                    Quick references regarding library downloads, syllabus revisions, and academic response timelines.
                  </p>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] overflow-hidden  "
                      >
                        <button
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="w-full flex items-center justify-between px-4 py-3.5 text-left text-xs font-bold text-white hover:bg-[#111112]/50  :bg-slate-850/50"
                        >
                          <span>{faq.question}</span>
                          {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                        </button>
                        {isExpanded && (
                          <div className="border-t-2 border-gray-800/60 px-4 py-3 text-xs leading-relaxed text-gray-400  ">
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
            <div className="flex items-center justify-between border-b-2 border-gray-800 pb-6 mb-8 ">
              <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1 font-semibold text-xs text-gray-400 hover:text-[#F1E194]">
                <ArrowLeft size={12} />
                <span>Back to Categories</span>
              </button>
              <span className="font-sans uppercase tracking-[0.2em] font-black text-xs text-gray-400 uppercase">{currentExamInfo?.title} • Additions</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              
              <div className="rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] p-6  ">
                <h3 className="text-sm font-bold text-white  flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#5B0E14]" />
                  Syllabus Blueprints & Topic Weights
                </h3>
                <p className="mt-2 text-xs text-gray-400  leading-relaxed">
                  A carefully mapped matrix detailing the chapter distribution, sub-topic weights, and relative question occurrence frequencies compiled from the past 10 years of entrance examinations.
                </p>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => triggerDownload('syllabus-blueprints.pdf')}
                    className="inline-flex items-center space-x-1 rounded-lg bg-[#1c1c1e] px-2.5 py-1.5 font-semibold text-[11px] text-[#F1E194] hover:bg-[#5B0E14]"
                  >
                    <Download size={11} />
                    <span>Download Matrix (820 KB)</span>
                  </button>
                </div>
              </div>

              <div className="rounded-[12px] border-2 border-gray-800 bg-[#1c1c1e] p-6  ">
                <h3 className="text-sm font-bold text-white  flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  Formula & Fundamental Constant Sheets
                </h3>
                <p className="mt-2 text-xs text-gray-400  leading-relaxed">
                  A rapid-revision pocket formula PDF covering electromagnetic vectors, rotational momentums, coordinate calculus limits, and key physical constants (Planck, Boltzmann, Speed of Light).
                </p>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => triggerDownload('formula-pocket-sheets.pdf')}
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

      {/* ================= Watch Video Modal Overlay ================= */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 p-4 ">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[12px] bg-[#1c1c1e] shadow-2xl  border-2 border-gray-800 ">
            <div className="flex items-center justify-between border-b-2 border-gray-800 px-5 py-4 ">
              <div>
                <span className="font-sans uppercase tracking-[0.2em] font-black text-[9px] uppercase font-bold text-[#F1E194] -[#F1E194]">{activeVideoModal.subject} • {activeVideoModal.chapter}</span>
                <h3 className="text-sm font-bold text-white ">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 :bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Embedded video simulation player */}
            <div className="aspect-video w-full bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5B0E14]/10 text-[#F1E194] animate-pulse">
                <VideoIcon size={24} />
              </div>
              <p className="mt-4 font-sans text-sm font-semibold text-white">Interactive Lecture Player</p>
              <p className="mt-1 font-sans uppercase tracking-[0.2em] font-black text-[10px] text-slate-400 max-w-sm">
                [Simulating stream from: {activeVideoModal.youtubeLink}]
              </p>
              <div className="mt-5 flex space-x-3">
                <button
                  onClick={() => window.open(activeVideoModal.youtubeLink, '_blank')}
                  className="inline-flex items-center space-x-1.5 rounded-lg bg-[#1c1c1e] px-3 py-1.5 font-semibold text-[11px] text-white hover:bg-gray-100"
                >
                  <ExternalLink size={12} />
                  <span>Open YouTube Link</span>
                </button>
              </div>
            </div>

            <div className="p-5 border-t-2 border-gray-800 ">
              <p className="text-xs text-gray-400  leading-relaxed">
                {activeVideoModal.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-[11px] font-sans uppercase tracking-[0.2em] font-black text-gray-400">
                <span>Duration: {activeVideoModal.duration}</span>
                <span>Instructor: Prof. Ajesh Joe</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PDF Simulation Reader Overlay ================= */}
      {activePdfViewer && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 p-4 ">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[12px] bg-[#1c1c1e] shadow-2xl  border-2 border-gray-800 ">
            <div className="flex items-center justify-between border-b-2 border-gray-800 px-5 py-4 ">
              <div>
                <span className="font-sans uppercase tracking-[0.2em] font-black text-[9px] uppercase font-bold text-[#F1E194] -[#F1E194]">Interactive Document Viewer</span>
                <h3 className="text-sm font-bold text-white ">{activePdfViewer.title}</h3>
              </div>
              <button
                onClick={() => setActivePdfViewer(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 :bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* PDF simulation sheet */}
            <div className="max-h-[60vh] overflow-y-auto p-8 bg-[#111112]  font-sans text-white ">
              <div className="mx-auto max-w-2xl bg-[#1c1c1e] p-10 shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)]  border-2 border-gray-800  rounded">
                {/* Simulated Header */}
                <div className="border-b-2 border-gray-800 pb-4 mb-6 text-center ">
                  <h4 className="font-bold text-base text-white  uppercase tracking-wider">Prof. Ajesh Joe Academic Repository</h4>
                  <p className="font-sans uppercase tracking-[0.2em] font-black text-[9px] text-gray-400 mt-1">MODULE: {activePdfViewer.fileUrl}</p>
                </div>

                {/* Simulated Content */}
                <div className="space-y-4 text-xs leading-relaxed">
                  <p className="font-semibold text-sm text-white ">I. FOUNDATIONAL THEOREMS & BOUNDARIES</p>
                  <p>
                    Let S be a piecewise smooth, closed Gaussian surface enclosing a total algebraic charge Q_encl. By establishing the divergence properties of the electrostatic displacement vector D or field vector E, we state the global integral theorem:
                  </p>
                  <div className="my-4 bg-[#111112] p-3 text-center font-sans uppercase tracking-[0.2em] font-black text-[11px] rounded  border-2 border-gray-800 ">
                    ∮_S E • dA = Q_encl / ε_0
                  </div>
                  <p className="font-semibold text-sm text-white ">II. COMPREHENSIVE PROOFS & INTEGRATIONS</p>
                  <p>
                    For a spherically symmetric charge distribution of radial density ρ(r), we construct a concentric Gaussian sphere of radius r. Integrating the isotropic flux yields:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-gray-400 ">
                    <li>For r &lt; R: E(r) = Q(r) / (4πε_0 r²) where Q(r) is the integral of 4π(r')² ρ(r') dr'</li>
                    <li>For r ≥ R: The distribution behaves strictly as a point charge concentrated at the geographic center.</li>
                  </ul>
                  <p className="font-semibold text-sm text-white ">III. KEY COMPETITIVE BLOCKERS & DERIVATIONS</p>
                  <p>
                    Under examinations, problems often couple these radial integrations with dielectric boundary transitions. Recall that the tangential component of the electric field vector is always continuous across interfaces, whereas the normal component undergoes a discontinuity corresponding to the free surface charge density.
                  </p>
                </div>

                <div className="mt-8 border-t-2 border-gray-800 pt-6 text-center text-[10px] font-sans uppercase tracking-[0.2em] font-black text-gray-400 ">
                  --- End of Document Preview ---
                </div>
              </div>
            </div>

            <div className="p-4 border-t-2 border-gray-800 bg-[#111112] flex justify-between items-center  ">
              <span className="text-[10px] text-gray-400 ">Secure Client-Side Sandbox Preview</span>
              <button
                onClick={() => triggerDownload(activePdfViewer.fileUrl)}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-[#5B0E14] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#5B0E14]"
              >
                <Download size={12} />
                <span>Download Full PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
