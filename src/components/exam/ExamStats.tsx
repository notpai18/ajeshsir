import React from 'react';
import { Download, ArrowRight, Star, Clock, Trophy, FileText, PlayCircle } from 'lucide-react';
import { Note, Video, PYQ, PracticeSheet, Announcement } from '../../types';
import { SubjectBadge } from '../resources/ResourceCard';

// Featured Content Component
export function FeaturedResource({ item, onPreview, onDownload }: { item: any, onPreview: () => void, onDownload: () => void }) {
  if (!item) return null;
  
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white dark:bg-[#22201F] border border-[#EAE1D2] dark:border-[#4A433E] p-8 sm:p-10 shadow-[0_12px_40px_-12px_rgba(74,14,27,0.08)] group transition-all hover:shadow-[0_20px_50px_-12px_rgba(74,14,27,0.12)]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C9A13B]/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7EFD9] dark:bg-[#362A0D] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8A6A16]">
              🔥 Featured
            </span>
            <span className="inline-block rounded-full border border-[#EFE7D8] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8A7E6F] dark:text-[#A89F91]">
              {item.chapter}
            </span>
            <SubjectBadge subject={item.subject} />
          </div>
          
          <h3 className="dash-serif text-2xl sm:text-3xl font-bold text-[#22201F] dark:text-[#F6F2EA] mb-3 group-hover:text-[#4A0E1B] transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-[#8A7E6F] dark:text-[#A89F91] leading-relaxed max-w-xl">
            {item.description}
          </p>
        </div>
        
        <div className="flex flex-row md:flex-col gap-3 shrink-0">
          <button onClick={onPreview} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F4E7E5] dark:bg-[#38151A] px-6 py-3.5 text-xs font-bold text-[#4A0E1B] transition-colors hover:bg-[#EEDAD7]">
            Preview
          </button>
          <button onClick={onDownload} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A0E1B] px-6 py-3.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#380A14] shadow-md">
            <Download size={14} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}

// Resource Overview Component
export function ResourceOverview({ notesCount, videosCount, pyqsCount, sheetsCount }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {/* Circular Progress for Notes */}
      <div className="relative rounded-[28px] bg-white dark:bg-[#22201F] border border-[#EAE1D2] dark:border-[#4A433E] p-6 flex flex-col items-center justify-center shadow-sm hover:-translate-y-1 transition-transform">
        <div className="relative w-24 h-24 mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="#F6F2EA" strokeWidth="8" fill="none" />
            <circle cx="48" cy="48" r="40" stroke="#4A0E1B" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - Math.min(notesCount/50, 1))} className="transition-all duration-1500 ease-out" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-[#4A0E1B]">{notesCount}</span>
          </div>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A7E6F] dark:text-[#A89F91]">Study Notes</span>
      </div>

      {/* Glass Metric for Videos */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#7C2532] to-[#4A0E1B] p-6 flex flex-col justify-between shadow-md hover:-translate-y-1 transition-transform text-white overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white dark:bg-[#22201F]/10 rounded-full blur-2xl" />
        <div className="flex items-center justify-between">
          <div className="p-3 bg-white dark:bg-[#22201F]/10 rounded-2xl backdrop-blur-sm">
            <PlayCircle size={24} className="text-[#D9C2A2]" />
          </div>
        </div>
        <div className="mt-6">
          <span className="text-4xl font-bold dash-mono">{videosCount}</span>
          <span className="block mt-1 text-[11px] font-bold uppercase tracking-widest text-[#D9C2A2]">Video Lectures</span>
        </div>
      </div>

      {/* Timeline for PYQs */}
      <div className="relative rounded-[28px] bg-white dark:bg-[#22201F] border border-[#EAE1D2] dark:border-[#4A433E] p-6 flex flex-col shadow-sm hover:-translate-y-1 transition-transform">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16] flex items-center justify-center">
            <Clock size={16} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A7E6F] dark:text-[#A89F91]">Past Years</span>
        </div>
        <div className="flex-1 flex items-end">
          <div className="flex justify-between w-full items-end gap-1">
            {[40, 70, 45, 90, 60].map((h, i) => (
              <div key={i} className="w-full bg-[#F6F2EA] dark:bg-[#1A1817] rounded-t-sm" style={{ height: '60px' }}>
                <div className="w-full bg-[#C9A13B] rounded-t-sm transition-all duration-1000 delay-300" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-between text-[9px] font-bold text-[#A79A88]">
          <span>2019</span>
          <span>2023</span>
        </div>
      </div>

      {/* Progress Indicator for Sheets */}
      <div className="relative rounded-[28px] bg-white dark:bg-[#22201F] border border-[#EAE1D2] dark:border-[#4A433E] p-6 flex flex-col shadow-sm hover:-translate-y-1 transition-transform">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#F4E7E5] dark:bg-[#38151A] text-[#4A0E1B] flex items-center justify-center">
            <FileText size={16} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A7E6F] dark:text-[#A89F91]">Drills</span>
        </div>
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-bold text-[#22201F] dark:text-[#F6F2EA] dash-mono">{sheetsCount}</span>
            <span className="text-[10px] text-[#8A7E6F] dark:text-[#A89F91] font-bold mb-1">Available</span>
          </div>
          <div className="w-full h-2 bg-[#F6F2EA] dark:bg-[#1A1817] rounded-full overflow-hidden">
            <div className="h-full bg-[#4A0E1B] rounded-full transition-all duration-1000 w-[75%]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Downloads Leaderboard
export function DownloadsLeaderboard({ items }: { items: any[] }) {
  const maxDownloads = Math.max(...items.map(i => i.downloadCount || 1));
  
  return (
    <div className="bg-white dark:bg-[#22201F] rounded-[32px] border border-[#EAE1D2] dark:border-[#4A433E] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="text-[#C9A13B]" size={24} />
        <h3 className="dash-serif text-2xl font-bold text-[#22201F] dark:text-[#F6F2EA]">Top Downloads</h3>
      </div>
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="group flex items-center gap-4">
            <div className="w-8 text-center text-sm font-bold text-[#A79A88] group-hover:text-[#4A0E1B] transition-colors">
              #{index + 1}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] line-clamp-1 group-hover:text-[#4A0E1B] transition-colors">{item.title}</span>
                <span className="text-xs font-bold text-[#8A7E6F] dark:text-[#A89F91] dash-mono">{item.downloadCount}</span>
              </div>
              <div className="w-full h-1.5 bg-[#F6F2EA] dark:bg-[#1A1817] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#D9C2A2] to-[#C9A13B] rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${((item.downloadCount || 0) / maxDownloads) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Recent Updates Timeline
export function RecentUpdates({ updates }: { updates: Announcement[] }) {
  return (
    <div className="bg-white dark:bg-[#22201F] rounded-[32px] border border-[#EAE1D2] dark:border-[#4A433E] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <Star className="text-[#4A0E1B]" size={24} />
        <h3 className="dash-serif text-2xl font-bold text-[#22201F] dark:text-[#F6F2EA]">Latest Updates</h3>
      </div>
      
      <div className="relative border-l-2 border-[#F6F2EA] ml-3 space-y-8 pb-4">
        {updates.slice(0, 4).map((update, idx) => (
          <div key={update.id} className="relative pl-6 group">
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${update.pinned ? 'bg-[#4A0E1B] scale-125' : 'bg-[#D9C2A2]'} transition-transform group-hover:scale-125`} />
            <div className="flex items-center gap-2 mb-1">
              {update.pinned && <span className="text-[9px] font-bold uppercase tracking-widest text-[#4A0E1B] bg-[#F4E7E5] dark:bg-[#38151A] px-2 py-0.5 rounded-full">Pinned</span>}
              <span className="text-[10px] text-[#A79A88] font-bold uppercase tracking-wider">
                {new Date(update.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] mb-1 group-hover:text-[#4A0E1B] transition-colors">{update.title}</h4>
            <p className="text-xs text-[#8A7E6F] dark:text-[#A89F91] leading-relaxed line-clamp-2">{update.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
