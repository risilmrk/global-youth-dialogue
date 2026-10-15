import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { DialogueSession, Topic, Publication } from '../../types';
import {
  Calendar,
  Video,
  ExternalLink,
  BookOpen,
  Lightbulb,
  MessageSquareQuote,
  Sparkles,
  ArrowRight,
  Shield,
  Users,
  Clock,
} from 'lucide-react';
import { ApplyPresenterModal } from '../../components/portal/ApplyPresenterModal';

export const PortalDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isArabic } = useLanguage();
  const [presenterModalOpen, setPresenterModalOpen] = React.useState(false);

  const { data: sessions = [] } = useQuery<DialogueSession[]>({
    queryKey: ['portal-sessions'],
    queryFn: () => apiRequest<DialogueSession[]>('/sessions'),
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['portal-topics'],
    queryFn: () => apiRequest<Topic[]>('/topics'),
  });

  const { data: publications = [] } = useQuery<Publication[]>({
    queryKey: ['portal-publications'],
    queryFn: () => apiRequest<Publication[]>('/publications'),
  });

  const nextSession = sessions.find((s) => s.status === 'scheduled' || s.status === 'live');

  return (
    <div>
      {/* Portal Page Header */}
      <div className="portal-page-header">
        <div className="portal-page-title">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-primary-1)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem', letterSpacing: '0.02em' }}>
            <Sparkles style={{ width: 16, height: 16 }} />
            <span>{isArabic ? 'بوابة الأعضاء والباحثين المعتمدين' : 'Verified Delegate Workspace'}</span>
          </div>
          <h2 className="serif-text" style={{ fontSize: '2.1rem', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {isArabic ? `أهلاً بك، ${user?.name || 'عضو المنصة'}` : `Welcome back, ${user?.name || 'Delegate'}`}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.35rem', maxWidth: '680px', lineHeight: 1.5 }}>
            {isArabic
              ? 'لديك صلاحية الوصول الكامل إلى غرف المناظرات المباشرة، التسجيلات الأرشيفية، ونماذج التقييم النوعي.'
              : 'You have full clearance to access live Google Meet chambers, unlisted video archives, peer evaluations, and topic voting.'}
          </p>
        </div>

        <div className="portal-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/portal/suggest-topic" className="btn btn-outline btn-sm" style={{ gap: '0.45rem', textDecoration: 'none' }}>
            <Lightbulb style={{ width: 15, height: 15 }} />
            <span>{isArabic ? 'اقتراح موضوع' : 'Suggest a Topic'}</span>
          </Link>
          <button
            type="button"
            onClick={() => setPresenterModalOpen(true)}
            className="btn btn-primary btn-sm btn-be-presenter"
            style={{ gap: '0.45rem', cursor: 'pointer', border: 'none' }}
          >
            <Shield style={{ width: 14, height: 14 }} />
            <span>{isArabic ? 'طلب الاعتماد كمتحدث' : 'Request to be Presenter'}</span>
          </button>
        </div>
      </div>

      {/* Spotlight: Next Scheduled Dialogue Session */}
      {nextSession && (
        <div className="spotlight-card" style={{ marginBottom: '2rem' }}>
          <div className="spotlight-top">
            <span className="spotlight-tag">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span>{isArabic ? 'الجلسة القادمة مباشرة' : 'Next Scheduled Dialogue Session'}</span>
            </span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
              {new Date(nextSession.scheduledAt).toLocaleString()} ({nextSession.timezone || 'Doha Time (GMT+3)'})
            </span>
          </div>

          <h3 style={{ fontSize: '1.65rem', margin: '0.75rem 0', color: '#FFFFFF', lineHeight: 1.3 }}>
            {isArabic && nextSession.titleAr ? nextSession.titleAr : nextSession.title}
          </h3>

          {nextSession.motion && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderInlineStart: '4px solid #f59e0b',
              padding: '0.85rem 1.15rem',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              marginBottom: '1.15rem',
              fontSize: '0.92rem',
              lineHeight: 1.5,
            }}>
              <strong style={{ color: '#fef3c7' }}>{isArabic ? 'القضية المطروحة:' : 'Debate Motion:'}</strong> "{nextSession.motion}"
            </div>
          )}

          <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '850px', marginBottom: '1.25rem' }}>
            {isArabic && nextSession.descriptionAr ? nextSession.descriptionAr : nextSession.description}
          </p>

          <div className="spotlight-meta-list" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div className="spotlight-meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem' }}>
              <Users style={{ width: 16, height: 16, opacity: 0.8 }} />
              <span>
                {nextSession.presenters?.map((p) => p.name).join(', ') || 'Assigned Debaters & Scholars'}
              </span>
            </div>
            <div className="spotlight-meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem' }}>
              <Clock style={{ width: 16, height: 16, opacity: 0.8 }} />
              <span>{nextSession.durationMinutes || 90} {isArabic ? 'دقيقة' : 'Minutes'}</span>
            </div>
          </div>

          <div className="spotlight-actions" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {nextSession.meetingUrl ? (
              <a
                href={nextSession.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{
                  gap: '0.5rem',
                  background: '#FFFFFF',
                  color: '#000000',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Video style={{ width: 18, height: 18 }} />
                <span>{isArabic ? 'الانضمام لغرفة المناظرة المباشرة' : 'Join Live Meeting Chamber'}</span>
                <ExternalLink style={{ width: 15, height: 15 }} />
              </a>
            ) : (
              <span className="btn btn-outline btn-lg" style={{ opacity: 0.7, color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                {isArabic ? 'الرابط متاح قبل 15 دقيقة' : 'Meeting Link Activates 15m Prior'}
              </span>
            )}
            <Link
              to={`/portal/sessions/${nextSession.id}`}
              className="btn btn-outline btn-lg"
              style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.35)', textDecoration: 'none' }}
            >
              {isArabic ? 'ملف الجلسة والأبحاث' : 'Session Briefing & Dossier'} &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* 2-Column Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Main Column */}
        <div className="dashboard-main">
          {/* Quick Access Card */}
          <div className="card-panel">
            <div className="panel-header">
              <h4 className="serif-text" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>
                {isArabic ? 'أدوات الوصول السريع' : 'Quick Access Workspaces'}
              </h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isArabic ? 'أدوات العضو التفاعلية' : 'Active Member Hub'}
              </span>
            </div>

            <div className="quick-access-grid">
              <Link to="/portal/sessions" className="qa-card" style={{ textDecoration: 'none' }}>
                <span className="qa-icon">
                  <Calendar style={{ width: 24, height: 24 }} />
                </span>
                <span className="qa-title">{isArabic ? 'الجلسات المجدولة' : 'Upcoming Sessions'}</span>
              </Link>

              <Link to="/portal/sessions" className="qa-card" style={{ textDecoration: 'none' }}>
                <span className="qa-icon">
                  <Video style={{ width: 24, height: 24 }} />
                </span>
                <span className="qa-title">{isArabic ? 'أرشيف التسجيلات' : 'Recorded Chambers'}</span>
              </Link>

              <Link to="/portal/publications" className="qa-card" style={{ textDecoration: 'none' }}>
                <span className="qa-icon">
                  <BookOpen style={{ width: 24, height: 24 }} />
                </span>
                <span className="qa-title">{isArabic ? 'الأوراق البحثية' : 'Academic Writings'}</span>
              </Link>

              <Link to="/portal/feedback" className="qa-card" style={{ textDecoration: 'none' }}>
                <span className="qa-icon">
                  <MessageSquareQuote style={{ width: 24, height: 24 }} />
                </span>
                <span className="qa-title">{isArabic ? 'تقديم التقييم' : 'Peer Evaluations'}</span>
              </Link>

              <Link to="/portal/topics" className="qa-card" style={{ textDecoration: 'none' }}>
                <span className="qa-icon">
                  <Lightbulb style={{ width: 24, height: 24 }} />
                </span>
                <span className="qa-title">{isArabic ? 'بنك المواضيع والقضايا' : 'Topic Bank & Motions'}</span>
              </Link>

              <Link to="/portal/profile" className="qa-card" style={{ textDecoration: 'none' }}>
                <span className="qa-icon">
                  <Shield style={{ width: 24, height: 24 }} />
                </span>
                <span className="qa-title">{isArabic ? 'الملف الشخصي والتفويض' : 'Profile & Dossier'}</span>
              </Link>
            </div>
          </div>

          {/* Academic Research Papers Snippet */}
          <div className="card-panel">
            <div className="panel-header">
              <h4 className="serif-text" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>
                {isArabic ? 'أحدث أوراق البحث المحكمة' : 'Latest Research Papers & Syntheses'}
              </h4>
              <Link to="/portal/publications" style={{ fontSize: '0.82rem', color: 'var(--color-primary-1)', textDecoration: 'none', fontWeight: 600 }}>
                {isArabic ? 'عرض المكتبة' : 'Browse Library'} &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {publications.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  {isArabic ? 'جاري نشر أحدث الأوراق الأكاديمية...' : 'New academic research papers will be indexed soon.'}
                </div>
              ) : (
                publications.slice(0, 3).map((pub) => (
                  <Link
                    key={pub.id}
                    to={`/publications/${pub.slug}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.85rem 1.15rem',
                      background: 'var(--bg-body)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {isArabic && pub.titleAr ? pub.titleAr : pub.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {pub.category} • {pub.authors?.join(', ')}
                      </div>
                    </div>
                    <ArrowRight style={{ width: 16, height: 16, color: 'var(--color-primary-1)', flexShrink: 0 }} />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="dashboard-side">
          {/* Delegate Dossier Clearance Status Card */}
          <div className="card-panel" style={{ borderTop: '3px solid var(--color-primary-1)' }}>
            <div className="panel-header" style={{ marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-main)' }}>
                {isArabic ? 'ملف التفويض والمصادقة' : 'Delegate Dossier'}
              </h4>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(72, 81, 186, 0.1)',
                color: 'var(--color-primary-1)',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                {user?.role || 'Member'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {isArabic
                ? 'عضوية معتمدة تم التحقق منها للمشاركة في المناظرات الافتراضية وحلقات النقاش التخصصية.'
                : 'Verified institutional clearance to take the floor during live motions and cast peer evaluations.'}
            </p>
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{isArabic ? 'الدولة:' : 'Delegation:'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user?.country || 'International'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{isArabic ? 'المؤسسة:' : 'Institution:'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user?.organization || 'Academic Fellow'}</span>
              </div>
            </div>
          </div>

          {/* Platform Chamber Notices */}
          <div className="card-panel">
            <div className="panel-header" style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-main)' }}>
                {isArabic ? 'التنبيهات البرلمانية' : 'Chamber Notices'}
              </h4>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <Sparkles style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    {isArabic ? 'جلسة الأحد القادمة مباشرة' : 'Upcoming Debate Motion Ready'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {isArabic ? 'تتوفر مذكرات المناظرة والأوراق التمهيدية للأعضاء.' : 'Dossier and research briefings uploaded for preparation.'}
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon">
                  <MessageSquareQuote style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    {isArabic ? 'نموذج تقييم المتحدثين متاح' : 'Peer Evaluations Active'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {isArabic ? 'شارك بملاحظاتك على أداء المناظرين في الجلسة الأخيرة.' : 'Submit constructive critique on recent speaker motions.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ApplyPresenterModal
        isOpen={presenterModalOpen}
        onClose={() => setPresenterModalOpen(false)}
      />
    </div>
  );
};
