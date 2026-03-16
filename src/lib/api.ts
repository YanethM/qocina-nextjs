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
  HomePage,
  ContactoPage,
  Site,
} from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-23-23-186-243.compute-1.amazonaws.com:1337";

const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || "pe";

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
): Promise<T> {
  const resolvedLocale = locale || process.env.NEXT_PUBLIC_LOCALE || "en";
  const allParams = { locale: resolvedLocale, ...params };
  const qs = Object.entries(allParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value).replace(/%2A/g, "*")}`)
    .join("&");
  const urlStr = `${new URL(path, API_URL).toString()}?${qs}`;

  const res = await fetch(urlStr, {
    cache: "no-store",
    headers: {
      "X-Site": SITE_CODE,
    },
  });

  console.log(`[API] ${res.status} ${path}`);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error: ${res.status} ${res.statusText} — ${body}`);
  }

  return res.json();
}

export function getStrapiImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}

export async function getBadges(locale?: string) {
  return fetchAPI<StrapiListResponse<Badge>>("/api/badges", {}, locale);
}

export async function getBadge(id: string, locale?: string) {
  return fetchAPI<StrapiSingleResponse<Badge>>(`/api/badges/${id}`, {}, locale);
}

export async function getCategorias(locale?: string) {
  return fetchAPI<StrapiListResponse<Categoria>>("/api/categorias", {}, locale);
}

export async function getCategoria(id: string, locale?: string) {
  return fetchAPI<StrapiSingleResponse<Categoria>>(`/api/categorias/${id}`, {}, locale);
}

export async function getTestimonios(locale?: string) {
  return fetchAPI<StrapiListResponse<Testimonio>>("/api/testimonios", {}, locale);
}

export async function getTestimonio(id: string, locale?: string) {
  return fetchAPI<StrapiSingleResponse<Testimonio>>(`/api/testimonios/${id}`, {}, locale);
}

export async function getProductos(locale?: string) {
  return fetchAPI<StrapiListResponse<Producto>>("/api/productos", {
    ...imgFields("imagen_principal"),
    "populate[tamanos_disponibles]": "*",
    "populate[sitios][populate][site]": "*",
  }, locale);
}

export async function getProducto(id: string, locale?: string) {
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
  }, locale);
}

export async function getRecetas(
  locale?: string,
  filters?: { tipo_receta?: string; cocina_region?: string; tipo_dieta?: string },
) {
  const filterParams: Record<string, string> = {};
  if (filters?.tipo_receta) filterParams["filters[tipo_receta][$eq]"] = filters.tipo_receta;
  if (filters?.cocina_region) filterParams["filters[cocina_region][$eq]"] = filters.cocina_region;
  if (filters?.tipo_dieta) filterParams["filters[tipo_dieta][$eq]"] = filters.tipo_dieta;
  return fetchAPI<StrapiListResponse<Receta>>("/api/recetas", {
    ...imgFields("imagen_principal"),
    ...filterParams,
  }, locale);
}

export async function getReceta(id: string, locale?: string) {
  return fetchAPI<StrapiSingleResponse<Receta>>(`/api/recetas/${id}`, {
    ...imgFields("imagen_principal"),
    "populate[ingredientes]": "*",
    "populate[pasos][fields][0]": "numero",
    "populate[pasos][fields][1]": "titulo",
    "populate[pasos][fields][2]": "descripcion",
    "populate[pasos][fields][3]": "tiempo_minutos",
  }, locale);
}

export async function getRecetaBySlug(slug: string, locale?: string) {
  const res = await fetchAPI<StrapiListResponse<Receta>>("/api/recetas", {
    "filters[slug][$eq]": slug,
    ...imgFields("imagen_principal"),
    "populate[ingredientes]": "*",
    "populate[pasos][fields][0]": "numero",
    "populate[pasos][fields][1]": "titulo",
    "populate[pasos][fields][2]": "descripcion",
    "populate[pasos][fields][3]": "tiempo_minutos",
    "populate[tips]": "*",
  }, locale);
  return res.data?.[0] ?? null;
}

export async function getProductoBySlug(slug: string, locale?: string) {
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
  }, locale);
  return res.data?.[0] ?? null;
}

export async function getArticulos(locale?: string) {
  return fetchAPI<StrapiListResponse<Articulo>>("/api/articulos", {
    ...imgFields("imagen_principal"),
  }, locale);
}

export async function getArticulo(id: string, locale?: string) {
  return fetchAPI<StrapiSingleResponse<Articulo>>(`/api/articulos/${id}`, {
    ...imgFields("imagen_principal"),
  }, locale);
}

export async function getArticuloBySlug(slug: string, locale?: string) {
  const res = await fetchAPI<StrapiListResponse<Articulo>>("/api/articulos", {
    "filters[slug][$eq]": slug,
    ...imgFields("imagen_principal"),
  }, locale);
  return res.data?.[0] ?? null;
}

export async function getCategoriasBlog(locale?: string) {
  return fetchAPI<StrapiListResponse<CategoriaBlog>>("/api/categorias-blog", {}, locale);
}

export async function getCategoriaBlog(id: string, locale?: string) {
  return fetchAPI<StrapiSingleResponse<CategoriaBlog>>(`/api/categorias-blog/${id}`, {}, locale);
}

export async function getCategoriasFaq(locale?: string) {
  return fetchAPI<StrapiListResponse<CategoriaFaq>>("/api/categorias-faq", {}, locale);
}

export async function getCategoriaFaq(id: string, locale?: string) {
  return fetchAPI<StrapiSingleResponse<CategoriaFaq>>(`/api/categorias-faq/${id}`, {}, locale);
}

export async function getPreguntasFrecuentes(locale?: string) {
  return fetchAPI<StrapiListResponse<PreguntaFrecuente>>("/api/preguntas-frecuentes", {}, locale);
}

export async function getPreguntasFrecuentesByCategoria(categoriaSlug: string, locale?: string) {
  return fetchAPI<StrapiListResponse<PreguntaFrecuente>>("/api/preguntas-frecuentes", {
    "filters[categoria_faq][slug][$eq]": categoriaSlug,
  }, locale);
}

export async function getPreguntaFrecuente(id: string, locale?: string) {
  return fetchAPI<StrapiSingleResponse<PreguntaFrecuente>>(`/api/preguntas-frecuentes/${id}`, {}, locale);
}

export async function getQuienesSomos(locale?: string) {
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
    "populate[premios]": "*",
  }, locale);
}

export async function getProductosPage(locale?: string) {
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
    "populate[ayuda_cta]": "*",
  }, locale);
}

export async function getPack(slug: string, locale?: string) {
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
  );
  const data = res?.data;
  const pack = data?.packs_destacados?.find((p) => p.slug === slug) ?? null;
  return {
    pack,
    mostrarDescuento: data?.packs_mostrar_descuento ?? false,
    porcentajeDescuento: data?.packs_porcentaje_descuento ?? null,
  };
}

export async function getRecetasPage(locale?: string) {
  return fetchAPI<StrapiSingleResponse<RecetasPage>>("/api/recetas-page", {
    "populate[testimonios][fields][0]": "nombre_usuario",
    "populate[testimonios][fields][1]": "rating",
    "populate[testimonios][fields][2]": "texto_testimonio",
    "populate[testimonios][fields][3]": "fecha",
    "populate[testimonios][fields][4]": "destacado",
    "populate[testimonios][populate][foto_usuario][fields][0]": "url",
    "populate[testimonios][populate][foto_usuario][fields][1]": "alternativeText",
    "populate[testimonios][populate][foto_usuario][fields][2]": "width",
    "populate[testimonios][populate][foto_usuario][fields][3]": "height",
  }, locale);
}

export async function getBlogPage(locale?: string) {
  return fetchAPI<StrapiSingleResponse<BlogPage>>("/api/blog-page", {
    ...imgFields("hero_imagen"),
    ...imgFields("hero_imagen_mobile"),
  }, locale);
}

export async function getFaqPage(locale?: string) {
  return fetchAPI<StrapiSingleResponse<FaqPage>>("/api/faq-page", {
    ...imgFields("hero_imagen"),
  }, locale);
}

export async function getProcesoProduccion(locale?: string) {
  return fetchAPI<StrapiSingleResponse<ProcesoProduccion>>("/api/proceso-produccion", {}, locale);
}

export async function getHomePage(locale?: string) {
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
  }, locale);
}

export async function getContactoPage(locale?: string) {
  return fetchAPI<StrapiSingleResponse<ContactoPage>>("/api/contacto-page", {
    ...imgFields("imagen"),
  }, locale);
}

export async function getSites() {
  return fetchAPI<StrapiListResponse<Site>>("/api/sites", {});
}
