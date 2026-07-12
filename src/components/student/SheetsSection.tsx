import React, { useState } from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { PremiumCard } from '../PremiumCard';
import { ResourceHero, ResourceToolbar } from '../resources/ResourcePageLayout';
import type { SheetsSectionProps } from './types';

export function SheetsSection({
  currentExamInfo,
  selectedExam,
  availableSubjects,
  filteredSheets,
  searchQuery, setSearchQuery,
  selectedSubject, setSelectedSubject,
  setActivePdfViewer,
  triggerDownload,
}: SheetsSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortMode, setSortMode] = useState<string>('recent');

  const sortedSheets = [...filteredSheets].sort((a, b) => {
    if (sortMode === 'alphabetical') return a.title.localeCompare(b.title);
    return 0; // fallback to default order for 'recent'
  });

  return (
    <div key={selectedExam} className="animate-[fadeInUp_0.4s_ease-out_forwards]">
      <ResourceHero
        themeGradient={currentExamInfo?.themeGradient || 'from-[#4A0E1B] to-[#7C2532]'}
        title="Practice Sheets"
        description="Chapter drills graded by complexity to build proficiency."
        totalLabel="Total Sheets"
        totalCount={filteredSheets.length}
      />

      <ResourceToolbar
        tabs={currentExamInfo?.filters || availableSubjects}
        activeTab={selectedSubject}
        onTabChange={setSelectedSubject}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search sheets..."
        sortOptions={[
          { id: 'recent', label: 'Most Recent' },
          { id: 'alphabetical', label: 'Alphabetical A-Z' },
        ]}
        activeSort={sortMode}
        onSortChange={setSortMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {sortedSheets.length === 0 ? (
        <EmptyState label="No practice drills match your search or subject filter." />
      ) : (
        <div className={`grid gap-[20px] ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
          {sortedSheets.map((sheet, idx) => {
            let customStyles = { bg: '#FDECEA', text: '#C0392B' };

            return (
              <PremiumCard key={sheet.id} interactive padding="medium" className="flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <PremiumCard.Icon className="bg-opacity-20" style={{ backgroundColor: customStyles.bg, color: customStyles.text }}>
                    <FileText size={20} />
                  </PremiumCard.Icon>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="mb-[12px] flex flex-wrap items-center gap-[8px] justify-end absolute top-4 right-4">
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD]">
                        {sheet.chapter}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD]">
                        {sheet.subject}
                      </span>
                    </div>
                    <PremiumCard.Title className="mt-2 text-[15px] pr-20 line-clamp-2">
                      {sheet.title}
                    </PremiumCard.Title>
                  </div>
                </div>

                <PremiumCard.Description className="mt-[12px] line-clamp-2 text-[13px]">
                  {sheet.description}
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
                      <button onClick={(e) => { e.stopPropagation(); setActivePdfViewer({ title: sheet.title, fileUrl: sheet.fileUrl }); }} className="flex min-h-[44px] py-1 items-center justify-center rounded-[8px] border border-[#E0D5CC] dark:border-[#383330] bg-white dark:bg-[#22201F] px-[12px] text-[12px] font-bold text-[#5A2436] dark:text-[#F6F2EA] transition-all hover:bg-[#F9F7F5] dark:hover:bg-[#2A2726]">
                        <Eye size={14} className="mr-1.5" /> View
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); triggerDownload(sheet.fileUrl); }} className="flex min-h-[44px] py-1 items-center justify-center rounded-[8px] bg-[#F3D9CE] dark:bg-[#4A0E1B] px-[12px] text-[12px] font-bold text-[#8A3D2C] dark:text-[#F6F2EA] transition-all hover:bg-[#EBD2C7] dark:hover:bg-[#5A1424]">
                        <Download size={14} className="mr-1.5" /> DL
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
