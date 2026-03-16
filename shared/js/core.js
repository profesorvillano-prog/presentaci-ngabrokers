/* =========================================
   CORE.JS — Shared utilities
   ========================================= */

/* --- Progress bar --- */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / docHeight * 100) + '%';
  }, { passive: true });
}

/* --- Animated counter --- */
function animateCounter(el, target, suffix = '', duration = 1.8) {
  const isDecimal = target % 1 !== 0;
  gsap.fromTo({ val: 0 }, { val: target }, {
    duration,
    ease: 'power2.out',
    onUpdate: function () {
      const v = this.targets()[0].val;
      el.textContent = (isDecimal ? v.toFixed(1) : Math.round(v)) + suffix;
    }
  });
}

/* --- IntersectionObserver for counters --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        entry.target.dataset.done = '1';
        const target = parseFloat(entry.target.dataset.counter);
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, suffix);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

/* --- Video autoplay on viewport --- */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('video[data-autoplay]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.play();
      else { entry.target.pause(); entry.target.currentTime = 0; }
    });
  }, { threshold: 0.3 });
  videos.forEach(v => obs.observe(v));
}

/* --- Hover video on cards --- */
function initHoverVideos() {
  document.querySelectorAll('.card-video').forEach(card => {
    const vid = card.querySelector('video');
    if (!vid) return;
    card.addEventListener('mouseenter', () => vid.play());
    card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
  });
}

/* --- Load JSON data --- */
async function loadData(path) {
  try {
    const res = await fetch(path);
    return await res.json();
  } catch (e) {
    console.warn('Could not load data:', path, e);
    return null;
  }
}

/* --- Init all shared --- */
function initCore() {
  initProgressBar();
  initCounters();
  initVideoAutoplay();
  initHoverVideos();
}
