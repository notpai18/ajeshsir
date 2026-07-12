import React, { useState } from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { PremiumCard } from '../PremiumCard';
import { ResourceHero, ResourceToolbar } from '../resources/ResourcePageLayout';
import type { PYQSectionProps } from './types';

export function PYQSection({
  currentExamInfo,
  selectedExam,
  availableSubjects,
  filteredPyqs,
  searchQuery, setSearchQuery,
  selectedSubject, setSelectedSubject,
  selectedDifficulty, setSelectedDifficulty,
  selectedYear, setSelectedYear,
  setActivePdfViewer,
  triggerDownload,
}: PYQSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortMode, setSortMode] = useState<string>('recent');

  const sortedPyqs = [...filteredPyqs].sort((a, b) => {
    if (sortMode === 'recent') return b.year - a.year;
    if (sortMode === 'alphabetical') return a.chapter.localeCompare(b.chapter);
    return 0;
  });

  return (
    <div key={selectedExam} className="animate-[fadeInUp_0.4s_ease-out_forwards]">
      <ResourceHero
        themeGradient={currentExamInfo?.themeGradient || 'from-[#4A0E1B] to-[#7C2532]'}
        title="Previous Year Questions"
        description="Original exam questions with step-by-step analytical solutions."
        totalLabel="Total Papers"
        totalCount={filteredPyqs.length}
      />

      <ResourceToolbar
        tabs={currentExamInfo?.filters || availableSubjects}
        activeTab={selectedSubject}
        onTabChange={setSelectedSubject}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search papers..."
        sortOptions={[
          { id: 'recent', label: 'Most Recent' },
          { id: 'alphabetical', label: 'Alphabetical A-Z' },
        ]}
        activeSort={sortMode}
        onSortChange={setSortMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        extraFilters={
          <>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="h-[40px] rounded-[10px] border-[1.5px] border-[#F0E9E2] dark:border-[#F6F2EA]/10 bg-[#FAF6F1] dark:bg-[#2A2726] px-3 text-[13px] text-[#3A2E28] dark:text-[#F6F2EA] outline-none">
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="h-[40px] rounded-[10px] border-[1.5px] border-[#F0E9E2] dark:border-[#F6F2EA]/10 bg-[#FAF6F1] dark:bg-[#2A2726] px-3 text-[13px] text-[#3A2E28] dark:text-[#F6F2EA] outline-none">
              <option value="All">All Years</option>
              {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </>
        }
      />

      {sortedPyqs.length === 0 ? (
        <EmptyState label="No PYQ booklets match your search or filters." />
      ) : (
        <div className={`grid gap-[20px] ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {sortedPyqs.map((pyq, idx) => {
            let customStyles = { bg: '#EAF0FB', text: '#3A5FA6' }; // Default PYQ color

            return (
              <PremiumCard key={pyq.id} interactive padding="medium" className="flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <PremiumCard.Icon className="bg-opacity-20" style={{ backgroundColor: customStyles.bg, color: customStyles.text }}>
                    <FileText size={20} />
                  </PremiumCard.Icon>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="mb-[12px] flex flex-wrap items-center gap-[8px] justify-end absolute top-4 right-4">
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD]">
                        {pyq.year}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD]">
                        {pyq.difficulty}
                      </span>
                    </div>
                    <PremiumCard.Title className="mt-2 text-[15px] pr-20 line-clamp-2">
                      {pyq.chapter}
                    </PremiumCard.Title>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[12px] text-[#5A534B] dark:text-[#A89F91]">{pyq.subject}</span>
                    </div>
                  </div>
                </div>

                <PremiumCard.Description className="mt-[12px] line-clamp-2 text-[13px]">
                  Original question paper with detailed step-by-step solutions for {pyq.chapter}.
                </PremiumCard.Description>

                <PremiumCard.Footer className="mt-auto">
                  <div className="flex items-center justify-between w-full">
                    <label className="flex items-center gap-2 cursor-pointer group/check">
                      <input
                        type="checkbox"
                        className="h-[14px] w-[14px] rounded border-[#C0A98B] text-[#5A2436] focus:ring-[#5A2436]/30 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#8B8B8B] group-hover/check:text-[#4A4A4A] transition-colors">
                        MARK SOLVED
                      </span>
                    </label>
                    <div className="flex gap-[8px]">
                      <button onClick={(e) => { e.stopPropagation(); setActivePdfViewer({ title: `PYQ Question · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.questionUrl }); }} className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E0D5CC] dark:border-[#383330] bg-white dark:bg-[#22201F] px-[12px] text-[12px] font-bold text-[#5A2436] dark:text-[#F6F2EA] transition-all hover:bg-[#F9F7F5] dark:hover:bg-[#2A2726]">
                        <Eye size={14} className="mr-1.5" /> Paper
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setActivePdfViewer({ title: `PYQ Solution · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.solutionUrl }); }} className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#F3D9CE] dark:bg-[#4A0E1B] px-[12px] text-[12px] font-bold text-[#8A3D2C] dark:text-[#F6F2EA] transition-all hover:bg-[#EBD2C7] dark:hover:bg-[#5A1424]">
                        <Eye size={14} className="mr-1.5" /> Sol.
                      </button>
                    </div>
                  </div>
                </PremiumCard.Footer>
              </PremiumCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
