# Multi-Site y Multi-Idioma

**Fecha de implementación**: 2026-03-11
**Estado**: Implementado

---

## Resumen

El sistema soporta **8 sitios** (países) y **2 idiomas** (español e inglés) desde una sola instancia de Strapi. Cada sitio tiene su propio contenido de páginas, precios y disponibilidad de productos. El catálogo base de productos, recetas, artículos y categorías es compartido entre todos los sitios.

---

## Sitios Disponibles

| Código | País | Moneda | Código Ofix |
|--------|------|--------|-------------|
| `pe` | Perú | PEN | PE |
| `us` | Estados Unidos | USD | US |
| `es` | España | EUR | ES |
| `mx` | México | MXN | MX |
| `ar` | Argentina | ARS | AR |
| `co` | Colombia | COP | CO |
| `ec` | Ecuador | USD | EC |
| `cl` | Chile | CLP | CL |

Estos registros se crean automáticamente al iniciar Strapi (bootstrap en `src/index.ts`).

---

## Idiomas

| Código | Idioma | Rol |
|--------|--------|-----|
| `es` | Español | Default |
| `en` | Inglés | Adicional |

Configurado en `config/plugins.ts` vía el plugin i18n de Strapi.

---

## Cómo Identificar el Site y el Idioma

### Desde el Frontend

El frontend envía **dos datos** en cada request:

| Dato | Cómo se envía | Ejemplo |
|------|---------------|---------|
| Site | Header HTTP `X-Site` | `X-Site: pe` |
| Idioma | Query param `?locale=` | `?locale=es` o `?locale=en` |

```bash
# Ejemplo: página de inicio para Perú en español
GET /api/home-page
X-Site: pe
# (sin ?locale= → usa el default: es)

# Ejemplo: página de inicio para México en inglés
GET /api/home-page?locale=en
X-Site: mx
```

### En el Backend

El middleware `global::site` (en `src/middlewares/site.ts`) lee el header y lo adjunta al contexto:

```typescript
ctx.state.site  // → "pe", "mx", "co", etc.
```

Los controllers de páginas usan `ctx.state.site` para filtrar automáticamente.

---

## Arquitectura Multi-Site

### Content Types por alcance

| Content Type | Alcance | Relación Site | i18n |
|---|---|---|---|
| `home-page` | Por site | ✅ `site` (manyToOne) | ✅ |
| `productos-page` | Por site | ✅ | ✅ |
| `recetas-page` | Por site | ✅ | ✅ |
| `blog-page` | Por site | ✅ | ✅ |
| `faq-page` | Por site | ✅ | ✅ |
| `quienes-somos` | Por site | ✅ | ✅ |
| `proceso-produccion` | Por site | ✅ | ✅ |
| `contacto-page` | Por site | ✅ | ✅ |
| `producto` | Compartido | ❌ (vía componente `sitios`) | ✅ |
| `receta` | Compartido | ❌ | ✅ |
| `articulo` | Compartido | ❌ | ✅ |
| `pack` | Compartido | ❌ | ✅ |
| `badge` | Compartido | ❌ | ✅ |
| `categoria` | Compartido | ❌ | ✅ |
| `categoria-blog` | Compartido | ❌ | ✅ |
| `categoria-faq` | Compartido | ❌ | ✅ |
| `pregunta-frecuente` | Compartido | ❌ | ✅ |
| `testimonio` | Compartido | ❌ | ✅ |
| `order` | Por site | ✅ | ❌ |
| `sync-log` | Por site | ✅ | ❌ |

### Nuevos Content Types

#### `site`
Tabla de configuración de los 8 países. Sin Draft & Publish. Se siembra automáticamente.

```
src/api/site/
├── content-types/site/schema.json
├── controllers/site.ts
├── routes/site.ts
└── services/site.ts
```

#### Componente `producto.configuracion-sitio`
Precio y disponibilidad de un producto por site, implementado como **componente repetible** dentro del propio `producto`. Esto permite al editor gestionar los precios directamente desde el formulario del producto sin salir de él.

```
src/components/producto/configuracion-sitio.json
```

| Campo | Tipo | Descripción |
|---|---|---|
| `site` | Relation (oneToOne → site) | Site/país al que aplica |
| `precio` | Decimal | Precio en la moneda del site |
| `disponible` | Boolean | Si está disponible en ese site |
| `stock` | Integer | Stock en ese site |
| `mostrar_stock` | Boolean | Si mostrar el stock al usuario |

> **UX admin**: En el formulario de un producto, el campo `sitios` muestra un bloque repetible donde el editor pulsa "Add a component", selecciona el site y escribe el precio. No existe la dependencia circular de seleccionar el producto al crear la entrada.

---

## Páginas: de Single Type a Collection Type

Las 8 páginas pasaron de `singleType` a `collectionType`. Cada una tiene ahora una entrada por site (y por idioma dentro de cada site).

### Compatibilidad hacia atrás

Los endpoints originales del frontend **siguen funcionando sin cambios**:

```bash
# Antes (singleType) → Después (con X-Site header)
GET /api/home-page          # Sigue funcionando
GET /api/blog-page          # Sigue funcionando
GET /api/faq-page           # Sigue funcionando
# ... etc.
```

Internamente, `findBySite()` filtra por `site.code == ctx.state.site` y retorna el primer resultado en formato single-type.

### Nuevos endpoints de colección (para admin/automatización)

```bash
GET /api/home-pages                                      # Todos los sites
GET /api/home-pages?filters[site][code]=pe&locale=es    # Site específico
GET /api/home-pages/:id                                  # Por ID
POST /api/home-pages                                     # Crear
PUT /api/home-pages/:id                                  # Actualizar
DELETE /api/home-pages/:id                               # Eliminar
```

---

## Gestión de Contenido en el Panel Admin

### Crear contenido para un site nuevo

1. En **Admin → Home Pages** (o cualquier página), crear una nueva entrada
2. Asignar el campo `site` al country correspondiente
3. Completar todos los campos
4. **Publicar**

### Crear traducción de un contenido existente

1. Abrir la entrada en el admin
2. En el selector de locale (esquina superior derecha), elegir "en"
3. Completar los campos traducidos
4. Publicar la versión en inglés

### Campos localizables vs compartidos en Productos

En el content type `producto`, los campos están marcados según si se traducen:

| Campo | ¿Localizable? |
|---|---|
| `nombre`, `slug` | ✅ Por idioma |
| `descripcion_corta`, `descripcion_larga` | ✅ Por idioma |
| `presentacion`, `rinde` | ✅ Por idioma |
| `secciones_expandibles` | ✅ Por idioma |
| `meta_title`, `meta_description` | ✅ Por idioma |
| `sku`, `peso`, `stock`, `disponible` | ❌ Compartido |
| `sitios` (componente) | ❌ Compartido |
| `imagen_principal`, `galeria_imagenes` | ❌ Compartido |
| Relaciones (badges, categorias, etc.) | ❌ Compartido |

---

## Precios y Disponibilidad por Site

El precio y la disponibilidad de un producto por país se gestionan mediante el **componente repetible `sitios`** (`producto.configuracion-sitio`) dentro del propio producto.

### Desde el admin (manual)

1. Abrir el producto en **Admin → Productos**
2. Ir al campo **Sitios** (al final del formulario)
3. Pulsar **"Add a component"**
4. Seleccionar el site (ej: Colombia) y escribir el precio
5. Guardar y publicar

### Desde la API (programático)

```bash
# Actualizar los sitios de un producto
PUT /api/productos/{documentId}
{
  "data": {
    "sitios": [
      { "id": 1, "site": { "set": [{ "documentId": "site-pe-id" }] }, "precio": 5.90, "disponible": true },
      { "site": { "set": [{ "documentId": "site-co-id" }] }, "precio": 45000, "disponible": true }
    ]
  }
}
```

La sincronización con Ofix **crea/actualiza automáticamente** la entrada del componente para el país que se sincroniza.

---

## Sincronización Ofix por Site

El sync se ejecuta por site. El `countryCode` se toma del campo `ofix_country_code` del site.

### Disparo manual por site

```bash
# Sincronizar Colombia
POST /api/ofix-sync/trigger
Authorization: Bearer <token>
Content-Type: application/json

{
  "site": "co"
}
```

### Respuesta

```json
{
  "data": {
    "message": "Sincronización completada",
    "site": "co",
    "creados": 3,
    "actualizados": 58,
    "deshabilitados": 0,
    "errores": 0
  }
}
```

### Cron automático

El cron se ejecuta a medianoche (hora Lima) e itera sobre **todos los sites activos** secuencialmente:

```typescript
// config/cron-tasks.ts
'0 0 * * *': {
  task: async ({ strapi }) => {
    const sites = await strapi.documents('api::site.site').findMany({ filters: { activo: true } });
    for (const site of sites) {
      await strapi.service('api::sync-log.ofix-sync').sync('cron', site.code);
    }
  },
  options: { tz: 'America/Lima' }
}
```

---

## Variables de Entorno

No hay nuevas variables de entorno requeridas. El sistema usa el mismo `OFIX_*` de base, pero el `countryCode` ahora se toma dinámicamente del registro en la base de datos.

Para desactivar un site temporalmente sin modificar código:

```bash
# En Admin → Sites → [site], desactivar el campo "activo"
# El cron lo omitirá automáticamente
```

---

## Configuración de Permisos (Admin Panel)

Después de reiniciar Strapi, configurar en:
**Admin → Settings → Users & Permissions → Roles → Public**

| Content Type | Acción | Para qué |
|---|---|---|
| `site` | `find`, `findOne` | Obtener lista de sites activos |
| `home-page` | `find`, `findOne` | Acceso público a la página |
| `blog-page` | `find`, `findOne` | Acceso público a la página |
| `faq-page` | `find`, `findOne` | Acceso público a la página |
| `productos-page` | `find`, `findOne` | Acceso público a la página |
| `recetas-page` | `find`, `findOne` | Acceso público a la página |
| `quienes-somos` | `find`, `findOne` | Acceso público a la página |
| `proceso-produccion` | `find`, `findOne` | Acceso público a la página |
| `contacto-page` | `find`, `findOne` | Acceso público a la página |

---

## Migración del Contenido Existente

El contenido creado antes de la implementación multi-site pertenece a **Perú (PE)**. Para asignarlo correctamente:

1. En el admin, ir al content type correspondiente (ej: **Home Pages**)
2. Abrir la entrada existente
3. Asignar el campo `site` → seleccionar "Perú (pe)"
4. Guardar y publicar

Para **replicar** el contenido de PE a otro site:
1. En el admin, crear una nueva entrada para el mismo content type
2. Asignar el site de destino
3. Copiar los campos desde la entrada de PE
4. Traducir si aplica
5. Publicar

---

## Estructura de Archivos Nuevos/Modificados

```
src/
├── middlewares/
│   └── site.ts                          ← NUEVO: Lee header X-Site
│
├── api/
│   ├── site/                            ← NUEVO: Content type Site
│   │   ├── content-types/site/schema.json
│   │   ├── controllers/site.ts
│   │   ├── routes/site.ts
│   │   └── services/site.ts
│   │
│   ├── home-page/                       ← MODIFICADO: singleType→collectionType + site + i18n
│   ├── blog-page/                       ← MODIFICADO
│   ├── faq-page/                        ← MODIFICADO
│   ├── productos-page/                  ← MODIFICADO
│   ├── recetas-page/                    ← MODIFICADO
│   ├── quienes-somos/                   ← MODIFICADO
│   ├── proceso-produccion/              ← MODIFICADO
│   ├── contacto-page/                   ← MODIFICADO
│   │
│   ├── producto/                        ← MODIFICADO: i18n + componente sitios
│   ├── receta/                          ← MODIFICADO: i18n
│   ├── articulo/                        ← MODIFICADO: i18n
│   ├── pack/                            ← MODIFICADO: i18n
│   ├── badge/                           ← MODIFICADO: i18n
│   ├── categoria/                       ← MODIFICADO: i18n
│   ├── categoria-blog/                  ← MODIFICADO: i18n
│   ├── categoria-faq/                   ← MODIFICADO: i18n
│   ├── pregunta-frecuente/              ← MODIFICADO: i18n
│   ├── testimonio/                      ← MODIFICADO: i18n
│   └── order/                           ← MODIFICADO: relación site
│
├── components/
│   └── producto/
│       └── configuracion-sitio.json     ← NUEVO: componente precio/disponibilidad por site
│
├── index.ts                             ← MODIFICADO: bootstrap seeding de sites
│
config/
├── plugins.ts                           ← MODIFICADO: plugin i18n habilitado
├── middlewares.ts                       ← MODIFICADO: global::site agregado
└── cron-tasks.ts                        ← MODIFICADO: itera sobre sites activos
```

---

## Ejemplos de Uso desde el Frontend

### Configuración global del cliente HTTP (Next.js)

```typescript
// lib/api.ts
import axios from 'axios';

const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || 'pe'; // definir por entorno

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'X-Site': SITE_CODE,
  },
});
```

### Obtener página de inicio

```typescript
// En español (default)
const homePage = await api.get('/api/home-page');

// En inglés
const homePageEn = await api.get('/api/home-page?locale=en');
```

### Obtener productos con precio del site

```typescript
// Un solo request devuelve el producto con precio, disponible, moneda del site ya fusionados
const productos = await api.get('/api/productos?locale=es');
// X-Site: pe  (se configura a nivel global en el cliente HTTP)

// Cada producto en la respuesta incluye directamente:
// producto.precio       → precio del site pe
// producto.disponible   → disponibilidad en pe
// producto.moneda       → "PEN"
// producto.sitios       → [{ site: { code: "pe", ... }, precio: 5.90, ... }]
```

### Obtener lista de sites activos

```typescript
const sites = await api.get('/api/sites?filters[activo]=true');
```

---

**Versión de Strapi**: 5.33.2
**Fecha de implementación**: 2026-03-11
