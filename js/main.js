/* ============================================================
   ROBERT MENSAH'S BIRTHDAY CELEBRATION — Shared Scripts
   Cinematic, Festive, Gift-Focused Experience
   ============================================================ */

const CONFIG = {
    birthday: new Date('2026-08-24T00:00:00'),
    whatsappNumber: '233533874270',
    momoNumber: '+233533874270'
};

/* Keep the opening moment special without interrupting every repeat visit. */
(function initWelcome() {
    const screen = document.getElementById('welcomeScreen');
    const enter = document.getElementById('enterExperience');
    if (!screen || !enter) return;
    let hasEntered = false;
    try { hasEntered = sessionStorage.getItem('robert_birthday_entered') === 'true'; } catch (e) {}
    if (hasEntered) { screen.remove(); return; }
    document.body.classList.add('welcome-active');
    enter.addEventListener('click', () => {
        try { sessionStorage.setItem('robert_birthday_entered', 'true'); } catch (e) {}
        document.body.classList.remove('welcome-active');
        screen.classList.add('leaving');
        setTimeout(() => screen.remove(), 650);
    });
})();

/* ---------- NAVBAR ---------- */
(function initNav() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    if (toggle && menu) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'mobileMenu');
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(menu.classList.contains('open')));
            document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
        });
        menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            toggle.classList.remove('open');
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }));
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menu.classList.contains('open')) {
                toggle.click();
                toggle.focus();
            }
        });
    }
})();

/* ---------- FESTIVE FAIRY LIGHTS ---------- */
(function initFairyLights() {
    const container = document.createElement('div');
    container.className = 'fairy-lights-container';
    const string = document.createElement('div');
    string.className = 'fairy-light-string';
    container.appendChild(string);
    for (let i = 0; i < 10; i++) {
        const bulb = document.createElement('div');
        bulb.className = 'fairy-light';
        container.appendChild(bulb);
    }
    document.body.appendChild(container);
})();

/* ---------- GIFT OVERLAY ---------- */
function openGiftOverlay() {
    const overlay = document.getElementById('giftOverlay');
    if (overlay) overlay.classList.add('open');
}
function closeGiftOverlay() {
    const overlay = document.getElementById('giftOverlay');
    if (overlay) overlay.classList.remove('open');
}
window.openGiftOverlay = openGiftOverlay;
window.closeGiftOverlay = closeGiftOverlay;

/* ---------- MUSIC OVERLAY ---------- */
function openMusicOverlay() {
    const overlay = document.getElementById('musicOverlay');
    if (overlay) overlay.classList.add('open');
    const player = document.getElementById('musicPlayer');
    if (player && !player.classList.contains('open')) {
        try { window.openMusicPlayer(); } catch(e) {}
    }
}
function closeMusicOverlay() {
    const overlay = document.getElementById('musicOverlay');
    if (overlay) overlay.classList.remove('open');
}
window.openMusicOverlay = openMusicOverlay;
window.closeMusicOverlay = closeMusicOverlay;

/* ---------- STADIUM PYROTECHNICS ---------- */
function createPyro(x, y) {
    let container = document.getElementById('pyroContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pyroContainer';
        container.className = 'pyro-container';
        document.body.appendChild(container);
    }
    // Flash
    const flash = document.createElement('div');
    flash.className = 'pyro-flash';
    flash.style.left = (x - 100) + 'px';
    flash.style.top = (y - 100) + 'px';
    flash.style.width = '200px';
    flash.style.height = '200px';
    container.appendChild(flash);
    setTimeout(() => flash.remove(), 700);
    // Smoke
    const smoke = document.createElement('div');
    smoke.className = 'pyro-smoke';
    smoke.style.left = (x - 40) + 'px';
    smoke.style.top = (y - 40) + 'px';
    smoke.style.width = '80px';
    smoke.style.height = '80px';
    container.appendChild(smoke);
    setTimeout(() => smoke.remove(), 2200);
    // Rays
    for (let i = 0; i < 12; i++) {
        const ray = document.createElement('div');
        ray.className = 'pyro-ray';
        const angle = (360 / 12) * i;
        ray.style.left = x + 'px';
        ray.style.top = y + 'px';
        ray.style.width = (50 + Math.random() * 80) + 'px';
        ray.style.transform = `rotate(${angle}deg)`;
        ray.style.animationDelay = (Math.random() * 0.2) + 's';
        container.appendChild(ray);
        setTimeout(() => ray.remove(), 1000);
    }
    // Burst particles
    const colors = ['#d4af37', '#f0d98c', '#ffffff', '#c98d98', '#ff6b6b', '#f1d27a', '#ff4757'];
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'pyro-burst';
        const angle = Math.random() * 360;
        const dist = 80 + Math.random() * 150;
        particle.style.setProperty('--px', Math.cos(angle * Math.PI / 180) * dist + 'px');
        particle.style.setProperty('--py', Math.sin(angle * Math.PI / 180) * dist + 'px');
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
        particle.style.animationDelay = (Math.random() * 0.3) + 's';
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
    }
    // Glitter
    for (let i = 0; i < 20; i++) {
        const glitter = document.createElement('div');
        glitter.className = 'pyro-glitter';
        const angle = Math.random() * 360;
        const dist = 30 + Math.random() * 60;
        glitter.style.setProperty('--gx', Math.cos(angle * Math.PI / 180) * dist + 'px');
        glitter.style.setProperty('--gy', Math.sin(angle * Math.PI / 180) * dist + 'px');
        glitter.style.left = x + 'px';
        glitter.style.top = y + 'px';
        glitter.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        glitter.style.animationDuration = (0.6 + Math.random() * 0.6) + 's';
        container.appendChild(glitter);
        setTimeout(() => glitter.remove(), 1500);
    }
}
function stadiumCelebration() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const positions = [
        { x: w * 0.2, y: h * 0.2 },
        { x: w * 0.5, y: h * 0.15 },
        { x: w * 0.8, y: h * 0.25 },
        { x: w * 0.3, y: h * 0.4 },
        { x: w * 0.7, y: h * 0.35 },
        { x: w * 0.5, y: h * 0.5 }
    ];
    positions.forEach((pos, i) => {
        setTimeout(() => {
            createPyro(pos.x, pos.y);
            if (i === 0 || i === 3) createConfettiBurst(30);
        }, i * 400);
    });
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createPyro(
                    Math.random() * w * 0.6 + w * 0.2,
                    Math.random() * h * 0.3 + h * 0.1
                );
            }, i * 200);
        }
        createConfettiBurst(80);
        createBalloons(12);
    }, 2800);
}
window.stadiumCelebration = stadiumCelebration;
window.createPyro = createPyro;

/* ---------- IMAGE LOADING ENHANCEMENTS ---------- */
(function initImageLoading() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
        }
    });
})();

/* ---------- EFFECTS ---------- */
const fxContainer = document.getElementById('fxContainer');

function createConfettiBurst(count = 50) {
    const colors = ['#d4af37', '#f0d98c', '#1a2a5e', '#ffffff', '#b8962e', '#2a3a7e'];
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
        piece.style.animationDelay = (Math.random() * 2) + 's';
        piece.style.width = (Math.random() * 8 + 5) + 'px';
        piece.style.height = (Math.random() * 12 + 8) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        fxContainer.appendChild(piece);
        setTimeout(() => piece.remove(), 6000);
    }
}

function createFirework() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.6;
    const colors = ['#d4af37', '#f0d98c', '#ffffff', '#1a2a5e', '#b8962e', '#ff6b6b'];
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        const angle = (Math.PI * 2 * i) / 30;
        const distance = Math.random() * 100 + 50;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
        fxContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
    }
}

function createBalloons(count = 5) {
    const colors = ['#d4af37', '#1a2a5c', '#b8962e', '#2a3a7c', '#f0d98c'];
    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDuration = (Math.random() * 10 + 15) + 's';
        balloon.style.animationDelay = (Math.random() * 5) + 's';
        document.body.appendChild(balloon);
        setTimeout(() => balloon.remove(), 30000);
    }
}

function createEmojiBurst(x, y) {
    const emojis = ['\u{1F382}', '\u{1F388}', '\u{1F381}', '\u{1F389}', '\u{1F38A}', '\u2728', '\u2764\uFE0F'];
    for (let i = 0; i < 5; i++) {
        const burst = document.createElement('div');
        burst.className = 'emoji-burst';
        burst.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        burst.style.left = x + (Math.random() * 60 - 30) + 'px';
        burst.style.top = y + (Math.random() * 30 - 15) + 'px';
        burst.style.fontSize = (Math.random() * 1 + 1.2) + 'rem';
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 1500);
    }
}

function showToast(message) {
    let toast = document.getElementById('easterToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'easterToast';
        toast.className = 'easter-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---------- BIRTHDAY LETTER ---------- */
(function initBirthdayLetter() {
    const envelope = document.getElementById('envelope');
    const letter = document.getElementById('birthdayLetter');
    const close = document.getElementById('closeLetter');
    if (!envelope || !letter || !close) return;
    envelope.addEventListener('click', () => {
        envelope.setAttribute('aria-expanded', 'true');
        envelope.classList.add('opened');
        letter.hidden = false;
        letter.classList.add('revealed');
        createConfettiBurst(18);
        setTimeout(() => close.focus(), 400);
    });
    close.addEventListener('click', () => {
        envelope.setAttribute('aria-expanded', 'false');
        envelope.classList.remove('opened');
        letter.classList.remove('revealed');
        setTimeout(() => { letter.hidden = true; envelope.focus(); }, 350);
    });
})();

document.addEventListener('click', (e) => {
    if (!e.target.closest('button') && !e.target.closest('a') && !e.target.closest('.lightbox')) {
        if (Math.random() < 0.3) createEmojiBurst(e.clientX, e.clientY);
    }
});

/* ---------- FADE IN ON SCROLL ---------- */
function checkFadeIn() {
    document.querySelectorAll('.fade-in, .timeline-item').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) el.classList.add('visible');
    });
}
window.addEventListener('scroll', () => requestAnimationFrame(checkFadeIn), { passive: true });

/* ---------- COUNTDOWN ---------- */
function flipCountdown(id, value) {
    const el = document.getElementById(id);
    if (!el || el.textContent === value) return;
    el.classList.add('flipping');
    setTimeout(() => {
        el.textContent = value;
        el.classList.remove('flipping');
    }, 150);
}
function updateCountdown() {
    const diff = CONFIG.birthday - new Date();
    if (diff <= 0) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => flipCountdown(id, '00'));
        return;
    }
    flipCountdown('days', String(Math.floor(diff / 86400000)).padStart(2, '0'));
    flipCountdown('hours', String(Math.floor(diff / 3600000) % 24).padStart(2, '0'));
    flipCountdown('minutes', String(Math.floor(diff / 60000) % 60).padStart(2, '0'));
    flipCountdown('seconds', String(Math.floor(diff / 1000) % 60).padStart(2, '0'));
}
if (document.getElementById('days')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ---------- CAKE ---------- */
function blowCandle(candle) {
    candle.classList.add('blown');
    const allBlown = Array.from(document.querySelectorAll('.candle')).every(c => c.classList.contains('blown'));
    if (allBlown) {
        createConfettiBurst(40);
        const cake = document.getElementById('cake');
        if (cake) {
            const r = cake.getBoundingClientRect();
            createEmojiBurst(r.left + r.width / 2, r.top + r.height / 2);
        }
        const msg = document.querySelector('.cake-message');
        if (msg) msg.innerHTML = '\u{1F389} <span>Happy Birthday, Robert!</span> \u{1F389}';
    }
}
window.blowCandle = blowCandle;

const cake = document.getElementById('cake');
if (cake) {
    const activateCake = () => {
        if (cake.dataset.activated === 'true') return;
        cake.dataset.activated = 'true';
        cake.classList.add('spotlight');
        createConfettiBurst(18);
        const bounds = cake.getBoundingClientRect();
        createEmojiBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
        showToast('The candles are glowing for you, Robert!');
    };
    cake.addEventListener('click', activateCake);
    cake.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activateCake(); }
    });
}

/* ---------- LIGHTBOX ---------- */
const photoArray = [
    { src: 'ROBERTMENSAH.jpeg', caption: '\u2728 Robert Mensah' },
    { src: 'MY LOVELY MOTHER .jpeg', caption: '\u2728 My Lovely Mother' },
    { src: 'mother.jpg', caption: '\u2728 My Mother' },
    { src: 'my mother and sister.jpeg', caption: '\u2728 My Mother and Sister' },
    { src: 'my sister.jpeg', caption: '\u2728 My Sister' },
    { src: 'my junior sister.jpeg', caption: '\u2728 My Junior Sister' },
    { src: 'sam.jpeg', caption: '\u2728 Sam — Family Friend' },
    { src: 'my picture.jpeg', caption: '\u2728 My Picture' },
    { src: 'my picture at home.jpeg', caption: '\u2728 My Picture at Home' },
    { src: 'my picture 2025.jpg', caption: '\u2728 My Picture 2025' },
    { src: 'my picture in april.jpg', caption: '\u2728 My Picture in April' },
    { src: 'my picture january 2026.jpg', caption: '\u2728 My Picture January 2026' },
    { src: 'my happy mode.jpg', caption: '\u2728 My Happy Mode' },
    { src: 'MY marticulation.jpg', caption: '\u2728 My Matriculation' },
    { src: 'abulai my friend.jpeg', caption: '\u2728 Ebulai — My Friend' },
    { src: 'bright my friend.jpeg', caption: '\u2728 Bright — My Friend' },
    { src: 'daniel my friend.jpeg', caption: '\u2728 Daniel — My Friend' },
    { src: 'ebenezer my friend.jpeg', caption: '\u2728 Ebenezer — My Friend' },
    { src: 'LABISTER my friend.jpeg', caption: '\u2728 Labister — My Friend' },
    { src: 'mastoe my friend.jpeg', caption: '\u2728 Mastu — My Friend' }
];
let currentPhoto = 0;

function openLightbox(index) {
    const trigger = typeof event !== 'undefined' ? event.currentTarget : null;
    const source = trigger && trigger.querySelector ? trigger.querySelector('img')?.getAttribute('src') : null;
    const sourceIndex = source ? photoArray.findIndex(photo => photo.src === source) : -1;
    currentPhoto = sourceIndex >= 0 ? sourceIndex : ((index % photoArray.length) + photoArray.length) % photoArray.length;
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const image = document.getElementById('lightboxImage');
    image.src = photoArray[currentPhoto].src;
    image.alt = photoArray[currentPhoto].caption.replace(/^\S+\s/, '');
    updateLightboxInfo();
    lb.dataset.previousFocus = document.activeElement && document.activeElement.id ? document.activeElement.id : '';
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('lightboxClose')?.focus();
}
function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const previousFocus = lb.dataset.previousFocus && document.getElementById(lb.dataset.previousFocus);
    if (previousFocus) previousFocus.focus();
}
function changePhoto(dir) {
    currentPhoto = (currentPhoto + dir + photoArray.length) % photoArray.length;
    const img = document.getElementById('lightboxImage');
    img.style.opacity = 0;
    setTimeout(() => {
        img.src = photoArray[currentPhoto].src;
        img.style.opacity = 1;
        updateLightboxInfo();
    }, 150);
}
function updateLightboxInfo() {
    document.getElementById('lightboxCounter').textContent = 'Photo ' + (currentPhoto + 1) + ' of ' + photoArray.length;
    document.getElementById('lightboxCaption').textContent = photoArray[currentPhoto].caption;
}
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changePhoto = changePhoto;

document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changePhoto(-1);
        if (e.key === 'ArrowRight') changePhoto(1);
        if (e.key === 'Tab') {
            const focusable = lightbox.querySelectorAll('button, [tabindex="0"]');
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }
});
const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
    lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) closeLightbox(); });
    let touchX = 0;
    lightboxEl.addEventListener('touchstart', e => touchX = e.touches[0].clientX);
    lightboxEl.addEventListener('touchend', e => {
        const d = e.changedTouches[0].clientX - touchX;
        if (Math.abs(d) > 50) changePhoto(d > 0 ? -1 : 1);
    });
}

document.querySelectorAll('[onclick*="openLightbox"]').forEach(tile => {
    tile.setAttribute('role', 'button');
    tile.setAttribute('tabindex', '0');
    tile.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        tile.click();
    });
});

/* ---------- MEMORY STREAMS ---------- */
function toggleStream(id, btn) {
    const track = document.getElementById(id);
    if (!track) return;
    track.classList.toggle('paused');
    btn.textContent = track.classList.contains('paused') ? '⏸️' : '▶️';
}
window.toggleStream = toggleStream;

const STREAM_TRACK = document.getElementById('memStreamTrack');
function playStream() {
    if (STREAM_TRACK) STREAM_TRACK.classList.remove('paused');
}
function pauseStream() {
    if (STREAM_TRACK) STREAM_TRACK.classList.add('paused');
}
window.playStream = playStream;
window.pauseStream = pauseStream;

/* ---------- FUN FACTS ---------- */
const FUN_FACTS = [
    { icon: '\u{1F382}', text: 'Robert was born on August 24th in Ghana.' },
    { icon: '\u{1F46A}', text: 'Family is one of the biggest reasons birthdays feel special.' },
    { icon: '\u{1F389}', text: 'A birthday is a chance to celebrate the people and moments that matter.' },
    { icon: '\u{1F91D}', text: 'Good friends make ordinary moments worth remembering.' },
    { icon: '\u{1F3B5}', text: 'This celebration has its own Happy Birthday tune \u2014 try the music button!' },
    { icon: '\u{1F4F8}', text: 'Every photo on this page keeps a special moment close.' },
    { icon: '\u{1F381}', text: 'The best gifts are shared memories, kind words, and time together.' },
    { icon: '\u{1F382}', text: 'Make a wish, light the candles, and enjoy the celebration.' }
];
let funIndex = 0;
function nextFunFact() {
    const iconEl = document.getElementById('funIcon');
    const textEl = document.getElementById('funText');
    if (!iconEl || !textEl) return;
    textEl.style.opacity = 0;
    setTimeout(() => {
        funIndex = (funIndex + 1) % FUN_FACTS.length;
        iconEl.textContent = FUN_FACTS[funIndex].icon;
        textEl.textContent = FUN_FACTS[funIndex].text;
        textEl.style.opacity = 1;
        if (window.twemoji) twemoji.parse(iconEl);
    }, 250);
}
window.nextFunFact = nextFunFact;

/* ---------- WISHES ---------- */
const STORAGE_KEY = 'robert_birthday_wishes';
function getWishes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
}
function saveWishes(w) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(w)); } catch (e) {}
}
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
function renderWishes() {
    const wall = document.getElementById('wishesWall');
    if (!wall) return;
    const wishes = getWishes();
    if (wishes.length === 0) {
        wall.innerHTML = '<p style="text-align:center;color:var(--muted-dark);grid-column:1/-1;padding:30px;">Be the first to leave a wish! \u{1F48C}</p>';
        return;
    }
    const likes = getLikes();
    wall.innerHTML = '';
    wishes.forEach((wish, index) => {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = '<span class="wish-heart">\u2764\uFE0F</span>' +
            '<div class="wish-name">' + escapeHtml(wish.name) + '</div>' +
            '<div class="wish-category">' + escapeHtml(wish.category) + '</div>' +
            '<div class="wish-message">' + escapeHtml(wish.message) + '</div>' +
            '<div class="wish-date">\u{1F4C5} ' + escapeHtml(wish.date) + '</div>' +
            '<div class="wish-reactions">' +
            '<button class="reaction-btn' + (likes[index] ? ' liked' : '') + '" onclick="toggleLike(' + index + ', this)" aria-label="Like this wish">' +
            '\u2764\uFE0F <span class="like-count">' + (wish.likes || 0) + '</span></button>' +
            '</div>';
        wall.appendChild(card);
    });
}
function submitWish() {
    const name = document.getElementById('wishName').value.trim();
    const category = document.getElementById('wishCategory').value;
    const message = document.getElementById('wishMessage').value.trim();
    if (!message) { showToast('Please write a birthday wish! \u{1F60A}'); return; }
    const wishes = getWishes();
    wishes.unshift({
        name: name || 'Anonymous Friend \u{1F49D}',
        category: category || 'Friend',
        message,
        date: new Date().toLocaleDateString()
    });
    saveWishes(wishes);
    ['wishName', 'wishCategory', 'wishMessage'].forEach(id => document.getElementById(id).value = '');
    const conf = document.getElementById('wishConfirmation');
    conf.classList.add('show');
    setTimeout(() => conf.classList.remove('show'), 3000);
    renderWishes();
    createConfettiBurst(20);
}
window.submitWish = submitWish;

/* ---------- WHATSAPP ---------- */
function sendWhatsApp() {
    const input = document.getElementById('whatsappMessage');
    const message = (input && input.value.trim()) || 'Happy Birthday Robert! \u{1F389}\u{1F382}';
    window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message), '_blank');
}
window.sendWhatsApp = sendWhatsApp;

function copyPhoneNumber() {
    navigator.clipboard.writeText(CONFIG.momoNumber).then(() => flashCopy()).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = CONFIG.momoNumber;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        flashCopy();
    });
}
function flashCopy() {
    const btn = document.getElementById('copyBtn');
    if (!btn) return;
    btn.textContent = '\u2705 Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '\u{1F4CB} Copy'; btn.classList.remove('copied'); }, 2000);
}
window.copyPhoneNumber = copyPhoneNumber;

/* ---------- FINAL CELEBRATION ---------- */
function finalCelebration() {
    for (let i = 0; i < 8; i++) setTimeout(createFirework, i * 300);
    createConfettiBurst(60);
    createBalloons(10);
    firePartyPoppers();
    // Stadium pyro
    setTimeout(() => {
        if (typeof stadiumCelebration === 'function') stadiumCelebration();
    }, 500);
    showToast('\u{1F386} Here\u2019s to you, Robert! \u{1F382}');
}
window.finalCelebration = finalCelebration;

function firePartyPoppers() {
    const colors = ['#d4af6a', '#a5122a', '#f8f0e3', '#c98d98'];
    [-1, 1].forEach(direction => {
        const popper = document.createElement('span');
        popper.className = 'party-popper party-popper-' + (direction < 0 ? 'left' : 'right');
        document.body.appendChild(popper);
        setTimeout(() => popper.remove(), 2600);
        for (let i = 0; i < 24; i++) {
            const piece = document.createElement('span');
            piece.className = 'popper-piece';
            piece.style.setProperty('--angle', (direction * (Math.random() * 55 + 28)) + 'deg');
            piece.style.setProperty('--distance', (Math.random() * 180 + 90) + 'px');
            piece.style.setProperty('--fall', (Math.random() * 180 + 80) + 'px');
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            popper.appendChild(piece);
        }
    });
}

const finalToasts = document.getElementById('finalToasts');
if (finalToasts) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                finalToasts.querySelectorAll('.final-toast').forEach((t, idx) => {
                    setTimeout(() => t.classList.add('visible'), idx * 800);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    obs.observe(finalToasts);
}

/* ---------- SCROLL PROGRESS ---------- */
(function initScrollUI() {
    const bar = document.getElementById('scrollProgress');
    const top = document.getElementById('backToTop');
    if (!bar && !top) return;
    let ticking = false;
    function update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = 'scaleX(' + (docHeight > 0 ? scrollTop / docHeight : 0) + ')';
        if (top) top.classList.toggle('visible', scrollTop > 500);
        checkFadeIn();
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    if (top) top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    update();
})();

/* ---------- BIRTHDAY DAY DETECTION ---------- */
(function initBirthdayCheck() {
    const now = new Date();
    const isBirthday = now.getMonth() === 7 && now.getDate() === 24;
    const banner = document.getElementById('birthdayBanner');
    if (isBirthday) {
        if (banner) banner.classList.add('show');
        setTimeout(() => createConfettiBurst(60), 1200);
        setTimeout(() => createBalloons(8), 2500);
        setTimeout(() => { if (typeof stadiumCelebration === 'function') stadiumCelebration(); }, 3000);
    }
})();

/* ---------- QUOTE ROTATOR ---------- */
(function initQuotes() {
    const textEl = document.getElementById('quoteText');
    const authorEl = document.getElementById('quoteAuthor');
    const dotsEl = document.getElementById('quoteDots');
    if (!textEl || !authorEl) return;
    const QUOTES = [
        { text: 'Another year. Another chapter. Another reason to keep celebrating.', author: 'Robert Mensah' },
        { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
        { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
        { text: 'Family is not an important thing. It is everything.', author: 'Michael J. Fox' },
        { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' }
    ];
    let qi = 0;
    const dots = QUOTES.map((_, i) => {
        const d = document.createElement('button');
        d.className = 'quote-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Quote ' + (i + 1));
        d.addEventListener('click', () => showQuote(i));
        if (dotsEl) dotsEl.appendChild(d);
        return d;
    });
    function showQuote(i) {
        qi = i;
        textEl.style.opacity = 0;
        authorEl.style.opacity = 0;
        setTimeout(() => {
            textEl.textContent = '\u201C' + QUOTES[i].text + '\u201D';
            authorEl.textContent = '\u2014 ' + QUOTES[i].author;
            textEl.style.opacity = 1;
            authorEl.style.opacity = 1;
            dots.forEach((d, j) => d.classList.toggle('active', j === i));
        }, 400);
    }
    textEl.textContent = '\u201C' + QUOTES[0].text + '\u201D';
    authorEl.textContent = '\u2014 ' + QUOTES[0].author;
    setInterval(() => showQuote((qi + 1) % QUOTES.length), 7000);
})();

/* ---------- WISH REACTIONS ---------- */
const LIKES_KEY = 'robert_birthday_wish_likes';
function getLikes() {
    try { return JSON.parse(localStorage.getItem(LIKES_KEY)) || {}; } catch (e) { return {}; }
}
function saveLikes(l) {
    try { localStorage.setItem(LIKES_KEY, JSON.stringify(l)); } catch (e) {}
}
function toggleLike(index, btn) {
    const likes = getLikes();
    const wishes = getWishes();
    if (!wishes[index]) return;
    if (likes[index]) {
        delete likes[index];
        wishes[index].likes = Math.max(0, (wishes[index].likes || 1) - 1);
        btn.classList.remove('liked');
    } else {
        likes[index] = true;
        wishes[index].likes = (wishes[index].likes || 0) + 1;
        btn.classList.add('liked');
        createEmojiBurst(btn.getBoundingClientRect().left, btn.getBoundingClientRect().top);
    }
    saveLikes(likes);
    saveWishes(wishes);
    btn.querySelector('.like-count').textContent = wishes[index].likes || 0;
}
window.toggleLike = toggleLike;

/* ---------- SONG REQUEST ---------- */
function sendSongRequest() {
    const input = document.getElementById('songRequest');
    const message = (input && input.value.trim()) || 'Hi Robert! \u{1F3B6} Please play this song for me: ';
    window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message), '_blank');
}
window.sendSongRequest = sendSongRequest;

/* ---------- ANONYMOUS CONFESSIONS ---------- */
const CONFESSION_KEY = 'robert_birthday_confessions';
function getConfessions() {
    try { return JSON.parse(localStorage.getItem(CONFESSION_KEY)) || []; } catch (e) { return []; }
}
function saveConfessions(c) {
    try { localStorage.setItem(CONFESSION_KEY, JSON.stringify(c)); } catch (e) {}
}
function renderConfessions() {
    const wall = document.getElementById('confessionsWall');
    if (!wall) return;
    const confessions = getConfessions();
    if (confessions.length === 0) {
        wall.innerHTML = '<p style="text-align:center;color:var(--muted-dark);grid-column:1/-1;padding:30px;">No confessions yet - be the first to spill the tea! \u{1F973}</p>';
        return;
    }
    wall.innerHTML = '';
    confessions.forEach((c, idx) => {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = '<span class="wish-heart">\u{1F973}</span>' +
            '<div class="wish-category">' + escapeHtml(c.type) + '</div>' +
            '<div class="wish-message">' + escapeHtml(c.message) + '</div>' +
            '<div class="wish-date">\u{1F92B} Anonymous \u2022 ' + escapeHtml(c.date) + '</div>' +
            '<div class="wish-reactions">' +
            '<button class="reaction-btn deliver-btn" onclick="replyToConfession(' + idx + ', this)" aria-label="Reply via WhatsApp">\u{1F4AC} Reply</button>' +
            '</div>';
        wall.appendChild(card);
    });
}
function replyToConfession(idx, btn) {
    const confessions = getConfessions();
    if (!confessions[idx]) return;
    const text = 'Hi Robert! A friend sent you an anonymous confession: "' + confessions[idx].message + '". Want to reply?';
    window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text), '_blank');
}
window.replyToConfession = replyToConfession;
function submitConfession() {
    const type = document.getElementById('confessionType').value;
    const message = document.getElementById('confessionMessage').value.trim();
    if (!message) { showToast('Please write a confession! \u{1F605}'); return; }
    const deliver = document.getElementById('confessionDeliver').checked;
    const confessions = getConfessions();
    confessions.unshift({
        type: type || 'Other',
        message: message,
        date: new Date().toLocaleDateString(),
        delivered: deliver
    });
    saveConfessions(confessions);
    document.getElementById('confessionMessage').value = '';
    document.getElementById('confessionType').value = 'Crazy Truth';
    document.getElementById('confessionDeliver').checked = false;
    const conf = document.getElementById('confessionConfirmation');
    conf.classList.add('show');
    setTimeout(() => conf.classList.remove('show'), 3000);
    if (deliver) {
        const deliveredMsg = 'Anonymous message for you: "' + message + '" - they\'d like you to reply privately.';
        window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(deliveredMsg), '_blank');
        const del = document.getElementById('confessionDelivered');
        del.classList.add('show');
        setTimeout(() => del.classList.remove('show'), 4000);
    }
    renderConfessions();
    createConfettiBurst(15);
}
window.submitConfession = submitConfession;

/* ---------- SOCIAL SHARE ---------- */
function getShareUrl() { return window.location.href; }
function getShareText() { return 'Celebrate Robert Mensah\u2019s birthday! \u{1F382}\u{1F389}'; }
function shareWhatsApp() {
    window.open('https://wa.me/?text=' + encodeURIComponent(getShareText() + ' ' + getShareUrl()), '_blank');
}
function shareFacebook() {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(getShareUrl()), '_blank');
}
function shareTwitter() {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(getShareText()) + '&url=' + encodeURIComponent(getShareUrl()), '_blank');
}
function shareCopy() {
    navigator.clipboard.writeText(getShareUrl()).then(() => showToast('Link copied to clipboard! \u{1F517}'));
}
window.shareWhatsApp = shareWhatsApp;
window.shareFacebook = shareFacebook;
window.shareTwitter = shareTwitter;
window.shareCopy = shareCopy;

/* ---------- INIT ---------- */
renderWishes();
renderConfessions();
createBalloons(4);
checkFadeIn();
if (window.twemoji) twemoji.parse(document.body);