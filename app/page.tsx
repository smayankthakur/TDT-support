import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
        <section className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start gap-4 relative z-10">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl shrink-0">
              <AlertCircle className="w-7 h-7 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 font-serif">
                Login issues after subscribing?
              </h1>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-2xl">
                If you can&apos;t open the Premium Reading Bot after your purchase, send us a ticket
                below with your registered email and payment proof. We&apos;ll restore your access
                within 24 hours.
              </p>
            </div>
          </div>
        </section>

        <SupportForm />
      </main>

      <Footer />
    </div>
  );
}
