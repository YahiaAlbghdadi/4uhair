// Mobile nav toggle
const header = document.getElementById('header');
const burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  burger.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav').forEach((nav) => {
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      header.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
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
