import React, { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ResourceCard } from '../resources/ResourceCard';
import { ResourceHero, ResourceToolbar } from '../resources/ResourcePageLayout';
import { CustomSelect } from '../ui/CustomSelect';
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
            <CustomSelect 
              value={selectedDifficulty} 
              onChange={setSelectedDifficulty} 
              className="h-[46px] rounded-full border border-transparent bg-[#F9F7F5] dark:bg-[#1A1817] px-4 text-[14px] text-[#22201F] dark:text-[#F6F2EA] outline-none transition-all focus:bg-white dark:focus:bg-[#22201F] focus:border-[#4A0E1B]/20 flex justify-between items-center w-40"
              options={[
                { value: 'All', label: 'All difficulties' },
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' }
              ]} 
              placeholder="All difficulties" 
            />
            <CustomSelect 
              value={selectedYear} 
              onChange={setSelectedYear} 
              className="h-[46px] rounded-full border border-transparent bg-[#F9F7F5] dark:bg-[#1A1817] px-4 text-[14px] text-[#22201F] dark:text-[#F6F2EA] outline-none transition-all focus:bg-white dark:focus:bg-[#22201F] focus:border-[#4A0E1B]/20 flex justify-between items-center w-36"
              options={[
                { value: 'All', label: 'All Years' },
                ...Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => ({ value: year.toString(), label: year.toString() }))
              ]} 
              placeholder="All Years" 
            />
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
                  label: 'Question',
                  onClick: () => setActivePdfViewer({ title: `PYQ Question · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.questionUrl })
                },
                {
                  icon: Eye,
                  label: 'Solution',
                  onClick: () => setActivePdfViewer({ title: `PYQ Solution · ${pyq.chapter} (${pyq.year})`, fileUrl: pyq.solutionUrl })
                },
                {
                  icon: Download,
                  label: 'Q. PDF',
                  onClick: () => triggerDownload(pyq.questionUrl, pyq.questionOriginalFilename)
                },
                {
                  icon: Download,
                  label: 'Sol. PDF',
                  onClick: () => triggerDownload(pyq.solutionUrl, pyq.solutionOriginalFilename)
                }
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
