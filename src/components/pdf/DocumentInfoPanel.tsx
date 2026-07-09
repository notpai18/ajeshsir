/**
 * DocumentInfoPanel — right-side information panel.
 * Shows file metadata, professor actions, and student bookmarks.
 */
import React, { useState } from 'react';
import {
  FileText, Download, Trash2, UploadCloud, Calendar, HardDrive,
  Eye, Bookmark, BookmarkCheck, X, AlertTriangle
} from 'lucide-react';
import { usePDF } from './PDFContext';
import { downloadPDF } from '../../lib/pdfUrl';

const CARD = 'rounded-2xl border border-[#EAE1D2] bg-white shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]';
const GHOST_BTN = 'inline-flex items-center justify-center gap-2 rounded-xl border border-[#E3D8C5] bg-white px-3 py-2 text-xs font-semibold text-[#4A443E] transition-colors hover:bg-[#F6F2EA]';
const PRIMARY_BTN = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A0E1B] px-3 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#380A14]';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F]';

export function DocumentInfoPanel() {
  const {
    docInfo, infoPanelOpen, setInfoPanelOpen,
    bookmarks, removeBookmark, goToPage,
    currentPage, numPages,
  } = usePDF();

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!infoPanelOpen || !docInfo) return null;

  const handleDownload = () => downloadPDF(docInfo.fileUrl, docInfo.title);

  const handleDelete = () => {
    docInfo.onDelete?.();
    setConfirmDelete(false);
    setInfoPanelOpen(false);
  };

  return (
    <aside
      className="hidden w-[240px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-[#EAE1D2] bg-[#FBF7F0] p-4 lg:flex"
      aria-label="Document information"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className={MICRO}>Document Info</p>
        <button
          onClick={() => setInfoPanelOpen(false)}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-[#8A7E6F] transition-colors hover:bg-[#F6F2EA] hover:text-[#22201F]"
          aria-label="Close info panel"
        >
          <X size={13} />
        </button>
      </div>

      {/* File info card */}
      <div className={`${CARD} p-4`}>
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4E7E5] text-[#4A0E1B]">
            <FileText size={17} />
          </span>
          <div className="min-w-0">
            <h4 className="dash-serif text-sm font-semibold text-[#22201F] leading-snug">
              {docInfo.title}
            </h4>
            {docInfo.entityType && (
              <span className="mt-1 inline-flex items-center rounded-full bg-[#F4E7E5] px-2 py-0.5 text-[10px] font-bold text-[#4A0E1B]">
                {docInfo.entityType === 'note' ? 'Study Note' : docInfo.entityType === 'pyq' ? 'PYQ' : 'Practice Sheet'}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {docInfo.fileSize && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-[#8A7E6F]">
                <HardDrive size={12} className="text-[#AC9F8C]" /> Size
              </span>
              <span className="dash-mono text-[11px] text-[#6E645A]">{docInfo.fileSize}</span>
            </div>
          )}
          {docInfo.uploadDate && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-[#8A7E6F]">
                <Calendar size={12} className="text-[#AC9F8C]" /> Uploaded
              </span>
              <span className="dash-mono text-[11px] text-[#6E645A]">
                {new Date(docInfo.uploadDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {docInfo.downloadCount !== undefined && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-[#8A7E6F]">
                <Eye size={12} className="text-[#AC9F8C]" /> Downloads
              </span>
              <span className="dash-mono text-[11px] tabular-nums text-[#6E645A]">{docInfo.downloadCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Reading progress */}
      <div className={`${CARD} p-4`}>
        <p className={`${MICRO} mb-3`}>Reading Progress</p>
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-xs text-[#5A534B]">Page {currentPage} of {numPages || '…'}</span>
          <span className="dash-mono text-[10px] tabular-nums text-[#8A7E6F]">
            {numPages ? Math.round((currentPage / numPages) * 100) : 0}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#F0E9DB]">
          <div
            className="h-full rounded-full bg-[#4A0E1B] transition-all duration-300"
            style={{ width: numPages ? `${(currentPage / numPages) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div className={`${CARD} p-4`}>
          <p className={`${MICRO} mb-3`}>Bookmarks</p>
          <div className="space-y-1">
            {bookmarks.sort((a, b) => a.page - b.page).map(bm => (
              <div
                key={bm.id}
                className="group flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 transition-colors hover:bg-[#F6F2EA]"
              >
                <button
                  onClick={() => goToPage(bm.page)}
                  className="flex flex-1 items-center gap-2 text-left"
                  aria-label={`Go to ${bm.label}`}
                >
                  <Bookmark size={12} className="shrink-0 text-[#4A0E1B]" />
                  <span className="text-xs font-semibold text-[#3A342E] truncate">{bm.label}</span>
                </button>
                <button
                  onClick={() => removeBookmark(bm.id)}
                  className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg text-[#A79A88] opacity-0 transition-all hover:bg-[#F6E5E1] hover:text-[#B23B2E] group-hover:opacity-100"
                  aria-label={`Remove bookmark: ${bm.label}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <button onClick={handleDownload} className={`${GHOST_BTN} w-full`}>
          <Download size={14} /> Download PDF
        </button>

        {/* Professor-only actions */}
        {docInfo.isProfessor && (
          <>
            {docInfo.onReplace && (
              <button onClick={docInfo.onReplace} className={`${GHOST_BTN} w-full`}>
                <UploadCloud size={14} /> Replace PDF
              </button>
            )}

            {docInfo.onDelete && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E6C9C4] bg-[#FBF0EE] px-3 py-2 text-xs font-semibold text-[#B23B2E] transition-colors hover:bg-[#F6E5E1]"
              >
                <Trash2 size={14} /> Delete PDF
              </button>
            )}

            {confirmDelete && (
              <div className="rounded-2xl border border-[#EAE1D2] bg-white p-4">
                <div className="flex items-start gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FBF0EE] text-[#B23B2E]">
                    <AlertTriangle size={15} />
                  </span>
                  <p className="text-xs leading-relaxed text-[#5A534B]">
                    Delete this PDF? This cannot be undone.
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setConfirmDelete(false)} className={`${GHOST_BTN} flex-1`}>
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-[#B23B2E] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#98311F]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
