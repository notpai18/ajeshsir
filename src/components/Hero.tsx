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
    <section className="relative overflow-hidden bg-[#F5F5F7] py-16 md:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Text Content Block */}
          <div className="flex flex-col space-y-6 lg:col-span-7">
            
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-2 bg-[#FFFFFF] border-2 border-[#E5E5EA] px-3 py-1 font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#0071E3]">
                <span className="h-1.5 w-1.5 bg-[#F1E194] animate-pulse" />
                <span>NON-COMMERCIAL DIGITAL LIBRARY</span>
              </span>
            </div>

            <h1 className="text-4xl font-display font-extrabold tracking-tight text-[#1D1D1F] sm:text-5xl md:text-6xl leading-none">
              Free Learning <br />
              <span className="text-[#0071E3]">Resources</span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#86868B]">
              A collection of notes, lectures, practice material and educational resources prepared to help students learn. Curated by Professor Ajesh Joe, to foster true academic excellence.
            </p>

            <div className="pt-4">
              <button
                onClick={onGetStarted}
                className="group flex items-center space-x-2 bg-[#0071E3] px-6 py-3.5 text-sm font-bold text-white uppercase tracking-wider border-2 border-[#005bb5] shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-1 transition-all"
                id="hero-get-started-btn"
              >
                <span>GET STARTED</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Quick stats panel, purely academic */}
            <div className="grid grid-cols-3 gap-6 border-t-2 border-[#E5E5EA] pt-8 mt-8">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-[#86868B]">Curriculums</p>
                <p className="mt-1 text-lg font-display text-[#1D1D1F]">5 Exam Focuses</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-[#86868B]">Material</p>
                <p className="mt-1 text-lg font-display text-[#1D1D1F]">100% Free PDFs</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-[#86868B]">Guidance</p>
                <p className="mt-1 text-lg font-display text-[#1D1D1F]">Doubt Clarification</p>
              </div>
            </div>

          </div>

          {/* Illustration Block */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md">
              
              {/* Outer soft shadow background box */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 bg-gray-200 rounded-xl" />
              
              <div className="relative overflow-hidden rounded-xl border border-[#E5E5EA] bg-[#FFFFFF] p-6 shadow-sm">
                
                {/* Header mimicking a digital terminal page */}
                <div className="flex items-center justify-between border-b-2 border-[#E5E5EA] pb-4">
                  <div className="flex space-x-1.5">
                    <span className="h-2.5 w-2.5 bg-red-500" />
                    <span className="h-2.5 w-2.5 bg-yellow-500" />
                    <span className="h-2.5 w-2.5 bg-green-500" />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#86868B]">
                    matrix_field_theory.ts
                  </span>
                </div>

                {/* Animated vector coordinate graph illustrating a physics problem */}
                <div className="my-8 flex h-48 items-center justify-center rounded-xl bg-gray-50/70 p-4 ">
                  <svg className="h-full w-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Grid Lines */}
                    <line x1="10" y1="60" x2="190" y2="60" stroke="#E2E8F0" strokeWidth="0.5" className="" />
                    <line x1="100" y1="10" x2="100" y2="110" stroke="#E2E8F0" strokeWidth="0.5" className="" />
                    
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
                      className="opacity-50 "
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
                  <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-2.5  ">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-100 text-blue-600  ">
                        <BookOpen size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-800 ">Quantum Wave Mechanics</span>
                        <span className="font-mono text-[9px] text-[#86868B] ">PDF Document • 3.2MB</span>
                      </div>
                    </div>
                    <span className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[9px] text-blue-600  ">Lecture 04</span>
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
