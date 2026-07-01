# AGENTS.md — Qocina

## Comandos
```bash
npm run dev      # servidor local
npm run build    # build de producción
npm run lint     # ESLint
```

## Mapa de archivos clave

| Archivo | Rol |
|---------|-----|
| `src/middleware.ts` | Routing por país, setea cookies `site-code` y `locale` |
| `src/lib/constants.ts` | Única fuente de verdad: `VALID_SITE_CODES`, cookies, locales, monedas |
| `src/lib/api.ts` | `fetchAPI`, `normalizeProducto`, `resolveSiteCode` |
| `src/hooks/useSiteCode.ts` | Lee siteCode del path y cookie — nunca asume país por defecto |
| `src/app/page.tsx` | Root page — redirige si hay cookie, muestra modal si no |
| `src/app/[siteCode]/envio/page.tsx` | Formulario de envío y checkout (activo) |
| `src/app/api/orders/prepare/route.ts` | Proxy Next.js → Strapi, valida y reenvía `X-Site` |
| `src/app/api/ofix/route.ts` | Proxy para endpoints de Ofix (ubigeos) |
| `src/components/Header/Header.tsx` | Navegación — usa `useSiteCode()` para construir hrefs |
| `src/components/CountryModal/` | Modal de selección de país |
| `src/context/CartContext.tsx` | Carrito en localStorage |

**Nota:** existen rutas duplicadas sin `[siteCode]` (ej. `src/app/envio/page.tsx`, `src/app/carrito/page.tsx`). Son legacy. Las rutas activas y correctas son siempre las que están dentro de `src/app/[siteCode]/`.

## Stack
- Next.js App Router (src/app/[siteCode]/...)
- Strapi CMS en EC2 puerto 1337 — acceso público sin auth
- Ofix API para geolocalización y cálculo de envío
- Stripe para pagos
- Middleware Edge Runtime para routing por país

## Arquitectura multi-país
- El país fluye como: URL `/{siteCode}` → cookie `site-code` → header `X-Site` a Strapi
- `VALID_SITE_CODES` en `src/lib/constants.ts` es la única fuente de verdad
- `useSiteCode()` en `src/hooks/useSiteCode.ts` lee primero el path, luego la cookie
- El middleware nunca asume un país por defecto — sin cookie redirige a `/`

## Variables de entorno relevantes
```
NEXT_PUBLIC_API_URL=http://ec2-23-23-186-243.compute-1.amazonaws.com:1337
OFIX_API_BASE_URL=https://api-artics.fuxion.com/api-fuxion
OFIX_USER=usr_External
OFIX_PASSWORD=QkDZAQTM
OFIX_API_KEY=cwBlAGMAcgBlAHQAXwBFAHgAdABlAHIAbgBhAGwA
```

## Países y estado de configuración

| País | Código | warehouseID Ofix | currencyCode | Estado |
|------|--------|-----------------|--------------|--------|
| Perú | pe | 1030 | pen | ✅ Configurado |
| Colombia | co | 1021 | cop | ✅ Configurado |
| Ecuador | ec | 1019 | ecd | ✅ Configurado |
| Chile | cl | 1034 | clp | ✅ Configurado |
| USA | us | 1060 | usd | ✅ Configurado |
| Argentina | ar | por confirmar | ars | ⚠️ Pendiente Ofix |
| México | mx | por confirmar | mxn | ⚠️ Pendiente Ofix |
| España | es | por confirmar | eur | ⚠️ Pendiente Ofix |

Los países ⚠️ no deben salir a producción hasta confirmar `warehouseID` con el equipo de Ofix.

## Bugs conocidos pendientes

- **503 en email duplicado**: cuando el email ya existe en Ofix con `customerTypeID=9`, `findOrCreateOfixCustomer` devuelve 503 en vez de reusar el `customerID`. Pendiente fix del desarrollador backend en `src/api/order/controllers/order.ts` (Strapi).

## Nunca hacer

- Hardcodear `"pe"` o cualquier país como valor por defecto en ningún archivo
- Usar `sites[0]` como fallback en `normalizeProducto` — si no hay sitio para el país, el producto no está disponible
- Asumir que `useSiteCode()` siempre tiene valor — puede devolver `""` en la root page antes de seleccionar país
- Modificar rutas legacy (sin `[siteCode]`) — no están en uso activo
- Saltarse el hook de husky con `--no-verify`

## Protocolo para corrección de bugs

Cuando me reportes un error, envíame:

```
BUG: [descripción del problema]
RUTA: [URL o archivo donde ocurre]
REPRODUCE: [pasos exactos para reproducirlo]
BODY/RESPUESTA: [si es un endpoint, el body que se envía y el error que devuelve]
```

Ejemplo:
```
BUG: El campo State/Province siempre aparece desactivado en el formulario de envío
RUTA: /{siteCode}/envio
REPRODUCE: Seleccionar cualquier país → el dropdown de estado nunca se activa
```

## Lo que debo hacer antes de confirmar que un fix está listo

1. Leer el código real del archivo afectado
2. Identificar la causa raíz (no solo el síntoma)
3. Aplicar el fix
4. **Ejecutar pruebas reales** contra el endpoint o servicio — no confirmar sin resultados concretos
5. Cubrir mínimo estos escenarios por endpoint:
   - Sin parámetros obligatorios → error esperado
   - Parámetros inválidos → error esperado
   - País incorrecto para el recurso → error esperado
   - Caso feliz completo → 200 con datos reales
   - Caso borde relevante (producto inexistente, cliente ya registrado, etc.)
6. Para fixes de flujo en el navegador, validar también:
   - **Modo incógnito**: abrir el sitio desde cero sin sesión previa
   - **Sin cookies**: borrar cookies desde DevTools → Application → Clear storage (solo Cookies) → recargar
   - En ambos casos verificar que la navegación, carrito y checkout funcionen sin redirecciones inesperadas
7. Solo decir "está listo" cuando los tests devuelvan los códigos HTTP y datos esperados

## Pruebas del endpoint /api/orders/prepare

Dirección de prueba válida para US (en red Ofix):
```json
{
  "street": "14110 Dallas Pkwy Ste 170",
  "streetNumber": "14110",
  "reference": "",
  "city": "Dallas",
  "state": "TX",
  "zip": "75254",
  "country": "US"
}
```

Productos actuales en Strapi (pueden cambiar de ID):
```bash
curl -s "http://ec2-23-23-186-243.compute-1.amazonaws.com:1337/api/productos?populate=sitios"
```

Comando de prueba directo a Strapi:
```bash
curl -s -X POST "http://ec2-23-23-186-243.compute-1.amazonaws.com:1337/api/orders/prepare" \
  -H "Content-Type: application/json" \
  -H "X-Site: us" \
  -d '{ "items": [...], "customerName": "...", "customerEmail": "...", "customerPhone": "...", "shippingAddress": {...} }'
```

## Convención de commits

Al final de cada fix, propongo el nombre del commit con este formato:
```
tipo(scope): descripción corta en español
```

| tipo | cuándo usarlo |
|------|---------------|
| `fix` | corrección de bug |
| `feat` | nueva funcionalidad |
| `refactor` | cambio de código sin cambiar comportamiento |
| `chore` | tareas de mantenimiento, dependencias |

Ejemplos reales de este proyecto:
- `fix(checkout): corregir X-Site hardcodeado en endpoint prepare`
- `fix(header): corregir links cuando no hay siteCode en la sesión`
- `refactor(constants): centralizar VALID_SITE_CODES como fuente única de verdad`

## Reglas del proyecto

- Sin comentarios en el código excepto cuando el WHY es no obvio
- Sin valores hardcodeados de país (`"pe"`, `"co"`, etc.) — usar siempre `VALID_SITE_CODES`
- El husky pre-commit bloquea commits con comentarios — removerlos antes de commitear
- No agregar manejo de errores para escenarios imposibles
- No crear archivos `.md` de documentación salvo que se pida explícitamente
