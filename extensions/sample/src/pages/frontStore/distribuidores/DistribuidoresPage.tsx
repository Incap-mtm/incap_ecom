import React, { useState, useMemo, useEffect, useRef } from 'react';

declare const google: any;

interface PageProps {
  setting?: { googleMapsKey?: string };
}

interface Distribuidor {
  nombre: string;
  industria: string;
  region: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  email: string;
  lat: number;
  lng: number;
}

const LABEL_INDUSTRIA: Record<string, string> = {
  'PELETERIAS': 'Peletería',
  'PLASTICOS': 'Plásticos',
  'COLCHONES': 'Colchones',
  'FERRETERIA': 'Ferretería',
  'DIST TRIPLEX Y MADERA': 'Madera y Triplex',
  'OTROS': 'Otros',
  '': 'Comercio',
};

const LABEL_REGION: Record<string, string> = {
  'ANTIOQUIA': 'Antioquia',
  'BOGOTA Y ZONA PERIFERICA': 'Bogotá y Zona Periférica',
  'COSTA ATLANTICA': 'Costa Atlántica',
  'EJE CAFETERO': 'Eje Cafetero',
  'SANTANDERES': 'Santanderes',
  'SUR DEL PAIS': 'Sur del País',
};

const MAP_STYLES = [
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bfdbfe' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#f1f5f9' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#93c5fd' }, { weight: 1.5 }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#cbd5e1' }, { weight: 0.5 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
];

function markerSvg(count: number, active: boolean): string {
  const color = active ? '#85C639' : '#2A4899';
  const border = active ? '#fff' : '#fff';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56">
    <circle cx="22" cy="22" r="21" fill="${color}" stroke="${border}" stroke-width="2.5"/>
    <text x="22" y="27" text-anchor="middle" fill="white" font-size="13" font-weight="800" font-family="Sora,sans-serif">${count}</text>
    <path d="M15,40 L29,40 L22,54 Z" fill="${color}"/>
  </svg>`;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 13px', borderRadius: '10px',
  border: '1.5px solid #e2e8f0', fontSize: '13px', fontFamily: 'Sora, sans-serif',
  color: '#181B1C', background: '#fff', boxSizing: 'border-box', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  fontSize: '10px', fontWeight: 700, color: '#2A4899',
  textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '5px', display: 'block',
};

export default function DistribuidoresPage({ setting }: PageProps) {
  const apiKey = setting?.googleMapsKey || '';
  const [data, setData] = useState<Distribuidor[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [industria, setIndustria] = useState('');
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const gMapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    fetch('/data/distribuidores.json')
      .then(r => r.json())
      .then((d: Distribuidor[]) => { setData(d); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!apiKey) { setMapReady(true); return; }
    if ((window as any).google?.maps) { setMapReady(true); return; }
    (window as any).__mapsReady = () => setMapReady(true);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__mapsReady`;
    script.async = true;
    document.head.appendChild(script);
  }, [apiKey]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(d => {
      if (q && !d.nombre.toLowerCase().includes(q) && !d.ciudad.toLowerCase().includes(q)) return false;
      if (region && d.region !== region) return false;
      if (industria && d.industria !== industria) return false;
      return true;
    });
  }, [data, search, region, industria]);

  const byCity = useMemo(() => {
    const acc: Record<string, Distribuidor[]> = {};
    filtered.forEach(d => {
      if (!acc[d.ciudad]) acc[d.ciudad] = [];
      acc[d.ciudad].push(d);
    });
    return acc;
  }, [filtered]);

  const uniqueRegiones = useMemo(() => [...new Set(data.map(d => d.region))].sort(), [data]);
  const uniqueIndustrias = useMemo(() => [...new Set(data.map(d => d.industria))].filter(Boolean).sort(), [data]);

  // Initialize map
  useEffect(() => {
    if (!mapReady || !mapRef.current || !apiKey || !(window as any).google?.maps) return;
    if (gMapRef.current) return;
    gMapRef.current = new google.maps.Map(mapRef.current, {
      center: { lat: 4.5709, lng: -74.2973 },
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: MAP_STYLES,
    });
  }, [mapReady, apiKey]);

  // Sync markers when filtered data or active city changes
  useEffect(() => {
    if (!gMapRef.current) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current.clear();

    Object.entries(byCity).forEach(([city, dists]) => {
      const first = dists[0];
      const isActive = city === activeCity;
      const svg = markerSvg(dists.length, isActive);
      const marker = new google.maps.Marker({
        position: { lat: first.lat, lng: first.lng },
        map: gMapRef.current,
        title: city,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
          anchor: new google.maps.Point(22, 54),
        },
        zIndex: isActive ? 10 : 1,
      });
      marker.addListener('click', () => {
        setActiveCity(prev => {
          const next = prev === city ? null : city;
          if (next) {
            gMapRef.current.panTo({ lat: first.lat, lng: first.lng });
            gMapRef.current.setZoom(11);
          } else {
            gMapRef.current.setCenter({ lat: 4.5709, lng: -74.2973 });
            gMapRef.current.setZoom(6);
          }
          return next;
        });
      });
      markersRef.current.set(city, marker);
    });
  }, [byCity, activeCity]);

  const activeCityData = activeCity ? byCity[activeCity] : null;

  const clearFilters = () => { setSearch(''); setRegion(''); setIndustria(''); setActiveCity(null); };

  return (
    <div style={{ fontFamily: 'Sora, Inter, sans-serif', background: '#f8fafc', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(8px) }  to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', padding: '3rem 2rem 2.5rem', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#85C639', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Red de Distribución Nacional
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
          Distribuidores INCAP
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '10px', fontFamily: 'Inter, sans-serif' }}>
          {loaded ? `${data.length} distribuidores autorizados en Colombia` : 'Cargando...'}
        </p>
      </div>

      {/* Body: sidebar + map */}
      <div style={{ display: 'flex', flex: 1, minHeight: '680px' }}>

        {/* Sidebar */}
        <div style={{ width: '340px', minWidth: '280px', display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #e2e8f0', flexShrink: 0 }}>

          {/* Filters */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={labelStyle}>Buscar</span>
              <input type="text" placeholder="Nombre o ciudad..." value={search}
                onChange={e => setSearch(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <span style={labelStyle}>Región</span>
                <select value={region} onChange={e => { setRegion(e.target.value); setActiveCity(null); }}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Todas</option>
                  {uniqueRegiones.map(r => <option key={r} value={r}>{LABEL_REGION[r] || r}</option>)}
                </select>
              </div>
              <div>
                <span style={labelStyle}>Industria</span>
                <select value={industria} onChange={e => { setIndustria(e.target.value); setActiveCity(null); }}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Todas</option>
                  {uniqueIndustrias.map(i => <option key={i} value={i}>{LABEL_INDUSTRIA[i] || i}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }}>
              <span style={{ fontWeight: 600 }}>{filtered.length} distribuidor{filtered.length !== 1 ? 'es' : ''}</span>
              {(search || region || industria) && (
                <button onClick={clearFilters}
                  style={{ color: '#2A4899', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, padding: 0, textDecoration: 'underline' }}>
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* City list */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {Object.entries(byCity)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([city, dists]) => {
                const isActive = activeCity === city;
                return (
                  <button key={city} onClick={() => {
                    const next = isActive ? null : city;
                    setActiveCity(next);
                    if (gMapRef.current) {
                      if (next) {
                        gMapRef.current.panTo({ lat: dists[0].lat, lng: dists[0].lng });
                        gMapRef.current.setZoom(11);
                      } else {
                        gMapRef.current.setCenter({ lat: 4.5709, lng: -74.2973 });
                        gMapRef.current.setZoom(6);
                      }
                    }
                  }} style={{
                    width: '100%', textAlign: 'left', padding: '11px 16px',
                    background: isActive ? '#eff6ff' : 'transparent',
                    border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                    borderLeft: `3px solid ${isActive ? '#2A4899' : 'transparent'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="9" height="13" viewBox="0 0 9 13">
                        <circle cx="4.5" cy="4.5" r="4.5" fill={isActive ? '#2A4899' : '#cbd5e1'} />
                        <polygon points="2.5,7.5 6.5,7.5 4.5,12" fill={isActive ? '#2A4899' : '#cbd5e1'} />
                      </svg>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: isActive ? '#2A4899' : '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {city}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '11px', borderRadius: '20px', padding: '2px 8px', fontWeight: 700,
                      background: isActive ? '#2A4899' : '#f1f5f9',
                      color: isActive ? '#fff' : '#64748b',
                      transition: 'all 0.15s', minWidth: '22px', textAlign: 'center',
                    }}>
                      {dists.length}
                    </span>
                  </button>
                );
              })}
            {loaded && filtered.length === 0 && (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Sin resultados</div>
                <div style={{ fontSize: '12px', marginTop: '6px' }}>Intenta con otro filtro</div>
              </div>
            )}
          </div>
        </div>

        {/* Map area */}
        <div style={{ flex: 1, position: 'relative', minHeight: '680px' }}>

          {/* Google Map container */}
          <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '680px' }} />

          {/* Placeholder when no API key */}
          {mapReady && !apiKey && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #dbeafe 0%, #e8f0fe 100%)', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '2.5rem' }}>🗺️</div>
              <div style={{ fontWeight: 700, color: '#2A4899', fontSize: '15px' }}>Mapa no configurado</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Agrega GOOGLE_MAPS_API_KEY al servidor</div>
            </div>
          )}

          {/* Distributor panel (active city) */}
          {activeCity && activeCityData && (
            <div style={{
              position: 'absolute', top: '12px', right: '12px', bottom: '12px',
              width: '300px', background: '#fff', borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(30,53,118,0.2)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease',
            }}>
              {/* Panel header */}
              <div style={{ background: 'linear-gradient(135deg, #2A4899, #1e3576)', padding: '14px 16px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: '#85C639', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {LABEL_REGION[activeCityData[0]?.region] || activeCityData[0]?.region}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {activeCity}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '3px', fontFamily: 'Inter, sans-serif' }}>
                      {activeCityData.length} distribuidor{activeCityData.length !== 1 ? 'es' : ''}
                    </div>
                  </div>
                  <button onClick={() => {
                    setActiveCity(null);
                    if (gMapRef.current) {
                      gMapRef.current.setCenter({ lat: 4.5709, lng: -74.2973 });
                      gMapRef.current.setZoom(6);
                    }
                  }} style={{
                    background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                    width: '28px', height: '28px', cursor: 'pointer', color: '#fff',
                    fontSize: '18px', lineHeight: '28px', textAlign: 'center', flexShrink: 0,
                  }}>×</button>
                </div>
              </div>

              {/* Distributor cards */}
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {activeCityData.map((d, i) => (
                  <div key={i} style={{
                    padding: '12px 14px', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                    animation: `fadeUp 0.2s ease ${i * 0.04}s both`,
                  }}>
                    <div style={{
                      minWidth: '22px', height: '22px', borderRadius: '50%',
                      background: '#eff6ff', color: '#2A4899',
                      fontSize: '10px', fontWeight: 800, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                    }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#181B1C', lineHeight: 1.3, marginBottom: '4px' }}>
                        {d.nombre}
                      </div>
                      <div style={{ display: 'inline-block', fontSize: '9px', color: '#2A4899', background: '#eff6ff', borderRadius: '4px', padding: '2px 6px', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {LABEL_INDUSTRIA[d.industria] || d.industria || 'Comercio'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
                        {d.direccion}
                      </div>
                      {d.telefono && (
                        <a href={`tel:${d.telefono}`} style={{ fontSize: '11px', color: '#2A4899', marginTop: '4px', display: 'block', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
                          📞 {d.telefono}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hint when no city selected */}
          {mapReady && apiKey && !activeCity && loaded && (
            <div style={{
              position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
              borderRadius: '10px', padding: '8px 16px', fontSize: '11px',
              color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)', pointerEvents: 'none',
              fontFamily: 'Inter, sans-serif',
            }}>
              Tocá un marcador o seleccioná una ciudad en la lista
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};

export const query = `
  query {
    setting {
      googleMapsKey
    }
  }
`;
