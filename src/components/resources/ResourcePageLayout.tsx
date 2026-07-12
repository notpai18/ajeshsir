import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Search, LayoutGrid, List, ChevronDown, Check, Atom, FlaskConical, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PremiumBreadcrumb } from '../PremiumBreadcrumb';

export interface ResourcePageLayoutProps {
  onBack?: () => void;
  backLabel?: string;
  hero: ReactNode;
  toolbar: ReactNode;
  children: ReactNode;
}

export function ResourcePageLayout({ onBack, backLabel = 'Back', hero, toolbar, children }: ResourcePageLayoutProps) {
  return (
    <div className="animate-[fadeInUp_0.4s_ease-out_forwards]">
      {onBack && (
        <PremiumBreadcrumb
          items={[]}
          onBack={onBack}
          backLabel={backLabel}
        />
      )}
      {hero}
      {toolbar}
      {children}
    </div>
  );
}

export interface ResourceHeroProps {
  themeGradient?: string;
  title: string;
  description?: string;
  quickStats?: { icon: string; value: string | number; label: string }[];
  totalLabel: string;
  totalCount: number;
  progressValue?: number; // e.g. how many completed
  progressLabel?: string; // e.g. 'reviewed'
  primaryAction?: ReactNode; // Action button for hero
}

export function ResourceHero({
  themeGradient = 'from-[#4A0E1B] to-[#7C2532]',
  title,
  description,
  quickStats,
  totalLabel,
  totalCount,
  progressValue,
  progressLabel = 'completed',
  primaryAction
}: ResourceHeroProps) {
  const percentage = totalCount > 0 && progressValue !== undefined
    ? Math.max(5, Math.round((progressValue / totalCount) * 100))
    : 0;

  return (
    <div className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br ${themeGradient} p-6 sm:p-8 text-white shadow-[0_12px_24px_-12px_rgba(34,32,31,0.5)] mb-8`}>
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="dash-serif text-2xl md:text-3xl font-semibold">{title}</h2>
          {quickStats ? (
            <div className="mt-4 grid grid-cols-2 sm:flex sm:flex-row gap-3">
              {quickStats.map((stat: any, idx: number) => {
                let IconEl: React.ReactNode = null;
                if (stat.icon === 'Library') IconEl = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>;
                else if (stat.icon === 'FileText') IconEl = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
                else if (stat.icon === 'Target') IconEl = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
                else IconEl = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;

                return (
                  <div key={idx} className="flex items-center gap-2.5 rounded-[12px] border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-md transition-all hover:bg-white/10 group">
                    <span className="text-white/80 transition-transform group-hover:scale-110">{IconEl}</span>
                    <div>
                      <div className="text-[15px] font-bold leading-none text-white">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1 font-medium">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-2 text-sm text-white/70 max-w-md">
              {description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="rounded-[12px] bg-[#4A0E1B] p-4 text-center min-w-[160px] shadow-[0_4px_12px_rgba(34,32,31,0.3)] border border-white/5">
            <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#D9C2A2]">{totalLabel}</p>
            <p className="dash-mono text-[32px] font-bold text-white mt-2 leading-none">{totalCount}</p>
            {progressValue !== undefined && (
              <div className="mt-[8px] text-left w-full">
                <div className="text-[11px] font-medium text-white/60 mb-1">Progress</div>
                <div className="h-[6px] w-full bg-white/10 rounded-[3px] overflow-hidden">
                  <div
                    className="h-full bg-[#C9A13B] transition-all duration-500 ease-out shadow-[0_0_8px_rgba(34,32,31,0.5)]"
                    style={{ width: `${percentage}%`, borderRadius: '3px' }}
                  />
                </div>
                <div className="mt-1 text-[11px] font-medium text-white/60">
                  {progressValue} / {totalCount} {progressLabel}
                </div>
              </div>
            )}
            {primaryAction && (
              <div className="mt-4">
                {primaryAction}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface ResourceToolbarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  sortOptions?: { id: string; label: string }[];
  activeSort?: string;
  onSortChange?: (id: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  extraFilters?: ReactNode;
  /** Optional per-tab counts shown in parentheses next to each tab label */
  tabCounts?: Record<string, number>;
}

export function ResourceToolbar({
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  sortOptions,
  activeSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  extraFilters,
  tabCounts,
}: ResourceToolbarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="my-[20px] flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-[16px] bg-white dark:bg-[#22201F] rounded-[22px] min-h-[72px] px-[24px] py-[14px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#F2EEE8] dark:border-[#383330]">
      {/* LEFT — Subject/Category tabs */}
      <div className="flex relative items-center gap-[4px] w-full sm:w-auto overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative z-10 flex items-center justify-center px-[20px] py-[10px] text-[14px] font-medium rounded-full transition-all duration-[200ms] ease-out shrink-0 ${
                isActive 
                  ? 'bg-[#4A0E1B] text-white shadow-md' 
                  : 'bg-transparent text-[#6B5D54] hover:bg-[#F2EEE8] dark:hover:bg-[#2A2726] dark:text-[#A89F91]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* RIGHT — Filters, Search, Sort, View */}
      <div className="flex flex-col sm:flex-row items-center gap-[16px] w-full sm:w-auto">
        {extraFilters}

        {/* Search */}
        <div className={`relative flex items-center transition-all duration-200 ease-out ${isSearchFocused ? 'w-full sm:w-[320px]' : 'w-full sm:w-[260px]'}`}>
          <Search size={18} className="pointer-events-none absolute left-[16px] text-[#A89F91]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-[46px] rounded-full bg-[#F9F7F5] dark:bg-[#1A1817] pl-[44px] pr-[16px] text-[14px] text-[#22201F] dark:text-[#F6F2EA] placeholder:text-[#A89F91] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#22201F] focus:shadow-[0_0_0_4px_rgba(74,14,27,0.05)] border border-transparent focus:border-[#4A0E1B]/20"
          />
        </div>

        <div className="flex items-center gap-[12px] w-full sm:w-auto">
          {/* Custom Sort Dropdown */}
          {sortOptions && activeSort && onSortChange && (
            <div className="relative w-full sm:w-auto" ref={sortDropdownRef}>
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex h-[46px] w-full sm:w-auto items-center justify-between gap-[8px] px-[12px] text-[14px] font-medium text-[#22201F] dark:text-[#F6F2EA] transition-colors hover:text-[#4A0E1B] dark:hover:text-[#F6F2EA]"
              >
                <span className="whitespace-nowrap">
                  {sortOptions.find(o => o.id === activeSort)?.label || activeSort}
                </span>
                <ChevronDown size={14} className={`text-[#8A7A6D] transition-transform duration-[200ms] ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-[calc(100%+8px)] z-50 w-full sm:min-w-[180px] rounded-[12px] bg-white dark:bg-[#22201F] p-[6px] shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#F2EEE8] dark:border-[#383330]"
                  >
                    {sortOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => { onSortChange(opt.id); setIsSortDropdownOpen(false); }}
                        className="flex w-full items-center justify-between rounded-[8px] px-[12px] py-[10px] text-left text-[14px] font-medium text-[#3A2E28] dark:text-[#F6F2EA] transition-colors hover:bg-[#F9F7F5] dark:hover:bg-[#383330]"
                      >
                        {opt.label}
                        {activeSort === opt.id && <Check size={16} className="text-[#4A0E1B] dark:text-[#F6F2EA]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Grid/List View Toggle */}
          {viewMode && onViewModeChange && (
            <div className="flex gap-[4px] shrink-0 ml-auto sm:ml-0">
              {(['grid', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`flex h-[40px] w-[40px] items-center justify-center rounded-[10px] transition-colors duration-200 ${
                    viewMode === mode 
                      ? 'bg-[#F2EEE8] text-[#4A0E1B] dark:bg-[#383330] dark:text-[#F6F2EA]' 
                      : 'text-[#A89F91] hover:bg-[#F9F7F5] dark:hover:bg-[#2A2726]'
                  }`}
                >
                  {mode === 'grid' ? <LayoutGrid size={18} /> : <List size={18} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
