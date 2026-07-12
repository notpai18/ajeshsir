import React, { useState } from 'react';
import { HelpCircle, Eye, Reply, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { PremiumCard } from '../PremiumCard';
import { ResourceHero, ResourceToolbar } from '../resources/ResourcePageLayout';
import type { DoubtsSectionProps } from './types';

export function DoubtsSection({
  currentExamInfo,
  doubts,
  faqs,
  doubtForm, setDoubtForm,
  doubtFile, setDoubtFile,
  doubtSubmitted, doubtSubmitting, handleDoubtSubmit,
  expandedFaqId, setExpandedFaqId,
}: DoubtsSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<string>('recent');

  const openDoubts = doubts?.filter(d => !d.isAnswered).length || 0;
  const resolvedDoubts = doubts?.filter(d => d.isAnswered).length || 0;

  // Filter
  const filteredDoubts = (doubts || []).filter(d => {
    if (activeTab === 'Open') return !d.isAnswered;
    if (activeTab === 'Resolved') return d.isAnswered;
    if (activeTab === 'My Doubts') return true; // mock filter for user's doubts
    return true;
  }).filter(d => d.question.toLowerCase().includes(searchQuery.toLowerCase()) || d.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  const sortedDoubts = [...filteredDoubts].sort((a, b) => {
    if (sortMode === 'alphabetical') return a.subject.localeCompare(b.subject);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // recent
  });

  return (
    <div className="animate-[fadeInUp_0.4s_ease-out_forwards]">
      <ResourceHero
        themeGradient={currentExamInfo?.themeGradient || 'from-[#4A0E1B] to-[#7C2532]'}
        title="Doubts & FAQ"
        description="Ask the professor a direct question or browse common answers."
        quickStats={[
          { icon: 'Target', value: openDoubts, label: 'Open Doubts' },
          { icon: 'CheckCircle2', value: resolvedDoubts, label: 'Resolved' },
          { icon: 'Clock', value: '2-4 hrs', label: 'Avg Response' },
          { icon: 'Library', value: '5+', label: 'Categories' }
        ]}
        totalLabel="Total Doubts"
        totalCount={doubts?.length || 0}
        progressValue={resolvedDoubts}
        progressLabel="resolved"
      />

      <ResourceToolbar
        tabs={['All', 'Open', 'Resolved', 'My Doubts']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search doubts..."
        sortOptions={[
          { id: 'recent', label: 'Most Recent' },
          { id: 'alphabetical', label: 'Alphabetical A-Z' },
        ]}
        activeSort={sortMode}
        onSortChange={setSortMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {sortedDoubts.length === 0 ? (
        <EmptyState label="No doubts match your search." />
      ) : (
        <div className={`grid gap-[20px] ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {sortedDoubts.map((doubt, idx) => {
            let customStyles = doubt.isAnswered ? { bg: '#E8F5E9', text: '#2E7D32' } : { bg: '#FDECEA', text: '#C0392B' };

            return (
              <PremiumCard key={doubt.id} interactive padding="medium" className="flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <PremiumCard.Icon className="bg-opacity-20" style={{ backgroundColor: customStyles.bg, color: customStyles.text }}>
                    <HelpCircle size={20} />
                  </PremiumCard.Icon>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="mb-[12px] flex flex-wrap items-center gap-[8px] justify-end absolute top-4 right-4">
                      <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD]">
                        {doubt.isAnswered ? 'Resolved' : 'Open'}
                      </span>
                    </div>
                    <PremiumCard.Title className="mt-2 text-[15px] pr-20 line-clamp-2">
                      {doubt.subject}
                    </PremiumCard.Title>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[12px] text-[#5A534B] dark:text-[#A89F91]">By {doubt.name}</span>
                    </div>
                  </div>
                </div>

                <PremiumCard.Description className="mt-[12px] line-clamp-2 text-[13px]">
                  {doubt.question}
                </PremiumCard.Description>

                <PremiumCard.Footer className="mt-auto">
                  <div className="flex items-center justify-between w-full">
                    <label className="flex items-center gap-2 cursor-pointer group/check">
                      <input
                        type="checkbox"
                        checked={doubt.isAnswered}
                        readOnly
                        className="h-[14px] w-[14px] rounded border-[#C0A98B] text-[#5A2436] focus:ring-[#5A2436]/30 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={`text-[11px] font-bold uppercase tracking-[0.05em] transition-colors ${doubt.isAnswered ? 'text-[#5A2436]' : 'text-[#8B8B8B] group-hover/check:text-[#4A4A4A]'}`}>
                        MARK RESOLVED
                      </span>
                    </label>
                    <div className="flex gap-[8px]">
                      <button onClick={(e) => { e.stopPropagation(); }} className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E0D5CC] dark:border-[#383330] bg-white dark:bg-[#22201F] px-[12px] text-[12px] font-bold text-[#5A2436] dark:text-[#F6F2EA] transition-all hover:bg-[#F9F7F5] dark:hover:bg-[#2A2726]">
                        <Eye size={14} className="mr-1.5" /> View
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); }} className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#F3D9CE] dark:bg-[#4A0E1B] px-[12px] text-[12px] font-bold text-[#8A3D2C] dark:text-[#F6F2EA] transition-all hover:bg-[#EBD2C7] dark:hover:bg-[#5A1424]">
                        <Reply size={14} className="mr-1.5" /> Reply
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
