/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NotesSection — Study notes grid with toolbar, filters, and PDF viewer trigger.
 * Extracted from StudentDashboardContent (StudentDashboard.tsx).
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, FileText, Download, Eye, ChevronDown, Check,
  Atom, FlaskConical, Hexagon, LayoutGrid, List,
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { CARD, MICRO, PILL_SOFT, PRIMARY_BTN } from '../ui/tokens';
import type { NotesSectionProps } from './types';

export function NotesSection({
  currentExamInfo,
  selectedExam,
  availableSubjects,
  filteredNotes,
  notes,
  noteViewMode, setNoteViewMode,
  noteSort, setNoteSort,
  searchQuery, setSearchQuery,
  selectedSubject, setSelectedSubject,
  isSearchFocused, setIsSearchFocused,
  isSortDropdownOpen, setIsSortDropdownOpen,
  sortDropdownRef,
  searchInputRef,
  studiedNotes, toggleStudied,
  setActivePdfViewer,
  handleDownloadFile,
}: NotesSectionProps) {
  return (
    <div key={selectedExam} className="animate-[fadeInUp_0.4s_ease-out_forwards]">

      {/* 1. Premium Hero */}
      <div className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br ${currentExamInfo?.themeGradient || 'from-[#4A0E1B] to-[#7C2532]'} p-6 sm:p-8 text-white shadow-[0_12px_24px_-12px_rgba(34,32,31,0.5)] mb-8`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="dash-serif text-2xl md:text-3xl font-semibold">{currentExamInfo?.heroTitle || 'Study Notes'}</h2>
            {currentExamInfo?.quickStats ? (
              <div className="mt-4 grid grid-cols-2 sm:flex sm:flex-row gap-3">
                {currentExamInfo.quickStats.map((stat: any, idx: number) => {
                  // Resolve icon dynamically
                  let IconEl: React.ReactNode = null;
                  if (stat.icon === 'Library') IconEl = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>;
                  else if (stat.icon === 'FileText') IconEl = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
                  else if (stat.icon === 'Target') IconEl = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
                  else IconEl = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;

                  return (
                    <div key={idx} className="flex items-center gap-2.5 rounded-[12px] border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-md transition-all hover:bg-white/10 group">
                      <span className="text-white/80 transition-transform group-hover:scale-110">{IconEl}</span>
                      <div>
                        <div className="text-[15px] font-bold leading-none text-white">{stat.value}</div>
                        <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 text-sm text-white/70 max-w-md">
                {currentExamInfo?.heroDescription || 'Access chapter-wise Chemistry notes covering Physical, Organic and Inorganic Chemistry with formula sheets, NCERT concepts and previous year important topics.'}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <div className="rounded-[12px] bg-[#4A0E1B] p-4 text-center min-w-[160px] shadow-[0_4px_12px_rgba(34,32,31,0.3)] border border-white/5">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#D9C2A2]">Total Notes</p>
              <p className="dash-mono text-[32px] font-bold text-white mt-2 leading-none">{notes.filter(n => n.course === selectedExam).length}</p>
              <div className="mt-[8px] text-left w-full">
                <div className="text-[11px] font-medium text-white/60 mb-1">Progress</div>
                <div className="h-[6px] w-full bg-white/10 rounded-[3px] overflow-hidden">
                  <div
                    className="h-full bg-[#C9A13B] transition-all duration-500 ease-out shadow-[0_0_8px_rgba(34,32,31,0.5)]"
                    style={{ width: `${Math.max(5, Math.round((notes.filter(n => n.course === selectedExam && studiedNotes.has(n.id)).length / Math.max(1, notes.filter(n => n.course === selectedExam).length)) * 100))}%`, borderRadius: '3px' }}
                  />
                </div>
                <div className="mt-1 text-[11px] font-medium text-white/60">
                  {notes.filter(n => n.course === selectedExam && studiedNotes.has(n.id)).length} / {notes.filter(n => n.course === selectedExam).length} reviewed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Unified Toolbar */}
      <div className="my-[20px] flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-[16px] bg-[#FFFFFF] dark:bg-[#22201F] rounded-[16px] py-[10px] px-[16px] shadow-[0_2px_8px_rgba(90,36,54,0.05),0_1px_2px_rgba(90,36,54,0.04)] border border-[#F0E9E2] dark:border-[#F6F2EA]/10">

        {/* LEFT — Subject tabs */}
        <div className="flex relative bg-[#F7F2EC] dark:bg-[#1A1817] rounded-[12px] p-[4px] gap-[2px] w-full sm:w-auto overflow-x-auto no-scrollbar">
          {(currentExamInfo?.filters || availableSubjects).map((subject) => {
            const isActive = selectedSubject === subject;
            let Icon: React.ElementType = LayoutGrid;
            if (subject === 'Physical Chemistry') Icon = Atom;
            else if (subject === 'Organic Chemistry') Icon = Hexagon;
            else if (subject === 'Inorganic Chemistry') Icon = FlaskConical;

            return (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`relative z-10 flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-semibold rounded-[9px] transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 active:scale-95 ${
                  isActive ? 'text-[#FFFFFF] dark:text-[#F6F2EA]' : 'text-[#6B5D54] hover:bg-[#EFE6DC] dark:hover:bg-[#2A2726] hover:text-[#3A2E28] dark:text-[#A89F91]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="subject-pill"
                    className="absolute inset-0 bg-[#5A2436] rounded-[9px] shadow-[0_2px_6px_rgba(90,36,54,0.35)] -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon size={14} className={`transition-colors duration-[250ms] ${isActive ? 'text-[#F3D9CE]' : 'text-[#B8A99C]'}`} />
                {subject}
              </button>
            );
          })}
        </div>

        {/* RIGHT — Search, Sort, View */}
        <div className="flex flex-col sm:flex-row items-center gap-[10px] w-full sm:w-auto">
          {/* Search */}
          <div className={`relative flex items-center transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isSearchFocused ? 'w-full sm:w-[320px]' : 'w-full sm:w-[240px]'}`}>
            <Search size={16} className={`pointer-events-none absolute left-[12px] transition-colors duration-[250ms] ${isSearchFocused ? 'text-[#5A2436]' : 'text-[#B8A99C]'}`} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full h-[40px] rounded-[10px] border-[1.5px] border-transparent bg-[#FAF6F1] dark:bg-[#2A2726] pl-[38px] pr-[14px] text-[13px] text-[#22201F] dark:text-[#F6F2EA] placeholder:text-[#B0A296] outline-none transition-all duration-[250ms] focus:border-[#D9A9A0] focus:bg-[#FFFFFF] dark:focus:bg-[#22201F] focus:shadow-[0_0_0_4px_rgba(217,169,160,0.15)]"
            />
            {!searchQuery && !isSearchFocused && (
              <div className="pointer-events-none absolute right-[12px] flex h-[20px] items-center justify-center rounded-[4px] bg-[#EBE3DC] dark:bg-[#383330] px-[6px] text-[11px] font-bold text-[#C4B6AA] dark:text-[#8A7E6F]">
                /
              </div>
            )}
          </div>

          <div className="flex items-center gap-[10px] w-full sm:w-auto">
            {/* Custom Sort Dropdown */}
            <div className="relative w-full sm:w-auto" ref={sortDropdownRef}>
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className={`h-[40px] w-full sm:w-auto flex items-center justify-between gap-[8px] rounded-[10px] border-[1.5px] bg-[#FAF6F1] px-[14px] text-[13px] font-medium text-[#3A2E28] transition-all duration-[250ms] ${
                  isSortDropdownOpen
                    ? 'border-[#D9A9A0] bg-white dark:bg-[#22201F] shadow-[0_0_0_4px_rgba(217,169,160,0.15)]'
                    : 'border-[#F0E9E2] dark:border-[#F6F2EA]/10 hover:border-[#D9C7B8]'
                }`}
              >
                <span className="whitespace-nowrap">
                  {noteSort === 'recent' ? 'Most Recent' :
                   noteSort === 'popular' ? 'Most Downloaded' :
                   noteSort === 'alphabetical' ? 'Alphabetical A-Z' : 'File Size'}
                </span>
                <ChevronDown size={12} className={`text-[#8A7A6D] transition-transform duration-[200ms] ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-[calc(100%+8px)] z-50 w-full sm:min-w-[180px] rounded-[10px] bg-white dark:bg-[#22201F] p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#F0E9E2]"
                  >
                    {[
                      { id: 'recent', label: 'Most Recent' },
                      { id: 'popular', label: 'Most Downloaded' },
                      { id: 'alphabetical', label: 'Alphabetical A-Z' },
                      { id: 'size', label: 'File Size' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => { setNoteSort(opt.id as any); setIsSortDropdownOpen(false); }}
                        className="flex w-full items-center justify-between rounded-[6px] px-[12px] py-[8px] text-left text-[13px] text-[#3A2E28] dark:text-[#F6F2EA] transition-colors hover:bg-[#F7F2EC] dark:hover:bg-[#383330]"
                      >
                        {opt.label}
                        {noteSort === opt.id && <Check size={14} className="text-[#5A2436]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid/List View Toggle */}
            <div className="flex relative bg-[#F7F2EC] dark:bg-[#1A1817] rounded-[10px] p-[3px] h-[40px] shrink-0 ml-auto sm:ml-0">
              {(['grid', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setNoteViewMode(mode)}
                  className={`relative z-10 flex h-[34px] w-[34px] items-center justify-center rounded-[7px] transition-colors duration-[200ms] active:scale-95 ${noteViewMode === mode ? 'text-[#5A2436]' : 'text-[#B8A99C] hover:bg-black/5'}`}
                >
                  {noteViewMode === mode && (
                    <motion.div
                      layoutId="view-pill"
                      className="absolute inset-0 bg-white dark:bg-[#22201F] rounded-[7px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  {mode === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState label="No study notes match your search or subject filter." />
      ) : (
        <div className={`grid gap-[20px] ${noteViewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredNotes.map((note, idx) => {
            let customStyles = { bg: '#F4E7E5', text: '#4A0E1B' };
            if (note.title === 'First and Second Law Applications') customStyles = { bg: '#FDECEA', text: '#C0392B' };
            else if (note.title === 'Chemical and Ionic Equilibrium') customStyles = { bg: '#EAF4EC', text: '#3C8C5B' };
            else if (note.title === 'Cells, EMF, and Nernst Equation') customStyles = { bg: '#EAF0FB', text: '#3A5FA6' };
            else if (note.title === 'Rate Laws and Reaction Order') customStyles = { bg: '#FBF0E4', text: '#B8792E' };
            else {
              const iconColors = [
                { bg: '#F4E7E5', text: '#4A0E1B' },
                { bg: '#E8F5E9', text: '#2E7D32' },
                { bg: '#E3F2FD', text: '#1565C0' },
                { bg: '#FFF3E0', text: '#E65100' },
              ];
              customStyles = iconColors[idx % iconColors.length];
            }

            return (
              <div key={note.id} className="flex flex-col h-full p-[20px] rounded-[16px] bg-[#FFFFFF] dark:bg-[#22201F] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] dark:border dark:border-[#383330] hover:-translate-y-[2px] transition-all duration-[0.15s] ease-[ease] group">
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px]"
                    style={{ backgroundColor: customStyles.bg, color: customStyles.text }}
                  >
                    <FileText size={20} />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="mb-[12px] flex flex-wrap items-center gap-[8px]">
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A]">
                        Topic: {note.chapter}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#D4A24C' }} />
                        {note.subject}
                      </span>
                    </div>
                    <h4 className="text-[15px] font-bold text-[#22201F] dark:text-[#F6F2EA] line-clamp-2 leading-[1.3]">
                      {note.title}
                    </h4>
                  </div>
                </div>

                <p className="mt-[12px] text-[13px] leading-[1.5] text-[#5C5C5C] dark:text-[#C7BCAD] line-clamp-2">
                  {note.description}
                </p>

                <div className="mt-auto pt-[16px]">
                  <div className="h-[1px] w-full bg-[#EEE8E0] dark:bg-[#383330] mb-[16px]" />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group/check">
                      <input
                        type="checkbox"
                        checked={studiedNotes.has(note.id)}
                        onChange={() => toggleStudied(note.id)}
                        className="h-[14px] w-[14px] rounded border-[#C0A98B] text-[#5A2436] focus:ring-[#5A2436]/30 cursor-pointer"
                      />
                      <span className={`text-[11px] font-bold uppercase tracking-[0.05em] transition-colors ${studiedNotes.has(note.id) ? 'text-[#5A2436]' : 'text-[#8B8B8B] group-hover/check:text-[#4A4A4A]'}`}>
                        MARK REVIEWED
                      </span>
                    </label>
                    <div className="flex gap-[8px]">
                      <button onClick={() => setActivePdfViewer({ title: note.title, fileUrl: note.fileUrl })} className="flex h-[40px] items-center justify-center rounded-[8px] border border-[#E0D5CC] bg-white dark:bg-[#22201F] px-[16px] text-[13px] font-bold text-[#5A2436] transition-all hover:bg-[#F9F7F5]">
                        <Eye size={14} className="mr-1.5" /> View
                      </button>
                      <button onClick={() => handleDownloadFile(note.id, note.fileUrl)} className="flex h-[40px] items-center justify-center rounded-[8px] bg-[#F3D9CE] px-[16px] text-[13px] font-bold text-[#8A3D2C] transition-all hover:bg-[#EBD2C7]">
                        <Download size={14} className="mr-1.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
