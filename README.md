# Clínica Dental Sonrisa 🦷

Web para una clínica dental hecha con HTML, CSS y JavaScript puros — sin frameworks,
sin dependencias y sin proceso de compilación. Se publica gratis en GitHub Pages.

## Archivos

| Archivo | Qué contiene |
|---|---|
| **`config.js`** | **👈 Empieza aquí.** Todos los datos de la clínica (nombre, teléfono, dirección, horario, datos legales). Cambia esto y se actualiza toda la web. |
| `index.html` | La página: portada, tratamientos, tecnología, prediagnóstico IA, equipo, opiniones, FAQ, cita y contacto. |
| `styles.css` | Estilos y diseño responsive. |
| `script.js` | Menú móvil, animaciones, contadores, visor 3D, formulario y aviso de cookies. |
| `chatbot.js` | Asistente de chat por reglas (sin IA, sin servidor). |
| `prediagnostico.js` | Subida de foto y llamada al análisis con IA. |
| `legal.html` | Aviso legal, política de privacidad y cookies. |
| `fotos/` | Tus imágenes (ver `fotos/LEEME.md`). |
| `n8n-*.json` | Workflows listos para importar en n8n que activan la IA. |

## Ver la web

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

---

## 1. Poner tus datos reales (5 minutos)

Abre **`config.js`** y rellena los campos. Es el único archivo que necesitas tocar:
nombre, teléfono, WhatsApp, email, dirección, coordenadas del mapa, horario y los
datos legales (razón social, CIF, nº de registro sanitario, nº de colegiado).

Para las coordenadas: abre Google Maps, clic derecho sobre tu clínica → aparecen
latitud y longitud; cópialas en `latitud` y `longitud`.

Quedan tres sitios más con texto de ejemplo que conviene revisar a mano en
`index.html`: los nombres y descripciones del equipo, las opiniones de pacientes y
el bloque `application/ld+json` de la cabecera (los datos que lee Google).

## 2. Poner tus fotos

Mete las imágenes en la carpeta `fotos/` con los nombres indicados en
`fotos/LEEME.md`. Si un archivo no existe, la web sigue funcionando con el diseño
alternativo — nunca se rompe.

⚠️ **Nunca publiques fotos clínicas de pacientes** (antes/después, radiografías, bocas)
sin su consentimiento informado por escrito: son datos de salud protegidos por el RGPD.

## 3. Que el formulario de cita envíe de verdad (gratis)

1. Crea una cuenta en [formspree.io](https://formspree.io) (plan gratuito: 50 envíos/mes).
2. Crea un formulario nuevo y copia su ID (algo como `xdorwqkv`).
3. Pégalo en `config.js` → `formspreeId`.

Hecho: las solicitudes de cita te llegarán por email. Sin configurar, el formulario
funciona en modo demo (valida y confirma, pero no envía nada).

## 4. Activar el prediagnóstico con IA

La web es estática, así que el análisis lo hace un backend — la clave de la API
**nunca** puede ir en la web, o cualquiera podría robarla y gastarla. Ese backend es
un workflow de [n8n](https://n8n.io) que ya está hecho en este repo.

### Opción A — Google Gemini (gratis)

Usa `n8n-prediagnostico-gemini-GRATIS.json`. La capa gratuita de Gemini permite un
número limitado de peticiones al día sin tarjeta, suficiente para probar y para una
clínica pequeña.

1. Consigue una clave gratis en [aistudio.google.com](https://aistudio.google.com) → *Get API key*.
2. Crea una cuenta en n8n (cloud o autoalojado) e importa el workflow.
3. En n8n, guarda la clave como variable de entorno `GEMINI_API_KEY`
   (o pégala directamente en la URL del nodo "Gemini (visión)").
4. Comprueba en AI Studio que el modelo `gemini-2.0-flash` sigue disponible; si no,
   cambia el nombre en la URL del nodo por el modelo con visión que te ofrezcan.
5. Activa el workflow y copia la **URL de producción** del webhook.
6. Pégala en `config.js` → `webhookPrediagnostico`.

### Opción B — Claude (de pago, mejor calidad)

Usa `n8n-prediagnostico-workflow.json`. Es pago por uso: sale a unos **2 céntimos por
foto** (no hay cuota mensual), pero requiere tarjeta y una recarga mínima inicial.

1. Consigue una clave en [console.anthropic.com](https://console.anthropic.com).
2. Importa el workflow en n8n.
3. En el nodo "Claude (visión)", crea una credencial *Header Auth* con nombre de
   cabecera `x-api-key` y tu clave como valor.
4. Activa el workflow, copia la URL del webhook y pégala en `config.js`.

**Sin ninguna de las dos configurada**, la sección funciona en modo demo: muestra un
ejemplo con un aviso bien visible de que la foto no ha sido analizada.

## 5. Publicar la web (gratis)

En tu repositorio de GitHub: **Settings → Pages → Branch: `main` → Save**.
En un par de minutos tendrás la web en `https://nawii99.github.io/clinica-dental-prueba/`.

Si más adelante compras un dominio propio (unos 10 €/año), se conecta desde esa misma
pantalla y GitHub Pages lo sigue alojando gratis.

---

## Avisos importantes

- **El prediagnóstico con IA no es un diagnóstico médico.** La web lo indica en la
  sección, en cada resultado y en la política de privacidad. Antes de publicarlo de
  cara al público, revísalo con tu asesor legal: la publicidad de centros sanitarios
  está regulada, y una imagen enviada con fines de valoración de salud es una
  categoría especial de datos según el RGPD.
- **Los textos legales de `legal.html` son una plantilla orientativa**, no un documento
  validado. Complétalos con tus datos reales y que los revise un profesional.
