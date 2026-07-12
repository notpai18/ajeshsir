/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OverviewSection — High level stats for the Professor Dashboard.
 */

import React, { useMemo } from 'react';
import { FileText, Video as VideoIcon, FileSpreadsheet, ClipboardList, TrendingUp, LayoutDashboard, Check, User, ArrowRight } from 'lucide-react';
import { PremiumCard } from '../PremiumCard';
import type { ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt } from '../../types';

interface OverviewSectionProps {
  exams: ExamInfo[];
  notes: Note[];
  videos: Video[];
  pyqs: PYQ[];
  practiceSheets: PracticeSheet[];
  doubts: Doubt[];
  onNavigateToDoubt: (id: string) => void;
}

const EXAM_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'jee-main': { bg: 'bg-[#F4E7E5] dark:bg-[#38151A]', text: 'text-[#4A0E1B]', dot: 'bg-[#4A0E1B]' },
  'jee-advanced': { bg: 'bg-[#F4E2E5]', text: 'text-[#7C2532]', dot: 'bg-[#7C2532]' },
  neet: { bg: 'bg-[#F7EFD9] dark:bg-[#362A0D]', text: 'text-[#8A6A16]', dot: 'bg-[#C9A13B]' },
  net: { bg: 'bg-[#ECE7E0]', text: 'text-[#22201F] dark:text-[#F6F2EA]', dot: 'bg-[#22201F]' },
  'msc-entrance': { bg: 'bg-[#EFE7D8]', text: 'text-[#6E5A2E]', dot: 'bg-[#C4A87F]' }
};

function ExamChip({ course, label }: { course: string; label: string }) {
  const s = EXAM_STYLES[course] ?? EXAM_STYLES['jee-main'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string; }) {
  return (
    <PremiumCard padding="medium">
      <div className="flex items-center justify-between">
        <PremiumCard.Category>{label}</PremiumCard.Category>
        <PremiumCard.Icon className="h-10 w-10 rounded-full">{icon}</PremiumCard.Icon>
      </div>
      <p className="mt-4 text-3xl font-bold leading-none tabular-nums text-[#22201F] dark:text-[#F6F2EA]">{value}</p>
      {sub && <PremiumCard.Metadata className="mt-2 block">{sub}</PremiumCard.Metadata>}
    </PremiumCard>
  );
}

function Bar({ label, sub, value, max, barClass = 'bg-[#4A0E1B]' }: { label: string; sub: string; value: number; max: number; barClass?: string; }) {
  const pct = max > 0 && value > 0 ? Math.max(5, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-semibold text-[#3A342E]">{label}</span>
        <span className="dash-mono shrink-0 text-xs tabular-nums text-[#8A7E6F] dark:text-[#A89F91]">{sub}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#F0E9DB]">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function OverviewSection({
  exams, notes, videos, pyqs, practiceSheets, doubts, onNavigateToDoubt
}: OverviewSectionProps) {

  const pendingDoubtsCount = doubts.filter((d) => !d.isAnswered).length;
  const totalResources = notes.length + videos.length + pyqs.length + practiceSheets.length;
  const totalDownloads = notes.reduce((s, n) => s + n.downloadCount, 0);

  const examTitle = (id: string) => exams.find((e) => e.id === id)?.title ?? id;

  const topNotes = useMemo(() => [...notes].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 5), [notes]);
  const maxDownload = topNotes[0]?.downloadCount ?? 0;

  const libraryByExam = useMemo(() => {
    return exams
      .map((e) => ({
        id: e.id,
        label: e.title,
        count:
          notes.filter((n) => n.course === e.id).length +
          videos.filter((v) => v.course === e.id).length +
          pyqs.filter((p) => p.course === e.id).length +
          practiceSheets.filter((s) => s.course === e.id).length
      }))
      .sort((a, b) => b.count - a.count);
  }, [exams, notes, videos, pyqs, practiceSheets]);
  const maxExam = Math.max(1, ...libraryByExam.map((x) => x.count));

  const recentUploads = useMemo(() => {
    const list = [
      ...notes.map((n) => ({ type: 'Note' as const, title: n.title, course: n.course, detail: n.chapter })),
      ...videos.map((v) => ({ type: 'Video' as const, title: v.title, course: v.course, detail: v.chapter })),
      ...pyqs.map((p) => ({ type: 'PYQ' as const, title: `${p.chapter} · ${p.year}`, course: p.course, detail: `${p.difficulty} difficulty` })),
      ...practiceSheets.map((s) => ({ type: 'Sheet' as const, title: s.title, course: s.course, detail: s.chapter }))
    ];
    return list.slice(-6).reverse();
  }, [notes, videos, pyqs, practiceSheets]);

  const typeIcon: Record<string, React.ReactNode> = {
    Note: <FileText size={13} />,
    Video: <VideoIcon size={13} />,
    PYQ: <FileSpreadsheet size={13} />,
    Sheet: <ClipboardList size={13} />
  };

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Hero band */}
      <div className="relative overflow-hidden rounded-hero bg-gradient-to-r from-[#4A0E1B] to-[#7C2532] p-6 text-white shadow-soft-xl border border-[#22201F]/20 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#C9A13B]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 right-24 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D9C2A2]">Repository health</p>
            <h2 className="dash-serif mt-2 text-2xl font-semibold leading-snug">A living library across {exams.length} exam tracks</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">Everything students download flows from here. Keep it fresh and clear their doubts to keep engagement high.</p>
          </div>
          <div className="flex shrink-0 gap-7 sm:gap-9">
            {[
              { v: totalResources, l: 'Resources' },
              { v: totalDownloads.toLocaleString(), l: 'Downloads' },
              { v: pendingDoubtsCount, l: 'Open doubts' }
            ].map((m) => (
              <div key={m.l}>
                <p className="dash-serif text-3xl font-semibold tabular-nums">{m.v}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#D9C2A2]">{m.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<FileText size={17} />} label="Study Notes" value={notes.length} sub={`${totalDownloads.toLocaleString()} total downloads`} />
        <StatCard icon={<VideoIcon size={17} />} label="Lectures" value={videos.length} sub="Video walkthroughs" />
        <StatCard icon={<FileSpreadsheet size={17} />} label="PYQ Sets" value={pyqs.length} sub="With worked solutions" />
        <StatCard icon={<ClipboardList size={17} />} label="Practice Sheets" value={practiceSheets.length} sub="Chapter-wise drills" />
      </div>

      {/* Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <PremiumCard padding="large" accentLine>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Most downloaded notes</h3>
              <p className="text-xs text-[#8A7E6F] dark:text-[#A89F91]">What students reach for most</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#38151A] text-[#4A0E1B]">
              <TrendingUp size={17} />
            </span>
          </div>
          {topNotes.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#8A7E6F] dark:text-[#A89F91]">No notes yet.</p>
          ) : (
            <div className="space-y-4">
              {topNotes.map((n) => (
                <Bar key={n.id} label={n.title} sub={`${n.downloadCount.toLocaleString()}`} value={n.downloadCount} max={maxDownload} />
              ))}
            </div>
          )}
        </PremiumCard>

        <PremiumCard padding="large" accentLine>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Library by exam</h3>
              <p className="text-xs text-[#8A7E6F] dark:text-[#A89F91]">How your content is spread</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]">
              <LayoutDashboard size={17} />
            </span>
          </div>
          <div className="space-y-4">
            {libraryByExam.map((e) => (
              <Bar
                key={e.id}
                label={e.label}
                sub={`${e.count} item${e.count === 1 ? '' : 's'}`}
                value={e.count}
                max={maxExam}
                barClass={(EXAM_STYLES[e.id] ?? EXAM_STYLES['jee-main']).dot}
              />
            ))}
          </div>
        </PremiumCard>
      </div>

      {/* Attention + recent */}
      <div className="grid gap-6 md:grid-cols-2">
        <PremiumCard padding="large" accentLine>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Needs your attention</h3>
            {pendingDoubtsCount > 0 && (
              <span className="rounded-full bg-[#F4E4E4] px-2.5 py-1 text-[10px] font-bold text-[#4A0E1B]">{pendingDoubtsCount} unanswered</span>
            )}
          </div>
          {pendingDoubtsCount === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]">
                <Check size={20} />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA]">You're all caught up</p>
              <p className="text-xs text-[#8A7E6F] dark:text-[#A89F91]">Every student doubt has an answer.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {doubts
                 .filter((d) => !d.isAnswered)
                 .slice(0, 4)
                 .map((d) => (
                   <button
                     key={d.id}
                     onClick={() => onNavigateToDoubt(d.id)}
                     className="flex w-full items-start gap-3 rounded-xl border border-[#EFE7D8] dark:border-[#F6F2EA]/10 bg-[#FBF7F0] dark:bg-[#2A2726] p-3 text-left transition-colors hover:border-[#E3D1CD] hover:bg-[#F8EEEC]"
                   >
                     <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#22201F] text-[#8A7E6F] dark:text-[#A89F91] ring-1 ring-[#EAE1D2]">
                       <User size={14} />
                     </span>
                     <span className="min-w-0 flex-1">
                       <span className="flex items-center justify-between gap-2">
                         <span className="truncate text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{d.name}</span>
                         <span className="dash-mono shrink-0 text-[10px] text-[#A79A88]">{fmtDate(d.createdAt)}</span>
                       </span>
                       <span className="line-clamp-1 text-xs text-[#8A7E6F] dark:text-[#A89F91]">{d.question}</span>
                     </span>
                     <ArrowRight size={15} className="mt-1 shrink-0 text-[#C0A98B]" />
                   </button>
                 ))}
            </div>
          )}
        </PremiumCard>

        <PremiumCard padding="large" accentLine>
          <h3 className="dash-serif mb-4 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Recent uploads</h3>
          {recentUploads.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#8A7E6F] dark:text-[#A89F91]">Nothing uploaded yet.</p>
          ) : (
            <div className="space-y-1">
              {recentUploads.map((item, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-[#F2ECDF] dark:border-[#383330] py-2.5 last:border-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4E7E5] dark:bg-[#38151A] text-[#4A0E1B]">{typeIcon[item.type]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA]">{item.title}</p>
                    <p className="truncate text-xs text-[#8A7E6F] dark:text-[#A89F91]">{item.detail}</p>
                  </div>
                  <ExamChip course={item.course} label={examTitle(item.course)} />
                </div>
              ))}
            </div>
          )}
        </PremiumCard>
      </div>
    </div>
  );
}
