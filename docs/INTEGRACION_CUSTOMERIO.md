# Integración Customer.io — QCocina en Casa

## 1. Contexto y alcance

**CRM:** Customer.io  
**Workspace:** "Fuxion CPs"  
**Identificador primario del cliente:** Exigo customer ID (`offixCustomerId`)  
**Identificador secundario:** email  
**Deadline:** 1 de mayo de 2026

Este documento define la implementación completa de la integración con Customer.io para el proyecto QCocina en Casa. La integración tiene dos capas independientes:

| Capa | Responsable | Tecnología |
|---|---|---|
| Tracking web (eventos de navegación y carrito) | Equipo frontend | JS snippet + `cioanalytics` |
| Eventos transaccionales y de ciclo de vida | Este backend (Strapi) | `customerio-node` (Track API) |

**Criterio de scope para el backend:** solo se implementan eventos para endpoints que ya existen y están en producción. Lo que no está implementado en el backend queda fuera de esta fase.

---

## 2. Decisiones de configuración confirmadas

| # | Decisión | Valor |
|---|---|---|
| D1 | Región del workspace "Fuxion CPs" | **US** → usar `RegionUS` en el SDK |
| D2 | Países con eventos al mismo workspace | **Sí** — pe, us, es, mx, ar, co, ec, cl todos apuntan a "Fuxion CPs" con las mismas credenciales |
| D3 | Write key del snippet JS | **`726ceaf5356b813d3e29`** — es el de producción, listo para usar |

---

## 3. Capa 1: Frontend (Next.js) — Spec para el equipo externo

> Esta capa es responsabilidad del equipo de frontend. Este backend **no implementa nada** de esta sección. Se documenta aquí para que la integración sea coherente.

### 3.1 Instalación del snippet

Instalar el siguiente snippet en el `<head>` de **todas las páginas** del sitio (configurar en el layout raíz de Next.js, p. ej. en `app/layout.tsx` o `_app.tsx`):

```html
<script>
  !function(){var i="cioanalytics", analytics=(window[i]=window[i]||[]);if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute('data-global-customerio-analytics-key', i);t.src="https://cdp.customer.io/v1/analytics-js/snippet/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._writeKey=key;analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.15.3";
    analytics.load(
      "726ceaf5356b813d3e29",
      {
         "integrations": {
           "Customer.io In-App Plugin": {
             anonymousInApp: true
           }
         }
       }
    );
    analytics.page();
  }}();
</script>
```

> **Nota:** El `analytics.page()` al final del snippet ya dispara el `Page Viewed` de cada navegación automáticamente. No es necesario llamarlo de nuevo en cada ruta.

### 3.2 Estrategia de identificación (frontend)

El sitio no tiene login. Los momentos donde el frontend puede identificar al usuario son:

| Momento | Datos disponibles | Acción |
|---|---|---|
| Envío del formulario de newsletter | `email` | `cioanalytics.identify({ email })` |
| Envío del formulario de contacto | `email` | `cioanalytics.identify({ email })` |
| Respuesta exitosa de `POST /api/orders/prepare` | `email` + `offixCustomerId` (retornado por el backend — **ver sección 4.3**) | `cioanalytics.identify(offixCustomerId, { email })` |

> **Importante:** El paso de `POST /api/orders/prepare` es el más relevante porque vincula el Exigo ID con la actividad anónima previa. El frontend debe ejecutar `identify` con el `offixCustomerId` retornado por el backend tan pronto reciba la respuesta exitosa de ese endpoint.

### 3.3 Eventos de frontend

Todos los eventos usan `cioanalytics.track('Nombre del Evento', { ...propiedades })`.

#### Navegación

```js
// Búsqueda
cioanalytics.track('Products Searched', { query: 'salsa de tomate' });

// Lista de productos vista
cioanalytics.track('Product List Viewed', {
  list_id: 'categoria-salsas',
  category: 'Salsas',
  products: [{ product_id, sku, name, category, price, url, image_url }]
});

// Filtro aplicado
cioanalytics.track('Product List Filtered', {
  list_id: 'categoria-salsas',
  filters: [{ type: 'categoria', value: 'Salsas' }],
  products: [...],
  sorts: []
});

// Producto clickeado en listado
cioanalytics.track('Product Clicked', { product_id, sku, name, category, price, url, image_url });

// Producto visto (página de detalle)
cioanalytics.track('Product Viewed', {
  product_id, sku, name, category, price, brand, variant,
  quantity: 1, url, image_url, currency, value: price
});
```

#### Carrito (el carrito es 100% frontend)

```js
// Producto agregado al carrito
cioanalytics.track('Product Added', {
  cart_id,        // ID generado por el frontend (ej. UUID en localStorage)
  product_id, sku, name, category, price, quantity, brand, variant, url, image_url
});

// Producto eliminado del carrito
cioanalytics.track('Product Removed', {
  cart_id, product_id, sku, name, category, price, quantity
});

// Carrito visto
cioanalytics.track('Cart Viewed', {
  cart_id,
  products: [{ product_id, sku, name, category, price, quantity, brand, variant, url, image_url }]
});
```

#### Checkout (frontend — etapas de UI)

```js
// Inicio del checkout (cuando el usuario llega al primer paso)
// NOTA: El backend también dispara Checkout Started al crear la orden.
// El frontend debe dispararlo ANTES de llamar al backend (cuando se entra al flujo de checkout).
cioanalytics.track('Checkout Started', {
  order_id: null, // aún no hay order_id, se puede omitir
  affiliation: 'QCocina',
  revenue: subtotal,       // suma de items sin shipping/tax
  shipping: 0,             // aún desconocido
  tax: 0,                  // aún desconocido
  discount: 0,
  currency: 'PEN',         // según el site
  products: [{ product_id, sku, name, category, price, quantity }]
});

// Cada paso del checkout visto
cioanalytics.track('Checkout Step Viewed', {
  checkout_id: orderId,    // disponible desde el step 2 (post prepare)
  step: 1,                 // 1: datos de envío, 2: pago
  shipping_method: null,
  payment_method: null
});

// Cada paso completado
cioanalytics.track('Checkout Step Completed', {
  checkout_id: orderId,
  step: 1,
  shipping_method: 'standard'
});
```

#### Formularios (frontend dispara identify + evento)

```js
// Newsletter — ejecutar después de POST /api/contacto/enviar exitoso
cioanalytics.identify({ email });
cioanalytics.track('Newsletter Subscribed', {
  email,
  source: 'footer'   // o 'popup', 'contacto', según el origen del formulario
});

// Contacto — ejecutar después de POST /api/contacto/enviar exitoso
cioanalytics.identify({ email });
cioanalytics.track('Contact Form Submitted', {
  inquiry_type: null  // opcional — si hay tipo de consulta en el formulario
});
```

---

## 4. Capa 2: Backend Strapi — Implementación

### 4.1 Dependencia

Instalar el paquete oficial de Customer.io para Node.js:

```bash
npm install customerio-node
```

### 4.2 Variables de entorno

Agregar al `.env` (y al entorno de producción/Docker):

```env
# Customer.io Track API
CIO_SITE_ID=<site_id_del_workspace_Fuxion_CPs>
CIO_API_KEY=<api_key_del_workspace_Fuxion_CPs>
```

### 4.3 Cambios de código necesarios

#### 4.3.1 Nuevo archivo: `src/lib/cio.ts`

Singleton del cliente Customer.io, reutilizable desde cualquier controller:

```typescript
import { TrackClient, RegionUS } from 'customerio-node';

let _client: TrackClient | null = null;

export function getCio(): TrackClient | null {
  if (!process.env.CIO_SITE_ID || !process.env.CIO_API_KEY) {
    return null;
  }
  if (!_client) {
    _client = new TrackClient(process.env.CIO_SITE_ID, process.env.CIO_API_KEY, { region: RegionUS });
  }
  return _client;
}

/**
 * Fire-and-forget: envía un evento a Customer.io sin bloquear el flujo principal.
 * Los errores se logean pero nunca interrumpen la respuesta al usuario.
 */
export function cioTrack(userId: string, eventName: string, data: Record<string, any>) {
  const cio = getCio();
  if (!cio) return;
  cio.track(userId, { name: eventName, data })
    .catch((err: Error) => strapi.log.warn(`[CIO] track "${eventName}" falló: ${err.message}`));
}

export function cioIdentify(userId: string, attributes: Record<string, any>) {
  const cio = getCio();
  if (!cio) return;
  cio.identify(userId, attributes)
    .catch((err: Error) => strapi.log.warn(`[CIO] identify ${userId} falló: ${err.message}`));
}
```

> **Regla crítica:** Todas las llamadas a Customer.io son **fire-and-forget**. Nunca deben bloquear la respuesta al cliente ni lanzar errores al stack principal. Un fallo de CIO no debe impedir que una orden se procese o que un mensaje se guarde.

#### 4.3.2 Modificación: `src/api/mensaje-contacto/content-types/mensaje-contacto/schema.json`

Agregar campo `tipo` para distinguir newsletter de contacto, y `source` para el origen de la suscripción:

```json
"tipo": {
  "type": "enumeration",
  "enum": ["contacto", "newsletter"],
  "default": "contacto"
},
"source": {
  "type": "string",
  "required": false
}
```

#### 4.3.3 Modificación: `src/api/mensaje-contacto/controllers/mensaje-contacto.ts`

Actualizar el controller para aceptar `tipo` y `source` y disparar los eventos correspondientes:

```typescript
import { cioIdentify, cioTrack } from '../../../lib/cio';

// En la función enviar(), después de crear el registro en Strapi:
const tipo = (ctx.request.body as any).tipo ?? 'contacto';
const source = (ctx.request.body as any).source ?? null;

if (tipo === 'newsletter') {
  cioTrack(email, 'Newsletter Subscribed', { email, ...(source ? { source } : {}) });
} else {
  cioTrack(email, 'Contact Form Submitted', { inquiry_type: null });
}
// En ambos casos: el identify lo hace el frontend con el snippet JS.
// El backend NO llama identify aquí porque no tenemos offixCustomerId.
```

> **¿Por qué el backend no hace identify en el formulario de contacto/newsletter?**  
> El identificador principal en Customer.io es el Exigo customer ID. En este punto del flujo solo tenemos el email. Llamar `cio.identify(email, ...)` usando el email como userId crearía un perfil con ID = email, que luego colisionaría o quedaría fragmentado cuando se cree el perfil real con el Exigo ID durante el checkout. El frontend JS snippet maneja este caso correctamente usando `anonymous_id`.

#### 4.3.4 Modificación: `src/api/order/controllers/order.ts` (función `prepare`)

Hay tres cambios en este controller:

**A) Retornar `offixCustomerId` en la respuesta** para que el frontend pueda ejecutar `identify`:

```typescript
// En ctx.body, agregar offixCustomerId:
ctx.body = {
  data: {
    orderId: order.id,
    orderNumber: order.orderNumber,
    offixCustomerId,       // ← NUEVO: necesario para que el frontend llame identify()
    subtotal,
    shipping,
    tax,
    discount,
    total,
    currency: currencyCode,
    items: resolvedItems.map((i) => ({
      name: i.name,
      sku: i.sku,
      quantity: i.quantity,
      price: i.price,
    })),
  },
};
```

**B) Retornar si el cliente es nuevo o existente** en `findOrCreateOfixCustomer`:

```typescript
// Modificar la firma para retornar { customerId, isNew }
async function findOrCreateOfixCustomer(...): Promise<{ customerId: number; isNew: boolean }> {
  // En los branches de email/phone encontrado: return { customerId: ..., isNew: false }
  // En el branch de RegisterCustomer: return { customerId: ..., isNew: true }
}

// En prepare(), destructurar:
const { customerId: offixCustomerId, isNew: isNewCustomer } = await findOrCreateOfixCustomer(...);
```

**C) Disparar eventos CIO** al final de `prepare`, después de crear la orden:

```typescript
import { cioIdentify, cioTrack } from '../../../lib/cio';

// Después de crear la orden y los order items:
const cioUserId = String(offixCustomerId);

// Identificar al cliente con su Exigo ID
cioIdentify(cioUserId, {
  email: customerEmail,
  name: customerName ?? undefined,
  phone: customerPhone ?? undefined,
  site: siteCode,
  country: countryCode,
  currency: currencyCode,
});

// Evento: cliente registrado o identificado en Exigo
cioTrack(cioUserId, 'Customer Created in Exigo', {
  exigo_customer_id: offixCustomerId,
  email: customerEmail,
  is_new_customer: isNewCustomer,
});

// Evento: inicio del checkout
cioTrack(cioUserId, 'Checkout Started', {
  order_id: order.orderNumber,
  affiliation: 'QCocina',
  revenue: subtotal,
  shipping,
  tax,
  discount,
  coupon: null,
  currency: currencyCode,
  site: siteCode,
  products: resolvedItems.map((item) => ({
    product_id: String(item.producto),
    sku: item.sku,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    brand: 'QCocina',
  })),
});
```

#### 4.3.5 Modificación: `src/api/payment/controllers/payment.ts`

Disparar `Payment Info Entered` cuando el usuario inicia el proceso de pago en Stripe:

```typescript
import { cioTrack } from '../../../lib/cio';

// Después de crear la sesión de Stripe exitosamente y antes de ctx.body:
const cioUserId = String(order.offixCustomerId);
if (order.offixCustomerId) {
  cioTrack(cioUserId, 'Payment Info Entered', {
    checkout_id: session.id,
    order_id: order.orderNumber,
    step: 2,
    shipping_method: null,
    payment_method: 'card',
    site: order.site?.code ?? null,
  });
}
```

> **Nota:** En `createCheckoutSession` la orden no viene con `site` populado por defecto. Agregar `populate: ['items', 'items.producto', 'site']` al `findOne` de la orden.

#### 4.3.6 Modificación: `src/api/stripe-webhook/controllers/stripe-webhook.ts`

**En `handleCheckoutCompleted`**, disparar `Order Completed` después de marcar como `paid`:

```typescript
import { cioTrack } from '../../../lib/cio';

// Después de actualizar la orden a 'paid' y antes de createOfixOrder:
const cioUserId = String(order.offixCustomerId);
if (order.offixCustomerId) {
  cioTrack(cioUserId, 'Order Completed', {
    order_id: order.orderNumber,
    affiliation: 'QCocina',
    total: order.total,
    revenue: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    discount: order.discount,
    coupon: null,
    currency: order.currency,
    site: order.site?.code ?? null,
    products: (order.items ?? []).map((item: any) => ({
      product_id: String(item.producto?.id ?? ''),
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      brand: 'QCocina',
    })),
  });
}
```

**En `createOfixOrder`**, al final del bloque `try` exitoso (después de actualizar a `processing`), disparar `Order Updated`:

```typescript
if (order.offixCustomerId) {
  cioTrack(String(order.offixCustomerId), 'Order Updated', {
    order_id: order.orderNumber,
    affiliation: 'QCocina',
    total: order.total,
    revenue: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    discount: order.discount,
    coupon: null,
    currency: order.currency,
    site: order.site?.code ?? null,
    products: (order.items ?? []).map((item: any) => ({
      product_id: String(item.producto?.id ?? ''),
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}
```

**En `createOfixOrder`**, al final del bloque `catch` (cuando Ofix falla), disparar `Exigo Transaction Failed`:

```typescript
if (order.offixCustomerId) {
  cioTrack(String(order.offixCustomerId), 'Exigo Transaction Failed', {
    error_type: 'ProcessTransaction',
    order_id: order.orderNumber,
    site: order.site?.code ?? null,
  });
}
```

> **Nota sobre populate en el webhook:** La función `handleCheckoutCompleted` ya hace `populate: ['items', 'transactions', 'site']`. Los `items` no traen `producto` populado. Para los eventos CIO necesitamos `product_id` de cada item. Dos opciones:
> - Opción A (recomendada): guardar `productId` en la tabla `order_items` como campo adicional al crear los items en `prepare`.
> - Opción B: Cambiar el populate del webhook a `['items.producto', 'transactions', 'site']` — esto agrega una join adicional pero evita cambios de schema.
>
> **Usar Opción B** dado que el webhook ya tiene el populate, solo hay que extenderlo. El impacto en performance es mínimo (pocas órdenes simultáneas).

---

## 5. Resumen de responsabilidades por evento

### Eventos backend (Strapi → Customer.io Track API)

| Evento | Se dispara en | Datos clave |
|---|---|---|
| `Customer Created in Exigo` | `POST /api/orders/prepare` | `exigo_customer_id`, `email`, `is_new_customer` |
| `Checkout Started` | `POST /api/orders/prepare` | `order_id`, totales, `products[]` |
| `Payment Info Entered` | `POST /api/payments/create-checkout-session` | `checkout_id` (Stripe session), `order_id` |
| `Order Completed` | Webhook `checkout.session.completed` | `order_id`, totales completos, `products[]` |
| `Order Updated` | Webhook — después de Ofix `ProcessTransaction` exitoso | Igual que `Order Completed` |
| `Exigo Transaction Failed` | Webhook — cuando Ofix `ProcessTransaction` falla | `error_type`, `order_id` |
| `Contact Form Submitted` | `POST /api/contacto/enviar` (tipo=contacto) | `inquiry_type` |
| `Newsletter Subscribed` | `POST /api/contacto/enviar` (tipo=newsletter) | `email`, `source` |

### Eventos frontend (Next.js → JS snippet)

| Evento | Se dispara en |
|---|---|
| `identify()` | Formulario contacto/newsletter (email only) / respuesta de `prepare` (email + offixCustomerId) |
| `Products Searched` | Input de búsqueda |
| `Product List Viewed` | Página de listado de productos |
| `Product List Filtered` | Aplicación de filtros |
| `Product Clicked` | Click en card de producto |
| `Product Viewed` | Página de detalle de producto |
| `Product Added` | Agregar al carrito |
| `Product Removed` | Eliminar del carrito |
| `Cart Viewed` | Abrir/ver carrito |
| `Checkout Started` | Entrar al flujo de checkout (antes de llamar al backend) |
| `Checkout Step Viewed` | Ver cada paso del checkout |
| `Checkout Step Completed` | Completar cada paso |
| `Newsletter Subscribed` | Respuesta exitosa de `/api/contacto/enviar` (tipo=newsletter) |
| `Contact Form Submitted` | Respuesta exitosa de `/api/contacto/enviar` (tipo=contacto) |

> **Doble disparo de `Checkout Started`:** El frontend lo dispara cuando el usuario entra al checkout (sin `order_id` aún). El backend lo dispara cuando la orden es creada y confirmada en Ofix (con `order_id` y totales reales). Esto es esperado y deseable — el de backend es el canónico con datos completos.

---

## 6. Flujo completo del journey de compra

```
[Usuario llega al sitio]
    ↓
  Snippet JS carga → anonymous_id generado automáticamente
    ↓
  Page views, product views, carrito → eventos frontend anónimos
    ↓
[Usuario llena newsletter o contacto — OPCIONAL]
    ↓
  Frontend: cioanalytics.identify({ email })
  Frontend: track 'Newsletter Subscribed' / 'Contact Form Submitted'
  Backend: track 'Newsletter Subscribed' / 'Contact Form Submitted' (guardado en Strapi)
    ↓
[Usuario llega al checkout]
    ↓
  Frontend: track 'Checkout Started' (sin order_id)
  Frontend: track 'Checkout Step Viewed' { step: 1 }
    ↓
[Usuario llena datos de envío → POST /api/orders/prepare]
    ↓
  Backend: identify(offixCustomerId, { email, name, site, ... })
  Backend: track 'Customer Created in Exigo'
  Backend: track 'Checkout Started' (con order_id y totales reales)
  Backend retorna: { orderId, offixCustomerId, totales, ... }
    ↓
  Frontend: cioanalytics.identify(offixCustomerId, { email })  ← VINCULA anonymous con perfil real
  Frontend: track 'Checkout Step Completed' { step: 1 }
  Frontend: track 'Checkout Step Viewed' { step: 2 }
    ↓
[Usuario hace click en "Pagar" → POST /api/payments/create-checkout-session]
    ↓
  Backend: track 'Payment Info Entered'
  Backend retorna: { checkoutUrl }
    ↓
  Frontend redirige a Stripe Checkout
    ↓
[Usuario completa el pago en Stripe]
    ↓
  Stripe envía webhook → POST /api/webhooks/stripe
    ↓
  Backend: track 'Order Completed'
  Backend: ProcessTransaction en Ofix
    ↓
    ├── Ofix OK → track 'Order Updated' (status: processing)
    └── Ofix FALLA → track 'Exigo Transaction Failed'
```

---

## 7. Eventos fuera de scope (esta fase)

| Evento | Motivo |
|---|---|
| `Order Cancelled` | No hay webhook handler para `payment_intent.canceled` en Stripe. Requiere implementar un nuevo handler. |
| `Order Refunded` | No hay webhook handler para `charge.refunded` en Stripe. Requiere implementar un nuevo handler. |
| `Coupon Entered/Applied/Denied/Removed` | No hay lógica de cupones implementada. |
| `Product Reviewed` | No hay funcionalidad de reviews. |
| `Product Shared` / `Cart Shared` | No aplica al producto actual. |
| `Wishlist Product Added/Removed` | No hay funcionalidad de wishlist. |

---

## 8. Checklist de implementación

### Backend (Strapi)

- [ ] Recibir credenciales del cliente: `CIO_SITE_ID` y `CIO_API_KEY` del workspace "Fuxion CPs"
- [ ] Instalar `customerio-node`: `npm install customerio-node`
- [ ] Agregar variables de entorno: `CIO_SITE_ID`, `CIO_API_KEY`
- [ ] Crear `src/lib/cio.ts` (singleton + helpers `cioTrack` / `cioIdentify`)
- [ ] Agregar campos `tipo` y `source` al schema de `mensaje-contacto`
- [ ] Actualizar `mensaje-contacto.ts` controller: aceptar `tipo`/`source` + disparar eventos
- [ ] Modificar `findOrCreateOfixCustomer` para retornar `{ customerId, isNew }`
- [ ] Modificar `order.ts` controller: retornar `offixCustomerId` en respuesta + disparar `Customer Created in Exigo` + `Checkout Started` + `identify`
- [ ] Modificar `payment.ts` controller: agregar populate de `site` + disparar `Payment Info Entered`
- [ ] Modificar `stripe-webhook.ts`: extender populate de `items` a `items.producto` + disparar `Order Completed`, `Order Updated`, `Exigo Transaction Failed`
- [ ] Probar en staging con Customer.io en modo debug

### Frontend (equipo externo)

- [x] Write key confirmado: `726ceaf5356b813d3e29` (producción)
- [ ] Instalar snippet en layout raíz de Next.js
- [ ] Implementar `identify()` en formulario de contacto/newsletter (solo email)
- [ ] Implementar `identify(offixCustomerId, { email })` al recibir respuesta de `POST /api/orders/prepare`
- [ ] Implementar eventos de navegación (Products Searched, Product List Viewed, Product Clicked, Product Viewed)
- [ ] Implementar eventos de carrito (Product Added, Product Removed, Cart Viewed)
- [ ] Implementar eventos de checkout (Checkout Started, Checkout Step Viewed, Checkout Step Completed)
- [ ] Implementar track en formulario de newsletter / contacto (post-respuesta exitosa del backend)

---

## 9. Notas técnicas adicionales

### Sobre el `userId` en eventos backend

El `userId` que se pasa al Track API **siempre debe ser el Exigo customer ID como string** (`String(offixCustomerId)`). Customer.io usará este ID para cruzar con el perfil identificado desde el frontend.

Si por algún motivo `offixCustomerId` es null o 0 (error en Ofix durante `prepare`), **no disparar ningún evento CIO** — no hay un userId válido al cual asociar la actividad.

### Sobre el atributo `site`

Incluir `site: siteCode` en todos los eventos backend (p. ej. `"pe"`, `"us"`, `"mx"`). Esto permite segmentar campañas y automatizaciones por país en Customer.io sin necesidad de workspaces separados.

### Sobre el nombre del evento `Customer Created in Exigo`

Este evento se disparará tanto para clientes nuevos (`is_new_customer: true`) como para clientes que ya existían en Exigo (`is_new_customer: false`). El nombre del evento refleja el momento del flujo (el sistema encontró/registró al cliente en Exigo), no necesariamente que fue creado ahora.

### Sobre el orden de `Order Completed` y `Order Updated`

El evento `Order Completed` se dispara cuando el pago es confirmado por Stripe (`status: paid`). El evento `Order Updated` se dispara cuando Ofix acepta la orden (`status: processing`). Ambos ocurren en el mismo webhook, pero en secuencia. Customer.io los recibirá con diferencia de milisegundos, lo cual es correcto.
