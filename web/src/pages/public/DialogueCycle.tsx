import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const DialogueCycle: React.FC = () => {
  const { isArabic } = useLanguage();

  return (
    <div className="public-section active" id="process">
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{isArabic ? 'دورة الحوار البرلماني' : 'The Dialogue Cycle'}</span>
            <h2 className="section-title serif-text">{isArabic ? 'كيف يعمل البرنامج' : 'How the Programme Works'}</h2>
            <p className="section-desc">
              {isArabic
                ? 'دورة بصرية من 6 مراحل تحول الحوار الشفهي والمناظرة إلى بحث رصين، وأوراق أكاديمية، ومعرفة موثقة.'
                : 'A visual 6-stage cycle converting spoken dialogue and debate into rigorous research, academic papers, and documented knowledge.'}
            </p>
          </div>

          <div className="process-grid process-grid-6">
            {/* Step 1 */}
            <div className="process-card">
              <div className="process-step-num">01</div>
              <h4>{isArabic ? '01 — الاختيار (SELECT)' : '01 — SELECT'}</h4>
              <p>
                {isArabic
                  ? 'يقترح الأعضاء الموضوع ويتم تدقيقه واختياره وفق المحاور العالمية الرئيسية.'
                  : 'A topic is proposed by members and curated across key global themes.'}
              </p>
            </div>
            {/* Step 2 */}
            <div className="process-card">
              <div className="process-step-num">02</div>
              <h4>{isArabic ? '02 — الإعداد (PREPARE)' : '02 — PREPARE'}</h4>
              <p>
                {isArabic
                  ? 'يجري المتحدثون بحثاً معمقاً، ويجمعون المصادر الموثوقة، ويعدون عروضاً تقديمية متوازنة.'
                  : 'Speakers conduct in-depth research, gather credible sources, and develop balanced presentation decks.'}
              </p>
            </div>
            {/* Step 3 */}
            <div className="process-card">
              <div className="process-step-num">03</div>
              <h4>{isArabic ? '03 — المناقشة (DISCUSS)' : '03 — DISCUSS'}</h4>
              <p>
                {isArabic
                  ? 'يجتمع المجتمع افتراضياً للحوار المنظم، وعرض المتحدث، ومناظرة برلمانية مفتوحة لجميع الأعضاء.'
                  : 'The community convenes online for structured dialogue, speaker presentation, and open parliamentary floor debate.'}
              </p>
            </div>
            {/* Step 4 */}
            <div className="process-card">
              <div className="process-step-num">04</div>
              <h4>{isArabic ? '04 — التأمل (REFLECT)' : '04 — REFLECT'}</h4>
              <p>
                {isArabic
                  ? 'يقدم المشاركون تأملات نقدية منظمة، تقيم الحجج، وقوة الأدلة، والزوايا المتعددة للقضية.'
                  : 'Participants submit structured peer reflections, evaluating arguments, evidence strength, and multiple perspectives.'}
              </p>
            </div>
            {/* Step 5 */}
            <div className="process-card">
              <div className="process-step-num">05</div>
              <h4>{isArabic ? '05 — النشر (PUBLISH)' : '05 — PUBLISH'}</h4>
              <p>
                {isArabic
                  ? 'عقب الجلسة، يصيغ المتحدث بحثه المعمق وحججه وعرضه في ورقة أكاديمية محكمة تُنشر في مكتبة المنصة.'
                  : 'Following the session, the presenter compiles their in-depth research, arguments, and visual presentation into a formal academic paper published in the community library.'}
              </p>
            </div>
            {/* Step 6 */}
            <div className="process-card">
              <div className="process-step-num">06</div>
              <h4>{isArabic ? '06 — التوثيق (DOCUMENT)' : '06 — DOCUMENT'}</h4>
              <p>
                {isArabic
                  ? 'يتم توثيق وأرشفة ملخص تحليلي شامل للجلسة، يوثق أهم الحجج والتفنيدات والنتائج لجميع الأعضاء.'
                  : 'A comprehensive analytical summary of the session is documented and archived, capturing key arguments, counterpoints, and takeaways for all members.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
