// Carousel
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

// Touch/swipe support
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

// Mobile nav
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// Contact form → WhatsApp
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const service = form.service.value;
  const message = form.message.value.trim();

  let text = `¡Hola Jean! 👋\n\n`;
  text += `*Nombre:* ${name}\n`;
  text += `*Teléfono:* ${phone}\n`;
  text += `*Servicio:* ${service}\n`;
  if (message) text += `*Mensaje:* ${message}\n`;
  text += `\nEnviado desde jeanlabarber.com`;

  const url = `https://wa.me/19394288802?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
});
