/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, GraduationCap, Sun, Moon, Menu, X, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact';
  onNavigate: (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => void;
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
  const badgeBg = 'bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817]';
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
    <nav className="sticky top-5 z-50 mx-auto mt-5 w-[90%] max-w-7xl rounded-full border border-[#D9C2A2]/30 bg-white dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F]/80 backdrop-blur-[20px] shadow-soft-md transition-all duration-300">
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
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png" 
                alt="Portal Logo" 
                className="h-full w-full object-contain transition-transform duration-300 hover:-rotate-6 hover:scale-110"
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-xl font-['Outfit'] font-bold tracking-tight text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">
                Prof. Ajesh Joe
              </span>
              <span className="text-[11px] font-semibold tracking-wide text-[#C9A13B] transition-colors duration-300">
                Academic Library
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-4 lg:flex xl:space-x-8">
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
                    className={`relative py-2 text-base font-['Outfit'] transition-colors duration-200 hover:text-[#4A0E1B] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5] ${
                      isActive 
                        ? 'text-[#4A0E1B] dark:text-[#F4E7E5] font-bold' 
                        : 'text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 font-medium'
                    }`}
                    id={`nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-[-22px] left-0 h-1 w-full bg-[#4A0E1B] transition-colors duration-300" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-[#D9C2A2]/30" />

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 rounded-full border border-[#D9C2A2]/40 ${badgeBg} px-3 py-1.5 text-xs font-medium text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] transition-all ${badgeHoverBg}`}
                id="theme-toggle-btn"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span className="hidden xl:inline">{theme === 'dark' ? 'Light Theme' : 'Original Dark'}</span>
              </button>

              {/* Portal Access Badge */}
              {userRole ? (
                <div className="flex items-center space-x-2">
                  <span className={`flex items-center space-x-1 border border-[#D9C2A2]/40 ${badgeBg} px-2.5 py-1 text-xs font-medium text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/70 rounded-lg transition-colors duration-300`}>
                    <UserCheck size={14} className={`${accentText} transition-colors duration-300`} />
                    <span className="hidden xl:inline">Role: </span>
                    <span>{userRole === 'professor' ? 'Professor' : 'Student'}</span>
                  </span>
                  <button
                    onClick={() => {
                      onRoleChange(null);
                      handleNavClick('selection');
                    }}
                    className="text-xs font-medium text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 hover:text-[#4A0E1B] dark:hover:text-[#F4E7E5] dark:text-[#F4E7E5] transition-colors underline decoration-transparent hover:decoration-[#4A0E1B] underline-offset-4"
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
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 hover:bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817]"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-[#D9C2A2]/30 bg-white dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] px-4 pt-2 pb-4 shadow-soft-lg transition-colors duration-300 lg:hidden">
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
                  className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive 
                      ? `${mobileActiveBg}` 
                      : 'text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 hover:bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817]'
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
              <div className="flex items-center justify-between px-4 py-2 bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817] rounded-xl border border-[#D9C2A2]/30">
                <span className="font-sans text-xs font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/70">
                  Role: {userRole === 'professor' ? 'Professor' : 'Student'}
                </span>
                <button
                  onClick={() => {
                    onRoleChange(null);
                    handleNavClick('selection');
                  }}
                  className={`text-xs font-bold ${mobileActionText}`}
                  id="mobile-switch-role-btn"
                >
                  Switch Role
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('selection')}
                className="w-full rounded-btn bg-[#4A0E1B] py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-[#7C2532]"
                id="mobile-get-started-btn"
              >
                Enter Portal
              </button>
            )}
          </div>
          
          <div className="border-t border-[#D9C2A2]/30 pt-4 mt-4">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] transition-colors hover:bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817]"
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
