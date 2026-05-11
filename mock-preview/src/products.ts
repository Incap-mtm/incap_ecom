export const PRODUCTS = [
  // MADERA
  {
    sku: "PVA-8000-01",
    name: "PVA Industrial 8000",
    slug: "pva-8000",
    description: "El adhesivo PVA más confiable para el sector maderero. Ideal para ensambles que requieren alta resistencia mecánica y secado rápido.",
    category: "madera",
    cat: "Base Agua",
    feature: "Secado Rápido",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
    instructions: "1. Preparar: Materiales exentos de polvo y grasas. 2. Aplicar: Capa uniforme. 3. Presionar: Mantener presión por 15-20 min.",
    safety: ["GHS07"],
    faqs: [
      { q: "¿Es resistente a la humedad?", a: "Es resistente a la humedad moderada, ideal para interiores." }
    ],
    variants: [
      { sku: "PVA-8000-GL", name: "Galón", sap: "1010101", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600" },
      { sku: "PVA-8000-CN", name: "Cuñete", sap: "1010102", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    sku: "MADE-CONT-01",
    name: "Madefort Contacto",
    slug: "madefort",
    description: "Pegamento de contacto diseñado para carpintería de alta calidad y láminas decorativas (fórmica).",
    category: "madera",
    cat: "Solvente",
    feature: "Alto Tack",
    image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=600",
    instructions: "1. Limpiar superficies. 2. Aplicar en ambas caras. 3. Esperar secado al tacto. 4. Unir.",
    safety: ["GHS02", "GHS07", "GHS08"],
    variants: [
      { sku: "MADE-CONT-750", name: "750cc", sap: "1020201", image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    sku: "IS-1-375",
    name: "Incaspray 1",
    slug: "incaspray-1",
    description: "Adhesivo monocomponente de alta cobertura para grandes superficies y procesos de post-formado.",
    category: "madera",
    cat: "Aspersión",
    feature: "Gran Cobertura",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
    instructions: "1. Preparar superficies limpias. 2. Aplicar película delgada por aspersión. 3. Unir bajo presión.",
    safety: ["GHS02", "GHS07"],
    faqs: [
      { q: "¿En qué superficies se puede aplicar?", a: "Madera, fórmica, espumas y tapicería industrial." },
      { q: "¿Es resistente al calor?", a: "Sí, ideal para procesos de post-formado." }
    ],
    variants: [
      { sku: "IS-1-375", name: "375cc", sap: "1111120104", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600" },
      { sku: "IS-1-750", name: "750cc", sap: "1111120109", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    sku: "IS-2-8G",
    name: "Incaspray 2 - 8 Gal",
    slug: "incaspray-2-8-gal",
    description: "Adhesivo de contacto de alto rendimiento por aspersión, diseñado para procesos industriales de pegado de espumas, fibras y maderas en grandes superficies. Su fórmula de secado instantáneo optimiza los ciclos de producción.",
    category: "madera",
    cat: "Aspersión Industrial",
    feature: "Secado Instantáneo",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
    instructions: "1. Calibrar equipo de aspersión a 30-40 psi. 2. Aplicar película uniforme a una distancia de 20-30cm. 3. Realizar el pegado en los primeros 5 minutos para máxima adherencia.",
    safety: ["GHS02", "GHS07", "GHS08", "GHS09"],
    faqs: [
      { q: "¿Es inflamable?", a: "Sí, contiene solventes inflamables. Debe aplicarse en áreas ventiladas y lejos de chispas." },
      { q: "¿Qué rendimiento tiene?", a: "Aproximadamente 120-150m2 por cada 8 galones, dependiendo del sustrato." }
    ],
    variants: [
      { sku: "IS-2-8GAL", name: "8 Galones", sap: "1111120383", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600" },
      { sku: "IS-2-53GAL", name: "53 Galones", sap: "1111120152", image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800" }
    ]
  },

  // COLCHONES
  {
    sku: "IF-LT-01",
    name: "Incafom LT",
    slug: "incafom-lt",
    description: "Adhesivo amigable con el operario. Elimina riesgos por inhalación de solventes ya que es libre de Tolueno.",
    category: "colchones",
    cat: "Libre Tolueno",
    feature: "No Tóxico",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=600",
    instructions: "1. Aplicar en spray o brocha. 2. Unir espumas de inmediato. 3. Dejar curar.",
    safety: ["GHS02", "GHS07"],
    variants: [
      { sku: "IF-LT-5GAL", name: "5 Galones", sap: "3010101", image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    sku: "IF-WB-01",
    name: "Incafom WaterBase",
    slug: "incafom-wb",
    description: "La evolución del pegue de espumas. 100% libre de VOCs y amigable con el medio ambiente.",
    category: "colchones",
    cat: "Base Agua",
    feature: "Eco-Friendly",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
    instructions: "1. Aspersión fina. 2. Tiempo de oreo breve. 3. Unión bajo presión.",
    safety: ["GHS07"],
    variants: [
      { sku: "IF-WB-CU", name: "Cuñete", sap: "3020202", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  // CALZADO
  {
    sku: "JAB-3000-01",
    name: "JAB 3000",
    slug: "jab-3000",
    description: "El líder indiscutible en el pegado de suelas. Adhesivo de poliuretano de alta resistencia térmica.",
    category: "calzado",
    cat: "Poliuretano",
    feature: "Súper Fuerte",
    image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=600",
    instructions: "1. Cardar superficies. 2. Aplicar adhesivo. 3. Secado 15 min. 4. Reactivar calor 70°C. 5. Prensar.",
    safety: ["GHS02", "GHS07", "GHS08"],
    variants: [
      { sku: "JAB-3000-750", name: "750cc", sap: "4010101", image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    sku: "MA-BL-120",
    name: "Maxón Blanco",
    slug: "maxon-blanco",
    description: "Adhesivo de poliuretano de alta viscosidad y amplio tiempo abierto. Especial para cueros grasos.",
    category: "calzado",
    cat: "Poliuretano",
    feature: "Alta Viscosidad",
    image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=800",
    instructions: "1. Limpiar con solvente. 2. Aplicar. 3. Secar. 4. Reactivar y unir.",
    safety: ["GHS02", "GHS07", "GHS08"],
    variants: [
      { sku: "MA-BL-120", name: "120cc", sap: "1122010102", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600" },
      { sku: "MA-BL-750", name: "750cc", sap: "1122010109", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  // HOGAR
  {
    sku: "PT-UNI-01",
    name: "Pegatodo Universal",
    slug: "pegatodo",
    description: "El adhesivo que no puede faltar en casa. Pega casi cualquier material de forma inmediata y transparente.",
    category: "hogar",
    cat: "Multipropósito",
    feature: "Transparente",
    image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=600",
    instructions: "1. Aplicar gota. 2. Unir piezas. 3. Mantener presión 30 seg.",
    safety: ["GHS07"],
    variants: [
      { sku: "PT-UNI-20", name: "20g", sap: "5010101", image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=600" }
    ]
  }
];
