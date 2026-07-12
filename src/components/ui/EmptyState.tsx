import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  label: string;
  action?: React.ReactNode;
}

export function EmptyState({ label, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D5C2] bg-[#FBF7F0] dark:bg-[#2A2726] px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]">
        <Search size={22} />
      </div>
      <p className="mt-4 text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA]">Nothing found</p>
      <p className="mt-1 max-w-sm text-sm text-[#8A7E6F] dark:text-[#A89F91]">{label}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
