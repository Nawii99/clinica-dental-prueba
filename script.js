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

// Visor 3D de la arcada dental (CSS 3D, sin librerías)
const scanStage = document.getElementById('scanStage');
if (scanStage) {
  const arch = document.getElementById('scanArch');
  const pctEl = document.getElementById('scanPct');
  const barEl = document.getElementById('scanBar');
  const N = 14;
  const RADIO = 74;
  const dientes = [];

  for (let i = 0; i < N; i++) {
    const d = document.createElement('div');
    d.className = 'diente';
    const ang = -78 + (156 / (N - 1)) * i;          // arco de la arcada
    const molar = i < 3 || i > N - 4;                // muelas más anchas
    const incisivo = i === 6 || i === 7;             // incisivos más altos
    const w = molar ? 22 : incisivo ? 15 : 18;
    const h = molar ? 26 : incisivo ? 34 : 30;
    d.style.width = w + 'px';
    d.style.height = h + 'px';
    d.style.transform =
      'translate(-50%, -50%) rotateY(' + ang + 'deg) translateZ(' + RADIO + 'px)';
    arch.appendChild(d);
    dientes.push(d);
  }

  // Rotación: automática + arrastre con dedo o ratón
  let rot = 0;
  let arrastrando = false;
  let ultimaX = 0;

  scanStage.addEventListener('pointerdown', (e) => {
    arrastrando = true;
    ultimaX = e.clientX;
    scanStage.setPointerCapture(e.pointerId);
  });
  scanStage.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    rot += (e.clientX - ultimaX) * 0.5;
    ultimaX = e.clientX;
  });
  ['pointerup', 'pointercancel'].forEach((ev) =>
    scanStage.addEventListener(ev, () => { arrastrando = false; })
  );

  (function girar() {
    if (!arrastrando) rot += 0.25;
    arch.style.transform = 'rotateX(-16deg) rotateY(' + rot + 'deg)';
    requestAnimationFrame(girar);
  })();

  // Escaneo progresivo: los dientes se "capturan" en orden, en bucle
  let pct = 0;
  setInterval(() => {
    pct = (pct + 1) % 130;                          // pausa al llegar al 100 %
    const p = Math.min(pct, 100);
    pctEl.textContent = p + ' %';
    barEl.style.width = p + '%';
    dientes.forEach((d, i) => d.classList.toggle('scanned', i < (p / 100) * N));
  }, 60);
}

// Aviso de almacenamiento técnico (se muestra una sola vez)
const cookieAviso = document.getElementById('cookieAviso');
if (cookieAviso) {
  let aceptado = false;
  try { aceptado = localStorage.getItem('avisoTecnico') === '1'; } catch (e) { aceptado = true; }
  if (!aceptado) {
    setTimeout(() => { cookieAviso.hidden = false; }, 800);
  }
  document.getElementById('cookieOk').addEventListener('click', () => {
    cookieAviso.hidden = true;
    try { localStorage.setItem('avisoTecnico', '1'); } catch (e) { /* modo privado */ }
  });
}

// Formulario de cita.
// Con CLINICA.formspreeId configurado envía de verdad (Formspree, plan gratuito).
// Sin configurar funciona en modo demo: valida y confirma, pero no envía nada.
const form = document.getElementById('formCita');
const formOk = document.getElementById('formOk');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let valid = true;
  form.querySelectorAll('input[required]').forEach((input) => {
    const empty = input.value.trim() === '';
    input.classList.toggle('error', empty);
    if (empty) valid = false;
  });
  if (!valid) return;

  const boton = form.querySelector('button[type="submit"]');
  const textoOriginal = boton.textContent;
  const idFormspree = (typeof CLINICA !== 'undefined' && CLINICA.formspreeId) || '';

  function confirmar(mensaje) {
    formOk.textContent = mensaje;
    formOk.hidden = false;
    setTimeout(() => { formOk.hidden = true; }, 8000);
  }

  if (!idFormspree) {
    form.reset();
    confirmar('✅ ¡Gracias! Te llamaremos muy pronto para confirmar tu cita. (Demo: los datos no se han enviado.)');
    return;
  }

  boton.disabled = true;
  boton.textContent = 'Enviando…';
  try {
    const respuesta = await fetch('https://formspree.io/f/' + idFormspree, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
    form.reset();
    confirmar('✅ ¡Gracias! Hemos recibido tu solicitud y te llamaremos en menos de 24 h.');
  } catch (err) {
    confirmar('⚠️ No hemos podido enviar tu solicitud. Llámanos al ' +
      (typeof CLINICA !== 'undefined' ? CLINICA.telefono : '912 345 678') + ' y te atendemos al momento.');
  } finally {
    boton.disabled = false;
    boton.textContent = textoOriginal;
  }
});

// Año actual en el pie
document.getElementById('year').textContent = new Date().getFullYear();
