import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBanner from '@/components/SupportBanner';
import SupportForm from '@/components/SupportForm';

export default function SupportPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink">
      {/* Background glows, matching the main site */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-coral/5 blur-[120px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-grow max-w-4xl mx-auto w-full px-4 py-10 md:py-16 flex flex-col gap-10">
        <SupportBanner />

        <SupportForm />
      </main>

      <Footer />
    </div>
  );
}
