import React, { useState, useMemo } from 'react';
const LABEL_INDUSTRIA = {
    'PELETERIAS': 'Peletería',
    'PLASTICOS': 'Plásticos',
    'COLCHONES': 'Colchones',
    'FERRETERIA': 'Ferretería',
    'DIST TRIPLEX Y MADERA': 'Madera y Triplex',
    'OTROS': 'Otros',
    '': 'Comercio'
};
const LABEL_REGION = {
    'ANTIOQUIA': 'Antioquia',
    'BOGOTA Y ZONA PERIFERICA': 'Bogotá y Zona Periférica',
    'COSTA ATLANTICA': 'Costa Atlántica',
    'EJE CAFETERO': 'Eje Cafetero',
    'SANTANDERES': 'Santanderes',
    'SUR DEL PAIS': 'Sur del País'
};
const MAP_W = 400, MAP_H = 500;
const LAT_MAX = 12.8, LAT_MIN = -4.5, LNG_MIN = -79.0, LNG_MAX = -66.5;
const ZOOM_SCALE = 3.2;
function lngToX(lng) {
    return (lng - LNG_MIN) / (LNG_MAX - LNG_MIN) * MAP_W;
}
function latToY(lat) {
    return (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * MAP_H;
}
const CITIES = {
    'MEDELLIN': {
        lat: 6.2518,
        lng: -75.5636
    },
    'BOGOTA': {
        lat: 4.7110,
        lng: -74.0721
    },
    'IBAGUE': {
        lat: 4.4389,
        lng: -75.2322
    },
    'NEIVA': {
        lat: 2.9273,
        lng: -75.2819
    },
    'SANTA MARTA': {
        lat: 11.2408,
        lng: -74.1990
    },
    'VILLAVICENCIO': {
        lat: 4.1420,
        lng: -73.6266
    },
    'YOPAL': {
        lat: 5.3389,
        lng: -72.3953
    },
    'BARRANQUILLA': {
        lat: 10.9639,
        lng: -74.7964
    },
    'MANIZALES': {
        lat: 5.0703,
        lng: -75.5138
    },
    'ARMENIA': {
        lat: 4.5339,
        lng: -75.6811
    },
    'PEREIRA': {
        lat: 4.8133,
        lng: -75.6961
    },
    'BUCARAMANGA': {
        lat: 7.1193,
        lng: -73.1227
    },
    'CUCUTA': {
        lat: 7.8939,
        lng: -72.5078
    },
    'VIILLA DEL ROSARIO': {
        lat: 7.8333,
        lng: -72.4703
    },
    'CALI': {
        lat: 3.4516,
        lng: -76.5320
    },
    'POPAYAN': {
        lat: 2.4448,
        lng: -76.6147
    }
};
const COLOMBIA_PATH = `M 245,10 L 270,15 L 320,30 L 340,50 L 330,75 L 350,90 L 370,100 L 380,130
  L 360,155 L 370,180 L 355,200 L 340,195 L 320,210 L 300,240 L 280,260 L 270,290
  L 255,310 L 240,340 L 230,370 L 215,390 L 200,410 L 185,430 L 170,450 L 150,460
  L 130,455 L 110,440 L 90,420 L 75,395 L 65,370 L 60,340 L 55,310 L 50,280
  L 45,250 L 40,220 L 38,190 L 42,160 L 50,135 L 65,115 L 80,100 L 95,85
  L 110,70 L 120,55 L 140,40 L 165,25 L 195,15 L 220,10 Z`;
// Map pin: point at (0,0), body rises upward. r=11 circle head, 28px tall total.
function MapPin({ cx, cy, active, onClick }) {
    const fill = active ? '#85C639' : '#2A4899';
    const stroke = '#fff';
    return /*#__PURE__*/ React.createElement("g", {
        transform: `translate(${cx},${cy})`,
        onClick: onClick,
        style: {
            cursor: 'pointer'
        }
    }, /*#__PURE__*/ React.createElement("ellipse", {
        cx: 0,
        cy: 3,
        rx: 6,
        ry: 2.5,
        fill: "rgba(0,0,0,0.2)"
    }), /*#__PURE__*/ React.createElement("path", {
        d: "M -6,-10 Q 0,4 0,0 Q 0,4 6,-10 Z",
        fill: fill
    }), /*#__PURE__*/ React.createElement("circle", {
        cx: 0,
        cy: -21,
        r: 13,
        fill: fill,
        stroke: stroke,
        strokeWidth: 2
    }), /*#__PURE__*/ React.createElement("circle", {
        cx: 0,
        cy: -21,
        r: 4,
        fill: stroke,
        opacity: 0.9
    }), active && /*#__PURE__*/ React.createElement("circle", {
        cx: 0,
        cy: -21,
        r: 17,
        fill: "none",
        stroke: "#85C639",
        strokeWidth: 1.5,
        strokeDasharray: "4 2",
        opacity: 0.8
    }));
}
export default function DistribuidoresPage() {
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('');
    const [industria, setIndustria] = useState('');
    const [activeCity, setActiveCity] = useState(null);
    const [hoveredEntry, setHoveredEntry] = useState(null);
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    React.useEffect(()=>{
        fetch('/data/distribuidores.json').then((r)=>r.json()).then((d)=>{
            setData(d);
            setLoaded(true);
        }).catch(()=>setLoaded(true));
    }, []);
    const filtered = useMemo(()=>{
        const q = search.toLowerCase();
        return data.filter((d)=>{
            if (q && !d.nombre.toLowerCase().includes(q) && !d.ciudad.toLowerCase().includes(q)) return false;
            if (region && d.region !== region) return false;
            if (industria && d.industria !== industria) return false;
            return true;
        });
    }, [
        data,
        search,
        region,
        industria
    ]);
    const byCity = useMemo(()=>{
        const acc = {};
        filtered.forEach((d)=>{
            if (!acc[d.ciudad]) acc[d.ciudad] = [];
            acc[d.ciudad].push(d);
        });
        return acc;
    }, [
        filtered
    ]);
    const uniqueRegiones = useMemo(()=>[
            ...new Set(data.map((d)=>d.region))
        ].sort(), [
        data
    ]);
    const uniqueIndustrias = useMemo(()=>[
            ...new Set(data.map((d)=>d.industria))
        ].filter(Boolean).sort(), [
        data
    ]);
    const activeCityData = activeCity ? byCity[activeCity] : null;
    const activeCityCoords = activeCity ? CITIES[activeCity.toUpperCase()] : null;
    const zoomTransform = activeCityCoords ? `translate(${MAP_W / 2 - lngToX(activeCityCoords.lng) * ZOOM_SCALE}px, ${MAP_H / 2 - latToY(activeCityCoords.lat) * ZOOM_SCALE}px) scale(${ZOOM_SCALE})` : 'translate(0px,0px) scale(1)';
    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1.5px solid #e2e8f0',
        fontSize: '13px',
        fontFamily: 'Sora, sans-serif',
        color: '#181B1C',
        background: '#fff',
        boxSizing: 'border-box',
        outline: 'none'
    };
    const labelStyle = {
        fontSize: '10px',
        fontWeight: 700,
        color: '#2A4899',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '5px',
        display: 'block'
    };
    return /*#__PURE__*/ React.createElement("div", {
        style: {
            fontFamily: 'Sora, Inter, sans-serif',
            background: '#f8fafc'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)',
            padding: '3rem 2rem 2.5rem',
            textAlign: 'center'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: '10px',
            fontWeight: 700,
            color: '#85C639',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: '12px'
        }
    }, "Red de Distribución"), /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900,
            color: '#fff',
            margin: 0,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase'
        }
    }, "Distribuidores INCAP"), /*#__PURE__*/ React.createElement("p", {
        style: {
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            marginTop: '10px'
        }
    }, loaded ? `${data.length} distribuidores en todo el país` : 'Cargando...')), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            minHeight: '680px'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            width: '380px',
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRight: '1px solid #e2e8f0'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            padding: '16px',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            marginBottom: '10px'
        }
    }, /*#__PURE__*/ React.createElement("span", {
        style: labelStyle
    }, "Buscar distribuidor"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "Nombre o ciudad...",
        value: search,
        onChange: (e)=>setSearch(e.target.value),
        style: inputStyle
    })), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px'
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
        style: labelStyle
    }, "Región"), /*#__PURE__*/ React.createElement("select", {
        value: region,
        onChange: (e)=>setRegion(e.target.value),
        style: {
            ...inputStyle,
            cursor: 'pointer'
        }
    }, /*#__PURE__*/ React.createElement("option", {
        value: ""
    }, "Todas"), uniqueRegiones.map((r)=>/*#__PURE__*/ React.createElement("option", {
            key: r,
            value: r
        }, LABEL_REGION[r] || r)))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
        style: labelStyle
    }, "Industria"), /*#__PURE__*/ React.createElement("select", {
        value: industria,
        onChange: (e)=>setIndustria(e.target.value),
        style: {
            ...inputStyle,
            cursor: 'pointer'
        }
    }, /*#__PURE__*/ React.createElement("option", {
        value: ""
    }, "Todas"), uniqueIndustrias.map((i)=>/*#__PURE__*/ React.createElement("option", {
            key: i,
            value: i
        }, LABEL_INDUSTRIA[i] || i))))), /*#__PURE__*/ React.createElement("div", {
        style: {
            marginTop: '10px',
            fontSize: '11px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }
    }, /*#__PURE__*/ React.createElement("span", null, filtered.length, " distribuidor", filtered.length !== 1 ? 'es' : ''), (search || region || industria) && /*#__PURE__*/ React.createElement("button", {
        onClick: ()=>{
            setSearch('');
            setRegion('');
            setIndustria('');
            setActiveCity(null);
        },
        style: {
            color: '#2A4899',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 700,
            padding: 0
        }
    }, "Limpiar"))), /*#__PURE__*/ React.createElement("div", {
        style: {
            overflowY: 'auto',
            flex: 1,
            maxHeight: '580px'
        }
    }, Object.entries(byCity).sort((a, b)=>b[1].length - a[1].length).map(([city, dists])=>/*#__PURE__*/ React.createElement("button", {
            key: city,
            onClick: ()=>setActiveCity(activeCity === city ? null : city),
            style: {
                width: '100%',
                textAlign: 'left',
                padding: '12px 16px',
                background: activeCity === city ? '#eff6ff' : 'transparent',
                border: 'none',
                borderBottom: '1px solid #e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: activeCity === city ? '3px solid #2A4899' : '3px solid transparent',
                transition: 'all 0.2s'
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }
        }, /*#__PURE__*/ React.createElement("svg", {
            width: "10",
            height: "14",
            viewBox: "0 0 10 14"
        }, /*#__PURE__*/ React.createElement("circle", {
            cx: "5",
            cy: "5",
            r: "5",
            fill: activeCity === city ? '#2A4899' : '#cbd5e1'
        }), /*#__PURE__*/ React.createElement("polygon", {
            points: "3,8 7,8 5,13",
            fill: activeCity === city ? '#2A4899' : '#cbd5e1'
        })), /*#__PURE__*/ React.createElement("span", {
            style: {
                fontSize: '12px',
                fontWeight: 800,
                color: activeCity === city ? '#2A4899' : '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
            }
        }, city)), /*#__PURE__*/ React.createElement("span", {
            style: {
                fontSize: '11px',
                background: activeCity === city ? '#2A4899' : '#f1f5f9',
                color: activeCity === city ? '#fff' : '#64748b',
                borderRadius: '20px',
                padding: '2px 8px',
                fontWeight: 700,
                transition: 'all 0.2s',
                minWidth: '22px',
                textAlign: 'center'
            }
        }, dists.length))), loaded && filtered.length === 0 && /*#__PURE__*/ React.createElement("div", {
        style: {
            padding: '48px 24px',
            textAlign: 'center',
            color: '#94a3b8'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: '2rem',
            marginBottom: '8px'
        }
    }, "🔍"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontWeight: 600,
            fontSize: '14px'
        }
    }, "Sin resultados")))), /*#__PURE__*/ React.createElement("div", {
        style: {
            flex: 1,
            background: 'linear-gradient(160deg, #dbeafe 0%, #e8f0fe 100%)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '680px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }, /*#__PURE__*/ React.createElement("svg", {
        viewBox: `0 0 ${MAP_W} ${MAP_H}`,
        style: {
            width: '100%',
            height: '100%',
            maxWidth: '520px',
            maxHeight: '660px'
        },
        onClick: (e)=>{
            const tag = e.target.tagName;
            if (tag === 'svg' || tag === 'path') setActiveCity(null);
        }
    }, /*#__PURE__*/ React.createElement("g", {
        style: {
            transform: zoomTransform,
            transformOrigin: '0 0',
            transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'
        }
    }, /*#__PURE__*/ React.createElement("path", {
        d: COLOMBIA_PATH,
        fill: "#bfdbfe",
        stroke: "#93c5fd",
        strokeWidth: "1",
        strokeLinejoin: "round"
    }), activeCity && /*#__PURE__*/ React.createElement("path", {
        d: COLOMBIA_PATH,
        fill: "rgba(30,53,118,0.2)",
        stroke: "none"
    }), Object.entries(byCity).map(([city, dists])=>{
        const coords = CITIES[city.toUpperCase()];
        if (!coords) return null;
        const cx = lngToX(coords.lng);
        const cy = latToY(coords.lat);
        const isActive = activeCity === city;
        return /*#__PURE__*/ React.createElement("g", {
            key: city
        }, !activeCity && /*#__PURE__*/ React.createElement("text", {
            x: cx,
            y: cy - 38,
            textAnchor: "middle",
            fill: "#1e3576",
            fontSize: 8,
            fontWeight: "700",
            fontFamily: "Sora, sans-serif",
            style: {
                pointerEvents: 'none',
                textShadow: '0 1px 2px white'
            }
        }, city.charAt(0) + city.slice(1).toLowerCase()), /*#__PURE__*/ React.createElement(MapPin, {
            cx: cx,
            cy: cy,
            active: isActive,
            onClick: ()=>setActiveCity(isActive ? null : city)
        }));
    }))), activeCity && activeCityData && /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'absolute',
            top: '16px',
            right: '16px',
            bottom: '16px',
            width: '290px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(30,53,118,0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            background: 'linear-gradient(135deg, #2A4899, #1e3576)',
            padding: '16px',
            flexShrink: 0
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '8px'
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: '10px',
            color: '#85C639',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '4px'
        }
    }, LABEL_REGION[activeCityData[0]?.region] || activeCityData[0]?.region), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: '16px',
            fontWeight: 900,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
        }
    }, activeCity), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: '11px',
            color: 'rgba(255,255,255,0.55)',
            marginTop: '4px'
        }
    }, activeCityData.length, " distribuidor", activeCityData.length !== 1 ? 'es' : '')), /*#__PURE__*/ React.createElement("button", {
        onClick: ()=>setActiveCity(null),
        style: {
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '18px',
            lineHeight: '28px',
            textAlign: 'center',
            flexShrink: 0
        }
    }, "×"))), /*#__PURE__*/ React.createElement("div", {
        style: {
            overflowY: 'auto',
            flex: 1
        }
    }, activeCityData.map((d, i)=>/*#__PURE__*/ React.createElement("div", {
            key: i,
            onMouseEnter: ()=>setHoveredEntry(i),
            onMouseLeave: ()=>setHoveredEntry(null),
            style: {
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9',
                background: hoveredEntry === i ? '#f8faff' : '#fff',
                transition: 'background 0.15s',
                cursor: 'default',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                minWidth: '24px',
                height: '24px',
                borderRadius: '50%',
                background: hoveredEntry === i ? '#2A4899' : '#eff6ff',
                color: hoveredEntry === i ? '#fff' : '#2A4899',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s',
                marginTop: '1px'
            }
        }, i + 1), /*#__PURE__*/ React.createElement("div", {
            style: {
                flex: 1
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: '12px',
                fontWeight: 700,
                color: '#181B1C',
                lineHeight: 1.3,
                marginBottom: '4px'
            }
        }, d.nombre), /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'inline-block',
                fontSize: '10px',
                color: '#2A4899',
                background: '#eff6ff',
                borderRadius: '4px',
                padding: '2px 6px',
                fontWeight: 700,
                marginBottom: '5px'
            }
        }, LABEL_INDUSTRIA[d.industria] || d.industria), /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: '11px',
                color: '#64748b',
                lineHeight: 1.5
            }
        }, d.direccion), d.telefono && /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: '11px',
                color: '#94a3b8',
                marginTop: '4px'
            }
        }, "📞 ", d.telefono)))))), !activeCity && loaded && /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '11px',
            color: '#64748b',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }
    }, "Seleccioná un pin o una ciudad en la lista"), /*#__PURE__*/ React.createElement("style", null, `
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(16px); }
              to   { opacity: 1; transform: translateX(0); }
            }
          `))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1
};

