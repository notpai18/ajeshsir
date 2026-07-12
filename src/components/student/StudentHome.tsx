/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Atom, Compass, FileText, VideoIcon, BookOpen, FileSpreadsheet, ArrowRight, Bell } from 'lucide-react';
import { PremiumCard } from '../PremiumCard';
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A0E1B] to-[#7C2532] p-7 text-white shadow-[0_22px_44px_-24px_rgba(34,32,31,0.75)] sm:p-10 animate-[fadeInUp_0.4s_ease-out_forwards]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-20 h-52 w-52 rounded-full bg-[#D9C2A2]/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-7 text-center md:flex-row md:items-center md:gap-9 md:text-left">
          {/* Academic Icon */}
          <div className="relative shrink-0 animate-[fadeInUp_0.4s_ease-out_forwards]" style={{ animationDelay: '0s', animationFillMode: 'both' }}>
            <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-[#22201F] sm:h-32 sm:w-32 border border-white/5">
              <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/2697.svg" alt="Chemistry Icon" className="h-14 w-14 sm:h-16 sm:w-16" />
            </div>
          </div>

          {/* Identity / Text */}
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D9C2A2] animate-[fadeInUp_0.4s_ease-out_forwards]" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>COURSE REPOSITORIES</p>
            <h1 className="dash-serif mt-2 text-3xl font-semibold leading-tight sm:text-[2.5rem] animate-[fadeInUp_0.4s_ease-out_forwards]" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>Choose Your Examination</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70 animate-[fadeInUp_0.4s_ease-out_forwards]" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#22201F]/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 hover:border-[#D9C2A2] hover:shadow-[0_0_12px_rgba(217,194,162,0.3)] hover:-translate-y-0.5 transition-all duration-300 animate-[fadeInUp_0.4s_ease-out_forwards]"
                  style={{ animationDelay: `${0.2 + i * 0.05}s`, animationFillMode: 'both' }}
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4 items-stretch">
        {exams.map((exam) => {
          const resourceCount = notes.filter(n => n.course === exam.id).length + 
                                videos.filter(v => v.course === exam.id).length + 
                                practiceSheets.filter(s => s.course === exam.id).length + 
                                pyqs.filter(p => p.course === exam.id).length;
          
          let tintClasses = { bg: 'bg-[#4A0E1B]/10 dark:bg-[#4A0E1B]/20', icon: 'text-[#4A0E1B] dark:text-[#E8D3D8]' };
          if (exam.id === 'jee-main') tintClasses = { bg: 'bg-[#4A0E1B]/10 dark:bg-[#4A0E1B]/20', icon: 'text-[#4A0E1B] dark:text-[#E8D3D8]' };
          if (exam.id === 'jee-advanced') tintClasses = { bg: 'bg-[#C0713D]/10 dark:bg-[#C0713D]/20', icon: 'text-[#C0713D] dark:text-[#F3D7C5]' };
          if (exam.id === 'neet') tintClasses = { bg: 'bg-[#6B7D5A]/10 dark:bg-[#6B7D5A]/20', icon: 'text-[#6B7D5A] dark:text-[#D8E0D2]' };
          if (exam.id === 'net') tintClasses = { bg: 'bg-[#A87B2E]/10 dark:bg-[#A87B2E]/20', icon: 'text-[#A87B2E] dark:text-[#EBE1CD]' };
          if (exam.id === 'msc-entrance') tintClasses = { bg: 'bg-[#C9A13B]/10 dark:bg-[#C9A13B]/20', icon: 'text-[#C9A13B] dark:text-[#F7EFD9]' };

          return (
            <PremiumCard
              key={exam.id}
              interactive
              onClick={() => setSelectedExam(exam.id)}
              className="flex flex-col h-full !border-[#D9C2A2]/40 hover:!border-[#C9A13B]/60 dark:!border-[#362A0D]/50 dark:hover:!border-[#C9A13B]/40 group"
              padding="large"
            >
              <div className="flex items-start justify-between w-full mb-5">
                <PremiumCard.Icon className={`border-0 ${tintClasses.bg} ${tintClasses.icon} !transition-colors !duration-300 group-hover:bg-[#4A0E1B] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-[#4A0E1B]`}>
                  {renderExamIcon(exam.icon)}
                </PremiumCard.Icon>
                <span className="dash-mono rounded-full border border-[#7C2532] bg-[#4A0E1B] px-3 py-1.5 text-[11px] font-semibold text-[#F7F3EC] shadow-sm">
                  {resourceCount} Resources
                </span>
              </div>
              
              <div className="flex-1 flex flex-col">
                <PremiumCard.Title className="!font-bold !text-[22px] mb-2">{exam.title}</PremiumCard.Title>
                <PremiumCard.Description className="line-clamp-2 !text-[#8A7E6F] dark:!text-[#A89F91]">
                  {exam.description}
                </PremiumCard.Description>
              </div>
              
              <div className="mt-6 flex items-center w-max rounded-xl bg-[#F7F3EC] dark:bg-[#38151A]/40 px-4 py-2.5 text-[13px] font-bold text-[#4A0E1B] dark:text-[#E8D3D8] transition-colors duration-200 group-hover:bg-[#E8D3D8] dark:group-hover:bg-[#4A0E1B]/60">
                Explore
                <ArrowRight size={16} className="ml-2 transition-transform duration-250 ease-out group-hover:translate-x-1" />
              </div>
            </PremiumCard>
          );
        })}
      </div>

      {/* Global Announcements Section */}
      {sortedAnnouncements && sortedAnnouncements.length > 0 && (
        <div className="mt-12 animate-[fadeInUp_0.4s_ease-out_forwards]" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="flex items-center gap-2 mb-6 border-b border-[#22201F]/15 dark:border-[#F6F2EA]/10 pb-3">
            <Bell size={20} className="text-[#8A6A16]" />
            <h2 className="dash-serif text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA]">Recent Announcements</h2>
          </div>
          <div className="flex flex-col border border-[#22201F]/15 dark:border-[#F6F2EA]/10 rounded-[24px] bg-white dark:bg-[#22201F] overflow-hidden shadow-[0_4px_12px_rgba(34,32,31,0.02)]">
            {sortedAnnouncements.slice(0, 4).map((a, i) => (
              <div key={a.id} className={`p-6 transition-colors duration-200 hover:bg-[#FBF7F0] dark:hover:bg-[#2A2726] ${i !== 0 ? 'border-t border-[#22201F]/15 dark:border-[#F6F2EA]/10' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="rounded-full bg-[#E8D3D8] dark:bg-[#4A242B] px-2.5 py-1 text-[10px] font-bold text-[#4A0E1B] dark:text-[#F6F2EA] uppercase tracking-widest">{a.category}</span>
                      {a.pinned && <span className="rounded-full bg-[#F5E6CD] dark:bg-[#4D3C1A] px-2.5 py-1 text-[10px] font-bold text-[#8A6A16] dark:text-[#F7EFD9] uppercase tracking-widest">Pinned</span>}
                    </div>
                    <h4 className="dash-serif text-lg font-bold text-[#22201F] dark:text-[#F6F2EA] group-hover:text-[#4A0E1B] transition-colors">{a.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#5A534B] dark:text-[#A89F91] line-clamp-2">{a.body}</p>
                  </div>
                  <span className="dash-mono shrink-0 text-[11px] font-medium text-[#8A7E6F] dark:text-[#A89F91] sm:mt-1">{fmtDate(a.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
