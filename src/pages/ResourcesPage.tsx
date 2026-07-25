import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePortalData } from '../context/PortalDataContext';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import ProfessorDashboard from '../components/ProfessorDashboard';
import { EXAMS, INITIAL_FAQS } from '../data';

export default function ResourcesPage() {
  const { isAuthorizedProf, loading: authLoading } = useAuth();
  const {
    notes, videos, pyqs, practiceSheets, doubts, announcements,
    loading: dataLoading, error, reload,
    handleAddNote, handleEditNote, handleDeleteNote, handleIncrementNoteDownload,
    handleAddVideo, handleEditVideo, handleDeleteVideo,
    handleAddPyq, handleEditPyq, handleDeletePyq,
    handleAddPracticeSheet, handleEditPracticeSheet, handleDeletePracticeSheet,
    handleAddDoubt, handleReplyDoubt, handleDeleteDoubt, handleMarkSeen,
    handleAddAnnouncement, handleEditAnnouncement, handleDeleteAnnouncement, handleTogglePinAnnouncement,
  } = usePortalData();

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F7F3EC] dark:bg-[#1A1817]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#4A0E1B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4A0E1B] dark:text-[#F4E7E5]">
            Loading Portal…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F7F3EC] dark:bg-[#1A1817] p-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-3xl">⚠️</p>
          <h2 className="text-lg font-black uppercase tracking-[0.2em] text-[#4A0E1B] dark:text-[#F4E7E5]">
            Failed to connect
          </h2>
          <p className="text-sm text-[#22201F] dark:text-[#F6F2EA]/80">{error}</p>
          <button
            onClick={reload}
            className="px-6 py-3 bg-[#4A0E1B] text-white text-xs font-black uppercase tracking-[0.2em] rounded-lg hover:bg-[#7C2532] focus-visible:bg-[#7C2532] active:bg-[#7C2532] transition-colors min-h-[44px]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorizedProf) {
    return (
      <StudentDashboard
        exams={EXAMS}
        notes={notes}
        videos={videos}
        pyqs={pyqs}
        practiceSheets={practiceSheets}
        doubts={doubts}
        faqs={INITIAL_FAQS}
        announcements={announcements}
        onAddDoubt={handleAddDoubt}
        onIncrementNoteDownload={handleIncrementNoteDownload}
      />
    );
  }

  return (
    <ProfessorDashboard
      exams={EXAMS}
      notes={notes}
      videos={videos}
      pyqs={pyqs}
      practiceSheets={practiceSheets}
      doubts={doubts}
      announcements={announcements}
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
      onMarkSeen={handleMarkSeen}
      onAddAnnouncement={handleAddAnnouncement}
      onEditAnnouncement={handleEditAnnouncement}
      onDeleteAnnouncement={handleDeleteAnnouncement}
      onTogglePinAnnouncement={handleTogglePinAnnouncement}
    />
  );
}
