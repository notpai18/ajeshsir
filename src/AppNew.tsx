/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AppNew.tsx — Primary application shell (routing + role management only).
 * All data state and CRUD handlers live in src/context/PortalDataContext.tsx.
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SelectionPage from './pages/SelectionPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ResourcesPage from './pages/ResourcesPage';

export function AppNew({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState<'student' | 'professor' | null>(() => {
    try {
      const saved = localStorage.getItem('prof_portal_user_role_v1');
      return saved ? (JSON.parse(saved) as any) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('prof_portal_user_role_v1', JSON.stringify(userRole));
    } catch (e) {
      console.warn(e);
    }
  }, [userRole]);

  // Derived current view for legacy Navbar / Footer
  let currentView: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact' = 'home';
  if (location.pathname.startsWith('/selection')) currentView = 'selection';
  else if (location.pathname.startsWith('/resources')) currentView = userRole === 'professor' ? 'professor' : 'student';
  else if (location.pathname.startsWith('/about')) currentView = 'about';
  else if (location.pathname.startsWith('/contact')) currentView = 'contact';

  const handleNavigate = (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => {
    switch (view) {
      case 'home': navigate('/'); break;
      case 'selection': navigate('/selection'); break;
      case 'student':
      case 'professor': navigate('/resources'); break;
      case 'about': navigate('/about'); break;
      case 'contact': navigate('/contact'); break;
    }
  };

  const handleSelectRole = (selected: 'student' | 'professor') => {
    setUserRole(selected);
    navigate('/resources');
  };

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] transition-colors duration-300">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={userRole}
        onRoleChange={setUserRole}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onGetStarted={() => handleNavigate('selection')} onNavigate={handleNavigate} />} />
          
          <Route path="/selection" element={<SelectionPage onSelectRole={handleSelectRole} />} />
          
          <Route path="/resources/*" element={<ResourcesPage userRole={userRole} />} />

          <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onNavigate={handleNavigate} userRole={userRole} />
    </div>
  );
}
