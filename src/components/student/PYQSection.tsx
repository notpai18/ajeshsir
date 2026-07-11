/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * PYQSection — Previous year questions table with subject/difficulty/year filters.
 * Extracted from StudentDashboardContent (StudentDashboard.tsx).
 */

import React from 'react';
import { Search, Eye, Download } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { SubjectBadge } from '../ui/SubjectBadge';
import { DifficultyChip } from '../ui/DifficultyChip';
import { CARD, INPUT, MICRO, PILL_SOFT, PILL_GOLD } from '../ui/tokens';
import type { PYQSectionProps } from './types';

export function PYQSection({
  currentExamInfo,
  availableSubjects,
  filteredPyqs,
  searchQuery, setSearchQuery,
  selectedSubject, setSelectedSubject,
  selectedDifficulty, setSelectedDifficulty,
  selectedYear, setSelectedYear,
  setActivePdfViewer,
  triggerDownload,
}: PYQSectionProps) {
  return (
    <div>
      <div className="mt-4 mb-6">
        <p className={MICRO}>{currentExamInfo?.title} · Previous year questions</p>
        <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Previous year questions</h2>
      </div>

      <div className="mb-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by chapter…" className={`${INPUT} pl-10`} />
        </div>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={INPUT}>
          {availableSubjects.map((subject) => (
            <option key={subject} value={subject}>{subject === 'All' ? 'All' : subject}</option>
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
                <tr className="border-b border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726]">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Subject &amp; chapter</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Year</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Difficulty</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Question paper</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Step solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECDF]">
                {filteredPyqs.map((pyq) => (
                  <tr key={pyq.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726] dark:hover:bg-[#2A2726]">
                    <td className="px-5 py-3.5">
                      <SubjectBadge subject={pyq.subject} />
                      <span className="mt-0.5 block text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{pyq.chapter}</span>
                    </td>
                    <td className="px-5 py-3.5 dash-mono text-xs font-medium tabular-nums text-[#6E645A]">{pyq.year}</td>
                    <td className="px-5 py-3.5"><DifficultyChip level={pyq.difficulty as any} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex justify-end gap-1.5">
                        <button onClick={() => setActivePdfViewer({ title: `PYQ Question · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.questionUrl })} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] transition-colors hover:bg-[#F4E7E5] dark:bg-[#38151A] hover:text-[#4A0E1B]">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => triggerDownload(pyq.questionUrl)} className={PILL_SOFT}>
                          <Download size={11} /> {pyq.questionSize}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex justify-end gap-1.5">
                        <button onClick={() => setActivePdfViewer({ title: `PYQ Solution · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.solutionUrl })} className="rounded-lg p-2 text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] transition-colors hover:bg-[#F7EFD9] dark:bg-[#362A0D] hover:text-[#8A6A16]">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => triggerDownload(pyq.solutionUrl)} className={PILL_GOLD}>
                          <Download size={11} /> {pyq.solutionSize}
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
    </div>
  );
}
