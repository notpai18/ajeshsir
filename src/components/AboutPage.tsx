/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, GraduationCap, MapPin, Building, Calendar, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <section className="bg-white py-16 dark:bg-slate-900 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card Header */}
        <div className="flex flex-col items-center gap-8 border-b border-gray-100 pb-12 dark:border-slate-800 md:flex-row md:items-start">
          
          {/* Elegant Avatar / Professor Placeholder */}
          <div className="relative h-44 w-44 flex-shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 opacity-10 blur" />
            <div className="flex h-44 w-44 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <svg viewBox="0 0 100 100" className="h-28 w-28 text-gray-400 dark:text-slate-500" fill="currentColor">
                <path d="M50 20c8.28 0 15 6.72 15 15s-6.72 15-15 15-15-6.72-15-15 6.72-15 15-15zm0 35c16.57 0 30 9.4 30 21v4H20v-4c0-11.6 13.43-21 30-21z"/>
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-md dark:bg-blue-600">
              <GraduationCap size={16} />
            </div>
          </div>

          {/* Academic Profile Basics */}
          <div className="flex flex-col space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Prof. Anand Sen, Ph.D.
              </h2>
              <p className="mt-1 font-mono text-xs tracking-wider text-blue-600 uppercase dark:text-blue-400 font-semibold">
                Senior Professor of Mathematical Physics
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-y-2 gap-x-4 text-xs text-gray-500 dark:text-slate-400 md:justify-start">
              <span className="flex items-center gap-1">
                <Building size={14} className="text-gray-400" />
                <span>Dept. of Physics & Applied Mathematics</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-gray-400" />
                <span>Science Block II, Office 402-B</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
              Devoted to the study of quantum dynamics, classical analytical mechanics, and mathematical analysis, offering structured, non-commercial self-learning systems for university students and aspirants.
            </p>
          </div>

        </div>

        {/* Biography Block */}
        <div className="mt-12 space-y-12">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Biography
            </h3>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              Professor Anand Sen completed his Ph.D. in Theoretical Physics from the Indian Institute of Science (IISc), followed by postdoctoral research at the University of Cambridge, UK. Over the last two decades, he has lectured in classical mechanics, electromagnetism, and advanced mathematical physics. 
            </p>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              Recognizing the challenges students encounter in bridging foundational theories with high-difficulty problem structures, he started writing these unified note modules, previous year guides, and concept booklets to offer complete, open-access study resources for state and national-level scientific entrances.
            </p>
          </div>

          {/* Teaching Philosophy */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Teaching Philosophy
            </h3>
            <div className="rounded-xl border-l-4 border-blue-500 bg-gray-50 p-5 dark:border-blue-600 dark:bg-slate-800/40">
              <p className="italic text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                "Academic excellence does not rely on memorizing equations, but rather on developing deep physical intuition and mechanical logic. A physics problem is simply a sentence waiting to be written in the elegant language of calculus. Our role as educators is to teach students the grammar of that language, so they can write their own solutions."
              </p>
            </div>
          </div>

          {/* Grid of Interests and Experience */}
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Research Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Research Interests
              </h3>
              <ul className="space-y-2.5">
                {[
                  'Nonlinear Dynamical Systems & Chaos Theory',
                  'Quantum Field Formulations on Curved Spacetime',
                  'Stochastic Fluid Dynamics and Boundary Solutions',
                  'Computational Methods in Mathematical Analysis'
                ].map((interest, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-500 dark:text-slate-400">
                    <span className="mr-2.5 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500 dark:bg-blue-400" />
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academic Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Academic Experience
              </h3>
              <div className="space-y-4">
                {[
                  {
                    role: 'Senior Professor',
                    institution: 'Dept. of Physics & Applied Mathematics',
                    period: '2015 – Present'
                  },
                  {
                    role: 'Associate Professor',
                    institution: 'Central University of Physical Sciences',
                    period: '2008 – 2015'
                  },
                  {
                    role: 'Assistant Professor / Lecturer',
                    institution: 'State Institute of Technology',
                    period: '2004 – 2008'
                  }
                ].map((exp, i) => (
                  <div key={i} className="flex flex-col border-l border-gray-100 pl-4 dark:border-slate-800">
                    <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">{exp.role}</span>
                    <span className="text-xs text-gray-400 dark:text-slate-500">{exp.institution}</span>
                    <span className="font-mono text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{exp.period}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
