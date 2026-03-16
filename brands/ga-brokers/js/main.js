/* =========================================
   MAIN.JS — GA Brokers presentation
   ========================================= */

gsap.registerPlugin(ScrollTrigger);

/* ─── HERO ─────────────────────────────── */
function initHero() {
  const words = document.querySelectorAll('.hero-title .word');
  gsap.set(words, { y: 60, opacity: 0 });
  gsap.to(words, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.2 });
  gsap.from('.hero-eyebrow',     { opacity: 0, y: 20, duration: 0.7, delay: 0.1 });
  gsap.from('.hero-subtitle',    { opacity: 0, y: 24, duration: 0.8, delay: 0.7 });
  gsap.from('.hero-meta',        { opacity: 0, y: 16, duration: 0.7, delay: 0.95 });
  gsap.from('.hero-scroll-hint', { opacity: 0, duration: 0.8, delay: 1.4 });
}

/* ─── PROBLEMA ──────────────────────────── */
function initProblema() {
  const section = document.querySelector('#section-problema');
  if (!section) return;
  gsap.from('#section-problema .section-label, #section-problema h2', {
    scrollTrigger: { trigger: section, start: 'top 80%' },
    opacity: 0, y: 24, duration: 0.7, stagger: 0.1, ease: 'power2.out'
  });
  document.querySelectorAll('.problem-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      opacity: 0, y: 36, duration: 0.65, delay: i * 0.1, ease: 'power2.out'
    });
  });
}

/* ─── MERCADO ───────────────────────────── */
function initMercado() {
  const section = document.querySelector('#section-mercado');
  if (!section) return;
  gsap.from('#section-mercado .section-label, #section-mercado h2', {
    scrollTrigger: { trigger: section, start: 'top 80%' },
    opacity: 0, y: 24, duration: 0.7, stagger: 0.1, ease: 'power2.out'
  });
  gsap.from('.kpi-card', {
    scrollTrigger: { trigger: '.kpi-grid', start: 'top 82%' },
    opacity: 0, y: 36, duration: 0.65, stagger: 0.13, ease: 'power3.out'
  });
  gsap.from('.market-note', {
    scrollTrigger: { trigger: '.market-note', start: 'top 88%' },
    opacity: 0, y: 16, duration: 0.6, ease: 'power2.out'
  });
}

/* ─── FUNNEL ────────────────────────────── */
function initFunnel() {
  const section = document.querySelector('#section-funnel');
  if (!section) return;
  const steps = section.querySelectorAll('.funnel-step');
  const connectors = section.querySelectorAll('.funnel-connector');

  // On mobile: just stagger fade in, no pin
  const isMobile = window.innerWidth < 900;
  if (isMobile) {
    steps.forEach((step, i) => {
      gsap.to(step, {
        scrollTrigger: { trigger: step, start: 'top 88%' },
        opacity: 1, x: 0, duration: 0.55, delay: i * 0.08, ease: 'power2.out'
      });
    });
    return;
  }

  // Desktop: pin + scroll reveal
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${steps.length * 160}`,
    pin: true,
    scrub: 0.8,
    onUpdate(self) {
      const active = Math.ceil(self.progress * steps.length);
      steps.forEach((step, i) => {
        if (i < active) {
          gsap.to(step, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' });
          step.classList.add('active');
        } else {
          gsap.to(step, { opacity: 0.2, duration: 0.25 });
          step.classList.remove('active');
        }
      });
      connectors.forEach((conn, i) => {
        gsap.to(conn, {
          background: i < active - 1 ? 'var(--accent)' : 'var(--border)',
          duration: 0.25
        });
      });
    }
  });
}

/* ─── STACK ─────────────────────────────── */
function initStack() {
  gsap.from('#section-stack .section-label, #section-stack h2, #section-stack p', {
    scrollTrigger: { trigger: '#section-stack', start: 'top 80%' },
    opacity: 0, y: 24, duration: 0.65, stagger: 0.08, ease: 'power2.out'
  });
  gsap.from('.stack-card', {
    scrollTrigger: { trigger: '.stack-grid', start: 'top 82%' },
    opacity: 0, y: 24, duration: 0.55, stagger: 0.06, ease: 'power2.out'
  });
}

/* ─── ENTREGAMOS (TABS) ─────────────────── */
function initEntregamos() {
  const section = document.querySelector('#section-entregamos');
  if (!section) return;

  const panels = section.querySelectorAll('.tab-panel');
  const btns = section.querySelectorAll('.tab-btn');

  function setTab(idx) {
    panels.forEach((p, i) => p.classList.toggle('active', i === idx));
    btns.forEach((b, i) => b.classList.toggle('active', i === idx));
  }
  btns.forEach((btn, i) => btn.addEventListener('click', () => setTab(i)));
  setTab(0);

  gsap.from('#section-entregamos .section-label, #section-entregamos h2', {
    scrollTrigger: { trigger: section, start: 'top 80%' },
    opacity: 0, y: 24, duration: 0.7, stagger: 0.1
  });

  if (window.innerWidth >= 900) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${panels.length * 280}`,
      pin: true,
      scrub: 0.8,
      onUpdate(self) {
        setTab(Math.min(Math.floor(self.progress * panels.length), panels.length - 1));
      }
    });
  }
}

/* ─── COMPARATIVA ───────────────────────── */
function initComparativa() {
  gsap.from('#section-comparativa .section-label, #section-comparativa h2', {
    scrollTrigger: { trigger: '#section-comparativa', start: 'top 80%' },
    opacity: 0, y: 24, duration: 0.7, stagger: 0.1
  });
  gsap.from('.compare-wrapper', {
    scrollTrigger: { trigger: '.compare-wrapper', start: 'top 82%' },
    opacity: 0, y: 32, duration: 0.75, ease: 'power2.out'
  });
}

/* ─── PRECIOS ────────────────────────────── */
function initPrecios() {
  gsap.from('#section-precios .section-label, #section-precios h2', {
    scrollTrigger: { trigger: '#section-precios', start: 'top 80%' },
    opacity: 0, y: 24, duration: 0.7, stagger: 0.1
  });
  gsap.from('.price-card', {
    scrollTrigger: { trigger: '.prices-grid', start: 'top 82%' },
    opacity: 0, y: 44, duration: 0.75, stagger: 0.14, ease: 'power3.out'
  });
  gsap.from('.price-notes', {
    scrollTrigger: { trigger: '.price-notes', start: 'top 90%' },
    opacity: 0, y: 16, duration: 0.6, ease: 'power2.out'
  });
}

/* ─── LOAD DATA ─────────────────────────── */
async function renderData() {
  const data = await loadData('/data/ga-brokers.json');
  if (!data) return;
  document.querySelectorAll('[data-kpi]').forEach((el, i) => {
    const k = data.kpis[i]; if (!k) return;
    el.querySelector('.kpi-value').dataset.counter = k.value;
    el.querySelector('.kpi-value').dataset.suffix  = k.suffix;
    el.querySelector('.kpi-label').textContent     = k.label;
  });
  document.querySelectorAll('[data-price]').forEach((el, i) => {
    const p = data.pricing[i]; if (!p) return;
    el.querySelector('.price-label').textContent  = p.label;
    el.querySelector('.price-amount').textContent = p.amount;
    el.querySelector('.price-period').textContent = p.period;
    el.querySelector('.price-desc').textContent   = p.desc;
  });
}

/* ─── INIT ──────────────────────────────── */
window.addEventListener('DOMContentLoaded', async () => {
  await renderData();
  initCore();
  initHero();
  initProblema();
  initMercado();
  initFunnel();
  initStack();
  initEntregamos();
  initComparativa();
  initPrecios();
  initCounters();
});
