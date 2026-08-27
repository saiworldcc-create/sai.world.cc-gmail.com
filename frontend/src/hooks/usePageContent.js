import { useState, useEffect } from 'react';
import { getPageContent } from '../services/api';

const CACHE_PREFIX = 'sai_cms_cache_';

/**
 * Fetches page content from the backend CMS with instantaneous local caching.
 * Prevents flashing fallback/previous content on page load or when switching files.
 */
export default function usePageContent(pageName, defaultContent = {}) {
  const cacheKey = pageName ? `${CACHE_PREFIX}${pageName}` : null;

  // Initialize synchronously from cache if available so there is 0ms glitch
  const [content, setContent] = useState(() => {
    if (!cacheKey) return defaultContent;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch {}
    return defaultContent;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pageName) { setLoading(false); return; }

    let cancelled = false;

    getPageContent(pageName)
      .then((res) => {
        if (!cancelled && res.data) {
          setContent(res.data);
          try {
            sessionStorage.setItem(`${CACHE_PREFIX}${pageName}`, JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [pageName]);

  const updateContent = (newContent) => {
    setContent(newContent);
    if (cacheKey && newContent) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(newContent));
      } catch {}
    }
  };

  return { content, loading, error, setContent: updateContent };
}

