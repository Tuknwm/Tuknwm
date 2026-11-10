if (window.innerWidth < 1024) { location.replace('/mobile.html'); }
window.addEventListener('resize', () => { if (window.innerWidth < 1024) location.replace('/mobile.html'); });
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);

(function initLoading() {
  if (sessionStorage.getItem('hasVisited')) { document.getElementById('loading-page').remove(); return; }
  const overlay = document.getElementById('loading-page');
  const svg = document.getElementById('loading-svg');
  const latin = document.getElementById('kurokyu-stroke');
  const curvePath = document.getElementById('curvePath');
  const emojiEl = document.getElementById('emoji-exit');
  const dateEl = document.getElementById('loading-date');
  const timeEl = document.getElementById('loading-time');

  const updateClock = () => {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  updateClock();
  const clockId = setInterval(updateClock, 1000);

  const scrollY = window.scrollY;
  const prevBodyOverflow = document.body.style.overflow;
  const prevBodyPosition = document.body.style.position;
  const prevBodyTop      = document.body.style.top;
  const prevBodyWidth    = document.body.style.width;
  const prevHtmlOverflow = document.documentElement.style.overflow;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top      = `-${scrollY}px`;
  document.body.style.width    = '100%';
  document.documentElement.style.overflow = 'hidden';
  const preventScroll = e => e.preventDefault();
  const preventKeys = e => { if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End','Space'].includes(e.code)) e.preventDefault(); };
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('keydown', preventKeys);

  const length = ((latin.getComputedTextLength?.() ?? 600) * 2);
  const tl = gsap.timeline({ onComplete: () => {
    clearInterval(clockId);
    document.body.style.overflow = prevBodyOverflow;
    document.body.style.position = prevBodyPosition;
    document.body.style.top      = prevBodyTop;
    document.body.style.width    = prevBodyWidth;
    document.documentElement.style.overflow = prevHtmlOverflow;
    window.scrollTo(0, scrollY);
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('keydown', preventKeys);
    sessionStorage.setItem('hasVisited', '1');
    overlay.remove();
  }});

  gsap.set('#text-group', { scale: 2, opacity: 0 });
  gsap.set(latin, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });

  tl.to('#text-group', { scale: 1, opacity: 1, duration: 1.5, ease: 'expo.out' });
  tl.fromTo('.text-path', { strokeDasharray: 450, strokeDashoffset: 450 }, { strokeDashoffset: 0, duration: 1.5, stagger: 0.1, ease: 'power2.inOut' }, '-=0.5');

  const flicker = (el, delay) => gsap.timeline({ delay }).to(el, { opacity: 0.7, duration: 0.05 }).to(el, { opacity: 0.1, duration: 0.04 }).to(el, { opacity: 1, duration: 0.1, filter: 'drop-shadow(0 0 25px #fff)' });
  tl.addLabel('neon');
  overlay.querySelectorAll('.left-side .char-fill').forEach((el, i) => tl.add(flicker(el, i * 0.1), 'neon'));
  Array.from(overlay.querySelectorAll('.right-side .char-fill')).reverse().forEach((el, i) => tl.add(flicker(el, i * 0.1), 'neon'));

  tl.addLabel('latin', '-=0.3');
  tl.to(latin, { opacity: 1, duration: 0.1 }, 'latin');
  tl.to(latin, { strokeDashoffset: 0, duration: 2.5, ease: 'power3.inOut' }, 'latin');
  tl.to(latin, { opacity: 0.45, duration: 1.5 }, '-=0.5');
  tl.to(emojiEl, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out' }, '+=0.5');
  tl.addLabel('exit', '+=1.5');
  tl.to('.loading-footer, #emoji-exit, .loader-container', { opacity: 0, y: -20, duration: 0.5, stagger: 0.05 }, 'exit');
  tl.to(curvePath, { attr: { d: 'M 0,0 L 1,0 L 1,0 Q 0.5,-0.2 0,0 Z' }, duration: 1.5, ease: 'expo.inOut' }, 'exit');
})();

(function initTerminal() {
  if (document.getElementById('loading-page')) {
    const waitForLoading = new MutationObserver((_, observer) => {
      if (!document.getElementById('loading-page')) {
        observer.disconnect();
        initTerminal();
      }
    });
    waitForLoading.observe(document.body, { childList: true, subtree: true });
    return;
  }
  const lines = [
    { id: 'term-line-1', text: '> INITIALIZING SYSTEM...', delay: 100, cls: '' },
    { id: 'term-line-2', text: '> ESTABLISHING CONNECTION...', delay: 450, cls: '' },
    { id: 'term-line-3', text: '[ SUCCESS ] — PORT ACTIVE', delay: 800, cls: 'success' },
    { id: 'term-line-4', text: 'NEKO.OS', delay: 1100, cls: 'title-reveal' },
  ];
  const introAlreadySeen = sessionStorage.getItem('homeIntroSeen') === '1';
  if (introAlreadySeen) {
    lines.forEach(({ id, text, cls }) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = text;
      el.classList.add('done');
      if (cls) el.classList.add(cls);
    });
    document.querySelector('.intro-content')?.classList.add('revealed', 'intro-static');
    document.getElementById('story-container')?.classList.add('bg-revealed', 'intro-static');
    return;
  }
  function typeText(el, text, cb) {
    el.classList.add('typing');
    let i = 0;
    const interval = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i === text.length) {
        clearInterval(interval);
        el.classList.remove('typing');
        el.classList.add('done');
        if (cb) cb();
      }
    }, 12);
  }
  function runLine(index) {
    if (index >= lines.length) return;
    const { id, text, delay, cls } = lines[index];
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (cls) el.classList.add(cls);
      typeText(el, text, () => {
        if (id === 'term-line-4') {
          sessionStorage.setItem('homeIntroSeen', '1');
          document.querySelector('.intro-content')?.classList.add('revealed');
          setTimeout(() => {
            document.getElementById('story-container')?.classList.add('bg-revealed');
          }, 560);
        }
        runLine(index + 1);
      });
    }, delay);
  }
  runLine(0);
})();

const PROJECTS = [
  {
    title: 'ALTAR Powered by UNTAR',
    tag: 'PROJECT_01 // Dashboard Website',
    media: [
      { type: 'img', src: '/ProjectList/P1/Img1.png' },
      { type: 'img', src: '/ProjectList/P1/Img2.png' },
      { type: 'img', src: '/ProjectList/P1/Img3.png' },
      { type: 'img', src: '/ProjectList/P1/Img4.png' },
      { type: 'video', src: '/ProjectList/P1/Vid.mp4' },
    ],
    desc: 'ALTAR (Assistant Lecturer Tarumanagara) is a web-based application and PWA designed to streamline the workflows of assistant lecturers and coordinators. Assistant lecturers can easily check in and check out by scanning a class-specific QR code directly through their mobile browsers. For administrators (coordinators), the application offers management tools to organize schedules, validate attendance, monitor teaching history in real-time, and export attendance data into Excel files for administrative purposes.',
    github: 'https://github.com/Tuknwm/tuknwm-AltarProject',
    live: 'https://tuknwm-altar.vercel.app/',
    scrollTarget: 0.48,
  },
  {
    title: 'Kuroyu',
    tag: 'PROJECT_02 // E-commerce Shop',
    media: [
      { type: 'img', src: '/ProjectList/P2/Img1.png' },
      { type: 'img', src: '/ProjectList/P2/Img2.png' },
      { type: 'img', src: '/ProjectList/P2/Img3.png' },
      { type: 'img', src: '/ProjectList/P2/Img4.png' },
      { type: 'img', src: '/ProjectList/P2/Img5.png' },
      { type: 'img', src: '/ProjectList/P2/Img6.png' },
      { type: 'img', src: '/ProjectList/P2/Img7.png' },
    ],
    desc: 'Kuroyu is an online store for a streetwear brand where you discover clothing, footwear, and accessories built around a dark, minimalist japan aesthetic.',
    github: 'https://github.com/Tuknwm/tuknwm-KuroyuProject',
    live: 'https://kuroyuproject.vercel.app/',
    scrollTarget: 0.60,
  },
  {
    title: 'URL Downloader Project',
    tag: 'PROJECT_03 // Downloader Website',
    media: [
      { type: 'img', src: '/ProjectList/P3/Img1.png' },
      { type: 'img', src: '/ProjectList/P3/Img2.png' },
      { type: 'img', src: '/ProjectList/P3/Img3.png' },
    ],
    desc: 'Just a simple URL downloader project that allows users to download files from the social media by providing a valid URL. The project is built using HTML, CSS, and JavaScript. and this was personal use.',
    github: 'https://github.com/Tuknwm/tuknwm-URLDownloaderProject',
    live: 'https://tuknwm-urldownloader.vercel.app/',
    scrollTarget: 0.68,
  },
    {
    title: 'iClick Project',
    tag: 'PROJECT_04 // Interactive Clicker Game',
    media: [
      { type: 'img', src: '/ProjectList/P4/Img1.png' },
      { type: 'img', src: '/ProjectList/P4/Img2.png' },
      { type: 'img', src: '/ProjectList/P4/Img3.png' },
      { type: 'img', src: '/ProjectList/P4/Img4.png' },
    ],
    desc: 'iClick is a simple click speed test game. This is dummy and has been redesigned. The objective of the game is to click as many times as possible within a given time limit. The game keeps track of the number of clicks and displays the final score at the end of the game. also this is my first ever project that I made.',
    github: 'https://github.com/Tuknwm/tuknwm-iClickProject',
    live: 'https://tuknwm-iclick.vercel.app/',
    scrollTarget: 0.68,
  },
      {
    title: 'TrilifePlus',
    tag: 'PROJECT_05 // simulations',
    media: [
      { type: 'img', src: '/ProjectList/P5/Img1.png' },
      { type: 'img', src: '/ProjectList/P5/Img2.png' },
      { type: 'img', src: '/ProjectList/P5/Img3.png' },
      { type: 'img', src: '/ProjectList/P5/Img4.png' },
    ],
    desc: 'TrilifePlus is a dummy digital insurance platform for exploring life, health, and car insurance simulations. Users can calculate estimated premiums, review policy details, continue to checkout, and view completed transactions in their purchase history.',
    github: 'https://github.com/Tuknwm/tuknwm-TrilifePlusProject',
    live: 'https://tuknwm-trilifeplus.vercel.app/',
    scrollTarget: 0.68,
  },
  {
    title: 'ChillTea',
    tag: 'PROJECT_06 // Story Brand',
    media: [
      { type: 'img', src: '/ProjectList/P6/Img1.png' },
      { type: 'img', src: '/ProjectList/P6/Img2.png' },
      { type: 'img', src: '/ProjectList/P6/Img3.png' },
      { type: 'img', src: '/ProjectList/P6/Img4.png' },
      { type: 'img', src: '/ProjectList/P6/Img5.png' },
    ],
    desc: 'Chill Tea is a tea-based beverage brand that offers a flavor experience unlike your typical tea drinks. Crafted with premium ingredients and a consistent taste, every cup is designed to accompany your relaxing moments—whenever and wherever you are.',
    github: 'https://github.com/Tuknwm/tuknwm-ChillTeaProject',
    live: 'https://tuknwm-chilltea.vercel.app/',
    scrollTarget: 0.68,
  },
  {
    title: 'Trainity',
    tag: 'PROJECT_07 // Learning Platform',
    media: [
      { type: 'img', src: '/ProjectList/P7/Img1.png' },
      { type: 'img', src: '/ProjectList/P7/Img2.png' },
      { type: 'img', src: '/ProjectList/P7/Img3.png' },
      { type: 'img', src: '/ProjectList/P7/Img4.png' },
      { type: 'img', src: '/ProjectList/P7/Img5.png' },
      { type: 'img', src: '/ProjectList/P7/Img6.png' },
    ],
    desc: 'Trainity is a free, web-based coding learning platform that offers high-quality programming courses, covering everything from Python and JavaScript to React. This is a demo/dummy project.',
    github: 'https://github.com/Tuknwm/tuknwm-TrainityProject',
    live: 'https://tuknwm-trainity.vercel.app',
    scrollTarget: 0.68,
  },
    {
    title: 'Learra',
    tag: 'PROJECT_08 // insurance app',
    media: [
      { type: 'img', src: '/ProjectList/P8/Img1.png' },
      { type: 'img', src: '/ProjectList/P8/Img2.png' },
      { type: 'img', src: '/ProjectList/P8/Img3.png' },
    ],
    desc: 'Learra is a Flutter-based mobile application that allows users to purchase insurance, check policies, make payments, and file claims quickly and easily.',
    note: 'Note: Because this is a conversion from Flutter/Dart, the appearance and behavior may differ slightly from the original app. Some features use dummy data as the backend is not connected. -This Project was teamed so kinda messy the design-',
    github: 'https://github.com/Tuknwm/tuknwm-LearraProject',
    live: 'https://tuknwm-learra.vercel.app',
    scrollTarget: 0.68,
  },
    {
    title: 'Monotaro.id',
    tag: 'PROJECT_09 // Learning Platform',
    media: [
      { type: 'img', src: '/ProjectList/P9/Img1.png' },
      { type: 'img', src: '/ProjectList/P9/Img2.png' },
      { type: 'img', src: '/ProjectList/P9/Img3.png' },
      { type: 'img', src: '/ProjectList/P9/Img4.png' },
      { type: 'img', src: '/ProjectList/P9/Img5.png' },
      { type: 'img', src: '/ProjectList/P9/Img6.png' },
    ],
    desc: 'Trainity is a free, web-based coding learning platform that offers high-quality programming courses, covering everything from Python and JavaScript to React. This is a demo/dummy project.',
    github: 'https://github.com/Tuknwm/tuknwm-MonotaroProject',
    live: 'https://tuknwm-monotaro-mobile.vercel.app/',
    live2: 'https://tuknwm-monotaro-dashboard.vercel.app',
    scrollTarget: 0.68,
  },
];
const TOTAL_SLOTS = 10;

(function renderProjects() {
  const grid = document.querySelector('.paper-grid');
  const modalList = document.querySelector('.modal-projects-list');
  if (!grid || !modalList) return;
  const countEl = document.querySelector('.paper-count');
  if (countEl) countEl.textContent = `${String(PROJECTS.length).padStart(2, '0')} ENTRIES`;

  PROJECTS.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const thumb = p.media && p.media[0] ? p.media[0].src : '';
    const mediaJson = JSON.stringify(p.media || []).replace(/"/g, '&quot;');
    grid.insertAdjacentHTML('beforeend', `
      <div class="paper-project-item"
        data-title="${p.title}" data-tag="${p.tag}" data-media="${mediaJson}"
        data-desc="${p.desc}" data-note="${p.note || ''}" data-github="${p.github}" data-live="${p.live}" data-live2="${p.live2 || ''}">
        <div class="paper-preview">${thumb ? `<img src="${thumb}" alt="${p.title} Preview" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'paper-preview-404\\'>⚠ 404<span>Connection Lost</span></div>'">` : '<div class="paper-preview-404">⚠ 404<span>Connection Lost</span></div>'}</div>
        <div class="paper-meta">
          <span class="paper-tag">${p.tag}</span>
          <h3>${p.title}</h3>
          <div class="paper-links">
            <a href="${p.github}" target="_blank">GitHub &#8599;</a>
            <a href="${p.live}" target="_blank" class="card-to-website">To Website &#8599;</a>
          </div>
        </div>
      </div>`);

    modalList.insertAdjacentHTML('beforeend', `
      <div class="modal-project-item" data-target="${p.scrollTarget}">
        <div class="item-left">
          <div class="item-header">
            <span class="item-num">${num} //</span>
            <span class="item-name">${p.title}</span>
            <button class="item-action-btn">TELEPORT TO PROJECT ↗</button>
          </div>
          <div class="item-body-row">
            <div class="item-img-wrap">${thumb ? `<img src="${thumb}" class="item-preview-img" alt="${p.title} Preview" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'paper-preview-404 archive-404\\'><span class=\\'text-404\\'>⚠ 404</span><span>Connection Lost</span></div>'">` : '<div class="paper-preview-404 archive-404"><span class="text-404">⚠ 404</span><span>Connection Lost</span></div>'}</div>
            <div class="item-text">
              <p>${p.desc.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      </div>`);
  });

  for (let i = PROJECTS.length; i < TOTAL_SLOTS; i++) {
    const num = String(i + 1).padStart(2, '0');
    grid.insertAdjacentHTML('beforeend', `
      <div class="paper-project-item paper-project-empty">
        <div class="paper-preview paper-preview-empty"></div>
        <div class="paper-meta">
          <span class="paper-tag">PROJECT_${String(i + 1).padStart(2, '0')} // —</span>
          <h3>[ COMING SOON ]</h3>
        </div>
      </div>`);
    modalList.insertAdjacentHTML('beforeend', `<div class="modal-project-empty">□ ${num} // [ COMING SOON ]</div>`);
  }
})();
const paperSound = new Audio('/Assets/SoundFX/FXPaper.mp3');
const letterSound = new Audio('/Assets/SoundFX/surat.mp3');
const paperCloseSound = new Audio('/Assets/SoundFX/paperclose.mp3');
const cardFlipSound = new Audio('/Assets/SoundFX/cardflip.mp3');
const clickSound = new Audio('/Assets/SoundFX/click.mp3');
const catSound = new Audio('/Assets/SoundFX/cat.mp3');
const categ2Sound = new Audio('/Assets/SoundFX/categ2.mp3');
const categSound = new Audio('/Assets/SoundFX/categ.mp3');
const cathissingSound = new Audio('/Assets/SoundFX/cathissing.mp3');
let lastSoundTime = 0;
let isProgrammaticScroll = false;
let scrollIdleTimeout = null;
let stopHomeIdleAnimation = () => {};
let stopIdleAnimation = () => {};
let checkAndStartIdleAnimations = () => {};
let halideTilt = { multiplier: 1.0 };
let updateHalideRotation = () => {};
const bgMusic = new Audio('/Assets/SoundFX/bgmusic.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.35; 
let isAudioEnabled = localStorage.getItem('audio_enabled') === 'true';
const savedTime = parseFloat(localStorage.getItem('bgMusic_time') || '0');
if (savedTime > 0) {
  bgMusic.currentTime = savedTime;
}
bgMusic.addEventListener('timeupdate', () => {
  if (isAudioEnabled) {
    localStorage.setItem('bgMusic_time', bgMusic.currentTime);
  }
});
const hoverSounds = [
  new Audio('/Assets/SoundFX/ui1.mp3'),
  new Audio('/Assets/SoundFX/ui2.mp3'),
  new Audio('/Assets/SoundFX/ui3.mp3')
];
let currentHoverSoundIndex = 0;
function playHoverSound() {
  if (!isAudioEnabled) return;
  const sound = hoverSounds[currentHoverSoundIndex];
  sound.currentTime = 0;
  sound.play().catch(err => console.log("Audio autoplay blocked by browser:", err));
  currentHoverSoundIndex = (currentHoverSoundIndex + 1) % hoverSounds.length;
}
function playSwipeSound() {
  if (!isAudioEnabled) return;
  const now = Date.now();
  if (now - lastSoundTime > 300) { 
    paperSound.currentTime = 0;
    paperSound.play().catch(err => console.log("Audio autoplay blocked by browser:", err));
    lastSoundTime = now;
  }
}
function playLetterSound() {
  if (!isAudioEnabled) return;
  const now = Date.now();
  if (now - lastSoundTime > 300) { 
    letterSound.currentTime = 0;
    letterSound.play().catch(err => console.log("Audio autoplay blocked by browser:", err));
    lastSoundTime = now;
  }
}
function playCardFlipSound() {
  if (!isAudioEnabled) return;
  cardFlipSound.currentTime = 0;
  cardFlipSound.play().catch(err => console.log("Audio autoplay blocked by browser:", err));
}
function playClickSound() {
  if (!isAudioEnabled) return;
  clickSound.currentTime = 0;
  clickSound.play().catch(err => console.log("Audio autoplay blocked by browser:", err));
}
function playCatSound() {
  if (!isAudioEnabled) return;
  catSound.currentTime = 0;
  catSound.play().catch(err => console.log("Audio autoplay blocked by browser:", err));
}
document.addEventListener('click', (e) => {
  if (e.target.closest('button')) {
    playClickSound();
  }
});
let audioCtx = null;
let analyser = null;
let source = null;
let dataArray = null;
let visualizerBars = [];
let visualizerScale = { value: 1 };
const audioVisualizer = document.getElementById('audio-visualizer');
function initAudioVisualizer() {
  if (audioCtx) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    source = audioCtx.createMediaElementSource(bgMusic);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    visualizerBars = document.querySelectorAll('.visualizer-bar');
    gsap.killTweensOf(visualizerBars);
  } catch (err) {
    console.warn("AudioContext initialization failed:", err);
  }
}
function animateVisualizer() {
  if (!analyser || !isAudioEnabled) {
    visualizerBars.forEach(bar => {
      bar.style.transform = 'scaleY(1)';
    });
    return;
  }
  analyser.getByteFrequencyData(dataArray);
  const barCount = visualizerBars.length;
  for (let i = 0; i < barCount; i++) {
    const dataIndex = Math.floor((i / barCount) * 6);
    const val = dataArray[dataIndex] || 0;
    const scale = 1 + (val / 255) * 5.5 * visualizerScale.value;
    if (visualizerBars[i]) {
      visualizerBars[i].style.transform = `scaleY(${scale})`;
    }
  }
  if (isAudioEnabled && !bgMusic.paused) {
    requestAnimationFrame(animateVisualizer);
  } else {
    visualizerBars.forEach(bar => {
      bar.style.transform = 'scaleY(1)';
    });
  }
}
const soundOnIcon = `<svg viewBox="0 0 16 16" width="14" height="14" style="image-rendering: pixelated; shape-rendering: crispEdges;"><rect x="2" y="6" width="3" height="4" fill="currentColor" /><rect x="5" y="4" width="2" height="8" fill="currentColor" /><rect x="7" y="2" width="2" height="12" fill="currentColor" /><rect x="11" y="6" width="1" height="4" fill="currentColor" /><rect x="10" y="5" width="1" height="1" fill="currentColor" /><rect x="10" y="10" width="1" height="1" fill="currentColor" /><rect x="13" y="4" width="1" height="8" fill="currentColor" /><rect x="12" y="3" width="1" height="1" fill="currentColor" /><rect x="12" y="12" width="1" height="1" fill="currentColor" /></svg>`;
const soundOffIcon = `<svg viewBox="0 0 16 16" width="14" height="14" style="image-rendering: pixelated; shape-rendering: crispEdges;"><rect x="2" y="6" width="3" height="4" fill="currentColor" /><rect x="5" y="4" width="2" height="8" fill="currentColor" /><rect x="7" y="2" width="2" height="12" fill="currentColor" /><rect x="11" y="5" width="1" height="1" fill="currentColor" /><rect x="15" y="5" width="1" height="1" fill="currentColor" /><rect x="12" y="6" width="1" height="1" fill="currentColor" /><rect x="14" y="6" width="1" height="1" fill="currentColor" /><rect x="13" y="7" width="1" height="2" fill="currentColor" /><rect x="12" y="9" width="1" height="1" fill="currentColor" /><rect x="14" y="9" width="1" height="1" fill="currentColor" /><rect x="11" y="10" width="1" height="1" fill="currentColor" /><rect x="15" y="10" width="1" height="1" fill="currentColor" /></svg>`;
const audioToggle = document.getElementById('audio-toggle');
if (audioToggle && isAudioEnabled) {
  audioToggle.classList.add('active');
  audioToggle.querySelector('.toggle-icon').innerHTML = soundOnIcon;
  audioToggle.querySelector('.toggle-text').textContent = 'SOUND: ON';
  if (audioVisualizer) audioVisualizer.classList.add('active');
  bgMusic.play()
    .then(() => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      } else {
        initAudioVisualizer();
      }
      visualizerScale.value = 0;
      gsap.killTweensOf(visualizerBars);
      gsap.killTweensOf(visualizerScale);
      gsap.to(visualizerScale, {
        value: 1,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      });
      animateVisualizer();
    })
    .catch(err => console.log("Audio autoplay blocked by browser on load:", err));
}
if (audioToggle) {
  audioToggle.addEventListener('click', () => {
    isAudioEnabled = !isAudioEnabled;
    localStorage.setItem('audio_enabled', isAudioEnabled ? 'true' : 'false');
    if (isAudioEnabled) {
      audioToggle.classList.add('active');
      audioToggle.querySelector('.toggle-icon').innerHTML = soundOnIcon;
      audioToggle.querySelector('.toggle-text').textContent = 'SOUND: ON';
      if (audioVisualizer) audioVisualizer.classList.add('active');
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      } else {
        initAudioVisualizer();
      }
      visualizerScale.value = 0;
      gsap.killTweensOf(visualizerBars);
      gsap.killTweensOf(visualizerScale);
      gsap.to(visualizerScale, {
        value: 1,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      });
      bgMusic.play()
        .then(() => {
          animateVisualizer();
        })
        .catch(err => console.log("Audio play blocked by browser:", err));
    } else {
      audioToggle.classList.remove('active');
      audioToggle.querySelector('.toggle-icon').innerHTML = soundOffIcon;
      audioToggle.querySelector('.toggle-text').textContent = 'SOUND: OFF';
      bgMusic.pause();
      gsap.to(visualizerBars, {
        scaleY: 1,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          if (!isAudioEnabled && audioVisualizer) {
            audioVisualizer.classList.remove('active');
          }
        }
      });
    }
  });
}
const startPlay = () => {
  if (isAudioEnabled) {
    if (audioVisualizer) audioVisualizer.classList.add('active');
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    } else {
      initAudioVisualizer();
    }
    visualizerScale.value = 0;
    gsap.killTweensOf(visualizerBars);
    gsap.killTweensOf(visualizerScale);
    gsap.to(visualizerScale, {
      value: 1,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto"
    });
    bgMusic.play()
      .then(() => {
        animateVisualizer();
      })
      .catch(err => {});
  }
  window.removeEventListener('click', startPlay);
  window.removeEventListener('keydown', startPlay);
};
window.addEventListener('click', startPlay);
window.addEventListener('keydown', startPlay);
const resetProgrammaticScroll = () => {
  isProgrammaticScroll = false;
};
window.addEventListener('wheel', resetProgrammaticScroll, { passive: true });
window.addEventListener('touchmove', resetProgrammaticScroll, { passive: true });
window.addEventListener('mousedown', resetProgrammaticScroll, { passive: true });
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});
let scrollTimeout;
const detailPaper = document.getElementById('project-detail-paper');
let detailPaperOpenedAt = 0;
lenis.on('scroll', (e) => {
  ScrollTrigger.update();
  if (detailPaper && detailPaper.classList.contains('open') && Date.now() - detailPaperOpenedAt > 500) {
    detailPaper.classList.remove('open');
  }
  document.body.classList.add('is-scrolling');
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    document.body.classList.remove('is-scrolling');
  }, 400);
});
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const spriteSets = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  scratchWallN: [
    [0, 0],
    [0, -1],
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2],
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3],
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
};
const cursor = document.querySelector('.custom-cursor');
const cursorCat = cursor ? cursor.querySelector('.cursor-cat') : null;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
const mouseHistory = [];
const delayFrames = 20; 
const maxSpeed = 3.5; 
let catState = 'sleeping'; 
let lastMovementTime = Date.now();
let lastStateChangeTime = Date.now();
let lastFrameChangeTime = Date.now();
let activeFrameIndex = 0;
let lastDirection = 'E';
let lastMouseX = 0;
let lastMouseY = 0;
let mouseHasMoved = false;
const customPointer = document.querySelector('.custom-pointer');
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (customPointer) {
    customPointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }
  if (mouseX !== lastMouseX || mouseY !== lastMouseY) {
    mouseHasMoved = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
});
function getDirection(dx, dy) {
  const angle = Math.atan2(dy, dx);
  let degrees = (angle * 180) / Math.PI;
  if (degrees < 0) {
    degrees += 360;
  }
  const index = Math.floor(((degrees + 22.5) % 360) / 45);
  const directions = ["E", "SE", "S", "SW", "W", "NW", "N", "NE"];
  return directions[index];
}
function animateCursor() {
  mouseHistory.push({ x: mouseX, y: mouseY });
  let targetX = cursorX;
  let targetY = cursorY;
  if (mouseHistory.length > delayFrames) {
    const oldestCoordinate = mouseHistory.shift();
    targetX = oldestCoordinate.x;
    targetY = oldestCoordinate.y;
  } else if (mouseHistory.length > 0) {
    targetX = mouseHistory[0].x;
    targetY = mouseHistory[0].y;
  }
  const dx = targetX - cursorX;
  const dy = targetY - cursorY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  let isCurrentlyChasing = false;
  if (distance > 1.5) {
    isCurrentlyChasing = true;
    const step = Math.min(distance * 0.06, maxSpeed);
    cursorX += (dx / distance) * step;
    cursorY += (dy / distance) * step;
    lastDirection = getDirection(dx, dy);
  } else {
    cursorX = targetX;
    cursorY = targetY;
  }
  if (cursor) {
    cursor.style.left = `${cursorX + 28}px`;
    cursor.style.top = `${cursorY + 28}px`;
  }
  const now = Date.now();
  if (catState === 'sleeping' || catState === 'idle') {
    if (mouseHasMoved) {
      catState = 'alert';
      lastStateChangeTime = now;
      activeFrameIndex = 0;
      mouseHasMoved = false;
    }
  }
  if (catState === 'alert') {
    if (isCurrentlyChasing) {
      catState = 'moving';
      activeFrameIndex = 0;
    } else if (now - lastStateChangeTime > 500) {
      catState = 'idle';
      lastMovementTime = now;
      activeFrameIndex = 0;
    }
  } else if (catState === 'moving') {
    if (!isCurrentlyChasing) {
      catState = 'idle';
      lastMovementTime = now;
      activeFrameIndex = 0;
    }
  } else if (catState === 'idle') {
    if (isCurrentlyChasing) {
      catState = 'moving';
      activeFrameIndex = 0;
    } else if (now - lastMovementTime > 1000) {
      catState = 'sleeping';
      activeFrameIndex = 0;
    }
  }
  if (cursor) {
    if (catState === 'sleeping') {
      cursor.classList.add('sleeping');
      cursor.classList.remove('moving');
    } else if (catState === 'moving') {
      cursor.classList.add('moving');
      cursor.classList.remove('sleeping');
    } else {
      cursor.classList.remove('sleeping', 'moving');
    }
  }
  let frames = [];
  if (catState === 'moving') {
    frames = spriteSets[lastDirection] || spriteSets['E'];
  } else if (catState === 'sleeping') {
    frames = spriteSets['sleeping'];
  } else if (catState === 'alert') {
    frames = spriteSets['alert'];
  } else {
    frames = spriteSets['idle'];
  }
  const frameInterval = 150; 
  if (now - lastFrameChangeTime > frameInterval) {
    activeFrameIndex = (activeFrameIndex + 1) % frames.length;
    lastFrameChangeTime = now;
  }
  const currentSprite = frames[activeFrameIndex] || frames[0] || [-3, -3];
  if (cursorCat) {
    cursorCat.style.backgroundPosition = `${currentSprite[0] * 32}px ${currentSprite[1] * 32}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();
let lastHoveredElement = null;
const interactiveSelector = 'a, button, .cta-btn, .btn-outlined, .custom-scrollbar-thumb, .custom-scrollbar-track, .about-interactive-card, .void-skill-icon-card, .modal-project-item, .easter-neko, .mini-categ-img, .modal-categ-img, .paper-project-item:not(.paper-project-empty)';
document.body.addEventListener('mouseover', (e) => {
  const interactiveEl = e.target.closest(interactiveSelector);
  if (interactiveEl) {
    if (customPointer) customPointer.classList.add('hovering');
    if (interactiveEl !== lastHoveredElement) {
      lastHoveredElement = interactiveEl;
      playHoverSound();
    }
    gsap.to(cursor, { scale: 1.5, duration: 0.2 });
  }
});
document.body.addEventListener('mouseout', (e) => {
  const interactiveEl = e.target.closest(interactiveSelector);
  if (interactiveEl && (!e.relatedTarget || !interactiveEl.contains(e.relatedTarget))) {
    if (customPointer) customPointer.classList.remove('hovering');
    lastHoveredElement = null;
    gsap.to(cursor, { scale: 1, duration: 0.2 });
  }
});
const canvas = document.getElementById('parallax-canvas');
const ctx = canvas.getContext('2d');
const catCanvas = document.getElementById('cat-parallax-canvas');
const catCtx = catCanvas ? catCanvas.getContext('2d') : null;
const loadingBadge = document.getElementById('loading-badge');
if (canvas) {
  const frameCount = 300;
  const images = [];
  const imageSequence = { frame: 0 };
  const catFrameCount = 299;
  const catImages = [];
  const catImageSequence = { frame: 0 };
  const currentFrame = index => (
    `/Parallax/Home-Project-Section/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
  );
  const currentCatFrame = index => (
    `/Parallax/About-Contact-Section/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
  );
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(Math.round(imageSequence.frame));
  };
  const resizeCatCanvas = () => {
    if (!catCanvas) return;
    catCanvas.width = window.innerWidth;
    catCanvas.height = window.innerHeight;
    drawCatFrame(Math.round(catImageSequence.frame));
  };
  const drawFrame = (index) => {
    const img = images[index];
    if (!img) return;
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, drawX, drawY;
    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    }
    if (index >= 250) {
      const t = (index - 250) / 50;
      const scale = 1 + t * 0.20;
      drawWidth *= scale;
      drawHeight *= scale;
      drawX = (canvas.width - drawWidth) / 2 + t * 40;
      drawY = (canvas.height - drawHeight) / 2;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    if (index >= 250) {
      const t = (index - 250) / 50;
      ctx.fillStyle = `rgba(0,0,0,${t * 0.5})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };
  const drawCatFrame = (index) => {
    const img = catImages[index];
    if (!img || !catCanvas || !catCtx) return;
    const canvasRatio = catCanvas.width / catCanvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, drawX, drawY;
    if (canvasRatio > imgRatio) {
      drawWidth = catCanvas.width;
      drawHeight = catCanvas.width / imgRatio;
      drawX = 0;
      drawY = (catCanvas.height - drawHeight) / 2;
    } else {
      drawWidth = catCanvas.height * imgRatio;
      drawHeight = catCanvas.height;
      drawX = (catCanvas.width - drawWidth) / 2;
      drawY = 0;
    }
    catCtx.clearRect(0, 0, catCanvas.width, catCanvas.height);
    catCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  };
  const firstFrame = new Image();
  firstFrame.src = currentFrame(0);
  firstFrame.onload = () => {
    images[0] = firstFrame;
    resizeCanvas();
    drawFrame(0);
    preloadRemainingFrames();
    preloadCatFrames();
  };
  const firstCatFrame = new Image();
  firstCatFrame.src = currentCatFrame(0);
  firstCatFrame.onload = () => {
    catImages[0] = firstCatFrame;
    resizeCatCanvas();
    drawCatFrame(0);
  };
  const preloadRemainingFrames = () => {
    images[0] = firstFrame;
    let loadedCount = 1;
    for (let i = 1; i < frameCount; i++) {
      images[i] = new Image();
      images[i].src = currentFrame(i);
      const onSettle = () => {
        loadedCount++;
        if (loadingBadge) {
          loadingBadge.textContent = `LOADING SYSTEM: ${Math.round((loadedCount / frameCount) * 100)}%`;
        }
        if (loadedCount === frameCount) {
          if (loadingBadge) {
            loadingBadge.textContent = `SYSTEM INITIALIZED`;
          }
          initScrollParallax();
        }
      };
      images[i].onload = onSettle;
      images[i].onerror = onSettle;
    }
  };
  const preloadCatFrames = () => {
    for (let i = 1; i < catFrameCount; i++) {
      catImages[i] = new Image();
      catImages[i].src = currentCatFrame(i);
    }
  };
  let projectBtnUnlocked = false;
  const initScrollParallax = () => {
    const storyTl = gsap.timeline({
      scrollTrigger: {
        id: "story-trigger",
        trigger: "#story-container",
        start: "top top",
        end: "+=1000%", 
        pin: true,
        scrub: 0.6,    
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          drawFrame(Math.round(imageSequence.frame));
          if (catIdleFrame === null) {
            drawCatFrame(Math.round(catImageSequence.frame + catFrameOffset));
          }
          updateActiveNav(self.progress);
          const projectListTrigger = document.getElementById('project-list-trigger');
          if (projectListTrigger && !projectBtnUnlocked) {
            if (self.progress > 0.79) {
              projectBtnUnlocked = true;
              projectListTrigger.style.display = 'flex';
            }
          }
        }
      }
    });
    const letterStatus = document.querySelector('.blink-text');
    const updateActiveNav = (progress) => {
      let activeSection = 'home';
      if (progress > 0.90) {
        activeSection = 'contact';
      } else if (progress > 0.74) {
        activeSection = 'about';
      } else if (progress > 0.45) {
        activeSection = 'project';
      }
      if (letterStatus && progress > 0.45 && letterStatus.textContent !== 'STATUS: READ_') {
        letterStatus.textContent = 'STATUS: READ_';
        letterStatus.classList.remove('blink-text');
        letterStatus.style.color = '#00c853';
      }
      document.querySelectorAll('.nav-link-btn').forEach(el => {
        if (el.dataset.section === activeSection) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
      const navWrapper = document.querySelector('.nav-scroll-wrapper');
      document.documentElement.classList.add('in-dark-void');
      if (activeSection === 'about' || activeSection === 'contact') {
        if (navWrapper) navWrapper.classList.add('on-dark-void');
      } else {
        if (navWrapper) navWrapper.classList.remove('on-dark-void');
      }
    };
    const sectionTargets = {
      home: 0.0,
      project: 0.52,
      about: 0.76,
      contact: 0.94
    };
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        const targetProgress = sectionTargets[section];
        const trigger = ScrollTrigger.getById("story-trigger");
        if (trigger) {
          const scrollStart = trigger.start;
          const scrollEnd = trigger.end;
          const targetScroll = scrollStart + (scrollEnd - scrollStart) * targetProgress;
          isProgrammaticScroll = true;
          stopHomeIdleAnimation();
          stopIdleAnimation();
          lenis.scrollTo(targetScroll, { 
            duration: 1.5,
            onComplete: () => {
              isProgrammaticScroll = false;
              clearTimeout(scrollIdleTimeout);
              scrollIdleTimeout = setTimeout(() => {
                checkAndStartIdleAnimations();
              }, 800);
            }
          });
        }
      });
    });
    storyTl.to(imageSequence, {
      frame: frameCount - 1,
      ease: "none",
      duration: 4.0
    }, 0);
    storyTl.fromTo("#slide-intro",
      { autoAlpha: 1, scale: 1 },
      { autoAlpha: 0, scale: 0.85, ease: "power1.out", duration: 1.0 },
      0.73
    );
    storyTl.set("#slide-intro", { className: "story-slide" }, 1.73);
    storyTl.to(halideTilt, {
      multiplier: 0.0,
      duration: 2.22,
      ease: "power1.inOut",
      onUpdate: () => {
        updateHalideRotation(currentClientX, currentClientY);
      }
    }, 0);
    storyTl.to("#halide-canvas-3d", {
      left: "0%",
      width: "100vw",
      height: "100vh",
      duration: 2.22,
      ease: "power1.inOut"
    }, 0);
    storyTl.to(".halide-contours", {
      opacity: 0,
      duration: 2.0,
      ease: "power1.out"
    }, 0);
    storyTl.set("#slide-letter", { autoAlpha: 1, className: "story-slide active" }, 3.6);
    storyTl.set(".envelope-flap", { rotationX: 0, z: 6, zIndex: 4 }, 3.6);
    storyTl.set(".pixel-wax-seal-wrapper", { autoAlpha: 1 }, 3.6);
    storyTl.set(".doc-top", { rotationX: 180 }, 3.6);
    storyTl.set(".pixel-folded-doc", { y: -160, scale: 0.95, opacity: 1 }, 3.6); 
    storyTl.set(".env-part", { y: "0vh", opacity: 1 }, 3.6);
    storyTl.set(".animation-viewport", { y: "-100vh", rotation: -360, rotationY: 180, rotationX: -45, transformPerspective: 1000 }, 3.6);
    storyTl.fromTo(".animation-viewport", 
      { y: "-100vh", rotation: -360, rotationY: 180, rotationX: -45, transformPerspective: 1000 },
      { y: "0vh", rotation: 0, rotationY: 180, rotationX: 0, ease: "back.out(1.0)", duration: 0.8 },
      3.6
    );
    storyTl.call(playLetterSound, null, 3.6);
    storyTl.to(".animation-viewport", {
      rotationY: 0,
      ease: "power2.inOut",
      duration: 0.4
    }, 4.4);
    storyTl.fromTo(".envelope-flap", 
      { rotationX: 0, z: 6, zIndex: 4 },
      { rotationX: -180, z: -1, zIndex: 1, duration: 0 },
      4.8
    );
    storyTl.set(".pixel-wax-seal-wrapper", { autoAlpha: 0 }, 4.8);
    storyTl.to(".env-part", {
      y: "100vh",
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.4
    }, 5.1);
    storyTl.fromTo(".pixel-folded-doc",
      { y: -160, scale: 0.95 },
      { y: -290, scale: 1, ease: "power2.out", duration: 0.4 },
      5.1
    );
    storyTl.call(playSwipeSound, null, 5.1);
    storyTl.fromTo(".doc-top",
      { rotationX: 180 },
      { rotationX: 360, ease: "power2.inOut", duration: 0.3 },
      5.4
    );
    storyTl.to(".pixel-folded-doc", {
      y: 0,
      ease: "power2.inOut",
      duration: 0.3
    }, 5.4);
    storyTl.to("#slide-letter", {
      x: "-100vw",
      ease: "power2.inOut",
      duration: 0.8
    }, 5.9);
    storyTl.set("#slide-letter", { autoAlpha: 0, className: "story-slide" }, 6.7);
    storyTl.set("#slide-paper", { autoAlpha: 1, className: "story-slide active" }, 6.1);
    storyTl.fromTo("#slide-paper",
      { y: "-100vh", rotation: -3 },
      { y: "0vh", rotation: 0, ease: "elastic.out(1, 0.6)", duration: 1.4 },
      6.1
    );
    storyTl.call(playLetterSound, null, 6.1);
    storyTl.to(".project-paper", {
      scrollTop: () => {
        const el = document.querySelector('.project-paper');
        return el ? el.scrollHeight - el.clientHeight : 0;
      },
      ease: "none",
      duration: 0.2
    }, 7.6);
    storyTl.to("#slide-paper", {
      y: "-100vh",
      ease: "power2.inOut",
      duration: 0.8
    }, 8.1);
    storyTl.set("#slide-paper", { autoAlpha: 0, className: "story-slide" }, 8.9);
    storyTl.fromTo("#dark-void-container",
      { yPercent: 100, y: 160 },
      { yPercent: 0, y: 0, ease: "power2.inOut", duration: 0.8 },
      8.1
    );
    storyTl.call(playSwipeSound, null, 8.1);
    storyTl.fromTo("#cat-parallax-canvas",
      { opacity: 0 },
      { opacity: 0.65, ease: "power2.inOut", duration: 0.4 },
      8.8
    );
    storyTl.to(catImageSequence, {
      frame: catFrameCount - 1,
      ease: "none",
      duration: 3.1
    }, 8.8);
    storyTl.fromTo("#slide-about",
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.5 },
      9.2
    );
    storyTl.set("#slide-about", { className: "void-slide active" }, 9.2);
    storyTl.to("#slide-about", {
      autoAlpha: 0,
      y: -30,
      ease: "power2.in",
      duration: 0.6
    }, 10.7);
    storyTl.set("#slide-about", { className: "void-slide" }, 11.3);
    storyTl.fromTo("#slide-contact",
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.8 },
      11.3
    );
    storyTl.to(".audio-visualizer, .neko-tracker", {
      y: -50,
      ease: "power2.out",
      duration: 0.8
    }, 11.3);
    storyTl.set("#slide-contact", { className: "void-slide active" }, 11.3);
    const scrollTrack = document.querySelector('.custom-scrollbar-track');
    const scrollThumb = document.querySelector('.custom-scrollbar-thumb');
    if (scrollTrack && scrollThumb) {
      const updateScrollbar = () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScroll <= 0) return;
        const scrollPercent = window.scrollY / totalScroll;
        const maxTop = scrollTrack.clientHeight - scrollThumb.clientHeight;
        const thumbTop = scrollPercent * maxTop;
        scrollThumb.style.transform = `translateY(${thumbTop}px)`;
      };
      window.addEventListener('scroll', updateScrollbar);
      setTimeout(updateScrollbar, 200);
      scrollTrack.addEventListener('click', (e) => {
        if (e.target === scrollThumb) return;
        const clickY = e.clientY - scrollTrack.getBoundingClientRect().top;
        const trackHeight = scrollTrack.clientHeight;
        const thumbHeight = scrollThumb.clientHeight;
        let targetPercent = (clickY - thumbHeight / 2) / (trackHeight - thumbHeight);
        targetPercent = Math.max(0, Math.min(1, targetPercent));
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = targetPercent * totalScroll;
        isProgrammaticScroll = true;
        stopHomeIdleAnimation();
        stopIdleAnimation();
        lenis.scrollTo(targetScroll, { 
          duration: 1.2,
          onComplete: () => {
            isProgrammaticScroll = false;
            clearTimeout(scrollIdleTimeout);
            scrollIdleTimeout = setTimeout(() => {
              checkAndStartIdleAnimations();
            }, 800);
          }
        });
      });
      let isDragging = false;
      let startY = 0;
      let startScrollY = 0;
      scrollThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startScrollY = window.scrollY;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
        scrollThumb.style.cursor = 'grabbing';
      });
      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaY = e.clientY - startY;
        const trackHeight = scrollTrack.clientHeight;
        const thumbHeight = scrollThumb.clientHeight;
        const maxTop = trackHeight - thumbHeight;
        if (maxTop <= 0) return;
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pixelToScrollRatio = totalScroll / maxTop;
        const targetScroll = startScrollY + deltaY * pixelToScrollRatio;
        lenis.scrollTo(targetScroll, { immediate: true });
        updateScrollbar();
      });
      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
          scrollThumb.style.cursor = 'grab';
        }
      });
      scrollThumb.addEventListener('touchstart', (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
        startScrollY = window.scrollY;
      }, { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaY = e.touches[0].clientY - startY;
        const trackHeight = scrollTrack.clientHeight;
        const thumbHeight = scrollThumb.clientHeight;
        const maxTop = trackHeight - thumbHeight;
        if (maxTop <= 0) return;
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pixelToScrollRatio = totalScroll / maxTop;
        const targetScroll = startScrollY + deltaY * pixelToScrollRatio;
        lenis.scrollTo(targetScroll, { immediate: true });
        updateScrollbar();
      }, { passive: true });
      window.addEventListener('touchend', () => {
        if (isDragging) {
          isDragging = false;
        }
      });
    }
    let isIdlePlaying = false;
    let idleAnimFrameId = null;
    let idleDirection = 1;
    let lastIdleTime = 0;
    let catIdleFrame = null;
    let catFrameOffset = 0;
    let catOffsetRafId = null;
    const lerpCatOffset = () => {
      catFrameOffset += (0 - catFrameOffset) * 0.08;
      if (Math.abs(catFrameOffset) < 0.5) { catFrameOffset = 0; catOffsetRafId = null; return; }
      catOffsetRafId = requestAnimationFrame(lerpCatOffset);
    };
    const idleFps = 27; 
    const idleFrameDelay = 1000 / idleFps;
    const startIdleAnimation = () => {
      if (isIdlePlaying) return;
      isIdlePlaying = true;
      lastIdleTime = performance.now();
      catIdleFrame = catImageSequence.frame; 
      if (catIdleFrame >= 298) {
        idleDirection = -1;
      } else if (catIdleFrame <= 50) {
        idleDirection = 1;
      }
      tickIdleAnimation(performance.now());
    };
    stopIdleAnimation = () => {
      isIdlePlaying = false;
      if (catIdleFrame !== null) {
        catFrameOffset = catIdleFrame - catImageSequence.frame;
        if (catOffsetRafId) cancelAnimationFrame(catOffsetRafId);
        catOffsetRafId = requestAnimationFrame(lerpCatOffset);
      }
      catIdleFrame = null;
      if (idleAnimFrameId) {
        cancelAnimationFrame(idleAnimFrameId);
        idleAnimFrameId = null;
      }
    };
    const tickIdleAnimation = (now) => {
      if (!isIdlePlaying) return;
      idleAnimFrameId = requestAnimationFrame(tickIdleAnimation);
      const elapsed = now - lastIdleTime;
      if (elapsed >= idleFrameDelay) {
        lastIdleTime = now - (elapsed % idleFrameDelay);
        let nextFrame = catIdleFrame + idleDirection;
        if (nextFrame >= 298) {
          nextFrame = 298;
          idleDirection = -1;
        } else if (nextFrame <= 50) {
          nextFrame = 50;
          idleDirection = 1;
        }
        catIdleFrame = nextFrame;
        drawCatFrame(Math.round(catIdleFrame));
      }
    };
    const syncScrollToFrame = () => {
      const trigger = ScrollTrigger.getById("story-trigger");
      if (trigger) {
        const totalDuration = storyTl.duration();
        const progress = (9.3 / totalDuration) + (catImageSequence.frame / 298) * (3.1 / totalDuration);
        const targetScroll = trigger.start + progress * (trigger.end - trigger.start);
        lenis.scrollTo(targetScroll, { immediate: true });
      }
    };
    let isHomeIdlePlaying = false;
    let homeIdleAnimFrameId = null;
    let lastHomeIdleTime = 0;
    const homeIdleFps = 30;
    const homeIdleFrameDelay = 1000 / homeIdleFps;
    let homeIdleDirection = 1; 
    const startHomeIdleAnimation = () => {
      if (isHomeIdlePlaying) return;
      isHomeIdlePlaying = true;
      lastHomeIdleTime = performance.now();
      if (imageSequence.frame >= 38) {
        homeIdleDirection = -1;
      } else if (imageSequence.frame <= 1) {
        homeIdleDirection = 1;
      }
      tickHomeIdleAnimation(performance.now());
    };
    stopHomeIdleAnimation = () => {
      isHomeIdlePlaying = false;
      if (homeIdleAnimFrameId) {
        cancelAnimationFrame(homeIdleAnimFrameId);
        homeIdleAnimFrameId = null;
      }
    };
    const tickHomeIdleAnimation = (now) => {
      if (!isHomeIdlePlaying) return;
      homeIdleAnimFrameId = requestAnimationFrame(tickHomeIdleAnimation);
      const elapsed = now - lastHomeIdleTime;
      if (elapsed >= homeIdleFrameDelay) {
        lastHomeIdleTime = now - (elapsed % homeIdleFrameDelay);
        let nextFrame = imageSequence.frame + homeIdleDirection;
        if (nextFrame >= 38) {
          nextFrame = 38;
          homeIdleDirection = -1;
        } else if (nextFrame <= 1) {
          nextFrame = 1;
          homeIdleDirection = 1;
        }
        imageSequence.frame = nextFrame;
        drawFrame(Math.round(imageSequence.frame));
      }
    };
    const syncScrollToHomeFrame = () => {
      const trigger = ScrollTrigger.getById("story-trigger");
      if (trigger) {
        const totalDuration = storyTl.duration();
        const progress = (imageSequence.frame / (frameCount - 1)) * (4.0 / totalDuration);
        const targetScroll = trigger.start + progress * (trigger.end - trigger.start);
        lenis.scrollTo(targetScroll, { immediate: true });
      }
    };
    checkAndStartIdleAnimations = () => {
      if (imageSequence && imageSequence.frame <= 38) {
        startHomeIdleAnimation();
      } else if (catImageSequence && catImageSequence.frame >= 50) {
        startIdleAnimation();
      }
    };
    if (typeof lenis !== 'undefined') {
      lenis.on('scroll', () => {
        if (isProgrammaticScroll) {
          stopHomeIdleAnimation();
          stopIdleAnimation();
        } else {
          if (isHomeIdlePlaying) {
            stopHomeIdleAnimation();
            syncScrollToHomeFrame();
          }
          if (isIdlePlaying) {
            stopIdleAnimation();
          }
        }
        clearTimeout(scrollIdleTimeout);
        scrollIdleTimeout = setTimeout(() => {
          if (!isProgrammaticScroll) {
            checkAndStartIdleAnimations();
          }
        }, 800);
      });
    }
    checkAndStartIdleAnimations();
  };
  window.addEventListener('resize', () => {
    resizeCanvas();
    resizeCatCanvas();
  });
}
const detailTag = document.getElementById('detail-tag');
const detailTitle = document.getElementById('detail-title');
const detailDesc = document.getElementById('detail-desc');
const detailGithub = document.getElementById('detail-github');
const detailLive = document.getElementById('detail-live');
const detailLive2 = document.getElementById('detail-live2');
const detailCloseBtn = document.getElementById('detail-close-btn');
const detailTrack = document.getElementById('detail-media-track');
const detailDots = document.getElementById('detail-media-dots');
const detailPrev = document.getElementById('detail-media-prev');
const detailNext = document.getElementById('detail-media-next');

let galleryIndex = 0;
let galleryAutoTimer = null;
function scheduleNextSlide(media) {
  stopGalleryAuto();
  if (media.length < 2) return;
  const current = media[galleryIndex];
  if (current && current.type === 'video') {
    const vid = detailTrack.querySelectorAll('video')[galleryIndex];
    if (vid) {
      vid.onended = () => {
        const next = (galleryIndex + 1) % media.length;
        setGalleryIndex(next, media);
        scheduleNextSlide(media);
      };
    }
    return;
  }
  galleryAutoTimer = setTimeout(() => {
    const next = (galleryIndex + 1) % media.length;
    setGalleryIndex(next, media);
    scheduleNextSlide(media);
  }, 3000);
}
function startGalleryAuto(media) { scheduleNextSlide(media); }
function stopGalleryAuto() {
  clearTimeout(galleryAutoTimer);
  galleryAutoTimer = null;
  detailTrack.querySelectorAll('video').forEach(v => { v.onended = null; });
}
function setGalleryIndex(i, media) {
  galleryIndex = i;
  detailTrack.style.transform = `translateX(-${i * 100}%)`;
  detailDots.querySelectorAll('span').forEach((d, j) => d.classList.toggle('active', j === i));
  detailPrev.classList.toggle('visible', i > 0);
  detailNext.classList.toggle('visible', i < media.length - 1);
}
detailPrev.addEventListener('click', () => {
  const media = JSON.parse(detailTrack.dataset.media || '[]');
  if (galleryIndex > 0) setGalleryIndex(galleryIndex - 1, media);
});
detailNext.addEventListener('click', () => {
  const media = JSON.parse(detailTrack.dataset.media || '[]');
  if (galleryIndex < media.length - 1) setGalleryIndex(galleryIndex + 1, media);
});

const lightbox = document.getElementById('media-lightbox');
const lightboxInner = document.getElementById('media-lightbox-inner');
function openLightbox(src, type) {
  lightboxInner.innerHTML = type === 'video'
    ? `<video src="${src}" autoplay muted loop playsinline controls></video>`
    : `<img src="${src}">`;
  lightbox.classList.add('active');
}
function closeLightbox() {
  lightbox.classList.remove('active');
  lightboxInner.innerHTML = '';
}
lightbox.addEventListener('click', e => { e.stopPropagation(); if (e.target === lightbox) closeLightbox(); });
document.getElementById('media-lightbox-close').addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

document.querySelector('.detail-preview').addEventListener('click', (e) => {
  if (e.target.closest('.detail-media-prev, .detail-media-next')) return;
  const media = JSON.parse(detailTrack.dataset.media || '[]');
  const current = media[galleryIndex];
  if (current) openLightbox(current.src, current.type);
});

function openDetailPaper(item) {
  const media = JSON.parse(item.dataset.media || '[]');
  detailTrack.innerHTML = media.map(m =>
    m.type === 'video'
      ? `<video src="${m.src}" autoplay muted loop playsinline></video>`
      : `<img src="${m.src}" alt="${item.dataset.title}" onerror="this.onerror=null;this.src='/Assets/Image/categ.png'">`
  ).join('');
  detailTrack.dataset.media = item.dataset.media || '[]';
  detailDots.innerHTML = media.map(() => `<span></span>`).join('');
  setGalleryIndex(0, media);
  startGalleryAuto(media);
  detailTag.textContent = item.dataset.tag;
  detailTitle.textContent = item.dataset.title;
  const note = item.dataset.note;
  detailDesc.innerHTML = item.dataset.desc.replace(/\n/g, '<br>') + (note ? `<br><br><span style="color:red">${note}</span>` : '');
  detailDesc.style.color = '';
  detailGithub.href = item.dataset.github;
  detailLive.href = item.dataset.live;
  const liveLabel = document.getElementById('detail-live-label');
  if (item.dataset.live2) {
    if (liveLabel) liveLabel.textContent = 'Dashboard (Backend)';
    detailLive2.href = item.dataset.live2;
    detailLive2.style.display = '';
  } else {
    if (liveLabel) liveLabel.textContent = 'To Website';
    detailLive2.style.display = 'none';
  }
  detailPaperOpenedAt = Date.now();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    detailPaper.classList.add('open');
    playCardFlipSound();
  }));
}
document.querySelectorAll('.paper-project-item:not(.paper-project-empty)').forEach(item => {
  item.addEventListener('click', (e) => {
    if (e.target.closest('a[href]') && !e.target.closest('.card-to-website')) return;
    if (e.target.closest('.card-to-website')) e.preventDefault();
    e.stopPropagation();
    if (detailPaper.classList.contains('open')) {
      detailPaper.classList.remove('open');
      setTimeout(() => openDetailPaper(item), 450);
    } else {
      openDetailPaper(item);
    }
  });
});
detailCloseBtn.addEventListener('click', () => {
  detailPaper.classList.remove('open');
  stopGalleryAuto();
});
document.addEventListener('click', (e) => {
  if (detailPaper.classList.contains('open') && !detailPaper.contains(e.target)) {
    detailPaper.classList.remove('open');
    stopGalleryAuto();
  }
});
document.querySelector('.detail-preview').addEventListener('mouseenter', stopGalleryAuto);
document.querySelector('.detail-preview').addEventListener('mouseleave', () => {
  const media = JSON.parse(detailTrack.dataset.media || '[]');
  startGalleryAuto(media);
});
const aboutCard = document.querySelector('.about-interactive-card');
if (aboutCard) {
  aboutCard.addEventListener('click', () => {
    aboutCard.classList.toggle('flipped');
    playCardFlipSound();
  });
}
const projectModal = document.getElementById('project-modal');
const projectListTriggerBtn = document.getElementById('project-list-trigger');
const closeProjectModalBtn = document.getElementById('close-project-modal');
if (projectModal && projectListTriggerBtn && closeProjectModalBtn) {
  projectListTriggerBtn.addEventListener('click', () => {
    projectModal.classList.add('open');
    document.body.classList.add('modal-open');
    if (typeof lenis !== 'undefined') lenis.stop();
    playLetterSound();
  });
  closeProjectModalBtn.addEventListener('click', () => {
    closeModal();
  });
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeModal();
    }
  });
  function closeModal() {
    projectModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (typeof lenis !== 'undefined') lenis.start();
    if (isAudioEnabled) { paperCloseSound.currentTime = 0; paperCloseSound.play().catch(() => {}); }
    document.querySelectorAll('.modal-project-item').forEach(item => {
      item.classList.remove('active', 'selected');
    });
    document.querySelector('.expanded-project-copy')?.remove();
  }
  const projectItems = document.querySelectorAll('.modal-project-item');
  const modalList = document.querySelector('.modal-projects-list');
  const expandedDetailClass = 'expanded-project-copy';
  const removeExpandedDetail = () => {
    document.querySelector(`.modal-project-item.${expandedDetailClass}`)?.remove();
  };

  projectItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.item-action-btn')) {
        const targetProgress = parseFloat(item.dataset.target);
        const trigger = ScrollTrigger.getById("story-trigger");
        if (trigger) {
          const scrollStart = trigger.start;
          const scrollEnd = trigger.end;
          const targetScroll = scrollStart + (scrollEnd - scrollStart) * targetProgress;
          closeModal();
          isProgrammaticScroll = true;
          stopHomeIdleAnimation();
          stopIdleAnimation();
          lenis.scrollTo(targetScroll, { 
            duration: 1.5,
            onComplete: () => {
              isProgrammaticScroll = false;
              clearTimeout(scrollIdleTimeout);
              scrollIdleTimeout = setTimeout(() => {
                checkAndStartIdleAnimations();
              }, 800);
            }
          });
        }
        return;
      }
      const isOpen = item.classList.contains('selected');
      removeExpandedDetail();
      if (isOpen) {
        item.classList.remove('selected');
      } else {
        projectItems.forEach(projectItem => projectItem.classList.remove('selected'));
        item.classList.add('selected');
        const detailCopy = item.cloneNode(true);
        detailCopy.classList.add('active', expandedDetailClass);
        detailCopy.querySelector('.item-action-btn')?.addEventListener('click', (event) => {
          event.stopPropagation();
          item.querySelector('.item-action-btn')?.click();
        });
        modalList.prepend(detailCopy);
        const imgWrap = detailCopy.querySelector('.item-img-wrap');
        const textEl = detailCopy.querySelector('.item-text');
        requestAnimationFrame(() => {
          gsap.fromTo(imgWrap, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          gsap.fromTo(textEl, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', delay: 0.05 });
        });
      }
      playHoverSound();
    });
  });
}
const coordXEl = document.getElementById('coord-x');
const coordYEl = document.getElementById('coord-y');
let currentClientX = 0;
let currentClientY = 0;
const updateCoords = () => {
  if (coordXEl && coordYEl) {
    const xStr = String(Math.round(currentClientX)).padStart(4, '0');
    const yStr = String(Math.round(currentClientY + window.scrollY)).padStart(4, '0');
    coordXEl.textContent = xStr;
    coordYEl.textContent = yStr;
  }
};
document.addEventListener('mousemove', (e) => {
  currentClientX = e.clientX;
  currentClientY = e.clientY;
  updateCoords();
});
window.addEventListener('scroll', () => {
  updateCoords();
}, { passive: true });


(function initCvModal() {
  const modal = document.getElementById('cv-modal');
  const openButton = document.getElementById('see-cv-btn');
  const closeButton = document.getElementById('cv-modal-close');
  if (!modal || !openButton || !closeButton) return;

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openButton.addEventListener('click', () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
  closeButton.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();
