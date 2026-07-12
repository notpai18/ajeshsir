/**
 * DoubtStatusBadge — simplified status pill for Doubts & FAQ.
 *
 * Colors:
 *   Answered -> Soft green
 *   Waiting  -> Warm gold
 *   Closed   -> Gray
 */
import React from 'react';
import type { DoubtStatus } from '../../types';

const STATUS_CONFIG: Record<
  DoubtStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
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
