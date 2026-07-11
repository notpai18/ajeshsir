/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Inbox, User, Check, CornerDownRight, FileText, Plus, Trash2, Send } from 'lucide-react';
import { PremiumCard } from '../PremiumCard';

import { PRIMARY_BTN, INPUT, ROW_BTN_DANGER } from '../ui/tokens';
import { ProfEmptyState } from './ui';
import { AnswerDoubtModal } from '../doubts/AnswerDoubtModal';
import type { Doubt } from '../../types';

interface DoubtsSectionProps {
  doubts: Doubt[];
  askDelete: (what: string, onConfirm: () => void) => void;
  onDeleteDoubt: (id: string) => void;
  onReplyDoubt: (id: string, replyData: { reply_text?: string; image_urls?: string[]; video_urls?: string[]; audio_urls?: string[]; attachment_urls?: string[]; }) => void;
}

export function DoubtsSection({
  doubts,
  askDelete,
  onDeleteDoubt,
  onReplyDoubt
}: DoubtsSectionProps) {
  const [doubtsTab, setDoubtsTab] = useState<'unanswered' | 'answered' | 'all'>('unanswered');
  const [query, setQuery] = useState('');
  const [replyingDoubtId, setReplyingDoubtId] = useState<string | null>(null);

  const doubtsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...doubts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((d) => {
        if (doubtsTab === 'unanswered' && d.isAnswered) return false;
        if (doubtsTab === 'answered' && !d.isAnswered) return false;
        return !q || [d.name, d.subject, d.question, d.email].some((f) => f.toLowerCase().includes(q));
      });
  }, [doubts, doubtsTab, query]);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl border border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#4A433E] bg-white dark:bg-[#22201F] dark:bg-[#22201F] p-1">
          {(['unanswered', 'answered', 'all'] as const).map((t) => {
            const c = t === 'unanswered' ? doubts.filter((d) => !d.isAnswered).length : t === 'answered' ? doubts.filter((d) => d.isAnswered).length : doubts.length;
            const active = doubtsTab === t;
            return (
              <button
                key={t}
                onClick={() => setDoubtsTab(t)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition-colors ${active ? 'bg-[#4A0E1B] text-white' : 'text-[#6E645A] hover:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]'}`}
              >
                {t} <span className={active ? 'text-white/70' : 'text-[#A79A88]'}>({c})</span>
              </button>
            );
          })}
        </div>
        <div className="relative sm:w-72">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
          <input className={`${INPUT} pl-10`} placeholder="Search doubts…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {doubtsFiltered.length === 0 ? (
        <ProfEmptyState
          icon={<Inbox size={22} />}
          title={doubtsTab === 'unanswered' ? 'Inbox zero' : 'Nothing to show'}
          message={doubtsTab === 'unanswered' ? 'There are no unanswered doubts right now. Beautifully done.' : 'No doubts match this view.'}
        />
      ) : (
        <div className="space-y-4">
          {doubtsFiltered.map((doubt) => (
            <PremiumCard key={doubt.id} padding="medium" className={!doubt.isAnswered ? 'ring-1 ring-[#4A0E1B]/12' : ''}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#38151A] text-[#4A0E1B]">
                    <User size={16} />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{doubt.name}</h4>
                    <span className="dash-mono text-[11px] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{doubt.email}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="dash-mono text-[11px] text-[#A79A88]">{fmtDate(doubt.createdAt)}</span>
                  {!doubt.isAnswered ? (
                    <span className="rounded-full bg-[#F4E4E4] px-2 py-0.5 text-[10px] font-bold text-[#4A0E1B]">Awaiting reply</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D] px-2 py-0.5 text-[10px] font-bold text-[#8A6A16]">
                      <Check size={11} /> Answered
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A6A16]">{doubt.subject}</p>
              <p className="mt-1.5 rounded-xl border border-[#EFE7D8] dark:border-[#4A433E] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] p-3.5 text-sm leading-relaxed text-[#3A342E]">{doubt.question}</p>

              {doubt.attachmentName && (
                <div className="mt-2">
                  {doubt.attachmentDataUrl ? (
                    doubt.attachmentDataUrl.startsWith('data:image/') ? (
                      /* Image: show thumbnail + open in new tab */
                      <div className="rounded-xl border border-[#EFE7D8] dark:border-[#4A433E] dark:border-[#4A433E] overflow-hidden">
                        <img
                          src={doubt.attachmentDataUrl}
                          alt={doubt.attachmentName}
                          className="w-full max-h-48 object-contain bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] cursor-pointer"
                          onClick={() => {
                            const win = window.open();
                            if (win) { win.document.write(`<img src="${doubt.attachmentDataUrl}" style="max-width:100%">`); }
                          }}
                          title="Click to open full size"
                        />
                        <div className="flex items-center justify-between px-3 py-1.5 bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] border-t border-[#EFE7D8] dark:border-[#4A433E] dark:border-[#4A433E]">
                          <span className="text-[10px] text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] truncate">📎 {doubt.attachmentName}</span>
                          <a
                            href={doubt.attachmentDataUrl}
                            download={doubt.attachmentName}
                            className="text-[10px] font-semibold text-[#8A6A16] hover:text-[#4A0E1B] shrink-0 ml-2"
                          >Download</a>
                        </div>
                      </div>
                    ) : (
                      /* Other file type: download button */
                      <div className="flex items-center gap-2.5 rounded-xl border border-[#EFE7D8] dark:border-[#4A433E] dark:border-[#4A433E] bg-[#FBF7F0] dark:bg-[#2A2726] dark:bg-[#2A2726] px-3.5 py-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#3A342E] truncate">📎 {doubt.attachmentName}</p>
                        </div>
                        <a
                          href={doubt.attachmentDataUrl}
                          download={doubt.attachmentName}
                          className="shrink-0 rounded-lg bg-[#8A6A16] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#4A0E1B] transition-colors"
                        >Open / Download</a>
                      </div>
                    )
                  ) : (
                    /* Legacy: no data URL stored */
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
                      📎 <span className="italic">{doubt.attachmentName}</span>
                      <span className="text-[10px] text-[#C7C7CC]">(file not available)</span>
                    </span>
                  )}
                </div>
              )}

              {/* Answer / reply zone */}
              {doubt.replies && doubt.replies.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {doubt.replies.map(reply => (
                    <div key={reply.id} className="rounded-xl border border-[#F7EFD9] bg-[#FBF6EA] dark:bg-[#2A2726] dark:bg-[#2A2726] p-4">
                      <div className="flex items-start gap-2.5">
                        <CornerDownRight size={15} className="mt-0.5 shrink-0 text-[#8A6A16]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A6A16]">Your response</p>
                          </div>
                          <div 
                            className="mt-2 text-sm leading-relaxed text-[#3A342E] prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: reply.reply_text || '' }} 
                          />
                          {/* Images */}
                          {reply.image_urls && reply.image_urls.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {reply.image_urls.map((url, i) => (
                                <img key={i} src={url} alt="reply attachment" className="h-24 w-auto rounded-lg object-cover shadow-sm border border-[#EFE7D8] dark:border-[#4A433E] dark:border-[#4A433E]" />
                              ))}
                            </div>
                          )}
                          {/* Videos */}
                          {reply.video_urls && reply.video_urls.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {reply.video_urls.map((url, i) => (
                                <video key={i} src={url} controls className="h-40 w-auto rounded-lg shadow-sm border border-[#EFE7D8] dark:border-[#4A433E] dark:border-[#4A433E]" />
                              ))}
                            </div>
                          )}
                          {/* Audio */}
                          {reply.audio_urls && reply.audio_urls.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {reply.audio_urls.map((url, i) => (
                                <audio key={i} src={url} controls className="w-full max-w-xs" />
                              ))}
                            </div>
                          )}
                          {/* Docs */}
                          {reply.attachment_urls && reply.attachment_urls.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {reply.attachment_urls.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#4A433E] bg-white dark:bg-[#22201F] dark:bg-[#22201F] px-3 py-2 text-xs font-semibold text-[#8A6A16] hover:bg-[#FBF6EA] dark:bg-[#2A2726] dark:bg-[#2A2726]">
                                  <FileText size={14} /> Attachment {i + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center justify-between border-t border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#4A433E] pt-4">
                    <button className={PRIMARY_BTN} onClick={() => setReplyingDoubtId(doubt.id)}>
                      <Plus size={13} /> Add another reply
                    </button>
                    <button className={ROW_BTN_DANGER} onClick={() => askDelete('this ticket', () => onDeleteDoubt(doubt.id))}>
                      <Trash2 size={13} /> Delete Ticket
                    </button>
                  </div>
                </div>
              ) : doubt.answerText ? (
                <div className="mt-4 rounded-xl border border-[#F7EFD9] bg-[#FBF6EA] dark:bg-[#2A2726] dark:bg-[#2A2726] p-4">
                  <div className="flex items-start gap-2.5">
                    <CornerDownRight size={15} className="mt-0.5 shrink-0 text-[#8A6A16]" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A6A16]">Your response (Legacy)</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#3A342E]">{doubt.answerText}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#4A433E] pt-4">
                    <button className={PRIMARY_BTN} onClick={() => setReplyingDoubtId(doubt.id)}>
                      <Plus size={13} /> Add rich reply
                    </button>
                    <button className={ROW_BTN_DANGER} onClick={() => askDelete('this ticket', () => onDeleteDoubt(doubt.id))}>
                      <Trash2 size={13} /> Delete Ticket
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between">
                  <button className={PRIMARY_BTN} onClick={() => setReplyingDoubtId(doubt.id)}>
                    <Send size={13} /> Answer query
                  </button>
                  <button className={ROW_BTN_DANGER} onClick={() => askDelete('this ticket', () => onDeleteDoubt(doubt.id))}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}

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
          ))}
        </div>
      )}
    </div>
  );
}
