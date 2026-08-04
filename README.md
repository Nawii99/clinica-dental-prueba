# Clínica Dental Sonrisa 🦷

Web estática para una clínica dental, hecha con HTML, CSS y JavaScript puros (sin dependencias).

## Contenido

- **index.html** — página principal con secciones de servicios, equipo, opiniones, formulario de cita y contacto.
- **styles.css** — estilos, diseño responsive (móvil, tablet y escritorio).
- **script.js** — menú móvil y validación del formulario de cita.

## Cómo verla

Abre `index.html` en el navegador, o sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Notas

- El formulario de cita es una demo: valida los campos y muestra confirmación, pero no envía datos a ningún servidor.
- Los datos de contacto (teléfono, dirección, nombres del equipo) son de ejemplo — sustitúyelos por los reales.

## Prediagnóstico con IA (sección "Prediagnóstico IA")

El paciente sube una foto de sus dientes y recibe una valoración orientativa
generada por un modelo de visión, con dos niveles: explicación sencilla o
informe profesional.

**Cómo funciona:** la web es estática, así que el análisis lo hace un backend.
Sin backend configurado, la sección funciona en **modo demo** (muestra un
ejemplo claramente señalizado; la foto no se analiza).

**Para activar el análisis real (unos 10 minutos):**

1. Crea una cuenta de [n8n](https://n8n.io) (cloud o autoalojado).
2. Importa el workflow `n8n-prediagnostico-workflow.json` de este repo.
3. En el nodo "Claude (visión)", crea una credencial *Header Auth* con
   nombre de cabecera `x-api-key` y tu clave de la API de Anthropic
   ([console.anthropic.com](https://console.anthropic.com)). La clave vive solo
   en n8n, nunca en la web.
4. Activa el workflow y copia la URL de producción del webhook.
5. Pégala en la constante `WEBHOOK_URL` al inicio de `prediagnostico.js` y sube
   el cambio.

**Aviso legal:** la valoración es orientativa y no constituye diagnóstico
médico; la web lo indica en la sección y en cada resultado.
