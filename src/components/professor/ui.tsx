/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reusable UI components for the Professor Dashboard sections.
 */

import React from 'react';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { PremiumCard } from '../PremiumCard';

export const INPUT = 'w-full rounded-input border border-[#22201F]/20 bg-white dark:bg-[#22201F] px-3.5 py-2.5 text-sm text-[#22201F] dark:text-[#F6F2EA] placeholder:text-[#8A7E6F] dark:placeholder:text-[#F6F2EA]/50 outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10';
const PRIMARY_BTN = 'inline-flex items-center justify-center gap-2 rounded-btn bg-[#4A0E1B] hover:bg-[#7C2532] px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-all shadow-soft-sm hover:-translate-y-0.5 duration-200 disabled:opacity-50';

export function ResourceSection({
  title,
  count,
  total,
  onAdd,
  addLabel,
  toolbar,
  children
}: {
  title: string;
  count: number;
  total: number;
  onAdd: () => void;
  addLabel: string;
  toolbar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#8A7E6F] dark:text-[#A89F91]">
          <span className="font-semibold text-[#22201F] dark:text-[#F6F2EA]">{count}</span>
          {count === total ? '' : ` of ${total}`} {title}
        </p>
        <button className={PRIMARY_BTN} onClick={onAdd}>
          <Plus size={15} /> {addLabel}
        </button>
      </div>
      {toolbar}
      {children}
    </div>
  );
}

export function Toolbar({
  placeholder,
  query,
  onQuery,
  selects
}: {
  placeholder: string;
  query: string;
  onQuery: (v: string) => void;
  selects: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B3A996]" />
        <input className={`${INPUT} pl-10`} placeholder={placeholder} value={query} onChange={(e) => onQuery(e.target.value)} />
      </div>
      {selects}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-visible md:overflow-x-auto rounded-[20px] md:border border-[#22201F]/10 dark:border-[#F6F2EA]/10 md:bg-white md:dark:bg-[#1A1817] md:shadow-soft-sm overflow-hidden">
      <table className="block md:table w-full md:min-w-[640px] text-left text-sm border-collapse">
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-[#22201F]/15 dark:border-[#F6F2EA]/10 bg-[#FBF7F0] dark:bg-[#2A2726]">
            {head.map((h, i) => (
              <th key={i} className={`px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A7E6F] dark:text-[#A89F91] ${i === head.length - 1 ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group md:divide-y divide-[#F2ECDF] dark:divide-[#F6F2EA]/10 space-y-4 md:space-y-0">{children}</tbody>
      </table>
    </div>
  );
}

export function RowActions({ onView, onEdit, onDelete }: { onView?: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1.5 md:gap-1">
      {onView && (
        <button onClick={onView} className="flex items-center justify-center rounded-lg p-3 md:p-2 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F4E7E5] dark:hover:bg-[#38151A] hover:text-[#4A0E1B]" aria-label="View PDF">
          <Eye size={17} className="md:w-[15px] md:h-[15px]" />
        </button>
      )}
      <button onClick={onEdit} className="flex items-center justify-center rounded-lg p-3 md:p-2 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F4E7E5] dark:hover:bg-[#38151A] hover:text-[#4A0E1B]" aria-label="Edit">
        <Pencil size={17} className="md:w-[15px] md:h-[15px]" />
      </button>
      <button onClick={onDelete} className="flex items-center justify-center rounded-lg p-3 md:p-2 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 text-[#8A7E6F] dark:text-[#A89F91] transition-colors hover:bg-[#F6E5E1] dark:hover:bg-[#38151A] hover:text-[#B23B2E] dark:hover:text-[#ff6b5c]" aria-label="Delete">
        <Trash2 size={17} className="md:w-[15px] md:h-[15px]" />
      </button>
    </div>
  );
}

export function ProfEmptyState({
  icon,
  title,
  message,
  action
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] dark:bg-[#2A2726] px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]">{icon}</div>
      <h4 className="dash-serif mt-4 text-base font-semibold text-[#22201F] dark:text-[#F6F2EA]">{title}</h4>
      <p className="mt-1 max-w-sm text-sm text-[#8A7E6F] dark:text-[#A89F91]">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
