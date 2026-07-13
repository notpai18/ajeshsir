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
import { EXAM_STYLES, ExamChip } from '../exam/ExamStyles';



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
            <tr key={v.id} className="block md:table-row relative p-4 md:p-0 bg-white dark:bg-[#1A1817] md:bg-transparent rounded-2xl md:rounded-none border border-[#22201F]/10 dark:border-[#F6F2EA]/10 md:border-none shadow-sm md:shadow-none transition-colors hover:bg-[#FBF7F0] dark:hover:bg-[#2A2726] group">
              <td className="block md:table-cell px-0 py-0 md:px-5 md:py-4 mb-2 md:mb-0">
                <ExamChip course={v.course} label={examTitle(v.course)} />
                <span className="mt-1.5 md:mt-1 block md:inline"><SubjectBadge subject={v.subject} /></span>
              </td>
              <td className="block md:table-cell px-0 py-0 md:px-5 md:py-4 mb-4 md:mb-0">
                <div className="font-semibold text-[#22201F] dark:text-[#F6F2EA]">{v.title}</div>
                <div className="mt-1 text-[13px] text-[#8A7E6F] dark:text-[#A89F91]">{v.chapter}</div>
              </td>
              <td className="inline-block md:table-cell px-0 py-0 md:px-5 md:py-4">
                <span className="md:hidden text-xs uppercase tracking-wider text-[#B3A996] mr-1">Duration:</span>
                <span className="dash-mono text-sm tabular-nums text-[#4A443E] dark:text-[#D1C9BC]">{v.duration}</span>
              </td>
              <td className="inline-block absolute bottom-3 right-4 md:static md:table-cell px-0 py-0 md:px-5 md:py-4">
                <RowActions onEdit={() => openEditVideo(v)} onDelete={() => askDelete('this lecture', () => onDeleteVideo(v.id))} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </ResourceSection>
  );
}
