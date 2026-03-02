import { getProducto, getRecetas, getTestimonios, getStrapiImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import Badges from "@/components/Badges/Badges";
import ProductoDetailClient from "@/components/ProductoDetail/ProductoDetailClient";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";
import Testimonios from "@/components/Testimonios/Testimonios";
import OtrasBasesCulinarias from "@/components/OtrasBasesCulinarias/OtrasBasesCulinarias";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetailPage({ params }: Props) {
  try {
    const { id } = await params;

    console.log("Buscando producto con ID:", id);

    const [res, recetasRes, testimoniosRes] = await Promise.all([
      getProducto(id),
      getRecetas().catch(() => null),
      getTestimonios().catch(() => null),
    ]);
    
    const producto = res?.data;

    if (!producto) {
      return notFound();
    }

    // Procesar imágenes
    const imagenPrincipal = producto.imagen_principal?.url 
      ? getStrapiImageUrl(producto.imagen_principal.url)
      : null;

    // Manejar tanto galeria_imagenes como galeria (por compatibilidad)
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