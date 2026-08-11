// Prediagnóstico dental con IA.
// La web es estática: el análisis real lo hace un backend (workflow de n8n que
// llama a un modelo de visión). La URL del webhook se configura en config.js
// (CLINICA.webhookPrediagnostico). Sin URL funciona en MODO DEMO: muestra un
// resultado de ejemplo claramente señalizado y la foto NO se analiza.
const WEBHOOK_URL = (typeof CLINICA !== 'undefined' && CLINICA.webhookPrediagnostico) || '';

(function () {
  const $ = (id) => document.getElementById(id);
  const fileInput = $('diagFile');
  const preview = $('diagPreview');
  const dropText = $('diagDropText');
  const consent = $('diagConsent');
  const btn = $('diagBtn');
  const status = $('diagStatus');
  const result = $('diagResult');

  let imagenBase64 = null; // dataURL JPEG reescalado

  function actualizarBoton() {
    btn.disabled = !(imagenBase64 && consent.checked);
  }

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      // Reescalar a máx. 1024px para que la subida sea rápida
      const MAX = 1024;
      const escala = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      imagenBase64 = canvas.toDataURL('image/jpeg', 0.85);
      preview.src = imagenBase64;
      preview.hidden = false;
      dropText.hidden = true;
      result.hidden = true;
      URL.revokeObjectURL(img.src);
      actualizarBoton();
    };
    img.src = URL.createObjectURL(file);
  });

  consent.addEventListener('change', actualizarBoton);

  function mostrarEstado(texto) {
    status.textContent = texto;
    status.hidden = !texto;
  }

  // Mini-renderizado seguro: escapa HTML y aplica **negrita**, listas y saltos
  function renderTexto(texto) {
    const esc = texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc
      .split('\n')
      .map((linea) => {
        const l = linea.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        if (/^\s*[-•]\s+/.test(l)) return '<li>' + l.replace(/^\s*[-•]\s+/, '') + '</li>';
        if (/^#{1,3}\s+/.test(l)) return '<h4>' + l.replace(/^#{1,3}\s+/, '') + '</h4>';
        return l ? '<p>' + l + '</p>' : '';
      })
      .join('');
  }

  function mostrarResultado(texto, esDemo) {
    let html = '';
    if (esDemo) {
      html +=
        '<p class="diag__demo">⚠️ <strong>MODO DEMO</strong> — tu foto <strong>no</strong> ha sido analizada. Esto es un ejemplo ilustrativo del formato de respuesta. Para activar el análisis real hay que conectar el backend de IA (ver README del proyecto).</p>';
    }
    html += renderTexto(texto);
    html +=
      '<p class="diag__legal">Valoración orientativa generada por IA — no es un diagnóstico. Confírmalo siempre con un odontólogo. <a href="#cita">Pide tu cita gratuita</a>.</p>';
    result.innerHTML = html;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const DEMO = {
    sencillo:
      '**Lo que se aprecia en la foto (ejemplo):**\n' +
      '- Los dientes se ven en general bien alineados.\n' +
      '- Se aprecia algo de placa acumulada cerca de las encías.\n' +
      '- Las encías se ven ligeramente enrojecidas en la zona inferior, lo que a veces indica el inicio de una gingivitis.\n' +
      '**¿Es urgente?** No parece nada urgente, pero una limpieza profesional ayudaría.\n' +
      '**Siguiente paso:** una revisión con el dentista para confirmarlo — la primera consulta es gratuita.',
    profesional:
      '**Informe orientativo (ejemplo):**\n' +
      '- Alineación: leve apiñamiento anteroinferior; resto de arcadas sin malposiciones destacables.\n' +
      '- Tejidos blandos: eritema marginal en sector anteroinferior compatible con gingivitis inducida por placa (grado leve).\n' +
      '- Depósitos: placa/cálculo supragingival visible en caras linguales de 31-41.\n' +
      '- No se aprecian lesiones cariosas cavitadas evidentes en las superficies visibles; la fotografía no permite valorar caras interproximales ni oclusales posteriores.\n' +
      '**Recomendación:** tartrectomía y revisión clínica con exploración periodontal básica y radiografías de aleta de mordida para descartar caries interproximal.',
  };

  btn.addEventListener('click', async () => {
    const nivel = document.querySelector('input[name="nivel"]:checked').value;
    btn.disabled = true;
    result.hidden = true;

    // Sin backend configurado → demo señalizada
    if (!WEBHOOK_URL) {
      mostrarEstado('Generando ejemplo…');
      setTimeout(() => {
        mostrarEstado('');
        mostrarResultado(DEMO[nivel], true);
        btn.disabled = false;
      }, 1200);
      return;
    }

    // Backend real (webhook de n8n → modelo de visión)
    try {
      mostrarEstado('Analizando tu foto con IA… (suele tardar 10-20 segundos)');
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen: imagenBase64, nivel: nivel }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      mostrarEstado('');
      mostrarResultado(data.resultado || 'No se recibió respuesta del análisis.', false);
    } catch (e) {
      mostrarEstado('');
      mostrarResultado(
        '**No se ha podido completar el análisis.** Inténtalo de nuevo en unos minutos o llámanos al 912 345 678.',
        false
      );
    } finally {
      btn.disabled = false;
    }
  });
})();
