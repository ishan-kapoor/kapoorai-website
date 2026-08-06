/**
 * KapoorAI v4 · script.js
 *
 * 1. Navigation  — sticky shadow, active section, hamburger/drawer
 * 2. Scroll reveal — staggered IntersectionObserver
 * 3. Smooth scroll — offset for fixed header
 * 4. Contact form — mailto fallback + success state
 */

(function () {
  'use strict';

  /* ============================================================
     UTILITY
  ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ============================================================
     1. NAVIGATION
  ============================================================ */
  const header   = $('#site-header');
  const hamburger = $('#hamburger');
  const drawer    = $('#mobile-drawer');
  const overlay   = $('#drawer-overlay');
  const navLinks  = $$('.nav-link');
  const sections  = $$('section[id], div[id]');

  // ── Sticky scroll shadow ──────────────────────────────────────
  function onScroll () {
    header.classList.toggle('scrolled', window.scrollY > 10);
    highlightActiveSection();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // ── Active nav link ───────────────────────────────────────────
  function highlightActiveSection () {
    let current = '';
    sections.forEach(sec => {
      // Section counts as "active" when its top is within the top third of viewport
      if (sec.getBoundingClientRect().top <= window.innerHeight * 0.35) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('is-active', href === current);
    });
  }

  // ── Hamburger / drawer ────────────────────────────────────────
  function openDrawer () {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.removeAttribute('aria-hidden');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer () {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    drawer.classList.contains('open') ? closeDrawer() : openDrawer()
  );
  overlay.addEventListener('click', closeDrawer);

  // Close drawer when a link inside it is clicked
  $$('.m-link, .m-cta', drawer).forEach(el =>
    el.addEventListener('click', closeDrawer)
  );

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ============================================================
     2. SCROLL REVEAL
  ============================================================ */

  // Give sibling .reveal elements a staggered delay based on
  // their position among visible siblings — capped at 5 so long
  // lists don't feel slow.
  function staggerDelay (el) {
    const siblings = $$('.reveal', el.parentElement);
    const idx = siblings.indexOf(el);
    return Math.min(idx, 4) * 75; // 0 / 75 / 150 / 225 / 300 ms
  }

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = staggerDelay(el);
      setTimeout(() => el.classList.add('in'), delay);
      revealObs.unobserve(el);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -36px 0px'
  });

  $$('.reveal').forEach(el => revealObs.observe(el));

  // Hero elements reveal immediately on page load (no scroll needed)
  function revealHeroNow () {
    $$('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 100 + i * 110);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealHeroNow);
  } else {
    revealHeroNow();
  }

  /* ============================================================
     3. SMOOTH SCROLL WITH HEADER OFFSET
  ============================================================ */
  const NAV_H = 68; // matches CSS header height of 62px + some breathing room

  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id = anchor.getAttribute('href');
    if (id === '#') return;

    const target = $(id);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  /* ============================================================
     4. CONTACT FORM — mailto fallback + success state
  ============================================================ */
  const form = $('#contact-form');

  if (form) {
    form.addEventListener('submit', async function handleSubmit (e) {
      e.preventDefault();

      const btn     = $('[type="submit"]', form);
      const label   = $('.btn-label', btn);
      const loading = $('.btn-loading', btn);

      // Loading state
      btn.disabled = true;
      if (label)   label.style.display   = 'none';
      if (loading) loading.style.display = 'inline';

      // Collect values safely
      const get = id => ($(id, form)?.value || '').trim();
      const name    = get('#cf-name');
      const role    = get('#cf-role');
      const org     = get('#cf-org');
      const type    = get('#cf-type');
      const message = get('#cf-msg');

      // Build mailto string
      const subject = encodeURIComponent(
        `KapoorAI Enquiry — ${org || 'Website visitor'}`
      );
      const body = encodeURIComponent(
        [
          `Name: ${name}`,
          `Role: ${role || '—'}`,
          `Organization: ${org}`,
          `Type: ${type || '—'}`,
          '',
          'What they are trying to solve:',
          message || '—'
        ].join('\n')
      );

      // Brief pause so user sees loading state
      await new Promise(r => setTimeout(r, 600));

      // Replace form with success message
      const firstName = name.split(' ')[0] || 'there';
      form.parentElement.innerHTML = `
        <div class="form-success">
          <h3>Thank you, ${escapeHTML(firstName)}.</h3>
          <p>
            Your message is on its way to Ishan. We will respond within
            one working day with an honest first-look — not a pitch.<br/><br/>
            You can also write directly to
            <a href="mailto:ishan@kapoorai.com"
               style="color:var(--violet);font-weight:600">
              ishan@kapoorai.com
            </a>.
          </p>
        </div>`;

      // Open mail client with pre-filled content
      window.location.href =
        `mailto:ishan@kapoorai.com?subject=${subject}&body=${body}`;
    });
  }

  // Minimal XSS protection for the name inserted into DOM
  function escapeHTML (str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
