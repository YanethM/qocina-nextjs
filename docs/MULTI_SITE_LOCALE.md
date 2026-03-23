# Multi-Site y Multi-Idioma — Frontend

## Resumen rápido

El sitio soporta **8 países** y **2 idiomas**. Cada request al backend incluye:

| Dato | Cómo viaja | Dónde se origina |
|---|---|---|
| País (site) | Header HTTP `X-Site: pe` | URL path `/{siteCode}/` |
| Idioma | Query param `?locale=es` | Cookie `locale` |

---

## País (siteCode)

### Cómo funciona

El país viene **exclusivamente de la URL**. No se guarda en ninguna cookie ni localStorage.

```
http://localhost:3000/pe/productos   → X-Site: pe  (Perú)
http://localhost:3000/co/productos   → X-Site: co  (Colombia)
http://localhost:3000/us/productos   → X-Site: us  (Estados Unidos)
```

### Países disponibles

| Código | País | Moneda |
|---|---|---|
| `pe` | Perú | PEN |
| `co` | Colombia | COP |
| `us` | Estados Unidos | USD |
| `mx` | México | MXN |
| `ar` | Argentina | ARS |
| `es` | España | EUR |
| `ec` | Ecuador | USD |
| `cl` | Chile | CLP |

### Archivos clave

**`src/middleware.ts`** — intercepta todas las rutas, extrae el siteCode de la URL y lo inyecta como header `x-site-code` para que las Server Pages lo lean:

```typescript
const VALID_SITE_CODES = new Set(["pe", "us", "es", "mx", "ar", "co", "ec", "cl"]);
const DEFAULT_SITE = "pe";

export function middleware(request: NextRequest) {
  const firstSegment = pathname.split("/")[1];
  const siteCode = VALID_SITE_CODES.has(firstSegment) ? firstSegment : DEFAULT_SITE;
  // inyecta x-site-code en los headers del request
}
```

Si el usuario accede a `/` sin código de país, el middleware redirige automáticamente a `/pe`.

**`src/app/[siteCode]/`** — todas las páginas del sitio viven aquí. Next.js extrae `params.siteCode` automáticamente de la URL.

**`src/hooks/useSiteCode.ts`** — hook para Client Components que necesiten el siteCode:

```typescript
// En cualquier Client Component:
const siteCode = useSiteCode(); // lee de usePathname()
```

**`src/lib/api.ts` → `resolveSiteCode()`** — cuando una llamada API se hace desde el cliente (ej: carrito), esta función lee el siteCode desde `window.location.pathname` como fallback:

```typescript
function resolveSiteCode(siteCode?: string): string {
  if (siteCode) return siteCode;
  if (typeof window !== "undefined") {
    const seg = window.location.pathname.split("/")[1];
    if (VALID_SITE_CODES.includes(seg)) return seg;
  }
  return process.env.NEXT_PUBLIC_SITE_CODE || "pe";
}
```

### En Server Pages

Todas las Server Pages reciben `params.siteCode` y lo pasan a cada llamada API:

```typescript
export default async function ProductosPage({ params }) {
  const { siteCode } = await params;
  const locale = await getLocale();

  const data = await getProductosPage(locale, siteCode);
  //                                           ↑
  //                   fetchAPI enviará X-Site: co (o el que sea)
}
```

---

## Idioma (locale)

### Cómo funciona

El idioma se guarda en una **cookie llamada `locale`**. Si la cookie no existe, el sistema usa `es` (español) como default.

```
Cookie: locale=es   → ?locale=es  (español)
Cookie: locale=en   → ?locale=en  (inglés)
Sin cookie          → ?locale=es  (default: español)
```

### Selector de idioma

El Header tiene botones ES / EN visibles en desktop y en el menú mobile. Al hacer clic:

1. Escribe la cookie `locale=es` o `locale=en` con 1 año de expiración
2. Llama `router.refresh()` para que Next.js re-renderice la página en el servidor con el nuevo idioma

```typescript
// src/components/Header/Header.tsx
const changeLocale = (newLocale: string) => {
  document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
  setLocale(newLocale);
  router.refresh();
};
```

### Lectura del locale en servidor

**`src/lib/locale.ts`** — lee la cookie en Server Components / Server Pages:

```typescript
export async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("locale")?.value || process.env.NEXT_PUBLIC_LOCALE || "es";
}
```

---

## Flujo completo de un request

```
Usuario en /co/productos (Colombia, idioma EN)
         │
         ▼
   middleware.ts
   └─ extrae "co" de la URL
   └─ inyecta header x-site-code: co
         │
         ▼
   ProductosPage (Server Component)
   ├─ params.siteCode = "co"
   ├─ getLocale() → lee cookie → "en"
   └─ getProductosPage("en", "co")
         │
         ▼
   fetchAPI en api.ts
   ├─ URL: GET /api/productos-page?locale=en
   └─ Headers: X-Site: co
         │
         ▼
   Strapi Backend
   └─ devuelve contenido de Colombia en inglés
```

---

## Dónde vive cada dato (resumen)

| Dato | Storage | Valor por defecto | Quién lo cambia |
|---|---|---|---|
| País | URL path `/pe/` | `pe` (Perú) | Usuario navega a otra URL / selector de país futuro |
| Idioma | Cookie `locale` | `es` (español) | Selector ES/EN en el Header |

**No hay cookie de país.** Si quieres saber qué país está activo, mira la URL.

---

## Detección automática de país (pendiente / futuro)

Actualmente el país por defecto es siempre `pe`. Si se despliega en **Vercel**, se puede activar geolocalización automática sin costo adicional:

```typescript
// src/middleware.ts — activar cuando se despliegue en Vercel
const countryToSite: Record<string, string> = {
  CO: "co", PE: "pe", US: "us", ES: "es",
  MX: "mx", AR: "ar", EC: "ec", CL: "cl",
};

if (pathname === "/") {
  const country = request.geo?.country ?? "PE";
  const siteCode = countryToSite[country] ?? "pe";
  return NextResponse.redirect(new URL(`/${siteCode}`, request.url));
}
```

Vercel inyecta `request.geo.country` automáticamente con el código ISO del país del visitante. No requiere instalar ningún servicio externo.

---

## Variables de entorno relevantes

| Variable | Uso | Valor típico |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del backend Strapi | `http://...amazonaws.com:1337` |
| `NEXT_PUBLIC_LOCALE` | Locale fallback si no hay cookie | `es` |
| `NEXT_PUBLIC_SITE_CODE` | Fallback de siteCode si no hay URL | `pe` (solo para entornos sin URL dinámica) |
