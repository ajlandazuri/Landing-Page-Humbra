/**
 * HUMBRA — Premium Animation Engine
 * ════════════════════════════════════════════════════════════
 * Tecnologías: GSAP 3 + ScrollTrigger + Lenis Smooth Scroll
 * Estilo: Luxury skincare brand (Aesop / La Mer / Dior Beauty)
 * ════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ─── Detect touch device → disable custom cursor ─── */
  const isTouchDevice = () =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ══════════════════════════════════════════════
     1. LENIS SMOOTH SCROLL
  ══════════════════════════════════════════════ */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 0.9,
    });

    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);

    // Sync GSAP ScrollTrigger with Lenis
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ══════════════════════════════════════════════
     2. SCROLL PROGRESS BAR
  ══════════════════════════════════════════════ */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     3. PREMIUM CUSTOM CURSOR (Dot & Ring Follower)
  ══════════════════════════════════════════════ */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (!isTouchDevice() && cursorDot && cursorRing) {
    document.body.style.cursor = 'none';

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringSpeed = 0.15;
    let dotSpeed = 0.5;

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    gsap.ticker.add(() => {
      // Interpolate dot (fast)
      dotPos.x += (mouse.x - dotPos.x) * dotSpeed;
      dotPos.y += (mouse.y - dotPos.y) * dotSpeed;
      
      // Interpolate ring (lagging)
      ringPos.x += (mouse.x - ringPos.x) * ringSpeed;
      ringPos.y += (mouse.y - ringPos.y) * ringSpeed;
      
      gsap.set(cursorDot, { x: dotPos.x, y: dotPos.y });
      gsap.set(cursorRing, { x: ringPos.x, y: ringPos.y });
    });

    // Hover interactions
    const interactables = 'a, button, .btn, .skin-card, .about-card, .premium-card, .closer-card, .nav-link, input, select';
    
    document.querySelectorAll(interactables).forEach(el => {
      el.addEventListener('mouseenter', () => {
        // Dot hides
        gsap.to(cursorDot, { opacity: 0, duration: 0.2, ease: 'power2.out' });
        
        // Ring expands but stays completely transparent inside to never blur logos/icons
        gsap.to(cursorRing, {
          width: 60,
          height: 60,
          opacity: 1,
          borderColor: '#ffffff',
          backgroundColor: 'transparent',
          duration: 0.4,
          ease: 'power3.out'
        });
        
        if (el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'button' || el.classList.contains('btn')) {
           el.style.cursor = 'none';
        }
      });

      el.addEventListener('mouseleave', () => {
        // Dot returns
        gsap.to(cursorDot, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        
        // Ring returns to normal
        gsap.to(cursorRing, {
          width: 44,
          height: 44,
          opacity: 1,
          borderColor: '#ffffff',
          backgroundColor: 'transparent',
          duration: 0.5,
          ease: 'power3.out'
        });
        
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });

      // Subtle magnetic pull
      el.addEventListener('mousemove', (e) => {
        if (el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'button' || el.classList.contains('btn')) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const moveX = (e.clientX - centerX) * 0.15;
          const moveY = (e.clientY - centerY) * 0.15;
          
          gsap.to(el, { x: moveX, y: moveY, duration: 0.4, ease: 'power2.out' });
        }
      });
    });
  }

  /* ══════════════════════════════════════════════
     4. INITIAL PAGE LOAD
  ══════════════════════════════════════════════ */
  
  function revealPage() {
    document.body.classList.add('page-loaded');
    if (typeof initScrollAnimations === 'function') {
      initScrollAnimations();
    }
  }

  if (document.readyState === 'complete') {
    revealPage();
  } else {
    window.addEventListener('load', revealPage);
  }

  /* ══════════════════════════════════════════════
     5. HERO / HOME SPLASH ANIMATIONS
  ══════════════════════════════════════════════ */
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    // Animate the home identity block
    gsap.fromTo('.home-identity', {
      opacity: 0,
      y: 30,
      scale: 0.97,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.2,
    });

    // Staggered entrance of monogram, brand name, tagline
    gsap.fromTo(
      ['.home-monogram', '.home-brand-name', '.home-brand-tagline', '.home-scroll-indicator'],
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.18,
        delay: 0.4,
      }
    );

    // Slow floating parallax on the background layers
    gsap.to('.home-bg-layer--1', {
      y: '-8%',
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to('.home-bg-layer--2', {
      y: '5%',
      duration: 22,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2,
    });

    // Gentle floating on the monogram
    gsap.to('.home-monogram', {
      y: -12,
      duration: 4.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Glow pulse
    gsap.to('.home-logo-glow', {
      scale: 1.25,
      opacity: 0.55,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Hero section content (shop section)
    gsap.fromTo('.hero-tag', {
      opacity: 0,
      x: -20,
    }, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top 80%',
      },
    });

    gsap.fromTo('.hero-title', {
      opacity: 0,
      y: 35,
    }, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.1,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top 75%',
      },
    });

    gsap.fromTo('.hero-desc', {
      opacity: 0,
      y: 20,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      delay: 0.25,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top 70%',
      },
    });

    // Hero parallax background image
    gsap.to('.hero-section', {
      backgroundPositionY: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  /* ══════════════════════════════════════════════
     6. SCROLL-TRIGGERED REVEALS
  ══════════════════════════════════════════════ */
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: just show everything
      document.querySelectorAll('.anim-fade-up, .anim-fade-left, .anim-fade-right, .anim-scale')
        .forEach(el => el.classList.add('anim-visible'));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    initHeroAnimations();

    // ── Generic section titles ──
    gsap.utils.toArray('.section-title, .eyebrow, .section-subtitle').forEach(el => {
      gsap.fromTo(el, {
        opacity: 0,
        y: 28,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
      });
    });

    // ── Skin Type Cards — stagger ──
    gsap.fromTo('.skin-card', {
      opacity: 0,
      y: 50,
      scale: 0.97,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.skin-type-grid',
        start: 'top 82%',
      },
    });

    // ── Routine Section — slide from sides ──
    gsap.fromTo('.routine-visual', {
      opacity: 0,
      x: -50,
    }, {
      opacity: 1,
      x: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.routine-section',
        start: 'top 78%',
      },
    });

    gsap.fromTo('.routine-content', {
      opacity: 0,
      x: 50,
    }, {
      opacity: 1,
      x: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.1,
      scrollTrigger: {
        trigger: '.routine-section',
        start: 'top 78%',
      },
    });

    gsap.fromTo('.routine-item', {
      opacity: 0,
      x: 20,
    }, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.routine-list',
        start: 'top 85%',
      },
    });

    // ── Benefits Bar ──
    gsap.fromTo('.benefit-item', {
      opacity: 0,
      y: 30,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.benefits-bar',
        start: 'top 88%',
      },
    });

    // ── About Section ──
    gsap.fromTo('.about-header', {
      opacity: 0,
      y: 35,
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
      },
    });

    gsap.fromTo('.about-card--left', {
      opacity: 0,
      x: -40,
      y: 30,
    }, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-gallery',
        start: 'top 82%',
      },
    });

    gsap.fromTo('.about-card--center', {
      opacity: 0,
      y: 50,
    }, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.1,
      scrollTrigger: {
        trigger: '.about-gallery',
        start: 'top 82%',
      },
    });

    gsap.fromTo('.about-card--right', {
      opacity: 0,
      x: 40,
      y: 30,
    }, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2,
      scrollTrigger: {
        trigger: '.about-gallery',
        start: 'top 82%',
      },
    });

    // Subtle parallax on about images
    gsap.utils.toArray('.about-card-img').forEach(img => {
      gsap.to(img, {
        y: '-10%',
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.about-card'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    });

    // ── Promise Section ──
    gsap.fromTo('.promise-quote', {
      opacity: 0,
      y: 25,
    }, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.promise-section',
        start: 'top 80%',
      },
    });

    gsap.fromTo('.promise-card', {
      opacity: 0,
      y: 40,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.13,
      scrollTrigger: {
        trigger: '.promise-grid',
        start: 'top 84%',
      },
    });

    // ── Closer Section ──
    gsap.fromTo('.closer-card', {
      opacity: 0,
      y: 45,
      scale: 0.96,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.closer-grid',
        start: 'top 84%',
      },
    });

    // ── Footer ──
    gsap.fromTo('footer', {
      opacity: 0,
      y: 30,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: 'footer',
        start: 'top 90%',
      },
    });
  }

  /* ══════════════════════════════════════════════
     7. NAV LINK MAGNETIC + UNDERLINE ANIMATION
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
      gsap.to(this, {
        y: -2,
        duration: 0.25,
        ease: 'power2.out',
      });
    });
    link.addEventListener('mouseleave', function () {
      gsap.to(this, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });

  /* ══════════════════════════════════════════════
     8. BUTTON MAGNETIC + RIPPLE EFFECTS
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top  = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });

    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.18,
        y: y * 0.18,
        duration: 0.35,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', function () {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });

  /* ══════════════════════════════════════════════
     9. MOBILE MENU — STAGGER ANIMATION
  ══════════════════════════════════════════════ */
  const hamburger   = document.getElementById('hamburger-menu');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (hamburger && mobileDrawer) {
    const origClick = hamburger.onclick;
    hamburger.addEventListener('click', () => {
      // Stagger mobile nav links on open
      setTimeout(() => {
        if (mobileDrawer.classList.contains('active')) {
          gsap.fromTo('.mobile-nav-link', {
            opacity: 0,
            x: -30,
          }, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.08,
          });
        }
      }, 80);
    });
  }

  /* ══════════════════════════════════════════════
     10. FLOATING AMBIENT BLOBS (CSS-driven, JS-enhanced)
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.about-blob, .skin-type-section::before').forEach((blob, i) => {
    gsap.to(blob, {
      x: i % 2 === 0 ? 20 : -20,
      y: i % 2 === 0 ? 15 : -15,
      duration: 8 + i * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  /* ══════════════════════════════════════════════
     11. PROMISE ICON HOVER BOUNCE
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.promise-card').forEach(card => {
    const icon = card.querySelector('.promise-icon');
    if (!icon) return;
    card.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        y: -6,
        scale: 1.12,
        duration: 0.35,
        ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });

  /* ══════════════════════════════════════════════
     12. CLOSER SECTION CARD ICON HOVER
  ══════════════════════════════════════════════ */
  document.querySelectorAll('.closer-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card.querySelector('svg'), {
        scale: 1.15,
        rotate: 5,
        duration: 0.35,
        ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('svg'), {
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });

})();
