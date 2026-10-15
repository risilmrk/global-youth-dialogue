import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES } from '../../constants';

export const Topics: React.FC = () => {
  const { isArabic } = useLanguage();
  const [search, setSearch] = useState('');

  const filteredCategories = CATEGORIES.filter((cat) => {
    return (
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.nameAr.includes(search) ||
      cat.description.toLowerCase().includes(search.toLowerCase()) ||
      cat.subTopics.some((st) => st.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="public-section active" id="topics">
      <section className="topics-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{isArabic ? 'المحاور المعرفية الرئيسية' : 'Core Knowledge Spheres'}</span>
            <h2 className="section-title serif-text">{isArabic ? 'محاور النقاش والمواضيع' : 'Topic Categories'}</h2>
            <p className="section-desc">
              {isArabic
                ? 'فضاءات معرفية متعددة التخصصات يناقش فيها المناظرون الشباب العلاقات الدولية والتكنولوجيا والمجتمعات الإنسانية.'
                : 'Multidisciplinary arenas where youth debaters examine international relations, technologies, and human societies.'}
            </p>
          </div>

          {/* Search bar & Suggest Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <input
                type="text"
                className="form-control"
                placeholder={isArabic ? 'بحث في المحاور والموضوعات الفرعية...' : 'Search categories or subtopics...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingInlineStart: '2.25rem' }}
              />
              <span style={{ position: 'absolute', insetInlineStart: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
            </div>

            <Link to="/apply" className="btn btn-outline btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineEnd: '4px' }}>
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"></path>
              </svg>
              <span>{isArabic ? 'اقتراح موضوع جديد' : 'Suggest a New Topic'}</span>
            </Link>
          </div>

          <div className="categories-grid" id="publicCategoriesContainer">
            {filteredCategories.map((cat, idx) => (
              <div key={cat.id} className="category-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="category-header">
                  <div className="category-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      {idx % 4 === 0 && <circle cx="12" cy="12" r="10" />}
                      {idx % 4 === 1 && <rect x="4" y="4" width="16" height="16" rx="2" />}
                      {idx % 4 === 2 && <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />}
                      {idx % 4 === 3 && <path d="M12 2a10 10 0 1 0 10 10H12V2z" />}
                    </svg>
                  </div>
                  <span className="category-pill">{cat.subTopics.length} {isArabic ? 'مسارات' : 'Subtopics'}</span>
                </div>
                <h4>{isArabic ? cat.nameAr : cat.name}</h4>
                <p>{isArabic ? cat.descriptionAr : cat.description}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.75rem 0', flexGrow: 1 }}>
                  {(isArabic ? cat.subTopicsAr : cat.subTopics).slice(0, 3).map((sub, i) => (
                    <span key={i} className="country-pill" style={{ fontSize: '0.7rem' }}>
                      {sub}
                    </span>
                  ))}
                </div>

                <div className="category-footer">
                  <Link to={`/topics/${cat.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span>{isArabic ? 'استكشاف الأوراق والمناظرات' : 'Explore Motions & Papers'}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
