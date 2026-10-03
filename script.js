/**
 * Abhishek Pal — Gameplay & Cinematic Animator Portfolio
 * AAA Cinematic Animation System & Interactive Engine
 * 60 FPS Performance Optimized
 */

(function () {
  'use strict';

  // Check accessibility reduced-motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. INITIALIZATION & CINEMATIC HERO ENTRANCE SEQUENCE
     ========================================================================== */

  // Smooth cinematic entrance sequence (~1.2s total duration)
  window.addEventListener('DOMContentLoaded', () => {
    // Two RAF ticks guarantee styles and DOM are fully painted before starting sequence
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('is-loading');
      });
    });
  });

  /* ==========================================================================
     2. MOBILE MENU & HEADER SCROLL BEHAVIOR
     ========================================================================== */

  const menu = document.querySelector('.menu');
  const nav = document.querySelector('#nav');
  const header = document.querySelector('#site-header');

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header glass elevation on scroll
  let lastScrollY = window.scrollY;
  let tickingScroll = false;

  function updateHeaderOnScroll() {
    const currentScrollY = window.scrollY;
    if (header) {
      if (currentScrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    tickingScroll = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!tickingScroll) {
      requestAnimationFrame(updateHeaderOnScroll);
      tickingScroll = true;
    }
  }, { passive: true });

  /* ==========================================================================
     3. INTERACTIVE 3D PARALLAX & ATMOSPHERIC CANVAS ENGINE
     ========================================================================== */

  const canvas = document.getElementById('bg-canvas');
  let ctx = null;
  let isCanvasActive = false;
  let animFrameId = null;

  // Mouse & Parallax tracking
  const mouse = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.5,
    normX: 0,
    normY: 0,
    targetNormX: 0,
    targetNormY: 0,
    isHovered: false
  };

  if (canvas && !prefersReducedMotion) {
    ctx = canvas.getContext('2d', { alpha: true });
    isCanvasActive = true;
  }

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for 60 FPS performance
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  }, { passive: true });

  resizeCanvas();

  // Atmospheric Particles Setup
  const PARTICLE_COUNT = 65;
  const particles = [];

  class AtmosphericParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * (width || window.innerWidth);
      this.y = initial ? Math.random() * (height || window.innerHeight) : (height || window.innerHeight) + 20;
      
      // Multi-layer depth: 0 = Far/Dust (slow), 1 = Mid/Floating mote, 2 = Near/Light streak
      const rand = Math.random();
      if (rand < 0.60) {
        // Layer 0: Subtle atmospheric dust
        this.layer = 0;
        this.radius = 0.7 + Math.random() * 0.8;
        this.baseAlpha = 0.12 + Math.random() * 0.22;
        this.vy = -(0.18 + Math.random() * 0.25);
        this.vx = (Math.random() - 0.5) * 0.2;
        this.parallaxFactor = 0.015;
        this.color = 'rgba(180, 215, 245,';
      } else if (rand < 0.90) {
        // Layer 1: Warm chartreuse floating ember/mote
        this.layer = 1;
        this.radius = 1.2 + Math.random() * 1.1;
        this.baseAlpha = 0.22 + Math.random() * 0.32;
        this.vy = -(0.25 + Math.random() * 0.35);
        this.vx = (Math.random() - 0.5) * 0.35;
        this.parallaxFactor = 0.035;
        this.color = 'rgba(215, 255, 67,';
      } else {
        // Layer 2: Near subtle light streak mote
        this.layer = 2;
        this.radius = 1.8 + Math.random() * 1.2;
        this.baseAlpha = 0.18 + Math.random() * 0.28;
        this.vy = -(0.35 + Math.random() * 0.45);
        this.vx = (Math.random() - 0.5) * 0.4;
        this.parallaxFactor = 0.06;
        this.color = 'rgba(120, 210, 255,';
      }

      this.alpha = this.baseAlpha;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.015 + Math.random() * 0.025;
      this.deflectX = 0;
      this.deflectY = 0;
    }

    update() {
      // Natural organic floating movement
      this.y += this.vy;
      this.x += this.vx;

      // Pulse breathing
      this.pulsePhase += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulsePhase) * (this.baseAlpha * 0.3);

      // Smooth interaction with mouse cursor
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelDist = 90;

      if (dist < repelDist && dist > 0) {
        const force = (1 - dist / repelDist) * 1.2;
        this.deflectX += (dx / dist) * force;
        this.deflectY += (dy / dist) * force;
      }

      // Smoothly return deflection to zero (damped spring)
      this.deflectX *= 0.92;
      this.deflectY *= 0.92;

      // Screen wrap-around
      if (this.y < -20) {
        this.reset(false);
      }
      if (this.x < -30) this.x = (width || window.innerWidth) + 20;
      if (this.x > (width || window.innerWidth) + 30) this.x = -20;
    }

    draw() {
      if (!ctx) return;
      // Multi-layer parallax coordinate calculation
      const px = this.x + this.deflectX - mouse.normX * (this.parallaxFactor * width);
      const py = this.y + this.deflectY - mouse.normY * (this.parallaxFactor * height);

      ctx.beginPath();
      ctx.arc(px, py, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${Math.max(0, Math.min(1, this.alpha))})`;
      ctx.fill();

      // Subtle soft glow for near layer
      if (this.layer === 2) {
        ctx.beginPath();
        ctx.arc(px, py, this.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${this.alpha * 0.25})`;
        ctx.fill();
      }
    }
  }

  // Populate particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new AtmosphericParticle());
  }

  // 3 Subtle Cinematic Volumetric Light Streaks
  const lightSweeps = [
    { x: 0.2, y: 0.3, radius: 450, color: 'rgba(56, 189, 248, 0.035)', angle: 0, speed: 0.003 },
    { x: 0.8, y: 0.6, radius: 500, color: 'rgba(215, 255, 67, 0.025)', angle: 1.5, speed: 0.0025 },
    { x: 0.5, y: 0.8, radius: 400, color: 'rgba(99, 102, 241, 0.02)', angle: 3, speed: 0.002 }
  ];

  function renderAtmosphere() {
    if (!ctx || !isCanvasActive) return;

    // Smooth inertia interpolation for mouse parallax
    mouse.normX += (mouse.targetNormX - mouse.normX) * 0.045;
    mouse.normY += (mouse.targetNormY - mouse.normY) * 0.045;
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw cinematic soft light sweeps
    for (let i = 0; i < lightSweeps.length; i++) {
      const sweep = lightSweeps[i];
      sweep.angle += sweep.speed;
      const offsetX = Math.cos(sweep.angle) * 50 - mouse.normX * 35;
      const offsetY = Math.sin(sweep.angle) * 35 - mouse.normY * 25;
      const lx = sweep.x * width + offsetX;
      const ly = sweep.y * height + offsetY;

      const gradient = ctx.createRadialGradient(lx, ly, 0, lx, ly, sweep.radius);
      gradient.addColorStop(0, sweep.color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(lx, ly, sweep.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw and update atmospheric motes & dust
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animFrameId = requestAnimationFrame(renderAtmosphere);
  }

  // Handle window visibility to save 100% CPU when tab is inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    } else {
      if (!animFrameId && isCanvasActive) {
        animFrameId = requestAnimationFrame(renderAtmosphere);
      }
    }
  });

  if (isCanvasActive) {
    animFrameId = requestAnimationFrame(renderAtmosphere);
  }

  /* ==========================================================================
     4. MOUSE TRACKING & PRECISION HUD DUAL CURSOR
     ========================================================================== */

  const cursorGlow = document.querySelector('.cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let curRingX = -500, curRingY = -500;
  let curDotX = -500, curDotY = -500;
  let curGlowX = -500, curGlowY = -500;

  function updateCursorFrame() {
    if (!prefersReducedMotion && cursorDot && cursorRing) {
      // Spring damping lerp
      curDotX += (mouse.targetX - curDotX) * 0.75;
      curDotY += (mouse.targetY - curDotY) * 0.75;

      curRingX += (mouse.targetX - curRingX) * 0.18;
      curRingY += (mouse.targetY - curRingY) * 0.18;

      cursorDot.style.transform = `translate3d(${curDotX}px, ${curDotY}px, 0)`;
      cursorRing.style.transform = `translate3d(${curRingX}px, ${curRingY}px, 0)`;

      if (cursorGlow) {
        curGlowX += (mouse.targetX - curGlowX) * 0.08;
        curGlowY += (mouse.targetY - curGlowY) * 0.08;
        cursorGlow.style.transform = `translate3d(${curGlowX}px, ${curGlowY}px, 0)`;
      }
    }
    requestAnimationFrame(updateCursorFrame);
  }

  requestAnimationFrame(updateCursorFrame);

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    // Normalized coordinates from -1 to 1 for parallax
    mouse.targetNormX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetNormY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.targetNormX = 0;
    mouse.targetNormY = 0;
    if (cursorDot) cursorDot.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
    if (cursorGlow) cursorGlow.style.opacity = '0';
  });

  window.addEventListener('mouseenter', () => {
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
    if (cursorGlow) cursorGlow.style.opacity = '1';
  });

  // Reticle hover targets
  const interactiveElements = document.querySelectorAll('a, button, .tilt-card, .skill, .award, input, textarea');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  /* ==========================================================================
     5. 3D CARD TILT & SPECULAR GLARE (AAA GAME MENU FEEL)
     ========================================================================== */

  const tiltCards = document.querySelectorAll('.tilt-card');

  if (!prefersReducedMotion) {
    tiltCards.forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        // Normalized coordinates between -0.5 and 0.5
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle 3D tilt (max 5 degrees)
        const rotateX = -py * 7;
        const rotateY = px * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        
        // Specular glare position
        card.style.setProperty('--glare-x', `${((px + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--glare-y', `${((py + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--glare-opacity', '1');
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        card.style.setProperty('--glare-opacity', '0');
      });
    });
  }

  /* ==========================================================================
     6. MAGNETIC BUTTON MICRO-INTERACTIONS
     ========================================================================== */

  const magneticButtons = document.querySelectorAll('.magnetic');

  if (!prefersReducedMotion) {
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Subtly pull toward cursor (max 4.5px offset)
        const deltaX = Math.max(-5, Math.min(5, (e.clientX - centerX) * 0.22));
        const deltaY = Math.max(-4, Math.min(4, (e.clientY - centerY) * 0.22));

        btn.style.transform = `translate3d(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     7. SCROLL-TRIGGERED PROGRESSIVE REVEALS
     ========================================================================== */

  const revealElements = document.querySelectorAll('.section, .reel-card, .project, .skill, .timeline-item, .awards div');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* ==========================================================================
     8. ACTIVE NAVIGATION TRACKING
     ========================================================================== */

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35
  });

  sections.forEach(section => sectionObserver.observe(section));

  /* ==========================================================================
     9. LOCAL FILE PROTOCOL FALLBACK FOR PRODUCTION REEL
     ========================================================================== */

  if (window.location.protocol === 'file:') {
    const ytFrame = document.querySelector('#yt-frame');
    if (ytFrame) {
      ytFrame.innerHTML = `
        <a class="video-facade" href="https://youtu.be/LmCWOYdL8-A" target="_blank" rel="noopener" title="Watch Abhishek Pal Production Reel on YouTube">
          <img src="assets/production-reel-thumb.jpg" alt="Abhishek Pal Production Reel Preview">
          <div class="facade-overlay">
            <div class="facade-play">▶</div>
            <span class="facade-title">Watch Production Reel on YouTube ↗</span>
            <span class="facade-hint">Local file preview (file://). Embed plays in-page on live site or run preview.bat</span>
          </div>
        </a>
      `;
    }
  }

})();
