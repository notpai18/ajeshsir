/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, GraduationCap, MapPin, Building, Calendar, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <section className="bg-[#F5F5F7] py-16 md:py-20 text-[#1D1D1F]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card Header */}
        <div className="flex flex-col items-center gap-8 border-b border-gray-100 pb-12  md:flex-row md:items-start">
          
          {/* Elegant Avatar / Professor Placeholder */}
          <div className="relative h-44 w-44 flex-shrink-0">
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black rounded-lg" />
            <div className="relative flex h-44 w-44 items-center justify-center rounded-lg border-2 border-[#E5E5EA] bg-[#FFFFFF] shadow-none">
              <svg viewBox="0 0 100 100" className="h-28 w-28 text-[#86868B]" fill="currentColor">
                <path d="M50 20c8.28 0 15 6.72 15 15s-6.72 15-15 15-15-6.72-15-15 6.72-15 15-15zm0 35c16.57 0 30 9.4 30 21v4H20v-4c0-11.6 13.43-21 30-21z"/>
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center bg-[#0071E3] border-2 border-[#005bb5] text-[#0071E3] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]">
              <GraduationCap size={18} />
            </div>
          </div>

          {/* Academic Profile Basics */}
          <div className="flex flex-col space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-display font-extrabold tracking-tight text-[#1D1D1F]">
                Prof. Ajesh Joe
              </h2>
              <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.2em] font-black text-[#0071E3]">
                Senior Professor of Chemistry
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-y-2 gap-x-4 text-[10px] font-black uppercase tracking-wider text-[#86868B] md:justify-start">
              <span className="flex items-center gap-1.5 border-2 border-[#E5E5EA] bg-[#FFFFFF] px-2 py-1">
                <Building size={12} className="text-[#0071E3]" />
                <span>Dept. of Chemistry</span>
              </span>
              <span className="flex items-center gap-1.5 border-2 border-[#E5E5EA] bg-[#FFFFFF] px-2 py-1">
                <MapPin size={12} className="text-[#0071E3]" />
                <span>Science Block II, Office 402-B</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed text-[#86868B]">
              Devoted to the study of quantum chemistry, molecular dynamics, and organic synthesis, offering structured, non-commercial self-learning systems for university students and aspirants.
            </p>
          </div>

        </div>

        {/* Biography Block */}
        <div className="mt-12 space-y-12">
          
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold tracking-tight text-[#1D1D1F]">
              Biography
            </h3>
            <p className="text-sm leading-relaxed text-[#86868B]">
              Professor Ajesh Joe completed his Ph.D. in Chemistry from the Indian Institute of Science (IISc), followed by postdoctoral research at the University of Cambridge, UK. Over the last two decades, he has lectured in organic chemistry, physical chemistry, and advanced materials science. 
            </p>
            <p className="text-sm leading-relaxed text-[#86868B]">
              Recognizing the challenges students encounter in bridging foundational theories with high-difficulty problem structures, he started writing these unified note modules, previous year guides, and concept booklets to offer complete, open-access study resources for state and national-level scientific entrances.
            </p>
          </div>

          {/* Teaching Philosophy */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold tracking-tight text-[#1D1D1F]">
              Teaching Philosophy
            </h3>
            <div className="border-l-4 border-[#5B0E14] bg-[#FFFFFF] p-5 shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)]">
              <p className="italic text-sm leading-relaxed text-gray-500">
                "Academic excellence does not rely on memorizing reactions, but rather on developing deep physical intuition and chemical logic. A chemistry problem is simply a mechanism waiting to be written in the elegant language of electrons. Our role as educators is to teach students the grammar of that language, so they can write their own solutions."
              </p>
            </div>
          </div>

          {/* Grid of Interests and Experience */}
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Research Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold tracking-tight text-[#1D1D1F]">
                Research Interests
              </h3>
              <ul className="space-y-3">
                {[
                  'Advanced Organic Synthesis & Reaction Mechanisms',
                  'Quantum Chemistry and Molecular Dynamics',
                  'Solid State Chemistry and Material Science',
                  'Spectroscopic Methods in Chemical Analysis'
                ].map((interest, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center border-2 border-gray-700 bg-[#FFFFFF] text-[#0071E3]">
                      <BookOpen size={10} />
                    </div>
                    <span className="text-sm font-bold text-gray-500">{interest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academic Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold tracking-tight text-[#1D1D1F]">
                Academic Experience
              </h3>
              <ul className="space-y-4 border-l-2 border-[#E5E5EA] ml-2 pl-4">
                {[
                  {
                    year: '2015 - Present',
                    title: 'Senior Professor of Chemistry',
                    place: 'University Science Department'
                  },
                  {
                    year: '2008 - 2015',
                    title: 'Associate Researcher',
                    place: 'National Chemical Laboratory'
                  },
                  {
                    year: '2005 - 2008',
                    title: 'Postdoctoral Fellow',
                    place: 'University of Cambridge, UK'
                  }
                ].map((exp, i) => (
                  <li key={i} className="relative">
                    <div className="absolute -left-[23px] top-1.5 h-3 w-3 border-2 border-[#E5E5EA] bg-[#0071E3]" />
                    <span className="block font-sans text-[9px] uppercase tracking-wider font-black text-[#0071E3]">{exp.year}</span>
                    <span className="mt-1 block font-bold text-gray-200">{exp.title}</span>
                    <span className="mt-0.5 block text-xs text-[#86868B]">{exp.place}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
