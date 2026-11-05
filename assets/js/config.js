/*
 * Configuración del Roadmap 30X.
 * Lo que cambia entre la demo y la versión final vive aquí: marca, enlaces, webhook de leads, llamados a la acción.
 */
window.RM_CONFIG = {
  brand: {
    name: "30X",
    product: "Roadmap 30X",
    site: "https://30x.com",
    logoOnDark: "assets/img/30x-logo-accent.svg",
    logoOnLight: "assets/img/30x-logo-dark.svg",
    instagram: "https://www.instagram.com/crece30x/",
    privacyUrl: "https://30x.com/legal/politica-de-privacidad"
  },

  // Si lo llenas, cada lead se envía por POST en JSON a esta URL (Zapier, Make, n8n, HubSpot, Supabase…).
  // Mientras esté vacío, el lead queda en el navegador (localStorage) y se ve en demo.html.
  webhookUrl: "",

  // Remitente del correo de entrega (solo para la vista previa en correo.html).
  sender: { name: "Andrés Bilbao", email: "hola@30x.com" },

  // Barra de anuncio de arriba (el original anuncia sus workshops del año).
  announcement: {
    tag: "NUEVO",
    text: "Inmersivo 30X 2026 en cinco ciudades:",
    link: "Ver las fechas",
    url: "https://30x.com/inmersivo"
  },

  // Llamado de cierre para las etapas 3 a 9 (el equivalente al taller presencial que vende el original).
  // Es el mismo CTA con el que cierran las guías PDF. Sin fechas, para que sea evergreen.
  inmersivo: {
    name: "Inmersivo 30X",
    pitch: "Tres días presenciales con los mentores de 30X para destapar lo que frena tu empresa, con tu equipo directivo y otros fundadores de tu etapa.",
    cities: ["Bogotá", "Medellín", "Ciudad de México", "Miami", "Caracas"],
    infoUrl: "https://30x.com/inmersivo",
    formUrl: "https://form.oracle30x.co/to/inmersivo-presencial-30x",
    utm: { utm_source: "roadmap", utm_medium: "web", utm_campaign: "inmersivo_30x" }
  },

  // Llamado de cierre para las etapas 0 a 2 (el original las manda a una comunidad de pago afiliada). Aquí: seguir la cuenta y el podcast.
  follow: {
    instagram: "https://www.instagram.com/crece30x/",
    youtube: "https://www.youtube.com/@30X_by_Andres_Bilbao",
    substack: "https://substack.com/@bilbaos2"
  },

  // Prueba social sin cifras: lo que 30x.com ya publica.
  quote: {
    text: "Escalar no es solo tener mejores herramientas, sino rodearse de personas que ya pasaron por los mismos retos.",
    author: "Andrés Bilbao",
    role: "Cofundador de Rappi y de 30X"
  },

  footer: {
    columns: [
      { title: "Programas", links: [
        ["Inmersivo 30X", "https://30x.com/inmersivo"],
        ["Sales Machine", "https://30x.com/programas/sales-machine"],
        ["AI for Executives", "https://30x.com/ai-for-executives"],
        ["Todos los programas", "https://30x.com/programas"]
      ]},
      { title: "Medios", links: [
        ["30X Podcast (YouTube)", "https://www.youtube.com/@30X_by_Andres_Bilbao"],
        ["Clases 30X (YouTube)", "https://www.youtube.com/@crece30x"],
        ["Hermanos Bilbao (Substack)", "https://substack.com/@bilbaos2"],
        ["@crece30x (Instagram)", "https://www.instagram.com/crece30x/"]
      ]},
      { title: "Sobre 30X", links: [
        ["30x.com", "https://30x.com"],
        ["30X en LinkedIn", "https://www.linkedin.com/company/30xcom/"],
        ["Andrés Bilbao en LinkedIn", "https://www.linkedin.com/in/ahbilbao/"],
        ["@andresbilbao (Instagram)", "https://www.instagram.com/andresbilbao/"]
      ]},
      { title: "Explorar", links: [
        ["Diagnóstico 30X", "https://lopezdiazjcr.github.io/constraint-finder-30x/"],
        ["Guías 30X por etapa", "https://lopezdiazjcr.github.io/etapas-30x/"],
        ["Política de privacidad", "https://30x.com/legal/politica-de-privacidad"]
      ]}
    ],
    credit: "Framework basado en el Scaling Roadmap de Alex Hormozi (Acquisition.com), adaptado al español y a Latinoamérica por 30X."
  }
};
