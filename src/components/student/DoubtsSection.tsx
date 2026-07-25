/**
 * DoubtsSection (Student view) — Moderation-aware public feed + My Doubts.
 *
 * Public feed: only shows approved + answered doubts.
 * My Doubts: shows ALL of the student's own doubts (pending/rejected/approved/answered)
 * Student identity: keyed by email stored in localStorage after submission.
 *
 * @license Apache-2.0
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus, Search, Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import type { DoubtsSectionProps } from './types';
import type { Doubt, DoubtStatus } from '../../types';
import { AskDoubtModal } from '../doubts/AskDoubtModal';
import { useNavigate } from 'react-router-dom';
import { ResourceCard } from '../resources/ResourceCard';
import { ResourceHero, ResourceToolbar } from '../resources/ResourcePageLayout';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
}

// ─── Student identity helpers ─────────────────────────────────────────────────

const STUDENT_EMAIL_KEY = 'portal_student_email_v1';

function getStoredStudentEmail(): string | null {
  try { return localStorage.getItem(STUDENT_EMAIL_KEY); } catch { return null; }
}

// ─── Filter tab definitions ───────────────────────────────────────────────────

type FilterTab = 'All' | 'Answered' | 'Waiting' | 'My Doubts';

const FILTER_TABS: FilterTab[] = ['All', 'Answered', 'Waiting', 'My Doubts'];

/** Is this doubt visible in the public feed? Only approved + answered + legacy. */
function isPublicDoubt(doubt: Doubt): boolean {
  const s = deriveStatus(doubt);
  return s === 'approved' || s === 'answered'
    // Legacy compat: old doubts with submitted/awaiting/needs-followup treated as public
    || s === 'submitted' || s === 'awaiting' || s === 'needs-followup';
}

function tabMatchesDoubt(tab: FilterTab, doubt: Doubt, myEmail: string | null): boolean {
  const status = deriveStatus(doubt);
  switch (tab) {
    case 'Waiting': return status === 'awaiting' || status === 'submitted' || status === 'needs-followup' || status === 'approved';
    case 'Answered': return status === 'answered';
    case 'My Doubts': return myEmail ? doubt.email?.toLowerCase() === myEmail.toLowerCase() : false;
    default: return true; // 'All' — only public doubts (filtered before this)
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DoubtsSection({
  doubts,
  notes,
  onAddDoubt,
}: DoubtsSectionProps) {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Student identity — email stored in localStorage after submitting
  const myEmail = getStoredStudentEmail();

  // ── Filter & sort ─────────────────────────────────────────────────────────
  const filteredDoubts = useMemo(() => {
    const valid = doubts.filter(d => {
      const sub = d.subject.toLowerCase();
      if (sub === 'dfv' || sub === 'cv' || sub === 'sdsdv') return false;
      return true;
    });

    // For 'My Doubts' tab: show ALL of the student's doubts (including pending/rejected)
    // For all other tabs: only show public (approved/answered/legacy) doubts
    const scope = activeTab === 'My Doubts'
      ? valid
      : valid.filter(d => isPublicDoubt(d));

    const byTab = scope.filter(d => tabMatchesDoubt(activeTab, d, myEmail));

    const bySearch = searchQuery
      ? byTab.filter(d =>
        d.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.topic || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
      : byTab;

    // Waiting → oldest first (triage queue); others → newest first
    return [...bySearch].sort((a, b) => {
      if (activeTab === 'Waiting') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [doubts, activeTab, searchQuery, myEmail]);

  // Public doubt count (for hero subtitle)
  const publicDoubtsCount = useMemo(() =>
    doubts.filter(d => isPublicDoubt(d)).length,
    [doubts]
  );

  const openThread = useCallback((doubt: Doubt) => {
    navigate(`/resources/doubts/${doubt.id}`);
  }, [navigate]);

  return (
    <div className="max-w-[1200px] mx-auto pb-20 animate-[fadeInUp_0.4s_ease-out_forwards]">
      <ResourceHero
        themeGradient="from-[#4A0E1B] to-[#7C2532]"
        title="Doubts & Discussion"
        description="Ask academic questions and receive verified answers from the professor."
        totalLabel="Total Questions"
        totalCount={publicDoubtsCount}
      />

      <ResourceToolbar
        tabs={FILTER_TABS as string[]}
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t as FilterTab)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search questions, chapters or topics..."
        extraFilters={
          <button
            onClick={() => setIsAskModalOpen(true)}
            className="hidden sm:flex shrink-0 items-center justify-center gap-[6px] h-[46px] rounded-full bg-[#4A0E1B] px-[20px] text-[14px] font-bold text-white transition-all duration-200 hover:bg-[#7C2532] shadow-[0_8px_16px_rgba(74,14,27,0.15)] hover:-translate-y-[1px]"
          >
            <Plus size={16} />
            Ask a Doubt
          </button>
        }
      />

      {/* My Doubts — info banner if student has no email set */}
      {activeTab === 'My Doubts' && !myEmail && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-[#C9A13B]/30 bg-[#FBF3D9] px-4 py-3">
          <AlertCircle size={16} className="text-[#8A6A16] shrink-0 mt-0.5" />
          <p className="text-sm text-[#8A6A16]">
            Submit a doubt first to track your submissions here. Your doubts will be identified by the email you use when submitting.
          </p>
        </div>
      )}

      {/* QUESTION CARDS */}
      {filteredDoubts.length === 0 ? (
        <EmptyState
          label={searchQuery
            ? 'No doubts match your search.'
            : activeTab === 'Answered'
            ? 'No answered doubts yet.'
            : activeTab === 'My Doubts'
            ? myEmail ? "You haven't submitted any doubts yet." : 'Submit a doubt to see it here.'
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
        <div className="grid gap-[24px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDoubts.map((doubt) => {
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

            // For My Doubts tab: show status-aware action label
            const actionLabel = activeTab === 'My Doubts'
              ? status === 'pending_approval' ? 'View (Pending Approval)'
              : status === 'rejected' ? 'View (Rejected)'
              : hasProfReply ? 'Read Answer' : 'View Details'
              : hasProfReply ? 'Read Answer' : 'View Details';

            return (
              <ResourceCard
                key={doubt.id}
                title={parsedTitle}
                description={parsedDesc || 'No additional details provided.'}
                chapter={status}
                subject={doubt.subject}
                actions={[
                  {
                    icon: Search,
                    label: actionLabel,
                    onClick: () => openThread(doubt)
                  }
                ]}
              />
            );
          })}
        </div>
      )}

      {/* ASK DOUBT BUTTON (Mobile) */}
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
          setToastMessage('Your doubt has been submitted and is awaiting professor approval.');
          setTimeout(() => setToastMessage(''), 6000);
        }}
      />

      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-[#1A1817] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-[fadeInUp_0.3s_ease-out_forwards]">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock size={14} />
          </div>
          <span className="text-[14px] font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
