import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Community: React.FC = () => {
  const { isArabic } = useLanguage();

  return (
    <div className="public-section active" id="impact">
      <section className="impact-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{isArabic ? 'انطلق أبعد من قاعة المناظرة' : 'Grow Beyond the Debate Room'}</span>
            <h2 className="section-title serif-text">{isArabic ? 'أثرنا في الشباب والمجتمع' : 'Our Impact'}</h2>
            <p className="section-desc">
              {isArabic ? 'تطوير مستمر يمتد لما بعد قاعة المناظرة.' : 'Grow beyond the debate room.'}
            </p>
          </div>

          {/* Intro Box */}
          <div className="impact-intro-card">
            <p className="impact-lead-text">
              {isArabic
                ? 'الانضمام إلى مجتمعنا ليس مجرد حضور لنقاشات دورية، بل هو فرصة دائمة للتفكير، والبحث، والتقديم، والكتابة، والتواصل مع شباب من خلفيات متعددة.'
                : 'Being part of our community is not only about attending discussions. It is an opportunity to continuously think, research, present, write, and connect with young people from different backgrounds.'}
            </p>
            <h3 className="impact-pillars-heading serif-text">
              {isArabic ? 'من خلال المشاركة المنتظمة، يطور الأعضاء:' : 'Through regular participation, members can develop:'}
            </h3>
          </div>

          {/* 8 Impact Development Pillars Grid */}
          <div className="impact-pillars-grid">
            <div className="impact-card">
              <div className="impact-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </div>
              <h4 className="impact-card-title serif-text">{isArabic ? 'تواصل أكثر قوة وتأثيراً' : 'Become a Stronger Communicator'}</h4>
              <p className="impact-card-desc">
                {isArabic
                  ? 'بناء الثقة في طرح الأفكار، والتحدث بوضوح، والإجابة عن الأسئلة الصعبة، والدفاع عن الحجج أمام جماهير متعددة الثقافات.'
                  : 'Build confidence in presenting ideas, speaking clearly, responding to questions, defending arguments, and communicating with different audiences.'}
              </p>
            </div>

            <div className="impact-card">
              <div className="impact-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"></path>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"></path>
                </svg>
              </div>
              <h4 className="impact-card-title serif-text">{isArabic ? 'تفكير نقدي أكثر عمقاً' : 'Think More Critically'}</h4>
              <p className="impact-card-desc">
                {isArabic
                  ? 'تعلم تفكيك الافتراضات المسبقة، وفحص الزوايا المتباينة، وتحديد الثغرات في الحجج، والتمييز بين الحقائق والآراء.'
                  : 'Learn to question assumptions, examine different perspectives, identify weaknesses in arguments, distinguish facts from opinions, and approach complex issues with greater depth.'}
              </p>
            </div>

            <div className="impact-card">
              <div className="impact-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h4 className="impact-card-title serif-text">{isArabic ? 'تطوير أدوات البحث العلمي' : 'Develop Research Skills'}</h4>
              <p className="impact-card-desc">
                {isArabic
                  ? 'بحث القضايا العالمية لما وراء العناوين العريضة، واستقاء الأدلة من المصادر الموثوقة والمقارنة بين السياسات الدولية.'
                  : 'Explore global issues beyond headlines by researching reliable sources, examining evidence, comparing perspectives, and understanding the context behind major events and policies.'}
              </p>
            </div>

            <div className="impact-card">
              <div className="impact-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h4 className="impact-card-title serif-text">{isArabic ? 'فهم عميق لعالم متغير' : 'Understand a Changing World'}</h4>
              <p className="impact-card-desc">
                {isArabic
                  ? 'التفاعل مع الشؤون الدولية، الذكاء الاصطناعي، المناخ، والاقتصاد مباشرة من أصوات شباب يعيشون في دول مختلفة.'
                  : 'Engage with international affairs, technology, climate, education, economics, governance, culture, and emerging global issues.'}
              </p>
            </div>

            <div className="impact-card">
              <div className="impact-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h4 className="impact-card-title serif-text">{isArabic ? 'تحويل النقاشات إلى معرفة موثقة' : 'Turn Discussions into Knowledge'}</h4>
              <p className="impact-card-desc">
                {isArabic
                  ? 'جلساتنا لا تنتهي بمجرد انتهاء اللقاء؛ بل يحول الأعضاء النقاشات إلى أوراق أكاديمية وملخصات بحثية تثري الأرشيف.'
                  : 'Our sessions do not simply end when the meeting ends. Members transform discussions into academic writing, creating a growing intellectual archive.'}
              </p>
            </div>

            <div className="impact-card">
              <div className="impact-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <h4 className="impact-card-title serif-text">{isArabic ? 'خبرة عملية في القيادة والتقديم' : 'Real Presentation & Leadership Experience'}</h4>
              <p className="impact-card-desc">
                {isArabic
                  ? 'تدرج الأعضاء من المشاركة في الحوار إلى اقتراح الموضوعات، وتقديم الأوراق البحثية، وإدارة الجلسات البرلمانية.'
                  : 'Members can gradually move from participating in discussions to proposing topics, presenting research, moderating sessions, and leading conversations.'}
              </p>
            </div>

            <div className="impact-card">
              <div className="impact-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h4 className="impact-card-title serif-text">{isArabic ? 'تواصل حقيقي عبر الحدود' : 'Connect Across Borders'}</h4>
              <p className="impact-card-desc">
                {isArabic
                  ? 'بناء صداقات وروابط فكرية أصيلة مع طلاب وباحثين من جامعات ومدارس مختلفة حول العالم، لفتح آفاق التعاون المستقبلي.'
                  : 'Build meaningful relationships with students from different countries, universities, and schools — creating opportunities for future initiatives.'}
              </p>
            </div>

            <div className="impact-card">
              <div className="impact-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h4 className="impact-card-title serif-text">{isArabic ? 'بناء ملف فكري وأكاديمي' : 'Build an Intellectual Portfolio'}</h4>
              <p className="impact-card-desc">
                {isArabic
                  ? 'من خلال العروض والبحوث والكتابات، يبني العضو تدريجياً سجلاً موثقاً لاهتماماته الفكرية ونضجه الأكاديمي.'
                  : 'Through presentations, research, academic writing, and discussions, members can gradually build a record of their intellectual development.'}
              </p>
            </div>
          </div>

          {/* Growth Journey Box */}
          <div className="impact-journey-card">
            <h3 className="serif-text journey-heading-wrap">
              <span className="journey-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </span>
              <span>{isArabic ? 'تدرج من مشارك إلى صانع أثر' : 'Grow from Participant to Contributor'}</span>
            </h3>
            <p className="journey-subtitle">
              {isArabic ? 'صُممت الشبكة لتمنح كل عضو مساحة للتطور المستمر:' : 'The community is designed to give members room to grow:'}
            </p>
            <div className="journey-flow-wrapper">
              <div className="journey-step"><span className="journey-step-num">1</span> <span>{isArabic ? 'انضم' : 'Join'}</span></div>
              <div className="journey-arrow">&rarr;</div>
              <div className="journey-step"><span className="journey-step-num">2</span> <span>{isArabic ? 'شارك' : 'Participate'}</span></div>
              <div className="journey-arrow">&rarr;</div>
              <div className="journey-step"><span className="journey-step-num">3</span> <span>{isArabic ? 'ابحث' : 'Research'}</span></div>
              <div className="journey-arrow">&rarr;</div>
              <div className="journey-step"><span className="journey-step-num">4</span> <span>{isArabic ? 'قدّم' : 'Present'}</span></div>
              <div className="journey-arrow">&rarr;</div>
              <div className="journey-step"><span className="journey-step-num">5</span> <span>{isArabic ? 'قُد' : 'Lead'}</span></div>
              <div className="journey-arrow">&rarr;</div>
              <div className="journey-step"><span className="journey-step-num">6</span> <span>{isArabic ? 'اكتب' : 'Write'}</span></div>
              <div className="journey-arrow">&rarr;</div>
              <div className="journey-step journey-step-final"><span className="journey-step-num">7</span> <span>{isArabic ? 'أثْرِ' : 'Contribute'}</span></div>
            </div>
            <p className="journey-note">
              {isArabic
                ? 'مع الوقت، يصبح العضو ليس فقط مشاركاً في الجمهور، بل باحثاً ومتحدثاً ورئيس جلسة وكاتباً فاعلاً في شبكة شبابية دولية.'
                : 'Over time, a member can become not only an audience participant, but also a presenter, researcher, moderator, writer, organizer, and contributor to an international youth network.'}
            </p>
          </div>

          {/* Takeaways & Creed Grid */}
          <div className="impact-outcomes-grid">
            <div className="takeaways-card">
              <h3 className="serif-text">{isArabic ? 'ما نأمل أن تكتسبه وتخرج به' : 'What We Hope You Take Away'}</h3>
              <p className="takeaways-sub">
                {isArabic ? 'بانضمامك إلى مجتمعنا، نأمل أن تصبح:' : 'By being part of the community, we hope you become:'}
              </p>
              <ul className="takeaways-list">
                <li>
                  <span className="takeaway-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                  <span>{isArabic ? 'أكثر ثقة وجرأة في الحديث العام.' : 'More confident in speaking.'}</span>
                </li>
                <li>
                  <span className="takeaway-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                  <span>{isArabic ? 'أكثر منهجية ورصانة في التفكير.' : 'More rigorous in thinking.'}</span>
                </li>
                <li>
                  <span className="takeaway-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                  <span>{isArabic ? 'أكثر شغفاً وفضولاً لاستكشاف العالم.' : 'More curious about the world.'}</span>
                </li>
                <li>
                  <span className="takeaway-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                  <span>{isArabic ? 'أكثر تمكناً من مناهج البحث العلمي.' : 'More capable of researching.'}</span>
                </li>
                <li>
                  <span className="takeaway-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                  <span>{isArabic ? 'أكثر براعة في الكتابة الأكاديمية.' : 'More effective at writing.'}</span>
                </li>
                <li>
                  <span className="takeaway-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                  <span>{isArabic ? 'أكثر انفتاحاً وتقبلاً لوجهات النظر المختلفة.' : 'More comfortable with different perspectives.'}</span>
                </li>
                <li>
                  <span className="takeaway-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                  <span>{isArabic ? 'أكثر استعداداً لتحمل المسؤولية والقيادة.' : 'More prepared to lead.'}</span>
                </li>
                <li>
                  <span className="takeaway-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                  <span>{isArabic ? 'أكثر ارتباطاً بشبكة شبابية مؤثرة حول العالم.' : 'More connected to the world around you.'}</span>
                </li>
              </ul>
            </div>

            <div className="creed-card">
              <h3 className="serif-text">{isArabic ? 'من الحوار إلى بناء القدرات' : 'From conversation to capability.'}</h3>
              <div className="creed-items">
                <div className="creed-item">
                  <span className="creed-bullet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2z"></path></svg>
                  </span>
                  <span>{isArabic ? 'كل نقاش هو فرصة حقيقية للتعلم.' : 'Every discussion is an opportunity to learn.'}</span>
                </div>
                <div className="creed-item">
                  <span className="creed-bullet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2z"></path></svg>
                  </span>
                  <span>{isArabic ? 'كل سؤال هو فرصة للتفكير النقدي.' : 'Every question is an opportunity to think.'}</span>
                </div>
                <div className="creed-item">
                  <span className="creed-bullet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2z"></path></svg>
                  </span>
                  <span>{isArabic ? 'كل عرض تقديمي هو فرصة للتطوير.' : 'Every presentation is an opportunity to improve.'}</span>
                </div>
                <div className="creed-item">
                  <span className="creed-bullet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2z"></path></svg>
                  </span>
                  <span>{isArabic ? 'كل كتابة بحثية هي إضافة حقيقية للمعرفة.' : 'Every piece of writing is an opportunity to create knowledge.'}</span>
                </div>
              </div>

              <div className="creed-motto-box">
                <p className="creed-motto serif-text">
                  {isArabic ? 'حاور بعمق. فكّر بنقد. اكتب بوضوح. تواصل بعالمية.' : 'Discuss deeply. Think critically. Write clearly. Connect globally.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
