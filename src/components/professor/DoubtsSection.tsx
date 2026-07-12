/**
 * DoubtsSection (Professor view) — triage-focused inbox.
 *
 * Features:
 * - Default tab: "Unanswered" sorted oldest-first (triage priority)
 * - Filter tabs: All / Unanswered (oldest first) / Answered Today / By Subject
 * - WaitTimeIndicator per card — colour-shifts neutral → gold → orange → burgundy
 * - Left border colour matches urgency for at-a-glance scanning
 * - Auto-mark seen: opening a thread transitions submitted → awaiting
 * - DoubtStatusBadge on every card with 5-state model
 * - AnswerDoubtModal unchanged (existing rich reply composer)
 * - design.md token compliance throughout
 *
 * @license Apache-2.0
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Search, Inbox, User, FileText, Plus, Trash2, Send, Eye, Filter
} from 'lucide-react';
import { PremiumCard } from '../PremiumCard';
import { PRIMARY_BTN, INPUT, ROW_BTN_DANGER } from '../ui/tokens';
import { ProfEmptyState } from './ui';
import { AnswerDoubtModal } from '../doubts/AnswerDoubtModal';
import { DoubtStatusBadge } from '../doubts/DoubtStatusBadge';
import { WaitTimeIndicator, waitTimeBorderColor } from '../doubts/WaitTimeIndicator';
import type { Doubt, DoubtStatus } from '../../types';
import { useImageViewer } from '../image-viewer';
import { replyToDoubt } from '../../services/doubtsService';
import { useNavigate } from 'react-router-dom';
import { AttachmentViewer } from '../ui/AttachmentViewer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DoubtsSectionProps {
  doubts: Doubt[];
  askDelete: (what: string, onConfirm: () => void) => void;
  onDeleteDoubt: (id: string) => void;
  onReplyDoubt: (
    id: string,
    replyData: {
      reply_text?: string;
      image_urls?: string[];
      video_urls?: string[];
      audio_urls?: string[];
      attachment_urls?: string[];
    }
  ) => void;
  onMarkSeen?: (id: string) => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveStatus(doubt: Doubt): DoubtStatus {
  if (doubt.status) return doubt.status;
  return doubt.isAnswered ? 'answered' : 'submitted';
}

function hasProfessorReply(doubt: Doubt): boolean {
  return !!(
    (doubt.replies && doubt.replies.some(r => r.professor_id !== 'student')) ||
    doubt.answerText
  );
}

function isAnsweredToday(doubt: Doubt): boolean {
  if (!hasProfessorReply(doubt)) return false;
  const lastReply = doubt.replies?.find(r => r.professor_id !== 'student');
  const replyDate = lastReply ? new Date(lastReply.created_at) : new Date(doubt.createdAt);
  const now = new Date();
  return replyDate.toDateString() === now.toDateString();
}

function getRelativeTime(dateString: string): string {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
}

// ─── Tab config ───────────────────────────────────────────────────────────────

type ProfTab = 'unanswered' | 'answered-today' | 'by-subject' | 'all';

const TAB_LABELS: Record<ProfTab, string> = {
  unanswered: 'Unanswered',
  'answered-today': 'Answered Today',
  'by-subject': 'By Subject',
  all: 'All',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DoubtsSection({
  doubts,
  askDelete,
  onDeleteDoubt,
  onReplyDoubt,
  onMarkSeen,
}: DoubtsSectionProps) {
  const { openViewer } = useImageViewer();

  // Tab / filter state — default: unanswered (oldest first)
  const [activeTab, setActiveTab] = useState<ProfTab>('unanswered');
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [replyingDoubtId, setReplyingDoubtId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // ── Subject list ─────────────────────────────────────────────────────────
  const subjects = useMemo(() => {
    const all = ['All', ...new Set(doubts.map(d => d.subject))];
    return all;
  }, [doubts]);

  // ── Filter & sort ─────────────────────────────────────────────────────────
  const doubtsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = doubts.filter(d => {
      if (activeTab === 'unanswered' && hasProfessorReply(d)) return false;
      if (activeTab === 'answered-today' && !isAnsweredToday(d)) return false;
      if (activeTab === 'by-subject' && subjectFilter !== 'All' && d.subject !== subjectFilter) return false;
      if (q && !([d.name, d.subject, d.question, d.email, d.topic || ''].some(f => f.toLowerCase().includes(q)))) return false;
      return true;
    });

    // Sort: unanswered tab → oldest first (triage); others → newest first
    return filtered.sort((a, b) => {
      if (activeTab === 'unanswered') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [doubts, activeTab, query, subjectFilter]);

  // ── Tab counts ────────────────────────────────────────────────────────────
  const tabCounts = useMemo(() => ({
    unanswered: doubts.filter(d => !hasProfessorReply(d)).length,
    'answered-today': doubts.filter(d => isAnsweredToday(d)).length,
    'by-subject': doubts.length,
    all: doubts.length,
  }), [doubts]);

  // ── Open thread → auto-mark seen ─────────────────────────────────────────
  const openThread = useCallback(async (doubt: Doubt) => {
    navigate(`/resources/doubts/${doubt.id}`);
    if (onMarkSeen && deriveStatus(doubt) === 'submitted') {
      await onMarkSeen(doubt.id);
    }
  }, [onMarkSeen, navigate]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5">
      {/* Tabs + search row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 flex-wrap">
          {(Object.keys(TAB_LABELS) as ProfTab[]).map(tab => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A0E1B]/20 ${
                  active
                    ? 'bg-[#4A0E1B] text-white'
                    : 'border border-[#22201F]/12 bg-white dark:bg-[#22201F] text-[#6E645A] hover:text-[#22201F]'
                }`}
              >
                {TAB_LABELS[tab]}
                <span className={`ml-1.5 ${active ? 'text-white/70' : 'text-[#A79A88]'}`}>
                  ({tabCounts[tab]})
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          {/* Subject filter (By Subject tab only) */}
          {activeTab === 'by-subject' && (
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="rounded-xl border border-[#E3D8C5] bg-[#FBF7F0] px-3 py-2 text-xs text-[#22201F] focus:outline-none focus:border-[#4A0E1B]/40 transition"
              aria-label="Filter by subject"
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <div className="relative sm:w-64">
            <Search
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]"
              aria-hidden="true"
            />
            <input
              className={`${INPUT} pl-10 text-xs`}
              placeholder="Search doubts…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search doubts"
            />
          </div>
        </div>
      </div>

      {/* Inbox zero */}
      {doubtsFiltered.length === 0 ? (
        <ProfEmptyState
          icon={<Inbox size={22} />}
          title={activeTab === 'unanswered' ? 'Inbox zero' : 'Nothing to show'}
          message={
            activeTab === 'unanswered'
              ? 'All doubts have been answered. Beautifully done.'
              : 'No doubts match this view.'
          }
        />
      ) : (
        <div className="space-y-3">
          {doubtsFiltered.map((doubt) => {
            const status = deriveStatus(doubt);
            const profReplied = hasProfessorReply(doubt);
            const borderColor = !profReplied ? waitTimeBorderColor(doubt.createdAt) : '#D9C2A2';

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
            if (doubt.attachmentName && !parsedTitle) {
              parsedTitle = `Attachment: ${doubt.attachmentName}`;
            }

            return (
              <PremiumCard
                key={doubt.id}
                padding="medium"
                className="transition-all duration-200"
              >
                {/* Card top: student info + status + wait time */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4E7E5] text-[#4A0E1B]">
                      <User size={16} aria-hidden="true" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{doubt.name}</h4>
                      <span className="text-[11px] text-[#8A7E6F] dark:text-[#A89F91]">{doubt.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2">
                      {!profReplied && (
                        <WaitTimeIndicator createdAt={doubt.createdAt} />
                      )}
                      <DoubtStatusBadge status={status} />
                    </div>
                    <span className="text-[10px] text-[#A79A88]">{fmtDate(doubt.createdAt)}</span>
                  </div>
                </div>

                {/* Subject + question */}
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A6A16]">
                  {doubt.subject}
                </p>
                <div className="mt-1.5 rounded-xl border border-[#EFE7D8] dark:border-[#F6F2EA]/10 bg-[#FBF7F0] dark:bg-[#2A2726] p-3.5">
                  {parsedTitle ? (
                    <p className="text-sm leading-relaxed text-[#3A342E] line-clamp-3">
                      <span className="font-bold">{parsedTitle}</span>
                      {parsedDesc && <span className="font-normal text-[#3A342E]/80"> : {parsedDesc}</span>}
                    </p>
                  ) : (
                    <p className="text-sm italic text-[#3A342E]/60">[Image-only doubt — open thread to view]</p>
                  )}
                </div>

                {/* Attachment */}
                {(doubt.attachmentUrl || doubt.attachmentDataUrl) && (
                  <div className="mt-2">
                    <AttachmentViewer
                      attachments={[
                        {
                          url: doubt.attachmentDataUrl || doubt.attachmentUrl || '',
                          name: doubt.attachmentName || 'Attachment',
                        }
                      ]}
                      containerClassName="mt-0 gap-2"
                    />
                  </div>
                )}

                {/* Answer zone */}
                {(() => {
                  const firstProfReply = doubt.replies?.find(r => r.professor_id !== 'student');
                  if (!firstProfReply) return null;
                  return (
                    <div className="mt-3 space-y-2">
                      <div className="rounded-xl border border-[#F7EFD9] bg-[#FBF6EA] dark:bg-[#2A2726] px-3.5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A6A16]">
                          Your response
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[#3A342E] line-clamp-2">
                          {firstProfReply.reply_text}
                        </p>
                        {(firstProfReply.image_urls?.length > 0 || firstProfReply.video_urls?.length > 0 || firstProfReply.audio_urls?.length > 0 || firstProfReply.attachment_urls?.length > 0) && (
                          <div className="mt-2">
                            <AttachmentViewer
                              attachments={[
                                ...(firstProfReply.image_urls || []).map(url => ({ url, type: 'image' as const })),
                                ...(firstProfReply.video_urls || []).map(url => ({ url, type: 'video' as const })),
                                ...(firstProfReply.audio_urls || []).map(url => ({ url, type: 'audio' as const })),
                                ...(firstProfReply.attachment_urls || []).map(url => ({ url }))
                              ]}
                              containerClassName="mt-0 gap-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                {doubt.answerText && !doubt.replies?.length && (
                  <div className="mt-3 rounded-xl border border-[#F7EFD9] bg-[#FBF6EA] px-3.5 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A6A16]">Your response (Legacy)</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#3A342E] line-clamp-2">{doubt.answerText}</p>
                  </div>
                )}

                {/* Action row */}
                <div className="mt-4 flex items-center justify-between border-t border-[#22201F]/10 dark:border-[#F6F2EA]/10 pt-3">
                  <div className="flex items-center gap-2">
                    {/* View Details */}
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9C2A2] bg-white px-3 py-1.5 text-[11px] font-bold text-[#4A0E1B] hover:bg-[#F7F3EC] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A0E1B]/20"
                      onClick={() => openThread(doubt)}
                      aria-label={`View details for: ${doubt.name}`}
                    >
                      <Eye size={12} aria-hidden="true" />
                      View Details
                    </button>
                    {/* Answer */}
                    {!profReplied && (
                      <button
                        className={PRIMARY_BTN}
                        onClick={() => setReplyingDoubtId(doubt.id)}
                        aria-label={`Reply to doubt from ${doubt.name}`}
                      >
                        <Send size={12} /> Answer
                      </button>
                    )}
                  </div>
                  <button
                    className={ROW_BTN_DANGER}
                    onClick={() => askDelete('this ticket', () => onDeleteDoubt(doubt.id))}
                    aria-label={`Delete doubt from ${doubt.name}`}
                  >
                    <Trash2 size={12} aria-hidden="true" />
                    Delete
                  </button>
                </div>

                {/* Answer modal inline */}
                {replyingDoubtId === doubt.id && (
                  <AnswerDoubtModal
                    doubt={doubt}
                    onClose={() => setReplyingDoubtId(null)}
                    onPublish={async (data) => {
                      await onReplyDoubt(doubt.id, data);
                      setReplyingDoubtId(null);
                    }}
                  />
                )}
              </PremiumCard>
            );
          })}
        </div>
      )}

    </div>
  );
}
