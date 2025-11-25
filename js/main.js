
/* main.js
   - accessible nav toggle
   - carousel with pause-on-hover, keyboard support
   - reveal on scroll using IntersectionObserver
   - back-to-top
*/

document.addEventListener('DOMContentLoaded', () => {
  // NAV TOGGLE
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = document.querySelector('.nav-list');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      // toggle mobile nav
      if (nav) nav.style.display = expanded ? '' : 'flex';
    });
  });


//   // Add near the end of the carousel setup in main.js (inside DOMContentLoaded)
// window.addEventListener('resize', () => {
//   // re-run update() so translateX uses current widths/100% correctly
//   if (typeof update === 'function') {
//     update();
//   } else {
//     // fallback: recalc by toggling transform (works with your existing translateX percentages)
//     const slidesWrap = document.querySelector('.carousel .slides');
//     if (slidesWrap) slidesWrap.style.transform = `translateX(-${index * 100}%)`;
//   }
// });

//   // NAV TOGGLE (improved)
// const toggles = document.querySelectorAll('.nav-toggle');
// const mobileNav = document.querySelector('.nav-list');

// toggles.forEach(btn => {
//   btn.addEventListener('click', (e) => {
//     const expanded = btn.getAttribute('aria-expanded') === 'true';
//     btn.setAttribute('aria-expanded', String(!expanded));

//     if (!mobileNav) return;

//     if (expanded) {
//       // close
//       mobileNav.style.display = '';
//       mobileNav.style.flexDirection = '';
//       mobileNav.classList.remove('open');
//     } else {
//       // open as vertical menu
//       mobileNav.style.display = 'flex';
//       mobileNav.style.flexDirection = 'column';
//       mobileNav.classList.add('open');
//     }
//   });
// });

// // Close mobile menu when clicking outside
// document.addEventListener('click', (e) => {
//   if (!mobileNav) return;
//   const target = e.target;
//   const isOpen = mobileNav.style.display === 'flex' && mobileNav.classList.contains('open');
//   if (!isOpen) return;
//   const inside = mobileNav.contains(target) || target.closest('.nav-toggle') || target.closest('.brand');
//   if (!inside) {
//     mobileNav.style.display = '';
//     mobileNav.classList.remove('open');
//     toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
//   }
// });







  

  // CAROUSEL
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const slidesWrap = carousel.querySelector('.slides');
    const slides = Array.from(slidesWrap.querySelectorAll('img'));
    const prev = carousel.querySelector('#prev');
    const next = carousel.querySelector('#next');
    const dotsWrap = document.getElementById('dots');

    let index = 0;
    let timer = null;
    const interval = 4500;

    // create dots
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Go to slide ${i+1}`);
      btn.addEventListener('click', () => go(i));
      dotsWrap.appendChild(btn);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('button'));

    function update() {
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      update();
      resetTimer();
    }

    function nextSlide() { go(index + 1); }
    function prevSlide() { go(index - 1); }

    if (next) next.addEventListener('click', nextSlide);
    if (prev) prev.addEventListener('click', prevSlide);

    // keyboard controls
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });
    carousel.tabIndex = 0;

    // auto rotate + pause on hover/focus
    function startTimer() {
      timer = setInterval(nextSlide, interval);
    }
    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => startTimer());
    carousel.addEventListener('focusin', () => clearInterval(timer));
    carousel.addEventListener('focusout', () => startTimer());

    // init
    update();
    startTimer();
  }

  // REVEAL ON SCROLL
  const reveal = (els, opts = {}) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-visible');
          observer.unobserve(e.target);
        }
      });
    }, Object.assign({threshold:0.15}, opts));

    els.forEach(el => observer.observe(el));
  };

  const toReveal = Array.from(document.querySelectorAll('.card, blockquote, .about-visual, .hero-left'));
  toReveal.forEach(el => el.classList.add('reveal'));
  reveal(toReveal);

  // BACK TO TOP
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backTop.style.display = 'block';
    else backTop.style.display = 'none';
  });
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Smooth anchor scroll for on-page links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Reduce motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // stop carousel timer immediately
    const timers = window.setInterval(()=>{}, 1000);
    for (let i=0; i<timers; i++) window.clearInterval(i);
  }
});
