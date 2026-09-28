'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, Lock, Heart, Sparkles } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48" />
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError(t('footer.errEmail'));
      return;
    }

    const trimmedPhone = phone.replace(/[^\d+]/g, '');
    if (trimmedPhone && trimmedPhone.replace(/\D/g, '').length < 10) {
      setError(t('footer.errPhone'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone: trimmedPhone || undefined, source: 'footer' }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail('');
        setPhone('');
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.message || t('footer.errGeneric'));
      }
    } catch (err) {
      setError(t('footer.errNetwork'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/thedivineetarot', icon: InstagramIcon },
    { name: 'Facebook', href: 'https://facebook.com/profile.php?id=61578567343068', icon: FacebookIcon },
    { name: 'YouTube', href: 'https://youtube.com/@TheDivineTarot', icon: YoutubeIcon },
    { name: 'YouTube (2nd Channel)', href: 'https://youtube.com/@thedivineetarot', icon: YoutubeIcon },
  ];

  const quickLinks = [
    { nameKey: 'footer.quickLinks.about', name: 'About', href: 'https://thedivinetarotonline.com/about' },
    { nameKey: 'footer.quickLinks.support', name: 'Support', href: 'https://support.thedivinetarotonline.com/' },
    // { nameKey: 'footer.quickLinks.premium', name: 'Premium', href: 'https://reading.thedivinetarotonline.com/?upgrade=1' },
  ];

  const trustItems = [
    { icon: Lock, text: t('footer.trust.secure') },
    { icon: Heart, text: t('footer.trust.trusted') },
    { icon: Sparkles, text: t('footer.trust.authentic') },
  ];

  return (
    <footer className="w-full bg-[#0B0B0F] border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6 py-14">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 border border-amber-500/30 flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="The Divine Tarot Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#EAEAF0]">The Divine Tarot</h3>
              <p className="text-amber-500/70 text-xs uppercase tracking-wider">{t('footer.tagline')}</p>
            </div>
          </div>
          <p className="text-[#A1A1AA] text-sm leading-relaxed">
            {t('footer.description')}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-serif text-sm uppercase tracking-wider text-[#A1A1AA] mb-2">
            {t('footer.quickLinks.title')}
          </h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-[#A1A1AA] hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group text-sm"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-500/20 group-hover:bg-amber-500 transition-colors flex-shrink-0" />
                  {t(link.nameKey)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-serif text-sm uppercase tracking-wider text-[#A1A1AA] mb-2">{t('footer.connect')}</h4>
          <div className="flex gap-4 flex-wrap">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.name}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition"
              >
                <item.icon className="w-5 h-5 text-gray-300" />
              </a>
            ))}
          </div>
          <Link href="/privacy" className="mt-3 text-xs text-[#A1A1AA]/70 hover:text-amber-500 transition-colors w-fit">
            {t('footer.privacyPolicy')}
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-serif text-sm uppercase tracking-wider text-[#A1A1AA]">{t('footer.newsletter.title')}</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder={t('footer.newsletter.email')}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#EAEAF0] placeholder-[#A1A1AA] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm"
              disabled={isSubmitting || isSuccess}
              aria-label={t('footer.newsletter.emailLabel')}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              placeholder={t('footer.newsletter.phone')}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#EAEAF0] placeholder-[#A1A1AA] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm"
              disabled={isSubmitting || isSuccess}
              aria-label={t('footer.newsletter.phoneLabel')}
            />
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                isSuccess
                  ? 'bg-green-600 text-white cursor-default'
                  : isSubmitting
                  ? 'bg-amber-500/60 text-black cursor-wait'
                  : 'bg-amber-500 text-black hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20'
              }`}
            >
              {isSuccess ? t('footer.subscribed') : isSubmitting ? t('footer.subscribing') : t('footer.subscribe')}
            </button>
          </form>
          {error && <p className="text-red-400 text-xs" role="alert">{error}</p>}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-white/5">
        <div className="flex items-center justify-center gap-6 text-[#5A5A5A] text-xs flex-wrap">
          {trustItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-amber-500/40" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 mt-4 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-400 px-6">
        <div>
          {t('footer.designedBy')}{' '}
          <a
            href="https://sitelytc.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500/70 hover:text-amber-400 transition-colors duration-200"
          >
            Sitelytc
          </a>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <Link href="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
            {t('footer.privacy')}
          </Link>
          <span className="w-px h-3 bg-white/10" />
          <span>&copy; {new Date().getFullYear()} The Divine Tarot. {t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
