import React, { useState, useEffect } from 'react';
const INDUSTRIES_DATA = {
    madera: {
        id: 'madera',
        slugs: [
            'madera',
            'maderas',
            'muebles'
        ],
        name: 'Madera y Muebles',
        heroImage: '/images/Banner_Maderas_Muebles.png',
        icons: [
            '/images/Icono_Categoria_Madera_Muebles.svg',
            '/images/Icono_Categoria_Madera_Muebles_2.svg'
        ],
        description: 'Soluciones adhesivas de alta ingeniería para la industria del mueble. De la ebanistería fina a la producción en serie.'
    },
    colchones: {
        id: 'colchones',
        slugs: [
            'colchones',
            'espumas'
        ],
        name: 'Colchones y Espumas',
        heroImage: '/images/Banner_Colchones.png',
        icons: [
            '/images/INCAP_Icono_colchones_Espumas.svg',
            '/images/INCAP_Icono_colchones_Espumas_2.svg'
        ],
        description: 'Ingeniería para el descanso. Adhesivos que optimizan tu línea de producción y protegen la salud de tu equipo.'
    },
    calzado: {
        id: 'calzado',
        slugs: [
            'calzado',
            'marroquineria'
        ],
        name: 'Calzado y Marroquinería',
        heroImage: '/images/Banner_Calzado_Marroquineria.png',
        icons: [
            '/images/INCAP_Icono_Calzado%20y%20Marroquinera_2.svg',
            '/images/INCAP_Icono_Calzado%20y%20Marroquinera_2%20(1).svg'
        ],
        description: 'El estándar de las grandes fábricas. Un ecosistema completo para reducir garantías.'
    },
    hogar: {
        id: 'hogar',
        slugs: [
            'hogar',
            'multiusos',
            'manualidades'
        ],
        name: 'Hogar y Multiusos',
        heroImage: '/images/Banner_Hogar_Multiusos.png',
        icons: [
            '/images/INCAP_Icono_Hogar_Manualidades_y_Multisuos.svg',
            '/images/INCAP_Icono_Hogar_Manualidades_y_Multisuos_2.svg',
            '/images/INCAP_Icono_Hogar_Manualidades_y_Multisuos_3.svg'
        ],
        description: 'Soluciones versátiles para el día a día. Reparaciones rápidas y proyectos creativos con calidad industrial.'
    }
};
const ConversionFooter = ()=>/*#__PURE__*/ React.createElement("section", {
        className: "py-32 bg-[#181B1C] relative overflow-hidden font-sora"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-left"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-block bg-[#85C639]/10 border border-[#85C639]/20 px-6 py-2 rounded-lg mb-10"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[#85C639] font-black text-xs uppercase tracking-[0.4em]"
    }, "Soporte Técnico")), /*#__PURE__*/ React.createElement("h2", {
        className: "text-5xl md:text-8xl font-black font-sora mb-10 uppercase tracking-tighter leading-none text-white"
    }, "¿Fallas de ", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("span", {
        className: "text-[#85C639]"
    }, "Pegue?")), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl text-slate-400 mb-16 font-inter font-light max-w-2xl leading-relaxed"
    }, "Recibe un diagnóstico técnico gratuito en menos de 24 horas. Protege la calidad de tu producto final con expertos de planta."), /*#__PURE__*/ React.createElement("a", {
        href: "https://wa.me/573123786868",
        className: "inline-flex bg-[#85C639] text-[#181B1C] px-16 py-8 rounded-full font-black text-2xl hover:bg-white hover:scale-105 transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(133,198,57,0.5)] items-center gap-6 uppercase tracking-tighter"
    }, "HABLAR CON UN EXPERTO")), /*#__PURE__*/ React.createElement("div", {
        className: "relative group flex justify-center lg:justify-start"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative max-w-md w-full"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute -inset-10 bg-[#2A4899]/20 rounded-[4rem] blur-3xl group-hover:bg-[#2A4899]/30 transition-all duration-700"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
    }, /*#__PURE__*/ React.createElement("img", {
        src: "/images/Fallas_De_Pegue_contacto.png",
        className: "w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-1000",
        alt: "Soporte"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-gradient-to-t from-[#181B1C]/60 to-transparent"
    })))))));
import { useQuery } from 'urql';
const PRODUCTS_QUERY = `
  query {
    categories {
      items {
        urlKey
        products {
          items {
            productId
            name
            status
            price {
              regular { text }
            }
            image { url alt }
            url
          }
        }
      }
    }
  }
`;
export default function IndustryPage() {
    const [data, setData] = useState(INDUSTRIES_DATA.madera);
    useEffect(()=>{
        // Extract ID from the path: /industrias/madera -> madera
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1] || 'madera';
        if (INDUSTRIES_DATA[id]) {
            setData(INDUSTRIES_DATA[id]);
        }
    }, []);
    const [result] = useQuery({
        query: PRODUCTS_QUERY,
        requestPolicy: 'network-only' // Fuerza a ignorar el caché y siempre pedir los datos más recientes a la base de datos
    });
    const allCategories = result.data?.categories?.items || [];
    // Extraemos todos los productos que pertenezcan a las categorías (urlKey) mapeadas en nuestros slugs
    const matchedCategories = allCategories.filter((cat)=>data.slugs.includes(cat.urlKey));
    const realProductsRaw = matchedCategories.flatMap((cat)=>cat.products?.items || []);
    // 1. Removemos duplicados (en caso de que un producto esté en múltiples categorías de esta industria)
    // 2. Filtramos los productos para mostrar SÓLO los que estén activos (status === 1)
    const uniqueProducts = Array.from(new Map(realProductsRaw.map((p)=>[
            p.productId,
            p
        ])).values());
    const realProducts = uniqueProducts.filter((p)=>p.status === 1);
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen animate-fadeIn bg-white font-sora -mt-[90px]"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative h-[70vh] flex items-center overflow-hidden bg-[#181B1C] pt-[90px]"
    }, /*#__PURE__*/ React.createElement("img", {
        src: data.heroImage,
        className: "absolute inset-0 w-full h-full object-cover opacity-40 scale-105",
        alt: data.name
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-gradient-to-t from-[#181B1C] via-[#181B1C]/40 to-transparent"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#181B1C]/90 to-transparent z-10"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-[1536px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-20"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-6 mb-6"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[#85C639] font-black uppercase tracking-[0.5em] text-xs font-sora"
    }, "Sistemas de Adherencia"), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, data.icons && data.icons.map((icon, i)=>/*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-xl"
        }, /*#__PURE__*/ React.createElement("img", {
            src: icon,
            className: "h-10 w-10 object-contain opacity-100 invert",
            alt: ""
        }))))), /*#__PURE__*/ React.createElement("h1", {
        className: "text-7xl md:text-9xl font-black text-white font-sora mb-8 leading-none uppercase tracking-tighter"
    }, data.name), /*#__PURE__*/ React.createElement("p", {
        className: "text-3xl text-slate-300 max-w-4xl font-inter font-light leading-relaxed"
    }, data.description))), /*#__PURE__*/ React.createElement("section", {
        className: "py-32 bg-slate-50"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-6xl font-black text-[#181B1C] font-sora mb-24 uppercase text-center tracking-tighter"
    }, "Portafolio Técnico"), result.fetching ? /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-20 text-slate-400"
    }, "Cargando portafolio...") : realProducts.length > 0 ? /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-12"
    }, realProducts.map((prod)=>/*#__PURE__*/ React.createElement("a", {
            href: prod.url,
            key: prod.productId,
            className: "bg-white p-0 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group overflow-hidden block"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "h-80 overflow-hidden bg-slate-100"
        }, prod.image?.url ? /*#__PURE__*/ React.createElement("img", {
            src: prod.image.url,
            className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000",
            alt: prod.name
        }) : /*#__PURE__*/ React.createElement("div", {
            className: "w-full h-full flex items-center justify-center text-slate-300 font-sora font-black uppercase tracking-widest text-xl"
        }, "Sin Imagen")), /*#__PURE__*/ React.createElement("div", {
            className: "p-12"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[#2A4899] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block"
        }, "Especializado"), /*#__PURE__*/ React.createElement("h3", {
            className: "text-3xl font-black mb-6 font-sora text-[#181B1C] group-hover:text-[#2A4899] transition-colors uppercase tracking-tight leading-none"
        }, prod.name), /*#__PURE__*/ React.createElement("div", {
            className: "inline-block px-4 py-2 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 mb-10 uppercase tracking-[0.3em]"
        }, prod.price?.regular?.text || 'Consultar'), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[#2A4899] font-black font-sora text-sm uppercase tracking-widest"
        }, "Ver Ficha Técnica"), /*#__PURE__*/ React.createElement("div", {
            className: "w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-[#2A4899] group-hover:text-white transition-all duration-500"
        }, "→")))))) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl text-slate-400 font-light mb-6"
    }, "Aún no hay productos asignados a la industria de ", /*#__PURE__*/ React.createElement("strong", null, data.name), " en el catálogo."), /*#__PURE__*/ React.createElement("a", {
        href: "/admin/products",
        className: "inline-block px-8 py-4 bg-[#2A4899] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#181B1C] transition-colors"
    }, "Añadir Productos")))), /*#__PURE__*/ React.createElement(ConversionFooter, null));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1
};
