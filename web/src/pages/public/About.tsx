import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const About: React.FC = () => {
  const { isArabic } = useLanguage();

  return (
    <div className="public-section active" id="about">
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{isArabic ? 'عن الحركة والمبادرة' : 'About The Movement'}</span>
            <h2 className="section-title serif-text">{isArabic ? 'عن المشروع والشبكة' : 'About the Project'}</h2>
            <p className="section-desc">
              {isArabic
                ? 'من لقاء في بطولة دولية للمناظرات إلى شبكة فكرية شبابية عالمية دائمة ومستقلة.'
                : 'From an international debate championship meeting to a lasting global youth intellectual network.'}
            </p>
          </div>

          {/* Our Story Hero Box */}
          <div className="about-card-hero">
            <div className="origin-badge">
              <span className="svg-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </span>
              <span>{isArabic ? 'قصة التأسيس' : 'Founding Story'}</span>
            </div>
            <h3 className="serif-text">{isArabic ? 'قصة النشأة' : 'Our Origin Story'}</h3>
            <p>
              {isArabic
                ? 'التقى شباب ومناظرون من دول مختلفة في بطولة دولية للمناظرات، واكتشفوا شغفاً مشتركاً بالحوار العميق والتبادل الفكري الهادف.'
                : 'Young debaters from different countries met at an international debate championship and discovered a shared passion for deep, substantive exchange.'}
            </p>
            <p>
              {isArabic
                ? 'على الرغم من انتهاء البطولة، أدرك المشاركون القيمة البالغة للاستمرار في النقاش معاً، وبحث الشؤون الدولية، والاستفادة من وجهات النظر الثقافية المتعددة، وتوفير منصات للمفكرين الشباب الآخرين.'
                : 'Although the tournament concluded, delegates realized the urgent value of continuing to debate together, critically examine global affairs, learn from divergent cultural perspectives, and create platforms for other young thinkers.'}
            </p>
            <p>
              {isArabic
                ? 'تأسس الحوار الشبابي الدولي (GYDE) لتحويل تلك الشرارة الدولية المؤقتة إلى شبكة أكاديمية مستمرة يقودها الشباب.'
                : 'Global Youth Dialogue was founded to turn that temporary international spark into a continuing, youth-led academic network.'}
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="mission-vision-grid">
            <div className="mv-card">
              <div className="mv-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <h4 className="serif-text">{isArabic ? 'رسالتنا' : 'Our Mission'}</h4>
              <p>
                {isArabic
                  ? 'خلق مساحة دولية يلتقي فيها الشباب لمناقشة القضايا العالمية، وتحدي الأفكار، وتطوير مهارات البحث والتواصل، والتعلم من أقرانهم عبر الحدود.'
                  : 'To create an international space where young people can discuss global issues, challenge ideas, develop research and communication skills, and learn from peers across borders.'}
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
              </div>
              <h4 className="serif-text">{isArabic ? 'رؤيتنا' : 'Our Vision'}</h4>
              <p>
                {isArabic
                  ? 'جيل متصل من الشباب القادرين على التفاعل الواعي مع التحديات العالمية والمشاركة الفعالة في الحوار الدولي الهادف.'
                  : 'A connected generation of young people capable of engaging thoughtfully with global challenges and participating in meaningful international dialogue.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Triad Section */}
      <section className="brand-triad-section">
        <div className="container">
          <div className="triad-grid">
            <div className="triad-item">
              <div className="triad-word serif-text">{isArabic ? 'تواصل' : 'Connect'}</div>
              <p className="triad-desc">
                {isArabic
                  ? 'شباب من مختلف الدول يلتقون ويتجاوزون الحواجز الجغرافية والثقافية.'
                  : 'Young people from different countries meeting across geographical and cultural divides.'}
              </p>
            </div>
            <div className="triad-item">
              <div className="triad-word serif-text">{isArabic ? 'تحدَّ' : 'Challenge'}</div>
              <p className="triad-desc">
                {isArabic
                  ? 'مساءلة الأفكار، اختبار الفرضيات بالأدلة، واستكشاف وجهات النظر الدولية المتباينة.'
                  : 'Question ideas, test assertions with evidence, and examine divergent international perspectives.'}
              </p>
            </div>
            <div className="triad-item">
              <div className="triad-word serif-text">{isArabic ? 'ابتكر' : 'Create'}</div>
              <p className="triad-desc">
                {isArabic
                  ? 'تحويل المناظرات إلى معرفة أكاديمية، ورؤى سياساتية، وتعاون شبابي مستدام.'
                  : 'Turn debates into academic knowledge, policy insights, and long-term youth collaboration.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
