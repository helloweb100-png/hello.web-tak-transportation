/* ═══════════════════════════════════════════════════════════════════
   TAK ON TIME · app.js
   Landing corporativa · vanilla JS · sin build · mejora progresiva

   00 Utilidades              08 Marquee con inercia
   01 Idiomas ES / EN         09 Hero: partículas, ruta, reloj
   02 Texto: split / scramble 10 Manifiesto (palabras que se encienden)
   03 Preloader               11 Flota: imagen que se expande
   04 Motor de scroll         12 Servicios: scroll horizontal
   05 Nav + menú móvil        13 Proceso + contadores
   06 Cursor, tilt, magnético 14 FAQ
   07 Revelado + parallax     15 Init
   ═══════════════════════════════════════════════════════════════════ */
(() => {
'use strict';

/* ───────── 00 · UTILIDADES ───────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));      // suavizado independiente del framerate
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIO = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const html = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const PHONE = '526643752622';                                           // +52 664 375 2622
const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } }
};
const debounce = (fn, ms) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };
let lang = 'es';

/* ───────── 01 · IDIOMAS ES / EN ─────────
   El HTML trae el español (SEO). Aquí sólo vive la traducción al inglés,
   indexada por data-i18n="clave". */
const EN = {
    'a11y.skip': 'Skip to content',
    'nav.services': 'Services', 'nav.fleet': 'Fleet', 'nav.process': 'How it works', 'nav.contact': 'Contact',
    'nav.cta': 'Book now', 'menu.cta': 'Talk to an advisor',
    'hero.kicker': 'Medical & private transportation · San Diego ⇄ Tijuana',
    'hero.title': 'Medical and corporate rides between <span class="grad">San Diego and Tijuana.</span>',
    'hero.sub': 'For companies, clinics, hospitals and doctors: sanitized SUVs, bilingual drivers and personalized attention 24 hours a day.',
    'hero.cta1': 'Request a quote', 'hero.cta2': 'See services',
    'hero.t1': 'Bilingual drivers', 'hero.t2': 'Sanitized vehicles', 'hero.t3': '24/7 service',
    'hero.f1': 'Safe rides', 'hero.f2': 'years of experience',
    'dp.status': 'Active route', 'dp.border': 'Border crossing', 'dp.pickup': 'Pickup', 'dp.arrive': 'Arrive at your appointment',
    'dp.c1': 'Bilingual driver', 'dp.c2': 'Sanitized unit',
    'hero.scroll': 'Discover', 'hero.scroll.aria': 'Scroll to discover more', 'hero.clock': 'Local time · San Diego / Tijuana',
    'man.eyebrow': 'Who we are',
    'man.text': 'A health trip shouldn\'t feel like paperwork. At TAK we connect <mark>San Diego</mark> with <mark>Tijuana</mark> for companies, clinics, hospitals and doctors, in sanitized SUVs with bilingual drivers who know every cross-border route, so you can focus on your patients and we focus on <mark>your time</mark>.',
    'man.p1t': 'Safe', 'man.p1': 'Professional, responsible drivers with extensive knowledge of cross-border routes.',
    'man.p2t': 'Friendly', 'man.p2': 'A human, courteous and deeply respectful approach for patients, family members and companions.',
    'man.p3t': 'Professional', 'man.p3': 'More than 10 years of experience in medical transportation and private rides.',
    'man.cta.p': 'Every trip is different. Tell us about yours and we\'ll organize it with you.', 'man.cta': 'Let\'s talk about my trip',
    'xp.eyebrow': 'Our fleet', 'xp.title': 'A fleet designed for your <span class="grad">comfort</span>',
    'xp.badge': 'Executive fleet · clean & safe', 'xp.h': 'Recent SUVs, sanitized and ready for you.',
    'xp.p': 'Spacious, comfortable vehicles with amenities for your patients and room for luggage or medical support equipment. Strict hygiene and disinfection on every service.',
    'xp.f1': 'Recent SUV units', 'xp.f2': 'Sanitized before & after', 'xp.f3': 'Room for luggage', 'xp.cta': 'I want to ride like this',
    'svc.eyebrow': 'What we offer', 'svc.title': '<span class="grad">Specialized</span> services for every kind of trip',
    'svc.lead': 'Comprehensive transportation solutions designed to guarantee comfort, confidentiality and punctuality on every trip.',
    'svc.hint': 'Swipe to explore', 'svc.link': 'Book this service',
    'svc.1.t': 'Medical Transportation', 'svc.1.p': 'Scheduled, comfortable rides for patients with medical appointments, ongoing treatments or check-ups at clinics and hospitals.',
    'svc.2.t': 'Medical Tourism', 'svc.2.p': 'Comprehensive support and private transportation for international patients seeking quality medical care in Tijuana.',
    'svc.3.t': 'Private Transport SD ⇄ TJ', 'svc.3.p': 'Executive and private trips adapted to your schedule. Comfortable SUVs for direct crossings with no hassle.',
    'svc.4.t': 'Airport ⇄ Hospital / Hotel', 'svc.4.p': 'Direct pickup at airports (SAN / TIJ) and transfer to hospitals, recovery clinics or the hotel of your choice.',
    'svc.5.t': 'Patients & Companions', 'svc.5.p': 'Spacious room for the patient and their family, with enough space for luggage or medical support equipment.',
    'svc.6.t': 'Executive Transfers', 'svc.6.p': 'Private, punctual and discreet service for executives and business travelers crossing the border on a tight schedule.',
    'svc.end.t': 'Is your trip different?', 'svc.end.p': 'Tell us where you\'re headed and we\'ll tailor it to you.', 'svc.end.cta': 'I want to plan my route',
    'why.eyebrow': 'Our difference', 'why.title': 'Why choose <span class="grad">TAK On Time</span>?',
    'why.lead': 'Details you can feel from the first message to the moment you arrive.',
    'why.1.t': 'Bilingual drivers', 'why.1.p': 'Trained staff with fluent English and Spanish to guarantee clear communication at all times.',
    'why.2.t': 'Safe, reliable service', 'why.2.p': 'We put your safety first. Professional, responsible drivers with extensive knowledge of cross-border routes.',
    'why.3.t': 'Clean, sanitized vehicles', 'why.3.p': 'Strict hygiene and disinfection standards in every unit, before and after every service.',
    'why.4.t': 'Available 24 hours / 7 days', 'why.4.p': 'Continuous service, day or night, to meet medical schedules and flights at any hour.',
    'why.5.t': 'Personalized attention', 'why.5.p': 'We understand the delicate needs of our patients. We offer a human, courteous and deeply respectful experience.',
    'why.5.c1': 'Human touch', 'why.5.c2': 'Amenities for your patients', 'why.5.c3': 'Warm service',
    'why.6.t': 'Direct binational crossing', 'why.6.p': 'San Diego ⇄ Tijuana with no hassle, in SUVs adapted so the ride is comfortable and calm.',
    'why.cta.p': 'Still have a question? Let\'s solve it in a single message.', 'why.cta': 'I\'m ready to ride stress-free',
    'proc.eyebrow': 'Simple as that', 'proc.title': 'Your ride in <span class="grad">4 steps</span>',
    'proc.lead': 'No unnecessary paperwork: you tell us, we coordinate everything.',
    'proc.1.t': 'Message us', 'proc.1.p': 'Tell us on WhatsApp where you\'re going, the date and how many people are traveling. No endless forms.',
    'proc.2.t': 'We confirm rate and time', 'proc.2.p': 'We send you a clear rate and coordinate the exact pickup time so nothing is left to chance.',
    'proc.3.t': 'We pick you up', 'proc.3.p': 'Your bilingual driver arrives on time at the airport, hotel, apartment or wherever you tell us, in a sanitized vehicle.',
    'proc.4.t': 'You arrive calm and on time', 'proc.4.p': 'We drop you at your clinic or hospital and, if you need it, bring you back when your appointment ends.',
    'proc.cta': 'Start my booking on WhatsApp',
    'cov.eyebrow': 'Coverage', 'cov.title': 'From California to Tijuana, <span class="grad">door to door</span>',
    'cov.lead': 'From San Diego to Tijuana we pick you up and take you exactly where you need to be.',
    'cov.l1': 'Airports (SAN / TIJ)', 'cov.l2': 'Hotels & apartments', 'cov.l3': 'Hospitals & clinics', 'cov.l4': 'And more: you tell us the destination',
    'cov.note': 'Base rate up to 25 mi / 40 km. Longer trips: we\'ll quote you instantly.', 'cov.cta': 'Do you reach my area? Ask us',
    'stat.1': 'Years of experience', 'stat.2': 'Continuous service', 'stat.3': 'Base radius included (25 mi)', 'stat.4': 'Languages on every ride',
    'faq.eyebrow': 'We answer your questions', 'faq.title': 'Frequently asked <span class="grad">questions</span>',
    'faq.lead': 'What patients, families and travelers ask us most before booking.', 'faq.cta': 'Another question? Ask us',
    'faq.1.q': 'How much does a ride between San Diego and Tijuana cost?',
    'faq.1.a': 'We quote each ride based on the route, the trip type and the number of passengers. Message us on WhatsApp and we\'ll reply right away.',
    'faq.2.q': 'What does the rate include?',
    'faq.2.a': 'Private service in a sanitized SUV with a bilingual driver, for the patient and 1 companion, up to 25 mi / 40 km. Amenities for your patients and room for luggage or medical support equipment.',
    'faq.3.q': 'Do you serve airports, hotels and hospitals?',
    'faq.3.a': 'Yes. We pick up at airports (SAN / TIJ) and take you to hospitals, recovery clinics, hotels, apartments and more. You tell us the destination.',
    'faq.4.q': 'Do the drivers speak English?',
    'faq.4.a': 'Yes. All of our staff is bilingual, with fluent English and Spanish, so communication is clear at all times.',
    'faq.5.q': 'Do you operate at night or on weekends?',
    'faq.5.a': 'Yes. We\'re available 24 hours a day, 7 days a week, to meet medical schedules and flights at any hour.',
    'faq.6.q': 'How do I book my ride?',
    'faq.6.a': 'Message us on WhatsApp at +52 664 375 2622. We\'ll confirm rate, schedule and pickup point with you.',
    'cta.eyebrow': 'Get a quote', 'cta.title': 'Does your clinic, hospital or company need <span class="grad">reliable</span> transportation?',
    'cta.lead': 'Message us on WhatsApp and we\'ll confirm rate, schedule and pickup point. No commitment.',
    'cta.c1': 'Direct WhatsApp', 'cta.c2': 'Email', 'cta.c4': 'Base of operations',
    'cta.card.t': 'Message us on WhatsApp', 'cta.card.p': 'It\'s the fastest way to get a quote. Tell us about your ride and we\'ll reply 24 hours a day.',
    'cta.card.btn': 'Write on WhatsApp', 'cta.card.note': 'Quick replies, 24/7.',
    'ft.blurb': 'Medical and private transportation between San Diego and Tijuana. Your time is our priority.',
    'ft.h1': 'Services', 'ft.h2': 'Company', 'ft.l1': 'About us', 'ft.l2': 'Why TAK', 'ft.h3': 'Help', 'ft.l3': 'FAQ',
    'ft.rights': 'All rights reserved.', 'ft.top': 'Back to top',
    'wa.tip': 'Need a ride? Message us', 'wa.aria': 'Message us on WhatsApp',
    /* atributos */
    'nav.menu': 'Open menu',
    'xp.alt': 'White SUV from the TAK On Time fleet, ready to pick up its passengers',
    'svc.1.alt': 'Modern, fully equipped operating room, a common destination for medical transportation',
    'svc.2.alt': 'Dentist treating a patient at a medical tourism clinic',
    'svc.3.alt': 'White executive vehicle driving past palm trees, ready for a private ride',
    'svc.4.alt': 'Traveler waiting for a flight in an airport terminal',
    'svc.5.alt': 'Older patient warmly accompanied by a family member',
    'svc.6.alt': 'Black executive vehicle for private and business transfers',
    'why.3.alt': 'Staff cleaning and disinfecting the inside of a vehicle'
};

/* Cadenas que sólo usa el JS (preloader, mensajes de WhatsApp…) */
const T = {
    es: {
        title: 'TAK On Time | Transporte Médico San Diego ⇄ Tijuana 24/7',
        desc: 'Transporte médico, turismo médico y traslados privados entre San Diego y Tijuana en SUVs sanitizadas, con choferes bilingües. Servicio 24/7 y aeropuertos SAN / TIJ. Cotiza por WhatsApp.',
        loader: ['Calibrando ruta San Diego ⇄ Tijuana…', 'Sanitizando unidades…', 'Verificando disponibilidad 24/7…', 'Todo listo. ¡Buen viaje!'],
        wa: {
            hero: 'Hola TAK On Time, quiero solicitar una cotización de traslados.', nav: 'Hola TAK On Time, quiero información para reservar un traslado.',
            man: 'Hola TAK, quiero platicar sobre mi viaje.', fleet: 'Hola TAK, quiero viajar en una de sus unidades.',
            svc: 'Hola TAK, me interesa el servicio: {s}.', 'svc-end': 'Hola TAK, quiero armar mi ruta.',
            why: 'Hola TAK, estoy listo para viajar con ustedes.', proc: 'Hola TAK, quiero empezar mi reserva.', cov: 'Hola TAK, ¿llegan a mi zona?',
            faq: 'Hola TAK, tengo una pregunta.',
            contact: 'Hola TAK On Time, quiero informes.', float: 'Hola TAK On Time, quiero informes.'
        }
    },
    en: {
        title: 'TAK On Time | Medical Transportation San Diego ⇄ Tijuana 24/7',
        desc: 'Medical transportation, medical tourism and private rides between San Diego and Tijuana in sanitized SUVs with bilingual drivers. 24/7 service and SAN / TIJ airports. Get a quote on WhatsApp.',
        loader: ['Calibrating San Diego ⇄ Tijuana route…', 'Sanitizing vehicles…', 'Checking 24/7 availability…', 'All set. Have a great trip!'],
        wa: {
            hero: 'Hello TAK On Time, I would like to request a quote for transportation.', nav: 'Hello TAK On Time, I would like information to book a ride.',
            man: 'Hello TAK, I would like to talk about my trip.', fleet: 'Hello TAK, I would like to ride in one of your vehicles.',
            svc: 'Hello TAK, I am interested in the service: {s}.', 'svc-end': 'Hello TAK, I would like to plan my route.',
            why: 'Hello TAK, I am ready to travel with you.', proc: 'Hello TAK, I would like to start my booking.', cov: 'Hello TAK, do you serve my area?',
            faq: 'Hello TAK, I have a question.',
            contact: 'Hello TAK On Time, I would like information.', float: 'Hello TAK On Time, I would like information.'
        }
    }
};
const tt = () => T[lang];
const waUrl = msg => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
const plain = s => String(s).replace(/<[^>]+>/g, '');

/* Textos originales en español, capturados del DOM antes de traducir */
const ES = {};
const ESA = { aria: {}, ph: {}, alt: {} };
let ES_TITLE = document.title;
let ES_DESC = ($('meta[name="description"]') || {}).content || '';
function captureSpanish() {
    $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (!(k in ES)) ES[k] = el.innerHTML.trim(); });
    $$('[data-i18n-aria]').forEach(el => { ESA.aria[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
    $$('[data-i18n-ph]').forEach(el => { ESA.ph[el.dataset.i18nPh] = el.getAttribute('placeholder'); });
    $$('[data-i18n-alt]').forEach(el => { ESA.alt[el.dataset.i18nAlt] = el.getAttribute('alt'); });
}
const t = k => (lang === 'en' && EN[k] != null ? EN[k] : (ES[k] != null ? ES[k] : k));

function applyLang(next, opts = {}) {
    lang = next === 'en' ? 'en' : 'es';
    html.lang = lang;
    if (!opts.silent) store.set('tak_lang', lang);

    $$('[data-i18n]').forEach(el => {
        const v = t(el.dataset.i18n);
        el.innerHTML = v;
        if (el.hasAttribute('data-split')) splitText(el);
        if (el.id === 'man-text') buildManifesto();
    });
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', lang === 'en' ? (EN[el.dataset.i18nAria] || '') : ESA.aria[el.dataset.i18nAria]));
    $$('[data-i18n-ph]').forEach(el => el.setAttribute('placeholder', lang === 'en' ? EN[el.dataset.i18nPh] : ESA.ph[el.dataset.i18nPh]));
    $$('[data-i18n-alt]').forEach(el => el.setAttribute('alt', lang === 'en' ? EN[el.dataset.i18nAlt] : ESA.alt[el.dataset.i18nAlt]));

    document.title = lang === 'en' ? T.en.title : ES_TITLE;
    const desc = lang === 'en' ? T.en.desc : ES_DESC;
    ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'].forEach(sel => { const m = $(sel); if (m) m.setAttribute('content', desc); });
    const ogt = $('meta[property="og:title"]'); if (ogt) ogt.content = document.title;
    const ogl = $('meta[property="og:locale"]'); if (ogl) ogl.content = lang === 'en' ? 'en_US' : 'es_MX';

    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    refreshWA();
    syncProcessTitle();
}

/* Enlaces de WhatsApp con mensaje contextual por botón (data-wa="clave") */
function refreshWA() {
    $$('[data-wa]').forEach(a => {
        const k = a.dataset.wa;
        let msg = null;
        if (k === 'svc') msg = tt().wa.svc.replace('{s}', plain(t('svc.' + a.dataset.svc + '.t')));
        else msg = tt().wa[k];
        if (msg) a.href = waUrl(msg);
    });
}

/* ───────── 02 · TEXTO: split por palabras + scramble ───────── */
function splitText(el) {
    const tpl = document.createElement('div');
    tpl.innerHTML = el.innerHTML;
    const out = document.createDocumentFragment();
    let idx = 0;
    const walk = (node, parent, cls) => {
        node.childNodes.forEach(n => {
            if (n.nodeType === 3) {
                n.textContent.split(/(\s+)/).forEach(part => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(' ')); return; }
                    const w = document.createElement('span'); w.className = 'sw';
                    const i = document.createElement('span'); i.className = 'sw-i' + (cls ? ' ' + cls : '');
                    i.style.setProperty('--w', idx++); i.textContent = part;
                    w.appendChild(i); parent.appendChild(w);
                });
            } else if (n.nodeType === 1) {
                if (n.classList.contains('grad')) walk(n, parent, 'grad');   // el degradado va en cada palabra
                else { const c = n.cloneNode(false); parent.appendChild(c); walk(n, c, cls); }
            }
        });
    };
    walk(tpl, out, '');
    el.textContent = '';
    el.appendChild(out);
    el.classList.add('is-split');
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·';
function scramble(el) {
    if (reduce) return;
    const finalText = el.textContent;
    if (!finalText) return;
    const dur = 950, t0 = performance.now();
    const step = now => {
        const p = clamp((now - t0) / dur);
        const n = Math.floor(p * finalText.length);
        let s = '';
        for (let i = 0; i < finalText.length; i++) {
            const ch = finalText[i];
            s += (i < n || ch === ' ') ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = s;
        if (p < 1) requestAnimationFrame(step); else el.textContent = finalText;
    };
    requestAnimationFrame(step);
}

/* ───────── 03 · PRELOADER ───────── */
function runLoader(done) {
    const bar = $('#ld-bar'), pct = $('#ld-pct'), status = $('#ld-status');
    const msgs = tt().loader;
    const MIN = reduce ? 500 : 2900, MAX = 7000;
    const t0 = performance.now();
    let ready = document.readyState === 'complete';
    addEventListener('load', () => { ready = true; }, { once: true });
    let shown = -1, finished = false;
    const frame = now => {
        if (finished) return;
        const el = now - t0;
        let p = clamp(el / MIN);
        if (!ready && el < MAX) p = Math.min(p, .92);          // espera a que cargue de verdad
        const v = easeIO(p);
        bar.style.transform = `scaleX(${v})`;
        pct.textContent = Math.round(v * 100);
        const mi = Math.min(msgs.length - 1, Math.floor(v * msgs.length));
        if (mi !== shown) { shown = mi; status.textContent = msgs[mi]; }
        if (p >= 1) { finished = true; setTimeout(done, 380); return; }
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

/* ───────── 04 · MOTOR DE SCROLL ─────────
   Lenis aporta inercia (opcional). Todo lo demás lee el scroll real, así que
   si el CDN falla, la página funciona igual con scroll nativo. */
let lenis = null;
let velocity = 0, lastY = 0, menuOpen = false;
const ticks = [];          // callbacks que corren en cada frame
const scrubbers = [];      // callbacks que sólo corren si su elemento está cerca del viewport

function addScrub(el, fn, margin = 240) {
    const s = { el, fn, on: false, cur: 0 };
    new IntersectionObserver(([e]) => { s.on = e.isIntersecting; }, { rootMargin: `${margin}px 0px ${margin}px 0px` }).observe(el);
    scrubbers.push(s);
    return s;
}
function startLoop() {
    let prev = performance.now();
    const loop = now => {
        const dt = Math.min(.05, (now - prev) / 1000) || .016; prev = now;
        if (lenis) lenis.raf(now);
        const y = window.scrollY;
        velocity = damp(velocity, (y - lastY) / Math.max(dt, .001), 8, dt);
        lastY = y;
        for (let i = 0; i < ticks.length; i++) ticks[i](dt, y, now);
        for (let i = 0; i < scrubbers.length; i++) if (scrubbers[i].on) scrubbers[i].fn(scrubbers[i], dt, y);
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}
function initLenis() {
    if (!window.Lenis || reduce) return;
    lenis = new window.Lenis({ lerp: .085, smoothWheel: true, wheelMultiplier: .92, touchMultiplier: 1.4 });
    lenis.stop();                                  // se libera al terminar el preloader
}
function initAnchors() {
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = id === '#inicio' ? document.body : $(id);
        if (!target) return;
        e.preventDefault();
        if (menuOpen) setMenu(false);
        if (lenis) lenis.scrollTo(id === '#inicio' ? 0 : target, { duration: 1.9, easing: x => 1 - Math.pow(1 - x, 4) });
        else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', id);
    });
}

/* Efectos globales ligados al scroll: barra, nav, parallax del hero, botón flotante */
function initGlobalScroll() {
    const bar = $('#scroll-progress'), nav = $('#nav'), wa = $('#wa-float');
    const hero = $('#inicio'), heroInner = $('.hero-inner'), heroBg = $('.hero-bg');
    let prev = 0, hidden = false, tipShown = false;
    ticks.push((dt, y) => {
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`;
        nav.classList.toggle('is-stuck', y > 24);
        if (Math.abs(y - prev) > 6) {
            const hide = y > prev && y > 280 && !menuOpen;
            if (hide !== hidden) { hidden = hide; nav.classList.toggle('is-hidden', hide); }
            prev = y;
        }
        const showWA = y > 520;
        wa.classList.toggle('is-in', showWA);
        if (showWA && !tipShown) { tipShown = true; setTimeout(() => wa.classList.add('show-tip'), 1800); setTimeout(() => wa.classList.remove('show-tip'), 9000); }
        if (y < innerHeight * 1.15 && !reduce) {
            const p = clamp(y / innerHeight);
            // En móvil el hero (texto + tarjeta apilados) es más alto que la pantalla: si se desvaneciera, la tarjeta quedaría casi invisible al llegar a ella
            const fades = hero.offsetHeight <= innerHeight * 1.2;
            heroInner.style.transform = fades ? `translate3d(0,${(p * 70).toFixed(1)}px,0)` : '';
            heroInner.style.opacity = fades ? (1 - p * 1.1).toFixed(3) : '';
            heroBg.style.transform = `translate3d(0,${(p * 120).toFixed(1)}px,0) scale(${(1 + p * .08).toFixed(3)})`;
        }
    });
}

/* ───────── 05 · NAV + MENÚ MÓVIL ───────── */
function setMenu(open) {
    menuOpen = open;
    const m = $('#menu'), b = $('#burger');
    m.classList.toggle('is-open', open);
    m.setAttribute('aria-hidden', String(!open));
    b.setAttribute('aria-expanded', String(open));
    if (open) $('#nav').classList.remove('is-hidden');
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    html.style.overflow = open ? 'hidden' : '';
}
function initNav() {
    $('#burger').addEventListener('click', () => setMenu(!menuOpen));
    addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) setMenu(false); });
    addEventListener('resize', debounce(() => { if (innerWidth >= 1024 && menuOpen) setMenu(false); }, 100));
    $$('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

    // Enlace activo según la sección bajo el centro del viewport
    const links = $$('.nav-links a');
    const map = new Map(links.map(a => [a.getAttribute('href'), a]));
    const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => l.classList.remove('is-active'));
        const l = map.get('#' + e.target.id); if (l) l.classList.add('is-active');
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['servicios', 'flota', 'proceso', 'contacto'].forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ───────── 06 · CURSOR, TILT, IMANES ───────── */
function initCursor() {
    if (!fine || reduce) return;
    const c = $('.cursor'), dot = $('.cursor-dot'), ring = $('.cursor-ring');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    c.style.opacity = '0';
    addEventListener('pointermove', e => {
        x = e.clientX; y = e.clientY; c.style.opacity = '1';
        c.classList.toggle('is-hover', !!(e.target.closest && e.target.closest('a, button, input, select, textarea, label')));
    }, { passive: true });
    addEventListener('pointerdown', () => c.classList.add('is-down'));
    addEventListener('pointerup', () => c.classList.remove('is-down'));
    document.documentElement.addEventListener('mouseleave', () => { c.style.opacity = '0'; });
    ticks.push(dt => {
        rx = damp(rx, x, 18, dt); ry = damp(ry, y, 18, dt);
        dot.style.transform = `translate3d(${x}px,${y}px,0)`;
        ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    });
}
function initTilt() {
    if (!fine || reduce) return;
    $$('[data-tilt]').forEach(el => {
        if (el.classList.contains('dispatch')) return;
        el.addEventListener('pointermove', e => {
            if (el.hasAttribute('data-reveal') && !el.classList.contains('rv-done')) return;
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
            el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
            el.style.transform = `perspective(1000px) rotateX(${((.5 - py) * 5).toFixed(2)}deg) rotateY(${((px - .5) * 7).toFixed(2)}deg)`;
        });
        el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
}
function initMagnetic() {
    if (!fine || reduce) return;
    $$('.btn-mag').forEach(b => {
        b.addEventListener('pointermove', e => {
            if (b.hasAttribute('data-reveal') && !b.classList.contains('rv-done')) return;
            const r = b.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
            b.style.transform = `translate(${(x * .2).toFixed(1)}px,${(y * .32).toFixed(1)}px)`;
        });
        b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
}

/* ───────── 07 · REVELADO + PARALLAX ───────── */
function initReveal() {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('in');
        io.unobserve(el);
        if (el.hasAttribute('data-reveal')) {
            const d = parseFloat(getComputedStyle(el).getPropertyValue('--i')) || 0;
            setTimeout(() => el.classList.add('rv-done'), 1500 + d * 100);
        }
        if (el.hasAttribute('data-scramble')) scramble(el);
        if (el.classList.contains('stat')) countUp(el);
    }), { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    $$('[data-reveal], [data-split], [data-scramble], .stat').forEach(el => { if (!el.classList.contains('hero-title')) io.observe(el); });
}
function initParallax() {
    if (reduce) return;
    const items = $$('[data-parallax]').map(el => ({ el, host: el.parentElement, k: parseFloat(el.dataset.parallax) || .1, on: false }));
    items.forEach(it => new IntersectionObserver(([e]) => { it.on = e.isIntersecting; }, { rootMargin: '240px 0px' }).observe(it.host));
    ticks.push(() => items.forEach(it => {
        if (!it.on) return;
        const r = it.host.getBoundingClientRect();
        const c = r.top + r.height / 2 - innerHeight / 2;
        it.el.style.transform = `translate3d(0,${(-c * it.k).toFixed(1)}px,0)`;
    }));
}

/* ───────── 08 · MARQUEE CON INERCIA ─────────
   La velocidad base se acelera con la velocidad del scroll. */
function initMarquee() {
    $$('[data-marquee]').forEach(mq => {
        const track = $('.mq-track', mq);
        const dir = parseInt(mq.dataset.marquee, 10) || -1;
        const base = track.innerHTML;
        const count = track.children.length;
        let unit = 1, x = 0;
        const build = () => {
            track.innerHTML = base;
            track.insertAdjacentHTML('beforeend', base);
            unit = track.children[count].offsetLeft - track.children[0].offsetLeft;
            let n = 0;
            while (track.scrollWidth < innerWidth + unit + 80 && n < 8) { track.insertAdjacentHTML('beforeend', base); n++; }
        };
        build();
        x = dir > 0 ? -unit * .5 : 0;
        addEventListener('resize', debounce(build, 200));
        ticks.push((dt) => {
            const speed = 48 + Math.min(Math.abs(velocity) * .32, 1100);
            x += dir * speed * dt;
            if (dir < 0 && x <= -unit) x += unit;
            if (dir > 0 && x >= 0) x -= unit;
            track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
        });
    });
}

/* ───────── 09 · HERO: partículas, ruta, reloj ───────── */
let heroOn = true;

/* Campo de partículas en <canvas>. mode "net": red de puntos + vehículos que cruzan.
   mode "warp": estrellas que salen del centro (sensación de velocidad / puntualidad). */
function makeField(canvas, mode) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const mobile = innerWidth < 760;
    let w = 0, h = 0, parts = [], streaks = [], running = false, last = 0, spawn = 1;
    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
        const area = w * h;
        const n = mode === 'net' ? Math.round(clamp(area / (mobile ? 16000 : 20000), 26, 92)) : Math.round(clamp(area / (mobile ? 12000 : 8200), 60, 230));
        parts = Array.from({ length: n }, () => mode === 'net'
            ? { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.3 + .5, hot: Math.random() < .16 }
            : { a: Math.random() * 6.2832, d: Math.random() * Math.hypot(w, h) * .5, pd: 0, s: Math.random() * .6 + .2, hot: Math.random() < .25 });
    };
    const size = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const r = canvas.getBoundingClientRect();
        w = r.width; h = r.height;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
    };

    const drawNet = (dt, now) => {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        const link = mobile ? 105 : 150, link2 = link * link;
        for (const p of parts) {
            p.x += p.vx * 60 * dt; p.y += p.vy * 60 * dt;
            if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
            const dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
            if (d2 < 26000 && d2 > 1) { const d = Math.sqrt(d2); p.x += dx / d * .45; p.y += dy / d * .45; }
        }
        ctx.lineWidth = 1;
        for (let i = 0; i < parts.length; i++) {
            const a = parts[i];
            for (let j = i + 1; j < parts.length; j++) {
                const b = parts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
                if (d2 < link2) {
                    ctx.strokeStyle = `rgba(111,214,245,${((1 - Math.sqrt(d2) / link) * .32).toFixed(3)})`;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                }
            }
            const mx = a.x - mouse.x, my = a.y - mouse.y, md2 = mx * mx + my * my;
            if (md2 < 30000) {
                ctx.strokeStyle = `rgba(182,236,251,${((1 - Math.sqrt(md2) / 173) * .55).toFixed(3)})`;
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            }
        }
        for (const p of parts) {
            ctx.fillStyle = p.hot ? 'rgba(182,236,251,.95)' : 'rgba(111,214,245,.55)';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (p.hot ? 1.5 : 1), 0, 6.2832); ctx.fill();
            if (p.hot) { ctx.fillStyle = 'rgba(34,184,232,.16)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, 6.2832); ctx.fill(); }
        }
        // "Vehículos": estelas que cruzan el cielo de lado a lado
        spawn -= dt;
        if (spawn <= 0 && streaks.length < 3) {
            spawn = 1.6 + Math.random() * 2.4;
            const dir = Math.random() < .5 ? 1 : -1;
            streaks.push({ x: dir > 0 ? -60 : w + 60, y: h * (.12 + Math.random() * .7), vx: dir * (380 + Math.random() * 280), vy: (Math.random() - .5) * 60, dir });
        }
        for (let i = streaks.length - 1; i >= 0; i--) {
            const s = streaks[i];
            s.x += s.vx * dt; s.y += s.vy * dt;
            const len = 170;
            const g = ctx.createLinearGradient(s.x - s.dir * len, s.y - s.vy * len / Math.abs(s.vx), s.x, s.y);
            g.addColorStop(0, 'rgba(34,184,232,0)'); g.addColorStop(1, 'rgba(182,236,251,.95)');
            ctx.strokeStyle = g; ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(s.x - s.dir * len, s.y - s.vy * len / Math.abs(s.vx)); ctx.lineTo(s.x, s.y); ctx.stroke();
            if (s.x < -300 || s.x > w + 300) streaks.splice(i, 1);
        }
    };

    const drawWarp = dt => {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        const cx = w * .5 + (mouse.x > -9000 ? (mouse.x - w * .5) * .05 : 0), cy = h * .4;
        const maxR = Math.hypot(w, h) * .62;
        for (const s of parts) {
            s.d += s.s * dt * (36 + s.d * 1.05);
            if (s.d > maxR) { s.d = Math.random() * 24; s.a = Math.random() * 6.2832; s.s = Math.random() * .6 + .2; }
            const k = clamp(s.d / (maxR * .8));
            const start = Math.max(0, s.d - (4 + s.d * .1));
            const cs = Math.cos(s.a), sn = Math.sin(s.a);
            ctx.strokeStyle = s.hot ? `rgba(182,236,251,${(k * .7).toFixed(3)})` : `rgba(34,184,232,${(k * .5).toFixed(3)})`;
            ctx.lineWidth = .5 + k * 1.1;
            ctx.beginPath(); ctx.moveTo(cx + cs * start, cy + sn * start); ctx.lineTo(cx + cs * s.d, cy + sn * s.d); ctx.stroke();
        }
    };

    const frame = now => {
        if (!running) return;
        const dt = Math.min(.05, (now - last) / 1000) || .016; last = now;
        mode === 'net' ? drawNet(dt, now) : drawWarp(dt);
        requestAnimationFrame(frame);
    };
    const start = () => { if (running || reduce) return; running = true; last = performance.now(); requestAnimationFrame(frame); };
    const stop = () => { running = false; };

    size();
    addEventListener('resize', debounce(size, 250));
    addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
    new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), { threshold: 0 }).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : (canvas.getBoundingClientRect().bottom > 0 && start())));
    if (reduce) { ctx.globalCompositeOperation = 'lighter'; mode === 'net' ? drawNet(.016, 0) : drawWarp(.016); }   // un único fotograma estático
}

/* Ruta San Diego → Tijuana con dos vehículos que se cruzan (ida ⇄ vuelta) */
function initRoute() {
    const base = $('#route-base');
    if (!base) return;
    const trail = $('#route-trail'), glow = $('#route-glow'), car = $('#route-car'), car2 = $('#route-car2'), bar = $('#dp-bar');
    const L = base.getTotalLength();
    let dots = '';
    for (let y = 16; y < 480; y += 26) for (let x = 14; x < 400; x += 26) dots += `<circle cx="${x}" cy="${y}" r="1.2"/>`;
    $('#map-dots').innerHTML = dots;

    const CYCLE = 11, GO = 7.2;
    const place = (g, len) => { const p = base.getPointAtLength(len); g.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`); };
    const render = (tsec) => {
        const t = tsec % CYCLE;
        let e = 0, fade = 1;
        if (t < GO) e = easeIO(t / GO); else { e = 1; if (t > 8.6) fade = 1 - (t - 8.6) / (CYCLE - 8.6); }
        const len = e * L, dash = `${len.toFixed(1)} ${L.toFixed(1)}`;
        trail.style.strokeDasharray = dash; glow.style.strokeDasharray = dash;
        trail.style.opacity = fade.toFixed(3); glow.style.opacity = (.55 * fade).toFixed(3);
        place(car, len); car.style.opacity = fade.toFixed(3);
        bar.style.transform = `scaleX(${e.toFixed(3)})`;
        const t2 = (t + 5.5) % CYCLE;
        if (t2 < GO) { place(car2, L * (1 - easeIO(t2 / GO))); car2.style.opacity = '1'; } else car2.style.opacity = '0';
    };
    if (reduce) { render(5); return; }
    ticks.push((dt, y, now) => { if (heroOn) render(now / 1000); });
}

function initClock() {
    const el = $('#hero-clock');
    if (!el) return;
    let fmt = null;
    try { fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Tijuana', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); } catch (e) { /* sin Intl */ }
    const upd = () => { el.textContent = fmt ? fmt.format(new Date()) : new Date().toTimeString().slice(0, 8); };
    upd();
    setInterval(upd, 1000);
}
function initDial() {
    const g = $('#dial-ticks');
    if (!g) return;
    let s = '';
    for (let i = 0; i < 24; i++) {
        const a = i * 15 * Math.PI / 180, major = i % 6 === 0, r1 = major ? 43 : 47, r2 = 51;
        s += `<line class="${major ? 'maj' : ''}" x1="${(60 + Math.sin(a) * r1).toFixed(2)}" y1="${(60 - Math.cos(a) * r1).toFixed(2)}" x2="${(60 + Math.sin(a) * r2).toFixed(2)}" y2="${(60 - Math.cos(a) * r2).toFixed(2)}"/>`;
    }
    g.innerHTML = s;
}

/* La tarjeta de despacho se inclina en 3D siguiendo el puntero */
function initDispatchTilt() {
    const d = $('.dispatch');
    if (!d || !fine || reduce) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
    ticks.push(dt => {
        if (!heroOn) return;
        cx = damp(cx, tx, 5, dt); cy = damp(cy, ty, 5, dt);
        const wide = innerWidth >= 1000;
        d.style.transform = `rotateY(${((wide ? -9 : 0) + cx * 12).toFixed(2)}deg) rotateX(${((wide ? 4 : 0) - cy * 9).toFixed(2)}deg)`;
    });
}

/* ───────── 10 · MANIFIESTO: las palabras se encienden al hacer scroll ───────── */
let manWords = [];
function buildManifesto() {
    const el = $('#man-text');
    if (!el) return;
    const tpl = document.createElement('div');
    tpl.innerHTML = el.innerHTML;
    const out = document.createDocumentFragment();
    manWords = [];
    const walk = (node, parent) => {
        node.childNodes.forEach(n => {
            if (n.nodeType === 3) {
                n.textContent.split(/(\s+)/).forEach(part => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(' ')); return; }
                    const w = document.createElement('span'); w.className = 'mw'; w.textContent = part;
                    parent.appendChild(w); manWords.push(w);
                });
            } else if (n.nodeType === 1) { const c = n.cloneNode(false); parent.appendChild(c); walk(n, c); }
        });
    };
    walk(tpl, out);
    el.textContent = '';
    el.appendChild(out);
    if (reduce) manWords.forEach(w => { w.style.opacity = '1'; });
}
function initManifesto() {
    const el = $('#man-text');
    if (!el || reduce) return;
    addScrub(el, (s, dt) => {
        const r = el.getBoundingClientRect(), vh = innerHeight;
        const target = clamp((vh * .86 - r.top) / (vh * .36 + r.height));
        s.cur = damp(s.cur, target, 10, dt);
        const n = manWords.length;
        for (let i = 0; i < n; i++) {
            const a = (i / n) * .78;
            manWords[i].style.opacity = (.16 + .84 * smooth(a, a + .22, s.cur)).toFixed(3);
        }
    }, 120);
}

/* ───────── 11 · FLOTA: la imagen se abre a pantalla completa ───────── */
function initExpand() {
    const track = $('#xp-track');
    if (!track || reduce) return;
    const media = $('#xp-media'), img = $('#xp-img'), intro = $('#xp-intro'), copy = $('#xp-copy');
    const shade = $('.xp-shade'), badge = $('.xp-badge');
    addScrub(track, (s, dt) => {
        const r = track.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - innerHeight));
        s.cur = damp(s.cur, p, 12, dt);
        const mob = innerWidth < 700;
        const pe = easeIO(clamp((s.cur - .05) / .6));          // expansión del recuadro
        const pc = smooth(.6, .82, s.cur);                      // aparición del texto
        const x0 = mob ? 9 : 22, t0 = mob ? 38 : 40, b0 = mob ? 14 : 11, r0 = mob ? 28 : 40;
        media.style.clipPath = `inset(${lerp(t0, 0, pe).toFixed(2)}% ${lerp(x0, 0, pe).toFixed(2)}% ${lerp(b0, 0, pe).toFixed(2)}% ${lerp(x0, 0, pe).toFixed(2)}% round ${lerp(r0, 0, pe).toFixed(1)}px)`;
        img.style.transform = `scale(${lerp(1.32, 1, pe).toFixed(3)})`;
        shade.style.opacity = (.3 + pe * .35 + pc * .35).toFixed(3);
        intro.style.opacity = (1 - clamp(pe * 2.1)).toFixed(3);
        intro.style.transform = `translate3d(0,${(-pe * 90).toFixed(1)}px,0) scale(${(1 - pe * .06).toFixed(3)})`;
        badge.style.opacity = (1 - clamp(pc * 2)).toFixed(3);
        copy.style.opacity = pc.toFixed(3);
        copy.style.transform = `translate3d(0,${((1 - pc) * 50).toFixed(1)}px,0)`;
        copy.classList.toggle('is-open', pc > .55);
    }, 0);
}

/* ───────── 12 · SERVICIOS: scroll vertical → desplazamiento horizontal ───────── */
function initHScroll() {
    const track = $('#hs-track'), stage = $('#hs-stage'), view = $('#hs-view'), rail = $('#hs-rail'), prog = $('#hs-prog');
    if (!track) return;
    let dist = 0, active = false;
    const measure = () => {
        active = innerWidth >= 1024 && !reduce;
        if (!active) { track.style.height = ''; rail.style.transform = ''; return; }
        dist = Math.max(0, rail.scrollWidth - view.clientWidth);
        track.style.height = (dist + stage.offsetHeight) + 'px';
    };
    measure();
    addEventListener('resize', debounce(measure, 150));
    if ('ResizeObserver' in window) new ResizeObserver(debounce(measure, 120)).observe(rail);
    addScrub(track, (s, dt) => {
        if (!active) return;
        const r = track.getBoundingClientRect();
        const total = r.height - stage.offsetHeight;
        const p = total > 0 ? clamp(-r.top / total) : 0;
        s.cur = damp(s.cur, p, 11, dt);
        rail.style.transform = `translate3d(${(-s.cur * dist).toFixed(1)}px,0,0)`;
        prog.style.transform = `scaleX(${s.cur.toFixed(4)})`;
    }, 0);
}

/* ───────── 13 · PROCESO + CONTADORES ───────── */
let procIdx = 0;
function syncProcessTitle() {
    const st = $$('.proc-steps .step')[procIdx], el = $('#ps-title');
    if (st && el) el.textContent = plain(t(st.dataset.title));
}
function initProcess() {
    const list = $('.proc-steps');
    if (!list) return;
    const steps = $$('.step', list), nodes = $$('.pr-node');
    const fill = $('#ps-fill'), num = $('#ps-n'), car = $('#pr-car'), prFill = $('#pr-fill');
    addScrub(list, (s, dt) => {
        const r = list.getBoundingClientRect(), vh = innerHeight;
        const target = clamp((vh * .55 - r.top) / r.height);
        s.cur = damp(s.cur, target, 9, dt);
        list.style.setProperty('--pp', s.cur.toFixed(4));
        let best = 0, bd = Infinity;
        steps.forEach((st, i) => {
            const b = st.getBoundingClientRect();
            const d = Math.abs(b.top + b.height / 2 - vh * .52);
            if (d < bd) { bd = d; best = i; }
        });
        if (best !== procIdx || !s.ready) {
            s.ready = true; procIdx = best;
            steps.forEach((st, i) => { st.classList.toggle('is-active', i === best); st.classList.toggle('is-done', i < best); });
            nodes.forEach((n, i) => n.classList.toggle('on', i <= best));
            num.textContent = '0' + (best + 1);
            syncProcessTitle();
        }
        fill.style.strokeDashoffset = (1 - clamp(s.cur)).toFixed(3);
        prFill.style.transform = `scaleX(${clamp(s.cur).toFixed(3)})`;
        car.style.left = (clamp(s.cur) * 100).toFixed(2) + '%';
    }, 120);
}
function countUp(stat) {
    const b = $('[data-count]', stat);
    if (!b) return;
    const to = parseFloat(b.dataset.count), dur = 1700, t0 = performance.now();
    if (reduce) { b.textContent = to; return; }
    const step = now => {
        const p = clamp((now - t0) / dur);
        b.textContent = Math.round(easeOut(p) * to);
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/* ───────── 14 · FAQ ───────── */
function initFAQ() {
    const items = $$('.qa');
    const open = (qa, on) => { qa.classList.toggle('is-open', on); $('.qa-q', qa).setAttribute('aria-expanded', String(on)); };
    items.forEach(qa => $('.qa-q', qa).addEventListener('click', () => {
        const willOpen = !qa.classList.contains('is-open');
        items.forEach(o => open(o, false));
        if (willOpen) open(qa, true);
    }));
    if (items[0]) open(items[0], true);
}

/* Si el navegador está en inglés, ofrecemos cambiar (sin alterar el HTML que indexan los buscadores) */
function initLangToast() {
    if (store.get('tak_lang') || store.get('tak_lang_dismiss')) return;
    if (!/^en/i.test(navigator.language || '')) return;
    const toast = $('#lang-toast');
    if (!toast) return;
    setTimeout(() => { toast.hidden = false; }, 4200);
    $('#lt-yes').addEventListener('click', () => { applyLang('en'); toast.hidden = true; });
    $('#lt-no').addEventListener('click', () => { store.set('tak_lang_dismiss', '1'); toast.hidden = true; });
}

/* ───────── 15 · INIT ───────── */
function startHero() {
    html.classList.add('is-loaded');
    if (lenis) lenis.start();
    setTimeout(() => { const h = $('.hero-title'); if (h) h.classList.add('in'); }, 650);
}
function init() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    captureSpanish();
    if (store.get('tak_lang') === 'en') applyLang('en', { silent: true });
    else { $$('[data-split]').forEach(splitText); buildManifesto(); refreshWA(); }
    const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

    initLenis(); initAnchors(); initNav(); initGlobalScroll();
    initCursor(); initTilt(); initMagnetic(); initReveal(); initParallax(); initMarquee();
    makeField($('#hero-canvas'), 'net'); makeField($('#cta-canvas'), 'warp');
    initRoute(); initClock(); initDial(); initDispatchTilt();
    new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; }, { rootMargin: '120px' }).observe($('#inicio'));
    initManifesto(); initExpand(); initHScroll(); initProcess();
    initFAQ(); initLangToast();

    startLoop();
    runLoader(startHero);
}
init();

})();
