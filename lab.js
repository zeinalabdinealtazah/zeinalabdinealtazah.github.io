/* =========================================================
   Lab — six product-grade demos that run in the browser.
   Each demo is { file, title(), mount(body), unmount() } and is
   mounted into the shared window. Copy is bilingual through tx();
   an open demo re-mounts when the language changes.
   Uses globals from app.js: root, $, $$, toast, lenis, reduceMotion.
   ========================================================= */
(() => {
const ar = () => root.lang === 'ar';
const tx = (en, arText) => (ar() ? arText : en);
const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dubaiNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
const clock = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const ICON = {
    send: '<path d="M4 12 20 4l-6 16-3-7z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    doc: '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z"/><path d="M14 3.5V8h4M9.5 12.5h5M9.5 16h5"/>',
    bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.3"/>',
    wifi: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.5a5 5 0 0 1 6.8 0"/><circle cx="12" cy="18.6" r="1"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    scan: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/>',
    card: '<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M3.5 10h17"/>',
    chat: '<path d="M4.5 6.5h15v9.5h-9l-4.5 3.5v-3.5h-1.5z"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    cam: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.4-2h5.6l1.4 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    router: '<rect x="3.5" y="13" width="17" height="6" rx="1.5"/><path d="M7 16h.01M10 16h.01M17 13V8M8.5 8.5a6 6 0 0 1 8.5-.5"/>',
};
const ico = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>`;
const spark = (vals, w = 100, h = 28) => {
    const max = Math.max(...vals), min = Math.min(...vals), r = max - min || 1;
    const pts = vals.map((v, i) => `${(i / (vals.length - 1) * w).toFixed(1)},${(h - 2 - (v - min) / r * (h - 4)).toFixed(1)}`);
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path class="spark-a" d="M0,${h} L${pts.join(' L')} L${w},${h} Z"/><path class="spark-l" d="M${pts.join(' L')}"/></svg>`;
};

/* =========================================================
   1. Wasel — an Arabic-first support assistant (fictional brand)
   Rule-based NLU: normalise → dialect → intents → entities.
   ========================================================= */
const assistant = (() => {
    const norm = s => s.toLowerCase()
        .replace(/[ً-ْـ]/g, '')
        .replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
        .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    const INTENTS = {
        fees: ['رسوم', 'عموله', 'كلفه', 'تكلفه', 'قديش', 'شقد', 'كم ', 'بكم', 'تحويل', 'fee', 'fees', 'cost', 'charge', 'how much', 'send'],
        track: ['وين حوالتي', 'فين حوالتي', 'حوالتي', 'وصلت', 'تتبع', 'حاله الحواله', 'track', 'status', 'where is my', 'arrived'],
        branches: ['فرع', 'فروع', 'عنوان', 'دوام', 'ساعات', 'مفتوح', 'تفتحون', 'بتفتحو', 'متي', 'branch', 'open', 'hours', 'location', 'address'],
        docs: ['هويه', 'جواز', 'اوراق', 'وثائق', 'مستندات', 'شو لازم', 'ايش احتاج', 'وش احتاج', 'المطلوبه', 'document', 'passport', 'id card', 'what do i need'],
        greet: ['مرحبا', 'هلا', 'السلام', 'اهلين', 'صباح', 'مساء', 'hi ', 'hello', 'hey'],
        thanks: ['شكرا', 'يسلمو', 'مشكور', 'تسلم', 'يعطيك', 'thanks', 'thank you'],
    };
    const DIALECT = {
        lev: ['شو', 'قديش', 'بدي', 'هلق', 'منيح', 'كتير', 'ليش', 'بتفتحو', 'لسا', 'وين'],
        gulf: ['ابغي', 'ابغى', 'ابي ', 'وش', 'ايش', 'شلون', 'وايد', 'شقد', 'فين', 'الحين'],
    };
    const BRANCHES = [
        { en: 'Dubai — Deira', ar: 'دبي — ديرة', open: 9, close: 22 },
        { en: 'Dubai — Al Barsha', ar: 'دبي — البرشاء', open: 10, close: 22 },
        { en: 'Sharjah — Al Nahda', ar: 'الشارقة — النهدة', open: 9, close: 21 },
        { en: 'Abu Dhabi — Hamdan St.', ar: 'أبوظبي — شارع حمدان', open: 9, close: 21 },
    ];
    const fee = aed => aed <= 500 ? 15 : aed <= 2000 ? 25 : aed <= 5000 ? 35 : Math.round(aed * 0.008);

    function understand(raw) {
        const t0 = performance.now();
        const n = ' ' + norm(raw) + ' ';
        const scores = Object.fromEntries(Object.entries(INTENTS).map(([k, w]) => [k, w.filter(x => n.includes(x)).length]));
        const ents = [];
        const codeRe = /\b(?:TX|tx)[-\s]?(\d{4,8})\b/;
        const code = raw.match(codeRe);
        if (code) { scores.track += 2; ents.push({ type: 'code', text: code[0], value: 'TX-' + code[1] }); }
        const ascii = raw.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
        const amt = (code ? ascii.replace(codeRe, '') : ascii).match(/(\d[\d,]*(?:\.\d+)?)/);
        if (amt) { scores.fees += 1; ents.push({ type: 'amount', text: raw.slice(ascii.indexOf(amt[1]), ascii.indexOf(amt[1]) + amt[1].length), value: parseFloat(amt[1].replace(/,/g, '')) }); }
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ k, p: total ? v / total : 0 }));
        const markers = Object.fromEntries(Object.entries(DIALECT).map(([k, w]) => [k, w.filter(x => n.includes(x)).map(x => x.trim())]));
        const isArabic = /[؀-ۿ]/.test(raw);
        const dialect = !isArabic ? 'en' : markers.lev.length > markers.gulf.length ? 'lev' : markers.gulf.length ? 'gulf' : 'msa';
        return {
            raw, normalized: norm(raw), ranked, intent: ranked[0].p ? ranked[0].k : 'unknown',
            confidence: ranked[0].p ? Math.min(.99, .5 + ranked[0].p * .48) : 0, ents, dialect,
            markers: markers[dialect] || [], isArabic, ms: performance.now() - t0 + rand(2.4, 4.8),
        };
    }

    // Replies are rich cards, in the language the visitor wrote in.
    function reply(u) {
        const A = u.isArabic, L = (en, a) => (A ? a : en);
        const amount = u.ents.find(e => e.type === 'amount')?.value, code = u.ents.find(e => e.type === 'code')?.value;
        switch (u.intent) {
            case 'fees': {
                if (!amount) return { text: L('Sure — how much would you like to send, in AED?', 'بكل سرور — كم المبلغ الذي تودّ تحويله بالدرهم؟') };
                const f = fee(amount);
                return {
                    text: L('Here is your quote:', 'إليك تفاصيل التحويل:'),
                    card: `<div class="wa-card"><div class="wa-card-h">${ico('card')}<b>${L('Transfer quote', 'عرض التحويل')}</b><span class="wa-pill ok">${L('Best rate', 'أفضل سعر')}</span></div>
                        <dl class="wa-rows"><div><dt>${L('You send', 'المبلغ المُرسل')}</dt><dd>${fmt(amount)} AED</dd></div><div><dt>${L('Transfer fee', 'رسوم التحويل')}</dt><dd>${fmt(f)} AED</dd></div><div class="tot"><dt>${L('Total to pay', 'الإجمالي')}</dt><dd>${fmt(amount + f)} AED</dd></div></dl>
                        <p class="wa-meta">${ico('bolt')}${L('Arrives within minutes · fee tier up to', 'يصل خلال دقائق · شريحة الرسوم حتى')} ${amount <= 500 ? '500' : amount <= 2000 ? '2,000' : amount <= 5000 ? '5,000' : '∞'} AED</p></div>`,
                };
            }
            case 'track': {
                if (!code) return { text: L('Share your transfer code — it looks like TX-48213.', 'أرسل رمز الحوالة — يبدو هكذا: TX-48213.') };
                const h = [...code].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
                const b = BRANCHES[h % BRANCHES.length], step = 1 + (h % 3);
                const steps = [L('Sent', 'أُرسلت'), L('In transit', 'في الطريق'), L('Ready for pickup', 'جاهزة للاستلام'), L('Collected', 'استُلمت')];
                return {
                    text: L(`Found it — here is ${code}:`, `وجدتها — هذه حالة ${code}:`),
                    card: `<div class="wa-card"><div class="wa-card-h">${ico('scan')}<b dir="ltr">${code}</b><span class="wa-pill">${steps[step]}</span></div>
                        <ol class="wa-steps">${steps.map((s, i) => `<li class="${i < step ? 'done' : i === step ? 'now' : ''}"><i></i><span>${s}</span></li>`).join('')}</ol>
                        <p class="wa-meta">${ico('pin')}${A ? b.ar : b.en}</p></div>`,
                };
            }
            case 'branches': {
                const h = dubaiNow().getHours();
                return {
                    text: L('Our branches, live opening status:', 'فروعنا وحالة الدوام الآن:'),
                    card: `<div class="wa-card"><ul class="wa-list">${BRANCHES.map(b => {
                        const open = h >= b.open && h < b.close;
                        return `<li>${ico('pin')}<span>${A ? b.ar : b.en}<small>${String(b.open).padStart(2, '0')}:00 – ${b.close}:00</small></span><span class="wa-pill ${open ? 'ok' : 'off'}">${open ? L('Open', 'مفتوح') : L('Closed', 'مغلق')}</span></li>`;
                    }).join('')}</ul></div>`,
                };
            }
            case 'docs':
                return {
                    text: L('Here is what to bring:', 'هذه الأوراق المطلوبة:'),
                    card: `<div class="wa-card"><div class="wa-card-h">${ico('doc')}<b>${L('Required documents', 'المستندات المطلوبة')}</b></div><ul class="wa-check">
                        <li>${ico('check')}${L('Valid Emirates ID or passport (to send)', 'هوية إماراتية سارية أو جواز سفر (للإرسال)')}</li>
                        <li>${ico('check')}${L('The ID named on the transfer (to receive)', 'الهوية المسجّلة في الحوالة (للاستلام)')}</li>
                        <li>${ico('check')}${L('The transfer code, e.g. TX-48213', 'رمز الحوالة، مثل TX-48213')}</li></ul></div>`,
                };
            case 'greet': return { text: L('Hello! I can quote fees, track a transfer, show branches or list documents.', 'أهلاً بك! يمكنني حساب الرسوم، وتتبّع الحوالات، وعرض الفروع، والأوراق المطلوبة.') };
            case 'thanks': return { text: L('Anytime — happy to help. 🙌', 'على الرحب والسعة، يسعدني ذلك. 🙌') };
            default: return { text: L('I can help with fees, tracking, branches and documents — try one of the suggestions below.', 'أستطيع المساعدة في الرسوم والتتبّع والفروع والأوراق — جرّب أحد الاقتراحات بالأسفل.') };
        }
    }

    const NAMES = () => ({ fees: tx('Fee quote', 'حساب الرسوم'), track: tx('Track transfer', 'تتبّع حوالة'), branches: tx('Branches', 'الفروع'), docs: tx('Documents', 'الأوراق'), greet: tx('Greeting', 'تحية'), thanks: tx('Thanks', 'شكر'), unknown: tx('Unknown', 'غير معروف') });
    const DIALECTS = () => ({ lev: tx('Levantine', 'شامية'), gulf: tx('Gulf', 'خليجية'), msa: tx('Standard Arabic', 'فصحى'), en: tx('English', 'إنجليزية') });
    let timers = [];
    return {
        file: 'assistant.ts',
        title: () => tx('Wasel — Arabic support assistant', 'واصل — مساعد دعم بالعربية'),
        mount(body) {
            const samples = ['قديش رسوم تحويل 1500 درهم؟', 'وين حوالتي TX-48213', 'ابغى اعرف وش الاوراق المطلوبة', 'متى دوامكم اليوم؟', 'How much to send 800 AED?'];
            body.innerHTML = `
            <div class="x-assist">
                <section class="wa" aria-label="${tx('Chat', 'المحادثة')}">
                    <header class="wa-top"><span class="wa-logo">و</span><div><b>${tx('Wasel Assist', 'مساعد واصل')}</b><small><i class="wa-on"></i>${tx('Online · replies instantly', 'متصل · يرد فوراً')}</small></div><span class="wa-chip">AR · EN</span></header>
                    <div class="wa-log" aria-live="polite"><p class="wa-day">${tx('Today', 'اليوم')}</p></div>
                    <div class="wa-sugg"></div>
                    <form class="wa-form"><input type="text" autocomplete="off" placeholder="${esc(tx('Message Wasel — any dialect…', 'اكتب لواصل — بأي لهجة…'))}"><button type="submit" aria-label="${tx('Send', 'إرسال')}">${ico('send')}</button></form>
                </section>
                <aside class="insp" aria-label="${tx('NLU inspector', 'محلّل الفهم')}">
                    <header class="insp-top"><b>${tx('NLU inspector', 'محلّل الفهم')}</b><span class="insp-ms" data-k="ms">— ms</span></header>
                    <div class="insp-sec"><p class="insp-k">${tx('Input', 'الرسالة')}</p><p class="insp-raw" data-k="raw" dir="auto">${tx('Send a message to see how it is understood.', 'أرسل رسالة لترى كيف تُفهم.')}</p><p class="insp-norm" data-k="norm" dir="auto"></p></div>
                    <div class="insp-sec"><p class="insp-k">${tx('Pipeline', 'مراحل المعالجة')}</p><ol class="pipe">
                        <li>${tx('Normalise Arabic', 'توحيد الكتابة')}</li><li>${tx('Detect dialect', 'كشف اللهجة')}</li><li>${tx('Score intents', 'تقييم النوايا')}</li><li>${tx('Extract entities', 'استخراج الكيانات')}</li><li>${tx('Compose reply', 'صياغة الرد')}</li></ol></div>
                    <div class="insp-sec"><p class="insp-k">${tx('Intent', 'النيّة')}</p><div class="intents" data-k="intents"></div></div>
                    <div class="insp-row"><div class="insp-sec"><p class="insp-k">${tx('Dialect', 'اللهجة')}</p><p data-k="dialect">—</p></div><div class="insp-sec"><p class="insp-k">${tx('Entities', 'الكيانات')}</p><p class="ents" data-k="ents">—</p></div></div>
                    <p class="lab-note">${tx('Runs locally in your browser. Wasel, its branches and fees are fictional.', 'يعمل محلياً في متصفحك. «واصل» وفروعه ورسومه افتراضية.')}</p>
                </aside>
            </div>`;
            const log = $('.wa-log', body), input = $('input', body);
            const add = (who, html, cls = '') => {
                const row = document.createElement('div');
                row.className = `wa-msg wa-${who} ${cls}`;
                row.innerHTML = `${who === 'bot' ? '<span class="wa-av">و</span>' : ''}<div class="wa-bub"><div class="wa-txt" dir="auto">${html}</div><time>${clock()}</time></div>`;
                log.append(row); log.scrollTop = log.scrollHeight; return row;
            };
            const inspect = u => {
                const K = k => $(`[data-k=${k}]`, body);
                let raw = esc(u.raw);
                u.ents.forEach(e => { raw = raw.replace(esc(e.text), `<mark class="ent ent-${e.type}">${esc(e.text)}</mark>`); });
                K('raw').innerHTML = raw;
                K('norm').textContent = u.normalized;
                K('ms').textContent = `${u.ms.toFixed(1)} ms`;
                const names = NAMES();
                K('intents').innerHTML = u.ranked.slice(0, 3).map((r, i) => `<div class="int ${i === 0 && r.p ? 'top' : ''}"><span>${names[r.k]}</span><i style="--w:${Math.round((i === 0 ? u.confidence : r.p * .9) * 100)}%"></i><b>${Math.round((i === 0 ? u.confidence : r.p * .9) * 100)}%</b></div>`).join('');
                K('dialect').innerHTML = `<span class="tag-d">${DIALECTS()[u.dialect]}</span>${u.markers.length ? `<small dir="rtl">${u.markers.map(esc).join(' · ')}</small>` : ''}`;
                K('ents').innerHTML = u.ents.length ? u.ents.map(e => `<span class="ent ent-${e.type}">${e.type} = ${esc(e.value)}</span>`).join('') : '—';
                $$('.pipe li', body).forEach((li, i) => {
                    li.classList.remove('done');
                    timers.push(setTimeout(() => li.classList.add('done'), reduceMotion ? 0 : 90 * (i + 1)));
                });
            };
            const ask = text => {
                if (!text.trim()) return;
                add('user', esc(text));
                const u = understand(text);
                inspect(u);
                const typing = add('bot', '<span class="wa-dots"><i></i><i></i><i></i></span>', 'typing');
                timers.push(setTimeout(() => {
                    const r = reply(u);
                    typing.classList.remove('typing');
                    $('.wa-txt', typing).innerHTML = esc(r.text);
                    if (r.card) $('.wa-bub', typing).insertAdjacentHTML('beforeend', r.card);
                    log.scrollTop = log.scrollHeight;
                }, reduceMotion ? 0 : 650));
            };
            samples.forEach(s => { const b = document.createElement('button'); b.type = 'button'; b.className = 'wa-s'; b.dir = 'auto'; b.textContent = s; b.onclick = () => ask(s); $('.wa-sugg', body).append(b); });
            $('form', body).onsubmit = e => { e.preventDefault(); ask(input.value); input.value = ''; };
            add('bot', esc(tx('Hi, I’m Wasel’s assistant 👋 Ask me about fees, tracking a transfer, branches or documents — in any dialect.', 'مرحباً، أنا مساعد «واصل» 👋 اسألني عن الرسوم، أو تتبّع حوالة، أو الفروع، أو الأوراق المطلوبة — بأي لهجة.')));
        },
        unmount() { timers.forEach(clearTimeout); timers = []; },
        _understand: understand,
    };
})();

/* =========================================================
   2. Hands-free capture — MediaPipe face landmarks, on-device
   ========================================================= */
const capture = (() => {
    const VER = '0.10.14';
    let stream, raf, landmarker, alive = false;
    const stop = () => { alive = false; cancelAnimationFrame(raf); stream?.getTracks().forEach(t => t.stop()); stream = null; };
    return {
        file: 'capture.ts',
        title: () => tx('Hands-free capture', 'التصوير بدون لمس'),
        mount(body) {
            body.innerHTML = `
            <div class="x-cam">
                <section class="cam">
                    <div class="cam-stage">
                        <video playsinline muted></video><canvas class="cam-ov"></canvas>
                        <svg class="cam-brk" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14V4h10M86 4h10v10M96 61v10H86M14 71H4V61"/></svg>
                        <div class="cam-hud cam-hud-t"><span class="cam-rec"><i></i>${tx('Face mesh', 'شبكة الوجه')} · 468 pts</span><span data-h="fps">— fps</span></div>
                        <div class="cam-hud cam-hud-b"><span>${tx('Yaw', 'الدوران')} <b data-h="yaw">—</b></span><span>${tx('Pitch', 'الميل')} <b data-h="pitch">—</b></span><span>${tx('Distance', 'المسافة')} <b data-h="dist">—</b></span></div>
                        <div class="cam-idle">
                            <svg viewBox="0 0 120 140" class="cam-face" aria-hidden="true"><ellipse cx="60" cy="66" rx="38" ry="50"/><path d="M44 58h8M68 58h8M60 62v14M50 92c6 5 14 5 20 0"/></svg>
                            <b>${tx('Your camera never leaves this device', 'لا تغادر الكاميرا جهازك')}</b>
                            <p>${tx('The model runs on-device and the photo is taken automatically once you are framed and still.', 'يعمل النموذج على جهازك، وتُلتقط الصورة تلقائياً عندما تكون في الإطار وثابتاً.')}</p>
                            <button class="btn btn-primary btn-sm" type="button" data-start>${ico('cam')}${tx('Start camera', 'تشغيل الكاميرا')}</button>
                        </div>
                        <p class="cam-status" aria-live="polite"></p>
                    </div>
                </section>
                <aside class="cam-side">
                    <div class="cam-progress"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19"/><circle class="cam-ring" cx="22" cy="22" r="19" pathLength="100"/></svg><div><b data-h="ready">0/5</b><small>${tx('checks passing', 'شروط متحققة')}</small></div></div>
                    <ul class="checks">
                        <li data-c="face"><i></i>${tx('Face detected', 'تم اكتشاف الوجه')}</li>
                        <li data-c="center"><i></i>${tx('Centred in the guide', 'في منتصف الإطار')}</li>
                        <li data-c="size"><i></i>${tx('Right distance', 'مسافة مناسبة')}</li>
                        <li data-c="front"><i></i>${tx('Facing the camera', 'مواجهة الكاميرا')}</li>
                        <li data-c="still"><i></i>${tx('Holding still', 'ثبات الصورة')}</li>
                    </ul>
                    <figure class="shot" hidden><canvas></canvas><figcaption><b>${tx('Captured automatically', 'التُقطت تلقائياً')}</b><small data-h="meta"></small></figcaption><button class="btn btn-ghost btn-sm" type="button" data-again>${tx('Capture again', 'التقاط مجدداً')}</button></figure>
                    <p class="lab-note">${tx('The same idea as ONSTA’s guided capture: MediaPipe Face Landmarker, GPU-accelerated, entirely in the browser.', 'الفكرة نفسها في التقاط ONSTA الموجَّه: MediaPipe Face Landmarker يعمل بتسريع الرسوميات، كلياً داخل المتصفح.')}</p>
                </aside>
            </div>`;
            const video = $('video', body), ov = $('.cam-ov', body), shot = $('.shot', body);
            const H = k => $(`[data-h=${k}]`, body), status = s => { $('.cam-status', body).textContent = s; };
            let hold = 0, last = null, captured = false, frames = 0, fpsT = performance.now();

            async function start() {
                $('.cam-idle', body).hidden = true;
                status(tx('Loading the face model…', 'جارٍ تحميل نموذج الوجه…'));
                try {
                    if (!landmarker) {
                        const { FilesetResolver, FaceLandmarker } = await import(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VER}/vision_bundle.mjs`);
                        const files = await FilesetResolver.forVisionTasks(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VER}/wasm`);
                        landmarker = await FaceLandmarker.createFromOptions(files, {
                            baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task', delegate: 'GPU' },
                            runningMode: 'VIDEO', numFaces: 1,
                        });
                    }
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
                    video.srcObject = stream;
                    await video.play();
                    alive = true; body.dataset.ready = '1';
                    loop();
                } catch (err) {
                    $('.cam-idle', body).hidden = false;
                    status(err?.name === 'NotAllowedError' ? tx('Camera permission was denied — allow it in the browser to try the demo.', 'تم رفض إذن الكاميرا — اسمح به في المتصفح لتجربة العرض.') : tx('Could not start the camera on this device.', 'تعذّر تشغيل الكاميرا على هذا الجهاز.'));
                }
            }
            function loop() {
                if (!alive) return;
                raf = requestAnimationFrame(loop);
                if (video.readyState < 2) return;
                frames++;
                const now = performance.now();
                if (now - fpsT > 500) { H('fps').textContent = `${Math.round(frames * 1000 / (now - fpsT))} fps`; frames = 0; fpsT = now; }
                const dpr = devicePixelRatio || 1, w = ov.width = ov.clientWidth * dpr, h = ov.height = ov.clientHeight * dpr, g = ov.getContext('2d');
                // map video → stage with object-fit: cover, mirrored
                const vw = video.videoWidth, vh = video.videoHeight, s = Math.max(w / vw, h / vh), ox = (w - vw * s) / 2, oy = (h - vh * s) / 2;
                const P = p => [w - (ox + p.x * vw * s), oy + p.y * vh * s];
                const res = landmarker.detectForVideo(video, now), pts = res.faceLandmarks?.[0];
                const ok = { face: !!pts };
                const cx = w / 2, cy = h * .48, rx = Math.min(w, h * 1.33) * .19, ry = h * .38;
                if (pts) {
                    g.fillStyle = 'rgba(132, 102, 255, .75)';
                    for (let i = 0; i < pts.length; i += 2) { const [x, y] = P(pts[i]); g.fillRect(x - dpr * .8, y - dpr * .8, dpr * 1.6, dpr * 1.6); }
                    const xs = pts.map(p => P(p)[0]), ys = pts.map(p => P(p)[1]);
                    const fx = (Math.min(...xs) + Math.max(...xs)) / 2, fy = (Math.min(...ys) + Math.max(...ys)) / 2, fw = Math.max(...xs) - Math.min(...xs);
                    const nose = pts[1], le = pts[33], re = pts[263], chin = pts[152], brow = pts[10];
                    const yaw = ((nose.x - (le.x + re.x) / 2) / Math.abs(re.x - le.x)) * -90;
                    const pitch = (((nose.y - brow.y) / (chin.y - brow.y)) - .52) * 120;
                    ok.center = Math.abs(fx - cx) < w * .07 && Math.abs(fy - cy) < h * .1;
                    ok.size = fw > rx * 1.25 && fw < rx * 2.3;
                    ok.front = Math.abs(yaw) < 9 && Math.abs(pitch) < 12;
                    ok.still = last ? Math.hypot(fx - last[0], fy - last[1]) < 2.2 * dpr : false;
                    last = [fx, fy];
                    H('yaw').textContent = `${yaw > 0 ? '+' : ''}${yaw.toFixed(0)}°`;
                    H('pitch').textContent = `${pitch > 0 ? '+' : ''}${pitch.toFixed(0)}°`;
                    H('dist').textContent = fw > rx * 2.3 ? tx('close', 'قريب') : fw < rx * 1.25 ? tx('far', 'بعيد') : tx('good', 'مناسبة');
                } else { last = null; ['yaw', 'pitch', 'dist'].forEach(k => { H(k).textContent = '—'; }); }
                const keys = ['face', 'center', 'size', 'front', 'still'];
                keys.forEach(k => $(`[data-c=${k}]`, body).classList.toggle('ok', !!ok[k]));
                const passing = keys.filter(k => ok[k]).length;
                H('ready').textContent = `${passing}/5`;
                const all = passing === 5;
                hold = captured ? hold : all ? Math.min(hold + 1 / 40, 1) : Math.max(hold - 1 / 15, 0);
                $('.cam-ring', body).style.strokeDashoffset = 100 - (captured ? 100 : hold * 100);
                g.lineWidth = 2.5 * dpr; g.setLineDash(all ? [] : [8 * dpr, 7 * dpr]);
                g.strokeStyle = all ? '#2fbf6c' : 'rgba(255,255,255,.7)';
                g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
                if (hold > 0) { g.strokeStyle = '#2fbf6c'; g.lineWidth = 4 * dpr; g.beginPath(); g.ellipse(cx, cy, rx + 9 * dpr, ry + 9 * dpr, 0, -Math.PI / 2, -Math.PI / 2 + hold * Math.PI * 2); g.stroke(); }
                if (captured) return;
                status(!ok.face ? tx('Look at the camera', 'انظر إلى الكاميرا') : !ok.size ? tx('Move a little closer or further', 'اقترب قليلاً أو ابتعد') : !ok.center ? tx('Centre your face in the oval', 'ضع وجهك في منتصف الإطار') : !ok.front ? tx('Face the camera straight on', 'واجه الكاميرا مباشرة') : hold < 1 ? tx('Hold still…', 'اثبت قليلاً…') : '');
                if (hold >= 1) {
                    captured = true;
                    const c = $('canvas', shot); c.width = vw; c.height = vh;
                    const cg = c.getContext('2d'); cg.translate(vw, 0); cg.scale(-1, 1); cg.drawImage(video, 0, 0);
                    H('meta').textContent = `${clock()} · ${vw}×${vh} · ${tx('yaw', 'دوران')} ${H('yaw').textContent} · ${tx('pitch', 'ميل')} ${H('pitch').textContent}`;
                    shot.hidden = false;
                    status(tx('Captured — no button pressed', 'التُقطت — دون الضغط على أي زر'));
                }
            }
            $('[data-start]', body).onclick = start;
            $('[data-again]', body).onclick = () => { captured = false; hold = 0; shot.hidden = true; };
            if (!navigator.mediaDevices?.getUserMedia) status(tx('This browser has no camera access.', 'هذا المتصفح لا يدعم الوصول إلى الكاميرا.'));
        },
        unmount: stop,
    };
})();

/* =========================================================
   3. Live admin dashboard (simulated stream)
   ========================================================= */
const dashboard = (() => {
    let timer, st;
    const seed = n => Array.from({ length: n }, (_, i) => 18 + Math.sin(i / 6) * 5 + rand(-3, 3));
    return {
        file: 'dashboard.tsx',
        title: () => tx('Live admin dashboard', 'لوحة إدارة حيّة'),
        mount(body) {
            st = st || {
                range: 'today', paused: false, series: seed(72),
                kpi: { users: { v: 184, h: seed(20) }, scans: { v: 1260, h: seed(20) }, rev: { v: 2840, h: seed(20) }, cost: { v: 38.4, h: seed(20) } },
                byType: { face: 22.1, hand: 9.6, body: 6.7 },
                cities: [['Dubai', 'دبي', 41], ['Abu Dhabi', 'أبوظبي', 22], ['Sharjah', 'الشارقة', 14], ['Riyadh', 'الرياض', 12], ['Kuwait City', 'مدينة الكويت', 7]],
                feed: [],
            };
            const RANGES = { today: 1, '7d': 7.2, '30d': 29 };
            body.innerHTML = `
            <div class="x-dash">
                <nav class="db-side" aria-label="${tx('Admin', 'الإدارة')}">
                    <span class="db-brand"><i>L</i>Lumen</span>
                    ${[['grid', tx('Overview', 'نظرة عامة'), 1], ['scan', tx('Scans', 'التحليلات')], ['card', tx('Subscriptions', 'الاشتراكات')], ['chat', tx('Support', 'الدعم')], ['cog', tx('Settings', 'الإعدادات')]]
                        .map(([i, l, a]) => `<span class="db-nav ${a ? 'on' : ''}">${ico(i)}<b>${l}</b></span>`).join('')}
                </nav>
                <div class="db-main">
                    <header class="db-top"><div><b>${tx('Overview', 'نظرة عامة')}</b><small><i class="dot-live"></i>${tx('Live · simulated data', 'مباشر · بيانات محاكاة')}</small></div>
                        <div class="seg" role="group">${Object.keys(RANGES).map(r => `<button type="button" data-r="${r}" aria-pressed="${st.range === r}">${{ today: tx('Today', 'اليوم'), '7d': tx('7 days', '7 أيام'), '30d': tx('30 days', '30 يوماً') }[r]}</button>`).join('')}</div>
                        <button class="db-icon" type="button" data-pause aria-label="${tx('Pause', 'إيقاف مؤقت')}"></button></header>
                    <div class="db-kpis">${[['users', tx('Active users', 'المستخدمون النشطون')], ['scans', tx('AI scans', 'تحليلات الذكاء')], ['rev', tx('Revenue', 'الإيرادات')], ['cost', tx('AI cost', 'تكلفة الذكاء')]]
                        .map(([k, l]) => `<div class="db-kpi" data-kpi="${k}"><span>${l}</span><b></b><em></em><div class="db-spark"></div></div>`).join('')}</div>
                    <div class="db-grid">
                        <figure class="db-card db-chart"><figcaption><b>${tx('Scans per minute', 'التحليلات في الدقيقة')}</b><small>${tx('hover for details', 'مرّر للتفاصيل')}</small></figcaption><div class="db-canvas"><canvas></canvas><div class="db-tip" hidden></div></div></figure>
                        <figure class="db-card"><figcaption><b>${tx('AI cost by report', 'تكلفة الذكاء حسب التقرير')}</b></figcaption><div class="donut"></div></figure>
                        <figure class="db-card"><figcaption><b>${tx('Users by city', 'المستخدمون حسب المدينة')}</b></figcaption><div class="db-bars"></div></figure>
                        <figure class="db-card"><figcaption><b>${tx('Event stream', 'سجل الأحداث')}</b></figcaption><ol class="db-feed"></ol></figure>
                    </div>
                </div>
            </div>`;
            const canvas = $('canvas', body), tip = $('.db-tip', body), mul = () => RANGES[st.range];
            const pauseBtn = $('[data-pause]', body);
            const setPause = () => { pauseBtn.innerHTML = ico(st.paused ? 'play' : 'pause'); pauseBtn.setAttribute('aria-label', st.paused ? tx('Resume', 'استئناف') : tx('Pause', 'إيقاف مؤقت')); };
            pauseBtn.onclick = () => { st.paused = !st.paused; setPause(); };
            setPause();
            $$('[data-r]', body).forEach(b => { b.onclick = () => { st.range = b.dataset.r; $$('[data-r]', body).forEach(x => x.setAttribute('aria-pressed', x === b)); render(); draw(); }; });
            const EVENTS = () => [[tx('Face scan completed', 'اكتمل تحليل وجه'), 'scan'], [tx('Hand & nail report', 'تقرير يد وأظافر'), 'scan'], [tx('Subscription started', 'بدء اشتراك'), 'card'], [tx('Support chat opened', 'فتح محادثة دعم'), 'chat'], [tx('Body analysis', 'تحليل جسم'), 'scan']];

            function render() {
                const m = mul(), K = st.kpi;
                const vals = { users: fmt(K.users.v * (st.range === 'today' ? 1 : 5.6 * m / 7.2)), scans: fmt(K.scans.v * m), rev: '$' + fmt(K.rev.v * m), cost: '$' + fmt(K.cost.v * m, 2) };
                Object.entries(K).forEach(([k, o]) => {
                    const card = $(`[data-kpi=${k}]`, body), d = ((o.h.at(-1) - o.h[0]) / o.h[0] * 100);
                    $('b', card).textContent = vals[k];
                    const em = $('em', card); em.textContent = `${d >= 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(1)}%`; em.className = (k === 'cost' ? d <= 0 : d >= 0) ? 'up' : 'down';
                    $('.db-spark', card).innerHTML = spark(o.h);
                });
                const parts = [['face', tx('Face', 'الوجه'), '#5006fd'], ['hand', tx('Hand & nails', 'اليد والأظافر'), '#8466ff'], ['body', tx('Body', 'الجسم'), '#c9c7df']];
                const tot = parts.reduce((a, [k]) => a + st.byType[k], 0);
                let acc = 0;
                const arcs = parts.map(([k, , c]) => { const f = st.byType[k] / tot, s = `<circle r="15.9" cx="20" cy="20" pathLength="100" stroke="${c}" stroke-dasharray="${(f * 100 - .8).toFixed(2)} 100" stroke-dashoffset="${(-acc * 100).toFixed(2)}"/>`; acc += f; return s; }).join('');
                $('.donut', body).innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle r="15.9" cx="20" cy="20" class="donut-bg"/>${arcs}<text x="20" y="19" class="d-v">$${fmt(tot * m, 0)}</text><text x="20" y="25" class="d-l">${tx('total', 'الإجمالي')}</text></svg>
                    <ul>${parts.map(([k, n, c]) => `<li><i style="background:${c}"></i>${n}<b>${Math.round(st.byType[k] / tot * 100)}%</b></li>`).join('')}</ul>`;
                const ct = st.cities.reduce((a, c) => a + c[2], 0);
                $('.db-bars', body).innerHTML = st.cities.map(c => `<div class="db-bar"><span>${ar() ? c[1] : c[0]}</span><i style="--w:${c[2] / ct * 100}%"></i><b>${Math.round(c[2] / ct * 100)}%</b></div>`).join('');
                $('.db-feed', body).innerHTML = st.feed.map(f => `<li>${ico(f.icon)}<span>${esc(f.label)}<small>${esc(f.city)}</small></span><time>${f.t}</time></li>`).join('') || `<li class="empty">${tx('Waiting for events…', 'بانتظار الأحداث…')}</li>`;
            }
            let hoverI = -1;
            function draw() {
                const dpr = devicePixelRatio || 1, w = canvas.width = canvas.clientWidth * dpr, h = canvas.height = canvas.clientHeight * dpr;
                const g = canvas.getContext('2d'), s = st.series.map(v => v * mul()), max = Math.max(...s) * 1.18, padL = 34 * dpr, padB = 18 * dpr, pad = 6 * dpr;
                g.clearRect(0, 0, w, h);
                g.font = `${10 * dpr}px ${css('--font') || 'sans-serif'}`; g.fillStyle = css('--muted');
                g.strokeStyle = css('--line'); g.lineWidth = dpr;
                for (let i = 0; i <= 3; i++) {
                    const y = pad + (h - pad - padB) * i / 3;
                    g.beginPath(); g.moveTo(padL, y); g.lineTo(w, y); g.stroke();
                    g.fillText(fmt(max * (1 - i / 3), 0), 0, y + 4 * dpr);
                }
                const X = i => padL + (w - padL - pad) * i / (s.length - 1), Y = v => pad + (h - pad - padB) * (1 - v / max);
                const grad = g.createLinearGradient(0, pad, 0, h); grad.addColorStop(0, 'rgba(80,6,253,.32)'); grad.addColorStop(1, 'rgba(80,6,253,0)');
                g.beginPath(); s.forEach((v, i) => (i ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v)))); g.lineTo(X(s.length - 1), h - padB); g.lineTo(X(0), h - padB); g.fillStyle = grad; g.fill();
                g.beginPath(); s.forEach((v, i) => (i ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v)))); g.strokeStyle = css('--accent'); g.lineWidth = 2 * dpr; g.lineJoin = 'round'; g.stroke();
                const li = hoverI >= 0 ? hoverI : s.length - 1;
                if (hoverI >= 0) { g.strokeStyle = css('--line-2'); g.lineWidth = dpr; g.beginPath(); g.moveTo(X(li), pad); g.lineTo(X(li), h - padB); g.stroke(); }
                g.fillStyle = css('--accent'); g.beginPath(); g.arc(X(li), Y(s[li]), 4.5 * dpr, 0, Math.PI * 2); g.fill();
                g.fillStyle = '#fff'; g.beginPath(); g.arc(X(li), Y(s[li]), 2 * dpr, 0, Math.PI * 2); g.fill();
                if (hoverI >= 0) {
                    tip.hidden = false;
                    const ago = s.length - 1 - hoverI;
                    tip.innerHTML = `<b>${fmt(s[hoverI], 1)}</b> ${tx('scans/min', 'تحليل/د')}<small>${ago ? tx(`${ago} min ago`, `قبل ${ago} د`) : tx('now', 'الآن')}</small>`;
                    tip.style.left = `${X(hoverI) / dpr}px`; tip.style.top = `${Y(s[hoverI]) / dpr}px`;
                } else tip.hidden = true;
            }
            canvas.addEventListener('pointermove', e => {
                const r = canvas.getBoundingClientRect(), padL = 34;
                hoverI = clamp(Math.round((e.clientX - r.left - padL) / (r.width - padL - 6) * (st.series.length - 1)), 0, st.series.length - 1);
                draw();
            });
            canvas.addEventListener('pointerleave', () => { hoverI = -1; draw(); });
            function step() {
                if (st.paused) return;
                const K = st.kpi;
                K.users.v = Math.max(90, Math.round(K.users.v + rand(-6, 7)));
                const n = Math.round(rand(0, 3)); K.scans.v += n; K.cost.v += n * rand(.02, .05);
                if (Math.random() < .2) K.rev.v += [9, 25, 30][Math.floor(rand(0, 3))];
                Object.values(K).forEach(o => { o.h.push(Math.max(1, o.h.at(-1) + rand(-2, 2.4))); o.h.shift(); });
                st.series.push(Math.max(4, st.series.at(-1) + rand(-3, 3.2))); st.series.shift();
                st.byType[['face', 'face', 'hand', 'body'][Math.floor(rand(0, 4))]] += rand(.01, .04);
                if (Math.random() < .55) {
                    const e = EVENTS()[Math.floor(rand(0, 5))], c = st.cities[Math.floor(rand(0, st.cities.length))];
                    c[2] += 1;
                    st.feed.unshift({ t: new Date().toLocaleTimeString('en-GB'), label: e[0], icon: e[1], city: ar() ? c[1] : c[0] });
                    st.feed = st.feed.slice(0, 7);
                }
                render(); draw();
            }
            render(); draw();
            timer = setInterval(step, reduceMotion ? 3000 : 1200);
            this._draw = draw;
            addEventListener('resize', draw);
        },
        unmount() { clearInterval(timer); removeEventListener('resize', this._draw); },
    };
})();

/* =========================================================
   4. Branch network monitor (NOC view, simulated)
   ========================================================= */
const network = (() => {
    let timer, raf, devs, alerts;
    const K = { router: ['Core router', 'الموجّه الرئيسي'], switch: ['Switch', 'المحوّل'], server: ['Server', 'الخادم'], nvr: ['NVR', 'مسجّل الكاميرات'], pc: ['Counter PC', 'حاسوب الشباك'], laptop: ['Laptop', 'محمول'], printer: ['Printer', 'طابعة'], cam: ['Camera', 'كاميرا'] };
    const build = () => {
        const d = [{ id: 'core', kind: 'router', ip: '10.0.0.1' }, { id: 'sw', kind: 'switch', ip: '10.0.0.2' }, { id: 'srv', kind: 'server', ip: '10.0.0.10' }, { id: 'nvr', kind: 'nvr', ip: '10.0.0.20' }];
        for (let i = 1; i <= 4; i++) d.push({ id: 'pc' + i, kind: 'pc', ip: `10.0.1.${10 + i}` });
        for (let i = 1; i <= 2; i++) d.push({ id: 'lt' + i, kind: 'laptop', ip: `10.0.1.${40 + i}` });
        for (let i = 1; i <= 2; i++) d.push({ id: 'pr' + i, kind: 'printer', ip: `10.0.2.${20 + i}` });
        for (let i = 1; i <= 4; i++) d.push({ id: 'cam' + i, kind: 'cam', ip: `10.0.3.${10 + i}` });
        return d.map(x => ({ ...x, status: 'ok', ms: rand(1, 5), note: '', h: Array.from({ length: 16 }, () => rand(1, 5)) }));
    };
    const name = d => `${tx(...K[d.kind])}${/\d/.test(d.id) ? ' ' + d.id.replace(/\D/g, '') : ''}`;
    return {
        file: 'netmon.ts',
        title: () => tx('Branch network monitor', 'مراقبة شبكة الفرع'),
        mount(body) {
            devs = devs || build(); alerts = alerts || [];
            body.innerHTML = `
            <div class="x-noc">
                <div class="noc-kpis">
                    <div><span>${tx('Online', 'متصل')}</span><b data-s="on"></b></div><div><span>${tx('Avg. latency', 'متوسط الاستجابة')}</span><b data-s="ms"></b></div>
                    <div><span>${tx('Packet loss', 'فقد الحزم')}</span><b data-s="loss"></b></div><div><span>${tx('Open alerts', 'تنبيهات مفتوحة')}</span><b data-s="al"></b></div>
                </div>
                <div class="noc-grid">
                    <figure class="noc-card noc-topo"><figcaption><b>${tx('Topology', 'مخطط الشبكة')}</b><span class="noc-actions"><button class="btn btn-ghost btn-sm" type="button" data-fault>${ico('alert')}${tx('Simulate fault', 'محاكاة عطل')}</button><button class="btn btn-primary btn-sm" type="button" data-diag>${ico('wifi')}${tx('Run diagnostics', 'تشغيل التشخيص')}</button></span></figcaption>
                        <svg viewBox="0 0 640 300" role="img" aria-label="${tx('Network topology', 'مخطط الشبكة')}"><g class="links"></g><g class="pkts"></g><g class="nodes"></g></svg></figure>
                    <figure class="noc-card noc-table"><figcaption><b>${tx('Devices', 'الأجهزة')}</b></figcaption><div class="noc-scroll"><table><thead><tr><th>${tx('Device', 'الجهاز')}</th><th>IP</th><th>${tx('Status', 'الحالة')}</th><th>${tx('Latency', 'الاستجابة')}</th></tr></thead><tbody></tbody></table></div></figure>
                    <figure class="noc-card noc-alerts"><figcaption><b>${tx('Alerts', 'التنبيهات')}</b></figcaption><ol></ol></figure>
                </div>
                <p class="lab-note">${tx('Modelled on running IT for a money-transfer centre: network, cameras, PCs, laptops and printers. Data is simulated.', 'مستوحى من إدارة تقنية المعلومات في مركز تحويلات مالية: الشبكة والكاميرات والحواسيب والمحمولات والطابعات. البيانات محاكاة.')}</p>
            </div>`;
            const pos = { core: [320, 40], sw: [320, 120] }, leaves = devs.filter(d => !['core', 'sw'].includes(d.id));
            leaves.forEach((d, i) => { pos[d.id] = [40 + i * (560 / (leaves.length - 1)), 250 + (i % 2) * 22]; });
            const GLYPH = { router: '⌂', switch: '⇄', server: '▤', nvr: '◉', pc: '▭', laptop: '⌨', printer: '⎙', cam: '◎' };
            const parent = d => d.id === 'sw' ? 'core' : 'sw';
            const pkts = devs.filter(d => d.id !== 'core').map(d => ({ d, t: Math.random(), up: Math.random() < .5 }));
            let scanning = -1;
            function draw() {
                $('.links', body).innerHTML = devs.filter(d => d.id !== 'core').map(d => { const [a, b] = [pos[parent(d)], pos[d.id]]; return `<path class="lk lk-${d.status}" d="M${a[0]},${a[1]} C${a[0]},${(a[1] + b[1]) / 2} ${b[0]},${(a[1] + b[1]) / 2} ${b[0]},${b[1]}"/>`; }).join('');
                $('.nodes', body).innerHTML = devs.map((d, i) => { const [x, y] = pos[d.id], big = ['core', 'sw'].includes(d.id); return `<g class="nd nd-${d.status} ${i === scanning ? 'scan' : ''}" transform="translate(${x},${y})"><title>${esc(name(d))} · ${d.ip}</title><circle r="${big ? 18 : 13}"/><text dy="4.5">${GLYPH[d.kind]}</text></g>`; }).join('');
                const up = devs.filter(d => d.status !== 'down');
                $('[data-s=on]', body).textContent = `${up.length}/${devs.length}`;
                $('[data-s=ms]', body).textContent = fmt(up.reduce((a, d) => a + d.ms, 0) / up.length, 1) + ' ms';
                $('[data-s=loss]', body).textContent = fmt((devs.length - up.length) / devs.length * 100, 1) + '%';
                const open = alerts.filter(a => !a.done).length;
                $('[data-s=al]', body).textContent = open;
                $('[data-s=al]', body).parentElement.classList.toggle('bad', open > 0);
                $('tbody', body).innerHTML = devs.map((d, i) => `<tr class="${i === scanning ? 'scan' : ''}"><td>${esc(name(d))}</td><td dir="ltr">${d.ip}</td><td><span class="st st-${d.status}">${{ ok: tx('Healthy', 'سليم'), warn: tx('Degraded', 'متراجع'), down: tx('Offline', 'غير متصل') }[d.status]}</span></td><td>${d.status === 'down' ? '—' : `${spark(d.h, 60, 16)}<b>${fmt(d.ms, 1)}</b>`}</td></tr>`).join('');
                $('.noc-alerts ol', body).innerHTML = alerts.length ? alerts.slice(0, 6).map((a, i) => `<li class="${a.done ? 'done' : a.level}">${ico(a.level === 'ok' ? 'check' : 'alert')}<span>${esc(a.text())}<time>${a.t}</time></span>${a.done ? '' : `<button type="button" data-ack="${i}">${tx('Ack', 'تأكيد')}</button>`}</li>`).join('') : `<li class="ok">${ico('check')}<span>${tx('All systems normal.', 'كل الأنظمة تعمل بشكل طبيعي.')}</span></li>`;
                $$('[data-ack]', body).forEach(b => { b.onclick = () => { alerts[+b.dataset.ack].done = true; draw(); }; });
            }
            function packets() {
                raf = requestAnimationFrame(packets);
                const g = $('.pkts', body);
                if (!g) return;
                g.innerHTML = pkts.filter(p => p.d.status !== 'down').map(p => {
                    p.t = (p.t + (reduceMotion ? 0 : .006 + (p.d.status === 'warn' ? -.004 : 0))) % 1;
                    const [a, b] = [pos[parent(p.d)], pos[p.d.id]], t = p.up ? 1 - p.t : p.t, my = (a[1] + b[1]) / 2;
                    const x = (1 - t) ** 3 * a[0] + 3 * (1 - t) ** 2 * t * a[0] + 3 * (1 - t) * t ** 2 * b[0] + t ** 3 * b[0];
                    const y = (1 - t) ** 3 * a[1] + 3 * (1 - t) ** 2 * t * my + 3 * (1 - t) * t ** 2 * my + t ** 3 * b[1];
                    return `<circle class="pk" r="2.6" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}"/>`;
                }).join('');
            }
            const raise = (d, kind) => {
                const msgs = { down: [`${name(d)} is offline (${d.ip})`, `${name(d)} غير متصل (${d.ip})`], slow: [`${name(d)} latency above 60 ms`, `استجابة ${name(d)} تجاوزت 60 ms`], toner: [`${name(d)} toner below 10%`, `حبر ${name(d)} أقل من 10%`] };
                d.status = kind === 'down' ? 'down' : 'warn'; d.note = kind;
                alerts.unshift({ level: kind === 'down' ? 'crit' : 'warn', t: new Date().toLocaleTimeString('en-GB'), text: () => tx(...msgs[kind]), done: false });
            };
            const fault = () => {
                const pool = devs.filter(d => d.status === 'ok' && !['core', 'sw'].includes(d.id)), d = pool[Math.floor(rand(0, pool.length))];
                if (!d) return;
                raise(d, d.kind === 'printer' ? 'toner' : d.kind === 'cam' ? 'down' : Math.random() < .5 ? 'slow' : 'down');
                draw();
            };
            $('[data-fault]', body).onclick = fault;
            $('[data-diag]', body).onclick = () => {
                let i = 0;
                const tick = () => {
                    scanning = i;
                    const d = devs[i];
                    if (d && d.status !== 'ok') { d.status = 'ok'; d.note = ''; d.ms = rand(1, 4); }
                    draw();
                    if (++i < devs.length) timer2 = setTimeout(tick, reduceMotion ? 0 : 110);
                    else { scanning = -1; alerts.forEach(a => { a.done = true; }); alerts.unshift({ level: 'ok', t: new Date().toLocaleTimeString('en-GB'), text: () => tx('Diagnostics passed — every device healthy.', 'نجح التشخيص — كل الأجهزة سليمة.'), done: true }); draw(); }
                };
                tick();
            };
            let timer2;
            this._t2 = () => clearTimeout(timer2);
            function step() {
                devs.forEach(d => {
                    if (d.status === 'down') return;
                    d.ms = d.note === 'slow' ? rand(60, 90) : Math.max(.6, d.ms + rand(-.7, .7));
                    d.h.push(d.ms); d.h.shift();
                });
                if (Math.random() < .07) fault(); else draw();
            }
            draw(); packets();
            timer = setInterval(step, reduceMotion ? 3000 : 1500);
        },
        unmount() { clearInterval(timer); cancelAnimationFrame(raf); this._t2?.(); },
    };
})();

/* =========================================================
   5. RTL / LTR — the same screen, physical vs logical CSS
   ========================================================= */
const rtl = (() => ({
    file: 'rtl.css',
    title: () => tx('RTL / LTR playground', 'ساحة تجربة الاتجاهين'),
    mount(body) {
        let mode = 'physical';
        const T = {
            ltr: { title: 'Profile', badge: 'Pro', name: 'Sara Ahmed', role: 'Product designer', ph: 'sara@example.com', toast: 'Changes saved', next: 'Continue' },
            rtl: { title: 'الملف الشخصي', badge: 'مميّز', name: 'سارة أحمد', role: 'مصممة منتجات', ph: 'sara@example.com', toast: 'تم حفظ التغييرات', next: 'متابعة' },
        };
        const phone = dir => `<figure class="rt-phone"><figcaption>${dir === 'ltr' ? 'English · LTR' : 'العربية · RTL'}</figcaption>
            <div class="rt-screen" dir="${dir}"><div class="rt-head"><span class="rt-back" data-n="1">←</span><b>${T[dir].title}</b><span class="rt-badge" data-n="2">${T[dir].badge}</span></div>
            <div class="rt-user"><span class="rt-av" data-n="3">SA</span><div><b>${T[dir].name}</b><small>${T[dir].role}</small></div></div>
            <div class="rt-steps" data-n="4"><i class="on"></i><i class="on"></i><i></i></div>
            <label class="rt-field"><span class="rt-ico" data-n="5">✉</span><input value="${T[dir].ph}" readonly tabindex="-1"></label>
            <div class="rt-toast" data-n="6">${T[dir].toast}</div><button class="rt-btn" type="button" tabindex="-1">${T[dir].next} <span class="rt-arrow">→</span></button></div></figure>`;
        const ISSUES = [
            tx('Back arrow points the wrong way', 'سهم الرجوع يشير للاتجاه الخطأ'),
            tx('Badge pushed to the wrong edge', 'الشارة على الطرف الخطأ'),
            tx('Avatar spacing on the outer side', 'مسافة الصورة على الجهة الخارجية'),
            tx('Progress fills from the wrong end', 'شريط التقدّم يمتلئ من الطرف الخطأ'),
            tx('Icon overlaps the start of the text', 'الأيقونة تغطي بداية النص'),
            tx('Accent bar on the wrong side', 'الشريط الملوّن على الجهة الخطأ'),
        ];
        const CODE = {
            physical: `.badge   { margin-left: auto; }\n.avatar  { margin-right: 12px; }\n.icon    { left: 12px; }\n.input   { padding-left: 36px; }\n.toast   { border-left: 4px solid; }\n.back    { /* no flip */ }`,
            logical: `.badge   { margin-inline-start: auto; }\n.avatar  { margin-inline-end: 12px; }\n.icon    { inset-inline-start: 12px; }\n.input   { padding-inline-start: 36px; }\n.toast   { border-inline-start: 4px solid; }\n[dir=rtl] .back { transform: scaleX(-1); }`,
        };
        body.innerHTML = `
        <div class="x-rtl" data-mode="physical">
            <header class="rt-bar"><div class="seg" role="group"><button type="button" data-m="physical" aria-pressed="true">${tx('Physical CSS (left/right)', 'خصائص فيزيائية (left/right)')}</button><button type="button" data-m="logical" aria-pressed="false">${tx('Logical CSS (start/end)', 'خصائص منطقية (start/end)')}</button></div><span class="rt-score"></span></header>
            <div class="rt-body"><div class="rt-phones">${phone('ltr')}${phone('rtl')}</div>
                <aside class="rt-side"><p class="lab-k">${tx('What changes in Arabic', 'ما الذي يتغيّر بالعربية')}</p><ol class="rt-issues">${ISSUES.map((s, i) => `<li><i>${i + 1}</i>${s}</li>`).join('')}</ol><pre class="rt-code" dir="ltr"></pre></aside></div>
            <p class="lab-note">${tx('The same component, written two ways. Physical properties hard-wire left and right, so the Arabic screen breaks in six places; logical properties follow the reading direction — the way ONSTA’s Arabic interface is built.', 'المكوّن نفسه مكتوباً بطريقتين. الخصائص الفيزيائية تثبّت اليسار واليمين، فتنكسر الشاشة العربية في ستة مواضع؛ أما المنطقية فتتبع اتجاه القراءة — وهي الطريقة التي بُنيت بها واجهة ONSTA العربية.')}</p>
        </div>`;
        const root_ = $('.x-rtl', body);
        const apply = () => {
            root_.dataset.mode = mode;
            $$('[data-m]', body).forEach(b => b.setAttribute('aria-pressed', b.dataset.m === mode));
            $('.rt-code', body).innerHTML = esc(CODE[mode]).replace(/(margin|padding|border|inset)[-\w]*/g, m => `<span class="ck">${m}</span>`).replace(/\/\*.*?\*\//g, m => `<span class="cc">${m}</span>`);
            $('.rt-score', body).innerHTML = mode === 'physical' ? `${ico('alert')}${tx('6 issues in RTL', '6 مشكلات في RTL')}` : `${ico('check')}${tx('0 issues — mirrors itself', 'لا مشكلات — ينعكس تلقائياً')}`;
            $('.rt-score', body).className = 'rt-score ' + (mode === 'physical' ? 'bad' : 'good');
        };
        $$('[data-m]', body).forEach(b => { b.onclick = () => { mode = b.dataset.m; apply(); }; });
        apply();
    },
    unmount() {},
}))();

/* =========================================================
   6. AI cost calculator — presets, stacked costs, caching
   ========================================================= */
const cost = (() => {
    const st = { preset: 'chat', req: 2000, inTok: 1800, outTok: 450, cache: 40, models: [{ n: ['Small', 'صغير'], i: .15, o: .6 }, { n: ['Mid', 'متوسط'], i: 1, o: 4 }, { n: ['Large', 'كبير'], i: 5, o: 20 }] };
    const PRESETS = { chat: { req: 2000, inTok: 1800, outTok: 450, cache: 40 }, vision: { req: 600, inTok: 2600, outTok: 900, cache: 10 }, agent: { req: 300, inTok: 14000, outTok: 2200, cache: 70 } };
    const calc = (m, cache = st.cache) => {
        const inC = st.inTok * (1 - cache / 100) / 1e6 * m.i, cachedC = st.inTok * cache / 100 * .1 / 1e6 * m.i, outC = st.outTok / 1e6 * m.o, k = st.req * 30;
        return { inC: inC * k, cachedC: cachedC * k, outC: outC * k, total: (inC + cachedC + outC) * k, per1k: (inC + cachedC + outC) * 1000 };
    };
    return {
        file: 'cost.ts',
        title: () => tx('AI cost calculator', 'حاسبة تكلفة الذكاء الاصطناعي'),
        mount(body) {
            const P = { chat: [tx('Support chatbot', 'روبوت دعم'), 'chat'], vision: [tx('Image analysis', 'تحليل الصور'), 'scan'], agent: [tx('AI agent', 'وكيل ذكي'), 'bolt'] };
            body.innerHTML = `
            <div class="x-cost">
                <div class="cs-presets" role="group">${Object.entries(P).map(([k, [l, i]]) => `<button type="button" data-p="${k}" aria-pressed="${st.preset === k}">${ico(i)}<b>${l}</b><small></small></button>`).join('')}</div>
                <div class="cs-grid">
                    <section class="cs-inputs">
                        ${[['req', tx('Requests per day', 'الطلبات يومياً'), 100, 50000, 100], ['inTok', tx('Input tokens / request', 'رموز الإدخال / طلب'), 100, 30000, 100], ['outTok', tx('Output tokens / request', 'رموز الإخراج / طلب'), 50, 8000, 50], ['cache', tx('Cached share of input', 'نسبة الإدخال المخزّن'), 0, 90, 5]]
                            .map(([k, l, a, b, s]) => `<label class="cs-rng"><span>${l}</span><output data-o="${k}"></output><input type="range" min="${a}" max="${b}" step="${s}" data-k="${k}"></label>`).join('')}
                        <details class="cs-prices"><summary>${tx('Edit model prices ($ per 1M tokens)', 'تعديل أسعار النماذج ($ لكل مليون رمز)')}</summary><table><tbody>${st.models.map((m, i) => `<tr><td>${ar() ? m.n[1] : m.n[0]}</td><td><label>${tx('in', 'إدخال')}<input type="number" min="0" step="0.01" data-m="${i}" data-f="i" value="${m.i}"></label></td><td><label>${tx('out', 'إخراج')}<input type="number" min="0" step="0.01" data-m="${i}" data-f="o" value="${m.o}"></label></td></tr>`).join('')}</tbody></table></details>
                    </section>
                    <section class="cs-out">
                        <div class="cs-models"></div>
                        <div class="cs-legend"><span><i class="l-in"></i>${tx('Input', 'إدخال')}</span><span><i class="l-ca"></i>${tx('Cached input', 'إدخال مخزّن')}</span><span><i class="l-out"></i>${tx('Output', 'إخراج')}</span></div>
                        <p class="cs-save"></p>
                    </section>
                </div>
                <p class="lab-note">${tx('Prices are illustrative and editable — enter your provider’s current rates. Cached input is billed at 10% here, a common discount shape.', 'الأسعار توضيحية وقابلة للتعديل — أدخل الأسعار الحالية لمزوّدك. يُحتسب الإدخال المخزّن هنا بنسبة 10%، وهو شكل خصم شائع.')}</p>
            </div>`;
            const money = v => '$' + (v >= 100 ? fmt(v) : fmt(v, 2));
            const sync = () => {
                ['req', 'inTok', 'outTok', 'cache'].forEach(k => { $(`[data-k=${k}]`, body).value = st[k]; $(`[data-o=${k}]`, body).textContent = k === 'cache' ? st[k] + '%' : fmt(st[k]); });
                $$('[data-p]', body).forEach(b => { b.setAttribute('aria-pressed', b.dataset.p === st.preset); const p = PRESETS[b.dataset.p]; $('small', b).textContent = `${fmt(p.req)}/${tx('day', 'يوم')} · ${fmt(p.inTok)} in`; });
                const rows = st.models.map(m => ({ m, ...calc(m) })), max = Math.max(...rows.map(r => r.total)) || 1, best = Math.min(...rows.map(r => r.total));
                $('.cs-models', body).innerHTML = rows.map(r => `<div class="cs-m ${r.total === best ? 'best' : ''}">
                    <div class="cs-m-top"><b>${tx(r.m.n[0] + ' model', 'نموذج ' + r.m.n[1])}</b>${r.total === best ? `<span class="wa-pill ok">${tx('Lowest', 'الأقل')}</span>` : ''}<strong>${money(r.total)}<small>/${tx('mo', 'شهر')}</small></strong></div>
                    <div class="cs-stack" style="--w:${(r.total / max * 100).toFixed(1)}%"><i class="l-in" style="flex:${r.inC}"></i><i class="l-ca" style="flex:${r.cachedC}"></i><i class="l-out" style="flex:${r.outC}"></i></div>
                    <small>${money(r.per1k)} ${tx('per 1,000 requests', 'لكل 1,000 طلب')}</small></div>`).join('');
                const mid = st.models[1], saved = calc(mid, 0).total - calc(mid).total;
                $('.cs-save', body).innerHTML = st.cache ? `${ico('bolt')}<span>${tx(`Caching ${st.cache}% of the input saves <b>${money(saved)}</b> a month on the mid model.`, `تخزين ${st.cache}% من الإدخال يوفّر <b>${money(saved)}</b> شهرياً على النموذج المتوسط.`)}</span>` : `${ico('bolt')}<span>${tx('Turn on caching to see the saving.', 'فعّل التخزين المؤقت لترى التوفير.')}</span>`;
            };
            $$('[data-p]', body).forEach(b => { b.onclick = () => { st.preset = b.dataset.p; Object.assign(st, PRESETS[st.preset]); sync(); }; });
            $$('input[type=range]', body).forEach(r => { r.oninput = () => { st[r.dataset.k] = +r.value; st.preset = ''; sync(); }; });
            $$('input[type=number]', body).forEach(n => { n.oninput = () => { st.models[n.dataset.m][n.dataset.f] = Math.max(0, +n.value || 0); sync(); }; });
            sync();
        },
        unmount() {},
    };
})();

/* =========================================================
   Window host
   ========================================================= */
const DEMOS = { chat: assistant, capture, dashboard, network, rtl, cost };
const modal = $('#labModal'), bodyEl = $('#labBody');
let current = null, lastFocus = null;

function mount() {
    const d = DEMOS[current];
    $('#labTitle').textContent = d.title();
    $('#labFile').lastChild.textContent = d.file;
    bodyEl.innerHTML = '';
    bodyEl.dir = root.dir;
    bodyEl.dataset.demo = current;
    d.mount(bodyEl);
}
function open(name) {
    if (!DEMOS[name]) return;
    lastFocus = document.activeElement;
    current = name;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    mount();
    $('.lab-close', modal).focus();
}
function close() {
    if (!current) return;
    DEMOS[current].unmount();
    current = null;
    modal.hidden = true;
    bodyEl.innerHTML = '';
    document.body.style.overflow = '';
    lenis?.start();
    lastFocus?.focus?.();
}
$$('[data-lab]').forEach(b => b.addEventListener('click', () => open(b.dataset.lab)));
modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && current) close(); });
modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = $$('button, input, a[href], select, textarea, summary', modal).filter(x => !x.disabled && x.offsetParent && x.tabIndex !== -1);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
});
document.addEventListener('langchange', () => { if (current) { DEMOS[current].unmount(); mount(); } });

window.lab = { open, close, demos: DEMOS };
})();
