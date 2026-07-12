/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PortalDataContext — centralised server-authoritative data layer.
 *
 * All data state and CRUD handlers previously in AppNew.tsx now live here.
 * Consumers call `usePortalData()` to read state and dispatch mutations.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Note, Video, PYQ, PracticeSheet, Doubt, Announcement } from '../types';
import { INITIAL_FAQS, INITIAL_NOTES, INITIAL_VIDEOS, INITIAL_PYQS, INITIAL_PRACTICE_SHEETS, INITIAL_DOUBTS, INITIAL_ANNOUNCEMENTS } from '../data';
import { hasSupabase } from '../lib/supabase';
import { normaliseSubject } from '../constants/subjects';
import {
  fetchNotes, createNote, updateNote, deleteNote, incrementNoteDownload,
  fetchVideos, createVideo, updateVideo, deleteVideo,
  fetchPyqs, createPyq, updatePyq, deletePyq,
  fetchPracticeSheets, createPracticeSheet, updatePracticeSheet, deletePracticeSheet,
  fetchDoubts, submitDoubt, replyToDoubt, deleteDoubt, updateDoubtStatus, markDoubtSeen,
  fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, togglePinAnnouncement,
} from '../services';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PortalDataState {
  notes: Note[];
  videos: Video[];
  pyqs: PYQ[];
  practiceSheets: PracticeSheet[];
  doubts: Doubt[];
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
}

interface PortalDataContextValue extends PortalDataState {
  reload: () => Promise<void>;

  // Notes
  handleAddNote: (note: Omit<Note, 'id' | 'downloadCount'>) => Promise<void>;
  handleEditNote: (id: string, fields: Partial<Note>) => Promise<void>;
  handleDeleteNote: (id: string) => Promise<void>;
  handleIncrementNoteDownload: (id: string) => Promise<void>;

  // Videos
  handleAddVideo: (video: Omit<Video, 'id'>) => Promise<void>;
  handleEditVideo: (id: string, fields: Partial<Video>) => Promise<void>;
  handleDeleteVideo: (id: string) => Promise<void>;

  // PYQs
  handleAddPyq: (pyq: Omit<PYQ, 'id' | 'questionSize' | 'solutionSize'>) => Promise<void>;
  handleEditPyq: (id: string, fields: Partial<PYQ>) => Promise<void>;
  handleDeletePyq: (id: string) => Promise<void>;

  // Practice Sheets
  handleAddPracticeSheet: (sheet: Omit<PracticeSheet, 'id' | 'fileSize'>) => Promise<void>;
  handleEditPracticeSheet: (id: string, fields: Partial<PracticeSheet>) => Promise<void>;
  handleDeletePracticeSheet: (id: string) => Promise<void>;

  // Doubts
  handleAddDoubt: (doubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt'>) => Promise<void>;
  handleReplyDoubt: (id: string, replyData: { reply_text?: string; image_urls?: string[]; video_urls?: string[]; audio_urls?: string[]; attachment_urls?: string[] }) => Promise<void>;
  handleDeleteDoubt: (id: string) => Promise<void>;
  handleMarkSeen: (id: string) => Promise<void>;

  // Announcements
  handleAddAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  handleEditAnnouncement: (id: string, fields: Partial<Announcement>) => Promise<void>;
  handleDeleteAnnouncement: (id: string) => Promise<void>;
  handleTogglePinAnnouncement: (id: string) => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function PortalDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortalDataState>({
    notes: [],
    videos: [],
    pyqs: [],
    practiceSheets: [],
    doubts: [],
    announcements: [],
    loading: true,
    error: null,
  });

  const reload = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    const badTitles = ['Projectile Motion on Inclined Planes', 'Limits, Continuity, and Differentiability', 'dfv', 'df'];
    const NEW_CARDS: Note[] = [
      { id: 'custom-card-1', course: 'jee-main', subject: 'Physical Chemistry', chapter: 'Thermodynamics', title: 'First and Second Law Applications', description: 'Enthalpy, entropy, and Gibbs free energy derivations with worked numerical problems on spontaneity and heat engines.', fileUrl: 'sample.pdf', fileSize: '1.2 MB', downloadCount: 50, tags: [] },
      { id: 'custom-card-2', course: 'jee-main', subject: 'Physical Chemistry', chapter: 'Equilibrium', title: 'Chemical and Ionic Equilibrium', description: "Le Chatelier's principle, equilibrium constant relations, buffer solutions, and pH calculations for competitive-exam problem types.", fileUrl: 'sample.pdf', fileSize: '1.5 MB', downloadCount: 75, tags: [] },
      { id: 'custom-card-3', course: 'jee-main', subject: 'Physical Chemistry', chapter: 'Electrochemistry', title: 'Cells, EMF, and Nernst Equation', description: 'Galvanic and electrolytic cells, standard electrode potentials, and Nernst equation applications with previous year question patterns.', fileUrl: 'sample.pdf', fileSize: '1.3 MB', downloadCount: 60, tags: [] },
      { id: 'custom-card-4', course: 'jee-main', subject: 'Physical Chemistry', chapter: 'Kinetics', title: 'Rate Laws and Reaction Order', description: 'Integrated rate equations, half-life derivations, and Arrhenius equation problems with graphical interpretation.', fileUrl: 'sample.pdf', fileSize: '1.4 MB', downloadCount: 85, tags: [] },
    ];

    // No Supabase configured → use local seed data
    if (!hasSupabase) {
      let filteredNotes = INITIAL_NOTES.filter(n => !badTitles.includes(n.title));
      const existingTitles = filteredNotes.map(n => n.title);
      filteredNotes = [...filteredNotes, ...NEW_CARDS.filter(c => !existingTitles.includes(c.title))];

      setState({
        notes: filteredNotes,
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
        fetchNotes(), fetchVideos(), fetchPyqs(), fetchPracticeSheets(), fetchDoubts(), fetchAnnouncements(),
      ]);

      let filteredNotes = notes.filter(n => !badTitles.includes(n.title));
      const existingTitles = filteredNotes.map(n => n.title);
      filteredNotes = [...filteredNotes, ...NEW_CARDS.filter(c => !existingTitles.includes(c.title))];

      setState({
        notes: filteredNotes.map(n => ({ ...n, subject: normaliseSubject(n.subject) })),
        videos: videos.map(v => ({ ...v, subject: normaliseSubject(v.subject) })),
        pyqs: pyqs.map(p => ({ ...p, subject: normaliseSubject(p.subject) })),
        practiceSheets: practiceSheets.map(s => ({ ...s, subject: normaliseSubject(s.subject) })),
        doubts,
        announcements,
        loading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error loading data.';
      console.error('[PortalDataContext] reload error:', message);
      setState(prev => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // ─── Notes CRUD ────────────────────────────────────────────────────────────
  const handleAddNote = useCallback(async (newNote: Omit<Note, 'id' | 'downloadCount'>) => {
    const created = await createNote(newNote);
    setState(prev => ({ ...prev, notes: [...prev.notes, created] }));
  }, []);

  const handleEditNote = useCallback(async (id: string, fields: Partial<Note>) => {
    const updated = await updateNote(id, fields);
    setState(prev => ({ ...prev, notes: prev.notes.map(n => n.id === id ? updated : n) }));
  }, []);

  const handleDeleteNote = useCallback(async (id: string) => {
    await deleteNote(id);
    setState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
  }, []);

  const handleIncrementNoteDownload = useCallback(async (id: string) => {
    await incrementNoteDownload(id);
    setState(prev => ({ ...prev, notes: prev.notes.map(n => n.id === id ? { ...n, downloadCount: n.downloadCount + 1 } : n) }));
  }, []);

  // ─── Videos CRUD ───────────────────────────────────────────────────────────
  const handleAddVideo = useCallback(async (newVideo: Omit<Video, 'id'>) => {
    const created = await createVideo(newVideo);
    setState(prev => ({ ...prev, videos: [...prev.videos, created] }));
  }, []);

  const handleEditVideo = useCallback(async (id: string, fields: Partial<Video>) => {
    const updated = await updateVideo(id, fields);
    setState(prev => ({ ...prev, videos: prev.videos.map(v => v.id === id ? updated : v) }));
  }, []);

  const handleDeleteVideo = useCallback(async (id: string) => {
    await deleteVideo(id);
    setState(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }));
  }, []);

  // ─── PYQs CRUD ─────────────────────────────────────────────────────────────
  const handleAddPyq = useCallback(async (newPyq: Omit<PYQ, 'id' | 'questionSize' | 'solutionSize'>) => {
    const created = await createPyq(newPyq);
    setState(prev => ({ ...prev, pyqs: [...prev.pyqs, created] }));
  }, []);

  const handleEditPyq = useCallback(async (id: string, fields: Partial<PYQ>) => {
    const updated = await updatePyq(id, fields);
    setState(prev => ({ ...prev, pyqs: prev.pyqs.map(p => p.id === id ? updated : p) }));
  }, []);

  const handleDeletePyq = useCallback(async (id: string) => {
    await deletePyq(id);
    setState(prev => ({ ...prev, pyqs: prev.pyqs.filter(p => p.id !== id) }));
  }, []);

  // ─── Practice Sheets CRUD ──────────────────────────────────────────────────
  const handleAddPracticeSheet = useCallback(async (newSheet: Omit<PracticeSheet, 'id' | 'fileSize'>) => {
    const created = await createPracticeSheet(newSheet);
    setState(prev => ({ ...prev, practiceSheets: [...prev.practiceSheets, created] }));
  }, []);

  const handleEditPracticeSheet = useCallback(async (id: string, fields: Partial<PracticeSheet>) => {
    const updated = await updatePracticeSheet(id, fields);
    setState(prev => ({ ...prev, practiceSheets: prev.practiceSheets.map(s => s.id === id ? updated : s) }));
  }, []);

  const handleDeletePracticeSheet = useCallback(async (id: string) => {
    await deletePracticeSheet(id);
    setState(prev => ({ ...prev, practiceSheets: prev.practiceSheets.filter(s => s.id !== id) }));
  }, []);

  // ─── Doubts ────────────────────────────────────────────────────────────────
  const handleAddDoubt = useCallback(async (newDoubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt'>) => {
    const created = await submitDoubt(newDoubt);
    setState(prev => ({ ...prev, doubts: [created, ...prev.doubts] }));
  }, []);

  const handleReplyDoubt = useCallback(async (id: string, replyData: { reply_text?: string; image_urls?: string[]; video_urls?: string[]; audio_urls?: string[]; attachment_urls?: string[] }) => {
    try {
      const professorId = '00000000-0000-0000-0000-000000000000';
      const updated = await replyToDoubt(id, professorId, replyData);
      setState(prev => ({ ...prev, doubts: prev.doubts.map(d => d.id === id ? updated : d) }));
    } catch (e: any) {
      console.error('Error replying to doubt', e);
      alert(e.message);
    }
  }, []);

  const handleDeleteDoubt = useCallback(async (id: string) => {
    await deleteDoubt(id);
    setState(prev => ({ ...prev, doubts: prev.doubts.filter(d => d.id !== id) }));
  }, []);


  const handleMarkSeen = useCallback(async (id: string) => {
    const doubt = state.doubts.find(d => d.id === id);
    if (!doubt || doubt.status !== 'submitted') return;
    // Optimistic update
    setState(prev => ({
      ...prev,
      doubts: prev.doubts.map(d =>
        d.id === id ? { ...d, status: 'awaiting' as const } : d
      )
    }));
    try {
      await markDoubtSeen(id, 'submitted');
    } catch {
      // Silently revert — not critical
      setState(prev => ({
        ...prev,
        doubts: prev.doubts.map(d =>
          d.id === id ? { ...d, status: 'submitted' as const } : d
        )
      }));
    }
  }, [state.doubts]);

  // ─── Announcements CRUD ────────────────────────────────────────────────────
  const handleAddAnnouncement = useCallback(async (newAnn: Omit<Announcement, 'id' | 'createdAt'>) => {
    const created = await createAnnouncement(newAnn);
    setState(prev => ({ ...prev, announcements: [created, ...prev.announcements] }));
  }, []);

  const handleEditAnnouncement = useCallback(async (id: string, fields: Partial<Announcement>) => {
    const updated = await updateAnnouncement(id, fields);
    setState(prev => ({ ...prev, announcements: prev.announcements.map(a => a.id === id ? updated : a) }));
  }, []);

  const handleDeleteAnnouncement = useCallback(async (id: string) => {
    await deleteAnnouncement(id);
    setState(prev => ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) }));
  }, []);

  const handleTogglePinAnnouncement = useCallback(async (id: string) => {
    const current = state.announcements.find(a => a.id === id);
    if (!current) return;
    const updated = await togglePinAnnouncement(id, current.pinned);
    setState(prev => ({ ...prev, announcements: prev.announcements.map(a => a.id === id ? updated : a) }));
  }, [state.announcements]);

  return (
    <PortalDataContext.Provider value={{
      ...state,
      reload,
      handleAddNote, handleEditNote, handleDeleteNote, handleIncrementNoteDownload,
      handleAddVideo, handleEditVideo, handleDeleteVideo,
      handleAddPyq, handleEditPyq, handleDeletePyq,
      handleAddPracticeSheet, handleEditPracticeSheet, handleDeletePracticeSheet,
      handleAddDoubt, handleReplyDoubt, handleDeleteDoubt, handleMarkSeen,
      handleAddAnnouncement, handleEditAnnouncement, handleDeleteAnnouncement, handleTogglePinAnnouncement,
    }}>
      {children}
    </PortalDataContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePortalData(): PortalDataContextValue {
  const ctx = useContext(PortalDataContext);
  if (!ctx) throw new Error('usePortalData must be used inside <PortalDataProvider>');
  return ctx;
}
