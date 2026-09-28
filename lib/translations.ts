export type Language = 'en' | 'hi';

export const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.reading': 'Reading',
    'nav.course': 'Course',
    'nav.kundli': 'Kundli Milan',
    'nav.askQuestion': 'Ask your question here',
    'footer.description': 'Guiding your path with clarity, intuition, and spiritual insight.',
    'footer.quickLinks.title': 'Quick Links',
    'footer.quickLinks.about': 'About',
    'footer.privacy': 'Privacy',
  },
  hi: {
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.reading': 'रीडिंग',
    'nav.course': 'कोर्स',
    'nav.kundli': 'कुंडली मिलान',
    'nav.askQuestion': 'अपना सवाल यहाँ पूछें',
    'footer.description': 'स्पष्टता, अंतर्ज्ञान और आध्यात्मिक समझ के साथ आपका मार्गदर्शन।',
    'footer.quickLinks.title': 'क्विक लिंक्स',
    'footer.quickLinks.about': 'हमारे बारे में',
    'footer.privacy': 'गोपनीयता',
  },
};
