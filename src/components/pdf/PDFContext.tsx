/**
 * PDFContext — shared state for the in-app PDF viewer.
 * All sub-components consume this context.
 */
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export interface PDFDocumentInfo {
  title: string;
  fileUrl: string;
  fileSize?: string;
  uploadDate?: string;
  downloadCount?: number;
  isProfessor?: boolean;
  entityType?: 'note' | 'pyq' | 'sheet';
  entityId?: string;
  onDelete?: () => void;
  onReplace?: () => void;
}

export interface Bookmark {
  id: string;
  page: number;
  label: string;
  createdAt: number;
}

export interface ReadingProgress {
  lastPage: number;
  zoom: number;
  timestamp: number;
}

interface PDFContextValue {
  // Document
  docInfo: PDFDocumentInfo | null;
  numPages: number;
  setNumPages: (n: number) => void;

  // Navigation
  currentPage: number;
  setCurrentPage: (p: number) => void;
  goToPage: (p: number) => void;

  // Zoom
  zoom: number;
  setZoom: (z: number) => void;
  zoomMode: 'custom' | 'fitWidth' | 'fitPage';
  setZoomMode: (m: 'custom' | 'fitWidth' | 'fitPage') => void;

  // Rotation
  rotation: number;
  setRotation: (r: number) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (o: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchCaseSensitive: boolean;
  setSearchCaseSensitive: (v: boolean) => void;

  // Fullscreen
  isFullscreen: boolean;
  toggleFullscreen: () => void;

  // Theme
  theme: 'light' | 'dark' | 'sepia';
  setTheme: (t: 'light' | 'dark' | 'sepia') => void;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (page: number, label?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (page: number) => boolean;

  // Info panel
  infoPanelOpen: boolean;
  setInfoPanelOpen: (o: boolean) => void;

  // Scroll container ref
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;

  // Page jump target (used for thumbnail click → scroll)
  jumpTarget: number | null;
  setJumpTarget: (n: number | null) => void;
}

const PDFContext = createContext<PDFContextValue | null>(null);

export function usePDF() {
  const ctx = useContext(PDFContext);
  if (!ctx) throw new Error('usePDF must be inside PDFProvider');
  return ctx;
}

interface PDFProviderProps {
  docInfo: PDFDocumentInfo;
  children: React.ReactNode;
}

export function PDFProvider({ docInfo, children }: PDFProviderProps) {
  const storageKey = `pdf_progress_${docInfo.entityId || btoa(docInfo.fileUrl).slice(0, 16)}`;

  // Load persisted progress
  const savedProgress = (): ReadingProgress | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const saved = savedProgress();

  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPageRaw] = useState(saved?.lastPage ?? 1);
  const [zoom, setZoomRaw] = useState(saved?.zoom ?? 1.0);
  const [zoomMode, setZoomMode] = useState<'custom' | 'fitWidth' | 'fitPage'>('fitWidth');
  const [rotation, setRotation] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCaseSensitive, setSearchCaseSensitive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [jumpTarget, setJumpTarget] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Persist progress
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({
      lastPage: currentPage,
      zoom,
      timestamp: Date.now(),
    }));
  }, [currentPage, zoom, storageKey]);

  // Load bookmarks
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`pdf_bookmarks_${storageKey}`);
      if (raw) setBookmarks(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [storageKey]);

  const saveBookmarks = useCallback((bms: Bookmark[]) => {
    localStorage.setItem(`pdf_bookmarks_${storageKey}`, JSON.stringify(bms));
  }, [storageKey]);

  const setCurrentPage = useCallback((p: number) => {
    setCurrentPageRaw(p);
  }, []);

  const goToPage = useCallback((p: number) => {
    if (p < 1 || (numPages > 0 && p > numPages)) return;
    setCurrentPage(p);
    setJumpTarget(p);
  }, [numPages, setCurrentPage]);

  const setZoom = useCallback((z: number) => {
    setZoomRaw(Math.min(Math.max(z, 0.25), 4.0));
    setZoomMode('custom');
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const addBookmark = useCallback((page: number, label?: string) => {
    const bm: Bookmark = {
      id: `${Date.now()}`,
      page,
      label: label || `Page ${page}`,
      createdAt: Date.now(),
    };
    setBookmarks(prev => {
      const next = [...prev, bm];
      saveBookmarks(next);
      return next;
    });
  }, [saveBookmarks]);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = prev.filter(b => b.id !== id);
      saveBookmarks(next);
      return next;
    });
  }, [saveBookmarks]);

  const isBookmarked = useCallback((page: number) => {
    return bookmarks.some(b => b.page === page);
  }, [bookmarks]);

  const value: PDFContextValue = {
    docInfo,
    numPages,
    setNumPages,
    currentPage,
    setCurrentPage,
    goToPage,
    zoom,
    setZoom,
    zoomMode,
    setZoomMode,
    rotation,
    setRotation,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    searchCaseSensitive,
    setSearchCaseSensitive,
    isFullscreen,
    toggleFullscreen,
    theme,
    setTheme,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    infoPanelOpen,
    setInfoPanelOpen,
    scrollContainerRef,
    jumpTarget,
    setJumpTarget,
  };

  return <PDFContext.Provider value={value}>{children}</PDFContext.Provider>;
}
