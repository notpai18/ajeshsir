import React, { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppNew } from './AppNew';
import { PortalDataProvider } from './context/PortalDataContext';
import { ImageViewerProvider } from './components/image-viewer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [theme, setTheme] = useState<'current' | 'dark'>('current');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'current' ? 'dark' : 'current');
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <PortalDataProvider>
        <ImageViewerProvider>
          <AppNew theme={theme} toggleTheme={toggleTheme} />
        </ImageViewerProvider>
      </PortalDataProvider>
    </BrowserRouter>
  );
}
