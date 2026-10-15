import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  isArabic: boolean;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DICTIONARY: Record<string, Record<Language, string>> = {
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.about': { en: 'About GYDE', ar: 'عن المبادرة' },
  'nav.mission': { en: 'Mission', ar: 'رسالتنا' },
  'nav.cycle': { en: 'Dialogue Cycle', ar: 'دورة الحوار' },
  'nav.topics': { en: 'Topic Bank', ar: 'بنك المواضيع' },
  'nav.publications': { en: 'Research Papers', ar: 'الأوراق البحثية' },
  'nav.community': { en: 'Community', ar: 'المجتمع' },
  'nav.portal': { en: 'Member Portal', ar: 'بوابة الأعضاء' },
  'nav.apply': { en: 'Apply Now', ar: 'تقديم طلب انضمام' },
  'nav.login': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'nav.logout': { en: 'Sign Out', ar: 'تسجيل الخروج' },

  'hero.tagline': { en: 'Young minds. Different countries. One conversation.', ar: 'عقول شابة. دول مختلفة. حوار واحد.' },
  'hero.subtitle': {
    en: 'An international academic debate and dialogue platform connecting youth scholars across 14+ nations for bi-weekly parliamentary debates and peer-reviewed research.',
    ar: 'منصة دولية للمناظرات والحوار الفكري تجمع نخبة من الشباب والباحثين من أكثر من 14 دولة في مناظرات برلمانية منتظمة وأبحاث محكمة.'
  },
  'hero.ctaApply': { en: 'Apply for Membership', ar: 'تقديم طلب الانضمام' },
  'hero.ctaExplore': { en: 'Explore Topic Bank', ar: 'استكشاف بنك المواضيع' },

  'cycle.title': { en: 'The 5-Stage Dialogue Cycle', ar: 'دورة الحوار الخماسية' },
  'topics.title': { en: 'Eight Curated Debate Disciplines', ar: 'ثمانية محاور نقاشية تخصصية' },
  'publications.title': { en: 'Academic Youth Research & Papers', ar: 'الأبحاث والأوراق الأكاديمية المحكمة' },
  'qatar.badge': { en: 'Founded by Debaters of Qatar ISDC7 Championship', ar: 'تأسست بمبادرة مناظري بطولة قطر الدولية لمناظرات المدارس' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('gyde_lang') as Language) || 'en';
  });

  const isArabic = language === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('gyde_lang', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', dir);
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string, fallback?: string): string => {
    if (DICTIONARY[key] && DICTIONARY[key][language]) {
      return DICTIONARY[key][language];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, isArabic, dir, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
