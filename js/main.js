// Basic interactivity: nav toggle, carousel, back to top, smooth scroll

document.addEventListener('DOMContentLoaded', function () {
  // Nav toggle for small screens
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = btn.closest('.nav') || document.querySelector('.nav');
      nav.classList.toggle('open');
      // Toggle links visibility for mobile
      nav.querySelectorAll('a').forEach(a => a.style.display = nav.classList.contains('open') ? 'inline-block' : '');
    });
  });

  // Carousel
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const slides = carousel.querySelector('.slides');
    const imgs = slides.querySelectorAll('img');
    let idx = 0;

    function show(i){
      slides.style.transform = `translateX(-${i * 100}%)`;
    }
    document.getElementById('next').addEventListener('click', () => {
      idx = (idx + 1) % imgs.length;
      show(idx);
    });
    document.getElementById('prev').addEventListener('click', () => {
      idx = (idx - 1 + imgs.length) % imgs.length;
      show(idx);
    });

    // auto rotate
    setInterval(() => {
      idx = (idx + 1) % imgs.length;
      show(idx);
    }, 4500);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Back to top
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backTop.style.display = 'block';
    else backTop.style.display = 'none';
  });
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
});
