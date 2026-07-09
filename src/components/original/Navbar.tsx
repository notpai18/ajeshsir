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
  darkMode: boolean;
  onToggleDarkMode: () => void;
  theme?: string;
  toggleTheme?: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  userRole,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  theme,
  toggleTheme
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="sticky top-0 z-50 w-full border-b-2 border-gray-800 bg-[#1c1c1e] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              <span className="text-base font-display font-bold tracking-tight text-white">
                Prof. Ajesh Joe
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#F1E194]">
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
                    className={`relative py-2 text-[10px] uppercase tracking-[0.1em] font-black transition-colors duration-200 hover:text-white ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-500'
                    }`}
                    id={`nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-[-22px] left-0 h-1 w-full bg-[#5B0E14]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme || onToggleDarkMode}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-800 bg-[#111112] px-3 py-1.5 text-gray-400 hover:bg-[#232325] hover:text-[#F1E194] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-[1px] transition-all"
                aria-label="Toggle theme"
                id="theme-toggle-btn"
              >
                {theme === 'dark' || darkMode ? <Sun size={14} /> : <Moon size={14} />}
                <span className="hidden xl:inline font-sans text-[9px] uppercase tracking-[0.2em] font-black">{theme === 'dark' ? 'Light Theme' : 'Original Dark'}</span>
              </button>

              {/* Portal Access Badge */}
              {userRole ? (
                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1 border-2 border-gray-800 bg-[#111112] px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
                    <UserCheck size={12} className="text-[#F1E194]" />
                    <span className="hidden xl:inline">Role: </span>
                    <span>{userRole === 'professor' ? 'Professor' : 'Student'}</span>
                  </span>
                  <button
                    onClick={() => {
                      onRoleChange(null);
                      handleNavClick('selection');
                    }}
                    className="text-[9px] font-black uppercase tracking-wider text-gray-500 hover:text-red-500 transition-colors"
                    id="switch-role-btn"
                  >
                    Switch
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('selection')}
                  className="rounded-lg bg-[#5B0E14] px-4 py-2 text-[10px] uppercase font-black tracking-wider text-white border-2 border-red-950 shadow-[inset_0_-3px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-[1px] transition-all hover:bg-red-900"
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
              onClick={toggleTheme || onToggleDarkMode}
              className="flex items-center gap-2 rounded-xl p-2 text-gray-400 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
              id="theme-toggle-mobile-btn"
            >
              <span className="text-xs font-semibold">{theme === 'dark' ? 'Light Theme' : 'Original Dark'}</span>
              {theme === 'dark' || darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-100 bg-white px-4 pt-2 pb-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
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
                      ? 'bg-blue-50/50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                  id={`mobile-nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="my-3 h-px bg-gray-100 dark:bg-slate-800" />

          <div>
            {userRole ? (
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="font-mono text-xs font-medium text-gray-600 dark:text-slate-300">
                  Role: {userRole === 'professor' ? 'Professor' : 'Student'}
                </span>
                <button
                  onClick={() => {
                    onRoleChange(null);
                    handleNavClick('selection');
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400"
                  id="mobile-switch-role-btn"
                >
                  Switch Role
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('selection')}
                className="w-full rounded-xl bg-gray-900 py-2.5 text-center text-sm font-semibold text-white transition-all dark:bg-slate-100 dark:text-slate-900"
                id="mobile-get-started-btn"
              >
                Enter Portal
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
