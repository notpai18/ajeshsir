/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { PremiumCard } from './PremiumCard';

interface HeroProps {
  onGetStarted: () => void;
  onNavigate: (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => void;
}

export default function Hero({ onGetStarted, onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F7F3EC] dark:bg-[#1A1817] py-16 md:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Text Content Block */}
          <div className="flex flex-col space-y-6 lg:col-span-7">
            
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-2 bg-white dark:bg-[#22201F] border border-[#D9C2A2]/40 px-3 py-1 font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#C9A13B]">
                <span className="h-1.5 w-1.5 bg-[#C9A13B] rounded-full animate-pulse" />
                <span>NON-COMMERCIAL DIGITAL LIBRARY</span>
              </span>
            </div>

            <h1 className="text-4xl font-serif font-extrabold tracking-tight text-[#22201F] dark:text-[#F6F2EA] sm:text-5xl md:text-6xl leading-none">
              Free Learning <br />
              <span className="text-[#4A0E1B] dark:text-[#F4E7E5]">Resources</span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#22201F] dark:text-[#F6F2EA]/60">
              A collection of notes, lectures, practice material and educational resources prepared to help students learn. Curated by Professor Ajesh Joe, to foster true academic excellence.
            </p>

            <div className="pt-4">
              <button
                onClick={onGetStarted}
                className="group flex items-center space-x-2 bg-[#4A0E1B] hover:bg-[#7C2532] text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-btn shadow-soft-md hover:-translate-y-0.5 duration-200 transition-all border border-[#4A0E1B]"
                id="hero-get-started-btn"
              >
                <span>GET STARTED</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Quick stats panel, purely academic */}
            <div className="grid grid-cols-3 gap-6 border-t border-[#D9C2A2]/30 pt-8 mt-8">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#22201F] dark:text-[#F6F2EA]/60">Curriculums</p>
                <p className="mt-1 text-lg font-semibold font-serif text-[#22201F] dark:text-[#F6F2EA]">5 Exam Focuses</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#22201F] dark:text-[#F6F2EA]/60">Material</p>
                <p className="mt-1 text-lg font-semibold font-serif text-[#22201F] dark:text-[#F6F2EA]">100% Free PDFs</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#22201F] dark:text-[#F6F2EA]/60">Guidance</p>
                <p className="mt-1 text-lg font-semibold font-serif text-[#22201F] dark:text-[#F6F2EA]">Doubt Clarification</p>
              </div>
            </div>

          </div>

          {/* Illustration Block */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md">
              
              {/* Outer soft shadow background box */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#D9C2A2]/10 rounded-[22px]" />
              
              <PremiumCard padding="large" accentLine className="relative overflow-hidden shadow-[0_15px_40px_rgba(74,14,27,0.06)]">
                
                {/* Header mimicking a digital terminal page */}
                <div className="flex items-center justify-between border-b border-[#D9C2A2]/20 pb-4">
                  <div className="flex space-x-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4A0E1B]/30" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#C9A13B]/30" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#7C2532]/30" />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#22201F] dark:text-[#F6F2EA]/60">
                    quantum_wave_theory.ts
                  </span>
                </div>

                {/* Animated vector coordinate graph illustrating a physics problem */}
                <div className="my-8 flex h-48 items-center justify-center rounded-xl bg-[#F7F3EC] dark:bg-[#1A1817] p-4">
                  <svg className="h-full w-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Grid Lines */}
                    <line x1="10" y1="60" x2="190" y2="60" stroke="#D9C2A2" strokeWidth="0.5" className="opacity-40" />
                    <line x1="100" y1="10" x2="100" y2="110" stroke="#D9C2A2" strokeWidth="0.5" className="opacity-40" />
                    
                    {/* Sine/Cosine Waves to look like vector math / field lines */}
                    <path
                      d="M 10,60 C 40,10 70,110 100,60 C 130,10 160,110 190,60"
                      stroke="#4A0E1B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="opacity-80"
                    />
                    
                    <path
                      d="M 10,60 C 40,110 70,10 100,60 C 130,110 160,10 190,60"
                      stroke="#C9A13B"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      className="opacity-60"
                    />

                    {/* Mathematical points */}
                    <circle cx="55" cy="35" r="4" fill="#4A0E1B" className="animate-pulse" />
                    <circle cx="145" cy="85" r="4" fill="#C9A13B" />
                    
                    {/* Labels */}
                    <text x="110" y="20" fill="#22201F" fontSize="6" fontFamily="monospace" className="opacity-50">Ψ(x,t)</text>
                    <text x="10" y="55" fill="#22201F" fontSize="6" fontFamily="monospace" className="opacity-50">x = -L</text>
                    <text x="170" y="55" fill="#22201F" fontSize="6" fontFamily="monospace" className="opacity-50">x = +L</text>
                  </svg>
                </div>

                {/* Simulated file cards at the bottom */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl border border-[#D9C2A2]/20 bg-[#F7F3EC] dark:bg-[#1A1817]/50 p-2.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-[#4A0E1B]/8 text-[#4A0E1B] dark:text-[#F4E7E5]">
                        <BookOpen size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA]">Quantum Wave Mechanics</span>
                        <span className="font-mono text-[9px] text-[#22201F] dark:text-[#F6F2EA]/60">PDF Document • 3.2MB</span>
                      </div>
                    </div>
                    <span className="rounded bg-[#C9A13B]/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#C9A13B]">Lecture 04</span>
                  </div>
                </div>

              </PremiumCard>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
