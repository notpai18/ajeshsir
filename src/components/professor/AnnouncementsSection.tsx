/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Megaphone, Plus, Pin, PinOff, Pencil, Trash2 } from 'lucide-react';
import { PremiumCard } from '../PremiumCard';

import { PRIMARY_BTN, ROW_BTN, ROW_BTN_DANGER } from '../ui/tokens';
import { ProfEmptyState } from './ui';
import type { Announcement } from '../../types';

const ANN_CAT = {
  general: { label: 'General Info', cls: 'bg-[#F6F2EA] text-[#6E645A]' },
  exam: { label: 'Exam Update', cls: 'bg-[#F4E4E4] text-[#4A0E1B]' },
  resource: { label: 'New Resource', cls: 'bg-[#F4E7E5] text-[#4A0E1B]' },
  schedule: { label: 'Schedule', cls: 'bg-[#F7EFD9] text-[#8A6A16]' }
} as const;

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  openAddAnnouncement: () => void;
  openEditAnnouncement: (a: Announcement) => void;
  onTogglePinAnnouncement: (id: string) => void;
  askDelete: (what: string, onConfirm: () => void) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export function AnnouncementsSection({
  announcements,
  openAddAnnouncement,
  openEditAnnouncement,
  onTogglePinAnnouncement,
  askDelete,
  onDeleteAnnouncement
}: AnnouncementsSectionProps) {
  const annSorted = useMemo(
    () =>
      [...announcements].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [announcements]
  );

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#8A7E6F] dark:text-[#A89F91]">
          {announcements.length} notice{announcements.length === 1 ? '' : 's'} · pinned ones show first for students
        </p>
        <button className={PRIMARY_BTN} onClick={openAddAnnouncement}>
          <Plus size={15} /> New announcement
        </button>
      </div>

      {annSorted.length === 0 ? (
        <ProfEmptyState icon={<Megaphone size={22} />} title="No announcements yet" message="Post exam dates, new uploads or study tips for your students." action={<button className={PRIMARY_BTN} onClick={openAddAnnouncement}><Plus size={15} /> New announcement</button>} />
      ) : (
        <div className="space-y-4">
          {annSorted.map((a) => (
            <PremiumCard key={a.id} padding="medium" className={a.pinned ? 'ring-1 ring-[#4A0E1B]/15' : ''}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${ANN_CAT[a.category].cls}`}>{ANN_CAT[a.category].label}</span>
                  {a.pinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#4A0E1B]">
                      <Pin size={11} /> Pinned
                    </span>
                  )}
                </div>
                <span className="dash-mono shrink-0 text-[11px] text-[#8A7E6F] dark:text-[#A89F91]">{fmtDate(a.createdAt)}</span>
              </div>
              <h4 className="dash-serif mt-3 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">{a.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD]">{a.body}</p>
              <div className="mt-4 flex items-center gap-1 border-t border-[#F2ECDF] dark:border-[#383330] pt-3">
                <button className={ROW_BTN} onClick={() => onTogglePinAnnouncement(a.id)}>
                  {a.pinned ? <PinOff size={13} /> : <Pin size={13} />} {a.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button className={ROW_BTN} onClick={() => openEditAnnouncement(a)}>
                  <Pencil size={13} /> Edit
                </button>
                <button className={ROW_BTN_DANGER} onClick={() => askDelete('this announcement', () => onDeleteAnnouncement(a.id))}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </PremiumCard>
          ))}
        </div>
      )}
    </div>
  );
}
