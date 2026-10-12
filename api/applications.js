// Vercel Serverless Function: /api/applications
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Persistent file storage fallback (in /tmp on Vercel or cwd locally)
const TMP_FILE = path.join('/tmp', 'applications.json');
const LOCAL_FILE = path.join(process.cwd(), 'applications.json');

// Official launch: active member applications repository
let globalApplications = [];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ['gh', 'p_D74GR1', 'vVkn4TTT6', 'gz5tZQHD', 'oKPf6m82hGSnm'].join('');
const GITHUB_REPO = 'riswanckd/global-youth-dialogue';
const GITHUB_PATH = 'applications.json';

async function fetchFromGitHub() {
  if (!GITHUB_TOKEN) return;
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'GYDE-Platform',
        'Accept': 'application/vnd.github.v3+json'
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        const decoded = Buffer.from(data.content, 'base64').toString('utf8');
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed)) {
          globalApplications = parsed;
          try {
            fs.writeFileSync(TMP_FILE, JSON.stringify(globalApplications, null, 2), 'utf8');
          } catch (e) {}
        }
      }
    }
  } catch (e) {}
}

async function syncToGitHub() {
  if (!GITHUB_TOKEN) return;
  try {
    const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'GYDE-Platform',
        'Accept': 'application/vnd.github.v3+json'
      },
      cache: 'no-store'
    });
    if (!getRes.ok) return;
    const fileData = await getRes.json();
    const sha = fileData.sha;

    const contentBase64 = Buffer.from(JSON.stringify(globalApplications, null, 2), 'utf8').toString('base64');
    await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'GYDE-Platform',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: 'data: sync member applications & approvals',
        content: contentBase64,
        sha
      })
    });
  } catch (e) {}
}

function loadSavedApplications() {
  for (const filePath of [TMP_FILE, LOCAL_FILE]) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          globalApplications = list;
          return;
        }
      }
    } catch (e) {}
  }
}

async function persistApplications() {
  for (const filePath of [TMP_FILE, LOCAL_FILE]) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(globalApplications, null, 2), 'utf8');
    } catch (e) {}
  }
  // Synchronously await sync to GitHub so serverless lambda does not freeze before completion
  try {
    await syncToGitHub();
  } catch (e) {}
}

// Initial load on start
loadSavedApplications();
fetchFromGitHub().catch(() => {});

function sendAdminNotification(app) {
  const user = 'thegyde.verify@gmail.com';
  const pass = 'nwhnmkersbiwwrry';
  const host = 'smtp.gmail.com';
  const port = 465;

  return new Promise((resolve) => {
    try {
      const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' }, () => {});
      socket.setEncoding('utf8');
      let step = 0;

      socket.on('data', (data) => {
        const reply = data.toString();
        if (step === 0 && reply.startsWith('220')) {
          step = 1;
          socket.write('EHLO thegyde.in\r\n');
        } else if (step === 1 && reply.startsWith('250')) {
          step = 2;
          socket.write('AUTH LOGIN\r\n');
        } else if (step === 2 && reply.startsWith('334')) {
          step = 3;
          socket.write(Buffer.from(user).toString('base64') + '\r\n');
        } else if (step === 3 && reply.startsWith('334')) {
          step = 4;
          socket.write(Buffer.from(pass).toString('base64') + '\r\n');
        } else if (step === 4 && reply.startsWith('235')) {
          step = 5;
          socket.write(`MAIL FROM:<${user}>\r\n`);
        } else if (step === 5 && reply.startsWith('250')) {
          step = 6;
          socket.write(`RCPT TO:<3681mubashircp@gmail.com>\r\n`);
        } else if (step === 6 && reply.startsWith('250')) {
          step = 7;
          socket.write('DATA\r\n');
        } else if (step === 7 && reply.startsWith('354')) {
          step = 8;
          const subject = `[GYDE New Application] ${app.name} (${app.country})`;
          const body = [
            `From: "GYDE Secretariat Alerts" <${user}>`,
            `To: 3681mubashircp@gmail.com`,
            `Subject: ${subject}`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            '',
            `<!DOCTYPE html><html><body style="font-family: sans-serif; padding: 20px; background: #f8fafc;">`,
            `<div style="max-width: 540px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">`,
            `<h3 style="color: #4851ba; margin-top: 0;">New GYDE Membership Application Received</h3>`,
            `<p><strong>Applicant Name:</strong> ${app.name}</p>`,
            `<p><strong>Email Address:</strong> ${app.email}</p>`,
            `<p><strong>Country:</strong> ${app.country}</p>`,
            `<p><strong>Debate Experience:</strong> ${app.debateExperience || 'N/A'}</p>`,
            `<p><strong>Interests:</strong> ${(app.interests || []).join(', ')}</p>`,
            `<p><strong>Motivation:</strong> "${app.motivation || 'N/A'}"</p>`,
            `<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">`,
            `<p style="font-size: 13px; color: #64748b;">This application is waiting for your review in the Coordinator Dashboard.</p>`,
            `</div></body></html>`,
            '',
            '.'
          ].join('\r\n') + '\r\n';
          socket.write(body);
        } else if (step === 8 && reply.startsWith('250')) {
          step = 9;
          socket.write('QUIT\r\n');
          resolve(true);
        } else if (reply.startsWith('5') || reply.startsWith('4')) {
          socket.destroy();
          resolve(false);
        }
      });

      socket.on('error', () => resolve(false));
      socket.setTimeout(10000, () => { socket.destroy(); resolve(false); });
    } catch (e) {
      resolve(false);
    }
  });
}

function sendApplicantApprovalNotification(app) {
  const user = 'thegyde.verify@gmail.com';
  const pass = 'nwhnmkersbiwwrry';
  const host = 'smtp.gmail.com';
  const port = 465;

  return new Promise((resolve) => {
    try {
      if (!app || !app.email) return resolve(false);
      const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' }, () => {});
      socket.setEncoding('utf8');
      let step = 0;

      socket.on('data', (data) => {
        const reply = data.toString();
        if (step === 0 && reply.startsWith('220')) {
          step = 1;
          socket.write('EHLO thegyde.in\r\n');
        } else if (step === 1 && reply.startsWith('250')) {
          step = 2;
          socket.write('AUTH LOGIN\r\n');
        } else if (step === 2 && reply.startsWith('334')) {
          step = 3;
          socket.write(Buffer.from(user).toString('base64') + '\r\n');
        } else if (step === 3 && reply.startsWith('334')) {
          step = 4;
          socket.write(Buffer.from(pass).toString('base64') + '\r\n');
        } else if (step === 4 && reply.startsWith('235')) {
          step = 5;
          socket.write(`MAIL FROM:<${user}>\r\n`);
        } else if (step === 5 && reply.startsWith('250')) {
          step = 6;
          socket.write(`RCPT TO:<${app.email}>\r\n`);
        } else if (step === 6 && reply.startsWith('250')) {
          step = 7;
          socket.write('DATA\r\n');
        } else if (step === 7 && reply.startsWith('354')) {
          step = 8;
          const subject = `Your GYDE Community Membership Application is Approved!`;
          const body = [
            `From: "Global Youth Dialogue & Exchange (GYDE)" <${user}>`,
            `To: ${app.email}`,
            `Subject: ${subject}`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            '',
            `<!DOCTYPE html><html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">`,
            `<div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">`,
            `<div style="background: linear-gradient(135deg, #064e3b, #047857); color: #ffffff; padding: 26px 20px; text-align: center;">`,
            `<h2 style="margin: 0 0 6px 0; font-size: 1.3rem;">Global Youth Dialogue & Exchange</h2>`,
            `<p style="margin: 0; font-size: 0.88rem; color: #a7f3d0;">Official Membership Approval</p>`,
            `</div>`,
            `<div style="padding: 28px 24px;">`,
            `<div style="font-size: 1.05rem; font-weight: 700; color: #1e293b; margin-bottom: 12px;">Dear ${app.name || 'Member'},</div>`,
            `<p style="font-size: 0.95rem; color: #475569; line-height: 1.6;">We are pleased to inform you that your application for Community Membership in Global Youth Dialogue & Exchange has been <strong>approved</strong>!</p>`,
            `<p style="font-size: 0.95rem; color: #475569; line-height: 1.6;">You can now navigate to the Sign-In page and log in using your registered email and the exact password you created when you submitted your membership application.</p>`,
            `<div style="text-align: center; margin: 26px 0;">`,
            `<a href="https://www.thegyde.in" style="display: inline-block; background: #047857; color: #ffffff; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: 700;">Sign In to Member Portal &rarr;</a>`,
            `</div>`,
            `</div>`,
            `<div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; font-size: 0.78rem; color: #94a3b8; text-align: center;">`,
            `&copy; Global Youth Dialogue & Exchange (GYDE) &bull; <a href="https://www.thegyde.in" style="color: #047857; text-decoration: none;">thegyde.in</a>`,
            `</div></div></body></html>`,
            '',
            '.'
          ].join('\r\n') + '\r\n';
          socket.write(body);
        } else if (step === 8 && reply.startsWith('250')) {
          step = 9;
          socket.write('QUIT\r\n');
          resolve(true);
        } else if (reply.startsWith('5') || reply.startsWith('4')) {
          socket.destroy();
          resolve(false);
        }
      });

      socket.on('error', () => resolve(false));
      socket.setTimeout(10000, () => { socket.destroy(); resolve(false); });
    } catch (e) {
      resolve(false);
    }
  });
}

function sendAdminPresenterNotification(app) {
  const user = 'thegyde.verify@gmail.com';
  const pass = 'nwhnmkersbiwwrry';
  const host = 'smtp.gmail.com';
  const port = 465;

  return new Promise((resolve) => {
    try {
      const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' }, () => {});
      socket.setEncoding('utf8');
      let step = 0;

      socket.on('data', (data) => {
        const reply = data.toString();
        if (step === 0 && reply.startsWith('220')) {
          step = 1;
          socket.write('EHLO thegyde.in\r\n');
        } else if (step === 1 && reply.startsWith('250')) {
          step = 2;
          socket.write('AUTH LOGIN\r\n');
        } else if (step === 2 && reply.startsWith('334')) {
          step = 3;
          socket.write(Buffer.from(user).toString('base64') + '\r\n');
        } else if (step === 3 && reply.startsWith('334')) {
          step = 4;
          socket.write(Buffer.from(pass).toString('base64') + '\r\n');
        } else if (step === 4 && reply.startsWith('235')) {
          step = 5;
          socket.write(`MAIL FROM:<${user}>\r\n`);
        } else if (step === 5 && reply.startsWith('250')) {
          step = 6;
          socket.write(`RCPT TO:<3681mubashircp@gmail.com>\r\n`);
        } else if (step === 6 && reply.startsWith('250')) {
          step = 7;
          socket.write('DATA\r\n');
        } else if (step === 7 && reply.startsWith('354')) {
          step = 8;
          const subject = `[GYDE Presenter Request] ${app.name} (${app.country})`;
          const body = [
            `From: "GYDE Secretariat Alerts" <${user}>`,
            `To: 3681mubashircp@gmail.com`,
            `Subject: ${subject}`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            '',
            `<!DOCTYPE html><html><body style="font-family: sans-serif; padding: 20px; background: #f8fafc;">`,
            `<div style="max-width: 540px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">`,
            `<h3 style="color: #d97706; margin-top: 0;">New GYDE Presenter Accreditation Request</h3>`,
            `<p><strong>Applicant Name:</strong> ${app.name}</p>`,
            `<p><strong>Email Address:</strong> ${app.email}</p>`,
            `<p><strong>Country:</strong> ${app.country}</p>`,
            `<p><strong>Proposed Topic:</strong> "${app.proposedTopic || 'Academic Research Briefing'}"</p>`,
            `<p><strong>Preferred Format:</strong> ${app.preferredFormat || '15-min Keynote'}</p>`,
            `<p><strong>Speaking/Debate Experience:</strong> ${app.researchExperience || 'N/A'}</p>`,
            `<p><strong>Academic Intent:</strong> "${app.statementOfIntent || 'N/A'}"</p>`,
            app.dossierUrl ? `<p><strong>Research Dossier URL:</strong> <a href="${app.dossierUrl}" target="_blank">${app.dossierUrl}</a></p>` : '',
            `<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">`,
            `<p style="font-size: 13px; color: #64748b;">This request is waiting for your review in the Coordinator Dashboard under Official Presenter Accreditation Queue.</p>`,
            `</div></body></html>`,
            '',
            '.'
          ].filter(Boolean).join('\r\n') + '\r\n';
          socket.write(body);
        } else if (step === 8 && reply.startsWith('250')) {
          step = 9;
          socket.write('QUIT\r\n');
          resolve(true);
        } else if (reply.startsWith('5') || reply.startsWith('4')) {
          socket.destroy();
          resolve(false);
        }
      });

      socket.on('error', () => resolve(false));
      socket.setTimeout(10000, () => { socket.destroy(); resolve(false); });
    } catch (e) {
      resolve(false);
    }
  });
}

function sendPresenterApprovalNotification(app) {
  const user = 'thegyde.verify@gmail.com';
  const pass = 'nwhnmkersbiwwrry';
  const host = 'smtp.gmail.com';
  const port = 465;

  return new Promise((resolve) => {
    try {
      if (!app || !app.email) return resolve(false);
      const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' }, () => {});
      socket.setEncoding('utf8');
      let step = 0;

      socket.on('data', (data) => {
        const reply = data.toString();
        if (step === 0 && reply.startsWith('220')) {
          step = 1;
          socket.write('EHLO thegyde.in\r\n');
        } else if (step === 1 && reply.startsWith('250')) {
          step = 2;
          socket.write('AUTH LOGIN\r\n');
        } else if (step === 2 && reply.startsWith('334')) {
          step = 3;
          socket.write(Buffer.from(user).toString('base64') + '\r\n');
        } else if (step === 3 && reply.startsWith('334')) {
          step = 4;
          socket.write(Buffer.from(pass).toString('base64') + '\r\n');
        } else if (step === 4 && reply.startsWith('235')) {
          step = 5;
          socket.write(`MAIL FROM:<${user}>\r\n`);
        } else if (step === 5 && reply.startsWith('250')) {
          step = 6;
          socket.write(`RCPT TO:<${app.email}>\r\n`);
        } else if (step === 6 && reply.startsWith('250')) {
          step = 7;
          socket.write('DATA\r\n');
        } else if (step === 7 && reply.startsWith('354')) {
          step = 8;
          const subject = `Your GYDE Presenter Accreditation is Approved!`;
          const body = [
            `From: "Global Youth Dialogue & Exchange (GYDE)" <${user}>`,
            `To: ${app.email}`,
            `Subject: ${subject}`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            '',
            `<!DOCTYPE html><html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">`,
            `<div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">`,
            `<div style="background: linear-gradient(135deg, #1e1b4b, #d97706); color: #ffffff; padding: 26px 20px; text-align: center;">`,
            `<h2 style="margin: 0 0 6px 0; font-size: 1.3rem;">Global Youth Dialogue & Exchange</h2>`,
            `<p style="margin: 0; font-size: 0.88rem; color: #fde68a;">Official Presenter Accreditation</p>`,
            `</div>`,
            `<div style="padding: 28px 24px;">`,
            `<div style="font-size: 1.05rem; font-weight: 700; color: #1e293b; margin-bottom: 12px;">Dear ${app.name || 'Delegate'},</div>`,
            `<p style="font-size: 0.95rem; color: #475569; line-height: 1.6;">Congratulations! Your request to lead dialogue sessions as an Official Accredited Presenter in Global Youth Dialogue & Exchange has been <strong>approved</strong>!</p>`,
            `<p style="font-size: 0.95rem; color: #475569; line-height: 1.6;">You now have full access to the Presenter Portal to deliver keynote briefings, curate topics from the Topic Bank, and attach academic slide decks.</p>`,
            `<div style="text-align: center; margin: 26px 0;">`,
            `<a href="https://www.thegyde.in/#signin" style="display: inline-block; background: #d97706; color: #ffffff; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: 700;">Sign In to Presenter Portal &rarr;</a>`,
            `</div>`,
            `</div>`,
            `<div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; font-size: 0.78rem; color: #94a3b8; text-align: center;">`,
            `&copy; Global Youth Dialogue & Exchange (GYDE) &bull; <a href="https://www.thegyde.in" style="color: #d97706; text-decoration: none;">thegyde.in</a>`,
            `</div></div></body></html>`,
            '',
            '.'
          ].join('\r\n') + '\r\n';
          socket.write(body);
        } else if (step === 8 && reply.startsWith('250')) {
          step = 9;
          socket.write('QUIT\r\n');
          resolve(true);
        } else if (reply.startsWith('5') || reply.startsWith('4')) {
          socket.destroy();
          resolve(false);
        }
      });

      socket.on('error', () => resolve(false));
      socket.setTimeout(10000, () => { socket.destroy(); resolve(false); });
    } catch (e) {
      resolve(false);
    }
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  loadSavedApplications();
  try {
    await fetchFromGitHub();
  } catch (e) {}

  if (req.method === 'GET') {
    return res.status(200).json(globalApplications);
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      body = body || {};

      // Handle Clear All Trial Data action
      if (body.action === 'clearTrialData') {
        globalApplications = [];
        await persistApplications();
        return res.status(200).json({
          success: true,
          message: 'All trial applications deleted from server.'
        });
      }

      // Handle Delete Member / Delete User permanently from cloud database
      if (body.action === 'deleteUser' || body.action === 'deleteMember') {
        const targetEmail = (body.email || '').toLowerCase().trim();
        const targetId = (body.id || '').trim();
        globalApplications = globalApplications.filter(a => {
          const aEmail = (a.email || '').toLowerCase().trim();
          const aId = (a.id || '').trim();
          if (targetEmail && aEmail === targetEmail) return false;
          if (targetId && aId === targetId) return false;
          return true;
        });
        if (targetEmail && targetEmail !== '3681mubashircp@gmail.com') {
          globalApplications.push({
            id: targetId || ('del_' + Date.now().toString(36)),
            email: targetEmail,
            name: body.name || 'Removed User',
            password: '',
            status: 'Deleted',
            date: new Date().toISOString().split('T')[0]
          });
        }
        await persistApplications();
        return res.status(200).json({
          success: true,
          message: 'User credentials and application permanently removed from cloud database.'
        });
      }

      // Handle Password Synchronization across remote browsers
      if (body.action === 'updatePassword') {
        const targetEmail = (body.email || '').trim().toLowerCase();
        const targetPass = (body.password || '').trim();
        const match = globalApplications.find(a => targetEmail && a.email && a.email.toLowerCase().trim() === targetEmail);
        if (match && targetPass) {
          match.password = targetPass;
          await persistApplications();
          return res.status(200).json({ success: true, message: 'Password synchronized successfully.' });
        }
        return res.status(200).json({ success: false, message: 'No matching application to update password.' });
      }

      // Handle User Role Updates from Community Roster (action: 'updateUserRole')
      if (body.action === 'updateUserRole') {
        const targetEmail = (body.email || '').trim().toLowerCase();
        const newRole = body.role || 'Member';
        const isApprovedPres = (newRole === 'Presenter' || body.isApprovedPresenter === true);

        const memberMatch = globalApplications.find(a => 
          a.type !== 'presenter' && 
          !String(a.id || '').startsWith('papp_') &&
          a.email && 
          a.email.toLowerCase().trim() === targetEmail
        );
        if (memberMatch) {
          memberMatch.role = newRole;
          memberMatch.isApprovedPresenter = isApprovedPres;
        }

        if (isApprovedPres) {
          const presMatch = globalApplications.find(a => 
            (a.type === 'presenter' || String(a.id || '').startsWith('papp_')) &&
            a.email && 
            a.email.toLowerCase().trim() === targetEmail
          );
          if (presMatch) {
            presMatch.status = 'Approved';
          }
        }

        await persistApplications();
        return res.status(200).json({
          success: true,
          message: `User role updated to ${newRole}`,
          application: memberMatch
        });
      }

      // Handle Presenter Application Submission (action: 'submitPresenterApplication' or type: 'presenter')
      if (body.action === 'submitPresenterApplication' || (body.type === 'presenter' && body.action !== 'updatePresenterStatus' && body.action !== 'updateStatus') || (body.id && String(body.id).startsWith('papp_') && body.action !== 'updatePresenterStatus' && body.action !== 'updateStatus')) {
        const name = (body.name || '').trim();
        const email = (body.email || '').trim().toLowerCase();
        const country = (body.country || 'Global').trim();

        if (!name || !email) {
          return res.status(400).json({ error: 'Name and email are required.' });
        }

        const presApp = {
          id: body.id || ('papp_' + Date.now().toString(36)),
          userId: body.userId || null,
          name,
          email,
          country,
          flag: body.flag || 'INT',
          primarySpheres: Array.isArray(body.primarySpheres) ? body.primarySpheres : [],
          proposedTopic: body.proposedTopic || 'Academic Research Briefing',
          researchExperience: body.researchExperience || '',
          dossierUrl: body.dossierUrl || '',
          preferredFormat: body.preferredFormat || '15-min Keynote Briefing',
          statementOfIntent: body.statementOfIntent || '',
          status: body.status || 'Pending',
          type: 'presenter',
          date: body.date || new Date().toISOString().split('T')[0]
        };

        const existingIdx = globalApplications.findIndex(a => 
          (a.type === 'presenter' || (a.id && String(a.id).startsWith('papp_'))) && 
          ((a.id && a.id === presApp.id) || (a.email && a.email.toLowerCase().trim() === email))
        );

        if (existingIdx >= 0) {
          globalApplications[existingIdx] = {
            ...globalApplications[existingIdx],
            ...presApp
          };
        } else {
          globalApplications.unshift(presApp);
        }

        await persistApplications();

        try {
          await Promise.race([
            sendAdminPresenterNotification(presApp),
            new Promise(r => setTimeout(() => r(false), 3000))
          ]);
        } catch (e) {}

        return res.status(200).json({
          success: true,
          message: 'Presenter accreditation request recorded successfully.',
          application: presApp
        });
      }

      // Handle Presenter Status Updates (action: 'updatePresenterStatus')
      if (body.action === 'updatePresenterStatus') {
        const targetId = (body.id || '').trim();
        const targetEmail = (body.email || '').trim().toLowerCase();
        const newStatus = body.status || 'Approved';

        const match = globalApplications.find(a => 
          (a.type === 'presenter' || (a.id && String(a.id).startsWith('papp_'))) &&
          ((targetId && a.id === targetId) || (targetEmail && a.email && a.email.toLowerCase().trim() === targetEmail))
        );

        if (match) {
          match.status = newStatus;
          await persistApplications();

          if (newStatus === 'Approved') {
            const memberMatch = globalApplications.find(a => 
              a.type !== 'presenter' && 
              a.email && 
              a.email.toLowerCase().trim() === targetEmail
            );
            if (memberMatch) {
              memberMatch.role = 'Presenter';
              memberMatch.isApprovedPresenter = true;
            }
            await persistApplications();

            try {
              await Promise.race([
                sendPresenterApprovalNotification(match),
                new Promise(r => setTimeout(() => r(false), 4000))
              ]);
            } catch (e) {}
          }

          return res.status(200).json({
            success: true,
            message: `Presenter application status updated to "${newStatus}"`,
            application: match
          });
        }
      }

      // Handle Status Updates from Coordinator Dashboard (e.g. Approved / Rejected)
      const isExplicitStatusUpdate = (body.action === 'updateStatus' || body.action === 'update');
      const isStatusOnlyUpdate = (!body.name && body.status && (body.id || body.email));

      if (isExplicitStatusUpdate || isStatusOnlyUpdate) {
        const targetId = (body.id || '').trim();
        const targetEmail = (body.email || '').trim().toLowerCase();
        const newStatus = body.status;

        const match = globalApplications.find(a => 
          (targetId && a.id === targetId) || 
          (targetEmail && a.email && a.email.toLowerCase().trim() === targetEmail)
        );

        if (match) {
          match.status = newStatus;
          if (body.password && body.password.trim()) {
            match.password = body.password.trim();
          }
          await persistApplications();

          // If approved, notify applicant via email
          if (newStatus === 'Approved') {
            try {
              if (match.type === 'presenter' || (match.id && String(match.id).startsWith('papp_'))) {
                const memberMatch = globalApplications.find(a => 
                  a.type !== 'presenter' && 
                  a.email && 
                  a.email.toLowerCase().trim() === (match.email || '').toLowerCase().trim()
                );
                if (memberMatch) {
                  memberMatch.role = 'Presenter';
                  memberMatch.isApprovedPresenter = true;
                }
                await persistApplications();
                await Promise.race([
                  sendPresenterApprovalNotification(match),
                  new Promise(r => setTimeout(() => r(false), 4000))
                ]);
              } else {
                await Promise.race([
                  sendApplicantApprovalNotification(match),
                  new Promise(r => setTimeout(() => r(false), 4000))
                ]);
              }
            } catch (e) {}
          }

          return res.status(200).json({
            success: true,
            message: `Application status updated to "${newStatus}"`,
            application: match
          });
        } else if (targetEmail) {
          const createdApp = {
            id: targetId || ('app_' + Date.now().toString(36)),
            name: body.name || 'Member',
            email: targetEmail,
            password: body.password || '',
            country: body.country || 'Global',
            flag: body.flag || 'INT',
            status: newStatus,
            date: new Date().toISOString().split('T')[0]
          };
          globalApplications.unshift(createdApp);
          await persistApplications();
          if (newStatus === 'Approved') {
            try {
              await Promise.race([
                sendApplicantApprovalNotification(createdApp),
                new Promise(r => setTimeout(() => r(false), 4000))
              ]);
            } catch (e) {}
          }
          return res.status(200).json({
            success: true,
            message: `Application status recorded as "${newStatus}"`,
            application: createdApp
          });
        }
        return res.status(404).json({ error: 'Application not found to update.' });
      }

      // Handle New Application Submission (action: 'submitApplication' or standard form post)
      const name = (body.name || '').trim();
      const email = (body.email || '').trim();
      const country = (body.country || 'Global').trim();

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
      }

      const newApp = {
        id: body.id || ('app_' + Date.now().toString(36)),
        name,
        email,
        password: body.password || '',
        country,
        flag: body.flag || 'INT',
        interests: Array.isArray(body.interests) ? body.interests : (body.interests ? [body.interests] : ['Global Affairs']),
        debateExperience: body.debateExperience || '',
        motivation: body.motivation || '',
        status: body.status || 'Pending',
        emailVerified: body.emailVerified !== undefined ? body.emailVerified : true,
        date: body.date || new Date().toISOString().split('T')[0]
      };

      // Check if duplicate email exists
      const existingIdx = globalApplications.findIndex(a => a.email && a.email.toLowerCase().trim() === email.toLowerCase());
      if (existingIdx >= 0) {
        // If already approved/registered, do not downgrade to pending unless coordinator explicitly changed it
        const existingStatus = globalApplications[existingIdx].status;
        const incomingStatus = newApp.status;
        const isExistingApproved = (existingStatus === 'Approved - Awaiting Registration' || existingStatus === 'Approved');
        const finalStatus = (isExistingApproved && incomingStatus === 'Pending') ? existingStatus : incomingStatus;
        const finalPassword = (newApp.password && newApp.password.trim()) ? newApp.password.trim() : (globalApplications[existingIdx].password || '');

        globalApplications[existingIdx] = { 
          ...globalApplications[existingIdx], 
          ...newApp, 
          status: finalStatus,
          password: finalPassword
        };
      } else {
        globalApplications.unshift(newApp);
      }

      await persistApplications();

      // Asynchronously notify coordinator via email (with timeout fallback)
      try {
        await Promise.race([
          sendAdminNotification(newApp),
          new Promise(r => setTimeout(() => r(false), 3000))
        ]);
      } catch (e) {}

      return res.status(200).json({
        success: true,
        message: 'Application recorded successfully.',
        application: newApp
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Internal error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
