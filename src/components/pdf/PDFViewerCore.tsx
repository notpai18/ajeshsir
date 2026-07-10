/**
 * PDFViewerCore — the main scrollable PDF canvas area.
 * Renders all pages with virtual scrolling, text layer, and annotation layer.
 * Observes intersection to track the current page in view.
 */
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { usePDF } from './PDFContext';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// Use the worker matching react-pdf's exact pdfjs-dist version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerCoreProps {
  pdfUrl: string;
  containerWidth: number;
}

const PAGE_GAP = 16; // px between pages

export function PDFViewerCore({ pdfUrl, containerWidth }: PDFViewerCoreProps) {
  const {
    numPages, setNumPages,
    currentPage, setCurrentPage,
    zoom, zoomMode, setZoom, setZoomMode,
    rotation,
    scrollContainerRef,
    jumpTarget, setJumpTarget,
    searchQuery, searchCaseSensitive,
    theme,
  } = usePDF();

  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visiblePagesRef = useRef<Set<number>>(new Set());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [docLoading, setDocLoading] = useState(true);

  // Compute effective page width from zoom mode and container width
  const effectiveWidth = useCallback(() => {
    const usable = Math.max(containerWidth - 48, 300); // subtract padding
    if (zoomMode === 'fitWidth') return usable;
    if (zoomMode === 'fitPage') return Math.min(usable, 794); // A4 width in px at 96dpi
    return Math.round(794 * zoom); // 794px = A4 at 100%
  }, [containerWidth, zoom, zoomMode]);

  // Jump to page when thumbnail clicked
  useEffect(() => {
    if (jumpTarget === null) return;
    const el = pageRefs.current.get(jumpTarget);
    if (el && scrollContainerRef.current) {
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      scrollContainerRef.current.scrollTop += elRect.top - containerRect.top - 16;
    }
    setJumpTarget(null);
  }, [jumpTarget, setJumpTarget, scrollContainerRef]);

  // Intersection observer to track current page
  useEffect(() => {
    observerRef.current?.disconnect();
    const root = scrollContainerRef.current;
    if (!root) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const page = Number((entry.target as HTMLElement).dataset.page);
          if (entry.isIntersecting) {
            visiblePagesRef.current.add(page);
          } else {
            visiblePagesRef.current.delete(page);
          }
        }
        const visible = Array.from(visiblePagesRef.current).sort((a: number, b: number) => a - b);
        if (visible.length > 0) setCurrentPage(visible[0]);
      },
      { root, threshold: 0.3 }
    );

    pageRefs.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [numPages, scrollContainerRef, setCurrentPage]);

  // Re-observe pages after render
  const registerPageRef = useCallback((el: HTMLDivElement | null, pageNum: number) => {
    if (el) {
      pageRefs.current.set(pageNum, el);
      observerRef.current?.observe(el);
    } else {
      pageRefs.current.delete(pageNum);
    }
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
    setDocLoading(false);
    setLoadError(null);
  }, [setNumPages]);

  const onDocumentLoadError = useCallback((err: Error) => {
    setDocLoading(false);
    setLoadError(err.message || 'Failed to load PDF');
  }, []);

  // Theme backgrounds
  const viewerBg = theme === 'dark' ? 'bg-[#1a1a1a]' : theme === 'sepia' ? 'bg-[#f4ecd8]' : 'bg-[#F7F3EC] dark:bg-[#1A1817]';
  const pageShadow = theme === 'dark'
    ? 'shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
    : 'shadow-soft-md border border-[#D9C2A2]/30';

  const pageWidth = effectiveWidth();

  // Custom text renderer for search highlighting
  const textRendererCallback = useCallback((textItem: { str: string }) => {
    if (!searchQuery) return textItem.str;
    const flags = searchCaseSensitive ? 'g' : 'gi';
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      const regex = new RegExp(escaped, flags);
      return textItem.str.replace(regex, (match) => `<mark style="background:rgba(201,161,59,.25);color:inherit">${match}</mark>`);
    } catch {
      return textItem.str;
    }
  }, [searchQuery, searchCaseSensitive]);

  if (loadError) {
    return <ErrorState error={loadError} onRetry={() => { setLoadError(null); setDocLoading(true); }} />;
  }

  return (
    <div className={`flex-1 overflow-y-auto overflow-x-auto ${viewerBg} transition-colors duration-300 print:overflow-visible`} ref={scrollContainerRef as React.RefObject<HTMLDivElement>}>
      <div className="mx-auto py-6" style={{ width: pageWidth + 48 }}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<LoadingSkeleton />}
          error={<ErrorState error="Could not load the PDF" onRetry={() => setDocLoading(true)} />}
          className="flex flex-col items-center gap-0"
        >
          {docLoading ? (
            <LoadingSkeleton />
          ) : (
            Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <div
                key={pageNum}
                ref={(el) => registerPageRef(el, pageNum)}
                data-page={pageNum}
                style={{ marginBottom: PAGE_GAP }}
                className="relative"
                aria-label={`Page ${pageNum} of ${numPages}`}
              >
                <Page
                  pageNumber={pageNum}
                  width={pageWidth}
                  rotate={rotation}
                  renderTextLayer
                  renderAnnotationLayer
                  customTextRenderer={textRendererCallback}
                  className={`${pageShadow} rounded-sm transition-shadow duration-200`}
                  loading={
                    <div
                      className="animate-pulse rounded-sm bg-white dark:bg-[#22201F]"
                      style={{ width: pageWidth, height: Math.round(pageWidth * 1.414) }}
                    />
                  }
                  error={
                    <div className="flex items-center justify-center rounded-sm bg-white dark:bg-[#22201F] p-8 text-sm text-[#22201F] dark:text-[#F6F2EA]/60">
                      Page {pageNum} failed to render
                    </div>
                  }
                />
              </div>
            ))
          )}
        </Document>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-8" aria-live="polite" aria-busy="true">
      {[1.414, 1.414, 1.0].map((ratio, i) => (
        <div
          key={i}
          className="w-full max-w-[600px] animate-pulse rounded-sm bg-white dark:bg-[#22201F]"
          style={{ height: Math.round(600 * ratio) }}
        >
          <div className="h-full w-full rounded-sm bg-gradient-to-b from-[#D9C2A2]/20 to-[#F7F3EC]/10" />
        </div>
      ))}
      <p className="dash-root text-xs text-[#22201F] dark:text-[#F6F2EA]/60 animate-pulse">Loading document…</p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A13B]/10 text-[#4A0E1B] dark:text-[#F4E7E5] border border-[#D9C2A2]/30">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <h4 className="dash-serif text-base font-bold text-[#22201F] dark:text-[#F6F2EA]">Could not load document</h4>
      <p className="max-w-xs text-sm text-[#22201F] dark:text-[#F6F2EA]/60">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-btn bg-[#4A0E1B] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-all hover:bg-[#7C2532] shadow-soft-sm hover:-translate-y-0.5 duration-200 transition-all border border-[#4A0E1B]"
      >
        Try Again
      </button>
    </div>
  );
}
