import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ResourceCard } from '../resources/ResourceCard';
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
        <div className={`grid gap-[24px] ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {sortedVideos.map((video) => (
            <ResourceCard
              key={video.id}
              title={video.title}
              description={video.description}
              chapter={video.chapter}
              subject={video.subject}
              image={video.thumbnail || getYoutubeThumbnail(extractYouTubeId(video.youtubeLink), 'hqdefault')}
              onClick={() => setActiveVideoModal(video)}
              actions={[
                {
                  icon: Play,
                  label: 'Watch',
                  onClick: () => setActiveVideoModal(video)
                }
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
