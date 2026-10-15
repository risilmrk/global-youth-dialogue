import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES } from '../../constants';
import { TOPIC_BANK, TopicBankItem } from '../../constants/topicBank';

export const PortalTopicBank: React.FC = () => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTopics = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TOPIC_BANK.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;

      const titleMatch = item.title.toLowerCase().includes(q) || (item.titleAr && item.titleAr.includes(q));
      const descMatch = item.description.toLowerCase().includes(q) || (item.descriptionAr && item.descriptionAr.includes(q));
      const subMatch = item.subtopics.some((st) => st.toLowerCase().includes(q));

      return titleMatch || descMatch || subMatch;
    });
  }, [search, selectedCategory]);

  const handleUseTopic = (topicId: string) => {
    navigate('/portal/suggest-topic');
  };

  return (
    <div className="portal-subview-content" style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Page Header */}
      <div className="portal-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="portal-page-title">
          <h2 className="serif-text" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--brand-navy, #0f172a)' }}>
            {isArabic ? 'بنك المواضيع الأكاديمي' : 'Academic Topic Bank'}
          </h2>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--text-muted, #64748b)', fontSize: '0.95rem' }}>
            {isArabic
              ? 'مواضيع وبحوث دولية منتقاة بعناية وجاهزة للحوارات المنظمة والعروض والمناظرات.'
              : 'Curated international research themes and subtopics ready for structured dialogue, presentations, and debates.'}
          </p>
        </div>

        <div className="portal-actions">
          <button
            onClick={() => navigate('/portal/suggest-topic')}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              fontWeight: 600,
              background: '#4851BA',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>{isArabic ? 'اقتراح موضوع' : 'Suggest a Topic'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div
        className="filter-bar"
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          background: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          marginBottom: '1.75rem',
        }}
      >
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            className="search-input"
            placeholder={isArabic ? 'البحث عن المواضيع والمحاور والكلمات المفتاحية...' : 'Search topics, subtopics, or keywords...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '0.6rem 0.85rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            background: '#ffffff',
            minWidth: '200px',
            outline: 'none',
          }}
        >
          <option value="all">{isArabic ? 'جميع التصنيفات' : 'All Categories'}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {isArabic ? cat.nameAr : cat.name}
            </option>
          ))}
        </select>

        <div
          className="bank-count-pill"
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#4851BA',
            background: 'rgba(72, 81, 186, 0.08)',
            padding: '0.4rem 0.75rem',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
          }}
        >
          {filteredTopics.length} {isArabic ? 'موضوع متاح' : `Topic${filteredTopics.length === 1 ? '' : 's'} Available`}
        </div>
      </div>

      {/* Topic Bank Cards Grid */}
      {filteredTopics.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <h4 style={{ color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
            {isArabic ? 'لا توجد مواضيع مطابقة لبحثك' : 'No matching topics found'}
          </h4>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
            {isArabic
              ? 'هل تبحث عن قضية معينة غير مدرجة؟ اقترح موضوعك الأكاديمي المخصص ليتم اعتماده وإدراجه في بنك المواضيع.'
              : 'Cannot find what you are looking for? Propose your own custom academic topic using the custom proposal option.'}
          </p>
          <button
            onClick={() => navigate('/portal/suggest-topic')}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600,
              background: '#4851BA',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isArabic ? 'اقتراح موضوع أكاديمي جديد' : 'Suggest a New Custom Topic'}
          </button>
        </div>
      ) : (
        <div
          className="topic-bank-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredTopics.map((topic) => {
            const formats = topic.recommendedFormats || [];
            return (
              <div
                key={topic.id}
                className="topic-bank-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          background: 'rgba(72, 81, 186, 0.1)',
                          color: '#4851BA',
                        }}
                      >
                        {isArabic && topic.categoryNameAr ? topic.categoryNameAr : topic.categoryName}
                      </span>
                      {formats.length > 0 && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '999px',
                            background: '#f1f5f9',
                            color: '#475569',
                          }}
                        >
                          {formats[0]}
                        </span>
                      )}
                    </div>
                    {topic.dateAdded && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{topic.dateAdded}</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0', lineHeight: 1.4 }}>
                    {topic.title}
                  </h3>
                  {topic.titleAr && (
                    <div style={{ fontSize: '0.9rem', color: '#4851BA', fontFamily: "'Cairo', sans-serif", fontWeight: 600, marginBottom: '0.65rem' }}>
                      {topic.titleAr}
                    </div>
                  )}

                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    {isArabic && topic.descriptionAr ? topic.descriptionAr : topic.description}
                  </p>

                  {/* Subtopics Box */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      marginBottom: '1rem',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      {isArabic ? `محاور البحث والزوايا الأكاديمية (${topic.subtopics.length})` : `Academic Research Angles & Subtopics (${topic.subtopics.length})`}
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {topic.subtopics.slice(0, 4).map((st, idx) => (
                        <li key={idx} style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                          <span style={{ color: '#4851BA', fontWeight: 700 }}>›</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {isArabic ? 'بإشراف: المجلس الأكاديمي' : `By: ${topic.addedBy || 'Academic Board'}`}
                  </span>
                  <button
                    onClick={() => handleUseTopic(topic.id)}
                    className="btn btn-primary btn-sm"
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: '#4851BA',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{isArabic ? 'اقتراح هذا الموضوع' : 'Suggest This Topic'}</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
