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
      {/* Subtle Chemistry Hexagon Background Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.923' viewBox='0 0 60 103.923' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 17.32l15 8.66v17.32l-15 8.66l-15-8.66v-17.32l15-8.66zm0-2l-16.732 9.66v19.32l16.732 9.66l16.732-9.66v-19.32l-16.732-9.66zm0 51.961l15 8.66v17.32l-15 8.66l-15-8.66v-17.32l15-8.66zm0-2l-16.732 9.66v19.32l16.732 9.66l16.732-9.66v-19.32l-16.732-9.66zm30-23.98l15 8.66v17.32l-15 8.66l-15-8.66v-17.32l15-8.66zm0-2l-16.732 9.66v19.32l16.732 9.66l16.732-9.66v-19.32l-16.732-9.66zm-60 0l15 8.66v17.32l-15 8.66l-15-8.66v-17.32l15-8.66zm0-2l-16.732 9.66v19.32l16.732 9.66l16.732-9.66v-19.32l-16.732-9.66z' fill='%234A0E1B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '60px 103.923px' }}></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Text Content Block */}
          <div className="flex flex-col space-y-6 lg:col-span-7 animate-[fadeInUp_0.8s_ease-out_forwards]">
            
            <div className="flex items-center space-x-2">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-[#C9A13B]">
                AJESH JOE SAVIO · CHEMISTRY
              </span>
            </div>

            <h1 className="text-5xl font-sans font-bold tracking-tight text-[#22201F] dark:text-[#F6F2EA] sm:text-6xl md:text-7xl leading-[1.05]">
              <span className="italic font-semibold text-[#4A0E1B] dark:text-[#E8CD82] tracking-normal" style={{ fontFamily: '"Caveat", cursive', fontSize: '1.2em', lineHeight: '0.8' }}>Understand</span><br className="hidden sm:block"/>
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
                className="group flex items-center justify-center bg-[#22201F] hover:bg-[#3A342E] dark:bg-[#3A342E] dark:hover:bg-[#4A433E] text-[#F7F3EC] px-8 py-4 text-[15px] font-bold rounded-xl shadow-[0_4px_14px_rgba(34,32,31,0.2)] hover:shadow-[0_6px_20px_rgba(34,32,31,0.3)] hover:-translate-y-0.5 transition-all"
              >
                About the professor
              </button>
            </div>

          </div>

          {/* Professional Library Card Block */}
          <div className="flex justify-center lg:col-span-5 relative">
            <div className="relative w-full max-w-md">
              <PremiumCard padding="large" className="relative overflow-hidden bg-white dark:bg-[#22201F] shadow-[0_20px_50px_rgba(74,14,27,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                
                {/* Decorative blurs */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C9A13B]/20 blur-2xl dark:bg-[#C9A13B]/10"></div>
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#4A0E1B]/20 blur-2xl dark:bg-[#4A0E1B]/10"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4A0E1B] to-[#7C2532] text-[#F4E7E5] shadow-sm">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h3 className="font-serif text-[19px] font-bold text-[#22201F] dark:text-[#F6F2EA] leading-tight">Digital Library</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A7E6F] mt-0.5">Verified Resources</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-[#C9A13B]/30 bg-[#C9A13B]/10 px-3 py-1 text-[10px] font-bold tracking-widest text-[#8A6A16] dark:text-[#E8CD82] uppercase">Free</span>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { title: 'Organic Chemistry', desc: 'Reaction Mechanisms & Synthesis', modules: '12 Modules' },
                      { title: 'Physical Chemistry', desc: 'Quantum Mechanics & Thermodynamics', modules: '8 Modules' },
                      { title: 'Inorganic Chemistry', desc: 'Coordination Compounds & Elements', modules: '10 Modules' }
                    ].map((item, i) => (
                      <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#D9C2A2]/30 dark:border-[#4A433E] bg-[#F7F3EC]/50 dark:bg-[#1A1817]/50 p-4 transition-all hover:bg-[#F7F3EC] dark:hover:bg-[#1A1817] hover:border-[#C9A13B]/40 hover:shadow-sm cursor-default">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-[#22201F] dark:text-[#F6F2EA]">{item.title}</span>
                          <span className="text-[12px] font-medium text-[#8A7E6F] dark:text-[#A89F91] mt-0.5">{item.desc}</span>
                        </div>
                        <span className="inline-flex w-fit items-center font-mono text-[10px] font-semibold text-[#4A0E1B] dark:text-[#F4E7E5] bg-[#4A0E1B]/5 dark:bg-[#4A0E1B]/40 px-2 py-1 rounded border border-[#4A0E1B]/10 dark:border-transparent">{item.modules}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </PremiumCard>
            </div>
          </div>

        </div>

        {/* Blockquote Section */}
        <div className="mt-20 md:mt-32 max-w-5xl mx-auto animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="relative overflow-hidden rounded-2xl border border-[#EAD9C0] dark:border-[#4A433E] bg-gradient-to-br from-[#F6EBE6] to-[#F3EAD8] dark:from-[#2A2624] dark:to-[#221F1E] p-8 sm:p-12 md:p-16 shadow-[0_8px_30px_rgba(74,14,27,0.04)]">
            <Quote className="pointer-events-none absolute -right-4 -top-2 text-[#4A0E1B]/10 dark:text-[#F4E7E5]/5" size={180} strokeWidth={1.5} />
            <p className="font-serif relative max-w-4xl text-[22px] md:text-3xl lg:text-4xl leading-[1.6] md:leading-[1.6] font-medium text-[#3A2A22] dark:text-[#EAE1D2]">
              “Academic excellence does not rely on memorising reactions, but on developing deep physical intuition and chemical logic. A chemistry problem is simply a mechanism waiting to be written in the elegant language of electrons — our role is to teach students its grammar, so they can write their own solutions.”
            </p>
            <div className="relative mt-10 flex items-center gap-4">
              <span className="h-[2px] w-10 bg-[#4A0E1B]/40 dark:bg-[#C9A13B]/40" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A6A16] dark:text-[#E8CD82]">AJESH JOE SAVIO</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
