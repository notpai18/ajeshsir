/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, BookOpen, Quote } from 'lucide-react';
import { PremiumCard } from '../components/PremiumCard';

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
          <div className="flex flex-col space-y-6 lg:col-span-7 animate-[fadeInUp_0.8s_ease-out_forwards]">
            
            <div className="flex items-center space-x-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-[#C9A13B]">
                AJESH JOE SAVIO · CHEMISTRY
              </span>
            </div>

            <h1 className="text-5xl font-serif font-bold tracking-tight text-[#22201F] dark:text-[#F6F2EA] sm:text-6xl md:text-7xl leading-[1.05]">
              Understand<br className="hidden sm:block"/>
              chemistry. Don't<br className="hidden sm:block"/>
              just <span className="relative inline-block text-[#8A7E6F] dark:text-[#A89F91]">
                memorise
                <span className="absolute left-[-5%] right-[-5%] top-[55%] h-[4px] md:h-[6px] bg-[#C9A13B] -translate-y-1/2 opacity-90 rounded-full"></span>
              </span> it.
            </h1>

            <p className="max-w-2xl text-[17px] sm:text-[20px] leading-[1.6] text-[#5A534B] dark:text-[#C7BCAD]">
              A free, rigorous chemistry library for JEE, NEET, CSIR-NET and M.Sc aspirants — concept-first notes, lectures and problem practice from Ajesh Joe Savio.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={onGetStarted}
                className="group flex items-center justify-center bg-[#4A0E1B] hover:bg-[#7C2532] text-white px-8 py-4 text-[15px] font-bold rounded-xl shadow-[0_4px_14px_rgba(74,14,27,0.3)] hover:shadow-[0_6px_20px_rgba(74,14,27,0.4)] hover:-translate-y-0.5 transition-all"
                id="hero-get-started-btn"
              >
                Enter the library
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="group flex items-center justify-center border-2 border-[#D9C2A2]/40 bg-transparent text-[#22201F] dark:text-[#F6F2EA] px-8 py-4 text-[15px] font-bold rounded-xl hover:bg-[#D9C2A2]/10 hover:border-[#D9C2A2] transition-all"
              >
                About the professor
              </button>
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
                  <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#22201F]/60">
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
                  <div className="flex items-center justify-between rounded-xl border border-[#D9C2A2]/20 bg-[#F7F3EC]/50 p-2.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-[#4A0E1B]/8 text-[#4A0E1B] dark:text-[#F4E7E5]">
                        <BookOpen size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA]">Quantum Wave Mechanics</span>
                        <span className="font-mono text-[9px] text-[#22201F]/60">PDF Document • 3.2MB</span>
                      </div>
                    </div>
                    <span className="rounded bg-[#C9A13B]/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#C9A13B]">Lecture 04</span>
                  </div>
                </div>

              </PremiumCard>
            </div>
          </div>

        </div>

        {/* Blockquote Section */}
        <div className="mt-20 md:mt-32 max-w-5xl mx-auto pl-6 md:pl-10 relative animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#C9A13B] rounded-full opacity-80"></div>
          <Quote className="mb-6 text-[#C9A13B] opacity-60 fill-[#C9A13B]" size={42} />
          <p className="font-serif text-[24px] md:text-3xl lg:text-[40px] leading-[1.4] md:leading-[1.4] font-medium text-[#22201F] dark:text-[#F6F2EA]">
            A chemistry problem is simply a mechanism waiting to be written in <span className="text-[#C9A13B]">the elegant language of electrons</span> — our role is to teach students its <span className="text-[#C9A13B]">grammar</span>, so they can write their own solutions.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <div className="h-[2px] w-8 bg-[#C9A13B]"></div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#5A534B] dark:text-[#C7BCAD]">AJESH JOE SAVIO</span>
          </div>
        </div>

      </div>
    </section>
  );
}
