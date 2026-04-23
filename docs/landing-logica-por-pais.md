# Lógica de carga de la Landing por país y locale

## Resumen

La landing de cada país (`/{siteCode}`) se construye con **6 llamadas paralelas a Strapi**. El contenido varía según dos dimensiones:

- **`siteCode`** (país): determina precios, moneda, disponibilidad de productos y acceso al warehouse de Ofix
- **`locale`** (idioma): determina el idioma de todos los textos, banners y CTAs

Solo US tiene `locale=en`. Todos los demás países usan `locale=es`.

---

## Los 6 endpoints que construyen la landing

| Fuente | Endpoint Strapi | ¿Varía por siteCode? | ¿Varía por locale? |
|--------|-----------------|----------------------|---------------------|
| `getHomePage()` | `/api/home-page` | No (header `X-Site`) | Sí — textos, slider, CTAs |
| `getBadges()` | `/api/badges` | No | Sí — labels e íconos |
| `getProductos()` | `/api/productos` | **Sí** — precio, moneda, stock, disponible | Sí — nombre, descripción |
| `getRecetas()` | `/api/recetas` | No | Sí — título, descripción |
| `getTestimonios()` | `/api/testimonios` | No | Sí — texto del testimonio |
| `getContactoPage()` | `/api/contacto-page` | No | Sí — título, descripción, botón |

El `siteCode` **no va en la URL** de la query a Strapi. Va como header `X-Site: {siteCode}`. Strapi puede usarlo del lado backend, pero los filtros de URL usan `locale`.

---

## Cómo el siteCode afecta los productos

Es la única fuente de datos donde el `siteCode` cambia directamente los valores mostrados.

Cada producto en Strapi tiene un array `sitios`, con una entrada por país:

```
producto.sitios = [
  { site: { code: "pe", moneda: "PEN" }, precio: 45, disponible: true, stock: 100 },
  { site: { code: "us", moneda: "USD" }, precio: 12, disponible: true, stock: 50 },
  { site: { code: "co", moneda: "COP" }, precio: 49000, disponible: false, stock: 0 },
]
```

La función `normalizeProducto()` en `src/lib/api.ts:50` busca la entrada del país activo:

```
sitioActual = producto.sitios.find(s => s.site.code === siteCode)
```

Y reemplaza:
- `precio` → `sitioActual.precio` (o fallback global)
- `precio_moneda` → `sitioActual.site.moneda` (o `SITE_CURRENCY[siteCode]`)
- `disponible` → `sitioActual.disponible`
- `stock` → `sitioActual.stock`

Después filtra: `.filter(p => p.disponible)` — si el producto no tiene entrada para ese país, o `disponible: false`, **no aparece en la landing**.

---

## Por qué US muestra secciones que otros no

El contenido de cada sección de la landing viene de `/api/home-page`. Si en Strapi esos campos están vacíos para `locale=es` pero llenos para `locale=en`, la sección aparece en US y no en los demás países.

Cada sección tiene una condición de renderizado en `src/app/[siteCode]/page.tsx`:

| Sección | Se muestra si |
|---------|---------------|
| `BeneficiosWaveSection` | `badges.length > 0` ó `intro_texto` tiene valor |
| `IngredientesNaturales` | Alguno de `natural_titulo`, `natural_descripcion`, `natural_frase_q`, `natural_cta` tiene valor |
| `Amazon Banner` | Alguno de `amazon_titulo`, `amazon_descripcion`, `amazon_cta` tiene valor |
| `RecetasYTestimonios` | Siempre se monta (vacío si no hay datos) |
| `Subscribe` | `contactoRes.data.titulo` ó `descripcion` ó `formulario_boton` tiene valor |

Si ninguna fuente tiene datos, se muestra `<ComingSoon />` (línea 86).

---

## Locale por país

Definido en `src/lib/constants.ts`:

```typescript
pe: "es",  co: "es",  ar: "es",  mx: "es",
cl: "es",  ec: "es",  es: "es",  us: "en"
```

El middleware (`src/middleware.ts`) escribe el cookie `locale` al primer acceso si no existe. La página servidor lo lee con `getLocale()` y lo pasa a todos los endpoints.

---

## Flujo completo de una petición

Usuario accede a `/us`:

1. **Middleware** detecta `us`, válida en `VALID_SITE_CODES`, guarda cookies `site-code=us` y `locale=en`
2. **Landing page** (`src/app/[siteCode]/page.tsx`) hace 6 llamadas con `locale=en`, `siteCode=us`
3. Strapi devuelve contenido en inglés para `home-page`, `badges`, `recetas`, `testimonios`, `contacto-page`
4. Para `productos`: devuelve todos los productos; `normalizeProducto()` extrae el `sitioActual` de `code=us` → precio en USD, disponibilidad específica de US
5. Se filtra `.filter(p => p.disponible)` — solo productos disponibles en US
6. Las secciones se renderizan solo si los campos de Strapi para `locale=en` tienen valor

---

## Tabla de monedas por país

| País | siteCode | locale | Moneda |
|------|----------|--------|--------|
| Perú | `pe` | `es` | PEN |
| Colombia | `co` | `es` | COP |
| Ecuador | `ec` | `es` | USD |
| Chile | `cl` | `es` | CLP |
| Argentina | `ar` | `es` | ARS |
| México | `mx` | `es` | MXN |
| España | `es` | `es` | EUR |
| USA | `us` | `en` | USD |

---

## Archivos clave

| Archivo | Qué define |
|---------|-----------|
| `src/app/[siteCode]/page.tsx` | Orquesta los 6 fetches y el renderizado condicional de secciones |
| `src/lib/api.ts` | `normalizeProducto()`, `fetchAPI()` con header `X-Site`, las 6 funciones `get*()` |
| `src/lib/constants.ts` | `VALID_SITE_CODES`, `SITE_DEFAULT_LOCALE`, `SITE_CURRENCY` |
| `src/middleware.ts` | Escribe cookies `site-code` y `locale` en el primer acceso |
| `src/lib/locale.ts` | Lee el cookie `locale` en Server Components |
