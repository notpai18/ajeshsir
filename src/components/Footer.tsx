/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GraduationCap } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => void;
  userRole: 'student' | 'professor' | null;
}

export default function Footer({ onNavigate, userRole }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleResourceClick = () => {
    if (userRole === 'student') {
      onNavigate('student');
    } else if (userRole === 'professor') {
      onNavigate('professor');
    } else {
      onNavigate('selection');
    }
  };

  return (
    <footer className="w-full border-t border-gray-100 bg-gray-50 py-12 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <GraduationCap size={15} />
            </div>
            <span className="font-sans text-sm font-semibold tracking-tight text-gray-800 dark:text-slate-200">
              Prof. Anand Sen
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              id="footer-link-home"
            >
              Home
            </button>
            <button
              onClick={handleResourceClick}
              className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              id="footer-link-resources"
            >
              Library Resources
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              id="footer-link-about"
            >
              About the Professor
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              id="footer-link-contact"
            >
              Contact Office
            </button>
          </div>

        </div>

        <div className="my-8 h-px bg-gray-200/50 dark:bg-slate-800" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center font-mono text-[11px] leading-relaxed text-gray-400 dark:text-slate-500 md:text-left">
            © {currentYear} Prof. Anand Sen, Ph.D. All rights reserved. This repository is hosted solely as an open educational resource for university students and aspirants.
          </p>
          <div className="flex space-x-4">
            <span className="font-mono text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              Department of Physics & Applied Mathematics
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
