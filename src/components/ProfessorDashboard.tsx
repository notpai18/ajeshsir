/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FileText,
  Video as VideoIcon,
  HelpCircle,
  Settings as SettingsIcon,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  FileSpreadsheet,
  PlusCircle,
  BookOpen,
  Calendar,
  Send,
  User,
  Filter
} from 'lucide-react';
import { ExamType, ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ } from '../types';

interface ProfessorDashboardProps {
  exams: ExamInfo[];
  notes: Note[];
  videos: Video[];
  pyqs: PYQ[];
  practiceSheets: PracticeSheet[];
  doubts: Doubt[];
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
  onReplyDoubt: (id: string, answerText: string) => void;
  onDeleteDoubt: (id: string) => void;
}

export default function ProfessorDashboard({
  exams,
  notes,
  videos,
  pyqs,
  practiceSheets,
  doubts,
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
  onDeleteDoubt
}: ProfessorDashboardProps) {
  // Sidebar navigation active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notes' | 'videos' | 'pyqs' | 'sheets' | 'doubts' | 'settings'>('dashboard');

  // Modal / Form States
  const [activeModal, setActiveModal] = useState<'add-note' | 'edit-note' | 'add-video' | 'edit-video' | 'add-pyq' | 'edit-pyq' | 'add-sheet' | 'edit-sheet' | null>(null);
  
  // Active editing item pointers
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Active doubt replying pointers
  const [replyingDoubtId, setReplyingDoubtId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Local State Forms
  const [noteForm, setNoteForm] = useState({
    course: 'jee-main' as ExamType,
    subject: '',
    chapter: '',
    title: '',
    description: '',
    fileUrl: ''
  });

  const [videoForm, setVideoForm] = useState({
    course: 'jee-main' as ExamType,
    subject: '',
    chapter: '',
    title: '',
    youtubeLink: '',
    thumbnail: '',
    description: '',
    duration: ''
  });

  const [pyqForm, setPyqForm] = useState({
    course: 'jee-main' as ExamType,
    subject: '',
    chapter: '',
    year: new Date().getFullYear() - 1,
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    questionUrl: '',
    solutionUrl: ''
  });

  const [sheetForm, setSheetForm] = useState({
    course: 'jee-main' as ExamType,
    subject: '',
    chapter: '',
    title: '',
    description: '',
    fileUrl: ''
  });

  // Dynamic dashboard calculations
  const totalNotesCount = notes.length;
  const totalVideosCount = videos.length;
  const totalPyqsCount = pyqs.length;
  const totalSheetsCount = practiceSheets.length;
  const pendingDoubtsCount = doubts.filter(d => !d.isAnswered).length;

  const recentUploads = useMemo(() => {
    // Merge list items dynamically for a "Recent Activity" chronological look
    const list = [
      ...notes.map(n => ({ type: 'Note', title: n.title, sub: n.course, detail: n.chapter })),
      ...videos.map(v => ({ type: 'Video', title: v.title, sub: v.course, detail: v.chapter })),
      ...pyqs.map(p => ({ type: 'PYQ', title: `${p.chapter} PYQ`, sub: p.course, detail: `${p.year} (${p.difficulty})` })),
    ];
    return list.slice(-4).reverse();
  }, [notes, videos, pyqs]);

  // CRUD Trigger helpers
  const handleOpenEditNote = (note: Note) => {
    setNoteForm({
      course: note.course,
      subject: note.subject,
      chapter: note.chapter,
      title: note.title,
      description: note.description,
      fileUrl: note.fileUrl
    });
    setSelectedItemId(note.id);
    setActiveModal('edit-note');
  };

  const handleOpenEditVideo = (video: Video) => {
    setVideoForm({
      course: video.course,
      subject: video.subject,
      chapter: video.chapter,
      title: video.title,
      youtubeLink: video.youtubeLink,
      thumbnail: video.thumbnail,
      description: video.description,
      duration: video.duration
    });
    setSelectedItemId(video.id);
    setActiveModal('edit-video');
  };

  const handleOpenEditPyq = (pyq: PYQ) => {
    setPyqForm({
      course: pyq.course,
      subject: pyq.subject,
      chapter: pyq.chapter,
      year: pyq.year,
      difficulty: pyq.difficulty,
      questionUrl: pyq.questionUrl,
      solutionUrl: pyq.solutionUrl
    });
    setSelectedItemId(pyq.id);
    setActiveModal('edit-pyq');
  };

  const handleOpenEditSheet = (sheet: PracticeSheet) => {
    setSheetForm({
      course: sheet.course,
      subject: sheet.subject,
      chapter: sheet.chapter,
      title: sheet.title,
      description: sheet.description,
      fileUrl: sheet.fileUrl
    });
    setSelectedItemId(sheet.id);
    setActiveModal('edit-sheet');
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === 'add-note') {
      onAddNote({
        course: noteForm.course,
        subject: noteForm.subject,
        chapter: noteForm.chapter,
        title: noteForm.title,
        description: noteForm.description,
        fileUrl: noteForm.fileUrl || 'uploaded_document.pdf',
        fileSize: '2.5 MB'
      });
    } else if (activeModal === 'edit-note' && selectedItemId) {
      onEditNote(selectedItemId, noteForm);
    }
    setActiveModal(null);
    setSelectedItemId(null);
    setNoteForm({ course: 'jee-main', subject: '', chapter: '', title: '', description: '', fileUrl: '' });
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === 'add-video') {
      onAddVideo({
        course: videoForm.course,
        subject: videoForm.subject,
        chapter: videoForm.chapter,
        title: videoForm.title,
        youtubeLink: videoForm.youtubeLink || 'https://youtube.com',
        thumbnail: videoForm.thumbnail || 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
        description: videoForm.description,
        duration: videoForm.duration || '45:00'
      });
    } else if (activeModal === 'edit-video' && selectedItemId) {
      onEditVideo(selectedItemId, videoForm);
    }
    setActiveModal(null);
    setSelectedItemId(null);
    setVideoForm({ course: 'jee-main', subject: '', chapter: '', title: '', youtubeLink: '', thumbnail: '', description: '', duration: '' });
  };

  const handlePyqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === 'add-pyq') {
      onAddPyq({
        course: pyqForm.course,
        subject: pyqForm.subject,
        chapter: pyqForm.chapter,
        year: Number(pyqForm.year),
        difficulty: pyqForm.difficulty,
        questionUrl: pyqForm.questionUrl || 'uploaded_pyq_question.pdf',
        solutionUrl: pyqForm.solutionUrl || 'uploaded_pyq_solution.pdf'
      });
    } else if (activeModal === 'edit-pyq' && selectedItemId) {
      onEditPyq(selectedItemId, {
        ...pyqForm,
        year: Number(pyqForm.year)
      });
    }
    setActiveModal(null);
    setSelectedItemId(null);
    setPyqForm({ course: 'jee-main', subject: '', chapter: '', year: 2024, difficulty: 'Medium', questionUrl: '', solutionUrl: '' });
  };

  const handleSheetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === 'add-sheet') {
      onAddPracticeSheet({
        course: sheetForm.course,
        subject: sheetForm.subject,
        chapter: sheetForm.chapter,
        title: sheetForm.title,
        description: sheetForm.description,
        fileUrl: sheetForm.fileUrl || 'uploaded_practice_sheet.pdf'
      });
    } else if (activeModal === 'edit-sheet' && selectedItemId) {
      onEditPracticeSheet(selectedItemId, sheetForm);
    }
    setActiveModal(null);
    setSelectedItemId(null);
    setSheetForm({ course: 'jee-main', subject: '', chapter: '', title: '', description: '', fileUrl: '' });
  };

  const handleReplySubmit = (id: string) => {
    if (!replyText.trim()) return;
    onReplyDoubt(id, replyText);
    setReplyText('');
    setReplyingDoubtId(null);
  };

  return (
    <div className="min-h-[80vh] bg-gray-50/50 dark:bg-slate-900/40 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* ================= SIDEBAR NAVIGATION ================= */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              
              {/* Professor Profile Card */}
              <div className="flex items-center space-x-3.5 pb-5 mb-5 border-b border-gray-100 dark:border-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white font-bold text-sm">
                  AS
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">Prof. Anand Sen</h3>
                  <span className="font-mono text-[9px] uppercase text-gray-400 dark:text-slate-500">Repository Editor</span>
                </div>
              </div>

              {/* Sidebar Menu Links */}
              <nav className="space-y-1">
                {[
                  { label: 'Dashboard', icon: <LayoutDashboard size={16} />, id: 'dashboard' as const },
                  { label: 'Manage Notes', icon: <FileText size={16} />, id: 'notes' as const },
                  { label: 'Manage Videos', icon: <VideoIcon size={16} />, id: 'videos' as const },
                  { label: 'Manage PYQs', icon: <FileSpreadsheet size={16} />, id: 'pyqs' as const },
                  { label: 'Practice Sheets', icon: <FileText size={16} />, id: 'sheets' as const },
                  { label: 'Student Doubts', icon: <HelpCircle size={16} />, id: 'doubts' as const }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' 
                          : 'text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                      }`}
                      id={`sidebar-tab-${item.id}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.id === 'doubts' && pendingDoubtsCount > 0 && (
                        <span className="ml-auto rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-extrabold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                          {pendingDoubtsCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

            </div>
          </aside>

          {/* ================= MAIN CONTENT MODULES ================= */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Academic Resource Counters */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Study Notes', count: totalNotesCount, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Lectures', count: totalVideosCount, color: 'text-red-600 bg-red-50' },
                    { label: 'PYQ Sets', count: totalPyqsCount, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Practice Drills', count: totalSheetsCount, color: 'text-indigo-600 bg-indigo-50' }
                  ].map((stat, i) => (
                    <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <span className="font-mono text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase">{stat.label}</span>
                      <p className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">{stat.count}</p>
                    </div>
                  ))}
                </div>

                {/* Split grid: Pending doubts and Recent activity */}
                <div className="grid gap-6 md:grid-cols-2">
                  
                  {/* Pending doubts panel */}
                  <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Pending Doubts</h4>
                      <span className="rounded bg-red-50 px-2 py-0.5 font-mono text-[10px] font-extrabold text-red-600">{pendingDoubtsCount} Unanswered</span>
                    </div>

                    <div className="mt-4 space-y-4">
                      {doubts.filter(d => !d.isAnswered).length === 0 ? (
                        <p className="text-xs text-gray-400 py-6 text-center">All submitted student doubts have been answered.</p>
                      ) : (
                        doubts.filter(d => !d.isAnswered).slice(0, 3).map((doubt) => (
                          <div key={doubt.id} className="flex items-start space-x-3 text-xs">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400 border border-gray-100">
                              <User size={13} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900 dark:text-slate-200 truncate">{doubt.name}</span>
                                <span className="font-mono text-[9px] text-gray-400">{new Date(doubt.createdAt).toLocaleDateString()}</span>
                              </div>
                              <span className="text-[10px] text-blue-500 font-semibold">{doubt.subject}</span>
                              <p className="text-gray-500 dark:text-slate-400 line-clamp-1 mt-0.5">{doubt.question}</p>
                            </div>
                          </div>
                        ))
                      )}
                      {pendingDoubtsCount > 3 && (
                        <button onClick={() => setActiveTab('doubts')} className="w-full text-center text-[10px] font-bold text-blue-600 hover:underline">
                          View remaining {pendingDoubtsCount - 3} doubts
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h4 className="pb-4 border-b border-gray-100 font-mono text-xs font-bold uppercase tracking-wider text-gray-400 dark:border-slate-800 dark:text-slate-500">Recent Uploads</h4>
                    
                    <div className="mt-4 space-y-4">
                      {recentUploads.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs border-l-2 border-blue-500 pl-3.5">
                          <div>
                            <span className="font-bold text-gray-800 dark:text-slate-200">{item.title}</span>
                            <span className="block text-[10px] text-gray-400 dark:text-slate-500">{item.detail}</span>
                          </div>
                          <span className="rounded bg-gray-50 border border-gray-100 px-2 py-0.5 font-mono text-[9px] text-gray-500 dark:bg-slate-950/20 dark:border-slate-850">
                            {item.sub.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: MANAGE NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-5">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Study Notes Catalog</h3>
                  <button
                    onClick={() => {
                      setNoteForm({ course: 'jee-main', subject: '', chapter: '', title: '', description: '', fileUrl: '' });
                      setActiveModal('add-note');
                    }}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                    id="add-note-btn"
                  >
                    <Plus size={14} />
                    <span>Add Study Note</span>
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60 font-mono text-[10px] uppercase text-gray-500 dark:border-slate-800">
                        <th className="px-5 py-3.5">Syllabus Focus</th>
                        <th className="px-5 py-3.5">Title & Chapter</th>
                        <th className="px-5 py-3.5">Views</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {notes.map((note) => (
                        <tr key={note.id} className="hover:bg-gray-50/30">
                          <td className="px-5 py-4">
                            <span className="font-mono uppercase font-bold text-gray-500">{note.course}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">{note.subject}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-bold text-gray-900 dark:text-slate-200">{note.title}</span>
                            <span className="block text-gray-400 text-[10px] mt-0.5">{note.chapter}</span>
                          </td>
                          <td className="px-5 py-4 font-mono font-semibold text-gray-600">{note.downloadCount}</td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end space-x-1">
                              <button onClick={() => handleOpenEditNote(note)} className="p-1.5 text-gray-400 hover:text-blue-500">
                                <Edit size={13} />
                              </button>
                              <button onClick={() => onDeleteNote(note.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                                <Trash2 size={13} />
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

            {/* TAB 3: MANAGE VIDEOS */}
            {activeTab === 'videos' && (
              <div className="space-y-5">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Video Lectures Catalog</h3>
                  <button
                    onClick={() => {
                      setVideoForm({ course: 'jee-main', subject: '', chapter: '', title: '', youtubeLink: '', thumbnail: '', description: '', duration: '' });
                      setActiveModal('add-video');
                    }}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                    id="add-video-btn"
                  >
                    <Plus size={14} />
                    <span>Add Video Lecture</span>
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60 font-mono text-[10px] uppercase text-gray-500 dark:border-slate-800">
                        <th className="px-5 py-3.5">Course</th>
                        <th className="px-5 py-3.5">Video Title</th>
                        <th className="px-5 py-3.5">Duration</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {videos.map((vid) => (
                        <tr key={vid.id} className="hover:bg-gray-50/30">
                          <td className="px-5 py-4">
                            <span className="font-mono uppercase font-bold text-gray-500">{vid.course}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">{vid.subject}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-bold text-gray-900 dark:text-slate-200">{vid.title}</span>
                            <span className="block text-gray-400 text-[10px] mt-0.5">{vid.chapter}</span>
                          </td>
                          <td className="px-5 py-4 font-mono font-semibold text-gray-600">{vid.duration}</td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end space-x-1">
                              <button onClick={() => handleOpenEditVideo(vid)} className="p-1.5 text-gray-400 hover:text-blue-500">
                                <Edit size={13} />
                              </button>
                              <button onClick={() => onDeleteVideo(vid.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                                <Trash2 size={13} />
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

            {/* TAB 4: MANAGE PYQS */}
            {activeTab === 'pyqs' && (
              <div className="space-y-5">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Previous Year Questions Library</h3>
                  <button
                    onClick={() => {
                      setPyqForm({ course: 'jee-main', subject: '', chapter: '', year: 2024, difficulty: 'Medium', questionUrl: '', solutionUrl: '' });
                      setActiveModal('add-pyq');
                    }}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                    id="add-pyq-btn"
                  >
                    <Plus size={14} />
                    <span>Add PYQ Booklet</span>
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60 font-mono text-[10px] uppercase text-gray-500 dark:border-slate-800">
                        <th className="px-5 py-3.5">Course</th>
                        <th className="px-5 py-3.5">Chapter & Year</th>
                        <th className="px-5 py-3.5">Difficulty</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {pyqs.map((pyq) => (
                        <tr key={pyq.id} className="hover:bg-gray-50/30">
                          <td className="px-5 py-4">
                            <span className="font-mono uppercase font-bold text-gray-500">{pyq.course}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">{pyq.subject}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-bold text-gray-900 dark:text-slate-200">{pyq.chapter}</span>
                            <span className="block text-gray-400 text-[10px] mt-0.5">Year: {pyq.year}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                              pyq.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                              pyq.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              {pyq.difficulty}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end space-x-1">
                              <button onClick={() => handleOpenEditPyq(pyq)} className="p-1.5 text-gray-400 hover:text-blue-500">
                                <Edit size={13} />
                              </button>
                              <button onClick={() => onDeletePyq(pyq.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                                <Trash2 size={13} />
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

            {/* TAB 5: MANAGE SHEETS */}
            {activeTab === 'sheets' && (
              <div className="space-y-5">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Practice Sheets Library</h3>
                  <button
                    onClick={() => {
                      setSheetForm({ course: 'jee-main', subject: '', chapter: '', title: '', description: '', fileUrl: '' });
                      setActiveModal('add-sheet');
                    }}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                    id="add-sheet-btn"
                  >
                    <Plus size={14} />
                    <span>Add Practice Sheet</span>
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60 font-mono text-[10px] uppercase text-gray-500 dark:border-slate-800">
                        <th className="px-5 py-3.5">Course</th>
                        <th className="px-5 py-3.5">Title</th>
                        <th className="px-5 py-3.5">Chapter</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {practiceSheets.map((sheet) => (
                        <tr key={sheet.id} className="hover:bg-gray-50/30">
                          <td className="px-5 py-4">
                            <span className="font-mono uppercase font-bold text-gray-500">{sheet.course}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">{sheet.subject}</span>
                          </td>
                          <td className="px-5 py-4 font-bold text-gray-900 dark:text-slate-200">{sheet.title}</td>
                          <td className="px-5 py-4 text-gray-500">{sheet.chapter}</td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end space-x-1">
                              <button onClick={() => handleOpenEditSheet(sheet)} className="p-1.5 text-gray-400 hover:text-blue-500">
                                <Edit size={13} />
                              </button>
                              <button onClick={() => onDeletePracticeSheet(sheet.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                                <Trash2 size={13} />
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

            {/* TAB 6: STUDENT DOUBTS (REPLY ENGINE) */}
            {activeTab === 'doubts' && (
              <div className="space-y-5">
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Student Academic Doubts</h3>

                <div className="space-y-4">
                  {doubts.map((doubt) => (
                    <div
                      key={doubt.id}
                      className={`rounded-2xl border bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 ${
                        doubt.isAnswered ? 'border-gray-100 opacity-80' : 'border-blue-200 shadow-md ring-1 ring-blue-100 dark:ring-0'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                            {doubt.subject}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                            {doubt.name} <span className="font-normal font-mono text-[10px] text-gray-400">({doubt.email})</span>
                          </h4>
                        </div>
                        <span className="font-mono text-[9px] text-gray-400">{new Date(doubt.createdAt).toLocaleDateString()}</span>
                      </div>

                      <p className="mt-3.5 text-xs text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100 dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-300">
                        {doubt.question}
                      </p>

                      {doubt.attachmentName && (
                        <span className="mt-2.5 inline-flex items-center space-x-1 font-mono text-[10px] text-gray-400">
                          <span>📎 Attachment:</span>
                          <span className="underline cursor-pointer hover:text-blue-500">{doubt.attachmentName}</span>
                        </span>
                      )}

                      {/* Replying view and answers */}
                      {doubt.isAnswered ? (
                        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-slate-800">
                          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-600">✓ Your Response:</span>
                          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400 leading-relaxed italic">
                            "{doubt.answerText}"
                          </p>
                          <div className="mt-3.5 flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setReplyingDoubtId(doubt.id);
                                setReplyText(doubt.answerText || '');
                              }}
                              className="text-[11px] font-semibold text-blue-600 hover:underline"
                            >
                              Edit Response
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              onClick={() => onDeleteDoubt(doubt.id)}
                              className="text-[11px] font-semibold text-red-500 hover:underline"
                            >
                              Delete Ticket
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-slate-800">
                          {replyingDoubtId === doubt.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50/30 p-3 text-xs outline-none focus:border-blue-500"
                                placeholder="Type your academic response..."
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setReplyingDoubtId(null)}
                                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleReplySubmit(doubt.id)}
                                  className="inline-flex items-center space-x-1 rounded-lg bg-blue-500 text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-blue-600"
                                >
                                  <Send size={11} />
                                  <span>Send Answer</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() => {
                                  setReplyingDoubtId(doubt.id);
                                  setReplyText('');
                                }}
                                className="rounded-lg bg-gray-950 text-white px-3 py-1.5 text-xs font-semibold hover:bg-gray-800 dark:bg-slate-100 dark:text-slate-900"
                              >
                                Answer Query
                              </button>
                              <button onClick={() => onDeleteDoubt(doubt.id)} className="text-[11px] font-semibold text-red-500 hover:underline">
                                Delete Ticket
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 7: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">Professor Settings</h3>
                <p className="text-xs text-gray-400 mb-6">Configure metadata settings for your digital repository.</p>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Primary Designation</label>
                    <input
                      type="text"
                      readOnly
                      value="Professor of Physics & Applied Mathematics"
                      className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Office Hours Location</label>
                    <input
                      type="text"
                      readOnly
                      value="Room 402-B, Science Block II"
                      className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-400"
                    />
                  </div>
                  <div className="rounded-xl bg-blue-50/30 p-4 border border-blue-100/50">
                    <p className="text-[11px] leading-relaxed text-blue-800">
                      <strong>Client-Side Engine State:</strong> All notes, pyqs, videos, and student doubts are persisted in your web browser's <code>localStorage</code> cache. To simulate a full system reset, you can clear your cache or click Reset State under Settings.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* ================= CRUD FORM MODAL OVERLAYS ================= */}
      
      {/* NOTES MODAL */}
      {(activeModal === 'add-note' || activeModal === 'edit-note') && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {activeModal === 'add-note' ? 'Add Study Note' : 'Edit Study Note'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleNoteSubmit} className="p-5 space-y-4">
              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Syllabus Focus</label>
                  <select
                    value={noteForm.course}
                    onChange={(e) => setNoteForm({ ...noteForm, course: e.target.value as ExamType })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  >
                    {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Subject</label>
                  <input
                    type="text"
                    required
                    value={noteForm.subject}
                    onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                    placeholder="Physics"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Chapter</label>
                <input
                  type="text"
                  required
                  value={noteForm.chapter}
                  onChange={(e) => setNoteForm({ ...noteForm, chapter: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="e.g. Electrostatics"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Document Title</label>
                <input
                  type="text"
                  required
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="Gauss's Law Formulations"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Short Description</label>
                <textarea
                  required
                  rows={3}
                  value={noteForm.description}
                  onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="A breakdown of electric fluxes and Gaussian integrations..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">PDF File Name / Simulator Path</label>
                <input
                  type="text"
                  value={noteForm.fileUrl}
                  onChange={(e) => setNoteForm({ ...noteForm, fileUrl: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="gauss_notes_final.pdf"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 text-white px-4 py-2.5 text-xs font-semibold hover:bg-blue-700"
                >
                  {activeModal === 'add-note' ? 'Upload Note' : 'Update Note'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIDEOS MODAL */}
      {(activeModal === 'add-video' || activeModal === 'edit-video') && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {activeModal === 'add-video' ? 'Add Video Lecture' : 'Edit Video Lecture'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleVideoSubmit} className="p-5 space-y-4">
              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Syllabus Focus</label>
                  <select
                    value={videoForm.course}
                    onChange={(e) => setVideoForm({ ...videoForm, course: e.target.value as ExamType })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  >
                    {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Subject</label>
                  <input
                    type="text"
                    required
                    value={videoForm.subject}
                    onChange={(e) => setVideoForm({ ...videoForm, subject: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                    placeholder="Physics"
                  />
                </div>
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Chapter</label>
                  <input
                    type="text"
                    required
                    value={videoForm.chapter}
                    onChange={(e) => setVideoForm({ ...videoForm, chapter: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                    placeholder="e.g. Calculus"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Duration</label>
                  <input
                    type="text"
                    required
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                    placeholder="e.g. 45:12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Lecture Title</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="e.g. Limits Introduction"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">YouTube / Stream Link</label>
                <input
                  type="url"
                  value={videoForm.youtubeLink}
                  onChange={(e) => setVideoForm({ ...videoForm, youtubeLink: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={videoForm.thumbnail}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="Unsplash image URL..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Description</label>
                <textarea
                  required
                  rows={2}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="Visual representation of geometric limits..."
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 text-white px-4 py-2.5 text-xs font-semibold hover:bg-blue-700"
                >
                  {activeModal === 'add-video' ? 'Publish Lecture' : 'Update Lecture'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* PYQ MODAL */}
      {(activeModal === 'add-pyq' || activeModal === 'edit-pyq') && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {activeModal === 'add-pyq' ? 'Add PYQ Booklet' : 'Edit PYQ Booklet'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handlePyqSubmit} className="p-5 space-y-4">
              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Syllabus Focus</label>
                  <select
                    value={pyqForm.course}
                    onChange={(e) => setPyqForm({ ...pyqForm, course: e.target.value as ExamType })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  >
                    {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Subject</label>
                  <input
                    type="text"
                    required
                    value={pyqForm.subject}
                    onChange={(e) => setPyqForm({ ...pyqForm, subject: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                    placeholder="e.g. Physics"
                  />
                </div>
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Year</label>
                  <input
                    type="number"
                    required
                    value={pyqForm.year}
                    onChange={(e) => setPyqForm({ ...pyqForm, year: Number(e.target.value) })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Difficulty</label>
                  <select
                    value={pyqForm.difficulty}
                    onChange={(e) => setPyqForm({ ...pyqForm, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Chapter</label>
                <input
                  type="text"
                  required
                  value={pyqForm.chapter}
                  onChange={(e) => setPyqForm({ ...pyqForm, chapter: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="e.g. Rotational Dynamics"
                />
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Question PDF File Path</label>
                  <input
                    type="text"
                    value={pyqForm.questionUrl}
                    onChange={(e) => setPyqForm({ ...pyqForm, questionUrl: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                    placeholder="pyq_questions_2024.pdf"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Solution PDF File Path</label>
                  <input
                    type="text"
                    value={pyqForm.solutionUrl}
                    onChange={(e) => setPyqForm({ ...pyqForm, solutionUrl: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                    placeholder="pyq_solutions_2024.pdf"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 text-white px-4 py-2.5 text-xs font-semibold hover:bg-blue-700"
                >
                  {activeModal === 'add-pyq' ? 'Publish PYQ' : 'Update PYQ'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* PRACTICE SHEET MODAL */}
      {(activeModal === 'add-sheet' || activeModal === 'edit-sheet') && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {activeModal === 'add-sheet' ? 'Add Practice Sheet' : 'Edit Practice Sheet'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSheetSubmit} className="p-5 space-y-4">
              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Syllabus Focus</label>
                  <select
                    value={sheetForm.course}
                    onChange={(e) => setSheetForm({ ...sheetForm, course: e.target.value as ExamType })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  >
                    {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">Subject</label>
                  <input
                    type="text"
                    required
                    value={sheetForm.subject}
                    onChange={(e) => setSheetForm({ ...sheetForm, subject: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                    placeholder="Physics"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Chapter</label>
                <input
                  type="text"
                  required
                  value={sheetForm.chapter}
                  onChange={(e) => setSheetForm({ ...sheetForm, chapter: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="e.g. Fluid Mechanics"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Sheet Title</label>
                <input
                  type="text"
                  required
                  value={sheetForm.title}
                  onChange={(e) => setSheetForm({ ...sheetForm, title: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="Electrostatic Potential Drill"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">Description</label>
                <textarea
                  required
                  rows={3}
                  value={sheetForm.description}
                  onChange={(e) => setSheetForm({ ...sheetForm, description: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="45 multiple-choice targets with dielectric insertion questions..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500">File Simulator Path</label>
                <input
                  type="text"
                  value={sheetForm.fileUrl}
                  onChange={(e) => setSheetForm({ ...sheetForm, fileUrl: e.target.value })}
                  className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3 py-2 text-xs"
                  placeholder="practice_sheets_dynamics.pdf"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 text-white px-4 py-2.5 text-xs font-semibold hover:bg-blue-700"
                >
                  {activeModal === 'add-sheet' ? 'Upload Sheet' : 'Update Sheet'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
