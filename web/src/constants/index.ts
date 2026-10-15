export interface TopicCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
  subTopics: string[];
  subTopicsAr: string[];
}

export const CATEGORIES: TopicCategory[] = [
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
      'Loss and Damage Climate Financing (COP Protocols)',
      'Nuclear Energy vs Renewable Integration',
      'Transboundary Water Rights & Dam Politics',
      'Carbon Offsets vs Absolute Emission Caps',
      'Indigenous Land Stewardship & Conservation'
    ],
    subTopicsAr: [
      'تمويل الخسائر والأضرار المناخية (بروتوكولات كوب)',
      'الطاقة النووية مقابل إدماج الطاقات المتجددة',
      'حقوق المياه العابرة للحدود وسياسات السدود',
      'أرصدة الكربون مقابل السقوف المطلقة للانبعاثات',
      'الإشراف البيئي للشعوب الأصلية وحماية الطبيعة'
    ]
  },
  {
    id: 'economy',
    name: 'Economy, Trade & Labor',
    nameAr: 'الاقتصاد والتجارة والعمل',
    icon: 'trending-up',
    description: 'De-dollarization, wealth inequality, universal basic income, supply chain resilience, central bank digital currencies, and labor automation.',
    descriptionAr: 'التجارة العالمية، التفاوت في الثروات، الدخل الأساسي الشامل، مرونة سلاسل الإمداد، والعملات الرقمية للبنوك المركزية.',
    subTopics: [
      'Universal Basic Income in the Age of Automation',
      'De-Dollarization & Bilateral Trade Agreements',
      'Global Minimum Corporate Tax Enforcement',
      'Gig Economy Worker Rights & Classification',
      'Supply Chain Nationalism vs Free Trade'
    ],
    subTopicsAr: [
      'الدخل الأساسي الشامل في عصر الأتمتة',
      'إنهاء الهيمنة الدولارية والاتفاقات الثنائية',
      'تطبيق الضريبة العالمية الدنيا على الشركات',
      'حقوق عمال الاقتصاد التشاركي وتصنيفهم القانوني',
      'قومية سلاسل الإمداد مقابل التجارة الحرة'
    ]
  },
  {
    id: 'governance',
    name: 'Governance, Law & Human Rights',
    nameAr: 'الحوكمة والقانون وحقوق الإنسان',
    icon: 'shield',
    description: 'Democratic resilience, digital civil liberties, judicial independence, freedom of speech, youth political franchise, and anti-corruption.',
    descriptionAr: 'الصمود الديمقراطي، الحريات الرقمية، استقلالية القضاء، حرية التعبير، المشاركة السياسية للشباب، ومكافحة الفساد.',
    subTopics: [
      'Lowering the Voting Age to 16 Globally',
      'Judicial Independence in Polarized Democracies',
      'Digital Civil Liberties vs Counter-Terrorism Laws',
      'Prison Reform vs Retributive Justice',
      'Whistleblower Protections in National Security'
    ],
    subTopicsAr: [
      'خفض سن الاقتراع إلى 16 عاماً دولياً',
      'استقلالية القضاء في الديمقراطيات المستقطبة',
      'الحريات المدنية الرقمية وقوانين مكافحة الإرهاب',
      'إصلاح السجون مقابل العدالة العقابية',
      'حماية كاشفي الفساد في قضايا الأمن القومي'
    ]
  },
  {
    id: 'culture',
    name: 'Culture, Identity & Global Media',
    nameAr: 'الثقافة والهوية والإعلام العالمي',
    icon: 'smile',
    description: 'Cultural repatriation, linguistic preservation, media consolidation, post-colonial literature, and cosmopolitan youth identities.',
    descriptionAr: 'استرداد الآثار الثقافية، صون اللغات المهددة، الاحتكار الإعلامي، أدب ما بعد الاستعمار، والهوية الشبابية العالمية.',
    subTopics: [
      'Repatriation of Colonial Museum Artifacts',
      'Preserving Indigenous & Endangered Languages',
      'Monopolization of Global Entertainment Platforms',
      'Cultural Appropriation vs Hybrid Globalization',
      'Diaspora Identity & Transnational Belonging'
    ],
    subTopicsAr: [
      'استرداد الآثار والمقتنيات الاستعمارية من المتاحف',
      'حماية اللغات الأصلية المهددة بالاندثار',
      'احتكار منصات الترفيه والبث العالمية',
      'الاستحواذ الثقافي مقابل العولمة التفاعلية',
      'هوية الشتات والانتماء العابر للأوطان'
    ]
  },
  {
    id: 'health',
    name: 'Public Health, Bioethics & Science',
    nameAr: 'الصحة العامة والأخلاقيات الحيوية والعلوم',
    icon: 'heart-pulse',
    description: 'Pandemic preparedness, universal healthcare access, human genetic editing, mental health infrastructure, and pharmaceutical patent monopolies.',
    descriptionAr: 'الجاهزية للأوبئة، الرعاية الصحية الشاملة، التعديل الجيني البشري، بنية الصحة النفسية، واحتكارات براءات الاختراع الدوائية.',
    subTopics: [
      'TRIPS Waiver & Global Vaccine Equity',
      'CRISPR Gene Editing in Human Embryos',
      'Universal Mental Healthcare for Adolescents',
      'Private Health Insurance vs Single-Payer Models',
      'Antibiotic Resistance & Global Biosecurity'
    ],
    subTopicsAr: [
      'التنازل عن حقوق الملكية الفكرية وعدالة توزيع اللقاحات',
      'تقنيات التعديل الجيني كريسبر على الأجنة البشرية',
      'الرعاية النفسية الشاملة للشباب والمراهقين',
      'التأمين الصحي الخاص مقابل نظم التغطية الشاملة',
      'مقاومة المضادات الحيوية والأمن الحيوي العالمي'
    ]
  }
];

export const DIALOGUE_STAGES = [
  {
    number: '01',
    title: 'Select',
    titleAr: 'الاختيار',
    desc: 'Topics are nominated by member debaters and selected through academic consensus on contemporary relevance.',
    descAr: 'ترشيح القضايا من قبل الأعضاء واختيارها بالتوافق الأكاديمي بناءً على راهنيتها وأهميتها الدولية.'
  },
  {
    number: '02',
    title: 'Prepare',
    titleAr: 'التحضير',
    desc: 'Speakers receive verified briefing dossiers, scholarly readings, and case study frameworks prior to the debate.',
    descAr: 'تزويد المتحدثين بملفات إحاطة موثقة وقراءات أكاديمية وأطر لدراسة الحالة قبل موعد المناظرة.'
  },
  {
    number: '03',
    title: 'Discuss',
    titleAr: 'الحوار والمناظرة',
    desc: 'Structured Oxford-style parliamentary debates and multilateral roundtables held live every two weeks.',
    descAr: 'مناظرات برلمانية منظمة وحلقات نقاشية متعددة الأطراف تعقد مباشرة عبر الإنترنت كل أسبوعين.'
  },
  {
    number: '04',
    title: 'Reflect',
    titleAr: 'التقييم والملاحظات',
    desc: 'Audience delegates and peers submit qualitative feedback on argument strength, evidence quality, and counter-framing.',
    descAr: 'تقديم تقييمات نوعية وملاحظات بناءة حول متانة الحجج وكفاءة الأدلة وأسلوب التفنيد.'
  },
  {
    number: '05',
    title: 'Document',
    titleAr: 'التوثيق والنشر',
    desc: 'Debate insights are synthesized into 8-part peer-reviewed academic papers published in our permanent research repository.',
    descAr: 'صياغة مخرجات الحوار في أوراق بحثية أكاديمية محكمة من 8 أقسام ونشرها في المكتبة الدائمة.'
  }
];
