import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import localFont from 'next/font/local';
import './globals.css';
import { LanguageProvider } from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage, languages } from '@/lib/translations';

// Fonts are self-hosted (app/fonts, subset woff2 from Google Fonts) so the build
// never depends on fonts.googleapis.com being reachable or parseable.
const heading = localFont({
  src: './fonts/cormorant-garamond-latin.woff2',
  weight: '500 700',
  variable: '--font-heading',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});
const body = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '100 900',
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
// Latin fonts have no Devanagari glyphs; this is the per-character fallback for Hindi.
const deva = localFont({
  src: './fonts/noto-sans-devanagari.woff2',
  weight: '400 700',
  variable: '--font-deva',
  display: 'swap',
  fallback: ['sans-serif'],
});

export const metadata: Metadata = {
  title: 'Support | The Divine Tarot',
  description:
    'Locked out after subscribing, double charged, or hit a bug? Open a support ticket with The Divine Tarot and we will reply within 24 hours.',
  metadataBase: new URL('https://support.thedivinetarotonline.com'),
  openGraph: { title: 'Support | The Divine Tarot', siteName: 'The Divine Tarot', type: 'website' },
};

export const viewport: Viewport = { themeColor: '#050505' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const saved = cookies().get(LANGUAGE_COOKIE)?.value;
  const language = isLanguage(saved) ? saved : DEFAULT_LANGUAGE;
  const htmlLang = languages.find((l) => l.code === language)?.htmlLang ?? 'en';

  return (
    <html lang={htmlLang} className={`${heading.variable} ${body.variable} ${deva.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
