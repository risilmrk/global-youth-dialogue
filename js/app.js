/**
 * GLOBAL YOUTH DIALOGUE - Main Application Controller
 * Handles UI routing, dynamic rendering, role-based portal switching, and user interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize services
  const dataService = window.GYD_DATA;
  const authService = window.GYD_AUTH;
  const i18n = window.GYD_I18N;
  const icons = window.GYD_ICONS || {};

  // Track active subviews
  let currentMemberSubview = 'dashboard';
  let currentCoordSubview = 'dashboard';

  // Ensure favicon immediately updates to the official brand logo
  (function ensureBrandFavicon() {
    try {
      let link = document.querySelector("link[rel='icon'][type='image/svg+xml']");
      if (!link) link = document.querySelector("link[rel~='icon']");
      if (link) link.href = 'assets/images/gyde_favicon.svg?v=3';
    } catch (e) {}
  })();

  // =========================================================================
  // THEME SWITCHER (Light & Dark Mode) - Strict 4 Colors (Light Default)
  // =========================================================================
  function initThemeSwitcher() {
    // Default to 'light' theme when site opens
    const savedTheme = (localStorage.getItem('gyde_theme_v2') === 'set' && localStorage.getItem('gyde_theme')) || 'light';
    applyTheme(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('gyde_theme_v2', 'set');
        applyTheme(newTheme);
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('gyde_theme', theme);
    const icon = document.getElementById('themeToggleIcon');
    if (icon) {
      icon.innerHTML = theme === 'dark' ? (window.icons && window.icons.sun ? window.icons.sun : '') : (window.icons && window.icons.moon ? window.icons.moon : '');
    }
  }

  // =========================================================================
  // LIVE COUNTDOWN TIMER (Scheduled Debate In-Real-Time)
  // =========================================================================
  function initLiveCountdownTimer() {
    const now = new Date().getTime();
    let target = localStorage.getItem('gyde_next_debate_time');
    if (!target || parseInt(target) <= now) {
      target = now + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (28 * 60 * 1000);
      localStorage.setItem('gyde_next_debate_time', target);
    } else {
      target = parseInt(target);
    }

    function updateClock() {
      const current = new Date().getTime();
      let diff = target - current;
      if (diff <= 0) {
        target = current + (7 * 24 * 60 * 60 * 1000);
        localStorage.setItem('gyde_next_debate_time', target);
        diff = target - current;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const dEl = document.getElementById('timerDays');
      const hEl = document.getElementById('timerHours');
      const mEl = document.getElementById('timerMinutes');
      const sEl = document.getElementById('timerSeconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // =========================================================================
  // ANIMATED NUMBER COUNTERS (Metrics Bar Scroll Easing)
  // =========================================================================
  function initAnimatedCounters() {
    const counterGrid = document.getElementById('metricsCounterGrid');
    if (!counterGrid) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateAllCounters();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(counterGrid);

    function animateAllCounters() {
      const counters = [
        { id: 'statNationsNum', target: 14, suffix: '+', bar: 'barNations' },
        { id: 'statDebatersNum', target: 60, suffix: '+', bar: 'barDebaters' },
        { id: 'statSessionsNum', target: 52, suffix: '', bar: 'barSessions' },
        { id: 'statWritingsNum', target: 100, suffix: '%', bar: 'barWritings' }
      ];

      counters.forEach(item => {
        const el = document.getElementById(item.id);
        const bar = document.getElementById(item.bar);
        if (bar) bar.classList.add('active');
        if (!el) return;

        const duration = 1800; // ms
        const startTime = performance.now();

        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * item.target);
          el.textContent = currentVal + (progress === 1 ? item.suffix : '');

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = item.target + item.suffix;
          }
        }
        requestAnimationFrame(step);
      });
    }
  }

  // =========================================================================
  // INTERACTIVE LIVE MOTION POLL
  // =========================================================================
  window.castMotionVote = function(choice) {
    const container = document.getElementById('pollBarContainer');
    const ayeBar = document.getElementById('pollBarAye');
    const nayBar = document.getElementById('pollBarNay');
    const feedback = document.getElementById('pollVoteFeedback');
    const actions = document.getElementById('pollVoteActions');

    if (!container || !ayeBar || !nayBar) return;

    container.style.display = 'flex';
    let ayePct = choice === 'aye' ? 66 : 61;
    let nayPct = 100 - ayePct;

    setTimeout(() => {
      ayeBar.style.width = ayePct + '%';
      ayeBar.textContent = ayePct + '% AYE';
      nayBar.style.width = nayPct + '%';
      nayBar.textContent = nayPct + '% NAY';
    }, 50);

    if (feedback) feedback.style.display = 'block';
    if (actions) {
      actions.style.opacity = '0.7';
      actions.style.pointerEvents = 'none';
    }
    showToast('Your vote was counted in the global delegate consensus!', 'success');
  };

  // Run initial modern enhancements
  initThemeSwitcher();
  initLiveCountdownTimer();
  initAnimatedCounters();

  // =========================================================================
  // TOAST NOTIFICATION UTILITY
  // =========================================================================
  function showToast(message, type = 'normal') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    
    // Explicitly guarantee our brand palette colors (#4851BA -> #9E59AC)
    if (type === 'error') {
      toast.style.background = 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)';
      toast.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      toast.style.boxShadow = '0 10px 25px -4px rgba(153, 27, 27, 0.5)';
    } else {
      toast.style.background = 'linear-gradient(135deg, #4851BA 0%, #9E59AC 100%)';
      toast.style.borderColor = 'rgba(255, 255, 255, 0.35)';
      toast.style.boxShadow = '0 10px 28px -4px rgba(72, 81, 186, 0.55), 0 6px 14px -2px rgba(158, 89, 172, 0.4)';
    }
    toast.style.color = '#FFFFFF';
    toast.style.borderRadius = '999px';
    toast.style.borderWidth = '1px';
    toast.style.borderStyle = 'solid';

    toast.innerHTML = `
      <span class="svg-icon">${type === 'success' ? icons.check : type === 'error' ? icons.x : icons.sparkle}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // =========================================================================
  // MODAL & OVERLAY CONTROLLERS (WITH BROWSER BACK BUTTON SUPPORT)
  // =========================================================================
  let modalHistoryStack = [];
  let drawerHistoryActive = false;
  let isNavigatingBack = false;

  function openModal(modalId, pushHistory = true) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      modal.offsetHeight; // force reflow
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (pushHistory && !modalHistoryStack.includes(modalId)) {
        modalHistoryStack.push(modalId);
        try {
          history.pushState({ type: 'modal', modalId: modalId }, '', window.location.href);
        } catch (e) {}
      }
    }
  }

  function closeModal(modalId, triggerHistoryBack = true) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        if (!modal.classList.contains('active')) {
          modal.style.display = 'none';
        }
      }, 250);
      document.body.style.overflow = '';

      const idx = modalHistoryStack.lastIndexOf(modalId);
      if (idx !== -1) {
        modalHistoryStack.splice(idx, 1);
        if (triggerHistoryBack && !isNavigatingBack && history.state && history.state.type === 'modal' && history.state.modalId === modalId) {
          try {
            history.back();
          } catch (e) {}
        }
      }
    }
  }

  function closeAllActiveModals(triggerHistoryBack = false) {
    document.querySelectorAll('.modal-backdrop.active, .modal-backdrop[style*="display: flex"]').forEach(modal => {
      closeModal(modal.id, triggerHistoryBack);
    });
    modalHistoryStack = [];
  }

  window.openModal = openModal;
  window.closeModal = closeModal;
  window.closeAllActiveModals = closeAllActiveModals;

  // Modal event listeners
  document.getElementById('headerLoginBtn')?.addEventListener('click', () => openModal('authModal'));
  document.getElementById('headerJoinBtn')?.addEventListener('click', () => openUnifiedApplyModal());
  document.getElementById('heroJoinBtn')?.addEventListener('click', () => openUnifiedApplyModal());
  document.getElementById('bannerLoginBtn')?.addEventListener('click', () => openModal('authModal'));
  document.getElementById('bannerApplyBtn')?.addEventListener('click', () => openUnifiedApplyModal());
  document.getElementById('footerApplyLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openUnifiedApplyModal();
  });
  document.getElementById('authToApplyLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openUnifiedApplyModal();
  });

  document.getElementById('authModalClose')?.addEventListener('click', () => closeModal('authModal'));

  // =========================================================================
  // PUBLIC MOBILE QUICK SHEET & EXPANDABLE ROLE SIGN-IN (Phone View Only)
  // =========================================================================
  function closePublicQuickSheet() {
    const sheet = document.getElementById('publicQuickSheet');
    const overlay = document.getElementById('publicSheetOverlay');
    if (sheet) sheet.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  function openPublicQuickSheet(autoExpandSignIn = false) {
    const sheet = document.getElementById('publicQuickSheet');
    const overlay = document.getElementById('publicSheetOverlay');
    const expandWrap = document.getElementById('sheetSignInExpandable');
    const trigger = document.getElementById('sheetSignInToggleBtn');
    if (overlay) overlay.classList.add('open');
    if (sheet) sheet.classList.add('open');
    if (autoExpandSignIn && expandWrap) {
      expandWrap.classList.add('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }
    updateMobileSheetControlsUI();
  }

  function updateMobileSheetControlsUI() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const themeText = document.getElementById('sheetThemeText');
    const themeIcon = document.getElementById('sheetThemeIcon');
    if (themeText) {
      themeText.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
    if (themeIcon) {
      themeIcon.innerHTML = currentTheme === 'dark'
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
    }

    const currentLang = (window.i18n && typeof window.i18n.getLang === 'function') ? window.i18n.getLang() : 'en';
    const langText = document.getElementById('sheetLangText');
    if (langText) {
      langText.textContent = currentLang === 'ar' ? 'English' : 'العربية';
    }
  }

  // Floating Action Button (+) opens quick sheet
  document.getElementById('publicMobileFabBtn')?.addEventListener('click', () => {
    const sheet = document.getElementById('publicQuickSheet');
    if (sheet && sheet.classList.contains('open')) {
      closePublicQuickSheet();
    } else {
      openPublicQuickSheet(false);
    }
  });

  // Bottom Tab Bar "Sign In" button opens quick sheet with roles pre-expanded
  document.getElementById('publicMobileLoginBtn')?.addEventListener('click', () => {
    openPublicQuickSheet(true);
  });

  // Backdrop click closes sheet
  document.getElementById('publicSheetOverlay')?.addEventListener('click', closePublicQuickSheet);

  // Apply button inside sheet
  document.getElementById('sheetApplyBtn')?.addEventListener('click', () => {
    closePublicQuickSheet();
    openUnifiedApplyModal();
  });

  // Expandable "Sign In" button toggles roles tray
  document.getElementById('sheetSignInToggleBtn')?.addEventListener('click', () => {
    const wrap = document.getElementById('sheetSignInExpandable');
    const trigger = document.getElementById('sheetSignInToggleBtn');
    if (wrap) {
      const isOpen = wrap.classList.toggle('open');
      if (trigger) trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  });

  // Role selections: Member, Presenter, Admin
  document.getElementById('sheetRoleMemberBtn')?.addEventListener('click', () => {
    closePublicQuickSheet();
    if (typeof window.selectSignInRole === 'function') {
      window.selectSignInRole('member');
    }
    openModal('authModal');
  });

  document.getElementById('sheetRolePresenterBtn')?.addEventListener('click', () => {
    closePublicQuickSheet();
    if (typeof window.selectSignInRole === 'function') {
      window.selectSignInRole('presenter');
    }
    openModal('authModal');
  });

  document.getElementById('sheetRoleAdminBtn')?.addEventListener('click', () => {
    closePublicQuickSheet();
    if (typeof window.selectSignInRole === 'function') {
      window.selectSignInRole('admin');
    }
    openModal('authModal');
  });

  // Theme switch in mobile sheet
  document.getElementById('sheetThemeToggleBtn')?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('gyde_theme_v2', 'set');
    if (typeof applyTheme === 'function') {
      applyTheme(newTheme);
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('gyde_theme', newTheme);
    }
    updateMobileSheetControlsUI();
  });

  // Language switch in mobile sheet
  document.getElementById('sheetLangToggleBtn')?.addEventListener('click', () => {
    if (window.i18n && typeof window.i18n.getLang === 'function') {
      const nextLang = window.i18n.getLang() === 'en' ? 'ar' : 'en';
      window.i18n.setLang(nextLang);
      if (typeof renderAll === 'function') renderAll();
    }
    updateMobileSheetControlsUI();
  });
  document.getElementById('applyModalClose')?.addEventListener('click', () => closeModal('applyModal'));
  document.getElementById('sessionDetailClose')?.addEventListener('click', () => closeModal('sessionDetailModal'));
  document.getElementById('writingReaderClose')?.addEventListener('click', () => closeModal('writingReaderModal'));
  document.getElementById('searchModalClose')?.addEventListener('click', () => closeModal('globalSearchModal'));
  document.getElementById('notificationsModalClose')?.addEventListener('click', () => closeModal('notificationsModal'));
  document.getElementById('newChapterModalClose')?.addEventListener('click', () => closeModal('newChapterModal'));
  document.getElementById('newMediaKitModalClose')?.addEventListener('click', () => closeModal('newMediaKitModal'));

  // Switch between Login and Apply modal
  document.getElementById('switchApplyModalBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('authModal', false);
    openUnifiedApplyModal();
  });

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Close modals and drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalHistoryStack.length > 0) {
        closeModal(modalHistoryStack[modalHistoryStack.length - 1]);
      } else {
        const activeModals = document.querySelectorAll('.modal-backdrop.active');
        if (activeModals.length > 0) {
          activeModals.forEach(m => closeModal(m.id));
        } else if (drawerHistoryActive) {
          closeMobileDrawer();
        }
      }
    }
  });

  // =========================================================================
  // MOBILE NAVIGATION DRAWER CONTROLLER
  // =========================================================================
  function openMobileDrawer(pushHistory = true) {
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    if (drawer && backdrop) {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (pushHistory) {
        drawerHistoryActive = true;
        try {
          history.pushState({ type: 'drawer' }, '', window.location.href);
        } catch (e) {}
      }
    }
  }

  function closeMobileDrawer(triggerHistoryBack = true) {
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    if (drawer && backdrop) {
      const wasActive = drawer.classList.contains('active');
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (wasActive && drawerHistoryActive) {
        drawerHistoryActive = false;
        if (triggerHistoryBack && !isNavigatingBack && history.state && history.state.type === 'drawer') {
          try {
            history.back();
          } catch (e) {}
        }
      } else {
        drawerHistoryActive = false;
      }
    }
  }

  // Mobile drawer triggers
  document.getElementById('mobileMenuToggleBtn')?.addEventListener('click', () => openMobileDrawer(true));
  document.getElementById('mobileDrawerCloseBtn')?.addEventListener('click', () => closeMobileDrawer(true));
  document.getElementById('mobileDrawerBackdrop')?.addEventListener('click', () => closeMobileDrawer(true));

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer(false);
    });
  });

  // =========================================================================
  // LANGUAGE & RTL TOGGLE
  // =========================================================================
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = i18n.getLang() === 'en' ? 'ar' : 'en';
      i18n.setLang(nextLang);
      renderAll();
    });
  }

  // =========================================================================
  // AUTHENTICATION & PORTAL SWITCHING
  // =========================================================================
  let activePortal = 'public';

  function updateAuthHeaderUI() {
    const user = authService.getCurrentUser();
    const container = document.getElementById('authActionsContainer');
    const publicNav = document.getElementById('publicNav');
    const isAr = i18n.isRTL();

    if (!container) return;

    if (user) {
      const isCoord = user.role === 'Coordinator';
      const isOnPublic = activePortal === 'public';
      const homeText = isAr ? 'الرئيسية' : 'Home';
      const isPres = user && (user.role === 'Presenter' || user.role === 'Speaker');
      const portalTarget = isCoord ? 'coordinator' : (isPres ? 'presenter' : 'member');
      const portalText = isCoord 
        ? (isAr ? 'بوابة المنسقين' : 'Coordinator Portal') 
        : (isPres ? (isAr ? 'بوابة المتحدثين' : 'Presenter Portal') : (isAr ? 'بوابة الأعضاء' : 'Member Portal'));
      const logoutText = isAr ? 'تسجيل الخروج' : 'Sign Out';

      container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: nowrap;">
          ${!isOnPublic ? `
            <button class="btn btn-subtle btn-sm" id="headerPublicViewBtn" title="${homeText}">
              ${homeText}
            </button>
          ` : `
            <button class="btn ${isCoord ? 'btn-navy' : 'btn-primary'} btn-sm" id="headerPortalSwitchBtn">
              ${portalText}
            </button>
          `}
          <button class="btn btn-outline btn-sm" id="headerLogoutBtn" title="${logoutText}">${logoutText}</button>
        </div>
      `;

      document.getElementById('headerPublicViewBtn')?.addEventListener('click', () => {
        navigateToPortal('public');
      });

      document.getElementById('headerPortalSwitchBtn')?.addEventListener('click', () => {
        navigateToPortal(portalTarget);
      });

      document.getElementById('headerLogoutBtn')?.addEventListener('click', () => {
        authService.logout();
        navigateToPortal('public');
        showToast(isAr ? 'تم تسجيل الخروج بنجاح.' : 'You have signed out successfully.');
      });

      if (publicNav) publicNav.style.display = (activePortal === 'public') ? 'flex' : 'none';

      // Update mobile drawer actions for logged in user
      const drawerActions = document.getElementById('mobileDrawerActions');
      if (drawerActions) {
        drawerActions.innerHTML = `
          ${!isOnPublic ? `
            <button class="btn btn-subtle" id="drawerHomeBtn" style="width: 100%;">
              ${homeText}
            </button>
          ` : `
            <button class="btn ${isCoord ? 'btn-navy' : 'btn-primary'}" id="drawerPortalBtn" style="width: 100%;">
              ${portalText}
            </button>
          `}
          <button class="btn btn-outline" id="drawerLogoutBtn" style="width: 100%;">${logoutText}</button>
        `;
        document.getElementById('drawerHomeBtn')?.addEventListener('click', () => {
          closeMobileDrawer();
          navigateToPortal('public');
        });
        document.getElementById('drawerPortalBtn')?.addEventListener('click', () => {
          closeMobileDrawer();
          navigateToPortal(portalTarget);
        });
        document.getElementById('drawerLogoutBtn')?.addEventListener('click', () => {
          closeMobileDrawer();
          authService.logout();
          navigateToPortal('public');
          showToast(isAr ? 'تم تسجيل الخروج بنجاح.' : 'You have signed out successfully.');
        });
      }
    } else {
      const homeBtnText = isAr ? 'الرئيسية →' : '← Home';
      const loginText = isAr ? 'تسجيل الدخول' : 'Sign In';
      const joinText = isAr ? 'انضم إلينا' : 'Join Us';

      // Update mobile drawer actions for public / guest user
      const drawerActions = document.getElementById('mobileDrawerActions');
      if (drawerActions) {
        drawerActions.innerHTML = `
          <button class="btn btn-outline" id="mobileDrawerLoginBtn" style="width: 100%;">${loginText}</button>
          <button class="btn btn-primary" id="mobileDrawerJoinBtn" style="width: 100%;">${isAr ? 'تقديم طلب عضوية' : 'Apply for Membership'}</button>
        `;
        document.getElementById('mobileDrawerLoginBtn')?.addEventListener('click', (e) => {
          e.preventDefault();
          closeMobileDrawer(false);
          navigateToPortal('signin');
        });
        document.getElementById('mobileDrawerJoinBtn')?.addEventListener('click', (e) => {
          e.preventDefault();
          closeMobileDrawer(false);
          openUnifiedApplyModal();
        });
      }

      if (activePortal === 'signin') {
        container.innerHTML = `
          <button class="btn btn-subtle btn-sm" id="headerBackToPublicBtn">${homeBtnText}</button>
          <button class="btn btn-primary btn-sm" id="headerJoinBtn">${joinText}</button>
        `;
        document.getElementById('headerBackToPublicBtn')?.addEventListener('click', () => navigateToPortal('public'));
        document.getElementById('headerJoinBtn')?.addEventListener('click', () => openUnifiedApplyModal());
        if (publicNav) publicNav.style.display = 'flex';
      } else {
        container.innerHTML = `
          <button class="btn btn-outline btn-sm" id="headerLoginBtn">${loginText}</button>
          <button class="btn btn-primary btn-sm" id="headerJoinBtn">${joinText}</button>
        `;

        document.getElementById('headerLoginBtn')?.addEventListener('click', () => navigateToPortal('signin'));
        document.getElementById('headerJoinBtn')?.addEventListener('click', () => openUnifiedApplyModal());
        if (publicNav) publicNav.style.display = 'flex';
      }
    }

    // In-App Notification Bell visibility:
    // Only available in authenticated Member, Presenter, and Admin dashboards; hidden from public view
    const notifBtn = document.getElementById('headerNotifBtn');
    if (notifBtn) {
      if (user && activePortal !== 'public' && activePortal !== 'signin') {
        notifBtn.style.display = 'inline-flex';
      } else {
        notifBtn.style.display = 'none';
      }
    }

    renderMobileNavDrawer();
  }

  function renderMobileNavDrawer() {
    const nav = document.querySelector('#mobileNavDrawer .mobile-drawer-nav');
    if (!nav) return;
    const isAr = i18n.isRTL();
    const user = authService.getCurrentUser();

    if (activePortal === 'coordinator' && user) {
      nav.innerHTML = `
        <a href="#" class="mobile-nav-link" data-coord-nav="dashboard">${icons.sparkle || ''} ${isAr ? 'لوحة القيادة' : 'Dashboard Overview'}</a>
        <a href="#" class="mobile-nav-link" data-coord-nav="topic-bank">${icons.book || ''} ${isAr ? 'بنك المواضيع' : 'Academic Topic Bank'}</a>
        <a href="#" class="mobile-nav-link" data-coord-nav="sessions">${icons.calendar || ''} ${isAr ? 'جلسات الحوار' : 'Debate Sessions'}</a>
        <a href="#" class="mobile-nav-link" data-coord-nav="topics">${icons.lightbulb || ''} ${isAr ? 'مقترحات المواضيع' : 'Topic Proposals'}</a>
        <a href="#" class="mobile-nav-link" data-coord-nav="writings">${icons.scroll || ''} ${isAr ? 'الأوراق الأكاديمية' : 'Academic Writings'}</a>
        <a href="#" class="mobile-nav-link" data-coord-nav="feedback">${icons.messageSquare || ''} ${isAr ? 'تقييمات الأعضاء' : 'Member Feedback'}</a>
        <a href="#" class="mobile-nav-link" data-coord-nav="applications">${icons.users || ''} ${isAr ? 'طلبات العضوية' : 'Membership Applicants'}</a>
        <a href="#" class="mobile-nav-link" data-coord-nav="team">${icons.award || ''} ${isAr ? 'فريق المنسقين' : 'Coordinator Team'}</a>
        <a href="#" class="mobile-nav-link" data-coord-nav="profile">${icons.shield || ''} ${isAr ? 'الإعدادات والملف' : 'Settings & Admin Profile'}</a>
        <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid var(--border-light);">
        <a href="#" class="mobile-nav-link" data-nav-action="public">${icons.globe || ''} ${isAr ? 'الموقع العام' : 'Public Site Landing'}</a>
      `;
    } else if (activePortal === 'presenter' && user) {
      nav.innerHTML = `
        <a href="#" class="mobile-nav-link" data-presenter-nav="dashboard">${icons.sparkle || ''} ${isAr ? 'لوحة المتحدث' : 'Presenter Dashboard'}</a>
        <a href="#" class="mobile-nav-link" data-presenter-nav="present">${icons.mic || ''} ${isAr ? 'تقديم موضوع' : 'Present a Topic'}</a>
        <a href="#" class="mobile-nav-link" data-presenter-nav="decks">${icons.award || ''} ${isAr ? 'عروض الأبحاث' : 'Slide Decks & Briefings'}</a>
        <a href="#" class="mobile-nav-link" data-presenter-nav="topic-bank">${icons.book || ''} ${isAr ? 'بنك المواضيع' : 'Topic Bank'}</a>
        <a href="#" class="mobile-nav-link" data-presenter-nav="sessions">${icons.calendar || ''} ${isAr ? 'جلسات التحدث' : 'Speaking Sessions'}</a>
        <a href="#" class="mobile-nav-link" data-presenter-nav="writings">${icons.scroll || ''} ${isAr ? 'أوراق البحث' : 'Research Briefings'}</a>
        <a href="#" class="mobile-nav-link" data-presenter-nav="profile">${icons.user || ''} ${isAr ? 'ملف المتحدث' : 'Presenter Profile'}</a>
        <a href="#" class="mobile-nav-link cert-drawer-disabled" data-presenter-nav="certificate">${icons.fileText || ''} ${isAr ? 'شهادة المتحدث' : 'Keynote Certificate'} <span class="cert-soon-badge" style="margin-inline-start: auto;">Soon</span></a>
        <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid var(--border-light);">
        <a href="#" class="mobile-nav-link" data-nav-action="member">${icons.users || ''} ${isAr ? 'المشاركة كعضو' : 'Participate as Member'}</a>
        <a href="#" class="mobile-nav-link" data-nav-action="public">${icons.globe || ''} ${isAr ? 'الموقع العام' : 'Public Site Landing'}</a>
      `;
    } else if (activePortal === 'member' && user) {
      nav.innerHTML = `
        <a href="#" class="mobile-nav-link" data-member-nav="dashboard">${icons.sparkle || ''} ${isAr ? 'لوحة العضو' : 'Member Dashboard'}</a>
        <a href="#" class="mobile-nav-link" data-member-nav="sessions">${icons.calendar || ''} ${isAr ? 'جلسات الحوار' : 'Dialogue Sessions'}</a>
        <a href="#" class="mobile-nav-link" data-member-nav="topic-bank">${icons.book || ''} ${isAr ? 'بنك المواضيع' : 'Academic Topic Bank'}</a>
        <a href="#" class="mobile-nav-link" data-member-nav="topics">${icons.lightbulb || ''} ${isAr ? 'اقتراح موضوع' : 'Propose a Topic'}</a>
        <a href="#" class="mobile-nav-link" data-member-nav="calendar">${icons.calendar || ''} ${isAr ? 'التقويم العالمي' : 'Interactive Calendar'}</a>
        <a href="#" class="mobile-nav-link" data-member-nav="writings">${icons.scroll || ''} ${isAr ? 'أوراقي الأكاديمية' : 'My Academic Papers'}</a>
        <a href="#" class="mobile-nav-link" data-member-nav="feedback">${icons.messageSquare || ''} ${isAr ? 'تقييمات الغرفة' : 'Chamber Peer Review'}</a>
        <a href="#" class="mobile-nav-link" data-member-nav="journey">${icons.award || ''} ${isAr ? 'شارات التميز' : 'Debate Journey & Badges'}</a>
        <a href="#" class="mobile-nav-link cert-drawer-disabled" data-member-nav="certificate">${icons.fileText || ''} ${isAr ? 'الشهادة الرسمية' : 'Official Certificate'} <span class="cert-soon-badge" style="margin-inline-start: auto;">Soon</span></a>
        <a href="#" class="mobile-nav-link" data-member-nav="profile">${icons.user || ''} ${isAr ? 'الملف الشخصي' : 'Profile Settings'}</a>
        <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid var(--border-light);">
        <a href="#" class="mobile-nav-link" data-nav-action="public">${icons.globe || ''} ${isAr ? 'الموقع العام' : 'Public Site Landing'}</a>
      `;
    } else {
      nav.innerHTML = `
        <a href="#home" class="mobile-nav-link">${isAr ? 'الرئيسية' : 'Home'}</a>
        <a href="#about" class="mobile-nav-link">${isAr ? 'عن المبادرة' : 'About'}</a>
        <a href="#process" class="mobile-nav-link">${isAr ? 'كيف يعمل' : 'Process'}</a>
        <a href="#topics" class="mobile-nav-link">${isAr ? 'المواضيع' : 'Topics'}</a>
        <a href="#sessions" class="mobile-nav-link">${isAr ? 'الجلسات' : 'Sessions'}</a>
        <a href="#impact" class="mobile-nav-link">${isAr ? 'أثرنا' : 'Our Impact'}</a>
      `;
    }

    // Attach click handlers to drawer items
    nav.querySelectorAll('[data-coord-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-coord-nav');
        closeMobileDrawer();
        if (typeof switchCoordSubview === 'function') switchCoordSubview(target);
      });
    });

    nav.querySelectorAll('[data-presenter-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-presenter-nav');
        closeMobileDrawer();
        if (target === 'certificate') {
          showToast('Keynote & Presentation Certificates are temporarily disabled and will be enabled soon.', 'warning');
          return;
        }
        if (typeof switchPresenterSubview === 'function') switchPresenterSubview(target);
      });
    });

    nav.querySelectorAll('[data-member-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-member-nav');
        closeMobileDrawer();
        if (target === 'certificate') {
          showToast('Official Participation Certificates are temporarily disabled and will be enabled soon.', 'warning');
          return;
        }
        if (typeof switchMemberSubview === 'function') switchMemberSubview(target);
      });
    });

    nav.querySelectorAll('[data-nav-action="member"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileDrawer();
        navigateToPortal('member');
      });
    });

    nav.querySelectorAll('[data-nav-action="public"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileDrawer();
        navigateToPortal('public');
      });
    });

    nav.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const hash = (link.getAttribute('href') || '').replace(/^#/, '');
        closeMobileDrawer(false);
        if (activePortal !== 'public') {
          navigateToPortal('public', false);
        }
        if (typeof switchPublicSection === 'function') {
          switchPublicSection(hash || 'home', true);
        }
      });
    });
  }

  function navigateToPortal(portalName, pushHistory = true) {
    const viewPublic = document.getElementById('viewPublic');
    const viewMember = document.getElementById('viewMember');
    const viewCoordinator = document.getElementById('viewCoordinator');
    const viewSignIn = document.getElementById('viewSignIn');
    const viewPresenter = document.getElementById('viewPresenter');

    // Close any open modals and drawer when navigating between portals
    if (typeof closeAllActiveModals === 'function') closeAllActiveModals(false);
    if (typeof closeMobileDrawer === 'function') closeMobileDrawer(false);

    // Hide all
    if (viewPublic) viewPublic.style.display = 'none';
    if (viewMember) viewMember.style.display = 'none';
    if (viewPresenter) viewPresenter.style.display = 'none';
    if (viewCoordinator) viewCoordinator.style.display = 'none';
    if (viewSignIn) viewSignIn.style.display = 'none';

    activePortal = portalName;
    let targetHash = portalName;

    if (portalName === 'coordinator') {
      if (!authService.isCoordinator()) {
        showToast('Access Denied: Admin / Coordinator clearance required. Please sign in.', 'error');
        navigateToPortal('signin', pushHistory);
        return;
      }
      if (viewCoordinator) viewCoordinator.style.display = 'block';
      renderCoordinatorPortal();
      window.scrollTo(0, 0);
    } else if (portalName === 'presenter') {
      if (!authService.isLoggedIn()) {
        showToast('Presenter access required. Please sign in.', 'error');
        navigateToPortal('signin', pushHistory);
        return;
      }
      if (!authService.isPresenter() && !authService.isCoordinator()) {
        showToast('Access Denied: Your account has Member privileges only. Restricted from Presenter area.', 'error');
        navigateToPortal('member', pushHistory);
        return;
      }
      if (viewPresenter) viewPresenter.style.display = 'block';
      renderPresenterPortal();
      window.scrollTo(0, 0);
    } else if (portalName === 'member') {
      if (!authService.isLoggedIn()) {
        showToast('Member access required. Please sign in.', 'error');
        navigateToPortal('signin', pushHistory);
        return;
      }
      if (viewMember) viewMember.style.display = 'block';
      renderMemberPortal();
      window.scrollTo(0, 0);
    } else if (portalName === 'signin') {
      const user = authService.getCurrentUser();
      if (user) {
        if (user.role === 'Coordinator') {
          navigateToPortal('coordinator', pushHistory);
        } else if (user.role === 'Presenter' || user.role === 'Speaker') {
          navigateToPortal('presenter', pushHistory);
        } else {
          navigateToPortal('member', pushHistory);
        }
        return;
      }
      if (viewSignIn) viewSignIn.style.display = 'block';
      window.scrollTo(0, 0);
      setTimeout(() => checkApprovedVisitorRedirect(), 180);
    } else {
      activePortal = 'public';
      targetHash = currentPublicSection || 'home';
      if (viewPublic) viewPublic.style.display = 'block';
      renderPublicPage();
      window.scrollTo(0, 0);
    }

    // Push browser history so back button returns to previous page instead of closing web app
    if (pushHistory && !isNavigatingBack) {
      const currentHash = (window.location.hash || '').replace(/^#/, '');
      if (currentHash !== targetHash) {
        try {
          history.pushState({ type: 'portal', portal: activePortal, section: currentPublicSection }, '', `#${targetHash}`);
        } catch (e) {
          window.location.hash = `#${targetHash}`;
        }
      }
    }

    updateAuthHeaderUI();
  }
  window.navigateToPortal = navigateToPortal;

  // Logo click returns to appropriate view
  document.getElementById('brandLogo')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (authService.isCoordinator()) {
      navigateToPortal('coordinator');
    } else if (authService.isLoggedIn()) {
      navigateToPortal('member');
    } else {
      navigateToPortal('public');
      switchPublicSection('home');
      try { history.pushState(null, '', '#home'); } catch (err) {}
    }
  });

  // Footer portal links
  document.getElementById('footerPublicPreviewLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToPortal('public');
  });

  document.getElementById('footerSignInLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    const user = authService.getCurrentUser();
    if (user) {
      navigateToPortal(user.role === 'Coordinator' ? 'coordinator' : 'member');
    } else {
      navigateToPortal('signin');
    }
  });

  // Unified Sign In Form Handler with Strict Role & Portal Gatekeeping
  document.getElementById('unifiedLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('unifiedEmail').value.trim();
    const password = document.getElementById('unifiedPassword').value.trim();
    const selectedPortal = document.getElementById('unifiedRoleInput')?.value || 'member';
    const errEl = document.getElementById('signinErrorMsg');
    if (errEl) errEl.style.display = 'none';

    let result = authService.loginWithRole(email, password, selectedPortal);

    // If not successful locally, query cloud applications in real-time (UNLESS user was removed)
    const isEmailDeleted = (function() {
      const cleanInput = (email || '').toLowerCase().trim();
      if (cleanInput === '3681mubashircp@gmail.com') return false;
      try {
        const dList = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
        if (Array.isArray(dList) && dList.includes(cleanInput)) return true;
      } catch (e) {}
      if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.deletedUserEmails)) {
        if (window.GYD_DATA.db.deletedUserEmails.includes(cleanInput)) return true;
      }
      return false;
    })();

    if (!result.success) {
      try {
        const apiUrl = (window.GYD_DATA && typeof window.GYD_DATA.getApplicationsApiUrl === 'function')
          ? window.GYD_DATA.getApplicationsApiUrl()
          : '/api/applications';
        const res = await fetch(apiUrl);
        if (res.ok) {
          const remoteApps = await res.json();
          const cleanInput = email.toLowerCase().trim();
          const match = Array.isArray(remoteApps) && remoteApps.find(a => a.email && a.email.toLowerCase().trim() === cleanInput && a.type !== 'presenter' && !String(a.id || '').startsWith('papp_'));
          const presMatch = Array.isArray(remoteApps) && remoteApps.find(a => a.email && a.email.toLowerCase().trim() === cleanInput && (a.type === 'presenter' || String(a.id || '').startsWith('papp_')));

          if (presMatch && window.GYD_DATA && window.GYD_DATA.db) {
            if (!Array.isArray(window.GYD_DATA.db.presenterApplications)) window.GYD_DATA.db.presenterApplications = [];
            const pIdx = window.GYD_DATA.db.presenterApplications.findIndex(p => p.id === presMatch.id || (p.email && p.email.toLowerCase().trim() === cleanInput));
            if (pIdx >= 0) window.GYD_DATA.db.presenterApplications[pIdx] = { ...window.GYD_DATA.db.presenterApplications[pIdx], ...presMatch };
            else window.GYD_DATA.db.presenterApplications.unshift(presMatch);
          }

          if (match && match.status !== 'Deleted' && (match.status === 'Approved' || match.status === 'Approved - Awaiting Registration' || match.status === 'Registered')) {
            // Un-tombstone if previously deleted
            if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.deletedUserEmails)) {
              window.GYD_DATA.db.deletedUserEmails = window.GYD_DATA.db.deletedUserEmails.filter(e => e !== cleanInput);
            }
            try {
              let localDeleted = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
              if (Array.isArray(localDeleted)) {
                localDeleted = localDeleted.filter(e => e !== cleanInput);
                localStorage.setItem('gyd_deleted_community_emails', JSON.stringify(localDeleted));
              }
            } catch (e) {}

            if (window.GYD_DATA && window.GYD_DATA.db) {
              if (!Array.isArray(window.GYD_DATA.db.applications)) window.GYD_DATA.db.applications = [];
              const idx = window.GYD_DATA.db.applications.findIndex(a => a.email && a.email.toLowerCase().trim() === cleanInput);
              const adoptedPassword = (match.password && match.password.trim() && match.password.trim() !== 'gyde2024') 
                ? match.password.trim() 
                : password;
              const isPresRole = (
                match.role === 'Presenter' || 
                match.isApprovedPresenter === true || 
                (presMatch && presMatch.status === 'Approved')
              );
              const syncedMatch = { 
                ...match, 
                password: adoptedPassword,
                role: isPresRole ? 'Presenter' : (match.role || 'Member'),
                isApprovedPresenter: isPresRole
              };

              if (idx >= 0) window.GYD_DATA.db.applications[idx] = { ...window.GYD_DATA.db.applications[idx], ...syncedMatch };
              else window.GYD_DATA.db.applications.unshift(syncedMatch);

              if (typeof window.GYD_DATA.syncCommunityUsers === 'function') window.GYD_DATA.syncCommunityUsers();
              window.GYD_DATA.saveDatabase();

              // Sync password to cloud
              if (adoptedPassword && adoptedPassword === password) {
                fetch(apiUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'updatePassword', email: cleanInput, password: adoptedPassword })
                }).catch(() => {});
              }
            }
            result = authService.loginWithRole(email, password, selectedPortal);
          } else if (match && match.status === 'Pending') {
            result = { success: false, message: 'Your application is currently pending coordinator review. You can sign in once approved.' };
          }
        }
      } catch (err) {}
    }

    if (result.success) {
      const dest = result.portal || selectedPortal;
      if (dest === 'admin' || dest === 'coordinator') {
        navigateToPortal('coordinator');
        showToast(`Welcome back, ${result.user.name}! Opened Admin Workspace.`, 'success');
      } else if (dest === 'presenter') {
        navigateToPortal('presenter');
        showToast(`Welcome back, ${result.user.name}! Opened Presenter Portal.`, 'success');
      } else {
        navigateToPortal('member');
        showToast(`Welcome back, ${result.user.name}! Opened Member Dashboard.`, 'success');
      }
    } else {
      if (errEl) {
        errEl.innerHTML = `
          <div style="font-weight: 600; line-height: 1.4;">${result.message}</div>
          ${result.requiredRole ? `
            <div style="margin-top: 0.6rem;">
              <button type="button" class="btn btn-sm btn-primary" onclick="window.selectSignInRole('${result.requiredRole}')" style="padding: 0.3rem 0.75rem; font-size: 0.8rem; font-weight: 700; border-radius: var(--radius-sm); cursor: pointer;">
                Switch to ${result.requiredRole.charAt(0).toUpperCase() + result.requiredRole.slice(1)} Tab &rarr;
              </button>
            </div>
          ` : ''}
        `;
        errEl.style.display = 'block';
      }
      showToast(result.message, 'error');
    }
  });

  // 1-Click Role Testing & Global Login Helpers
  window.signInDemoCoordinator = function() {
    let res = authService.login('3681mubashircp@gmail.com', '368136');
    if (res && res.success && res.user) {
      closeModal('authModal');
      navigateToPortal('coordinator');
      showToast(`Signed in as Administrator: ${res.user.name} (3681mubashircp@gmail.com) → Opened Admin Workspace!`, 'success');
      return;
    }
    showToast('Could not sign in as Administrator. Please check credentials.', 'error');
  };

  window.signInDemoPresenter = function() {
    showToast('Demo presenter credentials are disabled for official launch. Please sign in with your registered credentials.', 'warning');
  };

  window.signInDemoMember = function() {
    showToast('Demo member credentials are disabled for official launch. Please apply for membership.', 'warning');
  };

  function syncTrialDeletionUI() {
    const isTrialDeleted = (function() {
      try { return localStorage.getItem('gyd_trial_data_deleted') === 'true'; } catch (e) { return false; }
    })();

    const adminBtn1 = document.getElementById('demoRoleAdminBtn');
    const adminBtn2 = document.getElementById('demoCoordBtn');
    const memberBtn1 = document.getElementById('demoRoleMemberBtn');
    const memberBtn2 = document.getElementById('demoMemberBtn');
    const presBtn1 = document.getElementById('demoRolePresenterBtn');
    const presBtn2 = document.getElementById('demoPresenterBtn');

    if (isTrialDeleted) {
      if (adminBtn1) {
        const span = adminBtn1.querySelector('span:last-child');
        if (span) span.textContent = 'Mubashir CP (Admin) → Workspace';
      }
      if (adminBtn2) {
        const span = adminBtn2.querySelector('[data-i18n="demoRoleAdmin"]') || adminBtn2.querySelector('span:last-child');
        if (span) span.textContent = 'Admin (Mubashir CP)';
      }
      [memberBtn1, memberBtn2, presBtn1, presBtn2].forEach(btn => {
        if (btn) {
          btn.style.opacity = '0.55';
          btn.title = 'Demo profile deleted by Administrator';
        }
      });
    } else {
      [memberBtn1, memberBtn2, presBtn1, presBtn2].forEach(btn => {
        if (btn) {
          btn.style.opacity = '1';
          btn.removeAttribute('title');
        }
      });
    }
  }
  window.syncTrialDeletionUI = syncTrialDeletionUI;

  // Event listeners for page demo buttons
  document.getElementById('demoRoleMemberBtn')?.addEventListener('click', () => window.signInDemoMember());
  document.getElementById('demoRolePresenterBtn')?.addEventListener('click', () => window.signInDemoPresenter());
  document.getElementById('demoRoleAdminBtn')?.addEventListener('click', () => window.signInDemoCoordinator());

  // Event listeners for modal demo buttons
  document.getElementById('demoCoordBtn')?.addEventListener('click', () => window.signInDemoCoordinator());
  document.getElementById('demoPresenterBtn')?.addEventListener('click', () => window.signInDemoPresenter());
  document.getElementById('demoMemberBtn')?.addEventListener('click', () => window.signInDemoMember());

  // Navigation Links on Unified Sign In Portal (In-Page Back to Home)
  const handleAuthBackNav = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateToPortal('public');
    }
  };

  document.getElementById('authToPublicLink')?.addEventListener('click', handleAuthBackNav);
  document.getElementById('authTopBackBtn')?.addEventListener('click', handleAuthBackNav);

  document.getElementById('authToApplyLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('applyModal');
  });

  document.getElementById('authToSignUpLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleApprovedApplicantClick();
  });

  document.getElementById('modalToSignUpLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('authModal');
    handleApprovedApplicantClick();
  });

  document.getElementById('goToSignUpBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleApprovedApplicantClick();
  });

  // -------------------------------------------------------------------------
  // 3-BUTTON SEGMENTED ROLE TAB SWITCHER (Member | Presenter | Admin)
  // -------------------------------------------------------------------------
  document.querySelectorAll('.role-segmented-switcher').forEach(switcher => {
    switcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.role-segmented-tab');
      if (!btn) return;
      switcher.querySelectorAll('.role-segmented-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const role = btn.getAttribute('data-role');
      const hiddenInput = switcher.parentElement.querySelector('input[type="hidden"]');
      if (hiddenInput) hiddenInput.value = role;

      const errAlert = document.getElementById('authErrorAlert');
      if (errAlert) errAlert.style.display = 'none';
      const pageErr = document.getElementById('signinErrorMsg');
      if (pageErr) pageErr.style.display = 'none';
    });
  });

  window.selectSignInRole = function(role) {
    document.querySelectorAll('.role-segmented-switcher').forEach(switcher => {
      const btn = switcher.querySelector(`.role-segmented-tab[data-role="${role}"]`);
      if (btn) {
        switcher.querySelectorAll('.role-segmented-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      }
    });
    const hiddenInputs = document.querySelectorAll('#unifiedRoleInput, #modalPortalRoleInput');
    hiddenInputs.forEach(input => { input.value = role; });
    const errAlert = document.getElementById('authErrorAlert');
    if (errAlert) errAlert.style.display = 'none';
    const pageErr = document.getElementById('signinErrorMsg');
    if (pageErr) pageErr.style.display = 'none';
  };

  // Modal Login Form Handler with Strict Role & Portal Gatekeeping
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const selectedPortal = document.getElementById('modalPortalRoleInput')?.value ||
                           document.querySelector('input[name="authPortalRole"]:checked')?.value ||
                           'member';
    const errAlert = document.getElementById('authErrorAlert');

    if (errAlert) errAlert.style.display = 'none';

    let result = authService.loginWithRole(email, password, selectedPortal);

    // If not successful locally, query cloud applications in real-time (UNLESS user was removed)
    const isEmailDeleted = (function() {
      const cleanInput = (email || '').toLowerCase().trim();
      if (cleanInput === '3681mubashircp@gmail.com') return false;
      try {
        const dList = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
        if (Array.isArray(dList) && dList.includes(cleanInput)) return true;
      } catch (e) {}
      if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.deletedUserEmails)) {
        if (window.GYD_DATA.db.deletedUserEmails.includes(cleanInput)) return true;
      }
      return false;
    })();

    if (!result.success) {
      try {
        const apiUrl = (window.GYD_DATA && typeof window.GYD_DATA.getApplicationsApiUrl === 'function')
          ? window.GYD_DATA.getApplicationsApiUrl()
          : '/api/applications';
        const res = await fetch(apiUrl);
        if (res.ok) {
          const remoteApps = await res.json();
          const cleanInput = email.toLowerCase().trim();
          const match = Array.isArray(remoteApps) && remoteApps.find(a => a.email && a.email.toLowerCase().trim() === cleanInput && a.type !== 'presenter' && !String(a.id || '').startsWith('papp_'));
          const presMatch = Array.isArray(remoteApps) && remoteApps.find(a => a.email && a.email.toLowerCase().trim() === cleanInput && (a.type === 'presenter' || String(a.id || '').startsWith('papp_')));

          if (presMatch && window.GYD_DATA && window.GYD_DATA.db) {
            if (!Array.isArray(window.GYD_DATA.db.presenterApplications)) window.GYD_DATA.db.presenterApplications = [];
            const pIdx = window.GYD_DATA.db.presenterApplications.findIndex(p => p.id === presMatch.id || (p.email && p.email.toLowerCase().trim() === cleanInput));
            if (pIdx >= 0) window.GYD_DATA.db.presenterApplications[pIdx] = { ...window.GYD_DATA.db.presenterApplications[pIdx], ...presMatch };
            else window.GYD_DATA.db.presenterApplications.unshift(presMatch);
          }

          if (match && match.status !== 'Deleted' && (match.status === 'Approved' || match.status === 'Approved - Awaiting Registration' || match.status === 'Registered')) {
            // Un-tombstone if previously deleted
            if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.deletedUserEmails)) {
              window.GYD_DATA.db.deletedUserEmails = window.GYD_DATA.db.deletedUserEmails.filter(e => e !== cleanInput);
            }
            try {
              let localDeleted = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
              if (Array.isArray(localDeleted)) {
                localDeleted = localDeleted.filter(e => e !== cleanInput);
                localStorage.setItem('gyd_deleted_community_emails', JSON.stringify(localDeleted));
              }
            } catch (e) {}

            if (window.GYD_DATA && window.GYD_DATA.db) {
              if (!Array.isArray(window.GYD_DATA.db.applications)) window.GYD_DATA.db.applications = [];
              const idx = window.GYD_DATA.db.applications.findIndex(a => a.email && a.email.toLowerCase().trim() === cleanInput);
              const adoptedPassword = (match.password && match.password.trim() && match.password.trim() !== 'gyde2024') 
                ? match.password.trim() 
                : password;
              const isPresRole = (
                match.role === 'Presenter' || 
                match.isApprovedPresenter === true || 
                (presMatch && presMatch.status === 'Approved')
              );
              const syncedMatch = { 
                ...match, 
                password: adoptedPassword,
                role: isPresRole ? 'Presenter' : (match.role || 'Member'),
                isApprovedPresenter: isPresRole
              };

              if (idx >= 0) window.GYD_DATA.db.applications[idx] = { ...window.GYD_DATA.db.applications[idx], ...syncedMatch };
              else window.GYD_DATA.db.applications.unshift(syncedMatch);

              if (typeof window.GYD_DATA.syncCommunityUsers === 'function') window.GYD_DATA.syncCommunityUsers();
              window.GYD_DATA.saveDatabase();

              // Sync password to cloud
              if (adoptedPassword && adoptedPassword === password) {
                fetch(apiUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'updatePassword', email: cleanInput, password: adoptedPassword })
                }).catch(() => {});
              }
            }
            result = authService.loginWithRole(email, password, selectedPortal);
          } else if (match && match.status === 'Pending') {
            result = { success: false, message: 'Your application is currently pending coordinator review. You can sign in once approved.' };
          }
        }
      } catch (err) {}
    }

    if (result.success) {
      closeModal('authModal');
      const dest = result.portal || selectedPortal;
      if (dest === 'admin' || dest === 'coordinator') {
        navigateToPortal('coordinator');
        showToast(`Welcome back, ${result.user.name}! Opened Admin Workspace.`, 'success');
      } else if (dest === 'presenter') {
        navigateToPortal('presenter');
        showToast(`Welcome back, ${result.user.name}! Opened Presenter Portal.`, 'success');
      } else {
        navigateToPortal('member');
        showToast(`Welcome back, ${result.user.name}! Opened Member Dashboard.`, 'success');
      }
    } else {
      if (errAlert) {
        errAlert.innerHTML = `
          <div style="font-weight: 600; line-height: 1.4;">${result.message}</div>
          ${result.requiredRole ? `
            <div style="margin-top: 0.6rem;">
              <button type="button" class="btn btn-sm btn-primary" onclick="window.selectSignInRole('${result.requiredRole}')" style="padding: 0.3rem 0.75rem; font-size: 0.8rem; font-weight: 700; border-radius: var(--radius-sm); cursor: pointer;">
                Switch to ${result.requiredRole.charAt(0).toUpperCase() + result.requiredRole.slice(1)} Tab &rarr;
              </button>
            </div>
          ` : ''}
        `;
        errAlert.style.display = 'block';
      }
      showToast(result.message, 'error');
    }
  });

  // -------------------------------------------------------------------------
  // UNIFIED REGISTRATION FLOW: "Apply for Community Membership"
  // Step 1: Basic Information (First Name, Last Name, Country, Email, Set Password, Confirm Password)
  // Step 2: Additional Details (Areas of intellectual interest, Debate background, Why join GYD)
  // Step 3: OTP Verification (Retrieves OTP from email and verifies on website)
  // Admin Approval: Proposal placed on hold awaiting manual Admin approval.
  // -------------------------------------------------------------------------
  let unifiedApplyData = {
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    password: '',
    interests: [],
    debateExperience: '',
    motivation: ''
  };

  window.toggleApplyPw = function(id) {
    const input = document.getElementById(id);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  };

  function setApplyStepper(stepNumber) {
    const circle1 = document.getElementById('applyStepCircle1');
    const circle2 = document.getElementById('applyStepCircle2');
    const circle3 = document.getElementById('applyStepCircle3');
    const label1 = document.getElementById('applyStepLabel1');
    const label2 = document.getElementById('applyStepLabel2');
    const label3 = document.getElementById('applyStepLabel3');
    const progressLine = document.getElementById('applyProgressLine');

    const circles = [circle1, circle2, circle3];
    const labels = [label1, label2, label3];

    circles.forEach((c, idx) => {
      if (!c) return;
      const num = idx + 1;
      if (num < stepNumber) {
        c.style.background = 'var(--brand-green, #047857)';
        c.style.color = '#fff';
        c.style.borderColor = 'var(--brand-green, #047857)';
        c.style.boxShadow = 'none';
        c.innerHTML = '✓';
      } else if (num === stepNumber) {
        c.style.background = 'var(--color-primary-1, #4851ba)';
        c.style.color = '#fff';
        c.style.borderColor = 'var(--color-primary-1, #4851ba)';
        c.style.boxShadow = '0 0 0 4px rgba(72, 81, 186, 0.18)';
        c.innerHTML = String(num);
      } else {
        c.style.background = 'var(--bg-surface, #fff)';
        c.style.color = 'var(--text-muted)';
        c.style.border = '2px solid var(--border-light, #cbd5e1)';
        c.style.boxShadow = 'none';
        c.innerHTML = String(num);
      }
    });

    labels.forEach((l, idx) => {
      if (!l) return;
      const num = idx + 1;
      l.style.fontWeight = num === stepNumber ? '700' : '600';
      l.style.color = num === stepNumber ? 'var(--text-main)' : 'var(--text-muted)';
    });

    if (progressLine) {
      if (stepNumber === 1) progressLine.style.width = '0%';
      else if (stepNumber === 2) progressLine.style.width = '50%';
      else if (stepNumber === 3) progressLine.style.width = '100%';
    }
  }

  function openUnifiedApplyModal() {
    closeModal('authModal');
    const stepper = document.getElementById('applyStepper');
    const step1 = document.getElementById('applyStep1Container');
    const step2 = document.getElementById('applyStep2Container');
    const step3 = document.getElementById('applyStep3Container');
    const step4 = document.getElementById('applyStep4SuccessContainer');
    const subtitle = document.getElementById('applyModalSubtitle');

    if (stepper) stepper.style.display = 'flex';
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';
    if (step3) step3.style.display = 'none';
    if (step4) step4.style.display = 'none';
    if (subtitle) subtitle.textContent = 'Complete your application in 3 steps to join our international network of young debaters.';

    setApplyStepper(1);

    // Reset error alerts
    const err1 = document.getElementById('applyStep1Error');
    const err2 = document.getElementById('applyStep2Error');
    const err3 = document.getElementById('applyStep3Error');
    if (err1) err1.style.display = 'none';
    if (err2) err2.style.display = 'none';
    if (err3) err3.style.display = 'none';

    openModal('applyModal');
  }

  window.openUnifiedApplyModal = openUnifiedApplyModal;
  window.openSignupModal = openUnifiedApplyModal;
  window.checkApprovedVisitorRedirect = function() {};
  window.checkApprovedApplicantNotice = function() {};
  window.handleApprovedApplicantClick = openUnifiedApplyModal;

  // Step 1 Submission: Basic Information
  document.getElementById('applyStep1Form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = (document.getElementById('applyFirstName')?.value || '').trim();
    const lastName = (document.getElementById('applyLastName')?.value || '').trim();
    const country = (document.getElementById('applyCountry')?.value || '').trim();
    const email = (document.getElementById('applyEmail')?.value || '').trim().toLowerCase();
    const password = document.getElementById('applyPassword')?.value || '';
    const confirmPassword = document.getElementById('applyConfirmPassword')?.value || '';
    const errorAlert = document.getElementById('applyStep1Error');

    const showError = (msg) => {
      if (errorAlert) {
        errorAlert.textContent = msg;
        errorAlert.style.display = 'block';
      }
      showToast(msg, 'error');
    };

    if (!firstName || !lastName || !country || !email || !password || !confirmPassword) {
      showError('Please fill out all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    // Check if user is already registered in users list
    const users = dataService ? (dataService.getUsers() || []) : [];
    if (users.some(u => u.email && u.email.toLowerCase().trim() === email)) {
      showError('An active member account with this email already exists. Please sign in instead.');
      return;
    }

    // Check if application is already approved
    const apps = dataService ? (dataService.getApplications() || []) : [];
    const existingApp = apps.find(a => a.email && a.email.toLowerCase().trim() === email);
    if (existingApp && (existingApp.status === 'Approved' || existingApp.status === 'Approved - Awaiting Registration')) {
      showError('Your membership application is already approved! Please sign in with your email and password.');
      return;
    }

    if (errorAlert) errorAlert.style.display = 'none';

    unifiedApplyData.firstName = firstName;
    unifiedApplyData.lastName = lastName;
    unifiedApplyData.country = country;
    unifiedApplyData.email = email;
    unifiedApplyData.password = password;

    // Transition to Step 2
    document.getElementById('applyStep1Container').style.display = 'none';
    document.getElementById('applyStep2Container').style.display = 'block';
    setApplyStepper(2);
  });

  // Step 2: Back Button
  document.getElementById('applyStep2BackBtn')?.addEventListener('click', () => {
    document.getElementById('applyStep2Container').style.display = 'none';
    document.getElementById('applyStep1Container').style.display = 'block';
    setApplyStepper(1);
  });

  // Step 2 Submission: Additional Details
  document.getElementById('applyStep2Form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorAlert = document.getElementById('applyStep2Error');
    const debateExp = (document.getElementById('applyDebateExp')?.value || '').trim();
    const motivation = (document.getElementById('applyMotivation')?.value || '').trim();
    const customInterests = (document.getElementById('applyInterestsCustom')?.value || '').trim();

    const checkedBoxes = document.querySelectorAll('#applyInterestsGrid input:checked');
    let interests = Array.from(checkedBoxes).map(cb => cb.value);
    if (customInterests) {
      interests.push(customInterests);
    }
    if (interests.length === 0) {
      interests = ['Global Affairs'];
    }

    const showError = (msg) => {
      if (errorAlert) {
        errorAlert.textContent = msg;
        errorAlert.style.display = 'block';
      }
      showToast(msg, 'error');
    };

    if (!debateExp) {
      showError('Please outline your debate and public speaking background.');
      return;
    }

    if (!motivation) {
      showError('Please share why you want to join Global Youth Dialogue.');
      return;
    }

    if (errorAlert) errorAlert.style.display = 'none';

    unifiedApplyData.interests = interests;
    unifiedApplyData.debateExperience = debateExp;
    unifiedApplyData.motivation = motivation;

    // Generate secure 6-digit OTP
    const code = authService.generateOTP(unifiedApplyData.email);
    const recipientEl = document.getElementById('applyOtpRecipientEmail');
    const inputEl = document.getElementById('applyOtpInput');

    if (recipientEl) recipientEl.textContent = unifiedApplyData.email;
    if (inputEl) inputEl.value = '';

    // Switch to Step 3
    document.getElementById('applyStep2Container').style.display = 'none';
    document.getElementById('applyStep3Container').style.display = 'block';
    setApplyStepper(3);
    if (inputEl) inputEl.focus();

    // Dispatch verification OTP email
    const fullName = `${unifiedApplyData.firstName} ${unifiedApplyData.lastName}`.trim() || 'Applicant';
    authService.sendOTPEmail(unifiedApplyData.email, code, fullName).then((res) => {
      if (res && res.sent) {
        showToast(`Verification code delivered to ${unifiedApplyData.email}! Check inbox or Spam.`, 'success');
      } else {
        showToast(`Verification code dispatched to ${unifiedApplyData.email}. Check inbox or Spam.`, 'normal');
      }
    });
  });

  // Step 3: Back Button
  document.getElementById('applyStep3BackBtn')?.addEventListener('click', () => {
    document.getElementById('applyStep3Container').style.display = 'none';
    document.getElementById('applyStep2Container').style.display = 'block';
    setApplyStepper(2);
  });

  // Step 3: Resend Code
  document.getElementById('applyStep3ResendBtn')?.addEventListener('click', () => {
    if (!unifiedApplyData || !unifiedApplyData.email) return;
    const code = authService.generateOTP(unifiedApplyData.email);
    const fullName = `${unifiedApplyData.firstName} ${unifiedApplyData.lastName}`.trim() || 'Applicant';
    const inputEl = document.getElementById('applyOtpInput');
    if (inputEl) inputEl.value = '';

    authService.sendOTPEmail(unifiedApplyData.email, code, fullName).then((res) => {
      if (res && res.sent) {
        showToast(`New verification code delivered to ${unifiedApplyData.email}! Check inbox or spam.`, 'success');
      } else {
        showToast(`New code generated and sent to ${unifiedApplyData.email}. Check inbox or Spam.`, 'normal');
      }
    });
  });

  // Step 3: Verify OTP and Place Application on Hold (Awaiting Admin Approval)
  document.getElementById('applyStep3Form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredCode = (document.getElementById('applyOtpInput')?.value || '').trim();
    const errorAlert = document.getElementById('applyStep3Error');
    if (errorAlert) errorAlert.style.display = 'none';

    const verifyRes = authService.verifyOTP(unifiedApplyData.email, enteredCode);
    if (!verifyRes.valid) {
      if (errorAlert) {
        errorAlert.textContent = verifyRes.message || 'Invalid verification code.';
        errorAlert.style.display = 'block';
      }
      showToast(verifyRes.message || 'Invalid verification code.', 'error');
      return;
    }

    // Construct application proposal
    const fullName = `${unifiedApplyData.firstName} ${unifiedApplyData.lastName}`.trim();
    const appProposal = {
      name: fullName,
      firstName: unifiedApplyData.firstName,
      lastName: unifiedApplyData.lastName,
      email: unifiedApplyData.email,
      password: unifiedApplyData.password,
      country: unifiedApplyData.country,
      flag: 'INT',
      interests: unifiedApplyData.interests,
      debateExperience: unifiedApplyData.debateExperience,
      motivation: unifiedApplyData.motivation,
      status: 'Pending', // Acts as proposal placed on hold awaiting manual Admin approval!
      emailVerified: true
    };

    // Submit to dataService (which saves locally and syncs to backend API)
    dataService.submitApplication(appProposal);

    // Transition to Step 4: Success / Placed On Hold confirmation
    document.getElementById('applyStep3Container').style.display = 'none';
    const stepper = document.getElementById('applyStepper');
    if (stepper) stepper.style.display = 'none';

    const nameEl = document.getElementById('applySuccessApplicantName');
    const emailEl = document.getElementById('applySuccessApplicantEmail');
    if (nameEl) nameEl.textContent = fullName;
    if (emailEl) emailEl.textContent = unifiedApplyData.email;

    const step4 = document.getElementById('applyStep4SuccessContainer');
    if (step4) step4.style.display = 'block';

    const subtitle = document.getElementById('applyModalSubtitle');
    if (subtitle) subtitle.textContent = 'Email verified. Application submitted for Secretariat review.';

    showToast('Application verified and submitted! Awaiting Admin approval.', 'success');
  });

  // Step 4: Action Buttons
  document.getElementById('applySuccessDoneBtn')?.addEventListener('click', () => {
    closeModal('applyModal');
  });

  document.getElementById('applySuccessToSignInBtn')?.addEventListener('click', () => {
    closeModal('applyModal');
    setTimeout(() => {
      openModal('authModal');
    }, 200);
  });

  // Link in Step 1: "Already have an account? Sign In"
  document.getElementById('applyToSignInLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('applyModal');
    setTimeout(() => {
      openModal('authModal');
    }, 200);
  });

  // =========================================================================
  // PUBLIC SECTION BAR SWITCHER & NAVIGATION
  // =========================================================================
  let currentPublicSection = 'home';

  function switchPublicSection(sectionId, pushHistory = true) {
    const rawId = (sectionId || 'home').replace(/^#/, '');
    const isProcess = (rawId === 'process');
    const validSections = ['home', 'about', 'topics', 'sessions', 'impact'];
    const targetId = isProcess ? 'about' : (validSections.includes(rawId) ? rawId : 'home');
    currentPublicSection = targetId;

    if (activePortal !== 'public') {
      navigateToPortal('public', false);
    }

    // Toggle active classes and inline display on public section panels
    const sections = document.querySelectorAll('#viewPublic .public-section');
    sections.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.add('active');
        sec.style.display = 'block';
      } else {
        sec.classList.remove('active');
        sec.style.display = 'none';
      }
    });

    // Update active nav link indicators
    document.querySelectorAll('#publicNav .nav-link, #mobileNavDrawer .mobile-nav-link, .site-footer a[href^="#"], #publicMobileTabBar .public-tab-btn').forEach(link => {
      const href = link.getAttribute('href');
      const dataNav = link.getAttribute('data-public-nav');
      if (href === `#${rawId}` || dataNav === rawId || (isProcess && (href === '#process' || dataNav === 'process'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    closeMobileDrawer(false);

    // Scroll window smoothly to target
    if (isProcess) {
      setTimeout(() => {
        const procEl = document.getElementById('process');
        if (procEl) {
          procEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update URL hash cleanly and push browser history
    const currentHash = (window.location.hash || '').replace(/^#/, '');
    const hashToSet = isProcess ? 'process' : targetId;
    if (currentHash !== hashToSet) {
      try {
        if (pushHistory && !isNavigatingBack) {
          history.pushState({ type: 'section', portal: 'public', section: hashToSet }, '', `#${hashToSet}`);
        } else {
          history.replaceState({ type: 'section', portal: 'public', section: hashToSet }, '', `#${hashToSet}`);
        }
      } catch (e) {
        window.location.hash = `#${hashToSet}`;
      }
    }
    // If landing on home section on mobile, center the 2nd box so Box 1 is half-visible on left and Box 3 on right
    if (targetId === 'home') {
      setTimeout(() => centerHomeHighlightsCards(false), 80);
    }
  }

  function centerHomeHighlightsCards(smooth = false) {
    if (window.innerWidth > 768) return;
    const grid = document.querySelector('.home-highlights-grid');
    if (!grid) return;
    const children = Array.from(grid.children).filter(el => 
      el.classList.contains('highlight-feature-card') || el.classList.contains('highlight-sunburst-card-wrap')
    );
    if (children.length >= 2) {
      const card2 = children[1];
      const targetScroll = card2.offsetLeft - (grid.clientWidth - card2.clientWidth) / 2;
      grid.scrollTo({
        left: targetScroll,
        behavior: smooth ? 'smooth' : 'instant'
      });
    }
  }

  // Expose to window for global access
  window.switchPublicSection = switchPublicSection;
  window.centerHomeHighlightsCards = centerHomeHighlightsCards;

  window.addEventListener('resize', () => {
    if (currentPublicSection === 'home') {
      centerHomeHighlightsCards(false);
    }
  });

  // Delegated click listener on document for guaranteed event handling
  document.addEventListener('click', (e) => {
    const navLink = e.target.closest('#publicNav .nav-link, #mobileNavDrawer .mobile-nav-link, .site-footer a[href^="#"], [data-public-nav]');
    if (!navLink) return;

    const dataNav = navLink.getAttribute('data-public-nav');
    if (dataNav) {
      e.preventDefault();
      closeMobileDrawer(false);
      switchPublicSection(dataNav);
      return;
    }

    const href = navLink.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = href.replace(/^#/, '');
      const valid = ['home', 'about', 'process', 'topics', 'sessions', 'impact'];
      if (valid.includes(target)) {
        e.preventDefault();
        closeMobileDrawer(false);
        switchPublicSection(target);
      }
    }
  });

  // Hero CTA Buttons
  document.getElementById('heroExploreBtn')?.addEventListener('click', () => {
    switchPublicSection('about');
  });

  document.getElementById('heroSessionsBtn')?.addEventListener('click', () => {
    const upcomingEl = document.querySelector('.home-upcoming-section');
    if (upcomingEl) {
      upcomingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      switchPublicSection('sessions');
    }
  });

  // =========================================================================
  // VIEW: PUBLIC PAGE RENDERING
  // =========================================================================
  function renderPublicPage() {
    renderHomeUpcomingSessions();
    renderPublicCategories();
    renderPublicSessionsPreview();

    // Activate appropriate public section based on current hash
    const hash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    const valid = ['home', 'about', 'topics', 'sessions', 'impact'];
    if (valid.includes(hash)) {
      switchPublicSection(hash);
    } else {
      switchPublicSection(currentPublicSection || 'home');
    }
  }

  function renderHomeUpcomingSessions() {
    const container = document.getElementById('homeUpcomingSessionsContainer');
    if (!container) return;

    const allSessions = dataService.getSessions();
    const upcomingSessions = allSessions.filter(s => s.status === 'Upcoming');
    const mainSession = upcomingSessions[0] || allSessions[allSessions.length - 1];
    if (!mainSession) return;

    const isAr = i18n.isRTL();
    const user = authService.getCurrentUser();
    const isMember = !!user;

    const sesNumText = isAr 
      ? `الجلسة رقم ${mainSession.sessionNumber.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])}` 
      : `Session ${mainSession.sessionNumber.toString().padStart(2, '0')}`;
    const categoryName = isAr ? (mainSession.categoryNameAr || mainSession.categoryName) : mainSession.categoryName;
    const titleText = isAr ? (mainSession.titleAr || mainSession.title) : mainSession.title;
    const descText = isAr ? (mainSession.descriptionAr || mainSession.description) : mainSession.description;
    const formatText = isAr ? (mainSession.formatAr || mainSession.format) : mainSession.format;
    const durationText = isAr ? (mainSession.durationAr || mainSession.duration) : mainSession.duration;
    
    const statusText = isAr ? 'جلسة مباشرة مجدولة' : 'Upcoming Live Dialogue';

    const speakers = mainSession.speakers || [];
    const moderator = mainSession.moderator;
    const sesCategory = mainSession.sessionCategory || 'Topic Presentation';

    let catBadgeHtml = '';
    let categoryFeatureHtml = '';

    if (sesCategory === 'Guest Talk') {
      catBadgeHtml = `<span class="badge-session-cat badge-cat-guest">${icons.award || ""} ${isAr ? 'حوار ضيف شرف' : 'Guest Talk'}</span>`;
      if (mainSession.guestName) {
        categoryFeatureHtml = `
          <div class="home-guest-banner">
            <img src="${mainSession.guestPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}" alt="${mainSession.guestName}" class="home-guest-photo">
            <div class="home-guest-info">
              <span class="home-guest-badge">${icons.award || ""} ${isAr ? 'ضيف الشرف الدولي' : 'Distinguished Guest Speaker'}</span>
              <h4 class="home-guest-name">${mainSession.guestName}</h4>
              <p class="home-guest-bio">"${mainSession.guestBio || ''}"</p>
            </div>
          </div>
        `;
      }
    } else if (sesCategory === 'Debate') {
      catBadgeHtml = `<span class="badge-session-cat badge-cat-deb">${icons.scale || ""} ${isAr ? 'مناظرة رسمية' : 'Formal Debate'}</span>`;
      if (mainSession.debateMotion || mainSession.propositionTeam) {
        categoryFeatureHtml = `
          <div class="home-debate-banner">
            <div class="home-team-tag" style="color: #9E59AC; font-size: 0.78rem;">${icons.scale || ""} ${isAr ? 'قضية المناظرة الرسمية' : 'Parliamentary Debate Motion'}</div>
            <div style="font-size: 1.15rem; font-style: italic; color: #FFFFFF; margin: 0.25rem 0 0.75rem 0; font-family: var(--font-serif);">
              "${mainSession.debateMotion || mainSession.title}"
            </div>
            <div class="home-debate-matchup">
              <div class="home-debate-team-card">
                <div class="home-team-tag prop">${isAr ? 'فريق الموالاة (الحكومة)' : 'Proposition / Affirmative'}</div>
                <div class="home-team-names">${mainSession.propositionTeam || 'Delegation Speakers'}</div>
              </div>
              <div class="home-debate-team-card">
                <div class="home-team-tag opp">${isAr ? 'فريق المعارضة' : 'Opposition / Negative'}</div>
                <div class="home-team-names">${mainSession.oppositionTeam || 'Delegation Speakers'}</div>
              </div>
            </div>
            ${mainSession.adjudicator ? `
              <div style="margin-top: 0.75rem; font-size: 0.82rem; color: rgba(255,255,255,0.75);">
                <strong>${isAr ? 'رئيس هيئة التحكيم:' : 'Presiding Adjudicator:'}</strong> ${mainSession.adjudicator.name} (${getCountryLocalized(mainSession.adjudicator.country)})
              </div>
            ` : ''}
          </div>
        `;
      }
    } else if (sesCategory === 'Diplomatic Roundtable') {
      catBadgeHtml = `<span class="badge-session-cat badge-cat-round">${icons.landmark || ""} ${isAr ? 'طاولة مستديرة' : 'Diplomatic Roundtable'}</span>`;
      categoryFeatureHtml = `
        <div class="home-debate-banner" style="border-inline-start: 4px solid #4851BA;">
          <div class="home-team-tag" style="color: #4851BA; font-size: 0.78rem;">${icons.landmark || ''} ${isAr ? 'مسودة القرار المطروحة للتفاوض' : 'Working Draft Resolution'}</div>
          <div style="font-size: 1.15rem; font-style: italic; color: #FFFFFF; margin: 0.25rem 0 0.5rem 0; font-family: var(--font-serif);">
            "${mainSession.workingDraftTitle || 'Draft Resolution on Multilateral Consensus'}"
          </div>
          ${mainSession.roundtableFocus ? `<div style="font-size: 0.88rem; color: rgba(255,255,255,0.85); line-height: 1.5; font-style: italic;">${mainSession.roundtableFocus}</div>` : ''}
          ${mainSession.roundtableChair ? `
            <div style="margin-top: 0.65rem; font-size: 0.82rem; color: rgba(255,255,255,0.75);">
              <strong>${isAr ? 'رئاسة الجلسة المستديرة:' : 'Roundtable Chair:'}</strong> ${mainSession.roundtableChair.name} (${getCountryLocalized(mainSession.roundtableChair.country)})
            </div>
          ` : ''}
        </div>
      `;
    } else if (sesCategory === 'Discussions') {
      catBadgeHtml = `<span class="badge-session-cat badge-cat-disc">${icons.messageSquare || ""} ${isAr ? 'حلقة نقاشية' : 'Discussions'}</span>`;
      if (mainSession.discussionQuestions) {
        categoryFeatureHtml = `
          <div class="home-session-motion-box" style="border-inline-start-color: #9E59AC;">
            <div class="home-motion-tag" style="color: #9E59AC;">${icons.messageSquare || ""} ${isAr ? 'محاور ونقاط النقاش المفتوح' : 'Core Discussion Inquiries'}</div>
            <div style="font-size: 0.95rem; color: #f8fafc; line-height: 1.6;">
              ${mainSession.discussionQuestions}
            </div>
          </div>
        `;
      }
    } else {
      catBadgeHtml = `<span class="badge-session-cat badge-cat-pres">${icons.mic || ""} ${isAr ? 'عرض بحثي' : 'Topic Presentation'}</span>`;
    }

    const moderatorLabel = isAr ? 'إدارة الجلسة:' : 'Session Moderator:';
    const speakersLabel = isAr ? 'المتحدثون الرئيسيون:' : 'Lead Speakers:';
    const accessNotice = isAr ? 'حضور الجلسة المباشرة والأوراق الأكاديمية مخصص لأعضاء المجتمع' : 'Live room access and session briefings are members-only';

    const actionButtons = isMember ? `
      <button class="btn btn-accent btn-md" id="homeSessionPortalBtn">
        ${icons.video} ${isAr ? 'الدخول إلى بوابة الجلسات' : 'Go to Sessions Portal'} →
      </button>
      <button class="btn btn-outline btn-md" id="homeSessionViewAllBtn" data-public-nav="sessions" style="color: #fff; border-color: rgba(255,255,255,0.45);">
        ${icons.calendar} ${isAr ? 'عرض جميع الجلسات' : 'View All Sessions'}
      </button>
    ` : `
      <button class="btn btn-accent btn-md" id="homeSessionJoinBtn">
        ${icons.lock} ${isAr ? 'تسجيل الدخول للانضمام للجلسة' : 'Sign In to Join Room'}
      </button>
      <button class="btn btn-outline btn-md" id="homeSessionApplyBtn" style="color: #fff; border-color: rgba(255,255,255,0.45);">
        ${icons.user} ${isAr ? 'تقديم طلب عضوية' : 'Apply for Membership'}
      </button>
      <button class="btn btn-subtle btn-md" id="homeSessionViewAllBtn" data-public-nav="sessions" style="color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);">
        ${icons.calendar} ${isAr ? 'أرشيف الجلسات' : 'Browse Archive'}
      </button>
    `;

    container.innerHTML = `
      <div class="home-session-spotlight">
        <div class="home-session-glow-accent"></div>
        <div class="home-session-card-inner">
          <div class="home-session-top-bar">
            <div class="home-session-sphere-badge">
              <span class="home-session-live-pulse"></span>
              <span class="home-session-badge-num">${sesNumText}</span>
              <span class="home-session-badge-sep">•</span>
              <span class="home-session-badge-cat">${categoryName}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              ${catBadgeHtml}
              <div class="home-session-status-tag">
                ${icons.video}
                <span>${statusText}</span>
              </div>
            </div>
          </div>

          <h3 class="home-session-main-title serif-text">${titleText}</h3>
          <p class="home-session-description">${descText}</p>
          ${categoryFeatureHtml}

          <div class="home-session-details-grid">
            <div class="home-session-detail-item">
              <div class="home-detail-icon">${icons.calendar}</div>
              <div class="home-detail-content">
                <span class="home-detail-label">${isAr ? 'التاريخ' : 'Date'}</span>
                <span class="home-detail-val">${mainSession.date}</span>
              </div>
            </div>
            <div class="home-session-detail-item">
              <div class="home-detail-icon">${icons.clock}</div>
              <div class="home-detail-content">
                <span class="home-detail-label">${isAr ? 'التوقيت' : 'Time & Zone'}</span>
                <span class="home-detail-val">${mainSession.time} ${mainSession.timezone}</span>
              </div>
            </div>
            <div class="home-session-detail-item">
              <div class="home-detail-icon">${icons.mic}</div>
              <div class="home-detail-content">
                <span class="home-detail-label">${isAr ? 'الشكل والمدة' : 'Format & Length'}</span>
                <span class="home-detail-val">${formatText} (${durationText})</span>
              </div>
            </div>
          </div>

          <!-- Speakers and Moderator Row -->
          <div class="home-session-participants-row">
            ${moderator ? `
              <div class="home-participant-col">
                <span class="home-part-label">${moderatorLabel}</span>
                <div class="home-part-chip">
                  <span class="home-part-flag">${icons.getFlag(moderator.country, moderator.flag)}</span>
                  <span class="home-part-name">${moderator.name}</span>
                  <span class="home-part-country">(${getCountryLocalized(moderator.country)})</span>
                </div>
              </div>
            ` : ''}

            ${speakers.length ? `
              <div class="home-participant-col">
                <span class="home-part-label">${speakersLabel}</span>
                <div class="home-speakers-chips">
                  ${speakers.map(sp => `
                    <div class="home-part-chip">
                      <span class="home-part-flag">${icons.getFlag(sp.country, sp.flag)}</span>
                      <span class="home-part-name">${sp.name}</span>
                      <span class="home-part-country">(${getCountryLocalized(sp.country)})</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Actions Footer -->
          <div class="home-session-actions-footer">
            <div class="home-session-btn-group">
              ${actionButtons}
            </div>
            <div class="home-session-access-hint">
              ${icons.shield}
              <span>${accessNotice}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach click listeners
    document.getElementById('homeSessionJoinBtn')?.addEventListener('click', () => {
      openModal('authModal');
    });
    document.getElementById('homeSessionApplyBtn')?.addEventListener('click', () => {
      openModal('applyModal');
    });
    document.getElementById('homeSessionPortalBtn')?.addEventListener('click', () => {
      navigateToPortal(user.role === 'Coordinator' ? 'coordinator' : 'member');
    });
    document.getElementById('homeSessionViewAllBtn')?.addEventListener('click', () => {
      switchPublicSection('sessions');
    });
  }

  function getCountryLocalized(name) {
    if (!i18n.isRTL()) return name;
    const map = {
      'Qatar': 'قطر',
      'Singapore': 'سنغافورة',
      'Ghana': 'غانا',
      'United Kingdom': 'المملكة المتحدة',
      'Jordan': 'الأردن',
      'Mexico': 'المكسيك',
      'Pakistan': 'باكستان',
      'South Africa': 'جنوب أفريقيا',
      'Canada': 'كندا',
      'Nigeria': 'نيجيريا',
      'Morocco': 'المغرب',
      'Malaysia': 'ماليزيا',
      'India': 'الهند',
      'Australia': 'أستراليا',
      'Germany': 'ألمانيا',
      'France': 'فرنسا',
      'Turkey': 'تركيا',
      'Kuwait': 'الكويت',
      'Oman': 'عُمان',
      'Saudi Arabia': 'المملكة العربية السعودية',
      'Lebanon': 'لبنان',
      'Palestine': 'فلسطين',
      'Tunisia': 'تونس',
      'Egypt': 'مصر'
    };
    return map[name] || name;
  }

  function renderPublicCategories() {
    const container = document.getElementById('publicCategoriesContainer');
    if (!container) return;

    const categories = dataService.getCategories();
    const topics = dataService.getTopics();
    const isAr = i18n.isRTL();

    container.innerHTML = categories.map(cat => {
      const topicCount = topics.filter(t => t.category === cat.id).length;
      const catIcon = icons[cat.icon] || icons.globe;
      const countLabel = isAr 
        ? `${topicCount.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])} قضايا` 
        : `${topicCount} Topics`;
      const catTitle = isAr ? (cat.nameAr || cat.name) : cat.name;
      const catDesc = isAr ? (cat.descriptionAr || cat.description) : cat.description;
      const subTopicsList = isAr ? (cat.subTopicsAr || cat.subTopics || []) : (cat.subTopics || []);
      const footerTag = isAr ? 'محور نقاش شبابي عالمي' : 'Global Youth Focus';
      const arrow = isAr ? '←' : '→';

      return `
        <div class="category-card">
          <div class="category-header">
            <div class="category-icon">${catIcon}</div>
            <span class="category-pill">${countLabel}</span>
          </div>
          <h4 class="serif-text">${catTitle}</h4>
          <p>${catDesc}</p>
          <div class="category-footer">
            <span>${footerTag}</span>
            <span>${arrow}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  let currentPublicSessionFilter = 'all';

  function renderPublicSessionsPreview() {
    const container = document.getElementById('publicSessionsPreview');
    if (!container) return;

    let sessions = dataService.getSessions();
    const isAr = i18n.isRTL();
    const query = (document.getElementById('publicSessionSearch')?.value || '').toLowerCase().trim();

    if (currentPublicSessionFilter && currentPublicSessionFilter !== 'all') {
      sessions = sessions.filter(s => s.status === currentPublicSessionFilter);
    }

    if (query) {
      sessions = sessions.filter(s =>
        (s.title && s.title.toLowerCase().includes(query)) ||
        (s.titleAr && s.titleAr.toLowerCase().includes(query)) ||
        (s.categoryName && s.categoryName.toLowerCase().includes(query)) ||
        (s.presenter && s.presenter.name && s.presenter.name.toLowerCase().includes(query)) ||
        (s.moderator && s.moderator.name && s.moderator.name.toLowerCase().includes(query))
      );
    }

    if (sessions.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="display:flex;justify-content:center;margin-bottom:0.6rem;opacity:0.6;">${icons.search || ""}</div>
          <h4 style="margin: 0 0 0.35rem; color: var(--brand-navy);">No sessions found</h4>
          <p style="margin: 0; font-size: 0.88rem;">Try clearing your search query or selecting a different status filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = sessions.map(ses => {
      const isUpcoming = ses.status === 'Upcoming';
      const statusBadge = isUpcoming
        ? `<span class="badge" style="background: var(--presenter-badge-bg); color: var(--presenter-badge-text); border: 1px solid var(--presenter-badge-border); font-weight: 700;">${icons.liveDot || ''}${isAr ? 'جلسة قادمة' : 'Upcoming Live Dialogue'}</span>`
        : `<span class="badge" style="background: rgba(15, 43, 72, 0.08); color: var(--brand-navy); border: 1px solid var(--border-color); font-weight: 700;">${icons.scroll || ''} ${isAr ? 'أرشيف منجز' : 'Completed Archive'}</span>`;

      const sesNumText = isAr 
        ? `الجلسة ${ses.sessionNumber.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])} • ${ses.categoryNameAr || ses.categoryName}` 
        : `Session ${ses.sessionNumber.toString().padStart(2, '0')} • ${ses.categoryName}`;
      const titleText = isAr ? (ses.titleAr || ses.title) : ses.title;
      const durationText = isAr ? (ses.durationAr || '٩٠ دقيقة') : ses.duration;
      const formatLabel = isAr ? 'شكل المناظرة:' : 'Format:';
      const formatVal = isAr ? (ses.formatAr || ses.format) : ses.format;

      return `
        <div class="session-card-preview" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.35rem; background: var(--bg-surface); transition: all 0.2s ease;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.4rem;">
              <span class="session-num-badge" style="margin:0;">${sesNumText}</span>
              ${statusBadge}
            </div>
            <h4 class="serif-text" style="font-size: 1.25rem; color: var(--brand-navy); margin: 0.4rem 0 0.65rem 0; line-height: 1.35;">${titleText}</h4>
            <div class="session-meta-row" style="margin-bottom: 0.65rem; color: var(--text-muted); font-size: 0.85rem;">
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.calendar} ${ses.date}</span>
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} ${durationText}</span>
            </div>
            <div style="font-size: 0.84rem; color: var(--text-body); margin-bottom: 0.75rem;">
              <strong>${formatLabel}</strong> ${formatVal}
              ${ses.presenter ? ` • <em>Presenter: ${ses.presenter.name} (${ses.presenter.country})</em>` : ''}
            </div>
            <div class="session-countries-pills" style="margin-bottom: 1rem;">
              ${ses.countriesRepresented.map(c => `<span class="country-pill">${getCountryLocalized(c)}</span>`).join('')}
            </div>
          </div>
          <button class="btn btn-navy btn-sm" onclick="window.viewSessionDetail('${ses.id}')" style="width: 100%; justify-content: center; gap: 6px; margin-top: 0.5rem;">
            ${icons.book} Inspect Session Agenda & Brief →
          </button>
        </div>
      `;
    }).join('');
  }

  window.filterPublicSessions = function(status) {
    if (status !== undefined) {
      currentPublicSessionFilter = status;
      document.querySelectorAll('#publicSessionStatusFilters button').forEach(b => {
        const isSelected = b.getAttribute('data-status') === status;
        b.className = isSelected ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline';
      });
    }
    renderPublicSessionsPreview();
  };

  function getUserInitial(name) {
    if (!name || typeof name !== 'string') return 'U';
    const trimmed = name.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : 'U';
  }

  // =========================================================================
  // VIEW: MEMBER PORTAL RENDERING
  // =========================================================================
  function renderMemberPortal() {
    const user = authService.getCurrentUser();
    if (!user) return;

    // Sidebar Profile Card
    const profileCard = document.getElementById('memberSidebarProfile');
    if (profileCard) {
      const initial = getUserInitial(user.name);
      profileCard.innerHTML = `
        <div class="portal-user-avatar" title="${user.name}">${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : initial}</div>
        <div class="portal-user-info">
          <span class="portal-user-name">${user.name}</span>
          <span class="portal-user-role">${user.role} • ${user.country}</span>
        </div>
      `;
    }

    // Update Green "Be a Presenter" Menu Button State
    updateMemberPresenterButtonState();

    // Pull latest presenter application status from cloud API
    if (dataService && typeof dataService.syncRemoteApplications === 'function') {
      dataService.syncRemoteApplications().then(() => {
        updateMemberPresenterButtonState();
      }).catch(() => {});
    }

    // Bind Member Navigation
    bindMemberNavigation();

    // Render active member subview
    switchMemberSubview(currentMemberSubview);
  }

  function updateMemberPresenterButtonState() {
    const btn = document.getElementById('btnMemberBePresenter');
    const textEl = document.getElementById('memberPresenterMenuText');
    const headerBtn = document.getElementById('dashHeaderBePresenterBtn');
    const headerText = document.getElementById('dashHeaderPresenterText');
    const qaTitle = document.getElementById('qaPresenterTitle');
    const mobileText = document.getElementById('mobileTabPresenterText');
    const bannerEl = document.getElementById('memberPresenterAccreditationBanner');

    const user = authService.getCurrentUser();
    if (!user) return;

    const isAccredited = (
      user.role === 'Presenter' || 
      user.role === 'Speaker' || 
      user.isApprovedPresenter === true
    );
    const app = dataService.getMemberPresenterApplication(user.id, user.email);
    const isApproved = isAccredited || (app && app.status === 'Approved');
    const isPending = !isApproved && (app && app.status === 'Pending');

    if (isApproved) {
      if (user.role !== 'Presenter' || !user.isApprovedPresenter) {
        user.role = 'Presenter';
        user.isApprovedPresenter = true;
        authService.saveSession(user);
      }
      if (app && app.status !== 'Approved') {
        app.status = 'Approved';
        dataService.saveDatabase();
      }
      if (textEl) textEl.textContent = 'Presenter Portal →';
      if (btn) {
        btn.className = 'btn-be-presenter status-approved';
        btn.title = 'You are an accredited Official Presenter. Click to open Presenter Portal.';
      }
      if (headerText) headerText.textContent = 'Presenter Portal →';
      if (headerBtn) {
        headerBtn.className = 'btn btn-sm btn-be-presenter status-approved';
        headerBtn.title = 'Open Presenter Portal';
      }
      if (qaTitle) qaTitle.textContent = 'Presenter Portal →';
      if (mobileText) mobileText.textContent = 'Presenter';
      if (bannerEl) {
        bannerEl.innerHTML = `
          <div class="card-panel presenter-accreditation-banner">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div class="presenter-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <strong class="presenter-banner-title">Official Accredited Presenter</strong>
                  <span class="badge presenter-status-badge">Active Access</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-body); margin: 0.2rem 0 0 0;">You have full presenter rights to propose session topics, attach keynote research decks, and take the stage.</p>
              </div>
            </div>
            <button class="btn btn-be-presenter btn-sm" onclick="window.handlePresenterMenuClick()">
              Open Presenter Portal →
            </button>
          </div>
        `;
      }
    } else if (isPending) {
      if (textEl) textEl.textContent = 'Request Pending';
      if (btn) {
        btn.className = 'btn-be-presenter status-pending';
        btn.title = 'Your Presenter application is under review by coordinators.';
      }
      if (headerText) headerText.textContent = 'Request Pending';
      if (headerBtn) {
        headerBtn.className = 'btn btn-sm btn-be-presenter status-pending';
        headerBtn.title = 'Presenter application pending review';
      }
      if (qaTitle) qaTitle.textContent = 'Request Pending';
      if (mobileText) mobileText.textContent = 'Pending';
      if (bannerEl) {
        bannerEl.innerHTML = `
          <div class="card-panel" style="background: rgba(217, 119, 6, 0.08); border: 1px solid rgba(217, 119, 6, 0.35); border-radius: var(--radius-lg); padding: 1.15rem 1.4rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: #d97706; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(217, 119, 6, 0.3);">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <strong style="color: #b45309; font-size: 1rem;">Presenter Request Under Review</strong>
                <p style="font-size: 0.85rem; color: var(--text-body); margin: 0.2rem 0 0 0;">Your application for topic <em>"${app.proposedTopic || 'Academic Research Briefing'}"</em> is currently with the Academic Secretariat. You will receive Presenter Portal access upon coordinator approval.</p>
              </div>
            </div>
            <span class="badge" style="background: #fef3c7; color: #b45309; font-weight: 700; padding: 0.4rem 0.85rem; font-size: 0.82rem; border-radius: 999px;">Pending Admin Approval</span>
          </div>
        `;
      }
    } else {
      if (textEl) textEl.textContent = 'Request to be Presenter';
      if (btn) {
        btn.className = 'btn-be-presenter';
        btn.title = 'Apply to become an accredited official Presenter';
      }
      if (headerText) headerText.textContent = 'Request to be Presenter';
      if (headerBtn) {
        headerBtn.className = 'btn btn-sm btn-be-presenter';
        headerBtn.title = 'Apply to become an accredited official Presenter';
      }
      if (qaTitle) qaTitle.textContent = 'Request to be Presenter';
      if (mobileText) mobileText.textContent = 'Be Presenter';
      if (bannerEl) {
        bannerEl.innerHTML = `
          <div class="card-panel presenter-accreditation-banner">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div class="presenter-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
              </div>
              <div>
                <strong class="presenter-banner-title">Ready to Lead Dialogue as an Official Presenter?</strong>
                <p style="font-size: 0.85rem; color: var(--text-body); margin: 0.2rem 0 0 0;">Deliver 10–30 min research briefings, present keynote topics, and lead international debates. Submit your request for coordinator approval to unlock the Presenter Portal.</p>
              </div>
            </div>
            <button class="btn btn-be-presenter btn-sm" onclick="window.handlePresenterMenuClick()">
              Request to be Presenter
            </button>
          </div>
        `;
      }
    }
  }

  window.handlePresenterMenuClick = function() {
    const user = authService.getCurrentUser();
    if (!user) {
      navigateToPortal('signin');
      return;
    }

    if (user.role === 'Presenter' || user.role === 'Speaker' || user.isApprovedPresenter === true) {
      navigateToPortal('presenter');
      return;
    }

    const app = dataService.getMemberPresenterApplication(user.id, user.email);
    if (app && app.status === 'Approved') {
      user.role = 'Presenter';
      user.isApprovedPresenter = true;
      authService.saveSession(user);
      navigateToPortal('presenter');
      return;
    }

    if (app && app.status === 'Pending') {
      showToast(`Your Presenter application ("${app.proposedTopic}") is currently pending review by the Academic Secretariat.`, 'normal');
      return;
    }

    window.openPresenterApplicationModal();
  };

  window.openPresenterApplicationModal = function() {
    const user = authService.getCurrentUser();
    if (!user) {
      showToast('Please sign in to apply.', 'error');
      navigateToPortal('signin');
      return;
    }

    const nameInput = document.getElementById('presAppName');
    const emailInput = document.getElementById('presAppEmail');
    const countryInput = document.getElementById('presAppCountry');
    const sphereSelect = document.getElementById('presAppSphere');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (countryInput) countryInput.value = `${user.country || 'Global'} Delegation`;

    if (sphereSelect && sphereSelect.options.length === 0) {
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = `${cat.name}`;
        sphereSelect.appendChild(opt);
      });
    }

    const modal = document.getElementById('modalApplyPresenter');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closePresenterApplicationModal = function() {
    const modal = document.getElementById('modalApplyPresenter');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  window.handlePresenterApplicationSubmit = function(e) {
    if (e) e.preventDefault();
    const user = authService.getCurrentUser();
    if (!user) return;

    const country = document.getElementById('presAppCountry')?.value.trim() || user.country;
    const sphere = document.getElementById('presAppSphere')?.value || 'global-affairs';
    const topic = document.getElementById('presAppTopic')?.value.trim();
    const experience = document.getElementById('presAppExperience')?.value.trim();
    const dossierUrl = document.getElementById('presAppDossierUrl')?.value.trim() || '';
    const format = document.getElementById('presAppFormat')?.value || '15-min Keynote Briefing';
    const motivation = document.getElementById('presAppMotivation')?.value.trim();

    if (!topic || !experience || !motivation) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    dataService.addPresenterApplication({
      userId: user.id,
      name: user.name,
      email: user.email,
      country: country,
      flag: user.flag,
      primarySpheres: [sphere],
      proposedTopic: topic,
      researchExperience: experience,
      dossierUrl: dossierUrl,
      preferredFormat: format,
      statementOfIntent: motivation
    });

    window.closePresenterApplicationModal();
    updateMemberPresenterButtonState();
    showToast('Presenter Application submitted! The Academic Secretariat will review your accreditation.', 'success');

    if (typeof renderCoordApplicationsList === 'function') {
      renderCoordApplicationsList();
    }
  };

  function bindMemberNavigation() {
    // Desktop sidebar buttons
    document.querySelectorAll('#viewMember .sidebar-item-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-member-target');
        if (target === 'certificate') {
          showToast('Official Participation Certificates are temporarily disabled and will be enabled soon.', 'warning');
          return;
        }
        if (target) switchMemberSubview(target);
      };
    });

    // Mobile bottom tab buttons
    document.querySelectorAll('#memberMobileTabBar .mobile-tab-btn, #viewMember .mobile-tab-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-member-target');
        if (target === 'certificate') {
          showToast('Official Participation Certificates are temporarily disabled and will be enabled soon.', 'warning');
          return;
        }
        if (target) switchMemberSubview(target);
      };
    });

    // Quick access card clicks
    document.querySelectorAll('[data-member-nav]').forEach(el => {
      el.onclick = () => {
        const target = el.getAttribute('data-member-nav');
        if (target === 'certificate') {
          showToast('Official Participation Certificates are temporarily disabled and will be enabled soon.', 'warning');
          return;
        }
        if (target) switchMemberSubview(target);
      };
    });

    // Sign out button
    const memberLogout = document.getElementById('memberLogoutBtn');
    if (memberLogout) {
      memberLogout.onclick = () => {
        authService.logout();
        navigateToPortal('public');
        showToast('Signed out successfully.');
      };
    }

    // Dashboard suggest button
    const dashSuggest = document.getElementById('dashSuggestTopicBtn');
    if (dashSuggest) {
      dashSuggest.onclick = () => {
        switchMemberSubview('topics');
        setTimeout(() => {
          const bankSelect = document.getElementById('propTopicBankSelect');
          if (bankSelect) {
            bankSelect.value = 'others';
            if (typeof handleTopicBankSelectionChange === 'function') handleTopicBankSelectionChange();
          }
          const formEl = document.getElementById('memberTopicForm');
          if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      };
    }

    // Topic Bank suggest button
    const bankSuggest = document.getElementById('bankSuggestTopicBtn');
    if (bankSuggest) {
      bankSuggest.onclick = () => {
        switchMemberSubview('topics');
        setTimeout(() => {
          const bankSelect = document.getElementById('propTopicBankSelect');
          if (bankSelect) {
            bankSelect.value = 'others';
            if (typeof handleTopicBankSelectionChange === 'function') handleTopicBankSelectionChange();
          }
          const formEl = document.getElementById('memberTopicForm');
          if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      };
    }
  }

  function switchMemberSubview(targetName, pushHistory = true) {
    currentMemberSubview = targetName;

    // Update active class on sidebar items
    document.querySelectorAll('#viewMember .sidebar-item-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-member-target') === targetName);
    });

    // Update active class on mobile tabs
    document.querySelectorAll('#memberMobileTabBar .mobile-tab-btn, #viewMember .mobile-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-member-target') === targetName);
    });

    // Hide all subviews
    document.querySelectorAll('#memberContentArea .portal-subview').forEach(view => {
      view.style.display = 'none';
    });

    // Show target subview
    const targetMap = {
      'dashboard': 'subviewMemberDashboard',
      'sessions': 'subviewMemberSessions',
      'writings': 'subviewMemberWritings',
      'feedback': 'subviewMemberFeedback',
      'topic-bank': 'subviewMemberTopicBank',
      'topics': 'subviewMemberTopics',
      'calendar': 'subviewMemberCalendar',
      'journey': 'subviewMemberJourney',
      'certificate': 'subviewMemberCertificate',
      'profile': 'subviewMemberProfile'
    };

    const targetEl = document.getElementById(targetMap[targetName]);
    if (targetEl) {
      targetEl.style.display = 'block';
    }

    // Trigger subview renderers
    if (targetName === 'dashboard') renderMemberDashboardContent();
    if (targetName === 'sessions') renderMemberSessionsList();
    if (targetName === 'writings') renderMemberWritingsList();
    if (targetName === 'feedback') prepareMemberFeedbackForm();
    if (targetName === 'topic-bank') renderMemberTopicBank();
    if (targetName === 'topics') renderMemberTopicsView();
    if (targetName === 'calendar') renderMemberCalendarView();
    if (targetName === 'journey') renderMemberJourneyView();
    if (targetName === 'certificate') renderMemberCertificate();
    if (targetName === 'profile') renderProfileView('member');

    if (pushHistory && !isNavigatingBack && activePortal === 'member') {
      try {
        history.pushState({ type: 'portalSub', portal: 'member', subview: targetName }, '', `#member/${targetName}`);
      } catch (e) {}
    }

    window.scrollTo(0, 0);
  }
  window.switchMemberSubview = switchMemberSubview;

  // --- Subview: Member Dashboard Content ---
  function renderMemberDashboardContent() {
    updateMemberPresenterButtonState();
    const sessions = dataService.getSessions();
    const nextSession = sessions.find(s => s.status === 'Upcoming') || sessions[0];
    const spotlightEl = document.getElementById('memberNextSessionSpotlight');

    if (spotlightEl && nextSession) {
      spotlightEl.innerHTML = `
        <div class="spotlight-top">
          <span class="spotlight-tag" style="display:inline-flex; align-items:center; gap:5px;">${icons.mic} Upcoming Session ${nextSession.sessionNumber.toString().padStart(2, '0')}</span>
          <span style="font-size: 0.85rem; color: #E6C875; font-weight: 600;">${nextSession.categoryName}</span>
        </div>
        <h3 class="serif-text">${nextSession.title}</h3>
        <div class="spotlight-meta-list">
          <span class="spotlight-meta-item">${icons.calendar} ${nextSession.date}</span>
          <span class="spotlight-meta-item">${icons.clock} ${nextSession.time} ${nextSession.timezone}</span>
          <span class="spotlight-meta-item">${icons.user} Moderator: ${nextSession.moderator.name} (${icons.getFlag(nextSession.moderator.country, nextSession.moderator.flag)} ${nextSession.moderator.country})</span>
        </div>
        <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; margin-bottom: 1.5rem; max-width: 800px; line-height: 1.6;">
          ${nextSession.description}
        </p>
        <div class="spotlight-actions">
          <a href="${nextSession.meetingLink}" target="_blank" class="btn btn-accent btn-md" style="gap:6px;">
            ${icons.video} Join Video Meeting (Live)
          </a>
          <button class="btn btn-outline btn-md" style="color: #fff; border-color: rgba(255,255,255,0.4); gap:6px;" onclick="window.viewSessionDetail('${nextSession.id}')">
            ${icons.fileText} View Full Dossier & Agenda
          </button>
        </div>
      `;
    }

    // Announcements
    const announcementsEl = document.getElementById('memberAnnouncementsList');
    if (announcementsEl) {
      const anns = dataService.getAnnouncements();
      announcementsEl.innerHTML = anns.map(a => `
        <div class="activity-item">
          <div class="activity-icon">${icons.bell}</div>
          <div>
            <div style="font-weight: 600; color: var(--brand-navy);">${a.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">${a.content}</div>
            <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 0.3rem;">By ${a.author} • ${a.date}</div>
          </div>
        </div>
      `).join('');
    }

    // Proposed topics snippet
    const propSnippet = document.getElementById('memberProposedTopicsSnippet');
    if (propSnippet) {
      const user = authService.getCurrentUser();
      const allTopics = dataService.getTopics();
      const userTopics = allTopics.filter(t => t.proposedById === user.id);

      if (userTopics.length === 0) {
        propSnippet.innerHTML = `
          <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.9rem;">
            You have not submitted any debate motions yet.
            <button class="btn btn-outline btn-sm" style="margin-top: 0.75rem;" onclick="document.querySelector('[data-member-target=topics]').click()">
              Suggest a Topic Now
            </button>
          </div>
        `;
      } else {
        propSnippet.innerHTML = userTopics.map(t => `
          <div style="padding: 0.85rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 0.65rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <strong style="color: var(--brand-navy); font-size: 0.92rem;">${t.title}</strong>
              <span class="badge badge-${t.status.toLowerCase().replace(' ', '')}">${t.status}</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${t.categoryName} • Submitted ${t.createdAt}</div>
          </div>
        `).join('');
      }
    }
  }

  // --- Subview: Member Sessions List ---
  function renderMemberSessionsList() {
    const listEl = document.getElementById('memberSessionsList');
    const catSelect = document.getElementById('memberSessionCategoryFilter');
    const typeSelect = document.getElementById('memberSessionTypeFilter');
    const statusSelect = document.getElementById('memberSessionStatusFilter');
    const searchInput = document.getElementById('memberSessionSearch');

    // Populate category filter if empty
    if (catSelect && catSelect.options.length <= 1) {
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catSelect.appendChild(opt);
      });
    }

    function applyFilters() {
      let sessions = dataService.getSessions();
      const query = (searchInput?.value || '').toLowerCase();
      const cat = catSelect?.value;
      const type = typeSelect?.value;
      const status = statusSelect?.value;

      if (query) {
        sessions = sessions.filter(s =>
          s.title.toLowerCase().includes(query) ||
          s.categoryName.toLowerCase().includes(query) ||
          (s.guestName && s.guestName.toLowerCase().includes(query)) ||
          s.countriesRepresented.some(c => c.toLowerCase().includes(query)) ||
          s.moderator.name.toLowerCase().includes(query)
        );
      }

      if (cat && cat !== 'all') {
        sessions = sessions.filter(s => s.category === cat);
      }

      if (type && type !== 'all') {
        sessions = sessions.filter(s => s.sessionCategory === type);
      }

      if (status && status !== 'all') {
        sessions = sessions.filter(s => s.status === status);
      }

      if (sessions.length === 0) {
        listEl.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No sessions match your filter criteria.</div>`;
        return;
      }

      listEl.innerHTML = sessions.map(s => {
        const isUpcoming = s.status === 'Upcoming';
        const sesCategory = s.sessionCategory || 'Topic Presentation';
        
        let catBadge = '';
        if (sesCategory === 'Guest Talk') {
          catBadge = `<span class="badge-session-cat badge-cat-guest">${icons.award} Guest Talk</span>`;
        } else if (sesCategory === 'Debate') {
          catBadge = `<span class="badge-session-cat badge-cat-deb">${icons.scale} Debate</span>`;
        } else if (sesCategory === 'Discussions') {
          catBadge = `<span class="badge-session-cat badge-cat-disc">${icons.messageSquare} Discussions</span>`;
        } else if (sesCategory === 'Diplomatic Roundtable') {
          catBadge = `<span class="badge-session-cat badge-cat-round">${icons.landmark} Roundtable</span>`;
        } else {
          catBadge = `<span class="badge-session-cat badge-cat-pres">${icons.mic} Presentation</span>`;
        }

        return `
          <div class="session-full-card">
            <div class="s-card-top">
              <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                <span class="badge ${isUpcoming ? 'badge-scheduled' : 'badge-completed'}">${s.status}</span>
                ${catBadge}
              </div>
              <span class="badge badge-category">${s.categoryName}</span>
            </div>
            <h4 style="margin: 0.6rem 0;">Session ${s.sessionNumber.toString().padStart(2, '0')}: ${s.title}</h4>
            
            ${s.sessionCategory === 'Guest Talk' && s.guestName ? `
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; padding: 0.6rem 0.85rem; background: rgba(147, 51, 234, 0.05); border: 1px solid rgba(147, 51, 234, 0.2); border-radius: var(--radius-sm);">
                <img src="${s.guestPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--accent-gold); flex-shrink:0;">
                <div>
                  <div style="font-weight: 700; font-size: 0.88rem; color: var(--brand-navy);">${s.guestName}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.3;">${s.guestBio ? s.guestBio.substring(0, 75) + '...' : 'Distinguished Guest Speaker'}</div>
                </div>
              </div>
            ` : ''}

            ${s.sessionCategory === 'Debate' && s.debateMotion ? `
              <div style="margin-bottom: 0.75rem; padding: 0.6rem 0.85rem; background: rgba(220, 38, 38, 0.04); border: 1px solid rgba(220, 38, 38, 0.15); border-radius: var(--radius-sm); font-size: 0.82rem;">
                <div style="font-weight: 700; color: #dc2626; font-size: 0.72rem; text-transform: uppercase;">Motion:</div>
                <div style="font-style: italic; color: var(--text-primary); font-weight: 600;">"${s.debateMotion}"</div>
                <div style="margin-top: 0.35rem; color: var(--text-muted); font-size: 0.78rem;">
                  <strong>Prop:</strong> ${s.propositionTeam || 'Affirmative'} • <strong>Opp:</strong> ${s.oppositionTeam || 'Negative'}
                </div>
              </div>
            ` : ''}

            ${s.sessionCategory === 'Diplomatic Roundtable' && s.workingDraftTitle ? `
              <div style="margin-bottom: 0.75rem; padding: 0.6rem 0.85rem; background: rgba(217, 119, 6, 0.05); border: 1px solid rgba(217, 119, 6, 0.2); border-radius: var(--radius-sm); font-size: 0.82rem;">
                <div style="font-weight: 700; color: #d97706; font-size: 0.72rem; text-transform: uppercase;">Working Resolution:</div>
                <div style="font-style: italic; color: var(--brand-navy); font-weight: 600;">"${s.workingDraftTitle}"</div>
              </div>
            ` : ''}

            <div class="s-meta-list">
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.calendar} ${s.date}</span>
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} ${s.time}</span>
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} ${s.duration}</span>
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.mic} ${s.format}</span>
            </div>
            <div class="s-speaker-row">
              <div class="s-speaker-label">Moderator & Speakers:</div>
              <div><strong>Moderator:</strong> ${s.moderator.name} (${s.moderator.country})</div>
              <div><strong>Speakers:</strong> ${s.speakers.map(sp => `${sp.name} (${sp.country})`).join(', ')}</div>
            </div>
            <div class="s-card-actions">
              <button class="btn btn-outline btn-sm" style="gap:5px;" onclick="window.viewSessionDetail('${s.id}')">
                ${icons.fileText} View Agenda & Structure
              </button>
              ${isUpcoming ? `
                <a href="${s.meetingLink}" target="_blank" class="btn btn-primary btn-sm" style="gap:5px;">
                  ${icons.video} Join Meeting
                </a>
              ` : `
                <button class="btn btn-navy btn-sm" style="gap:5px;" onclick="window.playSessionVideo('${s.id}')">
                  ${icons.play} Watch Recording
                </button>
                ${s.hasSummary ? `
                  <button class="btn btn-subtle btn-sm" style="gap:5px;" onclick="window.openAcademicPaperBySession('${s.id}')">
                    ${icons.book} Read Summary
                  </button>
                ` : ''}
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    if (searchInput) searchInput.oninput = applyFilters;
    if (catSelect) catSelect.onchange = applyFilters;
    if (typeSelect) typeSelect.onchange = applyFilters;
    if (statusSelect) statusSelect.onchange = applyFilters;
    applyFilters();
  }

  // --- Subview: Academic Writings Library ---
  function renderMemberWritingsList() {
    const listEl = document.getElementById('memberWritingsList');
    const catSelect = document.getElementById('memberWritingCategoryFilter');
    const searchInput = document.getElementById('memberWritingSearch');

    if (catSelect && catSelect.options.length <= 1) {
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catSelect.appendChild(opt);
      });
    }

    function applyWritingsFilter() {
      let writings = dataService.getWritings().filter(w => !w.status || w.status === 'Published');
      const query = (searchInput?.value || '').toLowerCase();
      const cat = catSelect?.value;

      if (query) {
        writings = writings.filter(w =>
          w.title.toLowerCase().includes(query) ||
          w.intro.toLowerCase().includes(query) ||
          w.author.toLowerCase().includes(query) ||
          w.categoryName.toLowerCase().includes(query)
        );
      }

      if (cat && cat !== 'all') {
        writings = writings.filter(w => w.category === cat);
      }

      if (writings.length === 0) {
        listEl.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">No academic writings match your search.</div>`;
        return;
      }

      listEl.innerHTML = writings.map(w => `
        <div class="writing-card">
          <div class="w-header">
            <span class="badge badge-published">Academic Publication</span>
            <span class="badge badge-category">${w.categoryName}</span>
          </div>
          <h3 class="serif-text">${w.title}</h3>
          <div class="w-author-row">
            <span style="display:inline-flex; align-items:center; gap:4px;">${icons.pen} Lead: ${w.author}</span>
            <span style="display:inline-flex; align-items:center; gap:4px;">${icons.calendar} Published: ${w.publicationDate}</span>
            ${w.sessionNumber ? `<span style="display:inline-flex; align-items:center; gap:4px;">${icons.mic} Session ${w.sessionNumber.toString().padStart(2, '0')} Synthesis</span>` : ''}
          </div>
          <p class="w-excerpt">${w.intro}</p>
          <div class="w-sections-preview">
            <div class="w-preview-box">
              <h5>Key Arguments (Affirmative)</h5>
              <p>${w.keyArguments[0] || 'Structured policy rationale.'}</p>
            </div>
            <div class="w-preview-box">
              <h5>Counterarguments & Rebuttal</h5>
              <p>${w.counterarguments[0] || 'Vulnerabilities and constraints.'}</p>
            </div>
          </div>
          <button class="btn btn-navy btn-md" style="gap:6px;" onclick="window.openFullAcademicPaper('${w.id}')">
            ${icons.book} Read Full Academic Paper (Dossier View)
          </button>
        </div>
      `).join('');
    }

    searchInput.oninput = applyWritingsFilter;
    catSelect.onchange = applyWritingsFilter;
    applyWritingsFilter();
  }

  // --- Subview: Member Feedback Form ---
  function prepareMemberFeedbackForm() {
    const sessionSelect = document.getElementById('feedbackSessionSelect');
    const sessions = dataService.getSessions().filter(s => s.status === 'Completed');

    if (sessionSelect) {
      sessionSelect.innerHTML = sessions.map(s => `
        <option value="${s.id}">Session ${s.sessionNumber.toString().padStart(2, '0')}: ${s.title} (${s.date})</option>
      `).join('');
    }

    // Rating pills toggle
    let selectedRating = 'Excellent';
    document.querySelectorAll('#feedbackRatingPills .rating-pill-option').forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll('#feedbackRatingPills .rating-pill-option').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        selectedRating = pill.getAttribute('data-rating');
      };
    });

    const form = document.getElementById('memberFeedbackForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const user = authService.getCurrentUser();
      const selectedSession = sessions.find(s => s.id === sessionSelect.value) || sessions[0];

      dataService.submitFeedback({
        sessionId: selectedSession ? selectedSession.id : '',
        sessionTitle: selectedSession ? selectedSession.title : 'General Session',
        memberId: user ? user.id : 'usr_anon',
        memberName: user ? user.name : 'Anonymous Member',
        memberCountry: user ? user.country : 'International',
        rating: selectedRating,
        strengths: document.getElementById('fbStrengths').value.trim(),
        missingPoints: document.getElementById('fbMissingPoints').value.trim(),
        evidenceFeedback: document.getElementById('fbEvidence').value.trim(),
        overlookedPerspectives: document.getElementById('fbOverlooked').value.trim(),
        futureIdeas: document.getElementById('fbFutureIdeas').value.trim(),
        comments: document.getElementById('fbAdditional').value.trim()
      });

      showToast('Thank you! Your qualitative feedback has been submitted to the coordinators.', 'success');
      form.reset();
      switchMemberSubview('dashboard');
    };
  }

  // --- Subview: Member Topic Bank ---
  function renderMemberTopicBank() {
    const searchInput = document.getElementById('memberTopicBankSearch');
    const catFilter = document.getElementById('memberTopicBankCategoryFilter');
    const countPill = document.getElementById('memberTopicBankCount');
    const listEl = document.getElementById('memberTopicBankList');

    if (!listEl) return;

    // Populate category filter options once
    if (catFilter && catFilter.options.length <= 1) {
      catFilter.innerHTML = '<option value="all">All Categories</option>';
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catFilter.appendChild(opt);
      });
    }

    function filterAndRender() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const selectedCat = catFilter?.value || 'all';
      let bank = dataService.getTopicBank();

      if (selectedCat !== 'all') {
        bank = bank.filter(t => (t.categoryId || t.category) === selectedCat);
      }

      if (q) {
        bank = bank.filter(t => {
          const inTitle = (t.title || '').toLowerCase().includes(q);
          const inTitleAr = (t.titleAr || '').toLowerCase().includes(q);
          const inDesc = (t.description || '').toLowerCase().includes(q);
          const subList = t.subtopics || t.subTopics || [];
          const inSubtopics = subList.some(st => st.toLowerCase().includes(q));
          return inTitle || inTitleAr || inDesc || inSubtopics;
        });
      }

      if (countPill) {
        countPill.textContent = `${bank.length} Topic${bank.length === 1 ? '' : 's'} Available`;
      }

      if (bank.length === 0) {
        listEl.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
            <div style="display:flex;justify-content:center;margin-bottom:0.75rem;opacity:0.6;">${icons.book || ""}</div>
            <h4 style="margin-bottom: 0.5rem; color: var(--brand-navy);">No matching topics found</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.25rem;">
              Cannot find what you are looking for? Propose your own custom academic topic using the "Others" option in the proposal form.
            </p>
            <button class="btn btn-primary btn-sm" onclick="switchMemberSubview('topics')">Suggest a New Custom Topic</button>
          </div>
        `;
        return;
      }

      listEl.innerHTML = bank.map(t => {
        const subList = t.subtopics || t.subTopics || [];
        const isCustom = t.isCustom || t.isCustomAdded;
        const formats = t.recommendedFormats || (t.recommendedFormat ? [t.recommendedFormat] : []);
        const catName = t.categoryName || dataService.getCategoryName(t.categoryId || t.category);

        return `
          <div class="topic-bank-card">
            <div>
              <div class="topic-bank-top-meta">
                <div class="topic-bank-badges">
                  <span class="badge-bank-cat">${catName}</span>
                  ${isCustom ? `<span class="badge-bank-custom" style="display:inline-flex;align-items:center;gap:4px;">${icons.star} Community Approved</span>` : ''}
                  ${formats.length ? `<span class="badge-bank-format">${formats[0]}</span>` : ''}
                </div>
                ${t.dateAdded ? `<span class="topic-bank-author-tag">${t.dateAdded}</span>` : ''}
              </div>

              <h3 class="topic-bank-card-title">${t.title}</h3>
              ${t.titleAr ? `<div class="topic-bank-card-title-ar">${t.titleAr}</div>` : ''}
              <p class="topic-bank-card-desc">${t.description}</p>

              <div class="topic-bank-subtopics-box">
                <div class="topic-bank-subtopics-heading">
                  <span>Academic Research Angles & Subtopics (${subList.length})</span>
                </div>
                <ul class="topic-bank-subtopics-list">
                  ${subList.map(st => `
                    <li><span class="subtopic-bullet">›</span> <span>${st}</span></li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <div class="topic-bank-card-footer">
              <span class="topic-bank-author-tag">By: ${t.addedBy || 'Academic Board'}</span>
              <button class="btn btn-primary btn-sm" onclick="window.useTopicFromBank('${t.id}')">
                <span>Suggest This Topic</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:middle; margin-inline-start:4px;"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (searchInput) searchInput.oninput = filterAndRender;
    if (catFilter) catFilter.onchange = filterAndRender;

    filterAndRender();
  }

  // --- Topic Bank Selection Helpers for Proposal Form ---
  function populateTopicBankDropdown(selectedBankId = null) {
    const bankSelect = document.getElementById('propTopicBankSelect');
    if (!bankSelect) return;

    bankSelect.innerHTML = '';

    // Placeholder
    const defOpt = document.createElement('option');
    defOpt.value = '';
    defOpt.textContent = '-- Select a Topic from Academic Topic Bank --';
    bankSelect.appendChild(defOpt);

    const bank = dataService.getTopicBank();
    const categories = dataService.getCategories();
    const grouped = {};

    categories.forEach(c => {
      grouped[c.id] = { name: c.name, topics: [] };
    });

    bank.forEach(t => {
      const catKey = t.categoryId || t.category;
      if (!grouped[catKey]) {
        grouped[catKey] = { name: t.categoryName || catKey, topics: [] };
      }
      grouped[catKey].topics.push(t);
    });

    Object.keys(grouped).forEach(catId => {
      const grp = grouped[catId];
      if (grp.topics.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = grp.name;
        grp.topics.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = `${t.title}${(t.isCustom || t.isCustomAdded) ? ' (Community Approved)' : ''}`;
          optgroup.appendChild(opt);
        });
        bankSelect.appendChild(optgroup);
      }
    });

    // Special option "Others"
    const otherOpt = document.createElement('option');
    otherOpt.value = 'others';
    otherOpt.textContent = 'Others (Suggest New Custom Topic)';
    bankSelect.appendChild(otherOpt);

    if (selectedBankId) {
      bankSelect.value = selectedBankId;
    }

    handleTopicBankSelectionChange();
  }

  function handleTopicBankSelectionChange() {
    const bankSelect = document.getElementById('propTopicBankSelect');
    if (!bankSelect) return;
    const val = bankSelect.value;

    const customFields = document.getElementById('propCustomTopicFields');
    const subtopicGroup = document.getElementById('propSubtopicGroup');
    const subSelect = document.getElementById('propSubtopicSelect');
    const titleInput = document.getElementById('propTitle');
    const catSelect = document.getElementById('propCategory');
    const reasonInput = document.getElementById('propReason');
    const formatSelect = document.getElementById('propFormat');

    if (val === 'others') {
      // User selected "Others" -> reveal custom topic fields
      if (customFields) customFields.style.display = 'block';
      if (subtopicGroup) subtopicGroup.style.display = 'none';
      if (titleInput) {
        titleInput.required = true;
        titleInput.value = '';
      }
    } else if (val) {
      // User selected a topic from the Topic Bank
      if (customFields) customFields.style.display = 'none';
      if (subtopicGroup) subtopicGroup.style.display = 'block';
      if (titleInput) {
        titleInput.required = false;
      }

      const item = dataService.getTopicBankItem(val);
      if (item) {
        // Pre-fill hidden/bound fields
        if (titleInput) titleInput.value = item.title;
        if (catSelect) catSelect.value = item.categoryId || item.category;

        // Populate subtopics dropdown
        if (subSelect) {
          subSelect.innerHTML = '';
          const allOpt = document.createElement('option');
          allOpt.value = 'General Comprehensive Overview';
          allOpt.textContent = 'Comprehensive / All Angles in this Theme';
          subSelect.appendChild(allOpt);

          const subList = item.subtopics || item.subTopics || [];
          subList.forEach(st => {
            const opt = document.createElement('option');
            opt.value = st;
            opt.textContent = `Focus: ${st}`;
            subSelect.appendChild(opt);
          });
        }

        // Pre-fill academic rationale if reason is empty or was previously prefilled
        if (reasonInput && (!reasonInput.value || reasonInput.getAttribute('data-prefilled') === 'true')) {
          reasonInput.value = item.description;
          reasonInput.setAttribute('data-prefilled', 'true');
        }

        // Set matching format if available
        if (formatSelect) {
          const fmts = item.recommendedFormats || (item.recommendedFormat ? [item.recommendedFormat] : []);
          const fmtStr = fmts.join(' ');
          if (fmtStr.includes('Debate')) {
            formatSelect.value = 'Formal Debate';
          } else if (fmtStr.includes('Presentation')) {
            formatSelect.value = 'Topic Presentation';
          } else if (fmtStr.includes('Workshop')) {
            formatSelect.value = 'Academic Workshop';
          } else {
            formatSelect.value = 'Roundtable Discussion';
          }
        }
      }
    } else {
      // Nothing selected
      if (customFields) customFields.style.display = 'none';
      if (subtopicGroup) subtopicGroup.style.display = 'none';
      if (titleInput) titleInput.required = false;
    }
  }

  window.useTopicFromBank = function(topicId) {
    switchMemberSubview('topics');
    setTimeout(() => {
      populateTopicBankDropdown(topicId);
      const formEl = document.getElementById('memberTopicForm');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const item = dataService.getTopicBankItem(topicId);
      if (item) {
        showToast(`Selected "${item.title}". Choose your subtopic focus and submit your dialogue proposal!`, 'normal');
      }
    }, 60);
  };

  // --- Subview: Member Topic Suggestion & Tracker ---
  function renderMemberTopicsView() {
    const catSelect = document.getElementById('propCategory');
    if (catSelect && catSelect.options.length === 0) {
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catSelect.appendChild(opt);
      });
    }

    // Populate the Topic Bank selection dropdown
    populateTopicBankDropdown();

    const bankSelect = document.getElementById('propTopicBankSelect');
    if (bankSelect) {
      bankSelect.onchange = handleTopicBankSelectionChange;
    }

    // Render topics tracking pipeline
    const listEl = document.getElementById('memberSubmittedTopicsList');
    const topics = dataService.getTopics();

    const pipelineSteps = ['Proposed', 'Under Review', 'Approved', 'Scheduled', 'Completed'];

    listEl.innerHTML = topics.map(t => {
      const currentStepIdx = pipelineSteps.indexOf(t.status);

      return `
        <div class="topic-row-card">
          <div class="t-row-top">
            <div>
              <span class="badge badge-category" style="margin-bottom: 0.35rem;">${t.categoryName}</span>
              ${t.isCustom ? `<span class="badge-bank-custom" style="margin-left: 0.35rem; font-size: 0.72rem; padding: 2px 7px;">Custom Proposal</span>` : ''}
              <h4>${t.title}</h4>
              ${t.subtopic && t.subtopic !== 'General Comprehensive Overview' ? `<div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 500; margin-top: 2px;">Focus: ${t.subtopic}</div>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button class="topic-upvote-btn" onclick="window.voteTopic('${t.id}')" title="Upvote in community ballot">
                ▲ <span id="voteCount_${t.id}">${t.upvotes || 12}</span>
              </button>
              <span class="badge badge-${t.status.toLowerCase().replace(' ', '')}">${t.status}</span>
            </div>
          </div>
          ${t.motion ? `
            <div class="motion-quote">
              <strong>Motion:</strong> ${t.motion}
            </div>
          ` : ''}
          <p style="font-size: 0.88rem; color: var(--text-muted);">${t.description}</p>
          
          <!-- Visual 5-Stage Status Tracker -->
          <div class="topic-progress-steps">
            ${pipelineSteps.map((step, idx) => {
              const isDone = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;
              return `
                <div class="progress-step-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}">
                  <span class="step-dot">${isDone ? icons.check : idx + 1}</span>
                  <span>${step}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div style="font-size: 0.76rem; color: var(--text-subtle); display: flex; justify-content: space-between;">
            <span>Proposed by: ${t.proposedBy}</span>
            <span>Date: ${t.createdAt}</span>
          </div>
        </div>
      `;
    }).join('');

    // Handle Form submission
    const form = document.getElementById('memberTopicForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const user = authService.getCurrentUser();
      const bankVal = document.getElementById('propTopicBankSelect').value;

      if (!bankVal) {
        showToast('Please select a topic from the Academic Topic Bank or choose "Others" to propose a new custom topic.', 'warning');
        return;
      }

      let title = '';
      let catId = '';
      let subtopic = '';
      let isCustom = false;
      let customSubtopics = '';

      if (bankVal === 'others') {
        isCustom = true;
        title = document.getElementById('propTitle').value.trim();
        if (!title) {
          showToast('Please enter your custom topic title.', 'warning');
          return;
        }
        catId = document.getElementById('propCategory').value;
        customSubtopics = (document.getElementById('propCustomSubtopics')?.value || '').trim();
      } else {
        const item = dataService.getTopicBankItem(bankVal);
        title = item ? item.title : document.getElementById('propTitle').value.trim();
        catId = item ? (item.categoryId || item.category) : document.getElementById('propCategory').value;
        subtopic = document.getElementById('propSubtopicSelect')?.value || '';
      }

      const motion = document.getElementById('propMotion').value.trim();
      const format = document.getElementById('propFormat').value;
      const reason = document.getElementById('propReason').value.trim();
      const countryPerspective = document.getElementById('propCountry').value.trim();
      const sources = document.getElementById('propSources').value.trim();

      dataService.addTopic({
        title,
        category: catId,
        motion,
        format,
        subtopic,
        isCustom,
        customSubtopics,
        bankId: bankVal !== 'others' ? bankVal : null,
        description: reason,
        proposedBy: user ? user.name : 'Community Member',
        proposedById: user ? user.id : null,
        countryPerspective,
        sources,
        status: 'Proposed'
      });

      if (isCustom) {
        showToast('Custom topic submitted! When coordinators review and approve this topic, it will automatically join the official Topic Bank.', 'success');
      } else {
        showToast('Topic proposal submitted! It is now in the review pipeline.', 'success');
      }
      form.reset();
      populateTopicBankDropdown();
      renderMemberTopicsView();
    };
  }

  // --- Subview: Member Community Directory ---
  function renderMemberCommunityDirectory() {
    const listEl = document.getElementById('memberCommunityList');
    const users = dataService.getUsers();

    listEl.innerHTML = users.map(u => `
      <div class="member-card">
        <div class="m-card-top">
          <div class="m-avatar" title="${u.name}">${u.avatar ? `<img src="${u.avatar}" alt="${u.name}">` : getUserInitial(u.name)}</div>
          <div>
            <div class="m-name">${u.name}</div>
            <div class="m-country">${u.role} • ${u.country}</div>
          </div>
        </div>
        <p class="m-bio">${u.bio || 'Active youth debater and international affairs researcher.'}</p>
        <div class="m-interests-wrap">
          ${(u.interests || ['Debate', 'Diplomacy']).map(i => `<span class="interest-tag">${i}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }


  // =========================================================================
  // GLOBAL MODAL HELPERS: Topic Bank Modal
  // =========================================================================
  window.openCoordAddTopicBankModal = function() {
    const modal = document.getElementById('modalCoordAddTopicBank');
    const catSelect = document.getElementById('tbNewCategory');
    if (catSelect) {
      catSelect.innerHTML = '';
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catSelect.appendChild(opt);
      });
    }
    if (modal) {
      modal.style.display = 'flex';
      modal.offsetHeight; // reflow
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const titleInput = document.getElementById('tbNewTitle');
        if (titleInput) titleInput.focus();
      }, 50);
    }
  };

  window.closeCoordAddTopicBankModal = function() {
    const modal = document.getElementById('modalCoordAddTopicBank');
    const form = document.getElementById('coordAddTopicBankForm');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        if (!modal.classList.contains('active')) {
          modal.style.display = 'none';
        }
      }, 250);
    }
    document.body.style.overflow = '';
    if (form) form.reset();
  };

  window.handleCoordAddTopicBankSubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const title = document.getElementById('tbNewTitle')?.value.trim();
    const titleAr = document.getElementById('tbNewTitleAr')?.value.trim() || '';
    const category = document.getElementById('tbNewCategory')?.value;
    const format = document.getElementById('tbNewFormat')?.value || 'Discussion & Debate';
    const description = document.getElementById('tbNewDescription')?.value.trim();
    const rawSubtopics = document.getElementById('tbNewSubtopics')?.value.trim() || '';

    if (!title) {
      showToast('Please provide a topic title.', 'warning');
      return;
    }
    if (!description) {
      showToast('Please provide an academic description for this topic.', 'warning');
      return;
    }

    const subtopics = rawSubtopics
      ? rawSubtopics
        .split(/[\n,]+/)
        .map(s => s.replace(/^Subtopic\s*\d*:\s*/i, '').trim())
        .filter(s => s.length > 0)
      : [];

    const newEntry = dataService.addTopicToBank({
      title,
      titleAr,
      category,
      recommendedFormats: [format],
      description,
      subtopics,
      isCustom: true,
      addedBy: 'Secretariat Direct Add'
    });

    // Also register in topics pipeline
    dataService.addTopic({
      title,
      category,
      motion: `This House would prioritize action on: ${title}`,
      format,
      description,
      subtopic: subtopics.length > 0 ? subtopics[0] : 'Academic Overview',
      isCustom: true,
      bankId: newEntry.id,
      proposedBy: 'Secretariat Direct Add',
      status: 'Approved'
    });

    showToast(`New topic "${newEntry.title}" saved to the Topic Bank!`, 'success');
    window.closeCoordAddTopicBankModal();
    if (typeof renderCoordTopicBank === 'function') renderCoordTopicBank();
    if (typeof renderCoordTopicsList === 'function') renderCoordTopicsList();
    if (typeof renderMemberTopicBank === 'function') renderMemberTopicBank();
    if (typeof renderPresenterTopicBank === 'function') renderPresenterTopicBank();
    if (typeof populateTopicBankDropdown === 'function') populateTopicBankDropdown();
  };


  // =========================================================================
  // VIEW: PRESENTER PORTAL RENDERING
  // =========================================================================
  let currentPresenterSubview = 'dashboard';

  function renderPresenterPortal() {
    const user = authService.getCurrentUser();
    if (!user) return;

    // Sidebar Profile
    const profileCard = document.getElementById('presenterSidebarProfile');
    if (profileCard) {
      const initial = getUserInitial(user.name);
      profileCard.innerHTML = `
        <div class="portal-user-avatar avatar-presenter" title="${user.name}">${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : initial}</div>
        <div class="portal-user-info">
          <span class="portal-user-name">${user.name}</span>
          <span class="portal-user-role" style="color: var(--accent-gold); font-weight: 600;">${icons.star} Academic Presenter (${user.country})</span>
        </div>
      `;
    }

    bindPresenterNavigation();
    switchPresenterSubview(currentPresenterSubview);
  }

  function bindPresenterNavigation() {
    // Desktop sidebar
    document.querySelectorAll('#viewPresenter .sidebar-item-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-presenter-target');
        if (target === 'certificate') {
          showToast('Keynote & Presentation Certificates are temporarily disabled and will be enabled soon.', 'warning');
          return;
        }
        if (target) switchPresenterSubview(target);
      };
    });

    // Mobile tabs
    document.querySelectorAll('#presenterMobileTabBar .mobile-tab-btn, #viewPresenter .mobile-tab-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-presenter-target');
        if (target === 'certificate') {
          showToast('Keynote & Presentation Certificates are temporarily disabled and will be enabled soon.', 'warning');
          return;
        }
        if (target) switchPresenterSubview(target);
      };
    });

    // Quick action buttons
    const dashNewTopicBtn = document.getElementById('presDashNewTopicBtn');
    if (dashNewTopicBtn) {
      dashNewTopicBtn.onclick = () => switchPresenterSubview('present');
    }

    const presToMemberBtn = document.getElementById('presenterToMemberBtn');
    if (presToMemberBtn) {
      presToMemberBtn.onclick = (e) => {
        e.preventDefault();
        navigateToPortal('member');
      };
    }

    const presLogout = document.getElementById('presenterLogoutBtn');
    if (presLogout) {
      presLogout.onclick = () => {
        authService.logout();
        navigateToPortal('public');
        showToast('Signed out from Presenter Workspace.');
      };
    }
  }

  function switchPresenterSubview(targetName, pushHistory = true) {
    currentPresenterSubview = targetName;

    // Active classes
    document.querySelectorAll('#viewPresenter .sidebar-item-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-presenter-target') === targetName);
    });

    document.querySelectorAll('#presenterMobileTabBar .mobile-tab-btn, #viewPresenter .mobile-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-presenter-target') === targetName);
    });

    // Hide all
    document.querySelectorAll('#presenterContentArea .portal-subview').forEach(view => {
      view.style.display = 'none';
    });

    const targetMap = {
      'dashboard': 'subviewPresenterDashboard',
      'present': 'subviewPresenterPresent',
      'decks': 'subviewPresenterDecks',
      'topic-bank': 'subviewPresenterTopicBank',
      'sessions': 'subviewPresenterSessions',
      'writings': 'subviewPresenterWritings',
      'profile': 'subviewPresenterProfile'
    };

    const targetEl = document.getElementById(targetMap[targetName]);
    if (targetEl) targetEl.style.display = 'block';

    if (targetName === 'dashboard') renderPresenterDashboardContent();
    if (targetName === 'present') renderPresenterPresentView();
    if (targetName === 'decks') renderPresenterDecksView();
    if (targetName === 'topic-bank') renderPresenterTopicBank();
    if (targetName === 'sessions') renderPresenterSessionsList();
    if (targetName === 'writings') renderPresenterWritingsView();
    if (targetName === 'profile') renderProfileView('presenter');

    if (pushHistory && !isNavigatingBack && activePortal === 'presenter') {
      try {
        history.pushState({ type: 'portalSub', portal: 'presenter', subview: targetName }, '', `#presenter/${targetName}`);
      } catch (e) {}
    }

    window.scrollTo(0, 0);
  }
  window.switchPresenterSubview = switchPresenterSubview;

  // Subview: Presenter Dashboard
  function renderPresenterDashboardContent() {
    const user = authService.getCurrentUser() || { name: 'Mubashir CP', id: 'usr_admin_mubashir', email: '3681mubashircp@gmail.com', role: 'Coordinator', country: 'India', flag: 'IN' };
    const presentations = dataService.getPresentations();
    const myPresentations = presentations.filter(p => !p.presenterId || p.presenterId === user.id || p.presenterName === user.name);
    const sessions = dataService.getSessions();
    const upcomingSessions = sessions.filter(s => s.status === 'Upcoming');

    // Update KPI numbers
    const presDelivered = myPresentations.filter(p => p.status === 'Delivered').length;
    const presScheduled = myPresentations.filter(p => p.status === 'Scheduled' || p.status === 'Approved').length;
    
    const countDeliveredEl = document.getElementById('kpiPresPresentedCount');
    const countScheduledEl = document.getElementById('kpiPresScheduledCount');
    const countDecksEl = document.getElementById('kpiPresDecksCount');

    if (countDeliveredEl) countDeliveredEl.textContent = presDelivered;
    if (countScheduledEl) countScheduledEl.textContent = presScheduled;
    if (countDecksEl) countDecksEl.textContent = myPresentations.length;

    // Upcoming Speaking Engagements
    const engagementsList = document.getElementById('presenterUpcomingEngagementsList');
    if (engagementsList) {
      if (upcomingSessions.length === 0) {
        engagementsList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem; padding: 1rem 0;">No upcoming sessions scheduled at the moment.</div>`;
      } else {
        engagementsList.innerHTML = upcomingSessions.map(s => `
          <div class="session-brief-card" style="margin-bottom: 0.85rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem; background: var(--bg-card);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <span class="badge badge-category" style="margin-bottom: 0.25rem;">${s.categoryName || s.category}</span>
                <h4 style="margin: 0.25rem 0; font-size: 1.05rem; color: var(--brand-navy);">${s.title}</h4>
                <div style="font-size: 0.82rem; color: var(--text-muted);">
                  <span style="display:inline-flex;align-items:center;gap:4px;">${icons.calendar} ${s.date}</span> • <span style="display:inline-flex;align-items:center;gap:4px;">${icons.clock} ${s.time} (${s.timezone || 'QST'})</span> • <span style="display:inline-flex;align-items:center;gap:4px;">${icons.hourglass} ${s.duration}</span>
                </div>
              </div>
              <span class="badge badge-scheduled">Confirmed Speaker Slot</span>
            </div>
            <div style="font-size: 0.84rem; color: var(--text-body); margin-bottom: 0.75rem; background: rgba(9,29,44,0.03); padding: 0.6rem 0.75rem; border-radius: var(--radius-sm);">
              <strong>Moderator:</strong> ${s.moderator?.name || 'TBD'} • <strong>Format:</strong> ${s.format}
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end; flex-wrap: wrap;">
              <button class="btn btn-outline btn-sm" onclick="switchPresenterSubview('present')">
                ${icons.fileText} Prepare Presentation Deck
              </button>
              <a href="${s.meetingLink || 'https://meet.google.com/gyd-dialogue'}" target="_blank" class="btn btn-primary btn-sm">
                ${icons.mic} Enter Speaker Stage Link
              </a>
            </div>
          </div>
        `).join('');
      }
    }

    // Recent Briefings List
    const recentList = document.getElementById('presenterRecentBriefingsList');
    if (recentList) {
      if (myPresentations.length === 0) {
        recentList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem; padding: 0.5rem 0;">No presentations submitted yet.</div>`;
      } else {
        recentList.innerHTML = myPresentations.slice(0, 3).map(p => `
          <div style="padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 0.65rem; background: var(--bg-card);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <span class="badge-bank-cat" style="font-size: 0.7rem;">${p.categoryName || p.category}</span>
              <span class="badge badge-${p.status.toLowerCase().replace(' ', '')}" style="font-size: 0.7rem;">${p.status}</span>
            </div>
            <div style="font-weight: 600; color: var(--brand-navy); font-size: 0.9rem; margin-bottom: 0.25rem;">${p.title}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${p.format} • ${p.createdAt}</div>
          </div>
        `).join('');
      }
    }
  }

  // Subview: Present a Topic (The Core Presentation Studio)
  function renderPresenterPresentView(preselectedBankId = null) {
    const bankSelect = document.getElementById('presTopicBankSelect');
    const subSelect = document.getElementById('presSubtopicSelect');
    const subGroup = document.getElementById('presSubtopicGroup');
    const customFields = document.getElementById('presCustomFields');
    const catSelect = document.getElementById('presCustomCategory');
    const targetSessionSelect = document.getElementById('presTargetSession');
    const form = document.getElementById('presenterTopicForm');

    // Populate Topic Bank Select
    if (bankSelect) {
      bankSelect.innerHTML = '';
      const defOpt = document.createElement('option');
      defOpt.value = '';
      defOpt.textContent = '-- Select a Topic from Academic Topic Bank to Present --';
      bankSelect.appendChild(defOpt);

      const bank = dataService.getTopicBank();
      const categories = dataService.getCategories();
      const grouped = {};

      categories.forEach(c => grouped[c.id] = { name: c.name, topics: [] });
      bank.forEach(t => {
        const catKey = t.categoryId || t.category;
        if (!grouped[catKey]) grouped[catKey] = { name: t.categoryName || catKey, topics: [] };
        grouped[catKey].topics.push(t);
      });

      Object.keys(grouped).forEach(catId => {
        const grp = grouped[catId];
        if (grp.topics.length > 0) {
          const optgroup = document.createElement('optgroup');
          optgroup.label = grp.name;
          grp.topics.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.title}${(t.isCustom || t.isCustomAdded) ? ' (Community Approved)' : ''}`;
            optgroup.appendChild(opt);
          });
          bankSelect.appendChild(optgroup);
        }
      });

      const otherOpt = document.createElement('option');
      otherOpt.value = 'others';
      otherOpt.textContent = 'Others (Present a Custom Academic Topic)';
      bankSelect.appendChild(otherOpt);

      if (preselectedBankId) {
        bankSelect.value = preselectedBankId;
      }
    }

    // Populate Category select for custom
    if (catSelect && catSelect.options.length === 0) {
      dataService.getCategories().forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        catSelect.appendChild(opt);
      });
    }

    // Populate Target Sessions
    if (targetSessionSelect) {
      targetSessionSelect.innerHTML = '';
      const nextOpt = document.createElement('option');
      nextOpt.value = 'next';
      nextOpt.textContent = 'Next Available Scheduled Dialogue Session';
      targetSessionSelect.appendChild(nextOpt);

      dataService.getSessions().forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `Session ${s.sessionNumber.toString().padStart(2, '0')}: ${s.title} (${s.date})`;
        targetSessionSelect.appendChild(opt);
      });
    }

    // Handle Bank selection change
    function handlePresBankSelectChange() {
      const val = bankSelect.value;
      const titleInput = document.getElementById('presPresentationTitle');
      const abstractInput = document.getElementById('presAbstract');

      if (val === 'others') {
        if (customFields) customFields.style.display = 'block';
        if (subGroup) subGroup.style.display = 'none';
      } else if (val) {
        if (customFields) customFields.style.display = 'none';
        if (subGroup) subGroup.style.display = 'block';

        const item = dataService.getTopicBankItem(val);
        if (item) {
          if (titleInput && (!titleInput.value || titleInput.getAttribute('data-prefilled') === 'true')) {
            titleInput.value = `Topic Presentation: ${item.title}`;
            titleInput.setAttribute('data-prefilled', 'true');
          }
          if (abstractInput && (!abstractInput.value || abstractInput.getAttribute('data-prefilled') === 'true')) {
            abstractInput.value = item.description;
            abstractInput.setAttribute('data-prefilled', 'true');
          }

          if (subSelect) {
            subSelect.innerHTML = '';
            const allOpt = document.createElement('option');
            allOpt.value = 'Comprehensive Theoretical Overview';
            allOpt.textContent = 'Comprehensive Overview of this Academic Theme';
            subSelect.appendChild(allOpt);

            const subList = item.subtopics || item.subTopics || [];
            subList.forEach(st => {
              const opt = document.createElement('option');
              opt.value = st;
              opt.textContent = `Subtopic Angle: ${st}`;
              subSelect.appendChild(opt);
            });
          }
        }
      } else {
        if (customFields) customFields.style.display = 'none';
        if (subGroup) subGroup.style.display = 'none';
      }
    }

    if (bankSelect) {
      bankSelect.onchange = handlePresBankSelectChange;
      handlePresBankSelectChange();
    }

    // Render Presenter Lifecycle Pipeline
    renderPresenterPipelineTracker();

    // Form submission
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const user = authService.getCurrentUser() || { name: 'Mubashir CP', id: 'usr_admin_mubashir', email: '3681mubashircp@gmail.com', role: 'Coordinator', country: 'India', flag: 'IN' };
        const bankVal = bankSelect.value;

        if (!bankVal) {
          showToast('Please select a topic from the Topic Bank or choose "Others" to present a custom topic.', 'warning');
          return;
        }

        let topicTitle = '';
        let catId = '';
        let subtopic = '';

        if (bankVal === 'others') {
          topicTitle = document.getElementById('presCustomTitle').value.trim();
          catId = document.getElementById('presCustomCategory').value;
          subtopic = document.getElementById('presCustomSubtopics').value.trim() || 'Custom Angle';
          if (!topicTitle) {
            showToast('Please specify the custom topic title.', 'warning');
            return;
          }
        } else {
          const item = dataService.getTopicBankItem(bankVal);
          topicTitle = item ? item.title : '';
          catId = item ? (item.categoryId || item.category) : 'global-affairs';
          subtopic = subSelect?.value || 'General Overview';
        }

        const presTitle = document.getElementById('presPresentationTitle').value.trim();
        const abstract = document.getElementById('presAbstract').value.trim();
        const keyArgsRaw = document.getElementById('presKeyArguments').value.trim();
        const format = document.getElementById('presFormat').value;
        const duration = document.getElementById('presDuration').value;
        const slidesUrl = document.getElementById('presSlidesUrl').value.trim();
        const targetSessionVal = document.getElementById('presTargetSession').value;

        const keyArguments = keyArgsRaw.split('\n').map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);

        const newPres = dataService.addPresentation({
          title: presTitle,
          topicId: bankVal !== 'others' ? bankVal : null,
          category: catId,
          subtopic,
          abstract,
          keyArguments,
          format,
          duration,
          slidesUrl,
          targetSessionId: targetSessionVal !== 'next' ? targetSessionVal : null,
          presenterName: user.name,
          presenterId: user.id,
          presenterCountry: user.country || 'Ghana',
          presenterFlag: user.flag || 'GH',
          status: 'Proposed'
        });

        // Also ensure it is registered in topic proposals for secretariat review
        dataService.addTopic({
          title: `${presTitle} [Presenter: ${user.name}]`,
          category: catId,
          motion: `This House resolves to adopt the recommendations of: ${presTitle}`,
          description: abstract,
          format,
          subtopic,
          isCustom: bankVal === 'others',
          proposedBy: `${user.name} (Presenter Proposal)`,
          status: 'Proposed'
        });

        showToast('Presentation proposal submitted! Secretariat coordinators will review and schedule your session speaking slot.', 'success');
        form.reset();
        renderPresenterPresentView();
      };
    }
  }

  function renderPresenterPipelineTracker() {
    const listEl = document.getElementById('presenterPipelineList');
    if (!listEl) return;

    const user = authService.getCurrentUser() || { name: 'Mubashir CP', id: 'usr_admin_mubashir', email: '3681mubashircp@gmail.com', role: 'Coordinator', country: 'India', flag: 'IN' };
    const presentations = dataService.getPresentations();
    const myPres = presentations.filter(p => !p.presenterId || p.presenterId === user.id || p.presenterName === user.name);

    const pipelineSteps = ['Proposed', 'Under Review', 'Approved', 'Scheduled', 'Delivered'];

    if (myPres.length === 0) {
      listEl.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem; padding: 1rem 0;">No active presentations in the review pipeline. Submit one on the left!</div>`;
      return;
    }

    listEl.innerHTML = myPres.map(p => {
      const currentStepIdx = pipelineSteps.indexOf(p.status) >= 0 ? pipelineSteps.indexOf(p.status) : 0;

      return `
        <div class="topic-row-card" style="margin-bottom: 1rem;">
          <div class="t-row-top">
            <div>
              <span class="badge badge-category" style="margin-bottom: 0.35rem;">${p.categoryName || p.category}</span>
              <h4 style="margin: 0.25rem 0;">${p.title}</h4>
              <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 500;">Focus: ${p.subtopic}</div>
            </div>
            <span class="badge badge-${p.status.toLowerCase().replace(' ', '')}">${p.status}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-body); margin: 0.5rem 0;">${p.abstract}</p>

          <!-- Visual 5-Stage Tracker -->
          <div class="topic-progress-steps">
            ${pipelineSteps.map((step, idx) => {
              const isDone = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;
              return `
                <div class="progress-step-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}">
                  <span class="step-dot">${isDone ? icons.check : idx + 1}</span>
                  <span>${step}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div style="font-size: 0.76rem; color: var(--text-subtle); display: flex; justify-content: space-between; margin-top: 0.5rem;">
            <span>Format: ${p.format}</span>
            <span>Created: ${p.createdAt}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Subview: My Presentations & Slide Decks
  function renderPresenterDecksView() {
    const user = authService.getCurrentUser() || { name: 'Mubashir CP', id: 'usr_admin_mubashir', email: '3681mubashircp@gmail.com', role: 'Coordinator', country: 'India', flag: 'IN' };
    const searchInput = document.getElementById('presenterDecksSearch');
    const statusFilter = document.getElementById('presenterDecksStatusFilter');
    const listEl = document.getElementById('presenterDecksList');
    if (!listEl) return;

    function filterDecks() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const status = statusFilter?.value || 'all';

      let items = dataService.getPresentations().filter(p => !p.presenterId || p.presenterId === user.id || p.presenterName === user.name);

      if (status !== 'all') {
        items = items.filter(p => p.status === status);
      }

      if (q) {
        items = items.filter(p => {
          const inTitle = (p.title || '').toLowerCase().includes(q);
          const inAbstract = (p.abstract || '').toLowerCase().includes(q);
          const inSubtopic = (p.subtopic || '').toLowerCase().includes(q);
          return inTitle || inAbstract || inSubtopic;
        });
      }

      if (items.length === 0) {
        listEl.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
            <div style="display:flex;justify-content:center;margin-bottom:0.75rem;opacity:0.6;">${icons.barChart || ""}</div>
            <h4 style="margin-bottom: 0.5rem; color: var(--brand-navy);">No presentation decks found</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.25rem;">
              You haven't prepared any presentation briefings for this filter. Start by proposing an academic keynote!
            </p>
            <button class="btn btn-primary btn-sm" onclick="switchPresenterSubview('present')">Present a Topic Now</button>
          </div>
        `;
        return;
      }

      listEl.innerHTML = items.map(p => `
        <div class="topic-bank-card">
          <div>
            <div class="topic-bank-top-meta">
              <div class="topic-bank-badges">
                <span class="badge-bank-cat">${p.categoryName || p.category}</span>
                <span class="badge badge-${p.status.toLowerCase().replace(' ', '')}">${p.status}</span>
                <span class="badge-bank-format">${p.format}</span>
              </div>
              <span class="topic-bank-author-tag">${icons.calendar} ${p.presentationDate || p.createdAt}</span>
            </div>

            <h3 class="topic-bank-card-title">${p.title}</h3>
            <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 600; margin-bottom: 0.6rem;">
              Focus Subtopic: ${p.subtopic}
            </div>
            <p class="topic-bank-card-desc">${p.abstract}</p>

            ${p.keyArguments && p.keyArguments.length ? `
              <div class="topic-bank-subtopics-box" style="margin-bottom: 1rem;">
                <div class="topic-bank-subtopics-heading">
                  <span>Core Theoretical Arguments (${p.keyArguments.length})</span>
                </div>
                <ul class="topic-bank-subtopics-list">
                  ${p.keyArguments.map(arg => `<li><span class="subtopic-bullet">›</span> <span>${arg}</span></li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>

          <div class="topic-bank-card-footer" style="flex-wrap: wrap; gap: 0.5rem;">
            ${p.slidesUrl ? `
              <a href="${p.slidesUrl}" target="_blank" class="btn btn-outline btn-sm">
                ${icons.folder} Open Slides Deck
              </a>
            ` : `
              <button class="btn btn-outline btn-sm" onclick="switchPresenterSubview('present')">
                ${icons.pen} Attach Slides
              </button>
            `}
            <a href="https://meet.google.com/gyd-dialogue" target="_blank" class="btn btn-primary btn-sm">
              ${icons.mic} Join Stage Room
            </a>
          </div>
        </div>
      `).join('');
    }

    if (searchInput) searchInput.oninput = filterDecks;
    if (statusFilter) statusFilter.onchange = filterDecks;
    filterDecks();
  }

  // Subview: Topic Bank for Presenters
  function renderPresenterTopicBank() {
    const searchInput = document.getElementById('presTopicBankSearch');
    const catFilter = document.getElementById('presTopicBankCategoryFilter');
    const countPill = document.getElementById('presTopicBankCount');
    const listEl = document.getElementById('presenterTopicBankList');
    if (!listEl) return;

    if (catFilter && catFilter.options.length <= 1) {
      catFilter.innerHTML = '<option value="all">All Categories</option>';
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catFilter.appendChild(opt);
      });
    }

    function filterAndRender() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const selectedCat = catFilter?.value || 'all';
      let bank = dataService.getTopicBank();

      if (selectedCat !== 'all') {
        bank = bank.filter(t => (t.categoryId || t.category) === selectedCat);
      }

      if (q) {
        bank = bank.filter(t => {
          const inTitle = (t.title || '').toLowerCase().includes(q);
          const inTitleAr = (t.titleAr || '').toLowerCase().includes(q);
          const inDesc = (t.description || '').toLowerCase().includes(q);
          const subList = t.subtopics || t.subTopics || [];
          return inTitle || inTitleAr || inDesc || subList.some(st => st.toLowerCase().includes(q));
        });
      }

      if (countPill) countPill.textContent = `${bank.length} Topics Available to Present`;

      if (bank.length === 0) {
        listEl.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; padding: 2rem; text-align: center;">No topics match your query.</div>`;
        return;
      }

      listEl.innerHTML = bank.map(t => {
        const subList = t.subtopics || t.subTopics || [];
        const isCustom = t.isCustom || t.isCustomAdded;
        const formats = t.recommendedFormats || (t.recommendedFormat ? [t.recommendedFormat] : []);
        const catName = t.categoryName || dataService.getCategoryName(t.categoryId || t.category);

        return `
          <div class="topic-bank-card">
            <div>
              <div class="topic-bank-top-meta">
                <div class="topic-bank-badges">
                  <span class="badge-bank-cat">${catName}</span>
                  ${isCustom ? `<span class="badge-bank-custom" style="display:inline-flex;align-items:center;gap:4px;">${icons.star} Community Approved</span>` : ''}
                  ${formats.length ? `<span class="badge-bank-format">${formats[0]}</span>` : ''}
                </div>
                ${t.dateAdded ? `<span class="topic-bank-author-tag">${t.dateAdded}</span>` : ''}
              </div>

              <h3 class="topic-bank-card-title">${t.title}</h3>
              ${t.titleAr ? `<div class="topic-bank-card-title-ar">${t.titleAr}</div>` : ''}
              <p class="topic-bank-card-desc">${t.description}</p>

              <div class="topic-bank-subtopics-box">
                <div class="topic-bank-subtopics-heading">
                  <span>Academic Research Angles (${subList.length})</span>
                </div>
                <ul class="topic-bank-subtopics-list">
                  ${subList.map(st => `<li><span class="subtopic-bullet">›</span> <span>${st}</span></li>`).join('')}
                </ul>
              </div>
            </div>

            <div class="topic-bank-card-footer">
              <span class="topic-bank-author-tag">By: ${t.addedBy || 'Academic Board'}</span>
              <button class="btn btn-primary btn-sm" onclick="window.presentTopicFromBank('${t.id}')">
                ${icons.mic} Present This Topic
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (searchInput) searchInput.oninput = filterAndRender;
    if (catFilter) catFilter.onchange = filterAndRender;
    filterAndRender();
  }

  window.presentTopicFromBank = function(topicId) {
    switchPresenterSubview('present');
    setTimeout(() => {
      renderPresenterPresentView(topicId);
      const form = document.getElementById('presenterTopicForm');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const item = dataService.getTopicBankItem(topicId);
      if (item) {
        showToast(`Pre-filled "${item.title}". Configure your keynote thesis and submit!`, 'normal');
      }
    }, 60);
  };

  // Subview: Assigned Speaking Sessions
  function renderPresenterSessionsList() {
    const listEl = document.getElementById('presenterAssignedSessionsList');
    if (!listEl) return;
    const sessions = dataService.getSessions();

    listEl.innerHTML = sessions.map(s => `
      <div class="card-panel" style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="badge badge-category">${s.categoryName || s.category}</span>
            <h3 style="margin: 0.35rem 0 0.2rem 0; color: var(--brand-navy);">${s.title}</h3>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              Session ${s.sessionNumber.toString().padStart(2, '0')} • <span style="display:inline-flex;align-items:center;gap:4px;">${icons.calendar} ${s.date}</span> • <span style="display:inline-flex;align-items:center;gap:4px;">${icons.clock} ${s.time} (${s.timezone || 'QST'})</span>
            </div>
          </div>
          <span class="badge badge-${s.status.toLowerCase()}">${s.status}</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-body); margin-bottom: 1rem;">${s.description || 'International structured youth dialogue with academic keynote presentation and floor delegate debate.'}</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; background: var(--bg-body); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.82rem; margin-bottom: 1rem;">
          <div><strong>Moderator:</strong> ${s.moderator?.name || 'TBD'} (${s.moderator?.country || 'INT'})</div>
          <div><strong>Confirmed Speakers:</strong> ${(s.speakers || []).map(sp => sp.name).join(', ') || 'Kofi Mensah'}</div>
          <div><strong>Duration:</strong> ${s.duration}</div>
          <div><strong>Format:</strong> ${s.format}</div>
        </div>

        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; flex-wrap: wrap;">
          <button class="btn btn-outline btn-sm" onclick="switchPresenterSubview('present')">
            ${icons.fileText} Prepare Topic Presentation
          </button>
          <a href="${s.meetingLink || 'https://meet.google.com/gyd-dialogue'}" target="_blank" class="btn btn-primary btn-sm">
            ${icons.mic} Launch Presenter Stage Link
          </a>
        </div>
      </div>
    `).join('');
  }

  // Subview: Presenter Profile
  // =========================================================================
  // UNIVERSAL DASHBOARD USER PROFILE & CREDENTIALS STUDIO
  // =========================================================================
  let pendingAvatarData = {};

  function renderProfileView(portalType) {
    const isTrialDeleted = (function() {
      try { return localStorage.getItem('gyd_trial_data_deleted') === 'true'; } catch (e) { return false; }
    })();

    const adminFallback = { 
      id: 'usr_admin_mubashir',
      name: 'Mubashir CP', 
      email: '3681mubashircp@gmail.com', 
      role: 'Coordinator', 
      department: 'Executive Leadership & Administration',
      country: 'Qatar', 
      flag: 'QA',
      bio: 'Executive Director & Chief Platform Administrator, Global Youth Dialogue & Exchange (GYDE).'
    };

    let user = authService.getCurrentUser();
    if (!user) {
      if (portalType === 'coordinator' || isTrialDeleted) {
        user = adminFallback;
      } else {
        user = adminFallback;
      }
    } else if (portalType === 'coordinator' && isTrialDeleted && user.email !== '3681mubashircp@gmail.com') {
      user = adminFallback;
    }

    const containerId = portalType === 'coordinator'
      ? 'coordProfileFormCard'
      : portalType === 'presenter'
        ? 'presenterProfileCard'
        : 'memberProfileFormCard';

    const container = document.getElementById(containerId);
    if (!container) return;

    const parts = (user.name || '').trim().split(' ');
    const firstName = user.firstName || parts[0] || '';
    const lastName = user.lastName || parts.slice(1).join(' ') || '';

    const roleTitle = portalType === 'coordinator'
      ? 'Lead Coordinator & Secretariat Administrator'
      : portalType === 'presenter'
        ? 'Accredited Academic Presenter & Keynote Fellow'
        : 'Active Community Member & Youth Delegate';

    container.innerHTML = `
      <form onsubmit="window.handleProfileSave(event, '${portalType}')" style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Header with Avatar & Basic Info -->
        <div class="profile-card-header">
          <div class="profile-avatar-wrap">
            <img id="${portalType}AvatarPreview" class="profile-avatar-img" src="${user.avatar || ''}" style="${user.avatar ? 'display:block;' : 'display:none;'}" alt="${user.name}">
            <div id="${portalType}AvatarInitial" class="profile-avatar-initial" style="${user.avatar ? 'display:none;' : 'display:flex;'}">
              <span class="avatar-letter">${getUserInitial(user.name)}</span>
            </div>
            ${user.country ? `<span id="${portalType}AvatarFlagBadge" class="profile-avatar-flag-badge" title="${user.country}">${icons.getFlag(user.country, user.flag)}</span>` : `<span id="${portalType}AvatarFlagBadge" class="profile-avatar-flag-badge" style="display:none;"></span>`}
          </div>

          <div style="flex: 1; min-width: 240px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
              <h3 style="margin: 0; color: var(--brand-navy); font-size: 1.35rem;">${user.name}</h3>
              <span class="badge badge-category" style="margin: 0;">${user.role || 'Member'}</span>
            </div>
            <div style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 0.75rem;">
              ${roleTitle} • <em>${user.country || 'Global'}</em>
            </div>

            <!-- Profile Picture Controls -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
              <label class="btn btn-outline btn-sm" style="cursor: pointer; margin: 0; gap: 5px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Change Profile Picture
                <input type="file" id="${portalType}PhotoUploadInput" accept="image/*" style="display: none;" onchange="window.handleAvatarFileChange(event, '${portalType}')">
              </label>
              <button type="button" class="btn btn-subtle btn-sm" onclick="window.promptAvatarUrl('${portalType}')" style="font-size: 0.8rem;">
                Enter Photo URL
              </button>
              ${user.avatar ? `
                <button type="button" class="btn btn-subtle btn-sm" onclick="window.removeAvatar('${portalType}')" style="color: #dc2626; font-size: 0.8rem;">
                  Remove Photo
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Section 1: Personal Details -->
        <div class="profile-section-box">
          <div class="profile-section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Personal Information</span>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="${portalType}FirstName">First Name</label>
              <input type="text" class="form-control" id="${portalType}FirstName" value="${firstName}" placeholder="First Name" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="${portalType}LastName">Last Name</label>
              <input type="text" class="form-control" id="${portalType}LastName" value="${lastName}" placeholder="Last Name" required>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" value="${user.email}" readonly style="background: var(--bg-subtle, #f1f5f9); cursor: not-allowed;">
              <span style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.2rem; display: block;">Primary registered login email (read-only)</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="${portalType}Country">Country of Residence / Chapter</label>
              <input type="text" class="form-control" id="${portalType}Country" value="${user.country || ''}" placeholder="e.g. India, Qatar, Brazil, Ghana" oninput="window.handleProfileCountryInput(this.value, '${portalType}')">
            </div>
          </div>
        </div>

        <!-- Section 2: Password Change -->
        <div class="profile-section-box" style="border-inline-start: 4px solid var(--accent-gold);">
          <div class="profile-section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Security &amp; Change Password</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 1.25rem 0;">
            Leave these fields empty if you do not wish to change your password.
          </p>

          <div class="form-group">
            <label class="form-label" for="${portalType}CurrentPass">Current Password</label>
            <input type="password" class="form-control" id="${portalType}CurrentPass" placeholder="Enter current password" autocomplete="current-password">
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="${portalType}NewPass">New Password</label>
              <input type="password" class="form-control" id="${portalType}NewPass" placeholder="Min. 6 characters" minlength="6" autocomplete="new-password">
            </div>
            <div class="form-group">
              <label class="form-label" for="${portalType}ConfirmPass">Confirm New Password</label>
              <input type="password" class="form-control" id="${portalType}ConfirmPass" placeholder="Re-enter new password" minlength="6" autocomplete="new-password">
            </div>
          </div>
        </div>

        <div id="${portalType}ProfileErrorAlert" style="display: none; padding: 0.75rem 1rem; border-radius: 8px; background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); color: #dc2626; font-size: 0.88rem; line-height: 1.45;"></div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="submit" class="btn btn-primary btn-lg" style="min-width: 220px;">
            Save Profile Changes
          </button>
        </div>
      </form>
    `;

    // Live update initial when first name input changes
    const fnInput = document.getElementById(`${portalType}FirstName`);
    if (fnInput) {
      fnInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        const letterSpan = document.querySelector(`#${portalType}AvatarInitial .avatar-letter`);
        if (letterSpan && val) {
          letterSpan.textContent = val.charAt(0).toUpperCase();
        }
      });
    }
  }

  window.renderProfileView = renderProfileView;

  window.handleAvatarFileChange = function(event, portalType) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      showToast('Image size exceeds 2.5MB limit. Please choose a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      pendingAvatarData[portalType] = dataUrl;
      const preview = document.getElementById(`${portalType}AvatarPreview`);
      const initialEl = document.getElementById(`${portalType}AvatarInitial`);
      if (preview) {
        preview.src = dataUrl;
        preview.style.display = 'block';
      }
      if (initialEl) initialEl.style.display = 'none';
      showToast('Photo selected! Click "Save Profile Changes" to apply.', 'normal');
    };
    reader.readAsDataURL(file);
  };

  window.promptAvatarUrl = function(portalType) {
    const url = prompt('Enter a direct image URL for your profile photo (e.g. https://...):');
    if (url && url.trim()) {
      pendingAvatarData[portalType] = url.trim();
      const preview = document.getElementById(`${portalType}AvatarPreview`);
      const initialEl = document.getElementById(`${portalType}AvatarInitial`);
      if (preview) {
        preview.src = url.trim();
        preview.style.display = 'block';
      }
      if (initialEl) initialEl.style.display = 'none';
      showToast('Photo URL set! Click "Save Profile Changes" to apply.', 'normal');
    }
  };

  window.removeAvatar = function(portalType) {
    pendingAvatarData[portalType] = '';
    const preview = document.getElementById(`${portalType}AvatarPreview`);
    const initialEl = document.getElementById(`${portalType}AvatarInitial`);
    if (preview) {
      preview.src = '';
      preview.style.display = 'none';
    }
    if (initialEl) {
      initialEl.style.display = 'flex';
      const fnInput = document.getElementById(`${portalType}FirstName`);
      const val = fnInput ? fnInput.value.trim() : '';
      const user = authService.getCurrentUser();
      const initChar = val ? val.charAt(0).toUpperCase() : getUserInitial(user?.name);
      const letter = initialEl.querySelector('.avatar-letter');
      if (letter) letter.textContent = initChar;
    }
    showToast('Photo removed! Click "Save Profile Changes" to apply.', 'normal');
  };

  window.handleProfileSave = function(event, portalType) {
    event.preventDefault();
    const user = authService.getCurrentUser();
    if (!user) {
      showToast('User session not found.', 'error');
      return;
    }

    const firstName = document.getElementById(`${portalType}FirstName`)?.value.trim();
    const lastName = document.getElementById(`${portalType}LastName`)?.value.trim();
    const country = document.getElementById(`${portalType}Country`)?.value.trim() || user.country;
    const currentPass = document.getElementById(`${portalType}CurrentPass`)?.value;
    const newPass = document.getElementById(`${portalType}NewPass`)?.value;
    const confirmPass = document.getElementById(`${portalType}ConfirmPass`)?.value;
    const errAlert = document.getElementById(`${portalType}ProfileErrorAlert`);

    if (errAlert) errAlert.style.display = 'none';

    if (!firstName || !lastName) {
      const msg = 'First name and last name are required.';
      if (errAlert) { errAlert.textContent = msg; errAlert.style.display = 'block'; }
      showToast(msg, 'error');
      return;
    }

    // Password validation if any password field touched
    if (currentPass || newPass || confirmPass) {
      if (!currentPass) {
        const msg = 'Please enter your current password to authorize a password change.';
        if (errAlert) { errAlert.textContent = msg; errAlert.style.display = 'block'; }
        showToast(msg, 'error');
        return;
      }
      const existingPass = user.password || 'password123';
      if (currentPass !== existingPass) {
        const msg = 'Current password is incorrect.';
        if (errAlert) { errAlert.textContent = msg; errAlert.style.display = 'block'; }
        showToast(msg, 'error');
        return;
      }
      if (!newPass || newPass.length < 6) {
        const msg = 'New password must be at least 6 characters long.';
        if (errAlert) { errAlert.textContent = msg; errAlert.style.display = 'block'; }
        showToast(msg, 'error');
        return;
      }
      if (newPass !== confirmPass) {
        const msg = 'New password and Confirm password do not match.';
        if (errAlert) { errAlert.textContent = msg; errAlert.style.display = 'block'; }
        showToast(msg, 'error');
        return;
      }
      user.password = newPass;
    }

    // Update names & metadata
    user.firstName = firstName;
    user.lastName = lastName;
    user.name = `${firstName} ${lastName}`;
    user.country = country;
    if (window.icons && window.icons.resolveCountryCode) {
      user.flag = window.icons.resolveCountryCode(country) || user.flag;
    }

    // Update avatar if pending change exists
    if (pendingAvatarData[portalType] !== undefined) {
      user.avatar = pendingAvatarData[portalType];
    }

    // Persist in dataService.db.users
    if (dataService.db && Array.isArray(dataService.db.users)) {
      const dbUser = dataService.db.users.find(u => u.id === user.id || (u.email && u.email.toLowerCase() === user.email.toLowerCase()));
      if (dbUser) {
        dbUser.name = user.name;
        dbUser.firstName = user.firstName;
        dbUser.lastName = user.lastName;
        dbUser.country = user.country;
        if (user.avatar !== undefined) dbUser.avatar = user.avatar;
        if (user.password) dbUser.password = user.password;
        dataService.saveDatabase();
      }
    }

    // Also persist in INITIAL_DATABASE if present
    if (typeof INITIAL_DATABASE !== 'undefined' && Array.isArray(INITIAL_DATABASE.users)) {
      const seedUser = INITIAL_DATABASE.users.find(u => u.id === user.id || (u.email && u.email.toLowerCase() === user.email.toLowerCase()));
      if (seedUser) {
        seedUser.name = user.name;
        seedUser.country = user.country;
        if (user.avatar !== undefined) seedUser.avatar = user.avatar;
        if (user.password) seedUser.password = user.password;
      }
    }

    authService.saveSession(user);

    // Refresh sidebars immediately
    if (typeof renderMemberPortal === 'function' && document.getElementById('viewMember')?.style.display !== 'none') {
      renderMemberPortal();
    }
    if (typeof renderPresenterPortal === 'function' && document.getElementById('viewPresenter')?.style.display !== 'none') {
      renderPresenterPortal();
    }
    if (typeof renderCoordinatorPortal === 'function' && document.getElementById('viewCoordinator')?.style.display !== 'none') {
      renderCoordinatorPortal();
    }

    // Clear password inputs
    const cPass = document.getElementById(`${portalType}CurrentPass`);
    const nPass = document.getElementById(`${portalType}NewPass`);
    const cfPass = document.getElementById(`${portalType}ConfirmPass`);
    if (cPass) cPass.value = '';
    if (nPass) nPass.value = '';
    if (cfPass) cfPass.value = '';

    renderProfileView(portalType);
    showToast('Profile and security credentials updated successfully!', 'success');
  };

  // Live profile country input handler for avatar flag badge
  window.handleProfileCountryInput = function(val, portalType) {
    const badge = document.getElementById(`${portalType}AvatarFlagBadge`);
    if (!badge) return;
    const trimmed = (val || '').trim();
    if (!trimmed) {
      badge.style.display = 'none';
    } else {
      badge.style.display = 'flex';
      badge.title = trimmed;
      if (window.icons && window.icons.getFlag) {
        badge.innerHTML = window.icons.getFlag(trimmed);
      }
    }
  };


  // Presenter Category Change Handler for "Other" category
  window.handlePresCategoryChange = function(selectEl) {
    const wrap = document.getElementById('presCustomCategoryWrap');
    const customInput = document.getElementById('presCustomCategory');
    if (!wrap) return;
    if (selectEl.value === 'Other') {
      wrap.style.display = 'block';
      if (customInput) {
        customInput.required = true;
        customInput.focus();
      }
    } else {
      wrap.style.display = 'none';
      if (customInput) {
        customInput.required = false;
      }
    }
  };

  // Subview: Presenter Academic Writings Studio
  function renderPresenterWritingsView() {
    const user = authService.getCurrentUser() || { name: 'Mubashir CP', id: 'usr_admin_mubashir', email: '3681mubashircp@gmail.com', role: 'Coordinator', country: 'India', flag: 'IN' };
    const listEl = document.getElementById('presenterMyWritingsList');
    const badgeEl = document.getElementById('presMyWritingsBadge');
    const authorRoleInput = document.getElementById('presNewAuthorRole');
    const authorNameInput = document.getElementById('presNewAuthorName');

    if (authorRoleInput && !authorRoleInput.value) {
      authorRoleInput.value = 'Accredited Presenter & Research Fellow';
    }
    if (authorNameInput && !authorNameInput.value) {
      authorNameInput.value = user.name || '';
    }

    const allWritings = dataService.getWritings() || [];
    const myWritings = allWritings.filter(w =>
      (w.authorId && w.authorId === user.id) ||
      (w.authorEmail && user.email && w.authorEmail.toLowerCase() === user.email.toLowerCase()) ||
      (w.author && user.name && w.author.toLowerCase().includes(user.name.toLowerCase()))
    );

    if (badgeEl) {
      badgeEl.textContent = `${myWritings.length} Paper${myWritings.length === 1 ? '' : 's'}`;
    }

    if (!listEl) return;

    if (myWritings.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted); background: var(--bg-body); border-radius: var(--radius-md);">
          <div style="display:flex;justify-content:center;margin-bottom:0.6rem;opacity:0.6;">${icons.pen || ""}</div>
          <h4 style="margin: 0 0 0.4rem 0; color: var(--brand-navy);">No Academic Papers Submitted Yet</h4>
          <p style="font-size: 0.88rem; max-width: 480px; margin: 0 auto 1.25rem auto;">
            As an accredited Presenter, you can author in-depth research papers, policy syntheses, and debate dossiers.
          </p>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('presenterWritingFormCard')?.scrollIntoView({ behavior: 'smooth' })">
            Open Authoring Studio Below ↓
          </button>
        </div>
      `;
      return;
    }

    listEl.innerHTML = myWritings.map(w => {
      const isUnderReview = w.status === 'Under Review' || w.status === 'Pending' || w.status === 'Draft';
      const statusBadge = isUnderReview
        ? `<span class="badge" style="background: rgba(234, 179, 8, 0.15); color: #b45309; border: 1px solid rgba(234, 179, 8, 0.4); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">${icons.hourglass} Under Review by Secretariat</span>`
        : `<span class="badge" style="background: var(--presenter-badge-bg); color: var(--presenter-badge-text); border: 1px solid var(--presenter-badge-border); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">${icons.check} Approved & Live in Member Dashboard</span>`;

      return `
        <div class="writing-card" style="margin-bottom: 1.25rem; padding: 1.5rem; border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              ${statusBadge}
              <span class="badge badge-category">${w.categoryName || w.category}</span>
            </div>
            <span style="font-size: 0.82rem; color: var(--text-muted);">${w.publicationDate || 'Submitted recently'}</span>
          </div>

          <h3 class="serif-text" style="font-size: 1.3rem; margin: 0 0 0.5rem 0; color: var(--brand-navy);">${w.title}</h3>
          <p style="font-size: 0.88rem; color: var(--text-body); line-height: 1.55; margin: 0 0 1rem 0;">${w.intro}</p>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-top: 1px solid var(--border-light); padding-top: 0.75rem;">
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              <strong>Author:</strong> ${w.author} • <em>${w.authorRole || 'Presenter'}</em>
            </div>
            <button class="btn btn-navy btn-sm" onclick="window.openFullAcademicPaper('${w.id}')">
              ${icons.book} Read Full Dossier
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.renderPresenterWritingsView = renderPresenterWritingsView;

  // Handle Presenter Writing Submission
  window.handlePresenterWritingSubmit = function(event) {
    event.preventDefault();
    const user = authService.getCurrentUser() || { name: 'Mubashir CP', id: 'usr_admin_mubashir', email: '3681mubashircp@gmail.com', role: 'Coordinator', country: 'India', flag: 'IN' };

    const title = document.getElementById('presNewTitle')?.value.trim();
    const categorySelect = document.getElementById('presNewCategory')?.value;
    const customCategory = document.getElementById('presCustomCategory')?.value.trim();
    const finalCategory = (categorySelect === 'Other' && customCategory) ? customCategory : (categorySelect || 'General Academic');
    const authorRole = document.getElementById('presNewAuthorRole')?.value.trim() || 'Accredited Presenter';
    const authorName = document.getElementById('presNewAuthorName')?.value.trim() || user.name || 'Accredited Presenter';
    const excerpt = document.getElementById('presNewExcerpt')?.value.trim();
    const totalContent = document.getElementById('presNewTotalContent')?.value.trim();
    const sources = document.getElementById('presNewSources')?.value.trim() || 'Global Youth Dialogue Research Archives';

    if (!title || !finalCategory || !authorName || !excerpt || !totalContent) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const newWriting = dataService.createWriting({
      title,
      category: finalCategory,
      categoryName: finalCategory,
      author: authorName,
      authorRole,
      authorId: user.id,
      authorEmail: user.email,
      status: 'Under Review', // Requires admin approval!
      intro: excerpt,
      totalContent,
      sources
    });

    // Also dispatch notification to Coordinator and Author
    if (dataService.db && dataService.db.notifications) {
      dataService.db.notifications.unshift({
        id: 'notif_' + Date.now().toString(36) + '_coord',
        title: 'New Academic Paper Pending Review',
        message: `${authorName} submitted "${title}" for coordinator review and approval.`,
        type: 'topic',
        read: false,
        time: 'Just now',
        targetView: 'writings',
        targetId: newWriting.id,
        recipientRole: 'Coordinator'
      });
      dataService.db.notifications.unshift({
        id: 'notif_' + Date.now().toString(36) + '_auth',
        title: 'Academic Paper Under Review',
        message: `Your paper "${title}" has been submitted for editorial review by the Secretariat.`,
        type: 'writing',
        read: false,
        time: 'Just now',
        targetView: 'writings',
        targetId: newWriting.id,
        recipientEmail: user.email ? user.email.toLowerCase().trim() : '',
        recipientUserId: user.id
      });
      dataService.saveDatabase();
    }

    event.target.reset();
    const customWrap = document.getElementById('presCustomCategoryWrap');
    if (customWrap) customWrap.style.display = 'none';

    showToast(`Academic paper "${title}" submitted! It is now in the Secretariat review queue.`, 'success');
    renderPresenterWritingsView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // VIEW: COORDINATOR PORTAL RENDERING
  // =========================================================================
  function renderCoordinatorPortal() {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'Coordinator') return;

    // Sidebar Profile
    const profileCard = document.getElementById('coordSidebarProfile');
    if (profileCard) {
      const initial = getUserInitial(user.name);
      profileCard.innerHTML = `
        <div class="portal-user-avatar avatar-coord" title="${user.name}">${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : initial}</div>
        <div class="portal-user-info">
          <span class="portal-user-name">${user.name}</span>
          <span class="portal-user-role">Founding Coordinator (${user.country})</span>
        </div>
      `;
    }

    if (window.GYD_DATA && typeof window.GYD_DATA.syncRemoteApplications === 'function') {
      window.GYD_DATA.syncRemoteApplications();
    }
    if (!window._coordSyncInterval) {
      window._coordSyncInterval = setInterval(() => {
        const currentUser = (typeof authService !== 'undefined') ? authService.getCurrentUser() : null;
        if (currentUser && currentUser.role === 'Coordinator' && dataService && typeof dataService.syncRemoteApplications === 'function') {
          dataService.syncRemoteApplications();
        }
      }, 20000);
    }
    bindCoordinatorNavigation();
    switchCoordSubview(currentCoordSubview);
  }

  function bindCoordinatorNavigation() {
    document.querySelectorAll('#viewCoordinator .sidebar-item-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-coord-target');
        if (target) switchCoordSubview(target);
      };
    });

    document.querySelectorAll('#coordMobileTabBar .mobile-tab-btn, #viewCoordinator .mobile-tab-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-coord-target');
        if (target) switchCoordSubview(target);
      };
    });

    document.querySelectorAll('[data-coord-nav]').forEach(el => {
      el.onclick = () => {
        const target = el.getAttribute('data-coord-nav');
        if (target) switchCoordSubview(target);
      };
    });

    const coordLogout = document.getElementById('coordLogoutBtn');
    if (coordLogout) {
      coordLogout.onclick = () => {
        authService.logout();
        navigateToPortal('public');
        showToast('Signed out from Coordinator Workspace.');
      };
    }

    const quickNewSession = document.getElementById('coordQuickNewSessionBtn');
    if (quickNewSession) quickNewSession.onclick = () => switchCoordSubview('sessions');

    const quickNewTopic = document.getElementById('coordQuickNewTopicBtn');
    if (quickNewTopic) {
      quickNewTopic.onclick = () => {
        switchCoordSubview('topic-bank');
        setTimeout(() => {
          window.openCoordAddTopicBankModal();
        }, 80);
      };
    }

    // Delete Trial Data sidebar/dashboard button — handled globally, no need to re-bind here
  }

  function switchCoordSubview(targetName, pushHistory = true) {
    currentCoordSubview = targetName;

    // Update active class on sidebar
    document.querySelectorAll('#viewCoordinator .sidebar-item-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-coord-target') === targetName);
    });

    // Update active class on mobile tabs
    document.querySelectorAll('#coordMobileTabBar .mobile-tab-btn, #viewCoordinator .mobile-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-coord-target') === targetName);
    });

    // Hide all
    document.querySelectorAll('#coordContentArea .portal-subview').forEach(view => {
      view.style.display = 'none';
    });

    const targetMap = {
      'dashboard': 'subviewCoordDashboard',
      'community': 'subviewCoordCommunity',
      'topic-bank': 'subviewCoordTopicBank',
      'topics': 'subviewCoordTopics',
      'sessions': 'subviewCoordSessions',
      'writings': 'subviewCoordWritings',
      'summary-studio': 'subviewCoordWritings',
      'feedback': 'subviewCoordFeedback',
      'applications': 'subviewCoordApplications',
      'team': 'subviewCoordTeam',
      'countries': 'subviewCoordCountries',
      'media': 'subviewCoordMedia',
      'profile': 'subviewCoordProfile'
    };

    const targetEl = document.getElementById(targetMap[targetName]);
    if (targetEl) targetEl.style.display = 'block';

    if (targetName === 'dashboard' || targetName === 'applications' || targetName === 'community') {
      if (dataService && typeof dataService.syncRemoteApplications === 'function') {
        dataService.syncRemoteApplications().then(() => {
          if (currentCoordSubview === 'applications' && typeof renderCoordApplicationsList === 'function') renderCoordApplicationsList();
          if (currentCoordSubview === 'dashboard' && typeof renderCoordDashboardContent === 'function') renderCoordDashboardContent();
          if (currentCoordSubview === 'community' && typeof renderCoordCommunityRoster === 'function') renderCoordCommunityRoster();
        }).catch(() => {});
      }
    }

    if (targetName === 'dashboard') renderCoordDashboardContent();
    if (targetName === 'community') renderCoordCommunityRoster();
    if (targetName === 'topic-bank') renderCoordTopicBank();
    if (targetName === 'topics') renderCoordTopicsList();
    if (targetName === 'sessions') prepareCoordSessionForm();
    if (targetName === 'writings' || targetName === 'summary-studio') prepareCoordWritingStudio();
    if (targetName === 'feedback') renderCoordFeedbackList();
    if (targetName === 'applications') renderCoordApplicationsList();
    if (targetName === 'team') renderCoordTeamList();
    if (targetName === 'countries') renderCountryChapters();
    if (targetName === 'media') renderMediaKits();
    if (targetName === 'profile') renderProfileView('coordinator');

    if (pushHistory && !isNavigatingBack && activePortal === 'coordinator') {
      try {
        history.pushState({ type: 'portalSub', portal: 'coordinator', subview: targetName }, '', `#coordinator/${targetName}`);
      } catch (e) {}
    }

    window.scrollTo(0, 0);
  }
  window.switchCoordSubview = switchCoordSubview;

  window.refreshCoordApplications = async function() {
    const btn = document.getElementById('coordSyncAppsBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span style="display:inline-block; width:12px; height:12px; border:2px solid currentColor; border-right-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-inline-end:5px;"></span> Syncing...`;
    }
    try {
      if (dataService && typeof dataService.syncRemoteApplications === 'function') {
        await dataService.syncRemoteApplications();
      }
      if (typeof renderCoordApplicationsList === 'function') renderCoordApplicationsList();
      if (typeof renderCoordDashboardContent === 'function') renderCoordDashboardContent();
      showToast('Cloud applications synchronized successfully!', 'success');
    } catch (e) {
      showToast('Could not sync cloud applications: ' + (e.message || 'Network error'), 'warning');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:middle; margin-inline-end:5px;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> Sync Cloud Applications`;
      }
    }
  };

  // --- Subview: Coordinator Dashboard ---
  function renderCoordDashboardContent() {
    const users = dataService.getUsers();
    const apps = dataService.getApplications().filter(a => a.status === 'Pending');
    const presApps = (dataService.getPresenterApplications ? dataService.getPresenterApplications() : []).filter(a => a.status === 'Pending');
    const topics = dataService.getTopics();
    const writings = dataService.getWritings();

    // Update counters (includes both member apps + presenter requests)
    document.getElementById('kpiMembersCount').textContent = users.length;
    document.getElementById('kpiPendingAppsCount').textContent = apps.length + presApps.length;
    document.getElementById('kpiTopicsCount').textContent = topics.length;
    document.getElementById('kpiWritingsCount').textContent = writings.length;

    // Pending Apps list (Presenter requests highlighted first, followed by member signups)
    const appsList = document.getElementById('coordDashboardAppsList');
    let html = '';

    if (presApps.length > 0) {
      html += presApps.slice(0, 3).map(pApp => `
        <div class="application-item" style="border-inline-start: 4px solid var(--presenter-border); background: var(--presenter-subtle); margin-bottom: 0.65rem; border-radius: var(--radius-md); padding: 0.85rem; border: 1px solid var(--presenter-card-border);">
          <div class="app-meta">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="badge presenter-status-badge" style="font-size: 0.72rem; padding: 2px 7px; font-weight: 700;">${icons.mic} Presenter Request</span>
              <strong style="color: var(--brand-navy); font-size: 0.92rem;">${pApp.name} (${pApp.country})</strong>
            </div>
            <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 600;">Proposed: "${pApp.proposedTopic}"</div>
            <p class="app-motivation" style="font-size: 0.8rem; margin: 0.25rem 0; color: var(--text-body);">"${pApp.statementOfIntent || pApp.researchExperience}"</p>
          </div>
          <div class="app-actions" style="margin-top: 0.4rem; display: flex; gap: 0.5rem;">
            <button class="btn btn-be-presenter btn-sm" onclick="window.approvePresenterApp('${pApp.id}')">${icons.check} Approve Presenter</button>
            <button class="btn btn-outline btn-sm" onclick="window.rejectPresenterApp('${pApp.id}')">${icons.x} Decline</button>
          </div>
        </div>
      `).join('');
    }

    if (apps.length > 0) {
      html += apps.slice(0, 3).map(app => `
        <div class="application-item" style="margin-bottom: 0.65rem;">
          <div class="app-meta">
            <span class="app-name">${app.name} (${app.country})</span>
            <span class="app-sub">${app.debateExperience}</span>
            <p class="app-motivation">"${app.motivation}"</p>
          </div>
          <div class="app-actions">
            <button class="btn btn-primary btn-sm" onclick="window.approveApp('${app.id}')">${icons.check} Approve</button>
            <button class="btn btn-outline btn-sm" onclick="window.rejectApp('${app.id}')">${icons.x} Decline</button>
          </div>
        </div>
      `).join('');
    }

    if (!html) {
      html = `<div style="color: var(--text-muted); font-size: 0.88rem; padding: 0.5rem 0;">No pending member or presenter applications right now.</div>`;
    }
    appsList.innerHTML = html;

    // Topics Under Review list
    const reviewTopics = topics.filter(t => t.status === 'Proposed' || t.status === 'Under Review');
    const topicsList = document.getElementById('coordDashboardTopicsList');
    if (reviewTopics.length === 0) {
      topicsList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem; padding: 0.5rem 0;">All topics have been reviewed.</div>`;
    } else {
      topicsList.innerHTML = reviewTopics.slice(0, 5).map(t => `
        <div style="padding: 0.85rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 0.65rem; display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 220px;">
            <div style="font-weight: 600; color: var(--brand-navy); font-size: 0.95rem;">${t.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${t.categoryName || 'General'} • Proposed by ${t.proposedBy || 'Member'}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.45rem;">
            <button class="btn btn-primary btn-sm" onclick="window.approveTopic('${t.id}')">
              ${icons.check || ''} Approve
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.rejectTopic('${t.id}')">
              ${icons.x || ''} Decline
            </button>
            <button class="btn btn-subtle btn-sm" onclick="document.querySelector('[data-coord-target=topics]').click()" title="Inspect Motion">
              Details
            </button>
          </div>
        </div>
      `).join('');
    }

    // Announcement Modal Handler
    const annBtn = document.getElementById('coordNewAnnounceBtn');
    if (annBtn) {
      annBtn.onclick = () => {
        const title = prompt('Enter Announcement Title:');
        if (!title) return;
        const content = prompt('Enter Announcement Content:');
        if (!content) return;

        const user = authService.getCurrentUser();
        dataService.addAnnouncement({
          title,
          content,
          category: 'Official Notice',
          priority: 'Normal',
          author: `${user.name} (${user.country})`
        });

        showToast('Announcement broadcasted to all community members!', 'success');
        renderCoordDashboardContent();
      };
    }
  }
  window.renderCoordDashboardContent = renderCoordDashboardContent;

  // --- Subview: Coordinator Topics Management ---
  function renderCoordTopicsList() {
    const listEl = document.getElementById('coordTopicsFullList');
    const searchInput = document.getElementById('coordTopicSearch');
    const statusFilter = document.getElementById('coordTopicStatusFilter');

    function applyTopicFilters() {
      let topics = dataService.getTopics();
      const q = (searchInput?.value || '').toLowerCase();
      const status = statusFilter?.value;

      if (q) {
        topics = topics.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
      }

      if (status && status !== 'all') {
        topics = topics.filter(t => t.status === status);
      }

      listEl.innerHTML = topics.map(t => `
        <div class="card-panel" style="margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
            <div>
              <span class="badge badge-category">${t.categoryName}</span>
              <h4 style="margin: 0.35rem 0;">${t.title}</h4>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              ${(t.status === 'Proposed' || t.status === 'Under Review') ? `
                <button class="btn btn-primary btn-sm" onclick="window.approveTopic('${t.id}')">${icons.check || ''} Approve</button>
                <button class="btn btn-outline btn-sm" onclick="window.rejectTopic('${t.id}')">${icons.x || ''} Decline</button>
              ` : ''}
              <select class="form-control" style="width: auto; padding: 0.35rem 0.65rem; font-size: 0.82rem;" onchange="window.updateTopicStatus('${t.id}', this.value)">
                <option value="Proposed" ${t.status === 'Proposed' ? 'selected' : ''}>Proposed</option>
                <option value="Under Review" ${t.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                <option value="Approved" ${t.status === 'Approved' ? 'selected' : ''}>Approved</option>
                <option value="Declined" ${t.status === 'Declined' || t.status === 'Rejected' ? 'selected' : ''}>Declined</option>
                <option value="Scheduled" ${t.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                <option value="Completed" ${t.status === 'Completed' ? 'selected' : ''}>Completed</option>
              </select>
            </div>
          </div>
          ${t.motion ? `<div class="motion-quote" style="margin-bottom: 0.75rem;"><strong>Motion:</strong> ${t.motion}</div>` : ''}
          <p style="font-size: 0.88rem; color: var(--text-body); margin-bottom: 0.85rem;">${t.description}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: var(--bg-body); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.82rem;">
            <div><strong>Assigned Speaker:</strong> ${t.assignedSpeaker || 'Unassigned'}</div>
            <div><strong>Assigned Moderator:</strong> ${t.assignedModerator || 'Unassigned'}</div>
            <div style="grid-column: 1/-1;"><strong>Research Notes:</strong> ${t.researchNotes || 'None yet.'}</div>
          </div>
        </div>
      `).join('');
    }

    searchInput.oninput = applyTopicFilters;
    statusFilter.onchange = applyTopicFilters;
    applyTopicFilters();

    // Add Topic Modal Button
    const addTopicBtn = document.getElementById('coordAddTopicModalBtn');
    if (addTopicBtn) {
      addTopicBtn.onclick = () => {
        window.openCoordAddTopicBankModal();
      };
    }
  }

  // --- Subview: Coordinator Academic Topic Bank Repository ---
  function renderCoordTopicBank() {
    const bank = dataService.getTopicBank();
    const categories = dataService.getCategories();

    // KPIs
    const totalCountEl = document.getElementById('kpiBankTotalCount');
    const catCountEl = document.getElementById('kpiBankCategoriesCount');
    const customCountEl = document.getElementById('kpiBankCustomCount');

    if (totalCountEl) totalCountEl.textContent = bank.length;
    if (catCountEl) {
      const distinctCats = new Set(bank.map(t => t.categoryId || t.category));
      catCountEl.textContent = distinctCats.size;
    }
    if (customCountEl) {
      const customCount = bank.filter(t => t.isCustom || t.isCustomAdded || t.addedBy !== 'Academic Advisory Board').length;
      customCountEl.textContent = customCount;
    }

    // Category filter setup
    const catFilter = document.getElementById('coordTopicBankCategoryFilter');
    if (catFilter && catFilter.options.length <= 1) {
      catFilter.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catFilter.appendChild(opt);
      });
    }

    const searchInput = document.getElementById('coordTopicBankSearch');
    const listEl = document.getElementById('coordTopicBankList');

    function filterAndRenderCoordBank() {
      if (!listEl) return;
      const q = (searchInput?.value || '').toLowerCase().trim();
      const selectedCat = catFilter?.value || 'all';

      let items = dataService.getTopicBank();
      if (selectedCat !== 'all') {
        items = items.filter(t => (t.categoryId || t.category) === selectedCat);
      }
      if (q) {
        items = items.filter(t => {
          const inTitle = (t.title || '').toLowerCase().includes(q);
          const inTitleAr = (t.titleAr || '').toLowerCase().includes(q);
          const inDesc = (t.description || '').toLowerCase().includes(q);
          const subList = t.subtopics || t.subTopics || [];
          const inSubtopics = subList.some(st => st.toLowerCase().includes(q));
          return inTitle || inTitleAr || inDesc || inSubtopics;
        });
      }

      if (items.length === 0) {
        listEl.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
            <div style="display:flex;justify-content:center;margin-bottom:0.75rem;opacity:0.6;">${icons.book || ""}</div>
            <h4 style="margin-bottom: 0.5rem; color: var(--brand-navy);">No topics found</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.25rem;">
              No topics in the bank match your search criteria. Add a new topic directly to the bank.
            </p>
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('coordAddBankTopicBtn').click()">+ Add Topic to Bank</button>
          </div>
        `;
        return;
      }

      listEl.innerHTML = items.map(t => {
        const subList = t.subtopics || t.subTopics || [];
        const isCustom = t.isCustom || t.isCustomAdded;
        const formats = t.recommendedFormats || (t.recommendedFormat ? [t.recommendedFormat] : []);
        const catName = t.categoryName || dataService.getCategoryName(t.categoryId || t.category);

        return `
          <div class="topic-bank-card">
            <div>
              <div class="topic-bank-top-meta">
                <div class="topic-bank-badges">
                  <span class="badge-bank-cat">${catName}</span>
                  ${isCustom ? `<span class="badge-bank-custom" style="display:inline-flex;align-items:center;gap:4px;">${icons.star} Community Approved</span>` : ''}
                  ${formats.length ? `<span class="badge-bank-format">${formats[0]}</span>` : ''}
                </div>
                ${t.dateAdded ? `<span class="topic-bank-author-tag">${t.dateAdded}</span>` : ''}
              </div>

              <h3 class="topic-bank-card-title">${t.title}</h3>
              ${t.titleAr ? `<div class="topic-bank-card-title-ar">${t.titleAr}</div>` : ''}
              <p class="topic-bank-card-desc">${t.description}</p>

              <div class="topic-bank-subtopics-box">
                <div class="topic-bank-subtopics-heading">
                  <span>Academic Research Angles & Subtopics (${subList.length})</span>
                </div>
                <ul class="topic-bank-subtopics-list">
                  ${subList.map(st => `
                    <li><span class="subtopic-bullet">›</span> <span>${st}</span></li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <div class="topic-bank-card-footer">
              <span class="topic-bank-author-tag">By: ${t.addedBy || 'Academic Board'}</span>
              <button class="btn btn-navy btn-sm" onclick="window.scheduleTopicFromBank('${t.id}')">
                ${icons.calendar} Schedule Session
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (searchInput) searchInput.oninput = filterAndRenderCoordBank;
    if (catFilter) catFilter.onchange = filterAndRenderCoordBank;

    filterAndRenderCoordBank();
    bindCoordAddTopicBankModal();
  }

  function bindCoordAddTopicBankModal() {
    const addBtn = document.getElementById('coordAddBankTopicBtn');
    const closeBtn = document.getElementById('closeModalCoordAddTopicBank');
    const cancelBtn = document.getElementById('cancelCoordAddTopicBank');
    const form = document.getElementById('coordAddTopicBankForm');

    if (addBtn) {
      addBtn.onclick = () => window.openCoordAddTopicBankModal();
    }

    if (closeBtn) closeBtn.onclick = () => window.closeCoordAddTopicBankModal();
    if (cancelBtn) cancelBtn.onclick = () => window.closeCoordAddTopicBankModal();

    if (form) {
      form.onsubmit = window.handleCoordAddTopicBankSubmit;
    }
  }

  window.scheduleTopicFromBank = function(bankId) {
    const item = dataService.getTopicBankItem(bankId);
    if (!item) return;

    let existing = dataService.getTopics().find(tp => tp.title.toLowerCase().trim() === item.title.toLowerCase().trim());
    if (!existing) {
      existing = dataService.addTopic({
        title: item.title,
        category: item.categoryId || item.category,
        motion: item.title,
        description: item.description,
        status: 'Approved',
        proposedBy: 'Secretariat Bank Direct Schedule'
      });
    }

    switchCoordSubview('sessions');
    setTimeout(() => {
      const topicSelect = document.getElementById('csTopicSelect');
      if (topicSelect) {
        topicSelect.value = existing.id;
      }
      const titleInput = document.getElementById('csTitle');
      if (titleInput) {
        titleInput.value = `Dialogue: ${item.title}`;
      }
      showToast(`Selected "${item.title}" for session scheduling.`, 'normal');
    }, 60);
  };

  // --- Subview: Coordinator Session Creation ---
  function renderCoordSessionDynamicFields(category) {
    const container = document.getElementById('csDynamicCategoryFields');
    const badge = document.getElementById('csCategoryBadge');
    if (!container) return;

    const users = dataService.getUsers();
    const presenters = users.filter(u => u.role === 'Presenter' || u.role === 'Speaker');
    const allUsersOptions = users.map(u => `<option value="${u.name}">${u.name} (${u.country}) - ${u.role}</option>`).join('');
    const presenterOptions = (presenters.length > 0 ? presenters : users).map(u => `<option value="${u.name}">${u.name} (${u.country}) - Accredited Presenter</option>`).join('');

    if (category === 'Topic Presentation') {
      if (badge) {
        badge.textContent = 'Topic Presentation';
        badge.style.background = 'var(--presenter-badge-bg)';
        badge.style.color = 'var(--presenter-badge-text)';
        badge.style.borderColor = 'var(--presenter-badge-border)';
      }
      container.innerHTML = `
        <div style="font-weight: 600; color: var(--presenter-title); font-size: 0.9rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
          Topic Presentation Configuration (Presenter & Moderator)
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="csPresenterSelect">Accredited Presenter *</label>
            <select class="form-control" id="csPresenterSelect" required>
              ${presenterOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="csPresenterModerator">Session Moderator *</label>
            <select class="form-control" id="csPresenterModerator" required>
              ${allUsersOptions}
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" for="csPresentationPaperUrl">Slide Deck / Research Dossier Link (Optional)</label>
          <input type="url" class="form-control" id="csPresentationPaperUrl" placeholder="https://docs.google.com/presentation/d/... or research link">
        </div>
      `;
    } else if (category === 'Discussions') {
      if (badge) {
        badge.innerHTML = (icons.messageSquare || '') + ' Discussions';
        badge.style.background = 'rgba(37, 99, 235, 0.12)';
        badge.style.color = '#2563eb';
        badge.style.borderColor = 'rgba(37, 99, 235, 0.3)';
      }
      container.innerHTML = `
        <div style="font-weight: 600; color: #2563eb; font-size: 0.9rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          Discussions Configuration (Moderator & Key Speakers)
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="csDiscussionModerator">Session Moderator *</label>
            <select class="form-control" id="csDiscussionModerator" required>
              ${allUsersOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="csKeySpeakers">Key Speakers (If any, comma-separated)</label>
            <input type="text" class="form-control" id="csKeySpeakers" placeholder="e.g. Amara Chen (Singapore), Kofi Mensah (Ghana)">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" for="csDiscussionQuestions">Discussion Prompts & Provocations</label>
          <textarea class="form-control" id="csDiscussionQuestions" rows="2" placeholder="e.g. 1. What structural barriers hinder reform? 2. How can youth delegates bridge policy divides?"></textarea>
        </div>
      `;
    } else if (category === 'Guest Talk') {
      if (badge) {
        badge.innerHTML = (icons.award || '') + ' Guest Talk';
        badge.style.background = 'rgba(147, 51, 234, 0.12)';
        badge.style.color = '#9333ea';
        badge.style.borderColor = 'rgba(147, 51, 234, 0.3)';
      }
      container.innerHTML = `
        <div style="font-weight: 600; color: #9333ea; font-size: 0.9rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Distinguished Guest Talk Configuration (Photo, Name & Bio)
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="csGuestName">Guest Speaker Full Name & Honorific *</label>
            <input type="text" class="form-control" id="csGuestName" placeholder="e.g. Ambassador Dr. Tariq Karim" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="csGuestHost">Session Host / Introductory Moderator *</label>
            <select class="form-control" id="csGuestHost" required>
              ${allUsersOptions}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
            <span>Upload Image of Guest (Portrait / Photo) *</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Instant preview supported</span>
          </label>
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <div id="csGuestPhotoPreviewWrap" style="width: 72px; height: 72px; border-radius: 50%; overflow: hidden; background: #e2e8f0; border: 2.5px solid #9333ea; box-shadow: 0 4px 10px rgba(147, 51, 234, 0.2); flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
              <img id="csGuestPhotoPreview" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" alt="Guest Preview" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 0.4rem;">
              <input type="file" class="form-control" id="csGuestPhotoFile" accept="image/*" style="padding: 0.35rem; font-size: 0.85rem;">
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <input type="text" class="form-control" id="csGuestPhotoUrl" placeholder="Or paste direct image URL (https://...)" value="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" style="font-size: 0.82rem; padding: 0.35rem 0.6rem;">
              </div>
            </div>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" for="csGuestBio">Guest Personal Biography & Background *</label>
          <textarea class="form-control" id="csGuestBio" rows="3" placeholder="Short personal bio, credentials, institutional affiliations, and notable publications..." required>Distinguished Diplomat in Residence, Former Permanent Representative to the UN and Senior Advisor on International Mediation.</textarea>
        </div>
      `;

      // Bind file reader and preview
      const fileInput = document.getElementById('csGuestPhotoFile');
      const urlInput = document.getElementById('csGuestPhotoUrl');
      const previewImg = document.getElementById('csGuestPhotoPreview');

      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
              if (previewImg) previewImg.src = evt.target.result;
              if (urlInput) urlInput.value = evt.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
      if (urlInput) {
        urlInput.addEventListener('input', () => {
          if (previewImg && urlInput.value.trim()) {
            previewImg.src = urlInput.value.trim();
          }
        });
      }
    } else if (category === 'Diplomatic Roundtable') {
      if (badge) {
        badge.innerHTML = (icons.landmark || '') + ' Diplomatic Roundtable';
        badge.style.background = 'rgba(217, 119, 6, 0.12)';
        badge.style.color = '#d97706';
        badge.style.borderColor = 'rgba(217, 119, 6, 0.3)';
      }
      container.innerHTML = `
        <div style="font-weight: 600; color: #d97706; font-size: 0.9rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Diplomatic Roundtable & Policy Simulation Configuration (Chair & Working Draft)
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="csRoundtableChair">Roundtable Chair / Presiding Officer *</label>
            <select class="form-control" id="csRoundtableChair" required>
              ${allUsersOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="csWorkingDraftTitle">Working Resolution / Policy Draft Title</label>
            <input type="text" class="form-control" id="csWorkingDraftTitle" placeholder="e.g. Draft Resolution on Transboundary Water Sovereignty">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" for="csRoundtableFocus">Roundtable Diplomatic Simulation Focus</label>
          <textarea class="form-control" id="csRoundtableFocus" rows="2" placeholder="Describe the simulation stakes, regional bloc dynamics, and consensus-building targets..."></textarea>
        </div>
      `;
    } else if (category === 'Debate') {
      if (badge) {
        badge.innerHTML = (icons.scale || '') + ' Debate';
        badge.style.background = 'rgba(220, 38, 38, 0.12)';
        badge.style.color = '#dc2626';
        badge.style.borderColor = 'rgba(220, 38, 38, 0.3)';
      }
      container.innerHTML = `
        <div style="font-weight: 600; color: #dc2626; font-size: 0.9rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path></svg>
          Formal Debate Configuration (Proposition, Opposition & Adjudicator)
        </div>
        <div class="form-group">
          <label class="form-label" for="csDebateMotion">Formal Debate Motion / Resolution (This House...)</label>
          <input type="text" class="form-control" id="csDebateMotion" placeholder="e.g. This House Would Ban All State-Sponsored Lethal Autonomous AI Weapons">
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="csPropositionTeam">Proposition / Affirmative Team (Speakers & Country) *</label>
            <input type="text" class="form-control" id="csPropositionTeam" placeholder="e.g. Tariq Al-Mansoor (Qatar), Lucas Silva (Brazil)" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="csOppositionTeam">Opposition / Negative Team (Speakers & Country) *</label>
            <input type="text" class="form-control" id="csOppositionTeam" placeholder="e.g. Elena Rostova (United Kingdom), Kofi Mensah (Ghana)" required>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" for="csAdjudicator">Presiding Adjudicator / Speaker of the House *</label>
          <select class="form-control" id="csAdjudicator" required>
            ${allUsersOptions}
          </select>
        </div>
      `;
    }
  }

  function prepareCoordSessionForm() {
    const topicSelect = document.getElementById('csTopicSelect');
    const categorySelect = document.getElementById('csSessionCategory');
    const approvedTopics = dataService.getTopics().filter(t => t.status === 'Approved' || t.status === 'Proposed' || t.status === 'Scheduled');
    const users = dataService.getUsers();

    if (topicSelect) {
      topicSelect.innerHTML = approvedTopics.map(t => `
        <option value="${t.id}">${t.title} (${t.categoryName})</option>
      `).join('');
    }

    // Set default date to 2 weeks from now
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 14);
    const dateInput = document.getElementById('csDate');
    if (dateInput) dateInput.value = nextDate.toISOString().split('T')[0];

    // Initial dynamic fields render
    const initialCategory = categorySelect ? categorySelect.value : 'Topic Presentation';
    renderCoordSessionDynamicFields(initialCategory);

    if (categorySelect) {
      categorySelect.onchange = () => {
        renderCoordSessionDynamicFields(categorySelect.value);
      };
    }

    const form = document.getElementById('coordCreateSessionForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const sessionCategory = categorySelect ? categorySelect.value : 'Topic Presentation';
        const topicId = topicSelect ? topicSelect.value : '';
        const title = document.getElementById('csTitle')?.value.trim() || 'Untitled Dialogue Session';
        const date = document.getElementById('csDate')?.value;
        const time = document.getElementById('csTime')?.value || '18:00';
        const duration = document.getElementById('csDuration')?.value || '90 mins';
        const countriesText = document.getElementById('csCountries')?.value || 'International';
        const desc = document.getElementById('csDesc')?.value || '';
        const meetingLink = document.getElementById('csMeetingLink')?.value || 'https://meet.google.com/gyd-session-new';
        const recordingUrl = document.getElementById('csRecordingUrl')?.value || '';

        const countries = countriesText.split(',').map(c => c.trim()).filter(Boolean);
        const selectedTopic = dataService.getTopics().find(t => t.id === topicId);
        const categoryId = selectedTopic ? selectedTopic.category : 'global-affairs';

        let moderator = { name: 'TBD', country: 'International', flag: 'INT' };
        let speakers = [];
        let presenter = null;
        let guestName = '';
        let guestPhoto = '';
        let guestBio = '';
        let keySpeakers = '';
        let discussionQuestions = '';
        let roundtableChair = null;
        let workingDraftTitle = '';
        let roundtableFocus = '';
        let debateMotion = '';
        let propositionTeam = '';
        let oppositionTeam = '';
        let adjudicator = null;
        let presentationPaperUrl = '';

        if (sessionCategory === 'Topic Presentation') {
          const presName = document.getElementById('csPresenterSelect')?.value;
          const modName = document.getElementById('csPresenterModerator')?.value;
          presentationPaperUrl = document.getElementById('csPresentationPaperUrl')?.value || '';
          
          const presUser = users.find(u => u.name === presName) || { name: presName, country: 'International', flag: 'INT' };
          const modUser = users.find(u => u.name === modName) || { name: modName, country: 'International', flag: 'INT' };
          
          presenter = presUser;
          moderator = modUser;
          speakers = [{ name: presUser.name, country: presUser.country, flag: presUser.flag, stance: 'Lead Presenter' }];
        } else if (sessionCategory === 'Discussions') {
          const modName = document.getElementById('csDiscussionModerator')?.value;
          keySpeakers = document.getElementById('csKeySpeakers')?.value || '';
          discussionQuestions = document.getElementById('csDiscussionQuestions')?.value || '';

          const modUser = users.find(u => u.name === modName) || { name: modName, country: 'International', flag: 'INT' };
          moderator = modUser;
          speakers = keySpeakers.split(',').filter(Boolean).map(sp => ({
            name: sp.trim(),
            country: 'International',
            flag: 'INT',
            stance: 'Key Discussant'
          }));
        } else if (sessionCategory === 'Guest Talk') {
          guestName = document.getElementById('csGuestName')?.value.trim() || 'Distinguished Guest';
          guestPhoto = document.getElementById('csGuestPhotoUrl')?.value || document.getElementById('csGuestPhotoPreview')?.src || '';
          guestBio = document.getElementById('csGuestBio')?.value.trim() || '';
          const modName = document.getElementById('csGuestHost')?.value;

          const modUser = users.find(u => u.name === modName) || { name: modName, country: 'International', flag: 'INT' };
          moderator = modUser;
          speakers = [{ name: guestName, country: 'International Guest', flag: 'INT', stance: 'Distinguished Guest Speaker' }];
        } else if (sessionCategory === 'Diplomatic Roundtable') {
          const chairName = document.getElementById('csRoundtableChair')?.value;
          workingDraftTitle = document.getElementById('csWorkingDraftTitle')?.value.trim() || '';
          roundtableFocus = document.getElementById('csRoundtableFocus')?.value.trim() || '';

          const chairUser = users.find(u => u.name === chairName) || { name: chairName, country: 'International', flag: 'INT' };
          moderator = chairUser;
          roundtableChair = chairUser;
          speakers = [{ name: chairUser.name, country: chairUser.country, flag: chairUser.flag, stance: 'Roundtable Chair' }];
        } else if (sessionCategory === 'Debate') {
          debateMotion = document.getElementById('csDebateMotion')?.value.trim() || title;
          propositionTeam = document.getElementById('csPropositionTeam')?.value.trim() || '';
          oppositionTeam = document.getElementById('csOppositionTeam')?.value.trim() || '';
          const adjName = document.getElementById('csAdjudicator')?.value;

          const adjUser = users.find(u => u.name === adjName) || { name: adjName, country: 'International', flag: 'INT' };
          moderator = adjUser;
          adjudicator = adjUser;

          propositionTeam.split(',').filter(Boolean).forEach(s => {
            speakers.push({ name: s.trim(), country: 'International', flag: 'INT', stance: 'Proposition' });
          });
          oppositionTeam.split(',').filter(Boolean).forEach(s => {
            speakers.push({ name: s.trim(), country: 'International', flag: 'INT', stance: 'Opposition' });
          });
        }

        dataService.createSession({
          title,
          topicId,
          category: categoryId,
          sessionCategory,
          date,
          time,
          format: sessionCategory,
          duration,
          moderator,
          speakers,
          presenter,
          guestName,
          guestPhoto,
          guestBio,
          keySpeakers,
          discussionQuestions,
          roundtableChair,
          workingDraftTitle,
          roundtableFocus,
          debateMotion,
          propositionTeam,
          oppositionTeam,
          adjudicator,
          presentationPaperUrl,
          countriesRepresented: countries,
          description: desc,
          meetingLink,
          recordingUrl
        });

        showToast(`Scheduled "${title}" as a new ${sessionCategory} session!`, 'success');
        form.reset();
        switchCoordSubview('dashboard');
      };
    }
  }

  // --- Subview: Coordinator Writing Studio ---
  function prepareCoordWritingStudio() {
    const sessionSelect = document.getElementById('wsSessionSelect');
    const sessions = dataService.getSessions();

    if (sessionSelect) {
      sessionSelect.innerHTML = sessions.map(s => `
        <option value="${s.id}">Session ${s.sessionNumber.toString().padStart(2, '0')}: ${s.title}</option>
      `).join('');
    }

    // Render pending presenter paper approvals queue
    renderCoordPendingWritingsQueue();

    const form = document.getElementById('coordSummaryForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const sessionId = sessionSelect.value;
      const linkedSession = sessions.find(s => s.id === sessionId);

      const title = document.getElementById('wsTitle').value.trim();
      const author = document.getElementById('wsAuthor').value.trim();
      const status = document.getElementById('wsStatus').value;
      const intro = document.getElementById('wsIntro').value.trim();
      const background = document.getElementById('wsBackground').value.trim();
      const keyArgs = document.getElementById('wsKeyArgs').value.split('\n').filter(Boolean);
      const counterArgs = document.getElementById('wsCounterArgs').value.split('\n').filter(Boolean);
      const evidence = document.getElementById('wsEvidence').value.trim();
      const insights = document.getElementById('wsInsights').value.trim();
      const conclusion = document.getElementById('wsConclusion').value.trim();
      const furtherQ = document.getElementById('wsFurtherQuestions').value.split('\n').filter(Boolean);
      const sources = document.getElementById('wsSources').value.trim();

      dataService.createWriting({
        sessionId,
        sessionNumber: linkedSession ? linkedSession.sessionNumber : null,
        title,
        category: linkedSession ? linkedSession.category : 'global-affairs',
        author,
        status,
        intro,
        background,
        keyArguments: keyArgs,
        counterarguments: counterArgs,
        evidence,
        insights,
        conclusion,
        furtherQuestions: furtherQ,
        sources
      });

      showToast('Academic synthesis published successfully to youth research archive!', 'success');
      form.reset();
      switchCoordSubview('dashboard');
    };
  }

  function renderCoordPendingWritingsQueue() {
    const listEl = document.getElementById('coordPendingWritingsList');
    const badgeEl = document.getElementById('coordPendingWritingsBadge');
    const allWritings = dataService.getWritings() || [];
    const pendingWritings = allWritings.filter(w => w.status === 'Under Review' || w.status === 'Pending');

    if (badgeEl) {
      badgeEl.textContent = `${pendingWritings.length} Pending`;
    }

    if (!listEl) return;

    if (pendingWritings.length === 0) {
      listEl.innerHTML = `<div style="color: var(--text-muted); padding: 0.8rem 0; font-size: 0.9rem;">No presenter papers pending review at this time.</div>`;
      return;
    }

    listEl.innerHTML = pendingWritings.map(w => `
      <div style="background: var(--bg-body); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
          <div>
            <span class="badge badge-category" style="margin-bottom: 0.35rem;">${w.categoryName || w.category}</span>
            <h4 style="margin: 0; color: var(--brand-navy); font-size: 1.15rem;">${w.title}</h4>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">
              <strong>Author:</strong> ${w.author} (${w.authorRole || 'Presenter'}) • Submitted: ${w.publicationDate || 'Recently'}
            </div>
          </div>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-body); line-height: 1.5; margin: 0.5rem 0 1rem 0;">
          ${w.intro}
        </p>
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: flex-end;">
          <button class="btn btn-outline btn-sm" onclick="window.openFullAcademicPaper('${w.id}')">
            ${icons.book} Inspect Full Paper
          </button>
          <button class="btn btn-be-presenter btn-sm" onclick="window.approveWriting('${w.id}')" style="gap: 0.4rem;">
            ${icons.check} Approve & Publish to Member Dashboard
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.rejectWriting('${w.id}')">
            ${icons.x} Decline
          </button>
        </div>
      </div>
    `).join('');
  }

  window.renderCoordPendingWritingsQueue = renderCoordPendingWritingsQueue;

  window.approveWriting = function(writingId) {
    const w = dataService.approveWriting(writingId);
    if (w) {
      showToast(`Approved & Published "${w.title}"! It is now live in all Member Dashboards.`, 'success');
      if (typeof renderCoordPendingWritingsQueue === 'function') renderCoordPendingWritingsQueue();
      if (typeof renderMemberWritingsList === 'function') renderMemberWritingsList();
      if (typeof renderPresenterWritingsView === 'function') renderPresenterWritingsView();
    }
  };

  window.rejectWriting = function(writingId) {
    const w = dataService.rejectWriting(writingId);
    if (w) {
      showToast(`Paper "${w.title}" declined.`, 'normal');
      if (typeof renderCoordPendingWritingsQueue === 'function') renderCoordPendingWritingsQueue();
      if (typeof renderPresenterWritingsView === 'function') renderPresenterWritingsView();
    }
  };

  // --- Subview: Coordinator Feedback Review ---
  function renderCoordFeedbackList() {
    const listEl = document.getElementById('coordFeedbackReviewsList');
    const feedbacks = dataService.getFeedback();

    if (feedbacks.length === 0) {
      listEl.innerHTML = `<div class="card-panel" style="text-align: center; color: var(--text-muted);">No feedback records found.</div>`;
      return;
    }

    listEl.innerHTML = feedbacks.map(fb => `
      <div class="card-panel">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <h4 style="margin-bottom: 0.25rem;">${fb.sessionTitle}</h4>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Submitted by ${fb.memberName} (${fb.memberCountry}) • ${fb.date}</div>
          </div>
          <span class="badge ${fb.rating === 'Excellent' ? 'badge-completed' : 'badge-review'}">${fb.rating}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem;">
          <div><strong>Strengths:</strong> ${fb.strengths}</div>
          ${fb.missingPoints ? `<div><strong>Missing Points / Nuances:</strong> ${fb.missingPoints}</div>` : ''}
          ${fb.evidenceFeedback ? `<div><strong>Evidence Assessment:</strong> ${fb.evidenceFeedback}</div>` : ''}
          ${fb.overlookedPerspectives ? `<div><strong>Overlooked Regional Perspective:</strong> ${fb.overlookedPerspectives}</div>` : ''}
          ${fb.futureIdeas ? `<div><strong>Future Topic Suggestion:</strong> ${fb.futureIdeas}</div>` : ''}
          ${fb.comments ? `<div><strong>Additional Notes:</strong> ${fb.comments}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  // --- Subview: Coordinator Applications ---
  function renderCoordApplicationsList() {
    const presListEl = document.getElementById('coordPresenterApplicationsList');
    const presBadge = document.getElementById('coordPresenterAppsCount');
    const pendingListEl = document.getElementById('coordFullApplicationsList');
    const approvedListEl = document.getElementById('coordApprovedMembersList');
    const declinedListEl = document.getElementById('coordDeclinedApplicationsList');
    const allApps = dataService.getApplications();
    const pendingApps = allApps.filter(a => a.status === 'Pending');
    const approvedApps = allApps.filter(a => a.status === 'Approved' || a.status === 'Approved - Awaiting Registration');
    const declinedApps = allApps.filter(a => a.status === 'Rejected' || a.status === 'Declined');
    const users = dataService.getUsers();

    // 1. Presenter Applications Queue
    const allPresApps = dataService.getPresenterApplications();
    const pendingPresApps = allPresApps.filter(a => a.status === 'Pending');
    const approvedPresApps = allPresApps.filter(a => a.status === 'Approved');
    const declinedPresApps = allPresApps.filter(a => a.status === 'Rejected' || a.status === 'Declined');

    if (presBadge) {
      presBadge.textContent = `${pendingPresApps.length} Pending`;
    }

    if (presListEl) {
      if (pendingPresApps.length === 0) {
        presListEl.innerHTML = `<div style="color: var(--text-muted); padding: 0.8rem 0; font-size: 0.9rem;">No pending presenter accreditation requests in the queue.</div>`;
      } else {
        presListEl.innerHTML = pendingPresApps.map(app => `
          <div class="application-item" style="border-inline-start: 4px solid var(--presenter-border); background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1rem; border: 1px solid var(--border-color); display: flex; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;">
            <div class="app-meta" style="flex: 1; min-width: 280px;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                <span class="flag-icon-wrap">${icons.getFlag(app.country, app.flag)}</span>
                <strong style="font-size: 1.05rem; color: var(--brand-navy);">${app.name}</strong>
                <span style="color: var(--text-muted); font-size: 0.88rem;">(${app.country})</span>
                <span class="badge presenter-status-badge">Presenter Applicant</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.6rem;">
                <span>${app.email}</span> • <span>Applied: ${app.date}</span> • <span>Preferred Format: ${app.preferredFormat || '15-min Keynote'}</span>
              </div>
              <div style="background: var(--bg-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 0.6rem;">
                <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); display: block; margin-bottom: 0.2rem;">Proposed Topic & Dilemma:</span>
                <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">"${app.proposedTopic}"</div>
              </div>
              <p class="app-motivation" style="font-size: 0.88rem; margin: 0.4rem 0; color: var(--text-secondary); line-height: 1.5;">
                <strong style="color: var(--text-primary);">Academic Intent:</strong> "${app.statementOfIntent}"
              </p>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">
                <strong style="color: var(--text-primary);">Speaking/Debate Experience:</strong> ${app.researchExperience}
              </div>
              ${app.dossierUrl ? `
                <div style="margin-top: 0.6rem;">
                  <a href="${app.dossierUrl}" target="_blank" class="btn btn-subtle btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.82rem; padding: 0.25rem 0.6rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    <span>Inspect Research Dossier / Slides</span>
                  </a>
                </div>
              ` : ''}
            </div>
            <div class="app-actions" style="display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; min-width: 180px;">
              <button class="btn btn-be-presenter btn-sm" onclick="window.approvePresenterApp('${app.id}')" style="width: 100%; justify-content: center; gap: 0.4rem;">
                ${icons.check} Approve Presenter
              </button>
              <button class="btn btn-outline btn-sm" onclick="window.rejectPresenterApp('${app.id}')" style="width: 100%; justify-content: center; gap: 0.4rem;">
                ${icons.x} Decline
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // 2. Member Applications Queue
    if (pendingApps.length === 0) {
      pendingListEl.innerHTML = `<div style="color: var(--text-muted); padding: 1rem 0;">No pending member applications in the queue. All submitted applications have been decided.</div>`;
    } else {
      pendingListEl.innerHTML = pendingApps.map(app => `
        <div class="application-item">
          <div class="app-meta">
            <span class="app-name">${app.name} (${app.country})</span>
            <span class="app-sub">${app.email} • Experience: ${app.debateExperience}</span>
            <p class="app-motivation">"${app.motivation}"</p>
            <div style="margin-top: 0.4rem; display: flex; gap: 0.35rem;">
              ${app.interests.map(i => `<span class="country-pill">${i}</span>`).join('')}
            </div>
          </div>
          <div class="app-actions">
            <button class="btn btn-primary btn-sm" onclick="window.approveApp('${app.id}')">${icons.check} Approve Member</button>
            <button class="btn btn-outline btn-sm" onclick="window.rejectApp('${app.id}')">${icons.x} Decline</button>
          </div>
        </div>
      `).join('');
    }

    // 3. Approved List (Both approved applicants awaiting password setup + active members)
    if (approvedListEl) {
      let approvedHtml = '';
      
      // Approved membership applicants awaiting registration
      approvedApps.forEach(a => {
        approvedHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <strong>${a.name}</strong> (${a.country}) — <span style="color: var(--text-muted); font-size: 0.85rem;">${a.email}</span>
              <span style="display: block; font-size: 0.78rem; color: #047857;">Approved applicant awaiting registration completion</span>
            </div>
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #047857; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.3);">Approved Applicant</span>
          </div>
        `;
      });

      // Approved presenter applicants
      approvedPresApps.forEach(pa => {
        approvedHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <strong>${pa.name}</strong> (${pa.country}) — <span style="color: var(--text-muted); font-size: 0.85rem;">${pa.email}</span>
              <span style="display: block; font-size: 0.78rem; color: var(--accent-gold);">Accredited Presenter: "${pa.proposedTopic}"</span>
            </div>
            <span class="badge" style="background: rgba(184, 142, 62, 0.15); color: var(--accent-gold); font-weight: 700; border: 1px solid rgba(184, 142, 62, 0.3);">Accredited Presenter</span>
          </div>
        `;
      });

      // Active registered users
      users.forEach(u => {
        approvedHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <strong>${u.name}</strong> (${u.country}) — <span style="color: var(--text-muted); font-size: 0.85rem;">${u.email}</span>
            </div>
            <span class="badge ${u.role === 'Presenter' ? 'badge-approved' : 'badge-approved'}" style="${u.role === 'Presenter' ? 'background: rgba(184, 142, 62, 0.15); color: var(--accent-gold); font-weight: 700; border: 1px solid rgba(184, 142, 62, 0.3);' : ''}">${u.role}</span>
          </div>
        `;
      });

      approvedListEl.innerHTML = approvedHtml || `<div style="color: var(--text-muted); padding: 0.8rem 0;">No approved members yet.</div>`;
    }

    // 4. Declined List (Declined applications archive)
    if (declinedListEl) {
      let declinedHtml = '';

      declinedApps.forEach(da => {
        declinedHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; gap: 0.5rem;">
            <div style="flex: 1; min-width: 260px;">
              <strong style="color: var(--text-primary);">${da.name}</strong> (${da.country}) — <span style="color: var(--text-muted); font-size: 0.85rem;">${da.email}</span>
              <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: var(--text-muted);">"${da.motivation || 'No statement'}"</p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge" style="background: rgba(220, 38, 38, 0.1); color: #dc2626; font-weight: 600; border: 1px solid rgba(220, 38, 38, 0.2);">Declined</span>
              <button class="btn btn-outline btn-sm" onclick="window.approveApp('${da.id}')" style="font-size: 0.78rem; padding: 0.25rem 0.65rem;">
                Re-evaluate / Approve
              </button>
            </div>
          </div>
        `;
      });

      declinedPresApps.forEach(dp => {
        declinedHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; gap: 0.5rem;">
            <div style="flex: 1; min-width: 260px;">
              <strong style="color: var(--text-primary);">${dp.name}</strong> (${dp.country}) — <span style="color: var(--text-muted); font-size: 0.85rem;">${dp.email}</span>
              <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: var(--accent-gold);">Presenter Request: "${dp.proposedTopic}"</p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge" style="background: rgba(220, 38, 38, 0.1); color: #dc2626; font-weight: 600; border: 1px solid rgba(220, 38, 38, 0.2);">Declined</span>
              <button class="btn btn-outline btn-sm" onclick="window.approvePresenterApp('${dp.id}')" style="font-size: 0.78rem; padding: 0.25rem 0.65rem;">
                Re-evaluate / Approve
              </button>
            </div>
          </div>
        `;
      });

      declinedListEl.innerHTML = declinedHtml || `<div style="color: var(--text-muted); padding: 0.8rem 0;">No declined applications in the archive.</div>`;
    }
  }
  window.renderCoordApplicationsList = renderCoordApplicationsList;

  // --- Subview: Coordinator Team Roster ---
  function renderCoordTeamList() {
    const listEl = document.getElementById('coordTeamRosterGrid');
    const coords = dataService.getUsers().filter(u => u.role === 'Coordinator');

    listEl.innerHTML = coords.map(c => `
      <div class="member-card">
        <div class="m-card-top">
          <div class="m-avatar" style="background: linear-gradient(135deg, #1e1b4b, #4851BA); color: #fff;" title="${c.name}">${c.avatar ? `<img src="${c.avatar}" alt="${c.name}">` : getUserInitial(c.name)}</div>
          <div>
            <div class="m-name">${c.name}</div>
            <div class="m-country">${c.department || 'Founding Secretariat'} • ${c.country}</div>
          </div>
        </div>
        <p class="m-bio">${c.bio}</p>
        <div class="m-interests-wrap">
          <span class="interest-tag">ISDC7 Qatar Debater</span>
          <span class="interest-tag">Founding Coordinator</span>
        </div>
      </div>
    `).join('');
  }

  // =========================================================================
  // GLOBAL WINDOW HELPER METHODS (MODAL POPUPS & BUTTON ACTIONS)
  // =========================================================================
  
  // =========================================================================
  // SUBVIEW: THE COMMUNITY (COORDINATOR ROSTER & USER MANAGEMENT)
  // =========================================================================
  window._coordCommunityFilterRole = 'all';
  window._coordCommunitySearchQuery = '';
  window._coordCommunityCountryFilter = 'all';

  function renderCoordCommunityRoster() {
    const container = document.getElementById('coordCommunityContainer');
    const statsGrid = document.getElementById('coordCommunityStatsGrid');
    const countrySelect = document.getElementById('coordCommunityCountryFilter');
    if (!container) return;

    const allUsers = dataService.getUsers() || [];

    // Calculate metrics
    const totalCount = allUsers.length;
    const coAdminCount = allUsers.filter(u => u.role === 'Coordinator' || u.role === 'Admin').length;
    const presenterCount = allUsers.filter(u => u.role === 'Presenter' || u.role === 'Speaker').length;
    const memberCount = allUsers.filter(u => u.role === 'Member' || (!['Coordinator', 'Admin', 'Presenter', 'Speaker'].includes(u.role))).length;

    // Update filter counters
    const cAll = document.getElementById('countFilterAll');
    const cCoord = document.getElementById('countFilterCoordinators');
    const cPres = document.getElementById('countFilterPresenters');
    const cMem = document.getElementById('countFilterMembers');
    if (cAll) cAll.textContent = totalCount;
    if (cCoord) cCoord.textContent = coAdminCount;
    if (cPres) cPres.textContent = presenterCount;
    if (cMem) cMem.textContent = memberCount;

    // Render Stats Grid
    if (statsGrid) {
      statsGrid.className = 'coord-kpi-grid';
      statsGrid.innerHTML = `
        <div class="kpi-card" style="cursor: pointer;" onclick="window.setCoordCommunityRoleFilter('all')">
          <div class="kpi-icon" style="background: rgba(138, 21, 56, 0.12); color: #8A1538;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <div class="kpi-num">${totalCount}</div>
            <div class="kpi-label">Total Community</div>
          </div>
        </div>

        <div class="kpi-card" style="cursor: pointer;" onclick="window.setCoordCommunityRoleFilter('Coordinator')">
          <div class="kpi-icon" style="background: rgba(72, 81, 186, 0.12); color: #4851BA;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <div>
            <div class="kpi-num">${coAdminCount}</div>
            <div class="kpi-label">Co-Admins & Leads</div>
          </div>
        </div>

        <div class="kpi-card" style="cursor: pointer;" onclick="window.setCoordCommunityRoleFilter('Presenter')">
          <div class="kpi-icon" style="background: rgba(184, 142, 62, 0.12); color: #B88E3E;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
            </svg>
          </div>
          <div>
            <div class="kpi-num">${presenterCount}</div>
            <div class="kpi-label">Academic Presenters</div>
          </div>
        </div>

        <div class="kpi-card" style="cursor: pointer;" onclick="window.setCoordCommunityRoleFilter('Member')">
          <div class="kpi-icon" style="background: rgba(16, 185, 129, 0.12); color: #10B981;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <div class="kpi-num">${memberCount}</div>
            <div class="kpi-label">Debate Members</div>
          </div>
        </div>
      `;
    }

    // Populate country filter dropdown
    if (countrySelect) {
      const countries = Array.from(new Set(allUsers.map(u => u.country).filter(Boolean))).sort();
      const currentSelected = window._coordCommunityCountryFilter || 'all';
      countrySelect.innerHTML = `<option value="all">All Countries (${countries.length})</option>` +
        countries.map(c => `<option value="${c}" ${c === currentSelected ? 'selected' : ''}>${c}</option>`).join('');
    }

    // Update active tab styling
    document.querySelectorAll('#coordCommunityRoleFilter .coord-filter-tab-btn').forEach(btn => {
      const role = btn.getAttribute('data-role-filter');
      btn.classList.toggle('active', role === window._coordCommunityFilterRole);
    });

    // Filter users
    let filtered = allUsers.filter(u => {
      if (window._coordCommunityFilterRole === 'Coordinator') {
        if (u.role !== 'Coordinator' && u.role !== 'Admin') return false;
      } else if (window._coordCommunityFilterRole === 'Presenter') {
        if (u.role !== 'Presenter' && u.role !== 'Speaker') return false;
      } else if (window._coordCommunityFilterRole === 'Member') {
        if (u.role === 'Coordinator' || u.role === 'Admin' || u.role === 'Presenter' || u.role === 'Speaker') return false;
      }

      if (window._coordCommunityCountryFilter !== 'all') {
        if ((u.country || '').toLowerCase() !== window._coordCommunityCountryFilter.toLowerCase()) return false;
      }

      if (window._coordCommunitySearchQuery) {
        const q = window._coordCommunitySearchQuery.toLowerCase();
        const matchName = (u.name || '').toLowerCase().includes(q);
        const matchEmail = (u.email || '').toLowerCase().includes(q);
        const matchCountry = (u.country || '').toLowerCase().includes(q);
        const matchDept = (u.department || '').toLowerCase().includes(q);
        const matchBio = (u.bio || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchCountry && !matchDept && !matchBio) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="card-panel" style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h4 style="color: var(--text-main); margin-bottom: 0.35rem;">No Community Members Found</h4>
          <p style="font-size: 0.88rem; max-width: 420px; margin: 0 auto 1.25rem auto;">No records matched your search query or role filter. You can add a new community member or reset filters.</p>
          <button class="btn btn-outline btn-sm" onclick="window.setCoordCommunityRoleFilter('all'); document.getElementById('coordCommunitySearchInput').value=''; window.handleCoordCommunitySearch('');">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="community-roster-grid">
        ${filtered.map(u => {
          const isPrimaryAdmin = u.id === 'usr_admin_mubashir' || (u.email && u.email.toLowerCase() === '3681mubashircp@gmail.com');
          const isCoAdmin = u.role === 'Coordinator' || u.role === 'Admin';
          const isPresenter = u.role === 'Presenter' || u.role === 'Speaker';
          
          let roleBadgeHtml = '';
          if (isPrimaryAdmin) {
            roleBadgeHtml = `<span class="badge" style="background: rgba(138, 21, 56, 0.14); color: #8A1538; font-weight: 700; border: 1px solid rgba(138, 21, 56, 0.28); font-size: 0.72rem; padding: 2px 7px;">Chief Administrator</span>`;
          } else if (isCoAdmin) {
            roleBadgeHtml = `<span class="badge badge-approved" style="font-size: 0.72rem; padding: 2px 7px;">Co-Admin</span>`;
          } else if (isPresenter) {
            roleBadgeHtml = `<span class="badge presenter-status-badge" style="font-size: 0.72rem; padding: 2px 7px;">Academic Presenter</span>`;
          } else {
            roleBadgeHtml = `<span class="badge badge-completed" style="font-size: 0.72rem; padding: 2px 7px;">Debate Member</span>`;
          }

          const flagSvg = (typeof icons !== 'undefined' && icons.getFlag) ? icons.getFlag(u.country, u.flag) : '';

          return `
            <div class="community-user-card" id="userCard_${u.id}">
              <div>
                <div class="community-card-top">
                  <div class="community-card-avatar-wrap" onclick="window.openCoordUserDossierModal('${u.id}')" style="cursor: pointer;" title="View ${u.name}'s Complete Dossier">
                    ${u.avatar ? `
                      <img src="${u.avatar}" alt="${u.name}" class="community-card-avatar">
                    ` : `
                      <div class="community-card-avatar" style="${isCoAdmin ? 'background: linear-gradient(135deg, #1e1b4b, #4851BA);' : (isPresenter ? 'background: linear-gradient(135deg, #B88E3E, #7A5C1E);' : 'background: linear-gradient(135deg, #4851BA, #9E59AC);')}">
                        ${getUserInitial(u.name)}
                      </div>
                    `}
                    <span class="community-card-flag-badge" title="${u.country || 'Global'}">
                      ${flagSvg}
                    </span>
                  </div>

                  <div class="community-card-info">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.2rem;">
                      <h4 class="community-card-name" style="cursor: pointer;" onclick="window.openCoordUserDossierModal('${u.id}')" title="View ${u.name}'s Complete Dossier">${u.name}</h4>
                      ${roleBadgeHtml}
                    </div>
                    <div class="community-card-meta">
                      <span>${u.department || 'Youth Delegation'}</span>
                      <span>•</span>
                      <strong>${u.country || 'Global'}</strong>
                    </div>
                    <div class="community-card-email">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${u.email}</span>
                    </div>
                  </div>
                </div>

                <p style="font-size: 0.82rem; color: var(--text-body); line-height: 1.45; margin: 0 0 0.85rem 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${u.bio || ''}">
                  "${u.bio || 'Active participant in the international youth debate society.'}"
                </p>
              </div>

              <div class="community-card-footer">
                <span style="font-size: 0.75rem; color: var(--text-muted);">
                  Joined: ${u.joinedDate || '2024'}
                </span>

                <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                  <button class="btn btn-outline btn-sm btn-more-details" style="font-size: 0.76rem; padding: 0.28rem 0.6rem; gap: 4px; color: var(--brand-primary); border-color: rgba(72, 81, 186, 0.4); font-weight: 600; display: inline-flex; align-items: center;" onclick="window.openCoordUserDossierModal('${u.id}')" title="More Details about ${u.name}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    More Details about ${u.name.split(' ')[0] || u.name}
                  </button>
                  ${!isPrimaryAdmin ? `
                    <button class="btn btn-outline btn-sm" style="font-size: 0.76rem; padding: 0.25rem 0.55rem; gap: 3px;" onclick="window.openChangeUserRoleModal('${u.id}')" title="Change Role">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Role
                    </button>
                    <button class="btn btn-outline btn-sm" style="font-size: 0.76rem; padding: 0.25rem 0.45rem; color: #dc2626; border-color: rgba(220, 38, 38, 0.3);" onclick="window.openDeleteCommunityUserModal('${u.id}')" title="Remove User">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  ` : `
                    <span style="font-size: 0.72rem; color: var(--brand-primary); font-weight: 600;">System Protected</span>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  window.renderCoordCommunityRoster = renderCoordCommunityRoster;

  window.setCoordCommunityRoleFilter = function(role) {
    window._coordCommunityFilterRole = role;
    renderCoordCommunityRoster();
  };

  window.handleCoordCommunitySearch = function(query) {
    window._coordCommunitySearchQuery = (query || '').trim();
    renderCoordCommunityRoster();
  };

  window.handleCoordCommunityCountryFilter = function(country) {
    window._coordCommunityCountryFilter = country;
    renderCoordCommunityRoster();
  };

  window.openAddCommunityUserModal = function() {
    openModal('addCommunityUserModal');
  };

  window.handleAddCommunityUserSubmit = function(event) {
    event.preventDefault();
    const firstName = document.getElementById('addCommFirstName')?.value.trim();
    const lastName = document.getElementById('addCommLastName')?.value.trim();
    const email = document.getElementById('addCommEmail')?.value.trim();
    const role = document.getElementById('addCommRole')?.value;
    const country = document.getElementById('addCommCountry')?.value.trim();
    const password = document.getElementById('addCommPassword')?.value.trim() || 'gyde2024';
    const institution = document.getElementById('addCommInstitution')?.value.trim();

    if (!email || !firstName) {
      showToast('Please fill in required fields.', 'error');
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const user = dataService.addCommunityUser({
      name: fullName,
      email,
      password,
      role,
      country,
      institution
    });

    closeModal('addCommunityUserModal');
    showToast(`Added ${fullName} (${role}) to the community!`, 'success');
    renderCoordCommunityRoster();
  };

  window.openCoordUserDossierModal = function(userId) {
    const allUsers = (typeof dataService !== 'undefined' && dataService.getUsers) ? dataService.getUsers() : [];
    let user = allUsers.find(u => String(u.id) === String(userId));
    
    // Fallback/enrich from db.applications if needed
    const applications = (dataService && dataService.db && dataService.db.applications) || [];
    let appMatch = null;
    if (user) {
      appMatch = applications.find(a => (a.email && user.email && a.email.toLowerCase() === user.email.toLowerCase()) || String(a.id) === String(user.id));
    } else {
      appMatch = applications.find(a => String(a.id) === String(userId));
      if (appMatch) {
        user = {
          id: appMatch.id,
          name: appMatch.name,
          email: appMatch.email,
          country: appMatch.country,
          role: 'Member',
          status: 'Active Member',
          joinedDate: appMatch.submittedAt ? new Date(appMatch.submittedAt).toLocaleDateString() : '2024',
          interests: appMatch.interests,
          debateExperience: appMatch.debateExperience,
          motivation: appMatch.motivation
        };
      }
    }

    if (!user) {
      if (typeof showToast === 'function') showToast('User profile record not found.', 'error');
      return;
    }

    const modalContent = document.getElementById('coordUserDossierContent');
    if (!modalContent) return;

    const sanitize = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // Role identification
    const isPrimaryAdmin = user.id === 'usr_admin_mubashir' || (user.email && user.email.toLowerCase() === '3681mubashircp@gmail.com');
    const normRole = (user.role || 'Member').toLowerCase();
    const isCoAdmin = normRole.includes('admin') || normRole.includes('coord');
    const isPresenter = normRole.includes('present') || normRole.includes('speak');

    let roleBadgeHtml = '';
    let roleTitle = 'Official Debate Member';
    if (isPrimaryAdmin) {
      roleTitle = 'Chief Executive Administrator';
      roleBadgeHtml = `<span class="badge" style="background: rgba(138, 21, 56, 0.14); color: #8A1538; font-weight: 700; border: 1px solid rgba(138, 21, 56, 0.28); font-size: 0.8rem; padding: 3px 9px;">Chief Administrator</span>`;
    } else if (isCoAdmin) {
      roleTitle = 'Coordinator / Co-Admin';
      roleBadgeHtml = `<span class="badge badge-approved" style="font-size: 0.8rem; padding: 3px 9px;">Executive Coordinator</span>`;
    } else if (isPresenter) {
      roleTitle = 'Academic Faculty Presenter';
      roleBadgeHtml = `<span class="badge presenter-status-badge" style="font-size: 0.8rem; padding: 3px 9px;">Academic Presenter</span>`;
    } else {
      roleBadgeHtml = `<span class="badge badge-completed" style="font-size: 0.8rem; padding: 3px 9px;">Official Member</span>`;
    }

    const flagSvg = (typeof icons !== 'undefined' && icons.getFlag) ? icons.getFlag(user.country, user.flag) : '';
    const avatarHtml = user.avatar ? `
      <img src="${user.avatar}" alt="${user.name}" style="width: 76px; height: 76px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 14px rgba(0,0,0,0.12); border: 3px solid #fff;">
    ` : `
      <div style="width: 76px; height: 76px; border-radius: 50%; ${isCoAdmin ? 'background: linear-gradient(135deg, #1e1b4b, #4851BA);' : (isPresenter ? 'background: linear-gradient(135deg, #B88E3E, #7A5C1E);' : 'background: linear-gradient(135deg, #4851BA, #9E59AC);')} color: #fff; font-weight: 700; font-size: 1.7rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.12); border: 3px solid #fff;">
        ${typeof getUserInitial === 'function' ? getUserInitial(user.name) : user.name.charAt(0)}
      </div>
    `;

    // Process interests
    let rawInterests = user.interests || (appMatch && appMatch.interests) || [];
    let interestTags = [];
    if (Array.isArray(rawInterests)) {
      interestTags = rawInterests.filter(Boolean);
    } else if (typeof rawInterests === 'string' && rawInterests.trim()) {
      interestTags = rawInterests.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (interestTags.length === 0) {
      interestTags = ['International Relations', 'Public Diplomacy', 'Parliamentary Debate'];
    }

    // Process debate experience
    const debateExp = user.debateExperience || (appMatch && appMatch.debateExperience) || user.bio || 'Extensive engagement in academic debate, Model United Nations simulations, and constructive public speaking.';

    // Process why they joined
    const motivation = user.motivation || (appMatch && appMatch.motivation) || 'Motivated to participate in global intellectual discourse, exchange cross-border viewpoints, and foster youth leadership across nations.';

    // Department/Delegation
    const dept = user.department || (isPrimaryAdmin ? 'Executive Governing Board' : (isCoAdmin ? 'Advisory Secretariat' : (isPresenter ? 'Faculty & Speaker Board' : 'Youth Delegation')));

    modalContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem; position: relative;">
        <div style="display: flex; justify-content: center; margin-bottom: 0.75rem; position: relative; width: fit-content; margin-left: auto; margin-right: auto;">
          ${avatarHtml}
          <span style="position: absolute; bottom: 0; right: 0; background: #fff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; padding: 2px;" title="${user.country || 'Global'}">
            ${flagSvg}
          </span>
        </div>
        <h3 class="serif-text" style="margin: 0 0 0.4rem 0; font-size: 1.45rem; color: var(--text-dark);">More Details about ${sanitize(user.name)}</h3>
        <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          ${roleBadgeHtml}
          <span class="badge badge-light" style="font-size: 0.78rem; padding: 3px 8px; color: var(--text-muted); border: 1px solid rgba(0,0,0,0.08);">
            ID: ${sanitize(user.id)}
          </span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div style="background: var(--bg-surface-elevated, #f8fafc); border: 1px solid rgba(0,0,0,0.06); border-radius: 8px; padding: 0.85rem 1rem;">
          <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600; margin-bottom: 0.25rem;">Email Address</div>
          <div style="font-size: 0.88rem; font-weight: 500; color: var(--text-dark); word-break: break-all;">${sanitize(user.email || 'N/A')}</div>
        </div>
        <div style="background: var(--bg-surface-elevated, #f8fafc); border: 1px solid rgba(0,0,0,0.06); border-radius: 8px; padding: 0.85rem 1rem;">
          <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600; margin-bottom: 0.25rem;">Country & Department</div>
          <div style="font-size: 0.88rem; font-weight: 500; color: var(--text-dark); display: flex; align-items: center; gap: 6px;">
            <span>${sanitize(user.country || 'Global')}</span>
            <span style="color: var(--text-muted); font-size: 0.8rem;">(${sanitize(dept)})</span>
          </div>
        </div>
        <div style="background: var(--bg-surface-elevated, #f8fafc); border: 1px solid rgba(0,0,0,0.06); border-radius: 8px; padding: 0.85rem 1rem;">
          <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600; margin-bottom: 0.25rem;">Standing / Status</div>
          <div style="font-size: 0.88rem; font-weight: 600; color: #16a34a; display: flex; align-items: center; gap: 5px;">
            <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #16a34a;"></span>
            ${sanitize(user.status || 'Active Credentialed')}
          </div>
        </div>
        <div style="background: var(--bg-surface-elevated, #f8fafc); border: 1px solid rgba(0,0,0,0.06); border-radius: 8px; padding: 0.85rem 1rem;">
          <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600; margin-bottom: 0.25rem;">Induction / Joined Date</div>
          <div style="font-size: 0.88rem; font-weight: 500; color: var(--text-dark);">${sanitize(user.joinedDate || '2024')}</div>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Areas of Primary Intellectual Interest
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
          ${interestTags.map(tag => `
            <span style="background: rgba(72, 81, 186, 0.08); color: var(--brand-primary, #4851BA); border: 1px solid rgba(72, 81, 186, 0.2); border-radius: 20px; font-size: 0.78rem; font-weight: 500; padding: 0.25rem 0.7rem; display: inline-flex; align-items: center; gap: 4px;">
              <span>#</span>${sanitize(tag)}
            </span>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Debate & Public Speaking Background / Experience
        </div>
        <div style="background: var(--bg-surface-elevated, #f8fafc); border-left: 3px solid var(--brand-primary, #4851BA); border-radius: 0 8px 8px 0; padding: 0.85rem 1rem; font-size: 0.86rem; color: var(--text-body); line-height: 1.55;">
          ${sanitize(debateExp)}
        </div>
      </div>

      <div style="margin-bottom: 1.35rem;">
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          Why They Joined Global Youth Dialogue (Personal Mission)
        </div>
        <div style="background: var(--bg-surface-elevated, #f8fafc); border-left: 3px solid #16a34a; border-radius: 0 8px 8px 0; padding: 0.85rem 1rem; font-size: 0.86rem; color: var(--text-body); line-height: 1.55;">
          ${sanitize(motivation)}
        </div>
      </div>

      <!-- Security / Confidentiality Notice: Strictly No Passwords Exposed -->
      <div style="background: rgba(22, 163, 74, 0.05); border: 1px dashed rgba(22, 163, 74, 0.35); border-radius: 8px; padding: 0.75rem 0.95rem; display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span style="font-size: 0.76rem; color: #166534; line-height: 1.4;">
          <strong>Privacy & Security Protocol:</strong> Passwords remain encrypted and strictly inaccessible in compliance with data privacy standards.
        </span>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button class="btn btn-primary" type="button" onclick="closeModal('coordUserDossierModal')">
          Close Dossier
        </button>
      </div>
    `;

    openModal('coordUserDossierModal');
  };

  window.openChangeUserRoleModal = function(userId) {
    const user = (dataService.getUsers() || []).find(u => u.id === userId);
    if (!user) return;

    document.getElementById('changeRoleUserId').value = user.id;
    const nameEl = document.getElementById('changeRoleUserName');
    if (nameEl) nameEl.textContent = `Update role for: ${user.name} (${user.email})`;
    
    const roleSelect = document.getElementById('changeRoleSelect');
    if (roleSelect) {
      roleSelect.value = (user.role === 'Coordinator' || user.role === 'Admin') ? 'Coordinator' : 
                         (user.role === 'Presenter' || user.role === 'Speaker' ? 'Presenter' : 'Member');
    }

    openModal('changeUserRoleModal');
  };

  window.handleChangeUserRoleSubmit = function(event) {
    event.preventDefault();
    const userId = document.getElementById('changeRoleUserId')?.value;
    const newRole = document.getElementById('changeRoleSelect')?.value;

    if (!userId || !newRole) return;

    const updated = dataService.updateUserRole(userId, newRole);
    closeModal('changeUserRoleModal');
    if (updated) {
      showToast(`Updated role for ${updated.name} to ${newRole}.`, 'success');
      renderCoordCommunityRoster();
    }
  };

  window.openDeleteCommunityUserModal = function(userId) {
    const user = (dataService.getUsers() || []).find(u => u.id === userId);
    if (!user) return;

    const idInput = document.getElementById('deleteCommUserId');
    const nameEl = document.getElementById('deleteCommUserName');
    const emailEl = document.getElementById('deleteCommUserEmail');
    const roleEl = document.getElementById('deleteCommUserRole');

    if (idInput) idInput.value = user.id;
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (roleEl) roleEl.textContent = user.role || 'Member';

    openModal('deleteCommunityUserModal');
  };

  window.handleConfirmDeleteCommunityUser = function(event) {
    if (event && event.preventDefault) event.preventDefault();
    const userId = document.getElementById('deleteCommUserId')?.value;
    if (!userId) {
      closeModal('deleteCommunityUserModal');
      return;
    }

    const user = (dataService.getUsers() || []).find(u => u.id === userId);
    const userName = user ? user.name : 'Member';

    try {
      dataService.deleteCommunityUser(userId);
      closeModal('deleteCommunityUserModal');
      showToast(`Removed "${userName}" from community directory.`, 'normal');
      renderCoordCommunityRoster();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  window.handleDeleteCommunityUser = function(userId) {
    window.openDeleteCommunityUserModal(userId);
  };

  window.viewSessionDetail = function(sessionId) {
    const session = dataService.getSessions().find(s => s.id === sessionId);
    if (!session) return;

    const modalContent = document.getElementById('sessionDetailContent');
    modalContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; gap: 0.4rem; align-items: center;">
          <span class="badge badge-category">${session.categoryName}</span>
          <span class="badge ${session.sessionCategory === 'Guest Talk' ? 'badge-cat-guest' : (session.sessionCategory === 'Debate' ? 'badge-cat-deb' : (session.sessionCategory === 'Discussions' ? 'badge-cat-disc' : (session.sessionCategory === 'Diplomatic Roundtable' ? 'badge-cat-round' : 'badge-cat-pres')))}">${session.sessionCategory || 'Topic Presentation'}</span>
        </div>
        <span class="badge ${session.status === 'Upcoming' ? 'badge-scheduled' : 'badge-completed'}">${session.status}</span>
      </div>
      <h3 class="serif-text" style="font-size: 1.85rem; color: var(--brand-navy); margin-bottom: 0.85rem;">
        Session ${session.sessionNumber.toString().padStart(2, '0')}: ${session.title}
      </h3>

      ${session.sessionCategory === 'Guest Talk' && session.guestName ? `
        <div class="modal-guest-spotlight">
          <img src="${session.guestPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}" alt="${session.guestName}" class="modal-guest-photo">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.05em;">Distinguished Guest Speaker</div>
            <h4 style="margin: 0.15rem 0 0.35rem 0; font-family: var(--font-serif); color: var(--brand-navy); font-size: 1.25rem;">${session.guestName}</h4>
            <p style="margin: 0; font-size: 0.86rem; color: var(--text-muted); line-height: 1.5; font-style: italic;">"${session.guestBio || ''}"</p>
          </div>
        </div>
      ` : ''}

      ${session.sessionCategory === 'Debate' && (session.debateMotion || session.propositionTeam) ? `
        <div style="background: rgba(220, 38, 38, 0.05); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #dc2626; text-transform: uppercase;">Formal Debate Motion</div>
          <div style="font-size: 1.1rem; font-style: italic; font-weight: 600; color: var(--brand-navy); margin: 0.25rem 0 0.75rem 0;">"${session.debateMotion || session.title}"</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="background: #fff; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
              <strong style="color: var(--brand-primary); font-size: 0.78rem; text-transform: uppercase;">Proposition / Affirmative:</strong>
              <div style="font-size: 0.88rem; margin-top: 0.2rem;">${session.propositionTeam || 'Delegation Speakers'}</div>
            </div>
            <div style="background: #fff; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
              <strong style="color: #dc2626; font-size: 0.78rem; text-transform: uppercase;">Opposition / Negative:</strong>
              <div style="font-size: 0.88rem; margin-top: 0.2rem;">${session.oppositionTeam || 'Delegation Speakers'}</div>
            </div>
          </div>
          ${session.adjudicator ? `
            <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-muted);">
              <strong>Presiding Adjudicator:</strong> ${session.adjudicator.name} (${session.adjudicator.country})
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${session.sessionCategory === 'Topic Presentation' && session.presenter ? `
        <div style="background: var(--presenter-subtle); border: 1px solid var(--presenter-card-border); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--presenter-title); text-transform: uppercase;">Accredited Keynote Presenter</div>
            <div style="font-size: 1.05rem; font-weight: 700; color: var(--brand-navy);">${session.presenter.name} (${session.presenter.country})</div>
          </div>
          ${session.presentationPaperUrl ? `
            <a href="${session.presentationPaperUrl}" target="_blank" class="btn btn-outline btn-sm" style="gap: 5px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              Slide Deck / Dossier
            </a>
          ` : ''}
        </div>
      ` : ''}

      ${session.sessionCategory === 'Diplomatic Roundtable' && session.workingDraftTitle ? `
        <div style="background: rgba(217, 119, 6, 0.06); border: 1px solid rgba(217, 119, 6, 0.25); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #d97706; text-transform: uppercase;">Diplomatic Simulation Working Resolution</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--brand-navy); margin: 0.25rem 0 0.5rem 0;">"${session.workingDraftTitle}"</div>
          ${session.roundtableFocus ? `<div style="font-size: 0.86rem; color: var(--text-muted); font-style: italic; margin-bottom: 0.65rem;">${session.roundtableFocus}</div>` : ''}
          ${session.roundtableChair ? `<div style="font-size: 0.85rem;"><strong>Presiding Chair:</strong> ${session.roundtableChair.name} (${session.roundtableChair.country})</div>` : ''}
        </div>
      ` : ''}

      ${session.sessionCategory === 'Discussions' && session.discussionQuestions ? `
        <div style="background: rgba(37, 99, 235, 0.05); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: var(--radius-md); padding: 1.15rem 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #2563eb; text-transform: uppercase;">Guided Discussion Questions</div>
          <div style="font-size: 0.92rem; color: var(--text-primary); line-height: 1.6; margin-top: 0.35rem;">${session.discussionQuestions}</div>
        </div>
      ` : ''}
      <div style="display: flex; flex-wrap: wrap; gap: 1.25rem; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
        <span style="display:inline-flex; align-items:center; gap:4px;">${icons.calendar} <strong>Date:</strong> ${session.date}</span>
        <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} <strong>Time:</strong> ${session.time} (${session.timezone})</span>
        <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} <strong>Duration:</strong> ${session.duration}</span>
        <span style="display:inline-flex; align-items:center; gap:4px;">${icons.mic} <strong>Format:</strong> ${session.format}</span>
      </div>

      <div style="background: var(--bg-body); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
        <h5 style="color: var(--brand-navy); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.82rem; letter-spacing: 0.05em;">
          Moderator & Panelists
        </h5>
        <div style="font-size: 0.92rem; margin-bottom: 0.35rem;">
          <strong>Moderator:</strong> ${session.moderator.name} (${session.moderator.country})
        </div>
        <div style="font-size: 0.92rem;">
          <strong>Speakers:</strong>
          <ul style="margin: 0.35rem 0 0 1.25rem; line-height: 1.6;">
            ${session.speakers.map(sp => `<li>${sp.name} (${sp.country}) — <em>${sp.stance}</em></li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: var(--brand-navy); margin-bottom: 0.65rem; text-transform: uppercase; font-size: 0.82rem; letter-spacing: 0.05em;">
          Session Structure & Agenda
        </h5>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${session.structure.map(st => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.85rem; background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.88rem;">
              <span><strong>Phase ${st.phase}:</strong> ${st.title}</span>
              <span style="color: var(--text-muted); font-size: 0.82rem;">${st.duration} • Lead: ${st.lead}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: var(--brand-navy); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.82rem; letter-spacing: 0.05em;">
          Preparation Materials & Motion Dossier
        </h5>
        <ul style="margin-left: 1.25rem; font-size: 0.9rem;">
          ${session.prepMaterials.map(m => `<li><a href="${m.url}" target="_blank" style="color: var(--brand-green); font-weight: 500; text-decoration: underline;">${m.title}</a></li>`).join('')}
        </ul>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${session.status === 'Upcoming' ? `
          <a href="${session.meetingLink}" target="_blank" class="btn btn-primary btn-md" style="gap:6px;">
            ${icons.video} Open Private Meeting Link
          </a>
        ` : `
          <button class="btn btn-navy btn-md" style="gap:6px;" onclick="window.playSessionVideo('${session.id}')">
            ${icons.play} Watch Session Recording
          </button>
        `}
      </div>
    `;

    openModal('sessionDetailModal');
  };

  window.playSessionVideo = function(sessionId) {
    const session = dataService.getSessions().find(s => s.id === sessionId);
    if (!session) return;

    const modalContent = document.getElementById('sessionDetailContent');
    modalContent.innerHTML = `
      <h3 class="serif-text" style="font-size: 1.65rem; color: var(--brand-navy); margin-bottom: 0.5rem;">
        Private Recording: Session ${session.sessionNumber.toString().padStart(2, '0')}
      </h3>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">${session.title}</p>
      
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: var(--radius-lg); background: #000; margin-bottom: 1.5rem;">
        <iframe 
          src="${session.recordingUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}" 
          style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display:inline-flex; align-items:center; gap:5px;">
          ${icons.lock} Private unlisted link restricted to Global Youth Dialogue delegates.
        </span>
        ${session.hasSummary ? `
          <button class="btn btn-primary btn-sm" style="gap:6px;" onclick="window.openAcademicPaperBySession('${session.id}')">
            ${icons.book} Read Academic Summary
          </button>
        ` : ''}
      </div>
    `;

    openModal('sessionDetailModal');
  };

  window.openFullAcademicPaper = function(writingId) {
    const writing = dataService.getWritings().find(w => w.id === writingId);
    if (!writing) return;

    const modalContent = document.getElementById('writingReaderContent');

    let bodyHtml = '';
    if (writing.totalContent) {
      const paragraphs = writing.totalContent
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => `<p style="margin-bottom: 1.15rem; text-align: justify; line-height: 1.8;">${p.replace(/\n/g, '<br>')}</p>`)
        .join('');

      bodyHtml = `
        <div style="line-height: 1.75; font-size: 1rem; color: var(--text-body);">
          <div style="background: rgba(14, 116, 144, 0.06); border-left: 4px solid var(--accent-gold); padding: 1.25rem; border-radius: 4px; margin-bottom: 1.75rem;">
            <h5 style="color: var(--brand-navy); margin: 0 0 0.35rem; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em;">Abstract / Excerpt</h5>
            <p style="margin: 0; font-size: 0.95rem; font-style: italic; color: var(--brand-navy); line-height: 1.6;">${writing.intro}</p>
          </div>

          <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.5rem 0 1rem; font-size: 1.35rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">Academic Article Content</h4>
          <div style="font-size: 1rem; color: var(--text-body);">
            ${paragraphs || `<p style="line-height: 1.8;">${writing.totalContent}</p>`}
          </div>

          ${writing.sources ? `
            <div style="background: var(--bg-body); padding: 1.25rem; border-radius: var(--radius-md); margin-top: 2rem; font-size: 0.88rem; color: var(--text-muted); border: 1px solid var(--border-light);">
              <strong style="color: var(--brand-navy); display: block; margin-bottom: 0.4rem;">09. Citations, Treaties & Academic Bibliography:</strong>
              ${writing.sources}
            </div>
          ` : ''}
        </div>
      `;
    } else {
      bodyHtml = `
        <div style="line-height: 1.75; font-size: 1rem; color: var(--text-body);">
          <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">01. Introduction</h4>
          <p style="margin-bottom: 1rem;">${writing.intro || ''}</p>

          <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">02. Historical & Diplomatic Background</h4>
          <p style="margin-bottom: 1rem;">${writing.background || ''}</p>

          <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">03. Core Affirmative Arguments</h4>
          <ul style="margin: 0 0 1rem 1.5rem;">
            ${(writing.keyArguments || []).map(arg => `<li style="margin-bottom: 0.4rem;">${arg}</li>`).join('')}
          </ul>

          <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">04. Counterarguments & Sovereign Concerns</h4>
          <ul style="margin: 0 0 1rem 1.5rem;">
            ${(writing.counterarguments || []).map(arg => `<li style="margin-bottom: 0.4rem;">${arg}</li>`).join('')}
          </ul>

          <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">05. Evidence & Case Studies</h4>
          <p style="margin-bottom: 1rem;">${writing.evidence || ''}</p>

          <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">06. Discussion Insights</h4>
          <p style="margin-bottom: 1rem;">${writing.insights || ''}</p>

          <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">07. Scholarly Conclusion</h4>
          <p style="margin-bottom: 1rem;">${writing.conclusion || ''}</p>

          <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">08. Further Research Questions</h4>
          <ul style="margin: 0 0 1rem 1.5rem;">
            ${(writing.furtherQuestions || []).map(q => `<li style="margin-bottom: 0.4rem;">${q}</li>`).join('')}
          </ul>

          <div style="background: var(--bg-body); padding: 1rem; border-radius: var(--radius-md); margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted);">
            <strong>09. Citations, Treaties & Academic Bibliography:</strong><br>
            ${writing.sources || 'Global Youth Dialogue Research Archives'}
          </div>
        </div>
      `;
    }

    modalContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span class="badge badge-published">Academic Youth Publication Library</span>
        <button class="btn btn-navy btn-sm" onclick="window.print()" style="gap: 5px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Export Dossier (PDF / Print)
        </button>
      </div>
      <div class="print-only-target" style="padding: 1rem 0;">
        <h2 class="serif-text" style="font-size: 2.15rem; color: var(--brand-navy); line-height: 1.25; margin-bottom: 0.85rem;">
          ${writing.title}
        </h2>
        <div style="display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--text-muted); padding-bottom: 1rem; border-bottom: 1px solid var(--border-light); margin-bottom: 1.5rem; flex-wrap: wrap;">
          <span><strong>Author:</strong> ${writing.author} (${writing.authorRole || 'Presenter'})</span>
          <span><strong>Category:</strong> ${writing.categoryName || writing.category}</span>
          <span><strong>Date:</strong> ${writing.publicationDate || 'Recent'}</span>
          <span><strong>Legacy:</strong> Qatar ISDC7 Network</span>
        </div>

        ${bodyHtml}
      </div>
    `;

    openModal('writingReaderModal');
  };

  window.openAcademicPaperBySession = function(sessionId) {
    const writing = dataService.getWritings().find(w => w.sessionId === sessionId);
    if (writing) {
      closeModal('sessionDetailModal');
      window.openFullAcademicPaper(writing.id);
    } else {
      showToast('Academic synthesis for this session is currently being drafted by researchers.', 'normal');
    }
  };

  window.updateTopicStatus = function(topicId, newStatus) {
    const updated = dataService.updateTopicStatus(topicId, newStatus);
    if (newStatus === 'Approved') {
      showToast(`Topic approved and automatically added to the Academic Topic Bank!`, 'success');
    } else if (newStatus === 'Declined' || newStatus === 'Rejected') {
      showToast(`Topic proposal declined.`, 'normal');
    } else {
      showToast(`Topic updated to status: "${newStatus}"`, 'success');
    }
    if (typeof renderCoordDashboardContent === 'function') renderCoordDashboardContent();
    if (typeof renderCoordTopicsList === 'function') renderCoordTopicsList();
    if (typeof renderCoordTopicBank === 'function') renderCoordTopicBank();
  };

  window.approveTopic = function(topicId) {
    window.updateTopicStatus(topicId, 'Approved');
  };

  window.rejectTopic = function(topicId) {
    window.updateTopicStatus(topicId, 'Declined');
  };

  window.approveApp = function(appId) {
    const app = dataService.approveApplication(appId);
    if (app) {
      showToast(`Approved ${app.name}! An approval confirmation email has been dispatched to ${app.email}. They are now an official member.`, 'success');
      // Reset community filters so newly approved member is immediately visible in The Community directory
      window._coordCommunityFilterRole = 'all';
      window._coordCommunityCountryFilter = 'all';
      window._coordCommunitySearchQuery = '';
      const sInput = document.getElementById('coordCommunitySearchInput');
      if (sInput) sInput.value = '';
      const cFilter = document.getElementById('coordCommunityCountryFilter');
      if (cFilter) cFilter.value = 'all';

      renderCoordinatorPortal();
      if (typeof renderCoordDashboardContent === 'function') renderCoordDashboardContent();
      if (typeof renderCoordApplicationsList === 'function') renderCoordApplicationsList();
      if (typeof renderCoordCommunityRoster === 'function') renderCoordCommunityRoster();
    }
  };

  window.rejectApp = function(appId) {
    dataService.rejectApplication(appId);
    showToast('Application declined.', 'normal');
    renderCoordinatorPortal();
  };

  window.approvePresenterApp = function(appId) {
    const res = dataService.approvePresenterApplication(appId);
    if (res && res.app) {
      showToast(`Accredited ${res.app.name} as Official Presenter! They can now sign in to the Presenter Portal with their same email and password.`, 'success');
      if (typeof renderCoordinatorPortal === 'function') renderCoordinatorPortal();
      if (typeof renderCoordCommunityRoster === 'function') renderCoordCommunityRoster();
      if (typeof updateMemberPresenterButtonState === 'function') updateMemberPresenterButtonState();
    }
  };

  window.rejectPresenterApp = function(appId) {
    const res = dataService.rejectPresenterApplication(appId);
    if (res) {
      showToast('Presenter application declined.', 'normal');
      if (typeof renderCoordinatorPortal === 'function') renderCoordinatorPortal();
      if (typeof updateMemberPresenterButtonState === 'function') updateMemberPresenterButtonState();
    }
  };

  // =========================================================================
  // PHASE 2 CONTROLLERS: Search, Notifications, Calendar, Chapters, Media, Analytics
  // =========================================================================

  // 1. Universal Search (Ctrl + K)
  function initGlobalSearch() {
    const searchBtn = document.getElementById('headerSearchBtn');
    const searchInput = document.getElementById('globalSearchInput');
    const searchClose = document.getElementById('searchModalClose');
    const searchResults = document.getElementById('globalSearchResults');
    const filterPills = document.querySelectorAll('#searchFilterPills .search-filter-pill');

    let activeFilter = 'all';

    function openSearch() {
      openModal('globalSearchModal');
      setTimeout(() => searchInput?.focus(), 120);
      performSearch();
    }

    searchBtn?.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', () => closeModal('globalSearchModal'));

    // Keyboard shortcut: Ctrl + K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeModal('globalSearchModal');
      }
    });

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.getAttribute('data-filter') || 'all';
        performSearch();
      });
    });

    searchInput?.addEventListener('input', () => {
      performSearch();
    });

    function performSearch() {
      if (!searchResults) return;
      const query = (searchInput?.value || '').trim();
      let results = dataService.searchAll(query);
      if (activeFilter !== 'all') {
        results = results.filter(r => r.type === activeFilter);
      }

      if (results.length === 0) {
        searchResults.innerHTML = `
          <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
            <p style="font-size: 0.95rem; margin-bottom: 0.25rem;">No results found for "${query || '...'}"</p>
            <span style="font-size: 0.8rem;">Try searching for "Security Council", "AI", "Climate", or a member's name.</span>
          </div>
        `;
        return;
      }

      searchResults.innerHTML = results.map(item => `
        <div class="search-result-card" data-result-type="${item.type}" data-result-target="${item.targetView}" data-result-id="${item.id}">
          <div class="search-result-info">
            <div class="search-result-title">${item.title}</div>
            <div class="search-result-sub">${item.subtitle}</div>
          </div>
          <span class="search-result-badge">${item.typeLabel}</span>
        </div>
      `).join('');

      searchResults.querySelectorAll('.search-result-card').forEach(card => {
        card.addEventListener('click', () => {
          const type = card.getAttribute('data-result-type');
          const targetView = card.getAttribute('data-result-target');
          const id = card.getAttribute('data-result-id');
          closeModal('globalSearchModal');

          if (type === 'session') {
            window.openSessionModal(id);
          } else if (type === 'writing') {
            window.openWritingModal(id);
          } else if (targetView) {
            if (authService.isCoordinator()) {
              navigateToPortal('coordinator');
              switchCoordSubview(targetView);
            } else if (authService.isLoggedIn()) {
              navigateToPortal('member');
              switchMemberSubview(targetView);
            } else {
              navigateToPortal('public');
            }
          }
        });
      });
    }
  }

  // 2. In-App Notifications Center
  function initNotifications() {
    const notifBtn = document.getElementById('headerNotifBtn');
    const notifModalClose = document.getElementById('notificationsModalClose');
    const markAllRead = document.getElementById('markAllReadBtn');

    function updateBadge() {
      const unreadCount = dataService.getUnreadNotificationsCount();
      const countBadge = document.getElementById('notifCountBadge');
      const totalBadge = document.getElementById('notifTotalBadge');
      if (countBadge) {
        countBadge.textContent = unreadCount;
        countBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
      }
      if (totalBadge) {
        totalBadge.textContent = `${unreadCount} Unread`;
      }
      document.querySelectorAll('.portal-notif-count').forEach(el => {
        el.textContent = unreadCount;
        el.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
      });
    }

    function renderNotificationList() {
      const list = document.getElementById('notificationsList');
      if (!list) return;
      const notifs = dataService.getNotifications();

      if (notifs.length === 0) {
        list.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No notifications yet.</div>`;
        return;
      }

      list.innerHTML = notifs.map(n => `
        <div class="notif-card ${n.read ? '' : 'unread'}" data-notif-id="${n.id}">
          <div class="notif-icon-wrap">
            ${n.type === 'session' ? icons.calendar : n.type === 'writing' ? icons.book : n.type === 'topic' ? icons.lightbulb : icons.bell}
          </div>
          <div style="flex: 1;">
            <div class="notif-title-row">
              <span class="notif-title">${n.title}</span>
              <span class="notif-time-tag">${n.time}</span>
            </div>
            <p class="notif-body">${n.message}</p>
          </div>
          ${n.read ? '' : '<div class="unread-dot"></div>'}
        </div>
      `).join('');

      list.querySelectorAll('.notif-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-notif-id');
          const notif = dataService.markNotificationRead(id);
          updateBadge();
          renderNotificationList();
          if (notif && notif.targetView) {
            closeModal('notificationsModal');
            if (notif.type === 'session' && notif.targetId) {
              window.openSessionModal(notif.targetId);
            } else if (notif.type === 'writing' && notif.targetId) {
              window.openWritingModal(notif.targetId);
            } else if (authService.isCoordinator()) {
              navigateToPortal('coordinator');
              switchCoordSubview(notif.targetView);
            } else if (authService.isLoggedIn()) {
              navigateToPortal('member');
              switchMemberSubview(notif.targetView);
            }
          }
        });
      });
    }

    notifBtn?.addEventListener('click', () => {
      openModal('notificationsModal');
      renderNotificationList();
    });

    document.querySelectorAll('.portal-notif-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openModal('notificationsModal');
        renderNotificationList();
      });
    });

    notifModalClose?.addEventListener('click', () => closeModal('notificationsModal'));

    markAllRead?.addEventListener('click', () => {
      dataService.markAllNotificationsRead();
      updateBadge();
      renderNotificationList();
      showToast('All notifications marked as read', 'success');
    });

    window.updateNotificationBadge = updateBadge;
    if (window.GYD_AUTH && typeof window.GYD_AUTH.subscribe === 'function') {
      window.GYD_AUTH.subscribe(() => {
        updateBadge();
        const modal = document.getElementById('notificationsModal');
        if (modal && modal.style.display !== 'none') {
          renderNotificationList();
        }
      });
    }

    updateBadge();
  }

  // 3. Timezone Converter & Calendar Engine
  let activeTimezone = { code: 'AST', offset: 3, label: 'Doha (AST GMT+3)' };

  function renderMemberCalendarView() {
    const container = document.getElementById('memberCalendarList');
    const pillsContainer = document.getElementById('tzSelectorPills');
    const tzDesc = document.getElementById('currentTzDesc');
    if (!container) return;

    if (tzDesc) {
      tzDesc.textContent = `Showing times converted to ${activeTimezone.label}`;
    }

    // Bind timezone pills
    if (pillsContainer) {
      pillsContainer.querySelectorAll('.tz-pill').forEach(pill => {
        pill.onclick = () => {
          pillsContainer.querySelectorAll('.tz-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const code = pill.getAttribute('data-tz');
          const offset = parseInt(pill.getAttribute('data-offset'), 10);
          const label = pill.textContent.trim();
          activeTimezone = { code, offset, label };
          renderMemberCalendarView();
          showToast(`Clock switched to ${label}`);
        };
      });
    }

    const sessions = dataService.getSessions();
    container.innerHTML = sessions.map(ses => {
      const baseHour = 16; // 16:00 UTC+3 Doha
      const diff = activeTimezone.offset - 3;
      let targetHour = (baseHour + diff);
      if (targetHour < 0) targetHour += 24;
      if (targetHour >= 24) targetHour -= 24;
      const formattedTime = `${targetHour.toString().padStart(2, '0')}:00 ${activeTimezone.code}`;

      const dateParts = ses.date.split('-');
      const day = dateParts[2] || '18';
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const month = monthNames[parseInt(dateParts[1], 10) - 1] || 'Oct';

      // Google calendar URL
      const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Global Youth Dialogue: ' + ses.title)}&dates=${ses.date.replace(/-/g, '')}T${targetHour.toString().padStart(2, '0')}0000Z/${ses.date.replace(/-/g, '')}T${(targetHour + 2).toString().padStart(2, '0')}0000Z&details=${encodeURIComponent('Motion: ' + ses.motion + '\nMeeting Link: ' + ses.meetLink)}&location=${encodeURIComponent('Google Meet: ' + ses.meetLink)}`;

      return `
        <div class="calendar-card">
          <div class="calendar-date-block">
            <div class="calendar-date-num">${day}</div>
            <div class="calendar-date-month">${month}</div>
            <div class="calendar-time-converted">${formattedTime}</div>
          </div>
          <div>
            <div class="calendar-meta-title">Session ${ses.sessionNumber.toString().padStart(2, '0')}: ${ses.title}</div>
            <div class="calendar-motion-quote">"${ses.motion}"</div>
            <div class="calendar-speakers-tags">
              <span class="country-pill" style="background: var(--brand-green-light); color: var(--brand-green); font-weight: 600;">${ses.status}</span>
              <span class="country-pill">Format: ${ses.format}</span>
              <span class="country-pill">${icons.hourglass} ${ses.duration}</span>
            </div>
          </div>
          <div class="calendar-actions-col">
            <a href="${ses.meetLink}" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none;">
              ${icons.video} Join Google Meet
            </a>
            <a href="${gCalUrl}" target="_blank" class="btn btn-outline btn-sm" style="text-align: center; text-decoration: none; font-size: 0.76rem;">
              ${icons.calendar} Google Calendar
            </a>
            <button class="btn btn-subtle btn-sm" onclick="window.downloadIcs('${ses.id}', '${formattedTime}')" style="font-size: 0.74rem;">
              Download .ics
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 4. Country Chapters Hub
  function renderCountryChapters() {
    const reps = dataService.getCountryReps();
    const publicGrid = document.getElementById('publicRepsGrid');
    const memberGrid = document.getElementById('memberRepsGrid');
    const coordGrid = document.getElementById('coordRepsGrid');
    const isAr = i18n.isRTL();

    const generateHtml = () => reps.map(r => {
      const repName = isAr ? (r.repNameAr || r.repName) : r.repName;
      const country = isAr ? (r.countryAr || r.country) : r.country;
      const chapterName = isAr ? (r.chapterNameAr || r.chapterName) : r.chapterName;
      const bio = isAr ? (r.bioAr || r.bio) : r.bio;
      const isdcTeam = isAr ? (r.isdcTeamAr || r.isdcTeam) : r.isdcTeam;
      const originLabel = isAr ? 'الفريق في بطولة قطر:' : 'Origin:';
      const debatersCount = isAr 
        ? `${r.activeDebaters.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])} مناظراً نشطاً`
        : `${r.activeDebaters} Active Debaters`;
      const contactLabel = isAr ? 'تواصل مع المنسق' : 'Contact Rep';

      return `
      <div class="rep-card">
        <div>
          <div class="rep-header">
            <div class="rep-flag-box">${icons.getFlag(r.country, r.flag)}</div>
            <div>
              <div class="rep-name">${repName}</div>
              <div class="rep-chapter-title">${country} • ${chapterName}</div>
            </div>
          </div>
          <p class="rep-bio">${bio}</p>
        </div>
        <div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <strong>${originLabel}</strong> ${isdcTeam}
          </div>
          <div class="rep-stats-row">
            <span style="display:inline-flex;align-items:center;gap:5px;">${icons.users} ${debatersCount}</span>
            <a href="mailto:${r.email}" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.74rem; text-decoration: none;">
              ${icons.mail} ${contactLabel}
            </a>
          </div>
        </div>
      </div>
    `;
    }).join('');

    if (publicGrid) publicGrid.innerHTML = generateHtml();
    if (memberGrid) memberGrid.innerHTML = generateHtml();
    if (coordGrid) coordGrid.innerHTML = generateHtml();
  }

  // 5. Media & PR Content Studio
  function renderMediaKits() {
    const grid = document.getElementById('coordMediaKitsGrid');
    if (!grid) return;
    const kits = dataService.getMediaKits();

    grid.innerHTML = kits.map(k => `
      <div class="media-kit-card">
        <div>
          <span class="media-kit-type-tag">${k.category || 'Promo Kit'}</span>
          <div class="media-kit-title">${k.title}</div>
          <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-body); margin-bottom: 0.5rem;">
            ${k.headline}
          </div>
          <div class="media-copy-box" id="copyBox_${k.id}">${k.copyText}</div>
        </div>
        <div class="media-actions-bar">
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
            ${(k.tags || []).map(t => `<span class="country-pill" style="font-size: 0.7rem;">#${t}</span>`).join('')}
          </div>
          <button class="btn btn-navy btn-sm" onclick="window.copyMediaText('copyBox_${k.id}')" style="gap: 0.4rem;">
            ${icons.copy} Copy Text
          </button>
        </div>
      </div>
    `).join('');
  }

  // 6. Member Journey & Honor Badges
  function renderMemberJourneyView() {
    const user = authService.getCurrentUser();
    if (!user) return;
    const stats = dataService.getUserAnalytics(user.id);

    const statsStrip = document.getElementById('memberAnalyticsStrip');
    if (statsStrip) {
      statsStrip.innerHTML = `
        <div class="analytics-stat-card">
          <div class="analytics-stat-num">${stats.sessionsAttended}</div>
          <div class="analytics-stat-label">Dialogues Attended</div>
        </div>
        <div class="analytics-stat-card">
          <div class="analytics-stat-num">${stats.debatesSpoken}</div>
          <div class="analytics-stat-label">Debates Spoken</div>
        </div>
        <div class="analytics-stat-card">
          <div class="analytics-stat-num">${stats.writingsAuthored}</div>
          <div class="analytics-stat-label">Academic Papers Authored</div>
        </div>
        <div class="analytics-stat-card">
          <div class="analytics-stat-num">${stats.engagementScore}%</div>
          <div class="analytics-stat-label">Community Score</div>
        </div>
      `;
    }

    const badgesGrid = document.getElementById('memberBadgesGrid');
    if (badgesGrid) {
      badgesGrid.innerHTML = stats.badges.map(b => `
        <div class="badge-honor-card ${b.unlocked ? '' : 'locked'}">
          <div>
            <div class="badge-icon-header">
              <div class="badge-icon-box">
                ${icons[b.icon] || icons.award}
              </div>
              <span class="badge-status-pill ${b.unlocked ? 'status-approved' : 'status-review'}" style="font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 999px;">
                ${b.unlocked ? `${icons.check} UNLOCKED` : 'IN PROGRESS'}
              </span>
            </div>
            <div class="badge-title">${b.title}</div>
            <p class="badge-desc">${b.desc}</p>
          </div>
          <div class="badge-progress-wrap">
            <div class="badge-progress-bar">
              <div class="badge-progress-fill" style="width: ${b.progress};"></div>
            </div>
            <div class="badge-progress-label">
              <span>Progress</span>
              <span>${b.progress}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // 7. Coordinator Forms Initialization
  function initPhase2Forms() {
    // New Country Chapter
    document.getElementById('coordNewChapterBtn')?.addEventListener('click', () => openModal('newChapterModal'));
    document.getElementById('newChapterForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const country = document.getElementById('chapCountry').value.trim();
      const flag = document.getElementById('chapFlag').value.trim();
      const chapterName = document.getElementById('chapName').value.trim();
      const repName = document.getElementById('chapRepName').value.trim();
      const email = document.getElementById('chapEmail').value.trim();
      const isdcTeam = document.getElementById('chapIsdcTeam').value.trim();
      const activeDebaters = document.getElementById('chapDebatersCount').value.trim();
      const bio = document.getElementById('chapBio').value.trim();

      dataService.addCountryRep({
        country,
        flag,
        chapterName,
        repName,
        email,
        isdcTeam,
        activeDebaters,
        bio
      });

      closeModal('newChapterModal');
      document.getElementById('newChapterForm').reset();
      renderCountryChapters();
      showToast(`Registered new chapter: ${country} (${chapterName})!`, 'success');
    });

    // New Media Kit
    document.getElementById('coordNewMediaKitBtn')?.addEventListener('click', () => openModal('newMediaKitModal'));
    document.getElementById('newMediaKitForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('mkTitle').value.trim();
      const type = document.getElementById('mkType').value;
      const headline = document.getElementById('mkHeadline').value.trim();
      const copyText = document.getElementById('mkCopyText').value.trim();
      const tags = document.getElementById('mkTags').value.split(',').map(t => t.trim()).filter(Boolean);

      dataService.createMediaKit({
        title,
        type,
        category: type === 'instagram_caption' ? 'Instagram' : (type === 'quote_card' ? 'Quote' : 'PR'),
        headline,
        copyText,
        tags
      });

      closeModal('newMediaKitModal');
      document.getElementById('newMediaKitForm').reset();
      renderMediaKits();
      showToast(`Published new Media Kit: "${title}"!`, 'success');
    });
  }

  // Global Helpers for Media Copy and Calendar .ics
  window.copyMediaText = function(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText || el.textContent).then(() => {
      showToast('Copied text to clipboard! Ready to paste into Instagram or WhatsApp.', 'success');
    }).catch(() => {
      showToast('Press Ctrl+C to copy selected text.', 'normal');
    });
  };

  window.downloadIcs = function(sessionId, formattedTime) {
    const ses = dataService.getSessions().find(s => s.id === sessionId);
    if (!ses) return;

    const dtParts = ses.date.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Global Youth Dialogue//Dialogue Sessions//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:Global Youth Dialogue: ${ses.title}`,
      `DESCRIPTION:Motion: ${ses.motion}\\n\\nMeeting Link: ${ses.meetLink}`,
      `LOCATION:Google Meet: ${ses.meetLink}`,
      `DTSTART:${dtParts}T130000Z`,
      `DTEND:${dtParts}T150000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `GYD_Session_${ses.sessionNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded calendar file: GYD_Session_${ses.sessionNumber}.ics`, 'success');
  };

  // =========================================================================
  // PHASE 3: LIVE CHAMBER TIMER, POI AUDIO & OFFICIAL CERTIFICATES
  // =========================================================================

  // 1. Web Audio Bell Chime Synthesizer (Zero-dependency, offline)
  function playChimeBell(count = 1) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      for (let i = 0; i < count; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + (i * 0.3);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, startTime); // A5 chime bell
        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.7);
      }
    } catch (err) {
      console.warn('Audio chime playback restricted or unsupported:', err);
    }
  }

  // 2. Official Chamber Speech Timer Engine
  let chamberTimerInterval = null;
  let chamberSecondsElapsed = 0;
  let chamberTotalSeconds = 420; // 7 minutes default (Constructive)
  let chamberIsRunning = false;

  function updateChamberTimerDisplay() {
    const digitsEl = document.getElementById('timerDigits');
    const bannerEl = document.getElementById('poiBanner');
    if (!digitsEl || !bannerEl) return;

    const mins = Math.floor(chamberSecondsElapsed / 60);
    const secs = chamberSecondsElapsed % 60;
    digitsEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // POI State Transitions
    if (chamberSecondsElapsed < 60) {
      // 0:00 - 1:00 Protected Time
      bannerEl.className = 'poi-banner protected';
      bannerEl.innerHTML = `<span class="timer-banner-icon">${icons.lock}</span> PROTECTED TIME (1ST MINUTE — NO POIs)`;
    } else if (chamberSecondsElapsed >= 60 && chamberSecondsElapsed < (chamberTotalSeconds - 60)) {
      // 1:00 - (Total - 1:00) Open Floor for POIs
      bannerEl.className = 'poi-banner open';
      bannerEl.innerHTML = `<span class="timer-banner-icon">${icons.bell}</span> FLOOR OPEN FOR POIs (Points of Information Permitted)`;
    } else if (chamberSecondsElapsed >= (chamberTotalSeconds - 60) && chamberSecondsElapsed <= chamberTotalSeconds) {
      // Final Minute Protected Time
      bannerEl.className = 'poi-banner protected';
      bannerEl.innerHTML = `<span class="timer-banner-icon">${icons.lock}</span> PROTECTED TIME (FINAL MINUTE — NO POIs)`;
    } else {
      // Overtime
      bannerEl.className = 'poi-banner overtime';
      bannerEl.innerHTML = chamberSecondsElapsed > chamberTotalSeconds + 15
        ? `<span class="timer-banner-icon">${icons.stopCircle || icons.shield}</span> SPEECH OVERTIME — PLEASE CONCLUDE IMMEDIATELY`
        : `<span class="timer-banner-icon">${icons.alertTriangle || icons.zap}</span> TIME EXPIRED (GRACE PERIOD: 15 SECONDS)`;
    }
  }

  function initChamberTimer() {
    const digitsEl = document.getElementById('timerDigits');
    const startBtn = document.getElementById('timerStartBtn');
    const pauseBtn = document.getElementById('timerPauseBtn');
    const resetBtn = document.getElementById('timerResetBtn');
    const bellBtn = document.getElementById('timerBellBtn');
    const raisePoiBtn = document.getElementById('raisePoiBtn');
    const poiList = document.getElementById('poiQueueList');

    if (!digitsEl) return;

    // Reset display
    updateChamberTimerDisplay();

    // Format selection pills
    document.querySelectorAll('#subviewMemberChamber [data-timer-len]').forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll('#subviewMemberChamber [data-timer-len]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        chamberTotalSeconds = parseInt(pill.getAttribute('data-timer-len'), 10);
        
        // Reset running timer
        if (chamberTimerInterval) clearInterval(chamberTimerInterval);
        chamberTimerInterval = null;
        chamberIsRunning = false;
        chamberSecondsElapsed = 0;
        if (startBtn) startBtn.innerHTML = `${icons.play} Start Speech`;
        updateChamberTimerDisplay();
        showToast(`Format set to ${pill.getAttribute('data-format-name') || pill.textContent.trim()}`);
      };
    });

    if (startBtn) {
      startBtn.onclick = () => {
        if (chamberIsRunning) return;
        chamberIsRunning = true;
        startBtn.innerHTML = `${icons.play} Running...`;

        chamberTimerInterval = setInterval(() => {
          chamberSecondsElapsed++;
          updateChamberTimerDisplay();

          // Chime triggers
          if (chamberSecondsElapsed === 60) {
            playChimeBell(1);
            showToast('1 Minute Elapsed: Floor is now OPEN for POIs!', 'normal');
          } else if (chamberSecondsElapsed === (chamberTotalSeconds - 60)) {
            playChimeBell(1);
            showToast('Protected Time: Final minute reached, no further POIs.', 'normal');
          } else if (chamberSecondsElapsed === chamberTotalSeconds) {
            playChimeBell(2);
            showToast('Time Expired! 15 seconds grace period begins.', 'normal');
          } else if (chamberSecondsElapsed === chamberTotalSeconds + 15) {
            playChimeBell(3);
            showToast('Grace period concluded! Please gavel speech.', 'error');
          }
        }, 1000);
      };
    }

    if (pauseBtn) {
      pauseBtn.onclick = () => {
        if (!chamberIsRunning) return;
        clearInterval(chamberTimerInterval);
        chamberTimerInterval = null;
        chamberIsRunning = false;
        if (startBtn) startBtn.textContent = '▶ Resume Speech';
        showToast('Speech timer paused.');
      };
    }

    if (resetBtn) {
      resetBtn.onclick = () => {
        if (chamberTimerInterval) clearInterval(chamberTimerInterval);
        chamberTimerInterval = null;
        chamberIsRunning = false;
        chamberSecondsElapsed = 0;
        if (startBtn) startBtn.textContent = '▶ Start Speech';
        updateChamberTimerDisplay();
        showToast('Speech timer reset to 00:00.');
      };
    }

    if (bellBtn) {
      bellBtn.onclick = () => {
        playChimeBell(1);
        showToast('Chamber Bell Chimed (Gavel Check)');
      };
    }

    if (raisePoiBtn && poiList) {
      raisePoiBtn.onclick = () => {
        const user = authService.getCurrentUser() || { name: 'Delegate', country: 'Global' };
        const poiTopic = prompt('Enter POI subject or question (e.g. Sovereign Debt / Clause 4):', 'Clarification on Motion');
        if (!poiTopic) return;

        const item = document.createElement('div');
        item.className = 'poi-standing-item';
        item.innerHTML = `
          <div>
            <strong>${user.name} (${user.country})</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${poiTopic}</div>
          </div>
          <button class="btn btn-subtle btn-sm" onclick="this.parentElement.remove()">Dismiss</button>
        `;
        poiList.prepend(item);
        playChimeBell(1);
        showToast(`POI offered by ${user.name} (${user.country})!`, 'success');
      };
    }
  }

  // 3. Official Certificate of Participation Generator
  function renderMemberCertificate() {
    const user = authService.getCurrentUser();
    const cert = dataService.getCertificateData(user ? user.id : 'usr_mem_1');

    const nameEl = document.getElementById('certRecipientName');
    const roleEl = document.getElementById('certCountryRole');
    const idEl = document.getElementById('certVerificationId');
    const printBtn = document.getElementById('printCertBtn');

    if (nameEl) nameEl.textContent = cert.recipientName;
    if (roleEl) roleEl.textContent = `${cert.country} • ${cert.role} Delegate`;
    if (idEl) idEl.textContent = cert.certificateNumber;

    if (printBtn) {
      printBtn.onclick = (e) => {
        if (e) e.preventDefault();
        showToast('Official Participation Certificates are temporarily disabled and will be enabled soon.', 'warning');
      };
    }
  }

  // 4. Community Topic Ballot Upvote Global Function
  window.voteTopic = function(topicId) {
    const user = authService.getCurrentUser();
    const userId = user ? user.id : 'usr_mem_1';
    const result = dataService.upvoteTopic(topicId, userId);
    if (result) {
      const countEl = document.getElementById(`voteCount_${topicId}`);
      if (countEl) countEl.textContent = result.upvotes;
      showToast(result.hasUpvoted ? '▲ Upvoted topic in the community ballot!' : 'Upvote removed.', 'success');
    }
  };

  // =========================================================================
  // INITIALIZE APP
  // =========================================================================
  function renderAll() {
    i18n.applyLanguage();
    if (typeof syncTrialDeletionUI === 'function') syncTrialDeletionUI();
    const user = authService.getCurrentUser();
    const hash = window.location.hash;

    if (hash === '#signin' || hash === '#login') {
      navigateToPortal('signin');
      return;
    }

    if (user) {
      if (user.role === 'Coordinator') {
        navigateToPortal('coordinator');
      } else {
        navigateToPortal('member');
      }
    } else {
      navigateToPortal('public');
    }
  }

  // Initialize base browser history state on load so Back navigation has an in-app root
  try {
    if (!history.state) {
      const initialHash = (window.location.hash || '').replace(/^#/, '') || 'home';
      const isPublic = ['home', 'about', 'topics', 'sessions', 'impact'].includes(initialHash);
      history.replaceState({
        type: isPublic ? 'section' : 'portal',
        portal: isPublic ? 'public' : initialHash,
        section: isPublic ? initialHash : 'home'
      }, '', window.location.hash || '#home');
    }
  } catch (e) {}

  // Handle popstate for native browser & mobile phone Back button navigation
  window.addEventListener('popstate', (e) => {
    isNavigatingBack = true;

    try {
      // 1. If any modal is currently open, dismiss it and stay on the current page
      if (modalHistoryStack && modalHistoryStack.length > 0) {
        const topModalId = modalHistoryStack.pop();
        const modal = document.getElementById(topModalId);
        if (modal) {
          modal.classList.remove('active');
          setTimeout(() => {
            if (!modal.classList.contains('active')) modal.style.display = 'none';
          }, 250);
          document.body.style.overflow = '';
        }
        return;
      }

      const openModals = document.querySelectorAll('.modal-backdrop.active, .modal-backdrop[style*="display: flex"]');
      if (openModals.length > 0) {
        openModals.forEach(m => {
          m.classList.remove('active');
          m.style.display = 'none';
        });
        document.body.style.overflow = '';
        return;
      }

      // 2. If mobile drawer is open, dismiss it and stay on the current page
      const drawer = document.getElementById('mobileNavDrawer');
      if (drawer && drawer.classList.contains('active')) {
        closeMobileDrawer(false);
        return;
      }

      // 3. Handle state or URL hash restoration
      const state = e.state;
      const rawHash = (window.location.hash || '').replace(/^#/, '');

      if (state && state.type === 'portalSub') {
        if (activePortal !== state.portal) navigateToPortal(state.portal, false);
        if (state.portal === 'member' && typeof switchMemberSubview === 'function') {
          switchMemberSubview(state.subview, false);
        } else if (state.portal === 'coordinator' && typeof switchCoordSubview === 'function') {
          switchCoordSubview(state.subview, false);
        } else if (state.portal === 'presenter' && typeof switchPresenterSubview === 'function') {
          switchPresenterSubview(state.subview, false);
        }
        return;
      }

      if (state && state.type === 'portal') {
        navigateToPortal(state.portal, false);
        if (state.portal === 'public') {
          switchPublicSection(state.section || 'home', false);
        }
        return;
      }

      if (state && state.type === 'section') {
        if (activePortal !== 'public') navigateToPortal('public', false);
        switchPublicSection(state.section || 'home', false);
        return;
      }

      // Fallback hash check
      if (rawHash === 'signin' || rawHash === 'login') {
        navigateToPortal('signin', false);
      } else if (rawHash.startsWith('member')) {
        const parts = rawHash.split('/');
        navigateToPortal('member', false);
        if (parts[1] && typeof switchMemberSubview === 'function') switchMemberSubview(parts[1], false);
      } else if (rawHash.startsWith('coordinator')) {
        const parts = rawHash.split('/');
        navigateToPortal('coordinator', false);
        if (parts[1] && typeof switchCoordSubview === 'function') switchCoordSubview(parts[1], false);
      } else if (rawHash.startsWith('presenter')) {
        const parts = rawHash.split('/');
        navigateToPortal('presenter', false);
        if (parts[1] && typeof switchPresenterSubview === 'function') switchPresenterSubview(parts[1], false);
      } else {
        const valid = ['about', 'topics', 'sessions', 'impact'];
        const isProc = (rawHash === 'process');
        const section = isProc ? 'process' : (valid.includes(rawHash) ? rawHash : 'home');
        if (activePortal !== 'public') navigateToPortal('public', false);
        switchPublicSection(section, false);
      }
    } finally {
      setTimeout(() => {
        isNavigatingBack = false;
      }, 50);
    }
  });

  // Handle URL hash changes for direct navigation
  window.addEventListener('hashchange', () => {
    if (isNavigatingBack) return;
    const rawHash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    if (rawHash === 'signin' || rawHash === 'login') {
      if (activePortal !== 'signin') navigateToPortal('signin', false);
    } else if (rawHash === 'public' || rawHash === 'home') {
      if (activePortal !== 'public') navigateToPortal('public', false);
      switchPublicSection('home', false);
    } else {
      const valid = ['about', 'topics', 'sessions', 'impact'];
      const isProc = (rawHash === 'process');
      if (isProc || valid.includes(rawHash)) {
        if (activePortal !== 'public') navigateToPortal('public', false);
        switchPublicSection(isProc ? 'process' : rawHash, false);
      }
    }
  });

  // Initialize Phase 2 Services
  initGlobalSearch();
  initNotifications();
  initPhase2Forms();

  // Delete Trial Data — restricted strictly to Administrator / Coordinator
  document.addEventListener('click', (e) => {
    const trialBtn = e.target.closest(
      '.btn-delete-trial-data, #btnDeleteTrialData, #coordSidebarDeleteTrialBtn'
    );
    if (trialBtn) {
      e.preventDefault();
      if (!authService || !authService.isCoordinator()) {
        showToast('Access restricted: Delete Trial Data is only accessible to Coordinators & Administrators.', 'warning');
        return;
      }
      openModal('deleteTrialModal');
    }
  });

  // Global Delete Trial Data — confirm button handler
  const _globalConfirmDeleteBtn = document.getElementById('btnConfirmDeleteTrial');
  if (_globalConfirmDeleteBtn) {
    _globalConfirmDeleteBtn.onclick = () => {
      try {
        localStorage.removeItem('gyd_applied_email');
        localStorage.removeItem('gyd_pending_registration');
        localStorage.removeItem('gyd_otp_session');
        localStorage.removeItem('gyd_user_votes');
        localStorage.removeItem('gyd_ballot_votes');
        localStorage.removeItem('gyd_deleted_community_emails');
      } catch (e) {}

      if (dataService && typeof dataService.clearTrialData === 'function') {
        dataService.clearTrialData();
      } else if (dataService && typeof dataService.resetToDefault === 'function') {
        dataService.resetToDefault();
      }

      // Restore session to the sole Administrator account
      const adminUser = {
        id: 'usr_admin_mubashir',
        name: 'Mubashir CP',
        email: '3681mubashircp@gmail.com',
        role: 'Coordinator',
        department: 'Executive Leadership & Administration',
        country: 'India',
        flag: 'IN'
      };
      if (authService && typeof authService.saveSession === 'function') {
        authService.saveSession(adminUser);
      }

      closeModal('deleteTrialModal');
      showToast('All demo and trial profiles, test applications, and submissions have been permanently deleted. Only Administrator Mubashir CP remains active.', 'success');

      // Reset community filters
      window._coordCommunityFilterRole = 'all';
      window._coordCommunityCountryFilter = 'all';
      window._coordCommunitySearchQuery = '';
      const sInput = document.getElementById('coordCommunitySearchInput');
      if (sInput) sInput.value = '';
      const cFilter = document.getElementById('coordCommunityCountryFilter');
      if (cFilter) cFilter.value = 'all';

      // Re-render all coordinator views & community roster
      if (typeof renderCoordinatorPortal === 'function') {
        renderCoordinatorPortal();
      }
      if (typeof renderCoordDashboardContent === 'function') renderCoordDashboardContent();
      if (typeof renderCoordCommunityRoster === 'function') renderCoordCommunityRoster();
      if (typeof renderCoordApplicationsList === 'function') renderCoordApplicationsList();
      if (typeof renderCoordTopicsList === 'function') renderCoordTopicsList();
      if (typeof renderCoordTopicBank === 'function') renderCoordTopicBank();
      if (typeof renderCoordTeamList === 'function') renderCoordTeamList();
      if (typeof renderCoordFeedbackList === 'function') renderCoordFeedbackList();
      if (typeof renderProfileView === 'function') renderProfileView('coordinator');
      if (typeof renderPresenterPortal === 'function') renderPresenterPortal();
      if (typeof renderMemberPortal === 'function') renderMemberPortal();
      if (typeof renderMemberCommunityDirectory === 'function') renderMemberCommunityDirectory();
    };
  }

  
  // Re-render all dynamic content instantly on language change
  window.addEventListener('gyd-lang-changed', () => {
    updateAuthHeaderUI();
    if (activePortal === 'public') {
      renderPublicPage();
    } else if (activePortal === 'member') {
      renderMemberPortal();
    } else if (activePortal === 'presenter') {
      renderPresenterPortal();
    } else if (activePortal === 'coordinator') {
      renderCoordinatorPortal();
    }
  });

  renderAll();

  // Sync applications from remote server and update approved applicant notification
  if (dataService && typeof dataService.syncRemoteApplications === 'function') {
    dataService.syncRemoteApplications().then(() => {
      checkApprovedApplicantNotice();
    });
  } else {
    checkApprovedApplicantNotice();
  }
});
