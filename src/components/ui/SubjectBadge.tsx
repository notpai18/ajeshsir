/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SubjectBadge — shared primitive UI component.
 * Renders a coloured pill badge for a given chemistry subject.
 */

import React from 'react';
import { SUBJECT_BADGE } from '../../constants/subjects';

interface SubjectBadgeProps {
  subject: string;
}

export function SubjectBadge({ subject }: SubjectBadgeProps) {
  const s = SUBJECT_BADGE[subject as keyof typeof SUBJECT_BADGE];
  if (!s)
    return (
      <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
        {subject}
      </span>
    );
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.emoji} {s.label}
    </span>
  );
}
