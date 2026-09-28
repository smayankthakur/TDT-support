import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Privacy | The Divine Tarot' };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-grow px-4 py-16">
        <h1 className="font-serif text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="text-slate-400 leading-relaxed">
          Replace this placeholder with your privacy policy, or redirect this route to
          https://thedivinetarotonline.com/privacy.
        </p>
      </main>
      <Footer />
    </>
  );
}
