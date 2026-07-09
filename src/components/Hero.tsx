/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, BookOpen, GraduationCap, Award, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onGetStarted: () => void;
  onNavigate: (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => void;
}

export default function Hero({ onGetStarted, onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white py-16 dark:bg-slate-900 md:py-24">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-50/50 blur-3xl dark:bg-blue-950/20" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-slate-50/50 blur-3xl dark:bg-slate-800/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Text Content Block */}
          <div className="flex flex-col space-y-6 lg:col-span-7">
            
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 rounded-full bg-blue-50 px-3 py-1 font-mono text-[11px] font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span>NON-COMMERCIAL DIGITAL LIBRARY</span>
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white leading-none">
              Free Learning <br />
              <span className="text-blue-500 dark:text-blue-400">Resources</span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-gray-500 dark:text-slate-400">
              A collection of notes, lectures, practice material and educational resources prepared to help students learn. Curated by Professor Anand Sen, Ph.D., to foster true academic excellence.
            </p>

            <div className="pt-4">
              <button
                onClick={onGetStarted}
                className="group flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/15 active:scale-98 dark:bg-blue-600 dark:hover:bg-blue-500"
                id="hero-get-started-btn"
              >
                <span>GET STARTED</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Quick stats panel, purely academic */}
            <div className="grid grid-cols-3 gap-6 border-t border-gray-100 pt-8 dark:border-slate-800">
              <div>
                <p className="text-xs font-mono tracking-widest text-gray-400 uppercase dark:text-slate-500">Curriculums</p>
                <p className="mt-1 text-lg font-bold text-gray-800 dark:text-slate-200">5 Exam Focuses</p>
              </div>
              <div>
                <p className="text-xs font-mono tracking-widest text-gray-400 uppercase dark:text-slate-500">Material</p>
                <p className="mt-1 text-lg font-bold text-gray-800 dark:text-slate-200">100% Free PDFs</p>
              </div>
              <div>
                <p className="text-xs font-mono tracking-widest text-gray-400 uppercase dark:text-slate-500">Guidance</p>
                <p className="mt-1 text-lg font-bold text-gray-800 dark:text-slate-200">Doubt Clarification</p>
              </div>
            </div>

          </div>

          {/* Illustration Block */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md">
              
              {/* Outer soft shadow background box */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40" />
              
              <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                
                {/* Header mimicking a digital terminal page */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-slate-800">
                  <div className="flex space-x-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="font-mono text-[10px] tracking-wide text-gray-400 uppercase dark:text-slate-500">
                    matrix_field_theory.ts
                  </span>
                </div>

                {/* Animated vector coordinate graph illustrating a physics problem */}
                <div className="my-8 flex h-48 items-center justify-center rounded-xl bg-gray-50/70 p-4 dark:bg-slate-950/40">
                  <svg className="h-full w-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Grid Lines */}
                    <line x1="10" y1="60" x2="190" y2="60" stroke="#E2E8F0" strokeWidth="0.5" className="dark:stroke-slate-800" />
                    <line x1="100" y1="10" x2="100" y2="110" stroke="#E2E8F0" strokeWidth="0.5" className="dark:stroke-slate-800" />
                    
                    {/* Sine/Cosine Waves to look like vector math / field lines */}
                    <path
                      d="M 10,60 C 40,10 70,110 100,60 C 130,10 160,110 190,60"
                      stroke="#3B82F6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="opacity-80"
                    />
                    
                    <path
                      d="M 10,60 C 40,110 70,10 100,60 C 130,110 160,10 190,60"
                      stroke="#64748B"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      className="opacity-50 dark:stroke-slate-500"
                    />

                    {/* Mathematical points */}
                    <circle cx="55" cy="35" r="4" fill="#3B82F6" className="animate-pulse" />
                    <circle cx="145" cy="85" r="4" fill="#10B981" />
                    
                    {/* Labels */}
                    <text x="110" y="20" fill="#94A3B8" fontSize="6" fontFamily="monospace">Ψ(x,t)</text>
                    <text x="10" y="55" fill="#94A3B8" fontSize="6" fontFamily="monospace">x = -L</text>
                    <text x="170" y="55" fill="#94A3B8" fontSize="6" fontFamily="monospace">x = +L</text>
                  </svg>
                </div>

                {/* Simulated file cards at the bottom */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-950/20">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                        <BookOpen size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">Quantum Wave Mechanics</span>
                        <span className="font-mono text-[9px] text-gray-400 dark:text-slate-500">PDF Document • 3.2MB</span>
                      </div>
                    </div>
                    <span className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[9px] text-blue-600 dark:bg-blue-950 dark:text-blue-400">Lecture 04</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
