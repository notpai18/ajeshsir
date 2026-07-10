import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PremiumCard } from './PremiumCard';

interface SelectionPageProps {
  onSelectRole: (role: 'student' | 'professor') => void;
}

export default function SelectionPage({ onSelectRole }: SelectionPageProps) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817] py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center">
          <p className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#C9A13B] uppercase">
            Secure Portal Selection
          </p>
          <h2 className="mt-2 text-3xl font-serif font-extrabold tracking-tight text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] sm:text-4xl">
            Who are you?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">
            Please choose your role to proceed to the designated section of the digital library portal.
          </p>
        </div>

        {/* Dual Card Layout */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          
          {/* Student Card */}
          <PremiumCard
            onClick={() => onSelectRole('student')}
            interactive
            accentLine
            id="role-card-student"
          >
            {/* Top Icon Area */}
            <PremiumCard.Icon>
              <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Graduation%20Cap.png" alt="Student" className="h-8 w-8 object-contain drop-shadow-sm" />
            </PremiumCard.Icon>

            {/* Typography */}
            <PremiumCard.Title className="mt-6">
              Student
            </PremiumCard.Title>
            <PremiumCard.Description className="mt-2.5">
              Access learning resources. Browse comprehensive chemistry concepts, notes, video lectures, and previous year papers.
            </PremiumCard.Description>

            {/* Bottom Action Hint */}
            <div className="mt-8 flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-bold text-[#4A0E1B] dark:text-[#F4E7E5] opacity-0 transition-all duration-250 group-hover:opacity-100 group-hover:translate-x-1">
              <span>Enter Repository</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </PremiumCard>

          {/* Professor Card */}
          <PremiumCard
            onClick={() => onSelectRole('professor')}
            interactive
            accentLine
            id="role-card-professor"
          >
            {/* Top Icon Area */}
            <PremiumCard.Icon>
              <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Briefcase.png" alt="Professor" className="h-8 w-8 object-contain drop-shadow-sm" />
            </PremiumCard.Icon>

            {/* Typography */}
            <PremiumCard.Title className="mt-6">
              Professor
            </PremiumCard.Title>
            <PremiumCard.Description className="mt-2.5">
              Manage educational resources. Add, update, or remove notes, lectures, previous year solutions, practice worksheets, and answer student queries.
            </PremiumCard.Description>

            {/* Bottom Action Hint */}
            <div className="mt-8 flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-bold text-[#4A0E1B] dark:text-[#F4E7E5] opacity-0 transition-all duration-250 group-hover:opacity-100 group-hover:translate-x-1">
              <span>Access Dashboard</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </PremiumCard>

        </div>

        {/* Minimal academic note */}
        <div className="mt-10 text-center">
          <p className="font-sans text-[9px] uppercase tracking-wider text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 font-bold">
            Open-access educational model • No authentication or credit cards required
          </p>
        </div>

      </div>
    </section>
  );
}
