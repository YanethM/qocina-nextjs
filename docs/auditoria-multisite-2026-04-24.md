# Auditoría Multi-Site — Qocina

**Fecha:** 2026-04-24
**Alcance:** Frontend (Next.js) + Backend (Strapi EC2)
**Rama:** main

---

## Resumen ejecutivo

Se auditó la implementación multi-site descrita en `MUTI_SITE_MULTIIDIOMA.md` contra el comportamiento real del sistema.
Se encontraron **1 bug en el frontend** (corregido) y **2 bugs en el backend** (pendientes de corrección por el equipo de Strapi).

El bug de backend más crítico es sistémico: afecta los **8 endpoints de páginas por site** y todos exhiben el mismo patrón desde una sola capa compartida del backend.

---

## Tabla 1 — Bugs del frontend corregidos

| #  | Bug                                          | Archivos afectados                                                        | Fix aplicado                                                                        |
|----|----------------------------------------------|---------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| 1  | Cookie `locale` no persistía en EC2 con HTTP | `src/middleware.ts`<br>`src/components/Header/Header.tsx`                 | Reemplazado `NODE_ENV === "production"` por `NEXT_PUBLIC_SECURE_COOKIES === "true"` |

---

## Tabla 2 — Bugs del backend confirmados (pendientes)

| #  | Bug                                                                         | Endpoints afectados                    | Impacto                                                                                      |
|----|-----------------------------------------------------------------------------|----------------------------------------|----------------------------------------------------------------------------------------------|
| B1 | `pe` recibe contenido con `site: null` — el filtro por site no aplica para `pe` | Los 8 endpoints de páginas por site    | `pe` recibe contenido huérfano sin site asignado. Viola el aislamiento multi-site del spec   |
| B2 | `productos` con cualquier `X-Site` devuelve `sitios: []`                    | `/api/productos`                       | Los productos no tienen precio ni disponibilidad en ningún país. La tienda no puede operar   |

---

## Tabla 3 — Estado por endpoint (pruebas en vivo 2026-04-24)

### 3a. Pages por site

| Endpoint                  | X-Site: pe          | X-Site: us  | X-Site: co  | Sin header          | site en BD |
|---------------------------|---------------------|-------------|-------------|---------------------|------------|
| `/api/home-page`          | BUG — site: null    | null        | null        | BUG — site: null    | null       |
| `/api/contacto-page`      | BUG — site: null    | null        | null        | BUG — site: null    | null       |
| `/api/blog-page`          | BUG — site: null    | null        | null        | BUG — site: null    | null       |
| `/api/faq-page`           | BUG — site: null    | null        | null        | BUG — site: null    | null       |
| `/api/productos-page`     | BUG — site: null    | null        | null        | BUG — site: null    | null       |
| `/api/recetas-page`       | BUG — site: null    | null        | null        | BUG — site: null    | null       |
| `/api/quienes-somos`      | BUG — site: null    | null        | null        | BUG — site: null    | null       |
| `/api/proceso-produccion` | BUG — site: null    | null        | null        | BUG — site: null    | null       |

**Lectura de la tabla:**
- `BUG — site: null` — el endpoint devuelve datos pero la entrada no tiene site asignado en la BD. Solo ocurre para `pe` y sin header.
- `null` — el endpoint devuelve `data: null` correctamente porque no existe entrada para ese site.
- Ninguna entrada en BD tiene `site` asignado — todas tienen `site: null`.

### 3b. Productos

| Escenario       | sitios en respuesta                        | Estado                                              |
|-----------------|--------------------------------------------|-----------------------------------------------------|
| Sin `X-Site`    | `[{ id, precio: 14.5, disponible: true }]` | Sin filtrar por site — retorna todos los sitios     |
| `X-Site: us`    | `[]` — vacío                               | BUG — el producto tiene sitio para `us` pero no aparece |
| `X-Site: pe`    | `[]` — vacío                               | Correcto si no hay sitio `pe` configurado           |

### 3c. Contenido global (compartido — sin filtro por site)

| Endpoint          | Comportamiento                              | Estado   |
|-------------------|---------------------------------------------|----------|
| `/api/badges`     | Devuelve los 3 badges con `icono` populado  | Correcto |
| `/api/testimonios`| Devuelve los 3 testimonios                  | Correcto |
| `/api/recetas`    | Devuelve catálogo completo                  | Correcto |
| `/api/sites`      | Devuelve los 8 sites activos                | Correcto |

---

## Diagnóstico B1 — filtro por site no aplica para `pe` (para el equipo backend)

El patrón idéntico en los 8 endpoints indica que el bug está en **una sola capa compartida**, no duplicado en cada controller. El servicio `findBySite()` o el middleware `global::site` trata `pe` como caso especial o fallback.

**Comportamiento observado:**
```
X-Site: pe  →  sin filtro de site  →  retorna primer resultado (site: null)
Sin X-Site  →  sin filtro de site  →  retorna primer resultado (site: null)
X-Site: us  →  filtro site.code='us'  →  sin match  →  null   (correcto)
X-Site: co  →  filtro site.code='co'  →  sin match  →  null   (correcto)
```

**Causa probable en el código Strapi:**
```typescript
// findBySite() — lógica actual estimada
const siteCode = ctx.state.site;
const filters = (siteCode && siteCode !== 'pe')
  ? { site: { code: { $eq: siteCode } } }
  : {};  // pe y sin-header no filtran → devuelve todos → results[0] = entrada con site:null
```

**Fix requerido:**
```typescript
// El filtro debe ser siempre estricto, sin excepciones para 'pe'
const filters = { site: { code: { $eq: siteCode } } };
const results = await strapi.documents(...).findMany({ filters, status: 'published' });
return results[0] ?? null;  // null si no existe entrada para ese site
```

**Nota de datos:** todas las entradas existentes tienen `site: null` en la BD. El fix de código debe ir acompañado de asignar las entradas al site correspondiente desde el admin de Strapi, de lo contrario el resultado seguirá siendo `null` para todos los sites.

---

## Diagnóstico B2 — `sitios` vacío al enviar X-Site (para el equipo backend)

**Reproducción:**
```bash
# Con X-Site: us → sitios vacío, aunque el producto tiene precio para 'us'
curl http://[EC2]:1337/api/productos?populate=* -H "X-Site: us"
# → sitios: []

# Sin X-Site → dato correcto
curl http://[EC2]:1337/api/productos?populate=*
# → sitios: [{ id: 77, precio: 14.5, disponible: true }]
```

**Causa probable:** el controller filtra el array `sitios` post-query usando `s.site?.code === siteCode`, pero en ese punto `s.site` no está populado — es solo un ID sin expandir — por lo que la comparación siempre falla y devuelve array vacío para todos los productos.

**Fix requerido:** el filtrado de `sitios` debe hacerse a nivel de query en el `findMany`, no como post-procesamiento:
```typescript
populate: {
  sitios: {
    on: {
      'producto.configuracion-sitio': {
        filters: { site: { code: { $eq: siteCode } } },
        populate: { site: true },
      }
    }
  }
}
```

---

## Pendientes globales

| Prioridad | Item                                                                                   | Tipo               | Responsable              |
|-----------|----------------------------------------------------------------------------------------|--------------------|--------------------------|
| Alta      | Fix filtro `findBySite()` en Strapi — aplica para los 8 endpoints de pages             | Bug de código      | Equipo backend           |
| Alta      | Fix filtrado de `sitios` en `/api/productos`                                           | Bug de código      | Equipo backend           |
| Alta      | Asignar `site` a todas las entradas existentes en el admin de Strapi                   | Tarea de datos     | Equipo de contenido      |
| Media     | Crear entradas de cada page para `us`, `co`, `cl`, `ec`, `mx`, `ar`, `es`             | Contenido pendiente| Equipo de contenido      |
| Baja      | Confirmar `warehouseID` de Ofix para `ar`, `mx`, `es` antes de salida a producción    | Pendiente externo  | Equipo Ofix + backend    |
