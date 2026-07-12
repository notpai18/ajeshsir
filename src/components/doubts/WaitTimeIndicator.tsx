/**
 * WaitTimeIndicator — colour-coded elapsed-time badge for professor triage view.
 * Colour shifts from neutral → gold → orange → burgundy the longer a doubt waits.
 *
 * Design.md tokens used for all colours.
 */
import React from 'react';
import { Timer } from 'lucide-react';

interface WaitTimeIndicatorProps {
  createdAt: string;
  className?: string;
}

function getElapsedHours(createdAt: string): number {
  return (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
}

function formatElapsed(hours: number): string {
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${Math.floor(hours)}h waiting`;
  const days = Math.floor(hours / 24);
  return `${days}d waiting`;
}

type Urgency = 'fresh' | 'moderate' | 'urgent' | 'critical';

function getUrgency(hours: number): Urgency {
  if (hours < 12) return 'fresh';
  if (hours < 24) return 'moderate';
  if (hours < 48) return 'urgent';
  return 'critical';
}

const URGENCY_STYLES: Record<Urgency, { bg: string; text: string; border: string }> = {
  fresh:    { bg: 'bg-[#F0EDE8]', text: 'text-[#6E645A]', border: 'border-[#D9C2A2]' },
  moderate: { bg: 'bg-[#FBF3D9]', text: 'text-[#8A6A16]', border: 'border-[#C9A13B]/40' },
  urgent:   { bg: 'bg-[#FDE8D0]', text: 'text-[#8A4A16]', border: 'border-[#C97A3B]/40' },
  critical: { bg: 'bg-[#F4E7E5]', text: 'text-[#7C2532]', border: 'border-[#7C2532]/30' },
};

export function WaitTimeIndicator({ createdAt, className = '' }: WaitTimeIndicatorProps) {
  const hours = getElapsedHours(createdAt);
  const urgency = getUrgency(hours);
  const styles = URGENCY_STYLES[urgency];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
        text-[11px] font-[500] leading-none border
        ${styles.bg} ${styles.text} ${styles.border} ${className}
      `}
      title={`Submitted ${formatElapsed(hours)}`}
      aria-label={`Waiting time: ${formatElapsed(hours)}`}
    >
      <Timer size={10} strokeWidth={2.5} aria-hidden="true" />
      <span>{formatElapsed(hours)}</span>
    </span>
  );
}

/** Left-border colour for list cards — used as an inline style on the card */
export function waitTimeBorderColor(createdAt: string): string {
  const h = getElapsedHours(createdAt);
  if (h < 12) return '#D9C2A2';
  if (h < 24) return '#C9A13B';
  if (h < 48) return '#C97A3B';
  return '#7C2532';
}
