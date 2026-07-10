/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * VideosSection — Video lecture cards with search/filter and watch modal trigger.
 * Extracted from StudentDashboardContent (StudentDashboard.tsx).
 */

import React from 'react';
import { Search, Play } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { SubjectBadge } from '../ui/SubjectBadge';
import { CARD, INPUT, MICRO, PRIMARY_BTN } from '../ui/tokens';
import { extractYouTubeId, getYoutubeThumbnail } from '../../lib/youtube';
import type { Video } from '../../types';
import type { VideosSectionProps } from './types';

export function VideosSection({
  currentExamInfo,
  availableSubjects,
  filteredVideos,
  searchQuery, setSearchQuery,
  selectedSubject, setSelectedSubject,
  setActiveVideoModal,
}: VideosSectionProps) {
  return (
    <div>
      <div className="mt-4 mb-6">
        <p className={MICRO}>{currentExamInfo?.title} · Video lectures</p>
        <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA]">Video lectures</h2>
      </div>

      <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search lectures…" className={`${INPUT} pl-10`} />
        </div>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={`${INPUT} sm:w-52`}>
          {availableSubjects.map((subject) => (
            <option key={subject} value={subject}>{subject === 'All' ? 'All subjects' : subject}</option>
          ))}
        </select>
      </div>

      {filteredVideos.length === 0 ? (
        <EmptyState label="No lecture recordings match your search or subject filter." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <div key={video.id} className={`${CARD} group flex flex-col overflow-hidden`}>
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
                <div className="flex items-center justify-between gap-2">
                  <SubjectBadge subject={video.subject} />
                  <span className={MICRO}>{video.chapter}</span>
                </div>
                <h4 className="mt-3.5 text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] line-clamp-1">{video.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#8A7E6F] dark:text-[#A89F91] line-clamp-2">{video.description}</p>
                <button onClick={() => setActiveVideoModal(video)} className={`${PRIMARY_BTN} mt-5 w-full`}>
                  Watch lecture
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
