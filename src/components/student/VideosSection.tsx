import React, { useState } from 'react';
import { Play, Eye, Download } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { PremiumCard } from '../PremiumCard';
import { ResourceHero, ResourceToolbar } from '../resources/ResourcePageLayout';
import { extractYouTubeId, getYoutubeThumbnail } from '../../lib/youtube';
import type { VideosSectionProps } from './types';

export function VideosSection({
  currentExamInfo,
  selectedExam,
  availableSubjects,
  filteredVideos,
  searchQuery, setSearchQuery,
  selectedSubject, setSelectedSubject,
  setActiveVideoModal,
}: VideosSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortMode, setSortMode] = useState<string>('recent');

  // Apply local sorting on top of already filtered list
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortMode === 'popular') return 0; // If there was a viewCount we could use it
    if (sortMode === 'alphabetical') return a.title.localeCompare(b.title);
    return -1;
  });

  return (
    <div key={selectedExam} className="animate-[fadeInUp_0.4s_ease-out_forwards]">
      <ResourceHero
        themeGradient={currentExamInfo?.themeGradient || 'from-[#4A0E1B] to-[#7C2532]'}
        title="Video Lectures"
        description="Conceptual recordings exploring complex chemical and numerical ideas."
        totalLabel="Total Lectures"
        totalCount={filteredVideos.length}
      />

      <ResourceToolbar
        tabs={currentExamInfo?.filters || availableSubjects}
        activeTab={selectedSubject}
        onTabChange={setSelectedSubject}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search lectures..."
        sortOptions={[
          { id: 'recent', label: 'Most Recent' },
          { id: 'popular', label: 'Most Viewed' },
          { id: 'alphabetical', label: 'Alphabetical A-Z' },
        ]}
        activeSort={sortMode}
        onSortChange={setSortMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {sortedVideos.length === 0 ? (
        <EmptyState label="No lecture recordings match your search or subject filter." />
      ) : (
        <div className={`grid gap-[20px] ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {sortedVideos.map((video, idx) => {
            let customStyles = { bg: '#F4E7E5', text: '#4A0E1B' };
            if (video.subject === 'Physical Chemistry' || video.subject === 'Physical') customStyles = { bg: '#FDECEA', text: '#C0392B' };
            else if (video.subject === 'Organic Chemistry' || video.subject === 'Organic') customStyles = { bg: '#EAF4EC', text: '#3C8C5B' };
            else if (video.subject === 'Inorganic Chemistry' || video.subject === 'Inorganic') customStyles = { bg: '#EAF0FB', text: '#3A5FA6' };

            return (
              <PremiumCard key={video.id} interactive padding="none" className="flex flex-col h-full" onClick={() => setActiveVideoModal(video)}>
                <div className="relative aspect-video w-full overflow-hidden bg-[#EFE7D8]">
                  <img
                    src={video.thumbnail || getYoutubeThumbnail(extractYouTubeId(video.youtubeLink), 'hqdefault')}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#22201F]/25 opacity-80 transition-opacity group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#4A0E1B] shadow-lg transition-transform group-hover:scale-105">
                      <Play size={20} className="ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <span className="dash-mono absolute bottom-2 right-2 rounded-md bg-[#22201F]/80 px-1.5 py-0.5 text-[10px] font-medium text-white">{video.duration}</span>
                </div>
                
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-4">
                    <PremiumCard.Icon className="bg-opacity-20" style={{ backgroundColor: customStyles.bg, color: customStyles.text }}>
                      <Play size={20} />
                    </PremiumCard.Icon>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="mb-[12px] flex flex-wrap items-center gap-[8px] justify-end absolute top-[calc(56.25%+16px)] right-4">
                        <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD]">
                          {video.chapter}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-[#F4F4F4] dark:bg-[#383330] px-[10px] py-[4px] text-[11px] font-bold text-[#4A4A4A] dark:text-[#C7BCAD] gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: customStyles.text }} />
                          {video.subject}
                        </span>
                      </div>
                      <PremiumCard.Title className="mt-2 text-[15px] pr-20 line-clamp-2">
                        {video.title}
                      </PremiumCard.Title>
                    </div>
                  </div>

                  <PremiumCard.Description className="mt-[12px] line-clamp-2 text-[13px]">
                    {video.description}
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
                          MARK WATCHED
                        </span>
                      </label>
                      <div className="flex gap-[8px]">
                        <button onClick={(e) => { e.stopPropagation(); setActiveVideoModal(video); }} className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#F3D9CE] dark:bg-[#4A0E1B] px-[12px] text-[12px] font-bold text-[#8A3D2C] dark:text-[#F6F2EA] transition-all hover:bg-[#EBD2C7] dark:hover:bg-[#5A1424]">
                          <Play size={14} className="mr-1.5" /> Watch
                        </button>
                      </div>
                    </div>
                  </PremiumCard.Footer>
                </div>
              </PremiumCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
