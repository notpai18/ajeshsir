/**
 * PDFToolbar — sticky top toolbar for the PDF viewer.
 * Design: Professor's Study system (design.md)
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  RotateCcw, RotateCw, Search, Download, Printer, Maximize,
  Minimize, Sun, Moon, Coffee, X, PanelLeft, BookOpen,
  PanelRight, Bookmark, BookmarkCheck, Info
} from 'lucide-react';
import { usePDF } from './PDFContext';
import { BreadcrumbBar } from '../BreadcrumbBar';
import { downloadPDF } from '../../lib/pdfUrl';

const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0];

interface PDFToolbarProps {
  onClose: () => void;
}

export function PDFToolbar({ onClose }: PDFToolbarProps) {
  const {
    docInfo, numPages,
    currentPage, goToPage,
    zoom, setZoom, zoomMode, setZoomMode,
    rotation, setRotation,
    sidebarOpen, setSidebarOpen,
    searchQuery, setSearchQuery,
    isFullscreen, toggleFullscreen,
    theme, setTheme,
    isBookmarked, addBookmark, removeBookmark, bookmarks,
    infoPanelOpen, setInfoPanelOpen,
  } = usePDF();

  const [pageInput, setPageInput] = useState(String(currentPage));
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const zoomMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPageInput(String(currentPage)); }, [currentPage]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close zoom menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(e.target as Node)) {
        setZoomMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p)) goToPage(p);
  };

  const handleZoomChange = (value: 'fitWidth' | 'fitPage' | number) => {
    if (value === 'fitWidth') {
      setZoomMode('fitWidth');
    } else if (value === 'fitPage') {
      setZoomMode('fitPage');
    } else {
      setZoom(value);
    }
    setZoomMenuOpen(false);
  };

  const displayZoom = zoomMode === 'fitWidth'
    ? 'Fit W'
    : zoomMode === 'fitPage'
      ? 'Fit P'
      : `${Math.round(zoom * 100)}%`;

  const handleDownload = async () => {
    if (!docInfo) return;
    await downloadPDF(docInfo.fileUrl, docInfo.title);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleBookmark = () => {
    if (!docInfo) return;
    if (isBookmarked(currentPage)) {
      const bm = bookmarks.find(b => b.page === currentPage);
      if (bm) removeBookmark(bm.id);
    } else {
      addBookmark(currentPage);
    }
  };

  const cycleTheme = () => {
    const order: Array<'light' | 'dark' | 'sepia'> = ['light', 'sepia', 'dark'];
    const i = order.indexOf(theme);
    setTheme(order[(i + 1) % order.length]);
  };

  const themeIcon = theme === 'dark' ? <Moon size={15} /> : theme === 'sepia' ? <Coffee size={15} /> : <Sun size={15} />;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') { e.preventDefault(); setZoom(zoom + 0.1); }
        if (e.key === '-') { e.preventDefault(); setZoom(zoom - 0.1); }
        if (e.key === '0') { e.preventDefault(); setZoomMode('fitWidth'); }
        if (e.key === 'f') { e.preventDefault(); setSearchOpen(s => !s); }
        if (e.key === 'p') { e.preventDefault(); handlePrint(); }
      } else {
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') goToPage(currentPage - 1);
        if (e.key === 'ArrowRight' || e.key === 'PageDown') goToPage(currentPage + 1);
        if (e.key === 'Home') goToPage(1);
        if (e.key === 'End') goToPage(numPages);
        if (e.key === 'Escape') { if (searchOpen) setSearchOpen(false); else if (isFullscreen) toggleFullscreen(); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [zoom, currentPage, numPages, searchOpen, isFullscreen, goToPage, setZoom, setZoomMode, toggleFullscreen]);

  const ICON_BTN = 'flex h-8 w-8 items-center justify-center rounded-lg text-[#22201F]/80 transition-colors hover:bg-[#F7F3EC] hover:text-[#4A0E1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A0E1B]/20';
  const DIVIDER = 'h-5 w-px bg-[#D9C2A2]/30 mx-0.5';

  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-1 border-b border-[#D9C2A2]/30 bg-white px-2 py-1.5 shadow-soft-sm print:hidden"
      role="toolbar"
      aria-label="PDF viewer toolbar"
    >
      <div className="flex-1 flex items-center overflow-hidden">
        <BreadcrumbBar
          className="m-0"
          backLabel="Back"
          onBack={onClose}
          items={[
            { id: 'lib', label: 'Library', onClick: onClose },
            { id: 'doc', label: docInfo?.title ?? 'Document' }
          ]}
        />
      </div>

      <div className={DIVIDER} />

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`${ICON_BTN} ${sidebarOpen ? 'bg-[#4A0E1B]/8 text-[#4A0E1B]' : ''}`}
        aria-label="Toggle thumbnail sidebar"
        title="Toggle Sidebar"
      >
        <PanelLeft size={15} />
      </button>

      <div className={DIVIDER} />

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`${ICON_BTN} disabled:opacity-30`}
          aria-label="Previous page"
          title="Previous Page (←)"
        >
          <ChevronLeft size={15} />
        </button>

        <form onSubmit={handlePageSubmit} className="flex items-center gap-1">
          <input
            type="text"
            value={pageInput}
            onChange={e => setPageInput(e.target.value)}
            onBlur={handlePageSubmit}
            className="w-10 rounded-lg border border-[#D9C2A2]/40 bg-[#F7F3EC]/50 px-1.5 py-1 text-center text-xs font-semibold text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-2 focus:ring-[#C9A13B]/20"
            aria-label="Current page number"
          />
        </form>
        <span className="dash-mono text-[10px] text-[#22201F]/60">/ {numPages || '—'}</span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={numPages > 0 && currentPage >= numPages}
          className={`${ICON_BTN} disabled:opacity-30`}
          aria-label="Next page"
          title="Next Page (→)"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className={DIVIDER} />

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setZoom(zoom - 0.1)}
          className={ICON_BTN}
          aria-label="Zoom out"
          title="Zoom Out (Ctrl -)"
        >
          <ZoomOut size={15} />
        </button>

        <div className="relative" ref={zoomMenuRef}>
          <button
            onClick={() => setZoomMenuOpen(!zoomMenuOpen)}
            className="flex h-8 items-center gap-1 rounded-lg border border-[#D9C2A2]/40 bg-[#F7F3EC]/50 px-2 text-[10px] font-bold text-[#22201F] transition-colors hover:bg-[#F7F3EC] hover:border-[#4A0E1B]/30"
            aria-label="Zoom level"
          >
            {displayZoom}
          </button>
          {zoomMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-2xl border border-[#D9C2A2]/30 bg-white p-1 shadow-soft-lg">
              {ZOOM_PRESETS.map(z => (
                <button
                  key={z}
                  onClick={() => handleZoomChange(z)}
                  className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#F7F3EC] ${Math.abs(zoom - z) < 0.01 && zoomMode === 'custom' ? 'bg-[#4A0E1B]/8 text-[#4A0E1B]' : 'text-[#22201F]/80'}`}
                >
                  {Math.round(z * 100)}%
                </button>
              ))}
              <div className="my-1 border-t border-[#D9C2A2]/20" />
              <button
                onClick={() => handleZoomChange('fitWidth')}
                className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#F7F3EC] ${zoomMode === 'fitWidth' ? 'bg-[#4A0E1B]/8 text-[#4A0E1B]' : 'text-[#22201F]/80'}`}
              >
                Fit Width
              </button>
              <button
                onClick={() => handleZoomChange('fitPage')}
                className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#F7F3EC] ${zoomMode === 'fitPage' ? 'bg-[#4A0E1B]/8 text-[#4A0E1B]' : 'text-[#22201F]/80'}`}
              >
                Fit Page
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setZoom(zoom + 0.1)}
          className={ICON_BTN}
          aria-label="Zoom in"
          title="Zoom In (Ctrl +)"
        >
          <ZoomIn size={15} />
        </button>
      </div>

      <div className={DIVIDER} />

      {/* Rotate */}
      <button
        onClick={() => setRotation((rotation - 90 + 360) % 360)}
        className={ICON_BTN}
        aria-label="Rotate left"
        title="Rotate Left"
      >
        <RotateCcw size={15} />
      </button>
      <button
        onClick={() => setRotation((rotation + 90) % 360)}
        className={ICON_BTN}
        aria-label="Rotate right"
        title="Rotate Right"
      >
        <RotateCw size={15} />
      </button>

      <div className={DIVIDER} />

      {/* Search */}
      <button
        onClick={() => setSearchOpen(s => !s)}
        className={`${ICON_BTN} ${searchOpen ? 'bg-[#4A0E1B]/8 text-[#4A0E1B]' : ''}`}
        aria-label="Search in document"
        title="Search (Ctrl F)"
      >
        <Search size={15} />
      </button>

      {/* Bookmark current page */}
      <button
        onClick={toggleBookmark}
        className={`${ICON_BTN} ${isBookmarked(currentPage) ? 'text-[#4A0E1B]' : ''}`}
        aria-label={isBookmarked(currentPage) ? 'Remove bookmark' : 'Add bookmark'}
        title="Bookmark Page"
      >
        {isBookmarked(currentPage) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      </button>

      {/* Info panel */}
      <button
        onClick={() => setInfoPanelOpen(!infoPanelOpen)}
        className={`${ICON_BTN} ${infoPanelOpen ? 'bg-[#4A0E1B]/8 text-[#4A0E1B]' : ''}`}
        aria-label="Document information"
        title="Document Info"
      >
        <Info size={15} />
      </button>

      <div className={DIVIDER} />

      {/* Download */}
      <button
        onClick={handleDownload}
        className={ICON_BTN}
        aria-label="Download PDF"
        title="Download"
      >
        <Download size={15} />
      </button>

      {/* Print */}
      <button
        onClick={handlePrint}
        className={ICON_BTN}
        aria-label="Print document"
        title="Print (Ctrl P)"
      >
        <Printer size={15} />
      </button>

      {/* Theme toggle */}
      <button
        onClick={cycleTheme}
        className={ICON_BTN}
        aria-label={`Current theme: ${theme}. Click to cycle.`}
        title={`Theme: ${theme}`}
      >
        {themeIcon}
      </button>

      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className={ICON_BTN}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
      >
        {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
      </button>

      {/* Close */}
      <div className={DIVIDER} />
      <button
        onClick={onClose}
        className={`${ICON_BTN} hover:bg-[#4A0E1B]/8 hover:text-[#4A0E1B]`}
        aria-label="Close viewer"
        title="Close"
      >
        <X size={15} />
      </button>

      {/* Inline Search Bar */}
      {searchOpen && (
        <div className="absolute left-1/2 top-full z-40 -translate-x-1/2 mt-1">
          <SearchPanel onClose={() => setSearchOpen(false)} />
        </div>
      )}
    </div>
  );
}

// ─── Inline Search Panel ──────────────────────────────────────────────────────

interface SearchPanelProps {
  onClose: () => void;
}

export function SearchPanel({ onClose }: SearchPanelProps) {
  const { searchQuery, setSearchQuery, searchCaseSensitive, setSearchCaseSensitive } = usePDF();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#D9C2A2]/30 bg-white p-2 shadow-soft-lg">
      <Search size={14} className="shrink-0 text-[#22201F]/40" />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search in document…"
        className="w-52 bg-transparent text-sm text-[#22201F] placeholder:text-[#22201F]/30 outline-none"
        aria-label="Search query"
      />
      <label className="flex cursor-pointer items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#22201F]/60">
        <input
          type="checkbox"
          checked={searchCaseSensitive}
          onChange={e => setSearchCaseSensitive(e.target.checked)}
          className="h-3 w-3 accent-[#4A0E1B]"
        />
        Aa
      </label>
      <button
        onClick={onClose}
        className="flex h-6 w-6 items-center justify-center rounded-lg text-[#22201F]/60 transition-colors hover:bg-[#F7F3EC] hover:text-[#4A0E1B]"
        aria-label="Close search"
      >
        <X size={12} />
      </button>
    </div>
  );
}
