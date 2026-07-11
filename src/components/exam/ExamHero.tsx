import React from 'react';
import { AnimatedBackground } from './AnimatedBackground';

interface ExamHeroProps {
  title: string;
  description: string;
  stats: {
    notes: number;
    videos: number;
    pyqs: number;
    sheets: number;
    downloads: number;
  };
}

export function ExamHero({ title, description, stats }: ExamHeroProps) {
  return (
    <div className="relative w-full h-[420px] rounded-[40px] bg-gradient-to-br from-[#4A0E1B] to-[#7C2532] shadow-[0_24px_50px_-12px_rgba(34,32,31,0.5)] overflow-hidden flex flex-col md:flex-row items-center animate-[fadeInUp_0.8s_ease-out_forwards]">
      <AnimatedBackground />
      
      {/* Left Content */}
      <div className="relative z-10 w-full md:w-3/5 p-10 md:p-16 flex flex-col justify-center h-full text-white">
        <h1 className="dash-serif text-[48px] md:text-[72px] font-bold leading-[1.1] tracking-tight mb-4 drop-shadow-md">
          {title.toUpperCase()}
        </h1>
        <p className="text-lg md:text-xl text-[#D9C2A2] font-light max-w-lg mb-10 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 md:gap-8 opacity-90">
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-mono text-white">{stats.notes}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#D9C2A2] font-bold mt-1">Study Notes</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-mono text-white">{stats.videos}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#D9C2A2] font-bold mt-1">Video Lectures</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-mono text-white">{stats.pyqs}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#D9C2A2] font-bold mt-1">PYQs</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-mono text-white">{stats.sheets}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#D9C2A2] font-bold mt-1">Practice Sheets</span>
          </div>
        </div>
      </div>
      
      {/* Right Content - SVG Illustration */}
      <div className="relative z-10 hidden md:flex w-2/5 h-full items-center justify-center">
        <div className="relative w-80 h-80">
          {/* Orbital rings */}
          <div className="absolute inset-0 rounded-full border border-[#22201F]/20 animate-[spin_15s_linear_infinite]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg) rotateY(20deg)' }}></div>
          <div className="absolute inset-0 rounded-full border border-[#22201F]/20 animate-[spin_20s_linear_infinite_reverse]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateY(70deg)' }}></div>
          <div className="absolute inset-0 rounded-full border border-[#22201F]/20 animate-[spin_25s_linear_infinite]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(50deg) rotateY(50deg)' }}></div>
          
          {/* Center core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-[#D9C2A2] to-[#C9A13B] rounded-full shadow-[0_0_40px_rgba(217,194,162,0.8)] animate-[pulse_4s_ease-in-out_infinite]"></div>
          
          {/* Electrons */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#22201F] rounded-full shadow-[0_0_15px_#FFF] animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '0 160px' }}></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-white dark:bg-[#22201F] rounded-full shadow-[0_0_15px_#FFF] animate-[spin_6s_linear_infinite_reverse]" style={{ transformOrigin: '-160px 0' }}></div>
          
          <div className="absolute bottom-[20%] left-[20%] w-5 h-5 bg-[#D9C2A2] rounded-full shadow-[0_0_20px_#D9C2A2] animate-bounce" style={{ animationDuration: '3s' }}></div>
        </div>
      </div>
    </div>
  );
}
