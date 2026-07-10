/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { ResourceSection, Toolbar, Table, RowActions, ProfEmptyState } from './ui';

import { SubjectBadge } from '../ui/SubjectBadge';
import { PRIMARY_BTN, INPUT } from '../ui/tokens';
import type { ExamInfo, PYQ } from '../../types';
import type { PDFDocumentInfo } from '../pdf/PDFContext';

const EXAM_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'jee-main': { bg: 'bg-[#F4E7E5] dark:bg-[#38151A]', text: 'text-[#4A0E1B]', dot: 'bg-[#4A0E1B]' },
  'jee-advanced': { bg: 'bg-[#F4E2E5]', text: 'text-[#7C2532]', dot: 'bg-[#7C2532]' },
  neet: { bg: 'bg-[#F7EFD9] dark:bg-[#362A0D]', text: 'text-[#8A6A16]', dot: 'bg-[#C9A13B]' },
  net: { bg: 'bg-[#ECE7E0]', text: 'text-[#22201F] dark:text-[#F6F2EA]', dot: 'bg-[#22201F]' },
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

function DifficultyChip({ level }: { level: 'Easy' | 'Medium' | 'Hard' }) {
  const map = {
    Easy: 'bg-[#F7EFD9] dark:bg-[#362A0D] text-[#8A6A16]',
    Medium: 'bg-[#F4E2E5] text-[#7C2532]',
    Hard: 'bg-[#F4E4E4] text-[#4A0E1B]'
  } as const;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${map[level]}`}>{level}</span>;
}

interface PYQSectionProps {
  exams: ExamInfo[];
  pyqs: PYQ[];
  openAddPyq: () => void;
  openEditPyq: (p: PYQ) => void;
  askDelete: (what: string, onConfirm: () => void) => void;
  onDeletePyq: (id: string) => void;
  openPDF: (info: PDFDocumentInfo) => void;
  setPdfDoc: (info: PDFDocumentInfo | null) => void;
}

export function PYQSection({
  exams,
  pyqs,
  openAddPyq,
  openEditPyq,
  askDelete,
  onDeletePyq,
  openPDF,
  setPdfDoc
}: PYQSectionProps) {
  const [query, setQuery] = useState('');
  const [examFilter, setExamFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');

  const pyqsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pyqs.filter((p) => {
      if (examFilter !== 'all' && p.course !== examFilter) return false;
      if (diffFilter !== 'all' && p.difficulty !== diffFilter) return false;
      return !q || [p.chapter, p.subject, String(p.year)].some((f) => f.toLowerCase().includes(q));
    });
  }, [pyqs, examFilter, diffFilter, query]);

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
      title="PYQ sets"
      count={pyqsFiltered.length}
      total={pyqs.length}
      onAdd={openAddPyq}
      addLabel="Add PYQ"
      toolbar={
        <Toolbar
          placeholder="Search by chapter, subject, year…"
          query={query}
          onQuery={setQuery}
          selects={
            <>
              <select className={`${INPUT} sm:w-40`} value={examFilter} onChange={(e) => setExamFilter(e.target.value)}>
                {examOptions}
              </select>
              <select className={`${INPUT} sm:w-36`} value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)}>
                <option value="all">All levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </>
          }
        />
      }
    >
      {pyqsFiltered.length === 0 ? (
        <ProfEmptyState icon={<FileSpreadsheet size={22} />} title="No PYQs here yet" message="Add a previous-year booklet or adjust the filters above." action={<button className={PRIMARY_BTN} onClick={openAddPyq}><Plus size={15} /> Add PYQ</button>} />
      ) : (
        <Table head={['Exam & subject', 'Chapter & year', 'Difficulty', '']}>
          {pyqsFiltered.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726]">
              <td className="px-5 py-3.5">
                <ExamChip course={p.course} label={examTitle(p.course)} />
                <span className="mt-1 block"><SubjectBadge subject={p.subject} /></span>
              </td>
              <td className="px-5 py-3.5">
                <span className="font-semibold text-[#22201F] dark:text-[#F6F2EA]">{p.chapter}</span>
                <span className="dash-mono mt-0.5 block text-xs tabular-nums text-[#8A7E6F] dark:text-[#A89F91]">Year {p.year}</span>
              </td>
              <td className="px-5 py-3.5">
                <DifficultyChip level={p.difficulty as any} />
              </td>
              <td className="px-5 py-3.5">
                <RowActions
                  onView={p.questionUrl ? () => openPDF({ title: `${p.chapter} · ${p.year} (Question)`, fileUrl: p.questionUrl, fileSize: p.questionSize, entityType: 'pyq', entityId: p.id, isProfessor: true, onDelete: () => { askDelete('this PYQ', () => onDeletePyq(p.id)); setPdfDoc(null); } }) : undefined}
                  onEdit={() => openEditPyq(p)}
                  onDelete={() => askDelete('this PYQ', () => onDeletePyq(p.id))}
                />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </ResourceSection>
  );
}
