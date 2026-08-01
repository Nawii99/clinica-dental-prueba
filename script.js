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
