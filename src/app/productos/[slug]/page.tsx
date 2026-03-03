import { getProductoBySlug, getRecetas, getTestimonios, getStrapiImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import Badges from "@/components/Badges/Badges";
import ProductoDetailClient from "@/components/ProductoDetail/ProductoDetailClient";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";
import Testimonios from "@/components/Testimonios/Testimonios";
import OtrasBasesCulinarias from "@/components/OtrasBasesCulinarias/OtrasBasesCulinarias";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductoDetailPage({ params }: Props) {
  try {
    const { slug } = await params;

    const [producto, recetasRes, testimoniosRes] = await Promise.all([
      getProductoBySlug(slug),
      getRecetas().catch(() => null),
      getTestimonios().catch(() => null),
    ]);

    if (!producto) {
      return notFound();
    }

    const imagenPrincipal = producto.imagen_principal?.url 
      ? getStrapiImageUrl(producto.imagen_principal.url)
      : null;

    const galeria = (producto.galeria_imagenes ?? producto.galeria ?? [])
      .filter((img: any) => img?.url)
      .map((img: any) => getStrapiImageUrl(img.url));

    const allImages = [imagenPrincipal, ...galeria].filter(Boolean) as string[];

    const badges = producto.badges ?? [];
    const recetas = recetasRes?.data ?? [];
    const testimonios = testimoniosRes?.data ?? [];

    return (
      <div className={styles.page}>
        <ProductoDetailClient
          nombre={producto.nombre}
          descripcionCorta={producto.descripcion_corta}
          descripcionLarga={producto.descripcion_larga}
          presentacion={producto.presentacion}
          rinde={producto.rinde}
          precio={producto.precio}
          precioMoneda={producto.precio_moneda}
          allImages={allImages}
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

        <ListaRecetas recetas={recetas} hideFilters />
        <Testimonios testimonios={testimonios} />
        <OtrasBasesCulinarias />
      </div>
    );
  } catch (error) {
    console.error("🔥 Error al cargar producto:", error);
    return notFound();
  }
}