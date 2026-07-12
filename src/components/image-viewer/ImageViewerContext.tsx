/**
 * ImageViewerContext — shared state for the in-app image viewer.
 * Mirror of PDFContext's provider pattern.
 *
 * Usage:
 *   const { openViewer } = useImageViewer();
 *   openViewer('/ajesh-joe.png');
 *   openViewer(images, 0);  // gallery mode
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import { ImageViewer } from './ImageViewer';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ViewerImage {
  src: string;
  alt?: string;
  name?: string;
  /** byte size for display */
  size?: number;
  uploadedAt?: string;
}

interface ImageViewerState {
  images: ViewerImage[];
  index: number;
  zoom: number;
  rotation: number;
}

interface ImageViewerContextValue {
  /**
   * Open the viewer with a single image or a gallery set.
   *
   * @param imageOrImages - A single image URL string, a single ViewerImage object,
   *                        or an array of ViewerImage objects for gallery mode.
   * @param startIndex    - Which image to show first (gallery mode only, default 0).
   */
  openViewer: (
    imageOrImages: string | ViewerImage | ViewerImage[],
    startIndex?: number
  ) => void;
  closeViewer: () => void;
  isOpen: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ImageViewerContext = createContext<ImageViewerContextValue | null>(null);

export function useImageViewer(): ImageViewerContextValue {
  const ctx = useContext(ImageViewerContext);
  if (!ctx) throw new Error('useImageViewer must be used inside ImageViewerProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ImageViewerProviderProps {
  children: React.ReactNode;
}

export function ImageViewerProvider({ children }: ImageViewerProviderProps) {
  const [state, setState] = useState<ImageViewerState | null>(null);

  const openViewer = useCallback(
    (imageOrImages: string | ViewerImage | ViewerImage[], startIndex = 0) => {
      let images: ViewerImage[];

      if (typeof imageOrImages === 'string') {
        images = [{ src: imageOrImages }];
      } else if (Array.isArray(imageOrImages)) {
        images = imageOrImages;
      } else {
        images = [imageOrImages];
      }

      setState({
        images,
        index: Math.max(0, Math.min(startIndex, images.length - 1)),
        zoom: 1,
        rotation: 0,
      });
    },
    []
  );

  const closeViewer = useCallback(() => setState(null), []);

  const value: ImageViewerContextValue = {
    openViewer,
    closeViewer,
    isOpen: state !== null,
  };

  return (
    <ImageViewerContext.Provider value={value}>
      {children}
      {state && (
        <ImageViewer
          images={state.images}
          initialIndex={state.index}
          onClose={closeViewer}
        />
      )}
    </ImageViewerContext.Provider>
  );
}
