import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import BlurText from './BlurText';

const HEADLINE_ITEMS = [
  "JEE Aspirant",
  "NEET Aspirant",
  "Chemistry Student",
  "Dedicated Learner",
  "Science Educator"
];

// Use the exact colors specified with sufficient contrast against the background
const COLORS = [
  "#4A0E1B", // deep maroon
  "#3A2A22", // dark warm charcoal
  "#22201F", // charcoal
  "#7C2532", // lighter maroon
  "#5A2436"  // medium maroon
];

export function CyclingHeadline() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Total cycle time: 1.8s hold + 0.4s fade out + 0.4s fade in roughly = 2.6s
    // To match the prompt's request, we'll interval every 2800ms
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HEADLINE_ITEMS.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const currentItem = HEADLINE_ITEMS[index];

  return (
    <section className="w-full pt-12 pb-4 md:pt-16 md:pb-6 overflow-hidden">
      <div className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h2 className="font-sans text-[22px] sm:text-3xl md:text-5xl font-bold tracking-tight text-[#22201F] dark:text-[#F6F2EA] w-full text-center md:flex md:flex-nowrap md:justify-center md:items-center md:gap-x-2 md:whitespace-nowrap md:overflow-hidden">
          <span className="inline-block md:inline">Built for Every</span>
          <span className="inline-block md:hidden">&nbsp;</span>
          <span className="inline-grid text-[#4A0E1B] dark:text-[#E8CD82] md:relative md:flex md:items-center md:justify-start md:min-w-[480px] md:h-[72px]">
            {/* Invisible longest word for mobile to reserve space and dictate wrapping */}
            <span className="invisible col-start-1 row-start-1 md:hidden flex items-center justify-start whitespace-nowrap" aria-hidden="true">
              Chemistry Student
            </span>
            {shouldReduceMotion ? (
              <span className="col-start-1 row-start-1 flex items-center justify-start whitespace-nowrap md:absolute md:inset-0">
                {HEADLINE_ITEMS[0]}
              </span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="col-start-1 row-start-1 flex items-center justify-start whitespace-nowrap md:absolute md:inset-0"
                >
                  <BlurText text={currentItem} delay={25} animateBy="letters" className="inline-flex items-center" />
                </motion.span>
              </AnimatePresence>
            )}
          </span>
        </h2>
      </div>
    </section>
  );
}
