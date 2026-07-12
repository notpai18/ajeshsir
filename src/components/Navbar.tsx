/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, GraduationCap, Sun, Moon, Menu, X, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: 'student' | 'professor' | null;
  onRoleChange: (role: 'student' | 'professor' | null) => void;
  theme: string;
  toggleTheme: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  userRole,
  onRoleChange,
  theme,
  toggleTheme
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const accentText = 'text-[#4A0E1B] dark:text-[#F4E7E5]';
  const accentBg = 'bg-[#4A0E1B]';
  const accentBorder = 'border-[#4A0E1B]';
  const accentHoverBg = 'hover:bg-[#7C2532]';
  const badgeBg = 'bg-[#F7F3EC] dark:bg-[#1A1817]';
  const badgeHoverBg = 'hover:bg-[#D9C2A2]/20';
  const mobileActiveBg = 'bg-[#4A0E1B]/8 text-[#4A0E1B] dark:text-[#F4E7E5]';
  const mobileActionText = 'text-[#4A0E1B] dark:text-[#F4E7E5]';

  const navItems = [
    { label: 'Home', view: 'home' as const },
    { label: 'Resources', view: userRole === 'student' ? ('student' as const) : userRole === 'professor' ? ('professor' as const) : ('selection' as const) },
    { label: 'About Professor', view: 'about' as const },
    { label: 'Contact Office', view: 'contact' as const },
  ];

  const handleNavClick = (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-[max(1.25rem,env(safe-area-inset-top))] z-50 mx-auto mt-5 w-[90%] max-w-7xl rounded-full border border-[#22201F]/20 bg-white/80 dark:bg-[#22201F]/80 backdrop-blur-[20px] shadow-soft-md transition-all duration-300">
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
            id="nav-logo"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center drop-shadow-sm">
              <img 
                src="/favicon.svg" 
                alt="Portal Logo" 
                className="h-[28px] w-[28px] object-contain transition-transform duration-300 hover:-rotate-6 hover:scale-110 opacity-90 dark:opacity-100"
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-xl font-['Outfit'] font-bold tracking-tight text-[#22201F] dark:text-[#F6F2EA]">
                Ajesh Joe
              </span>
              <span className="text-[11px] font-semibold tracking-wide text-[#C9A13B] transition-colors duration-300">
                Academic Library
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-4 sm:flex xl:space-x-8">
            <div className="flex space-x-4 xl:space-x-6">
              {navItems.map((item) => {
                const isActive = 
                  currentView === item.view || 
                  (item.view === 'student' && currentView === 'student') ||
                  (item.view === 'professor' && currentView === 'professor') ||
                  (item.view === 'selection' && currentView === 'selection');
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.view)}
                    className={`relative px-4 py-1.5 rounded-full text-base font-['Outfit'] transition-colors duration-200 ${
                      isActive 
                        ? 'text-[#F7F3EC] font-semibold' 
                        : 'text-[#22201F] dark:text-[#F6F2EA]/70 hover:bg-[#4A0E1B]/5 font-medium'
                    }`}
                    id={`nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-full bg-[#4A0E1B] shadow-sm z-0"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-[#D9C2A2]/30" />

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`relative flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#22201F]/20 ${badgeBg} text-[#22201F] dark:text-[#F6F2EA] transition-all ${badgeHoverBg} overflow-hidden`}
                id="theme-toggle-btn"
                aria-label="Toggle theme"
                title="Toggle Theme"
              >
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
                  <Moon size={18} />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}>
                  <Sun size={18} />
                </div>
              </button>

              {/* Portal Access Badge */}
              {userRole ? (
                <div className="flex items-center space-x-2">
                  <span className={`flex items-center space-x-1 border border-[#22201F]/20 ${badgeBg} px-2.5 py-1 text-xs font-medium text-[#22201F] dark:text-[#F6F2EA]/70 rounded-lg transition-colors duration-300`}>
                    <UserCheck size={14} className={`${accentText} transition-colors duration-300`} />
                    <span className="hidden xl:inline">Role: </span>
                    <span>{userRole === 'professor' ? 'Professor' : 'Student'}</span>
                  </span>
                  <button
                    onClick={() => {
                      onRoleChange(null);
                      handleNavClick('selection');
                    }}
                    className="min-h-[44px] px-2 text-xs font-medium text-[#22201F] dark:text-[#F6F2EA]/60 hover:text-[#4A0E1B] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5] transition-colors underline decoration-transparent hover:decoration-[#4A0E1B] underline-offset-4"
                    id="switch-role-btn"
                  >
                    Switch
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('selection')}
                  className={`rounded-btn ${accentBg} px-4 py-2 text-sm font-semibold text-white transition-all ${accentHoverBg} shadow-soft-sm hover:translate-y-[-2px] duration-200 ease-out`}
                  id="nav-get-started-btn"
                >
                  Enter Portal
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center rounded-xl p-2 text-[#22201F] dark:text-[#F6F2EA]/60 hover:bg-[#F7F3EC] focus-visible:bg-[#F7F3EC] active:bg-[#F7F3EC] dark:hover:bg-[#1A1817] dark:focus-visible:bg-[#1A1817] dark:active:bg-[#1A1817] min-h-[44px] min-w-[44px]"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-[#22201F]/20 bg-white dark:bg-[#22201F] px-4 pt-2 pb-4 shadow-soft-lg transition-colors duration-300 sm:hidden">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = 
                currentView === item.view || 
                (item.view === 'student' && currentView === 'student') ||
                (item.view === 'professor' && currentView === 'professor') ||
                (item.view === 'selection' && currentView === 'selection');
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.view)}
                  className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors min-h-[44px] ${
                    isActive 
                      ? `${mobileActiveBg}` 
                      : 'text-[#22201F] dark:text-[#F6F2EA]/80 hover:bg-[#F7F3EC] dark:bg-[#1A1817]'
                  }`}
                  id={`mobile-nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="my-3 h-px bg-[#D9C2A2]/30" />

          <div>
            {userRole ? (
              <div className="flex items-center justify-between px-4 py-2 bg-[#F7F3EC] dark:bg-[#1A1817] rounded-xl border border-[#22201F]/20">
                <span className="font-sans text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA]/70">
                  Role: {userRole === 'professor' ? 'Professor' : 'Student'}
                </span>
                <button
                  onClick={() => {
                    onRoleChange(null);
                    handleNavClick('selection');
                  }}
                  className={`text-xs font-bold ${mobileActionText} min-h-[44px] px-2 py-1 rounded hover:bg-[#E8DCC8] focus-visible:bg-[#E8DCC8] active:bg-[#E8DCC8] dark:hover:bg-[#2A2726] dark:focus-visible:bg-[#2A2726] dark:active:bg-[#2A2726] transition-colors`}
                  id="mobile-switch-role-btn"
                >
                  Switch Role
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('selection')}
                className="w-full rounded-btn bg-[#4A0E1B] py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-[#7C2532] focus-visible:bg-[#7C2532] active:bg-[#7C2532] min-h-[44px]"
                id="mobile-get-started-btn"
              >
                Enter Portal
              </button>
            )}
          </div>
          
          <div className="border-t border-[#22201F]/20 pt-4 mt-4">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] transition-colors hover:bg-[#F7F3EC] focus-visible:bg-[#F7F3EC] active:bg-[#F7F3EC] dark:hover:bg-[#1A1817] dark:focus-visible:bg-[#1A1817] dark:active:bg-[#1A1817] min-h-[44px]"
            >
              <span>{theme === 'dark' ? 'Switch to Current Theme' : 'Switch to Original Dark'}</span>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
