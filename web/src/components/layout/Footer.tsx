import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { isArabic } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ marginBottom: '1.15rem' }}>
              <img src="/assets/images/gyde_full_logo.png" alt="GYDE Logo" className="brand-logo-img logo-light" style={{ height: '42px', width: 'auto' }} />
              <img src="/assets/images/gyde_full_logo_dark.png" alt="GYDE Logo" className="brand-logo-img logo-dark" style={{ height: '42px', width: 'auto' }} />
            </div>
            <p>
              {isArabic
                ? 'مجتمع دولي شبابي مستقل يربط نخبة المناظرين الشباب والباحثين لمناقشة القضايا العالمية وتطوير الأفكار من خلال جلسات حوار برلمانية أسبوعية وأوراق بحثية أكاديمية.'
                : 'An independent youth-led international community connecting young debaters to explore global issues and develop ideas through structured weekly dialogue and academic research.'}
            </p>
          </div>
          <div className="footer-col">
            <h5>{isArabic ? 'التنقل' : 'Navigation'}</h5>
            <ul className="footer-links">
              <li><Link to="/about">{isArabic ? 'قصة التأسيس' : 'About Origin'}</Link></li>
              <li><Link to="/dialogue-cycle">{isArabic ? 'كيف يعمل البرنامج' : 'How It Works'}</Link></li>
              <li><Link to="/topics">{isArabic ? 'محاور النقاش' : 'Topic Categories'}</Link></li>
              <li><Link to="/sessions">{isArabic ? 'أرشيف الجلسات' : 'Sessions Overview'}</Link></li>
              <li><Link to="/community">{isArabic ? 'أثرنا والمجتمع' : 'Our Impact'}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>{isArabic ? 'البوابات والوصول' : 'Portals & Access'}</h5>
            <ul className="footer-links">
              <li><Link to="/">{isArabic ? 'الصفحة الرئيسية' : 'Home'}</Link></li>
              <li><Link to="/login">{isArabic ? 'بوابة الدخول الموحدة' : 'Sign In Portal'}</Link></li>
              <li><Link to="/apply">{isArabic ? 'طلب العضوية' : 'Apply for Membership'}</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2026 {isArabic ? 'الحوار الشبابي الدولي (GYDE)' : 'Global Youth Dialogue & Exchange (GYDE)'}. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
