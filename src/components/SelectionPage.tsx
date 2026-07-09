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
    <section className="flex min-h-[70vh] items-center justify-center bg-[#111112] py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center">
          <p className="font-sans text-[9px] font-black tracking-[0.2em] text-[#F1E194] uppercase">
            Secure Portal Selection
          </p>
          <h2 className="mt-2 text-3xl font-display font-extrabold tracking-tight text-white sm:text-4xl">
            Who are you?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-400">
            Please choose your role to proceed to the designated section of the digital library portal.
          </p>
        </div>

        {/* Dual Card Layout */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          
          {/* Student Card */}
          <div
            onClick={() => onSelectRole('student')}
            className="group relative cursor-pointer rounded-[12px] bg-[#1c1c1e] p-8 transition-all duration-300 hover:bg-[#232325] hover:-translate-y-1 hover:rotate-1 shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-0"
            id="role-card-student"
          >
            {/* Top Icon Area */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111112] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-colors">
              <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Graduation%20Cap.png" alt="Student" className="h-8 w-8 drop-shadow-sm" />
            </div>

            {/* Typography */}
            <h3 className="mt-6 text-xl font-display font-bold text-white">
              Student
            </h3>
            <p className="mt-2.5 text-sm text-gray-400 leading-relaxed">
              Access learning resources. Browse comprehensive chemistry concepts, notes, video lectures, and previous year papers.
            </p>

            {/* Bottom Action Hint */}
            <div className="mt-8 flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-black text-[#F1E194] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
              <span>Enter Repository</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Professor Card */}
          <div
            onClick={() => onSelectRole('professor')}
            className="group relative cursor-pointer rounded-[12px] bg-[#1c1c1e] p-8 transition-all duration-300 hover:bg-[#232325] hover:-translate-y-1 hover:-rotate-1 shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-0"
            id="role-card-professor"
          >
            {/* Top Icon Area */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111112] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-colors">
              <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Briefcase.png" alt="Professor" className="h-8 w-8 drop-shadow-sm" />
            </div>

            {/* Typography */}
            <h3 className="mt-6 text-xl font-display font-bold text-white">
              Professor
            </h3>
            <p className="mt-2.5 text-sm text-gray-400 leading-relaxed">
              Manage educational resources. Add, update, or remove notes, lectures, previous year solutions, practice worksheets, and answer student queries.
            </p>

            {/* Bottom Action Hint */}
            <div className="mt-8 flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-black text-red-500 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
              <span>Access Dashboard</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

        </div>

        {/* Minimal academic note */}
        <div className="mt-10 text-center">
          <p className="font-sans text-[9px] uppercase tracking-wider text-gray-500 font-black">
            Open-access educational model • No authentication or credit cards required
          </p>
        </div>

      </div>
    </section>
  );
}
