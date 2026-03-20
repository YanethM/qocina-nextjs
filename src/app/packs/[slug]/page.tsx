import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getPack,
  getStrapiImageUrl,
  getProductoBySlug,
  getRecetaBySlug,
  getTestimonios,
} from "@/lib/api";
import PackDetailClient from "@/components/PackDetail/PackDetailClient";
import Badges from "@/components/Badges/Badges";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";
import Testimonios from "@/components/Testimonios/Testimonios";
import PacksDestacados from "@/components/PacksDestacados/PacksDestacados";
import { getLocale } from "@/lib/locale";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPack(slug).catch(() => null);
  const pack = result?.pack;
  return {
    title: pack?.meta_title ?? pack?.nombre ?? "Pack - Q'ocina",
    description: pack?.meta_description ?? pack?.descripcion ?? "Descubre este pack",
  };
}

export default async function PackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const result = await getPack(slug).catch(() => null);

  if (!result?.pack) notFound();

  const { pack, allPacks, mostrarDescuento, porcentajeDescuento } = result;
  const imagenUrl = pack.imagen ? getStrapiImageUrl(pack.imagen.url) : null;
  const packProductos = pack.productos ?? [];

  const firstProductSlug = packProductos[0]?.slug ?? null;
  const firstProduct = firstProductSlug
    ? await getProductoBySlug(firstProductSlug).catch(() => null)
    : null;

  const badges = firstProduct?.badges ?? [];

  const testimonioIds = new Set((firstProduct?.testimonios ?? []).map((t) => t.id));
  const testimoniosRes =
    testimonioIds.size > 0 ? await getTestimonios().catch(() => null) : null;
  const testimonios = (testimoniosRes?.data ?? []).filter((t) =>
    testimonioIds.has(t.id),
  );

  const recetasSlugs = [
    ...new Set((firstProduct?.recetas_relacionadas ?? []).map((r) => r.slug)),
  ];
  const recetasConImagenes = await Promise.all(
    recetasSlugs.map((s) => getRecetaBySlug(s).catch(() => null)),
  );
  const recetas = recetasConImagenes.filter(Boolean) as NonNullable<
    (typeof recetasConImagenes)[0]
  >[];

  const otrosPacks = (allPacks ?? []).filter((p) => p.slug !== slug);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {imagenUrl && (
            <div className={styles.heroImageWrapper}>
              <Image
                src={imagenUrl}
                alt={pack.nombre}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 80vw, 400px"
                unoptimized
              />
            </div>
          )}
          <PackDetailClient
            id={pack.id}
            documentId={pack.documentId}
            slug={pack.slug}
            nombre={pack.nombre}
            descripcion={pack.descripcion}
            precio={pack.precio}
            precioMoneda={pack.precio_moneda}
            sku={pack.sku}
            imagen={imagenUrl}
            mostrarDescuento={mostrarDescuento}
            porcentajeDescuento={porcentajeDescuento}
            productos={packProductos}
            firstProduct={firstProduct}
          />
        </div>
      </section>

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

      {otrosPacks.length > 0 && (
        <PacksDestacados
          packs={otrosPacks}
          titulo="Descubre nuestras otras bases culinarias"
          mostrarDescuento={mostrarDescuento}
          porcentajeDescuento={porcentajeDescuento}
        />
      )}
    </div>
  );
}
