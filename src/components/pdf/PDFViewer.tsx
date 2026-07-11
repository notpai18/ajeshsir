/**
 * PDFViewer — full-screen modal PDF reader.
 * Assembles: PDFToolbar + ThumbnailSidebar + PDFViewerCore + DocumentInfoPanel
 *
 * Usage:
 *   <PDFViewer
 *     docInfo={{ title, fileUrl, fileSize, isProfessor, ... }}
 *     onClose={() => setPdfDoc(null)}
 *   />
 *
 * Design: Professor's Study design system (design.md)
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PDFProvider, PDFDocumentInfo, usePDF } from './PDFContext';
import { PDFToolbar } from './PDFToolbar';
import { ThumbnailSidebar } from './ThumbnailSidebar';
import { PDFViewerCore } from './PDFViewerCore';
import { DocumentInfoPanel } from './DocumentInfoPanel';
import { getPDFUrl } from '../../lib/pdfUrl';

// ─── Public API ───────────────────────────────────────────────────────────────

interface PDFViewerProps {
  docInfo: PDFDocumentInfo;
  onClose: () => void;
}

export function PDFViewer({ docInfo, onClose }: PDFViewerProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Resolve the URL once on mount
  useEffect(() => {
    let cancelled = false;
    setResolvedUrl(null);
    setUrlError(null);

    getPDFUrl(docInfo.fileUrl)
      .then(url => { if (!cancelled) setResolvedUrl(url); })
      .catch(err => { if (!cancelled) setUrlError(err.message || 'Could not resolve PDF URL'); });

    return () => { cancelled = true; };
  }, [docInfo.fileUrl]);

  // Trap focus & prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Escape key closes the viewer (when not fullscreen)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (urlError) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A13B]/10 text-[#4A0E1B] dark:text-[#F4E7E5] border border-[#22201F]/20">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h4 className="dash-serif text-base font-bold text-[#22201F] dark:text-[#F6F2EA]">Cannot load document</h4>
          <p className="max-w-xs text-sm text-[#22201F] dark:text-[#F6F2EA]/60">{urlError}</p>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-btn bg-[#4A0E1B] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-all hover:bg-[#7C2532] shadow-soft-sm hover:-translate-y-0.5"
          >
            Go Back
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <PDFProvider docInfo={docInfo}>
      <ModalShell onClose={onClose}>
        <ViewerLayout resolvedUrl={resolvedUrl} onClose={onClose} />
      </ModalShell>
    </PDFProvider>
  );
}

// ─── Modal shell (overlay) ────────────────────────────────────────────────────

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#22201F]/80 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="PDF Viewer"
    >
      {/* Backdrop click to close */}
      <button
        className="absolute inset-0 z-0 cursor-default"
        aria-hidden="true"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-none bg-white dark:bg-[#22201F] sm:m-4 sm:rounded-card border border-[#22201F]/20 shadow-soft-xl">
        {children}
      </div>
    </div>
  );
}

// ─── Inner layout (consumes context) ─────────────────────────────────────────

function ViewerLayout({ resolvedUrl, onClose }: { resolvedUrl: string | null; onClose: () => void }) {
  const { sidebarOpen, infoPanelOpen } = usePDF();
  const viewerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  // Measure available width for the PDF canvas
  useEffect(() => {
    if (!viewerRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(viewerRef.current);
    setContainerWidth(viewerRef.current.clientWidth);
    return () => ro.disconnect();
  }, [sidebarOpen, infoPanelOpen]);

  // Show loading while URL resolves
  if (!resolvedUrl) {
    return (
      <>
        <PDFToolbar onClose={onClose} />
        <div className="flex flex-1 items-center justify-center gap-3 bg-[#F7F3EC] dark:bg-[#1A1817]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#4A0E1B] border-t-transparent" />
          <p className="dash-root text-sm text-[#22201F] dark:text-[#F6F2EA]/60">Resolving document…</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Sticky Toolbar */}
      <PDFToolbar onClose={onClose} />

      {/* Three-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnail Sidebar */}
        {sidebarOpen && <ThumbnailSidebar pdfUrl={resolvedUrl} />}

        {/* PDF Canvas */}
        <div ref={viewerRef} className="flex flex-1 flex-col overflow-hidden">
          <PDFViewerCore pdfUrl={resolvedUrl} containerWidth={containerWidth} />
        </div>

        {/* Info Panel */}
        {infoPanelOpen && <DocumentInfoPanel />}
      </div>
    </>
  );
}
