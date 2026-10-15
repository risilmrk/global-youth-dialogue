import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const Home: React.FC = () => {
  const { isArabic } = useLanguage();

  // Live countdown timer matching original GYDE calculation
  const [timeLeft, setTimeLeft] = useState({
    days: '03',
    hours: '14',
    minutes: '28',
    seconds: '42'
  });

  useEffect(() => {
    const now = new Date().getTime();
    let target = localStorage.getItem('gyde_next_debate_time');
    if (!target || parseInt(target) <= now) {
      target = String(now + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 28 * 60 * 1000);
      localStorage.setItem('gyde_next_debate_time', target);
    }

    const timer = setInterval(() => {
      const current = new Date().getTime();
      let diff = parseInt(target!) - current;
      if (diff <= 0) {
        target = String(current + 7 * 24 * 60 * 60 * 1000);
        localStorage.setItem('gyde_next_debate_time', target);
        diff = parseInt(target) - current;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="public-section active" id="home">
      {/* Modern Asymmetric Split Hero Section */}
      <section className="hero-section">
        {/* Ambient Background Glow */}
        <div className="hero-ambient-glow"></div>

        <div className="container">
          <div className="hero-grid">
            {/* Left Column: Editorial Content & CTAs */}
            <div className="hero-content">
              <div className="hero-eyebrow mobile-pill-tag">
                <span className="pill-dash"></span>
                <span>{isArabic ? '14+ دولة • مجتمع فكري واحد' : '14+ Countries • One Community'}</span>
              </div>

              <h1 className="hero-title serif-text">
                {isArabic ? (
                  <>
                    عقول شابة. <span className="gradient-accent-text">حوار عالمي واحد.</span>
                  </>
                ) : (
                  <>
                    Young minds. <span className="gradient-accent-text">One global conversation.</span>
                  </>
                )}
              </h1>

              <div className="hero-subtitle-lead">
                {isArabic
                  ? 'منتدى أكاديمي ومناظرات شبابي دولي يربط نخبة المفكرين والباحثين حول العالم'
                  : 'International Youth Academic & Debate Forum Connecting Global Thinkers'}
              </div>

              <p className="hero-subtext">
                {isArabic
                  ? 'مجتمع يقوده الشباب يناقش فيه المفكرون الصاعدون القضايا المعقدة، ويتبادلون الرؤى المتنوعة، ويصيغون الحوار الفكري عبر أكثر من 14 دولة.'
                  : 'A youth-led community where emerging thinkers debate complex ideas, exchange perspectives, and shape global dialogue across 14+ nations.'}
              </p>

              <div className="hero-actions">
                <Link to="/apply" className="btn btn-primary btn-lg hero-cta-pill" id="heroJoinBtn">
                  <span>{isArabic ? 'تقديم طلب العضوية' : 'Apply for Membership'}</span> &rarr;
                </Link>
                <Link to="/sessions" className="btn btn-outline btn-lg hero-cta-explore" id="heroSessionsBtn">
                  {isArabic ? 'استكشاف جلسات الحوار' : 'Explore Dialogue Sessions'}
                </Link>
              </div>

              {/* 4-Item Diamond Bullet Metadata Grid */}
              <div className="hero-meta-grid">
                <div className="hero-meta-item">
                  <span className="hero-meta-diamond">&#9670;</span>
                  <span>{isArabic ? '14+ فرعاً وممثلاً دولياً' : '14+ Global Chapters'}</span>
                </div>
                <div className="hero-meta-item">
                  <span className="hero-meta-diamond">&#9670;</span>
                  <span>{isArabic ? 'مناظرات برلمانية أسبوعية' : 'Weekly Structured Debates'}</span>
                </div>
                <div className="hero-meta-item">
                  <span className="hero-meta-diamond">&#9670;</span>
                  <span>{isArabic ? '60+ مناظراً وباحثاً شاباً' : '60+ Active Youth Debaters'}</span>
                </div>
                <div className="hero-meta-item">
                  <span className="hero-meta-diamond">&#9670;</span>
                  <span>{isArabic ? 'أوراق بحثية شبابية 100%' : '100% Youth-Researched Papers'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Curated Photo Community Collage */}
            <div className="hero-collage-wrap">
              {/* Decorative Geometric Sunburst Accent (Desktop) */}
              <svg className="hero-sunburst-accent" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L53.5 35L85.3 14.6L64.6 46.5L100 50L64.6 53.5L85.3 85.4L53.5 64.6L50 100L46.5 64.6L14.7 85.4L35.4 53.5L0 50L35.4 46.5L14.7 14.6L46.5 35L50 0Z" fill="currentColor" />
              </svg>

              {/* Floating Star Sparkle Icon for Mobile */}
              <div className="hero-mobile-sparkle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>

              <div className="hero-collage-grid">
                {/* Main Keynote Speaker Card */}
                <div className="collage-main-card">
                  <img src="/assets/images/delegate_floor_speech.jpg" alt="Youth delegate delivering keynote debate speech" className="collage-main-img" />
                  <div className="collage-badge-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    <span>{isArabic ? 'كلمة المتحدث الرئيسي' : 'Floor Keynote Speech'}</span>
                  </div>
                </div>

                {/* Stacked Column (Walk + Academic Presentation) */}
                <div className="collage-stack-col">
                  {/* Top: Outdoor Global Walk */}
                  <div className="collage-stack-card collage-sub-overlap">
                    <img src="/assets/images/delegates_walk_outdoor.jpg" alt="International youth delegates walking together" className="collage-stack-img" />
                    <div className="collage-badge-tag collage-walk-badge">
                      <span className="badge-num-pill">16+</span>
                      <span>{isArabic ? 'دولة' : 'Nations'}</span>
                    </div>
                  </div>

                  {/* Bottom: Academic Research Delegate */}
                  <div className="collage-stack-card collage-desktop-only">
                    <img src="/assets/images/debate_session_roundtable.jpg" alt="Youth delegates participating in academic dialogue session" className="collage-stack-img" />
                    <div className="collage-badge-tag">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                      <span>{isArabic ? 'البحث الأكاديمي' : 'Academic Research'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Live Session Countdown Strip (Overlapping Hero Bottom) */}
      <div className="container floating-countdown-strip" id="heroCountdownStrip">
        <div className="floating-countdown-card">
          <div className="countdown-label-wrap">
            <div className="countdown-radar-tag">
              <span className="radar-dot"></span>
              <span>{isArabic ? 'الجلسة البرلمانية القادمة' : 'Next Global Dialogue Debate'}</span>
            </div>
            <h4 className="countdown-topic-title">
              {isArabic ? 'السيادة التكنولوجية للذكاء الاصطناعي وحقوق الإنسان الدولية' : 'AI Sovereignty & International Human Rights'}
            </h4>
          </div>

          {/* Digital Countdown Boxes Group */}
          <div className="countdown-boxes-group">
            <div className="countdown-box">
              <span className="countdown-digit" id="timerDays">{timeLeft.days}</span>
              <span className="countdown-unit">{isArabic ? 'أيام' : 'Days'}</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-box">
              <span className="countdown-digit" id="timerHours">{timeLeft.hours}</span>
              <span className="countdown-unit">{isArabic ? 'ساعات' : 'Hours'}</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-box">
              <span className="countdown-digit" id="timerMinutes">{timeLeft.minutes}</span>
              <span className="countdown-unit">{isArabic ? 'دقائق' : 'Mins'}</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-box">
              <span className="countdown-digit" id="timerSeconds">{timeLeft.seconds}</span>
              <span className="countdown-unit">{isArabic ? 'ثوانٍ' : 'Secs'}</span>
            </div>
          </div>

          {/* Action Button */}
          <Link to="/sessions" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <span>{isArabic ? 'التسجيل للحضور' : 'Register to Attend'}</span> &rarr;
          </Link>
        </div>
      </div>

      {/* Continuous Silky Marquee Ribbon */}
      <div className="marquee-ribbon-wrap">
        <div className="marquee-track">
          <div className="marquee-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> 14+ Global Chapters
          </div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> Accra</div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> Doha</div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> S&atilde;o Paulo</div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> Oxford</div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> New Delhi</div>
          <div className="marquee-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="3" x2="12" y2="21"></line><path d="M5 21h14"></path><path d="M4 7l8-4 8 4"></path><path d="M1 11l4-4 4 4a4 4 0 0 1-8 0z"></path><path d="M15 11l4-4 4 4a4 4 0 0 1-8 0z"></path></svg> Weekly Live Parliamentary Motions
          </div>
          <div className="marquee-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> 100% Youth-Researched Papers
          </div>
          <div className="marquee-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg> 60+ International Debaters
          </div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> Washington D.C.</div>
          {/* Loop duplicates */}
          <div className="marquee-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> 14+ Global Chapters
          </div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> Accra</div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> Doha</div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> S&atilde;o Paulo</div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> Oxford</div>
          <div className="marquee-item"><span className="marquee-star">&#10022;</span> New Delhi</div>
        </div>
      </div>

      {/* Key Metrics Strip with Animated Numbers */}
      <div className="metrics-strip">
        <div className="container">
          <div className="metrics-grid" id="metricsCounterGrid">
            <div className="metric-item">
              <div className="metric-number-animated" id="statNationsNum">14+</div>
              <div className="metric-label">{isArabic ? 'دولة ممثلة' : 'Countries Represented'}</div>
              <div className="metric-item-bar" style={{ width: '100%' }}></div>
            </div>
            <div className="metric-item">
              <div className="metric-number-animated" id="statDebatersNum">60+</div>
              <div className="metric-label">{isArabic ? 'مناظراً وباحثاً شاباً' : 'Youth Debaters'}</div>
              <div className="metric-item-bar" style={{ width: '100%' }}></div>
            </div>
            <div className="metric-item">
              <div className="metric-number-animated" id="statSessionsNum">52</div>
              <div className="metric-label">{isArabic ? 'جلسة حوار أسبوعية سنوياً' : 'Weekly Dialogue Sessions / Yr'}</div>
              <div className="metric-item-bar" style={{ width: '100%' }}></div>
            </div>
            <div className="metric-item">
              <div className="metric-number-animated" id="statWritingsNum">100%</div>
              <div className="metric-label">{isArabic ? 'محتوى وبحوث يقودها الشباب' : 'Youth-Led & Researched (%)'}</div>
              <div className="metric-item-bar" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Home Upcoming Session Spotlight Box */}
      <section className="home-upcoming-section">
        <div className="container">
          <div className="home-upcoming-header">
            <div className="home-upcoming-title-wrap">
              <span className="section-tag">{isArabic ? 'الجلسة القادمة المجدولة' : 'Next Scheduled Dialogue'}</span>
              <h2 className="serif-text home-upcoming-main-title">
                {isArabic ? 'جلسة الحوار البرلماني القادمة' : 'Upcoming Dialogue Session'}
              </h2>
              <p className="home-upcoming-sub">
                {isArabic
                  ? 'انضم إلى حوارنا الدولي الأسبوعي المنظم مع متحدثين يمثلون أكثر من 14 دولة.'
                  : 'Join our weekly structured international dialogue with debaters representing over 14 countries.'}
              </p>
            </div>
            <Link to="/sessions" className="btn btn-outline btn-sm home-upcoming-all-btn">
              <span>{isArabic ? 'عرض جميع الجلسات والأرشيف' : 'View All Sessions & Archives'}</span> &rarr;
            </Link>
          </div>

          {/* Spotlight Container with Rotating Sunburst Accents */}
          <div className="spotlight-sunburst-wrapper">
            <svg className="moving-sunburst-accent spotlight-sunburst-tr" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L53.5 35L85.3 14.6L64.6 46.5L100 50L64.6 53.5L85.3 85.4L53.5 64.6L50 100L46.5 64.6L14.7 85.4L35.4 53.5L0 50L35.4 46.5L14.7 14.6L46.5 35L50 0Z" fill="currentColor" />
            </svg>
            <svg className="moving-sunburst-accent spotlight-sunburst-bl accent-indigo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L53.5 35L85.3 14.6L64.6 46.5L100 50L64.6 53.5L85.3 85.4L53.5 64.6L50 100L46.5 64.6L14.7 85.4L35.4 53.5L0 50L35.4 46.5L14.7 14.6L46.5 35L50 0Z" fill="currentColor" />
            </svg>

            <div className="home-upcoming-container" style={{ padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ flex: '1 1 400px' }}>
                  <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-pill)', background: 'rgba(72, 81, 186, 0.1)', color: 'var(--color-primary-1)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.75rem' }}>
                    {isArabic ? 'الذكاء الاصطناعي والأخلاقيات' : 'Technology & AI Ethics'}
                  </div>
                  <h3 className="serif-text" style={{ fontSize: '1.65rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                    {isArabic
                      ? 'السيادة التكنولوجية للذكاء الاصطناعي ومستقبل القانون الدولي'
                      : 'AI Sovereignty, Algorithmic Governance & The Future of International Law'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    {isArabic
                      ? 'جلسة حوارية تركز على تقاطع خوارزميات الذكاء الاصطناعي التوليدي مع السيادة الوطنية وحماية الحريات المدنية في الفضاء الرقمي.'
                      : 'A high-level dialogue exploring generative AI systems, territorial regulatory jurisdiction, and cross-border digital sovereignty.'}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-body)', fontWeight: 500 }}>
                    <div><strong>{isArabic ? 'التاريخ:' : 'Date:'}</strong> Saturday, Oct 24, 2026</div>
                    <div><strong>{isArabic ? 'الوقت:' : 'Time:'}</strong> 16:00 UTC (19:00 Doha / Riyadh)</div>
                    <div><strong>{isArabic ? 'المتحدث:' : 'Presenter:'}</strong> Mubashir CP & Delegation</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link to="/apply" className="btn btn-primary" style={{ textAlign: 'center' }}>
                    {isArabic ? 'طلب المشاركة كمتحدث' : 'Request Floor Speaking Time'} &rarr;
                  </Link>
                  <Link to="/sessions" className="btn btn-outline" style={{ textAlign: 'center' }}>
                    {isArabic ? 'تفاصيل الجلسة ورابط الاجتماع' : 'Session Agenda & Room Link'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Welcome Highlights (Home Section Cards) */}
      <section className="home-highlights-section">
        <div className="container">
          <div className="home-highlights-grid">
            <Link to="/about" className="highlight-feature-card" style={{ textDecoration: 'none' }}>
              <div className="feature-icon-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="2" y1="22" x2="22" y2="22"></line>
                  <line x1="12" y1="2" x2="12" y2="7"></line>
                  <line x1="12" y1="2" x2="22" y2="7"></line>
                  <line x1="2" y1="7" x2="22" y2="7"></line>
                  <line x1="4" y1="7" x2="4" y2="18"></line>
                  <line x1="8" y1="7" x2="8" y2="18"></line>
                  <line x1="12" y1="7" x2="12" y2="18"></line>
                  <line x1="16" y1="7" x2="16" y2="18"></line>
                  <line x1="20" y1="7" x2="20" y2="18"></line>
                  <line x1="2" y1="18" x2="22" y2="18"></line>
                </svg>
              </div>
              <h3 className="serif-text">{isArabic ? 'عن المبادرة والنشأة' : 'About the Movement'}</h3>
              <p>
                {isArabic
                  ? 'أسسها أصدقاء ومناظرون التقوا في بطولة دولية لتحويل المناظرة التنافسية إلى شبكة أكاديمية عالمية دائمة.'
                  : 'Founded by friends who met at an international debate championship to turn competitive debate into a permanent global academic network.'}
              </p>
              <span className="feature-learn-more">
                <span>{isArabic ? 'معرفة المزيد' : 'Learn More'}</span> &rarr;
              </span>
            </Link>

            {/* Center Featured Highlight with Rotating Geometric Sunburst Accent */}
            <div className="highlight-sunburst-card-wrap">
              <svg className="moving-sunburst-accent highlight-card-sunburst" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L53.5 35L85.3 14.6L64.6 46.5L100 50L64.6 53.5L85.3 85.4L53.5 64.6L50 100L46.5 64.6L14.7 85.4L35.4 53.5L0 50L35.4 46.5L14.7 14.6L46.5 35L50 0Z" fill="currentColor" />
              </svg>
              <Link to="/topics" className="highlight-feature-card highlight-featured-accent" style={{ textDecoration: 'none' }}>
                <div className="feature-icon-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3 className="serif-text">{isArabic ? '16 محوراً معرفياً تخصصياً' : '16 Core Knowledge Spheres'}</h3>
                <p>
                  {isArabic
                    ? 'استكشف مجالات متعددة التخصصات من الجيوسياسة وأخلاقيات الذكاء الاصطناعي إلى المناخ والحوكمة وحقوق الإنسان.'
                    : 'Explore multidisciplinary arenas from Geopolitics & AI Ethics to Climate, Governance, and Human Rights.'}
                </p>
                <span className="feature-learn-more">
                  <span>{isArabic ? 'استكشاف المحاور' : 'Explore Topics'}</span> &rarr;
                </span>
              </Link>
            </div>

            <Link to="/community" className="highlight-feature-card" style={{ textDecoration: 'none' }}>
              <div className="feature-icon-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </div>
              <h3 className="serif-text">{isArabic ? 'أثرنا في الشباب' : 'Our Impact'}</h3>
              <p>
                {isArabic
                  ? 'انطلق أبعد من قاعة المناظرة: طور مهاراتك في البحث الرصين، الخطابة، الكتابة الأكاديمية، والقيادة الدولية.'
                  : 'Grow beyond the debate room: develop rigorous research, public speaking, academic writing, and international leadership.'}
              </p>
              <span className="feature-learn-more">
                <span>{isArabic ? 'اكتشف الأثر' : 'Discover Impact'}</span> &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
