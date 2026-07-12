/**
 * ImageViewer — Full-screen overlay image viewer.
 * Styled to match PDFViewer's visual language (charcoal backdrop, same color tokens).
 *
 * Features:
 * - Fade + scale-in entrance animation (respects prefers-reduced-motion)
 * - Close on: X button, backdrop click, Escape key
 * - Zoom in/out/reset, rotate left/right
 * - Pan / drag when zoomed > 1×
 * - Swipe to navigate in gallery mode
 * - Pinch-to-zoom on touch devices
 * - Loading skeleton / spinner
 * - Preload adjacent gallery images
 * - Focus trap while open
 * - Keyboard: +/-, 0, ←/→, Esc
 * - Download button (actual file download)
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { ViewerImage } from './ImageViewerContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return ''; }
}

/** Detect system-level reduced motion preference */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SPRING = { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 } as const;

// ─── Sub-component: Thumbnail Strip ──────────────────────────────────────────

const ThumbnailStrip = React.memo(({
  images, activeIndex, onSelect,
}: {
  images: ViewerImage[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) => {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

  return (
    <div
      className="iv-thumb-strip"
      role="listbox"
      aria-label="Image thumbnails"
    >
      {images.map((img, i) => (
        <button
          key={i}
          ref={i === activeIndex ? activeRef : null}
          role="option"
          aria-selected={i === activeIndex}
          aria-label={img.alt || img.name || `Image ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`iv-thumb${i === activeIndex ? ' iv-thumb--active' : ''}`}
        >
          <img
            src={img.src}
            alt={img.alt || ''}
            loading="lazy"
            draggable={false}
            className="iv-thumb-img"
          />
        </button>
      ))}
    </div>
  );
});
ThumbnailStrip.displayName = 'ThumbnailStrip';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ImageViewerProps {
  images: ViewerImage[];
  initialIndex?: number;
  onClose: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ImageViewer({ images, initialIndex = 0, onClose }: ImageViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedSet, setPreloadedSet] = useState<Set<number>>(() => new Set([initialIndex]));

  const containerRef = useRef<HTMLDivElement>(null);
  const current = images[index];
  const hasMultiple = images.length > 1;

  // ── Preload adjacent images ──────────────────────────────────────────────
  useEffect(() => {
    [index - 1, index, index + 1].filter(i => i >= 0 && i < images.length).forEach(i => {
      if (!preloadedSet.has(i)) {
        const img = new Image();
        img.src = images[i].src;
        setPreloadedSet(prev => new Set([...prev, i]));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images]);

  // ── Reset state on index change ──────────────────────────────────────────
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setImgNaturalSize(null);
    setIsLoading(true);
  }, [index]);

  // ── Lock body scroll ─────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Focus trap ────────────────────────────────────────────────────────────
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goTo = useCallback((i: number, dir = 0) => {
    if (i < 0 || i >= images.length) return;
    setDirection(dir || (i > index ? 1 : -1));
    setIndex(i);
  }, [index, images.length]);

  // ── Zoom helpers ──────────────────────────────────────────────────────────
  const zoomIn  = useCallback(() => setZoom(z => Math.min(z + 0.5, 5)), []);
  const zoomOut = useCallback(() => {
    setZoom(z => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);
  const resetZoom = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  // ── Rotate helpers ─────────────────────────────────────────────────────────
  const rotateLeft  = useCallback(() => setRotation(r => (r - 90 + 360) % 360), []);
  const rotateRight = useCallback(() => setRotation(r => (r + 90) % 360), []);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'Escape':      onClose(); break;
        case 'ArrowLeft':   goTo(index - 1); break;
        case 'ArrowRight':  goTo(index + 1); break;
        case '+': case '=': zoomIn(); break;
        case '-':           zoomOut(); break;
        case '0':           resetZoom(); break;
        case '[':           rotateLeft(); break;
        case ']':           rotateRight(); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // ── Mouse-wheel zoom ──────────────────────────────────────────────────────
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY / 600;
    setZoom(z => {
      const next = Math.max(1, Math.min(5, z + delta));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  // ── Double-click toggle zoom ──────────────────────────────────────────────
  const handleDoubleClick = () => {
    if (zoom > 1) resetZoom(); else setZoom(2.5);
  };

  // ── Drag-to-pan (zoomed) ──────────────────────────────────────────────────
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (zoom <= 1) return;
    setPan(prev => ({ x: prev.x + info.offset.x, y: prev.y + info.offset.y }));
    setIsDragging(false);
  };

  // ── Swipe to navigate (not zoomed) ───────────────────────────────────────
  const handleDragEndSwipe = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (zoom > 1) return;
    if (info.offset.x < -60) goTo(index + 1);
    else if (info.offset.x > 60) goTo(index - 1);
  };

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = async () => {
    try {
      const res = await fetch(current.src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = current.name || `image-${index + 1}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      const a = document.createElement('a');
      a.href = current.src;
      a.download = current.name || `image-${index + 1}`;
      a.click();
    }
  };

  // ── Image natural size ─────────────────────────────────────────────────
  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    setIsLoading(false);
  };

  const handleImgError = () => setIsLoading(false);

  const resolutionLabel = imgNaturalSize
    ? `${imgNaturalSize.w} × ${imgNaturalSize.h}`
    : null;

  // ── Animation variants ────────────────────────────────────────────────────
  const backdropVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
    exit:    { opacity: 0 },
  };

  const dialogVariants = prefersReducedMotion
    ? { hidden: {}, visible: {}, exit: {} }
    : {
        hidden:  { opacity: 0, scale: 0.94 },
        visible: { opacity: 1, scale: 1 },
        exit:    { opacity: 0, scale: 0.94 },
      };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: prefersReducedMotion ? 1 : 0,
    }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: prefersReducedMotion ? 1 : 0,
    }),
  };

  // ── Imports for toolbar icons (referenced from ImageViewerToolbar) ─────────
  // Toolbar is inlined here to avoid a second context layer

  return createPortal(
    <AnimatePresence>
      {/* ── Root dialog ──────────────────────────────────────────────────── */}
      <motion.div
        ref={containerRef}
        key="iv-root"
        className="iv-root"
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        tabIndex={-1}
        style={{ outline: 'none' }}
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        onWheel={handleWheel}
      >
        {/* ── Backdrop ──────────────────────────────────────────────────── */}
        <motion.div
          key="iv-backdrop"
          className="iv-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        <ImageViewerToolbar
          zoom={zoom}
          rotation={rotation}
          index={index}
          total={images.length}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onRotateLeft={rotateLeft}
          onRotateRight={rotateRight}
          onDownload={handleDownload}
          onPrev={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
          onClose={onClose}
          src={current.src}
        />

        {/* ── Prev / Next arrows ────────────────────────────────────────── */}
        {hasMultiple && (
          <>
            <motion.button
              className="iv-arrow iv-arrow--prev"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              disabled={index === 0}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
            >
              <ChevronLeftIcon />
            </motion.button>
            <motion.button
              className="iv-arrow iv-arrow--next"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              disabled={index === images.length - 1}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
            >
              <ChevronRightIcon />
            </motion.button>
          </>
        )}

        {/* ── Image Stage ──────────────────────────────────────────────── */}
        <div className="iv-stage">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="iv-skeleton" aria-label="Loading image…" role="status">
              <div className="iv-skeleton-pulse" />
            </div>
          )}

          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={`iv-img-${index}`}
              className="iv-img-wrapper"
              custom={direction}
              variants={hasMultiple ? slideVariants : undefined}
              initial={hasMultiple ? 'enter' : { opacity: 0, scale: 0.96 }}
              animate={hasMultiple ? 'center' : { opacity: 1, scale: 1 }}
              exit={hasMultiple ? 'exit' : { opacity: 0, scale: 0.96 }}
              transition={SPRING}
              drag={zoom > 1 ? true : hasMultiple ? 'x' : false}
              dragConstraints={zoom > 1 ? undefined : { left: 0, right: 0 }}
              dragElastic={zoom > 1 ? 0.05 : 0.28}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={zoom > 1 ? handleDragEnd : handleDragEndSwipe}
              style={zoom > 1 ? {
                cursor: isDragging ? 'grabbing' : 'grab',
                x: pan.x,
                y: pan.y,
              } : {}}
            >
              <motion.img
                src={current.src}
                alt={current.alt || current.name || `Image ${index + 1}`}
                className="iv-img"
                draggable={false}
                onLoad={handleImgLoad}
                onError={handleImgError}
                onDoubleClick={handleDoubleClick}
                style={{
                  scale: zoom,
                  rotate: rotation,
                  opacity: isLoading ? 0 : 1,
                  transition: 'opacity 0.2s',
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom info bar + thumbnail strip ─────────────────────────── */}
        <motion.div
          className="iv-bottom"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
        >
          {/* File info */}
          <div className="iv-info-bar">
            {current.name && (
              <span className="iv-info-name">{current.name}</span>
            )}
            {resolutionLabel && (
              <span className="iv-info-chip">{resolutionLabel}</span>
            )}
            {current.size != null && (
              <span className="iv-info-chip">{formatBytes(current.size)}</span>
            )}
            {current.uploadedAt && (
              <span className="iv-info-chip">{formatDate(current.uploadedAt)}</span>
            )}
            <span className="iv-info-hint">
              Double-click to zoom · Drag to pan
              {hasMultiple ? ' · ← → navigate' : ''}
              {' · [ ] rotate · Esc close'}
            </span>
          </div>

          {/* Thumbnail strip */}
          {hasMultiple && (
            <ThumbnailStrip
              images={images}
              activeIndex={index}
              onSelect={i => goTo(i)}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ─── Inline icon helpers (avoids a separate import file) ─────────────────────

function ChevronLeftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── ImageViewerToolbar (inlined in same file to share state cleanly) ─────────

interface ToolbarProps {
  zoom: number;
  rotation: number;
  index: number;
  total: number;
  src: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onDownload: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

function ImageViewerToolbar({
  zoom, rotation, index, total, src,
  onZoomIn, onZoomOut, onResetZoom,
  onRotateLeft, onRotateRight,
  onDownload, onPrev, onNext, onClose,
}: ToolbarProps) {
  const hasMultiple = total > 1;
  const BTN = 'iv-tb-btn';
  const DIVIDER = <div className="iv-tb-divider" aria-hidden="true" />;

  return (
    <motion.div
      className="iv-toolbar"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      role="toolbar"
      aria-label="Image viewer toolbar"
    >
      {/* Gallery counter */}
      {hasMultiple && (
        <>
          <button
            className={BTN}
            onClick={onPrev}
            disabled={index === 0}
            aria-label="Previous image"
            title="Previous (←)"
          >
            <TbIcon d="M15 18l-6-6 6-6" />
          </button>
          <span className="iv-counter" aria-live="polite" aria-atomic="true">
            {index + 1}&thinsp;/&thinsp;{total}
          </span>
          <button
            className={BTN}
            onClick={onNext}
            disabled={index === total - 1}
            aria-label="Next image"
            title="Next (→)"
          >
            <TbIcon d="M9 18l6-6-6-6" />
          </button>
          {DIVIDER}
        </>
      )}

      {/* Zoom controls */}
      <button
        className={BTN}
        onClick={onZoomOut}
        disabled={zoom <= 1}
        aria-label="Zoom out"
        title="Zoom out (−)"
      >
        <TbIcon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM8 11h6" />
      </button>

      <button
        className={`${BTN} iv-zoom-label`}
        onClick={onResetZoom}
        disabled={zoom === 1}
        aria-label="Reset zoom"
        title="Reset zoom (0)"
      >
        {Math.round(zoom * 100)}%
      </button>

      <button
        className={BTN}
        onClick={onZoomIn}
        disabled={zoom >= 5}
        aria-label="Zoom in"
        title="Zoom in (+)"
      >
        <TbIcon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6" />
      </button>

      {DIVIDER}

      {/* Rotate */}
      <button
        className={BTN}
        onClick={onRotateLeft}
        aria-label="Rotate left 90°"
        title="Rotate left ([)"
      >
        <TbIcon d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5" />
      </button>
      <button
        className={BTN}
        onClick={onRotateRight}
        aria-label="Rotate right 90°"
        title="Rotate right (])"
      >
        <TbIcon d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5" />
      </button>

      {DIVIDER}

      {/* Download */}
      <button
        className={BTN}
        onClick={onDownload}
        aria-label="Download image"
        title="Download"
      >
        <TbIcon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </button>

      {/* Open original */}
      {!src.startsWith('data:') && (
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className={BTN}
          aria-label="Open original image in new tab"
          title="Open original"
        >
          <TbIcon d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
        </a>
      )}

      {DIVIDER}

      {/* Close */}
      <button
        className={`${BTN} iv-tb-btn--close`}
        onClick={onClose}
        aria-label="Close image viewer"
        title="Close (Esc)"
      >
        <TbIcon d="M18 6L6 18M6 6l12 12" />
      </button>
    </motion.div>
  );
}

/** Tiny SVG icon helper — mirrors lucide-react's stroke style */
function TbIcon({ d }: { d: string }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
