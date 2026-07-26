/**
 * ModerationQueue — Professor moderation panel for pending doubt approvals.
 *
 * Features:
 * - Three tabs: Pending / Approved / Rejected (with live counts)
 * - Each pending card: student name, subject, chapter/topic, question, attachments, time
 * - Approve + Reject actions on pending cards
 * - Inline rejection reason input (optional)
 * - Search across all tabs
 * - Follows the premium "Professor's Study" design system
 *
 * @license Apache-2.0
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  CheckCircle2, XCircle, Search, Clock, User, MessageSquare,
  ChevronDown, ChevronUp, AlertCircle, Inbox, Filter
} from 'lucide-react';
import { PremiumCard } from '../PremiumCard';
import { DoubtStatusBadge } from '../doubts/DoubtStatusBadge';
import { AttachmentViewer } from '../ui/AttachmentViewer';
import type { Doubt } from '../../types';
import { INPUT } from '../ui/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModerationQueueProps {
  doubts: Doubt[];
  mode: 'pending' | 'rejected';
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason?: string) => Promise<void>;
}

type ModerationTab = 'pending' | 'approved' | 'rejected';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
}

function getRelativeTime(dateString: string): string {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Reject dialog (inline per-card) ─────────────────────────────────────────

function RejectDialog({
  onConfirm,
  onCancel,
  isLoading,
}: {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [reason, setReason] = useState('');

  return (
    <div className="mt-3 rounded-2xl border border-[#EF4444]/20 bg-[#FDECEA] p-4 space-y-3 animate-[fadeInUp_0.2s_ease-out_forwards]">
      <p className="text-[12px] font-bold uppercase tracking-wider text-[#B91C1C]">
        Rejection reason (optional)
      </p>
      <textarea
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="e.g. Question is not academic, duplicate of existing doubt…"
        rows={2}
        className="w-full rounded-xl border border-[#EF4444]/30 bg-white px-3 py-2 text-sm text-[#22201F] placeholder:text-[#A79A88] outline-none focus:border-[#EF4444]/60 focus:ring-2 focus:ring-[#EF4444]/10 resize-none transition"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={() => onConfirm(reason)}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#B91C1C] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#991B1B] transition-colors disabled:opacity-60"
        >
          <XCircle size={13} />
          {isLoading ? 'Rejecting…' : 'Confirm Reject'}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#22201F]/20 bg-white px-4 py-2 text-[12px] font-semibold text-[#6E645A] hover:bg-[#F7F3EC] transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Doubt Card ───────────────────────────────────────────────────────────────

function ModerationCard({
  doubt,
  tab,
  onApprove,
  onReject,
}: {
  doubt: Doubt;
  tab: ModerationTab;
  onApprove: () => Promise<void>;
  onReject: (reason?: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  // Parse title + description from HTML question
  let parsedTitle = '';
  let parsedDesc = '';
  const rawQ = doubt.question || '';
  const strongMatch = rawQ.match(/<strong>(.*?)<\/strong>(?:<br\s*\/?>)?(.*)/is);
  if (strongMatch) {
    parsedTitle = stripHtml(strongMatch[1]).trim();
    parsedDesc = stripHtml(strongMatch[2]).trim();
  } else {
    parsedTitle = stripHtml(rawQ).trim();
  }
  if (!parsedTitle && doubt.topic) parsedTitle = doubt.topic;
  if (!parsedTitle && doubt.attachmentName) parsedTitle = `Attachment: ${doubt.attachmentName}`;

  const handleApprove = async () => {
    setLoadingApprove(true);
    try { await onApprove(); } finally { setLoadingApprove(false); }
  };

  const handleReject = async (reason: string) => {
    setLoadingReject(true);
    try {
      await onReject(reason || undefined);
      setShowRejectDialog(false);
    } finally {
      setLoadingReject(false);
    }
  };

  return (
    <PremiumCard padding="medium" className="transition-all duration-200">
      {/* Header: student info + status + time */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4E7E5] text-[#4A0E1B]">
            <User size={16} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] truncate">{doubt.name}</h4>
            <span className="text-[11px] text-[#8A7E6F] dark:text-[#A89F91] truncate block">{doubt.email}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <DoubtStatusBadge status={doubt.status ?? 'pending'} />
          <span className="text-[10px] text-[#A79A88]" title={fmtDate(doubt.createdAt)}>
            <Clock size={10} className="inline mr-0.5" />{getRelativeTime(doubt.createdAt)}
          </span>
        </div>
      </div>

      {/* Subject + Chapter */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A6A16]">{doubt.subject}</span>
        {doubt.topic && (
          <>
            <span className="text-[10px] text-[#A79A88]">·</span>
            <span className="text-[11px] text-[#8A7E6F]">{doubt.topic}</span>
          </>
        )}
      </div>

      {/* Question Preview */}
      <div className="mt-2 rounded-xl border border-[#EFE7D8] dark:border-[#F6F2EA]/10 bg-[#FBF7F0] dark:bg-[#2A2726] p-3.5">
        {parsedTitle ? (
          <p className="text-sm leading-relaxed text-[#3A342E] dark:text-[#C7BCAD]">
            <span className="font-bold">{parsedTitle}</span>
            {parsedDesc && (
              <span className="font-normal text-[#3A342E]/80 dark:text-[#C7BCAD]/80">
                {' · '}{parsedDesc.length > 120 ? parsedDesc.slice(0, 120) + '…' : parsedDesc}
              </span>
            )}
          </p>
        ) : (
          <p className="text-sm italic text-[#3A342E]/60 dark:text-[#C7BCAD]/60">[Image-only doubt]</p>
        )}

        {/* Expand toggle for long descriptions */}
        {parsedDesc.length > 120 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-2 text-[11px] font-bold text-[#4A0E1B] hover:text-[#7C2532] flex items-center gap-1 transition-colors"
          >
            {expanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Show full question</>}
          </button>
        )}
        {expanded && parsedDesc.length > 120 && (
          <p className="mt-2 text-sm text-[#3A342E]/80 dark:text-[#C7BCAD]/80 leading-relaxed">{parsedDesc}</p>
        )}
      </div>

      {/* Attachments */}
      {(doubt.attachmentUrl || doubt.attachmentDataUrl) && (
        <div className="mt-2">
          <AttachmentViewer
            attachments={[{
              url: doubt.attachmentDataUrl || doubt.attachmentUrl || '',
              name: doubt.attachmentName || 'Attachment',
            }]}
            containerClassName="mt-0 gap-2"
          />
        </div>
      )}

      {/* Rejection reason (for rejected tab) */}
      {tab === 'rejected' && doubt.rejectionReason && (
        <div className="mt-3 rounded-xl border border-[#EF4444]/20 bg-[#FDECEA] px-3.5 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#B91C1C] mb-1">Rejection Reason</p>
          <p className="text-sm text-[#B91C1C]/80">{doubt.rejectionReason}</p>
        </div>
      )}

      {/* Action row — only for pending tab */}
      {tab === 'pending' && (
        <div className="mt-4 border-t border-[#22201F]/10 dark:border-[#F6F2EA]/10 pt-3 space-y-2">
          <div className="flex items-center gap-2">
            {/* Approve */}
            <button
              onClick={handleApprove}
              disabled={loadingApprove || loadingReject}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8F5E9] border border-[#4CAF50]/30 px-4 py-2 text-[12px] font-bold text-[#2E7D32] hover:bg-[#4CAF50]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Approve doubt from ${doubt.name}`}
            >
              <CheckCircle2 size={14} />
              {loadingApprove ? 'Approving…' : '✓ Approve'}
            </button>

            {/* Reject */}
            <button
              onClick={() => setShowRejectDialog(v => !v)}
              disabled={loadingApprove || loadingReject}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FDECEA] border border-[#EF4444]/30 px-4 py-2 text-[12px] font-bold text-[#B91C1C] hover:bg-[#EF4444]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Reject doubt from ${doubt.name}`}
            >
              <XCircle size={14} />
              ✕ Reject
            </button>
          </div>

          {/* Reject dialog */}
          {showRejectDialog && (
            <RejectDialog
              onConfirm={handleReject}
              onCancel={() => setShowRejectDialog(false)}
              isLoading={loadingReject}
            />
          )}
        </div>
      )}
    </PremiumCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ModerationQueue({ doubts, mode, onApprove, onReject }: ModerationQueueProps) {
  if (doubts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] dark:bg-[#2A2726] px-6 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]">
          <Inbox size={22} />
        </div>
        <h4 className="dash-serif mt-4 text-base font-semibold text-[#22201F] dark:text-[#F6F2EA]">
          {mode === 'pending' ? 'No pending doubts' : 'No rejected doubts'}
        </h4>
        <p className="mt-1 max-w-sm text-sm text-[#8A7E6F] dark:text-[#A89F91]">
          {mode === 'pending' 
            ? 'All submitted doubts have been reviewed.' 
            : 'Rejected doubts will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Pending alert banner ── */}
      {mode === 'pending' && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#C9A13B]/30 bg-[#FBF3D9] px-4 py-3">
          <AlertCircle size={16} className="text-[#8A6A16] shrink-0" />
          <p className="text-sm text-[#8A6A16] font-medium">
            <strong>{doubts.length}</strong> doubt{doubts.length !== 1 ? 's' : ''} awaiting your review.
            Approve to make public · Reject to hide from students.
          </p>
        </div>
      )}

      {/* ── Card list ── */}
      <div className="space-y-3">
        {doubts.map(doubt => (
          <ModerationCard
            key={doubt.id}
            doubt={doubt}
            tab={mode}
            onApprove={() => onApprove(doubt.id)}
            onReject={(reason) => onReject(doubt.id, reason)}
          />
        ))}
      </div>
    </div>
  );
}
