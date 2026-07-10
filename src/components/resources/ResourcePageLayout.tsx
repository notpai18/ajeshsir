import React, { ReactNode } from 'react';
import { ArrowLeft, Search, LayoutGrid, List, ArrowDownUp } from 'lucide-react';

interface ResourcePageLayoutProps {
  onBack: () => void;
  backLabel?: string;
  hero: ReactNode;
  toolbar: ReactNode;
  children: ReactNode; // Grid/List of items or EmptyState
}

export function ResourcePageLayout({ onBack, backLabel = 'Back to categories', hero, toolbar, children }: ResourcePageLayoutProps) {
  return (
    <div className="animate-[fadeInUp_0.4s_ease-out_forwards]">
      {hero}
      {toolbar}
      {children}
    </div>
  );
}

export interface ResourceHeroProps {
  courseTitle?: string;
  title: string;
  description: string;
  totalCount: number;
  totalLabel?: string;
}

export function ResourceHero({ courseTitle, title, description, totalCount, totalLabel = 'Total' }: ResourceHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#4A0E1B] to-[#7C2532] p-6 sm:p-8 text-white shadow-[0_12px_24px_-12px_rgba(74,14,27,0.5)] mb-8">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {courseTitle && (
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D9C2A2]">
              {courseTitle}
            </p>
          )}
          <h2 className="dash-serif mt-1 text-2xl md:text-3xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-white/70 max-w-md">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 text-center min-w-[100px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#D9C2A2]">{totalLabel}</p>
            <p className="dash-mono text-2xl font-bold mt-1">{totalCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface ResourceToolbarProps {
  subjects: string[];
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortMode?: 'recent' | 'popular' | string;
  onSortToggle?: () => void;
  sortLabel?: string;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  extraFilters?: ReactNode;
}

export function ResourceToolbar({
  subjects,
  selectedSubject,
  onSubjectChange,
  searchQuery,
  onSearchChange,
  sortMode,
  onSortToggle,
  sortLabel,
  viewMode,
  onViewModeChange,
  extraFilters
}: ResourceToolbarProps) {
  return (
    <div className="rounded-[28px] border border-[#EAE1D2] bg-white shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)] mb-6 flex flex-col p-2 sm:flex-row sm:items-center sm:justify-between gap-2 overflow-hidden">
      <div className="flex flex-1 items-center gap-1 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar pl-2">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => onSubjectChange(subject)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-[11px] font-bold transition-all ${
              selectedSubject === subject
                ? 'bg-[#4A0E1B] text-white shadow-md'
                : 'text-[#6E645A] hover:bg-[#F6F2EA] hover:text-[#22201F]'
            }`}
          >
            {subject === 'All' ? 'All' : subject}
          </button>
        ))}
      </div>
      
      <div className="flex flex-wrap items-center gap-2 border-t border-[#F2ECDF] pt-2 sm:border-none sm:pt-0 pl-2 pr-2">
        {extraFilters}
        
        {/* Search */}
        <div className="relative w-full sm:w-56 lg:w-64">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B3A996]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search resources..."
            className="w-full rounded-lg border border-[#E3D8C5] bg-[#FBF7F0] py-2 pl-9 pr-3 text-xs text-[#22201F] placeholder:text-[#B3A996] outline-none transition focus:border-[#4A0E1B]/50 focus:bg-white focus:ring-2 focus:ring-[#4A0E1B]/10"
          />
        </div>
        
        {/* Sort Toggle (Visual) */}
        {onSortToggle && (
          <button 
            onClick={onSortToggle}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E3D8C5] bg-[#FBF7F0] text-[#6E645A] transition-colors hover:bg-white hover:text-[#22201F]"
            title={`Sort: ${sortLabel || sortMode}`}
          >
            <ArrowDownUp size={14} />
          </button>
        )}

        {/* View Toggle (Visual) */}
        <div className="flex h-9 shrink-0 items-center rounded-lg border border-[#E3D8C5] bg-[#FBF7F0] p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex h-full w-8 items-center justify-center rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-[#4A0E1B] shadow-sm' : 'text-[#8A7E6F] hover:text-[#22201F]'}`}
            title="Grid View"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex h-full w-8 items-center justify-center rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-[#4A0E1B] shadow-sm' : 'text-[#8A7E6F] hover:text-[#22201F]'}`}
            title="List View"
          >
            <List size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResourceEmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EFD9] text-[#8A6A16]">
        <Search size={22} />
      </div>
      <p className="mt-4 text-sm font-semibold text-[#22201F]">Nothing found</p>
      <p className="mt-1 max-w-sm text-sm text-[#8A7E6F]">{label}</p>
    </div>
  );
}

export function ResourceGrid({ viewMode, children }: { viewMode: 'grid' | 'list', children: ReactNode }) {
  return (
    <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {children}
    </div>
  );
}
