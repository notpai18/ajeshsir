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
            <tr key={v.id} className="transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726] dark:bg-[#2A2726]">
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
