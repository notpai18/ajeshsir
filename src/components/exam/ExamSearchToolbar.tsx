import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SUBJECTS } from '../../constants/subjects';

interface ExamSearchToolbarProps {
  onSearch: (query: string) => void;
  onSubjectSelect: (subject: string) => void;
  selectedSubject: string;
}

export function ExamSearchToolbar({ onSearch, onSubjectSelect, selectedSubject }: ExamSearchToolbarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const subjects = ['All', ...SUBJECTS];

  return (
    <div className="flex flex-col items-center gap-8 my-16 animate-[fadeInUp_0.8s_ease-out_forwards]">
      {/* Floating Search Bar */}
      <div 
        className={`relative w-full max-w-2xl transition-all duration-500 ${isFocused ? 'scale-105' : 'scale-100'}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-[#4A0E1B]/20 to-[#C9A13B]/20 rounded-full blur-xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
        <div className="relative flex items-center bg-white dark:bg-[#22201F]/70 backdrop-blur-2xl border border-white rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-500 ${isFocused ? 'bg-[#4A0E1B] text-white' : 'bg-transparent text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]'}`}>
            <Search size={20} className={`transition-transform duration-500 ${isFocused ? 'scale-110' : 'scale-100'}`} />
          </div>
          <input
            type="text"
            placeholder="Search all resources for this examination..."
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm sm:text-base text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] placeholder:text-[#A79A88]"
          />
        </div>
      </div>

      {/* Premium Segmented Control */}
      <div className="flex flex-wrap justify-center p-1.5 bg-white dark:bg-[#22201F]/50 backdrop-blur-xl border border-white rounded-full shadow-sm relative">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => onSubjectSelect(subject)}
            className={`relative z-10 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
              selectedSubject === subject ? 'text-white' : 'text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] hover:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]'
            }`}
          >
            {subject}
            {selectedSubject === subject && (
              <div 
                className="absolute inset-0 bg-[#4A0E1B] rounded-full -z-10 shadow-md"
                style={{ 
                  animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' 
                }}
              />
            )}
          </button>
        ))}
      </div>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
