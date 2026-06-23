import React from 'react';

interface Props {
  urlProductNew: string;
  urlProductGrid: string;
  urlStoreSetting: string;
  urlCmsPageGrid: string;
  urlWidgetGrid: string;
  urlUserGrid: string;
}

const AZUL = '#2A4899';
const VERDE = '#85C639';
const GRIS_BG = '#f8f9fc';
const GRIS_BORDE = '#e2e8f0';

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    gap: 32,
    padding: '24px 0',
    fontFamily: 'Inter, sans-serif',
    color: '#1e293b',
    fontSize: 15,
    lineHeight: 1.6,
    alignItems: 'flex-start'
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    position: 'sticky',
    top: 24,
    background: '#fff',
    border: `1px solid ${GRIS_BORDE}`,
    borderRadius: 10,
    padding: '18px 0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#94a3b8',
    padding: '0 18px 10px',
    borderBottom: `1px solid ${GRIS_BORDE}`,
    marginBottom: 8
  },
  sidebarLink: {
    display: 'block',
    padding: '7px 18px',
    color: '#334155',
    textDecoration: 'none',
    fontSize: 13,
    borderLeft: '3px solid transparent',
    transition: 'all 0.15s'
  },
  content: {
    flex: 1,
    minWidth: 0
  },
  section: {
    background: '#fff',
    border: `1px solid ${GRIS_BORDE}`,
    borderRadius: 12,
    padding: '28px 32px',
    marginBottom: 24,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  },
  h2: {
    fontSize: 20,
    fontWeight: 700,
    color: AZUL,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderBottom: `2px solid ${GRIS_BORDE}`,
    paddingBottom: 12
  },
  badge: {
    background: AZUL,
    color: '#fff',
    borderRadius: 6,
    padding: '2px 10px',
    fontSize: 12,
    fontWeight: 600
  },
  stepGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 14,
    margin: '18px 0'
  },
  stepCard: {
    background: GRIS_BG,
    border: `1px solid ${GRIS_BORDE}`,
    borderRadius: 8,
    padding: '14px 16px',
    position: 'relative' as const
  },
  stepNum: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 26,
    height: 26,
    background: AZUL,
    color: '#fff',
    borderRadius: '50%',
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8
  },
  stepText: {
    fontSize: 13,
    color: '#334155'
  },
  btn: {
    display: 'inline-block',
    background: AZUL,
    color: '#fff',
    borderRadius: 7,
    padding: '8px 18px',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
    marginTop: 14
  },
  btnGreen: {
    display: 'inline-block',
    background: VERDE,
    color: '#fff',
    borderRadius: 7,
    padding: '8px 18px',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
    marginTop: 14
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: 13,
    marginTop: 12
  },
  th: {
    background: AZUL,
    color: '#fff',
    padding: '8px 14px',
    textAlign: 'left' as const,
    fontWeight: 600,
    fontSize: 12
  },
  td: {
    padding: '8px 14px',
    borderBottom: `1px solid ${GRIS_BORDE}`,
    color: '#334155'
  },
  tdAlt: {
    padding: '8px 14px',
    borderBottom: `1px solid ${GRIS_BORDE}`,
    color: '#334155',
    background: GRIS_BG
  },
  figure: {
    border: '2px dashed #cbd5e1',
    borderRadius: 8,
    padding: '20px 18px',
    margin: '16px 0',
    textAlign: 'center' as const,
    color: '#94a3b8',
    background: GRIS_BG
  },
  figCaption: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    fontStyle: 'italic'
  },
  code: {
    fontFamily: 'monospace',
    background: '#f1f5f9',
    border: `1px solid ${GRIS_BORDE}`,
    borderRadius: 4,
    padding: '2px 7px',
    fontSize: 13,
    color: '#0f172a'
  },
  checkItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '8px 0',
    borderBottom: `1px solid ${GRIS_BORDE}`
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: VERDE,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1
  },
  attrRow: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr',
    gap: 10,
    padding: '10px 0',
    borderBottom: `1px solid ${GRIS_BORDE}`,
    fontSize: 13
  },
  attrName: {
    fontFamily: 'monospace',
    background: '#f1f5f9',
    border: `1px solid ${GRIS_BORDE}`,
    borderRadius: 4,
    padding: '2px 8px',
    fontSize: 12,
    color: '#0f172a',
    alignSelf: 'start' as const,
    display: 'inline-block'
  },
  attrDesc: {
    color: '#475569'
  },
  diagramBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    margin: '20px 0',
    flexWrap: 'wrap' as const
  },
  diagramNode: {
    background: '#fff',
    border: `2px solid ${AZUL}`,
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: AZUL,
    textAlign: 'center' as const,
    minWidth: 120
  },
  diagramArrow: {
    fontSize: 22,
    color: '#94a3b8',
    padding: '0 8px'
  },
  diagramNodeGreen: {
    background: '#f0fdf4',
    border: `2px solid ${VERDE}`,
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: '#16a34a',
    textAlign: 'center' as const,
    minWidth: 120
  },
  diagramNodeOrange: {
    background: '#fff7ed',
    border: '2px solid #f97316',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: '#c2410c',
    textAlign: 'center' as const,
    minWidth: 120
  },
  noteBox: {
    background: '#eff6ff',
    border: `1px solid #bfdbfe`,
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 13,
    color: '#1e40af',
    margin: '14px 0'
  },
  warnBox: {
    background: '#fff7ed',
    border: '1px solid #fed7aa',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 13,
    color: '#c2410c',
    margin: '14px 0'
  }
};

const SECCIONES = [
  { id: 'intro', label: 'Introducción y glosario' },
  { id: 'nuevo-producto', label: 'Cargar un producto nuevo' },
  { id: 'atributos', label: 'Atributos técnicos' },
  { id: 'imagenes', label: 'Imágenes — formato y peso' },
  { id: 'familias', label: 'Familias y variantes' },
  { id: 'settings', label: 'Datos del sitio' },
  { id: 'contenido', label: 'Páginas y secciones' },
  { id: 'usuarios', label: 'Usuarios del admin' }
];

const GLOSARIO: [string, string][] = [
  ['Products', 'Productos'],
  ['Categories', 'Categorías'],
  ['Collections', 'Colecciones'],
  ['Attributes', 'Atributos'],
  ['Settings', 'Configuración'],
  ['CMS Pages', 'Páginas de contenido'],
  ['Widgets', 'Secciones del sitio'],
  ['New product', 'Nuevo producto'],
  ['Save', 'Guardar'],
  ['Delete', 'Eliminar'],
  ['Edit', 'Editar'],
  ['Status', 'Estado (activo/inactivo)'],
  ['Price', 'Precio'],
  ['Weight', 'Peso'],
  ['Image', 'Imagen'],
  ['Users', 'Usuarios']
];

interface AtributoDoc {
  name: string;
  desc: string;
  formato: string;
  ejemplo: string;
}

const ATRIBUTOS: AtributoDoc[] = [
  {
    name: 'usos',
    desc: 'Campos de aplicación recomendados para el producto. Se muestra como lista con viñetas.',
    formato: 'Cada uso separado por un guion con espacios " - ".',
    ejemplo: 'Pegado de suelas - Unión de cueros - Forrado de plantillas'
  },
  {
    name: 'caracteristicas',
    desc: 'Propiedades técnicas principales (viscosidad, color, secado, etc.). Se muestra como lista con viñetas.',
    formato: 'Cada característica separada por un guion con espacios " - ".',
    ejemplo: 'Base poliuretano - Color ámbar - Viscosidad 2500 cp - Secado 15 min'
  },
  {
    name: 'modo_empleo',
    desc: 'Instrucciones paso a paso de aplicación. Cada paso se muestra como una tarjeta numerada con título y detalle.',
    formato: 'Cada paso con el patrón "N. Título: detalle", separados por " - ".',
    ejemplo: '1. Preparar: limpie la superficie de polvo y grasa - 2. Aplicar: extienda una capa uniforme con brocha - 3. Secar: deje secar 15 minutos'
  },
  {
    name: 'preguntas_frecuentes',
    desc: 'Preguntas y respuestas frecuentes. Cada par se muestra como un acordeón (pregunta resaltada + respuesta desplegable).',
    formato: 'Cada pregunta debe abrir con "¿" y cerrar con "?", seguida de su respuesta. Separe cada par con " - ".',
    ejemplo: '¿Se debe diluir antes de usar? No, viene listo para aplicar. - ¿Cuánto tarda en secar? Entre 10 y 15 minutos.'
  },
  {
    name: 'precauciones_h',
    desc: 'Declaraciones de peligro H según GHS/SGA. Se muestra como lista.',
    formato: 'Cada declaración separada por " - ".',
    ejemplo: 'H226 Líquido y vapores inflamables - H336 Puede provocar somnolencia'
  },
  {
    name: 'consejos_prudencia_p',
    desc: 'Consejos de prudencia P según GHS/SGA. Se muestra como lista.',
    formato: 'Cada consejo separado por " - ".',
    ejemplo: 'P210 Mantener alejado del calor - P260 No respirar los vapores'
  },
  {
    name: 'ghs_pictogramas',
    desc: 'Códigos de pictogramas GHS de peligro. Se muestran como íconos con su nombre.',
    formato: 'Solo los códigos, separados por " - ". Acepta GHS02, SGA 02, etc.',
    ejemplo: 'GHS02 - GHS07'
  },
  {
    name: 'codigo_industrial',
    desc: 'Código interno o de referencia industrial del producto. Texto libre.',
    formato: 'Texto simple, sin formato especial.',
    ejemplo: 'I-111'
  },
  {
    name: 'ficha_tecnica_url',
    desc: 'Enlace al PDF de la ficha técnica. Habilita el botón de descarga con captura de datos.',
    formato: 'Una URL completa (https://…) o una ruta interna que empiece con "/". Sin espacios.',
    ejemplo: 'https://www.grupoincap.com.co/media/fichas/lamifort.pdf'
  }
];

export default function GuiaPage({
  urlProductNew,
  urlProductGrid,
  urlStoreSetting,
  urlCmsPageGrid,
  urlWidgetGrid,
  urlUserGrid
}: Props) {
  return (
    <div style={styles.wrapper}>

      {/* SIDEBAR */}
      <nav style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Contenido</div>
        {SECCIONES.map((s) => (
          <a key={s.id} href={`#${s.id}`} style={styles.sidebarLink}>
            {s.label}
          </a>
        ))}
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.content}>

        {/* ===== 1. INTRO + GLOSARIO ===== */}
        <section id="intro" style={styles.section}>
          <h2 style={styles.h2}>
            <span style={styles.badge}>1</span>
            Introducción y glosario
          </h2>

          <p>
            Bienvenido al panel de administración del sitio de <strong>Grupo INCAP</strong>.
            Desde aquí puede gestionar el catálogo de productos, las imágenes, los textos del
            sitio, los usuarios con acceso al panel y otros contenidos.
          </p>

          <div style={styles.noteBox}>
            <strong>Nota:</strong> Algunas etiquetas del sistema aparecen en <strong>inglés</strong>,
            ya que el panel base está en ese idioma. En la tabla siguiente encontrará la traducción
            de los términos más comunes.
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '20px 0 8px' }}>
            Glosario Inglés → Español
          </h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Término en el panel (inglés)</th>
                <th style={styles.th}>Significado (español)</th>
              </tr>
            </thead>
            <tbody>
              {GLOSARIO.map(([en, es], i) => (
                <tr key={en}>
                  <td style={i % 2 === 0 ? styles.td : styles.tdAlt}>
                    <span style={styles.code}>{en}</span>
                  </td>
                  <td style={i % 2 === 0 ? styles.td : styles.tdAlt}>{es}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ===== 2. NUEVO PRODUCTO ===== */}
        <section id="nuevo-producto" style={styles.section}>
          <h2 style={styles.h2}>
            <span style={styles.badge}>2</span>
            Cargar un producto nuevo
          </h2>

          <p>
            Esta es la operación más frecuente. Siga los pasos en orden para registrar
            correctamente un nuevo adhesivo en el catálogo.
          </p>

          <div style={styles.stepGrid}>
            {[
              { n: 1, titulo: 'Ir a Catalog → Products', desc: 'En el menú lateral, haga clic en "Catalog" y luego en "Products".' },
              { n: 2, titulo: 'Clic en "New product"', desc: 'Botón en la esquina superior derecha de la grilla de productos.' },
              { n: 3, titulo: 'Escribir el Nombre', desc: 'Use la convención Familia - Tamaño (ej. Lamifort - 10kg). Es lo más importante.' },
              { n: 4, titulo: 'Tocar "Sugerir SKU"', desc: 'El sistema genera o valida el SKU automáticamente según el nombre ingresado.' },
              { n: 5, titulo: 'Completar Precio', desc: 'Ingrese el precio de lista (sin puntos de miles, use punto decimal si aplica).' },
              { n: 6, titulo: 'Seleccionar Categoría', desc: 'Elija la categoría correcta: Calzado, Hogar y Multiusos, Madera y Muebles, o Colchones y Espumas.' },
              { n: 7, titulo: 'Activar Estado', desc: 'Cambie Status a "Enabled" (activo) para que aparezca en el sitio.' },
              { n: 8, titulo: 'Guardar (Save)', desc: 'Haga clic en el botón "Save" en la esquina superior o inferior de la página.' }
            ].map((step) => (
              <div key={step.n} style={styles.stepCard}>
                <div style={styles.stepNum}>{step.n}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: '#0f172a' }}>
                  {step.titulo}
                </div>
                <div style={styles.stepText}>{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Convención de nombre */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '24px 0 8px' }}>
            Convención de nombre: <span style={styles.code}>Familia - Tamaño</span>
          </h3>
          <p style={{ fontSize: 13, color: '#475569', marginBottom: 10 }}>
            Ejemplos: <span style={styles.code}>Lamifort - 10kg</span>,{' '}
            <span style={styles.code}>ACUAPIEL - 4kg</span>,{' '}
            <span style={styles.code}>Super PVA - 500g</span>.
            El guion largo con espacios (<code style={styles.code}> - </code>) es obligatorio;
            separa la familia (línea de producto) del tamaño (presentación).
          </p>

          {/* Diagrama SKU */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '20px 0 8px' }}>
            Anatomía del SKU
          </h3>
          <p style={{ fontSize: 13, color: '#475569', marginBottom: 14 }}>
            El SKU tiene tres partes: <strong>LINEA-VARIANTE-TAMAÑO</strong>.
          </p>

          <svg viewBox="0 0 560 110" style={{ width: '100%', maxWidth: 560, display: 'block', margin: '0 auto 6px' }}>
            {/* Fondo caja */}
            <rect x="10" y="10" width="540" height="55" rx="10" fill="#f8f9fc" stroke="#e2e8f0" strokeWidth="1.5"/>
            {/* LÍNEA */}
            <rect x="30" y="20" width="140" height="35" rx="7" fill={AZUL}/>
            <text x="100" y="43" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="monospace">LA</text>
            {/* guion */}
            <text x="180" y="43" textAnchor="middle" fill="#94a3b8" fontSize="18" fontFamily="monospace">-</text>
            {/* VARIANTE */}
            <rect x="200" y="20" width="140" height="35" rx="7" fill={VERDE}/>
            <text x="270" y="43" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="monospace">LF</text>
            {/* guion */}
            <text x="350" y="43" textAnchor="middle" fill="#94a3b8" fontSize="18" fontFamily="monospace">-</text>
            {/* TAMAÑO */}
            <rect x="370" y="20" width="160" height="35" rx="7" fill="#475569"/>
            <text x="450" y="43" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="monospace">010</text>
            {/* Leyendas */}
            <text x="100" y="80" textAnchor="middle" fill={AZUL} fontSize="11" fontFamily="Inter,sans-serif">Línea (Lamifort)</text>
            <text x="270" y="80" textAnchor="middle" fill="#16a34a" fontSize="11" fontFamily="Inter,sans-serif">Variante (LF)</text>
            <text x="450" y="80" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="Inter,sans-serif">Tamaño (10 kg)</text>
            {/* Ejemplo completo */}
            <text x="280" y="102" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter,sans-serif">Ejemplo completo: LA-LF-010</text>
          </svg>

          {/* Botón "Sugerir SKU" — 3 casos */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '22px 0 8px' }}>
            Cómo funciona el botón "Sugerir SKU"
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, margin: '10px 0 18px' }}>
            <div style={{ ...styles.stepCard, borderTop: `3px solid ${VERDE}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 6 }}>Caso A — Familia conocida</div>
              <div style={{ fontSize: 12, color: '#475569' }}>
                Si el nombre empieza con una familia ya existente (ej. "Lamifort"),
                el sistema genera el SKU correcto automáticamente.
                <strong> No es necesario revisarlo.</strong>
              </div>
            </div>
            <div style={{ ...styles.stepCard, borderTop: `3px solid #f97316` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#c2410c', marginBottom: 6 }}>Caso B — Línea nueva</div>
              <div style={{ fontSize: 12, color: '#475569' }}>
                Si el nombre no corresponde a ninguna familia existente, el sistema sugiere
                un SKU editable marcado con un aviso. <strong>Revisarlo antes de guardar.</strong>
              </div>
            </div>
            <div style={{ ...styles.stepCard, borderTop: `3px solid #dc2626` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>Caso C — Posible duplicado</div>
              <div style={{ fontSize: 12, color: '#475569' }}>
                Si el SKU generado ya existe en el catálogo, el sistema muestra una alerta
                de posible duplicado. <strong>Verificar si es un producto distinto.</strong>
              </div>
            </div>
          </div>

          {/* Flujo de alta */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '18px 0 10px' }}>
            Flujo de alta de producto
          </h3>
          <div style={styles.diagramBox}>
            <div style={styles.diagramNode}>Ingresar nombre<br/><span style={{ fontSize: 11, fontWeight: 400 }}>Familia - Tamaño</span></div>
            <div style={styles.diagramArrow}>→</div>
            <div style={styles.diagramNode}>Sugerir SKU</div>
            <div style={styles.diagramArrow}>→</div>
            <div style={styles.diagramNode}>Completar precio<br/>y categoría</div>
            <div style={styles.diagramArrow}>→</div>
            <div style={styles.diagramNode}>Activar estado</div>
            <div style={styles.diagramArrow}>→</div>
            <div style={styles.diagramNodeGreen}>Guardar</div>
          </div>

          <figure style={styles.figure}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              Captura sugerida: pantalla de "New product" con el nombre y SKU completados
            </div>
            <figcaption style={styles.figCaption}>
              Reemplace este bloque por una captura real del formulario de nuevo producto.
            </figcaption>
          </figure>

          <a href={urlProductNew} style={styles.btnGreen}>
            Ir a crear producto nuevo
          </a>
          {' '}
          <a href={urlProductGrid} style={{ ...styles.btn, marginLeft: 10 }}>
            Ver listado de productos
          </a>
        </section>

        {/* ===== 3. ATRIBUTOS TÉCNICOS ===== */}
        <section id="atributos" style={styles.section}>
          <h2 style={styles.h2}>
            <span style={styles.badge}>3</span>
            Atributos técnicos del producto
          </h2>

          <p>
            Dentro de la ficha de cada producto (pantalla de edición) encontrará campos adicionales
            para la información técnica. A continuación se describe cada uno:
          </p>

          <div style={styles.noteBox}>
            La <strong>descripción principal</strong> del producto se edita con el editor de texto
            enriquecido (EditorJS) que aparece en la parte superior de la ficha. Los atributos
            técnicos se encuentran en la sección de "Attributes" más abajo en la misma página.
          </div>

          {/* REGLA DE ORO del formato */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '22px 0 8px' }}>
            Regla de oro: cómo separar los datos
          </h3>
          <div style={styles.warnBox}>
            Varios campos se muestran en el sitio como <strong>listas, pasos o acordeones</strong>.
            Para que el sitio sepa dónde empieza y termina cada elemento, debe respetar el
            <strong> separador</strong> de cada campo:
            <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
              <li>Para separar elementos de una lista o pares de preguntas, use un{' '}
                <strong>guion con un espacio a cada lado</strong>: <span style={styles.code}>{' - '}</span>
                (espacio, guion, espacio).</li>
              <li>En <span style={styles.code}>preguntas_frecuentes</span>, además, cada pregunta debe{' '}
                <strong>abrir con <span style={styles.code}>¿</span> y cerrar con <span style={styles.code}>?</span></strong>.
                Así el sitio distingue la pregunta de la respuesta.</li>
              <li>En <span style={styles.code}>modo_empleo</span>, cada paso lleva{' '}
                <strong>número, título y dos puntos</strong>: <span style={styles.code}>1. Título: detalle</span>.</li>
            </ul>
          </div>

          {/* Ficha de cada atributo: descripción + formato + ejemplo */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ATRIBUTOS.map((attr) => (
              <div key={attr.name} style={{ ...styles.stepCard, padding: '16px 18px' }}>
                <code style={{ ...styles.attrName, fontSize: 13, marginBottom: 8 }}>{attr.name}</code>
                <div style={{ ...styles.attrDesc, marginTop: 8 }}>{attr.desc}</div>
                <div style={{ fontSize: 12, color: '#64748b', margin: '10px 0 2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Formato</div>
                <div style={{ fontSize: 13, color: '#475569' }}>{attr.formato}</div>
                <div style={{ fontSize: 12, color: '#64748b', margin: '10px 0 4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ejemplo</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#0f172a', background: '#f1f5f9', border: `1px solid ${GRIS_BORDE}`, borderRadius: 6, padding: '8px 12px', lineHeight: 1.55, whiteSpace: 'pre-wrap' as const }}>
                  {attr.ejemplo}
                </div>
              </div>
            ))}
          </div>

          {/* Ejemplo correcto vs incorrecto en FAQ */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '24px 0 8px' }}>
            Ejemplo: preguntas frecuentes (correcto vs. incorrecto)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div style={{ ...styles.stepCard, borderTop: `3px solid ${VERDE}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 8 }}>✓ CORRECTO</div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#0f172a', lineHeight: 1.6 }}>
                ¿Se debe diluir antes de usar? No, viene listo para aplicar. <strong style={{ color: '#16a34a' }}>-</strong> ¿Cuánto tarda en secar? Entre 10 y 15 minutos.
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 8 }}>
                Cada pregunta abre con <span style={styles.code}>¿</span> y cierra con{' '}
                <span style={styles.code}>?</span>; los pares se separan con{' '}
                <span style={styles.code}>{' - '}</span>.
              </div>
            </div>
            <div style={{ ...styles.stepCard, borderTop: '3px solid #dc2626' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>✗ INCORRECTO</div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#0f172a', lineHeight: 1.6 }}>
                Se debe diluir antes de usar. No, viene listo. Cuanto tarda en secar. Entre 10 y 15 minutos.
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 8 }}>
                Sin <span style={styles.code}>¿ ?</span> ni separador <span style={styles.code}>{' - '}</span>:
                el sitio no puede distinguir la pregunta de la respuesta y el contenido se ve mezclado.
              </div>
            </div>
          </div>

          <figure style={{ ...styles.figure, marginTop: 20 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              Captura sugerida: sección de atributos técnicos en la ficha de un producto
            </div>
            <figcaption style={styles.figCaption}>
              Reemplace este bloque por una captura real de la pantalla de edición de producto.
            </figcaption>
          </figure>

          <a href={urlProductGrid} style={styles.btn}>
            Ir al listado de productos
          </a>
        </section>

        {/* ===== 4. IMÁGENES ===== */}
        <section id="imagenes" style={styles.section}>
          <h2 style={styles.h2}>
            <span style={styles.badge}>4</span>
            Imágenes de producto — formato y peso
          </h2>

          <p>
            Las imágenes deben cumplir ciertas reglas para que se vean correctamente en el sitio
            y no ralenticen la carga. Siga el siguiente checklist antes de subir cada imagen.
          </p>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '16px 0 10px' }}>
            Checklist de imágenes
          </h3>

          {[
            { ok: true, texto: 'Formato WebP o JPG (preferiblemente WebP).' },
            { ok: true, texto: 'Peso menor a 1 MB (ideal: menos de 500 KB).' },
            { ok: true, texto: <>Nombre de archivo <strong>sin espacios ni tildes</strong>. Use guiones: <span style={styles.code}>super-pva-20kg.webp</span></> },
            { ok: true, texto: 'Tamaño recomendado: ~1200 px en el lado más largo.' },
            { ok: false, texto: 'NO subir PNG de alta resolución sin comprimir (suelen pesar 5–15 MB).' },
            { ok: false, texto: 'NO usar nombres con espacios, tildes o caracteres especiales.' }
          ].map((item, i) => (
            <div key={i} style={{ ...styles.checkItem, borderBottom: i < 5 ? `1px solid ${GRIS_BORDE}` : 'none' }}>
              <div style={{
                ...styles.checkIcon,
                background: item.ok ? VERDE : '#dc2626'
              }}>
                {item.ok ? '✓' : '✗'}
              </div>
              <div style={{ fontSize: 13, color: '#334155', paddingTop: 1 }}>{item.texto}</div>
            </div>
          ))}

          {/* Diagrama optimización */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '24px 0 10px' }}>
            Cómo reducir el peso de una imagen
          </h3>

          <div style={styles.diagramBox}>
            <div style={styles.diagramNodeOrange}>
              Imagen original<br/>
              <span style={{ fontSize: 11, fontWeight: 400 }}>JPG/PNG pesado (5 MB)</span>
            </div>
            <div style={styles.diagramArrow}>→</div>
            <div style={styles.diagramNode}>
              Optimizar<br/>
              <span style={{ fontSize: 11, fontWeight: 400 }}>Squoosh · TinyPNG<br/>o "Optimize images" del panel</span>
            </div>
            <div style={styles.diagramArrow}>→</div>
            <div style={styles.diagramNodeGreen}>
              WebP listo<br/>
              <span style={{ fontSize: 11, fontWeight: 400 }}>{'< 1 MB'}</span>
            </div>
          </div>

          <div style={styles.noteBox}>
            <strong>Herramienta interna:</strong> El panel cuenta con la opción{' '}
            <strong>"Optimize images"</strong> (en la sección de herramientas de administración)
            que convierte automáticamente las imágenes subidas al formato WebP y reduce su peso.
            También puede usar herramientas online gratuitas como{' '}
            <strong>Squoosh</strong> (squoosh.app) o <strong>TinyPNG</strong> (tinypng.com)
            antes de subir la imagen.
          </div>

          <figure style={styles.figure}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              Captura sugerida: selector de imágenes en la ficha de producto
            </div>
            <figcaption style={styles.figCaption}>
              Reemplace este bloque por una captura real de la sección de imágenes.
            </figcaption>
          </figure>

          <a href={urlProductGrid} style={styles.btn}>
            Ir al listado de productos
          </a>
        </section>

        {/* ===== 5. FAMILIAS Y VARIANTES ===== */}
        <section id="familias" style={styles.section}>
          <h2 style={styles.h2}>
            <span style={styles.badge}>5</span>
            Familias y variantes
          </h2>

          <p>
            Cuando varios productos comparten la misma fórmula y difieren solo en el tamaño
            (presentación), se agrupan en una <strong>familia</strong>. La familia se deriva
            automáticamente del nombre: todo lo que aparece <em>antes</em> del separador{' '}
            <span style={styles.code}> - </span> es la familia.
          </p>

          <div style={{ ...styles.diagramBox, margin: '16px 0' }}>
            <div style={styles.diagramNode}>Lamifort - 4kg</div>
            <div style={styles.diagramArrow}>+</div>
            <div style={styles.diagramNode}>Lamifort - 10kg</div>
            <div style={styles.diagramArrow}>+</div>
            <div style={styles.diagramNode}>Lamifort - 20kg</div>
            <div style={styles.diagramArrow}>→</div>
            <div style={styles.diagramNodeGreen}>Familia:<br/>Lamifort</div>
          </div>

          <div style={styles.noteBox}>
            <strong>Herramienta "Sync variants":</strong> Después de cargar todos los tamaños de
            una línea, use esta herramienta del panel para vincular las variantes entre sí.
            Esto permite que en el sitio, el cliente pueda cambiar de presentación sin salir
            de la ficha del producto.
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '20px 0 8px' }}>
            Las 4 categorías oficiales del catálogo
          </h3>

          <p style={{ fontSize: 13, color: '#475569', marginBottom: 10 }}>
            Al asignar la categoría de un producto, utilice siempre el <strong>nombre</strong>,
            no un número. Los identificadores numéricos cambian y pueden causar errores.
          </p>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre de la categoría</th>
                <th style={styles.th}>Referencia interna (url_key)</th>
                <th style={styles.th}>Tipo de productos</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Calzado y Marroquinería', 'calzado', 'Adhesivos para calzado, cuero y marroquinería'],
                ['Hogar y Multiusos', 'multiusos', 'Adhesivos de uso doméstico y general'],
                ['Madera y Muebles', 'madera', 'Adhesivos para madera, enchape y carpintería'],
                ['Colchones y Espumas', 'colchones', 'Adhesivos para espumas, colchones y tapicería']
              ].map(([nombre, key, tipo], i) => (
                <tr key={key}>
                  <td style={i % 2 === 0 ? styles.td : styles.tdAlt}><strong>{nombre}</strong></td>
                  <td style={i % 2 === 0 ? styles.td : styles.tdAlt}><span style={styles.code}>{key}</span></td>
                  <td style={i % 2 === 0 ? styles.td : styles.tdAlt}>{tipo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <a href={urlProductGrid} style={styles.btn}>
            Ir al listado de productos
          </a>
        </section>

        {/* ===== 6. SETTINGS ===== */}
        <section id="settings" style={styles.section}>
          <h2 style={styles.h2}>
            <span style={styles.badge}>6</span>
            Datos del sitio (Configuración)
          </h2>

          <p>
            Desde <strong>Settings → Store information</strong> puede actualizar los datos
            de contacto que aparecen en todo el sitio web. Cualquier cambio aquí se refleja
            automáticamente en el pie de página, la barra de contacto y demás secciones.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, margin: '18px 0' }}>
            {[
              { label: 'Nombre del negocio', desc: 'Aparece en el encabezado y SEO.' },
              { label: 'Teléfono', desc: 'Número que aparece en el pie de página y barra de contacto.' },
              { label: 'WhatsApp', desc: 'Número para el botón flotante de WhatsApp.' },
              { label: 'Email de contacto', desc: 'Correo que aparece en el sitio.' },
              { label: 'Dirección', desc: 'Dirección física de la empresa.' },
              { label: 'Redes sociales', desc: 'Instagram, Facebook, LinkedIn, etc.' }
            ].map((item) => (
              <div key={item.label} style={styles.stepCard}>
                <div style={{ fontWeight: 700, fontSize: 13, color: AZUL, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={styles.warnBox}>
            <strong>Importante:</strong> No edite los datos de contacto directamente en el código
            del sitio. Siempre use esta sección de Configuración para que los cambios sean
            consistentes en todo el sitio.
          </div>

          <a href={urlStoreSetting} style={styles.btn}>
            Ir a Configuración del sitio
          </a>
        </section>

        {/* ===== 7. PÁGINAS Y SECCIONES ===== */}
        <section id="contenido" style={styles.section}>
          <h2 style={styles.h2}>
            <span style={styles.badge}>7</span>
            Páginas y secciones de contenido
          </h2>

          <p>
            El sitio tiene dos tipos de contenido editable desde el admin, además del catálogo
            de productos:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, margin: '18px 0' }}>
            {/* CMS Pages */}
            <div style={{ ...styles.section, margin: 0, borderTop: `3px solid ${AZUL}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: AZUL, marginBottom: 10 }}>
                CMS Pages — Páginas de contenido
              </h3>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 12 }}>
                Son páginas completas con texto enriquecido: "Quiénes Somos", "Política de
                privacidad", "Términos y condiciones", etc. Se crean y editan desde{' '}
                <strong>CMS → Pages</strong>.
              </p>
              <ul style={{ fontSize: 13, color: '#475569', paddingLeft: 18, marginBottom: 14 }}>
                <li>Cada página tiene una URL propia (url_key).</li>
                <li>Se puede editar el título, contenido y metadatos SEO.</li>
                <li>Los cambios se publican de inmediato.</li>
              </ul>
              <a href={urlCmsPageGrid} style={styles.btn}>
                Ir a CMS Pages
              </a>
            </div>

            {/* Widgets */}
            <div style={{ ...styles.section, margin: 0, borderTop: `3px solid ${VERDE}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#16a34a', marginBottom: 10 }}>
                Widgets — Secciones del inicio
              </h3>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 12 }}>
                Son bloques o secciones dentro de las páginas: el carrusel del inicio (Hero),
                banners promocionales, listas de enlaces, etc. Se gestionan desde{' '}
                <strong>CMS → Widgets</strong>.
              </p>
              <ul style={{ fontSize: 13, color: '#475569', paddingLeft: 18, marginBottom: 14 }}>
                <li>El <strong>Hero</strong> (carrusel principal) se edita aquí.</li>
                <li>Se puede cambiar el orden, activar o desactivar secciones.</li>
                <li>Los cambios se ven de inmediato en el sitio.</li>
              </ul>
              <a href={urlWidgetGrid} style={{ ...styles.btn, background: VERDE }}>
                Ir a Widgets
              </a>
            </div>
          </div>

          <figure style={styles.figure}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              Captura sugerida: grilla de CMS Pages con las páginas existentes
            </div>
            <figcaption style={styles.figCaption}>
              Reemplace este bloque por una captura real de la sección CMS Pages.
            </figcaption>
          </figure>
        </section>

        {/* ===== 8. USUARIOS ===== */}
        <section id="usuarios" style={styles.section}>
          <h2 style={styles.h2}>
            <span style={styles.badge}>8</span>
            Usuarios del admin
          </h2>

          <p>
            Desde la sección <strong>Users</strong> del menú puede gestionar quién tiene
            acceso al panel de administración.
          </p>

          <div style={styles.stepGrid}>
            {[
              { n: 1, titulo: 'Crear un usuario', desc: 'Haga clic en "+ Nuevo usuario", complete nombre, email y contraseña, luego guarde.' },
              { n: 2, titulo: 'Editar datos', desc: 'Clic en "Editar" junto al usuario para cambiar nombre, email o contraseña.' },
              { n: 3, titulo: 'Activar / Desactivar', desc: 'Use el botón "Activar" o "Desactivar" para habilitar o bloquear el acceso sin eliminar la cuenta.' },
              { n: 4, titulo: 'Eliminar usuario', desc: 'Use el botón "Eliminar". Esta acción no se puede deshacer. El sistema no permite eliminar el propio usuario ni el último administrador activo.' }
            ].map((step) => (
              <div key={step.n} style={styles.stepCard}>
                <div style={styles.stepNum}>{step.n}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: '#0f172a' }}>
                  {step.titulo}
                </div>
                <div style={styles.stepText}>{step.desc}</div>
              </div>
            ))}
          </div>

          <div style={styles.warnBox}>
            <strong>Restricciones de seguridad:</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 13 }}>
              <li>No es posible eliminar al <strong>último administrador activo</strong> del sistema.</li>
              <li>No es posible eliminar ni desactivar la <strong>propia cuenta</strong> con la que está logueado.</li>
              <li>Si pierde el acceso al único administrador, deberá contactar al equipo técnico.</li>
            </ul>
          </div>

          <figure style={styles.figure}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              Captura sugerida: tabla de usuarios con botones Editar, Activar/Desactivar y Eliminar
            </div>
            <figcaption style={styles.figCaption}>
              Reemplace este bloque por una captura real de la pantalla de usuarios.
            </figcaption>
          </figure>

          <a href={urlUserGrid} style={styles.btn}>
            Ir a gestión de usuarios
          </a>
        </section>

      </main>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query GuiaPageQuery {
    urlProductNew: url(routeId: "productNew")
    urlProductGrid: url(routeId: "productGrid")
    urlStoreSetting: url(routeId: "storeSetting")
    urlCmsPageGrid: url(routeId: "cmsPageGrid")
    urlWidgetGrid: url(routeId: "widgetGrid")
    urlUserGrid: url(routeId: "userGrid")
  }
`;
