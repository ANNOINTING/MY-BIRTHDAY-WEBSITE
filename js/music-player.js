/* ============================================================
   MUSIC PLAYER — guaranteed-to-play birthday music
   Uses the Web Audio API to synthesise "Happy Birthday"
   locally in the browser. No external files, no network
   dependency, works on every device including phones.
   Three arrangements: Classic · Music Box · Warm Piano
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Arrangements ---------- */
    const STYLES = [
        { name: 'Happy Birthday To You',      wave: 'triangle', vol: 0.16, chordVol: 0.06, octave: 1, tempo: 0.50 },
        { name: 'Happy Birthday (Music Box)', wave: 'sine',     vol: 0.20, chordVol: 0.04, octave: 2, tempo: 0.42 },
        { name: 'Happy Birthday (Warm Piano)',wave: 'sawtooth', vol: 0.07, chordVol: 0.05, octave: 1, tempo: 0.58 }
    ];

    let ctx = null;
    let masterGain = null;
    let loopTimer = null;
    let uiTimer = null;
    let playing = false;
    let styleIdx = 0;
    let songStart = 0;
    let songDuration = 0;

    /* ---------- Audio helpers ---------- */
    function ensureCtx() {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();
            masterGain = ctx.createGain();
            masterGain.gain.value = 0.9;
            masterGain.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function tone(freq, start, dur, type, vol) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(vol, start + 0.03);
        g.gain.setValueAtTime(vol, Math.max(start + 0.03, start + dur - 0.08));
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(g); g.connect(masterGain);
        osc.start(start); osc.stop(start + dur + 0.05);
    }

    /* Happy Birthday melody in C — [beat position, semitone offset from C4] */
    const MELODY = [
        [0, 7], [0.75, 7], [1.5, 9], [2.25, 7], [3, 12], [3.75, 11],
        [6, 7], [6.75, 7], [7.5, 9], [8.25, 7], [9, 14], [9.75, 12],
        [12, 7], [12.75, 7], [13.5, 19], [14.25, 16], [15, 12], [15.75, 11], [16.5, 9],
        [18, 17], [18.75, 17], [19.5, 16], [20.25, 12], [21, 14], [21.75, 12]
    ];
    const CHORDS = [[0, -12], [6, -17], [12, -24], [18, -19]]; /* root bass notes */

    function scheduleSong() {
        const s = STYLES[styleIdx];
        const t = ctx.currentTime + 0.08;
        const beat = s.tempo;
        const oct = Math.pow(2, s.octave - 1);
        const C4 = 261.63;

        MELODY.forEach(([b, semi]) => {
            tone(C4 * oct * Math.pow(2, semi / 12), t + b * beat, beat * 0.92, s.wave, s.vol);
        });
        CHORDS.forEach(([b, semi]) => {
            tone(C4 * Math.pow(2, semi / 12), t + b * beat, beat * 3.4, 'sine', s.chordVol);
        });
        return (24 * beat + 1.2) * 1000; /* total ms incl. tail */
    }

    function fmt(s) {
        if (!isFinite(s)) return '0:00';
        return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    }

    /* ---------- Playback control ---------- */
    function startPlayback() {
        if (!ensureCtx()) { showToastSafe('Audio is not supported on this browser.'); return; }
        stopLoopOnly();
        songStart = performance.now();
        songDuration = scheduleSong();
        playing = true;
        loopTimer = setInterval(() => {
            songStart = performance.now();
            songDuration = scheduleSong();
        }, songDuration);
        updateAllUI();
        uiTimer = setInterval(updateAllUI, 250);
    }

    function stopLoopOnly() {
        if (loopTimer) { clearInterval(loopTimer); loopTimer = null; }
    }

    function pausePlayback() {
        /* Web Audio scheduled notes cannot be paused mid-flight cleanly;
           we simply stop scheduling further loops (current phrase finishes). */
        stopLoopOnly();
        playing = false;
        updateAllUI();
    }

    function togglePlayback() {
        if (playing) pausePlayback();
        else startPlayback();
    }

    function changeStyle(dir) {
        styleIdx = ((styleIdx + dir) % STYLES.length + STYLES.length) % STYLES.length;
        if (playing) startPlayback();
        else updateAllUI();
    }

    function showToastSafe(msg) {
        try { if (typeof showToast === 'function') showToast(msg); } catch (e) {}
    }

    /* ---------- Floating player UI ---------- */
    function buildPlayer() {
        if (document.getElementById('musicPlayer')) return;
        const p = document.createElement('div');
        p.id = 'musicPlayer';
        p.innerHTML =
            '<div class="player-info">' +
            '<div class="player-title" id="trackTitle">' + STYLES[styleIdx].name + '</div>' +
            '<div class="player-tracknum" id="trackNum">Arrangement 1 of ' + STYLES.length + '</div>' +
            '</div>' +
            '<button class="player-btn" id="prevBtn" aria-label="Previous arrangement">&#9198;</button>' +
            '<button class="player-btn player-play" id="playPauseBtn" aria-label="Play or pause">&#9654;</button>' +
            '<button class="player-btn" id="nextBtn" aria-label="Next arrangement">&#9197;</button>' +
            '<div class="player-visualizer" aria-hidden="true"><i></i><i></i><i></i></div>' +
            '<span class="player-time" id="timeLabel">0:00</span>' +
            '<button class="player-close" id="playerCloseBtn" aria-label="Close player">&#10005;</button>';
        document.body.appendChild(p);

        document.getElementById('prevBtn').addEventListener('click', () => changeStyle(-1));
        document.getElementById('nextBtn').addEventListener('click', () => changeStyle(1));
        document.getElementById('playPauseBtn').addEventListener('click', togglePlayback);
        document.getElementById('playerCloseBtn').addEventListener('click', closePlayer);
    }

    function injectStyles() {
        if (document.getElementById('rmPlayerStyles')) return;
        const st = document.createElement('style');
        st.id = 'rmPlayerStyles';
        st.textContent = [
            '#musicPlayer{position:fixed;bottom:-140px;left:50%;transform:translateX(-50%);',
            'z-index:1500;display:flex;align-items:center;gap:10px;',
            'background:rgba(10,10,16,0.95);backdrop-filter:blur(18px);',
            'border:1px solid rgba(212,175,106,0.45);border-radius:60px;',
            'padding:12px 20px;box-shadow:0 15px 50px rgba(0,0,0,0.6);',
            'transition:bottom 0.45s cubic-bezier(.2,.9,.3,1.2);max-width:94vw;}',
            '#musicPlayer.open{bottom:20px;}',
            '.player-info{min-width:170px;max-width:230px;margin-right:6px;}',
            '.player-title{font-family:"Cormorant Garamond",serif;font-size:1rem;color:#f1d27a;',
            'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
            '.player-tracknum{font-size:0.62rem;color:#a38a93;letter-spacing:1px;text-transform:uppercase;}',
            '.player-btn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);',
            'color:#d4af6a;width:42px;height:42px;border-radius:50%;cursor:pointer;',
            'font-size:1rem;flex-shrink:0;transition:all 0.3s;}',
            '.player-btn:hover{border-color:#d4af6a;transform:scale(1.1);}',
            '.player-play{width:48px;height:48px;background:linear-gradient(135deg,#f1d27a,#d4af6a);',
            'color:#0a0a10;font-size:1.15rem;border:none;}',
            '.player-time{font-size:0.7rem;color:#a38a93;font-variant-numeric:tabular-nums;}',
            '.player-visualizer{display:flex;align-items:flex-end;gap:3px;width:26px;height:22px;flex-shrink:0;}',
            '.player-visualizer i{display:block;width:4px;height:35%;background:#d4af6a;border-radius:2px;}',
            '#musicPlayer.playing .player-visualizer i{animation:rmBars 0.8s ease-in-out infinite alternate;}',
            '#musicPlayer.playing .player-visualizer i:nth-child(2){animation-delay:-0.2s;}',
            '#musicPlayer.playing .player-visualizer i:nth-child(3){animation-delay:-0.45s;}',
            '@keyframes rmBars{to{height:100%;}}',
            '.player-close{background:none;border:none;color:#a38a93;font-size:1rem;cursor:pointer;padding:4px;}',
            '.player-close:hover{color:#f1d27a;}',
            '@media(max-width:600px){.player-info{min-width:110px;max-width:140px;}.player-title{font-size:0.85rem;}#musicPlayer{padding:10px 14px;gap:8px;}}'
        ].join('');
        document.head.appendChild(st);
    }

    /* ---------- UI sync (floating player + optional page controls) ---------- */
    function updateAllUI() {
        const s = STYLES[styleIdx];
        const pp = document.getElementById('playPauseBtn');
        if (pp) pp.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;';
        const tt = document.getElementById('trackTitle');
        if (tt) tt.textContent = s.name;
        const tn = document.getElementById('trackNum');
        if (tn) tn.textContent = 'Arrangement ' + (styleIdx + 1) + ' of ' + STYLES.length;
        const tl = document.getElementById('timeLabel');
        if (tl) tl.textContent = playing ? fmt((performance.now() - songStart) / 1000) : '0:00';
        const player = document.getElementById('musicPlayer');
        if (player) player.classList.toggle('playing', playing);
        const mb = document.getElementById('musicBtn');
        if (mb) mb.classList.toggle('playing', playing);

        /* Optional dedicated music-page controls */
        const pageTitle = document.getElementById('musicTrackTitle');
        if (pageTitle) pageTitle.textContent = s.name;
        const pageInfo = document.getElementById('musicTrackInfo');
        if (pageInfo) pageInfo.textContent = 'Arrangement ' + (styleIdx + 1) + ' of ' + STYLES.length + ' \u2022 Live Synth Performance';
        const pagePlay = document.getElementById('musicPlayBtn');
        if (pagePlay) pagePlay.textContent = playing ? '\u23F8' : '\u25B6';
    }

    function openPlayer() {
        injectStyles();
        buildPlayer();
        document.getElementById('musicPlayer').classList.add('open');
        if (!playing) startPlayback();
    }

    function closePlayer() {
        const p = document.getElementById('musicPlayer');
        if (p) p.classList.remove('open');
        pausePlayback();
    }

    /* ---------- Wiring ---------- */
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) musicBtn.addEventListener('click', openPlayer);

    /* Dedicated music.html page controls */
    const pagePlay = document.getElementById('musicPlayBtn');
    if (pagePlay) {
        pagePlay.addEventListener('click', () => {
            if (!document.getElementById('musicPlayer')?.classList.contains('open')) openPlayer();
            else togglePlayback();
        });
    }
    const pagePrev = document.getElementById('musicPrevBtn');
    if (pagePrev) pagePrev.addEventListener('click', () => changeStyle(-1));
    const pageNext = document.getElementById('musicNextBtn');
    if (pageNext) pageNext.addEventListener('click', () => changeStyle(1));

    /* Expose for overlays/debugging */
    window.openMusicPlayer = openPlayer;
    window.closeMusicPlayer = closePlayer;
})();