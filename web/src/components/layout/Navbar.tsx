import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { JoinCommunityModal } from '../auth/JoinCommunityModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isArabic, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="site-header" id="siteHeader">
        <div className="container header-inner">
          {/* Brand Logo (Official GYDE Full Logo) */}
          <Link to="/" className="brand-identity" id="brandLogo" aria-label="Global Youth Dialogue & Exchange">
            <img src="/assets/images/gyde_full_logo.png" alt="Global Youth Dialogue & Exchange (GYDE)" className="brand-logo-img logo-light" />
            <img src="/assets/images/gyde_full_logo_dark.png" alt="Global Youth Dialogue & Exchange (GYDE)" className="brand-logo-img logo-dark" />
          </Link>

          {/* Public Navigation */}
          <nav className="main-nav" id="publicNav">
            <Link to="/" className={`nav-link ${isActive('/') && !location.hash ? 'active' : ''}`}>
              {isArabic ? 'الرئيسية' : 'Home'}
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              {isArabic ? 'عن المبادرة' : 'About'}
            </Link>
            <Link to="/topics" className={`nav-link ${isActive('/topics') ? 'active' : ''}`}>
              {isArabic ? 'المواضيع' : 'Topics'}
            </Link>
            <Link to="/sessions" className={`nav-link ${isActive('/sessions') ? 'active' : ''}`}>
              {isArabic ? 'الجلسات' : 'Sessions'}
            </Link>
            <Link to="/publications" className={`nav-link ${isActive('/publications') ? 'active' : ''}`}>
              {isArabic ? 'الأوراق البحثية' : 'Publications'}
            </Link>
            <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`}>
              {isArabic ? 'المجتمع' : 'Our Impact'}
            </Link>
          </nav>

          {/* Header Action Controls */}
          <div className="header-actions">
            {/* Search Button */}
            <button
              className="header-control-btn"
              id="headerSearchBtn"
              title={isArabic ? 'البحث' : 'Search GYDE'}
              onClick={() => navigate('/topics')}
            >
              <span className="svg-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <span className="search-btn-label">{isArabic ? 'بحث' : 'Search'}</span>
            </button>

            {/* Theme Switcher Button */}
            <button
              className="theme-toggle-btn"
              id="themeToggleBtn"
              title={isArabic ? 'تبديل المظهر' : 'Toggle Light / Dark Mode'}
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <span id="themeToggleIcon">
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                )}
              </span>
            </button>

            {/* Language Switcher Button */}
            <button
              className="btn-lang"
              id="langToggleBtn"
              title={isArabic ? 'Switch to English' : 'تغيير اللغة إلى العربية'}
              onClick={toggleLanguage}
            >
              <span className="svg-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </span>
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>

            {/* Dynamic User Status / Action Buttons */}
            <div id="authActionsContainer">
              {isAuthenticated && user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to="/portal" className="btn btn-primary btn-sm">
                    {isArabic ? 'لوحة العضو' : 'Portal'}
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    {isArabic ? 'خروج' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to="/login" className="btn btn-outline btn-sm" id="headerLoginBtn">
                    {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                  </Link>
                  <button
                    onClick={() => setJoinModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    id="headerJoinBtn"
                    style={{ cursor: 'pointer' }}
                  >
                    {isArabic ? 'انضم إلينا' : 'Join Us'}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              className="mobile-menu-btn"
              id="mobileMenuToggleBtn"
              aria-label="Toggle Navigation Menu"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Off-Canvas / Drawer Navigation */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          id="mobileDrawerBackdrop"
          style={{ display: 'block', opacity: 1 }}
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}
      <aside
        className={`mobile-nav-drawer ${mobileDrawerOpen ? 'open' : ''}`}
        id="mobileNavDrawer"
        aria-hidden={!mobileDrawerOpen}
        style={{ transform: mobileDrawerOpen ? 'translateX(0)' : undefined }}
      >
        <div className="mobile-drawer-header">
          <div className="brand-identity">
            <img src="/assets/images/gyde_full_logo.png" alt="GYDE Logo" className="brand-logo-img logo-light" style={{ height: '44px', width: 'auto' }} />
            <img src="/assets/images/gyde_full_logo_dark.png" alt="GYDE Logo" className="brand-logo-img logo-dark" style={{ height: '44px', width: 'auto' }} />
          </div>
          <button
            className="modal-close-btn"
            id="mobileDrawerCloseBtn"
            aria-label="Close Menu"
            onClick={() => setMobileDrawerOpen(false)}
          >
            &times;
          </button>
        </div>
        <div className="mobile-drawer-body">
          <nav className="mobile-drawer-nav">
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'الرئيسية' : 'Home'}
            </Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'عن المبادرة' : 'About'}
            </Link>
            <Link to="/dialogue-cycle" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'دورة الحوار' : 'Process'}
            </Link>
            <Link to="/topics" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'المواضيع' : 'Topics'}
            </Link>
            <Link to="/sessions" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'الجلسات' : 'Sessions'}
            </Link>
            <Link to="/publications" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'الأوراق البحثية' : 'Publications'}
            </Link>
            <Link to="/community" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
              {isArabic ? 'الأثر والمجتمع' : 'Our Impact'}
            </Link>
          </nav>
          <div className="mobile-drawer-actions" id="mobileDrawerActions" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <>
                <Link to="/portal" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={() => setMobileDrawerOpen(false)}>
                  {isArabic ? 'لوحة العضو' : 'Member Portal'}
                </Link>
                <button onClick={() => { handleLogout(); setMobileDrawerOpen(false); }} className="btn btn-outline" style={{ width: '100%' }}>
                  {isArabic ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }} onClick={() => setMobileDrawerOpen(false)}>
                  {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setJoinModalOpen(true);
                  }}
                >
                  {isArabic ? 'انضم إلينا' : 'Join Us'}
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* 3-Step Membership Registration Modal with OTP Verification */}
      <JoinCommunityModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
    </>
  );
};
