/**
 * DoubtsSection (Student view) — Completely redesigned premium minimal interface
 *
 * @license Apache-2.0
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus, Search
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import type { DoubtsSectionProps } from './types';
import type { Doubt } from '../../types';
import type { DoubtStatus } from '../../types';
import { AskDoubtModal } from '../doubts/AskDoubtModal';
import { DoubtStatusBadge } from '../doubts/DoubtStatusBadge';
import { replyToDoubt } from '../../services/doubtsService';
import { useNavigate } from 'react-router-dom';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function hasProfessorReply(doubt: Doubt): boolean {
  return !!(
    (doubt.replies && doubt.replies.some(r => r.professor_id !== 'student')) ||
    doubt.answerText
  );
}

function deriveStatus(doubt: Doubt): DoubtStatus {
  if (doubt.status) return doubt.status;
  return doubt.isAnswered ? 'answered' : 'submitted';
}

function sanitizeHtml(html: string) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
}

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
}

// ─── Filter tab definitions ───────────────────────────────────────────────────

type FilterTab = 'All' | 'Answered' | 'Waiting' | 'My Questions';

const FILTER_TABS: FilterTab[] = ['All', 'Answered', 'Waiting', 'My Questions'];

function tabMatchesDoubt(tab: FilterTab, doubt: Doubt, myEmail: string | null): boolean {
  const status = deriveStatus(doubt);
  switch (tab) {
    case 'Waiting': return status === 'awaiting' || status === 'submitted' || status === 'needs-followup';
    case 'Answered': return status === 'answered';
    case 'My Questions': return myEmail ? doubt.email === myEmail : true;
    default: return true;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DoubtsSection({
  doubts,
  notes,
  onAddDoubt,
}: DoubtsSectionProps) {
  // Modal state
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const navigate = useNavigate();

  // List state
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // My-doubts identity (keyed by last-used email in localStorage)
  const myEmail = null; // Future: derive from auth or last submission

  // ── Filter & sort ─────────────────────────────────────────────────────────
  const filteredDoubts = useMemo(() => {
    // Reject placeholder/junk data
    const valid = doubts.filter(d => {
      const sub = d.subject.toLowerCase();
      if (sub === 'dfv' || sub === 'cv' || sub === 'sdsdv') return false;
      return true;
    });

    const byTab = valid.filter(d => tabMatchesDoubt(activeTab, d, myEmail));

    const bySearch = searchQuery
      ? byTab.filter(d =>
        d.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.topic || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
      : byTab;

    // Sort: Waiting → oldest first (triage), others → newest first
    const finalSorted = [...bySearch].sort((a, b) => {
      if (activeTab === 'Waiting') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    console.log('[DoubtsSection Debug] Total doubts received:', doubts.length);
    console.log('[DoubtsSection Debug] After valid filter:', valid.length);
    console.log('[DoubtsSection Debug] After tab filter:', byTab.length);
    console.log('[DoubtsSection Debug] Final rendered doubts:', finalSorted.length);
    if (finalSorted.length > 0) {
      console.log('[DoubtsSection Debug] First doubt:', finalSorted[0]);
    }
    
    return finalSorted;
  }, [doubts, activeTab, searchQuery, myEmail]);

  // ── Open a doubt ────────────
  const openThread = useCallback((doubt: Doubt) => {
    navigate(`/resources/doubts/${doubt.id}`);
  }, [navigate]);

  return (
    <div className="max-w-[1200px] mx-auto pb-20 animate-[fadeInUp_0.4s_ease-out_forwards]">
      {/* 1. HEADER */}
      <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[36px] tracking-tight font-bold text-gray-900 mb-2">Doubts & Discussion</h1>
          <p className="text-gray-500 max-w-lg text-[16px]">Ask academic questions and receive verified answers from the professor.</p>
        </div>
        <button
          onClick={() => setIsAskModalOpen(true)}
          className="hidden md:flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#4A0E1B] px-6 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#7C2532] shadow-[0_8px_16px_rgba(74,14,27,0.15)] hover:shadow-[0_12px_24px_rgba(74,14,27,0.25)] hover:-translate-y-[2px]"
        >
          <Plus size={18} />
          Ask a Doubt
        </button>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="mb-6 relative z-10 group">
        <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] group-focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-center min-h-[64px] px-2 sm:px-5 py-2 sm:py-0 gap-3">
          <div className="flex w-full sm:w-auto flex-1 items-center gap-3 px-3 sm:px-0">
            <Search size={22} className="text-gray-400 shrink-0" />
            <input 
              type="text"
              placeholder="Search questions, chapters or topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <div className="hidden sm:flex shrink-0 items-center gap-4 border-l border-gray-100 pl-5 h-8">
            <select className="text-[14px] bg-transparent font-medium text-gray-600 focus:outline-none cursor-pointer hover:text-gray-900 transition-colors">
              <option>All Subjects</option>
            </select>
            <select className="text-[14px] bg-transparent font-medium text-gray-600 focus:outline-none cursor-pointer hover:text-gray-900 transition-colors">
              <option>All Statuses</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. FILTER CHIPS */}
      <div className="mb-10 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-200 ${
              activeTab === tab 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4. QUESTION CARDS */}
      {filteredDoubts.length === 0 ? (
        <EmptyState
          label={searchQuery
            ? 'No doubts match your search.'
            : activeTab === 'Answered'
            ? 'No answered doubts yet.'
            : 'No doubts yet — ask your first question!'
          }
          action={
            !searchQuery ? (
              <button
                onClick={() => setIsAskModalOpen(true)}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-[14px] font-bold text-white transition-all hover:bg-gray-800"
              >
                <Plus size={16} />
                Ask a Doubt
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDoubts.map((doubt, index) => {
            const status = deriveStatus(doubt);
            const hasProfReply = hasProfessorReply(doubt);
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
              <div
                key={doubt.id}
                className={`group relative bg-white rounded-[20px] p-[18px] ${hasProfReply ? 'h-[210px]' : 'h-[190px]'} shadow-sm hover:shadow-xl transition-all duration-250 hover:-translate-y-1 flex flex-col border border-gray-100 animate-[fadeInUp_0.5s_ease-out_forwards]`}
                style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
              >
                {/* Top Row: Subject & Status */}
                <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
                  <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">{doubt.subject}</span>
                  <DoubtStatusBadge status={status} className="!py-0.5 !px-2 h-5 text-[10px]" />
                </div>

                {/* Middle: Merged Title & Description */}
                <div className="mb-2 overflow-hidden">
                  <p className="text-[15px] text-gray-900 leading-relaxed line-clamp-3 break-words">
                    <span className="font-bold">{parsedTitle}</span>
                    {parsedDesc && <span className="font-normal text-gray-700"> : {parsedDesc}</span>}
                  </p>
                </div>

                {/* Bottom: Metadata & Action */}
                <div className="mt-auto flex flex-col shrink-0 gap-0.5">
                  <span className="text-[14px] text-gray-500">
                    {doubt.name} &middot; {getRelativeTime(doubt.createdAt)}
                  </span>
                  {hasProfReply && (
                    <span className="text-[14px] text-gray-500">
                      Professor replied &middot; {getRelativeTime(doubt.replies?.[doubt.replies.length - 1]?.created_at || new Date().toISOString())}
                    </span>
                  )}
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => openThread(doubt)}
                      className="group/btn flex items-center gap-1 text-[14px] font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {hasProfReply ? 'Read Full Answer \u2192' : 'View Details \u2192'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. ASK DOUBT BUTTON (Mobile) */}
      <button
        onClick={() => setIsAskModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#4A0E1B] text-white shadow-[0_8px_24px_rgba(74,14,27,0.3)] hover:scale-105 transition-transform"
      >
        <Plus size={24} />
      </button>

      {/* Ask a Doubt Modal */}
      <AskDoubtModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        notes={notes}
        existingDoubts={doubts}
        onSubmit={onAddDoubt}
        onOpenThread={openThread}
        onSuccess={() => {
          setToastMessage('Doubt submitted successfully. The professor has been notified.');
          setTimeout(() => setToastMessage(''), 5000);
        }}
      />

      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-[#1A1817] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-[fadeInUp_0.3s_ease-out_forwards]">
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="text-[14px] font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
