import fs from 'fs';
import path from 'path';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { Application } from '../models/Application';
import { User } from '../models/User';
import { hashPassword } from '../utils/password';
import { ROLES, UserRole } from '../constants/roles';
import { logger } from '../config/logger';

async function migrateLegacyData() {
  await connectDatabase();
  logger.info('🔄 Starting legacy data migration...');

  let appJsonPath = path.resolve(process.cwd(), 'applications.json');
  if (!fs.existsSync(appJsonPath)) {
    appJsonPath = path.resolve(process.cwd(), '../applications.json');
  }
  if (!fs.existsSync(appJsonPath)) {
    logger.warn(`⚠️ applications.json not found at: ${appJsonPath}`);
    await disconnectDatabase();
    return;
  }

  const raw = fs.readFileSync(appJsonPath, 'utf8');
  let legacyApplications: any[] = [];
  try {
    legacyApplications = JSON.parse(raw);
  } catch (e: any) {
    logger.error(`Failed to parse applications.json: ${e.message}`);
    await disconnectDatabase();
    return;
  }

  logger.info(`Found ${legacyApplications.length} records in applications.json`);

  let importedCount = 0;
  let updatedCount = 0;
  let userAccountsCreated = 0;

  for (const item of legacyApplications) {
    if (!item.email || !item.name) continue;
    const email = item.email.toLowerCase().trim();

    // Map legacy status to Mongoose status enum
    let status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'deleted' = 'pending';
    const legacyStatus = (item.status || '').toLowerCase();
    if (legacyStatus === 'approved') status = 'approved';
    else if (legacyStatus === 'rejected') status = 'rejected';
    else if (legacyStatus === 'deleted') status = 'deleted';
    else if (legacyStatus === 'under_review') status = 'under_review';

    let app = await Application.findOne({ email });
    if (!app) {
      app = await Application.create({
        applicantName: item.name,
        email,
        password: item.password || '',
        country: item.country || 'Unknown',
        flag: item.flag || 'INT',
        organization: item.organization || '',
        experience: item.debateExperience || '',
        motivation: item.motivation || '',
        areasOfInterest: Array.isArray(item.interests) ? item.interests : [],
        preferredLanguages: Array.isArray(item.languages) ? item.languages : ['English'],
        status,
        isApprovedPresenter: item.isApprovedPresenter || item.role === 'Presenter',
        emailVerified: !!item.emailVerified,
        createdAt: item.date ? new Date(item.date) : new Date(),
      });
      importedCount++;
    } else {
      app.applicantName = item.name;
      app.status = status;
      app.experience = item.debateExperience || app.experience;
      app.motivation = item.motivation || app.motivation;
      if (item.isApprovedPresenter) app.isApprovedPresenter = true;
      await app.save();
      updatedCount++;
    }

    // If application is Approved, ensure corresponding active User account exists
    if (status === 'approved') {
      let user = await User.findOne({ email });
      if (!user) {
        const passwordHash = await hashPassword(item.password || 'gydeMember2026!');
        const role: UserRole = item.isApprovedPresenter || item.role === 'Presenter' ? ROLES.PRESENTER : ROLES.MEMBER;

        user = await User.create({
          name: item.name,
          email,
          passwordHash,
          role,
          status: 'active',
          emailVerified: true,
          country: item.country || '',
          organization: item.organization || '',
          interests: Array.isArray(item.interests) ? item.interests : [],
        });
        userAccountsCreated++;
      }
      app.linkedUser = user._id as any;
      await app.save();
    }
  }

  logger.info('===============================================');
  logger.info(`📊 MIGRATION REPORT:`);
  logger.info(`   - New Applications Imported: ${importedCount}`);
  logger.info(`   - Existing Applications Updated: ${updatedCount}`);
  logger.info(`   - Member User Accounts Created: ${userAccountsCreated}`);
  logger.info('===============================================');

  await disconnectDatabase();
}

migrateLegacyData().catch((err) => {
  logger.error(`Migration error: ${err.message}`);
  process.exit(1);
});
