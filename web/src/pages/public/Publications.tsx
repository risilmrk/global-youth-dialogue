import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { Publication } from '../../types';

const DEMO_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    slug: 'ai-sovereignty-dilemma',
    title: 'The AI Sovereignty Dilemma: Algorithmic Jurisdiction & Data Borders',
    titleAr: 'معضلة السيادة في عصر الذكاء الاصطناعي: الولاية القضائية وحدود البيانات',
    abstract: 'This paper analyzes the emergence of national AI sovereignty frameworks, the geopolitical battle over semiconductor compute clusters, and international legal mechanisms for cross-border algorithmic accountability.',
    authors: [
      {
        name: 'Mubashir CP',
        country: 'India',
        role: 'Coordinator & Debater'
      }
    ],
    category: 'Technology & AI Ethics',
    status: 'published',
    visibility: 'public',
    publishedAt: '2026-10-10',
    createdAt: '2026-10-10'
  },
  {
    id: 'pub-2',
    slug: 'multilateral-sanctions-currencies',
    title: 'Multilateral Sanctions & The Rise of Alternative Reserve Settlement Currencies',
    titleAr: 'العقوبات المتعددة وصعود العملات البديلة لتسوية الاحتياطيات الدولية',
    abstract: 'An academic examination into the weaponization of dollar-clearing mechanisms and the resulting expansion of local-currency settlement pacts across the Global South.',
    authors: [
      {
        name: 'Sarah Al-Kuwari',
        country: 'Qatar',
        role: 'Member'
      }
    ],
    category: 'Geopolitics & International Relations',
    status: 'published',
    visibility: 'public',
    publishedAt: '2026-09-28',
    createdAt: '2026-09-28'
  },
  {
    id: 'pub-3',
    slug: 'climate-induced-statelessness',
    title: 'Climate-Induced Statelessness: Re-evaluating the 1951 Refugee Convention',
    titleAr: 'انعدام الجنسية الناتج عن المناخ: إعادة تقييم اتفاقية اللاجئين لعام 1951',
    abstract: 'Investigating legal protection voids for island nation populations facing imminent territorial inundation, proposing an updated international multilateral protocol.',
    authors: [
      {
        name: 'Kwame Mensah',
        country: 'Ghana',
        role: 'Member'
      }
    ],
    category: 'Environment & Climate Policy',
    status: 'published',
    visibility: 'public',
    publishedAt: '2026-09-14',
    createdAt: '2026-09-14'
  }
];

export const Publications: React.FC = () => {
  const { isArabic } = useLanguage();
  const [search, setSearch] = useState('');

  const { data: apiPubs = [] } = useQuery<Publication[]>({
    queryKey: ['publications', search],
    queryFn: () => apiRequest<Publication[]>(`/publications?search=${encodeURIComponent(search)}`).catch(() => []),
  });

  const displayList = apiPubs.length > 0 ? apiPubs : DEMO_PUBLICATIONS;
  const filtered = displayList.filter(p => {
    const authorName = p.authors?.[0]?.name || p.author?.name || '';
    return (
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.titleAr && p.titleAr.includes(search)) ||
      p.abstract.toLowerCase().includes(search.toLowerCase()) ||
      authorName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="container" style={{ padding: '3.5rem 1rem' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="section-tag">{isArabic ? 'المكتبة الأكاديمية المحكمة' : 'Academic Research Repository'}</span>
        <h1 className="section-title serif-text" style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
          {isArabic ? 'الأوراق البحثية والدراسات المحكمة' : 'Youth Research Papers & Publications'}
        </h1>
        <p className="section-desc" style={{ maxWidth: '680px', margin: '0 auto' }}>
          {isArabic
            ? 'أوراق بحثية من ثمانية أقسام منهجية تصاغ بعد كل مناظرة وتخضع للتحكيم الأكاديمي بواسطة الهيئة الاستشارية.'
            : '8-part structured academic papers synthesized directly from bi-weekly parliamentary debates, peer-reviewed by our research secretariat.'}
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '480px', margin: '0 auto 2.5rem', position: 'relative' }}>
        <input
          type="text"
          className="form-control"
          placeholder={isArabic ? 'بحث في العناوين والملخصات والمؤلفين...' : 'Search by paper title, abstract, or author...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingInlineStart: '2.25rem' }}
        />
        <span style={{ position: 'absolute', insetInlineStart: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
      </div>

      {/* Publications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
        {filtered.map((pub) => {
          const author = pub.authors?.[0] || pub.author || { name: 'GYDE Fellow', country: 'Global' };
          return (
            <div key={pub.id} className="card-panel" style={{ padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="category-pill" style={{ color: 'var(--color-primary-1)', fontWeight: 600 }}>{pub.category}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pub.publishedAt}</span>
              </div>

              <h3 className="serif-text" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: '1.4', color: 'var(--text-main)' }}>
                {isArabic && pub.titleAr ? pub.titleAr : pub.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem', flexGrow: 1 }}>
                {pub.abstract}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-body)' }}>
                  <strong>👤 {author.name}</strong> ({author.country})
                </div>
                <Link to={`/publications/${pub.id}`} className="btn btn-outline btn-sm">
                  {isArabic ? 'قراءة الورقة' : 'Read Paper'} &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
