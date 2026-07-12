/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
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
      className="group relative flex items-center text-[12px] md:text-[13px] font-medium text-white/50 hover:text-[#D9C2A2] transition-colors duration-200 ease-out focus:outline-none"
    >
      <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] relative flex flex-col pb-0.5">
        {children}
        <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#D9C2A2] origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
      </span>
    </button>
  );
};

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#F7F3EC] dark:bg-[#1A1817] z-10 pt-8 pb-6 transition-colors duration-300">
      {/* Floating Lightweight Card Container */}
      <div className="mx-auto w-[92%] max-w-7xl rounded-[24px] bg-[#4A0E1B] dark:bg-[#22201F] px-6 py-7 md:px-10 md:py-8 shadow-[0_8px_30px_rgba(34,32,31,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#7C2532]/30 dark:border-[#C9A13B]/8 relative transition-all duration-300">
        
        {/* Row 1: Asymmetrical Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          
          {/* Left: Identity */}
          <div className="flex flex-col space-y-1">
            <h4 className="text-[18px] font-semibold tracking-tight text-white font-display">
              Ajesh Joe
            </h4>
            <p className="text-[14px] font-normal text-white/80">
              Chemistry Professor
            </p>
            <p className="text-[14px] font-normal text-white/60">
              Brilliant Study Centre Pala
            </p>
          </div>

          {/* Right: Contact */}
          <div className="flex flex-col space-y-1 text-left md:text-right items-start md:items-end text-[14px] font-normal text-white/80">
            {/* Email mailto Link */}
            <a
              href="mailto:contact@example.com"
              className="group relative inline-flex items-center text-[14px] font-normal text-white/80 hover:text-[#D9C2A2] transition-colors duration-200 ease-out focus:outline-none"
            >
              <span className="transform transition-transform duration-200 ease-out group-hover:translate-x-[2px] relative flex flex-col pb-0.5">
                contact@example.com
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#D9C2A2] origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </span>
            </a>
            <p>Brilliant Study Centre</p>
            <p className="text-[13px] text-white/60">
              Pala, Kerala
            </p>
          </div>

        </div>

        {/* Thin Fading Gradient Divider */}
        <div 
          className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 dark:via-[#C9A13B]/12 to-transparent my-5" 
          role="separator" 
          aria-hidden="true" 
        />

        {/* Row 2: Bottom Bar */}
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 text-[12px] md:text-[13px] text-white/50 font-normal">
          <p>© {currentYear} Ajesh Joe. All rights reserved.</p>
          <div className="flex items-center gap-x-3 select-none">
            <BottomLink onClick={() => onNavigate('privacy')}>Privacy</BottomLink>
            <span className="text-white/30">•</span>
            <BottomLink onClick={() => onNavigate('terms')}>Terms</BottomLink>
            <span className="text-white/30">•</span>
            <BottomLink onClick={() => onNavigate('accessibility')}>Accessibility</BottomLink>
          </div>
        </div>

      </div>
    </footer>
  );
}
