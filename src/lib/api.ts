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
} from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-23-23-186-243.compute-1.amazonaws.com:1337";

async function fetchAPI<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  let urlStr = new URL(path, API_URL).toString();
  if (params) {
    const qs = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value).replace(/%2A/g, "*")}`)
      .join("&");
    urlStr += `?${qs}`;
  }

  const res = await fetch(urlStr, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function getStrapiImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}

export async function getBadges() {
  return fetchAPI<StrapiListResponse<Badge>>("/api/badges", { populate: "*" });
}

export async function getBadge(id: string) {
  return fetchAPI<StrapiSingleResponse<Badge>>(`/api/badges/${id}`, {
    populate: "*",
  });
}

export async function getCategorias() {
  return fetchAPI<StrapiListResponse<Categoria>>("/api/categorias", {
    populate: "*",
  });
}

export async function getCategoria(id: string) {
  return fetchAPI<StrapiSingleResponse<Categoria>>(`/api/categorias/${id}`, {
    populate: "*",
  });
}

export async function getTestimonios() {
  return fetchAPI<StrapiListResponse<Testimonio>>("/api/testimonios", {
    populate: "*",
  });
}

export async function getTestimonio(id: string) {
  return fetchAPI<StrapiSingleResponse<Testimonio>>(`/api/testimonios/${id}`, {
    populate: "*",
  });
}

export async function getProductos() {
  return fetchAPI<StrapiListResponse<Producto>>("/api/productos", {
    populate: "*",
  });
}

export async function getProducto(id: string) {
  return fetchAPI<StrapiSingleResponse<Producto>>(`/api/productos/${id}`, {
    populate: "*",
  });
}

export async function getRecetas() {
  return fetchAPI<StrapiListResponse<Receta>>("/api/recetas", {
    populate: "*",
  });
}

export async function getReceta(id: string) {
  return fetchAPI<StrapiSingleResponse<Receta>>(`/api/recetas/${id}`, {
    populate: "*",
  });
}

export async function getRecetaBySlug(slug: string) {
  const res = await fetchAPI<StrapiListResponse<Receta>>("/api/recetas", {
    "filters[slug][$eq]": slug,
    populate: "*",
  });
  return res.data?.[0] ?? null;
}

export async function getProductoBySlug(slug: string) {
  const res = await fetchAPI<StrapiListResponse<Producto>>("/api/productos", {
    "filters[slug][$eq]": slug,
    populate: "*",
  });
  return res.data?.[0] ?? null;
}

export async function getArticulos() {
  return fetchAPI<StrapiListResponse<Articulo>>("/api/articulos", {
    populate: "*",
  });
}

export async function getArticulo(id: string) {
  return fetchAPI<StrapiSingleResponse<Articulo>>(`/api/articulos/${id}`, {
    populate: "*",
  });
}

export async function getCategoriasBlog() {
  return fetchAPI<StrapiListResponse<CategoriaBlog>>("/api/categorias-blog", {
    populate: "*",
  });
}

export async function getCategoriaBlog(id: string) {
  return fetchAPI<StrapiSingleResponse<CategoriaBlog>>(
    `/api/categorias-blog/${id}`,
    { populate: "*" },
  );
}

export async function getCategoriasFaq() {
  return fetchAPI<StrapiListResponse<CategoriaFaq>>("/api/categorias-faq", {
    populate: "*",
  });
}

export async function getCategoriaFaq(id: string) {
  return fetchAPI<StrapiSingleResponse<CategoriaFaq>>(
    `/api/categorias-faq/${id}`,
    { populate: "*" },
  );
}

export async function getPreguntasFrecuentes() {
  return fetchAPI<StrapiListResponse<PreguntaFrecuente>>(
    "/api/preguntas-frecuentes",
    { populate: "*" },
  );
}

export async function getPreguntaFrecuente(id: string) {
  return fetchAPI<StrapiSingleResponse<PreguntaFrecuente>>(
    `/api/preguntas-frecuentes/${id}`,
    { populate: "*" },
  );
}

export async function getQuienesSomos() {
  return fetchAPI<StrapiSingleResponse<QuienesSomos>>("/api/quienes-somos", {
    populate: "*",
  });
}

export async function getProductosPage() {
  return fetchAPI<StrapiSingleResponse<ProductosPage>>("/api/productos-page", {
    "populate[0]": "perfiles_usuario.imagen",
    "populate[1]": "secreto_imagen",
    "populate[2]": "packs_destacados.imagen",
  });
}

export async function getRecetasPage() {
  return fetchAPI<StrapiSingleResponse<RecetasPage>>("/api/recetas-page", {
    populate: "*",
  });
}

export async function getBlogPage() {
  return fetchAPI<StrapiSingleResponse<BlogPage>>("/api/blog-page", {
    populate: "*",
  });
}

export async function getFaqPage() {
  return fetchAPI<StrapiSingleResponse<FaqPage>>("/api/faq-page", {
    populate: "*",
  });
}

export async function getProcesoProduccion() {
  return fetchAPI<StrapiSingleResponse<ProcesoProduccion>>(
    "/api/proceso-produccion",
    { populate: "*" },
  );
}

export async function getHomePage() {
  return fetchAPI<StrapiSingleResponse<HomePage>>("/api/home-page", {
    "populate[slider][populate][imagen][populate]": "*",
    "populate[slider][populate][imagen_mobile][populate]": "*",
    "populate[slider][populate][cta]": "*",
  });
}
