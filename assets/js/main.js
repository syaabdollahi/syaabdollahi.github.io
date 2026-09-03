/* ============================================================
   SAMIRA YAABDOLLAHI — shared behavior
   header state · current-page navigation · mobile menu ·
   scroll reveal · light parallax
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- header scrolled state ---------- */
  const header = document.querySelector('.site-header');
  const setHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  };
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  /* ---------- current page navigation ---------- */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a.mm-link').forEach(link => {
    const targetFile = new URL(link.getAttribute('href'), window.location.href)
      .pathname.split('/').pop() || 'index.html';
    link.removeAttribute('aria-current');
    if (targetFile === currentFile) link.setAttribute('aria-current', 'page');
  });

  /* ---------- mobile menu ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-menu a').forEach(a =>
      a.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }

  /* ---------- scroll reveal (never hides content if JS fails) ---------- */
  const revealables = document.querySelectorAll('[data-reveal]');
  const revealAll = () => revealables.forEach(el => el.classList.add('revealed'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    try {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealables.forEach(el => io.observe(el));
      // safety net: anything still hidden after 2s becomes visible
      setTimeout(() => document.querySelectorAll('[data-reveal]:not(.revealed)')
        .forEach(el => el.classList.add('revealed')), 2000);
    } catch (err) { revealAll(); }
  }

  /* ---------- very light parallax for decorative washes ---------- */
  const px = document.querySelectorAll('[data-parallax]');
  if (px.length && !reduceMotion) {
    let ticking = false;
    const move = () => {
      const y = window.scrollY;
      px.forEach(el => {
        const s = parseFloat(el.dataset.parallax || '0.08');
        el.style.transform = 'translateY(' + (y * s * -1).toFixed(1) + 'px)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(move); ticking = true; }
    }, { passive: true });
  }

})();
