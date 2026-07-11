/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SheetsSection — Practice sheet cards with search/filter.
 * Extracted from StudentDashboardContent (StudentDashboard.tsx).
 */

import React from 'react';
import { Search, FileText, Eye, Download } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { SubjectBadge } from '../ui/SubjectBadge';
import { CARD, INPUT, MICRO, PILL_SOFT, PILL_GHOST } from '../ui/tokens';
import type { SheetsSectionProps } from './types';

export function SheetsSection({
  currentExamInfo,
  availableSubjects,
  filteredSheets,
  searchQuery, setSearchQuery,
  selectedSubject, setSelectedSubject,
  setActivePdfViewer,
  triggerDownload,
}: SheetsSectionProps) {
  return (
    <div>
      <div className="mt-4 mb-6">
        <p className={MICRO}>{currentExamInfo?.title} · Practice sheets</p>
        <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Practice sheets</h2>
      </div>

      <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by title or chapter…" className={`${INPUT} pl-10`} />
        </div>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={`${INPUT} sm:w-52`}>
          {availableSubjects.map((subject) => (
            <option key={subject} value={subject}>{subject === 'All' ? 'All' : subject}</option>
          ))}
        </select>
      </div>

      {filteredSheets.length === 0 ? (
        <EmptyState label="No practice drills match your search or subject filter." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {filteredSheets.map((sheet) => (
            <div key={sheet.id} className={`${CARD} flex flex-col p-5`}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D] text-[#8A6A16]">
                  <FileText size={18} />
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full border border-[#EFE7D8] dark:border-[#4A433E] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] px-2.5 py-1 text-[10px] font-bold text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{sheet.chapter}</span>
                  <SubjectBadge subject={sheet.subject} />
                </div>
              </div>
              <h4 className="mt-4 text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{sheet.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{sheet.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[#F2ECDF] dark:border-[#383330] dark:border-[#383330] pt-4">
                <span className="dash-mono text-[11px] text-[#A79A88]">File size · {sheet.fileSize}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => setActivePdfViewer({ title: sheet.title, fileUrl: sheet.fileUrl })} className={PILL_GHOST}>
                    <Eye size={12} /> View
                  </button>
                  <button onClick={() => triggerDownload(sheet.fileUrl)} className={PILL_SOFT}>
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
