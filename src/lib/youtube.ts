/**
 * youtube.ts — YouTube URL utility helpers
 *
 * Extracts a YouTube video ID from all common URL formats and
 * auto-generates thumbnail URLs so professors only need to paste one URL.
 */

/**
 * Extracts a YouTube video ID from any supported URL format:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://youtube.com/embed/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 *   - Plain VIDEO_ID (11-char alphanumeric+dash+underscore)
 *
 * Returns `null` if no valid ID can be found.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  // Already a raw video ID (11 alphanumeric chars, dashes, underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    // Standard watch URL: ?v=VIDEO_ID
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    // Shortened: youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // Embed URL: /embed/VIDEO_ID
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    // Shorts: /shorts/VIDEO_ID
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    // Live: /live/VIDEO_ID
    /\/live\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }

  return null;
}

/** Quality tiers for YouTube thumbnails (best → worst) */
export type ThumbnailQuality = 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' | 'default';

/**
 * Returns a YouTube thumbnail URL for the given video ID.
 * Defaults to maxresdefault (1280×720). Falls back gracefully via onError.
 */
export function getYoutubeThumbnail(
  videoId: string,
  quality: ThumbnailQuality = 'maxresdefault',
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Returns the YouTube embed URL for use inside an <iframe>.
 * Enables autoplay, disables related-video suggestions (from other channels),
 * and enables the JS API for onEnd detection.
 */
export function getYoutubeEmbedUrl(
  videoId: string,
  options: {
    autoplay?: boolean;
    /** 0 = show related from same channel; 1 = any related (default) */
    rel?: 0 | 1;
    start?: number; // seconds
    enableJsApi?: boolean;
  } = {},
): string {
  const params = new URLSearchParams({
    rel: String(options.rel ?? 0),
    modestbranding: '1',
    ...(options.autoplay ? { autoplay: '1' } : {}),
    ...(options.start ? { start: String(options.start) } : {}),
    ...(options.enableJsApi !== false ? { enablejsapi: '1', origin: window.location.origin } : {}),
    vq: 'hd1080',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Validates that a given string contains a parseable YouTube video ID.
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}
