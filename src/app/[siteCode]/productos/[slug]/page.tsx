import { getProductoBySlug, getProductos, getRecetas, getTestimonios, getStrapiImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import Badges from "@/components/Badges/Badges";
import ProductoDetailClient from "@/components/ProductoDetail/ProductoDetailClient";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";
import Testimonios from "@/components/Testimonios/Testimonios";
import OtrasBasesCulinarias from "@/components/OtrasBasesCulinarias/OtrasBasesCulinarias";
import { getLocale } from "@/lib/locale";
import { PRODUCT_WAVE_MAP, PRODUCT_DETAIL_WAVE_MAP, DEFAULT_PRODUCT_WAVE, DEFAULT_PRODUCT_DETAIL_WAVE, COLOR_HEX_TO_KEY } from "@/lib/constants";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ siteCode: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, siteCode } = await params;
  const locale = await getLocale(siteCode);
  const producto = await getProductoBySlug(slug, locale, siteCode).catch(() => null);
  return {
    title: producto?.meta_title ?? producto?.nombre ?? "Producto - Q'ocina",
    description: producto?.meta_description ?? producto?.descripcion_corta ?? "Descubre este producto",
  };
}

export default async function ProductoDetailPage({ params }: Props) {
  try {
    const { slug, siteCode } = await params;
    const locale = await getLocale(siteCode);

    const [producto, todosProductosRes, recetasRes, testimoniosRes] = await Promise.all([
      getProductoBySlug(slug, locale, siteCode),
      getProductos(locale, siteCode).catch(() => null),
      getRecetas(locale, undefined, siteCode).catch(() => null),
      getTestimonios(locale, siteCode).catch(() => null),
    ]);

    if (!producto || !producto.disponible) {
      return notFound();
    }

    const otrasBasesProductos = (todosProductosRes?.data ?? []).filter(
      (p) => p.id !== producto.id
    );

    const imagenPrincipal = producto.imagen_principal?.url 
      ? getStrapiImageUrl(producto.imagen_principal.url)
      : null;

    const galeria = (producto.galeria_imagenes ?? producto.galeria ?? [])
      .filter((img: any) => img?.url)
      .map((img: any) => getStrapiImageUrl(img.url));

    const allImages = [imagenPrincipal, ...galeria].filter(Boolean) as string[];

    const badges = producto.badges ?? [];

    const seccionesExpandibles = [...(producto.secciones_expandibles ?? [])].sort(
      (a, b) => a.orden - b.orden
    );

    const testimonios = testimoniosRes?.data ?? [];

    const colorKey = producto.color ? COLOR_HEX_TO_KEY[producto.color.toLowerCase()] : null;
    const recetas = (recetasRes?.data ?? [])
      .filter((r) => r.color_card === (colorKey ?? "rojo"))
      .slice(0, 3);
    const productWave = (colorKey && PRODUCT_WAVE_MAP[colorKey]) ?? DEFAULT_PRODUCT_WAVE;
    const productDetailWave = (colorKey && PRODUCT_DETAIL_WAVE_MAP[colorKey]) ?? DEFAULT_PRODUCT_DETAIL_WAVE;

    return (
      <div className={styles.page}>
        <ProductoDetailClient
          id={producto.id}
          documentId={producto.documentId}
          slug={producto.slug}
          nombre={producto.nombre}
          descripcionCorta={producto.descripcion_corta}
          descripcionLarga={producto.descripcion_larga}
          presentacion={producto.presentacion}
          rinde={producto.rinde}
          precio={producto.precio}
          precioMoneda={producto.precio_moneda}
          allImages={allImages}
          imagenPrincipal={imagenPrincipal}
          categoria={producto.categoria}
          seccionesExpandibles={seccionesExpandibles}
          sku={producto.sku ?? null}
          color={producto.color}
        />

        {badges.length > 0 && (
          <div className={styles.badgesWrapper}>
            <Badges badges={badges} />
          </div>
        )}
        <img
          src={productDetailWave}
          alt=""
          width={1440}
          height={100}
          className={styles.waveBottom}
          style={{ width: "100%", height: "auto" }}
        />

        {recetas.length > 0 && <ListaRecetas recetas={recetas} hideFilters />}
        {testimonios.length > 0 && (
          <Testimonios
            testimonios={testimonios}
            testimonios_titulo={locale === "es" ? "Testimonios" : "Testimonials"}
            waveImage={productWave}
          />
        )}
        <OtrasBasesCulinarias productos={otrasBasesProductos} locale={locale} />
      </div>
    );
  } catch (error) {
    console.error("🔥 Error al cargar producto:", error);
    return notFound();
  }
}
