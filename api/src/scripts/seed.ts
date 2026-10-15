import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';
import { DialogueSession } from '../models/DialogueSession';
import { Topic } from '../models/Topic';
import { Publication } from '../models/Publication';
import { Application } from '../models/Application';
import { hashPassword } from '../utils/password';
import { ROLES } from '../constants/roles';
import { env } from '../config/env';
import { logger } from '../config/logger';

async function seed() {
  await connectDatabase();
  logger.info('🌱 Seeding database...');

  // 1. Initial Administrator
  let admin = await User.findOne({ email: env.INITIAL_ADMIN_EMAIL });
  if (!admin) {
    const adminPasswordHash = await hashPassword(env.INITIAL_ADMIN_PASSWORD);
    admin = await User.create({
      name: env.INITIAL_ADMIN_NAME,
      email: env.INITIAL_ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      role: ROLES.SUPER_ADMIN,
      status: 'active',
      emailVerified: true,
      country: 'India',
      organization: 'Global Youth Dialogue & Exchange (GYDE)',
      bio: 'Executive Director & Chief Platform Administrator.',
    });
    logger.info(`✅ Created Super Administrator: ${admin.email}`);
  }

  // 2. Demo Member
  const demoEmail = 'debater.demo@thegyde.in';
  let member = await User.findOne({ email: demoEmail });
  if (!member) {
    const memberPasswordHash = await hashPassword('gydeMember2026!');
    member = await User.create({
      name: 'Kofi Mensah',
      email: demoEmail,
      passwordHash: memberPasswordHash,
      role: ROLES.MEMBER,
      status: 'active',
      emailVerified: true,
      country: 'Ghana',
      organization: 'University of Ghana Debate Society',
      bio: 'Competitive debater, ISDC7 Qatar participant.',
    });
    logger.info(`✅ Created Demo Member: ${member.email}`);
  }

  // 3. Demo Topics
  const topicCount = await Topic.countDocuments();
  if (topicCount === 0) {
    await Topic.create([
      {
        title: 'Multilateral Diplomacy & United Nations Security Council Reform',
        titleAr: 'الدبلوماسية متعددة الأطراف وإصلاح مجلس الأمن الدولي',
        slug: 'unsc-reform-multilateral-diplomacy',
        description: 'Analyzing permanent membership expansion, veto power abolition, and regional representation in contemporary global governance.',
        category: 'global-affairs',
        status: 'approved',
        proposedBy: {
          userId: member._id,
          name: member.name,
          email: member.email,
          country: member.country,
        },
      },
      {
        title: 'Generative AI and Cognitive Sovereignty in Higher Education',
        titleAr: 'الذكاء الاصطناعي التوليدي والسيادة المعرفية في التعليم العالي',
        slug: 'generative-ai-cognitive-sovereignty',
        description: 'Evaluating epistemological challenges of algorithmic essay generation, academic integrity, and pedagogical paradigm shifts.',
        category: 'tech-ai',
        status: 'reviewing',
        proposedBy: {
          userId: member._id,
          name: member.name,
          email: member.email,
          country: member.country,
        },
      },
      {
        title: 'Loss and Damage Climate Finance: Legal Enforceability Post-COP29',
        titleAr: 'تمويل الخسائر والأضرار المناخية: الإلزام القانوني بعد COP29',
        slug: 'loss-damage-climate-finance-enforceability',
        description: 'Examining sovereign liability, international environmental courts, and financial reparation transfers from historical emitters.',
        category: 'environment',
        status: 'scheduled',
      },
    ]);
    logger.info('✅ Seeded initial dialogue topics');
  }

  // 4. Demo Sessions
  const sessionCount = await DialogueSession.countDocuments();
  if (sessionCount === 0) {
    await DialogueSession.create([
      {
        title: 'Session 03: Multilateral Diplomacy & UNSC Reform',
        titleAr: 'الجلسة 03: الدبلوماسية متعددة الأطراف وإصلاح مجلس الأمن',
        description: 'A structured Oxford-style parliamentary debate addressing modern multilateralism, veto abolition, and institutional credibility.',
        category: 'global-affairs',
        format: 'Oxford Parliamentary Debate',
        motion: 'This House would abolish the veto power of the permanent members of the UN Security Council.',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
        durationMinutes: 90,
        timezone: 'GMT+3 (Doha Time)',
        status: 'scheduled',
        meetingUrl: 'https://meet.google.com/gyd-isdc-demo',
        recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        recordingVisibility: 'members_only',
        presenters: [
          { userId: member._id, name: member.name, role: 'Prime Minister (Proposition)', country: 'Ghana' },
          { name: 'Amina Al-Kuwari', role: 'Leader of Opposition', country: 'Qatar' },
        ],
        propositionTeam: ['Kofi Mensah (Ghana)', 'Zaid Harbi (Jordan)'],
        oppositionTeam: ['Amina Al-Kuwari (Qatar)', 'Sofia Morales (Mexico)'],
        moderator: 'Tariq Al-Mansoor (Qatar Secretariat)',
        createdBy: admin._id,
      },
      {
        title: 'Session 02: Sovereign Artificial Intelligence Regulations',
        titleAr: 'الجلسة 02: تنظيمات الذكاء الاصطناعي السيادي',
        description: 'A comprehensive academic roundtable on algorithmic governance, open-weight model proliferation, and cross-border tech sanctions.',
        category: 'tech-ai',
        format: 'Academic Roundtable',
        motion: 'This House believes sovereign states must mandate domestic algorithmic auditing for foundation models.',
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        durationMinutes: 90,
        timezone: 'GMT+3 (Doha Time)',
        status: 'completed',
        recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        recordingVisibility: 'public',
        presenters: [
          { name: 'Dr. Farhan N.', role: 'Keynote Presenter', country: 'Singapore' },
        ],
        createdBy: admin._id,
      },
    ]);
    logger.info('✅ Seeded initial dialogue sessions');
  }

  // 5. Demo Publication
  const pubCount = await Publication.countDocuments();
  if (pubCount === 0) {
    await Publication.create({
      title: 'Structural Impasses in United Nations Security Council Reform: A Comparative Analysis of Proposed Expansion Frameworks',
      titleAr: 'المآزق الهيكلية في إصلاح مجلس الأمن: دراسة مقارنة لأطر التوسيع المقترحة',
      slug: 'structural-impasses-unsc-reform',
      abstract: 'This paper examines the institutional gridlock paralyzing the United Nations Security Council, evaluating geopolitical alignment models across the G4, the African Union Ezulwini Consensus, and the Uniting for Consensus coalition.',
      category: 'global-affairs',
      authors: [
        { name: 'Mubashir CP', country: 'India', role: 'Lead Author & Secretariat Director' },
        { name: 'Kofi Mensah', country: 'Ghana', role: 'Youth Research Fellow' },
      ],
      sections: [
        {
          title: '1. Introduction',
          content: 'The architectural design of the United Nations Security Council, forged in 1945, reflects post-WWII geopolitical balances that diverge substantially from contemporary 21st-century multilateral realities.',
        },
        {
          title: '2. The Veto Paradox and Democratic Deficit',
          content: 'The structural entrenchment of Chapter V, Article 27(3) granting five permanent members absolute negative vote prerogatives has created systemic deadlock in pressing humanitarian catastrophes.',
        },
        {
          title: '3. Comparative Assessment of Reform Blocs',
          content: 'The G4 coalition (Brazil, Germany, India, Japan) advocates permanent expansion with veto parity, while the Ezulwini Consensus demands two permanent African seats with complete veto equality.',
        },
        {
          title: '4. Conclusion and Policy Synthesis',
          content: 'Without progressive procedural modifications—such as the French-Mexican initiative on voluntary veto restraint during mass atrocities—the Security Council risks institutional irrelevance.',
        },
      ],
      status: 'published',
      visibility: 'public',
      publishedAt: new Date(),
      createdBy: admin._id,
    });
    logger.info('✅ Seeded initial academic publication');
  }

  logger.info('🎉 Seeding completed successfully!');
  await disconnectDatabase();
}

seed().catch((err) => {
  logger.error(`Seed failure: ${err.message}`);
  process.exit(1);
});
