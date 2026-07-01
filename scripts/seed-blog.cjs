/**
 * seed-blog.cjs
 * Siembra el setting `blog_index` en la base de datos.
 * A partir del refactor 2026-06-28 el cuerpo de cada artículo vive en el
 * campo `body` (Markdown) dentro de blog_index — ya NO se crean CMS Pages.
 *
 * Uso:
 *   DATABASE_URL=<url> node scripts/seed-blog.cjs
 *   DATABASE_URL=<url> DRY_RUN=1 node scripts/seed-blog.cjs   # no persiste
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

// ── Contenido Markdown de los artículos ─────────────────────────────────────

const BODY_INTERZUM = `## Interzum 2026: el escenario elegido para un anuncio histórico

Interzum Colombia es la feria más importante del sector mobiliario, maderero y de superficies en América Latina. Celebrada en Corferias, Bogotá, reúne a fabricantes, distribuidores, ferreterías y talleres de todo el país y la región. Para INCAP SA, elegir esta plataforma no fue casualidad: fue una declaración de intenciones.

Durante cuatro días de intensa actividad en el Stand 401, el equipo de INCAP recibió a clientes, aliados estratégicos y distribuidores para presentar en primicia el cambio más significativo en la arquitectura de negocio de la compañía: la evolución de su identidad visual y la consolidación formal de Grupo INCAP.

![El stand de INCAP en Interzum 2026, en Corferias (Bogotá), con la identidad renovada de Grupo INCAP.](/images/blog/interzum/interzum-stand-productos.webp)

## ¿Qué significa la consolidación de Grupo INCAP?

Grupo INCAP nace como respuesta a una realidad del mercado industrial colombiano: los clientes —desde el mostrador de ferretería hasta el taller especializado— necesitan un socio que les ofrezca más que un producto. Necesitan una solución integral.

La consolidación del Grupo articula en un solo paraguas de marca líneas complementarias como JAB, ampliando el portafolio de suministros industriales con una sinergia que eleva los estándares de servicio, disponibilidad y asesoría técnica.

![Equipo de Grupo INCAP y JAB en el stand: dos marcas complementarias, una sola solución integral.](/images/blog/interzum/interzum-equipo-jab-incap.webp)

> Lo que ves afuera evoluciona; lo que pega adentro, sigue siendo INCAP. — Grupo INCAP, Interzum 2026

## Una nueva identidad visual al servicio de la confianza técnica

El rebranding de INCAP SA no es un ejercicio estético: es la expresión visual de cincuenta años de trayectoria, actualizados para competir con solidez en el mercado industrial del siglo XXI. La nueva imagen refleja modernidad, integración y la misma confiabilidad técnica que ha caracterizado a la empresa desde sus inicios.

Para los distribuidores y ferreterías que trabajan con INCAP, este cambio representa una herramienta adicional de posicionamiento en sus propios mostradores: materiales actualizados, comunicación más clara y una marca que habla el idioma de la industria contemporánea.

![El nuevo portafolio de productos INCAP con la imagen visual renovada, exhibido en Interzum 2026.](/images/blog/interzum/interzum-mesa-productos.webp)

## El mercado escuchó el mensaje

La respuesta del mercado durante Interzum 2026 confirmó lo que el equipo de INCAP ya sabía: la industria colombiana estaba lista para recibir una propuesta de valor más estructurada, más visible y más integral. Cada visitante al Stand 401 se fue con algo más que catálogos: se fue con la certeza de que Grupo INCAP es el aliado para construir el futuro de la industria con solidez.

![Los visitantes del Stand 401 conocieron de cerca la evolución de marca de INCAP SA.](/images/blog/interzum/interzum-balon-incap.webp)

## ¿Por qué confiar en Grupo INCAP?

Más de cinco décadas de experiencia en el mercado industrial colombiano, un portafolio ampliado con líneas como JAB, y un equipo técnico comprometido con elevar el estándar de cada ferretería, taller y distribuidor del país.`;

const BODY_CALZADO = `## La asesoría técnica como diferenciador en la industria del calzado

En la industria del calzado colombiano, elegir el adhesivo correcto puede ser la diferencia entre un producto terminado de calidad exportable y uno que no supera los estándares del mercado. Los fabricantes enfrentan preguntas concretas: ¿qué adhesivo usar para unir suela con corte en cuero?, ¿cómo aplicar correctamente los componentes JAB en líneas de producción de pequeña escala?

Esas preguntas tienen respuestas técnicas, y para darlas correctamente no basta con un catálogo de productos: hace falta presencia, escucha y experiencia. Por eso el equipo de INCAP SA y JAB realiza visitas directas a los clientes, sin importar el tamaño de su operación.

![La línea MAXÓN de INCAP, presente en el taller de un fabricante de calzado en Colombia.](/images/blog/calzado/calzado-afiche-maxon.webp)

## Una visita, todas las respuestas

Durante una visita reciente, el cliente planteó sus dudas sobre la utilización adecuada de los productos INCAP y JAB en su proceso de fabricación de calzado. El resultado fue una sesión de asesoría técnica en sitio donde se abordaron desde los métodos de aplicación hasta las condiciones de almacenamiento, el tiempo de activación de los adhesivos y los cuidados específicos para cada tipo de material.

> Uno de nuestros propósitos es poder escuchar y atender a cada cliente, sin importar el tamaño de la industria. — Equipo INCAP / JAB

Este enfoque —ir al lugar de trabajo del cliente, entender su proceso y resolver sus dudas en contexto— es lo que distingue a Grupo INCAP de un simple proveedor de insumos industriales.

![Aplicación de MAXÓN Adhesivo PU durante la asesoría técnica en el taller del cliente.](/images/blog/calzado/calzado-aplicacion-maxon-pu.webp)

## Más que adhesivos: un legado construido sobre tres pilares

En INCAP SA y JAB, la propuesta de valor para la industria del calzado colombiano se sostiene sobre tres valores:

- **Pasión**: compromiso real con el resultado de cada cliente en cada proceso de fabricación.
- **Calidad**: adhesivos y componentes que cumplen los estándares técnicos de la industria del calzado.
- **Comunidad**: talento humano y red de clientes que construyen juntos el futuro industrial del país.

![El removedor INCAP limpia y prepara la superficie antes del pegado, un paso clave para la calidad final.](/images/blog/calzado/calzado-removedor-incap.webp)

## El talento humano: el verdadero motor de la industria

Detrás de cada adhesivo que une una suela, de cada componente JAB que forma parte de un zapato terminado, hay personas: operarios comprometidos, técnicos que conocen sus materiales al detalle y clientes que confían en que el producto llegará a tiempo y funcionará como se espera.

En INCAP SA reconocemos que el secreto de la fuerza industrial no reside solo en la formulación del producto, sino en el talento y la vocación de quienes lo fabrican, lo aplican y lo comercializan.

![El talento humano detrás de cada par: el taller de calzado donde INCAP y JAB acompañan al fabricante.](/images/blog/calzado/calzado-taller.webp)

## ¿Tu empresa fabrica calzado en Colombia y necesita asesoría técnica?

El equipo técnico de INCAP SA y JAB está disponible para visitar tu planta, resolver tus dudas sobre adhesivos y componentes, y ayudarte a optimizar tu proceso de producción sin importar el tamaño de tu operación.`;

// ── Setting blog_index ───────────────────────────────────────────────────────

const BLOG_INDEX = {
  posts: [
    {
      slug: 'incap-sa-en-interzum-2026',
      cmsUrlKey: 'blog-incap-sa-en-interzum-2026', // compat código previo (CMS Pages); el código nuevo usa body
      title:
        'INCAP SA en Interzum 2026: evolución de marca y consolidación del Grupo como solución integral para la industria',
      excerpt:
        'INCAP SA participó en Interzum 2026 en Corferias, Bogotá, presentando su nueva identidad visual y la consolidación de Grupo INCAP como referente de soluciones industriales integrales para el mercado colombiano.',
      cover: '/images/blog/interzum/interzum-stand-equipo.webp',
      date: '2026-06-15',
      tags: ['Eventos', 'Marca', 'Grupo INCAP'],
      featured: true,
      body: BODY_INTERZUM,
      bodyFallback: [],
    },
    {
      slug: 'adhesivos-para-calzado-en-colombia',
      cmsUrlKey: 'blog-adhesivos-para-calzado-en-colombia', // compat código previo (CMS Pages); el código nuevo usa body
      title:
        'Adhesivos para calzado en Colombia: cómo INCAP SA y JAB acompañan al fabricante desde la asesoría técnica hasta el producto final',
      excerpt:
        'En INCAP SA y JAB no solo fabricamos adhesivos y componentes para calzado: acompañamos a cada fabricante, grande o pequeño, con la asesoría técnica que necesita para sacar el máximo rendimiento de cada producto.',
      cover: '/images/blog/calzado/calzado-visita-taller.webp',
      date: '2026-06-10',
      tags: ['Calzado', 'Asesoría técnica', 'JAB'],
      featured: false,
      body: BODY_CALZADO,
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

    // Setting blog_index (idempotente)
    const value = JSON.stringify(BLOG_INDEX);
    await client.query(
      `INSERT INTO setting (name, value, is_json)
       VALUES ('blog_index', $1, true)
       ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, is_json = true`,
      [value],
    );
    console.log('  [UPSERT] Setting blog_index (con body Markdown de 2 artículos)');

    if (process.env.DRY_RUN) {
      await client.query('ROLLBACK');
      console.log('\nDRY RUN: ejecutó OK — ROLLBACK (no se persistió nada).');
    } else {
      await client.query('COMMIT');
      console.log('\nSeed completado. Los artículos del blog tienen cuerpo Markdown listo.');
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
