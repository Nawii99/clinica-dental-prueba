// Menú móvil
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// Sombra de la cabecera al hacer scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Animación de aparición de secciones
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Contadores animados de la franja de cifras
function animarContador(el) {
  const objetivo = parseInt(el.dataset.count, 10);
  const duracion = 1600;
  const inicio = performance.now();
  function tick(ahora) {
    const p = Math.min((ahora - inicio) / duracion, 1);
    const valor = Math.round(objetivo * (1 - Math.pow(1 - p, 3)));
    el.textContent = valor.toLocaleString('es-ES');
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animarContador(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('.stat strong[data-count]').forEach((el) => statObserver.observe(el));

// Formulario de cita (demo: sin backend, solo validación y confirmación)
const form = document.getElementById('formCita');
const formOk = document.getElementById('formOk');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;
  form.querySelectorAll('input[required]').forEach((input) => {
    const empty = input.value.trim() === '';
    input.classList.toggle('error', empty);
    if (empty) valid = false;
  });

  if (!valid) return;

  form.reset();
  formOk.hidden = false;
  setTimeout(() => { formOk.hidden = true; }, 6000);
});

// Año actual en el pie
document.getElementById('year').textContent = new Date().getFullYear();
