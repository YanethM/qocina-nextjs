export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  } | null;
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface Badge {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  descripcion: string;
  color_fondo: string | null;
  icono: StrapiImage | null;
}

export interface Categoria {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: StrapiImage | null;
}

export interface Testimonio {
  id: number;
  documentId: string;
  nombre_usuario: string;
  rating: number;
  texto_testimonio: string;
  fecha: string;
  destacado: boolean;
  foto_usuario?: StrapiImage | null;
}

export interface Producto {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  descripcion_corta: string;
  descripcion_larga: string | null;
  presentacion: string | null;
  rinde: string | null;
  precio: number;
  precio_moneda: string;
  stock: number;
  disponible: boolean;
  sku: string | null;
  imagen_principal: StrapiImage | null;
  galeria: StrapiImage[] | null;
  galeria_imagenes: StrapiImage[] | null;
  categoria: Categoria | null;
  badges: Badge[] | null;
  recetas_relacionadas: Receta[] | null;
  testimonios: Testimonio[] | null;
}

export interface RecetaIngrediente {
  id: number;
  nombre: string;
  cantidad: string;
  unidad: string;
  es_opcional: boolean;
}

export interface RecetaPaso {
  id: number;
  numero: number;
  titulo: string;
  descripcion: string;
  tiempo_minutos: number | null;
  imagen: StrapiImage | null;
}

export interface RecetaTip {
  id: number;
  numero: number;
  descripcion: string;
}

export interface Receta {
  color_card: string;
  id: number;
  documentId: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta: string | null;
  descripcion_larga: string | null;
  contenido: string | null;
  imagen: StrapiImage | null;
  imagen_principal: StrapiImage | null;
  galeria_imagenes: StrapiImage[] | null;
  tiempo: string | null;
  tiempo_preparacion: number | null;
  tiempo_coccion: number | null;
  porciones: string | null;
  dificultad: string | null;
  ingredientes: RecetaIngrediente[] | string | null;
  pasos: RecetaPaso[] | null;
  tips: RecetaTip[] | null;
  preparacion: string | null;
  productos: Producto[] | null;
  recetas_relacionadas: Receta[] | null;
  tipo_receta?: string | null;
  cocina_region?: string | null;
  tipo_dieta?: string | null;
  texto_base_utilizada?: string | null;
  destacada?: boolean;
  video_url?: string | null;
}

export interface CategoriaBlog {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
}

export interface Articulo {
  id: number;
  documentId: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta: string | null;
  contenido: string | null;
  imagen: StrapiImage | null;
  fecha: string | null;
  fecha_publicacion: string | null;
  autor: string | null;
  tiempo_lectura: number | null;
  destacado: boolean;
  orden: number;
  categoria_blog: CategoriaBlog | null;
}

export interface CategoriaFaq {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
}

export interface PreguntaFrecuente {
  id: number;
  documentId: string;
  pregunta: string;
  respuesta: string;
  orden: number;
  categoria_faq: CategoriaFaq | null;
}

export interface Valor {
  id: number;
  titulo: string;
  descripcion: string;
  color?: string;
  orden?: number;
  imagen?: StrapiImage | null;
}

export interface Premio {
  id: number;
  titulo?: string | null;
  descripcion?: string | null;
  imagen?: StrapiImage | null;
  orden?: number;
}

export interface QuienesSomos {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  contenido: string | null;
  imagen: StrapiImage | null;
  mision: string | null;
  vision: string | null;
  valores: Valor[] | null;
  hero_titulo: string | null;
  hero_subtitulo: string | null;
  hero_imagen: StrapiImage | null;
  que_es_titulo: string | null;
  que_es_descripcion: string | null;
  chef_nombre: string | null;
  chef_titulo: string | null;
  chef_descripcion: string | null;
  chef_cta: { id: number; texto: string; url: string; nueva_ventana: boolean } | null;
  premios_titulo: string | null;
  premios: Premio[] | null;
  productos_titulo: string | null;
  productos_subtitulo: string | null;
  productos_descripcion: string | null;
  productos_cta: { id: number; texto: string; url: string; nueva_ventana: boolean } | null;
  proceso_titulo: string | null;
  proceso_cta: { id: number; texto: string; url: string; nueva_ventana: boolean } | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface PackDestacado {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  precio_moneda: string;
  disponible: boolean;
  sku: string | null;
  orden: number;
  productos: Producto[] | null;
  imagen: StrapiImage | null;
}

export interface PerfilUsuario {
  id: number;
  titulo: string;
  descripcion: string;
  orden: number;
  imagen: StrapiImage | null;
}

export interface ProductosPage {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  hero_titulo: string | null;
  hero_subtitulo: string | null;
  productos_titulo: string | null;
  productos_destacados: Producto[] | null;
  packs_titulo: string | null;
  packs_mostrar_descuento: boolean;
  packs_porcentaje_descuento: number | null;
  banner: StrapiImage | null;
  secreto_imagen: StrapiImage | null;
  packs_destacados: PackDestacado[] | null;
  perfiles_usuario: PerfilUsuario[] | null;
  ayuda_titulo: string | null;
  ayuda_subtitulo: string | null;
  ayuda_cta: { id: number; texto: string; url: string; nueva_ventana: boolean } | null;
}

export interface RecetasPage {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  hero_titulo: string | null;
  hero_subtitulo: string | null;
  banner: StrapiImage | null;
  filtro_tipo_receta_label: string | null;
  filtro_region_label: string | null;
  filtro_dieta_label: string | null;
  testimonios_titulo: string | null;
  testimonios: Testimonio[] | null;
}

export interface BlogPage {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  hero_titulo: string;
  hero_subtitulo: string;
  publicaciones_titulo: string;
  cta_cargar_mas: string;
  newsletter_titulo: string;
  newsletter_descripcion: string;
  newsletter_placeholder: string;
  newsletter_cta_texto: string;
  meta_title: string;
  meta_description: string;
  banner: StrapiImage | null;
  hero_imagen: StrapiImage | null;
  hero_imagen_mobile: StrapiImage | null;
}

export interface FaqPage {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
}

export interface ProcesoProduccion {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  contenido: string | null;
  pasos: string | null;
  imagen: StrapiImage | null;
}

export interface ContactoPage {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  formulario_boton: string;
}

export interface HeroSlide {
  id: number;
  titulo: string;
  imagen: StrapiImage | null;
  imagen_mobile: StrapiImage | null;
  cta: {
    id: number;
    texto: string;
    url: string;
    nueva_ventana: boolean;
  } | null;
}

export interface HomePage {
  id: number;
  documentId: string;
  slider: HeroSlide[];
  intro_texto: string;
  productos_titulo: string;
  productos_cta: { texto: string; url: string; nueva_ventana: boolean } | null;
  natural_titulo: string;
  natural_descripcion: string;
  natural_frase_q: string;
  natural_cta: { texto: string; url: string; nueva_ventana: boolean } | null;
  secreto_titulo: string;
  secreto_descripcion: string;
  secreto_chef_frase_q: string;
  secreto_cta: { texto: string; url: string; nueva_ventana: boolean } | null;
  secreto_chef_cta: { texto: string; url: string; nueva_ventana: boolean } | null;
  historia_descripcion: string;
  historia_frase_q: string;
  historia_cta: { texto: string; url: string; nueva_ventana: boolean } | null;
  amazon_titulo: string;
  amazon_descripcion: string;
  amazon_cta: { texto: string; url: string; nueva_ventana: boolean } | null;
  recetas_titulo: string;
  recetas_cta: { texto: string; url: string; nueva_ventana: boolean } | null;
  testimonios_titulo: string;
}
