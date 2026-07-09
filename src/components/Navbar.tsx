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
}

export default function Navbar({
  currentView,
  onNavigate,
  userRole,
  onRoleChange,
  darkMode,
  onToggleDarkMode
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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/92 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/92">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
            id="nav-logo"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white dark:bg-blue-600">
              <GraduationCap size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-slate-50">
                Prof. Anand Sen
              </span>
              <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase dark:text-slate-400">
                Academic Library
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <div className="flex space-x-6">
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
                    className={`relative py-2 text-sm font-medium transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 ${
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-slate-400'
                    }`}
                    id={`nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-500 dark:bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />

            <div className="flex items-center space-x-4">
              {/* Dark mode button */}
              <button
                onClick={onToggleDarkMode}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Toggle theme"
                id="theme-toggle-btn"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Portal Access Badge */}
              {userRole ? (
                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1 rounded-lg bg-gray-50 px-2.5 py-1 font-mono text-[11px] font-medium text-gray-600 border border-gray-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    <UserCheck size={12} className="text-blue-500" />
                    <span>Role: {userRole === 'professor' ? 'Professor' : 'Student'}</span>
                  </span>
                  <button
                    onClick={() => {
                      onRoleChange(null);
                      handleNavClick('selection');
                    }}
                    className="text-xs font-medium text-gray-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                    id="switch-role-btn"
                  >
                    Switch
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('selection')}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-gray-800 active:scale-98 dark:bg-slate-150 dark:text-slate-900 dark:hover:bg-white"
                  id="nav-get-started-btn"
                >
                  Enter Portal
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={onToggleDarkMode}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
              id="theme-toggle-mobile-btn"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
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
        <div className="border-b border-gray-100 bg-white px-4 pt-2 pb-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:hidden">
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
