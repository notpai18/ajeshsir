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
}

export default function Navbar({
  currentView,
  onNavigate,
  userRole,
  onRoleChange
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
    <nav className="sticky top-5 z-50 mx-auto mt-5 w-[90%] max-w-7xl rounded-full border border-[#E5E5EA] bg-[rgba(255,255,255,0.8)] backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
            id="nav-logo"
          >
            <div className="flex h-11 w-11 items-center justify-center drop-shadow-sm">
              <img 
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png" 
                alt="Portal Logo" 
                className="h-full w-full object-contain transition-transform duration-300 hover:-rotate-6 hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-display font-bold tracking-tight text-[#1D1D1F]">
                Prof. Ajesh Joe
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#0071E3]">
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
                    className={`relative py-2 text-[10px] uppercase tracking-[0.1em] font-black transition-colors duration-200 hover:text-[#1D1D1F] ${
                      isActive 
                        ? 'text-[#1D1D1F]' 
                        : 'text-[#86868B]'
                    }`}
                    id={`nav-item-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-[-22px] left-0 h-1 w-full bg-[#0071E3]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-gray-200 " />

            <div className="flex items-center space-x-4">
              {/* Portal Access Badge */}
              {userRole ? (
                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1 border-2 border-[#E5E5EA] bg-[#F5F5F7] px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#86868B]">
                    <UserCheck size={12} className="text-[#0071E3]" />
                    <span>Role: {userRole === 'professor' ? 'Professor' : 'Student'}</span>
                  </span>
                  <button
                    onClick={() => {
                      onRoleChange(null);
                      handleNavClick('selection');
                    }}
                    className="text-[9px] font-black uppercase tracking-wider text-[#86868B] hover:text-red-500 transition-colors"
                    id="switch-role-btn"
                  >
                    Switch
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('selection')}
                  className="rounded-lg bg-[#0071E3] px-4 py-2 text-[10px] uppercase font-black tracking-wider text-white border-2 border-[#005bb5] shadow-[inset_0_-3px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-[1px] transition-all hover:bg-[#005bb5]"
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
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-gray-100 bg-white px-4 pt-2 pb-4 shadow-xl transition-colors duration-300   md:hidden">
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
                      ? 'bg-blue-50/50 text-blue-600  ' 
                      : 'text-gray-600 hover:bg-gray-50  :bg-slate-800/50'
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
                  className="text-xs font-semibold text-blue-600 "
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
        </div>
      )}
    </nav>
  );
}
