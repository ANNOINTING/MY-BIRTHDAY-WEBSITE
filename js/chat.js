/* ============================================================
   LIVE CHAT + LIVE WISHES — works two ways
   ------------------------------------------------------------
   MODE 1 (default): Instant local live-sync.
     Messages sync in real time between every tab/window open
     on this device (BroadcastChannel) and persist offline.

   MODE 2 (optional, true cross-device live):
     Paste your free Firebase config into LIVE.firebase below,
     redeploy — and chat + wishes become live across ALL
     devices worldwide (friends see each other's messages
     appear instantly). Free tier at https://firebase.google.com
   ============================================================ */
(function () {
    'use strict';

    /* ---------- OPTIONAL: paste your firebaseConfig object here ---------- */
    const LIVE = {
        firebase: null
        /* Example:
        firebase: {
            apiKey: "YOUR_KEY",
            authDomain: "your-app.firebaseapp.com",
            databaseURL: "https://your-app-default-rtdb.firebaseio.com",
            projectId: "your-app",
            storageBucket: "your-app.appspot.com",
            messagingSenderId: "000000000000",
            appId: "1:000000000000:web:abcdef"
        }
        */
    };

    /* ---------- Shared live bus ---------- */
    let bc = null;
    try { bc = new BroadcastChannel('rm-birthday-live'); } catch (e) {}
    const listeners = [];
    function emit(type, data) {
        listeners.forEach(fn => { try { fn(type, data); } catch (e) {} });
        if (bc) { try { bc.postMessage({ type, data }); } catch (e) {} }
    }
    if (bc) bc.onmessage = ev => {
        if (ev.data && ev.data.type) listeners.forEach(fn => { try { fn(ev.data.type, ev.data.data); } catch (e) {} });
    };
    window.rmLive = { on: fn => listeners.push(fn), emit, LIVE };

    /* ---------- Optional Firebase wiring ---------- */
    let fbDb = null;
    function initFirebase() {
        if (!LIVE.firebase || fbDb) return;
        const s1 = document.createElement('script');
        s1.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
        s1.onload = () => {
            const s2 = document.createElement('script');
            s2.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js';
            s2.onload = () => {
                firebase.initializeApp(LIVE.firebase);
                fbDb = firebase.database();
                /* Chat stream */
                fbDb.ref('chat').limitToLast(120).on('child_added', snap => {
                    const m = snap.val();
                    if (m && !m._local) renderChatMessage(m, false);
                });
                /* Wishes stream */
                fbDb.ref('wishes').limitToLast(200).on('value', snap => {
                    const val = snap.val();
                    if (Array.isArray(val)) {
                        try { localStorage.setItem('robert_birthday_wishes', JSON.stringify(val)); } catch (e) {}
                        if (typeof renderWishes === 'function') renderWishes();
                    }
                });
                const badge = document.getElementById('liveStatusDot');
                if (badge) badge.classList.add('global');
            };
            document.head.appendChild(s2);
        };
        document.head.appendChild(s1);
    }

    /* ---------- CHAT PAGE ---------- */
    const CHAT_KEY = 'robert_birthday_chat';
    function getChat() {
        try { return JSON.parse(localStorage.getItem(CHAT_KEY)) || []; } catch (e) { return []; }
    }
    function saveChat(m) {
        try { const c = getChat(); c.push(m); while (c.length > 150) c.shift(); localStorage.setItem(CHAT_KEY, JSON.stringify(c)); } catch (e) {}
    }

    function esc(s) {
        const d = document.createElement('div');
        d.textContent = String(s == null ? '' : s);
        return d.innerHTML;
    }

    function fmtTime(ts) {
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function myName() {
        try { return sessionStorage.getItem('rm_chat_name') || ''; } catch (e) { return ''; }
    }

    function renderChatMessage(m, mine) {
        const list = document.getElementById('chatMessages');
        if (!list) return;
        const name = myName() || '';
        const isMine = mine || (name && m.name === name);
        const el = document.createElement('div');
        el.className = 'chat-msg' + (isMine ? ' mine' : '');
        el.innerHTML =
            '<div class="chat-msg-head">' + esc(m.name) +
            '<span class="chat-msg-time">' + fmtTime(m.time) + '</span></div>' +
            '<div class="chat-msg-text">' + esc(m.text) + '</div>';
        list.appendChild(el);
        while (list.children.length > 120) list.removeChild(list.firstChild);
        requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
    }

    function initChatPage() {
        const form = document.getElementById('chatForm');
        if (!form) return;
        initFirebase();

        const nameInput = document.getElementById('chatName');
        const textInput = document.getElementById('chatText');
        const list = document.getElementById('chatMessages');

        /* Restore saved name */
        nameInput.value = myName();

        /* Load history */
        getChat().forEach(m => renderChatMessage(m, false));

        /* Receive live */
        window.rmLive.on((type, data) => {
            if (type === 'chat') renderChatMessage(data, false);
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            const name = (nameInput.value.trim() || 'Anonymous Friend').slice(0, 30);
            const text = textInput.value.trim().slice(0, 300);
            if (!text) return;
            try { sessionStorage.setItem('rm_chat_name', name); } catch (err) {}
            const m = { name, text, time: Date.now() };
            saveChat(m);
            renderChatMessage(m, true);
            window.rmLive.emit('chat', m);
            if (fbDb) { try { fbDb.ref('chat').push(m); } catch (err) {} }
            textInput.value = '';
            textInput.focus();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatPage);
    } else {
        initChatPage();
    }
})();