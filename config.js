// ============================================================
//  DATOS DE LA CLÍNICA — edita SOLO este archivo
//  Todo lo que cambies aquí se actualiza en toda la web.
// ============================================================
const CLINICA = {
  // --- Identidad ---
  nombre: 'Clínica Dental Sonrisa',
  nombreCorto: 'Sonrisa',
  eslogan: 'Odontología avanzada en Madrid',

  // --- Contacto ---
  telefono: '912 345 678',            // como se muestra en pantalla
  telefonoLlamada: '+34912345678',    // para el enlace de llamada (sin espacios)
  whatsapp: '34600000000',            // con prefijo país, sin + ni espacios. Vacío '' = oculta el botón
  email: 'hola@clinicasonrisa.es',

  // --- Dirección ---
  calle: 'Calle de la Salud 12',
  codigoPostal: '28001',
  ciudad: 'Madrid',
  provincia: 'Madrid',
  pais: 'ES',
  comoLlegar: 'Metro: Serrano (L4) · Parking gratuito para pacientes',
  // Coordenadas para el mapa (búscalas en Google Maps: clic derecho sobre tu clínica)
  latitud: 40.4268,
  longitud: -3.6869,

  // --- Horario ---
  horarioSemana: 'Lunes a viernes: 9:00–20:00',
  horarioSabado: 'Sábados: 10:00–14:00',
  horarioUrgencias: 'Urgencias: el mismo día',

  // --- Datos legales (obligatorios en España: LSSI-CE art. 10) ---
  razonSocial: 'Clínica Dental Sonrisa S.L.',
  cif: 'B-00000000',
  registroSanitario: 'CS-00000',        // nº de registro sanitario de la Comunidad
  colegiadoDirector: '28.4512',         // nº de colegiado del director médico
  emailProteccionDatos: 'privacidad@clinicasonrisa.es',

  // --- Integraciones (déjalo vacío para modo demo) ---
  // Formspree: crea un formulario gratis en formspree.io y pega aquí tu ID (ej. 'xdorwqkv')
  formspreeId: '',
  // n8n: URL del webhook para el prediagnóstico con IA (ver README)
  webhookPrediagnostico: '',
};

// ------------------------------------------------------------
// A partir de aquí no hace falta tocar nada.
// ------------------------------------------------------------
(function () {
  const mapa = {
    nombre: CLINICA.nombre,
    'nombre-corto': CLINICA.nombreCorto,
    telefono: CLINICA.telefono,
    email: CLINICA.email,
    calle: CLINICA.calle,
    'ciudad-cp': CLINICA.codigoPostal + ' ' + CLINICA.ciudad,
    'como-llegar': CLINICA.comoLlegar,
    'horario-semana': CLINICA.horarioSemana,
    'horario-sabado': CLINICA.horarioSabado,
    'horario-urgencias': CLINICA.horarioUrgencias,
    'razon-social': CLINICA.razonSocial,
    cif: CLINICA.cif,
    'registro-sanitario': CLINICA.registroSanitario,
    colegiado: CLINICA.colegiadoDirector,
    'email-privacidad': CLINICA.emailProteccionDatos,
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Textos
    document.querySelectorAll('[data-campo]').forEach((el) => {
      const valor = mapa[el.dataset.campo];
      if (valor !== undefined) el.textContent = valor;
    });
    // Enlaces de teléfono y email
    document.querySelectorAll('[data-enlace="tel"]').forEach((el) => {
      el.href = 'tel:' + CLINICA.telefonoLlamada;
    });
    document.querySelectorAll('[data-enlace="email"]').forEach((el) => {
      el.href = 'mailto:' + CLINICA.email;
    });
    // Mapa
    const mapaEl = document.getElementById('mapaClinica');
    if (mapaEl) {
      const d = 0.004;
      mapaEl.src =
        'https://www.openstreetmap.org/export/embed.html?bbox=' +
        (CLINICA.longitud - d) + ',' + (CLINICA.latitud - d) + ',' +
        (CLINICA.longitud + d) + ',' + (CLINICA.latitud + d) +
        '&layer=mapnik&marker=' + CLINICA.latitud + ',' + CLINICA.longitud;
    }
    const comoLlegarEl = document.getElementById('linkComoLlegar');
    if (comoLlegarEl) {
      comoLlegarEl.href =
        'https://www.google.com/maps/dir/?api=1&destination=' +
        encodeURIComponent(CLINICA.calle + ', ' + CLINICA.codigoPostal + ' ' + CLINICA.ciudad);
    }
    // WhatsApp
    const wa = document.getElementById('waBtn');
    if (wa) {
      if (CLINICA.whatsapp) {
        wa.href =
          'https://wa.me/' + CLINICA.whatsapp +
          '?text=' + encodeURIComponent('Hola, me gustaría pedir cita en ' + CLINICA.nombre + '.');
      } else {
        wa.remove();
      }
    }
  });
})();
