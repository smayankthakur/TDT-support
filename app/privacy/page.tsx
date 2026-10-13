import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | The Divine Tarot app',
  description: 'How The Divine Tarot app collects and uses information.',
};

// The Divine Tarot app's privacy policy: same text as the app (tdt-app-2: src/data/legal.ts). Keep the two in step.
const UPDATED = "13 Oct 2026";
const SECTIONS: { h: string; p: string[] }[] = [
  {
    "h": "",
    "p": [
      "This policy explains how The Divine Tarot (\"we\", \"us\") collects and uses information in The Divine Tarot app for Android, iPhone and web (the \"App\"). By using the App you agree to this policy."
    ]
  },
  {
    "h": "1. Information we collect",
    "p": [
      "Account: if you create an account or log in, your email address, your name and your password. The password is stored only in scrambled (\"hashed\") form — nobody can read it. The account is the same as Ginni Ki Baatein on our website (reading.thedivinetarotonline.com), so your Ginni Premium is shared between the App and that website.",
      "Profile details you choose to enter (all optional): gender, date, time and place of birth, marital status, occupation and a profile photo. They are used to personalise your readings.",
      "Saved readings: the question you typed, the topic, the cards drawn and the date. If you are logged in they are saved to your account so they appear on your other phones.",
      "Purchases: which product you bought, the amount, the date, the Razorpay order and payment IDs, and until when it is active. We never see or store your card, UPI or bank details — Razorpay handles those.",
      "Personal Reading bookings: after you pay, the form asks for your name, WhatsApp number, email, place, date and time of birth and a photo, and the same for up to two other people you ask about, plus your concern. These go to our reader so she can prepare your reading, and your slot and Google Meet link are emailed to you.",
      "Support requests: your name, email, the problem you describe and any screenshots you attach.",
      "Usage data (optional, ON by default): each time the App opens we may record the date and time, a random session code, platform, operating-system version, device model, app version, App language and, if logged in, your user ID. Turn it off any time in Profile → Privacy. Your questions, readings and profile are never sent with it.",
      "Approximate location (optional, OFF by default): only if you turn on Profile → Privacy → Share approximate city and allow location permission, we record your city, state and country — never your exact position.",
      "Stored only on your phone: Kundli Milan names and birth details, your daily card, streak and reminder settings. Reminders are scheduled on your phone; we do not run a push-notification server."
    ]
  },
  {
    "h": "2. How we use it",
    "p": [
      "To log you in and keep your profile, readings and purchases across phones; to personalise readings and Kundli features; to process payments, unlock what you bought and handle support; to arrange and hold your Personal Reading; to understand, in total, how the App is used and improve it (only with usage data on); and to meet legal, tax and accounting duties.",
      "We do not sell your data, show third-party ads, or track you across other companies’ apps or websites."
    ]
  },
  {
    "h": "3. Who processes it",
    "p": [
      "Supabase (database, login and server functions): account, profile, saved readings, purchases.",
      "Razorpay: payments.",
      "Google (Firebase, Calendar, Sheets and Drive): Personal Reading bookings, Google Meet links, support tickets and optional usage records.",
      "Our email providers (including Resend): booking confirmations, support replies and password-reset emails.",
      "These providers process data for us under their own terms and security measures, and their servers may be outside India."
    ]
  },
  {
    "h": "4. How long we keep it",
    "p": [
      "Account, profile and saved readings: until you delete your account (or a reading). Purchase and booking payment records: as long as Indian tax and accounting law requires, even after account deletion. Booking details: as long as needed to hold and follow up your reading. Usage records: up to 24 months, then deleted or made fully anonymous."
    ]
  },
  {
    "h": "5. Your choices and rights",
    "p": [
      "Delete your account in the App: Profile → Delete account. This permanently deletes your login, profile, saved readings and purchases from our servers — and, because it is the same account, your Ginni Ki Baatein login on the website. A record of each payment is kept, without your account, as explained above.",
      "Turn usage data or location sharing on or off in Profile → Privacy, and edit your profile any time.",
      "You can ask us to access, correct or erase your personal data, or raise a grievance, by writing to thedivinetarot111@gmail.com. We reply within 30 days.",
      "If you use the App without logging in, your data stays on your phone; uninstalling the App removes it."
    ]
  },
  {
    "h": "6. Children",
    "p": [
      "The App is meant only for people aged 18 and above, because it offers paid astrology and tarot services. We do not knowingly collect data from anyone under 18. If you believe a minor has given us data, contact us and we will delete it."
    ]
  },
  {
    "h": "7. Security",
    "p": [
      "Data is sent over encrypted connections (HTTPS). Security rules let each user read only their own profile and readings. No method is 100% secure, but we take reasonable steps to protect your data."
    ]
  },
  {
    "h": "8. Readings are for guidance",
    "p": [
      "Tarot, Kundli and astrology content is for guidance and entertainment. It is not medical, legal, financial or professional advice."
    ]
  },
  {
    "h": "9. Changes",
    "p": [
      "We may update this policy. We will change the \"Last updated\" date and, for important changes, tell you in the App."
    ]
  },
  {
    "h": "10. Contact",
    "p": [
      "The Divine Tarot · thedivinetarot111@gmail.com · WhatsApp +91 88281 16545"
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink">
      <Header />
      <main className="relative z-10 mx-auto w-full max-w-3xl flex-grow px-4 py-10 md:py-16 space-y-6">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Privacy Policy: The Divine Tarot app</h1>
          <p className="text-sm text-slate-500">Last updated: {UPDATED}</p>
        </div>
        {SECTIONS.map((s, i) => (
          <section key={i} className="space-y-2">
            {s.h ? <h2 className="text-lg font-semibold text-slate-100">{s.h}</h2> : null}
            {s.p.map((p, j) => (
              <p key={j} className="text-slate-400 leading-relaxed">{p}</p>
            ))}
          </section>
        ))}
        <p className="text-sm text-slate-500">
          To delete your account, see{' '}
          <a className="underline text-slate-300" href="/delete-account">support.thedivinetarotonline.com/delete-account</a>.
        </p>
      </main>
      <Footer />
    </div>
  );
}
