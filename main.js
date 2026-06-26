/* =========================================================
   main.js — Personal website interactivity
   ========================================================= */

// ── Year ───────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Navbar scroll effect ───────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile hamburger ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Scroll-reveal ──────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.research-card, .pub-item, .course-item, .contact-card, ' +
  '.about-photo-wrap, .about-text, .teaching-semester, ' +
  '.section-heading, .section-subheading, .section-label, ' +
  '.about-bio, .interest-tag, .about-link'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for sibling groups
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Animated canvas — floating math symbols ────────────────
(function initCanvas() {
  const canvas = document.getElementById('mathCanvas');
  const ctx = canvas.getContext('2d');

  const symbols = [
    '∂', '∇', '∑', '∫', '∮', '∞', 'π', 'Δ', 'λ', 'φ', 'ψ', 'ω',
    '∈', '⊂', '∀', '∃', '≡', '≈', '⊗', 'ℝ', 'ℂ', 'ℤ', 'α', 'β',
    'γ', 'θ', 'σ', 'ε', 'μ', '∏', '∧', '∨', '⊕', '⊥', '∥',
  ];

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: 11 + Math.random() * 16,
      speed: 0.12 + Math.random() * 0.22,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: 0.06 + Math.random() * 0.16,
      targetOpacity: 0.06 + Math.random() * 0.16,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.004,
      life: 0,
      maxLife: 800 + Math.random() * 400,
    };
  }

  // Seed particles
  for (let i = 0; i < 55; i++) {
    const p = randomParticle();
    p.life = Math.random() * p.maxLife; // start at random phase
    particles.push(p);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.life++;
      p.y -= p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;

      // Fade in / fade out
      const progress = p.life / p.maxLife;
      let alpha;
      if (progress < 0.15) {
        alpha = p.targetOpacity * (progress / 0.15);
      } else if (progress > 0.85) {
        alpha = p.targetOpacity * ((1 - progress) / 0.15);
      } else {
        alpha = p.targetOpacity;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = '#a78bfa';
      ctx.shadowColor = '#a78bfa';
      ctx.shadowBlur = 10;
      ctx.font = `${p.size}px 'Playfair Display', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.symbol, 0, 0);
      ctx.restore();

      // Reset
      if (p.life >= p.maxLife || p.y < -40 || p.x < -60 || p.x > W + 60) {
        particles[i] = randomParticle();
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Active nav link on scroll ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// Add active nav style
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--text-1) !important; }
.nav-links a.active::after { width: 100% !important; }`;
document.head.appendChild(style);
