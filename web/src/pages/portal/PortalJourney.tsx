import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const PortalJourney: React.FC = () => {
  const { user } = useAuth();
  const { isArabic } = useLanguage();

  const isPresenter = ['presenter', 'PRESENTER'].includes(user?.role as string);

  // Stats calculation based on user record / defaults matching legacy experience
  const dialoguesAttended = 2;
  const debatesSpoken = isPresenter ? 3 : 1;
  const papersAuthored = 0;
  const communityScore = 92;

  const badges = [
    {
      id: 'isdc7_veteran',
      title: isArabic ? 'مندوب مؤسس في بطولة قطر ISDC7' : 'Qatar ISDC7 Founding Delegate',
      desc: isArabic
        ? 'شارك في النسخة السابعة من بطولة قطر الدولية لمناظرات المدارس بالدوحة'
        : 'Participated in the Doha 7th International Schools Debate Championship',
      unlocked: true,
      progress: '100%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"></circle>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
        </svg>
      ),
    },
    {
      id: 'distinguished_speaker',
      title: isArabic ? 'متحدث متميز' : 'Distinguished Speaker',
      desc: isArabic
        ? 'قدم خطابات افتتاحية أو تفنيدية رئيسية في 3 جلسات حوار دولية فأكثر'
        : 'Delivered principal constructive or rebuttal speeches in 3+ international sessions',
      unlocked: debatesSpoken >= 3,
      progress: isPresenter ? '100%' : '33%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" x2="12" y1="19" y2="22"></line>
        </svg>
      ),
    },
    {
      id: 'academic_fellow',
      title: isArabic ? 'مساهم في البحث الأكاديمي' : 'Academic Research Contributor',
      desc: isArabic
        ? 'ألّف أو ساهم في إعداد أوراق سياسات شبابية محكمة ومعتمدة'
        : 'Authored or contributed to peer-reviewed youth policy synthesis papers',
      unlocked: papersAuthored >= 1,
      progress: '50%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
    {
      id: 'agenda_setter',
      title: isArabic ? 'صانع أجندة الحوار' : 'Dialogue Agenda Setter',
      desc: isArabic
        ? 'اقترح قضايا ومحاور نقاش معتمدة تتناول أولويات الحوكمة العالمية'
        : 'Suggested approved debate motions tackling high-priority global governance issues',
      unlocked: false,
      progress: '33%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6"></path>
          <path d="M10 22h4"></path>
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"></path>
        </svg>
      ),
    },
    {
      id: 'peer_reviewer',
      title: isArabic ? 'مقيم أقران بنّاء' : 'Constructive Peer Reviewer',
      desc: isArabic
        ? 'قدّم تقييمات نوعية وملاحظات منظمة خلال جولات الحوار المكتملة'
        : 'Provided structured qualitative feedback across completed dialogue rounds',
      unlocked: false,
      progress: '20%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="portal-subview-content" style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Page Header */}
      <div className="portal-page-header" style={{ marginBottom: '1.75rem' }}>
        <div className="portal-page-title">
          <h2 className="serif-text" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--brand-navy, #0f172a)' }}>
            {isArabic ? 'مسيرتي الحوارية والأوسمة' : 'My Dialogue Journey & Badges'}
          </h2>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--text-muted, #64748b)', fontSize: '0.95rem' }}>
            {isArabic
              ? 'سجلك في المناظرات الأكاديمية ومساهماتك والتقدير الدولي المحقق.'
              : 'Your academic debate track record, contributions, and international recognition.'}
          </p>
        </div>
      </div>

      {/* Analytics Hero Stats Strip */}
      <div className="analytics-hero-grid" style={{ marginBottom: '2rem' }}>
        <div className="analytics-stat-card">
          <div className="analytics-stat-num">{dialoguesAttended}</div>
          <div className="analytics-stat-label">{isArabic ? 'جلسات تم حضورها' : 'Dialogues Attended'}</div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-num">{debatesSpoken}</div>
          <div className="analytics-stat-label">{isArabic ? 'مناظرات تم التحدث فيها' : 'Debates Spoken'}</div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-num">{papersAuthored}</div>
          <div className="analytics-stat-label">{isArabic ? 'أوراق أكاديمية منشورة' : 'Academic Papers Authored'}</div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-num">{communityScore}%</div>
          <div className="analytics-stat-label">{isArabic ? 'نقاط التفاعل المجتمعي' : 'Community Score'}</div>
        </div>
      </div>

      {/* Honorary Dialogue Badges Showcase */}
      <div className="card-panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-navy, #0f172a)' }}>
            {isArabic ? 'أوسمة الحوار الشرفية' : 'Honorary Dialogue Badges'}
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
            {isArabic ? 'تقدير التميز في المناظرات والمساهمات الأكاديمية' : 'Recognizing debate mastery and academic contributions'}
          </span>
        </div>

        <div className="badges-showcase-grid">
          {badges.map((b) => (
            <div key={b.id} className={`badge-honor-card ${b.unlocked ? '' : 'locked'}`}>
              <div>
                <div className="badge-icon-header">
                  <div className="badge-icon-box">{b.icon}</div>
                  <span
                    className={`badge-status-pill ${b.unlocked ? 'status-approved' : 'status-review'}`}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {b.unlocked ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{isArabic ? 'تم الحصول عليه' : 'UNLOCKED'}</span>
                      </>
                    ) : (
                      <span>{isArabic ? 'قيد الإنجاز' : 'IN PROGRESS'}</span>
                    )}
                  </span>
                </div>

                <div className="badge-title" style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.75rem', marginBottom: '0.35rem', color: 'var(--brand-navy, #0f172a)' }}>
                  {b.title}
                </div>
                <p className="badge-desc" style={{ fontSize: '0.825rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                  {b.desc}
                </p>
              </div>

              <div className="badge-progress-wrap" style={{ marginTop: 'auto' }}>
                <div className="badge-progress-bar" style={{ height: '6px', background: 'var(--bg-subtle, #e2e8f0)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    className="badge-progress-fill"
                    style={{
                      width: b.progress,
                      height: '100%',
                      background: b.unlocked ? 'linear-gradient(90deg, #4851BA, #9E59AC)' : '#94a3b8',
                      borderRadius: '999px',
                    }}
                  ></div>
                </div>
                <div className="badge-progress-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '0.4rem' }}>
                  <span>{isArabic ? 'التقدم' : 'Progress'}</span>
                  <span>{b.progress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
