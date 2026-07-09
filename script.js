// ── CAROUSEL ────────────────────────────────────────────
const track = document.getElementById('carouselTrack');
const slides = track.querySelectorAll('.carousel-slide');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let current = 0;
let autoplayTimer;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('carousel-dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function goTo(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
  resetAutoplay();
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

let startX = 0;
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
track.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
});

function resetAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goTo(current + 1), 4000);
}
resetAutoplay();

// ── MOBILE NAV ──────────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ── WHATSAPP FORM ────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const name    = form.name.value.trim();
  const phone   = form.phone.value.trim();
  const service = form.service.value;
  const message = form.message.value.trim();

  let text = `¡Hola Jean! 👋\n\n`;
  text += `*Nombre:* ${name}\n`;
  text += `*Teléfono:* ${phone}\n`;
  text += `*Servicio:* ${service}\n`;
  if (message) text += `*Mensaje:* ${message}\n`;
  text += `\nEnviado desde jeanlabarber.com`;

  window.open(`https://wa.me/19394288802?text=${encodeURIComponent(text)}`, '_blank');
});

// ── GALERÍA INTERACTIVA "EL LOCAL" ───────────────────────
(function () {
  const featuredImg = document.getElementById('localFeaturedImg');
  const thumbs = document.querySelectorAll('.local-thumb');
  if (!featuredImg || !thumbs.length) return;

  // Marca la miniatura cuya imagen ya está destacada (local-2.jpg)
  thumbs.forEach(thumb => {
    if (thumb.dataset.src === featuredImg.src.split('/').pop().replace(/.*\//, '') ||
        featuredImg.src.includes(thumb.dataset.src.replace('images/local/', ''))) {
      thumb.classList.add('is-active');
    }
  });

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (thumb.classList.contains('is-active')) return;

      const newSrc  = thumb.dataset.src;
      const newAlt  = thumb.dataset.alt;
      const prevSrc = featuredImg.src;
      const prevAlt = featuredImg.alt;

      // Fade out → swap → fade in
      featuredImg.classList.add('fading');

      const newPos  = thumb.dataset.pos;
      const prevPos = featuredImg.dataset.pos;

      setTimeout(() => {
        featuredImg.src = newSrc;
        featuredImg.alt = newAlt;
        featuredImg.dataset.pos = newPos;
        featuredImg.classList.remove('fading');

        // La miniatura clickeada recibe la imagen anterior
        const thumbImg = thumb.querySelector('img');
        thumbImg.src = prevSrc;
        thumbImg.alt = prevAlt;
        thumb.dataset.src = prevSrc;
        thumb.dataset.alt = prevAlt;
        thumb.dataset.pos = prevPos;

        // Actualiza indicador activo
        thumbs.forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      }, 350);
    });
  });
})();

// ── ANIMACIONES ON-SCROLL ────────────────────────────────
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {

  function reveal(el) { el.classList.add('is-visible'); }

  // Stagger por grupos
  const staggerGroups = ['.local-grid', '.services-grid', '.jean-photos-secondary'];
  staggerGroups.forEach(selector => {
    const container = document.querySelector(selector);
    if (!container) return;
    container.querySelectorAll('.anim-img').forEach((el, i) => {
      el.style.transitionDelay = `${i * 100}ms`;
    });
  });

  // Observer general: dispara en cuanto 1px entra en pantalla
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.anim-title, .anim-img, .anim-jean-main').forEach(el => {
    obs.observe(el);
  });

  // Observer bio — stagger de líneas
  const bioObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.anim-bio-line').forEach((line, i) => {
        line.style.transitionDelay = `${i * 120}ms`;
        line.classList.add('is-visible');
      });
      bioObs.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

  const bio = document.querySelector('.jean-bio');
  if (bio) bioObs.observe(bio);

  // Fallback: muestra inmediatamente los elementos que ya están en pantalla al cargar
  setTimeout(() => {
    document.querySelectorAll('.anim-title, .anim-img, .anim-jean-main').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
    });
  }, 80);
}
