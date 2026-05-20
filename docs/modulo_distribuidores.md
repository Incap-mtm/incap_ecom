# Módulo de Búsqueda de Distribuidores

**Estado:** Backlog — iniciar después de terminar carga de productos  
**Estimado:** ~4 horas de desarrollo  
**Fecha de planificación:** 2026-05-15

---

## Descripción

Página dedicada `/distribuidores` que permite a los clientes encontrar distribuidores INCAP filtrando por región, ciudad e industria, con su ubicación visualizada en Google Maps.

---

## Datos fuente

**Archivo:** `Listado de Distribuidores INCAP - Distribuidores página web.csv` (raíz del repo)

| Campo | Descripción |
|---|---|
| Distribuidor | Razón social |
| Industria | Tipo de negocio (Peleterías, Plásticos, Colchones, Ferretería, Madera/Triplex, Otros) |
| Departamento | Región geográfica (6 regiones) |
| Ciudad | Ciudad (16 ciudades) |
| Dirección | Dirección física — tiene prefijo `"DETALLE: "` a limpiar |
| Teléfono | Teléfono de contacto |
| Email | Correo de contacto |

**Totales:** 82 distribuidores · 16 ciudades · 6 regiones

**Regiones:** Antioquia · Bogotá y Zona Periférica · Costa Atlántica · Eje Cafetero · Santanderes · Sur del País

---

## Decisiones de diseño

| Decisión | Elección | Razón |
|---|---|---|
| Precisión del mapa | Por ciudad (no por dirección) | Más rápido, sin costos de geocoding |
| Ubicación en el sitio | Página propia `/distribuidores` | URL compartible, enlazable desde navbar |
| Google Maps API Key | Por crear | Proyecto nuevo en Google Cloud Console |

---

## Plan de implementación

### Fase 0 — Google Maps API Key *(manual, ~10 min)*

1. [Google Cloud Console](https://console.cloud.google.com) → crear proyecto `Incap Maps`
2. Habilitar **Maps JavaScript API**
3. Crear API Key y restringirla al dominio `grupoincap.com.co`
4. Agregar variable de entorno:
   - Railway producción y staging: `GOOGLE_MAPS_API_KEY=<key>`
   - Local: `.env`

---

### Fase 1 — Preparar datos *(~30 min)*

- Convertir CSV a JSON limpio
- Limpiar prefijo `"DETALLE: "` de las direcciones
- Agregar coordenadas por ciudad (hardcodeadas)
- Output: `themes/industrial-glue/public/data/distribuidores.json`

**Estructura JSON por distribuidor:**
```json
{
  "nombre": "PELETERIA ALASKA SAS",
  "industria": "PELETERIAS",
  "region": "BOGOTA Y ZONA PERIFERICA",
  "ciudad": "BOGOTA",
  "direccion": "KR 24 F # 18 - 43 SUR",
  "telefono": "3613146",
  "email": "alaskapeleteria@gmail.com",
  "lat": 4.6097,
  "lng": -74.0817
}
```

**Coordenadas de ciudades:**

| Ciudad | Lat | Lng |
|---|---|---|
| Medellín | 6.2518 | -75.5636 |
| Bogotá | 4.7110 | -74.0721 |
| Ibagué | 4.4389 | -75.2322 |
| Neiva | 2.9273 | -75.2819 |
| Santa Marta | 11.2408 | -74.1990 |
| Villavicencio | 4.1420 | -73.6266 |
| Yopal | 5.3389 | -72.3953 |
| Barranquilla | 10.9639 | -74.7964 |
| Manizales | 5.0703 | -75.5138 |
| Armenia | 4.5339 | -75.6811 |
| Pereira | 4.8133 | -75.6961 |
| Bucaramanga | 7.1193 | -73.1227 |
| Cúcuta | 7.8939 | -72.5078 |
| Villa del Rosario | 7.8333 | -72.4703 |
| Cali | 3.4516 | -76.5320 |
| Popayán | 2.4448 | -76.6147 |

---

### Fase 2 — Componente React *(~3 horas)*

**Archivo:** `themes/industrial-glue/src/pages/distribuidores/index.tsx`  
**URL:** `/distribuidores`

**Layout desktop (split 40/60):**
```
┌──────────────────┬──────────────────────────────┐
│  Filtros         │                              │
│  ─────────       │        Google Maps           │
│  🔍 Búsqueda     │                              │
│  Región    ▼     │    📍 Medellín (5)           │
│  Industria ▼     │         📍 Bogotá (32)       │
│  ─────────       │    📍 Cali (4)               │
│  82 resultados   │                              │
│  ┌────────────┐  │                              │
│  │ Distribuidor│  │                              │
│  │ Ciudad     │  │                              │
│  │ Tel / Email│  │                              │
│  └────────────┘  │                              │
└──────────────────┴──────────────────────────────┘
```

**Layout mobile:** mapa arriba (altura fija ~300px) · lista filtrable abajo

**Interacciones:**
- Filtros de búsqueda (texto, región, industria) actualizan lista y marcadores en tiempo real
- Marcador en el mapa muestra el número de distribuidores en esa ciudad
- Click en marcador → info window con lista de distribuidores de esa ciudad
- Click en distribuidor de la lista → zoom al marcador correspondiente en el mapa

---

### Fase 3 — Integración navbar *(~15 min)*

- Agregar enlace "Distribuidores" en el navbar
- Pendiente definir: ¿navbar principal o solo en footer?

---

### Fase 4 — Deploy

```bash
git push origin main
git push origin staging
git push mtm-origin main
git push mtm-origin staging
```

---

## Notas técnicas

- Google Maps se carga vía `@react-google-maps/api` (npm) o script tag en `Head.tsx`
- La API key debe exponerse como variable de entorno `NEXT_PUBLIC_` o inyectarse en el HTML — verificar el patrón que usa EverShop para variables de entorno en el cliente
- Los datos son estáticos (82 registros), no requieren base de datos ni API propia
