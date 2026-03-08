// ============================================================
// data.js — All static data for the Tender Readiness Audit App
// ============================================================

const SCORING_CATEGORIES = [
  {
    id: 1,
    name: 'Eligibility & Registrations',
    nameAr: 'الأهلية والتسجيلات',
    weight: 12,
    measures: 'Classification certificate valid and covers target tenders; vendor/supplier registrations active on Etimad and other platforms; legal documents (CR, VAT, GOSI) current.',
    levels: [
      'No classification or registrations in place',
      'CR exists but classification expired or missing',
      'Classification valid but does not cover target scope/ceiling',
      'Classification + key registrations active; minor gaps',
      'All registrations active and cover target scope',
      'Fully proactive: tracks renewals, monitors new platform requirements'
    ]
  },
  {
    id: 2,
    name: 'Mandatory Documents & Certificates',
    nameAr: 'الوثائق والشهادات الإلزامية',
    weight: 12,
    measures: 'ISO (9001/14001/45001), HSE manual, financial statements, legal documents — validity, organization, and retrieval readiness.',
    levels: [
      'No organized document set',
      'Some documents exist but scattered or expired',
      'Core documents available but not indexed or version-controlled',
      'Documents organized and mostly current; minor expiries',
      'All mandatory documents current, indexed, and accessible',
      'Document library with auto-renewal tracking and master index'
    ]
  },
  {
    id: 3,
    name: 'Tender Parsing & Registers',
    nameAr: 'تحليل المناقصات والسجلات',
    weight: 10,
    measures: 'Ability to convert RFP into structured registers: requirements register, evaluation criteria register, BOQ register, WBS.',
    levels: [
      'No structured tender parsing process',
      'Reads tender but no formal register/checklist',
      'Creates ad-hoc checklists but misses sections',
      'Standard register template used; covers most sections',
      'Full parsing with requirements, evaluation, BOQ, WBS registers',
      'Parsing includes cross-reference to evidence and compliance matrix'
    ]
  },
  {
    id: 4,
    name: 'Methodology & Execution Planning',
    nameAr: 'المنهجية وتخطيط التنفيذ',
    weight: 12,
    measures: 'Realistic method statements, project schedule, resource plan, RACI matrix, mobilization plan.',
    levels: [
      'No method statements or execution plans',
      'Generic method statements not tailored to tender',
      'Tailored method statement but no schedule or resource plan',
      'Method statement + schedule exist; resource plan partial',
      'Complete execution package: method, schedule, resources, RACI',
      'Execution package includes risk register and mobilization timeline'
    ]
  },
  {
    id: 5,
    name: 'Pricing & Financial Integrity',
    nameAr: 'التسعير والسلامة المالية',
    weight: 12,
    measures: 'BOQ analysis, arithmetic checks, pricing assumptions, cashflow readiness, bid bond capability.',
    levels: [
      'No pricing process; guesswork-based',
      'Prices BOQ but no arithmetic checks',
      'Arithmetic checks done but no pricing assumptions documented',
      'Pricing with checks and assumptions; bond capability unclear',
      'Full pricing discipline: checks, assumptions, bond ready, cashflow plan',
      'Pricing includes sensitivity analysis and abnormally-low-bid justification'
    ]
  },
  {
    id: 6,
    name: 'Packaging & Formal Error Prevention',
    nameAr: 'التغليف ومنع الأخطاء الشكلية',
    weight: 10,
    measures: 'Submission checklist, file naming conventions, indexing, page numbering, cover letter, cross-reference discipline.',
    levels: [
      'No submission checklist or naming rules',
      'Ad-hoc packaging; frequent file naming errors',
      'Basic checklist exists but not consistently followed',
      'Checklist + naming convention followed; minor gaps',
      'Full packaging discipline: checklist, naming, indexing, cross-refs',
      'Packaging includes test-upload, proof-of-submission log, and QA review'
    ]
  },
  {
    id: 7,
    name: 'Confidentiality & Document Control',
    nameAr: 'السرية والتحكم بالوثائق',
    weight: 8,
    measures: 'NDA-first approach, access control, version control, audit trail, AI disclosure policy.',
    levels: [
      'No confidentiality or document control measures',
      'Basic folder structure but no access control',
      'Folder structure + some access control; no versioning',
      'Versioning in place; access controlled; no audit trail',
      'Full document control: versioning, access, audit trail',
      'Includes AI usage disclosure policy and NDA-first protocol'
    ]
  },
  {
    id: 8,
    name: 'Local Content (if applicable)',
    nameAr: 'المحتوى المحلي (إن وُجد)',
    weight: 6,
    measures: 'Ability to meet local content % requirements, evidence plan, supplier documentation.',
    levels: [
      'Not aware of local content requirements',
      'Aware but no plan or evidence',
      'Plan exists but no supporting evidence',
      'Plan + partial evidence; % calculation unclear',
      'Plan + evidence + clear % calculation',
      'Proactive: supplier database, evidence automation, exceeds minimum %'
    ]
  },
  {
    id: 9,
    name: 'Team Capability & CV Library',
    nameAr: 'قدرات الفريق ومكتبة السير الذاتية',
    weight: 10,
    measures: 'Key role coverage, CV templates, org chart, licenses/certifications, subcontractor readiness.',
    levels: [
      'No CV library or org chart',
      'CVs exist but outdated and not standardized',
      'Standard CV template; some roles covered',
      'CV library covers key roles; org chart exists',
      'Full CV library, org chart, subcontractor agreements',
      'CV library auto-updated; includes skills matrix and succession plan'
    ]
  },
  {
    id: 10,
    name: 'Learning Loop & Performance Tracking',
    nameAr: 'حلقة التعلم وتتبع الأداء',
    weight: 8,
    measures: 'Post-submission lessons learned, DQ reason capture, template updates, win/loss tracking.',
    levels: [
      'No post-submission review process',
      'Informal discussion after tender results',
      'Some lessons captured but not actioned',
      'Lessons captured and templates updated occasionally',
      'Systematic lessons learned with template updates and DQ tracking',
      'Full performance dashboard: win rate, DQ reasons, continuous improvement cycle'
    ]
  }
];

const INTERVIEW_SECTIONS = [
  {
    id: 'A',
    title: 'GM / Owner',
    titleAr: 'المدير العام / المالك',
    subtitle: 'Decision & Strategy',
    duration: '15 min',
    questions: [
      'What tender types do you target? (entities, values, regions, sectors)',
      'What causes NO-BID decisions today? What makes you walk away from a tender?',
      'What is your acceptable risk balance: price competitiveness vs compliance vs delivery capacity?',
      'How do you decide on partners or subcontractors for a specific tender?',
      'What is your biggest frustration with the current tender process?'
    ]
  },
  {
    id: 'B',
    title: 'Operations / Project Management',
    titleAr: 'العمليات / إدارة المشاريع',
    subtitle: 'Execution Reality',
    duration: '15 min',
    questions: [
      'Do you translate the SOW into a WBS and project schedule? Can you show the last example?',
      'How do you estimate durations and resource requirements for tender submissions?',
      'What are the top 5 execution risks you usually face on projects?',
      'How do you develop method statements — generic templates or tailored per tender?',
      'Do you have a standard mobilization plan and timeline?'
    ]
  },
  {
    id: 'C',
    title: 'Finance',
    titleAr: 'المالية',
    subtitle: 'Pricing & Guarantees',
    duration: '15 min',
    questions: [
      'How do you price BOQ items? What are your cost drivers and pricing assumptions?',
      'Do you run arithmetic checks and unpriced-item checks before submission?',
      'What is your bid bond issuance lead time and any constraints?',
      'Do you have cashflow capability for mobilization and payment delays?',
      'Have you ever been flagged for abnormally low pricing? How did you handle it?'
    ]
  },
  {
    id: 'D',
    title: 'HSE / QA-QC',
    titleAr: 'الصحة والسلامة / ضبط الجودة',
    subtitle: 'Compliance Evidence',
    duration: '15 min',
    questions: [
      'Which policies and manuals exist and are currently updated? (HSE manual, QA/QC manual, ITP)',
      'How do you prove compliance in tender submissions? Do you have an evidence pack?',
      'Have you received past tender feedback about HSE or QA/QC sections?',
      'Do you track incidents, NCRs, and corrective actions systematically?'
    ]
  },
  {
    id: 'E',
    title: 'HR / Admin',
    titleAr: 'الموارد البشرية / الإدارية',
    subtitle: 'CVs, Certificates, Registrations',
    duration: '15 min',
    questions: [
      'Where are CVs stored and how often are they updated?',
      'Are certificates and licenses tracked with expiry alerts?',
      'Who owns vendor registrations and platform accounts? (Etimad, Monafasat, etc.)',
      'Do you have a standard org chart and role descriptions for tender submissions?'
    ]
  },
  {
    id: 'F',
    title: 'Tender Coordinator',
    titleAr: 'منسق المناقصات',
    subtitle: 'Packaging & Submission',
    duration: '15 min',
    questions: [
      'Walk through the last submission: what files, naming rules, file splits, envelopes?',
      'How do you ensure cover letter, validity period, and bid bond are correctly placed?',
      'Do you keep submission proof logs, upload confirmations, and screenshots?',
      'What is your process for final QA review before hitting submit?',
      'How do you handle last-minute changes or amendments from the tendering entity?'
    ]
  }
];

const EVIDENCE_CATEGORIES = [
  {
    id: 1,
    category: 'Legal / Registration',
    categoryAr: 'قانوني / تسجيل',
    items: [
      { id: 1, document: 'Commercial Registration (CR) — valid and matching scope', documentAr: 'السجل التجاري — ساري ويطابق النشاط' },
      { id: 2, document: 'VAT Registration Certificate', documentAr: 'شهادة تسجيل ضريبة القيمة المضافة' },
      { id: 3, document: 'GOSI Certificate (active)', documentAr: 'شهادة التأمينات الاجتماعية (سارية)' },
      { id: 4, document: 'Bank account details / letterhead', documentAr: 'تفاصيل الحساب البنكي / ورقة رسمية' }
    ]
  },
  {
    id: 2,
    category: 'Eligibility',
    categoryAr: 'الأهلية',
    items: [
      { id: 5, document: 'Classification certificate (التصنيف) — valid, covers scope & ceiling', documentAr: 'شهادة التصنيف — سارية وتغطي النشاط والسقف' },
      { id: 6, document: 'Allowed activities list matching target tenders', documentAr: 'قائمة الأنشطة المسموح بها المطابقة للمناقصات المستهدفة' }
    ]
  },
  {
    id: 3,
    category: 'Qualification',
    categoryAr: 'التأهيل',
    items: [
      { id: 7, document: 'Prequalification / qualification records (التأهيل) if used', documentAr: 'سجلات التأهيل المسبق إن وُجدت' }
    ]
  },
  {
    id: 4,
    category: 'Certificates',
    categoryAr: 'الشهادات',
    items: [
      { id: 8, document: 'ISO 9001 / 14001 / 45001 certificates (as applicable)', documentAr: 'شهادات الأيزو 9001 / 14001 / 45001 (حسب الحاجة)' }
    ]
  },
  {
    id: 5,
    category: 'HSE',
    categoryAr: 'الصحة والسلامة',
    items: [
      { id: 9, document: 'HSE Manual + incident reporting procedure + training records', documentAr: 'دليل الصحة والسلامة + إجراءات الإبلاغ عن الحوادث + سجلات التدريب' }
    ]
  },
  {
    id: 6,
    category: 'QA/QC',
    categoryAr: 'ضبط الجودة',
    items: [
      { id: 10, document: 'QA/QC Manual + ITP templates + NCR process', documentAr: 'دليل ضبط الجودة + نماذج خطة الفحص + إجراءات عدم المطابقة' }
    ]
  },
  {
    id: 7,
    category: 'Team',
    categoryAr: 'الفريق',
    items: [
      { id: 11, document: 'Org chart + CVs of key roles + licenses/certifications', documentAr: 'الهيكل التنظيمي + السير الذاتية للأدوار الرئيسية + الرخص/الشهادات' }
    ]
  },
  {
    id: 8,
    category: 'Experience',
    categoryAr: 'الخبرات',
    items: [
      { id: 12, document: '3–5 similar projects: scope, value, client, contact, completion proofs', documentAr: '3–5 مشاريع مشابهة: النطاق، القيمة، العميل، جهة الاتصال، إثباتات الإنجاز' }
    ]
  },
  {
    id: 9,
    category: 'Financial',
    categoryAr: 'المالية',
    items: [
      { id: 13, document: 'Last 2 years financial statements', documentAr: 'القوائم المالية لآخر سنتين' },
      { id: 14, document: 'Bank line / bond capability letter', documentAr: 'خطاب القدرة البنكية / خطاب ضمان' }
    ]
  },
  {
    id: 10,
    category: 'Tender History',
    categoryAr: 'تاريخ المناقصات',
    items: [
      { id: 15, document: 'Last 3 tenders submitted: tender books + submissions + committee feedback', documentAr: 'آخر 3 مناقصات مقدمة: كراسات الشروط + العروض + ملاحظات اللجنة' }
    ]
  },
  {
    id: 11,
    category: 'Templates',
    categoryAr: 'النماذج',
    items: [
      { id: 16, document: 'Existing method statements, project plans, schedules, reporting templates', documentAr: 'منهجيات العمل الحالية، خطط المشاريع، الجداول الزمنية، نماذج التقارير' }
    ]
  },
  {
    id: 12,
    category: 'Local Content',
    categoryAr: 'المحتوى المحلي',
    items: [
      { id: 17, document: 'Local content policy + supplier list + evidence plan (if required)', documentAr: 'سياسة المحتوى المحلي + قائمة الموردين + خطة الإثبات (إن لزم)' }
    ]
  },
  {
    id: 13,
    category: 'Document Control',
    categoryAr: 'التحكم بالوثائق',
    items: [
      { id: 18, document: 'Folder structure, access rules, versioning approach', documentAr: 'هيكل المجلدات، قواعد الوصول، نهج التحكم بالإصدارات' }
    ]
  }
];

const DQ_CHECKS = [
  {
    id: 1,
    area: 'Specs / BOQ Integrity',
    areaAr: 'سلامة المواصفات / جدول الكميات',
    check: 'No edits, reservations, or alterations made to specs or BOQ issued by the tendering entity',
    checkAr: 'عدم وجود تعديلات أو تحفظات على المواصفات أو جدول الكميات',
    defaultSeverity: 5
  },
  {
    id: 2,
    area: 'Bid Bond',
    areaAr: 'الضمان الابتدائي',
    check: 'Bid bond / initial guarantee provided in the correct value, format, and validity period',
    checkAr: 'تقديم الضمان الابتدائي بالقيمة والشكل والمدة الصحيحة',
    defaultSeverity: 5
  },
  {
    id: 3,
    area: 'Bid Bond',
    areaAr: 'الضمان الابتدائي',
    check: 'Bid bond placed in the correct file, envelope, or package as required',
    checkAr: 'وضع الضمان في الملف أو المظروف الصحيح',
    defaultSeverity: 5
  },
  {
    id: 4,
    area: 'Mandatory Certificates',
    areaAr: 'الشهادات الإلزامية',
    check: 'All mandatory certificates provided, valid (not expired), and matching the entity requirements',
    checkAr: 'جميع الشهادات الإلزامية مقدمة وسارية ومطابقة',
    defaultSeverity: 4
  },
  {
    id: 5,
    area: 'Cover Letter',
    areaAr: 'خطاب التقديم',
    check: 'Cover letter included, correctly addressed, signed, and stamped',
    checkAr: 'خطاب التقديم مرفق وموجه ومختوم وموقع',
    defaultSeverity: 4
  },
  {
    id: 6,
    area: 'Offer Validity',
    areaAr: 'صلاحية العرض',
    check: 'Offer validity period matches or exceeds the requirement stated in tender documents',
    checkAr: 'مدة صلاحية العرض تطابق أو تتجاوز المطلوب',
    defaultSeverity: 4
  },
  {
    id: 7,
    area: 'Samples / Site Visit',
    areaAr: 'العينات / زيارة الموقع',
    check: 'Samples or site visit proof provided if required by tender conditions',
    checkAr: 'تقديم العينات أو إثبات زيارة الموقع إن تطلبت الشروط',
    defaultSeverity: 3
  },
  {
    id: 8,
    area: 'Arithmetic',
    areaAr: 'الحساب',
    check: 'Arithmetic checks completed; errors (if any) within acceptable threshold',
    checkAr: 'اكتمال المراجعة الحسابية والأخطاء ضمن الحد المقبول',
    defaultSeverity: 4
  },
  {
    id: 9,
    area: 'Pricing Completeness',
    areaAr: 'اكتمال التسعير',
    check: 'No unpriced items; all unit rates studied and realistic',
    checkAr: 'عدم وجود بنود بدون تسعير وجميع الأسعار مدروسة',
    defaultSeverity: 5
  },
  {
    id: 10,
    area: 'Pricing Completeness',
    areaAr: 'اكتمال التسعير',
    check: 'Abnormally low bid justification ready if total is significantly below estimate',
    checkAr: 'تبرير العرض المنخفض جاهز إن كان الإجمالي أقل بكثير من التقدير',
    defaultSeverity: 3
  },
  {
    id: 11,
    area: 'Local Content',
    areaAr: 'المحتوى المحلي',
    check: 'Local content percentage stated and meets the minimum requirement',
    checkAr: 'نسبة المحتوى المحلي مذكورة وتحقق الحد الأدنى',
    defaultSeverity: 3
  },
  {
    id: 12,
    area: 'Packaging',
    areaAr: 'التغليف',
    check: 'File naming, indexing, page numbering, and envelope labeling complete',
    checkAr: 'اكتمال تسمية الملفات والفهرسة والترقيم وتسمية المظاريف',
    defaultSeverity: 3
  },
  {
    id: 13,
    area: 'Submission',
    areaAr: 'التقديم',
    check: 'Submission log prepared; upload test-run completed before deadline',
    checkAr: 'سجل التقديم جاهز واكتمال التجربة قبل الموعد النهائي',
    defaultSeverity: 4
  }
];

const DQ_RISK_AREAS = [
  'Specs / BOQ Integrity',
  'Bid Bond',
  'Mandatory Certificates',
  'Cover Letter',
  'Offer Validity',
  'Samples / Site Visit',
  'Arithmetic',
  'Pricing Completeness',
  'Local Content',
  'Packaging',
  'Submission'
];

const OUTREACH_TEMPLATES = [
  {
    id: 'whatsapp-ar',
    type: 'WhatsApp',
    language: 'ar',
    label: 'WhatsApp (Arabic)',
    content: `السلام عليكم،

أنا [الاسم] من شركة NASL.

نساعد شركات المقاولات والتشغيل والصيانة في تقليل مخاطر الاستبعاد من المناقصات على منصة اعتماد، وبناء نظام امتثال جاهز للتقديم.

نقدم خدمة "تقييم جاهزية المنافسات" خلال أسبوعين، تشمل:
- تقييم شامل لجاهزية المنافسات (درجة من 100)
- تحديد مخاطر الاستبعاد الشكلي
- خارطة طريق 30/60/90 يوم للتحسين

التكلفة: 2,000 ريال سعودي

للبدء، نحتاج منكم:
1. اسم الشركة والقطاع
2. رابط أو قيمة آخر مناقصة
3. وقت مناسب لاجتماع ساعتين

هل تودون الحجز؟`
  },
  {
    id: 'whatsapp-en',
    type: 'WhatsApp',
    language: 'en',
    label: 'WhatsApp (English)',
    content: `Hello,

I'm [Name] from NASL.

We help contractors, O&M, and FM companies reduce tender disqualification risk on Etimad and build a submission-ready compliance system.

Our "Tender Readiness Audit" service (2-week turnaround) includes:
- Comprehensive readiness score (0-100)
- Disqualification risk identification
- 30/60/90-day improvement roadmap

Fee: SAR 2,000

To get started, we need:
1. Company name and sector
2. Link or value of a recent tender
3. Availability for a 2-hour session

Would you like to book?`
  },
  {
    id: 'email-ar',
    type: 'Email',
    language: 'ar',
    label: 'Email (Arabic)',
    subject: 'تقييم جاهزية المنافسات على اعتماد — خفض مخاطر الاستبعاد',
    content: `الموضوع: تقييم جاهزية المنافسات على اعتماد (خفض مخاطر الاستبعاد)

السلام عليكم ورحمة الله وبركاته،

تحية طيبة وبعد،

كثير من الشركات تخسر مناقصات ليس بسبب السعر أو الخبرة، بل بسبب أخطاء شكلية: ضمان ابتدائي ناقص، شهادات منتهية، خطاب تقديم غير مكتمل، أو تغليف غير مطابق.

نقدم في NASL خدمة "تقييم جاهزية المنافسات" المصممة خصيصاً لشركات المقاولات والتشغيل والصيانة.

ما ستحصلون عليه:
• درجة جاهزية من 100 مع تصنيف (أخضر / أصفر / أحمر)
• تحديد مخاطر الاستبعاد الشكلي
• خارطة طريق 30/60/90 يوم
• تقرير تنفيذي مع توصيات محددة

التكلفة: 2,000 ريال سعودي | التسليم: خلال أسبوعين

للبدء، نرجو إرسال:
1. السجل التجاري (CR)
2. شهادة التصنيف
3. شهادات الأيزو (إن وُجدت)
4. آخر 1-2 مناقصة مقدمة

مع التحية،
[الاسم]
NASL`
  },
  {
    id: 'email-en',
    type: 'Email',
    language: 'en',
    label: 'Email (English)',
    subject: 'Etimad Tender Readiness Audit — Reduce Disqualification Risk',
    content: `Subject: Etimad Tender Readiness Audit (Reduce Disqualification Risk)

Dear [Name],

Many companies lose tenders not because of price or experience, but because of formal errors: incomplete bid bonds, expired certificates, missing cover letters, or non-compliant packaging.

At NASL, we offer a "Tender Readiness Audit" designed specifically for contractors, O&M, and FM companies.

What you'll receive:
• Readiness score out of 100 with tier rating (GREEN / AMBER / RED)
• Disqualification risk identification
• 30/60/90-day improvement roadmap
• Executive report with specific recommendations

Fee: SAR 2,000 | Delivery: Within 2 weeks

To get started, please send:
1. Commercial Registration (CR)
2. Classification certificate
3. ISO certificates (if available)
4. Last 1-2 tender submissions

Best regards,
[Name]
NASL`
  }
];

const SECTORS = [
  'Construction',
  'Facility Management (FM)',
  'Operations & Maintenance (O&M)',
  'IT & Technology',
  'Consulting',
  'Supply & Logistics',
  'Healthcare',
  'Education',
  'Energy',
  'Other'
];

const TIER_CONFIG = {
  GREEN: { min: 80, label: 'GREEN', labelAr: 'أخضر', color: '#10b981', bg: '#ecfdf5', description: 'Ready to submit' },
  AMBER: { min: 60, label: 'AMBER', labelAr: 'أصفر', color: '#f59e0b', bg: '#fffbeb', description: 'Needs fixes within 48-72 hours' },
  RED:   { min: 0,  label: 'RED',   labelAr: 'أحمر', color: '#ef4444', bg: '#fef2f2', description: 'High disqualification risk — stop submission' }
};

function getTier(score) {
  if (score >= 80) return 'GREEN';
  if (score >= 60) return 'AMBER';
  return 'RED';
}

function getRiskLevel(riskScore) {
  if (riskScore >= 40) return 'RED';
  if (riskScore >= 15) return 'AMBER';
  return 'GREEN';
}
