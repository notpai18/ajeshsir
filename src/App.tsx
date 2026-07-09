/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import SelectionPage from './components/SelectionPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import StudentDashboard from './components/StudentDashboard';
import ProfessorDashboard from './components/ProfessorDashboard';

import { ExamType, ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ } from './types';
import { EXAMS, INITIAL_NOTES, INITIAL_VIDEOS, INITIAL_PYQS, INITIAL_PRACTICE_SHEETS, INITIAL_DOUBTS, INITIAL_FAQS } from './data';

const LOCAL_STORAGE_KEYS = {
  NOTES: 'prof_portal_notes_v1',
  VIDEOS: 'prof_portal_videos_v1',
  PYQS: 'prof_portal_pyqs_v1',
  SHEETS: 'prof_portal_sheets_v1',
  DOUBTS: 'prof_portal_doubts_v1',
  USER_ROLE: 'prof_portal_user_role_v1',
  VIEW: 'prof_portal_view_v1'
};

export default function App() {
  // View States
  const [currentView, setCurrentView] = useState<'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact'>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VIEW);
      return saved ? (JSON.parse(saved) as any) : 'home';
    } catch {
      return 'home';
    }
  });

  const [userRole, setUserRole] = useState<'student' | 'professor' | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ROLE);
      return saved ? (JSON.parse(saved) as any) : null;
    } catch {
      return null;
    }
  });

  // Data Repositories States
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [videos, setVideos] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VIDEOS);
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  const [pyqs, setPyqs] = useState<PYQ[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PYQS);
      return saved ? JSON.parse(saved) : INITIAL_PYQS;
    } catch {
      return INITIAL_PYQS;
    }
  });

  const [practiceSheets, setPracticeSheets] = useState<PracticeSheet[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SHEETS);
      return saved ? JSON.parse(saved) : INITIAL_PRACTICE_SHEETS;
    } catch {
      return INITIAL_PRACTICE_SHEETS;
    }
  });

  const [doubts, setDoubts] = useState<Doubt[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DOUBTS);
      return saved ? JSON.parse(saved) : INITIAL_DOUBTS;
    } catch {
      return INITIAL_DOUBTS;
    }
  });

  // Synchronize navigation and roles back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, JSON.stringify(currentView));
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ROLE, JSON.stringify(userRole));
    } catch (e) {
      console.warn(e);
    }
  }, [currentView, userRole]);

  // Sync core data sets back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch {}
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
    } catch {}
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PYQS, JSON.stringify(pyqs));
    } catch {}
  }, [pyqs]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SHEETS, JSON.stringify(practiceSheets));
    } catch {}
  }, [practiceSheets]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
    } catch {}
  }, [doubts]);


  // ================= STATE HANDLERS (CRUD) =================

  // Role selections
  const handleSelectRole = (selected: 'student' | 'professor') => {
    setUserRole(selected);
    setCurrentView(selected === 'student' ? 'student' : 'professor');
  };

  // NOTES CRUD
  const handleAddNote = (newNote: Omit<Note, 'id' | 'downloadCount'>) => {
    const note: Note = {
      ...newNote,
      id: `note-custom-${Date.now()}`,
      downloadCount: 0
    };
    setNotes(prev => [...prev, note]);
  };

  const handleEditNote = (id: string, updatedFields: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updatedFields } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleIncrementNoteDownload = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, downloadCount: n.downloadCount + 1 } : n));
  };

  // VIDEOS CRUD
  const handleAddVideo = (newVideo: Omit<Video, 'id'>) => {
    const vid: Video = {
      ...newVideo,
      id: `vid-custom-${Date.now()}`
    };
    setVideos(prev => [...prev, vid]);
  };

  const handleEditVideo = (id: string, updatedFields: Partial<Video>) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updatedFields } : v));
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  // PYQS CRUD
  const handleAddPyq = (newPyq: Omit<PYQ, 'id' | 'questionSize' | 'solutionSize'>) => {
    const pyq: PYQ = {
      ...newPyq,
      id: `pyq-custom-${Date.now()}`,
      questionSize: '510 KB',
      solutionSize: '1.2 MB'
    };
    setPyqs(prev => [...prev, pyq]);
  };

  const handleEditPyq = (id: string, updatedFields: Partial<PYQ>) => {
    setPyqs(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const handleDeletePyq = (id: string) => {
    setPyqs(prev => prev.filter(p => p.id !== id));
  };

  // PRACTICE SHEETS CRUD
  const handleAddPracticeSheet = (newSheet: Omit<PracticeSheet, 'id' | 'fileSize'>) => {
    const sheet: PracticeSheet = {
      ...newSheet,
      id: `ps-custom-${Date.now()}`,
      fileSize: '1.1 MB'
    };
    setPracticeSheets(prev => [...prev, sheet]);
  };

  const handleEditPracticeSheet = (id: string, updatedFields: Partial<PracticeSheet>) => {
    setPracticeSheets(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const handleDeletePracticeSheet = (id: string) => {
    setPracticeSheets(prev => prev.filter(s => s.id !== id));
  };

  // DOUBTS RESPONSES
  const handleAddDoubt = (newDoubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt'>) => {
    const ticket: Doubt = {
      ...newDoubt,
      id: `doubt-custom-${Date.now()}`,
      isAnswered: false,
      createdAt: new Date().toISOString()
    };
    setDoubts(prev => [ticket, ...prev]);
  };

  const handleReplyDoubt = (id: string, answerText: string) => {
    setDoubts(prev => prev.map(d => d.id === id ? { ...d, answerText, isAnswered: true } : d));
  };

  const handleDeleteDoubt = (id: string) => {
    setDoubts(prev => prev.filter(d => d.id !== id));
  };


  // ================= MAIN RENDER ROUTER =================

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F] transition-colors duration-300">
      
      {/* Sticky Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        userRole={userRole}
        onRoleChange={setUserRole}
      />

      {/* Main Core View Area */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <Hero
            onGetStarted={() => setCurrentView('selection')}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'selection' && (
          <SelectionPage
            onSelectRole={handleSelectRole}
          />
        )}

        {currentView === 'student' && (
          <StudentDashboard
            exams={EXAMS}
            notes={notes}
            videos={videos}
            pyqs={pyqs}
            practiceSheets={practiceSheets}
            doubts={doubts}
            faqs={INITIAL_FAQS}
            onAddDoubt={handleAddDoubt}
            onIncrementNoteDownload={handleIncrementNoteDownload}
          />
        )}

        {currentView === 'professor' && (
          <ProfessorDashboard
            exams={EXAMS}
            notes={notes}
            videos={videos}
            pyqs={pyqs}
            practiceSheets={practiceSheets}
            doubts={doubts}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            onAddVideo={handleAddVideo}
            onEditVideo={handleEditVideo}
            onDeleteVideo={handleDeleteVideo}
            onAddPyq={handleAddPyq}
            onEditPyq={handleEditPyq}
            onDeletePyq={handleDeletePyq}
            onAddPracticeSheet={handleAddPracticeSheet}
            onEditPracticeSheet={handleEditPracticeSheet}
            onDeletePracticeSheet={handleDeletePracticeSheet}
            onReplyDoubt={handleReplyDoubt}
            onDeleteDoubt={handleDeleteDoubt}
          />
        )}

        {currentView === 'about' && (
          <AboutPage />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Minimal Academic Footer */}
      <Footer
        onNavigate={setCurrentView}
        userRole={userRole}
      />

    </div>
  );
}
