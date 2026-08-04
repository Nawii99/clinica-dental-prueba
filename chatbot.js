// Chatbot de reglas — sin backend, sin dependencias.
// Responde FAQs con botones y palabras clave, y guía hacia el formulario de cita.

(function () {
  const RESPUESTAS = {
    horarios:
      'Nuestro horario es:<br>🕐 <strong>Lunes a viernes:</strong> 9:00–20:00<br>🕐 <strong>Sábados:</strong> 10:00–14:00<br>Domingos cerrado.',
    servicios:
      'Ofrecemos:<br>🦷 Odontología general (revisiones, empastes, limpiezas)<br>✨ Estética dental y blanqueamientos<br>🔩 Implantes<br>😁 Ortodoncia (brackets e invisible)<br>🧒 Odontopediatría<br>🚨 Urgencias el mismo día<br><br>¿Quieres que te llamemos para una <a href="#cita">primera consulta gratuita</a>?',
    precios:
      'Los precios dependen de cada caso, por eso la <strong>primera consulta es gratuita</strong>: te damos diagnóstico y presupuesto cerrado sin compromiso. También tenemos financiación sin intereses. 😊',
    urgencias:
      '🚨 Si tienes dolor fuerte, un traumatismo o una pieza rota, <strong>te atendemos el mismo día</strong>. Llámanos ahora al <a href="tel:+34912345678">912 345 678</a> y te damos hueco.',
    ubicacion:
      '📍 Estamos en <strong>Calle de la Salud 12, 28001 Madrid</strong>.<br>📞 <a href="tel:+34912345678">912 345 678</a><br>✉️ <a href="mailto:hola@clinicasonrisa.es">hola@clinicasonrisa.es</a>',
    cita: null, // gestionada por el flujo de cita
  };

  const QUICK = [
    ['horarios', '🕐 Horarios'],
    ['servicios', '🦷 Servicios'],
    ['precios', '💶 Precios'],
    ['cita', '📅 Pedir cita'],
    ['urgencias', '🚨 Urgencias'],
    ['ubicacion', '📍 Dónde estamos'],
  ];

  // palabra clave normalizada → intención
  const KEYWORDS = [
    [/(horari|abris|abren|cierr|abierto|hora teneis)/, 'horarios'],
    [/(precio|cuesta|coste|cuanto|tarifa|presupuesto|financia)/, 'precios'],
    [/(urgencia|dolor|duele|roto|rota|golpe|sangra|flemon)/, 'urgencias'],
    [/(cita|reserva|consulta|hueco|agenda|pedir hora)/, 'cita'],
    [/(servicio|tratamiento|implante|ortodoncia|bracket|blanquea|carilla|limpieza|empaste|caries|nino|infantil)/, 'servicios'],
    [/(donde|direccion|ubicacion|llegar|calle|mapa|telefono|contacto|email|correo)/, 'ubicacion'],
    [/(hola|buenas|buenos dias|buenas tardes|hey)/, 'saludo'],
    [/(gracias|genial|perfecto|vale|ok)/, 'gracias'],
  ];

  const $ = (id) => document.getElementById(id);
  const panel = $('chatPanel');
  const toggle = $('chatToggle');
  const msgs = $('chatMessages');
  const quick = $('chatQuick');
  const form = $('chatForm');
  const input = $('chatInput');

  // Flujo de cita: null | 'nombre' | 'telefono'
  let pasoCita = null;
  let datosCita = {};
  let saludado = false;

  function normalizar(t) {
    return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function burbuja(html, quien) {
    const div = document.createElement('div');
    div.className = 'chat__msg chat__msg--' + quien;
    div.innerHTML = html;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function botDice(html, delay) {
    setTimeout(() => burbuja(html, 'bot'), delay || 250);
  }

  function pintarQuick() {
    quick.innerHTML = '';
    QUICK.forEach(([intencion, etiqueta]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = etiqueta;
      b.addEventListener('click', () => {
        burbuja(etiqueta.replace(/^\S+\s/, ''), 'user');
        responder(intencion);
      });
      quick.appendChild(b);
    });
  }

  function empezarCita() {
    pasoCita = 'nombre';
    datosCita = {};
    botDice('¡Genial! Te tomo los datos y te llamamos en menos de 24 h para confirmar. 📅<br><br>¿Cómo te llamas?');
  }

  function responder(intencion) {
    if (intencion === 'cita') return empezarCita();
    if (intencion === 'saludo') {
      return botDice('¡Hola! 😊 ¿En qué puedo ayudarte? Puedes usar los botones de abajo o escribirme directamente.');
    }
    if (intencion === 'gracias') {
      return botDice('¡A ti! Si necesitas algo más, aquí estoy. 🦷');
    }
    if (RESPUESTAS[intencion]) return botDice(RESPUESTAS[intencion]);
    botDice(
      'No estoy seguro de haberte entendido 🤔. Puedo ayudarte con <strong>horarios, servicios, precios, urgencias, cómo llegar</strong> o <strong>pedir cita</strong> — usa los botones de abajo o pregúntame con otras palabras.'
    );
  }

  function procesarTexto(texto) {
    // Flujo de cita en curso
    if (pasoCita === 'nombre') {
      datosCita.nombre = texto.trim();
      pasoCita = 'telefono';
      return botDice('Encantado, <strong>' + datosCita.nombre + '</strong> 😊 ¿A qué teléfono te llamamos?');
    }
    if (pasoCita === 'telefono') {
      const tel = texto.replace(/[\s.-]/g, '');
      if (!/^\+?\d{9,15}$/.test(tel)) {
        return botDice('Ese teléfono no me cuadra 🤔 — escríbelo solo con números (ej.: 600123456).');
      }
      datosCita.telefono = texto.trim();
      pasoCita = null;
      return botDice(
        '¡Perfecto, ' + datosCita.nombre + '! ✅ Hemos anotado tu solicitud y te llamaremos al <strong>' + datosCita.telefono +
        '</strong> en menos de 24 h.<br><br><em>(Esta web es una demo: los datos no se envían a ningún servidor. Puedes usar también el <a href="#cita">formulario de cita</a>.)</em>'
      );
    }
    // Detección de intención por palabras clave
    const t = normalizar(texto);
    for (const [regex, intencion] of KEYWORDS) {
      if (regex.test(t)) return responder(intencion);
    }
    responder('desconocido');
  }

  toggle.addEventListener('click', () => {
    const abierto = !panel.hidden;
    panel.hidden = abierto;
    toggle.setAttribute('aria-expanded', String(!abierto));
    if (!abierto && !saludado) {
      saludado = true;
      botDice('¡Hola! 👋 Soy el asistente de <strong>Clínica Dental Sonrisa</strong>. ¿En qué puedo ayudarte?', 300);
      pintarQuick();
    }
    if (!abierto) input.focus();
  });

  $('chatClose').addEventListener('click', () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;
    burbuja(texto.replace(/</g, '&lt;'), 'user');
    input.value = '';
    procesarTexto(texto);
  });
})();
