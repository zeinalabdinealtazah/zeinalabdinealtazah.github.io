const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGSAP = !!(window.gsap && window.ScrollTrigger);
const isRTL = () => root.dir === 'rtl';
const isNarrow = () => innerWidth < 900;

/* =========================================================
   Copy — English lives in the HTML; Arabic (فصحى) lives here.
   DYN holds strings that only exist in JS.
   ========================================================= */
const AR = {
    'skip': 'انتقل إلى المحتوى',
    'name': 'زين التزه',
    'name.full': 'زين العابدين التزه',
    'nav.work': 'أعمالي',
    'nav.about': 'نبذة',
    'nav.skills': 'الأدوات',
    'nav.experience': 'الخبرات',
    'nav.contact': 'تواصل',
    'nav.cta': 'لنتحدث',

    'hero.status': 'متاح لفرص جديدة',
    'hero.dubai': 'دبي',
    'hero.first': 'زين العابدين',
    'hero.last': 'التزه',
    'hero.role': 'مهندس برمجيات أول في الذكاء الاصطناعي',
    'hero.cta1': 'استعرض أعمالي',
    'hero.cta2': 'تواصل معي',
    'hero.scroll': 'مرّر',
    'hero.hint': 'انقر لترى الصورة تتشكّل من جديد',

    'statement.label': 'باختصار',
    'statement.text': 'أنقل منتجات الذكاء الاصطناعي من الفكرة الأولى إلى متاجر التطبيقات — المعمارية والخادم والواجهة والنماذج التي تمنحها ذكاءها — وأواصل رعايتها بعد الإطلاق بوقت طويل.',
    'stats.api': 'نقطة اتصال API',
    'stats.models': 'نموذج بيانات',
    'stats.tests': 'اختبار آلي',
    'stats.platforms': 'منصات أُطلق عليها',

    'work.label': 'أعمال مختارة',
    'work.kicker': 'دراسة حالة · 2026',
    'work.role': 'الدور',
    'work.roleVal': 'المهندس الرئيسي من البداية إلى النهاية',
    'work.company': 'الشركة',
    'work.status': 'الحالة',
    'work.statusVal': 'يعمل في بيئة الإنتاج',
    'work.visit': 'زيارة onsta.ai',
    'work.hint': 'تابع التمرير لاستكشاف بنية النظام',
    'arch.client': 'الواجهة',
    'arch.api': 'واجهة API',
    'arch.data': 'البيانات',
    'arch.ai': 'الذكاء',
    'arch.infra': 'البنية التحتية',
    'layer.client.stat': 'منصات بقاعدة كود واحدة',
    'layer.api.stat': 'نقطة اتصال API',
    'layer.data.stat': 'نموذج بيانات',
    'layer.ai.stat': 'في صميم المنتج',
    'layer.infra.stat': 'اختبار آلي',

    'about.label': 'نبذة',
    'about.title': 'مهندسٌ بالمهنة، <em class="serif">وصانعٌ</em> بالفطرة.',
    'about.alt': 'صورة شخصية لزين',
    'about.p1': 'يقع معظم عملي حيث تلتقي هندسة المنتجات بالذكاء الاصطناعي التطبيقي: أصمّم نموذج البيانات، وأكتب الواجهات البرمجية، وأبني الواجهة، وأدمج النماذج التي تمنح المنتج ذكاءه، وأُعدّ المنظومة التي تُبقيه يعمل.',
    'about.p2': 'قبل ONSTA عملتُ سنوات مستقلاً — تطبيقات ويب وجوال مخصّصة، وروبوتات محادثة، وأتمتة قائمة على النماذج اللغوية لعملاء في سوريا ودبي — كما قُدت الدعم التقني لبنية تحتية حساسة. علّمني هذا المزيج أن أهتم بالموثوقية بقدر اهتمامي بالمزايا.',
    'facts.based': 'مقيم في',
    'facts.basedVal': 'دبي، الإمارات العربية المتحدة',
    'facts.lang': 'اللغات',
    'facts.langVal': 'العربية، الإنجليزية',
    'facts.open': 'متاح لـ',
    'facts.openVal': 'الوظائف بدوام كامل، والعمل الحر، والشراكات',

    'skills.label': 'الأدوات',
    'skills.title': 'الأدوات التي <em class="serif">أعتمد عليها</em>.',
    'skills.ai': 'الذكاء الاصطناعي',
    'skills.aiDesc': 'Gemini و OpenAI في بيئة الإنتاج — تحليل وتوليد ومعالجة صوتية ووكلاء أذكياء.',
    'skills.lang': 'لغات البرمجة',
    'skills.front': 'الواجهات وتطبيقات الجوال',
    'skills.back': 'الخادم والبيانات',
    'skills.cloud': 'السحابة و DevOps',
    'skills.test': 'التكاملات والاختبارات',

    'exp.label': 'الخبرات',
    'exp.title': 'حيث <em class="serif">أطلقتُ</em> أعمالي.',
    'exp.j1.date': 'مايو 2026 — حتى الآن',
    'exp.j1.title': 'مهندس برمجيات أول في الذكاء الاصطناعي',
    'exp.j1.org': 'Helcoo AI · دبي',
    'exp.j1.desc': 'قُدتُ بناء ONSTA وإطلاقه بالكامل على الويب و iOS و Android — المعمارية، والخادم، وتكاملات الذكاء الاصطناعي، وأدوات الإدارة، والبنية التحتية، وأكثر من 6,500 اختبار آلي.',
    'exp.j2.date': '2021 — حتى الآن',
    'exp.j2.title': 'مطوّر برمجيات مستقل',
    'exp.j2.org': 'عمل حر · سوريا / دبي',
    'exp.j2.desc': 'تطبيقات ويب وجوال مخصّصة، وروبوتات محادثة، وتكامل مع النماذج اللغوية، وأتمتة لسير العمل — من مرحلة الاستكشاف حتى النشر والصيانة.',
    'exp.j3.date': '2024 — 2026',
    'exp.j3.title': 'قائد الدعم التقني / كبير الفنيين',
    'exp.j3.org': 'Crypto Miners AE · دبي',
    'exp.j3.desc': 'حافظتُ على جاهزية البنية التحتية الحساسة بأعلى مستوى، وتولّيت أنظمة التحكم في الدخول والمراقبة وتشخيص الأجهزة، ومعالجة المشكلات التقنية المعقدة.',
    'award.eyebrow': 'تكريم',
    'award.title': 'موظف العام',
    'award.hint': 'انقر للاحتفال 🎉',

    'contact.label': 'تواصل',
    'contact.t1': 'لنبنِ معاً',
    'contact.t2': 'شيئاً استثنائياً.',
    'contact.copy': 'نسخ',
    'contact.alt': 'زين يشير نحو الزائر',
    'form.q': 'ما الذي أتى بك إلى هنا؟',
    'form.hiring': 'لديّ فرصة عمل',
    'form.project': 'مشروع مستقل',
    'form.collab': 'تعاون مشترك',
    'form.hi': 'أردت إلقاء التحية',
    'form.name': 'اسمك',
    'form.msg': 'رسالتك',
    'form.send': 'أرسل الرسالة',
    'form.note': 'سيُفتح تطبيق البريد لديك وقد جُهّز كل شيء.',
    'footer.made': 'صُمّم وطُوّر في دبي',
    'footer.top': 'العودة للأعلى',
    'work.tagline': 'منصة للعناية بالبشرة والجمال والعافية مدعومة بالذكاء الاصطناعي — متاحة على App Store و Google Play والويب، بالعربية والإنجليزية.',
    'work.b1': 'قاعدة كود واحدة بـ React و TypeScript تعمل كتطبيق ويب تقدّمي (PWA) وعلى iOS و Android عبر Capacitor، مع تتبّع الوجه واليد على الجهاز نفسه بـ MediaPipe لالتقاط الصور بتوجيه ومن دون لمس.',
    'work.b2': 'خادم مبني بـ Fastify مع مصادقة JWT وتسجيل الدخول بحسابات Google و Apple، واشتراكات عبر Stripe و RevenueCat، وإشعارات فورية على الويب والجوال.',
    'work.b3': 'قاعدة بيانات PostgreSQL ‏(Aurora) تضم 55 نموذجاً عبر Prisma، مع Redis ‏(ElastiCache) للتخزين المؤقت والبيانات سريعة التغيّر.',
    'work.b4': 'يكتب Google Gemini، عبر خدمة تحليل مبنية بـ Python، تقارير الوجه واليدين والأظافر والجسم، إضافة إلى التحقق من العمر وإنشاء الصور الرمزية والإملاء الصوتي.',
    'work.b5': 'خدمات ECS Fargate و Aurora و ElastiCache و S3/CloudFront و SES و SNS على AWS، تُنشر عبر Docker و GitHub Actions: إصدارات مع فحوص سلامة، وآلية للتراجع، ومراقبة عبر Sentry، وأكثر من 6,500 اختبار آلي.',
    'work.b6': 'لوحة إدارة ثنائية اللغة: مؤشرات الأداء، وإخفاقات التحليل بالذكاء الاصطناعي وتكاليفه، والاشتراكات، وخريطة للمستخدمين مع حملات إشعارات، ودعم مباشر، وسجل تدقيق.',
    'arch.admin': 'الإدارة',
    'layer.admin.stat': 'لوحة ثنائية اللغة',
    'onsta.note': 'لقطات من التطبيق المنشور · حساب تجريبي',
    'onsta.altHome': 'الشاشة الرئيسية في ONSTA',
    'onsta.altReport': 'تقرير تحليل البشرة في ONSTA',
    'onsta.altProfile': 'شاشة الحساب في ONSTA',
    'edu.mech': 'هندسة الميكاترونيكس · 2018–2024',
    'edu.mechVal': 'جامعة تشرين، اللاذقية — أُنجزت المقررات الدراسية',
    'edu.it': 'بكالوريوس تقانة المعلومات · قيد الدراسة',
    'edu.itVal': 'الجامعة الافتراضية السورية',
    'exp.j4.title': 'مشرف ومسؤول تقنية المعلومات',
    'exp.j4.org': 'الفؤاد للتحويلات المالية · سوريا',
    'exp.j4.desc': 'أشرفتُ على فريق المركز ونظّمت سير العمل اليومي، وتولّيت تقنية المعلومات بالكامل: الشبكة، وكاميرات المراقبة، والأنظمة، وتجهيزات المركز من حواسيب ومحمولات وطابعات. ونلتُ لقب موظف العام.',
    'award.org': 'الفؤاد للتحويلات المالية',
    'onsta.altAi': 'ONSTA — المرآة الذكية',
    'p3.home': 'الرئيسية', 'p3.ai': 'المرآة الذكية', 'p3.report': 'التقرير', 'p3.profile': 'الحساب',
    'p3.spin': 'تدوير 360°', 'p3.tabs': 'شاشات ONSTA', 'p3.hint': 'اسحب للتدوير · وتنقّل بين التبويبات',
    'p3.label': 'ONSTA على آيفون — اسحب أو استخدم الأسهم للتدوير',
    'exp.j4.date': 'يونيو 2023 — يونيو 2024',
    'nav.lab': 'المختبر',
    'lab.label': 'المختبر',
    'lab.title': 'أشياء <em class="serif">بنيتها لأستكشف</em>.',
    'lab.lead': 'مشاريع تجريبية بُنيت لهذا الموقع، وليست أعمالاً لعملاء. كل واحد منها يعمل هنا في متصفحك؛ افتحه وجرّبه.',
    'lab.open': 'افتح التجربة',
    'lab.badge': 'مختبر · تجريبي',
    'lab.close': 'إغلاق',
    'lab.chat.t': 'مساعد دعم ذكي بالعربية',
    'lab.chat.d': 'يفهم اللهجة الشامية والخليجية والفصحى: يحسب رسوم التحويل، ويتتبّع الحوالات، ويجيب عن أسئلة الفروع.',
    'lab.capture.t': 'التصوير بدون لمس',
    'lab.capture.d': 'تعمل معالم الوجه من MediaPipe على جهازك، وتلتقط الصورة بنفسها عندما تكون في الإطار وثابتاً.',
    'lab.dashboard.t': 'لوحة إدارة حيّة',
    'lab.dashboard.d': 'لوحة بيانات ثنائية اللغة تتحدّث لحظياً: مؤشرات الأداء، وتكلفة الذكاء حسب التقرير، والمستخدمون حسب المدينة، وسجل الأحداث.',
    'lab.network.t': 'مراقبة شبكة الفرع',
    'lab.network.d': 'الموجّهات والحواسيب والطابعات والكاميرات في فرع واحد على خريطة حيّة، مع التنبيهات والتشخيص بنقرة.',
    'lab.rtl.t': 'ساحة تجربة الاتجاهين',
    'lab.rtl.d': 'البطاقة نفسها مبنية بطريقتين — بدّل الاتجاه لترى لماذا تُبقي الخصائص المنطقية في CSS الواجهات العربية صحيحة.',
    'lab.cost.t': 'حاسبة تكلفة الذكاء الاصطناعي',
    'lab.cost.d': 'احسب الفاتورة الشهرية لميزة ذكاء اصطناعي من حجم الطلبات والرموز والتخزين المؤقت، عبر نماذج صغيرة ومتوسطة وكبيرة.',
    'cv.download': 'تحميل السيرة الذاتية',
    'cv.short': 'السيرة الذاتية · PDF',
    'palette.ph': 'اكتب أمراً أو انتقل إلى قسم…',
    'palette.foot': '↑ ↓ للتنقل · Enter للتنفيذ · Esc للإغلاق',
    'sb.ok': 'لا مشكلات',
};

const DYN = {
    en: {
        morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening', night: 'Up late',
        words: ['AI products', 'mobile apps', 'scalable APIs', 'smart dashboards'],
        // One line per pose: greeting, invitation (pointing), the launch (celebrating), availability (composed).
        bubbles: ["Hello, I'm Zein.", "Have a product in mind? Let's talk.", "Let's make your launch the next win.", 'Open to new roles in Dubai.'],
        cursor: { 'work.visit': 'Visit ↗', 'award.cursor': '🎉', 'contact.mail': 'Email ✉' },
        copied: 'Email copied ✓', copyFail: 'Copy failed — please copy it manually',
        celebrate: 'Thanks for celebrating with me! 🎉',
        formMissing: 'Please add your name and a message',
        formSent: 'Opening your email app… ✉️',
        subjects: { hiring: 'Job opportunity', project: 'Freelance project', collab: 'Collaboration', hi: 'Hello from your portfolio' },
        langLabel: 'التبديل إلى العربية', langBtn: 'ع', pose: 'Change pose', palette: 'Open command palette',
        day: 'Day theme', night: 'Night theme', until: 'until', auto: 'Auto',
        modes: { auto: 'Theme: automatic (by time of day)', light: 'Theme: light', dark: 'Theme: dark' },
        groups: { nav: 'GO TO', act: 'ACTIONS', link: 'LINKS' },
        cmd: {
            top: 'Home', work: 'Work — ONSTA case study', lab: 'Lab — experimental projects', about: 'About', skills: 'Toolkit', experience: 'Experience', contact: 'Contact',
            themeAuto: 'Theme: automatic (by time of day)', themeLight: 'Theme: light', themeDark: 'Theme: dark',
            cv: 'Download CV (PDF)',
            lang: 'Switch to Arabic', copy: 'Copy email address', rebuild: 'Rebuild my portrait',
            linkedin: 'Open LinkedIn', whatsapp: 'Message on WhatsApp', onsta: 'Visit onsta.ai',
        },
        empty: 'No matching commands',
    },
    ar: {
        morning: 'صباح الخير', afternoon: 'طاب يومك', evening: 'مساء الخير', night: 'تسهر لوقت متأخر',
        words: ['منتجات الذكاء الاصطناعي', 'تطبيقات الجوال', 'أنظمة قابلة للتوسّع', 'لوحات تحكم ذكية'],
        bubbles: ['مرحباً، أنا زين.', 'لديك فكرة منتج؟ لنتحدث.', 'لنجعل إطلاقك القادم نجاحاً.', 'منفتح على فرص جديدة في دبي.'],
        cursor: { 'work.visit': 'زيارة ↗', 'award.cursor': '🎉', 'contact.mail': 'راسلني ✉' },
        copied: 'نُسخ البريد الإلكتروني ✓', copyFail: 'تعذّر النسخ — يُرجى نسخه يدوياً',
        celebrate: 'شكراً لمشاركتي الاحتفال! 🎉',
        formMissing: 'يُرجى كتابة اسمك ورسالتك',
        formSent: 'جارٍ فتح تطبيق البريد… ✉️',
        subjects: { hiring: 'فرصة عمل', project: 'مشروع مستقل', collab: 'تعاون', hi: 'تحية من موقعك' },
        langLabel: 'Switch to English', langBtn: 'EN', pose: 'تغيير الوضعية', palette: 'فتح لوحة الأوامر',
        day: 'المظهر النهاري', night: 'المظهر الليلي', until: 'حتى', auto: 'تلقائي',
        modes: { auto: 'المظهر: تلقائي (حسب الوقت)', light: 'المظهر: فاتح', dark: 'المظهر: داكن' },
        groups: { nav: 'انتقال', act: 'إجراءات', link: 'روابط' },
        cmd: {
            top: 'الرئيسية', work: 'أعمالي — دراسة حالة ONSTA', lab: 'المختبر — مشاريع تجريبية', about: 'نبذة', skills: 'الأدوات', experience: 'الخبرات', contact: 'تواصل',
            themeAuto: 'المظهر: تلقائي (حسب الوقت)', themeLight: 'المظهر: فاتح', themeDark: 'المظهر: داكن',
            cv: 'تحميل السيرة الذاتية (PDF)',
            lang: 'Switch to English', copy: 'نسخ البريد الإلكتروني', rebuild: 'أعِد بناء صورتي',
            linkedin: 'فتح LinkedIn', whatsapp: 'مراسلة عبر WhatsApp', onsta: 'زيارة onsta.ai',
        },
        empty: 'لا توجد أوامر مطابقة',
    },
};
const t = () => DYN[root.lang === 'ar' ? 'ar' : 'en'];

/* =========================================================
   Word splitting (whole words, so Arabic letters stay joined)
   ========================================================= */
function splitWords(el) {
    let i = 0;
    const walk = node => {
        [...node.childNodes].forEach(child => {
            if (child.nodeType === 3) {
                const frag = document.createDocumentFragment();
                child.textContent.split(/(\s+)/).forEach(part => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.append(' '); return; }
                    const w = document.createElement('span');
                    w.className = 'w';
                    const wi = document.createElement('span');
                    wi.className = 'wi';
                    wi.style.setProperty('--i', i++);
                    wi.textContent = part;
                    w.append(wi);
                    frag.append(w);
                });
                child.replaceWith(frag);
            } else if (child.nodeType === 1 && !child.classList.contains('w')) {
                walk(child);
            }
        });
    };
    walk(el);
}

/* =========================================================
   Language
   ========================================================= */
const i18n = { text: $$('[data-i18n]'), html: $$('[data-i18n-html]'), alt: $$('[data-i18n-alt]'), ph: $$('[data-i18n-ph]'), aria: $$('[data-i18n-aria]') };
i18n.aria.forEach(el => { el.dataset.enAria = el.getAttribute('aria-label'); });
i18n.text.forEach(el => { el.dataset.en = el.textContent; });
i18n.ph.forEach(el => { el.dataset.en = el.placeholder; });
i18n.html.forEach(el => { el.dataset.en = el.innerHTML; });
i18n.alt.forEach(el => { el.dataset.en = el.alt; });

function applyCopy() {
    const ar = root.lang === 'ar';
    i18n.text.forEach(el => { el.textContent = ar ? (AR[el.dataset.i18n] ?? el.dataset.en) : el.dataset.en; });
    i18n.html.forEach(el => { el.innerHTML = ar ? (AR[el.dataset.i18nHtml] ?? el.dataset.en) : el.dataset.en; });
    i18n.alt.forEach(el => { el.alt = ar ? (AR[el.dataset.i18nAlt] ?? el.dataset.en) : el.dataset.en; });
    i18n.ph.forEach(el => { el.placeholder = ar ? (AR[el.dataset.i18nPh] ?? el.dataset.en) : el.dataset.en; });
    i18n.aria.forEach(el => { el.setAttribute('aria-label', ar ? (AR[el.dataset.i18nAria] ?? el.dataset.enAria) : el.dataset.enAria); });
    $$('.split, .scrub').forEach(splitWords);
    prepNameWeight();
    $$('[data-shot]').forEach(img => { img.src = `assets/onsta/${ar ? 'ar' : 'en'}-${img.dataset.shot}.webp`; });
    $$('.type').forEach(prepType);
    $('#sbLang').textContent = ar ? 'AR' : 'EN';
    $('#paletteBtn').setAttribute('aria-label', t().palette);
    $('#langToggle').textContent = t().langBtn;
    $('#langToggle').setAttribute('aria-label', t().langLabel);
    updateThemeLabel();
    $('#pose').setAttribute('aria-label', t().pose);
    updateGreeting();
    resetRotator();
    // A bubble already on screen follows the language (and its side of the photo).
    if (pose.classList.contains('is-shown')) showBubble();
}

function setLang(lang) {
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('lang', lang); } catch (e) {}
    applyCopy();
    document.dispatchEvent(new Event('langchange'));
    $$('.split.in').forEach(el => { el.classList.remove('in'); void el.offsetWidth; el.classList.add('in'); });
    // Headings that were already typed get typed again in the new language.
    $$('.type[data-done]').forEach(el => setTimeout(() => runType(el), typeDelay(el)));
    updateScrub();
    if (hasGSAP) ScrollTrigger.refresh();
    field?.relayout();
    moveBlobs();
}
$('#langToggle').addEventListener('click', () => setLang(root.lang === 'ar' ? 'en' : 'ar'));

/* =========================================================
   Theme
   ========================================================= */
// Three theme modes. "auto" (the default) is light from 07:00 to 19:00 on the visitor's
// clock and dark otherwise, re-checked every half minute; "light" and "dark" are pinned
// by the visitor and remembered.
const DAY_START = 7, DAY_END = 19;
const MODES = ['auto', 'light', 'dark'];
const forcedTheme = /[?&]theme=(light|dark)/.exec(location.search)?.[1];   // preview links only
const scheduledTheme = () => (h => h >= DAY_START && h < DAY_END)(new Date().getHours()) ? 'light' : 'dark';
let themeMode = MODES.includes(root.dataset.themeMode) ? root.dataset.themeMode : 'auto';
const resolveTheme = () => forcedTheme || (themeMode === 'auto' ? scheduledTheme() : themeMode);
function updateThemeLabel() {
    const light = root.dataset.theme === 'light', d = t();
    const until = String(light ? DAY_END : DAY_START).padStart(2, '0') + ':00';
    $('#sbTheme').textContent = themeMode === 'auto'
        ? `◐ ${d.auto} · ${light ? d.day : d.night} · ${d.until} ${until}`
        : `${light ? '☀' : '☾'} ${light ? d.day : d.night}`;
    $('#themeBtn').setAttribute('aria-label', d.modes[themeMode]);
    $('#themeBtn').title = d.modes[themeMode];
}
function applyTheme(next, fade) {
    if (next !== root.dataset.theme) {
        if (fade) {
            root.classList.add('theme-fade');
            setTimeout(() => root.classList.remove('theme-fade'), 1300);
        }
        root.dataset.theme = next;
        $('meta[name="theme-color"]').content = next === 'dark' ? '#0b0a10' : '#f4f4f8';
        field?.setTheme(next);
    }
    updateThemeLabel();
}
function setThemeMode(mode) {
    themeMode = mode;
    root.dataset.themeMode = mode;
    try { mode === 'auto' ? localStorage.removeItem('themeMode') : localStorage.setItem('themeMode', mode); } catch (e) {}
    applyTheme(resolveTheme(), !reduceMotion);
    toast(t().modes[mode]);
}
$('#themeBtn').addEventListener('click', () => setThemeMode(MODES[(MODES.indexOf(themeMode) + 1) % MODES.length]));
setInterval(() => applyTheme(resolveTheme(), !reduceMotion), 30000);

/* =========================================================
   Greeting, Dubai clock, rotating word
   ========================================================= */
function updateGreeting() {
    const h = new Date().getHours();
    const d = t();
    $('#greeting').textContent = h < 5 ? d.night : h < 12 ? d.morning : h < 18 ? d.afternoon : d.evening;
}
const dubaiTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' });
const tick = () => {
    const now = dubaiTime.format(new Date());
    $('#clock').textContent = now;
    $('#sbTime').textContent = `Dubai ${now}`;
};
tick();
setInterval(tick, 10000);

// `$ zein build "…"` — the argument is typed, held, then backspaced, like a terminal.
const rotator = $('#rotator');
let rotTimer;
function resetRotator() {
    clearTimeout(rotTimer);
    const words = t().words;
    rotator.innerHTML = '"<bdi class="tok-word"></bdi>"';
    const out = rotator.querySelector('bdi');
    out.dir = root.lang === 'ar' ? 'rtl' : 'ltr';
    let w = 0, n = reduceMotion ? words[0].length : 0, deleting = false;
    out.textContent = words[0].slice(0, n);
    if (reduceMotion) return;
    const step = () => {
        const word = words[w];
        if (!deleting) {
            out.textContent = word.slice(0, ++n);
            if (n >= word.length) { deleting = true; rotTimer = setTimeout(step, 1900); return; }
            rotTimer = setTimeout(step, 50 + Math.random() * 45);
        } else {
            out.textContent = word.slice(0, --n);
            if (n <= 0) { deleting = false; w = (w + 1) % words.length; rotTimer = setTimeout(step, 320); return; }
            rotTimer = setTimeout(step, 26);
        }
    };
    rotTimer = setTimeout(step, 700);
}

// Headings type themselves in. Every text node is split into a typed part and an
// invisible untyped part, so the heading keeps its final size and nothing below jumps.
function prepType(el) {
    if (reduceMotion) return;
    cancelAnimationFrame(el._raf);
    const walk = node => [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
            const tn = document.createElement('span');
            tn.className = 'tn';
            tn.dataset.full = child.textContent;
            const ty = document.createElement('span');
            ty.className = 'ty';
            const un = document.createElement('span');
            un.className = 'un';
            un.textContent = child.textContent;
            tn.append(ty, un);
            child.replaceWith(tn);
        } else if (child.nodeType === 1 && !child.classList.contains('tn')) {
            walk(child);
        }
    });
    walk(el);
}
const typeTotal = el => $$('.tn', el).reduce((a, p) => a + p.dataset.full.length, 0);
const typePer = total => Math.max(16, Math.min(46, 1100 / total));
// A heading made of two typed lines types them one after the other.
function typeDelay(el) {
    const prev = el.previousElementSibling;
    if (!prev?.classList.contains('type')) return 0;
    const total = typeTotal(prev);
    return typeDelay(prev) + total * typePer(total);
}
function runType(el) {
    if (reduceMotion) return;
    const parts = $$('.tn', el);
    if (!parts.length) return;
    cancelAnimationFrame(el._raf);
    el.querySelector('.type-caret')?.remove();
    el.previousElementSibling?.querySelector('.type-caret')?.remove();
    const total = typeTotal(el);
    const per = typePer(total);
    const caret = document.createElement('span');
    caret.className = 'type-caret';
    caret.setAttribute('aria-hidden', 'true');
    const start = performance.now();
    const step = now => {
        let left = Math.min(Math.floor((now - start) / per), total);
        const shown = left;
        parts.forEach(p => {
            const full = p.dataset.full, k = Math.max(0, Math.min(left, full.length));
            p.firstChild.textContent = full.slice(0, k);
            p.lastChild.textContent = full.slice(k);
            if (left > 0 && left <= full.length) p.insertBefore(caret, p.lastChild);
            left -= full.length;
        });
        if (shown < total) { el._raf = requestAnimationFrame(step); return; }
        el.dataset.done = '';
        setTimeout(() => caret.remove(), 1600);
    };
    el._raf = requestAnimationFrame(step);
}

/* =========================================================
   The name reacts to the pointer. Latin letters slide along
   the font's MONO axis and turn into code glyphs as it passes;
   Arabic words (Cairo has no MONO axis) trade weight instead.
   A single wave runs through the name on load.
   ========================================================= */
const nameGlyphs = [];
function prepNameWeight() {
    nameGlyphs.length = 0;
    const ar = root.lang === 'ar';
    $$('.hero-name .split').forEach(line => {
        const thin = line.classList.contains('serif');
        $$('.wi', line).forEach(wi => {
            let parts = [wi];
            if (!ar) {
                wi.innerHTML = [...wi.textContent].map(ch => `<span class="ch">${ch}</span>`).join('');
                parts = $$('.ch', wi);
            }
            parts.forEach(el => nameGlyphs.push({ el, ar, base: thin ? 200 : 900, far: thin ? 800 : 300, k: 0 }));
        });
    });
}
if (!reduceMotion) {
    let px = -1e4, py = -1e4, waveStart = null;
    addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; }, { passive: true });
    window.nameWave = () => { waveStart = performance.now(); };
    (function nameLoop(now) {
        requestAnimationFrame(nameLoop);
        if (!nameGlyphs.length || scrollY > innerHeight) return;
        const wave = waveStart === null ? -1 : (now - waveStart) / 1400;   // 0 → 1 across the name
        nameGlyphs.forEach((g, i) => {
            const r = g.el.getBoundingClientRect();
            const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
            let k = Math.max(0, 1 - d / 260);
            if (wave >= 0 && wave <= 1.3) k = Math.max(k, Math.max(0, 1 - Math.abs(wave * nameGlyphs.length - i) / 2.2));
            g.k += (k * k * (3 - 2 * k) - g.k) * .16;
            const v = Math.round(g.k * 100) / 100;
            if (g.el._v === v) return;
            g.el._v = v;
            if (g.ar) g.el.style.fontWeight = Math.round(g.base + (g.far - g.base) * v);
            else g.el.style.fontVariationSettings = `"MONO" ${v}`;
        });
    })(performance.now());
}

/* =========================================================
   Particle field
   One cloud of particles that is always morphing toward a
   target. Targets are either free shapes (wave, torus, …)
   or shapes anchored to a DOM element: Zein's portrait under
   the hero photo, a ring around the About frame, and Zein
   pointing inside the contact frame. Portrait targets take
   their positions and colours from the photos themselves.
   ========================================================= */
const POSES = ['hero', 'pointing', 'celebrate', 'portrait'];
let poseIndex = 0;

const field = (() => {
    if (!window.THREE) return null;
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas: $('#gl'), antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { return null; }

    const N = innerWidth < 900 ? 4200 : 8000;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 100);
    camera.position.z = 8;
    const unitsPerPx = () => 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z / innerHeight;

    const rand = (a, b) => a + Math.random() * (b - a);
    const seeds = new Float32Array(N).map(() => Math.random());
    const make = fn => { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) a.set(fn(i), i * 3); return a; };

    // ---- free shapes, in world units ----
    const FREE = {
        wave: make(i => {
            const cols = Math.ceil(Math.sqrt(N * 2.6)), rows = Math.ceil(N / cols);
            const x = ((i % cols) / cols - .5) * 14, z = (Math.floor(i / cols) / rows - .5) * 6;
            return [x, Math.sin(x * .7) * .4 + Math.cos(z * 1.3 + x * .3) * .3, z];
        }),
        torus: make(() => {
            const u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI * 2, rr = .7 * Math.sqrt(Math.random());
            return [(2.3 + rr * Math.cos(v)) * Math.cos(u), rr * Math.sin(v), (2.3 + rr * Math.cos(v)) * Math.sin(u)];
        }),
        galaxy: make(i => {
            const d = Math.pow(Math.random(), 1.6) * 4.6;
            const a = d * 1.25 + (i % 3) * (Math.PI * 2 / 3) + rand(-.35, .35) / (d * .4 + .4);
            return [Math.cos(a) * d, rand(-.16, .16) * (1.4 - d / 4.6), Math.sin(a) * d];
        }),
        helix: make(i => {
            const s = i / N, a = s * Math.PI * 9 + (i % 2) * Math.PI, k = Math.random() < .12 ? rand(-1, 1) : 1;
            return [Math.cos(a) * 1.15 * k, (s - .5) * 7.5, Math.sin(a) * 1.15 * k];
        }),
        scatter: make(() => [rand(-9, 9), rand(-6, 6), rand(-5, 3)]),
    };
    // Where each free shape sits: x mirrors in RTL and centres on phones.
    const PLACE = {
        wave: { x: 0, y: -2.3, tilt: .32, opacity: .75 },
        torus: { x: 3.2, y: -.2, tilt: 1.15, opacity: .9 },
        galaxy: { x: 0, y: -.2, tilt: .9, opacity: .85 },
        helix: { x: 2.6, y: 0, tilt: .2, opacity: .8 },
        scatter: { x: 0, y: 0, tilt: 0, opacity: .6 },
    };

    // ---- portrait samples from the embedded photos ----
    const samples = {};
    function loadSamples(key) {
        if (samples[key]) return samples[key];
        samples[key] = new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const w = img.naturalWidth, h = img.naturalHeight;
                const c = document.createElement('canvas');
                c.width = w; c.height = h;
                const ctx = c.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0);
                const data = ctx.getImageData(0, 0, w, h).data;
                const opaque = [];
                for (let p = 0; p < w * h; p++) if (data[p * 4 + 3] > 150) opaque.push(p);
                // Over-sample so cropped frames still get N points.
                const M = N * 3;
                const uv = new Float32Array(M * 2), col = new Float32Array(M * 3);
                for (let i = 0; i < M; i++) {
                    const p = opaque[(Math.random() * opaque.length) | 0];
                    uv[i * 2] = ((p % w) + Math.random()) / w;
                    uv[i * 2 + 1] = (((p / w) | 0) + Math.random()) / h;
                    col[i * 3] = data[p * 4] / 255; col[i * 3 + 1] = data[p * 4 + 1] / 255; col[i * 3 + 2] = data[p * 4 + 2] / 255;
                }
                resolve({ uv, col, aspect: w / h, M });
            };
            img.onerror = () => resolve(null);
            img.src = window.PORTRAITS?.[key] || '';
        });
        return samples[key];
    }

    // Photo colours are lifted on dark backgrounds (a navy suit would vanish) and tinted toward the accent.
    let tone;
    function setTone(theme) {
        const accent = theme === 'light' ? [.31, .02, .99] : [.52, .4, 1];   // brand blue
        tone = theme === 'light'
            ? (v, c) => v * .8 + accent[c] * .06
            : (v, c) => (1 - (1 - v) * .55) * .86 + accent[c] * .14;
    }
    setTone(root.dataset.theme);

    // Points of a photo as laid out by CSS, in world units around the element's centre.
    function portraitLayout(s, el, fit) {
        if (!s) return null;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return null;
        const upp = unitsPerPx();
        let dw, dh, dx, dy;
        if (fit === 'contain') {                       // object-fit: contain; object-position: 50% 100%
            if (r.width / r.height > s.aspect) { dh = r.height; dw = dh * s.aspect; } else { dw = r.width; dh = dw / s.aspect; }
            dx = (r.width - dw) / 2; dy = r.height - dh;
        } else {                                       // object-fit: cover; object-position: 50% 0
            if (r.width / r.height > s.aspect) { dw = r.width; dh = dw / s.aspect; } else { dh = r.height; dw = dh * s.aspect; }
            dx = (r.width - dw) / 2; dy = 0;
        }
        const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
        let n = 0;
        for (let i = 0; i < s.M && n < N; i++) {
            const px = dx + s.uv[i * 2] * dw, py = dy + s.uv[i * 2 + 1] * dh;
            if (px < 0 || px > r.width || py < 0 || py > r.height) continue;
            pos[n * 3] = (px - r.width / 2) * upp;
            pos[n * 3 + 1] = -(py - r.height / 2) * upp;
            pos[n * 3 + 2] = rand(-.04, .04);
            for (let c = 0; c < 3; c++) col[n * 3 + c] = tone(s.col[i * 3 + c], c);
            n++;
        }
        if (!n) return null;
        for (let k = n; k < N; k++) {
            pos.set(pos.subarray((k % n) * 3, (k % n) * 3 + 3), k * 3);
            col.set(col.subarray((k % n) * 3, (k % n) * 3 + 3), k * 3);
        }
        return { pos, col };
    }

    function ringLayout(el) {
        const r = el.getBoundingClientRect(), upp = unitsPerPx();
        const rx = r.width * .56 * upp, ry = r.height * .54 * upp;
        return make(i => {
            const a = Math.random() * Math.PI * 2, band = i % 3 === 0 ? 1.12 : 1, j = rand(.97, 1.03);
            return [Math.cos(a) * rx * band * j, Math.sin(a) * ry * band * j, rand(-.08, .08)];
        });
    }

    // ---- geometry + material ----
    const cur = FREE.scatter.slice();
    const curCol = new Float32Array(N * 3);
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(cur, 3).setUsage(THREE.DynamicDrawUsage);
    const colAttr = new THREE.BufferAttribute(curCol, 3).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('color', colAttr);
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(N).map(() => Math.random() < .06 ? rand(2, 3) : rand(.7, 1.4)), 1));

    const uniforms = {
        uTime: { value: 0 }, uPixel: { value: dpr }, uAmp: { value: .04 }, uSize: { value: 1 }, uFlat: { value: 0 },
        uOpacity: { value: 0 }, uMouse: { value: new THREE.Vector3(99, 99, 0) },
    };
    const material = new THREE.ShaderMaterial({
        uniforms, transparent: true, depthWrite: false, vertexColors: true,
        vertexShader: `
            attribute float aSeed; attribute float aSize;
            uniform float uTime, uPixel, uAmp, uSize, uFlat; uniform vec3 uMouse;
            varying vec3 vColor; varying float vDepth;
            void main() {
                vec3 p = position + uAmp * vec3(
                    sin(uTime * 1.3 + aSeed * 40.0 + position.y * 2.0),
                    cos(uTime * 1.1 + aSeed * 30.0 + position.x * 2.0),
                    sin(uTime * 0.9 + aSeed * 20.0));
                vec4 world = modelMatrix * vec4(p, 1.0);
                vec3 d = world.xyz - uMouse;
                world.xyz += normalize(d + 1e-4) * smoothstep(1.3, 0.0, length(d.xy)) * 0.5;
                vec4 mv = viewMatrix * world;
                gl_PointSize = mix(aSize, 1.0, uFlat) * uSize * uPixel * (26.0 / -mv.z);
                gl_Position = projectionMatrix * mv;
                vColor = color;
                vDepth = smoothstep(13.0, 5.0, -mv.z);
            }`,
        fragmentShader: `
            uniform float uOpacity; varying vec3 vColor; varying float vDepth;
            void main() {
                float d = length(gl_PointCoord - 0.5);
                if (d > 0.5) discard;
                gl_FragColor = vec4(vColor, smoothstep(0.5, 0.1, d) * uOpacity * (0.45 + 0.55 * vDepth));
            }`,
    });
    const group = new THREE.Group();
    group.add(new THREE.Points(geo, material));
    scene.add(group);

    const starN = innerWidth < 900 ? 400 : 1000;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starN * 3).map((_, i) => i % 3 === 0 ? rand(-16, 16) : i % 3 === 1 ? rand(-10, 10) : rand(-14, -3)), 3));
    const starMat = new THREE.PointsMaterial({ size: .035, transparent: true, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ---- palette for the free shapes ----
    const palette = new Float32Array(N * 3);
    function setTheme(theme) {
        const dark = theme !== 'light';
        // Brand: electric blue-indigo fading into silver, with a few white sparks.
        const A = new THREE.Color(dark ? '#6a3cff' : '#5006fd');
        const B = new THREE.Color(dark ? '#c9c7df' : '#24223a');
        const C = new THREE.Color(dark ? '#ffffff' : '#8f8bb0');
        const tmp = new THREE.Color();
        for (let i = 0; i < N; i++) {
            tmp.copy(A).lerp(B, Math.min(seeds[i] / .7, 1));
            if (seeds[i] > .93) tmp.copy(C);
            palette.set([tmp.r, tmp.g, tmp.b], i * 3);
        }
        setTone(theme);
        queueMicrotask(() => relayout());   // runs after setup, when relayout exists
        starMat.color.set(dark ? '#ffffff' : '#2a2d35');
        starMat.opacity = dark ? .45 : .3;
        if (layouts.ring) layouts.ring.col = palette;
    }
    const layouts = {};
    setTheme(root.dataset.theme);
    curCol.set(palette);

    // ---- anchored targets ----
    const anchors = {
        hero: { el: () => $('#poseImg'), fit: 'contain', key: () => POSES[poseIndex] },
        contact: { el: () => $('#contactFrame'), fit: 'cover', key: () => 'pointing' },
        ring: { el: () => $('#aboutFrame'), ring: true },
    };
    async function layoutAnchor(name) {
        const a = anchors[name];
        if (a.ring) { layouts[name] = { pos: ringLayout(a.el()), col: palette }; return; }
        const l = portraitLayout(await loadSamples(a.key()), a.el(), a.fit);
        if (l) layouts[name] = l;
    }
    const relayout = () => Promise.all(Object.keys(anchors).map(layoutAnchor));

    let target = 'scatter';
    let changedAt = performance.now();
    function setTarget(name) {
        if (name === target) return;
        target = name;
        changedAt = performance.now();
    }
    const restart = () => { changedAt = performance.now(); };
    let hold = false;
    const setHold = v => { hold = v; };
    let firstHero = true;
    const settled = () => {
        const need = target === 'hero' && firstHero ? 2300 : 1300;
        const ok = performance.now() - changedAt > need && !!(layouts[target] || FREE[target]);
        if (ok && target === 'hero') firstHero = false;
        return ok;
    };

    // ---- pointer ----
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, wx: 99, wy: 99 };
    addEventListener('pointermove', e => {
        mouse.tx = e.clientX / innerWidth - .5;
        mouse.ty = e.clientY / innerHeight - .5;
        const upp = unitsPerPx();
        mouse.wx = (e.clientX - innerWidth / 2) * upp;
        mouse.wy = -(e.clientY - innerHeight / 2) * upp;
    }, { passive: true });

    let velocity = 0, kick = 0;
    const setVelocity = v => { velocity = v; };
    const pulse = () => { kick = .35; };

    function resize() {
        renderer.setSize(innerWidth, innerHeight, false);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        relayout();
    }
    resize();
    let resizeTimer;
    addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });

    // ---- loop ----
    const place = { x: 0, y: 0, s: 1, rx: 0, ry: 0, rz: 0, opacity: 0, size: 1, flat: 0 };
    let last = performance.now(), time = 0;
    function frame(now) {
        requestAnimationFrame(frame);
        const dt = Math.min((now - last) / 1000, .05);
        last = now;
        if (document.hidden) return;
        time += dt;
        uniforms.uTime.value = time;

        const anchor = anchors[target];
        const L = anchor ? layouts[target] : null;
        const tgtPos = L ? L.pos : FREE[target] || FREE.scatter;
        const tgtCol = L ? L.col : palette;

        const k = reduceMotion ? 1 : 1 - Math.pow(anchor ? .03 : .05, dt);
        for (let i = 0; i < cur.length; i++) {
            cur[i] += (tgtPos[i] - cur[i]) * k;
            curCol[i] += (tgtCol[i] - curCol[i]) * k;
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        const e = 1 - Math.pow(.02, dt);
        // When the real photo is showing, the particles under it fade away so no stray
        // points peek out around the edges (beard, hair, shoulders).
        const portrait = anchor && !anchor.ring;
        const photoUp = portrait && !hold && settled();
        let tx, ty, ts, trx, trz, tOpacity, tSize, tFlat;
        if (anchor) {
            const r = anchor.el().getBoundingClientRect(), upp = unitsPerPx();
            tx = (r.left + r.width / 2 - innerWidth / 2) * upp;
            ty = -(r.top + r.height / 2 - innerHeight / 2) * upp;
            ts = 1; trx = 0; trz = anchor.ring ? time * .15 : 0;
            tOpacity = photoUp ? 0 : 1;
            tSize = anchor.ring ? .9 : (isNarrow() ? .8 : .95);
            tFlat = anchor.ring ? 0 : 1;
        } else {
            const p = PLACE[target] || PLACE.scatter;
            tx = isNarrow() ? 0 : p.x * (isRTL() ? -1 : 1);
            ty = p.y;
            ts = isNarrow() ? .7 : 1;
            trx = p.tilt + mouse.y * .3;
            trz = mouse.x * -.12;
            tOpacity = p.opacity * (isNarrow() ? .55 : 1) * (root.dataset.theme === 'light' ? .85 : 1);
            tSize = 1; tFlat = 0;
        }
        // Once a portrait has arrived it tracks its element exactly, so it stays under the photo while scrolling.
        const follow = anchor && performance.now() - changedAt > 450 ? 1 : e;
        place.x += (tx - place.x) * follow;
        place.y += (ty - place.y) * follow;
        place.s += (ts - place.s) * e;
        place.rx += (trx - place.rx) * e;
        place.rz += (trz - place.rz) * e;
        if (anchor) {
            place.ry = Math.atan2(Math.sin(place.ry), Math.cos(place.ry));
            place.ry += -place.ry * e;
        } else if (!reduceMotion) {
            place.ry += dt * (.12 + Math.min(Math.abs(velocity) * .02, .8));
        }
        place.opacity += (tOpacity - place.opacity) * (portrait ? 1 - Math.pow(.0004, dt) : e);
        place.size += (tSize - place.size) * e;
        place.flat += (tFlat - place.flat) * e;

        group.position.set(place.x, place.y, 0);
        group.scale.setScalar(place.s);
        group.rotation.set(place.rx, place.ry, place.rz);
        uniforms.uOpacity.value = place.opacity;
        uniforms.uSize.value = place.size;
        uniforms.uFlat.value = place.flat;

        mouse.x += (mouse.tx - mouse.x) * .05;
        mouse.y += (mouse.ty - mouse.y) * .05;
        uniforms.uMouse.value.set(mouse.wx, mouse.wy, 0);

        kick *= .94;
        const ampTarget = anchor ? .012 : .045 + Math.min(Math.abs(velocity) * .004, .12);
        uniforms.uAmp.value += (ampTarget + kick - uniforms.uAmp.value) * .08;

        stars.rotation.y = time * .01 + mouse.x * .08;
        stars.rotation.x = mouse.y * .05;
        renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);

    return { setTarget, restart, settled, setHold, setTheme, pulse, setVelocity, relayout, get target() { return target; } };
})();

/* =========================================================
   Photos fade in only once the particles have arrived
   ========================================================= */
const pose = $('#pose');
const poseImg = $('#poseImg');
const contactFrame = $('#contactFrame');
let poseBusy = false;

// Where the bubble sits for each pose, as fractions of the photo box: measured from the
// cut-outs so even a two-line bubble lands in empty space beside the head
// (ltr = right of him, rtl = left).
const BUBBLE = {
    hero: { top: .02, ltr: .72, rtl: .74 },
    pointing: { top: .02, ltr: .64, rtl: .69 },
    celebrate: { top: .29, ltr: .84, rtl: .84 },
    portrait: { top: .02, ltr: .67, rtl: .67 },
};
const bubble = $('#bubble');
let bubbleTimer;
function placeBubble() {
    const b = BUBBLE[POSES[poseIndex]];
    bubble.style.setProperty('--bt', `${b.top * 100}%`);
    bubble.style.setProperty('--bs', `${(isRTL() ? b.rtl : b.ltr) * 100}%`);
}
// Keep the bubble on screen: if it would run past the viewport edge, let it wrap.
function fitBubble() {
    bubble.classList.remove('wrap');
    bubble.style.removeProperty('--bmax');
    if (getComputedStyle(bubble).position !== 'absolute') return;   // phones: it sits under the photo
    // clientWidth is the layout width; innerWidth can grow if anything overflows.
    const vw = document.documentElement.clientWidth;
    const r = bubble.getBoundingClientRect();
    const room = isRTL() ? r.right - 12 : vw - 12 - r.left;
    if (r.width > room) {
        bubble.style.setProperty('--bmax', `${Math.max(room, 110)}px`);
        bubble.classList.add('wrap');
    }
}
// Like a chat: a moment of "typing…", then the message.
function showBubble() {
    clearTimeout(bubbleTimer);
    placeBubble();
    bubble.innerHTML = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';
    fitBubble();
    bubbleTimer = setTimeout(() => {
        bubble.textContent = t().bubbles[poseIndex];
        fitBubble();
    }, reduceMotion ? 0 : 750);
}

function updatePhotos() {
    const was = pose.classList.contains('is-shown');
    if (!field || reduceMotion) {
        pose.classList.add('is-shown');
        contactFrame.classList.add('is-shown');
    } else {
        pose.classList.toggle('is-shown', field.target === 'hero' && field.settled() && !poseBusy);
        contactFrame.classList.toggle('is-shown', field.target === 'contact' && field.settled());
    }
    if (!was && pose.classList.contains('is-shown')) showBubble();
}
setInterval(updatePhotos, 120);

POSES.forEach(key => { const i = new Image(); i.src = `assets/zein-${key}-cut.webp`; });

// The hint under the photo rebuilds too; after the first try its ripples stop.
$('#poseHint').addEventListener('click', e => { pose.click(); });
pose.addEventListener('click', () => $('#poseHint').classList.add('used'));

pose.addEventListener('click', async e => {
    if (poseBusy) return;
    poseIndex = (poseIndex + 1) % POSES.length;
    const next = `assets/zein-${POSES[poseIndex]}-cut.webp`;
    if (!field || reduceMotion) { poseImg.src = next; showBubble(); return; }
    poseBusy = true;
    field.setHold(true);
    pose.classList.remove('is-shown');
    field.pulse();
    const x = e.clientX || innerWidth / 2, y = e.clientY || innerHeight / 2;
    await field.relayout();   // the hero target now holds the new pose; particles flow into it
    field.restart();
    setTimeout(() => {
        poseImg.src = next;
        poseBusy = false;
        field.setHold(false);
        if (POSES[poseIndex] === 'celebrate') burst(x, y, 80);
    }, 1300);
});

/* =========================================================
   Smooth scroll (Lenis) + GSAP
   ========================================================= */
let lenis = null;
if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: .1, smoothWheel: true });
    if (hasGSAP) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    } else {
        const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
    }
}

function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else if (typeof target === 'number') scrollTo({ top: target, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
}
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = id === '#top' ? 0 : $(id);
    if (el === null) return;
    e.preventDefault();
    scrollToTarget(el);
}));

/* =========================================================
   Nav — a glass blob marks the current section in the desktop
   tabs and in the phone tab bar, and follows the pointer
   ========================================================= */
const navLinks = $('#navLinks');
const bars = [$('#navLinks'), $('#tabbar')].map(el => ({ el, blob: $('.blob', el), x: null }));
let activeId = null;

function moveBlob(bar, link) {
    if (!link || getComputedStyle(bar.el).display === 'none') {
        bar.blob.style.opacity = 0;
        bar.x = null;
        return;
    }
    const r = link.getBoundingClientRect(), pr = bar.el.getBoundingClientRect();
    const x = r.left - pr.left - bar.el.clientLeft;
    if (bar.x !== null && Math.abs(bar.x - x) > 2) {
        bar.blob.classList.remove('moving');
        void bar.blob.offsetWidth;
        bar.blob.classList.add('moving');
    }
    bar.x = x;
    bar.blob.style.width = r.width + 'px';
    bar.blob.style.transform = `translateX(${x}px)`;
    bar.blob.style.opacity = 1;
}
function moveBlobs() {
    bars.forEach(bar => moveBlob(bar, activeId ? $(`a[href="#${activeId}"]`, bar.el) : null));
}
$$('a', navLinks).forEach(a => {
    a.addEventListener('mouseenter', () => moveBlob(bars[0], a));
    a.addEventListener('mouseleave', () => moveBlobs());
});
addEventListener('resize', () => moveBlobs());

/* =========================================================
   Active section: drives the nav and the particle target
   ========================================================= */
const hero = $('#hero');
let activeSection = 'hero';
const sectionIds = new Set($$('a', navLinks).map(a => a.getAttribute('href').slice(1)));
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const sec = entry.target;
        activeSection = sec.dataset.shape;
        activeId = sectionIds.has(sec.id) ? sec.id : null;
        $$('.tabs a, .tabbar a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${activeId}`));
        $('#sbFile').textContent = sec.dataset.file;
        moveBlobs();
        syncField();
    });
}, { rootMargin: '-45% 0px -54% 0px' });
$$('[data-shape]').forEach(s => sectionObserver.observe(s));

// The hero portrait dissolves as soon as the visitor starts scrolling away.
function syncField() {
    if (!field) return;
    let shape = activeSection;
    if (shape === 'hero' && scrollY > hero.offsetHeight * .16) shape = 'wave';
    field.setTarget(shape);
}

/* =========================================================
   Scroll-driven pieces
   ========================================================= */
const scrubEl = $('.statement-text');
let scrubProgress = null;
function updateScrub() {
    let p = scrubProgress;
    if (p === null) {
        const r = scrubEl.getBoundingClientRect();
        p = Math.min(Math.max((innerHeight * .85 - r.top) / (r.height + innerHeight * .35), 0), 1);
    }
    const words = $$('.w', scrubEl);
    const lit = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('lit', i < lit));
}

const timeline = $('#timeline');
const timelineFill = $('#timelineFill');
const jobs = $$('.job');
function updateTimeline() {
    const r = timeline.getBoundingClientRect(), mark = innerHeight * .6;
    timelineFill.style.transform = `scaleY(${Math.min(Math.max((mark - r.top) / r.height, 0), 1)})`;
    jobs.forEach(j => j.classList.toggle('reached', j.getBoundingClientRect().top + 40 < mark));
}

// Editor chrome: a line-number gutter that scrolls with the page, and the status bar's cursor line.
const LINE = 28;
const gutter = $('#gutter');
const gutterInner = document.createElement('div');
gutterInner.className = 'gutter-inner';
gutter.append(gutterInner);
function buildGutter() {
    gutterInner.innerHTML = '<span></span>'.repeat(Math.ceil(innerHeight / LINE) + 2);
}
buildGutter();
addEventListener('resize', buildGutter);
function updateEditor(y) {
    const first = Math.floor(y / LINE), offset = y - first * LINE;
    const mid = Math.floor((innerHeight / 2 + offset) / LINE);
    gutterInner.style.transform = `translateY(${-offset}px)`;
    [...gutterInner.children].forEach((el, i) => {
        el.textContent = first + i + 1;
        el.classList.toggle('cur', i === mid);
    });
    $('#sbLine').textContent = `Ln ${first + mid + 1}, Col 1`;
}

function onScroll(y, velocity = 0) {
    updateEditor(y);
    field?.setVelocity(velocity);
    syncField();
    updateScrub();
    updateTimeline();
}
if (lenis) lenis.on('scroll', e => onScroll(e.scroll, e.velocity));
else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

function initGSAP() {
    if (!hasGSAP) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)', () => {
        // Hero copy eases back while the portrait dissolves.
        gsap.to('.hero-copy', { yPercent: -10, opacity: .15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

        // Statement: pinned while its words light up.
        const st = ScrollTrigger.create({
            trigger: '.statement', start: 'top top', end: '+=90%', pin: '.statement-pin', scrub: true,
            onUpdate: self => { scrubProgress = Math.min(self.progress * 1.2, 1); updateScrub(); },
        });

        // ONSTA: a short hold on the intro, then the track slides sideways.
        root.classList.add('hs-on');
        const track = $('#hsTrack'), bar = $('#workProgress');
        const distance = () => Math.max(track.scrollWidth - innerWidth, 0);
        gsap.timeline({
            scrollTrigger: {
                trigger: '.work', start: 'top top', end: () => '+=' + distance() * 1.2, pin: '.work-pin', scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: self => { bar.style.transform = `scaleX(${self.progress})`; },
            },
        }).to({}, { duration: .15 }).to(track, { x: () => (isRTL() ? 1 : -1) * distance(), ease: 'none', duration: 1 });

        return () => { root.classList.remove('hs-on'); scrubProgress = null; st.kill(); };
    });
}

/* =========================================================
   Command palette (Ctrl/⌘ K or "/")
   ========================================================= */
const palette = $('#palette');
const paletteInput = $('#paletteInput');
const paletteList = $('#paletteList');
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
$('#kbdHint').textContent = isMac ? '⌘ K' : 'Ctrl K';
let paletteItems = [], paletteIndex = 0, lastFocus = null;

const openLink = url => window.open(url, '_blank', 'noopener');
const go = id => () => scrollToTarget(id === 'top' ? 0 : $(`#${id}`));
function commands() {
    const c = t().cmd;
    return [
        { g: 'nav', ico: '~', label: c.top, run: go('top') },
        { g: 'nav', ico: '01', label: c.work, run: go('work') },
        { g: 'nav', ico: '02', label: c.lab, run: go('lab') },
        { g: 'nav', ico: '03', label: c.about, run: go('about') },
        { g: 'nav', ico: '04', label: c.skills, run: go('skills') },
        { g: 'nav', ico: '05', label: c.experience, run: go('experience') },
        { g: 'nav', ico: '06', label: c.contact, run: go('contact') },
        { g: 'act', ico: '◐', label: c.themeAuto, run: () => setThemeMode('auto') },
        { g: 'act', ico: '☀', label: c.themeLight, run: () => setThemeMode('light') },
        { g: 'act', ico: '☾', label: c.themeDark, run: () => setThemeMode('dark') },
        { g: 'act', ico: 'ع', label: c.lang, run: () => setLang(root.lang === 'ar' ? 'en' : 'ar') },
        { g: 'act', ico: '@', label: c.copy, run: copyEmail },
        { g: 'act', ico: '✦', label: c.rebuild, run: () => { scrollToTarget(0); setTimeout(() => pose.click(), 1700); } },
        { g: 'link', ico: '↓', label: c.cv, run: () => { const a = document.createElement('a'); a.href = 'assets/cv/Zein-Alabdine-Altazah-CV.pdf'; a.download = ''; a.click(); } },
        { g: 'link', ico: 'in', label: c.linkedin, run: () => openLink('https://linkedin.com/in/zein-al-abdine-al-tazah-7344b4281') },
        { g: 'link', ico: 'wa', label: c.whatsapp, run: () => openLink('https://wa.me/971567979912') },
        { g: 'link', ico: '↗', label: c.onsta, run: () => openLink('https://onsta.ai') },
    ];
}
function renderPalette() {
    const q = paletteInput.value.trim().toLowerCase();
    paletteItems = commands().filter(c => !q || c.label.toLowerCase().includes(q));
    paletteIndex = Math.min(paletteIndex, Math.max(paletteItems.length - 1, 0));
    paletteList.innerHTML = '';
    if (!paletteItems.length) {
        paletteList.innerHTML = `<li class="palette-empty">${t().empty}</li>`;
        return;
    }
    let group = null;
    paletteItems.forEach((c, i) => {
        if (c.g !== group) {
            group = c.g;
            const h = document.createElement('li');
            h.className = 'palette-group';
            h.setAttribute('role', 'presentation');
            h.textContent = t().groups[group];
            paletteList.append(h);
        }
        const li = document.createElement('li');
        li.className = 'palette-item';
        li.id = `pi-${i}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', i === paletteIndex);
        li.innerHTML = `<span class="pi-ico" aria-hidden="true"></span><span></span><span class="pi-key" aria-hidden="true">↵</span>`;
        li.children[0].textContent = c.ico;
        li.children[1].textContent = c.label;
        li.addEventListener('mousemove', () => { if (paletteIndex !== i) { paletteIndex = i; highlight(); } });
        li.addEventListener('click', () => runCommand(i));
        paletteList.append(li);
    });
    paletteInput.setAttribute('aria-activedescendant', `pi-${paletteIndex}`);
}
function highlight() {
    $$('.palette-item', paletteList).forEach((li, i) => li.setAttribute('aria-selected', i === paletteIndex));
    $(`#pi-${paletteIndex}`)?.scrollIntoView({ block: 'nearest' });
    paletteInput.setAttribute('aria-activedescendant', `pi-${paletteIndex}`);
}
function openPalette() {
    if (!palette.hidden) return;
    lastFocus = document.activeElement;
    paletteInput.value = '';
    paletteIndex = 0;
    palette.hidden = false;
    renderPalette();
    lenis?.stop();
    paletteInput.focus();
}
function closePalette() {
    if (palette.hidden) return;
    palette.hidden = true;
    lenis?.start();
    lastFocus?.focus?.();
}
function runCommand(i) {
    const c = paletteItems[i];
    if (!c) return;
    closePalette();
    c.run();
}
$('#paletteBtn').addEventListener('click', openPalette);
palette.addEventListener('click', e => { if (e.target.closest('[data-close]')) closePalette(); });
paletteInput.addEventListener('input', () => { paletteIndex = 0; renderPalette(); });
paletteInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const n = paletteItems.length;
        if (!n) return;
        paletteIndex = (paletteIndex + (e.key === 'ArrowDown' ? 1 : -1) + n) % n;
        highlight();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        runCommand(paletteIndex);
    }
});
document.addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.hidden ? openPalette() : closePalette(); }
    else if (e.key === '/' && !typing && palette.hidden) { e.preventDefault(); openPalette(); }
    else if (e.key === 'Escape') closePalette();
});

/* =========================================================
   Reveals + counters
   ========================================================= */
function countUp(el) {
    const end = +el.dataset.count;
    if (reduceMotion) { el.textContent = end.toLocaleString('en-US'); return; }
    const start = performance.now(), dur = 1800;
    const step = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        if (entry.target.classList.contains('type')) {
            const el = entry.target;
            setTimeout(() => runType(el), typeDelay(el));
        }
        revealObserver.unobserve(entry.target);
    });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObserver.unobserve(entry.target);
    });
}, { threshold: .5 });
$$('.bento, .facts, .timeline ol').forEach(group => {
    group.querySelectorAll('[data-anim]').forEach((el, i) => el.style.setProperty('--d', `${i * 80}ms`));
});

/* =========================================================
   Marquee — speed follows scroll velocity
   ========================================================= */
const rows = $$('.marquee-row').map(row => {
    row.innerHTML += row.innerHTML;
    return { el: row, x: 0, dir: +row.dataset.speed };
});
let marqueeBoost = 0;
if (lenis) lenis.on('scroll', e => { marqueeBoost = Math.min(Math.abs(e.velocity) * .5, 16); });
(function marquee() {
    if (!reduceMotion) {
        rows.forEach(r => {
            const half = r.el.scrollWidth / 2;
            r.x -= (.5 + marqueeBoost) * r.dir;
            if (r.x <= -half) r.x += half;
            if (r.x > 0) r.x -= half;
            r.el.style.transform = `translate3d(${r.x}px,0,0)`;
        });
        marqueeBoost *= .92;
    }
    requestAnimationFrame(marquee);
})();

/* =========================================================
   Pointer niceties: cursor, magnetic buttons, spotlight
   ========================================================= */
if (finePointer && !reduceMotion) {
    const ring = $('#cursor'), dot = $('#cursorDot'), label = $('#cursorLabel');
    let mx = -100, my = -100, rx = -100, ry = -100, last = performance.now(), pressed = false, press = 1;
    root.classList.add('has-cursor');
    // The dot is moved right in the event, so it never trails the real pointer.
    addEventListener('pointermove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        root.classList.add('cursor-on');
    }, { passive: true });
    document.addEventListener('pointerleave', () => { ring.classList.add('is-hidden'); dot.classList.add('is-hidden'); });
    document.addEventListener('pointerenter', () => { ring.classList.remove('is-hidden'); dot.classList.remove('is-hidden'); });
    addEventListener('pointerdown', () => { pressed = true; });
    addEventListener('pointerup', () => { pressed = false; });
    // The ring chases with a frame-rate independent ease and stretches along its motion.
    (function loop(now) {
        const dt = Math.min((now - last) / 1000, .05) || .016;
        last = now;
        const k = 1 - Math.pow(1e-13, dt);   // ≈ 40% of the remaining distance per frame at 60fps
        rx += (mx - rx) * k; ry += (my - ry) * k;
        const dx = mx - rx, dy = my - ry;
        const labelled = ring.classList.contains('is-label');   // keep the label upright
        const stretch = labelled ? 0 : Math.min(Math.hypot(dx, dy) / 90, .4);
        const angle = labelled ? 0 : Math.atan2(dy, dx);
        press += ((pressed ? .78 : 1) - press) * (1 - Math.pow(1e-6, dt));   // quick squeeze on click
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) rotate(${angle}rad) scale(${(1 + stretch) * press}, ${(1 - stretch * .45) * press})`;
        requestAnimationFrame(loop);
    })(performance.now());
    document.addEventListener('pointerover', e => {
        const target = e.target.closest('a, button, label, [data-cursor], input, textarea');
        const custom = target?.closest('[data-cursor]');
        const typing = target && /INPUT|TEXTAREA/.test(target.tagName) && target.type !== 'radio';
        ring.classList.toggle('is-hidden', !!typing);
        dot.classList.toggle('is-hidden', !!typing);
        ring.classList.toggle('is-label', !!custom);
        ring.classList.toggle('is-link', !!target && !custom && !typing);
        dot.classList.toggle('is-hidden-dot', !!target && !typing);   // the ring alone marks links, so text stays clear
        label.textContent = custom ? t().cursor[custom.dataset.cursor] || '' : '';
    });
    $$('[data-magnetic]').forEach(el => {
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
        });
        el.addEventListener('pointerleave', () => {
            el.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)';
            el.style.transform = '';
            setTimeout(() => { el.style.transition = ''; }, 700);
        });
    });
}
$$('.spot').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
}));

/* =========================================================
   Confetti + toast
   ========================================================= */
const confettiCanvas = $('#confetti');
const cctx = confettiCanvas.getContext('2d');
const COLORS = ['#5006fd', '#8466ff', '#c9c7df', '#ffffff', '#3d7bff', '#2fbf6c'];
let pieces = [], confettiOn = false;
function sizeConfetti() {
    const d = Math.min(devicePixelRatio || 1, 2);
    confettiCanvas.width = innerWidth * d; confettiCanvas.height = innerHeight * d;
    cctx.setTransform(d, 0, 0, d, 0, 0);
}
sizeConfetti();
addEventListener('resize', sizeConfetti);
function burst(x, y, n = 140) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 10;
        pieces.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: COLORS[i % COLORS.length], life: 0 });
    }
    if (!confettiOn) { confettiOn = true; requestAnimationFrame(drawConfetti); }
}
function drawConfetti() {
    cctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces = pieces.filter(p => p.y < innerHeight + 40 && p.life < 240);
    pieces.forEach(p => {
        p.vy += .25; p.vx *= .985; p.vy *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
        cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.r);
        cctx.globalAlpha = Math.max(0, 1 - p.life / 240); cctx.fillStyle = p.c;
        cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.life * .1)));
        cctx.restore();
    });
    if (pieces.length) requestAnimationFrame(drawConfetti);
    else { confettiOn = false; cctx.clearRect(0, 0, innerWidth, innerHeight); }
}

const toastEl = $('#toast');
let toastTimer;
function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* =========================================================
   Award, copy email, contact form
   ========================================================= */
$('#award').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 180);
    toast(t().celebrate);
    field?.pulse();
});

const EMAIL = 'zeinalabdinealtazah@gmail.com';
async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); toast(t().copied); }
    catch (e) { toast(t().copyFail); }
}
$('#copyEmail').addEventListener('click', copyEmail);

$('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const { name: nameEl, message: msgEl, topic } = e.currentTarget.elements;
    const name = nameEl.value.trim(), message = msgEl.value.trim();
    nameEl.closest('.field').classList.toggle('invalid', !name);
    msgEl.closest('.field').classList.toggle('invalid', !message);
    if (!name || !message) { toast(t().formMissing); return; }
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`${t().subjects[topic.value]} — ${name}`)}&body=${encodeURIComponent(`${message}\n\n— ${name}`)}`;
    const r = e.submitter?.getBoundingClientRect();
    if (r) burst(r.left + r.width / 2, r.top, 100);
    toast(t().formSent);
});
$$('#contactForm input, #contactForm textarea').forEach(el => el.addEventListener('input', () => el.closest('.field')?.classList.remove('invalid')));

/* =========================================================
   Boot — wait for fonts so measured layouts are final
   ========================================================= */
applyCopy();
$('#year').textContent = new Date().getFullYear();

function start() {
    applyCopy();   // re-measure the rotator with the real fonts
    initGSAP();
    $$('.hero .split').forEach(el => el.classList.add('in'));
    setTimeout(() => window.nameWave?.(), 1200);
    if (hasGSAP && !reduceMotion) {
        gsap.from('[data-hero]', { opacity: 0, y: 30, duration: 1.2, stagger: .1, delay: .25, ease: 'expo.out', clearProps: 'opacity,transform' });
    }
    $$('[data-anim], .split, .type').forEach(el => { if (!el.closest('.hero')) revealObserver.observe(el); });
    updateEditor(scrollY);
    $$('[data-count]').forEach(el => countObserver.observe(el));
    updateScrub();
    updateTimeline();
    if (hasGSAP) ScrollTrigger.refresh();
    field?.relayout().then(syncField);
}
(document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(start));

/* =========================================================
   3D iPhone — drag to turn it all the way round, it settles
   back facing you; its tabs (and the app's own bottom bar)
   switch the ONSTA screen.
   ========================================================= */
(() => {
    const p3 = $('#p3'), body = $('#p3Body');
    if (!p3) return;
    const shots = $$('.p3-screen img', p3), tabs = $$('.p3-tabs [data-go]');
    let ry = -22, rx = 8, vy = 0, down = null, dragging = false, last = 0, current = 'home', t0 = performance.now();

    function show(name) {
        if (name === current) return;
        shots.forEach(img => {
            img.classList.toggle('was-on', img.dataset.shot === current);
            img.classList.toggle('is-on', img.dataset.shot === name);
        });
        tabs.forEach(b => b.setAttribute('aria-selected', b.dataset.go === name));
        current = name;
        vy = 0;              // a tab press brings the screen round to face you
    }
    $$('[data-go]', p3.parentElement).forEach(b => b.addEventListener('click', e => {
        if (dragging) { e.preventDefault(); return; }
        show(b.dataset.go);
    }));
    $('#p3Spin').addEventListener('click', () => { vy = reduceMotion ? 0 : (isRTL() ? -15 : 15); });

    // Dragging starts only after a few pixels, so taps still reach the buttons inside.
    p3.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, id: e.pointerId }; last = e.clientX; vy = 0; });
    addEventListener('pointermove', e => {
        if (!down || e.pointerId !== down.id) return;
        const dx = e.clientX - last;
        if (!dragging && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) { dragging = true; p3.setPointerCapture?.(e.pointerId); }
        if (!dragging) return;
        ry += dx * .55;
        rx = Math.max(-18, Math.min(22, rx - e.movementY * .2));
        vy = dx * .55;
        last = e.clientX;
    });
    const up = () => { down = null; setTimeout(() => { dragging = false; }, 0); };
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    p3.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { vy -= 6; e.preventDefault(); }
        if (e.key === 'ArrowRight') { vy += 6; e.preventDefault(); }
    });

    // One full turn the first time the phone comes into view.
    new IntersectionObserver(([en], obs) => {
        if (!en.isIntersecting) return;
        obs.disconnect();
        if (!reduceMotion) vy = isRTL() ? -14 : 14;
    }, { threshold: .55 }).observe(p3);

    (function loop(now) {
        requestAnimationFrame(loop);
        const t = (now - t0) / 1000;
        if (!dragging) {
            ry += vy;
            vy *= .955;
            if (Math.abs(vy) < .35) {
                // settle on the nearest front-facing angle, with a slow sway
                const front = Math.round(ry / 360) * 360 + (reduceMotion ? 0 : Math.sin(t * .7) * 14 - 8);
                ry += (front - ry) * .05;
                rx += ((reduceMotion ? 6 : 6 + Math.sin(t * .9) * 3) - rx) * .05;
            }
        }
        const a = ((ry % 360) + 360) % 360;
        p3.classList.toggle('is-back', a > 90 && a < 270);
        body.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        p3.style.setProperty('--glare', `${50 + Math.sin(ry * Math.PI / 180) * 60}%`);
        p3.style.setProperty('--sh', (0.75 + 0.25 * Math.abs(Math.cos(ry * Math.PI / 180))).toFixed(3));
    })(t0);
})();
