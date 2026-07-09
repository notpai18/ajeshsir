/**
 * VideoWatchModal.tsx — Premium in-app YouTube lecture viewer
 *
 * Design follows design.md — warm "professor's study" aesthetic:
 * - Deep maroon #4A0E1B accent
 * - Cream #F6F2EA canvas
 * - Plus Jakarta Sans body, Grandstander display
 * - Soft warm shadows and hairline warm borders
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  BookOpen,
  Maximize2,
  Minimize2,
  List,
} from 'lucide-react';
import type { Video } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { extractYouTubeId, getYoutubeThumbnail } from '../lib/youtube';

// ─── Design constants (from design.md) ───────────────────────────────────────
const CARD =
  'rounded-2xl border border-[#EAE1D2] bg-white shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]';
const MICRO = 'text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7E6F]';

const EXAM_LABELS: Record<string, string> = {
  'jee-main': 'JEE Main',
  'jee-advanced': 'JEE Advanced',
  neet: 'NEET',
  net: 'CSIR NET',
  'msc-entrance': 'M.Sc Entrance',
};

const EXAM_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'jee-main': { bg: 'bg-[#F4E7E5]', text: 'text-[#4A0E1B]', dot: 'bg-[#4A0E1B]' },
  'jee-advanced': { bg: 'bg-[#F3E6EA]', text: 'text-[#7A1F2B]', dot: 'bg-[#7A1F2B]' },
  neet: { bg: 'bg-[#E7EFE9]', text: 'text-[#2F6D4E]', dot: 'bg-[#2F6D4E]' },
  net: { bg: 'bg-[#E5EDF2]', text: 'text-[#2B5B7A]', dot: 'bg-[#2B5B7A]' },
  'msc-entrance': { bg: 'bg-[#F5ECD8]', text: 'text-[#8A5E1E]', dot: 'bg-[#A9772E]' },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface VideoWatchModalProps {
  /** The currently playing video */
  video: Video;
  /** All videos in the same course (for playlist/prev/next) */
  playlist: Video[];
  /** Called when modal is closed */
  onClose: () => void;
  /** Called when a playlist item is clicked */
  onSelectVideo: (video: Video) => void;
}

// ─── Thumbnail with fallback ──────────────────────────────────────────────────
function VideoThumbnail({
  videoId,
  alt,
  className,
}: {
  videoId: string | null;
  alt: string;
  className?: string;
}) {
  const [src, setSrc] = useState(
    videoId ? getYoutubeThumbnail(videoId, 'maxresdefault') : '',
  );

  useEffect(() => {
    if (videoId) setSrc(getYoutubeThumbnail(videoId, 'maxresdefault'));
  }, [videoId]);

  if (!videoId) {
    return (
      <div className={`flex items-center justify-center bg-[#F0E9DB] ${className}`}>
        <Play size={20} className="text-[#A79A88]" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (src.includes('maxresdefault')) {
          setSrc(getYoutubeThumbnail(videoId, 'hqdefault'));
        }
      }}
    />
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export function VideoWatchModal({
  video,
  playlist,
  onClose,
  onSelectVideo,
}: VideoWatchModalProps) {
  const [theater, setTheater] = useState(false);
  const [showUpNext, setShowUpNext] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const videoId = extractYouTubeId(video.youtubeLink);
  const currentIndex = playlist.findIndex((v) => v.id === video.id);
  const prevVideo = currentIndex > 0 ? playlist[currentIndex - 1] : null;
  const nextVideo = currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null;

  const exam = EXAM_STYLES[video.course] ?? EXAM_STYLES['jee-main'];
  const examLabel = EXAM_LABELS[video.course] ?? video.course;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleVideoEnd = useCallback(() => {
    if (nextVideo) {
      setShowUpNext(true);
    }
  }, [nextVideo]);

  const goNext = useCallback(() => {
    if (nextVideo) {
      setShowUpNext(false);
      onSelectVideo(nextVideo);
    }
  }, [nextVideo, onSelectVideo]);

  const goPrev = useCallback(() => {
    if (prevVideo) {
      setShowUpNext(false);
      onSelectVideo(prevVideo);
    }
  }, [prevVideo, onSelectVideo]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-4 dash-root">
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#22201F]/60 backdrop-blur-[2px]"
      />

      {/* Modal shell */}
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden bg-[#F6F2EA] transition-all duration-300 sm:rounded-2xl sm:shadow-2xl ${
          theater
            ? 'sm:max-w-[98vw] sm:max-h-[96vh]'
            : 'sm:max-w-6xl sm:max-h-[92vh]'
        }`}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#EFE7D8] bg-white px-4 py-3 sm:px-5">
          {/* Breadcrumb */}
          <nav className="flex min-w-0 items-center gap-1.5 text-xs text-[#8A7E6F]">
            <button
              onClick={onClose}
              className="shrink-0 font-semibold text-[#4A443E] hover:text-[#4A0E1B] transition-colors"
            >
              Library
            </button>
            <ChevronRight size={12} className="shrink-0 text-[#C0A98B]" />
            <span className="shrink-0 font-semibold text-[#4A443E]">{examLabel}</span>
            <ChevronRight size={12} className="shrink-0 text-[#C0A98B]" />
            <span className="shrink-0 font-semibold text-[#4A443E]">Video Lectures</span>
            <ChevronRight size={12} className="shrink-0 text-[#C0A98B]" />
            <span className="min-w-0 truncate font-semibold text-[#4A0E1B]">{video.title}</span>
          </nav>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Toggle sidebar (mobile) */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6E645A] transition-colors hover:bg-[#F6F2EA] hover:text-[#22201F] lg:hidden"
              aria-label={sidebarOpen ? 'Hide playlist' : 'Show playlist'}
            >
              <List size={16} />
            </button>
            {/* Theater mode */}
            <button
              onClick={() => setTheater((t) => !t)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6E645A] transition-colors hover:bg-[#F6F2EA] hover:text-[#22201F]"
              aria-label={theater ? 'Exit theater mode' : 'Theater mode'}
            >
              {theater ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6E645A] transition-colors hover:bg-[#F6F2EA] hover:text-[#22201F]"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body (player + sidebar) ─────────────────────────────────────── */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Player column */}
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
            {/* Player wrapper */}
            <div className="relative bg-[#0f0f0f]">
              {videoId ? (
                <VideoPlayer videoId={videoId} onEnd={handleVideoEnd} />
              ) : (
                /* No valid video ID */
                <div className="aspect-video w-full flex flex-col items-center justify-center bg-[#0f0f0f] text-center p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                    <Play size={28} className="text-white/40 ml-1" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white/60">
                    Invalid YouTube URL
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-white/30 max-w-xs">
                    The stored URL could not be parsed into a valid video ID.
                  </p>
                </div>
              )}

              {/* Up Next overlay */}
              {showUpNext && nextVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f0f]/90 text-white p-6">
                  <p className={MICRO + ' text-[#D9C2A2]'}>Up next</p>
                  <h3 className="dash-serif mt-2 text-xl font-semibold text-center max-w-sm leading-snug">
                    {nextVideo.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">{nextVideo.subject} · {nextVideo.chapter}</p>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setShowUpNext(false)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      Stay here
                    </button>
                    <button
                      onClick={goNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#4A0E1B] px-5 py-2 text-xs font-bold text-white hover:bg-[#380A14] transition-colors"
                    >
                      <Play size={13} /> Play next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Lecture info */}
            <div className="flex-1 space-y-5 p-4 sm:p-6">
              {/* Title row */}
              <div>
                {/* Chips */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${exam.bg} ${exam.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${exam.dot}`} />
                    {examLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE7D8] px-2.5 py-1 text-[10px] font-bold text-[#6E645A]">
                    <BookOpen size={10} />
                    {video.subject}
                  </span>
                  {video.duration && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE7D8] px-2.5 py-1 text-[10px] font-bold text-[#6E645A]">
                      <Clock size={10} />
                      {video.duration}
                    </span>
                  )}
                </div>

                <h2 className="dash-serif text-xl font-semibold text-[#22201F] leading-snug sm:text-2xl">
                  {video.title}
                </h2>
                <p className={`mt-1 ${MICRO}`}>{video.chapter}</p>
              </div>

              {/* Description */}
              {video.description && (
                <div className={`${CARD} p-4`}>
                  <p className={`${MICRO} mb-2`}>About this lecture</p>
                  <p className="text-sm leading-relaxed text-[#5A534B]">{video.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-[#8A7E6F]">
                    <span className="dash-mono">Instructor: Prof. Ajesh Joe</span>
                  </div>
                </div>
              )}

              {/* Prev / Next navigation */}
              <div className="flex items-center gap-3 border-t border-[#F2ECDF] pt-4">
                <button
                  onClick={goPrev}
                  disabled={!prevVideo}
                  className="flex-1 inline-flex items-center gap-2 rounded-xl border border-[#E3D8C5] bg-white px-4 py-2.5 text-xs font-semibold text-[#4A443E] transition-colors hover:bg-[#F6F2EA] disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  <span className="min-w-0 text-left">
                    <span className={`block ${MICRO} leading-none`}>Previous</span>
                    <span className="mt-0.5 block truncate">{prevVideo?.title ?? '—'}</span>
                  </span>
                </button>
                <button
                  onClick={goNext}
                  disabled={!nextVideo}
                  className="flex-1 inline-flex items-center justify-end gap-2 rounded-xl border border-[#E3D8C5] bg-white px-4 py-2.5 text-xs font-semibold text-[#4A443E] transition-colors hover:bg-[#F6F2EA] disabled:pointer-events-none disabled:opacity-40"
                >
                  <span className="min-w-0 text-right">
                    <span className={`block ${MICRO} leading-none`}>Next</span>
                    <span className="mt-0.5 block truncate">{nextVideo?.title ?? '—'}</span>
                  </span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Sidebar playlist ─────────────────────────────────────────── */}
          <aside
            className={`shrink-0 overflow-y-auto border-l border-[#EAE1D2] bg-white transition-all duration-300 ${
              sidebarOpen ? 'w-72 xl:w-80' : 'w-0 overflow-hidden border-0'
            }`}
          >
            <div className="sticky top-0 z-10 border-b border-[#EFE7D8] bg-white px-4 py-3">
              <p className={MICRO}>Playlist</p>
              <p className="mt-0.5 text-sm font-semibold text-[#22201F]">
                {examLabel} · {video.subject}
              </p>
              <p className="text-xs text-[#8A7E6F]">
                {currentIndex + 1} of {playlist.length}
              </p>
            </div>

            <div className="divide-y divide-[#F2ECDF] p-2">
              {playlist.map((item, idx) => {
                const itemId = extractYouTubeId(item.youtubeLink);
                const isActive = item.id === video.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowUpNext(false);
                      onSelectVideo(item);
                    }}
                    className={`group flex w-full items-start gap-3 rounded-xl px-2.5 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-[#F4E7E5]'
                        : 'hover:bg-[#FBF7F0]'
                    }`}
                  >
                    {/* Thumbnail / index */}
                    <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-[#F0E9DB]">
                      {itemId ? (
                        <PlaylistThumbnail videoId={itemId} alt={item.title} />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="dash-serif text-lg font-semibold text-[#A79A88]">
                            {idx + 1}
                          </span>
                        </div>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#4A0E1B]/70">
                          <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`line-clamp-2 text-xs font-semibold leading-snug ${
                          isActive ? 'text-[#4A0E1B]' : 'text-[#22201F] group-hover:text-[#4A0E1B]'
                        } transition-colors`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-1 text-[10px] text-[#8A7E6F]">{item.chapter}</p>
                      {item.duration && (
                        <p className="dash-mono mt-1 text-[10px] tabular-nums text-[#A79A88]">
                          {item.duration}
                        </p>
                      )}
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <span className="mt-0.5 shrink-0 h-1.5 w-1.5 rounded-full bg-[#4A0E1B]" />
                    )}
                  </button>
                );
              })}

              {playlist.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-[#8A7E6F]">
                  No other lectures in this course.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Small helper inside this file for playlist thumbnails
function PlaylistThumbnail({ videoId, alt }: { videoId: string; alt: string }) {
  const [src, setSrc] = useState(getYoutubeThumbnail(videoId, 'mqdefault'));
  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => {
        if (src.includes('mqdefault')) setSrc(getYoutubeThumbnail(videoId, 'default'));
      }}
    />
  );
}
