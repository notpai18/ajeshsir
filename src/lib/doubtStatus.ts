/**
 * doubtStatus.ts — derives and describes the 5-state doubt model.
 *
 * State machine rules:
 *  submitted      → awaiting (prof sees it)
 *  awaiting       → answered (prof replies)
 *  answered       → resolved (student confirms) | needs-followup (student replies)
 *  needs-followup → answered (prof replies again)
 *  resolved       = terminal (but prof can re-open in theory)
 *
 * Invariant enforced here:
 *  - "resolved" requires at least one professor reply.
 */

import type { Doubt, DoubtStatus } from '../types';

/** Derive the effective status from a Doubt record */
export function deriveDoubtStatus(doubt: Doubt): DoubtStatus {
  // If an explicit status is stored, use it (but enforce the invariant)
  if (doubt.status) {
    return doubt.status;
  }

  // Fallback: derive from legacy binary isAnswered
  if (doubt.isAnswered || hasProfessorReply(doubt)) {
    return 'answered';
  }
  return 'submitted';
}

/** Returns true if at least one reply is from the professor */
export function hasProfessorReply(doubt: Doubt): boolean {
  if (doubt.answerText) return true;
  return (doubt.replies || []).some(r => r.professor_id !== 'student');
}

/** Returns true if the student is allowed to mark as resolved */
export function canStudentResolve(doubt: Doubt): boolean {
  const status = deriveDoubtStatus(doubt);
  return (status === 'answered' || status === 'needs-followup') && hasProfessorReply(doubt);
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
  submitted: {
    label: 'Submitted',
    icon: 'Clock',
    badgeBg: 'bg-[#F0EFEE]',
    badgeText: 'text-[#6E645A]',
    borderColor: 'border-[#D9C2A2]',
    urgency: 0,
  },
  awaiting: {
    label: 'Awaiting Response',
    icon: 'Hourglass',
    badgeBg: 'bg-[#FBF3DF]',
    badgeText: 'text-[#8A6A16]',
    borderColor: 'border-[#C9A13B]',
    urgency: 1,
  },
  answered: {
    label: 'Answered',
    icon: 'MessageCircle',
    badgeBg: 'bg-[#F9EEF0]',
    badgeText: 'text-[#7C2532]',
    borderColor: 'border-[#7C2532]',
    urgency: 0,
  },

  'needs-followup': {
    label: 'Needs Follow-up',
    icon: 'RefreshCw',
    badgeBg: 'bg-[#FBF3DF]',
    badgeText: 'text-[#8A6A16]',
    borderColor: 'border-[#C9A13B]',
    urgency: 2,
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
