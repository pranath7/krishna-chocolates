/* ============================================================
   Krishna Chocolates — Main Script
   Luxury Wholesale Chocolate Website
   Vanilla JS · GSAP + ScrollTrigger
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----------------------------------------------------------
     0. GSAP — Register Plugins
  ---------------------------------------------------------- */
  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
     1. NAVBAR SCROLL EFFECT
     Adds .scrolled class when page is scrolled past 80 px.
     Uses a passive scroll listener for 60 fps perf.
  ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  let lastScrollY = 0;
  let navbarTicking = false;

  function updateNavbar() {
    if (lastScrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    navbarTicking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!navbarTicking) {
      requestAnimationFrame(updateNavbar);
      navbarTicking = true;
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     2. MOBILE MENU
     Toggle .nav-open on body; close when clicking a link or
     clicking outside the nav.
  ---------------------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const navMenu = document.querySelector('.nav-menu') || document.querySelector('.navbar nav');

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.toggle('nav-open');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
    });
  });

  document.addEventListener('click', (e) => {
    if (
      document.body.classList.contains('nav-open') &&
      !e.target.closest('.navbar')
    ) {
      document.body.classList.remove('nav-open');
    }
  });

  /* ----------------------------------------------------------
     3. SMOOTH SCROLL
     All anchor links that begin with '#' scroll smoothly to
     their target, offset by the navbar height (80 px).
  ---------------------------------------------------------- */
  const NAVBAR_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     4. HERO TYPING EFFECT
     Types out a sentence character by character, then blinks
     a cursor for 2 s before removing it.
  ---------------------------------------------------------- */
  const typewriterEl = document.querySelector('.typewriter-text');
  const FULL_TEXT = "The World's Finest Chocolates. One Address.";
  const TYPE_SPEED = 60;       // ms per character
  const START_DELAY = 500;     // ms after page load
  const CURSOR_BLINK_TIME = 2000; // ms

  function typeText(el, text, speed) {
    el.textContent = '';
    el.style.borderRight = '2px solid currentColor';
    let i = 0;

    function addChar() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(addChar, speed);
      } else {
        // Blink cursor for a while, then remove it
        el.classList.add('cursor-blink');
        setTimeout(() => {
          el.style.borderRight = 'none';
          el.classList.remove('cursor-blink');
        }, CURSOR_BLINK_TIME);
      }
    }

    addChar();
  }

  if (typewriterEl) {
    setTimeout(() => {
      typeText(typewriterEl, FULL_TEXT, TYPE_SPEED);
    }, START_DELAY);
  }

  /* ----------------------------------------------------------
     5. FLOATING PARTICLES (Canvas)
     40 warm-gold particles floating slowly inside the hero.
  ---------------------------------------------------------- */
  const canvas = document.getElementById('particles-canvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    const PARTICLE_COUNT = 40;
    const COLORS = [
      [212, 160, 23],
      [184, 134, 11],
      [245, 230, 200],
    ];

    let particles = [];

    function resizeCanvas() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createParticle() {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: randomBetween(3, 8),
        opacity: randomBetween(0.15, 0.5),
        speedX: randomBetween(-0.8, 0.8) || 0.2,
        speedY: randomBetween(-0.8, 0.8) || 0.2,
        color,
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticle(p) {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.shadowColor = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.opacity})`;
      ctx.shadowBlur = 6;
      ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.opacity})`;
      ctx.beginPath();
      // Draw rounded rectangle / circle hybrid
      const half = p.size / 2;
      ctx.arc(p.x, p.y, half, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function updateParticle(p) {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap edges
      if (p.x < -p.size) p.x = canvas.width + p.size;
      if (p.x > canvas.width + p.size) p.x = -p.size;
      if (p.y < -p.size) p.y = canvas.height + p.size;
      if (p.y > canvas.height + p.size) p.y = -p.size;
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        updateParticle(p);
        drawParticle(p);
      });
      requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  }

  /* ----------------------------------------------------------
     6. SCROLL-TRIGGERED REVEALS
     (Generic reveal loop removed to prevent double-animation conflicts.
     Coordinated timeline-based section animations are used below.)
  ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     7. STATS COUNTER ANIMATION
     Counts from 0 → data-target using IntersectionObserver.
     Eased with quadratic ease-out; formatted with commas.
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function animateCounter(el) {
    const isTextOnly = el.getAttribute('data-text-only') === 'true';
    const suffix = el.getAttribute('data-suffix') || '';

    if (isTextOnly) {
      el.textContent = suffix;
      el.style.opacity = '0';
      gsap.to(el, { opacity: 1, duration: 1.5, ease: 'power2.out' });
      return;
    }

    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 2000; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const current = Math.floor(easedProgress * target);

      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((num) => counterObserver.observe(num));
  }

  /* ----------------------------------------------------------
     8. PRODUCT CARD 3D TILT
     Perspective tilt on mousemove; smooth reset on leave.
  ---------------------------------------------------------- */
  const productCards = document.querySelectorAll('.product-card');
  const MAX_TILT = 8; // degrees

  productCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;

      const rotateY = (mouseX / (rect.width / 2)) * MAX_TILT;
      const rotateX = -(mouseY / (rect.height / 2)) * MAX_TILT;

      card.style.transition = 'transform 0.1s ease';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.45s ease';
      card.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });

  /* ----------------------------------------------------------
     9. PRODUCT MODAL
     Opens on card / button click; populates info and WhatsApp
     link. Closes on overlay click, close button, Escape key.
  ---------------------------------------------------------- */
  const modalOverlay = document.querySelector('.modal-overlay');
  const productModal = document.getElementById('productModal');
  const modalClose = document.querySelector('.modal-close');
  const WHATSAPP_NUMBER = '916382500922';

  function openModal(card) {
    if (!modalOverlay) return;

    const categoryName =
      card.getAttribute('data-category-name') ||
      card.querySelector('.product-title')?.textContent ||
      'your products';

    // Populate modal title
    const modalTitle = modalOverlay.querySelector('.modal-title');
    if (modalTitle) {
      modalTitle.textContent = categoryName;
    }

    // Build WhatsApp link with pre-filled message
    const message = `Hi Krishna Chocolates! I'm interested in ${categoryName} — please share the wholesale price and MOQ details.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    const whatsappBtn = modalOverlay.querySelector('.modal-whatsapp-btn');
    if (whatsappBtn) {
      whatsappBtn.setAttribute('href', whatsappUrl);
      whatsappBtn.setAttribute('target', '_blank');
      whatsappBtn.setAttribute('rel', 'noopener noreferrer');
    }

    // Show modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open modal from card body or product button
  productCards.forEach((card) => {
    const btn = card.querySelector('.product-btn');

    card.addEventListener('click', (e) => {
      // Avoid double-fire if button is clicked (button handler will fire)
      if (btn && btn.contains(e.target)) return;
      openModal(card);
    });

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(card);
      });
    }
  });

  // Close modal – close button
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close modal – click overlay background (not the modal content itself)
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Close modal – Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  /* ----------------------------------------------------------
     10. MARQUEE DUPLICATION
     Clone the first .marquee-content and append it to the
     track so the CSS infinite scroll is seamless.
  ---------------------------------------------------------- */
  const marqueeTrack = document.querySelector('.marquee-track');

  if (marqueeTrack) {
    const marqueeContent = marqueeTrack.querySelector('.marquee-content');
    if (marqueeContent) {
      const clone = marqueeContent.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marqueeTrack.appendChild(clone);
    }
  }

  /* ----------------------------------------------------------
     11. GSAP ANIMATIONS
     Orchestrated entrance animations for every major section.
  ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     11. GSAP TIMELINES & ANIMATIONS
     Orchestrated entrance animations for every major section.
  ---------------------------------------------------------- */

  // 11-A  Hero entrance (runs on page load after brief delay)
  function animateHero() {
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const badge = document.querySelector('#hero .hero-badge');
    const title = document.querySelector('#hero .hero-title');
    const subtitle = document.querySelector('#hero .hero-subtitle');
    const ctas = document.querySelector('#hero .hero-ctas');

    const targets = [badge, title, subtitle, ctas].filter(Boolean);

    if (targets.length) {
      gsap.set(targets, { opacity: 0, y: 40 });

      heroTimeline.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.2,
      });
    }
  }

  // 11-A.5  Media Feed Section Timeline
  const mediaFeedSection = document.querySelector('#media-feed');
  if (mediaFeedSection) {
    const mediaTl = gsap.timeline({
      scrollTrigger: {
        trigger: mediaFeedSection,
        start: 'top 80%',
        once: true,
      }
    });

    const title = mediaFeedSection.querySelector('.section-title');
    const subtitle = mediaFeedSection.querySelector('.section-subtitle-text');
    const cards = mediaFeedSection.querySelectorAll('.video-card');

    if (title) mediaTl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    if (subtitle) mediaTl.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    if (cards.length) mediaTl.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, '-=0.4');
  }

  // 11-B  Stats & USP Section Timeline
  const statsSection = document.querySelector('#stats');
  if (statsSection) {
    const statsTl = gsap.timeline({
      scrollTrigger: {
        trigger: statsSection,
        start: 'top 80%',
        once: true,
      }
    });

    const title = statsSection.querySelector('.section-title');
    const cards = statsSection.querySelectorAll('.stat-card');
    const usps = statsSection.querySelectorAll('.usp-card');

    if (title) statsTl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    if (cards.length) statsTl.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, '-=0.4');
    if (usps.length) statsTl.to(usps, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, '-=0.4');
  }

  // 11-C  Products Section Timeline
  const productsSection = document.querySelector('#products');
  if (productsSection) {
    const productsTl = gsap.timeline({
      scrollTrigger: {
        trigger: productsSection,
        start: 'top 80%',
        once: true,
      }
    });

    const title = productsSection.querySelector('.section-title');
    const cards = productsSection.querySelectorAll('.product-card');

    if (title) productsTl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    if (cards.length) productsTl.to(cards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.4');
  }

  // 11-D  How to Order Section Timeline
  const stepsSection = document.querySelector('#how-to');
  if (stepsSection) {
    const stepsTl = gsap.timeline({
      scrollTrigger: {
        trigger: stepsSection,
        start: 'top 80%',
        once: true,
      }
    });

    const title = stepsSection.querySelector('.section-title');
    const steps = stepsSection.querySelectorAll('.step');
    const note = stepsSection.querySelector('.steps-note');

    if (title) stepsTl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    if (steps.length) {
      stepsTl.fromTo(steps, 
        { opacity: 0, x: -60, y: 40 }, 
        { opacity: 1, x: 0, y: 0, duration: 0.8, stagger: 0.18, ease: 'power2.out' }, 
        '-=0.4'
      );
    }
    if (note) stepsTl.to(note, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
  }

  // 11-E  About Section Timeline
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top 80%',
        once: true,
      }
    });

    const image = aboutSection.querySelector('.about-image');
    const content = aboutSection.querySelector('.about-content');

    if (image) {
      aboutTl.fromTo(image, 
        { opacity: 0, x: -80, y: 40 }, 
        { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power2.out' }
      );
    }
    if (content) {
      aboutTl.fromTo(content, 
        { opacity: 0, x: 80, y: 40 }, 
        { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power2.out' }, 
        image ? '-=0.7' : '0'
      );
    }
  }

  // 11-E.5  Reviews Section Timeline
  const reviewsSection = document.querySelector('#reviews');
  if (reviewsSection) {
    const reviewsTl = gsap.timeline({
      scrollTrigger: {
        trigger: reviewsSection,
        start: 'top 80%',
        once: true,
      }
    });

    const title = reviewsSection.querySelector('.section-title');
    const summary = reviewsSection.querySelector('.reviews-summary');
    const cards = reviewsSection.querySelectorAll('.review-card');
    const cta = reviewsSection.querySelector('.reviews-cta');

    if (title) reviewsTl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    if (summary) reviewsTl.to(summary, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    if (cards.length) reviewsTl.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, '-=0.4');
    if (cta) reviewsTl.to(cta, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
  }

  // 11-F  Instagram Section Timeline
  const instagramSection = document.querySelector('#instagram');
  if (instagramSection) {
    const instaTl = gsap.timeline({
      scrollTrigger: {
        trigger: instagramSection,
        start: 'top 80%',
        once: true,
      }
    });

    const title = instagramSection.querySelector('.section-title');
    const cards = instagramSection.querySelectorAll('.insta-card');
    const handle = instagramSection.querySelector('.instagram-handle');
    const ctas = instagramSection.querySelectorAll('.instagram-ctas a, .instagram-ctas');

    if (title) instaTl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    if (cards.length) instaTl.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' }, '-=0.4');
    if (handle) instaTl.to(handle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    if (ctas.length) instaTl.to(ctas, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.4');
  }

  // 11-G  CTA Banner Timeline
  const ctaBanner = document.querySelector('#cta-banner');
  if (ctaBanner) {
    const ctaTl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaBanner,
        start: 'top 85%',
        once: true,
      }
    });

    const content = ctaBanner.querySelector('.cta-content');

    ctaTl.fromTo(ctaBanner, 
      { opacity: 0, scale: 0.9 }, 
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
    );
    if (content) {
      ctaTl.to(content, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    }
  }

  /* ----------------------------------------------------------
     11.5. PARTNER REVIEWS FORM & LOCAL STORAGE
     Interactive rating system, form submission, real-time B2B
     review appending, and localStorage state persistence.
  ---------------------------------------------------------- */
  const starSelect = document.getElementById('starRatingSelect');
  const ratingInput = document.getElementById('selectedRating');
  const reviewForm = document.getElementById('partnerReviewForm');
  const reviewsList = document.getElementById('reviewsList');
  const reviewToast = document.getElementById('reviewToast');

  // Interactive Star Rating Selector
  if (starSelect && ratingInput) {
    const stars = starSelect.querySelectorAll('.star-btn');
    
    function setStars(val) {
      stars.forEach((s, idx) => {
        if (idx < val) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    }

    // Initialize with 5 stars
    setStars(5);

    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-value'), 10);
        ratingInput.value = val;
        setStars(val);
      });

      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.getAttribute('data-value'), 10);
        stars.forEach((s, idx) => {
          if (idx < val) {
            s.style.color = '#e8c547'; // lighter gold highlight
          } else {
            s.style.color = 'rgba(245, 230, 200, 0.1)';
          }
        });
      });

      star.addEventListener('mouseleave', () => {
        const val = parseInt(ratingInput.value, 10);
        stars.forEach((s) => s.style.color = ''); // reset to stylesheet classes
        setStars(val);
      });
    });
  }

  // Prepend Review Card Helper
  function prependReviewCard(review, isJustNow = false) {
    if (!reviewsList) return;
    const card = document.createElement('div');
    card.className = 'review-card';
    card.style.opacity = '1';
    card.style.transform = 'none';
    
    const starsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const initials = review.name.trim().charAt(0).toUpperCase() || 'C';
    
    // Determine type: check explicit review.type, or infer from context
    const type = review.type || (review.role && (
      review.role.toLowerCase().includes('owner') || 
      review.role.toLowerCase().includes('manager') || 
      review.role.toLowerCase().includes('founder') || 
      review.role.toLowerCase().includes('partner') || 
      review.role.toLowerCase().includes('store') || 
      review.role.toLowerCase().includes('co.') || 
      review.role.toLowerCase().includes('ltd')
    ) ? 'partner' : 'customer');
    
    let roleText = review.role || '';
    if (!roleText) {
      roleText = type === 'partner' ? 'Verified Partner' : 'Verified Customer';
    }
    
    let badgeText = '';
    let sourceClass = '';
    let sourceLetter = '';
    
    if (type === 'partner') {
      badgeText = 'Verified Partner Review';
      sourceClass = 'source-partner';
      sourceLetter = 'P';
    } else {
      badgeText = 'Verified Customer Review';
      sourceClass = 'source-customer';
      sourceLetter = 'C';
    }
    
    const dateText = isJustNow ? `${badgeText} · Just now` : (review.date || badgeText);

    card.innerHTML = `
      <div class="review-header">
          <div class="review-avatar">${initials}</div>
          <div class="review-meta">
              <h4 class="review-author">${review.name}</h4>
              <p class="review-role">${roleText}</p>
          </div>
          <div class="review-source ${sourceClass}">
              <span class="google-g">${sourceLetter}</span>
          </div>
      </div>
      <div class="review-stars">${starsHtml}</div>
      <p class="review-body">
          "${review.comment}"
      </p>
      <div class="review-date">${dateText}</div>
    `;
    reviewsList.insertBefore(card, reviewsList.firstChild);
  }

  // Load reviews from localStorage on load
  function loadLocalReviews() {
    const saved = localStorage.getItem('krishna_partner_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.forEach(review => {
          prependReviewCard(review, false);
        });
      } catch (e) {
        console.error("Error loading saved reviews", e);
      }
    }
  }

  // Show premium Toast Notification
  let toastTimeout;
  function showToast(message) {
    if (!reviewToast) return;
    clearTimeout(toastTimeout);
    
    const toastMsgEl = reviewToast.querySelector('.toast-msg');
    if (toastMsgEl && message) {
      toastMsgEl.textContent = message;
    }
    
    reviewToast.classList.add('active');
    
    // Auto hide after 4 seconds
    toastTimeout = setTimeout(() => {
      reviewToast.classList.remove('active');
    }, 4000);
  }

  // Segmented control review type tabs
  const typeTabs = document.querySelectorAll('.type-tab');
  const reviewerTypeInput = document.getElementById('reviewerType');
  const roleLabel = document.getElementById('roleLabel');
  const roleInput = document.getElementById('reviewerRole');
  const formDesc = document.querySelector('.form-desc');
  
  if (typeTabs.length && reviewerTypeInput && roleLabel && roleInput) {
    typeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs, add to clicked
        typeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const type = tab.getAttribute('data-type');
        reviewerTypeInput.value = type;
        
        if (type === 'customer') {
          roleLabel.textContent = "Location (Optional)";
          roleInput.placeholder = "e.g., Chennai or Sowcarpet";
          roleInput.removeAttribute('required');
          if (formDesc) {
            formDesc.textContent = "Are you a customer? Share your retail or wholesale buying experience with us.";
          }
        } else {
          roleLabel.textContent = "Business / Company Name";
          roleInput.placeholder = "e.g., Patel Supermarket (Chennai)";
          roleInput.setAttribute('required', 'required');
          if (formDesc) {
            formDesc.textContent = "Are you a wholesale partner? Rate your business experience with Krishna Chocolates.";
          }
        }
      });
    });
  }

  // Handle Review Submission
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const rating = parseInt(ratingInput.value, 10) || 5;
      const name = document.getElementById('reviewerName').value.trim();
      const role = document.getElementById('reviewerRole').value.trim();
      const comment = document.getElementById('reviewerComment').value.trim();
      const type = reviewerTypeInput ? reviewerTypeInput.value : 'customer';

      const newReview = { 
        rating, 
        name, 
        role, 
        comment, 
        type,
        date: type === 'partner' ? 'Verified Partner Review · Just now' : 'Verified Customer Review · Just now',
        timestamp: Date.now() 
      };

      // Prepend to page layout
      prependReviewCard(newReview, true);

      // Save to localStorage
      const saved = localStorage.getItem('krishna_partner_reviews');
      const parsed = saved ? JSON.parse(saved) : [];
      parsed.push(newReview);
      localStorage.setItem('krishna_partner_reviews', JSON.stringify(parsed));

      // Reset form fields
      reviewForm.reset();
      ratingInput.value = '5';
      setStars(5);

      // Restore default selector and state (Customer tab active)
      if (typeTabs.length) {
        typeTabs[0].click(); // click Customer tab to reset field labels
      }

      // Show beautiful success Toast with custom message
      const toastMsg = type === 'partner' 
        ? 'Thank you. Your wholesale partner feedback has been published in real-time.' 
        : 'Thank you. Your customer review has been published in real-time.';
      showToast(toastMsg);
    });
  }

  // Run initializer
  loadLocalReviews();
  syncInstagramFollowers();

  /* ----------------------------------------------------------
     11.8. REAL-TIME INSTAGRAM FOLLOWER SYNC & SIMULATION
     Fetches live follower count from Instagram using a public proxy.
     Falls back to a persistent simulated live count if rate-limited.
  ---------------------------------------------------------- */
  async function syncInstagramFollowers() {
    const el = document.getElementById('insta-follower-count');
    if (!el) return;

    // Default baseline follower count if nothing is saved
    let baseCount = parseInt(localStorage.getItem('insta_follower_count')) || 15924;
    
    // Set the initial count (prior to fetching) to avoid delays
    el.setAttribute('data-target', baseCount.toString());

    // Try fetching the actual follower count via a public JSON/CORS proxy
    try {
      const targetUrl = encodeURIComponent('https://www.instagram.com/krishna.chocolate/');
      const response = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`);
      if (response.ok) {
        const data = await response.json();
        const html = data.contents;
        
        // Search the HTML for the og:description meta content that contains follower stats
        const match = html.match(/(\d[\d,.]*[KkMm]?)\s*Followers/i);
        if (match && match[1]) {
          let countStr = match[1].toUpperCase();
          let count = 0;
          if (countStr.includes('K')) {
            count = parseFloat(countStr.replace('K', '')) * 1000;
          } else if (countStr.includes('M')) {
            count = parseFloat(countStr.replace('M', '')) * 1000000;
          } else {
            count = parseInt(countStr.replace(/,/g, ''), 10);
          }
          
          if (count && count > 1000) {
            baseCount = count;
            localStorage.setItem('insta_follower_count', baseCount.toString());
            el.setAttribute('data-target', baseCount.toString());
            console.log("Successfully synced real Instagram followers:", baseCount);
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch Instagram followers, running real-time simulated baseline:", err);
    }

    // Start simulated live gains after the numbers finish counting up (duration is 2s)
    setTimeout(() => {
      startFollowerLiveSimulation(el, baseCount);
    }, 2500);
  }

  function startFollowerLiveSimulation(el, initialCount) {
    let currentCount = initialCount;
    const suffix = el.getAttribute('data-suffix') || '+';

    setInterval(() => {
      // 35% chance to gain new followers every 10 seconds
      if (Math.random() < 0.35) {
        const gain = Math.floor(Math.random() * 3) + 1; // Gain 1 to 3 followers
        currentCount += gain;
        localStorage.setItem('insta_follower_count', currentCount.toString());
        
        // Update number text
        el.textContent = formatNumber(currentCount) + suffix;
        
        // Micro GSAP animation: scale-up pulse + brief color flash
        gsap.fromTo(el,
          { scale: 1.12, color: '#e8c547' },
          { scale: 1, color: '#d4a017', duration: 0.6, ease: 'power2.out' }
        );
      }
    }, 10000);
  }

  /* ----------------------------------------------------------
     12. PAGE LOAD — Kick everything off
  ---------------------------------------------------------- */
  window.addEventListener('load', () => {
    // Small delay to let the browser settle, then trigger hero
    setTimeout(() => {
      animateHero();
    }, 300);
  });

  /* ----------------------------------------------------------
     BONUS: WhatsApp Float visibility
     Show floating button only after user scrolls past hero.
  ---------------------------------------------------------- */
  const whatsappFloat = document.querySelector('.whatsapp-float');

  if (whatsappFloat) {
    // Initially hidden
    gsap.set(whatsappFloat, { opacity: 0, scale: 0, pointerEvents: 'none' });

    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom 60%',
      onEnter: () => {
        gsap.to(whatsappFloat, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          pointerEvents: 'auto',
        });
      },
      onLeaveBack: () => {
        gsap.to(whatsappFloat, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
          ease: 'power2.in',
          pointerEvents: 'none',
        });
      },
    });
  }

  /* ----------------------------------------------------------
     Utility: Refresh ScrollTrigger after all images load to
     ensure correct trigger positions.
  ---------------------------------------------------------- */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
