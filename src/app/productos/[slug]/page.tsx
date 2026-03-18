import { getProductoBySlug, getProductos, getRecetaBySlug, getTestimonios, getStrapiImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import Badges from "@/components/Badges/Badges";
import ProductoDetailClient from "@/components/ProductoDetail/ProductoDetailClient";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";
import Testimonios from "@/components/Testimonios/Testimonios";
import OtrasBasesCulinarias from "@/components/OtrasBasesCulinarias/OtrasBasesCulinarias";
import { getLocale } from "@/lib/locale";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductoDetailPage({ params }: Props) {
  try {
    const { slug } = await params;
    const locale = await getLocale();

    const [producto, todosProductosRes] = await Promise.all([
      getProductoBySlug(slug),
      getProductos().catch(() => null),
    ]);

    if (!producto) {
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

    const productoTestimonioIds = new Set((producto.testimonios ?? []).map((t) => t.id));
    const testimoniosRes = productoTestimonioIds.size > 0
      ? await getTestimonios().catch(() => null)
      : null;
    const testimonios = (testimoniosRes?.data ?? []).filter((t) => productoTestimonioIds.has(t.id));

    const recetasBase = producto.recetas_relacionadas ?? [];
    const recetasConImagenes = await Promise.all(
      recetasBase.map((r) => getRecetaBySlug(r.slug).catch(() => null))
    );
    const recetas = recetasConImagenes.filter(Boolean) as NonNullable<typeof recetasConImagenes[0]>[];

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
          badges={badges}
        />

        {badges.length > 0 && (
          <div className={styles.badgesWrapper}>
            <Badges badges={badges} />
          </div>
        )}
        <img
          src="/images/web/products/product_detail/waves_product_detail.svg"
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
            waveImage="/images/web/products/red_waves.svg"
          />
        )}
        <OtrasBasesCulinarias productos={otrasBasesProductos} />
      </div>
    );
  } catch (error) {
    console.error("🔥 Error al cargar producto:", error);
    return notFound();
  }
}
