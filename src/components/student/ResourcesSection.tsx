import React, { useState } from 'react';
import { Download, FileSpreadsheet, BookOpen, Link as LinkIcon, Eye } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ResourceCard } from '../resources/ResourceCard';
import { ResourceHero, ResourceToolbar } from '../resources/ResourcePageLayout';
import type { ResourcesSectionProps } from './types';

export function ResourcesSection({ currentExamInfo, triggerDownload }: ResourcesSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<string>('recent');

  const resources = [
    { id: '1', title: 'Syllabus blueprints & topic weights', description: 'A mapped matrix of chapter distribution, sub-topic weights and question-occurrence frequencies compiled from the past 10 years of entrance examinations.', type: 'Syllabus', icon: 'FileSpreadsheet', fileUrl: 'syllabus-blueprints.pdf', downloads: 1420 },
    { id: '2', title: 'Formula & fundamental constant sheets', description: 'A rapid-revision pocket PDF covering electromagnetic vectors, rotational momenta, calculus limits and key physical constants.', type: 'Formulas', icon: 'BookOpen', fileUrl: 'formula-pocket-sheets.pdf', downloads: 3500 },
  ];

  const filtered = resources.filter(r => {
    if (activeTab !== 'All' && r.type !== activeTab) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortMode === 'popular') return b.downloads - a.downloads;
    if (sortMode === 'alphabetical') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="animate-[fadeInUp_0.4s_ease-out_forwards]">
      <ResourceHero
        themeGradient={currentExamInfo?.themeGradient || 'from-[#4A0E1B] to-[#7C2532]'}
        title="Additional Resources"
        description="Syllabus blueprints, formula sheets and reference constants."
        quickStats={[
          { icon: 'Library', value: '25+', label: 'Total Resources' },
          { icon: 'Target', value: '8', label: 'Categories' },
          { icon: 'CheckCircle2', value: '5', label: 'New This Month' },
          { icon: 'Download', value: '10k+', label: 'Downloads' }
        ]}
        totalLabel="Resources"
        totalCount={resources.length}
      />

      <ResourceToolbar
        tabs={['All', 'Syllabus', 'Formulas', 'Constants']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search resources..."
        sortOptions={[
          { id: 'recent', label: 'Most Recent' },
          { id: 'popular', label: 'Most Downloaded' },
          { id: 'alphabetical', label: 'Alphabetical A-Z' },
        ]}
        activeSort={sortMode}
        onSortChange={setSortMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {filtered.length === 0 ? (
        <EmptyState label="No resources match your search." />
      ) : (
        <div className={`grid gap-[24px] ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filtered.map((res) => (
            <ResourceCard
              key={res.id}
              title={res.title}
              description={res.description}
              chapter={res.type}
              subject="Resource"
              actions={[
                {
                  icon: Download,
                  label: 'Download',
                  onClick: () => triggerDownload(res.fileUrl)
                }
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
