export interface TopicBankItem {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryNameAr?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  subtopics: string[];
  subtopicsAr?: string[];
  recommendedFormats?: string[];
  isCustom?: boolean;
  addedBy?: string;
  dateAdded?: string;
}

export const TOPIC_BANK: TopicBankItem[] = [
    // Education & Future of Learning
    {
      id: 'tb_edu_01',
      categoryId: 'education',
      categoryName: 'Education & Future of Learning',
      categoryNameAr: 'التعليم ومستقبل التعلم',
      title: 'Higher Education Access and the Global Student Debt Crisis',
      titleAr: 'فرص التعليم العالي وأزمة ديون الطلاب العالمية',
      description: 'Evaluating sovereign public funding models, tuition-free university experiments, and student debt forgiveness across OECD and developing nations.',
      descriptionAr: 'تقييم نماذج التمويل الحكومي، وتجارب مجانية التعليم الجامعي، وإسقاط ديون الطلاب بين دول التعاون الاقتصادي والدول النامية.',
      subtopics: [
        'Tuition-Free Public Higher Education vs Targeted Need-Based Subsidies',
        'Graduate Brain Drain from Developing to High-Income Economies',
        'Alternative Micro-Credentials & Digital Academies vs Traditional Degrees',
        'Securitization of Student Loans and Long-Term Socioeconomic Mobility'
      ],
      subtopicsAr: [
        'مجانية التعليم العالي الحكومي مقابل الدعم المالي الموجه',
        'هجرة العقول الشابة من الدول النامية إلى الاقتصادات المتقدمة',
        'الشهادات المصغرة والمنصات الرقمية كبديل للشهادة الجامعية التقليدية',
        'توريق قروض الطلاب وأثرها على الحراك الاجتماعي والاقتصادي'
      ],
      recommendedFormats: ['Roundtable Discussion', 'Formal Debate', 'Policy Presentation'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-05-15'
    },
    {
      id: 'tb_edu_02',
      categoryId: 'education',
      categoryName: 'Education & Future of Learning',
      categoryNameAr: 'التعليم ومستقبل التعلم',
      title: 'Standardized Testing vs Competency-Based Assessment in Secondary Schools',
      titleAr: 'الاختبارات المعيارية مقابل التقييم القائم على الكفاءات في المدارس',
      description: 'Investigating whether standardized examinations reinforce socioeconomic stratification or provide objective meritocratic measurement across diverse schooling districts.',
      descriptionAr: 'بحث ما إذا كانت الاختبارات الموحدة تكرس التفاوت الطبقي أم أنها توفر مقياساً موضوعياً للجدارة عبر مختلف البيئات التعليمية.',
      subtopics: [
        'Predictive Validity of Standardized Exams for University Success',
        'Portfolio & Project-Based Portfolios as Scalable Evaluation Alternatives',
        'Commercial Test-Prep Industries and Educational Inequity',
        'Neurodiversity and Fair Cognitive Assessment Frameworks'
      ],
      subtopicsAr: [
        'القدرة التنبؤية للاختبارات المعيارية في قياس النجاح الجامعي',
        'ملفات الإنجاز والمشاريع كبدائل تقييمية قابلة للتطبيق على نطاق واسع',
        'صناعة الدروس الخصوصية التجارية وتعميق الفجوة التعليمية',
        'مراعاة التنوع العصبي وأطر التقييم المعرفي العادل'
      ],
      recommendedFormats: ['Formal Debate', 'Academic Workshop', 'Topic Presentation'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-05-20'
    },
    {
      id: 'tb_edu_03',
      categoryId: 'education',
      categoryName: 'Education & Future of Learning',
      categoryNameAr: 'التعليم ومستقبل التعلم',
      title: 'The Digital Divide: Bandwidth, Hardware & Educational Sovereignty',
      titleAr: 'الفجوة الرقمية: شبكات الإنترنت والأجهزة والسيادة التعليمية',
      description: 'Assessing structural disparities in digital learning infrastructure across the Global South and the risk of automated pedagogical lock-in.',
      descriptionAr: 'دراسة الفوارق الهيكلية في البنية التحتية للتعلم الرقمي في دول الجنوب العالمي ومخاطر التبعية التقنية.',
      subtopics: [
        'Universal Internet Access as an Inviolable Human Right to Education',
        'Open-Source Educational Resources (OER) vs Proprietary EdTech Platforms',
        'Rural and Indigenous Community Offline Digital Learning Toolkits',
        'National Cloud Infrastructures for Curriculum Data Sovereignty'
      ],
      subtopicsAr: [
        'اعتبار الوصول للإنترنت حقاً إنسانياً ملازماً للحق في التعليم',
        'الموارد التعليمية مفتوحة المصدر مقابل المنصات الاحتكارية',
        'حقائب التعلم الرقمي بدون إنترنت للمجتمعات الريفية والنائية',
        'البنى التحتية السحابية الوطنية لحماية سيادة البيانات التعليمية'
      ],
      recommendedFormats: ['Policy Discussion', 'Topic Presentation', 'Academic Activity'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-06-01'
    },

    // Economy, Labor & Future of Work
    {
      id: 'tb_econ_01',
      categoryId: 'economy',
      categoryName: 'Economy, Labor & Future of Work',
      categoryNameAr: 'الاقتصاد ومستقبل الوظائف',
      title: 'Universal Basic Income vs Guaranteed State Employment in Automated Economies',
      titleAr: 'الدخل الأساسي الشامل مقابل التوظيف الحكومي المضمون في ظل الأتمتة',
      description: 'Examining macroeconomic safety nets as robotics, generative agents, and algorithmic automation transform white-collar and industrial labor forces.',
      descriptionAr: 'دراسة شبكات الأمان الاقتصادي الكلي مع تحول الروبوتات والوكلاء الأذكياء إلى مجالات العمل المكتبي والصناعي.',
      subtopics: [
        'Financing Mechanisms: Robot Windfall Taxes vs Wealth Redistribution',
        'Inflationary Risks and Labor Market Participation Incentives',
        'Psychological Meaning of Work vs Guaranteed Economic Subsistence',
        'Pilot UBI Empirical Evidence from Kenya, Finland, and Alaska'
      ],
      subtopicsAr: [
        'آليات التمويل: الضرائب على الأتمتة مقابل إعادة توزيع الثروات',
        'مخاطر التضخم وحوافز المشاركة في سوق العمل والإنتاج',
        'القيمة النفسية والاجتماعية للعمل مقابل الضمان المعيشي المجرد',
        'الأدلة التجريبية لبرامج الدخل الأساسي في كينيا وفنلندا وألاسكا'
      ],
      recommendedFormats: ['Formal Debate', 'Panel Discussion', 'Roundtable'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-06-10'
    },
    {
      id: 'tb_econ_02',
      categoryId: 'economy',
      categoryName: 'Economy, Labor & Future of Work',
      categoryNameAr: 'الاقتصاد ومستقبل الوظائف',
      title: 'Global South Sovereign Debt Architecture and Multilateral Financial Reform',
      titleAr: 'بنية الديون السيادية في الجنوب العالمي وإصلاح المؤسسات المالية الدولية',
      description: 'Interrogating the legitimacy of external debt burdens, IMF conditionalities, and debt-for-climate swap instruments in developing economies.',
      descriptionAr: 'مساءلة أعباء الديون الخارجية وشروط صندوق النقد الدولي وآليات مبادلة الديون بالاستثمار المناخي في الدول النامية.',
      subtopics: [
        'Debt-for-Climate and Debt-for-Nature Swaps: Genuine Relief or Greenwashing?',
        'Reforming Voting Power and Governance at the IMF & World Bank',
        'The Threat of Vulture Funds and Transnational Sovereign Insolvency Frameworks',
        'South-South Bilateral Currency Settlements and De-Dollarization Dynamics'
      ],
      subtopicsAr: [
        'مبادلة الديون بالمشاريع المناخية: حلول حقيقية أم غسيل بيئي؟',
        'إصلاح حصص التصويت والحوكمة في صندوق النقد والبنك الدوليين',
        'صناديق المضاربة ومقترح محكمة إعسار دولية للديون السيادية',
        'التسويات التجارية بالعملات المحلية ومسارات تقليص الاعتماد على الدولار'
      ],
      recommendedFormats: ['Topic Presentation', 'Policy Roundtable', 'Academic Workshop'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-06-15'
    },
    {
      id: 'tb_econ_03',
      categoryId: 'economy',
      categoryName: 'Economy, Labor & Future of Work',
      categoryNameAr: 'الاقتصاد ومستقبل الوظائف',
      title: 'Platform Capitalism and Gig Worker Rights: Redefining Global Labor Treaties',
      titleAr: 'رأسمالية المنصات وحقوق عمال التطبيقات: إعادة صياغة معاهدات العمل الدولية',
      description: 'Analyzing the legal misclassification of platform gig workers as independent contractors and the need for enforceable transnational labor protections.',
      descriptionAr: 'تحليل التصنيف القانوني لعمال المنصات كمتعاقدين مستقلين وضرورة إرساء حماية عمالية دولية ملزمة.',
      subtopics: [
        'Algorithmic Management and the Right to Transparent Performance Metrics',
        'Cross-Border Digital Freelancing and Social Security Portability',
        'Decentralized Gig Worker Unions and Collective Bargaining Precedents',
        'Corporate Antitrust vs Labor Exemption Doctrines in Platform Markets'
      ],
      subtopicsAr: [
        'الإدارة الخوارزمية وحق العمال في معرفة معايير التقييم وتوزيع المهام',
        'العمل الحر الرقمي عبر الحدود وتحويلات الضمان الاجتماعي المشترك',
        'النقابات العمالية الرقمية وسوابق المفاوضات الجماعية للمنصات',
        'قوانين مكافحة الاحتكار مقابل حماية حقوق التنظيم النقابي لعمال التطبيقات'
      ],
      recommendedFormats: ['Panel Discussion', 'Formal Debate', 'Policy Workshop'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-06-25'
    },

    // Geopolitics & International Relations
    {
      id: 'tb_geo_01',
      categoryId: 'global-affairs',
      categoryName: 'Geopolitics & International Relations',
      categoryNameAr: 'الجيوسياسية والعلاقات الدولية',
      title: 'Reforming the United Nations Security Council Veto Power',
      titleAr: 'إصلاح حق النقض (الفيتو) في مجلس الأمن التابع للأمم المتحدة',
      description: 'Assessing institutional reform models, African Union Ezulwini Consensus, and the procedural abolition or restriction of the permanent five (P5) veto power.',
      descriptionAr: 'تقييم نماذج الإصلاح المؤسسي، وتوافق إيزولويني للاتحاد الأفريقي، وخيارات تقييد أو إلغاء حق الفيتو للدول الخمس الدائمة.',
      subtopics: [
        'Procedural Veto Overrides by the UN General Assembly (Uniting for Peace)',
        'Permanent African, Latin American & Asian Security Council Seats',
        'Restricting Veto Usage in Situations of Mass Atrocity Crimes',
        'Regional Multilateral Alternatives (BRICS+, GCC, ASEAN Security Dialogue)'
      ],
      subtopicsAr: [
        'تفعيل تجاوز الفيتو عبر الجمعية العامة (قرار الاتحاد من أجل السلام)',
        'تخصيص مقاعد دائمة لقارات أفريقيا وأمريكا اللاتينية وآسيا',
        'تقييد استخدام الفيتو في جرائم الإبادة والجرائم ضد الإنسانية',
        'البدائل الإقليمية المتعددة (بريكس+، مجلس التعاون، رابطة آسيان)'
      ],
      recommendedFormats: ['Formal Debate', 'Diplomatic Roundtable', 'Topic Presentation'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-07-01'
    },
    {
      id: 'tb_geo_02',
      categoryId: 'global-affairs',
      categoryName: 'Geopolitics & International Relations',
      categoryNameAr: 'الجيوسياسية والعلاقات الدولية',
      title: 'Small State Mediation Diplomacy in Intractable International Conflicts',
      titleAr: 'دبلوماسية الوساطة للدول الصغيرة في النزاعات الدولية المعقدة',
      description: 'Examining how neutral small states (such as Qatar, Switzerland, Oman, and Singapore) leverage soft power, diplomatic neutrality, and mediation to de-escalate crises.',
      descriptionAr: 'دراسة كيفية توظيف الدول الصغيرة المحايدة (مثل قطر وسويسرا وعُمان وسنغافورة) للقوة الناعمة والحياد النشط لفض النزاعات.',
      subtopics: [
        'Institutional Backchannels vs High-Profile Bilateral Negotiations',
        'Maintaining Impartiality Amid External Coalition Pressures',
        'Humanitarian Hostage and Prisoner Swap Mediation Frameworks',
        'Economic and Reputational Safeguards for Non-Aligned Mediators'
      ],
      subtopicsAr: [
        'القنوات الدبلوماسية الخلفية غير الرسمية مقابل المفاوضات العلنية',
        'الحفاظ على الحياد في ظل ضغوط التحالفات الإقليمية والدولية',
        'أطر وساطة تبادل الأسرى والملفات الإنسانية في أوقات الحروب',
        'الضمانات الاقتصادية والسيادية للدول التي تتبنى دور الوسيط المحايد'
      ],
      recommendedFormats: ['Topic Presentation', 'Diplomatic Seminar', 'Academic Workshop'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-07-05'
    },
    {
      id: 'tb_geo_03',
      categoryId: 'global-affairs',
      categoryName: 'Geopolitics & International Relations',
      categoryNameAr: 'الجيوسياسية والعلاقات الدولية',
      title: 'Unilateral Economic Sanctions and International Humanitarian Law',
      titleAr: 'العقوبات الاقتصادية أحادية الجانب والقانون الدولي الإنساني',
      description: 'Debating whether broad extraterritorial sanctions constitute collective punishment and assessing targeted asset freezes as legal alternatives.',
      descriptionAr: 'مناقشة ما إذا كانت العقوبات الشاملة تمثل عقاباً جماعياً للشعوب، وتقييم العقوبات الذكية الموجهة كبديل قانوني.',
      subtopics: [
        'Civilian Humanitarian Toll vs Intended Political Coercion',
        'Extraterritorial Jurisdiction and Secondary Sanctions Overreach',
        'De-Risking by Transnational Banks and Ineffective Medicine Waivers',
        'Alternative Sanction-Proof Bilateral Trade Infrastructure'
      ],
      subtopicsAr: [
        'الآثار الإنسانية على المدنيين مقابل الأهداف السياسية المرجوة',
        'الولاية القضائية العابرة للحدود وتجاوزات العقوبات الثانوية',
        'تحفظ البنوك الدولية وإعاقة وصول المساعدات والأدوية الإنسانية',
        'بناء شبكات تجارية مستقلة ومحصنة ضد العقوبات المالية'
      ],
      recommendedFormats: ['Formal Debate', 'Policy Discussion', 'Academic Paper Colloquium'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-07-15'
    },

    // Technology & AI Ethics
    {
      id: 'tb_tech_01',
      categoryId: 'tech-ai',
      categoryName: 'Technology & AI Ethics',
      categoryNameAr: 'التكنولوجيا والذكاء الاصطناعي',
      title: 'Generative AI in Academic Research: Authorship, Integrity and Peer Review',
      titleAr: 'الذكاء الاصطناعي التوليدي في البحث الأكاديمي: النزاهة والتأليف والتحكيم',
      description: 'Interrogating the epistemological foundations of scholarly research when LLMs generate hypotheses, syntheses, and peer-review critiques.',
      descriptionAr: 'مساءلة الأسس المعرفية للبحث العلمي عند استخدام النماذج اللغوية في صياغة الفرضيات وتلخيص الأوراق والتحكيم العلمي.',
      subtopics: [
        'Mandatory Algorithmic Disclosure Standards in Academic Publishing',
        'Epistemic Stagnation and Synthetic Hallucinations in Scholarly Citation',
        'AI Peer Reviewers: Efficiency vs Human Discretion and Nuance',
        'Open-Weight Global Research Models vs Corporate Proprietary Labs'
      ],
      subtopicsAr: [
        'معايير الإفصاح الإلزامي عن استخدام النماذج الذكية في النشر الأكاديمي',
        'مخاطر الركود المعرفي والتزييف الخوارزمي في سلاسل الاستشهاد العلمي',
        'التحكيم الأكاديمي المؤتمت: بين الكفاءة والافتقار إلى الحكم الإنساني',
        'نماذج الأبحاث مفتوحة المصدر مقابل احتكار المختبرات التجارية الكبرى'
      ],
      recommendedFormats: ['Academic Workshop', 'Presentation & Q&A', 'Formal Debate'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-07-20'
    },
    {
      id: 'tb_tech_02',
      categoryId: 'tech-ai',
      categoryName: 'Technology & AI Ethics',
      categoryNameAr: 'التكنولوجيا والذكاء الاصطناعي',
      title: 'Autonomous Lethal Weapons Systems (LAWS) and the Ethics of Remote Warfare',
      titleAr: 'أنظمة الأسلحة الفتاكة الذاتية وأخلاقيات خوض الحروب عن بُعد',
      description: 'Analyzing international treaty negotiations to establish legally binding bans on algorithmic decision-making over life and death in combat zones.',
      descriptionAr: 'تحليل مفاوضات المعاهدات الدولية لفرض حظر ملزم على اتخاذ القرارات القتالية القاتلة ذاتياً دون تدخل بشري.',
      subtopics: [
        'Meaningful Human Control (MHC) Doctrine under Geneva Conventions',
        'Algorithmic Target Identification Errors and Command Responsibility',
        'Proliferation Hazards of Asymmetric Commercial Drone Swarms',
        'Geopolitical Stalemates in UN CCW Geneva Negotiations'
      ],
      subtopicsAr: [
        'مبدأ السيطرة البشرية الفعالة بموجب اتفاقيات جنيف للقانون الإنساني',
        'أخطاء التعرف الخوارزمي على الأهداف وتحديد المسؤولية الجنائية للقادة',
        'مخاطر انتشار أسراب الطائرات المسيرة التجارية رخيصة التكلفة',
        'الجمود الدبلوماسي في اجتماعات جنيف لاتفاقية الأسلحة التقليدية'
      ],
      recommendedFormats: ['Formal Debate', 'Policy Roundtable', 'Topic Presentation'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-07-28'
    },

    // Climate, Environment & Energy
    {
      id: 'tb_env_01',
      categoryId: 'environment',
      categoryName: 'Climate, Environment & Energy',
      categoryNameAr: 'المناخ والبيئة والاستدامة',
      title: 'Loss and Damage Reparations: Legal Mechanisms and Global North Accountability',
      titleAr: 'تعويضات الخسائر والأضرار: الآليات القانونية ومساءلة دول الشمال الصناعي',
      description: 'Examining the operationalization of the COP28 Loss and Damage Fund, historical cumulative emissions liability, and non-debt climate grant frameworks.',
      descriptionAr: 'دراسة تفعيل صندوق الخسائر والأضرار لمؤتمر COP28، والمسؤولية التاريخية عن الانبعاثات، وتوفير المنح غير المثقلة بالديون.',
      subtopics: [
        'Differentiating Multilateral Grant Funding from Commercial Climate Loans',
        'Quantifying Non-Economic Losses: Heritage, Land Submersion, and Culture',
        'Litigation at the International Court of Justice (ICJ Advisory Opinions)',
        'Direct Access Windows for Indigenous and Island Communities'
      ],
      subtopicsAr: [
        'التمييز بين التمويل عبر المنح التنموية المباشرة والقروض التجارية',
        'قياس الخسائر غير الاقتصادية: اندثار التراث وغرق الأراضي وضياع الهوية',
        'المسارات القضائية أمام محكمة العدل الدولية والآراء الاستشارية الملزمة',
        'قنوات التمويل المباشر للمجتمعات الأصلية وسكان الجزر المهددة بالزوال'
      ],
      recommendedFormats: ['Policy Roundtable', 'Formal Debate', 'Academic Presentation'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-08-05'
    },
    {
      id: 'tb_env_02',
      categoryId: 'environment',
      categoryName: 'Climate, Environment & Energy',
      categoryNameAr: 'المناخ والبيئة والاستدامة',
      title: 'Transboundary Rivers, Dam Construction and International Water Justice',
      titleAr: 'الأنهار العابرة للحدود وبناء السدود الكبرى والعدالة المائية الدولية',
      description: 'Addressing downstream riparian sovereignty, ecological flows, and joint basin management treaties in major river basins (Nile, Tigris-Euphrates, Indus, Mekong).',
      descriptionAr: 'معالجة سيادة دول المصب، والتدفقات البيئية الآمنة، ومعاهدات إدارة الأحواض المشتركة (النيل، دجلة والفرات، السند، ميكونغ).',
      subtopics: [
        'The 1997 UN Watercourses Convention and Equitable Utilization Principles',
        'Hydro-Hegemony vs Collaborative Basin River Commissions',
        'Drought Contingency Protocols During Dam Reservoir Filling Phases',
        'Water as a Target or Weapon of Warfare in Contemporary Clashes'
      ],
      subtopicsAr: [
        'اتفاقية الأمم المتحدة للمجاري المائية 1997 ومبادئ الاستخدام العادل',
        'الهيمنة المائية لدول المنبع مقابل الهيئات المشتركة لإدارة الأحواض',
        'بروتوكولات إدارة الجفاف أثناء فترات ملء خزانات السدود العملاقة',
        'استهداف أو توظيف المياه والمحطات كسلاح في النزاعات المسلحة'
      ],
      recommendedFormats: ['Topic Presentation', 'Diplomatic Roundtable', 'Policy Workshop'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-08-12'
    },

    // Governance, Democracy & Public Trust
    {
      id: 'tb_gov_01',
      categoryId: 'governance',
      categoryName: 'Governance, Democracy & Public Trust',
      categoryNameAr: 'الحوكمة والديمقراطية والثقة المجتمعية',
      title: 'Lowering the Voting Age to 16: Democratic Enfranchisement and Civic Readiness',
      titleAr: 'خفض سن الاقتراع إلى 16 عاماً: التمكين الديمقراطي والجاهزية المدنية',
      description: 'Evaluating democratic legitimacy when youth disproportionately bear the long-term consequences of climate, fiscal debt, and war policies.',
      descriptionAr: 'تقييم شرعية القرارات الديمقراطية في حين يتحمل الشباب العواقب المستقبلية لأزمات المناخ والديون والحروب.',
      subtopics: [
        'Empirical Lessons from Austria, Scotland, and Malta Voting at 16',
        'Civic Education Quality and Countering Disinformation Vulnerability',
        'Constitutional Consistency: Age of Military Service, Tax, and Franchise',
        'Youth Representation Quotas in Local and National Parliaments'
      ],
      subtopicsAr: [
        'الدروس المستفادة من تجارب النمسا واسكتلندا ومالطا في خفض سن التصويت',
        'جودة التربية المدنية المدرسية والتحصين ضد التضليل الرقمي',
        'الاتساق الدستوري: المقارنة بين سن التجنيد والضرائب والأهلية الانتخابية',
        'تخصيص حصص تمثيلية للشباب (كوتا) في البرلمانات والمجالس المحلية'
      ],
      recommendedFormats: ['Formal Debate', 'Panel Discussion', 'Youth Assembly'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-08-20'
    },

    // Human Rights & Social Justice
    {
      id: 'tb_hr_01',
      categoryId: 'human-rights',
      categoryName: 'Human Rights & Social Justice',
      categoryNameAr: 'حقوق الإنسان والعدالة الاجتماعية',
      title: 'Universal Refugee Protections and the Principle of Non-Refoulement in Global Crises',
      titleAr: 'حماية اللاجئين ومبدأ حظر الإعادة القسرية في الأزمات العالمية',
      description: 'Scrutinizing offshore externalized border processing agreements, pushbacks at sea, and the duty of sovereign states under the 1951 Geneva Refugee Convention.',
      descriptionAr: 'فحص اتفاقيات ترحيل طالبي اللجوء إلى دول ثالثة، والإرجاع القسري في البحار، والتزامات الدول بموجب اتفاقية 1951.',
      subtopics: [
        'Extraterritorial Outsourcing of Asylum: Human Rights Violations vs State Prerogative',
        'Climate-Induced Displacement and the Definition of Sovereign Persecution',
        'Safe Humanitarian Corridors and Equitable Responsibility Sharing',
        'Dignity, Work Authorization, and Long-Term Social Integration of Refugees'
      ],
      subtopicsAr: [
        'ترحيل معالجة اللجوء إلى دول ثالثة: بين انتهاكات الحقوق والسيادة',
        'النزوح القسري بفعل الكوارث المناخية وإعادة تعريف مفهوم الاضطهاد',
        'الممرات الإنسانية الآمنة والتوزيع العادل للمسؤوليات بين الدول',
        'حق العمل والكرامة الإنسانية والاندماج المجتمعي للاجئين'
      ],
      recommendedFormats: ['Roundtable Discussion', 'Formal Debate', 'Academic Paper Session'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-08-28'
    },

    // Global Health & Bioethics
    {
      id: 'tb_hlth_01',
      categoryId: 'global-health',
      categoryName: 'Global Health & Bioethics',
      categoryNameAr: 'الصحة العالمية والأخلاقيات الحيوية',
      title: 'CRISPR Gene-Editing and Human Germline Modification: Bioethical Red Lines',
      titleAr: 'تعديل الجينات بتقنية كريسبر والخطوط الأخلاقية الحيوية للتحسين البشري',
      description: 'Deliberating the frontier between therapeutic gene correction for hereditary diseases and irreversible cosmetic/cognitive germline enhancement.',
      descriptionAr: 'بحث الحدود الفاصلة بين العلاج الجيني للأمراض الوراثية المستعصية والتحسين الجيني الموروث لتعزيز القدرات.',
      subtopics: [
        'Therapeutic Eradication of Monogenic Disorders vs Transhumanist Enhancement',
        'Socioeconomic Inequality and the Emergence of Genetic Stratification',
        'Global Moratorium Treaties and Enforcing International Bioethical Protocols',
        'Indigenous and Intercultural Perspectives on Sacred Human Essence'
      ],
      subtopicsAr: [
        'العلاج الجيني للأمراض الوراثية مقابل النزعة التحسينية العابرة للإنسانية',
        'التفاوت الطبقي ومخاطر ظهور تفرقة بيولوجية بين الأغنياء والفقراء',
        'معاهدات الوقف المؤقت الدولية وفرض الرقابة الأخلاقية على الأبحاث',
        'رؤى الثقافات والشعوب المتنوعة حول حرمة وقدسية الجسد البشري'
      ],
      recommendedFormats: ['Academic Debate', 'Topic Presentation', 'Bioethics Seminar'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-09-05'
    },

    // Peace, Security & Conflict Resolution
    {
      id: 'tb_peace_01',
      categoryId: 'peace-security',
      categoryName: 'Peace, Security & Conflict Resolution',
      categoryNameAr: 'السلام والأمن وفض النزاعات',
      title: 'Youth, Peace and Security (UNSCR 2250): From Tokens to Decision-Makers',
      titleAr: 'الشباب والسلام والأمن (قرار 2250): من المشاركة الرمزية إلى صناعة القرار',
      description: 'Evaluating progress since UN Security Council Resolution 2250 in dismantling stereotypes of youth as perpetrators or passive victims of conflict.',
      descriptionAr: 'تقييم التقدم المحرز منذ صدور قرار مجلس الأمن 2250 وتفكيك النمطية التي تحصر الشباب في خانة الضحايا أو الجناة.',
      subtopics: [
        'Formal Inclusion of Youth Delegates in Bilateral Peace Negotiations',
        'Community-Led Grassroots Demilitarization and Disarmament Initiatives',
        'Funding Disparities: Security Spending vs Youth Peacebuilding Grants',
        'Psychosocial Trauma Recovery and Intergenerational Healing Circles'
      ],
      subtopicsAr: [
        'إشراك ممثلي الشباب بصورة رسمية في مفاوضات اتفاقيات السلام الثنائية',
        'المبادرات الأهلية لنزع السلاح وإعادة الإدماج المجتمعي للمقاتلين السابقين',
        'المقارنة بين ميزانيات التسليح والإنفاق العسكري ومنح مبادرات السلام الشبابية',
        'التعافي من الصدمات النفسية والحوار التفاعلي لمعالجة جراح النزاعات'
      ],
      recommendedFormats: ['Roundtable Discussion', 'Academic Workshop', 'Topic Presentation'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-09-12'
    },

    // Culture, Media & Global Identity
    {
      id: 'tb_cult_01',
      categoryId: 'culture',
      categoryName: 'Culture, Media & Global Identity',
      categoryNameAr: 'الثقافة والإعلام والهوية',
      title: 'Repatriation of Colonial-Era Artifacts from Western Institutions',
      titleAr: 'استعادة الآثار المنهوبة في الحقبة الاستعمارية من المتاحف الغربية',
      description: 'Examining the moral, legal, and educational arguments regarding the return of cultural treasures to their sovereign indigenous and national homelands.',
      descriptionAr: 'دراسة الحجج الأخلاقية والقانونية والتعليمية المتعلقة بإعادة الكنوز الأثرية إلى مواطنها الأصلية.',
      subtopics: [
        'Universal Museum Concept vs Restorative Justice for Plundered Nations',
        'Preservation and Curatorial Readiness Standards in the Global South',
        'Bilateral Treaties, UNESCO 1970 Convention and Unenforceable Soft Law',
        'Digital Twins and High-Resolution 3D Scanning as Restitution Substitutes'
      ],
      subtopicsAr: [
        'مفهوم "المتحف العالمي الشامل" مقابل العدالة التصالحية للشعوب المستعمرة',
        'معايير الصيانة والجاهزية الفنية في متاحف دول الجنوب العالمي',
        'المعاهدات الثنائية واتفاقية اليونسكو 1970 ومحدودية الإلزام القانوني',
        'المسح ثلاثي الأبعاد والنسخ الرقمية: هل تشكل بديلاً مقبولاً عن الإرجاع الفعلي؟'
      ],
      recommendedFormats: ['Formal Debate', 'Topic Presentation', 'Policy Roundtable'],
      isCustom: false,
      addedBy: 'Academic Advisory Board',
      dateAdded: '2024-09-20'
    }
  ];
