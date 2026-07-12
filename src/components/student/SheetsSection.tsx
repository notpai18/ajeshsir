import React, { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ResourceCard } from '../resources/ResourceCard';
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
        <div className={`grid gap-[24px] ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {sortedSheets.map((sheet) => (
            <ResourceCard
              key={sheet.id}
              title={sheet.title}
              description={sheet.description}
              chapter={sheet.chapter}
              subject={sheet.subject}
              actions={[
                {
                  icon: Eye,
                  label: 'View',
                  onClick: () => setActivePdfViewer({ title: sheet.title, fileUrl: sheet.fileUrl })
                },
                {
                  icon: Download,
                  label: 'Download',
                  onClick: () => triggerDownload(sheet.fileUrl)
                }
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
