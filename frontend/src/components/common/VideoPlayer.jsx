import { useState, useEffect } from 'react';

/**
 * Parses any YouTube, Vimeo, or direct video file URL
 * and returns the appropriate player type and clean embed URL.
 */
export function parseVideoUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const url = rawUrl.trim();
  if (!url) return null;

  // 1. YouTube (Supports watch, youtu.be, embed, shorts)
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: 'youtube',
      videoId: ytMatch[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
      previewUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
    };
  }

  // 2. Vimeo (Supports vimeo.com/123456789)
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      previewUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0`,
    };
  }

  // 3. Direct video file (.mp4, .webm, .ogg, .mov)
  if (/\.(mp4|webm|ogg|mov)($|\?)/i.test(url)) {
    return {
      type: 'direct',
      url,
    };
  }

  // 4. Fallback: standard web URL or iframe embed
  return {
    type: 'generic',
    embedUrl: url,
  };
}

/**
 * Inline Video Player Component
 */
export default function VideoPlayer({
  videoUrl,
  posterImage,
  title = 'Sai International Couriers Video',
  autoplay = false,
}) {
  const parsed = parseVideoUrl(videoUrl);

  if (!parsed) {
    return null;
  }

  if (parsed.type === 'direct') {
    return (
      <video
        controls
        playsInline
        poster={posterImage || undefined}
        preload="metadata"
        autoPlay={autoplay}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src={parsed.url} />
        Your browser does not support the video tag.
      </video>
    );
  }

  const src = autoplay ? parsed.embedUrl : (parsed.previewUrl || parsed.embedUrl);

  return (
    <iframe
      src={src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}

/**
 * Fullscreen Lightbox Video Modal
 */
export function VideoModal({ isOpen, onClose, videoUrl, title }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !videoUrl) return null;

  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="video-modal-close"
          onClick={onClose}
          aria-label="Close Video"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <VideoPlayer videoUrl={videoUrl} title={title} autoplay={true} />
      </div>
    </div>
  );
}
