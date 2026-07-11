/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ResourcesSection — Additional resources cards (syllabus blueprints, formula sheets).
 * Extracted from StudentDashboardContent (StudentDashboard.tsx).
 */

import React from 'react';
import { FileSpreadsheet, BookOpen, Download } from 'lucide-react';
import { CARD, MICRO, PILL_SOFT } from '../ui/tokens';
import type { ResourcesSectionProps } from './types';

export function ResourcesSection({ currentExamInfo, triggerDownload }: ResourcesSectionProps) {
  return (
    <div>
      <div className="mt-4 mb-8">
        <p className={MICRO}>{currentExamInfo?.title} · Additional resources</p>
        <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Additional resources</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className={`${CARD} flex flex-col p-6`}>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#38151A] text-[#4A0E1B]">
            <FileSpreadsheet size={20} />
          </span>
          <h3 className="dash-serif mt-4 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Syllabus blueprints &amp; topic weights</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
            A mapped matrix of chapter distribution, sub-topic weights and question-occurrence frequencies compiled from the past 10 years of entrance examinations.
          </p>
          <div className="mt-5 flex justify-end">
            <button onClick={() => triggerDownload('syllabus-blueprints.pdf')} className={PILL_SOFT}>
              <Download size={12} /> Download matrix (820 KB)
            </button>
          </div>
        </div>

        <div className={`${CARD} flex flex-col p-6`}>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D] text-[#8A6A16]">
            <BookOpen size={20} />
          </span>
          <h3 className="dash-serif mt-4 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Formula &amp; fundamental constant sheets</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
            A rapid-revision pocket PDF covering electromagnetic vectors, rotational momenta, calculus limits and key physical constants (Planck, Boltzmann, speed of light).
          </p>
          <div className="mt-5 flex justify-end">
            <button onClick={() => triggerDownload('formula-pocket-sheets.pdf')} className={PILL_SOFT}>
              <Download size={12} /> Download sheets (1.4 MB)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
