import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const HEADLINE_ITEMS = [
  "JEE Aspirants",
  "NEET Aspirants",
  "Physical Chemistry Learners",
  "Organic Chemistry Learners",
  "Professors & Educators"
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
  const currentColor = COLORS[index % COLORS.length];

  return (
    <section className="w-full py-12 md:py-16 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center bg-[#F7F3EC] dark:bg-[#1A1817] p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <h2 className="dash-serif text-3xl md:text-5xl font-bold tracking-tight text-[#22201F] dark:text-[#F6F2EA] flex flex-col items-center gap-2">
          <span>Built for Every</span>
          <div className="relative flex items-center justify-center min-h-[48px] md:min-h-[72px] min-w-[320px] md:min-w-[500px]">
            {shouldReduceMotion ? (
              <span className="absolute inset-0 flex items-center justify-center" style={{ color: COLORS[0] }}>
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
                  className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                  style={{ color: currentColor }}
                >
                  {currentItem}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] md:text-[18px] text-[#5A534B] dark:text-[#C7BCAD]">
          A robust learning ecosystem designed to adapt to your academic needs.
        </p>
      </div>
    </section>
  );
}
