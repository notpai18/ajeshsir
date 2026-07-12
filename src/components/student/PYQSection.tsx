import React, { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ResourceCard } from '../resources/ResourceCard';
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
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="h-[46px] rounded-full border border-transparent bg-[#F9F7F5] dark:bg-[#1A1817] px-4 text-[14px] text-[#22201F] dark:text-[#F6F2EA] outline-none transition-all focus:bg-white dark:focus:bg-[#22201F] focus:border-[#4A0E1B]/20">
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="h-[46px] rounded-full border border-transparent bg-[#F9F7F5] dark:bg-[#1A1817] px-4 text-[14px] text-[#22201F] dark:text-[#F6F2EA] outline-none transition-all focus:bg-white dark:focus:bg-[#22201F] focus:border-[#4A0E1B]/20">
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
        <div className={`grid gap-[24px] ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {sortedPyqs.map((pyq) => (
            <ResourceCard
              key={pyq.id}
              title={pyq.chapter}
              description={`Original question paper with detailed step-by-step solutions for ${pyq.chapter}.`}
              chapter={`${pyq.year} · ${pyq.difficulty}`}
              subject={pyq.subject}
              actions={[
                {
                  icon: Eye,
                  label: 'Paper',
                  onClick: () => setActivePdfViewer({ title: `PYQ Question · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.questionUrl })
                },
                {
                  icon: Eye,
                  label: 'Solution',
                  onClick: () => setActivePdfViewer({ title: `PYQ Solution · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.solutionUrl })
                }
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
