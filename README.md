# Roadmap 30X · réplica del Scaling Roadmap

Réplica funcional del [Scaling Roadmap de Acquisition.com](https://www.acquisition.com/roadmap) con la marca de 30X y en español. Misma página (barra de anuncio, titular, carrusel con la matriz de cada etapa, formulario de 5 pantallas, prueba social y pie con acordeones), mismo mecanismo (una sola pregunta decide la etapa) y la misma entrega (una guía PDF por etapa, con su correo).

- **Sitio:** https://lopezdiazjcr.github.io/roadmap-30x/
- **Panel para la demo:** https://lopezdiazjcr.github.io/roadmap-30x/demo.html

Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación). Corre en GitHub Pages, Vercel, Netlify o abriendo `index.html`.

---

## El recorrido

```
Landing ─► 5 pantallas: nombre → correo → WhatsApp → ciudad y país → calificación ─► etapa (0–9)
                                                                                      └─► gracias.html (PDF + matriz + siguiente paso)
Correo de entrega (vista previa): correo.html?etapa=N
```

| Original (Acquisition.com) | Réplica |
|---|---|
| `/roadmap` | `index.html` |
| Correo "Here's Your Scaling Roadmap (Stage N)" | `correo.html?etapa=N` |
| PDF `stage-N-<name>.pdf` | `guias/etapa-N-<nombre>.pdf` |
| Página de gracias | `gracias.html?etapa=N` |

## Cómo asigna la etapa

Solo cuenta la respuesta a **"Personas a tiempo completo"**. Las otras cinco (facturación, margen, propiedad, hace cuánto nos conoces, industria) califican al lead pero no cambian la etapa. Los valores internos de cada opción son los del formulario original, así que el lead es compatible con las mismas propiedades de CRM.

| Personas | Etapa | Rol | Cierre |
|---|---|---|---|
| Solo yo, sin ingresos | 0 · Improvisa | Investigador | Seguir la cuenta |
| Solo yo, con algo de ingresos | 1 · Monetiza | Arrancador | Seguir la cuenta |
| Yo y proveedores o freelancers | 2 · Anuncia | Hacedor | Seguir la cuenta |
| 2 a 4 | 3 · Estabiliza | Entrenador | Inmersivo 30X |
| 5 a 9 | 4 · Prioriza | Gerente | Inmersivo 30X |
| 10 a 19 | 5 · Productiza | Director | Inmersivo 30X |
| 20 a 49 | 6 · Optimiza | Líder | Inmersivo 30X |
| 50 a 99 | 7 · Categoriza | Ejecutivo | Inmersivo 30X |
| 100 a 249 | 8 · Especializa | Presidente | Inmersivo 30X |
| 250 a 500 | 9 · Capitaliza | Presidente de junta | Inmersivo 30X |

El original manda a las etapas 0–2 a una comunidad de pago afiliada y a las 3–9 a su taller presencial. Aquí las 0–2 van a seguir a @crece30x y al podcast, y las 3–9 al Inmersivo 30X (el mismo llamado con el que cierran las guías PDF), con UTM `utm_source=roadmap` y la etapa en `utm_content`.

## Qué cambia respecto al original

- **La dirección física** (calle, estado, código postal) se redujo a ciudad y país.
- **Las cifras y testimonios** de Acquisition.com no se copian. La prueba falla si aparecen.
- **El framework se acredita** en el pie. Las guías PDF también lo acreditan en portada y pie.

## Configurar

Todo está en [`assets/js/config.js`](assets/js/config.js):

| Clave | Para qué |
|---|---|
| `webhookUrl` | Cada lead se envía por POST en JSON a esta URL (Zapier, Make, n8n, HubSpot…). Vacío = queda en el navegador y se ve en `demo.html` |
| `announcement` | La barra de arriba |
| `inmersivo` | Texto, ciudades, enlace al formulario y UTM del cierre de las etapas 3–9 |
| `follow` | Enlaces del cierre de las etapas 0–2 |
| `quote`, `footer`, `sender` | Prueba social, columnas del pie y remitente del correo |

Las etapas viven en [`assets/js/data.js`](assets/js/data.js): nombre, rol, personas, problema central, graduación, regla y las 6 áreas con su tapón y su salida. Se generaron desde las guías por etapa; si las guías cambian, se regenera ese archivo y se reemplazan los PDF de `guias/`.

## Correr y probar

```bash
python3 -m http.server 8000      # luego abre http://localhost:8000
node tests/etapas.test.js        # asignación de etapa, datos, PDFs y lo que no debe aparecer
```
