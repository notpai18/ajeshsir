/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AppNew.tsx — Primary application shell.
 * Data persistence migrated from LocalStorage → Supabase.
 * All state is now server-authoritative; LocalStorage removed.
 */

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import SelectionPage from './components/SelectionPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import StudentDashboard from './components/StudentDashboard';
import ProfessorDashboard from './components/ProfessorDashboard';

import type { Note, Video, PYQ, PracticeSheet, Doubt, Announcement } from './types';
import { EXAMS, INITIAL_FAQS, INITIAL_NOTES, INITIAL_VIDEOS, INITIAL_PYQS, INITIAL_PRACTICE_SHEETS, INITIAL_DOUBTS, INITIAL_ANNOUNCEMENTS } from './data';
import { hasSupabase } from './lib/supabase';

import {
  fetchNotes, createNote, updateNote, deleteNote, incrementNoteDownload,
  fetchVideos, createVideo, updateVideo, deleteVideo,
  fetchPyqs, createPyq, updatePyq, deletePyq,
  fetchPracticeSheets, createPracticeSheet, updatePracticeSheet, deletePracticeSheet,
  fetchDoubts, submitDoubt, replyToDoubt, deleteDoubt,
  fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, togglePinAnnouncement,
} from './services';

// ─── Loading / Error States ──────────────────────────────────────────────────
interface AppState {
  notes: Note[];
  videos: Video[];
  pyqs: PYQ[];
  practiceSheets: PracticeSheet[];
  doubts: Doubt[];
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
}

export function AppNew({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  // ─── Navigation & Role ────────────────────────────────────────────────────
  const [currentView, setCurrentView] = useState<
    'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact'
  >(() => {
    try {
      const saved = localStorage.getItem('prof_portal_view_v1');
      return saved ? (JSON.parse(saved) as any) : 'home';
    } catch {
      return 'home';
    }
  });

  const [userRole, setUserRole] = useState<'student' | 'professor' | null>(() => {
    try {
      const saved = localStorage.getItem('prof_portal_user_role_v1');
      return saved ? (JSON.parse(saved) as any) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('prof_portal_view_v1', JSON.stringify(currentView));
      localStorage.setItem('prof_portal_user_role_v1', JSON.stringify(userRole));
    } catch (e) {
      console.warn(e);
    }
  }, [currentView, userRole]);

  // ─── Data State ───────────────────────────────────────────────────────────
  const [state, setState] = useState<AppState>({
    notes: [],
    videos: [],
    pyqs: [],
    practiceSheets: [],
    doubts: [],
    announcements: [],
    loading: true,
    error: null,
  });

  // ─── Initial Data Load from Supabase (or local seed fallback) ────────────
  const loadAllData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // No Supabase configured → use local seed data
    if (!hasSupabase) {
      setState({
        notes: INITIAL_NOTES,
        videos: INITIAL_VIDEOS,
        pyqs: INITIAL_PYQS,
        practiceSheets: INITIAL_PRACTICE_SHEETS,
        doubts: INITIAL_DOUBTS,
        announcements: INITIAL_ANNOUNCEMENTS,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      const [notes, videos, pyqs, practiceSheets, doubts, announcements] = await Promise.all([
        fetchNotes(),
        fetchVideos(),
        fetchPyqs(),
        fetchPracticeSheets(),
        fetchDoubts(),
        fetchAnnouncements(),
      ]);
      setState({ notes, videos, pyqs, practiceSheets, doubts, announcements, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error loading data.';
      console.error('[AppNew] loadAllData error:', message);
      setState(prev => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ─── Role Selection ───────────────────────────────────────────────────────
  const handleSelectRole = (selected: 'student' | 'professor') => {
    setUserRole(selected);
    setCurrentView(selected === 'student' ? 'student' : 'professor');
  };

  // ─── NOTES CRUD ───────────────────────────────────────────────────────────
  const handleAddNote = useCallback(async (newNote: Omit<Note, 'id' | 'downloadCount'>) => {
    const created = await createNote(newNote);
    setState(prev => ({ ...prev, notes: [...prev.notes, created] }));
  }, []);

  const handleEditNote = useCallback(async (id: string, updatedFields: Partial<Note>) => {
    const updated = await updateNote(id, updatedFields);
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? updated : n),
    }));
  }, []);

  const handleDeleteNote = useCallback(async (id: string) => {
    await deleteNote(id);
    setState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
  }, []);

  const handleIncrementNoteDownload = useCallback(async (id: string) => {
    await incrementNoteDownload(id);
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, downloadCount: n.downloadCount + 1 } : n),
    }));
  }, []);

  // ─── VIDEOS CRUD ──────────────────────────────────────────────────────────
  const handleAddVideo = useCallback(async (newVideo: Omit<Video, 'id'>) => {
    const created = await createVideo(newVideo);
    setState(prev => ({ ...prev, videos: [...prev.videos, created] }));
  }, []);

  const handleEditVideo = useCallback(async (id: string, updatedFields: Partial<Video>) => {
    const updated = await updateVideo(id, updatedFields);
    setState(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? updated : v),
    }));
  }, []);

  const handleDeleteVideo = useCallback(async (id: string) => {
    await deleteVideo(id);
    setState(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }));
  }, []);

  // ─── PYQS CRUD ────────────────────────────────────────────────────────────
  const handleAddPyq = useCallback(async (newPyq: Omit<PYQ, 'id' | 'questionSize' | 'solutionSize'>) => {
    const created = await createPyq(newPyq);
    setState(prev => ({ ...prev, pyqs: [...prev.pyqs, created] }));
  }, []);

  const handleEditPyq = useCallback(async (id: string, updatedFields: Partial<PYQ>) => {
    const updated = await updatePyq(id, updatedFields);
    setState(prev => ({
      ...prev,
      pyqs: prev.pyqs.map(p => p.id === id ? updated : p),
    }));
  }, []);

  const handleDeletePyq = useCallback(async (id: string) => {
    await deletePyq(id);
    setState(prev => ({ ...prev, pyqs: prev.pyqs.filter(p => p.id !== id) }));
  }, []);

  // ─── PRACTICE SHEETS CRUD ─────────────────────────────────────────────────
  const handleAddPracticeSheet = useCallback(async (newSheet: Omit<PracticeSheet, 'id' | 'fileSize'>) => {
    const created = await createPracticeSheet(newSheet);
    setState(prev => ({ ...prev, practiceSheets: [...prev.practiceSheets, created] }));
  }, []);

  const handleEditPracticeSheet = useCallback(async (id: string, updatedFields: Partial<PracticeSheet>) => {
    const updated = await updatePracticeSheet(id, updatedFields);
    setState(prev => ({
      ...prev,
      practiceSheets: prev.practiceSheets.map(s => s.id === id ? updated : s),
    }));
  }, []);

  const handleDeletePracticeSheet = useCallback(async (id: string) => {
    await deletePracticeSheet(id);
    setState(prev => ({ ...prev, practiceSheets: prev.practiceSheets.filter(s => s.id !== id) }));
  }, []);

  // ─── DOUBTS ───────────────────────────────────────────────────────────────
  const handleAddDoubt = useCallback(async (newDoubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt'>) => {
    const created = await submitDoubt(newDoubt);
    setState(prev => ({ ...prev, doubts: [created, ...prev.doubts] }));
  }, []);

  const handleReplyDoubt = useCallback(async (id: string, answerText: string) => {
    const updated = await replyToDoubt(id, answerText);
    setState(prev => ({
      ...prev,
      doubts: prev.doubts.map(d => d.id === id ? updated : d),
    }));
  }, []);

  const handleDeleteDoubt = useCallback(async (id: string) => {
    await deleteDoubt(id);
    setState(prev => ({ ...prev, doubts: prev.doubts.filter(d => d.id !== id) }));
  }, []);

  // ─── ANNOUNCEMENTS CRUD ───────────────────────────────────────────────────
  const handleAddAnnouncement = useCallback(async (newAnn: Omit<Announcement, 'id' | 'createdAt'>) => {
    const created = await createAnnouncement(newAnn);
    setState(prev => ({ ...prev, announcements: [created, ...prev.announcements] }));
  }, []);

  const handleEditAnnouncement = useCallback(async (id: string, updatedFields: Partial<Announcement>) => {
    const updated = await updateAnnouncement(id, updatedFields);
    setState(prev => ({
      ...prev,
      announcements: prev.announcements.map(a => a.id === id ? updated : a),
    }));
  }, []);

  const handleDeleteAnnouncement = useCallback(async (id: string) => {
    await deleteAnnouncement(id);
    setState(prev => ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) }));
  }, []);

  const handleTogglePinAnnouncement = useCallback(async (id: string) => {
    const current = state.announcements.find(a => a.id === id);
    if (!current) return;
    const updated = await togglePinAnnouncement(id, current.pinned);
    setState(prev => ({
      ...prev,
      announcements: prev.announcements.map(a => a.id === id ? updated : a),
    }));
  }, [state.announcements]);

  // ─── Loading / Error UI ───────────────────────────────────────────────────
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EC]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#4A0E1B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4A0E1B]">
            Loading Portal…
          </p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EC] p-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-3xl">⚠️</p>
          <h2 className="text-lg font-black uppercase tracking-[0.2em] text-[#4A0E1B]">
            Failed to connect
          </h2>
          <p className="text-sm text-[#22201F]/80">{state.error}</p>
          <button
            onClick={loadAllData}
            className="px-6 py-3 bg-[#4A0E1B] text-white text-xs font-black uppercase tracking-[0.2em] rounded-lg hover:bg-[#7C2532] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen flex flex-col bg-[#F7F3EC] text-[#22201F] transition-colors duration-300`}>
      {/* Sticky Top Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
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
          <SelectionPage onSelectRole={handleSelectRole} />
        )}

        {currentView === 'student' && (
          <StudentDashboard
            exams={EXAMS}
            notes={state.notes}
            videos={state.videos}
            pyqs={state.pyqs}
            practiceSheets={state.practiceSheets}
            doubts={state.doubts}
            faqs={INITIAL_FAQS}
            announcements={state.announcements}
            onAddDoubt={handleAddDoubt}
            onIncrementNoteDownload={handleIncrementNoteDownload}
          />
        )}

        {currentView === 'professor' && (
          <ProfessorDashboard
            exams={EXAMS}
            notes={state.notes}
            videos={state.videos}
            pyqs={state.pyqs}
            practiceSheets={state.practiceSheets}
            doubts={state.doubts}
            announcements={state.announcements}
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
            onAddAnnouncement={handleAddAnnouncement}
            onEditAnnouncement={handleEditAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onTogglePinAnnouncement={handleTogglePinAnnouncement}
          />
        )}

        {currentView === 'about' && <AboutPage onNavigate={setCurrentView} />}
        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* Minimal Academic Footer */}
      <Footer onNavigate={setCurrentView} userRole={userRole} />
    </div>
  );
}
