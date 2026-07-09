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

  const isProf = currentView === 'professor';
  const accentText = isProf ? 'text-[#4A0E1B]' : 'text-[#0071E3]';
  const accentBg = isProf ? 'bg-[#4A0E1B]' : 'bg-[#0071E3]';
  const accentBorder = isProf ? 'border-[#2A080F]' : 'border-[#005bb5]';
  const accentHoverBg = isProf ? 'hover:bg-[#2A080F]' : 'hover:bg-[#005bb5]';
  const badgeBg = isProf ? 'bg-[#F6F2EA]' : 'bg-[#F5F5F7]';
  const badgeHoverBg = isProf ? 'hover:bg-[#EAE1D2]' : 'hover:bg-gray-200';
  const mobileActiveBg = isProf ? 'bg-[#F2E7E9]/50 text-[#4A0E1B]' : 'bg-blue-50/50 text-blue-600';
  const mobileActionText = isProf ? 'text-[#4A0E1B]' : 'text-blue-600';

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
    <nav className="sticky top-5 z-50 mx-auto mt-5 w-[90%] max-w-7xl rounded-full border border-[#E5E5EA] bg-[rgba(255,255,255,0.8)] backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300">
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
              <span className="text-lg font-semibold tracking-tight text-[#1D1D1F]">
                Prof. Ajesh Joe
              </span>
              <span className={`text-[11px] font-medium tracking-wide ${accentText} transition-colors duration-300`}>
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
                    className={`relative py-2 text-sm font-medium transition-colors duration-200 hover:text-[#1D1D1F] ${
                      isActive 
                        ? 'text-[#1D1D1F]' 
                        : 'text-[#86868B]'
                    }`}
                    id={`nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.label}
                    {isActive && (
                      <span className={`absolute bottom-[-22px] left-0 h-1 w-full ${accentBg} transition-colors duration-300`} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-gray-200 " />

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 rounded-full border border-[#E5E5EA] ${badgeBg} px-3 py-1.5 text-xs font-medium text-[#1D1D1F] transition-all ${badgeHoverBg}`}
                id="theme-toggle-btn"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span className="hidden xl:inline">{theme === 'dark' ? 'Light Theme' : 'Original Dark'}</span>
              </button>

              {/* Portal Access Badge */}
              {userRole ? (
                <div className="flex items-center space-x-2">
                  <span className={`flex items-center space-x-1 border-2 border-[#E5E5EA] ${badgeBg} px-2.5 py-1 text-xs font-medium text-[#86868B] rounded-md transition-colors duration-300`}>
                    <UserCheck size={14} className={`${accentText} transition-colors duration-300`} />
                    <span className="hidden xl:inline">Role: </span>
                    <span>{userRole === 'professor' ? 'Professor' : 'Student'}</span>
                  </span>
                  <button
                    onClick={() => {
                      onRoleChange(null);
                      handleNavClick('selection');
                    }}
                    className="text-xs font-medium text-[#86868B] hover:text-red-500 transition-colors underline decoration-transparent hover:decoration-red-500 underline-offset-4"
                    id="switch-role-btn"
                  >
                    Switch
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('selection')}
                  className={`rounded-lg ${accentBg} px-4 py-2 text-sm font-medium text-white border-2 ${accentBorder} shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.3)] active:translate-y-[1px] transition-all ${accentHoverBg}`}
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
              className="rounded-xl p-2 text-[#86868B] hover:bg-gray-50  :bg-slate-800"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-gray-100 bg-white px-4 pt-2 pb-4 shadow-xl transition-colors duration-300 lg:hidden">
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
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  id={`mobile-nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="my-3 h-px bg-gray-100 " />

          <div>
            {userRole ? (
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50  rounded-xl border border-gray-100 ">
                <span className="font-mono text-xs font-medium text-gray-600 ">
                  Role: {userRole === 'professor' ? 'Professor' : 'Student'}
                </span>
                <button
                  onClick={() => {
                    onRoleChange(null);
                    handleNavClick('selection');
                  }}
                  className={`text-xs font-semibold ${mobileActionText}`}
                  id="mobile-switch-role-btn"
                >
                  Switch Role
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('selection')}
                className="w-full rounded-xl bg-gray-900 py-2.5 text-center text-sm font-semibold text-white transition-all  "
                id="mobile-get-started-btn"
              >
                Enter Portal
              </button>
            )}
          </div>
          
          <div className="border-t border-gray-100 pt-4 mt-4">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
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
