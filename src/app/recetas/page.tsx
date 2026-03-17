import Image from "next/image";
import { getRecetasPage, getRecetas, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";
import BasesCulinarias from "@/components/BasesCulinarias/BasesCulinarias";
import Testimonios from "@/components/Testimonios/Testimonios";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";

export const metadata = {
  title: "Recetas - Q'ocina",
  description: "Descubre nuestras mejores recetas",
};

export default async function RecetasPage() {
  const [recetasPageRes, recetasRes] = await Promise.all([
    getRecetasPage().catch(() => null),
    getRecetas().catch(() => null),
  ]);

  const pageData = recetasPageRes?.data;
  const bannerApiUrl = pageData?.banner ? getStrapiImageUrl(pageData.banner.url) : null;
  const testimonios = pageData?.testimonios ?? [];
  const recetas = recetasRes?.data ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.banner}>
        {bannerApiUrl && (
          <Image
            src={bannerApiUrl}
            alt="Recetas Q'ocina"
            fill
            className={styles.bannerApiBg}
            style={{ objectFit: "cover" }}
            priority
            unoptimized
          />
        )}
        <Image
          src="/images/web/recetas/banner.svg"
          alt=""
          fill
          className={styles.bannerSvg}
          priority
        />
        <div className={styles.bannerText}>
          <h1 className={styles.bannerTitulo}>{pageData?.hero_titulo}</h1>
        </div>
      </section>
      <div className={styles.bannerMobileWrapper}>
        <Image
          src="/images/web/recetas/banner_mobile.svg"
          alt="Recetas Q'ocina"
          width={390}
          height={600}
          className={styles.bannerMobileImg}
          priority
        />
      </div>

      <BasesCulinarias />
      <ListaRecetas
        recetas={recetas}
        labelTipoReceta={pageData?.filtro_tipo_receta_label ?? undefined}
        labelRegion={pageData?.filtro_region_label ?? undefined}
        labelDieta={pageData?.filtro_dieta_label ?? undefined}
      />
      <Testimonios testimonios={testimonios} testimonios_titulo={pageData?.testimonios_titulo ?? undefined} />
    </div>
  );
}