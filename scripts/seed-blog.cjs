/**
 * seed-blog.cjs
 * Siembra las 2 CMS Pages del blog y el setting `blog_index` en la base de datos.
 *
 * Uso:
 *   DATABASE_URL=<url> node scripts/seed-blog.cjs
 *
 * En Railway SSH:
 *   wget -q "https://raw.githubusercontent.com/.../seed-blog.cjs" -O /tmp/seed-blog.cjs
 *   DATABASE_URL="$DATABASE_URL" node /tmp/seed-blog.cjs
 *
 * NO ejecuta automáticamente — correr a mano DESPUÉS de verificar en staging.
 */

'use strict';

const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL env var no definida.');
  process.exit(1);
}

// ── Helpers para construir contenido EditorJS compatible ────────────────────

/**
 * Genera una Row completa (ancho 12) con un único column de ancho 12
 * que contiene los bloques provistos.
 */
function makeRow(blocks) {
  return {
    id: `row-${Math.random().toString(36).slice(2, 9)}`,
    size: 12,
    columns: [
      {
        id: `col-${Math.random().toString(36).slice(2, 9)}`,
        size: 12,
        data: {
          time: Date.now(),
          blocks,
          version: '2.26.5',
        },
      },
    ],
  };
}

function headerBlock(text, level = 2) {
  return { type: 'header', data: { level, text } };
}

function paragraphBlock(text) {
  return { type: 'paragraph', data: { text } };
}

function quoteBlock(text, caption = '') {
  return { type: 'quote', data: { text, caption } };
}

// ── Contenido del artículo 1 (Interzum 2026) ────────────────────────────────

const POST1_BLOCKS = [
  headerBlock('Interzum 2026: el escenario elegido para un anuncio histórico', 2),
  paragraphBlock(
    'Interzum Colombia es la feria más importante del sector mobiliario, maderero y de superficies en América Latina. Celebrada en Corferias, Bogotá, reúne a fabricantes, distribuidores, ferreterías y talleres de todo el país y la región. Para INCAP SA, elegir esta plataforma no fue casualidad: fue una declaración de intenciones.',
  ),
  paragraphBlock(
    'Durante cuatro días de intensa actividad en el Stand 401, el equipo de INCAP recibió a clientes, aliados estratégicos y distribuidores para presentar en primicia el cambio más significativo en la arquitectura de negocio de la compañía: la evolución de su identidad visual y la consolidación formal de Grupo INCAP.',
  ),
  headerBlock('¿Qué significa la consolidación de Grupo INCAP?', 2),
  paragraphBlock(
    'Grupo INCAP nace como respuesta a una realidad del mercado industrial colombiano: los clientes —desde el mostrador de ferretería hasta el taller especializado— necesitan un socio que les ofrezca más que un producto. Necesitan una solución integral.',
  ),
  paragraphBlock(
    'La consolidación del Grupo articula en un solo paraguas de marca líneas complementarias como JAB, ampliando el portafolio de suministros industriales con una sinergia que eleva los estándares de servicio, disponibilidad y asesoría técnica.',
  ),
  quoteBlock(
    'Lo que ves afuera evoluciona; lo que pega adentro, sigue siendo INCAP.',
    'Grupo INCAP — Interzum 2026',
  ),
  headerBlock('Una nueva identidad visual al servicio de la confianza técnica', 2),
  paragraphBlock(
    'El rebranding de INCAP SA no es un ejercicio estético: es la expresión visual de cincuenta años de trayectoria, actualizados para competir con solidez en el mercado industrial del siglo XXI. La nueva imagen refleja modernidad, integración y la misma confiabilidad técnica que ha caracterizado a la empresa desde sus inicios.',
  ),
  paragraphBlock(
    'Para los distribuidores y ferreterías que trabajan con INCAP, este cambio representa una herramienta adicional de posicionamiento en sus propios mostradores: materiales actualizados, comunicación más clara y una marca que habla el idioma de la industria contemporánea.',
  ),
  headerBlock('El mercado escuchó el mensaje', 2),
  paragraphBlock(
    'La respuesta del mercado durante Interzum 2026 confirmó lo que el equipo de INCAP ya sabía: la industria colombiana estaba lista para recibir una propuesta de valor más estructurada, más visible y más integral. Cada visitante al Stand 401 se fue con algo más que catálogos: se fue con la certeza de que Grupo INCAP es el aliado para construir el futuro de la industria con solidez.',
  ),
  headerBlock('¿Por qué confiar en Grupo INCAP?', 2),
  paragraphBlock(
    'Más de cinco décadas de experiencia en el mercado industrial colombiano, un portafolio ampliado con líneas como JAB, y un equipo técnico comprometido con elevar el estándar de cada ferretería, taller y distribuidor del país.',
  ),
];

// ── Contenido del artículo 2 (calzado) ──────────────────────────────────────

const POST2_BLOCKS = [
  headerBlock('La asesoría técnica como diferenciador en la industria del calzado', 2),
  paragraphBlock(
    'En la industria del calzado colombiano, elegir el adhesivo correcto puede ser la diferencia entre un producto terminado de calidad exportable y uno que no supera los estándares del mercado. Los fabricantes enfrentan preguntas concretas: ¿qué adhesivo usar para unir suela con corte en cuero?, ¿cómo aplicar correctamente los componentes JAB en líneas de producción de pequeña escala?, ¿qué tiempo de secado garantiza mayor resistencia?',
  ),
  paragraphBlock(
    'Esas preguntas tienen respuestas técnicas, y para darlas correctamente no basta con un catálogo de productos: hace falta presencia, escucha y experiencia. Por eso el equipo de INCAP SA y JAB realiza visitas directas a los clientes, sin importar el tamaño de su operación.',
  ),
  headerBlock('Una visita, todas las respuestas', 2),
  paragraphBlock(
    'Durante una visita reciente, el cliente planteó sus dudas sobre la utilización adecuada de los productos INCAP y JAB en su proceso de fabricación de calzado. El resultado fue una sesión de asesoría técnica en sitio donde se abordaron desde los métodos de aplicación hasta las condiciones de almacenamiento, el tiempo de activación de los adhesivos y los cuidados específicos para cada tipo de material.',
  ),
  quoteBlock(
    'Uno de nuestros propósitos es poder escuchar y atender a cada cliente, sin importar el tamaño de la industria.',
    'Equipo INCAP / JAB',
  ),
  paragraphBlock(
    'Este enfoque —ir al lugar de trabajo del cliente, entender su proceso y resolver sus dudas en contexto— es lo que distingue a Grupo INCAP de un simple proveedor de insumos industriales.',
  ),
  headerBlock('Más que adhesivos: un legado construido sobre tres pilares', 2),
  paragraphBlock(
    'En INCAP SA y JAB, la propuesta de valor para la industria del calzado colombiano se sostiene sobre tres valores que guían cada decisión, cada visita y cada producto fabricado: Pasión (compromiso real con el resultado de cada cliente), Calidad (adhesivos y componentes que cumplen los estándares técnicos de la industria) y Comunidad (talento humano y red de clientes que construyen juntos el futuro industrial del país).',
  ),
  headerBlock('El talento humano: el verdadero motor de la industria', 2),
  paragraphBlock(
    'Detrás de cada adhesivo que une una suela, de cada componente JAB que forma parte de un zapato terminado, hay personas: operarios comprometidos, técnicos que conocen sus materiales al detalle y clientes que confían en que el producto llegará a tiempo y funcionará como se espera.',
  ),
  paragraphBlock(
    'En INCAP SA reconocemos que el secreto de la fuerza industrial no reside solo en la formulación del producto, sino en el talento y la vocación de quienes lo fabrican, lo aplican y lo comercializan.',
  ),
  headerBlock('¿Tu empresa fabrica calzado en Colombia y necesita asesoría técnica?', 2),
  paragraphBlock(
    'El equipo técnico de INCAP SA y JAB está disponible para visitar tu planta, resolver tus dudas sobre adhesivos y componentes, y ayudarte a optimizar tu proceso de producción sin importar el tamaño de tu operación.',
  ),
];

// ── Definición de las CMS Pages a sembrar ───────────────────────────────────

const CMS_PAGES = [
  {
    url_key: 'blog-incap-sa-en-interzum-2026',
    name: 'INCAP SA en Interzum 2026: evolución de marca y consolidación del Grupo como solución integral para la industria',
    meta_title: 'INCAP SA en Interzum 2026 | Evolución de marca | Grupo INCAP',
    meta_description:
      'INCAP SA participó en Interzum 2026 en Corferias, Bogotá, presentando su nueva identidad visual y la consolidación de Grupo INCAP como referente de soluciones industriales integrales.',
    content: JSON.stringify([makeRow(POST1_BLOCKS)]),
  },
  {
    url_key: 'blog-adhesivos-para-calzado-en-colombia',
    name: 'Adhesivos para calzado en Colombia: cómo INCAP SA y JAB acompañan al fabricante',
    meta_title: 'Adhesivos para calzado en Colombia | INCAP SA y JAB | Asesoría técnica',
    meta_description:
      'Conoce cómo INCAP SA y JAB acompañan a cada fabricante de calzado en Colombia con asesoría técnica en sitio para optimizar el proceso de producción.',
    content: JSON.stringify([makeRow(POST2_BLOCKS)]),
  },
];

// ── Setting blog_index ───────────────────────────────────────────────────────

const BLOG_INDEX = {
  posts: [
    {
      slug: 'incap-sa-en-interzum-2026',
      cmsUrlKey: 'blog-incap-sa-en-interzum-2026',
      title: 'INCAP SA en Interzum 2026: evolución de marca y consolidación del Grupo como solución integral para la industria',
      excerpt:
        'INCAP SA participó en Interzum 2026 en Corferias, Bogotá, presentando su nueva identidad visual y la consolidación de Grupo INCAP como referente de soluciones industriales integrales para el mercado colombiano.',
      cover: '/images/blog/incap-sa-en-interzum-2026.webp',
      date: '2026-06-15',
      tags: ['Eventos', 'Marca', 'Grupo INCAP'],
      featured: true,
      bodyFallback: [],
    },
    {
      slug: 'adhesivos-para-calzado-en-colombia',
      cmsUrlKey: 'blog-adhesivos-para-calzado-en-colombia',
      title: 'Adhesivos para calzado en Colombia: cómo INCAP SA y JAB acompañan al fabricante desde la asesoría técnica hasta el producto final',
      excerpt:
        'En INCAP SA y JAB no solo fabricamos adhesivos y componentes para calzado: acompañamos a cada fabricante, grande o pequeño, con la asesoría técnica que necesita para sacar el máximo rendimiento de cada producto.',
      cover: '/images/blog/adhesivos-para-calzado-en-colombia.webp',
      date: '2026-06-10',
      tags: ['Calzado', 'Asesoría técnica', 'JAB'],
      featured: false,
      bodyFallback: [],
    },
  ],
  tags: ['Eventos', 'Marca', 'Grupo INCAP', 'Calzado', 'Asesoría técnica', 'JAB'],
};

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: process.env.PGSSL_INSECURE ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();
  console.log('Conectado a PostgreSQL.');

  try {
    await client.query('BEGIN');

    // 1. CMS Pages
    for (const page of CMS_PAGES) {
      // Verificar si ya existe
      const existing = await client.query(
        `SELECT cp.cms_page_id
           FROM cms_page cp
           JOIN cms_page_description cpd ON cpd.cms_page_description_cms_page_id = cp.cms_page_id
          WHERE cpd.url_key = $1`,
        [page.url_key],
      );

      if (existing.rows.length > 0) {
        // Update
        const id = existing.rows[0].cms_page_id;
        await client.query(
          `UPDATE cms_page_description
              SET name = $1, content = $2, meta_title = $3, meta_description = $4
            WHERE cms_page_description_cms_page_id = $5`,
          [page.name, page.content, page.meta_title, page.meta_description, id],
        );
        await client.query(
          `UPDATE cms_page SET status = true, updated_at = NOW() WHERE cms_page_id = $1`,
          [id],
        );
        console.log(`  [UPDATE] CMS Page "${page.url_key}" (id=${id})`);
      } else {
        // Insert
        const r = await client.query(
          `INSERT INTO cms_page (status)
           VALUES (true)
           RETURNING cms_page_id`,
        );
        const newId = r.rows[0].cms_page_id;
        await client.query(
          `INSERT INTO cms_page_description
             (cms_page_description_cms_page_id, url_key, name, content, meta_title, meta_description)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [newId, page.url_key, page.name, page.content, page.meta_title, page.meta_description],
        );
        console.log(`  [INSERT] CMS Page "${page.url_key}" (id=${newId})`);
      }
    }

    // 2. Setting blog_index
    const value = JSON.stringify(BLOG_INDEX);
    await client.query(
      `INSERT INTO setting (name, value, is_json)
       VALUES ('blog_index', $1, true)
       ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, is_json = true`,
      [value],
    );
    console.log('  [UPSERT] Setting blog_index');

    if (process.env.DRY_RUN) {
      await client.query('ROLLBACK');
      console.log('\nDRY RUN: todas las sentencias ejecutaron OK — ROLLBACK (no se persistió nada).');
    } else {
      await client.query('COMMIT');
      console.log('\nSeed completado exitosamente.');
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('ERROR — rollback:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
