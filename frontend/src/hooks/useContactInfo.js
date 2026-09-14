import { useState, useEffect } from 'react';
import { getPageContent } from '../services/api';

const CACHE_KEY = 'sai_contact_content';
const DEFAULT_CONTACT_DATA = {
  branches: {},
  global: { email: '', phones: [], hours: '' },
};

export default function useContactInfo() {
  const [data, setData] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEFAULT_CONTACT_DATA;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getPageContent('contact')
      .then(res => {
        if (!cancelled && res.data) {
          setData(res.data);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
