import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Navbar } from './Navbar';
import { ApplyPresenterModal } from '../portal/ApplyPresenterModal';

export const PortalLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isArabic, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [presenterModalOpen, setPresenterModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    {
      label: isArabic ? 'لوحة العضو' : 'Member Dashboard',
      path: '/portal',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
      )
    },
    {
      label: isArabic ? 'الجلسات والأرشيف' : 'Sessions',
      path: '/portal/sessions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      )
    },
    {
      label: isArabic ? 'الأوراق البحثية' : 'Academic Writings',
      path: '/portal/publications',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    {
      label: isArabic ? 'تقديم التقييم' : 'Submit Feedback',
      path: '/portal/feedback',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      )
    },
    {
      label: isArabic ? 'بنك المواضيع الأكاديمي' : 'Topic Bank',
      path: '/portal/topic-bank',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    {
      label: isArabic ? 'اقتراح موضوع' : 'Suggest a Topic',
      path: '/portal/suggest-topic',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6"></path>
          <path d="M10 22h4"></path>
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"></path>
        </svg>
      )
    },
    {
      label: isArabic ? 'مسيرتي والأوسمة' : 'My Journey & Badges',
      path: '/portal/journey',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"></circle>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
        </svg>
      )
    },
    {
      label: isArabic ? 'الملف الشخصي' : 'My Profile & Settings',
      path: '/portal/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    }
  ];

  return (
    <div className="portal-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="portal-wrapper">
        {/* Member Sidebar Navigation */}
        <aside className="portal-sidebar">
          {/* User Profile Card in Sidebar */}
          <div className="portal-user-card" id="memberSidebarProfile">
            <div className="portal-user-avatar">
              {user?.name?.slice(0, 1).toUpperCase() || 'M'}
            </div>
            <div className="portal-user-info">
              <div className="portal-user-name">
                {user?.name || 'Member'}
              </div>
              <div className="portal-user-role">
                <span>{user?.role || 'Member'}</span>
                <span>•</span>
                <span>{user?.country || 'Global'}</span>
              </div>
            </div>
          </div>

          <ul className="sidebar-menu">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`sidebar-item-btn ${isActive ? 'active' : ''}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="sidebar-item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}

            {/* Participation Certificate (Soon) */}
            <li>
              <div
                className="sidebar-item-btn"
                style={{
                  opacity: 0.65,
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="sidebar-item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                      <line x1="7" y1="8" x2="17" y2="8"></line>
                      <line x1="7" y1="12" x2="17" y2="12"></line>
                      <line x1="7" y1="16" x2="13" y2="16"></line>
                    </svg>
                  </span>
                  <span style={{ fontSize: '0.88rem' }}>{isArabic ? 'شهادة المشاركة' : 'Participation Certificate'}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '999px',
                    background: '#f1f5f9',
                    color: '#64748b',
                  }}
                >
                  Soon
                </span>
              </div>
            </li>

            {/* Request to be Presenter Button (Triggers ApplyPresenterModal) */}
            <li style={{ marginTop: '0.75rem', padding: '0 0.25rem' }}>
              <button
                type="button"
                onClick={() => setPresenterModalOpen(true)}
                className="btn-be-presenter"
                style={{
                  width: '100%',
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  transition: 'opacity 0.2s',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
                <span>{isArabic ? 'طلب الاعتماد كمتحدث' : 'Request to be Presenter'}</span>
              </button>
            </li>
          </ul>

          {/* Sidebar Controls & Bottom */}
          <div className="sidebar-bottom">
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              id="memberLogoutBtn"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#dc2626',
                border: '1px solid #fee2e2',
                background: '#fff',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>{isArabic ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="portal-content" id="memberContentArea">
          <Outlet />
        </main>
      </div>

      {/* Apply to Become an Official Presenter Modal */}
      <ApplyPresenterModal
        isOpen={presenterModalOpen}
        onClose={() => setPresenterModalOpen(false)}
      />
    </div>
  );
};
