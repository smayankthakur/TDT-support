'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { translations, type Language } from '@/lib/translations';

const STORAGE_KEY = 'tdt-language';
const listeners = new Set<() => void>();
let current: Language = 'en';

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function setCurrent(lang: Language) {
  current = lang;
  listeners.forEach((l) => l());
}

export function useLanguage() {
  const language = useSyncExternalStore(subscribe, () => current, () => 'en' as Language);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && saved in translations) setCurrent(saved);
    } catch {}
    setIsHydrated(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setCurrent(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string) => translations[language][key] ?? translations.en[key] ?? key,
    [language]
  );

  return { language, setLanguage, t, isHydrated };
}
