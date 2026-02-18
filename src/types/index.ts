// Strapi base response types
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

// Entities
export interface Badge {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
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
  imagen: StrapiImage | null;
  galeria: StrapiImage[] | null;
  categoria: Categoria | null;
  badges: Badge[] | null;
}

export interface Receta {
  color_card: string;
  id: number;
  documentId: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta: string | null;
  contenido: string | null;
  imagen: StrapiImage | null;
  imagen_principal: StrapiImage | null;
  tiempo: string | null;
  porciones: string | null;
  dificultad: string | null;
  ingredientes: string | null;
  preparacion: string | null;
  productos: Producto[] | null;
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
  contenido: string | null;
  imagen: StrapiImage | null;
  fecha: string | null;
  autor: string | null;
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
  categoria_faq: CategoriaFaq | null;
}

// Single Types
export interface Valor {
  id: number;
  titulo: string;
  descripcion: string;
  color?: string;
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
}

export interface ProductosPage {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  banner: StrapiImage | null;
}

export interface RecetasPage {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  banner: StrapiImage | null;
}

export interface BlogPage {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  banner: StrapiImage | null;
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
