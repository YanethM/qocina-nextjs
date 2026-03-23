import type {
  StrapiListResponse,
  StrapiSingleResponse,
  Badge,
  Categoria,
  Testimonio,
  Producto,
  Receta,
  Articulo,
  CategoriaBlog,
  CategoriaFaq,
  PreguntaFrecuente,
  QuienesSomos,
  ProductosPage,
  RecetasPage,
  BlogPage,
  FaqPage,
  ProcesoProduccion,
  PasoProceso,
  HomePage,
  ContactoPage,
  Site,
} from "@/types";
export { API_URL, getStrapiImageUrl } from "@/lib/strapi";
import { API_URL } from "@/lib/strapi";

const VALID_SITE_CODES = ["pe", "us", "es", "mx", "ar", "co", "ec", "cl"];

function resolveSiteCode(siteCode?: string): string {
  if (siteCode && VALID_SITE_CODES.includes(siteCode)) return siteCode;
  if (typeof window !== "undefined") {
    const seg = window.location.pathname.split("/")[1];
    if (VALID_SITE_CODES.includes(seg)) return seg;
  }
  return process.env.NEXT_PUBLIC_SITE_CODE || "pe";
}

function imgFields(field: string): Record<string, string> {
  return {
    [`populate[${field}][fields][0]`]: "url",
    [`populate[${field}][fields][1]`]: "alternativeText",
    [`populate[${field}][fields][2]`]: "width",
    [`populate[${field}][fields][3]`]: "height",
    [`populate[${field}][fields][4]`]: "formats",
    [`populate[${field}][fields][5]`]: "name",
  };
}

async function fetchAPI<T>(
  path: string,
  params?: Record<string, string>,
  locale?: string,
  siteCode?: string,
): Promise<T> {
  const resolvedLocale = locale || process.env.NEXT_PUBLIC_LOCALE || "es";
  const resolvedSiteCode = resolveSiteCode(siteCode);
  const allParams = { locale: resolvedLocale, ...params };
  const qs = Object.entries(allParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value).replace(/%2A/g, "*")}`)
    .join("&");
  const urlStr = `${new URL(path, API_URL).toString()}?${qs}`;

  const res = await fetch(urlStr, {
    cache: "no-store",
    headers: {
      "X-Site": resolvedSiteCode,
    },
    signal: AbortSignal.timeout(10000),
  });

  console.log(`[API] ${res.status} ${path}`);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error: ${res.status} ${res.statusText} — ${body}`);
  }

  return res.json();
}

export async function getBadges(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiListResponse<Badge>>("/api/badges", {}, locale, siteCode);
}

export async function getBadge(id: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<Badge>>(`/api/badges/${id}`, {}, locale, siteCode);
}

export async function getCategorias(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiListResponse<Categoria>>("/api/categorias", {}, locale, siteCode);
}

export async function getCategoria(id: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<Categoria>>(`/api/categorias/${id}`, {}, locale, siteCode);
}

export async function getTestimonios(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiListResponse<Testimonio>>("/api/testimonios", {}, locale, siteCode);
}

export async function getTestimonio(id: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<Testimonio>>(`/api/testimonios/${id}`, {}, locale, siteCode);
}

export async function getProductos(locale?: string, siteCode?: string) {
  const res = await fetchAPI<StrapiListResponse<Producto>>("/api/productos", {
    ...imgFields("imagen_principal"),
    "populate[tamanos_disponibles]": "*",
    "populate[sitios][populate][site]": "*",
  }, locale, siteCode);
  return { ...res, data: res.data.filter((p) => p.disponible) };
}

export async function getProducto(id: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<Producto>>(`/api/productos/${id}`, {
    ...imgFields("imagen_principal"),
    "populate[galeria_imagenes][fields][0]": "url",
    "populate[galeria_imagenes][fields][1]": "alternativeText",
    "populate[galeria_imagenes][fields][2]": "width",
    "populate[galeria_imagenes][fields][3]": "height",
    "populate[galeria_imagenes][fields][4]": "formats",
    "populate[tamanos_disponibles]": "*",
    "populate[secciones_expandibles]": "*",
    "populate[ingredientes_destacados]": "*",
    "populate[testimonios][fields][0]": "id",
    "populate[sitios][populate][site]": "*",
  }, locale, siteCode);
}

export async function getRecetas(
  locale?: string,
  filters?: { tipo_receta?: string; cocina_region?: string; tipo_dieta?: string },
  siteCode?: string,
) {
  const filterParams: Record<string, string> = {};
  if (filters?.tipo_receta) filterParams["filters[tipo_receta][$eq]"] = filters.tipo_receta;
  if (filters?.cocina_region) filterParams["filters[cocina_region][$eq]"] = filters.cocina_region;
  if (filters?.tipo_dieta) filterParams["filters[tipo_dieta][$eq]"] = filters.tipo_dieta;
  return fetchAPI<StrapiListResponse<Receta>>("/api/recetas", {
    ...imgFields("imagen_principal"),
    ...filterParams,
  }, locale, siteCode);
}

export async function getReceta(id: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<Receta>>(`/api/recetas/${id}`, {
    ...imgFields("imagen_principal"),
    "populate[ingredientes]": "*",
    "populate[pasos][fields][0]": "numero",
    "populate[pasos][fields][1]": "titulo",
    "populate[pasos][fields][2]": "descripcion",
    "populate[pasos][fields][3]": "tiempo_minutos",
  }, locale, siteCode);
}

export async function getRecetaBySlug(slug: string, locale?: string, siteCode?: string) {
  const res = await fetchAPI<StrapiListResponse<Receta>>("/api/recetas", {
    "filters[slug][$eq]": slug,
    ...imgFields("imagen_principal"),
    "populate[ingredientes]": "*",
    "populate[pasos][fields][0]": "numero",
    "populate[pasos][fields][1]": "titulo",
    "populate[pasos][fields][2]": "descripcion",
    "populate[pasos][fields][3]": "tiempo_minutos",
    "populate[tips]": "*",
  }, locale, siteCode);
  return res.data?.[0] ?? null;
}

export async function getProductoBySlug(slug: string, locale?: string, siteCode?: string) {
  const res = await fetchAPI<StrapiListResponse<Producto>>("/api/productos", {
    "filters[slug][$eq]": slug,
    ...imgFields("imagen_principal"),
    "populate[galeria_imagenes][fields][0]": "url",
    "populate[galeria_imagenes][fields][1]": "alternativeText",
    "populate[galeria_imagenes][fields][2]": "width",
    "populate[galeria_imagenes][fields][3]": "height",
    "populate[galeria_imagenes][fields][4]": "formats",
    "populate[tamanos_disponibles]": "*",
    "populate[secciones_expandibles]": "*",
    "populate[ingredientes_destacados]": "*",
    "populate[testimonios][fields][0]": "id",
    "populate[sitios][populate][site]": "*",
  }, locale, siteCode);
  return res.data?.[0] ?? null;
}

export async function getArticulos(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiListResponse<Articulo>>("/api/articulos", {
    ...imgFields("imagen_principal"),
  }, locale, siteCode);
}

export async function getArticulo(id: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<Articulo>>(`/api/articulos/${id}`, {
    ...imgFields("imagen_principal"),
  }, locale, siteCode);
}

export async function getArticuloBySlug(slug: string, locale?: string, siteCode?: string) {
  const res = await fetchAPI<StrapiListResponse<Articulo>>("/api/articulos", {
    "filters[slug][$eq]": slug,
    ...imgFields("imagen_principal"),
  }, locale, siteCode);
  return res.data?.[0] ?? null;
}

export async function getCategoriasBlog(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiListResponse<CategoriaBlog>>("/api/categorias-blog", {}, locale, siteCode);
}

export async function getCategoriaBlog(id: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<CategoriaBlog>>(`/api/categorias-blog/${id}`, {}, locale, siteCode);
}

export async function getCategoriasFaq(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiListResponse<CategoriaFaq>>("/api/categorias-faq", {}, locale, siteCode);
}

export async function getCategoriaFaq(id: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<CategoriaFaq>>(`/api/categorias-faq/${id}`, {}, locale, siteCode);
}

export async function getPreguntasFrecuentes(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiListResponse<PreguntaFrecuente>>("/api/preguntas-frecuentes", {}, locale, siteCode);
}

export async function getPreguntasFrecuentesByCategoria(categoriaSlug: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiListResponse<PreguntaFrecuente>>("/api/preguntas-frecuentes", {
    "filters[categoria_faq][slug][$eq]": categoriaSlug,
  }, locale, siteCode);
}

export async function getPreguntaFrecuente(id: string, locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<PreguntaFrecuente>>(`/api/preguntas-frecuentes/${id}`, {}, locale, siteCode);
}

export async function getQuienesSomos(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<QuienesSomos>>("/api/quienes-somos", {
    ...imgFields("hero_imagen"),
    "populate[valores][populate][imagen][fields][0]": "url",
    "populate[valores][populate][imagen][fields][1]": "alternativeText",
    "populate[valores][populate][imagen][fields][2]": "width",
    "populate[valores][populate][imagen][fields][3]": "height",
    "populate[valores][populate][imagen][fields][4]": "formats",
    "populate[chef_cta]": "*",
    "populate[proceso_cta]": "*",
    "populate[productos_cta]": "*",
    "populate[premios][populate][imagen_premio][fields][0]": "url",
    "populate[premios][populate][imagen_premio][fields][1]": "alternativeText",
    "populate[premios][populate][imagen_premio][fields][2]": "width",
    "populate[premios][populate][imagen_premio][fields][3]": "height",
    "populate[premios][populate][imagen_premio][fields][4]": "formats",
    "populate[premios][populate][logo_organizacion][fields][0]": "url",
    "populate[premios][populate][logo_organizacion][fields][1]": "alternativeText",
    "populate[premios][populate][logo_organizacion][fields][2]": "width",
    "populate[premios][populate][logo_organizacion][fields][3]": "height",
    "populate[premios][populate][logo_organizacion][fields][4]": "formats",
  }, locale, siteCode);
}

export async function getProductosPage(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<ProductosPage>>("/api/productos-page", {
    "populate[perfiles_usuario][populate][imagen][fields][0]": "url",
    "populate[perfiles_usuario][populate][imagen][fields][1]": "alternativeText",
    "populate[perfiles_usuario][populate][imagen][fields][2]": "width",
    "populate[perfiles_usuario][populate][imagen][fields][3]": "height",
    "populate[secreto_imagen][fields][0]": "url",
    "populate[secreto_imagen][fields][1]": "alternativeText",
    "populate[secreto_imagen][fields][2]": "width",
    "populate[secreto_imagen][fields][3]": "height",
    "populate[packs_destacados][populate][imagen][fields][0]": "url",
    "populate[packs_destacados][populate][imagen][fields][1]": "alternativeText",
    "populate[packs_destacados][populate][imagen][fields][2]": "width",
    "populate[packs_destacados][populate][imagen][fields][3]": "height",
    "populate[packs_destacados][populate][productos][populate][imagen_principal][fields][0]": "url",
    "populate[packs_destacados][populate][productos][populate][imagen_principal][fields][1]": "alternativeText",
    "populate[packs_destacados][populate][productos][populate][imagen_principal][fields][2]": "width",
    "populate[packs_destacados][populate][productos][populate][imagen_principal][fields][3]": "height",
    "populate[productos_destacados][populate][imagen_principal][fields][0]": "url",
    "populate[productos_destacados][populate][imagen_principal][fields][1]": "alternativeText",
    "populate[productos_destacados][populate][imagen_principal][fields][2]": "width",
    "populate[productos_destacados][populate][imagen_principal][fields][3]": "height",
    "populate[productos_destacados][populate][imagen_principal][fields][4]": "formats",
    "populate[productos_destacados][populate][sitios][populate][site]": "*",
    "populate[ayuda_cta]": "*",
  }, locale, siteCode);
}

export async function getPack(slug: string, locale?: string, siteCode?: string) {
  const res = await fetchAPI<StrapiSingleResponse<ProductosPage>>(
    "/api/productos-page",
    {
      "populate[packs_destacados][populate][imagen][fields][0]": "url",
      "populate[packs_destacados][populate][imagen][fields][1]": "alternativeText",
      "populate[packs_destacados][populate][imagen][fields][2]": "width",
      "populate[packs_destacados][populate][imagen][fields][3]": "height",
      "populate[packs_destacados][populate][productos][populate][imagen_principal][fields][0]": "url",
      "populate[packs_destacados][populate][productos][populate][imagen_principal][fields][1]": "alternativeText",
      "populate[packs_destacados][populate][productos][populate][imagen_principal][fields][2]": "width",
      "populate[packs_destacados][populate][productos][populate][imagen_principal][fields][3]": "height",
      "populate[packs_destacados][populate][productos][populate][imagen_principal][fields][4]": "formats",
    },
    locale,
    siteCode,
  );
  const data = res?.data;
  const pack = data?.packs_destacados?.find((p) => p.slug === slug) ?? null;
  return {
    pack,
    allPacks: data?.packs_destacados ?? [],
    mostrarDescuento: data?.packs_mostrar_descuento ?? false,
    porcentajeDescuento: data?.packs_porcentaje_descuento ?? null,
  };
}

export async function getRecetasPage(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<RecetasPage>>("/api/recetas-page", {
    ...imgFields("hero_imagen"),
    ...imgFields("hero_imagen_mobile"),
    "populate[testimonios][fields][0]": "nombre_usuario",
    "populate[testimonios][fields][1]": "rating",
    "populate[testimonios][fields][2]": "texto_testimonio",
    "populate[testimonios][fields][3]": "fecha",
    "populate[testimonios][fields][4]": "destacado",
    "populate[testimonios][populate][foto_usuario][fields][0]": "url",
    "populate[testimonios][populate][foto_usuario][fields][1]": "alternativeText",
    "populate[testimonios][populate][foto_usuario][fields][2]": "width",
    "populate[testimonios][populate][foto_usuario][fields][3]": "height",
  }, locale, siteCode);
}

export async function getBlogPage(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<BlogPage>>("/api/blog-page", {
    ...imgFields("hero_imagen"),
    ...imgFields("hero_imagen_mobile"),
  }, locale, siteCode);
}

export async function getFaqPage(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<FaqPage>>("/api/faq-page", {
    ...imgFields("hero_imagen"),
  }, locale, siteCode);
}

export async function getProcesoProduccion(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<ProcesoProduccion>>("/api/proceso-produccion", {
    ...imgFields("hero_imagen"),
    "populate[hero_cta_primario]": "*",
    "populate[hero_cta_secundario]": "*",
    "populate[productos_cta]": "*",
    "populate[cta_final_primario]": "*",
    "populate[cta_final_secundario]": "*",
    "populate[productos_destacados][populate][imagen_principal][fields][0]": "url",
    "populate[productos_destacados][populate][imagen_principal][fields][1]": "alternativeText",
    "populate[productos_destacados][populate][imagen_principal][fields][2]": "width",
    "populate[productos_destacados][populate][imagen_principal][fields][3]": "height",
    "populate[productos_destacados][populate][imagen_principal][fields][4]": "formats",
    "populate[productos_destacados][populate][tamanos_disponibles]": "*",
    "populate[productos_destacados][populate][sitios][populate][site]": "*",
    "populate[pasos][populate][imagen][fields][0]": "url",
    "populate[pasos][populate][imagen][fields][1]": "alternativeText",
    "populate[pasos][populate][imagen][fields][2]": "width",
    "populate[pasos][populate][imagen][fields][3]": "height",
    "populate[pasos][populate][imagen][fields][4]": "formats",
  }, locale, siteCode);
}

export async function getHomePage(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<HomePage>>("/api/home-page", {
    "populate[slider][populate][imagen][fields][0]": "url",
    "populate[slider][populate][imagen][fields][1]": "alternativeText",
    "populate[slider][populate][imagen][fields][2]": "width",
    "populate[slider][populate][imagen][fields][3]": "height",
    "populate[slider][populate][imagen_mobile][fields][0]": "url",
    "populate[slider][populate][imagen_mobile][fields][1]": "alternativeText",
    "populate[slider][populate][imagen_mobile][fields][2]": "width",
    "populate[slider][populate][imagen_mobile][fields][3]": "height",
    "populate[slider][populate][cta]": "*",
    "populate[productos_cta]": "*",
    "populate[natural_cta]": "*",
    "populate[secreto_cta]": "*",
    "populate[secreto_chef_cta]": "*",
    "populate[historia_cta]": "*",
    "populate[amazon_cta]": "*",
    "populate[recetas_cta]": "*",
  }, locale, siteCode);
}

export async function getContactoPage(locale?: string, siteCode?: string) {
  return fetchAPI<StrapiSingleResponse<ContactoPage>>("/api/contacto-page", {
    ...imgFields("imagen"),
  }, locale, siteCode);
}

export async function getSites() {
  return fetchAPI<StrapiListResponse<Site>>("/api/sites", {});
}
