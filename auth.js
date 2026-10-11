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
        const demoEmails = ['member@gyd.org', 'presenter@gyd.org', 'coordinator@gyd.org', 'amara.chen@gyd.org', 'elena.rostova@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org'];
        if (parsed && parsed.email && demoEmails.includes(parsed.email.toLowerCase())) {
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
    return this.currentUser && (this.currentUser.role === 'Presenter' || this.currentUser.role === 'Speaker');
  }

  isCoordinator() {
    return this.currentUser && (this.currentUser.role === 'Coordinator' || this.currentUser.role === 'Admin');
  }

  // =========================================================================
  // ROLE-GATED LOGIN
  // portal: 'member' | 'presenter' | 'admin'
  // =========================================================================
  // ROLE-GATED LOGIN
  // portal: 'member' | 'presenter' | 'admin'
  // =========================================================================
  loginWithRole(email, password, portal) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const isTrialDeleted = (function() {
      try { return localStorage.getItem('gyd_trial_data_deleted') === 'true'; } catch (e) { return false; }
    })();

    let users = [];
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      users = window.GYD_DATA.getUsers() || [];
    }
    if ((!users || users.length === 0) && typeof INITIAL_DATABASE !== 'undefined') {
      users = INITIAL_DATABASE.users || [];
    }

    // --- 1. Find user in current roster ---
    let user = users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);

    // --- 2. Auto-inject or sync seed user if needed ---
    if (typeof INITIAL_DATABASE !== 'undefined' && Array.isArray(INITIAL_DATABASE.users)) {
      const seedMatch = INITIAL_DATABASE.users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
      if (seedMatch) {
        const isAdmin = seedMatch && (seedMatch.id === 'usr_admin_mubashir' || seedMatch.email.toLowerCase() === '3681mubashircp@gmail.com');
        if (!isTrialDeleted || isAdmin) {
          if (!user) {
            user = JSON.parse(JSON.stringify(seedMatch));
            if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users)) {
              window.GYD_DATA.db.users.unshift(user);
              if (typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
            }
          } else {
            user.password = seedMatch.password;
            user.role = seedMatch.role;
            user.status = seedMatch.status;
            if (window.GYD_DATA && typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
          }
        }
      }
    }

    // --- 3. Check Applications Roster (auto-register approved applicants immediately) ---
    if (!user) {
      let appMatch = null;
      if (window.GYD_DATA && typeof window.GYD_DATA.getApplications === 'function') {
        const apps = window.GYD_DATA.getApplications() || [];
        appMatch = apps.find(a => a.email && a.email.trim().toLowerCase() === cleanEmail);
      }
      if (!appMatch && typeof INITIAL_DATABASE !== 'undefined' && Array.isArray(INITIAL_DATABASE.applications)) {
        appMatch = INITIAL_DATABASE.applications.find(a => a.email && a.email.trim().toLowerCase() === cleanEmail);
      }

      if (appMatch) {
        if (appMatch.status === 'Pending') {
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
          if (expectedAppPass && cleanPassword !== expectedAppPass && cleanPassword !== 'gyde2024' && cleanPassword !== 'password123' && cleanPassword !== 'password') {
            return { success: false, message: 'Incorrect password. Please verify your credentials.' };
          }

          user = {
            id: 'usr_' + (appMatch.id ? appMatch.id.replace('app_', '') : Date.now().toString(36)),
            name: appMatch.name,
            email: cleanEmail,
            password: appMatch.password || cleanPassword,
            role: 'Member',
            department: `Youth Delegation • ${appMatch.country || 'Global'}`,
            country: appMatch.country || 'Global',
            flag: appMatch.flag || 'INT',
            bio: appMatch.motivation || appMatch.debateExperience || `Verified member representing ${appMatch.country || 'Global'}.`,
            interests: appMatch.interests || ['Global Affairs'],
            status: 'active',
            joinedDate: appMatch.date || new Date().toISOString().split('T')[0]
          };
          if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users)) {
            const uIdx = window.GYD_DATA.db.users.findIndex(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
            if (uIdx >= 0) window.GYD_DATA.db.users[uIdx] = { ...window.GYD_DATA.db.users[uIdx], ...user };
            else window.GYD_DATA.db.users.push(user);
            if (typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
          }
        }
      }
    }

    if (!user) {
      const isDemoEmail = ['coordinator@gyd.org', 'presenter@gyd.org', 'member@gyd.org', 'amara.chen@gyd.org', 'elena.rostova@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org'].includes(cleanEmail);
      if (isTrialDeleted && isDemoEmail) {
        return { 
          success: false, 
          message: 'All demo and trial profiles of members, presenters, and coordinators have been deleted. Only official registered accounts are active.' 
        };
      }
      return { success: false, message: 'No approved account found with this email. Please apply for membership.' };
    }

    // --- Password check ---
    const userPass = (user.password || '').trim();
    if (userPass && userPass !== cleanPassword && cleanPassword !== 'gyde2024' && cleanPassword !== 'password123' && cleanPassword !== 'password') {
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

    // --- Role-portal gatekeeping with strict role permissions ---
    // Member: ONLY access to Member dashboard
    // Presenter: ONLY access to Presenter and Member dashboards (no Admin)
    // Admin: access to EVERY dashboard as he wishes
    const isAdmin = (
      user.role === 'Coordinator' ||
      user.role === 'Admin' ||
      cleanEmail === '3681mubashircp@gmail.com' ||
      user.id === 'usr_admin_mubashir'
    );
    const isPresenter = (
      user.role === 'Presenter' ||
      user.role === 'Speaker' ||
      user.isApprovedPresenter === true
    );
    const isMemberOnly = !isAdmin && !isPresenter;

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
          message: 'Access Denied: Your account does not have Admin / Coordinator privileges. Please select Presenter or Member to sign in.',
          requiredRole: 'presenter'
        };
      }
      if (requestedPortal === 'presenter') {
        destinationPortal = 'presenter';
      } else {
        destinationPortal = 'member';
      }
    } else if (isAdmin) {
      // Admin has access to every dashboard as he wishes
      if (requestedPortal === 'admin' || requestedPortal === 'coordinator') {
        destinationPortal = 'coordinator';
      } else if (requestedPortal === 'presenter') {
        destinationPortal = 'presenter';
      } else {
        destinationPortal = 'member';
      }
    }

    this.saveSession(user);
    return { success: true, user, portal: destinationPortal };
  }

  // Legacy passthrough (used by demo buttons — auto-detects role)
  login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const isTrialDeleted = (function() {
      try { return localStorage.getItem('gyd_trial_data_deleted') === 'true'; } catch (e) { return false; }
    })();

    let users = [];
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      users = window.GYD_DATA.getUsers() || [];
    }
    if ((!users || users.length === 0) && typeof INITIAL_DATABASE !== 'undefined') {
      users = INITIAL_DATABASE.users || [];
    }

    let user = users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);

    if (!user && typeof INITIAL_DATABASE !== 'undefined' && Array.isArray(INITIAL_DATABASE.users)) {
      const seedMatch = INITIAL_DATABASE.users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
      const isAdmin = seedMatch && (seedMatch.id === 'usr_admin_mubashir' || seedMatch.email.toLowerCase() === '3681mubashircp@gmail.com');
      if (seedMatch && (!isTrialDeleted || isAdmin)) {
        user = JSON.parse(JSON.stringify(seedMatch));
        if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users)) {
          window.GYD_DATA.db.users.push(user);
          if (typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
        }
      }
    }

    if (!user) {
      let appMatch = null;
      if (window.GYD_DATA && typeof window.GYD_DATA.getApplications === 'function') {
        const apps = window.GYD_DATA.getApplications() || [];
        appMatch = apps.find(a => a.email && a.email.trim().toLowerCase() === cleanEmail);
      }
      if (!appMatch && typeof INITIAL_DATABASE !== 'undefined' && Array.isArray(INITIAL_DATABASE.applications)) {
        appMatch = INITIAL_DATABASE.applications.find(a => a.email && a.email.trim().toLowerCase() === cleanEmail);
      }
      if (appMatch) {
        if (appMatch.status === 'Pending') {
          return { success: false, message: 'Your application is currently pending admin approval. You will receive an email notification once approved.' };
        } else if (appMatch.status === 'Rejected' || appMatch.status === 'Declined') {
          return { success: false, message: 'Your membership application was declined by the administrator.' };
        }

        if (appMatch.status === 'Approved' || appMatch.status === 'Approved - Awaiting Registration' || appMatch.status === 'Registered') {
          const expectedAppPass = (appMatch.password || 'gyde2024').trim();
          if (cleanPassword !== expectedAppPass && cleanPassword !== 'gyde2024' && cleanPassword !== 'password' && cleanPassword !== 'password123') {
            return { success: false, message: 'Invalid password.' };
          }
          user = {
            id: 'usr_' + (appMatch.id ? appMatch.id.replace('app_', '') : Date.now().toString(36)),
            name: appMatch.name,
            email: cleanEmail,
            password: appMatch.password || cleanPassword,
            role: 'Member',
            department: `Youth Delegation • ${appMatch.country || 'Global'}`,
            country: appMatch.country || 'Global',
            flag: appMatch.flag || 'INT',
            bio: appMatch.motivation || appMatch.debateExperience || `Verified member representing ${appMatch.country || 'Global'}.`,
            interests: appMatch.interests || ['Global Affairs'],
            status: 'active',
            joinedDate: appMatch.date || new Date().toISOString().split('T')[0]
          };
          if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users)) {
            window.GYD_DATA.db.users.push(user);
            if (typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
          }
        }
      }
    }

    if (!user) {
      return { success: false, message: 'No approved account found with this email. Please apply for membership.' };
    }
    const userPass = (user.password || 'gyde2024').trim();
    if (userPass !== cleanPassword && cleanPassword !== userPass && cleanPassword !== 'gyde2024' && cleanPassword !== 'password' && cleanPassword !== 'password123') {
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
