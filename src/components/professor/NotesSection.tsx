/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FileText, Plus, Download } from 'lucide-react';
import { ResourceSection, Toolbar, Table, RowActions, ProfEmptyState } from './ui';

import { SubjectBadge } from '../ui/SubjectBadge';
import { PRIMARY_BTN, INPUT } from '../ui/tokens';
import type { ExamInfo, Note } from '../../types';
import type { PDFDocumentInfo } from '../pdf/PDFContext';
import { EXAM_STYLES, ExamChip } from '../exam/ExamStyles';



interface NotesSectionProps {
  exams: ExamInfo[];
  notes: Note[];
  openAddNote: () => void;
  openEditNote: (n: Note) => void;
  askDelete: (what: string, onConfirm: () => void) => void;
  onDeleteNote: (id: string) => void;
  openPDF: (info: PDFDocumentInfo) => void;
}

export function NotesSection({
  exams,
  notes,
  openAddNote,
  openEditNote,
  askDelete,
  onDeleteNote,
  openPDF
}: NotesSectionProps) {
  const [query, setQuery] = useState('');
  const [examFilter, setExamFilter] = useState('all');

  const notesFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      if (examFilter !== 'all' && n.course !== examFilter) return false;
      return !q || [n.title, n.chapter, n.subject].some((f) => f.toLowerCase().includes(q));
    });
  }, [notes, examFilter, query]);

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
      title="notes"
      count={notesFiltered.length}
      total={notes.length}
      onAdd={openAddNote}
      addLabel="Add note"
      toolbar={
        <Toolbar
          placeholder="Search notes, chapters, subjects…"
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
      {notesFiltered.length === 0 ? (
        <ProfEmptyState icon={<FileText size={22} />} title="No notes here yet" message="Add your first study note or adjust the filters above." action={<button className={PRIMARY_BTN} onClick={openAddNote}><Plus size={15} /> Add note</button>} />
      ) : (
        <Table head={['Exam & subject', 'Title & chapter', 'Downloads', '']}>
          {notesFiltered.map((n) => (
            <tr key={n.id} className="block md:table-row relative p-4 md:p-0 bg-white dark:bg-[#1A1817] md:bg-transparent rounded-2xl md:rounded-none border border-[#22201F]/10 dark:border-[#F6F2EA]/10 md:border-none shadow-sm md:shadow-none transition-colors hover:bg-[#FBF7F0] dark:hover:bg-[#2A2726] group">
              <td className="block md:table-cell px-0 py-0 md:px-5 md:py-4 mb-2 md:mb-0">
                <ExamChip course={n.course} label={examTitle(n.course)} />
                <span className="mt-1.5 md:mt-1 block md:inline"><SubjectBadge subject={n.subject} /></span>
              </td>
              <td className="block md:table-cell px-0 py-0 md:px-5 md:py-4 mb-4 md:mb-0">
                <div className="font-semibold text-[#22201F] dark:text-[#F6F2EA]">{n.title}</div>
                <div className="mt-1 text-[13px] text-[#8A7E6F] dark:text-[#A89F91]">{n.chapter}</div>
              </td>
              <td className="inline-block md:table-cell px-0 py-0 md:px-5 md:py-4 text-sm text-[#8A7E6F] dark:text-[#A89F91]">
                <span className="md:hidden text-xs uppercase tracking-wider text-[#B3A996] mr-1">Downloads:</span>
                <span className="dash-mono inline-flex items-center gap-1.5 text-sm font-medium tabular-nums text-[#4A443E] dark:text-[#D1C9BC]">
                  <Download size={13} className="text-[#8A6A16]" />
                  {n.downloadCount.toLocaleString()}
                </span>
              </td>
              <td className="inline-block absolute bottom-3 right-4 md:static md:table-cell px-0 py-0 md:px-5 md:py-4">
                <RowActions
                  onView={n.fileUrl ? () => openPDF({ title: n.title, fileUrl: n.fileUrl, fileSize: n.fileSize, entityType: 'note', entityId: n.id, isProfessor: true, downloadCount: n.downloadCount, onDelete: () => { askDelete('this note', () => onDeleteNote(n.id)); } }) : undefined}
                  onEdit={() => openEditNote(n)}
                  onDelete={() => askDelete('this note', () => onDeleteNote(n.id))}
                />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </ResourceSection>
  );
}
