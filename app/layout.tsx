import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const heading = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'Support | The Divine Tarot',
  description:
    'Locked out after subscribing, double charged, or hit a bug? Open a support ticket with The Divine Tarot and we will reply within 24 hours.',
  metadataBase: new URL('https://support.thedivinetarotonline.com'),
  openGraph: { title: 'Support | The Divine Tarot', siteName: 'The Divine Tarot', type: 'website' },
};

export const viewport: Viewport = { themeColor: '#050505' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
