/**
 * ImageLightbox — Premium fullscreen image viewer
 * Inspired by Apple Photos, Google Photos, Notion, Discord
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LightboxImage {
  src: string;
  alt?: string;
  name?: string;
  size?: number;      // bytes
  uploadedAt?: string; // ISO date
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif|heic)(\?.*)?$/i.test(url) ||
    url.startsWith('data:image/');
}

// ─── Sub-component: Thumbnail Strip ──────────────────────────────────────────

const ThumbnailStrip = React.memo(({
  images,
  activeIndex,
  onSelect,
}: {
  images: LightboxImage[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) => {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

  return (
    <div
      className="lb-thumb-strip"
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
          className={`lb-thumb ${i === activeIndex ? 'lb-thumb--active' : ''}`}
        >
          <img
            src={img.src}
            alt={img.alt || ''}
            loading="lazy"
            draggable={false}
            className="lb-thumb-img"
          />
        </button>
      ))}
    </div>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function ImageLightbox({ images, initialIndex = 0, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [preloadedIndices, setPreloadedIndices] = useState<Set<number>>(new Set([initialIndex]));
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = images[index];
  const hasMultiple = images.length > 1;

  // ── Preload adjacent images ──────────────────────────────────────────────
  useEffect(() => {
    const toPreload = [index - 1, index, index + 1].filter(
      (i) => i >= 0 && i < images.length
    );
    toPreload.forEach((i) => {
      if (!preloadedIndices.has(i)) {
        const img = new Image();
        img.src = images[i].src;
        setPreloadedIndices((prev) => new Set([...prev, i]));
      }
    });
  }, [index, images]);

  // ── Reset zoom / pan when index changes ──────────────────────────────────
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setImgNaturalSize(null);
  }, [index]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowLeft')  { goTo(index - 1); return; }
      if (e.key === 'ArrowRight') { goTo(index + 1); return; }
      if (e.key === '+' || e.key === '=') { handleZoomIn(); return; }
      if (e.key === '-') { handleZoomOut(); return; }
      if (e.key === '0') { resetZoom(); return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // ── Focus trap ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (el) { el.focus(); }
    // lock body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= images.length) return;
    setIndex(i);
  }, [images.length]);

  // ── Zoom controls ─────────────────────────────────────────────────────────
  const handleZoomIn  = () => setZoom((z) => Math.min(z + 0.5, 5));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // Double-click to toggle zoom
  const handleDoubleClick = () => {
    if (zoom > 1) { resetZoom(); } else { setZoom(2.5); }
  };

  // Mouse-wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY / 500;
    setZoom((z) => {
      const next = Math.max(1, Math.min(5, z + delta));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  // ── Drag-to-pan ──────────────────────────────────────────────────────────
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (zoom <= 1) return;
    setPan((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }));
    setIsDragging(false);
  };

  // ── Swipe navigation (when not zoomed) ───────────────────────────────────
  const handleDragEndSwipe = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (zoom > 1) return;
    if (info.offset.x < -60) { goTo(index + 1); }
    else if (info.offset.x > 60) { goTo(index - 1); }
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
      // fallback for data: URIs or CORS issues
      const a = document.createElement('a');
      a.href = current.src;
      a.download = current.name || `image-${index + 1}`;
      a.click();
    }
  };

  // ── Natural size from loaded img ─────────────────────────────────────────
  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const resolutionLabel = imgNaturalSize
    ? `${imgNaturalSize.w} × ${imgNaturalSize.h}`
    : null;

  // ── Direction for page transition ─────────────────────────────────────────
  const [[page, direction], setPage] = useState([initialIndex, 0]);

  const paginate = useCallback((newDir: number) => {
    const newIndex = index + newDir;
    if (newIndex < 0 || newIndex >= images.length) return;
    setPage([newIndex, newDir]);
    setIndex(newIndex);
  }, [index, images.length]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return createPortal(
    <AnimatePresence>
      <div
        ref={containerRef}
        className="lb-root"
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        tabIndex={-1}
        onWheel={handleWheel}
      >
        {/* ── Backdrop ──────────────────────────────────────────────────── */}
        <motion.div
          key="lb-backdrop"
          className="lb-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* ── Top toolbar ──────────────────────────────────────────────── */}
        <motion.div
          className="lb-toolbar lb-toolbar--top"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {/* Counter */}
          {hasMultiple && (
            <span className="lb-counter" aria-live="polite">
              {index + 1} / {images.length}
            </span>
          )}

          <div className="lb-spacer" />

          {/* Zoom controls */}
          <button
            className="lb-btn"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            aria-label="Zoom out"
            title="Zoom out (−)"
          >
            <ZoomOut size={18} />
          </button>
          <span className="lb-zoom-label">{Math.round(zoom * 100)}%</span>
          <button
            className="lb-btn"
            onClick={handleZoomIn}
            disabled={zoom >= 5}
            aria-label="Zoom in"
            title="Zoom in (+)"
          >
            <ZoomIn size={18} />
          </button>
          <button
            className="lb-btn"
            onClick={resetZoom}
            disabled={zoom === 1}
            aria-label="Reset zoom"
            title="Reset zoom (0)"
          >
            <RotateCcw size={16} />
          </button>

          <div className="lb-divider" />

          {/* Download */}
          <button
            className="lb-btn"
            onClick={handleDownload}
            aria-label="Download image"
            title="Download"
          >
            <Download size={18} />
          </button>

          {/* Open original */}
          {!current.src.startsWith('data:') && (
            <a
              href={current.src}
              target="_blank"
              rel="noopener noreferrer"
              className="lb-btn"
              aria-label="Open original in new tab"
              title="Open original"
            >
              <ExternalLink size={16} />
            </a>
          )}

          {/* Close */}
          <button
            className="lb-btn lb-btn--close"
            onClick={onClose}
            aria-label="Close image viewer"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </motion.div>

        {/* ── Previous / Next arrows ────────────────────────────────────── */}
        {hasMultiple && (
          <>
            <motion.button
              className="lb-arrow lb-arrow--prev"
              onClick={() => paginate(-1)}
              aria-label="Previous image"
              disabled={index === 0}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={28} />
            </motion.button>
            <motion.button
              className="lb-arrow lb-arrow--next"
              onClick={() => paginate(1)}
              aria-label="Next image"
              disabled={index === images.length - 1}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={28} />
            </motion.button>
          </>
        )}

        {/* ── Image Stage ──────────────────────────────────────────────── */}
        <div className="lb-stage">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={index}
              className="lb-img-wrapper"
              custom={direction}
              variants={hasMultiple ? slideVariants : undefined}
              initial={hasMultiple ? 'enter' : { opacity: 0, scale: 0.94 }}
              animate={hasMultiple ? 'center' : { opacity: 1, scale: 1 }}
              exit={hasMultiple ? 'exit' : { opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
              drag={zoom > 1 ? true : hasMultiple ? 'x' : false}
              dragConstraints={zoom > 1 ? undefined : { left: 0, right: 0 }}
              dragElastic={zoom > 1 ? 0.05 : 0.3}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={zoom > 1 ? handleDragEnd : handleDragEndSwipe}
              style={zoom > 1 ? {
                cursor: isDragging ? 'grabbing' : 'grab',
                x: pan.x,
                y: pan.y,
              } : {}}
            >
              <motion.img
                ref={imgRef}
                src={current.src}
                alt={current.alt || current.name || `Image ${index + 1}`}
                className="lb-img"
                draggable={false}
                onLoad={handleImgLoad}
                onDoubleClick={handleDoubleClick}
                style={{ scale: zoom }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom info + thumbnails ──────────────────────────────────── */}
        <motion.div
          className="lb-bottom"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
        >
          {/* File info bar */}
          <div className="lb-info-bar">
            {current.name && (
              <span className="lb-info-name">{current.name}</span>
            )}
            {resolutionLabel && (
              <span className="lb-info-chip">{resolutionLabel}</span>
            )}
            {current.size != null && (
              <span className="lb-info-chip">{formatBytes(current.size)}</span>
            )}
            {current.uploadedAt && (
              <span className="lb-info-chip">{formatDate(current.uploadedAt)}</span>
            )}
            <span className="lb-info-hint">
              Double-click to zoom · Drag to pan · ← → navigate · Esc close
            </span>
          </div>

          {/* Thumbnail strip */}
          {hasMultiple && (
            <ThumbnailStrip
              images={images}
              activeIndex={index}
              onSelect={(i) => { setPage([i, i > index ? 1 : -1]); setIndex(i); }}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

// ─── Trigger hook ─────────────────────────────────────────────────────────────

export interface UseLightboxReturn {
  open: (images: LightboxImage[], startIndex?: number) => void;
  lightbox: React.ReactNode;
}

export function useLightbox(): UseLightboxReturn {
  const [state, setState] = useState<{ images: LightboxImage[]; index: number } | null>(null);

  const open = useCallback((images: LightboxImage[], startIndex = 0) => {
    setState({ images, index: startIndex });
  }, []);

  const close = useCallback(() => setState(null), []);

  const lightbox = state ? (
    <ImageLightbox
      images={state.images}
      initialIndex={state.index}
      onClose={close}
    />
  ) : null;

  return { open, lightbox };
}

// ─── Convenience: wrap an <img> click to open lightbox ───────────────────────

export interface ClickableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  lightboxImages?: LightboxImage[];
  lightboxIndex?: number;
  onLightboxOpen?: (images: LightboxImage[], index: number) => void;
  name?: string;
  fileSize?: number;
  uploadedAt?: string;
  className?: string;
}

export const ClickableImage = React.forwardRef<HTMLImageElement, ClickableImageProps>(
  ({ src, lightboxImages, lightboxIndex = 0, onLightboxOpen, name, fileSize, uploadedAt, className = '', ...rest }, ref) => {
    const handleClick = () => {
      const imgs = lightboxImages ?? [{ src, alt: rest.alt, name, size: fileSize, uploadedAt }];
      onLightboxOpen?.(imgs, lightboxIndex);
    };

    return (
      <img
        ref={ref}
        src={src}
        className={`lb-clickable ${className}`}
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label={`View image${name ? `: ${name}` : ''}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
        draggable={false}
        {...rest}
      />
    );
  }
);
ClickableImage.displayName = 'ClickableImage';
