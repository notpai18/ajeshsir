import React, { useState } from 'react';
import { Download, FileSpreadsheet, BookOpen, Link as LinkIcon, Eye } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { PremiumCard } from '../PremiumCard';
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
        <div className={`grid gap-[20px] ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filtered.map((res, idx) => {
            let customStyles = { bg: '#F7EFD9', text: '#8A6A16' };
            if (res.icon === 'FileSpreadsheet') customStyles = { bg: '#F4E7E5', text: '#4A0E1B' };

            return (
              <PremiumCard key={res.id} interactive padding="medium" className="flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <PremiumCard.Icon className="bg-opacity-20" style={{ backgroundColor: customStyles.bg, color: customStyles.text }}>
                    {res.icon === 'FileSpreadsheet' ? <FileSpreadsheet size={20} /> : <BookOpen size={20} />}
                  </PremiumCard.Icon>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="mb-[12px] flex flex-wrap items-center gap-[8px] justify-end absolute top-4 right-4">
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD]">
                        {res.type}
                      </span>
                    </div>
                    <PremiumCard.Title className="mt-2 text-[15px] pr-20 line-clamp-2">
                      {res.title}
                    </PremiumCard.Title>
                  </div>
                </div>

                <PremiumCard.Description className="mt-[12px] line-clamp-2 text-[13px]">
                  {res.description}
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
                        MARK DOWNLOADED
                      </span>
                    </label>
                    <div className="flex gap-[8px]">
                      <button onClick={(e) => { e.stopPropagation(); triggerDownload(res.fileUrl); }} className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#F3D9CE] dark:bg-[#4A0E1B] px-[12px] text-[12px] font-bold text-[#8A3D2C] dark:text-[#F6F2EA] transition-all hover:bg-[#EBD2C7] dark:hover:bg-[#5A1424]">
                        <Download size={14} className="mr-1.5" /> Download
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
