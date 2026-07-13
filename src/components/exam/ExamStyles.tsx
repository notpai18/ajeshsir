import React from 'react';

export const EXAM_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'jee-main': { bg: 'bg-[#F4E7E5] dark:bg-[#38151A]', text: 'text-[#4A0E1B] dark:text-[#F4E7E5]', dot: 'bg-[#4A0E1B]' },
  'jee-advanced': { bg: 'bg-[#F4E2E5] dark:bg-[#3D1A20]', text: 'text-[#7C2532] dark:text-[#F4E2E5]', dot: 'bg-[#7C2532]' },
  neet: { bg: 'bg-[#F7EFD9] dark:bg-[#362A0D]', text: 'text-[#8A6A16] dark:text-[#E8CD82]', dot: 'bg-[#C9A13B]' },
  net: { bg: 'bg-[#ECE7E0] dark:bg-[#383330]', text: 'text-[#22201F] dark:text-[#F6F2EA]', dot: 'bg-[#4A0E1B]' },
  'msc-entrance': { bg: 'bg-[#EFE7D8] dark:bg-[#4A4541]', text: 'text-[#6E5A2E] dark:text-[#E8CD82]', dot: 'bg-[#C4A87F]' }
};

export const EXAM_LABELS: Record<string, string> = {
  'jee-main': 'JEE Main',
  'jee-advanced': 'JEE Advanced',
  neet: 'NEET',
  net: 'CSIR NET',
  'msc-entrance': 'M.Sc Entrance',
};

export function ExamChip({ course, label }: { course: string; label: string }) {
  const s = EXAM_STYLES[course] ?? EXAM_STYLES['jee-main'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}
