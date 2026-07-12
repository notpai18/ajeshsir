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
import LegalPage from './pages/LegalPage';
import DotGrid from './components/backgrounds/DotGrid';

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

  let currentView: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact' | 'legal' = 'home';
  if (location.pathname.startsWith('/selection')) currentView = 'selection';
  else if (location.pathname.startsWith('/resources')) currentView = userRole === 'professor' ? 'professor' : 'student';
  else if (location.pathname.startsWith('/about')) currentView = 'about';
  else if (location.pathname.startsWith('/contact')) currentView = 'contact';
  else if (location.pathname.startsWith('/privacy') || location.pathname.startsWith('/terms') || location.pathname.startsWith('/accessibility')) currentView = 'legal';

  const handleNavigate = (view: string) => {
    switch (view) {
      case 'home': navigate('/'); break;
      case 'selection': navigate('/selection'); break;
      case 'student':
      case 'professor': navigate('/resources'); break;
      case 'about': navigate('/about'); break;
      case 'contact': navigate('/contact'); break;
      case 'privacy': navigate('/privacy'); break;
      case 'terms': navigate('/terms'); break;
      case 'accessibility': navigate('/accessibility'); break;
    }
  };

  const handleSelectRole = (selected: 'student' | 'professor') => {
    setUserRole(selected);
    navigate('/resources');
  };

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F3EC] dark:bg-[#1A1817] text-[#22201F] dark:text-[#F6F2EA] transition-colors duration-300 relative">
      
      <DotGrid
        dotSize={4}
        gap={24}
        baseColor="#D9C2A2"
        activeColor="#4A0E1B"
        proximity={100}
        shockRadius={200}
        shockStrength={3}
        resistance={750}
        returnDuration={1.2}
      />

      {/* Contact Page Global Background Overlay */}
      {currentView === 'contact' && (
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.12] dark:opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%234A0E1B' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cg transform='translate(20, 20) scale(0.9)'%3E%3Cpath d='M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a2.5 2.5 0 0 0 2.227 3.45h10.106a2.5 2.5 0 0 0 2.227-3.45l-5.069-10.127A2 2 0 0 1 14 9.527V2'/%3E%3Cpath d='M8.5 2h7'/%3E%3Cpath d='M14 16H5.3'/%3E%3C/g%3E%3Cg transform='translate(80, 40) scale(0.9)'%3E%3Ccircle cx='12' cy='12' r='1' fill='%234A0E1B' stroke='none'/%3E%3Cellipse cx='12' cy='12' rx='11' ry='4' transform='rotate(60 12 12)'/%3E%3Cellipse cx='12' cy='12' rx='11' ry='4' transform='rotate(120 12 12)'/%3E%3C/g%3E%3Cg transform='translate(30, 80) scale(0.9)'%3E%3Cpath d='M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2'/%3E%3Cpath d='M8.5 2h7'/%3E%3Cpath d='M14.5 16h-5'/%3E%3C/g%3E%3Cg transform='translate(90, 90) scale(0.9)'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'/%3E%3C/g%3E%3Cpath d='M60 10 v 4 m -2 -2 h 4' stroke-width='1'/%3E%3Cpath d='M110 20 v 4 m -2 -2 h 4' stroke-width='1'/%3E%3Cpath d='M10 60 v 4 m -2 -2 h 4' stroke-width='1'/%3E%3Cpath d='M70 110 v 4 m -2 -2 h 4' stroke-width='1'/%3E%3Ccircle cx='50' cy='40' r='1.5' fill='%234A0E1B' stroke='none'/%3E%3Ccircle cx='80' cy='90' r='1.5' fill='%234A0E1B' stroke='none'/%3E%3Ccircle cx='20' cy='110' r='1.5' fill='%234A0E1B' stroke='none'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '120px 120px', backgroundRepeat: 'repeat' }}></div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">

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
          <Route path="/privacy" element={<LegalPage documentType="privacy" />} />
          <Route path="/terms" element={<LegalPage documentType="terms" />} />
          <Route path="/accessibility" element={<LegalPage documentType="accessibility" />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onNavigate={handleNavigate} userRole={userRole} />
      </div>
    </div>
  );
}
