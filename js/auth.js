/**
 * GLOBAL YOUTH DIALOGUE - Role-Based Authentication Service
 * Supports Member, Presenter, and Coordinator roles with strict portal gatekeeping.
 * Includes approved-application tracking and OTP-based registration flow.
 */

const AUTH_STORAGE_KEY = 'gyd_active_session';
const PENDING_REG_KEY  = 'gyd_pending_registration';  // tracks approved applicants awaiting signup
const OTP_STORAGE_KEY  = 'gyd_otp_session';           // ephemeral OTP storage

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
    this.cleanupOrphanPending();
    this.listeners = [];
  }

  cleanupOrphanPending() {
    try {
      const pending = this.getPendingRegistration();
      const applied = localStorage.getItem('gyd_applied_email');
      if (pending && (!applied || (pending.email && pending.email.toLowerCase().trim() !== applied.toLowerCase().trim()))) {
        this.clearPendingRegistration();
      }
    } catch (e) {}
  }

  loadSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed || !parsed.email) return null;
        const cleanEmail = (parsed.email || '').trim().toLowerCase();

        // Check if user was deleted
        let isDeleted = false;
        try {
          const deletedList = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
          if (Array.isArray(deletedList) && deletedList.includes(cleanEmail)) isDeleted = true;
        } catch (e) {}
        if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.deletedUserEmails)) {
          if (window.GYD_DATA.db.deletedUserEmails.includes(cleanEmail)) isDeleted = true;
        }
        if (isDeleted) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          return null;
        }

        const demoEmails = [
          'member@gyd.org', 'presenter@gyd.org', 'coordinator@gyd.org',
          'amara.chen@gyd.org', 'elena.rostova@gyd.org', 'zaid.harbi@gyd.org',
          'sofia.morales@gyd.org', 'sagiasaasadien@gmail.com', 'ranaalo.644@gmail.com',
          'sumeyye.bulut@stu.ihu.edu.tr', 'himaworking@gmail.com',
          'farhan.n@outlook.com', 'sarah.vandijk@edu.nl', 'amina.kuwari@youth.qa', 'kofi.mensah@ug.edu.gh'
        ];
        if (demoEmails.includes(cleanEmail)) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          return null;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read session from localStorage', e);
    }
    return null;
  }

  saveSession(user) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not write session to localStorage', e);
    }
    this.notify();
  }

  getCurrentUser() { return this.currentUser; }
  isLoggedIn()     { return !!this.currentUser; }

  isMember() {
    if (!this.currentUser) return false;
    const memberRoles = ['Member', 'Speaker', 'Moderator', 'Research Contributor'];
    return memberRoles.includes(this.currentUser.role) || this.isPresenter() || this.isCoordinator();
  }

  isPresenter() {
    return this.currentUser && (
      this.currentUser.role === 'Presenter' || 
      this.currentUser.role === 'Speaker' || 
      this.currentUser.isApprovedPresenter === true ||
      this.isCoordinator()
    );
  }

  isCoordinator() {
    return this.currentUser && (
      this.currentUser.role === 'Coordinator' || 
      this.currentUser.role === 'Admin' ||
      (this.currentUser.email && this.currentUser.email.toLowerCase().trim() === '3681mubashircp@gmail.com') ||
      this.currentUser.id === 'usr_admin_mubashir'
    );
  }

  // =========================================================================
  // ROLE-GATED LOGIN
  // portal: 'member' | 'presenter' | 'admin'
  // =========================================================================
  loginWithRole(email, password, portal) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 0. Primary Administrator Check
    if (cleanEmail === '3681mubashircp@gmail.com') {
      if (cleanPassword !== '368136') {
        return { success: false, message: 'Incorrect password for Administrator account.' };
      }
      const adminUser = {
        id: 'usr_admin_mubashir',
        name: 'Mubashir CP',
        email: '3681mubashircp@gmail.com',
        password: '368136',
        role: 'Coordinator',
        department: 'Executive Leadership & Administration',
        country: 'India',
        flag: 'IN',
        bio: 'Executive Director & Chief Platform Administrator, Global Youth Dialogue & Exchange (GYDE).',
        interests: ['Global Affairs', 'Governance & Society', 'Technology & AI', 'Education'],
        status: 'active',
        joinedDate: '2024-01-01'
      };
      const requestedPortal = (portal || 'coordinator').toLowerCase();
      const dest = (requestedPortal === 'member') ? 'member' : ((requestedPortal === 'presenter') ? 'presenter' : 'coordinator');
      this.saveSession(adminUser);
      return { success: true, user: adminUser, portal: dest };
    }

    // 1. Check if user was deleted by admin
    const isDeleted = (function() {
      try {
        const deletedList = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
        if (Array.isArray(deletedList) && deletedList.includes(cleanEmail)) return true;
      } catch (e) {}
      if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.deletedUserEmails)) {
        if (window.GYD_DATA.db.deletedUserEmails.includes(cleanEmail)) return true;
      }
      return false;
    })();

    if (isDeleted) {
      return {
        success: false,
        message: 'This account has been removed by the administrator. Access is revoked.'
      };
    }

    // 2. Reject all legacy demo accounts
    const legacyDemoEmails = [
      'coordinator@gyd.org', 'presenter@gyd.org', 'member@gyd.org',
      'amara.chen@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org',
      'sagiasaasadien@gmail.com', 'ranaalo.644@gmail.com',
      'sumeyye.bulut@stu.ihu.edu.tr', 'himaworking@gmail.com',
      'farhan.n@outlook.com', 'elena.rostova@debate.sg',
      'sarah.vandijk@edu.nl', 'amina.kuwari@youth.qa', 'kofi.mensah@ug.edu.gh'
    ];
    if (legacyDemoEmails.includes(cleanEmail)) {
      return {
        success: false,
        message: 'Demo credentials are permanently disabled for the official launch. Please apply for membership.'
      };
    }

    let users = [];
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      users = window.GYD_DATA.getUsers() || [];
    }

    let user = users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);

    // 3. Check Applications Roster (auto-register approved applicants immediately)
    if (!user) {
      let appMatch = null;
      if (window.GYD_DATA && typeof window.GYD_DATA.getApplications === 'function') {
        const apps = window.GYD_DATA.getApplications() || [];
        appMatch = apps.find(a => a.email && a.email.trim().toLowerCase() === cleanEmail);
      }

      if (appMatch) {
        if (appMatch.status === 'Deleted') {
          return { success: false, message: 'This account has been removed by the administrator. Access is revoked.' };
        } else if (appMatch.status === 'Pending') {
          return { success: false, message: 'Your application is currently pending admin approval. You will receive an email notification once approved.' };
        } else if (appMatch.status === 'Rejected' || appMatch.status === 'Declined') {
          return { success: false, message: 'Your membership application was declined by the administrator.' };
        }

        const isApproved = (
          appMatch.status === 'Approved' ||
          appMatch.status === 'Approved - Awaiting Registration' ||
          appMatch.status === 'Registered'
        );
        if (isApproved) {
          const expectedAppPass = (appMatch.password || '').trim();
          if (expectedAppPass && cleanPassword !== expectedAppPass) {
            return { success: false, message: 'Incorrect password. Please verify your credentials.' };
          }

          const isPresAppRole = (
            appMatch.role === 'Presenter' ||
            appMatch.role === 'Speaker' ||
            appMatch.isApprovedPresenter === true ||
            (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.presenterApplications) && 
              window.GYD_DATA.db.presenterApplications.some(p => p.email && p.email.toLowerCase().trim() === cleanEmail && p.status === 'Approved')) ||
            (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users) &&
              window.GYD_DATA.db.users.some(u => u.email && u.email.toLowerCase().trim() === cleanEmail && (u.role === 'Presenter' || u.role === 'Speaker' || u.isApprovedPresenter === true)))
          );

          user = {
            id: 'usr_' + (appMatch.id ? appMatch.id.replace('app_', '') : Date.now().toString(36)),
            name: appMatch.name,
            email: cleanEmail,
            password: expectedAppPass || cleanPassword,
            role: isPresAppRole ? 'Presenter' : (appMatch.role || 'Member'),
            isApprovedPresenter: isPresAppRole,
            department: isPresAppRole ? `Academic Delegation • ${appMatch.country || 'Global'}` : `Youth Delegation • ${appMatch.country || 'Global'}`,
            country: appMatch.country || 'Global',
            flag: appMatch.flag || 'INT',
            bio: appMatch.motivation || appMatch.debateExperience || `Verified member representing ${appMatch.country || 'Global'}.`,
            interests: appMatch.interests || ['Global Affairs'],
            status: 'active',
            joinedDate: appMatch.date || new Date().toISOString().split('T')[0]
          };
          if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users)) {
            const uIdx = window.GYD_DATA.db.users.findIndex(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
            if (uIdx >= 0) {
              const existingRole = window.GYD_DATA.db.users[uIdx].role;
              if (existingRole === 'Presenter' || existingRole === 'Speaker' || window.GYD_DATA.db.users[uIdx].isApprovedPresenter) {
                user.role = 'Presenter';
                user.isApprovedPresenter = true;
              }
              window.GYD_DATA.db.users[uIdx] = { ...window.GYD_DATA.db.users[uIdx], ...user };
            } else {
              window.GYD_DATA.db.users.push(user);
            }
            if (typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
          }
        }
      }
    }

    if (!user) {
      return { success: false, message: 'No approved account found with this email. Please apply for membership.' };
    }

    // --- Strict password verification ---
    const userPass = (user.password || '').trim();
    if (userPass && userPass !== cleanPassword) {
      return { success: false, message: 'Incorrect password. Please verify your credentials.' };
    }
    if (!user.password && cleanPassword) {
      user.password = cleanPassword;
      if (window.GYD_DATA && typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
    }

    // --- Account active? ---
    if (user.status !== 'active') {
      return { success: false, message: 'Your account is pending admin approval or review.' };
    }

    // --- Role-portal gatekeeping ---
    const hasApprovedPresApp = (
      user.role === 'Presenter' ||
      user.role === 'Speaker' ||
      user.isApprovedPresenter === true ||
      (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.presenterApplications) && 
        window.GYD_DATA.db.presenterApplications.some(p => p.email && p.email.toLowerCase().trim() === cleanEmail && p.status === 'Approved')) ||
      (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.applications) && 
        window.GYD_DATA.db.applications.some(a => a.email && a.email.toLowerCase().trim() === cleanEmail && (a.role === 'Presenter' || a.isApprovedPresenter === true)))
    );
    if (hasApprovedPresApp && user.role !== 'Coordinator' && user.role !== 'Admin' && cleanEmail !== '3681mubashircp@gmail.com') {
      user.role = 'Presenter';
      user.isApprovedPresenter = true;
      if (window.GYD_DATA && typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
    }

    const isAdmin = (
      user.role === 'Coordinator' ||
      user.role === 'Admin' ||
      cleanEmail === '3681mubashircp@gmail.com' ||
      user.id === 'usr_admin_mubashir'
    );
    const isPresenter = (
      user.role === 'Presenter' ||
      user.role === 'Speaker' ||
      user.isApprovedPresenter === true ||
      isAdmin
    );
    const isMemberOnly = !isAdmin && (user.role === 'Member' || (!isPresenter && !isAdmin));

    const requestedPortal = (portal || 'member').toLowerCase();
    let destinationPortal = 'member';

    if (isMemberOnly) {
      if (requestedPortal === 'admin' || requestedPortal === 'coordinator') {
        return {
          success: false,
          message: 'Access Denied: Your account has Member privileges only. Please select the Member tab to sign in.',
          requiredRole: 'member'
        };
      }
      if (requestedPortal === 'presenter') {
        return {
          success: false,
          message: 'Access Denied: Your account has Member privileges only. Please select the Member tab to sign in.',
          requiredRole: 'member'
        };
      }
      destinationPortal = 'member';
    } else if (isPresenter && !isAdmin) {
      if (requestedPortal === 'admin' || requestedPortal === 'coordinator') {
        return {
          success: false,
          message: 'Access Denied: Your account does not have Admin privileges. Please select Presenter or Member to sign in.',
          requiredRole: 'presenter'
        };
      }
      destinationPortal = (requestedPortal === 'presenter') ? 'presenter' : 'member';
    } else if (isAdmin) {
      destinationPortal = (requestedPortal === 'admin' || requestedPortal === 'coordinator') ? 'coordinator' : ((requestedPortal === 'presenter') ? 'presenter' : 'member');
    }

    this.saveSession(user);
    return { success: true, user, portal: destinationPortal };
  }

  // Legacy passthrough (auto-detects role)
  login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 0. Primary Administrator Check
    if (cleanEmail === '3681mubashircp@gmail.com') {
      if (cleanPassword !== '368136') {
        return { success: false, message: 'Incorrect password for Administrator account.' };
      }
      const adminUser = {
        id: 'usr_admin_mubashir',
        name: 'Mubashir CP',
        email: '3681mubashircp@gmail.com',
        password: '368136',
        role: 'Coordinator',
        department: 'Executive Leadership & Administration',
        country: 'India',
        flag: 'IN',
        bio: 'Executive Director & Chief Platform Administrator, Global Youth Dialogue & Exchange (GYDE).',
        interests: ['Global Affairs', 'Governance & Society', 'Technology & AI', 'Education'],
        status: 'active',
        joinedDate: '2024-01-01'
      };
      this.saveSession(adminUser);
      return { success: true, user: adminUser };
    }

    // 1. Check if user was deleted
    const isDeleted = (function() {
      try {
        const deletedList = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
        if (Array.isArray(deletedList) && deletedList.includes(cleanEmail)) return true;
      } catch (e) {}
      if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.deletedUserEmails)) {
        if (window.GYD_DATA.db.deletedUserEmails.includes(cleanEmail)) return true;
      }
      return false;
    })();

    if (isDeleted) {
      return { success: false, message: 'This account has been removed by the administrator. Access is revoked.' };
    }

    // 2. Reject demo accounts
    const legacyDemoEmails = [
      'coordinator@gyd.org', 'presenter@gyd.org', 'member@gyd.org',
      'amara.chen@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org',
      'sagiasaasadien@gmail.com', 'ranaalo.644@gmail.com',
      'sumeyye.bulut@stu.ihu.edu.tr', 'himaworking@gmail.com',
      'farhan.n@outlook.com', 'elena.rostova@debate.sg',
      'sarah.vandijk@edu.nl', 'amina.kuwari@youth.qa', 'kofi.mensah@ug.edu.gh'
    ];
    if (legacyDemoEmails.includes(cleanEmail)) {
      return { success: false, message: 'Demo credentials have been permanently disabled for official launch.' };
    }

    let users = [];
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      users = window.GYD_DATA.getUsers() || [];
    }

    let user = users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);

    if (!user) {
      let appMatch = null;
      if (window.GYD_DATA && typeof window.GYD_DATA.getApplications === 'function') {
        const apps = window.GYD_DATA.getApplications() || [];
        appMatch = apps.find(a => a.email && a.email.trim().toLowerCase() === cleanEmail);
      }
      if (appMatch) {
        if (appMatch.status === 'Deleted') {
          return { success: false, message: 'This account has been removed by the administrator. Access is revoked.' };
        } else if (appMatch.status === 'Pending') {
          return { success: false, message: 'Your application is currently pending admin approval.' };
        } else if (appMatch.status === 'Rejected' || appMatch.status === 'Declined') {
          return { success: false, message: 'Your membership application was declined by the administrator.' };
        }

        if (appMatch.status === 'Approved' || appMatch.status === 'Approved - Awaiting Registration' || appMatch.status === 'Registered') {
          const expectedAppPass = (appMatch.password || '').trim();
          if (expectedAppPass && cleanPassword !== expectedAppPass) {
            return { success: false, message: 'Invalid password.' };
          }
          const isPresAppRoleLegacy = (
            appMatch.role === 'Presenter' ||
            appMatch.role === 'Speaker' ||
            appMatch.isApprovedPresenter === true ||
            (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.presenterApplications) && 
              window.GYD_DATA.db.presenterApplications.some(p => p.email && p.email.toLowerCase().trim() === cleanEmail && p.status === 'Approved')) ||
            (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users) &&
              window.GYD_DATA.db.users.some(u => u.email && u.email.toLowerCase().trim() === cleanEmail && (u.role === 'Presenter' || u.role === 'Speaker' || u.isApprovedPresenter === true)))
          );

          user = {
            id: 'usr_' + (appMatch.id ? appMatch.id.replace('app_', '') : Date.now().toString(36)),
            name: appMatch.name,
            email: cleanEmail,
            password: expectedAppPass || cleanPassword,
            role: isPresAppRoleLegacy ? 'Presenter' : (appMatch.role || 'Member'),
            isApprovedPresenter: isPresAppRoleLegacy,
            department: isPresAppRoleLegacy ? `Academic Delegation • ${appMatch.country || 'Global'}` : `Youth Delegation • ${appMatch.country || 'Global'}`,
            country: appMatch.country || 'Global',
            flag: appMatch.flag || 'INT',
            bio: appMatch.motivation || appMatch.debateExperience || `Verified member representing ${appMatch.country || 'Global'}.`,
            interests: appMatch.interests || ['Global Affairs'],
            status: 'active',
            joinedDate: appMatch.date || new Date().toISOString().split('T')[0]
          };
          if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users)) {
            const uIdx = window.GYD_DATA.db.users.findIndex(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
            if (uIdx >= 0) {
              const existingRole = window.GYD_DATA.db.users[uIdx].role;
              if (existingRole === 'Presenter' || existingRole === 'Speaker' || window.GYD_DATA.db.users[uIdx].isApprovedPresenter) {
                user.role = 'Presenter';
                user.isApprovedPresenter = true;
              }
              window.GYD_DATA.db.users[uIdx] = { ...window.GYD_DATA.db.users[uIdx], ...user };
            } else {
              window.GYD_DATA.db.users.push(user);
            }
            if (typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
          }
        }
      }
    }

    if (!user) {
      return { success: false, message: 'No approved account found with this email. Please apply for membership.' };
    }
    const userPass = (user.password || '').trim();
    if (userPass && userPass !== cleanPassword) {
      return { success: false, message: 'Invalid password.' };
    }
    if (user.status !== 'active') {
      return { success: false, message: 'Your account is currently under review.' };
    }

    this.saveSession(user);
    return { success: true, user };
  }

  loginAsDemo(roleType) {
    return {
      success: false,
      message: 'Demo and trial profiles have been permanently removed. Please sign in using your official credentials.'
    };
  }

  logout() {
    this.saveSession(null);
  }

  // =========================================================================
  // PENDING REGISTRATION TRACKER (approved applicants awaiting sign-up)
  // =========================================================================
  setPendingRegistration(applicationData) {
    try {
      localStorage.setItem(PENDING_REG_KEY, JSON.stringify({
        appId: applicationData.id,
        email: applicationData.email,
        name: applicationData.name,
        country: applicationData.country,
        firstName: (applicationData.name || '').split(' ')[0],
        lastName: (applicationData.name || '').split(' ').slice(1).join(' '),
        interests: applicationData.interests || [],
        motivation: applicationData.motivation || ''
      }));
    } catch (e) {
      console.warn('Could not save pending registration', e);
    }
  }

  getPendingRegistration() {
    try {
      const stored = localStorage.getItem(PENDING_REG_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) { return null; }
  }

  clearPendingRegistration() {
    try { localStorage.removeItem(PENDING_REG_KEY); } catch (e) {}
  }

  /**
   * Check if the current browser has an approved-but-not-yet-registered applicant.
   * Returns the pending reg data if found AND the application is Approved in the DB.
   */
  checkApprovedApplicant() {
    // If user is currently logged in, they don't need signup prompt
    if (this.currentUser) return null;

    const getUsersList = () => {
      try {
        if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
          return window.GYD_DATA.getUsers() || [];
        }
      } catch (e) {}
      return [];
    };

    const isEmailRegistered = (email) => {
      if (!email) return false;
      const clean = email.toLowerCase().trim();
      const users = getUsersList();
      return users.some(u => u.email && u.email.toLowerCase().trim() === clean);
    };

    // PRIVACY SECURITY: Only look for an application if THIS SPECIFIC BROWSER submitted one!
    // Never search through database applications or suggest another user's profile.
    let appliedEmail = null;
    try {
      appliedEmail = localStorage.getItem('gyd_applied_email');
    } catch (e) {}

    if (!appliedEmail || typeof appliedEmail !== 'string' || !appliedEmail.trim()) {
      // Current visitor has never applied on this device -> do NOT suggest any registration!
      this.clearPendingRegistration();
      return null;
    }

    const cleanApplied = appliedEmail.toLowerCase().trim();

    // If already registered as an active user, clean up and exit
    if (isEmailRegistered(cleanApplied)) {
      this.clearPendingRegistration();
      try { localStorage.removeItem('gyd_applied_email'); } catch (e) {}
      return null;
    }

    // Check if the current browser's pending registration matches their applied email
    let pending = this.getPendingRegistration();
    if (pending && pending.email && pending.email.toLowerCase().trim() !== cleanApplied) {
      // Mismatched or belonged to another profile -> purge it immediately
      this.clearPendingRegistration();
      pending = null;
    }

    // Verify THIS SPECIFIC applicant's status in DB
    if (window.GYD_DATA && typeof window.GYD_DATA.getApplications === 'function') {
      const apps = window.GYD_DATA.getApplications() || [];
      const app = apps.find(a => a.email && a.email.toLowerCase().trim() === cleanApplied);
      if (app && (app.status === 'Approved' || app.status === 'Approved - Awaiting Registration')) {
        if (!pending) {
          this.setPendingRegistration(app);
          pending = this.getPendingRegistration();
        }
        return pending;
      }
    }

    return null;
  }

  // =========================================================================
  // OTP MANAGEMENT & SECURE EMAIL DELIVERY
  // =========================================================================
  generateOTP(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    const session = { email: cleanEmail, code, expires, attempts: 0 };
    try { localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(session)); } catch (e) {}
    return code;
  }

  async sendOTPEmail(email, code, name = 'Applicant') {
    const cleanEmail = (email || '').trim();
    const cleanCode = (code || '').trim();
    const cleanName = (name || 'Applicant').trim();

    // Log verification OTP to browser console for immediate testing & audit
    console.info(
      `%c[GYDE Verification]%c OTP for %c${cleanEmail}%c: %c${cleanCode}%c (Valid for 10 minutes)`,
      'background: #4851ba; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #64748b;',
      'font-weight: bold; color: #0f172a;',
      'color: #64748b;',
      'font-size: 14px; font-weight: bold; color: #059669; padding: 2px 6px; background: #ecfdf5; border-radius: 4px;',
      'color: #94a3b8; font-size: 11px;'
    );

    const endpoints = ['/api/send-otp', 'http://127.0.0.1:8080/api/send-otp'];
    for (const url of endpoints) {
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, code: cleanCode, name: cleanName })
        });
        if (resp.ok) {
          const data = await resp.json();
          return data;
        }
      } catch (e) {}
    }
    return { success: false, message: 'Could not contact email server (offline or unconfigured)' };
  }

  async sendApprovalNotificationEmail(email, name = 'Member') {
    const cleanEmail = (email || '').trim();
    const cleanName = (name || 'Member').trim();

    console.info(`[GYDE Approval] Dispatching approval confirmation email to ${cleanEmail}`);
    const endpoints = ['/api/send-otp', 'http://127.0.0.1:8080/api/send-otp'];
    for (const url of endpoints) {
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'approval', email: cleanEmail, name: cleanName })
        });
        if (resp.ok) {
          return await resp.json();
        }
      } catch (e) {}
    }
    return { success: false, message: 'Could not contact email server (offline or unconfigured)' };
  }

  verifyOTP(email, enteredCode) {
    try {
      const stored = localStorage.getItem(OTP_STORAGE_KEY);
      if (!stored) return { valid: false, message: 'No OTP session found. Please request a new code.' };
      const session = JSON.parse(stored);

      const cleanStoredEmail = (session.email || '').trim().toLowerCase();
      const cleanInputEmail = (email || '').trim().toLowerCase();

      if (cleanStoredEmail !== cleanInputEmail) {
        return { valid: false, message: 'Email mismatch. Please request a new code.' };
      }
      if (Date.now() > session.expires) {
        localStorage.removeItem(OTP_STORAGE_KEY);
        return { valid: false, message: 'This code has expired. Please request a new one.' };
      }
      if (session.attempts >= 5) {
        return { valid: false, message: 'Too many incorrect attempts. Please request a new code.' };
      }
      if (enteredCode.trim() !== session.code) {
        session.attempts++;
        localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(session));
        return { valid: false, message: `Incorrect code. ${5 - session.attempts} attempt(s) remaining.` };
      }

      // Valid!
      localStorage.removeItem(OTP_STORAGE_KEY);
      return { valid: true };
    } catch (e) {
      return { valid: false, message: 'Verification error. Please try again.' };
    }
  }

  clearOTP() {
    try { localStorage.removeItem(OTP_STORAGE_KEY); } catch (e) {}
  }

  // =========================================================================
  // LISTENERS
  // =========================================================================
  subscribe(callback) {
    this.listeners.push(callback);
    return () => { this.listeners = this.listeners.filter(cb => cb !== callback); };
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.currentUser); } catch (err) { console.error('Error in auth listener', err); }
    });
    window.dispatchEvent(new CustomEvent('gyd-auth-changed', { detail: { user: this.currentUser } }));
  }
}

window.GYD_AUTH = new AuthService();
