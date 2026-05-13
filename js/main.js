/* =========================================================
   Dra. Maria Paula Bustamante — interactions
   ========================================================= */

(() => {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');

  // --- Sticky nav background on scroll ---
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile drawer ---
  const closeDrawer = () => {
    burger.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    drawer.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // --- Revelación de elementos al hacer scroll (Intersection Observer) ---
  // Añade la clase 'is-in' a los elementos con '.reveal' cuando entran al viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // --- Efecto Parallax sutil en la imagen del Hero ---
  // Solo se activa en pantallas grandes para no afectar rendimiento móvil
  const heroImg = document.querySelector('.hero__media img');
  if (heroImg && window.matchMedia('(min-width: 768px)').matches) {
    let raf = null;
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroImg.style.transform = `scale(1) translateY(${y * 0.18}px)`;
        }
        raf = null;
      });
    }, { passive: true });
  }
})();
