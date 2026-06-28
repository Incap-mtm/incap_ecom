/**
 * Datos por defecto del blog INCAP.
 * Estos datos se usan como fallback cuando el setting `blog_index`
 * no está en la base de datos (ej. localhost sin seed).
 * Son la fuente de verdad para el contenido inicial.
 */
export const DEFAULT_BLOG = {
    posts: [
        {
            slug: 'incap-sa-en-interzum-2026',
            cmsUrlKey: 'blog-incap-sa-en-interzum-2026',
            title: 'INCAP SA en Interzum 2026: evolución de marca y consolidación del Grupo como solución integral para la industria',
            excerpt: 'INCAP SA participó en Interzum 2026 en Corferias, Bogotá, presentando su nueva identidad visual y la consolidación de Grupo INCAP como referente de soluciones industriales integrales para el mercado colombiano.',
            cover: '/images/blog/incap-sa-en-interzum-2026.webp',
            date: '2026-06-15',
            tags: ['Eventos', 'Marca', 'Grupo INCAP'],
            featured: true,
            bodyFallback: [
                'INCAP SA participó en Interzum 2026 en Corferias, Bogotá, presentando su nueva identidad visual y la consolidación de Grupo INCAP como referente de soluciones industriales integrales para el mercado colombiano. Cuatro días que marcaron un hito en más de cincuenta años de historia.',
                'Interzum Colombia es la feria más importante del sector mobiliario, maderero y de superficies en América Latina. Celebrada en Corferias, Bogotá, reúne a fabricantes, distribuidores, ferreterías y talleres de todo el país y la región. Para INCAP SA, elegir esta plataforma no fue casualidad: fue una declaración de intenciones.',
                'Durante cuatro días de intensa actividad en el Stand 401, el equipo de INCAP recibió a clientes, aliados estratégicos y distribuidores para presentar en primicia el cambio más significativo en la arquitectura de negocio de la compañía: la evolución de su identidad visual y la consolidación formal de Grupo INCAP.',
                'Grupo INCAP nace como respuesta a una realidad del mercado industrial colombiano: los clientes —desde el mostrador de ferretería hasta el taller especializado— necesitan un socio que les ofrezca más que un producto. Necesitan una solución integral.',
                'La consolidación del Grupo articula en un solo paraguas de marca líneas complementarias como JAB, ampliando el portafolio de suministros industriales con una sinergia que eleva los estándares de servicio, disponibilidad y asesoría técnica.',
                '"Lo que ves afuera evoluciona; lo que pega adentro, sigue siendo INCAP." — el mensaje con el que Grupo INCAP cerró su participación en Interzum 2026.',
                'El rebranding de INCAP SA no es un ejercicio estético: es la expresión visual de cincuenta años de trayectoria, actualizados para competir con solidez en el mercado industrial del siglo XXI.',
                'La respuesta del mercado durante Interzum 2026 confirmó lo que el equipo de INCAP ya sabía: la industria colombiana estaba lista para recibir una propuesta de valor más estructurada, más visible y más integral.',
            ],
        },
        {
            slug: 'adhesivos-para-calzado-en-colombia',
            cmsUrlKey: 'blog-adhesivos-para-calzado-en-colombia',
            title: 'Adhesivos para calzado en Colombia: cómo INCAP SA y JAB acompañan al fabricante desde la asesoría técnica hasta el producto final',
            excerpt: 'En INCAP SA y JAB no solo fabricamos adhesivos y componentes para calzado: acompañamos a cada fabricante, grande o pequeño, con la asesoría técnica que necesita para sacar el máximo rendimiento de cada producto.',
            cover: '/images/blog/adhesivos-para-calzado-en-colombia.webp',
            date: '2026-06-10',
            tags: ['Calzado', 'Asesoría técnica', 'JAB'],
            featured: false,
            bodyFallback: [
                'En la industria del calzado colombiano, elegir el adhesivo correcto puede ser la diferencia entre un producto terminado de calidad exportable y uno que no supera los estándares del mercado. Los fabricantes enfrentan preguntas concretas: ¿qué adhesivo usar para unir suela con corte en cuero?, ¿cómo aplicar correctamente los componentes JAB en líneas de producción de pequeña escala?',
                'Esas preguntas tienen respuestas técnicas, y para darlas correctamente no basta con un catálogo de productos: hace falta presencia, escucha y experiencia. Por eso el equipo de INCAP SA y JAB realiza visitas directas a los clientes, sin importar el tamaño de su operación.',
                'Durante una visita reciente, el cliente planteó sus dudas sobre la utilización adecuada de los productos INCAP y JAB en su proceso de fabricación de calzado. El resultado fue una sesión de asesoría técnica en sitio donde se abordaron desde los métodos de aplicación hasta las condiciones de almacenamiento, el tiempo de activación de los adhesivos y los cuidados específicos para cada tipo de material.',
                '"Uno de nuestros propósitos es poder escuchar y atender a cada cliente, sin importar el tamaño de la industria." — Equipo INCAP / JAB',
                'En INCAP SA y JAB, la propuesta de valor para la industria del calzado colombiano se sostiene sobre tres valores: Pasión (compromiso real con el resultado de cada cliente), Calidad (adhesivos que cumplen los estándares técnicos de la industria) y Comunidad (talento humano y red de clientes que construyen juntos el futuro industrial del país).',
                'El equipo técnico de INCAP SA y JAB está disponible para visitar tu planta, resolver tus dudas sobre adhesivos y componentes, y ayudarte a optimizar tu proceso de producción sin importar el tamaño de tu operación.',
            ],
        },
    ],
    tags: ['Eventos', 'Marca', 'Grupo INCAP', 'Calzado', 'Asesoría técnica', 'JAB'],
};
/** Parsea el JSON de blog_index de forma segura y devuelve BlogData. */
export function parseBlogIndex(raw) {
    if (!raw)
        return DEFAULT_BLOG;
    try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.posts) && parsed.posts.length > 0) {
            return parsed;
        }
    }
    catch (_a) {
        // fallback
    }
    return DEFAULT_BLOG;
}
/** Formatea una fecha ISO 'YYYY-MM-DD' a texto legible en español. */
export function formatDate(iso) {
    try {
        const [y, m, d] = iso.split('-').map(Number);
        const months = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
        ];
        return `${d} de ${months[m - 1]} de ${y}`;
    }
    catch (_a) {
        return iso;
    }
}
//# sourceMappingURL=blogData.js.map