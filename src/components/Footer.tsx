/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FooterProps {
  onNavigate: (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => void;
  userRole: 'student' | 'professor' | null;
}

interface BottomLinkProps {
  onClick: () => void;
  children: React.ReactNode;
}

const BottomLink = ({ onClick, children }: BottomLinkProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center text-[12px] md:text-[13px] font-medium text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/50 dark:text-[#F7F3EC]/50 hover:text-[#4A0E1B] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5] dark:hover:text-[#C9A13B] transition-colors duration-200 ease-out focus:outline-none"
    >
      <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] relative flex flex-col pb-0.5">
        {children}
        <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#4A0E1B] dark:bg-[#C9A13B] origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
      </span>
    </button>
  );
};

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#22201F] pt-8 pb-6 transition-colors duration-300">
      {/* Floating Lightweight Card Container */}
      <div className="mx-auto w-[92%] max-w-7xl rounded-[24px] bg-white dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#4A0E1B]/12 px-6 py-7 md:px-10 md:py-8 shadow-[0_8px_30px_rgba(74,14,27,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#D9C2A2]/25 dark:border-[#C9A13B]/8 relative transition-all duration-300">
        
        {/* Row 1: Asymmetrical Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Left: Identity */}
          <div className="flex flex-col space-y-1">
            <h4 className="text-[18px] font-semibold tracking-tight text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F7F3EC] font-display">
              Prof. Ajesh Joe
            </h4>
            <p className="text-[14px] font-normal text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 dark:text-[#F7F3EC]/80">
              Department of Chemistry
            </p>
            <p className="text-[14px] font-normal text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 dark:text-[#F7F3EC]/60">
              Indian Institute of Technology (BHU), Varanasi
            </p>
          </div>

          {/* Right: Contact */}
          <div className="flex flex-col space-y-1 text-left md:text-right items-start md:items-end text-[14px] font-normal text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 dark:text-[#F7F3EC]/80">
            {/* Email mailto Link */}
            <a
              href="mailto:ajesh.joe@university.edu"
              className="group relative inline-flex items-center text-[14px] font-normal text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 dark:text-[#F7F3EC]/80 hover:text-[#4A0E1B] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5] dark:hover:text-[#C9A13B] transition-colors duration-200 ease-out focus:outline-none"
            >
              <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] relative flex flex-col pb-0.5">
                ajesh.joe@university.edu
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#4A0E1B] dark:bg-[#C9A13B] origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </span>
            </a>
            <p>Room 402-B, Science Block II</p>
            <p className="text-[13px] text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 dark:text-[#F7F3EC]/60">
              Office Hours: Mon & Wed: 2:00 PM – 4:00 PM
            </p>
          </div>

        </div>

        {/* Thin Fading Gradient Divider */}
        <div 
          className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D9C2A2]/30 dark:via-[#C9A13B]/12 to-transparent my-5" 
          role="separator" 
          aria-hidden="true" 
        />

        {/* Row 2: Bottom Bar */}
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 text-[12px] md:text-[13px] text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/50 dark:text-[#F7F3EC]/50 font-normal">
          <p>© {currentYear} Prof. Ajesh Joe. All rights reserved.</p>
          <div className="flex items-center gap-x-3 select-none">
            <BottomLink onClick={() => onNavigate('home')}>Privacy</BottomLink>
            <span className="text-[#D9C2A2]/50">•</span>
            <BottomLink onClick={() => onNavigate('home')}>Terms</BottomLink>
            <span className="text-[#D9C2A2]/50">•</span>
            <BottomLink onClick={() => onNavigate('home')}>Accessibility</BottomLink>
          </div>
        </div>

      </div>
    </footer>
  );
}
