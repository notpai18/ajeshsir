/**
 * DoubtStatusBadge — status pill for Doubts moderation workflow.
 *
 * Moderation states:
 *   pending_approval → 🟡 Amber  — Waiting for Approval
 *   approved         → 🔵 Blue   — Approved
 *   rejected         → 🔴 Red    — Rejected
 *   answered         → 🟢 Green  — Answered
 *
 * Legacy states (backward compat):
 *   submitted / awaiting / needs-followup → treated as Waiting
 */
import React from 'react';
import type { DoubtStatus } from '../../types';

const STATUS_CONFIG: Record<
  DoubtStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  // ── New moderation states ──────────────────────────────
  pending_approval: {
    label: 'Waiting for Approval',
    bg: 'bg-[#FBF3D9]',
    text: 'text-[#8A6A16]',
    dot: 'bg-[#C9A13B]',
  },
  approved: {
    label: 'Approved',
    bg: 'bg-[#EAF0FB]',
    text: 'text-[#1A56B0]',
    dot: 'bg-[#3B82F6]',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-[#FDECEA]',
    text: 'text-[#B91C1C]',
    dot: 'bg-[#EF4444]',
  },
  answered: {
    label: 'Answered',
    bg: 'bg-[#E8F5E9]',
    text: 'text-[#2E7D32]',
    dot: 'bg-[#4CAF50]',
  },
  // ── Legacy states (backward compat) ───────────────────
  submitted: {
    label: 'Waiting',
    bg: 'bg-[#FBF3D9]',
    text: 'text-[#8A6A16]',
    dot: 'bg-[#C9A13B]',
  },
  awaiting: {
    label: 'Waiting',
    bg: 'bg-[#FBF3D9]',
    text: 'text-[#8A6A16]',
    dot: 'bg-[#C9A13B]',
  },
  'needs-followup': {
    label: 'Waiting',
    bg: 'bg-[#FBF3D9]',
    text: 'text-[#8A6A16]',
    dot: 'bg-[#C9A13B]',
  },
};

interface DoubtStatusBadgeProps {
  status: DoubtStatus;
  className?: string;
}

export function DoubtStatusBadge({ status, className = '' }: DoubtStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
        text-[11px] font-[600] uppercase tracking-wider
        ${cfg.bg} ${cfg.text} ${className}
      `}
      aria-label={`Status: ${cfg.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
      <span>{cfg.label}</span>
    </span>
  );
}
