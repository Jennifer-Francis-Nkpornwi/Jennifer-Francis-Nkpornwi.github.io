// ===========================================================
// Jennifer Francis-Nkpornwi — Portfolio interactions
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  initNav();
  initReveal();
  initCounters();
  initSignalCanvas();
  initFilters();
  initContactForm();
});

/* ---------- Mobile nav ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { items.forEach(el => el.classList.add('in')); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = target + suffix; return; }
    const duration = 1100;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach(el => io.observe(el));
}

/* ---------- Hero "noise → signal" canvas ----------
   Signature visual: scattered data points settle into a
   clean, confident ascending line — the brand promise
   ("I deliver clarity") rendered literally.
------------------------------------------------------- */
function initSignalCanvas() {
  const canvas = document.getElementById('signal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, dpr;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener('resize', size);

  const N = 42;
  const points = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    return {
      chaosX: Math.random() * W,
      chaosY: Math.random() * H,
      lineX: t * W,
      lineY: H - (H * 0.14) - (t * (H * 0.6)) + Math.sin(t * 9) * 10,
      r: 2 + Math.random() * 1.6,
    };
  });

  let progress = reduced ? 1 : 0;
  const target = 1;
  let last = performance.now();

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function draw(now) {
    const dt = now - last; last = now;
    if (progress < target) progress = Math.min(target, progress + dt / 2200);
    const p = ease(progress);

    ctx.clearRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += W / 6) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = 0; gy <= H; gy += H / 4) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

    // connecting line (fades in as points align)
    ctx.beginPath();
    points.forEach((pt, i) => {
      const x = pt.chaosX + (pt.lineX - pt.chaosX) * p;
      const y = pt.chaosY + (pt.lineY - pt.chaosY) * p;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = `rgba(59,130,246,${0.85 * p})`;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // area fill under line
    if (p > 0.05) {
      ctx.lineTo(points[points.length - 1].lineX, H);
      ctx.lineTo(points[0].lineX, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `rgba(59,130,246,${0.18 * p})`);
      grad.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // points
    points.forEach((pt) => {
      const x = pt.chaosX + (pt.lineX - pt.chaosX) * p;
      const y = pt.chaosY + (pt.lineY - pt.chaosY) * p;
      ctx.beginPath();
      ctx.arc(x, y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226,232,240,${0.35 + 0.5 * p})`;
      ctx.fill();
    });

    if (progress < target && !reduced) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // gentle replay on click for delight
  canvas.addEventListener('click', () => { if (!reduced) { progress = 0; last = performance.now(); requestAnimationFrame(draw); } });
}

/* ---------- Projects filter ---------- */
function initFilters() {
  const bar = document.querySelector('.filter-bar');
  if (!bar) return;
  const buttons = bar.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-tags]');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const tags = card.dataset.tags.split(/[\s,]+/).filter(Boolean);
        const show = filter === 'all' || tags.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ---------- Contact form (static-site friendly) ---------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in every field before sending.';
      status.classList.remove('ok');
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:hello@jenniferfrancis.com?subject=${subject}&body=${body}`;

    status.textContent = 'Opening your email client — thank you for reaching out!';
    status.classList.add('ok');
    form.reset();
  });
}
