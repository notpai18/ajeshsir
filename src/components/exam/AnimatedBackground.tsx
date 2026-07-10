import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 mix-blend-overlay">
      {/* Hexagonal grid / noise overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(#D9C2A2 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.15
        }}
      />
      
      {/* Floating abstract elements */}
      <div className="absolute top-[10%] left-[5%] h-64 w-64 rounded-full border border-white/10 animate-[spin_60s_linear_infinite]" />
      <div className="absolute top-[30%] right-[10%] h-96 w-96 rounded-full border border-white/5 animate-[spin_40s_linear_infinite_reverse]" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-[#D9C2A2]/10 to-transparent blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-bl from-[#7C2532]/20 to-transparent blur-2xl" />

      {/* SVG Chemistry specific subtle elements */}
      <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
        <g className="animate-[float_20s_ease-in-out_infinite]">
          <path d="M150 150 L200 120 L250 150 L250 210 L200 240 L150 210 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#D9C2A2]" />
          <circle cx="200" cy="120" r="4" fill="currentColor" className="text-[#D9C2A2]" />
          <circle cx="150" cy="210" r="4" fill="currentColor" className="text-[#D9C2A2]" />
        </g>
        <g className="animate-[float_25s_ease-in-out_infinite_reverse]" style={{ transform: 'translate(60vw, 40vh) scale(0.6)' }}>
          <path d="M150 150 L200 120 L250 150 L250 210 L200 240 L150 210 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#D9C2A2]" />
          <line x1="250" y1="150" x2="300" y2="120" stroke="currentColor" strokeWidth="1" className="text-[#D9C2A2]" />
          <circle cx="300" cy="120" r="4" fill="currentColor" className="text-[#D9C2A2]" />
        </g>
      </svg>
    </div>
  );
}
