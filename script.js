/* ========= Utility helpers ========= */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  /* ========== 1) Smooth Scroll + Active Nav Highlight ========== */
  const navLinks = $$('nav a[href^="#"], nav a[href="#"]');
  const sections = $$('section');

  // Smooth scroll (anchor links)
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // IntersectionObserver for active nav
  const obsNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(n => n.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(sec => {
    if (sec.id) obsNav.observe(sec);
  });

  /* ========== 2) Scroll reveal (stagger) ========== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // stagger child reveal
        const items = entry.target.querySelectorAll('.stagger');
        items.forEach((it,i) => setTimeout(()=> it.classList.add('visible'), i*120));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('section, .hero, .owner-content').forEach(el => {
    el.classList.add('fade-in'); revealObserver.observe(el);
    // mark children as stagger if desired (e.g., service cards)
    el.querySelectorAll('.service-box, h2, p, img').forEach(child => child.classList.add('stagger'));
  });

  /* ========== 3) Animated counters (optional) ========== */
  const animateCounter = el => {
    const target = +el.dataset.count || 0;
    const duration = 1400;
    let start = 0; const startTime = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startTime)/duration);
      const val = Math.floor(t * target);
      el.textContent = val;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const counters = $$('.counter');
  if (counters.length) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounter(entry.target); cObs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

  /* ========== 4) Image hover micro-interaction (applies via CSS, ensure images exist) ========== */
  // No extra JS required; CSS transforms handle hover

  /* ========== 5) Form validation with visual feedback ========== */
  const form = document.querySelector('#contactForm');
  if (form) {
    const showError = (field, msg) => {
      field.classList.add('field-error');
      let el = field.nextElementSibling;
      if (!el || !el.classList.contains('form-msg')) {
        el = document.createElement('div'); el.className = 'form-msg';
        field.parentNode.insertBefore(el, field.nextSibling);
      }
      el.textContent = msg; el.classList.add('show');
    };
    const clearError = (field) => {
      field.classList.remove('field-error');
      const el = field.nextElementSibling;
      if (el && el.classList.contains('form-msg')) el.classList.remove('show');
    };

    form.addEventListener('submit', e => {
      let valid = true;
      const name = form.querySelector('input[name="name"], #name');
      const email = form.querySelector('input[name="email"], #email');
      const message = form.querySelector('textarea[name="message"], #message');

      [name, email, message].forEach(f => f && clearError(f));

      if (name && (!name.value.trim())) { valid=false; showError(name,'Please enter your name'); }
      if (email) {
        const re = /\S+@\S+\.\S+/;
        if (!email.value.trim()) { valid=false; showError(email,'Please enter your email'); }
        else if (!re.test(email.value)) { valid=false; showError(email,'Enter a valid email'); }
      }
      if (message && !message.value.trim()) { valid=false; showError(message,'Please write a message'); }

      if (!valid) e.preventDefault();
      else {
        // optional: show a tiny confirmation toast (non-blocking)
        const t = document.createElement('div');
        t.textContent = 'Message sent — thank you!';
        t.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:28px;background:var(--accent);color:#fff;padding:10px 16px;border-radius:8px;box-shadow:var(--shadow);z-index:9999';
        document.body.appendChild(t);
        setTimeout(()=> t.remove(),2200);
      }
    });
  }

  /* ========== 6) Theme toggle (light/dark) ========== */
  const initTheme = () => {
    const current = localStorage.getItem('rdg-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
    if (current === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
  };
  initTheme();

  const toggleBtn = document.querySelector('#themeToggle') || (() => {
    // create flexible toggle in header if not present
    const btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.className = 'theme-toggle';
    btn.innerHTML = '🌙 Theme';
    const headerInner = document.querySelector('header .container') || document.querySelector('header');
    if (headerInner) headerInner.appendChild(btn);
    return btn;
  })();

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('rdg-theme','light'); toggleBtn.innerHTML='🌙 Theme'; }
    else { document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('rdg-theme','dark'); toggleBtn.innerHTML='☀️ Theme'; }
  });

  /* ========== 7) Back-to-top button ========== */
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.title = 'Back to top';
  topBtn.innerHTML = '↑';
  document.body.appendChild(topBtn);
  topBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll', () => {
    if (window.scrollY > 420) topBtn.classList.add('show'); else topBtn.classList.remove('show');
  });

  /* ========== 8) Lazy image loader for elements using data-src (progressive enhancement) ========== */
  const lazyImgs = $$('img[data-src]');
  if (lazyImgs.length) {
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px 0px' });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }
});
