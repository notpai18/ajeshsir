/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { ResourceSection, Toolbar, Table, RowActions, ProfEmptyState } from './ui';

import { SubjectBadge } from '../ui/SubjectBadge';
import { PRIMARY_BTN, INPUT } from '../ui/tokens';
import type { ExamInfo, PracticeSheet } from '../../types';
import type { PDFDocumentInfo } from '../pdf/PDFContext';

const EXAM_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'jee-main': { bg: 'bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#38151A]', text: 'text-[#4A0E1B]', dot: 'bg-[#4A0E1B]' },
  'jee-advanced': { bg: 'bg-[#F4E2E5]', text: 'text-[#7C2532]', dot: 'bg-[#7C2532]' },
  neet: { bg: 'bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D]', text: 'text-[#8A6A16]', dot: 'bg-[#C9A13B]' },
  net: { bg: 'bg-[#ECE7E0]', text: 'text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]', dot: 'bg-[#22201F]' },
  'msc-entrance': { bg: 'bg-[#EFE7D8]', text: 'text-[#6E5A2E]', dot: 'bg-[#C4A87F]' }
};

function ExamChip({ course, label }: { course: string; label: string }) {
  const s = EXAM_STYLES[course] ?? EXAM_STYLES['jee-main'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

interface SheetsSectionProps {
  exams: ExamInfo[];
  practiceSheets: PracticeSheet[];
  openAddSheet: () => void;
  openEditSheet: (s: PracticeSheet) => void;
  askDelete: (what: string, onConfirm: () => void) => void;
  onDeletePracticeSheet: (id: string) => void;
  openPDF: (info: PDFDocumentInfo) => void;
  setPdfDoc: (info: PDFDocumentInfo | null) => void;
}

export function SheetsSection({
  exams,
  practiceSheets,
  openAddSheet,
  openEditSheet,
  askDelete,
  onDeletePracticeSheet,
  openPDF,
  setPdfDoc
}: SheetsSectionProps) {
  const [query, setQuery] = useState('');
  const [examFilter, setExamFilter] = useState('all');

  const sheetsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return practiceSheets.filter((s) => {
      if (examFilter !== 'all' && s.course !== examFilter) return false;
      return !q || [s.title, s.chapter, s.subject].some((f) => f.toLowerCase().includes(q));
    });
  }, [practiceSheets, examFilter, query]);

  const examTitle = (id: string) => exams.find((e) => e.id === id)?.title ?? id;

  const examOptions = (
    <>
      <option value="all">All exams</option>
      {exams.map((e) => (
        <option key={e.id} value={e.id}>
          {e.title}
        </option>
      ))}
    </>
  );

  return (
    <ResourceSection
      title="sheets"
      count={sheetsFiltered.length}
      total={practiceSheets.length}
      onAdd={openAddSheet}
      addLabel="Add sheet"
      toolbar={
        <Toolbar
          placeholder="Search sheets, chapters, subjects…"
          query={query}
          onQuery={setQuery}
          selects={
            <select className={`${INPUT} sm:w-44`} value={examFilter} onChange={(e) => setExamFilter(e.target.value)}>
              {examOptions}
            </select>
          }
        />
      }
    >
      {sheetsFiltered.length === 0 ? (
        <ProfEmptyState icon={<ClipboardList size={22} />} title="No practice sheets yet" message="Add a drill or adjust the filters above." action={<button className={PRIMARY_BTN} onClick={openAddSheet}><Plus size={15} /> Add sheet</button>} />
      ) : (
        <Table head={['Exam & subject', 'Title', 'Chapter', '']}>
          {sheetsFiltered.map((s) => (
            <tr key={s.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726] dark:bg-[#2A2726]">
              <td className="px-5 py-3.5">
                <ExamChip course={s.course} label={examTitle(s.course)} />
                <span className="mt-1 block"><SubjectBadge subject={s.subject} /></span>
              </td>
              <td className="px-5 py-3.5 font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">{s.title}</td>
              <td className="px-5 py-3.5 text-sm text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">{s.chapter}</td>
              <td className="px-5 py-3.5">
                <RowActions
                  onView={s.fileUrl ? () => openPDF({ title: s.title, fileUrl: s.fileUrl, fileSize: s.fileSize, entityType: 'sheet', entityId: s.id, isProfessor: true, onDelete: () => { askDelete('this sheet', () => onDeletePracticeSheet(s.id)); setPdfDoc(null); } }) : undefined}
                  onEdit={() => openEditSheet(s)}
                  onDelete={() => askDelete('this sheet', () => onDeletePracticeSheet(s.id))}
                />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </ResourceSection>
  );
}
