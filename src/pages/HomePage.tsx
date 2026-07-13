/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Quote, Lightbulb } from 'lucide-react';
import { PremiumCard } from '../components/PremiumCard';
import { AnimatePresence, motion } from 'framer-motion';
import { CyclingHeadline } from '../components/CyclingHeadline';

const facts = [
  "Francium is the rarest naturally occurring element; there is only about 20-30 grams of it in the entire Earth's crust at any time.",
  "Gallium has a melting point of just 29.76°C, meaning a solid chunk of this metal will literally melt in the palm of your hand.",
  "Bismuth is technically radioactive, but its half-life is 1.9 billion billion years—over a billion times longer than the age of the universe.",
  "Osmium is the densest naturally occurring element; a block the size of a standard brick would weigh about 11.8 kilograms.",
  "Helium is the only element that cannot be solidified by lowering the temperature at ordinary atmospheric pressure.",
  "Astatine is so unstable that a visible piece has never been assembled; it would instantly vaporize itself from its own radioactive heat.",
  "Fluorine is the most reactive of all elements—it is so aggressively reactive it can even burn glass and water.",
  "A single bucket of water contains more individual atoms than there are buckets of water in the entire Atlantic Ocean.",
  "The average human body contains enough elemental carbon to manufacture the 'lead' for approximately 9,000 pencils.",
  "Every single hydrogen atom in your body is approximately 13.5 billion years old, created just moments after the Big Bang."
];

function DidYouKnowCard() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const cycleFact = () => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    };
    const changeTimeout = setInterval(cycleFact, 7000);
    return () => clearInterval(changeTimeout);
  }, []);

  return (
    <PremiumCard padding="large" className="relative overflow-hidden !bg-[#4A0E1B] !border-[#7C2532] shadow-[0_24px_50px_rgba(34,32,31,0.4)] dark:shadow-[0_24px_50px_rgba(0,0,0,0.7)] h-full min-h-[300px] w-full flex flex-col justify-center text-[#F7F3EC]">
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      
      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2D0710]/80 text-[#E8CD82] shadow-inner border border-[#7C2532]/50">
            <Lightbulb size={22} className="text-[#E8CD82]" />
          </div>
          <div>
            <h3 className="font-serif text-[19px] font-bold text-[#F7F3EC] leading-tight">Did You Know?</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D9C2A2] mt-0.5">Chemistry Facts</p>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center relative rounded-xl border border-[#7C2532]/40 bg-[#2D0710]/40 p-6 shadow-[inset_0_2px_15px_rgba(0,0,0,0.2)] mb-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-[16px] md:text-[18px] font-serif text-[#F7F3EC] leading-relaxed italic"
            >
              "{facts[factIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>
        
        {/* Dot Indicator */}
        <div className="flex justify-center space-x-1.5 mt-2 mb-1">
          {facts.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === factIndex ? 'w-4 bg-[#E8CD82]' : 'w-1.5 bg-[#7C2532]/80'
              }`}
            />
          ))}
        </div>
      </div>
    </PremiumCard>
  );
}

interface HeroProps {
  onGetStarted: () => void;
  onNavigate: (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => void;
}

export default function Hero({ onGetStarted, onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#F7F3EC] dark:bg-[#1A1817]">

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        <div className="grid items-center md:items-stretch gap-12 md:grid-cols-12 md:gap-8">
          
          {/* Text Content Block */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-6 lg:col-span-7 animate-[fadeInUp_0.8s_ease-out_forwards]">
            


            <h1 className="text-center sm:text-left text-5xl font-sans font-bold tracking-tight text-[#22201F] dark:text-[#F6F2EA] sm:text-6xl md:text-7xl leading-[1.05]">
              <span className="italic font-semibold text-[#4A0E1B] dark:text-[#E8CD82] tracking-normal" style={{ fontFamily: '"Caveat", cursive', fontSize: '1.2em', lineHeight: '0.8' }}>Understand</span>
              {' '}
              <br className="hidden sm:block"/>
              chemistry. Don't
              {' '}
              <br className="hidden sm:block"/>
              just
              {' '}
              <span className="relative inline-block text-[#8A7E6F] dark:text-[#A89F91]">
                memorise
                <motion.span 
                  initial={{ scaleX: 0, y: "-50%" }}
                  animate={{ scaleX: 1, y: "-50%" }}
                  transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                  className="absolute left-[-5%] right-[-5%] top-[55%] h-[4px] md:h-[6px] bg-[#C9A13B] opacity-90 rounded-full"
                ></motion.span>
              </span> it.
            </h1>

            <p className="mx-auto sm:mx-0 text-center sm:text-left max-w-[320px] sm:max-w-2xl text-[17px] sm:text-[20px] leading-[1.6] text-[#5A534B] dark:text-[#C7BCAD]">
              A free, rigorous chemistry library for JEE, NEET, CSIR-NET and M.Sc aspirants — concept-first notes, lectures and problem practice from Ajesh Joe.
            </p>

            <div className="pt-4 flex flex-col items-center sm:flex-row sm:justify-start gap-4">
              <button
                onClick={onGetStarted}
                className="group w-full sm:w-auto max-w-[280px] sm:max-w-none flex items-center justify-center bg-[#4A0E1B] hover:bg-[#7C2532] focus-visible:bg-[#7C2532] active:bg-[#7C2532] text-white px-8 py-4 text-[15px] font-bold rounded-xl shadow-[0_4px_14px_rgba(34,32,31,0.3)] hover:shadow-[0_6px_20px_rgba(34,32,31,0.4)] focus-visible:shadow-[0_6px_20px_rgba(34,32,31,0.4)] active:shadow-[0_6px_20px_rgba(34,32,31,0.4)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:-translate-y-0.5 transition-all min-h-[44px]"
                id="hero-get-started-btn"
              >
                Enter the library
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="group w-full sm:w-auto max-w-[280px] sm:max-w-none flex items-center justify-center bg-[#22201F] hover:bg-[#3A342E] focus-visible:bg-[#3A342E] active:bg-[#3A342E] dark:bg-[#3A342E] dark:hover:bg-[#4A433E] dark:focus-visible:bg-[#4A433E] dark:active:bg-[#4A433E] text-[#F7F3EC] px-8 py-4 text-[15px] font-bold rounded-xl shadow-[0_4px_14px_rgba(34,32,31,0.2)] hover:shadow-[0_6px_20px_rgba(34,32,31,0.3)] focus-visible:shadow-[0_6px_20px_rgba(34,32,31,0.3)] active:shadow-[0_6px_20px_rgba(34,32,31,0.3)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:-translate-y-0.5 transition-all min-h-[44px]"
              >
                About the professor
              </button>
            </div>

          </div>

          {/* Did You Know Facts Block */}
          <div className="flex justify-center lg:col-span-5 relative">
            <div className="relative w-full max-w-md h-full animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              {/* Decorative blurs */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C9A13B]/20 blur-2xl dark:bg-[#C9A13B]/10"></div>
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#4A0E1B]/20 blur-2xl dark:bg-[#4A0E1B]/10"></div>
              
              <div className="relative z-10 h-full">
                <DidYouKnowCard />
              </div>
            </div>
          </div>

        </div>

        {/* Cycling Headline */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <CyclingHeadline />
        </div>

        {/* Blockquote Section */}
        <div className="mt-8 md:mt-12 max-w-5xl mx-auto animate-[fadeInUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="relative overflow-hidden rounded-2xl border border-[#EAD9C0] dark:border-[#7C2532]/40 bg-gradient-to-br from-[#F6EBE6] to-[#F3EAD8] dark:from-[#2D0710] dark:to-[#4A0E1B] p-7 sm:p-10 shadow-[0_8px_30px_rgba(34,32,31,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <Quote className="pointer-events-none absolute -right-2 top-3 text-[#4A0E1B] dark:text-[#F4E7E5]/10" size={110} strokeWidth={1.5} />
            <p className="font-serif relative max-w-2xl text-xl leading-relaxed text-[#3A2A22] dark:text-[#F7F3EC] sm:text-2xl">
              “Academic excellence does not rely on memorising reactions, but on developing deep physical intuition and chemical logic. A chemistry problem is simply a mechanism waiting to be written in the elegant language of electrons — our role is to teach students its grammar, so they can write their own solutions.”
            </p>
            <div className="relative mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#4A0E1B]/40" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A6A16] dark:text-[#E8CD82]">Ajesh Joe</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
