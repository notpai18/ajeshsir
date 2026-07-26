/**
 * doubtStatus.ts — derives and describes the 4-state doubt moderation model.
 *
 * State machine:
 *  pending  → approved → answered
 *           ↘ rejected
 *
 * Pending doubts are NOT publicly visible.
 * Rejected doubts are NEVER publicly visible.
 * Approved and Answered doubts are publicly visible.
 */

import type { Doubt, DoubtStatus } from '../types';

/** Derive the effective status from a Doubt record */
export function deriveDoubtStatus(doubt: Doubt): DoubtStatus {
  if (doubt.status) {
    return doubt.status;
  }

  // Fallback: derive from legacy isAnswered boolean
  if (doubt.isAnswered || hasProfessorReply(doubt)) {
    return 'answered';
  }
  return 'pending';
}

/** Returns true if at least one reply is from the professor */
export function hasProfessorReply(doubt: Doubt): boolean {
  if (doubt.answerText) return true;
  return (doubt.replies || []).some(r => r.professor_id !== 'student');
}

/** Returns true if this doubt should appear on the public page */
export function isPubliclyVisible(doubt: Doubt): boolean {
  const s = deriveDoubtStatus(doubt);
  return s === 'approved' || s === 'answered';
}

/** Visual config for each status badge */
export const STATUS_CONFIG: Record<
  DoubtStatus,
  {
    label: string;
    icon: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    urgency: number; // 0 = low, 1 = medium, 2 = high (for triage colour)
  }
> = {
  pending: {
    label: 'Pending',
    icon: 'ShieldAlert',
    badgeBg: 'bg-[#FEF9C3]',
    badgeText: 'text-[#854D0E]',
    borderColor: 'border-[#EAB308]',
    urgency: 1
  },
  approved: {
    label: 'Approved',
    icon: 'ShieldCheck',
    badgeBg: 'bg-[#DCFCE7]',
    badgeText: 'text-[#166534]',
    borderColor: 'border-[#22C55E]',
    urgency: 0
  },
  rejected: {
    label: 'Rejected',
    icon: 'ShieldX',
    badgeBg: 'bg-[#FEE2E2]',
    badgeText: 'text-[#991B1B]',
    borderColor: 'border-[#EF4444]',
    urgency: 0
  },
  answered: {
    label: 'Answered',
    icon: 'MessageCircle',
    badgeBg: 'bg-[#F9EEF0]',
    badgeText: 'text-[#7C2532]',
    borderColor: 'border-[#7C2532]',
    urgency: 0,
  },
};

/**
 * Returns a triage colour class for the "waiting time" indicator.
 * < 12 hrs → neutral, 12–48 hrs → gold, 48+ hrs → red
 */
export function getTriageColour(createdAt: string): 'neutral' | 'gold' | 'red' {
  const diffHours =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (diffHours >= 48) return 'red';
  if (diffHours >= 12) return 'gold';
  return 'neutral';
}

export const TRIAGE_COLOUR_CLASSES: Record<'neutral' | 'gold' | 'red', string> = {
  neutral: 'bg-[#F0EFEE] text-[#6E645A]',
  gold:    'bg-[#FBF3DF] text-[#8A6A16]',
  red:     'bg-[#FDECEA] text-[#C0392B]',
};
