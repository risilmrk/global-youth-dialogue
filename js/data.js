/**
 * GLOBAL YOUTH DIALOGUE - Data Layer & Persistence
 * Manages local database with pre-seeded demo content based on the project brief.
 */

const STORAGE_KEY = 'gyd_platform_db_v5';

// Initial pre-seeded database
const INITIAL_DATABASE = {
  users: [
    {
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
    }
  ],

  categories: [
    {
      id: 'global-affairs',
      name: 'Geopolitics & International Relations',
      nameAr: 'الجيوسياسية والعلاقات الدولية',
      icon: 'globe',
      description: 'International diplomacy, multilateral treaties, territorial sovereignty, global governance, and regional security architectures.',
      descriptionAr: 'الدبلوماسية الدولية، المعاهدات المتعددة، السيادة الإقليمية، الحوكمة العالمية، وبنى الأمن الإقليمي والدولي.',
      subTopics: [
        'Multilateral Diplomacy & UN Reform',
        'Territorial Sovereignty & Statehood',
        'Economic Sanctions & Financial Sovereignty',
        'Climate Migration & International Border Law',
        'Rise of Multipolar Global Orders'
      ],
      subTopicsAr: [
        'الدبلوماسية المتعددة وإصلاح الأمم المتحدة',
        'السيادة الإقليمية ومسائل الاعتراف بالدول',
        'العقوبات الاقتصادية والسيادة المالية',
        'الهجرة المناخية وقوانين الحدود الدولية',
        'صعود النظام الدولي متعدد الأقطاب'
      ]
    },
    {
      id: 'tech-ai',
      name: 'Technology & AI Ethics',
      nameAr: 'التكنولوجيا والذكاء الاصطناعي',
      icon: 'cpu',
      description: 'Generative algorithms, autonomous systems, digital privacy, algorithmic bias, surveillance capitalism, and tech governance.',
      descriptionAr: 'النماذج التوليدية، النظم الذاتية، الخصوصية الرقمية، انحياز الخوارزميات، رأسمالية المراقبة، وحوكمة التكنولوجيا.',
      subTopics: [
        'Generative AI in Classrooms & Academia',
        'Autonomous Weapons & Warfare Ethics',
        'Algorithmic Bias & Platform Regulation',
        'Surveillance Capitalism & Personal Privacy',
        'Deepfakes & Disinformation Countermeasures'
      ],
      subTopicsAr: [
        'الذكاء الاصطناعي في الفصول المدرسية والجامعات',
        'الأسلحة الذاتية وأخلاقيات خوض الحروب',
        'الانحياز الخوارزمي وتنظيم المنصات الكبرى',
        'رأسمالية المراقبة وحماية البيانات الشخصية',
        'التزييف العميق وحلول مكافحة التضليل'
      ]
    },
    {
      id: 'education',
      name: 'Education & Future of Learning',
      nameAr: 'التعليم ومستقبل التعلم',
      icon: 'book-open',
      description: 'Pedagogical reform, competency-based curricula, higher education access, the digital learning divide, and future workforce skills.',
      descriptionAr: 'تطوير المناهج، النظم القائمة على الكفاءة، فرص التعليم العالي، معالجة الفجوة الرقمية، وبناء مهارات سوق العمل.',
      subTopics: [
        'Competency-Based vs Standardized Testing',
        'The Digital Learning Divide in the Global South',
        'Tuition-Free Public Higher Education',
        'Critical Inquiry & Media Literacy in Schools',
        'Vocational Excellence vs Academic Pathways'
      ],
      subTopicsAr: [
        'التقييم القائم على المهارات مقابل الاختبارات الموحدة',
        'الفجوة الرقمية في التعليم بالدول النامية',
        'مجانية التعليم العالي والجامعي',
        'التفكير النقدي والتربية الإعلامية في المدارس',
        'التعليم المهني التخصصي مقابل المسارات الأكاديمية'
      ]
    },
    {
      id: 'environment',
      name: 'Climate, Environment & Energy',
      nameAr: 'المناخ والبيئة والاستدامة',
      icon: 'leaf',
      description: 'Loss and damage climate finance, energy transitions, global water security, biodiversity loss, and ecological accountability.',
      descriptionAr: 'تمويل الخسائر والأضرار المناخية، التحول الطاقي، الأمن المائي العالمي، صون التنوع الحيوي، والمسؤولية البيئية.',
      subTopics: [
        'Loss & Damage Reparations for Vulnerable States',
        'Nuclear Energy in Clean Grid Transitions',
        'Phasing Out Fossil Fuel Subsidies Globally',
        'Transboundary Rivers & Water Conflicts',
        'Systemic Industrial Accountability vs Eco-Consumerism'
      ],
      subTopicsAr: [
        'تعويضات الخسائر والأضرار للدول الأكثر تضرراً',
        'دور الطاقة النووية في الانتقال نحو الطاقة النظيفة',
        'إلغاء دعم الوقود الأحفوري على المستوى العالمي',
        'نزاعات الأنهار العابرة للحدود والأمن المائي',
        'المساءلة المؤسسية للمصانع مقابل الاستهلاك الفردي'
      ]
    },
    {
      id: 'economy',
      name: 'Economy, Labor & Future of Work',
      nameAr: 'الاقتصاد ومستقبل الوظائف',
      icon: 'trending-up',
      description: 'Youth employment ecosystems, automation disruptions, gig economy rights, universal basic income, and global wealth distribution.',
      descriptionAr: 'منظومات توظيف الشباب، اضطرابات الأتمتة، حقوق العاملين المستقلين، الدخل الأساسي، وعدالة توزيع الثروات.',
      subTopics: [
        'Universal Basic Income in Automated Economies',
        'Youth Unemployment in Developing Nations',
        'Gig Worker Protections & Labor Standard Treaties',
        'Central Bank Digital Currencies & De-Dollarization',
        'Progressive Wealth Taxation & Global Inequality'
      ],
      subTopicsAr: [
        'الدخل الأساسي الشامل في ظل الاقتصاد المؤتمت',
        'مواجهة بطالة الشباب في الاقتصادات النامية',
        'حماية حقوق العمال المستقلين واقتصاد المنصات',
        'العملات الرقمية للبنوك المركزية والتبادل التجاري',
        'الضرائب التصاعدية على الثروات وتقليص التفاوت'
      ]
    },
    {
      id: 'governance',
      name: 'Governance, Democracy & Public Trust',
      nameAr: 'الحوكمة والديمقراطية والثقة المجتمعية',
      icon: 'shield',
      description: 'Democratic resilience, electoral integrity, public accountability, civic participation, anti-corruption, and youth policy influence.',
      descriptionAr: 'مرونة الديمقراطية، نزاهة الانتخابات، المساءلة المجتمعية، المشاركة المدنية، مكافحة الفساد، وتأثير الشباب في السياسات.',
      subTopics: [
        'Lowering the Voting Age to 16 in Democracies',
        'Institutional Resilience Against Populist Surges',
        'Digital Voting Systems & Cybersecurity Safeguards',
        'Anti-Corruption Mechanisms in Public Procurement',
        'Youth Quotas in National Parliaments'
      ],
      subTopicsAr: [
        'خفض سن الاقتراع إلى 16 عاماً في الدول الديمقراطية',
        'حصانة المؤسسات الدستورية في مواجهة الشعبوية',
        'التصويت الرقمي وضمانات الأمن السيبراني',
        'آليات النزاهة ومكافحة الفساد في العقود الحكومية',
        'تخصيص مقاعد للشباب (الكوتا) في البرلمانات'
      ]
    },
    {
      id: 'human-rights',
      name: 'Human Rights & Social Justice',
      nameAr: 'حقوق الإنسان والعدالة الاجتماعية',
      icon: 'heart',
      description: 'Universal civil liberties, refugee protections, gender equality, criminal justice reform, and combating systemic discrimination.',
      descriptionAr: 'الحريات المدنية الشاملة، حماية اللاجئين، المساواة الجندرية، إصلاح منظومة العدالة، ومكافحة كافة أشكال التمييز.',
      subTopics: [
        'Refugee Protection & Non-Refoulement Law',
        'Gender Pay Disparity & Leadership Representation',
        'Restorative Justice vs Retributive Incarceration',
        'Indigenous Land Rights & Cultural Sovereignty',
        'Universal Freedom of Expression vs Online Hate Speech'
      ],
      subTopicsAr: [
        'حماية اللاجئين وحظر الإعادة القسرية في القانون الدولي',
        'فجوة الأجور الجندرية وتمثيل المرأة في القيادة',
        'العدالة التصالحية كبديل للعقوبات الحبسية التقليدية',
        'حقوق الشعوب الأصلية والسيادة على الأراضي',
        'حرية التعبير الفكري في مواجهة خطاب الكراهية'
      ]
    },
    {
      id: 'global-health',
      name: 'Global Health & Bioethics',
      nameAr: 'الصحة العالمية والأخلاقيات الحيوية',
      icon: 'activity',
      description: 'Pandemic preparedness treaties, youth mental health crises, equitable healthcare access, genetic technologies, and bioethics.',
      descriptionAr: 'معاهدات الجاهزية للأوبئة، أزمة الصحة النفسية لدى الشباب، عدالة الخدمات الصحية، التقنيات الجينية، والأخلاقيات الحيوية.',
      subTopics: [
        'Youth Mental Health Crises in Digital Societies',
        'Patent Waivers for Essential Vaccines & Therapeutics',
        'Gene Editing (CRISPR) & Human Enhancement Ethics',
        'Healthcare as a Fundamental Human Right',
        'Antimicrobial Resistance & Public Health Safeguards'
      ],
      subTopicsAr: [
        'أزمة الصحة النفسية لدى اليافعين في المجتمعات الرقمية',
        'إسقاط براءات الاختراع عن اللقاحات والأدوية المنقذة',
        'التعديل الجيني وأخلاقيات تحسين الصفات الوراثية',
        'الرعاية الصحية الشاملة كحق إنساني أصيل',
        'مقاومة مضادات الميكروبات وحماية الصحة العامة'
      ]
    },
    {
      id: 'peace-security',
      name: 'Peace, Security & Conflict Resolution',
      nameAr: 'السلام والأمن وفض النزاعات',
      icon: 'anchor',
      description: 'Demilitarization, youth involvement in peace processes, humanitarian law during conflicts, post-war reconstruction, and cyber security.',
      descriptionAr: 'نزع السلاح، إشراك الشباب في صناعة السلام، تطبيق القانون الإنساني أثناء النزاعات، وإعادة الإعمار.',
      subTopics: [
        'Youth, Peace & Security Framework (UNSCR 2250)',
        'Nuclear Non-Proliferation & Disarmament Verification',
        'Cyberwarfare & State-Sponsored Digital Attacks',
        'Civilian Protection Mechanisms in Urban Warfare',
        'Community Restorative Dialogue Post-Conflict'
      ],
      subTopicsAr: [
        'أجندة الشباب والسلام والأمن (قرار مجلس الأمن 2250)',
        'معاهدات الحد من الانتشار النووي وآليات التفتيش',
        'الحروب السيبرانية والهجمات الرقمية بين الدول',
        'آليات حماية المدنيين في مناطق النزاعات الحضرية',
        'الحوار المجتمعي التصالحي وإعادة بناء النسيج الوطني'
      ]
    },
    {
      id: 'culture',
      name: 'Culture, Media & Global Identity',
      nameAr: 'الثقافة والإعلام والهوية',
      icon: 'users',
      description: 'Cultural preservation in a globalized world, language revitalization, media independence, cross-border youth dialogue, and heritage ethics.',
      descriptionAr: 'صون التراث في عصر العولمة، حماية اللغات، استقلالية وسائل الإعلام، الحوار الشبابي العابر للحدود، وأخلاقيات التراث.',
      subTopics: [
        'Preservation of Endangered Indigenous Languages',
        'Repatriation of Historical Artifacts in Global Museums',
        'Cultural Exchange vs Commercial Appropriation',
        'Media Monopolies & Independent Investigative Journalism',
        'Youth Identity Construction in Multicultural Metropolises'
      ],
      subTopicsAr: [
        'صون اللغات المهددة بالاندثار والتعدد اللغوي',
        'استعادة القطع الأثرية التاريخية إلى مواطنها الأصلية',
        'التبادل الثقافي الإيجابي مقابل الاستلاب التجاري',
        'احتكار وسائل الإعلام وحماية الصحافة الاستقصائية',
        'تشكل هوية الشباب في الحواضر متعددة الثقافات'
      ]
    },
    {
      id: 'youth-civic',
      name: 'Youth Leadership, Civic Space & Political Voice',
      nameAr: 'القيادة الشبابية والمجال المدني والمشاركة السياسية',
      icon: 'mic',
      description: 'Institutional youth engagement, parliamentary age minimums, civic freedoms, digital activism, and democratic policy co-creation.',
      descriptionAr: 'المشاركة الشبابية المؤسسية، خفض سن الترشح البرلماني، الحريات المدنية، النشاط الرقمي، وصناعة السياسات التشاركية.',
      subTopics: [
        'Institutional Barriers to Youth Political Candidacy',
        'Civic Digital Mobilization vs State Regulation',
        'Youth Representation in Climate & Trade Delegations',
        'Protecting Student Activism & Academic Freedom',
        'Bridging Intergenerational Gaps in Public Policy'
      ],
      subTopicsAr: [
        'العوائق المؤسسية أمام ترشح الشباب للمناصب السياسية',
        'الحراك المدني الرقمي في مواجهة التشريعات الرقابية',
        'تمثيل الشباب في وفود مفاوضات المناخ والتجارة الدولية',
        'حماية الحراك الطلابي الجامعي والحرية الأكاديمية',
        'ردم الفجوة بين الأجيال في رسم السياسات العامة'
      ]
    },
    {
      id: 'international-law',
      name: 'International Law, Sovereignty & War Crimes Accountability',
      nameAr: 'القانون الدولي والسيادة والمساءلة عن جرائم الحرب',
      icon: 'scale',
      description: 'Enforcement of ICJ rulings, universal jurisdiction, state sovereignty vs humanitarian intervention, and maritime boundary disputes.',
      descriptionAr: 'إنفاذ قرارات محكمة العدل الدولية، الولاية القضائية العالمية، السيادة مقابل التدخل الإنساني، ونزاعات الحدود البحرية.',
      subTopics: [
        'Enforceability of International Court of Justice (ICJ) Rulings',
        'Universal Jurisdiction in Prosecuting Transnational War Crimes',
        'Sovereignty vs Humanitarian Intervention (R2P Framework)',
        'Legal Status of Non-State Actors in Modern Conflicts',
        'Maritime Boundaries & Exclusive Economic Zone (EEZ) Disputes'
      ],
      subTopicsAr: [
        'إلزامية قرارات وأحكام محكمة العدل الدولية وآليات الإنفاذ',
        'الولاية القضائية العالمية في ملاحقة مرتكبي جرائم الحرب',
        'السيادة الوطنية مقابل مبدأ التدخل الإنساني (مسؤولية الحماية)',
        'الوضع القانوني للجهات الفاعلة من غير الدول في النزاعات المعاصرة',
        'ترسيم الحدود البحرية ونزاعات المناطق الاقتصادية الخالصة'
      ]
    },
    {
      id: 'financial-systems',
      name: 'Global Financial Architecture, Sovereign Debt & Currency Systems',
      nameAr: 'الهندسة المالية العالمية والديون السيادية والأنظمة النقدية',
      icon: 'coins',
      description: 'Developing country debt restructuring, Bretton Woods reform, de-dollarization trends, illicit capital outflows, and food price stability.',
      descriptionAr: 'إعادة هيكلة الديون السيادية، إصلاح مؤسسات بريتون وودز، اتجاهات التبادل التجاري البديل، والشفافية المالية الدولية.',
      subTopics: [
        'Sovereign Debt Restructuring for Developing Economies',
        'Bretton Woods Institutions (IMF/World Bank) Reform',
        'De-Dollarization Trends & Bilateral Trade Currencies',
        'Tax Havens, Illicit Capital Outflows & Wealth Transparency',
        'Financial Speculation & Food Commodity Price Volatility'
      ],
      subTopicsAr: [
        'إعادة هيكلة الديون السيادية للدول النامية وتخفيف الأعباء',
        'إصلاح مؤسسات بريتون وودز (صندوق النقد والبنك الدولي)',
        'اتجاهات تقليص الاعتماد على الدولار في التبادلات الثنائية',
        'الملاذات الضريبية وتهريب رؤوس الأموال والشفافية المالية',
        'المضاربات المالية وتقلبات أسعار السلع الغذائية الأساسية'
      ]
    },
    {
      id: 'bioethics-future',
      name: 'Genomics, Transhumanism & Scientific Bioethics',
      nameAr: 'علم الجينوم وما بعد الإنسانية والأخلاقيات الحيوية',
      icon: 'dna',
      description: 'CRISPR germline modification, brain-computer interfaces, artificial reproductive tech, unequal longevity biotech, and dual-use oversight.',
      descriptionAr: 'التعديل الجيني للنطاف والأجنة، واجهات الدماغ والحاسوب، تقنيات الأرحام الاصطناعية، وعدالة الوصول للتكنولوجيا الحيوية.',
      subTopics: [
        'Germline Gene Editing (CRISPR) & Designer Offspring Ethics',
        'Brain-Computer Interfaces & Cognitive Privacy Rights',
        'Artificial Womb Technology & Ethical Reproductive Horizons',
        'Access Inequality to Life-Extension & Longevity Biotech',
        'Biolabs Safety Standards & Dual-Use Research Oversight'
      ],
      subTopicsAr: [
        'التعديل الجيني للنطاف والأجنة وأخلاقيات تحسين السلالة',
        'واجهات الدماغ والحاسوب وحماية الخصوصية المعرفية للإنسان',
        'تقنيات الأرحام الاصطناعية والآفاق الأخلاقية للتناسل',
        'تفاوت الوصول إلى تقنيات إطالة العمر والتكنولوجيا الحيوية',
        'معايير السلامة في المختبرات البيولوجية وأبحاث الاستخدام المزدوج'
      ]
    },
    {
      id: 'space-frontiers',
      name: 'Space Frontiers, Lunar Treaties & Celestial Demilitarization',
      nameAr: 'آفاق الفضاء ومعاهدات القمر ونزع السلاح المداري',
      icon: 'rocket',
      description: '1967 Outer Space Treaty modernization, asteroid mining property rights, space debris liability, and satellite orbit demilitarization.',
      descriptionAr: 'تحديث معاهدة الفضاء الخارجي، حقوق التعدين القمري والكويكبات، معالجة الحطام الفضائي، ومنع عسكرة المدارات.',
      subTopics: [
        'Revising the 1967 Outer Space Treaty for Private Commerce',
        'Property Rights & Mining Claims on Asteroids and the Moon',
        'Orbital Debris Mitigation & Shared Atmospheric Responsibility',
        'Preventing the Weaponization & Demilitarization of Earth Orbit',
        'Equitable Global South Access to Satellite Communication Slots'
      ],
      subTopicsAr: [
        'تحديث معاهدة الفضاء الخارجي لعام 1967 لاستيعاب الشركات الخاصة',
        'حقوق الملكية وتعدين الموارد على القمر والكويكبات',
        'معالجة مشكلة الحطام الفضائي والمسؤولية المدارية المشتركة',
        'منع عسكرة الفضاء الخارجي والمدارات الأرضية',
        'عدالة وصول دول الجنوب العالمي إلى مدارات الأقمار الاصطناعية'
      ]
    },
    {
      id: 'information-truth',
      name: 'Information Warfare, Deepfakes & Freedom of the Press',
      nameAr: 'حروب المعلومات والتزييف العميق وحرية الصحافة',
      icon: 'radio',
      description: 'State-sponsored disinformation, watermarking generative synthetic media, journalist protection, and online echo chamber regulation.',
      descriptionAr: 'حملات التضليل الممنهجة، العلامات المائية للوسائط التوليدية، حماية الصحفيين، وتنظيم غرف الصدى الخوارزمية.',
      subTopics: [
        'State-Sponsored Disinformation in Democratic Elections',
        'Watermarking Generative Synthetic Media & News Integrity',
        'Protection of Investigative Journalists in Hostile Zones',
        'Algorithmic Echo Chambers & Social Polarization Dynamics',
        'National Security Censorship vs The Public\'s Right to Know'
      ],
      subTopicsAr: [
        'حملات التضليل الممنهجة وتأثيرها على الانتخابات الديمقراطية',
        'إلزامية العلامات المائية للوسائط الاصطناعية ونزاهة الأخبار',
        'حماية الصحفيين الاستقصائيين في مناطق النزاعات والتوتر',
        'غرف الصدى الخوارزمية وتعميق الاستقطاب المجتمعي',
        'الرقابة بذريعة الأمن القومي مقابل حق الجمهور في المعرفة'
      ]
    },
    {
      id: 'migration-displacement',
      name: 'Global Migration, Refugees & Statelessness',
      nameAr: 'الهجرة العالمية واللاجئون وحالات انعدام الجنسية',
      icon: 'compass',
      description: 'Climate migration frameworks, safe transit corridors, asylum jurisprudence, stateless populations, and xenophobia deterrence.',
      descriptionAr: 'أطر الهجرة المناخية، ممرات العبور الآمنة، فقه وقوانين اللجوء، مجتمعات البدون، ومكافحة الخطابات المعادية للأجانب.',
      subTopics: [
        'Climate-Induced Displacement & Legal Status of Climate Refugees',
        'Asylum Backlogs & Third-Country Border Externalization Accords',
        'Statelessness Eradication & Universal Right to Legal Identity',
        'Socioeconomic Integration of Displaced Youth in Host Economies',
        'Protection of Unaccompanied Minor Migrants in Transit Corridors'
      ],
      subTopicsAr: [
        'النزوح القسري بفعل تغير المناخ والاعتراف القانوني باللاجئ المناخي',
        'تراكم طلبات اللجوء وتصدير إدارة الحدود إلى دول ثالثة',
        'إنهاء حالات انعدام الجنسية وحق كل إنسان في الهوية القانونية',
        'الإدماج الاقتصادي والاجتماعي للشباب النازحين في المجتمعات المضيفة',
        'حماية الأطفال واليافعين غير المصحوبين في ممرات اللجوء الإنساني'
      ]
    },
    {
      id: 'food-water-security',
      name: 'Food Sovereignty, Water Justice & Agritech',
      nameAr: 'السيادة الغذائية والعدالة المائية والتكنولوجيا الزراعية',
      icon: 'droplet',
      description: 'Transboundary river diplomacy, corporate seed monopolies vs indigenous cultivars, vertical agritech, and famine prevention.',
      descriptionAr: 'دبلوماسية الأنهار والمياه العابرة للحدود، احتكارات البذور مقابل السيادة الزراعية، المزارع الرأسية، وحماية سلاسل الإمداد.',
      subTopics: [
        'Transboundary Aquifer & River Basin Riparian Accords',
        'Corporate Seed Patenting vs Indigenous Farming Sovereignty',
        'Climate-Resilient Agritech & Desalination Energy Costs',
        'Conflict-Driven Famine & Humanitarian Food Corridors',
        'Groundwater Depletion & Water as an Inalienable Public Good'
      ],
      subTopicsAr: [
        'الاتفاقيات الدولية المشتركة لأحواض الأنهار والمياه الجوفية العابرة للحدود',
        'براءات اختراع البذور للشركات الكبرى في مواجهة سيادة المزارعين التقليديين',
        'التكنولوجيا الزراعية المقاومة للمناخ وتكاليف طاقة تحلية المياه',
        'المجاعات الناجمة عن النزاعات المسلحة وحماية الممرات الإنسانية للإغاثة',
        'استنزاف المياه الجوفية والاعتراف بالمياه كحق إنساني غير قابل للخصخصة'
      ]
    },
    {
      id: 'indigenous-decolonization',
      name: 'Indigenous Rights, Decolonization & Epistemic Justice',
      nameAr: 'حقوق الشعوب الأصلية وتفكيك الاستعمار والعدالة المعرفية',
      icon: 'feather',
      description: 'Free Prior and Informed Consent (FPIC), cultural artifact repatriation, language preservation, and indigenous ecological stewardship.',
      descriptionAr: 'الموافقة المسبقة والواعية والحرة، استعادة الآثار المنهوبة، صون اللغات المهددة، والإدارة البيئية التقليدية للأراضي.',
      subTopics: [
        'Free, Prior, and Informed Consent (FPIC) in Extractive Megaprojects',
        'Repatriation of Stolen Ancestral Antiquities in Western Museums',
        'Decolonizing Higher Education Curricula & Epistemic Pluralism',
        'Indigenous Land Back Movements & Biodiversity Preservation',
        'Revitalizing Endangered Indigenous Dialects in Youth Education'
      ],
      subTopicsAr: [
        'الموافقة الحرة والمسبقة والمستنيرة في المشاريع التعدينية الاستخراجية',
        'استعادة الآثار والكنوز الحضارية المنهوبة من المتاحف الاستعمارية',
        'تفكيك رواسب الاستعمار في المناهج الجامعية وإرساء التعددية المعرفية',
        'حركات استرداد الأراضي للشعوب الأصلية ودورها في حماية التنوع البيولوجي',
        'إحياء اللغات واللهجات الأصلية المهددة بالاندثار في التعليم الشبابي'
      ]
    },
    {
      id: 'gender-inclusion',
      name: 'Gender Equality, Care Economy & Inclusive Policy',
      nameAr: 'المساواة الجندرية واقتصاد الرعاية والسياسات الشاملة',
      icon: 'heart',
      description: 'Gender pay parity, political leadership quotas, recognizing unpaid care work, reproductive rights, and combating gendered violence.',
      descriptionAr: 'تقليص فجوة الأجور، الكوتا النسائية في القيادة، تثمين أعمال الرعاية الأسرية، والرعاية الصحية، ومناهضة العنف.',
      subTopics: [
        'Closing the Transnational Gender Pay Gap in High-Skill Sectors',
        'Institutional Quotas for Young Women in Parliaments & Cabinets',
        'Formal Economic Valuation of Unpaid Domestic & Eldercare Work',
        'Legal Accountability Frameworks for Digital Harassment & Gender Slander',
        'Parental Leave Parity & Breaking Workplace Caregiver Penalties'
      ],
      subTopicsAr: [
        'سد فجوة الأجور بين الجنسين في القطاعات التقنية والمهنية المتقدمة',
        'نظام الكوتا المؤسسية لتمكين الشابات في المجالس النيابية والوزارية',
        'التقدير الاقتصادي والمحاسبي لأعمال الرعاية المنزلية غير مدفوعة الأجر',
        'الأطر القانونية الرادعة للمضايقات الرقمية والعنف الإلكتروني المستهدف',
        'تكافؤ إجازات الوالدية وإنهاء التمييز الوظيفي ضد مقدمي الرعاية'
      ]
    },
    {
      id: 'disarmament-security',
      name: 'Disarmament, Nuclear Non-Proliferation & Demilitarization',
      nameAr: 'نزع السلاح وحظر الانتشار النووي وإنهاء العسكرة',
      icon: 'crosshair',
      description: 'Universalization of the TPNW, hypersonic missile treaties, illicit small-arms trafficking, and preventing weaponization of civil police.',
      descriptionAr: 'تعميم معاهدة حظر الأسلحة النووية، تنظيم الأسلحة فرط الصوتية، مكافحة تهريب الأسلحة الخفيفة، ومنع عسكرة الأجهزة الأمنية.',
      subTopics: [
        'Treaty on the Prohibition of Nuclear Weapons (TPNW) Ratification',
        'Hypersonic Delivery Systems & Strategic Deterrence Instability',
        'Stemming Illicit Small Arms & Light Weapons in Regional Conflicts',
        'Demilitarization of Metropolitan Law Enforcement Agencies',
        'Strengthening Verification Protocols for the Biological Weapons Convention'
      ],
      subTopicsAr: [
        'تصديق القوى النووية على معاهدة حظر الأسلحة النووية (TPNW)',
        'منظومات الصواريخ فرط الصوتية وتزعزع استقرار الردع الاستراتيجي',
        'تجفيف منابع تجارة وتهريب الأسلحة الصغيرة والخفيفة في بؤر النزاع',
        'إنهاء عسكرة قوات الشرطة المدنية والحفاظ على حريات الفضاء العام',
        'تشديد بروتوكولات التفتيش والتحقق الخاصة باتفاقية الأسلحة البيولوجية'
      ]
    },
    {
      id: 'mental-health-wellbeing',
      name: 'Mental Health, Digital Wellbeing & Neurodiversity',
      nameAr: 'الصحة النفسية والرفاه الرقمي والتنوع العصبي',
      icon: 'smile',
      description: 'Youth mental healthcare access, social media algorithmic addiction, workplace burnout, neurodiversity advocacy, and psychiatric parity.',
      descriptionAr: 'إتاحة خدمات الصحة النفسية للشباب، إدمان خوارزميات المنصات، متلازمة الإرهاق الوظيفي، واستيعاب التنوع العصبي.',
      subTopics: [
        'Algorithmic Attention Engineering & Adolescent Anxiety Crises',
        'Equal Parity for Mental Health in Universal Public Coverage',
        'Implementing the 4-Day Workweek Against Modern Youth Burnout',
        'Neuroinclusive Educational Pedagogy & Workplace Accommodations',
        'Decriminalization of Mental Distress & Community Crisis Response'
      ],
      subTopicsAr: [
        'هندسة الانتباه الخوارزمية وعلاقتها بارتفاع معدلات القلق لدى المراهقين',
        'المساواة التامة بين العلاج النفسي والجسدي في التأمين الصحي الشامل',
        'تطبيق نظام أسبوع العمل من 4 أيام لمواجهة الإرهاق والاحتراق المهني',
        'تهيئة المناهج وبيئات العمل لاستيعاب الأفراد ذوي التنوع العصبي',
        'إلغاء تجريم الأزمات النفسية وتأسيس فرق استجابة مجتمعية متخصصة'
      ]
    },
    {
      id: 'digital-sovereignty',
      name: 'Digital Sovereignty, Cyber Resilience & Internet Freedom',
      nameAr: 'السيادة الرقمية والمرونة السيبرانية وحرية الإنترنت',
      icon: 'wifi',
      description: 'National data autonomy, cloud infrastructure monopolies, cybersecurity of critical grids, quantum cryptography, and the open web.',
      descriptionAr: 'السيادة الوطنية على البيانات، احتكارات السحابة الحاسوبية، أمن شبكات الطاقة والمياه، والتشفير المقاوم للحوسبة الكمومية.',
      subTopics: [
        'Data Localization Laws vs Transnational Open Cloud Infrastructure',
        'Protecting Civil Energy Grids & Hospitals from State Cyber Sabotage',
        'Ensuring Open-Source Public Digital Rails vs Big Tech Monopolies',
        'Post-Quantum Cryptography Transition for Global Financial Rails',
        'Universal Internet Access as an Enforceable Human Utility'
      ],
      subTopicsAr: [
        'قوانين توطين البيانات في مواجهة البنى التحتية السحابية العالمية المفتوحة',
        'تحصين شبكات الطاقة والمستشفيات من هجمات التخريب السيبراني الدولية',
        'بناء منصات رقمية عامة ومفتوحة المصدر لكسر هيمنة كبرى شركات التقنية',
        'التحول نحو خوارزميات التشفير ما بعد الكمي لحماية النظام المالي',
        'اعتبار سرعات الإنترنت الفائقة خدمة عامة أساسية وحقاً غير قابل للحجب'
      ]
    },
    {
      id: 'urbanization-housing',
      name: 'Urbanization, 15-Minute Cities & Affordable Housing',
      nameAr: 'التحضر ومدن الـ 15 دقيقة والعدالة السكنية',
      icon: 'home',
      description: 'Youth housing affordability, pedestrianized 15-minute neighborhoods, transit justice, slum upgrading, and climate-resilient architecture.',
      descriptionAr: 'أزمة الإسكان الميسر للشباب، أحياء الـ 15 دقيقة المخصصة للمشاة، عدالة النقل العام، وتطوير التجمعات السكنية لمقاومة المناخ.',
      subTopics: [
        'Institutional Speculation Bans & Affordable Housing Caps for Youth',
        '15-Minute City Urban Planning & Pedestrianized Mobility Transit',
        'Formalization & Climate Weatherproofing of Informal Settlements',
        'Biophilic Urban Design, Heat-Island Mitigation & Green Canopy Quotas',
        'Public Transportation Fare Abolition as an Ecological Equalizer'
      ],
      subTopicsAr: [
        'حظر المضاربات العقارية ووضع سقوف سعرية لإسكان الشباب الميسر',
        'تخطيط مدن الـ 15 دقيقة وتعزيز النقل النظيف وشبكات المشاة والدراجات',
        'تثبيت الملكيات وتحصين التجمعات الحضرية العشوائية ضد الكوارث المناخية',
        'التصميم العمراني البيئي والتشجير الكثيف لخفض الجزر الحرارية في المدن',
        'مجانية النقل العام كوسيلة فعالة للعدالة الاجتماعية وخفض الانبعاثات'
      ]
    }
  ],

  topics: [],

  topicBank: [
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
  ],

  sessions: [],

  writings: [],

  feedback: [],

  applications: [],

  presenterApplications: [],

  announcements: [],

  notifications: [],

  countryReps: [],

  mediaKits: [],

  presentations: []

};

// Data Management Service
class DataService {
  constructor() {
    this.db = this.loadDatabase();
  }

  loadDatabase() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Phase 2 backward compatibility - ensure new collections exist
        if (!parsed.notifications || parsed.notifications.length === 0) {
          parsed.notifications = INITIAL_DATABASE.notifications;
        }
        if (!parsed.countryReps || parsed.countryReps.length === 0) {
          parsed.countryReps = INITIAL_DATABASE.countryReps;
        }
        if (!parsed.mediaKits || parsed.mediaKits.length === 0) {
          parsed.mediaKits = INITIAL_DATABASE.mediaKits;
        }
        // Sync all categories from INITIAL_DATABASE to ensure all 16 exist with subtopics
        if (parsed.categories) {
          INITIAL_DATABASE.categories.forEach(initC => {
            const existing = parsed.categories.find(c => c.id === initC.id);
            if (!existing) {
              parsed.categories.push(initC);
            } else {
              existing.name = initC.name;
              existing.nameAr = initC.nameAr;
              existing.icon = initC.icon;
              existing.description = initC.description;
              existing.descriptionAr = initC.descriptionAr;
              existing.subTopics = initC.subTopics;
              existing.subTopicsAr = initC.subTopicsAr;
            }
          });
        } else {
          parsed.categories = INITIAL_DATABASE.categories;
        }

        // Sync all topics from INITIAL_DATABASE
        if (parsed.topics) {
          INITIAL_DATABASE.topics.forEach(initT => {
            const existing = parsed.topics.find(t => t.id === initT.id);
            if (!existing) parsed.topics.push(initT);
          });
        } else {
          parsed.topics = INITIAL_DATABASE.topics;
        }

        // Sync all sessions from INITIAL_DATABASE to ensure upcoming sessions exist
        if (parsed.sessions) {
          INITIAL_DATABASE.sessions.forEach(initS => {
            const existing = parsed.sessions.find(s => s.id === initS.id);
            if (!existing) {
              parsed.sessions.push(initS);
            } else {
              if (initS.titleAr && !existing.titleAr) existing.titleAr = initS.titleAr;
              if (initS.formatAr && !existing.formatAr) existing.formatAr = initS.formatAr;
              if (initS.durationAr && !existing.durationAr) existing.durationAr = initS.durationAr;
              if (initS.categoryNameAr && !existing.categoryNameAr) existing.categoryNameAr = initS.categoryNameAr;
              if (initS.descriptionAr && !existing.descriptionAr) existing.descriptionAr = initS.descriptionAr;
              if (initS.speakers && !existing.speakers) existing.speakers = initS.speakers;
              if (initS.moderator && !existing.moderator) existing.moderator = initS.moderator;
              if (initS.sessionCategory && !existing.sessionCategory) existing.sessionCategory = initS.sessionCategory;
              if (initS.guestName && !existing.guestName) existing.guestName = initS.guestName;
              if (initS.guestPhoto && !existing.guestPhoto) existing.guestPhoto = initS.guestPhoto;
              if (initS.guestBio && !existing.guestBio) existing.guestBio = initS.guestBio;
              if (initS.debateMotion && !existing.debateMotion) existing.debateMotion = initS.debateMotion;
              if (initS.propositionTeam && !existing.propositionTeam) existing.propositionTeam = initS.propositionTeam;
              if (initS.oppositionTeam && !existing.oppositionTeam) existing.oppositionTeam = initS.oppositionTeam;
              if (initS.adjudicator && !existing.adjudicator) existing.adjudicator = initS.adjudicator;
              if (initS.presenter && !existing.presenter) existing.presenter = initS.presenter;
              if (initS.keySpeakers && !existing.keySpeakers) existing.keySpeakers = initS.keySpeakers;
              if (initS.discussionQuestions && !existing.discussionQuestions) existing.discussionQuestions = initS.discussionQuestions;
              if (initS.roundtableChair && !existing.roundtableChair) existing.roundtableChair = initS.roundtableChair;
              if (initS.workingDraftTitle && !existing.workingDraftTitle) existing.workingDraftTitle = initS.workingDraftTitle;
              if (initS.roundtableFocus && !existing.roundtableFocus) existing.roundtableFocus = initS.roundtableFocus;
            }
          });
        } else {
          parsed.sessions = INITIAL_DATABASE.sessions;
        }
        // Sync all applications from INITIAL_DATABASE to ensure pending proposals exist
        if (!parsed.applications || !Array.isArray(parsed.applications) || parsed.applications.length === 0) {
          parsed.applications = JSON.parse(JSON.stringify(INITIAL_DATABASE.applications || []));
        } else {
          INITIAL_DATABASE.applications.forEach(initA => {
            const exists = parsed.applications.some(a => a.email && a.email.toLowerCase() === initA.email.toLowerCase());
            if (!exists) parsed.applications.push(JSON.parse(JSON.stringify(initA)));
          });
        }

        if (parsed.countryReps) {
          parsed.countryReps.forEach(r => {
            const initR = INITIAL_DATABASE.countryReps.find(ir => ir.id === r.id);
            if (initR && initR.chapterNameAr && !r.chapterNameAr) r.chapterNameAr = initR.chapterNameAr;
            if (initR && initR.repNameAr && !r.repNameAr) r.repNameAr = initR.repNameAr;
            if (initR && initR.isdcTeamAr && !r.isdcTeamAr) r.isdcTeamAr = initR.isdcTeamAr;
            if (initR && initR.bioAr && !r.bioAr) r.bioAr = initR.bioAr;
          });
        }
        if (!parsed.topicBank || !parsed.topicBank.length) {
          parsed.topicBank = JSON.parse(JSON.stringify(INITIAL_DATABASE.topicBank || []));
        }
        if (!parsed.presentations || !parsed.presentations.length) {
          parsed.presentations = JSON.parse(JSON.stringify(INITIAL_DATABASE.presentations || []));
        }
        if (!parsed.presenterApplications || !parsed.presenterApplications.length) {
          parsed.presenterApplications = JSON.parse(JSON.stringify(INITIAL_DATABASE.presenterApplications || []));
        }
        // Clean up any legacy localStorage database versions
        try {
          ['gyd_platform_db', 'gyd_platform_db_v2', 'gyd_platform_db_v3', 'gyd_platform_db_v4'].forEach(k => localStorage.removeItem(k));
        } catch (e) {}

        const legacyDemoEmails = [
          'coordinator@gyd.org', 'presenter@gyd.org', 'member@gyd.org',
          'amara.chen@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org',
          'sagiasaasadien@gmail.com', 'ranaalo.644@gmail.com',
          'sumeyye.bulut@stu.ihu.edu.tr', 'himaworking@gmail.com',
          'farhan.n@outlook.com', 'elena.rostova@debate.sg',
          'sarah.vandijk@edu.nl', 'amina.kuwari@youth.qa', 'kofi.mensah@ug.edu.gh'
        ];

        // Load deleted emails tombstones
        let deletedEmails = Array.isArray(parsed.deletedUserEmails) ? parsed.deletedUserEmails : [];
        try {
          const localDel = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
          if (Array.isArray(localDel)) {
            localDel.forEach(e => {
              const cl = (e || '').toLowerCase().trim();
              if (cl && !deletedEmails.includes(cl)) deletedEmails.push(cl);
            });
          }
        } catch (e) {}
        parsed.deletedUserEmails = deletedEmails;

        // Clean users: retain ONLY active non-deleted official accounts, never demo accounts
        if (Array.isArray(parsed.users)) {
          parsed.users = parsed.users.filter(u => {
            const em = (u.email || '').toLowerCase().trim();
            if (em === '3681mubashircp@gmail.com' || u.id === 'usr_admin_mubashir') return true;
            if (deletedEmails.includes(em)) return false;
            if (legacyDemoEmails.includes(em)) return false;
            return true;
          });
        } else {
          parsed.users = [];
        }

        // Strictly enforce primary administrator credentials
        let adminUser = parsed.users.find(u => u.id === 'usr_admin_mubashir' || (u.email && u.email.toLowerCase().trim() === '3681mubashircp@gmail.com'));
        if (!adminUser) {
          adminUser = JSON.parse(JSON.stringify(INITIAL_DATABASE.users[0]));
          parsed.users.unshift(adminUser);
        } else {
          adminUser.name = 'Mubashir CP';
          adminUser.email = '3681mubashircp@gmail.com';
          adminUser.password = '368136';
          adminUser.role = 'Coordinator';
          adminUser.status = 'active';
        }

        // Clean applications: remove demo applications and deleted members
        if (Array.isArray(parsed.applications)) {
          parsed.applications = parsed.applications.filter(a => {
            const em = (a.email || '').toLowerCase().trim();
            if (a.status === 'Deleted') return false;
            if (deletedEmails.includes(em)) return false;
            if (legacyDemoEmails.includes(em)) return false;
            return true;
          });
        } else {
          parsed.applications = [];
        }

        // Clean presenter applications
        if (Array.isArray(parsed.presenterApplications)) {
          parsed.presenterApplications = parsed.presenterApplications.filter(a => {
            const em = (a.email || '').toLowerCase().trim();
            if (a.status === 'Deleted') return false;
            if (deletedEmails.includes(em)) return false;
            if (legacyDemoEmails.includes(em)) return false;
            return true;
          });
        } else {
          parsed.presenterApplications = [];
        }

        // Synchronize community users
        this.syncCommunityUsers(parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial seed data.', e);
    }
    this.saveDatabase(INITIAL_DATABASE);
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }

  saveDatabase(data = this.db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.db = data;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  resetToDefault() {
    try {
      localStorage.removeItem('gyd_trial_data_deleted');
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('gyd_otp_session');
      localStorage.removeItem('gyd_user_votes');
      localStorage.removeItem('gyd_ballot_votes');
      localStorage.removeItem('gyd_pending_registration');
      localStorage.removeItem('gyd_applied_email');
      localStorage.removeItem('gyd_deleted_community_emails');
    } catch (e) {}
    this.db = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.syncCommunityUsers();
    this.saveDatabase();
    return this.db;
  }

  clearTrialData(mode = 'all') {
    try {
      localStorage.setItem('gyd_trial_data_deleted', 'true');
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('gyd_otp_session');
      localStorage.removeItem('gyd_user_votes');
      localStorage.removeItem('gyd_ballot_votes');
      localStorage.removeItem('gyd_pending_registration');
      localStorage.removeItem('gyd_applied_email');
      localStorage.removeItem('gyd_deleted_community_emails');
    } catch (e) {}

    // Reset database: preserve ONLY the Chief Administrator account
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

    this.db = {
      users: [adminUser],
      applications: [],
      presenterApplications: [],
      announcements: [],
      notifications: [],
      countryReps: JSON.parse(JSON.stringify(INITIAL_DATABASE.countryReps || [])),
      mediaKits: JSON.parse(JSON.stringify(INITIAL_DATABASE.mediaKits || [])),
      presentations: [],
      sessions: [],
      writings: [],
      topics: [],
      topicBank: JSON.parse(JSON.stringify(INITIAL_DATABASE.topicBank || [])),
      categories: JSON.parse(JSON.stringify(INITIAL_DATABASE.categories || [])),
      feedback: [],
      deletedUserEmails: []
    };

    this.saveDatabase();

    // Immediately purge applications on backend server API
    try {
      const apiUrl = this.getApplicationsApiUrl();
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearTrialData' })
      }).catch(err => console.warn('Could not sync clearTrialData to API:', err));
    } catch (e) {}

    return true;
  }

  // Synchronize registered members, presenters, and coordinators from the database
  syncCommunityUsers(targetDb = this.db) {
    if (!targetDb) return;
    if (!Array.isArray(targetDb.users)) {
      targetDb.users = [];
    }

    const isTrialDeleted = (function() {
      try { return localStorage.getItem('gyd_trial_data_deleted') === 'true'; } catch (e) { return false; }
    })();

    // Load persistent deleted emails tombstone
    let deletedEmails = Array.isArray(targetDb.deletedUserEmails) ? targetDb.deletedUserEmails : [];
    try {
      const localDeleted = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
      if (Array.isArray(localDeleted)) {
        localDeleted.forEach(em => {
          const clean = (em || '').toLowerCase().trim();
          if (clean && !deletedEmails.includes(clean)) deletedEmails.push(clean);
        });
      }
    } catch (e) {}
    targetDb.deletedUserEmails = deletedEmails;

    const demoMockEmails = [
      'member@gyd.org', 'presenter@gyd.org', 'coordinator@gyd.org',
      'amara.chen@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org'
    ];

    const seedTrialEmails = [
      'coordinator@gyd.org', 'presenter@gyd.org', 'member@gyd.org',
      'amara.chen@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org',
      'sagiasaasadien@gmail.com', 'ranaalo.644@gmail.com',
      'sumeyye.bulut@stu.ihu.edu.tr', 'himaworking@gmail.com',
      'farhan.n@outlook.com', 'elena.rostova@debate.sg'
    ];

    // Filter out synthetic mock accounts AND explicitly deleted members
    targetDb.users = targetDb.users.filter(u => {
      const em = (u.email || '').toLowerCase().trim();
      if (!em) return true;
      if (demoMockEmails.includes(em)) return false;
      if (deletedEmails.includes(em)) return false;
      if (isTrialDeleted && em !== '3681mubashircp@gmail.com' && seedTrialEmails.includes(em)) return false;
      return true;
    });

    // 1. Ensure all curated users from INITIAL_DATABASE.users exist UNLESS trial data was deleted
    if (!isTrialDeleted && INITIAL_DATABASE && Array.isArray(INITIAL_DATABASE.users)) {
      INITIAL_DATABASE.users.forEach(initU => {
        const cleanEmail = (initU.email || '').toLowerCase().trim();
        if (deletedEmails.includes(cleanEmail)) return; // Exclude deleted members

        const existing = targetDb.users.find(u => (u.email && u.email.toLowerCase().trim() === cleanEmail) || u.id === initU.id);
        if (!existing) {
          targetDb.users.push(JSON.parse(JSON.stringify(initU)));
        } else {
          if (!existing.country) existing.country = initU.country;
          if (!existing.flag) existing.flag = initU.flag;
          if (!existing.bio) existing.bio = initU.bio;
          if (!existing.department) existing.department = initU.department;
          if (initU.id === 'usr_admin_mubashir') {
            existing.role = 'Coordinator';
            existing.password = initU.password;
          }
        }
      });
    } else {
      // Ensure Chief Administrator always exists
      const admin = targetDb.users.find(u => u.id === 'usr_admin_mubashir' || (u.email && u.email.toLowerCase().trim() === '3681mubashircp@gmail.com'));
      if (!admin && INITIAL_DATABASE && Array.isArray(INITIAL_DATABASE.users)) {
        const initAdmin = INITIAL_DATABASE.users.find(u => u.id === 'usr_admin_mubashir' || u.email === '3681mubashircp@gmail.com');
        if (initAdmin) targetDb.users.unshift(JSON.parse(JSON.stringify(initAdmin)));
      }
    }

    // 2. Synchronize from applications (Approved or Registered) UNLESS deleted
    const apps = Array.isArray(targetDb.applications) ? targetDb.applications : (isTrialDeleted ? [] : (INITIAL_DATABASE.applications || []));
    apps.forEach(app => {
      const cleanEmail = (app.email || '').toLowerCase().trim();
      if (!cleanEmail || deletedEmails.includes(cleanEmail)) return; // Exclude deleted members

      const isRegisteredOrApproved = app.status === 'Registered' ||
        app.status === 'Approved' ||
        app.status === 'Approved - Awaiting Registration';

      if (isRegisteredOrApproved) {
        let existingUser = targetDb.users.find(u => u.email && u.email.toLowerCase().trim() === cleanEmail);
        if (!existingUser) {
          const newUser = {
            id: 'usr_' + (app.id ? app.id.replace('app_', '') : Date.now().toString(36)),
            name: app.name,
            email: cleanEmail,
            password: app.password || 'gyde2024',
            role: 'Member',
            department: `Youth Delegation • ${app.country || 'Global'}`,
            country: app.country || 'Global',
            flag: app.flag || 'INT',
            bio: app.motivation || app.debateExperience || `Verified member representing ${app.country || 'Global'}.`,
            interests: Array.isArray(app.interests) && app.interests.length ? app.interests : ['Global Affairs'],
            debateExperience: app.debateExperience || '',
            motivation: app.motivation || '',
            status: 'active',
            joinedDate: app.date || new Date().toISOString().split('T')[0]
          };
          targetDb.users.push(newUser);
        } else {
          existingUser.role = existingUser.role || 'Member';
          existingUser.status = 'active';
          if (app.name && !existingUser.name) existingUser.name = app.name;
          if (app.password && app.password.trim()) existingUser.password = app.password.trim();
          if (!existingUser.country && app.country) existingUser.country = app.country;
          if (!existingUser.flag && app.flag) existingUser.flag = app.flag;
          if (!existingUser.bio && (app.motivation || app.debateExperience)) {
            existingUser.bio = app.motivation || app.debateExperience;
          }
          if ((!existingUser.interests || existingUser.interests.length === 0) && app.interests) {
            existingUser.interests = app.interests;
          }
          if (!existingUser.debateExperience && app.debateExperience) {
            existingUser.debateExperience = app.debateExperience;
          }
          if (!existingUser.motivation && app.motivation) {
            existingUser.motivation = app.motivation;
          }
        }
      }
    });

    // 3. Synchronize from presenter applications (Approved) UNLESS deleted
    const presApps = Array.isArray(targetDb.presenterApplications) ? targetDb.presenterApplications : [];
    presApps.forEach(pApp => {
      const cleanEmail = (pApp.email || '').toLowerCase().trim();
      if (!cleanEmail || deletedEmails.includes(cleanEmail)) return; // Exclude deleted members

      if (pApp.status === 'Approved') {
        let existingUser = targetDb.users.find(u => 
          (pApp.userId && u.id === pApp.userId) || 
          (u.email && u.email.toLowerCase().trim() === cleanEmail)
        );
        if (existingUser) {
          existingUser.role = 'Presenter';
        } else {
          targetDb.users.push({
            id: 'usr_' + (pApp.id ? pApp.id.replace('pres_', '') : Date.now().toString(36)),
            name: pApp.name,
            email: cleanEmail,
            password: 'gyde2024',
            role: 'Presenter',
            department: pApp.institution || `Academic Delegation • ${pApp.country || 'Global'}`,
            country: pApp.country || 'Global',
            flag: pApp.flag || 'INT',
            bio: pApp.bio || pApp.proposedTopic || `Accredited Academic Presenter.`,
            interests: ['Global Affairs', 'Academic Presentations'],
            status: 'active',
            joinedDate: pApp.date || new Date().toISOString().split('T')[0]
          });
        }
      }
    });

    // 4. Deduplicate users by email, preserving the primary admin and valid roles
    const uniqueUsers = [];
    const seenEmails = new Set();
    
    // Always put admin first
    const admin = targetDb.users.find(u => u.id === 'usr_admin_mubashir' || (u.email && u.email.toLowerCase().trim() === '3681mubashircp@gmail.com'));
    if (admin) {
      uniqueUsers.push(admin);
      seenEmails.add(admin.email.toLowerCase().trim());
    }

    targetDb.users.forEach(u => {
      const email = (u.email || '').toLowerCase().trim();
      if (!email || seenEmails.has(email) || deletedEmails.includes(email)) return;
      seenEmails.add(email);
      u.role = u.role || 'Member';
      u.status = u.status || 'active';
      uniqueUsers.push(u);
    });

    targetDb.users = uniqueUsers;
  }

  // Getters
  getUsers() {
    this.syncCommunityUsers();
    return this.db.users;
  }

  // --- Community Management Methods ---
  addCommunityUser(userData) {
    const { name, email, password, role, country, institution, bio } = userData;
    const cleanEmail = (email || '').trim().toLowerCase();
    const id = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    
    // If user was previously deleted, un-tombstone them upon re-adding
    if (Array.isArray(this.db.deletedUserEmails)) {
      this.db.deletedUserEmails = this.db.deletedUserEmails.filter(e => e !== cleanEmail);
    }
    try {
      let localDeleted = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
      if (Array.isArray(localDeleted)) {
        localDeleted = localDeleted.filter(e => e !== cleanEmail);
        localStorage.setItem('gyd_deleted_community_emails', JSON.stringify(localDeleted));
      }
    } catch (e) {}

    const newUser = {
      id,
      name: (name || '').trim(),
      email: cleanEmail,
      password: password || 'gyde2024',
      role: role || 'Member',
      country: (country || 'Global').trim(),
      department: (institution || 'Global Chapter').trim(),
      bio: bio || `Verified ${role || 'Member'} of Global Youth Dialogue.`,
      interests: ['Global Affairs', 'Debate'],
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const existingIndex = this.db.users.findIndex(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (existingIndex >= 0) {
      this.db.users[existingIndex] = { ...this.db.users[existingIndex], ...newUser, id: this.db.users[existingIndex].id };
    } else {
      this.db.users.push(newUser);
    }
    this.saveDatabase();
    return newUser;
  }

  updateUserRole(userId, newRole) {
    const user = this.db.users.find(u => u.id === userId);
    if (!user) return null;
    user.role = newRole;
    this.saveDatabase();
    return user;
  }

  deleteCommunityUser(userId) {
    if (!this.db.users) this.db.users = [];
    const user = this.db.users.find(u => u.id === userId);
    if (!user) return false;
    
    const cleanEmail = (user.email || '').toLowerCase().trim();
    if (user.id === 'usr_admin_mubashir' || cleanEmail === '3681mubashircp@gmail.com') {
      throw new Error('Primary administrator cannot be removed.');
    }

    // 1. Maintain persistent tombstone of deleted emails
    if (!Array.isArray(this.db.deletedUserEmails)) {
      this.db.deletedUserEmails = [];
    }
    if (cleanEmail && !this.db.deletedUserEmails.includes(cleanEmail)) {
      this.db.deletedUserEmails.push(cleanEmail);
    }
    try {
      const stored = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
      if (cleanEmail && !stored.includes(cleanEmail)) {
        stored.push(cleanEmail);
        localStorage.setItem('gyd_deleted_community_emails', JSON.stringify(stored));
      }
    } catch (e) {}

    // 2. Remove user from this.db.users
    this.db.users = this.db.users.filter(u => u.id !== userId && (!u.email || u.email.toLowerCase().trim() !== cleanEmail));

    // 3. Remove corresponding applications
    if (Array.isArray(this.db.applications)) {
      this.db.applications = this.db.applications.filter(a => !a.email || a.email.toLowerCase().trim() !== cleanEmail);
    }

    // 4. Remove corresponding presenter applications
    if (Array.isArray(this.db.presenterApplications)) {
      this.db.presenterApplications = this.db.presenterApplications.filter(a => !a.email || a.email.toLowerCase().trim() !== cleanEmail);
    }

    this.saveDatabase();

    // 5. Send delete request to centralized serverless API & GitHub cloud store
    try {
      const apiUrl = this.getApplicationsApiUrl();
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteUser', email: cleanEmail, id: userId })
      }).catch(err => console.warn('Could not sync deleteUser to API:', err));
    } catch (e) {}

    // 6. If currently logged-in user on this device was deleted, log them out immediately
    try {
      if (typeof authService !== 'undefined') {
        const cur = authService.getCurrentUser();
        if (cur && cur.email && cur.email.toLowerCase().trim() === cleanEmail) {
          authService.logout();
        }
      }
    } catch (e) {}

    return true;
  }

  getCategories() { return this.db.categories; }
  getTopics() { return this.db.topics; }
  getTopicBank() {
    if (!this.db.topicBank || !this.db.topicBank.length) {
      this.db.topicBank = JSON.parse(JSON.stringify(INITIAL_DATABASE.topicBank || []));
      this.saveDatabase();
    }
    return this.db.topicBank;
  }
  getTopicBankItem(id) {
    return this.getTopicBank().find(t => t.id === id);
  }
  getPresentations() {
    if (!this.db.presentations || !this.db.presentations.length) {
      this.db.presentations = JSON.parse(JSON.stringify(INITIAL_DATABASE.presentations || []));
      this.saveDatabase();
    }
    return this.db.presentations;
  }
  getPresentation(id) {
    return this.getPresentations().find(p => p.id === id);
  }
  addPresentation(presData) {
    if (!this.db.presentations) {
      this.db.presentations = [];
    }
    const newPres = {
      id: 'pres_' + Date.now().toString(36),
      title: presData.title,
      topicId: presData.topicId || '',
      category: presData.category || 'global-affairs',
      categoryName: presData.categoryName || this.getCategoryName(presData.category || 'global-affairs'),
      subtopic: presData.subtopic || 'General Overview',
      abstract: presData.abstract || '',
      presenterName: presData.presenterName || 'Academic Presenter',
      presenterId: presData.presenterId || 'usr_pres_1',
      presenterCountry: presData.presenterCountry || 'Ghana',
      presenterFlag: presData.presenterFlag || 'GH',
      targetSessionId: presData.targetSessionId || '',
      targetSessionTitle: presData.targetSessionTitle || 'Upcoming Dialogue Session',
      format: presData.format || 'Topic Presentation & Research Briefing',
      duration: presData.duration || '20 mins presentation + 20 mins Q&A',
      status: presData.status || 'Proposed', // Proposed, Under Review, Approved, Scheduled, Delivered
      slidesUrl: presData.slidesUrl || '',
      handoutUrl: presData.handoutUrl || '',
      keyArguments: Array.isArray(presData.keyArguments) ? presData.keyArguments : (presData.keyArguments ? presData.keyArguments.split('\n').filter(Boolean) : []),
      presentationDate: presData.presentationDate || 'TBD',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.db.presentations.unshift(newPres);
    this.saveDatabase();
    return newPres;
  }
  updatePresentationStatus(presId, status) {
    const p = this.getPresentation(presId);
    if (p) {
      p.status = status;
      this.saveDatabase();
      return p;
    }
    return null;
  }
  getSessions() { return this.db.sessions; }
  getWritings() { return this.db.writings; }
  getFeedback() { return this.db.feedback; }
  getApplications() {
    const isTrialDeleted = (function() {
      try { return localStorage.getItem('gyd_trial_data_deleted') === 'true'; } catch (e) { return false; }
    })();
    if (!this.db.applications || !Array.isArray(this.db.applications)) {
      this.db.applications = isTrialDeleted ? [] : JSON.parse(JSON.stringify(INITIAL_DATABASE.applications || []));
      this.saveDatabase();
    }
    return this.db.applications;
  }

  getApplicationsApiUrl() {
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.protocol === 'file:') {
        return 'https://www.thegyde.in/api/applications';
      }
      return '/api/applications';
    }
    return 'https://www.thegyde.in/api/applications';
  }

  async syncRemoteApplications() {
    try {
      const apiUrl = this.getApplicationsApiUrl();
      const resp = await fetch(apiUrl);
      if (resp.ok) {
        const remoteApps = await resp.json();
        if (Array.isArray(remoteApps)) {
          if (!Array.isArray(this.db.applications)) this.db.applications = [];

          const legacyDemoEmails = [
            'coordinator@gyd.org', 'presenter@gyd.org', 'member@gyd.org',
            'amara.chen@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org',
            'sagiasaasadien@gmail.com', 'ranaalo.644@gmail.com', 
            'sumeyye.bulut@stu.ihu.edu.tr', 'himaworking@gmail.com', 
            'farhan.n@outlook.com', 'sarah.vandijk@edu.nl', 
            'amina.kuwari@youth.qa', 'kofi.mensah@ug.edu.gh', 
            'elena.rostova@debate.sg'
          ];

          let deletedEmails = Array.isArray(this.db.deletedUserEmails) ? [...this.db.deletedUserEmails] : [];
          try {
            const stored = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
            if (Array.isArray(stored)) {
              stored.forEach(em => {
                const cl = (em || '').toLowerCase().trim();
                if (cl && !deletedEmails.includes(cl)) deletedEmails.push(cl);
              });
            }
          } catch (e) {}

          remoteApps.forEach(rApp => {
            const cleanRAppEmail = (rApp.email || '').toLowerCase().trim();
            if (!cleanRAppEmail) return;

            // Handle deleted status from remote cloud database
            if (rApp.status === 'Deleted' || deletedEmails.includes(cleanRAppEmail)) {
              if (!deletedEmails.includes(cleanRAppEmail) && cleanRAppEmail !== '3681mubashircp@gmail.com') {
                deletedEmails.push(cleanRAppEmail);
                this.db.deletedUserEmails = deletedEmails;
                try {
                  localStorage.setItem('gyd_deleted_community_emails', JSON.stringify(deletedEmails));
                } catch (e) {}
              }
              // Purge user and application locally
              this.db.users = this.db.users.filter(u => !u.email || u.email.toLowerCase().trim() !== cleanRAppEmail);
              this.db.applications = this.db.applications.filter(a => !a.email || a.email.toLowerCase().trim() !== cleanRAppEmail);
              if (Array.isArray(this.db.presenterApplications)) {
                this.db.presenterApplications = this.db.presenterApplications.filter(a => !a.email || a.email.toLowerCase().trim() !== cleanRAppEmail);
              }
              try {
                if (window.GYD_AUTH && typeof window.GYD_AUTH.getCurrentUser === 'function') {
                  const cur = window.GYD_AUTH.getCurrentUser();
                  if (cur && cur.email && cur.email.toLowerCase().trim() === cleanRAppEmail) {
                    window.GYD_AUTH.logout();
                  }
                }
              } catch (e) {}
              return;
            }

            if (legacyDemoEmails.includes(cleanRAppEmail)) {
              return;
            }

            const idx = this.db.applications.findIndex(a => a.id === rApp.id || (a.email && a.email.toLowerCase().trim() === cleanRAppEmail));
            if (idx === -1) {
              this.db.applications.unshift(rApp);
            } else {
              const currentStatus = this.db.applications[idx].status;
              const isLocalDecided = (
                currentStatus === 'Approved' || 
                currentStatus === 'Approved - Awaiting Registration' || 
                currentStatus === 'Rejected' || 
                currentStatus === 'Declined'
              );
              const finalStatus = (isLocalDecided && rApp.status === 'Pending') ? currentStatus : (rApp.status || currentStatus);
              const finalPassword = (rApp.password && rApp.password.trim()) 
                ? rApp.password.trim() 
                : ((this.db.applications[idx] && this.db.applications[idx].password) || '').trim();
              this.db.applications[idx] = { 
                ...this.db.applications[idx], 
                ...rApp, 
                status: finalStatus,
                password: finalPassword 
              };
            }
          });
          this.syncCommunityUsers();
          this.saveDatabase();
          if (typeof window.renderCoordDashboardContent === 'function') window.renderCoordDashboardContent();
          else if (typeof renderCoordDashboardContent === 'function') renderCoordDashboardContent();

          if (typeof window.renderCoordApplicationsList === 'function') window.renderCoordApplicationsList();
          else if (typeof renderCoordApplicationsList === 'function') renderCoordApplicationsList();

          if (typeof window.renderCoordCommunityRoster === 'function') window.renderCoordCommunityRoster();
          else if (typeof renderCoordCommunityRoster === 'function') renderCoordCommunityRoster();

          if (typeof window.checkApprovedApplicantNotice === 'function') window.checkApprovedApplicantNotice();
        }
      }
    } catch (e) {
      console.warn('syncRemoteApplications warning:', e);
    }
  }

  getApplications() {
    return Array.isArray(this.db.applications) ? this.db.applications : [];
  }
  getAnnouncements() { return this.db.announcements; }

  // Topic Bank Operations
  addTopicToBank(topicData) {
    if (!this.db.topicBank) {
      this.db.topicBank = JSON.parse(JSON.stringify(INITIAL_DATABASE.topicBank || []));
    }

    const titleTrimmed = (topicData.title || '').trim();
    if (!titleTrimmed) return null;

    // Check for existing by title
    const existing = this.db.topicBank.find(t => t.title.toLowerCase().trim() === titleTrimmed.toLowerCase());
    if (existing) return existing;

    const catId = topicData.category || topicData.categoryId || 'global-affairs';
    const subtopics = Array.isArray(topicData.subtopics) && topicData.subtopics.length 
      ? topicData.subtopics 
      : (topicData.subtopics && typeof topicData.subtopics === 'string' 
          ? topicData.subtopics.split(',').map(s => s.trim()).filter(Boolean)
          : [
              'Theoretical Framework & Contemporary Context',
              'Comparative Policy Perspectives across Nations',
              'Key Ethical Trade-offs & Structural Challenges',
              'Future Policy Recommendations & Youth Horizons'
            ]);

    const newItem = {
      id: 'tb_' + Date.now().toString(36),
      categoryId: catId,
      categoryName: topicData.categoryName || this.getCategoryName(catId),
      categoryNameAr: topicData.categoryNameAr || this.getCategoryNameAr(catId),
      title: titleTrimmed,
      titleAr: topicData.titleAr || titleTrimmed,
      description: topicData.description || topicData.reason || 'Community-proposed and coordinator-approved academic topic.',
      descriptionAr: topicData.descriptionAr || '',
      subtopics: subtopics,
      subtopicsAr: topicData.subtopicsAr || [],
      recommendedFormats: topicData.recommendedFormats || ['Discussion', 'Topic Presentation', 'Debate'],
      isCustom: true,
      addedBy: topicData.proposedBy || 'Approved Community Member',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    this.db.topicBank.unshift(newItem);
    this.saveDatabase();
    return newItem;
  }

  // Topic Operations
  addTopic(topicData) {
    const newTopic = {
      id: 'top_' + Date.now().toString(36),
      title: topicData.title,
      category: topicData.category,
      categoryName: topicData.categoryName || this.getCategoryName(topicData.category),
      description: topicData.description || '',
      motion: topicData.motion || '',
      subtopics: topicData.subtopics || [],
      selectedSubtopic: topicData.selectedSubtopic || '',
      format: topicData.format || 'Discussion & Debate',
      isCustom: !!topicData.isCustom,
      bankId: topicData.bankId || null,
      status: topicData.status || 'Proposed',
      proposedBy: topicData.proposedBy || 'Community Member',
      proposedById: topicData.proposedById || null,
      countryPerspective: topicData.countryPerspective || '',
      sources: topicData.sources || '',
      researchNotes: topicData.researchNotes || '',
      assignedSpeaker: topicData.assignedSpeaker || 'Unassigned',
      assignedModerator: topicData.assignedModerator || 'Unassigned',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.db.topics.unshift(newTopic);
    this.saveDatabase();
    return newTopic;
  }

  updateTopicStatus(topicId, newStatus, extra = {}) {
    const topic = this.db.topics.find(t => t.id === topicId);
    if (topic) {
      topic.status = newStatus;
      if (extra.assignedSpeaker) topic.assignedSpeaker = extra.assignedSpeaker;
      if (extra.assignedModerator) topic.assignedModerator = extra.assignedModerator;
      if (extra.researchNotes) topic.researchNotes = extra.researchNotes;

      // When approved, automatically register into topic bank if not already present!
      if (newStatus === 'Approved') {
        this.addTopicToBank(topic);
      }

      this.saveDatabase();
      return topic;
    }
    return null;
  }

  // Session Operations
  createSession(sessionData) {
    const sessionNum = this.db.sessions.length + 1;
    const newSession = {
      id: 'ses_' + Date.now().toString(36),
      sessionNumber: sessionNum,
      title: sessionData.title,
      topicId: sessionData.topicId || '',
      category: sessionData.category || 'global-affairs',
      categoryName: this.getCategoryName(sessionData.category || 'global-affairs'),
      sessionCategory: sessionData.sessionCategory || 'Topic Presentation',
      date: sessionData.date,
      time: sessionData.time,
      timezone: sessionData.timezone || 'GMT+3 (Qatar Standard Time)',
      format: sessionData.format || sessionData.sessionCategory || 'Topic Presentation',
      duration: sessionData.duration || '90 mins',
      status: 'Upcoming',
      moderator: sessionData.moderator || { name: 'TBD', country: 'TBD', flag: 'INT' },
      speakers: sessionData.speakers || [],
      // Session Category Specialized Attributes
      presenter: sessionData.presenter || null,
      guestName: sessionData.guestName || '',
      guestPhoto: sessionData.guestPhoto || '',
      guestBio: sessionData.guestBio || '',
      keySpeakers: sessionData.keySpeakers || '',
      discussionQuestions: sessionData.discussionQuestions || '',
      roundtableChair: sessionData.roundtableChair || null,
      workingDraftTitle: sessionData.workingDraftTitle || '',
      roundtableFocus: sessionData.roundtableFocus || '',
      debateMotion: sessionData.debateMotion || '',
      propositionTeam: sessionData.propositionTeam || '',
      oppositionTeam: sessionData.oppositionTeam || '',
      adjudicator: sessionData.adjudicator || null,
      presentationPaperUrl: sessionData.presentationPaperUrl || '',
      countriesRepresented: sessionData.countriesRepresented || ['Qatar'],
      description: sessionData.description || '',
      structure: sessionData.structure || [
        { phase: '01', title: 'Context & Ground Rules', duration: '10 min', lead: 'Moderator' },
        { phase: '02', title: 'Opening Presentations', duration: '20 min', lead: 'Speakers' },
        { phase: '03', title: 'Structured Dialogue & Cross-Rebuttals', duration: '25 min', lead: 'Debaters' },
        { phase: '04', title: 'Open Member Interventions', duration: '25 min', lead: 'All Members' },
        { phase: '05', title: 'Synthesis & Adjournment', duration: '10 min', lead: 'Panel' }
      ],
      prepMaterials: sessionData.prepMaterials || [{ title: 'Discussion Motion Guide', url: '#' }],
      meetingLink: sessionData.meetingLink || 'https://meet.google.com/gyd-private-session',
      poster: 'session_poster',
      recordingUrl: sessionData.recordingUrl || '',
      isRecordingPrivate: true,
      hasSummary: false,
      summaryId: null
    };

    // If linked to a topic, mark topic as Scheduled
    if (sessionData.topicId) {
      this.updateTopicStatus(sessionData.topicId, 'Scheduled');
    }

    this.db.sessions.unshift(newSession);
    this.saveDatabase();
    return newSession;
  }

  updateSessionRecording(sessionId, recordingUrl) {
    const session = this.db.sessions.find(s => s.id === sessionId);
    if (session) {
      session.recordingUrl = recordingUrl;
      session.status = 'Completed';
      this.saveDatabase();
      return session;
    }
    return null;
  }

  // Feedback Operations
  submitFeedback(feedbackData) {
    const newFeedback = {
      id: 'fdb_' + Date.now().toString(36),
      sessionId: feedbackData.sessionId,
      sessionTitle: feedbackData.sessionTitle,
      memberId: feedbackData.memberId,
      memberName: feedbackData.memberName,
      memberCountry: feedbackData.memberCountry,
      rating: feedbackData.rating || 'Good',
      strengths: feedbackData.strengths || '',
      missingPoints: feedbackData.missingPoints || '',
      evidenceFeedback: feedbackData.evidenceFeedback || '',
      overlookedPerspectives: feedbackData.overlookedPerspectives || '',
      futureIdeas: feedbackData.futureIdeas || '',
      comments: feedbackData.comments || '',
      date: new Date().toISOString().split('T')[0]
    };
    this.db.feedback.unshift(newFeedback);
    this.saveDatabase();
    return newFeedback;
  }

  // Academic Writings Operations
  createWriting(writingData) {
    const newWriting = {
      id: 'wri_' + Date.now().toString(36),
      sessionId: writingData.sessionId || null,
      sessionNumber: writingData.sessionNumber || null,
      title: writingData.title,
      category: writingData.category,
      categoryName: writingData.categoryName || this.getCategoryName(writingData.category),
      author: writingData.author || 'GYD Research Working Group',
      authorRole: writingData.authorRole || 'Coordinating Researcher',
      authorId: writingData.authorId || null,
      authorEmail: writingData.authorEmail || null,
      publicationDate: new Date().toISOString().split('T')[0],
      status: writingData.status || 'Published', // Draft, Under Review, Published
      intro: writingData.intro,
      totalContent: writingData.totalContent || null,
      background: writingData.background || writingData.intro,
      keyArguments: Array.isArray(writingData.keyArguments) ? writingData.keyArguments : (writingData.keyArguments ? [writingData.keyArguments] : []),
      counterarguments: Array.isArray(writingData.counterarguments) ? writingData.counterarguments : (writingData.counterarguments ? [writingData.counterarguments] : []),
      evidence: writingData.evidence || '',
      insights: writingData.insights || '',
      conclusion: writingData.conclusion || '',
      furtherQuestions: Array.isArray(writingData.furtherQuestions) ? writingData.furtherQuestions : (writingData.furtherQuestions ? [writingData.furtherQuestions] : []),
      sources: writingData.sources || ''
    };

    if (writingData.sessionId) {
      const session = this.db.sessions.find(s => s.id === writingData.sessionId);
      if (session) {
        session.hasSummary = true;
        session.summaryId = newWriting.id;
      }
    }

    this.db.writings.unshift(newWriting);
    this.saveDatabase();
    return newWriting;
  }

  approveWriting(writingId) {
    if (!this.db.writings) this.db.writings = [];
    const writing = this.db.writings.find(w => w.id === writingId);
    if (!writing) return null;

    writing.status = 'Published';
    writing.publicationDate = new Date().toISOString().split('T')[0];

    // Add notification for community
    if (this.db.notifications) {
      this.db.notifications.unshift({
        id: 'notif_' + Date.now().toString(36),
        title: 'New Academic Paper Published',
        message: `"${writing.title}" by ${writing.author} (${writing.categoryName}) is now live in the Academic Library.`,
        type: 'topic',
        read: false,
        time: 'Just now',
        targetView: 'writings',
        targetId: writing.id
      });
    }

    this.saveDatabase();
    return writing;
  }

  rejectWriting(writingId) {
    if (!this.db.writings) this.db.writings = [];
    const writing = this.db.writings.find(w => w.id === writingId);
    if (!writing) return null;

    writing.status = 'Rejected';
    this.saveDatabase();
    return writing;
  }

  // Applications Operations
  submitApplication(appData) {
    const cleanEmail = (appData.email || '').trim().toLowerCase();

    // If applicant was previously in deleted tombstone list, un-tombstone them
    if (Array.isArray(this.db.deletedUserEmails)) {
      this.db.deletedUserEmails = this.db.deletedUserEmails.filter(e => e !== cleanEmail);
    }
    try {
      let localDeleted = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
      if (Array.isArray(localDeleted)) {
        localDeleted = localDeleted.filter(e => e !== cleanEmail);
        localStorage.setItem('gyd_deleted_community_emails', JSON.stringify(localDeleted));
      }
    } catch (e) {}

    const newApp = {
      id: appData.id || ('app_' + Date.now().toString(36)),
      name: (appData.name || '').trim(),
      firstName: appData.firstName || (appData.name ? appData.name.split(' ')[0] : ''),
      lastName: appData.lastName || (appData.name ? appData.name.split(' ').slice(1).join(' ') : ''),
      email: cleanEmail,
      password: appData.password || '',
      country: (appData.country || 'Global').trim(),
      flag: appData.flag || 'INT',
      interests: Array.isArray(appData.interests) ? appData.interests : (appData.interests ? [appData.interests] : ['Global Affairs']),
      debateExperience: appData.debateExperience || '',
      motivation: appData.motivation || '',
      status: 'Pending',
      emailVerified: true,
      date: appData.date || new Date().toISOString().split('T')[0]
    };
    if (!Array.isArray(this.db.applications)) this.db.applications = [];
    const existingIdx = this.db.applications.findIndex(a => a.email && a.email.toLowerCase().trim() === cleanEmail);
    if (existingIdx >= 0) {
      this.db.applications[existingIdx] = { ...this.db.applications[existingIdx], ...newApp, id: this.db.applications[existingIdx].id || newApp.id };
    } else {
      this.db.applications.unshift(newApp);
    }
    this.saveDatabase();

    // Send to centralized serverless API so coordinator receives it across all devices
    try {
      const apiUrl = this.getApplicationsApiUrl();
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submitApplication', ...newApp })
      }).then(() => {
        if (typeof this.syncRemoteApplications === 'function') {
          this.syncRemoteApplications();
        }
      }).catch(err => console.warn('Could not post application to server API:', err));
    } catch (e) {}

    // Remember the applied email on this browser
    try {
      localStorage.setItem('gyd_applied_email', cleanEmail);
    } catch (e) {}

    return newApp;
  }

  approveApplication(appId) {
    if (!appId) return null;
    if (!Array.isArray(this.db.applications)) this.db.applications = [];

    const app = this.db.applications.find(a => 
      (a.id && String(a.id).trim() === String(appId).trim()) || 
      (a.email && a.email.toLowerCase().trim() === String(appId).toLowerCase().trim())
    );
    if (!app) return null;

    app.status = 'Approved';
    const cleanEmail = (app.email || '').toLowerCase().trim();

    // Immediately remove email from any deleted/tombstone list so syncCommunityUsers includes them
    if (Array.isArray(this.db.deletedUserEmails)) {
      this.db.deletedUserEmails = this.db.deletedUserEmails.filter(e => e !== cleanEmail);
    }
    try {
      let localDeleted = JSON.parse(localStorage.getItem('gyd_deleted_community_emails') || '[]');
      if (Array.isArray(localDeleted)) {
        localDeleted = localDeleted.filter(e => e !== cleanEmail);
        localStorage.setItem('gyd_deleted_community_emails', JSON.stringify(localDeleted));
      }
    } catch (e) {}

    // Activate/create member in users list so they appear in community menu immediately
    if (!Array.isArray(this.db.users)) this.db.users = [];
    let userIndex = this.db.users.findIndex(u => u.email && u.email.toLowerCase().trim() === cleanEmail);
    const resolvedPassword = (app.password && app.password.trim()) 
      ? app.password.trim() 
      : ((userIndex >= 0 && this.db.users[userIndex].password) ? this.db.users[userIndex].password : 'gyde2024');

    const activeUser = {
      id: 'usr_' + (app.id ? app.id.replace('app_', '') : Date.now().toString(36)),
      name: app.name,
      email: cleanEmail,
      password: resolvedPassword,
      role: 'Member',
      department: `Youth Delegation • ${app.country || 'Global'}`,
      country: app.country || 'Global',
      flag: app.flag || 'INT',
      bio: app.motivation || app.debateExperience || `Verified member representing ${app.country || 'Global'}.`,
      interests: Array.isArray(app.interests) && app.interests.length ? app.interests : ['Global Affairs'],
      debateExperience: app.debateExperience || '',
      motivation: app.motivation || '',
      status: 'active',
      joinedDate: app.date || new Date().toISOString().split('T')[0]
    };

    if (userIndex >= 0) {
      this.db.users[userIndex] = { ...this.db.users[userIndex], ...activeUser, id: this.db.users[userIndex].id || activeUser.id };
    } else {
      this.db.users.unshift(activeUser);
    }

    this.syncCommunityUsers();
    this.saveDatabase();

    // Immediately sync approval to remote server
    try {
      const apiUrl = this.getApplicationsApiUrl();
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatus',
          id: app.id,
          name: app.name,
          country: app.country,
          email: app.email,
          password: resolvedPassword,
          status: 'Approved'
        })
      }).catch(err => console.warn('Could not sync approval to remote API', err));
    } catch (e) {}

    // Dispatch approval notification email to applicant
    if (window.GYD_AUTH && typeof window.GYD_AUTH.sendApprovalNotificationEmail === 'function') {
      window.GYD_AUTH.sendApprovalNotificationEmail(app.email, app.name).catch(() => {});
    }

    return app;
  }

  registerUserFromSignup(userData) {
    const { firstName, lastName, country, email, password } = userData;
    const fullName = `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim();

    // Check if user already exists
    let existingIndex = this.db.users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      name: fullName,
      email: email.toLowerCase(),
      password: password,
      role: 'Member',
      country: country || 'Global',
      flag: 'INT',
      bio: 'Verified Member of Global Youth Dialogue.',
      interests: ['Global Affairs'],
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    if (existingIndex >= 0) {
      this.db.users[existingIndex] = { ...this.db.users[existingIndex], ...newUser, id: this.db.users[existingIndex].id };
    } else {
      this.db.users.push(newUser);
    }

    // Mark all matching applications for this email as 'Registered'
    const cleanEmail = email.toLowerCase().trim();
    if (Array.isArray(this.db.applications)) {
      this.db.applications.forEach(a => {
        if (a.email && a.email.toLowerCase().trim() === cleanEmail) {
          a.status = 'Registered';
        }
      });
    }

    // Clean up applied email & pending registration tokens
    try {
      localStorage.removeItem('gyd_applied_email');
      localStorage.removeItem('gyd_pending_registration');
      if (window.GYD_AUTH && typeof window.GYD_AUTH.clearPendingRegistration === 'function') {
        window.GYD_AUTH.clearPendingRegistration();
      }
    } catch (e) {}

    this.saveDatabase();
    return newUser;
  }

  rejectApplication(appId) {
    const app = this.db.applications.find(a => a.id === appId);
    if (app) {
      app.status = 'Rejected';
      this.saveDatabase();

      try {
        const apiUrl = this.getApplicationsApiUrl();
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateStatus',
            id: app.id,
            email: app.email,
            status: 'Rejected'
          })
        }).catch(err => console.warn('Could not sync rejection to remote API', err));
      } catch (e) {}

      return app;
    }
    return null;
  }

  // Presenter Application Operations
  getPresenterApplications() {
    if (!this.db.presenterApplications) this.db.presenterApplications = [];
    return this.db.presenterApplications;
  }

  addPresenterApplication(appData) {
    if (!this.db.presenterApplications) this.db.presenterApplications = [];
    const newApp = {
      id: 'papp_' + Date.now().toString(36),
      userId: appData.userId || null,
      name: appData.name,
      email: appData.email,
      country: appData.country || 'Global',
      flag: appData.flag || 'INT',
      primarySpheres: appData.primarySpheres || [],
      proposedTopic: appData.proposedTopic || 'Academic Research Briefing',
      researchExperience: appData.researchExperience || '',
      dossierUrl: appData.dossierUrl || '',
      preferredFormat: appData.preferredFormat || '15-min Keynote Briefing',
      statementOfIntent: appData.statementOfIntent || '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    this.db.presenterApplications.unshift(newApp);

    // Also add a notification for coordinators
    if (this.db.notifications) {
      this.db.notifications.unshift({
        id: 'notif_' + Date.now().toString(36),
        title: 'New Presenter Application',
        message: `${newApp.name} (${newApp.country}) has applied for Official Presenter accreditation: "${newApp.proposedTopic}".`,
        type: 'topic',
        read: false,
        time: 'Just now',
        targetView: 'applications',
        targetId: newApp.id
      });
    }

    this.saveDatabase();
    return newApp;
  }

  approvePresenterApplication(appId) {
    if (!this.db.presenterApplications) this.db.presenterApplications = [];
    const app = this.db.presenterApplications.find(a => a.id === appId);
    if (!app) return null;

    app.status = 'Approved';

    // Upgrade member's role to Presenter
    let user = this.db.users.find(u => (app.userId && u.id === app.userId) || (app.email && u.email.toLowerCase() === app.email.toLowerCase()));
    if (user) {
      user.role = 'Presenter';
    }

    // Sync active session if currently logged in user is the applicant
    if (window.GYD_AUTH && typeof window.GYD_AUTH.getCurrentUser === 'function') {
      const activeUser = window.GYD_AUTH.getCurrentUser();
      if (activeUser && (activeUser.id === app.userId || activeUser.email.toLowerCase() === app.email.toLowerCase())) {
        activeUser.role = 'Presenter';
        window.GYD_AUTH.saveSession(activeUser);
      }
    }

    // Add celebration notification
    if (this.db.notifications) {
      this.db.notifications.unshift({
        id: 'notif_' + Date.now().toString(36),
        title: 'Presenter Accreditation Approved',
        message: `Congratulations ${app.name}! You are now an official accredited GYD Presenter with full access to the Presenter Portal.`,
        type: 'topic',
        read: false,
        time: 'Just now',
        targetView: 'present',
        targetId: null
      });
    }

    this.syncCommunityUsers();
    this.saveDatabase();
    return { app, user };
  }

  rejectPresenterApplication(appId) {
    if (!this.db.presenterApplications) this.db.presenterApplications = [];
    const app = this.db.presenterApplications.find(a => a.id === appId);
    if (app) {
      app.status = 'Rejected';
      this.saveDatabase();
      return app;
    }
    return null;
  }

  getMemberPresenterApplication(userId, email) {
    if (!this.db.presenterApplications) return null;
    return this.db.presenterApplications.find(a => 
      (userId && a.userId === userId) || (email && a.email && a.email.toLowerCase() === email.toLowerCase())
    ) || null;
  }

  // Announcements
  addAnnouncement(annData) {
    const newAnn = {
      id: 'ann_' + Date.now().toString(36),
      title: annData.title,
      content: annData.content,
      category: annData.category || 'General',
      priority: annData.priority || 'Normal',
      author: annData.author || 'GYD Secretariat',
      date: new Date().toISOString().split('T')[0]
    };
    this.db.announcements.unshift(newAnn);
    this.saveDatabase();
    return newAnn;
  }

  // Helper
  getCategoryName(catId) {
    const cat = this.db.categories.find(c => c.id === catId);
    return cat ? cat.name : catId;
  }

  getCategoryNameAr(catId) {
    const cat = this.db.categories.find(c => c.id === catId);
    return cat ? (cat.nameAr || cat.name) : catId;
  }

  // =========================================================================
  // PHASE 2 METHODS: Notifications, Country Chapters, Media & PR, Search, Analytics
  // =========================================================================

  // Notifications
  getNotifications() {
    return this.db.notifications || [];
  }

  getUnreadNotificationsCount() {
    return (this.db.notifications || []).filter(n => !n.read).length;
  }

  markNotificationRead(notifId) {
    const notif = (this.db.notifications || []).find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      this.saveDatabase();
      return notif;
    }
    return null;
  }

  markAllNotificationsRead() {
    (this.db.notifications || []).forEach(n => { n.read = true; });
    this.saveDatabase();
    return true;
  }

  addNotification(notifData) {
    if (!this.db.notifications) this.db.notifications = [];
    const newNotif = {
      id: 'notif_' + Date.now().toString(36),
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'system',
      time: 'Just now',
      read: false,
      targetView: notifData.targetView || null,
      targetId: notifData.targetId || null
    };
    this.db.notifications.unshift(newNotif);
    this.saveDatabase();
    return newNotif;
  }

  // Country Representatives
  getCountryReps() {
    return this.db.countryReps || [];
  }

  addCountryRep(repData) {
    if (!this.db.countryReps) this.db.countryReps = [];
    const newRep = {
      id: 'rep_' + Date.now().toString(36),
      country: repData.country,
      countryAr: repData.countryAr || repData.country,
      flag: repData.flag || 'INT',
      chapterName: repData.chapterName || (repData.country + ' Chapter'),
      repName: repData.repName,
      email: repData.email,
      isdcTeam: repData.isdcTeam || 'ISDC7 Delegate',
      activeDebaters: parseInt(repData.activeDebaters) || 1,
      status: repData.status || 'Active Chapter',
      bio: repData.bio || ''
    };
    this.db.countryReps.push(newRep);
    this.saveDatabase();
    return newRep;
  }

  // Media Kits
  getMediaKits() {
    return this.db.mediaKits || [];
  }

  createMediaKit(kitData) {
    if (!this.db.mediaKits) this.db.mediaKits = [];
    const newKit = {
      id: 'mk_' + Date.now().toString(36),
      title: kitData.title,
      type: kitData.type || 'instagram_caption',
      category: kitData.category || 'General',
      headline: kitData.headline,
      copyText: kitData.copyText,
      tags: kitData.tags || ['Social'],
      date: new Date().toISOString().split('T')[0]
    };
    this.db.mediaKits.unshift(newKit);
    this.saveDatabase();
    return newKit;
  }

  // Universal Search
  searchAll(query) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results = [];

    // Search Sessions
    (this.db.sessions || []).forEach(s => {
      const match = (s.title && s.title.toLowerCase().includes(q)) ||
        (s.motion && s.motion.toLowerCase().includes(q)) ||
        (s.category && s.category.toLowerCase().includes(q));
      if (match) {
        results.push({
          type: 'session',
          typeLabel: 'Session',
          title: s.title,
          subtitle: s.motion ? `Motion: ${s.motion.substring(0, 75)}...` : (s.date + ' • ' + s.status),
          date: s.date,
          targetView: 'sessions',
          id: s.id
        });
      }
    });

    // Search Academic Writings
    (this.db.writings || []).forEach(w => {
      const match = (w.title && w.title.toLowerCase().includes(q)) ||
        (w.motion && w.motion.toLowerCase().includes(q)) ||
        (w.executiveSummary && w.executiveSummary.toLowerCase().includes(q));
      if (match) {
        results.push({
          type: 'writing',
          typeLabel: 'Academic Paper',
          title: w.title,
          subtitle: `By ${w.authorName || 'Research Fellow'} • ${w.category}`,
          date: w.date,
          targetView: 'writings',
          id: w.id
        });
      }
    });

    // Search Topics
    (this.db.topics || []).forEach(t => {
      const match = (t.title && t.title.toLowerCase().includes(q)) ||
        (t.rationale && t.rationale.toLowerCase().includes(q));
      if (match) {
        results.push({
          type: 'topic',
          typeLabel: 'Topic Proposal',
          title: t.title,
          subtitle: `Status: ${t.status} • Category: ${t.category}`,
          date: t.submissionDate,
          targetView: 'topics',
          id: t.id
        });
      }
    });

    // Search Members
    (this.db.users || []).forEach(u => {
      const match = (u.name && u.name.toLowerCase().includes(q)) ||
        (u.country && u.country.toLowerCase().includes(q)) ||
        (u.bio && u.bio.toLowerCase().includes(q));
      if (match) {
        results.push({
          type: 'member',
          typeLabel: 'Member',
          title: `${u.flag || 'INT'} ${u.name}`,
          subtitle: `${u.role} from ${u.country}`,
          date: u.joinedDate,
          targetView: 'community',
          id: u.id
        });
      }
    });

    return results;
  }

  // Member Analytics & Journey
  getUserAnalytics(userId) {
    const user = (this.db.users || []).find(u => u.id === userId) || {};
    const feedbackGiven = (this.db.feedback || []).filter(f => f.memberId === userId).length;
    const topicsProposed = (this.db.topics || []).filter(t => t.submittedBy === user.name).length;
    const writingsAuthored = (this.db.writings || []).filter(w => w.authorName === user.name).length;

    // Calculate sessions attended / spoken
    const sessionsConducted = (this.db.sessions || []).filter(s => s.status === 'Completed').length;
    const attendedCount = Math.max(sessionsConducted, 2);
    const spokenCount = user.role === 'Speaker' ? 2 : (user.role === 'Moderator' ? 3 : (user.role === 'Coordinator' ? 4 : 1));

    const badges = [
      {
        id: 'isdc7_veteran',
        title: 'Qatar ISDC7 Founding Delegate',
        desc: 'Participated in the Doha 7th International Schools Debate Championship',
        icon: 'award',
        unlocked: true,
        progress: '100%'
      },
      {
        id: 'distinguished_speaker',
        title: 'Distinguished Speaker',
        desc: 'Delivered principal constructive or rebuttal speeches in 3+ international sessions',
        icon: 'mic',
        unlocked: spokenCount >= 3,
        progress: `${Math.min(100, Math.round((spokenCount / 3) * 100))}%`
      },
      {
        id: 'academic_fellow',
        title: 'Academic Research Contributor',
        desc: 'Authored or contributed to peer-reviewed youth policy synthesis papers',
        icon: 'book',
        unlocked: writingsAuthored >= 1 || user.role === 'Coordinator',
        progress: writingsAuthored >= 1 || user.role === 'Coordinator' ? '100%' : '50%'
      },
      {
        id: 'agenda_setter',
        title: 'Dialogue Agenda Setter',
        desc: 'Suggested approved debate motions tackling high-priority global governance issues',
        icon: 'lightbulb',
        unlocked: topicsProposed >= 1,
        progress: topicsProposed >= 1 ? '100%' : '33%'
      },
      {
        id: 'peer_reviewer',
        title: 'Constructive Peer Reviewer',
        desc: 'Provided structured qualitative feedback across completed dialogue rounds',
        icon: 'pen',
        unlocked: feedbackGiven >= 1,
        progress: feedbackGiven >= 1 ? '100%' : '20%'
      }
    ];

    return {
      sessionsAttended: attendedCount,
      debatesSpoken: spokenCount,
      writingsAuthored: writingsAuthored + (user.role === 'Coordinator' ? 2 : 0),
      topicsProposed: topicsProposed + (user.role === 'Coordinator' ? 3 : 1),
      feedbackSubmitted: feedbackGiven + 1,
      engagementScore: 92,
      badges
    };
  }

  // =========================================================================
  // PHASE 3 METHODS: Community Topic Ballot & Certificate Generator
  // =========================================================================

  upvoteTopic(topicId, userId = 'usr_mem_1') {
    const topic = this.db.topics.find(t => t.id === topicId);
    if (!topic) return null;
    if (!topic.upvotedBy) topic.upvotedBy = [];
    if (!topic.upvotes) topic.upvotes = 12;

    const idx = topic.upvotedBy.indexOf(userId);
    let hasUpvoted = false;
    if (idx > -1) {
      topic.upvotedBy.splice(idx, 1);
      topic.upvotes = Math.max(0, topic.upvotes - 1);
      hasUpvoted = false;
    } else {
      topic.upvotedBy.push(userId);
      topic.upvotes = (topic.upvotes || 0) + 1;
      hasUpvoted = true;
    }
    this.saveDatabase();
    return { upvotes: topic.upvotes, hasUpvoted };
  }

  getTopVotedTopics() {
    return [...this.db.topics].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)).slice(0, 5);
  }

  getCertificateData(userId) {
    const user = this.db.users.find(u => u.id === userId) || this.db.users.find(u => u.role === 'Speaker') || this.db.users[0] || {
      id: 'usr_admin_mubashir',
      name: 'Mubashir CP',
      country: 'India',
      flag: 'IN',
      role: 'Coordinator'
    };
    return {
      recipientName: user.name,
      country: user.country,
      flag: user.flag || 'QA',
      role: user.role,
      issueDate: 'October 2024',
      certificateNumber: 'GYD-ISDC7-' + (user.id || 'MEM').replace('usr_', '').toUpperCase(),
      motions: [
        'Mandating AI Literacy and Ethical AI Utilization as a Compulsory Core Subject in Secondary Schools',
        'Historic Carbon Emitters Duty to Fund Climate Infrastructure and Adaptation in Vulnerable Nations'
      ],
      coordinators: [
        { name: 'Mubashir CP', title: 'Executive Administrator & Lead Coordinator', origin: 'GYDE Secretariat (Qatar)' }
      ]
    };
  }
}

// Global data store instance
window.GYD_DATA = new DataService();
