'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  languages,
  translations,
  type Language,
} from '@/lib/translations';

type Ctx = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
  isHydrated: boolean;
};

const LanguageContext = createContext<Ctx | null>(null);

/**
 * The language is read from a cookie on the server (see app/layout.tsx), so the first
 * paint is already in the right language: no flash of English, no hydration mismatch.
 * The cookie is shared across *.thedivinetarotonline.com so the choice follows the user
 * between the main site and this support site.
 */
export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language;
  children: React.ReactNode;
}) {
  const [language, setLang] = useState<Language>(initialLanguage);

  const setLanguage = useCallback((next: Language) => {
    setLang(next);
    const host = window.location.hostname;
    const domain = host.endsWith('thedivinetarotonline.com') ? '; domain=.thedivinetarotonline.com' : '';
    document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax${domain}`;
    document.documentElement.lang = languages.find((l) => l.code === next)?.htmlLang ?? 'en';
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      language,
      setLanguage,
      // Fall back to English, then to the key itself, so a missing string never renders blank.
      t: (key) => translations[language][key] ?? translations.en[key] ?? key,
      isHydrated: true,
    }),
    [language, setLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): Ctx {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  // Safe default if a component is rendered outside the provider.
  return {
    language: DEFAULT_LANGUAGE,
    setLanguage: () => {},
    t: (key) => translations.en[key] ?? key,
    isHydrated: true,
  };
}
