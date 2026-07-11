/**
 * ThumbnailSidebar — collapsible sidebar with virtualized page thumbnails.
 * Clicking a thumbnail jumps the main view to that page.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { usePDF } from './PDFContext';

// ─── Virtualization constants ─────────────────────────────────────────────────
const THUMB_HEIGHT = 148; // px including gap
const OVERSCAN = 3;

interface ThumbnailSidebarProps {
  pdfUrl: string;
}

export function ThumbnailSidebar({ pdfUrl }: ThumbnailSidebarProps) {
  const { numPages, currentPage, goToPage, sidebarOpen, isBookmarked, addBookmark, removeBookmark, bookmarks } = usePDF();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [docLoaded, setDocLoaded] = useState(false);

  // Scroll active thumbnail into view
  useEffect(() => {
    const el = containerRef.current?.querySelector(`[data-page="${currentPage}"]`);
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentPage]);

  // Virtualize: compute which pages are visible
  const updateVisible = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const start = Math.max(0, Math.floor(scrollTop / THUMB_HEIGHT) - OVERSCAN);
    const end = Math.min(numPages - 1, Math.ceil((scrollTop + clientHeight) / THUMB_HEIGHT) + OVERSCAN);
    setVisibleRange({ start, end });
  }, [numPages]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateVisible, { passive: true });
    updateVisible();
    return () => el.removeEventListener('scroll', updateVisible);
  }, [updateVisible, docLoaded]);

  if (!sidebarOpen) return null;

  const toggleBookmark = (e: React.MouseEvent, page: number) => {
    e.stopPropagation();
    if (isBookmarked(page)) {
      const bm = bookmarks.find(b => b.page === page);
      if (bm) removeBookmark(bm.id);
    } else {
      addBookmark(page);
    }
  };

  return (
    <aside
      className="relative flex h-full w-[168px] shrink-0 flex-col border-r border-[#D9C2A2]/30 bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817]"
      aria-label="Page thumbnails"
    >
      <div className="border-b border-[#D9C2A2]/30 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#22201F] dark:text-[#F6F2EA]/60">
          Pages · {numPages}
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden py-2"
        role="list"
        aria-label="PDF page thumbnails"
      >
        {/* Load document once (silent) just for thumbnail generation */}
        <Document
          file={pdfUrl}
          onLoadSuccess={() => setDocLoaded(true)}
          loading={null}
          error={null}
          className="sr-only"
        />

        {numPages > 0 && Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => {
          const isActive = pageNum === currentPage;
          const isVisible = pageNum - 1 >= visibleRange.start && pageNum - 1 <= visibleRange.end;
          const bookmarked = isBookmarked(pageNum);

          return (
            <div
              key={pageNum}
              data-page={pageNum}
              role="listitem"
              style={{ height: THUMB_HEIGHT - 8 }}
              className={`group relative mx-2 mb-2 cursor-pointer overflow-hidden rounded-xl border transition-all duration-150 ${
                isActive
                  ? 'border-[#4A0E1B] ring-2 ring-[#4A0E1B]/15 shadow-soft-md'
                  : 'border-[#D9C2A2]/40 hover:border-[#4A0E1B]/40 hover:shadow-soft-md'
              }`}
              onClick={() => goToPage(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {isVisible && docLoaded ? (
                <Document file={pdfUrl} loading={null} error={null}>
                  <Page
                    pageNumber={pageNum}
                    width={136}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div className="h-full w-full animate-pulse bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817]" />
                    }
                    className="pointer-events-none"
                  />
                </Document>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817]">
                  <span className="dash-mono text-xs text-[#22201F] dark:text-[#F6F2EA]/40">{pageNum}</span>
                </div>
              )}

              {/* Bookmark indicator */}
              <button
                onClick={(e) => toggleBookmark(e, pageNum)}
                className={`absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-md transition-all ${
                  bookmarked
                    ? 'bg-[#4A0E1B] text-white opacity-100'
                    : 'bg-white dark:bg-[#22201F]/80 text-[#22201F] dark:text-[#F6F2EA]/60 opacity-0 group-hover:opacity-100'
                }`}
                aria-label={bookmarked ? `Remove bookmark from page ${pageNum}` : `Bookmark page ${pageNum}`}
              >
                {bookmarked ? <BookmarkCheck size={10} /> : <Bookmark size={10} />}
              </button>

              {/* Page number label */}
              <div className={`absolute inset-x-0 bottom-0 py-0.5 text-center ${isActive ? 'bg-[#4A0E1B]' : 'bg-[#22201F]/50'}`}>
                <span className="dash-mono text-[9px] font-bold text-white tabular-nums">{pageNum}</span>
              </div>
            </div>
          );
        })}

        {numPages === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-[#D9C2A2]/20" />
            <p className="text-[10px] text-[#22201F] dark:text-[#F6F2EA]/40">Loading…</p>
          </div>
        )}
      </div>
    </aside>
  );
}
