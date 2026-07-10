/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Video as VideoIcon, Plus } from 'lucide-react';
import { ResourceSection, Toolbar, Table, RowActions, ProfEmptyState } from './ui';

import { SubjectBadge } from '../ui/SubjectBadge';
import { PRIMARY_BTN, INPUT } from '../ui/tokens';
import type { ExamInfo, Video } from '../../types';

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

interface VideosSectionProps {
  exams: ExamInfo[];
  videos: Video[];
  openAddVideo: () => void;
  openEditVideo: (v: Video) => void;
  askDelete: (what: string, onConfirm: () => void) => void;
  onDeleteVideo: (id: string) => void;
}

export function VideosSection({
  exams,
  videos,
  openAddVideo,
  openEditVideo,
  askDelete,
  onDeleteVideo
}: VideosSectionProps) {
  const [query, setQuery] = useState('');
  const [examFilter, setExamFilter] = useState('all');

  const videosFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      if (examFilter !== 'all' && v.course !== examFilter) return false;
      return !q || [v.title, v.chapter, v.subject].some((f) => f.toLowerCase().includes(q));
    });
  }, [videos, examFilter, query]);

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
      title="lectures"
      count={videosFiltered.length}
      total={videos.length}
      onAdd={openAddVideo}
      addLabel="Add lecture"
      toolbar={
        <Toolbar
          placeholder="Search lectures, chapters, subjects…"
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
      {videosFiltered.length === 0 ? (
        <ProfEmptyState icon={<VideoIcon size={22} />} title="No lectures here yet" message="Publish a video lecture or adjust the filters above." action={<button className={PRIMARY_BTN} onClick={openAddVideo}><Plus size={15} /> Add lecture</button>} />
      ) : (
        <Table head={['Exam & subject', 'Lecture & chapter', 'Duration', '']}>
          {videosFiltered.map((v) => (
            <tr key={v.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726]">
              <td className="px-5 py-3.5">
                <ExamChip course={v.course} label={examTitle(v.course)} />
                <span className="mt-1 block"><SubjectBadge subject={v.subject} /></span>
              </td>
              <td className="px-5 py-3.5">
                <span className="font-semibold text-[#22201F] dark:text-[#F6F2EA]">{v.title}</span>
                <span className="mt-0.5 block text-xs text-[#8A7E6F] dark:text-[#A89F91]">{v.chapter}</span>
              </td>
              <td className="px-5 py-3.5">
                <span className="dash-mono text-sm tabular-nums text-[#4A443E]">{v.duration}</span>
              </td>
              <td className="px-5 py-3.5">
                <RowActions onEdit={() => openEditVideo(v)} onDelete={() => askDelete('this lecture', () => onDeleteVideo(v.id))} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </ResourceSection>
  );
}
