/**
 * VideoPlayer.tsx — Reusable embedded YouTube IFrame player
 *
 * Renders a responsive 16:9 YouTube embed with a loading skeleton
 * and an optional onEnd callback (via postMessage).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getYoutubeEmbedUrl } from '../lib/youtube';

interface VideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  onEnd?: () => void;
  className?: string;
}

export function VideoPlayer({ videoId, autoplay = false, onEnd, className = '' }: VideoPlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for YouTube IFrame API postMessage events to detect video end
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!event.origin.includes('youtube.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // playerState 0 = ENDED
        if (data?.event === 'onStateChange' && data?.info === 0) {
          onEnd?.();
        }
      } catch {
        // ignore malformed messages
      }
    },
    [onEnd],
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // Reset loaded state when videoId changes
  useEffect(() => {
    setLoaded(false);
  }, [videoId]);

  const embedUrl = getYoutubeEmbedUrl(videoId, {
    autoplay,
    rel: 0,
    enableJsApi: true,
  });

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-[#0f0f0f] ${className}`}>
      {/* Loading skeleton */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f0f]">
          {/* Shimmer bars */}
          <div className="w-full space-y-3 px-8">
            <div className="h-2 w-3/4 animate-pulse rounded-full bg-white dark:bg-[#22201F]/10" />
            <div className="h-2 w-1/2 animate-pulse rounded-full bg-white dark:bg-[#22201F]/10" />
          </div>
          {/* Play icon shimmer */}
          <div className="mt-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-white dark:bg-[#22201F]/10">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-white/30 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Loading lecture…
          </p>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="Lecture video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
