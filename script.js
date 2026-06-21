(function () {
  'use strict';

  // Sticky header shadow
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 8
      ? '0 2px 16px rgba(26,43,74,.08)'
      : 'none';
  }, { passive: true });

  // Mobile menu
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  // Create mobile nav clone
  const mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';
  mobileNav.id = 'mobileNav';
  mobileNav.innerHTML = `
    <a href="#problem">The Problem</a>
    <a href="#services">What We Do</a>
    <a href="#proof">Our Work</a>
    <a href="#process">Process</a>
    <a href="#contact" class="mob-btn">Talk to Us</a>
  `;
  header.appendChild(mobileNav);

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });

  // Fade-up on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // slight stagger for siblings
        const siblings = entry.target.parentElement.querySelectorAll('.fade-up:not(.visible)');
        siblings.forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 70);
        });
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Trigger hero immediately
  setTimeout(() => {
    document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 80 + i * 100);
    });
  }, 60);

  // Contact form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      const label = btn.querySelector('.btn-label');
      const spin = btn.querySelector('.btn-spin');

      btn.disabled = true;
      label.style.display = 'none';
      spin.style.display = 'inline';

      const d = {
        name: form.name.value,
        role: form.role.value,
        institution: form.institution.value,
        type: form.type.value,
        message: form.message.value,
      };

      const subject = encodeURIComponent(`KapoorAI Enquiry — ${d.institution}`);
      const body = encodeURIComponent([
        `Name: ${d.name}`,
        `Role: ${d.role}`,
        `Institution: ${d.institution}`,
        `Type: ${d.type}`,
        ``,
        `Message:`,
        d.message
      ].join('\n'));

      await new Promise(r => setTimeout(r, 600));

      form.parentElement.innerHTML = `
        <div class="form-success">
          <h3>Thank you, ${d.name.split(' ')[0]}.</h3>
          <p>Your message has been prepared. Your email client should open now with everything pre-filled.<br/>
          You can also write directly to <a href="mailto:ishan@kapoorai.com" style="color:var(--blue)">ishan@kapoorai.com</a>.</p>
        </div>`;

      window.location.href = `mailto:ishan@kapoorai.com?subject=${subject}&body=${body}`;
    });
  }

})();
