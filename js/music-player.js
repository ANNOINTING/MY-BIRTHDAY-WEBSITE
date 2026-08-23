/* ============================================================
   MUSIC PLAYER — real birthday songs with next/previous
   Playlist uses public-domain / Creative Commons recordings
   hosted on archive.org. If a track fails to load it is
   skipped automatically; a built-in synth "Happy Birthday"
   is the guaranteed fallback so there is always music.
   ============================================================ */
(function () {
    'use strict';

    const TRACKS = [
        { title: 'Happy Birthday To You (Classic)', src: 'https://archive.org/download/happy-birthday-to-you/happy%20birthday%20to%20you.mp3' },
        { title: 'Happy Birthday (Piano Version)', src: 'https://archive.org/download/happy-birthday-to-you-piano-version-13976/happy-birthday-to-you-piano-version-13976.mp3' },
        { title: 'Happy Birthday (Most Popular Version)', src: 'https://archive.org/download/happy-birthday-to-you-most-popular-version/happy-birthday-to-you-most-popular-version.mp3' },
        { title: 'Happy Birthday (Latin Version)', src: 'https://archive.org/download/happy-birthday-to-you-instrumental/Happy%20Birthday%20Latin.mp3' },
        { title: 'Happy Birthday (Music Box)', src: 'https://archive.org/download/happy-birthday-to-you-instrumental/Happy%20Birthday%20Music%20Box%20Loop.mp3' },
        { title: 'Happy Birthday (Olivia)', src: 'https://archive.org/download/happy-birthday-to-you-olivia/Happy%20Birthday%20to%20You.mp3' },
        { title: 'Happy Birthday (Kiboomers Kids)', src: 'https://archive.org/download/happy-birthday-to-you-the-kiboomers-birthday-party-song-for-kids/Happy%20Birthday%20To%20You%20-%20THE%20KIBOOMERS%20Birthday%20Party%20Song%20for%20Kids.mp3' },
        { title: 'Happy Birthday (Synth Fallback)', src: 'synth' }
    ];

    let playerAudio = null;
    let currentTrack = 0;
    let synthTimer = null;
    let synthCtx = null;

    /* ---------- Inject styles ---------- */
    const style = document.createElement('style');
    style.textContent = [
        '#musicPlayer{position:fixed;bottom:-140px;left:50%;transform:translateX(-50%);',
        'z-index:1500;display:flex;align-items:center;gap:10px;',
        'background:rgba(10,14,39,0.95);backdrop-filter:blur(18px);',
        'border:1px solid rgba(212,175,55,0.4);border-radius:60px;',
        'padding:12px 20px;box-shadow:0 15px 50px rgba(0,0,0,0.6);',
        'transition:bottom 0.45s cubic-bezier(.2,.9,.3,1.2);max-width:94vw;}',
        '#musicPlayer.open{bottom:20px;}',
        '.player-info{min-width:170px;max-width:230px;margin-right:6px;}',
        '.player-title{font-family:"Cormorant Garamond",serif;font-size:1rem;color:#f0d98c;',
        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.player-tracknum{font-size:0.65rem;color:#6b7280;letter-spacing:1px;text-transform:uppercase;}',
        '.player-btn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);',
        'color:#d4af37;width:40px;height:40px;border-radius:50%;cursor:pointer;',
        'font-size:1rem;flex-shrink:0;transition:all 0.3s;}',
        '.player-btn:hover{border-color:#d4af37;transform:scale(1.1);}',
        '.player-play{width:48px;height:48px;background:linear-gradient(135deg,#f0d98c,#d4af37);',
        'color:#0a0e27;font-size:1.15rem;border:none;}',
        '.player-seek{flex:1;min-width:80px;accent-color:#d4af37;cursor:pointer;}',
        '.player-time{font-size:0.7rem;color:#9aa3b5;white-space:nowrap;font-variant-numeric:tabular-nums;}',
        '.player-visualizer{display:flex;align-items:flex-end;gap:3px;width:28px;height:22px;flex-shrink:0;}',
        '.player-visualizer i{display:block;width:4px;height:35%;background:#d4af37;border-radius:2px;}',
        '#musicPlayer.playing .player-visualizer i{animation:playerBars 0.8s ease-in-out infinite alternate;}',
        '#musicPlayer.playing .player-visualizer i:nth-child(2){animation-delay:-0.2s;}#musicPlayer.playing .player-visualizer i:nth-child(3){animation-delay:-0.45s;}',
        '@keyframes playerBars{to{height:100%;}}',
        '.player-close{background:none;border:none;color:#6b7280;font-size:1rem;cursor:pointer;',
        'padding:4px;transition:color 0.3s;}',
        '.player-close:hover{color:#f0d98c;}',
        '@media(max-width:600px){',
        '.player-info{min-width:110px;max-width:130px;}',
        '.player-title{font-size:0.85rem;}',
        '#musicPlayer{padding:10px 14px;gap:8px;}}'
    ].join('');
    document.head.appendChild(style);

    /* ---------- Synth fallback (guaranteed Happy Birthday) ---------- */
    function playSynthNote(freq, start, dur, type, vol) {
        const osc = synthCtx.createOscillator();
        const gain = synthCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(vol, start + 0.02);
        gain.gain.setValueAtTime(vol, start + dur - 0.05);
        gain.gain.linearRampToValueAtTime(0.001, start + dur);
        gain.connect(synthCtx.destination);
        osc.start(start);
        osc.stop(start + dur);
    }

    function playSynthSong() {
        if (!synthCtx) synthCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (synthCtx.state === 'suspended') synthCtx.resume();
        const t = synthCtx.currentTime + 0.05;
        const beat = 0.5;
        const C = 261.63, E = 329.63, G = 392.00, B = 493.88, F = 349.23, A = 440.00, D = 293.66;
        const C2 = C * 2, D2 = D * 2, E2 = E * 2, F2 = F * 2, G2 = G * 2;
        const melody = [
            [G, 4], [G, 4.5], [A, 5], [G, 5.5], [C2, 6], [B, 6.5],
            [G, 8], [G, 8.5], [A, 9], [G, 9.5], [D2, 10], [C2, 10.5],
            [G, 12], [G, 12.5], [G2, 13], [E2, 13.5], [C2, 14], [B, 14.5], [A, 15],
            [F2, 16], [F2, 16.5], [E2, 17], [C2, 17.5], [D2, 18], [C2, 18.5]
        ];
        melody.forEach(([f, b]) => playSynthNote(f, t + b * beat, 0.45, 'triangle', 0.15));
        [[C, 4], [F, 8], [C, 12], [G, 16]].forEach(([f, b]) => playSynthNote(f * 0.5, t + b * beat, beat * 1.8, 'sawtooth', 0.06));
        return 19 * beat * 1000;
    }

    function startSynthFallback() {
        stopSynth();
        const duration = playSynthSong();
        updateUI();
        synthTimer = setInterval(() => {
            if (!document.getElementById('playPauseBtn')) { stopSynth(); return; }
            playSynthSong();
            updateUI();
        }, duration);
    }

    function stopSynth() {
        if (synthTimer) { clearInterval(synthTimer); synthTimer = null; }
    }

    /* ---------- Player UI ---------- */
    function fmtTime(s) {
        if (!isFinite(s)) return '0:00';
        return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    }

    function setPlayingState(playing) {
        const btn = document.getElementById('musicBtn');
        if (btn) btn.classList.toggle('playing', playing);
    }

    function updateUI() {
        const playBtn = document.getElementById('playPauseBtn');
        const seek = document.getElementById('seekBar');
        const timeLabel = document.getElementById('timeLabel');
        if (!playBtn) return;
        const playing = playerAudio ? !playerAudio.paused : !!synthTimer;
        playBtn.textContent = playing ? '\u23F8\uFE0F' : '\u25B6\uFE0F';
        setPlayingState(playing);
        const player = document.getElementById('musicPlayer');
        if (player) player.classList.toggle('playing', playing);
        if (playerAudio && playerAudio.duration) {
            seek.value = Math.round((playerAudio.currentTime / playerAudio.duration) * 100);
            timeLabel.textContent = fmtTime(playerAudio.currentTime) + ' / ' + fmtTime(playerAudio.duration);
        } else if (synthTimer) {
            timeLabel.textContent = '\u{1F3B5} Playing...';
        } else {
            timeLabel.textContent = '0:00';
        }
    }

    function loadTrack(index, autoplay) {
        currentTrack = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
        const track = TRACKS[currentTrack];
        document.getElementById('trackTitle').textContent = track.title;
        document.getElementById('trackNum').textContent = 'Track ' + (currentTrack + 1) + ' of ' + TRACKS.length;

        stopSynth();
        if (playerAudio) { playerAudio.pause(); playerAudio.src = ''; playerAudio = null; }

        if (track.src === 'synth') {
            if (autoplay !== false) startSynthFallback(); else updateUI();
            return;
        }

        playerAudio = new Audio(track.src);
        playerAudio.addEventListener('timeupdate', updateUI);
        playerAudio.addEventListener('ended', () => loadTrack(currentTrack + 1, true));
        playerAudio.addEventListener('error', () => {
            showToast('Track unavailable \u2014 skipping to the next song...');
            loadTrack(currentTrack + 1, autoplay);
        });
        if (autoplay !== false) {
            playerAudio.play().then(updateUI).catch(() => updateUI());
        }
        updateUI();
    }

    function togglePlay() {
        if (TRACKS[currentTrack].src === 'synth') {
            if (synthTimer) { stopSynth(); updateUI(); } else { startSynthFallback(); }
            return;
        }
        if (!playerAudio) { loadTrack(currentTrack, true); return; }
        if (playerAudio.paused) { playerAudio.play().catch(function () {}); }
        else { playerAudio.pause(); }
        setTimeout(updateUI, 120);
    }

    function openPlayer() {
        buildPlayer();
        document.getElementById('musicPlayer').classList.add('open');
        if (!playerAudio && !synthTimer) loadTrack(currentTrack, true);
    }

    function closePlayer() {
        const p = document.getElementById('musicPlayer');
        if (p) p.classList.remove('open');
        if (playerAudio) playerAudio.pause();
        stopSynth();
        setPlayingState(false);
        const pp = document.getElementById('playPauseBtn');
        if (pp) pp.textContent = '\u25B6\uFE0F';
    }

    function buildPlayer() {
        if (document.getElementById('musicPlayer')) return;
        const p = document.createElement('div');
        p.id = 'musicPlayer';
        p.innerHTML =
            '<div class="player-info">' +
            '<div class="player-title" id="trackTitle">' + TRACKS[0].title + '</div>' +
            '<div class="player-tracknum" id="trackNum">Track 1 of ' + TRACKS.length + '</div>' +
            '</div>' +
            '<button class="player-btn" id="prevBtn" aria-label="Previous song">\u23EE\uFE0F</button>' +
            '<button class="player-btn player-play" id="playPauseBtn" aria-label="Play or pause">\u25B6\uFE0F</button>' +
            '<button class="player-btn" id="nextBtn" aria-label="Next song">\u23ED\uFE0F</button>' +
            '<div class="player-visualizer" aria-label="Music playing indicator"><i></i><i></i><i></i></div>' +
            '<input type="range" class="player-seek" id="seekBar" min="0" max="100" value="0" aria-label="Seek">' +
            '<span class="player-time" id="timeLabel">0:00</span>' +
            '<button class="player-close" id="playerCloseBtn" aria-label="Close player">\u2715</button>';
        document.body.appendChild(p);

        document.getElementById('prevBtn').addEventListener('click', function () { loadTrack(currentTrack - 1, true); });
        document.getElementById('nextBtn').addEventListener('click', function () { loadTrack(currentTrack + 1, true); });
        document.getElementById('playPauseBtn').addEventListener('click', togglePlay);
        document.getElementById('playerCloseBtn').addEventListener('click', closePlayer);

        document.getElementById('seekBar').addEventListener('input', function (e) {
            if (playerAudio && playerAudio.duration) {
                playerAudio.currentTime = (e.target.value / 100) * playerAudio.duration;
            }
        });
    }

    /* Hook the floating 🎵 button to open the player */
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) {
        musicBtn.addEventListener('click', openPlayer);
    }

    /* Expose for debugging */
    window.openMusicPlayer = openPlayer;
})();