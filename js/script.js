// Preloader: shows briefly on first paint, fades out once the page (and
// hero media) has actually loaded, then reveals the hero content.
const preloader = document.getElementById('preloader');
if (preloader) {
  document.body.classList.add('is-loading');
  const MIN_DISPLAY_MS = 450; // avoids a flash-then-gone blink on fast connections
  const shownAt = performance.now();
  let hidden = false;
  const hidePreloader = () => {
    if (hidden) return;
    hidden = true;
    const wait = Math.max(0, MIN_DISPLAY_MS - (performance.now() - shownAt));
    setTimeout(() => {
      preloader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-loaded');
      setTimeout(() => preloader.remove(), 700);
    }, wait);
  };
  if (document.readyState === 'complete') hidePreloader();
  else window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 4000); // fallback if 'load' stalls (e.g. slow connection)
}

// Header scroll state
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  burger.setAttribute('aria-expanded', String(open));
});
document.getElementById('nav').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    header.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Marquee: duplicate the item set until it's wide enough to loop seamlessly
// at any viewport width, then translate by the exact pixel width of one half.
const marqueeTrack = document.getElementById('marqueeTrack');
if (marqueeTrack) {
  const buildMarquee = () => {
    marqueeTrack.classList.remove('marquee-ready');
    const baseSet = marqueeTrack.querySelector('.marquee-set');
    marqueeTrack.innerHTML = '';
    marqueeTrack.appendChild(baseSet);
    const containerWidth = marqueeTrack.parentElement.clientWidth;
    let guard = 0;
    while (marqueeTrack.scrollWidth < containerWidth && guard < 20) {
      marqueeTrack.appendChild(baseSet.cloneNode(true));
      guard++;
    }
    const halfWidth = marqueeTrack.scrollWidth;
    Array.from(marqueeTrack.children).forEach((set) => {
      marqueeTrack.appendChild(set.cloneNode(true));
    });
    const pxPerSecond = 60;
    marqueeTrack.style.setProperty('--marquee-shift', `-${halfWidth}px`);
    marqueeTrack.style.animationDuration = `${(halfWidth / pxPerSecond).toFixed(2)}s`;
    marqueeTrack.classList.add('marquee-ready');
  };
  buildMarquee();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildMarquee, 200);
  });
}

// Cookie consent banner
// Stores { necessary: true, stats: bool, ts } in localStorage. Nothing reads
// the "stats" flag today (the site loads no analytics/marketing scripts) —
// it exists so a future addition (e.g. analytics) has a consent gate to
// check before loading, without needing to touch this banner again.
const cookieBanner = document.getElementById('cookieBanner');
if (cookieBanner) {
  const CONSENT_KEY = 'cookieConsent';
  const settingsPanel = document.getElementById('cookieSettings');
  const statsToggle = document.getElementById('cookieStatsToggle');
  const acceptBtn = document.getElementById('cookieAcceptBtn');
  const rejectBtn = document.getElementById('cookieRejectBtn');
  const settingsBtn = document.getElementById('cookieSettingsBtn');
  const saveBtn = document.getElementById('cookieSaveBtn');
  const reopenLinks = document.querySelectorAll('.js-cookie-reopen');

  const getConsent = () => {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
  };
  const setConsent = (stats) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ necessary: true, stats, ts: Date.now() }));
  };
  const show = (openSettings) => {
    cookieBanner.hidden = false;
    requestAnimationFrame(() => cookieBanner.classList.add('is-visible'));
    document.body.classList.add('cookie-banner-open');
    if (openSettings) {
      settingsPanel.hidden = false;
      const existing = getConsent();
      statsToggle.checked = !!(existing && existing.stats);
    }
  };
  const hide = () => {
    cookieBanner.classList.remove('is-visible');
    document.body.classList.remove('cookie-banner-open');
    setTimeout(() => { cookieBanner.hidden = true; settingsPanel.hidden = true; }, 350);
  };

  acceptBtn.addEventListener('click', () => { setConsent(true); hide(); });
  rejectBtn.addEventListener('click', () => { setConsent(false); hide(); });
  settingsBtn.addEventListener('click', () => { settingsPanel.hidden = !settingsPanel.hidden; if (!settingsPanel.hidden) { const existing = getConsent(); statsToggle.checked = !!(existing && existing.stats); } });
  saveBtn.addEventListener('click', () => { setConsent(statsToggle.checked); hide(); });
  reopenLinks.forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); show(true); }));

  if (!getConsent()) show(false);
}

// Hero video: respect reduced-motion, and pause when scrolled out of view
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  } else {
    const heroIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      });
    }, { threshold: 0.1 });
    heroIo.observe(heroVideo);
  }
}
