# Customer.io — Implementación frontend (Next.js)

Este documento complementa `INTEGRACION_CUSTOMERIO.md`. Describe exactamente qué se implementó en el frontend, qué pruebas se realizaron y cómo verificar cada punto en producción.

---

## 1. Qué se implementó

### 1.1 Snippet de carga — `src/app/layout.tsx`

El snippet oficial de Customer.io se instaló en el `<head>` del layout raíz usando `next/script` con `strategy="afterInteractive"`. Esto garantiza que el script carga en **todas las páginas** sin bloquear el renderizado.

Al final del snippet se llama `analytics.page()` — esto registra automáticamente el primer `Page Viewed` en cada carga de página.

**Write key de producción:** `726ceaf5356b813d3e29`

---

### 1.2 Tracking de navegación entre rutas — `src/components/CioPageTracker/CioPageTracker.tsx`

Como Next.js App Router hace navegaciones SPA (sin recarga de página), el `analytics.page()` del snippet solo corre en la primera carga. El componente `CioPageTracker` soluciona esto:

- Escucha cambios de pathname con `usePathname()`
- En cada cambio de ruta llama `window.cioanalytics.page()`
- Ignora la primera carga (ya cubierta por el snippet)
- En modo `development` instala un logger en consola que colorea cada llamada a `track`, `identify` y `page` para facilitar el debug

El componente se monta en el layout raíz dentro de `<CartProvider>`, por lo que aplica a todas las rutas.

---

### 1.3 Declaración de tipos — `src/types/cio.d.ts`

Se declaró la interfaz global `window.cioanalytics` para que TypeScript reconozca el objeto y no genere errores de tipo en los archivos que lo usan.

---

### 1.4 Eventos de carrito — `src/context/CartContext.tsx`

| Evento | Cuándo se dispara |
|--------|-------------------|
| `Product Added` | Dentro de `addItem()`, inmediatamente al agregar un producto al carrito |
| `Product Removed` | Dentro de `removeItem()`, antes de eliminar el ítem del estado |

El `cart_id` se genera como UUID en `localStorage` bajo la clave `qocina_cart_id` y persiste entre sesiones. Si no existe, se crea en el primer `addItem`.

Propiedades enviadas: `cart_id`, `product_id`, `sku`, `name`, `category`, `price`, `quantity`, `brand`, `image_url`.

---

### 1.5 Evento `Cart Viewed` — `src/app/[siteCode]/carrito/CarritoContent.tsx`

Se dispara una vez al montar el componente (primer `useEffect` sin dependencias dinámicas), pero solo si el carrito tiene ítems. Envía la lista completa de productos con sus propiedades.

---

### 1.6 Eventos de checkout — `src/app/[siteCode]/envio/page.tsx`

Al montar la página de envío (cuando el usuario llega al paso 1 del checkout):

```
Checkout Started  →  order_id: null, revenue: subtotal, productos del carrito
Checkout Step Viewed  →  step: 1
```

Al enviar el formulario de envío y recibir respuesta exitosa de `POST /api/orders/prepare`:

```
identify(offixCustomerId, { email })   ← vincula sesión anónima con perfil real
Checkout Step Completed  →  step: 1, shipping_method: "standard"
Checkout Step Viewed  →  step: 2
```

El `offixCustomerId` viene en el campo `data.offixCustomerId` de la respuesta del backend. Si el backend no lo devuelve, el `identify` se omite.

---

### 1.7 Evento `Product Viewed` — `src/components/ProductoDetail/ProductoDetailClient.tsx` y `src/components/PackDetail/PackDetailClient.tsx`

Se dispara al montar el componente de detalle de producto o pack. Propiedades: `product_id`, `sku`, `name`, `category`, `price`, `currency`, `brand`, `quantity: 1`, `image_url`, `url`, `value`.

---

### 1.8 Eventos `Product List Viewed` y `Product Clicked`

| Evento | Archivo |
|--------|---------|
| `Product List Viewed` | `src/components/ProductCardGrid/ProductCardGrid.tsx` — se dispara al montar el grid de la página de productos (`/[siteCode]/productos`) |
| `Product Clicked` | `src/components/ProductCardGrid/ProductCardGrid.tsx` y `src/components/Productos/Productos.tsx` — se dispara al hacer click en cualquier card de producto |

---

### 1.9 Formulario de contacto — `src/components/ContactForm/ContactForm.tsx` y `src/components/Subscribe/Subscribe.tsx`

Después de una respuesta exitosa del endpoint `POST /api/contacto/enviar`:

**Newsletter** (`Subscribe` con `variant="email"`):
```
identify({ email })
track("Newsletter Subscribed", { email, source: "footer" })
```

**Contacto** (`ContactForm` y `Subscribe` con `variant="contact"`):
```
identify({ email })
track("Contact Form Submitted", { inquiry_type: null })
```

El `identify` usa solo el email como trait porque en este punto del flujo no hay `offixCustomerId`. El snippet JS de Customer.io se encarga de vincular con el `anonymous_id` generado previamente.

---

## 2. Eventos NO implementados en el frontend

Estos eventos están en el spec del documento principal pero no fueron implementados en esta fase porque las funcionalidades correspondientes no existen o están fuera de scope:

| Evento | Motivo |
|--------|--------|
| `Products Searched` | No hay barra de búsqueda implementada |
| `Product List Filtered` | No hay filtros implementados |
| `Product Shared` / `Cart Shared` | Funcionalidad no existe |
| `Wishlist Product Added/Removed` | Funcionalidad no existe |

---

## 3. Cómo verificar en producción (paso a paso)

### Herramienta principal: consola del navegador

Abrir DevTools → pestaña Console. En **modo desarrollo** (`npm run dev`) cada evento se loguea con color:
- Amarillo: `track`
- Azul: `identify`
- Verde: `page`

En **producción** los eventos no se logean en consola, pero se pueden verificar en el dashboard de Customer.io → **Data Pipelines → Debugger** o en **People → buscar por email**.

---

### 3.1 Page Viewed (navegación)

**Cómo probar:**
1. Abrir el sitio en cualquier URL
2. Navegar a otra sección usando los links del menú
3. Verificar en consola (dev) que aparece `[CIO:page] page`
4. En Customer.io Debugger: debe aparecer el evento `Page Viewed` con la URL correcta

---

### 3.2 Product List Viewed

**Cómo probar:**
1. Ir a `/{siteCode}/productos`
2. En consola verificar `[CIO:track] Product List Viewed` con el array de productos

---

### 3.3 Product Clicked

**Cómo probar:**
1. Estar en `/{siteCode}/productos` o en cualquier sección con carousel de productos
2. Hacer click en una card de producto
3. En consola verificar `[CIO:track] Product Clicked` con `product_id`, `name`, `price`

---

### 3.4 Product Viewed

**Cómo probar:**
1. Entrar al detalle de un producto: `/{siteCode}/productos/{slug}`
2. Al cargar la página, en consola debe aparecer `[CIO:track] Product Viewed`
3. Lo mismo aplica para páginas de packs

---

### 3.5 Product Added

**Cómo probar:**
1. Desde cualquier página de detalle de producto, hacer click en "Añadir al carrito"
2. En consola verificar `[CIO:track] Product Added` con `cart_id`, `product_id`, `quantity`
3. El `cart_id` debe persistir si se cierra y reabre el navegador (está en `localStorage`)

---

### 3.6 Product Removed

**Cómo probar:**
1. Tener al menos un producto en el carrito
2. Ir a `/{siteCode}/carrito`
3. Hacer click en el icono de eliminar (papelera) de cualquier ítem
4. En consola verificar `[CIO:track] Product Removed`

---

### 3.7 Cart Viewed

**Cómo probar:**
1. Tener al menos un producto en el carrito
2. Navegar a `/{siteCode}/carrito`
3. Al cargar, en consola debe aparecer `[CIO:track] Cart Viewed` con el array de productos

---

### 3.8 Checkout Started y Checkout Step Viewed (step 1)

**Cómo probar:**
1. Tener al menos un producto en el carrito
2. Ir a `/{siteCode}/envio`
3. Al cargar la página, en consola deben aparecer en secuencia:
   - `[CIO:track] Checkout Started` con `revenue` y `products`
   - `[CIO:track] Checkout Step Viewed` con `step: 1`

---

### 3.9 identify + Checkout Step Completed/Viewed (step 2)

**Cómo probar:**
1. Completar el formulario de envío con datos válidos (ver datos de prueba en `INTEGRACION_CUSTOMERIO.md`, sección de pruebas del endpoint `/api/orders/prepare`)
2. Hacer click en "Continuar al pago"
3. Al recibir respuesta exitosa, en consola deben aparecer:
   - `[CIO:identify] identify` con `userId: {offixCustomerId}` y `traits: { email }`
   - `[CIO:track] Checkout Step Completed` con `step: 1`
   - `[CIO:track] Checkout Step Viewed` con `step: 2`
4. En Customer.io → People, buscar por el email usado: debe aparecer el perfil con `id = offixCustomerId`

---

### 3.10 Newsletter Subscribed

**Cómo probar:**
1. Ir a cualquier página con el bloque de suscripción (footer o secciones con `Subscribe`)
2. Ingresar un email y enviar el formulario
3. Al recibir respuesta exitosa:
   - `[CIO:identify] identify` con `traits: { email }`
   - `[CIO:track] Newsletter Subscribed` con `email` y `source: "footer"`

---

### 3.11 Contact Form Submitted

**Cómo probar:**
1. Ir a la página de contacto o cualquier sección con formulario de contacto
2. Completar nombre, email y mensaje, y enviar
3. Al recibir respuesta exitosa:
   - `[CIO:identify] identify` con `traits: { email }`
   - `[CIO:track] Contact Form Submitted` con `inquiry_type: null`

---

## 4. Flujo de identidad resumido

```
Usuario nuevo llega al sitio
    ↓
Customer.io genera anonymous_id automáticamente
    ↓
Eventos de navegación y carrito se registran como anónimos
    ↓
[Opcional] Usuario llena newsletter o contacto
    → identify({ email }) — perfil anónimo + email, sin Exigo ID
    ↓
[Checkout] Usuario llena datos y envía formulario de envío
    → identify(offixCustomerId, { email }) — vincula anonymous_id con perfil real
    → A partir de aquí todos los eventos anteriores quedan asociados al perfil
```

El paso crítico es el `identify` con `offixCustomerId` al completar el formulario de envío. Este es el momento donde Customer.io une la actividad anónima previa con el perfil permanente del cliente en Exigo.

---

## 5. Archivos modificados (resumen)

| Archivo | Qué se agregó |
|---------|---------------|
| `src/app/layout.tsx` | Snippet de carga del JS de Customer.io + `<CioPageTracker />` |
| `src/types/cio.d.ts` | Declaración de tipo global `window.cioanalytics` |
| `src/components/CioPageTracker/CioPageTracker.tsx` | Componente nuevo — tracking de navegación SPA + logger de dev |
| `src/context/CartContext.tsx` | `Product Added`, `Product Removed`, generación de `cart_id` |
| `src/app/[siteCode]/carrito/CarritoContent.tsx` | `Cart Viewed` |
| `src/app/[siteCode]/envio/page.tsx` | `Checkout Started`, `Checkout Step Viewed`, `identify`, `Checkout Step Completed` |
| `src/components/ProductoDetail/ProductoDetailClient.tsx` | `Product Viewed` |
| `src/components/PackDetail/PackDetailClient.tsx` | `Product Viewed` |
| `src/components/Productos/Productos.tsx` | `Product Clicked` |
| `src/components/ProductCardGrid/ProductCardGrid.tsx` | `Product List Viewed`, `Product Clicked` |
| `src/components/ContactForm/ContactForm.tsx` | `identify`, `Contact Form Submitted` |
| `src/components/Subscribe/Subscribe.tsx` | `identify`, `Newsletter Subscribed`, `Contact Form Submitted` |
