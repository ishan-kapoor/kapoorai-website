/* ═══════════════════════════════════════════
   KAPOORAI — script.js
═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Scroll: Nav shadow + active state ──
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── Mobile Menu ──
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Reveal on scroll (IntersectionObserver) ──
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Counter animation for hero stats ──
  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start = performance.now();
    const isFloat = target !== Math.floor(target);

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.hero-stats');
  let statsAnimated = false;

  if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        const nums = statsSection.querySelectorAll('.stat-num');
        const values = [5, 3, 0];
        const suffixes = ['+', '', ''];
        nums.forEach((el, i) => animateCounter(el, values[i], suffixes[i]));
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // ── System items: hover tilt ──
  document.querySelectorAll('.system-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.paddingLeft = '2.8rem';
    });
    item.addEventListener('mouseleave', () => {
      item.style.paddingLeft = '';
    });
  });

  // ── Contact Form ──
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn = form.querySelector('.form-submit');
      const btnText = btn.querySelector('.btn-text');
      const btnLoading = btn.querySelector('.btn-loading');

      // Show loading
      btn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'block';

      // Collect form data
      const data = {
        name: form.name.value,
        role: form.role.value,
        institution: form.institution.value,
        insttype: form.insttype.value,
        problem: form.problem.value,
      };

      // Build mailto body as fallback (since no backend)
      const mailSubject = encodeURIComponent(`KapoorAI Enquiry — ${data.institution}`);
      const mailBody = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Role: ${data.role}\n` +
        `Institution: ${data.institution}\n` +
        `Type: ${data.insttype}\n\n` +
        `Problem:\n${data.problem}`
      );

      // Simulate a brief processing moment, then open mail client
      await new Promise(r => setTimeout(r, 800));

      // Replace form with success message
      const container = form.parentElement;
      container.innerHTML = `
        <div class="form-success">
          <div class="success-icon">✅</div>
          <h3>Message prepared!</h3>
          <p>Your email client will open with the details pre-filled.<br/>
          Or email directly: <a href="mailto:ishan@kapoorai.com" style="color:var(--teal-light)">ishan@kapoorai.com</a></p>
        </div>
      `;

      // Open mail client with pre-filled data
      window.location.href = `mailto:ishan@kapoorai.com?subject=${mailSubject}&body=${mailBody}`;
    });
  }

  // ── Proof cards: stagger on hover ──
  document.querySelectorAll('.proof-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.05}s`;
  });

  // ── Active nav link on scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 100) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ── Subtle parallax on hero orbs ──
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  function handleParallax() {
    const scroll = window.scrollY;
    if (orb1) orb1.style.transform = `translateY(${scroll * 0.15}px)`;
    if (orb2) orb2.style.transform = `translateY(${scroll * 0.08}px)`;
  }

  // Only on non-mobile (perf)
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // ── Before/After section: animated entrance ──
  const baSection = document.querySelector('.before-after');
  if (baSection) {
    const baObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const baCols = baSection.querySelectorAll('.ba-col');
        baCols.forEach((col, i) => {
          col.style.transition = `opacity 0.6s ease ${i * 0.2}s, transform 0.6s ease ${i * 0.2}s`;
        });
        baObserver.unobserve(baSection);
      }
    }, { threshold: 0.3 });
    baObserver.observe(baSection);
  }

  // ── Cursor glow on dark sections ──
  const darkSections = document.querySelectorAll('#proof, #contact, #hero');
  let cursorGlow = null;

  darkSections.forEach(section => {
    section.addEventListener('mousemove', (e) => {
      if (!cursorGlow) {
        cursorGlow = document.createElement('div');
        cursorGlow.style.cssText = `
          position: fixed;
          pointer-events: none;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,168,150,.08) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          z-index: 1;
          transition: opacity 0.3s;
        `;
        document.body.appendChild(cursorGlow);
      }
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
      cursorGlow.style.opacity = '1';
    });

    section.addEventListener('mouseleave', () => {
      if (cursorGlow) cursorGlow.style.opacity = '0';
    });
  });

  // ── Page load: stagger hero reveals with slight delay ──
  document.addEventListener('DOMContentLoaded', () => {
    const heroReveals = document.querySelectorAll('#hero .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
  });

  // If DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    const heroReveals = document.querySelectorAll('#hero .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
  }

})();
