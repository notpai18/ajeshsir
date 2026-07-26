/**
 * DoubtStatusBadge — status pill for Doubts moderation workflow.
 *
 * States:
 *   pending  → 🟡 Amber  — Pending Review
 *   approved → 🔵 Blue   — Approved
 *   rejected → 🔴 Red    — Rejected
 *   answered → 🟢 Green  — Answered
 */
import React from 'react';
import type { DoubtStatus } from '../../types';

const STATUS_CONFIG: Record<
  DoubtStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: 'Pending Review',
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
};

interface DoubtStatusBadgeProps {
  status: DoubtStatus;
  className?: string;
}

export function DoubtStatusBadge({ status, className = '' }: DoubtStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['pending'];

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
