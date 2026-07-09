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
  CheckCircle2
} from 'lucide-react';
import { ExamType, ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement, AnnouncementCategory } from '../types';

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

  // Doubt Form State
  const [doubtForm, setDoubtForm] = useState({
    name: '',
    email: '',
    subject: '',
    question: '',
    attachmentName: ''
  });
  const [doubtSubmitted, setDoubtSubmitted] = useState(false);

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
    setDoubtForm({ name: '', email: '', subject: '', question: '', attachmentName: '' });
    setTimeout(() => setDoubtSubmitted(false), 6000);
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

        {/* ================= PROFESSOR ANNOUNCEMENTS ================= */}
        {!selectedExam && announcements.length > 0 && (
          <div className={`${CARD} mb-8 p-5 sm:p-6`}>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4E7E5] text-[#4A0E1B]">
                <Megaphone size={16} />
              </span>
              <h3 className={MICRO}>Professor announcements</h3>
            </div>
            <div className="space-y-2.5">
              {sortedAnnouncements.slice(0, 3).map(ann => (
                <div key={ann.id} className="rounded-xl border border-[#EFE7D8] bg-[#FBF7F0] p-4">
                  <div className="flex items-start gap-2.5">
                    {ann.pinned && <Pin size={14} className="mt-0.5 shrink-0 text-[#4A0E1B]" fill="currentColor" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#22201F]">{ann.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#5A534B]">{ann.body}</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="dash-mono text-[11px] text-[#A79A88]">{new Date(ann.createdAt).toLocaleDateString()}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ANN_CAT[ann.category].cls}`}>
                          {ANN_CAT[ann.category].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= BREADCRUMBS ================= */}
        {(selectedExam || activeCategory) && (
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#8A7E6F]">
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

        {/* ================= STEP 1: EXAM SELECTION ================= */}
        {!selectedExam && (
          <div>
            <div className="mb-10 text-center">
              <p className={MICRO}>Course repositories</p>
              <h2 className="dash-serif mt-2 text-3xl font-semibold text-[#22201F] sm:text-4xl">Choose your examination</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-[#8A7E6F]">
                Select your academic category below to unlock a highly organised directory of learning materials.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExam(exam.id)}
                  className={`${CARD} group w-full p-7 text-left transition-all duration-200 hover:-translate-y-1 hover:rotate-1`}
                  id={`exam-card-${exam.id}`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4E7E5] to-[#F3EAD8] text-[#4A0E1B]">
                    {renderExamIcon(exam.icon)}
                  </span>
                  <h3 className="dash-serif mt-5 text-xl font-semibold text-[#22201F]">{exam.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8A7E6F] line-clamp-3">{exam.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#4A0E1B] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                    Explore course <ArrowRight size={14} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 2: CATEGORY DASHBOARD ================= */}
        {selectedExam && !activeCategory && (
          <div>
            <button onClick={handleBackToExams} className={`${BACK_BTN} mb-4`} id="back-to-exams-btn">
              <ArrowLeft size={14} /> Back to examinations
            </button>

            <div className="mb-10 border-b border-[#EAE1D2] pb-8">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4E7E5] to-[#F3EAD8] text-[#4A0E1B]">
                  {renderExamIcon(currentExamInfo?.icon)}
                </span>
                <h2 className="dash-serif text-3xl font-semibold text-[#22201F] sm:text-4xl">
                  {currentExamInfo?.title} Library
                </h2>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8A7E6F]">{currentExamInfo?.description}</p>
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
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4E7E5] text-[#4A0E1B]">{cat.icon}</span>
                    {cat.count !== null && (
                      <span className="dash-mono rounded-full border border-[#EFE7D8] bg-[#FBF7F0] px-2.5 py-1 text-[11px] font-medium text-[#8A7E6F]">
                        {cat.count} {cat.unit}
                      </span>
                    )}
                  </div>
                  <h3 className="dash-serif mt-4 text-lg font-semibold text-[#22201F]">{cat.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#8A7E6F]">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= NOTES EXPLORER ================= */}
        {selectedExam && activeCategory === 'notes' && (
          <div>
            <button onClick={handleBackToCategories} className={BACK_BTN}><ArrowLeft size={14} /> Back to categories</button>
            <div className="mt-4 mb-6">
              <p className={MICRO}>{currentExamInfo?.title} · Study notes</p>
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F]">Study notes</h2>
            </div>

            <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes by title, chapter or concept…"
                  className={`${INPUT} pl-10`}
                />
              </div>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={`${INPUT} sm:w-52`}>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject === 'All' ? 'All subjects' : subject}</option>
                ))}
              </select>
            </div>

            {filteredNotes.length === 0 ? (
              <EmptyState label="No study notes match your search or subject filter." />
            ) : (
              <div className="space-y-8">
                {Array.from(new Set(filteredNotes.map(n => n.subject))).map((subj) => (
                  <div key={subj}>
                    <h3 className="dash-serif mb-4 border-b border-[#EAE1D2] pb-2 text-lg font-semibold text-[#22201F]">{subj}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {filteredNotes.filter(n => n.subject === subj).map((note) => (
                        <div key={note.id} className={`${CARD} flex flex-col p-5`}>
                          <div className="flex items-start justify-between gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4E7E5] text-[#4A0E1B]"><FileText size={18} /></span>
                            <span className="rounded-full border border-[#EFE7D8] bg-[#FBF7F0] px-2.5 py-1 text-[10px] font-bold text-[#8A7E6F]">{note.chapter}</span>
                          </div>
                          <h4 className="mt-4 text-sm font-bold text-[#22201F]">{note.title}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-[#8A7E6F] line-clamp-2">{note.description}</p>
                          <div className="mt-4 flex items-center justify-between border-t border-[#F2ECDF] pt-4">
                            <span className="dash-mono text-[11px] text-[#A79A88]">{note.fileSize} · {note.downloadCount || 0} downloads</span>
                            <div className="flex gap-1.5">
                              <button onClick={() => setActivePdfViewer({ title: note.title, fileUrl: note.fileUrl })} className={PILL_GHOST}>
                                <Eye size={12} /> View
                              </button>
                              <button onClick={() => handleDownloadFile(note.id, note.fileUrl)} className={PILL_SOFT}>
                                <Download size={12} /> Download
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

        {/* ================= LECTURES EXPLORER ================= */}
        {selectedExam && activeCategory === 'videos' && (
          <div>
            <button onClick={handleBackToCategories} className={BACK_BTN}><ArrowLeft size={14} /> Back to categories</button>
            <div className="mt-4 mb-6">
              <p className={MICRO}>{currentExamInfo?.title} · Video lectures</p>
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F]">Video lectures</h2>
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
                        src={video.thumbnail}
                        alt={video.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-[#22201F]/25 opacity-80 transition-opacity group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#4A0E1B] shadow-lg transition-transform group-hover:scale-105">
                          <Play size={20} className="ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      <span className="dash-mono absolute bottom-2 right-2 rounded-md bg-[#22201F]/80 px-1.5 py-0.5 text-[10px] font-medium text-white">{video.duration}</span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4E7E5] px-2.5 py-1 text-[10px] font-bold text-[#4A0E1B]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#4A0E1B]" />{video.subject}
                        </span>
                        <span className={MICRO}>{video.chapter}</span>
                      </div>
                      <h4 className="mt-3.5 text-sm font-bold text-[#22201F] line-clamp-1">{video.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-[#8A7E6F] line-clamp-2">{video.description}</p>
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
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F]">Previous year questions</h2>
            </div>

            <div className="mb-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative lg:col-span-2">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by chapter…" className={`${INPUT} pl-10`} />
              </div>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={INPUT}>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject === 'All' ? 'All subjects' : subject}</option>
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
                      <tr className="border-b border-[#EAE1D2] bg-[#FBF7F0]">
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F]">Subject & chapter</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F]">Year</th>
                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F]">Difficulty</th>
                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F]">Question paper</th>
                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F]">Step solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECDF]">
                      {filteredPyqs.map((pyq) => (
                        <tr key={pyq.id} className="transition-colors hover:bg-[#FBF7F0]">
                          <td className="px-5 py-3.5">
                            <span className="font-semibold text-[#22201F]">{pyq.subject}</span>
                            <span className="mt-0.5 block text-xs text-[#8A7E6F]">{pyq.chapter}</span>
                          </td>
                          <td className="px-5 py-3.5 dash-mono text-xs font-medium tabular-nums text-[#6E645A]">{pyq.year}</td>
                          <td className="px-5 py-3.5"><DifficultyChip level={pyq.difficulty} /></td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex justify-end gap-1.5">
                              <button onClick={() => setActivePdfViewer({ title: `PYQ Question · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.questionUrl })} className="rounded-lg p-2 text-[#8A7E6F] transition-colors hover:bg-[#F4E7E5] hover:text-[#4A0E1B]"><Eye size={15} /></button>
                              <button onClick={() => triggerDownload(pyq.questionUrl)} className={PILL_SOFT}><Download size={11} /> {pyq.questionSize}</button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex justify-end gap-1.5">
                              <button onClick={() => setActivePdfViewer({ title: `PYQ Solution · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.solutionUrl })} className="rounded-lg p-2 text-[#8A7E6F] transition-colors hover:bg-[#F7EFD9] hover:text-[#8A6A16]"><Eye size={15} /></button>
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
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F]">Practice sheets</h2>
            </div>

            <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by title or chapter…" className={`${INPUT} pl-10`} />
              </div>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={`${INPUT} sm:w-52`}>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject === 'All' ? 'All subjects' : subject}</option>
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
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EFD9] text-[#8A6A16]"><FileText size={18} /></span>
                      <span className="rounded-full border border-[#EFE7D8] bg-[#FBF7F0] px-2.5 py-1 text-[10px] font-bold text-[#8A7E6F]">{sheet.chapter} · {sheet.subject}</span>
                    </div>
                    <h4 className="mt-4 text-sm font-bold text-[#22201F]">{sheet.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#8A7E6F]">{sheet.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#F2ECDF] pt-4">
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
                      <div className="flex items-center gap-2.5">
                        <input type="text" readOnly value={doubtForm.attachmentName} placeholder="No file selected" className={`${INPUT} text-[#8A7E6F]`} />
                        <button type="button" onClick={() => setDoubtForm({ ...doubtForm, attachmentName: 'doubt-concept-diagram.png' })} className={`${GHOST_BTN} shrink-0`}>
                          <Paperclip size={13} /> Select
                        </button>
                      </div>
                    </div>

                    <button type="submit" className={`${PRIMARY_BTN} w-full`} id="student-doubt-submit-btn">
                      <Send size={13} /> Submit academic doubt
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
          </div>
        )}

        {/* ================= ADDITIONAL RESOURCES ================= */}
        {selectedExam && activeCategory === 'resources' && (
          <div>
            <button onClick={handleBackToCategories} className={BACK_BTN}><ArrowLeft size={14} /> Back to categories</button>
            <div className="mt-4 mb-8">
              <p className={MICRO}>{currentExamInfo?.title} · Additional resources</p>
              <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F]">Additional resources</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className={`${CARD} flex flex-col p-6`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4E7E5] text-[#4A0E1B]"><FileSpreadsheet size={20} /></span>
                <h3 className="dash-serif mt-4 text-lg font-semibold text-[#22201F]">Syllabus blueprints & topic weights</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#8A7E6F]">
                  A mapped matrix of chapter distribution, sub-topic weights and question-occurrence frequencies compiled from the past 10 years of entrance examinations.
                </p>
                <div className="mt-5 flex justify-end">
                  <button onClick={() => triggerDownload('syllabus-blueprints.pdf')} className={PILL_SOFT}><Download size={12} /> Download matrix (820 KB)</button>
                </div>
              </div>

              <div className={`${CARD} flex flex-col p-6`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7EFD9] text-[#8A6A16]"><BookOpen size={20} /></span>
                <h3 className="dash-serif mt-4 text-lg font-semibold text-[#22201F]">Formula & fundamental constant sheets</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#8A7E6F]">
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

      {/* ================= WATCH VIDEO MODAL ================= */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button aria-label="Close" onClick={() => setActiveVideoModal(null)} className="absolute inset-0 cursor-default bg-[#22201F]/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#EAE1D2] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#EFE7D8] px-5 py-4">
              <div>
                <span className={MICRO}>{activeVideoModal.subject} · {activeVideoModal.chapter}</span>
                <h3 className="dash-serif mt-0.5 text-lg font-semibold text-[#22201F]">{activeVideoModal.title}</h3>
              </div>
              <button onClick={() => setActiveVideoModal(null)} className="rounded-lg p-1.5 text-[#8A7E6F] transition-colors hover:bg-[#F6F2EA] hover:text-[#22201F]"><X size={18} /></button>
            </div>

            <div className="flex aspect-video w-full flex-col items-center justify-center bg-[#22201F] p-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D9C2A2]/15 text-[#D9C2A2]">
                <Play size={24} className="ml-0.5" fill="currentColor" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Interactive lecture player</p>
              <p className="dash-mono mt-1 max-w-sm text-[10px] text-white/50">[ simulating stream from {activeVideoModal.youtubeLink} ]</p>
              <button onClick={() => window.open(activeVideoModal.youtubeLink, '_blank')} className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/20">
                <ExternalLink size={12} /> Open YouTube link
              </button>
            </div>

            <div className="border-t border-[#EFE7D8] p-5">
              <p className="text-sm leading-relaxed text-[#5A534B]">{activeVideoModal.description}</p>
              <div className="dash-mono mt-4 flex items-center justify-between text-[11px] text-[#8A7E6F]">
                <span>Duration · {activeVideoModal.duration}</span>
                <span>Instructor · Prof. Ajesh Joe</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PDF SIMULATION READER ================= */}
      {activePdfViewer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button aria-label="Close" onClick={() => setActivePdfViewer(null)} className="absolute inset-0 cursor-default bg-[#22201F]/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-[#EAE1D2] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#EFE7D8] px-5 py-4">
              <div>
                <span className={MICRO}>Document viewer</span>
                <h3 className="dash-serif mt-0.5 text-lg font-semibold text-[#22201F]">{activePdfViewer.title}</h3>
              </div>
              <button onClick={() => setActivePdfViewer(null)} className="rounded-lg p-1.5 text-[#8A7E6F] transition-colors hover:bg-[#F6F2EA] hover:text-[#22201F]"><X size={18} /></button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto bg-[#F6F2EA] p-6 sm:p-8">
              <div className="mx-auto max-w-2xl rounded-xl border border-[#EAE1D2] bg-white p-8 sm:p-10">
                <div className="mb-6 border-b border-[#EAE1D2] pb-4 text-center">
                  <h4 className="dash-serif text-base font-semibold text-[#22201F]">Prof. Ajesh Joe · Academic Repository</h4>
                  <p className="dash-mono mt-1 text-[10px] text-[#8A7E6F]">MODULE · {activePdfViewer.fileUrl}</p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-[#5A534B]">
                  <p className="text-sm font-bold text-[#22201F]">I. Foundational theorems & boundaries</p>
                  <p>
                    Let S be a piecewise-smooth, closed Gaussian surface enclosing a total algebraic charge Q_encl. By establishing the divergence properties of the electrostatic displacement vector D or field vector E, we state the global integral theorem:
                  </p>
                  <div className="dash-mono my-4 rounded-lg border border-[#EAE1D2] bg-[#FBF7F0] p-3 text-center text-[13px] text-[#4A0E1B]">
                    ∮_S E · dA = Q_encl / ε_0
                  </div>
                  <p className="text-sm font-bold text-[#22201F]">II. Comprehensive proofs & integrations</p>
                  <p>
                    For a spherically symmetric charge distribution of radial density ρ(r), we construct a concentric Gaussian sphere of radius r. Integrating the isotropic flux yields:
                  </p>
                  <ul className="list-inside list-disc space-y-1.5">
                    <li>For r &lt; R: E(r) = Q(r) / (4πε_0 r²), where Q(r) is the integral of 4π(r&#39;)² ρ(r&#39;) dr&#39;</li>
                    <li>For r ≥ R: the distribution behaves strictly as a point charge concentrated at the centre.</li>
                  </ul>
                  <p className="text-sm font-bold text-[#22201F]">III. Key competitive blockers & derivations</p>
                  <p>
                    Under examinations, problems often couple these radial integrations with dielectric boundary transitions. Recall that the tangential component of the electric field is always continuous across interfaces, whereas the normal component undergoes a discontinuity corresponding to the free surface charge density.
                  </p>
                </div>

                <div className="dash-mono mt-8 border-t border-[#EAE1D2] pt-6 text-center text-[10px] text-[#8A7E6F]">— end of document preview —</div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#EFE7D8] bg-[#FBF7F0] px-5 py-3.5">
              <span className="text-[11px] text-[#8A7E6F]">Secure client-side sandbox preview</span>
              <button onClick={() => triggerDownload(activePdfViewer.fileUrl)} className={PRIMARY_BTN}><Download size={13} /> Download full PDF</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
