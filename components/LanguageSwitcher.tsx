'use client';

import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { languages } from '@/lib/translations';

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        'items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs',
        className ?? 'inline-flex'
      )}
      role="group"
      aria-label="Language"
    >
      <Globe className="ml-2 h-3.5 w-3.5 text-white/50" aria-hidden="true" />
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLanguage(l.code)}
          aria-pressed={language === l.code}
          className={cn(
            'rounded-full px-3 py-1 font-medium transition-colors',
            language === l.code ? 'bg-gold text-black' : 'text-white/70 hover:text-white'
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
