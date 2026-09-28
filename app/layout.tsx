import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Cormorant_Garamond, Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/hooks/useLanguage';
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, isLanguage, languages } from '@/lib/translations';

const heading = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
// Latin fonts have no Devanagari glyphs; this is the per-character fallback for Hindi.
const deva = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-deva',
  display: 'swap',
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
