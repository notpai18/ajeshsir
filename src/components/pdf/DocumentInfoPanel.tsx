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
import { PremiumCard } from '../PremiumCard';

const GHOST_BTN = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#D9C2A2]/40 bg-white dark:bg-[#22201F] px-3 py-2 text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA] transition-all hover:bg-[#F7F3EC] dark:bg-[#1A1817] duration-200 hover:-translate-y-0.5 shadow-sm';
const PRIMARY_BTN = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E1B] px-3 py-2 text-xs font-bold tracking-wide text-white transition-all hover:bg-[#7C2532] shadow-sm hover:-translate-y-0.5 duration-200';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#22201F] dark:text-[#F6F2EA]/60';

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
      className="hidden w-[240px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-[#D9C2A2]/30 bg-[#F7F3EC] dark:bg-[#1A1817] p-4 lg:flex"
      aria-label="Document information"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className={MICRO}>Document Info</p>
        <button
          onClick={() => setInfoPanelOpen(false)}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-[#22201F] dark:text-[#F6F2EA]/60 transition-colors hover:bg-[#D9C2A2]/20 hover:text-[#22201F] dark:text-[#F6F2EA]"
          aria-label="Close info panel"
        >
          <X size={13} />
        </button>
      </div>

      {/* File info card */}
      <PremiumCard padding="medium" accentLine>
        <div className="flex items-start gap-3">
          <PremiumCard.Icon className="h-9 w-9 bg-[#4A0E1B]/8 text-[#4A0E1B] dark:text-[#F4E7E5] border-0">
            <FileText size={17} />
          </PremiumCard.Icon>
          <div className="min-w-0">
            <PremiumCard.Title as="h4" className="text-sm">
              {docInfo.title}
            </PremiumCard.Title>
            {docInfo.entityType && (
              <span className="mt-1 inline-flex items-center rounded-full bg-[#C9A13B]/10 px-2 py-0.5 text-[10px] font-bold text-[#4A0E1B] dark:text-[#F4E7E5]">
                {docInfo.entityType === 'note' ? 'Study Note' : docInfo.entityType === 'pyq' ? 'PYQ' : 'Practice Sheet'}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {docInfo.fileSize && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-[#22201F] dark:text-[#F6F2EA]/60">
                <HardDrive size={12} className="text-[#4A0E1B] dark:text-[#F4E7E5]" /> Size
              </span>
              <span className="dash-mono text-[11px] text-[#22201F] dark:text-[#F6F2EA]">{docInfo.fileSize}</span>
            </div>
          )}
          {docInfo.uploadDate && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-[#22201F] dark:text-[#F6F2EA]/60">
                <Calendar size={12} className="text-[#4A0E1B] dark:text-[#F4E7E5]" /> Uploaded
              </span>
              <span className="dash-mono text-[11px] text-[#22201F] dark:text-[#F6F2EA]">
                {new Date(docInfo.uploadDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {docInfo.downloadCount !== undefined && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-[#22201F] dark:text-[#F6F2EA]/60">
                <Eye size={12} className="text-[#4A0E1B] dark:text-[#F4E7E5]" /> Downloads
              </span>
              <span className="dash-mono text-[11px] tabular-nums text-[#22201F] dark:text-[#F6F2EA]">{docInfo.downloadCount}</span>
            </div>
          )}
        </div>
      </PremiumCard>

      {/* Reading progress */}
      <PremiumCard padding="medium" accentLine>
        <PremiumCard.Category className="mb-3">Reading Progress</PremiumCard.Category>
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-xs text-[#22201F] dark:text-[#F6F2EA]">Page {currentPage} of {numPages || '…'}</span>
          <span className="dash-mono text-[10px] tabular-nums text-[#22201F] dark:text-[#F6F2EA]/60">
            {numPages ? Math.round((currentPage / numPages) * 100) : 0}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#D9C2A2]/20">
          <div
            className="h-full rounded-full bg-[#4A0E1B] transition-all duration-300"
            style={{ width: numPages ? `${(currentPage / numPages) * 100}%` : '0%' }}
          />
        </div>
      </PremiumCard>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <PremiumCard padding="medium" accentLine>
          <PremiumCard.Category className="mb-3">Bookmarks</PremiumCard.Category>
          <div className="space-y-1">
            {bookmarks.sort((a, b) => a.page - b.page).map(bm => (
              <div
                key={bm.id}
                className="group flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 transition-colors hover:bg-[#F7F3EC] dark:bg-[#1A1817]"
              >
                <button
                  onClick={() => goToPage(bm.page)}
                  className="flex flex-1 items-center gap-2 text-left"
                  aria-label={`Go to ${bm.label}`}
                >
                  <Bookmark size={12} className="shrink-0 text-[#4A0E1B] dark:text-[#F4E7E5]" />
                  <span className="text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA] truncate">{bm.label}</span>
                </button>
                <button
                  onClick={() => removeBookmark(bm.id)}
                  className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg text-[#22201F] dark:text-[#F6F2EA]/60 opacity-0 transition-all hover:bg-[#4A0E1B]/8 hover:text-[#4A0E1B] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5] group-hover:opacity-100"
                  aria-label={`Remove bookmark: ${bm.label}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </PremiumCard>
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-btn border border-[#4A0E1B]/20 bg-[#4A0E1B]/5 px-3 py-2 text-xs font-semibold text-[#4A0E1B] dark:text-[#F4E7E5] transition-colors hover:bg-[#4A0E1B]/10"
              >
                <Trash2 size={14} /> Delete PDF
              </button>
            )}

            {confirmDelete && (
              <PremiumCard padding="medium">
                <div className="flex items-start gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#4A0E1B]/8 text-[#4A0E1B] dark:text-[#F4E7E5]">
                    <AlertTriangle size={15} />
                  </span>
                  <p className="text-xs leading-relaxed text-[#22201F] dark:text-[#F6F2EA]">
                    Delete this PDF? This cannot be undone.
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setConfirmDelete(false)} className={`${GHOST_BTN} flex-1`}>
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-[#4A0E1B] hover:bg-[#7C2532] px-3 py-2 text-xs font-bold text-white transition-all shadow-sm hover:-translate-y-0.5 duration-200 border border-[#4A0E1B]"
                  >
                    Delete
                  </button>
                </div>
              </PremiumCard>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
