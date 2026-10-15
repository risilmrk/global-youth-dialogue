import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';

interface SessionItem {
  id: string;
  sessionNumber: number;
  title: string;
  topicTitle?: string;
  date: string;
  time?: string;
  status: 'Upcoming' | 'Completed' | 'In Progress';
  presenterName: string;
  presenterCountry: string;
  countries: string[];
  summary?: string;
  recordingUrl?: string;
  materialsUrl?: string;
}

const FALLBACK_SESSIONS: SessionItem[] = [
  {
    id: 'ses-1',
    sessionNumber: 1,
    title: 'AI Sovereignty, Algorithmic Governance & The Future of International Law',
    topicTitle: 'Technology & AI Ethics',
    date: 'Oct 24, 2026',
    time: '16:00 UTC',
    status: 'Upcoming',
    presenterName: 'Mubashir CP',
    presenterCountry: 'India',
    countries: ['IN', 'QA', 'UK', 'BR', 'GH', 'DE'],
    summary: 'Deliberating the limits of nation-state jurisdiction over generative models and sovereign cloud infrastructures.'
  },
  {
    id: 'ses-2',
    sessionNumber: 2,
    title: 'Post-Dollar Multilateralism & Financial Statecraft in the Global South',
    topicTitle: 'Geopolitics & International Relations',
    date: 'Nov 07, 2026',
    time: '17:00 UTC',
    status: 'Upcoming',
    presenterName: 'Sarah Al-Kuwari',
    presenterCountry: 'Qatar',
    countries: ['QA', 'IN', 'ZA', 'BR', 'EG'],
    summary: 'Evaluating bilateral currency arrangements and the reform of Bretton Woods institutions.'
  },
  {
    id: 'ses-3',
    sessionNumber: 3,
    title: 'Climate Migration & Cross-Border Legal Status for Displaced Populations',
    topicTitle: 'Environment & Climate Policy',
    date: 'Sep 26, 2026',
    time: '16:00 UTC',
    status: 'Completed',
    presenterName: 'Kwame Mensah',
    presenterCountry: 'Ghana',
    countries: ['GH', 'NG', 'BD', 'UK', 'CA'],
    summary: 'Examining the Geneva Convention and legal protections for climate-induced displacement.'
  },
  {
    id: 'ses-4',
    sessionNumber: 4,
    title: 'Digital Surveillance Capitalism & Civil Liberties in Emerging Democracies',
    topicTitle: 'Governance & Civil Society',
    date: 'Sep 12, 2026',
    time: '16:00 UTC',
    status: 'Completed',
    presenterName: 'Elena Rostova',
    presenterCountry: 'United Kingdom',
    countries: ['UK', 'DE', 'IN', 'KE', 'US'],
    summary: 'Analyzing private sector surveillance technologies and statutory frameworks for data protection.'
  }
];

export const Sessions: React.FC = () => {
  const { isArabic } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'Upcoming' | 'Completed'>('all');
  const [search, setSearch] = useState('');
  const [sessions, setSessions] = useState<SessionItem[]>(FALLBACK_SESSIONS);

  useEffect(() => {
    // Attempt to load from REST API if available
    apiRequest<any>('/sessions')
      .then((res: any) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((s: any, idx: number) => ({
            id: s._id || s.id,
            sessionNumber: s.sessionNumber || idx + 1,
            title: s.title,
            topicTitle: s.topic?.title || 'Dialogue Topic',
            date: new Date(s.scheduledAt || Date.now()).toLocaleDateString(),
            time: '16:00 UTC',
            status: s.status === 'scheduled' ? 'Upcoming' : s.status === 'completed' ? 'Completed' : 'Upcoming',
            presenterName: s.presenter?.name || 'Assigned Delegate',
            presenterCountry: s.presenter?.country || 'Global',
            countries: ['IN', 'QA', 'UK', 'GH'],
            summary: s.description || ''
          }));
          setSessions(mapped);
        }
      })
      .catch(() => {
        // Fallback already initialized
      });
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.presenterName.toLowerCase().includes(search.toLowerCase()) ||
      (s.topicTitle && s.topicTitle.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="public-section active" id="sessions">
      <section className="sessions-public-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{isArabic ? 'أرشيف الحوارات' : 'Dialogue Archive'}</span>
            <h2 className="section-title serif-text">{isArabic ? 'الجلسات والأوراق الأكاديمية' : 'Sessions & Academic Writings'}</h2>
            <p className="section-desc">
              {isArabic
                ? 'استكشف جلسات الحوار الشبابي الدولي، وجداول أعمال المناظرات القادمة، والمداولات الأكاديمية المؤرشفة والمفتوحة للجميع.'
                : 'Explore our international youth dialogue sessions, upcoming debate agendas, panel discussions, and archived proceedings open for everyone.'}
            </p>
          </div>

          {/* Public Session Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} id="publicSessionStatusFilters">
              <button
                className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('all')}
              >
                {isArabic ? 'جميع الجلسات' : 'All Dialogue Sessions'}
              </button>
              <button
                className={`btn btn-sm ${filter === 'Upcoming' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('Upcoming')}
              >
                {isArabic ? 'الجلسات القادمة' : 'Upcoming Sessions'}
              </button>
              <button
                className={`btn btn-sm ${filter === 'Completed' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('Completed')}
              >
                {isArabic ? 'الأرشيف المنعقد' : 'Completed Archive'}
              </button>
            </div>

            <div className="public-session-search-wrap" style={{ position: 'relative' }}>
              <input
                type="text"
                id="publicSessionSearch"
                className="form-control form-control-sm"
                placeholder={isArabic ? 'بحث في الجلسات والمتحدثين والمواضيع...' : 'Search sessions, topics, presenters...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingInlineStart: '2rem' }}
              />
              <span style={{ position: 'absolute', insetInlineStart: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
            </div>
          </div>

          {/* Preview Cards Grid (Open to Everyone) */}
          <div className="public-sessions-grid" id="publicSessionsPreview">
            {filteredSessions.map((session) => (
              <div key={session.id} className="session-card-preview">
                <div className="session-lock-tag">
                  {session.status === 'Upcoming' ? (
                    <span style={{ color: 'var(--color-primary-1)', fontWeight: 600 }}>● {isArabic ? 'قادمة' : 'Upcoming'}</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>✓ {isArabic ? 'منعقدة' : 'Archived'}</span>
                  )}
                </div>

                <div className="session-num-badge">
                  {isArabic ? `الجلسة #${session.sessionNumber}` : `Dialogue Session #${session.sessionNumber}`}
                </div>

                <h4>{session.title}</h4>

                <div className="session-meta-row">
                  <div>📅 {session.date}</div>
                  <div>👤 {session.presenterName} ({session.presenterCountry})</div>
                </div>

                {session.summary && (
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem', flexGrow: 1 }}>
                    {session.summary}
                  </p>
                )}

                <div className="session-countries-pills">
                  {session.countries.map((c, i) => (
                    <span key={i} className="country-pill">{c}</span>
                  ))}
                  <div style={{ marginInlineStart: 'auto' }}>
                    <Link to="/apply" className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.6rem', fontSize: '0.76rem' }}>
                      {session.status === 'Upcoming' ? (isArabic ? 'حضور' : 'Attend') : (isArabic ? 'الملخص' : 'Summary')} &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
