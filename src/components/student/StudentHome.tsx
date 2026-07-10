/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Atom, Compass, FileText, VideoIcon, BookOpen, FileSpreadsheet, ArrowRight, Bell } from 'lucide-react';
import type { ExamType, Announcement } from '../../types';

interface StudentHomeProps {
  exams: any[];
  notes: any[];
  videos: any[];
  practiceSheets: any[];
  pyqs: any[];
  sortedAnnouncements: Announcement[];
  renderExamIcon: (iconName?: string) => React.ReactNode;
  setSelectedExam: (id: string) => void;
}

export function StudentHome({
  exams,
  notes,
  videos,
  practiceSheets,
  pyqs,
  sortedAnnouncements,
  renderExamIcon,
  setSelectedExam
}: StudentHomeProps) {
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A0E1B] to-[#7C2532] p-7 text-white shadow-[0_22px_44px_-24px_rgba(74,14,27,0.75)] sm:p-10 animate-[fadeInUp_0.8s_ease-out_forwards]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-20 h-52 w-52 rounded-full bg-[#D9C2A2]/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-7 text-center md:flex-row md:items-center md:gap-9 md:text-left">
          {/* Academic Icon */}
          <div className="relative shrink-0 animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#EAD3AE] to-[#D9C2A2] shadow-lg sm:h-32 sm:w-32">
              <Atom className="text-[#4A0E1B]" size={48} strokeWidth={1.5} />
            </div>
            <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-[#4A0E1B] bg-white dark:bg-[#22201F] text-[#4A0E1B]">
              <BookOpen size={18} />
            </span>
          </div>

          {/* Identity / Text */}
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D9C2A2] animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>COURSE REPOSITORIES</p>
            <h1 className="dash-serif mt-2 text-3xl font-semibold leading-tight sm:text-[2.5rem] animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>Choose Your Examination</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70 animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              Organize your chemistry resources by examination and access carefully curated notes, lectures, PYQs, and practice material.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {[
                { icon: <Compass size={13} />, text: '5 Examination Tracks' },
                { icon: <FileText size={13} />, text: '24 Study Notes' },
                { icon: <VideoIcon size={13} />, text: '18 Video Lectures' },
                { icon: <BookOpen size={13} />, text: '12 Practice Sheets' },
                { icon: <FileSpreadsheet size={13} />, text: 'PYQs Included' }
              ].map((chip, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D9C2A2]/30 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 hover:border-[#D9C2A2] hover:shadow-[0_0_12px_rgba(217,194,162,0.3)] hover:-translate-y-0.5 transition-all duration-300 animate-[fadeInUp_0.8s_ease-out_forwards]"
                  style={{ animationDelay: `${0.5 + i * 0.1}s`, animationFillMode: 'both' }}
                >
                  <span className="text-[#D9C2A2]">{chip.icon}</span>
                  {chip.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Examination Grid */}
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {exams.map((exam) => (
          <button
            key={exam.id}
            onClick={() => setSelectedExam(exam.id)}
            className="group relative flex w-full max-w-[340px] flex-col overflow-hidden rounded-[24px] border border-[#EAE1D2] dark:border-[#4A433E] bg-white dark:bg-[#22201F] p-6 text-left shadow-[0_4px_12px_rgba(34,32,31,0.04)] transition-all duration-[220ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_20px_40px_rgba(74,14,27,0.12)] sm:w-[calc(50%-12px)] lg:w-[340px] h-[230px]"
          >
            <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 bg-[#C9A13B] transition-transform duration-[220ms] ease-out group-hover:scale-x-100 origin-left"></div>
            
            <div className="flex items-start justify-between w-full">
              <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#F4E7E5] dark:bg-[#38151A] text-[#4A0E1B] transition-colors duration-[220ms] ease-out group-hover:bg-[#F7EFD9] dark:bg-[#362A0D] group-hover:text-[#8A6A16]">
                {renderExamIcon(exam.icon)}
              </span>
              <span className="dash-mono rounded-full border border-[#EFE7D8] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] px-2.5 py-1 text-[10px] font-medium text-[#8A7E6F] dark:text-[#A89F91]">
                {notes.filter(n => n.course === exam.id).length + videos.filter(v => v.course === exam.id).length + practiceSheets.filter(s => s.course === exam.id).length + pyqs.filter(p => p.course === exam.id).length} Resources
              </span>
            </div>
            
            <h3 className="dash-serif mt-5 text-xl font-bold text-[#22201F] dark:text-[#F6F2EA]">{exam.title}</h3>
            <p className="mt-2 text-sm text-[#8A7E6F] dark:text-[#A89F91] line-clamp-1">{exam.description}</p>
            
            <div className="mt-auto pt-4 flex items-center text-[#4A0E1B] font-bold text-xs uppercase tracking-widest">
              Explore <ArrowRight size={14} className="ml-1.5 transition-transform duration-[220ms] ease-out group-hover:translate-x-2" />
            </div>
          </button>
        ))}
      </div>

      {/* Global Announcements Section */}
      {sortedAnnouncements && sortedAnnouncements.length > 0 && (
        <div className="mt-12 animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="flex items-center gap-2 mb-6 border-b border-[#EAE1D2] dark:border-[#4A433E] pb-3">
            <Bell size={20} className="text-[#8A6A16]" />
            <h2 className="dash-serif text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA]">Recent Announcements</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedAnnouncements.slice(0, 4).map((a) => (
              <div key={a.id} className="rounded-2xl border border-[#EAE1D2] dark:border-[#4A433E] bg-white dark:bg-[#22201F] p-5 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#FBF7F0] dark:bg-[#2A2726] px-2.5 py-1 text-[10px] font-bold text-[#6E645A] uppercase tracking-wider">{a.category}</span>
                    {a.pinned && <span className="text-[10px] font-bold text-[#B23B2E] uppercase tracking-wider">Pinned</span>}
                  </div>
                  <span className="dash-mono text-[11px] text-[#8A7E6F]">{fmtDate(a.createdAt)}</span>
                </div>
                <h4 className="dash-serif mt-3 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">{a.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD] line-clamp-2">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
