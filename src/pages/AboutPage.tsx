/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  Building2,
  MapPin,
  CalendarClock,
  BookOpen,
  Sparkles,
  Quote,
  FlaskConical,
  Atom,
  Layers,
  Waves,
  ArrowRight
} from 'lucide-react';

/* Design tokens — shared "Professor's Study" system (see DESIGN_SYSTEM.md) */
const CARD =
  'rounded-2xl border border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#383330] bg-white dark:bg-[#22201F] shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F] dark:text-[#A89F91]';

type View = 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact';

interface AboutPageProps {
  onNavigate?: (view: View) => void;
}

const FACTS = [
  { icon: <CalendarClock size={17} />, value: '12+', label: 'Years teaching' },
  { icon: <BookOpen size={17} />, value: '5', label: 'Exam tracks covered' },
  { icon: <GraduationCap size={17} />, value: 'Alumnus', label: 'St. Thomas College, Palai' },
  { icon: <Sparkles size={17} />, value: 'Free', label: 'Always open-access' }
];

const INTERESTS = [
  { icon: <FlaskConical size={16} />, label: 'Advanced Organic Synthesis & Reaction Mechanisms' },
  { icon: <Atom size={16} />, label: 'Quantum Chemistry & Molecular Dynamics' },
  { icon: <Layers size={16} />, label: 'Solid-State Chemistry & Materials Science' },
  { icon: <Waves size={16} />, label: 'Spectroscopic Methods in Chemical Analysis' }
];

const EXPERIENCE = [
  { year: '2014 — Present', title: 'Chemistry Professor', place: 'Brilliant Study Centre Pala' }
];

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="dash-root min-h-screen bg-[#F6F2EA] dark:bg-[#1A1817] text-[#22201F] dark:text-[#F6F2EA]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 sm:py-14">

        {/* ================= HERO ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-[#4A0E1B] p-7 text-white shadow-[0_22px_44px_-24px_rgba(74,14,27,0.75)] sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#D9C2A2]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-20 h-52 w-52 rounded-full bg-[#D9C2A2]/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-7 text-center md:flex-row md:items-center md:gap-9 md:text-left">
            {/* Monogram avatar */}
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#EAD3AE] to-[#D9C2A2] shadow-lg sm:h-32 sm:w-32">
                <span className="dash-serif text-4xl font-semibold text-[#4A0E1B] dark:text-[#F4E7E5] sm:text-5xl">AJ</span>
              </div>
              <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-[#4A0E1B] bg-white dark:bg-[#22201F] text-[#4A0E1B] dark:text-[#F4E7E5]">
                <GraduationCap size={18} />
              </span>
            </div>

            {/* Identity */}
            <div className="max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D9C2A2]">About the professor</p>
              <h1 className="dash-serif mt-2 text-3xl font-semibold leading-tight sm:text-[2.5rem]">Ajesh Joe Savio</h1>
              <p className="mt-1 text-sm font-semibold text-white/80">Chemistry Professor</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Devoted to quantum chemistry, molecular dynamics, and organic synthesis — building
                structured, non-commercial, open-access learning for university students and
                competitive-exam aspirants.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                {[
                  { icon: <Building2 size={13} />, text: 'Brilliant Study Centre Pala' },
                  { icon: <MapPin size={13} />, text: 'Kerala, India' },
                  { icon: <CalendarClock size={13} />, text: '12+ Years Teaching Experience' }
                ].map((chip, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90"
                  >
                    <span className="text-[#D9C2A2]">{chip.icon}</span>
                    {chip.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= QUICK FACTS (overlapping hero) ================= */}
        <div className="relative z-10 -mt-6 grid grid-cols-2 gap-4 sm:-mt-8 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <div key={i} className={`${CARD} p-5`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#380A14] text-[#4A0E1B] dark:text-[#F4E7E5]">
                {f.icon}
              </span>
              <p className="dash-serif mt-3 text-3xl font-semibold leading-none text-[#22201F] dark:text-[#F6F2EA]">{f.value}</p>
              <p className={`${MICRO} mt-2`}>{f.label}</p>
            </div>
          ))}
        </div>

        {/* ================= BIOGRAPHY ================= */}
        <section className="mt-12">
          <p className={MICRO}>Biography</p>
          <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA]">A scholar devoted to teaching</h2>
          <div className={`${CARD} mt-4 p-6 sm:p-8`}>
            <div className="space-y-4 text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD] dark:text-[#A89F91]">
              <p>
                Ajesh Joe Savio studied at St. Thomas College, Palai. With over 12 years of teaching experience, he has lectured in organic chemistry, physical chemistry, and advanced materials science.
              </p>
              <p>
                Recognising how often students struggle to bridge foundational theory with high-difficulty
                problem structures, he began writing unified note modules, previous-year guides, and concept
                booklets — a complete, open-access repository for state and national-level scientific
                entrance examinations.
              </p>
            </div>
          </div>
        </section>

        {/* ================= TEACHING PHILOSOPHY ================= */}
        <section className="mt-10">
          <p className={MICRO}>Teaching philosophy</p>
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#EAD9C0] bg-gradient-to-br from-[#F6EBE6] to-[#F3EAD8] p-7 sm:p-10">
            <Quote className="pointer-events-none absolute -right-2 top-3 text-[#4A0E1B] dark:text-[#F4E7E5]/10" size={110} strokeWidth={1.5} />
            <p className="dash-serif relative max-w-2xl text-xl leading-relaxed text-[#3A2A22] sm:text-2xl">
              “Academic excellence does not rely on memorising reactions, but on developing deep physical
              intuition and chemical logic. A chemistry problem is simply a mechanism waiting to be written in
              the elegant language of electrons — our role is to teach students its grammar, so they can write
              their own solutions.”
            </p>
            <div className="relative mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#4A0E1B]/40" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A6A16] dark:text-[#E8CD82]">Ajesh Joe Savio</span>
            </div>
          </div>
        </section>

        {/* ================= INTERESTS + EXPERIENCE ================= */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Research interests */}
          <div className={`${CARD} p-6`}>
            <p className={MICRO}>Research interests</p>
            <h3 className="dash-serif mt-1 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Fields of focus</h3>
            <ul className="mt-5 space-y-3.5">
              {INTERESTS.map((it, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4E7E5] dark:bg-[#38151A] dark:bg-[#380A14] text-[#4A0E1B] dark:text-[#F4E7E5]">
                    {it.icon}
                  </span>
                  <span className="pt-1 text-sm font-semibold text-[#3A342E]">{it.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic experience */}
          <div className={`${CARD} p-6`}>
            <p className={MICRO}>Academic experience</p>
            <h3 className="dash-serif mt-1 text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA]">Career timeline</h3>
            <ul className="mt-6 space-y-6 border-l border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#383330] pl-5">
              {EXPERIENCE.map((exp, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#4A0E1B] ring-1 ring-[#EAE1D2]" />
                  <span className="dash-mono text-[11px] font-medium tabular-nums text-[#8A6A16] dark:text-[#E8CD82]">{exp.year}</span>
                  <span className="mt-1 block text-sm font-bold text-[#22201F] dark:text-[#F6F2EA]">{exp.title}</span>
                  <span className="mt-0.5 block text-xs text-[#8A7E6F] dark:text-[#A89F91]">{exp.place}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= CLOSING CTA ================= */}
        <section className="mt-10 overflow-hidden rounded-2xl bg-[#22201F] p-7 text-white sm:p-9">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="dash-serif text-xl font-semibold sm:text-2xl">Everything here is free and open</h3>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/70">
                Browse notes, lectures, previous-year questions and practice sheets — or reach the office with
                an academic doubt.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <button
                onClick={() => onNavigate?.('selection')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D9C2A2] px-4 py-2.5 text-xs font-bold tracking-wide text-[#4A0E1B] dark:text-[#F4E7E5] transition-colors hover:bg-[#E4D2B6]"
              >
                Explore resources <ArrowRight size={15} />
              </button>
              <button
                onClick={() => onNavigate?.('contact')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-white/10"
              >
                Contact office
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
