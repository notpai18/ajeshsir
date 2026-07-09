/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

interface SelectionPageProps {
  onSelectRole: (role: 'student' | 'professor') => void;
}

export default function SelectionPage({ onSelectRole }: SelectionPageProps) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-gray-50/50 py-16 dark:bg-slate-900/50">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center">
          <p className="font-mono text-xs font-semibold tracking-widest text-blue-600 uppercase dark:text-blue-400">
            Secure Portal Selection
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Who are you?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 dark:text-slate-400">
            Please choose your role to proceed to the designated section of the digital library portal.
          </p>
        </div>

        {/* Dual Card Layout */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          
          {/* Student Card */}
          <div
            onClick={() => onSelectRole('student')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            id="role-card-student"
          >
            {/* Top Icon Area */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:group-hover:bg-blue-900/40">
              <BookOpen size={22} />
            </div>

            {/* Typography */}
            <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
              Student
            </h3>
            <p className="mt-2.5 text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              Access learning resources. Browse comprehensive physics, mathematics, and science sheets, notes, video lectures, and previous year papers.
            </p>

            {/* Bottom Action Hint */}
            <div className="mt-8 flex items-center space-x-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Enter Repository</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Professor Card */}
          <div
            onClick={() => onSelectRole('professor')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            id="role-card-professor"
          >
            {/* Top Icon Area */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-700">
              <ShieldCheck size={22} />
            </div>

            {/* Typography */}
            <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
              Professor
            </h3>
            <p className="mt-2.5 text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              Manage educational resources. Add, update, or remove notes, lectures, previous year solutions, practice worksheets, and answer student queries.
            </p>

            {/* Bottom Action Hint */}
            <div className="mt-8 flex items-center space-x-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Access Dashboard</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

        </div>

        {/* Minimal academic note */}
        <div className="mt-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Open-access educational model • No authentication or credit cards required
          </p>
        </div>

      </div>
    </section>
  );
}
