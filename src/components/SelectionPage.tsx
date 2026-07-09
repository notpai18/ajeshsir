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
    <section className="flex min-h-[70vh] items-center justify-center bg-[#F5F5F7] py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center">
          <p className="font-sans text-[9px] font-black tracking-[0.2em] text-[#0071E3] uppercase">
            Secure Portal Selection
          </p>
          <h2 className="mt-2 text-3xl font-display font-extrabold tracking-tight text-[#1D1D1F] sm:text-4xl">
            Who are you?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#86868B]">
            Please choose your role to proceed to the designated section of the digital library portal.
          </p>
        </div>

        {/* Dual Card Layout */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          
          {/* Student Card */}
          <div
            onClick={() => onSelectRole('student')}
            className="group relative cursor-pointer rounded-[12px] bg-[#FFFFFF] p-8 transition-all duration-300 hover:bg-[#F5F5F7] hover:-translate-y-1 hover:rotate-1 shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-0"
            id="role-card-student"
          >
            {/* Top Icon Area */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F5F7] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-colors">
              <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Graduation%20Cap.png" alt="Student" className="h-8 w-8 drop-shadow-sm" />
            </div>

            {/* Typography */}
            <h3 className="mt-6 text-xl font-display font-bold text-[#1D1D1F]">
              Student
            </h3>
            <p className="mt-2.5 text-sm text-[#86868B] leading-relaxed">
              Access learning resources. Browse comprehensive chemistry concepts, notes, video lectures, and previous year papers.
            </p>

            {/* Bottom Action Hint */}
            <div className="mt-8 flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-black text-[#0071E3] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
              <span>Enter Repository</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Professor Card */}
          <div
            onClick={() => onSelectRole('professor')}
            className="group relative cursor-pointer rounded-[12px] bg-[#FFFFFF] p-8 transition-all duration-300 hover:bg-[#F5F5F7] hover:-translate-y-1 hover:-rotate-1 shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-0"
            id="role-card-professor"
          >
            {/* Top Icon Area */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F5F7] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] transition-colors">
              <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Briefcase.png" alt="Professor" className="h-8 w-8 drop-shadow-sm" />
            </div>

            {/* Typography */}
            <h3 className="mt-6 text-xl font-display font-bold text-[#1D1D1F]">
              Professor
            </h3>
            <p className="mt-2.5 text-sm text-[#86868B] leading-relaxed">
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
          <p className="font-sans text-[9px] uppercase tracking-wider text-[#86868B] font-black">
            Open-access educational model • No authentication or credit cards required
          </p>
        </div>

      </div>
    </section>
  );
}
