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
