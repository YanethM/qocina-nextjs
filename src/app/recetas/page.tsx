import Image from "next/image";
import { getRecetasPage, getRecetas, getStrapiImageUrl } from "@/lib/api";
import { getLocale } from "@/lib/locale";
import styles from "./page.module.css";
import BasesCulinarias from "@/components/BasesCulinarias/BasesCulinarias";
import Testimonios from "@/components/Testimonios/Testimonios";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";

export async function generateMetadata() {
  const locale = await getLocale();
  const res = await getRecetasPage(locale).catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Recetas - Q'ocina",
    description: res?.data?.meta_description ?? "Descubre nuestras mejores recetas",
  };
}

export default async function RecetasPage() {
  const locale = await getLocale();
  const [recetasPageRes, recetasRes] = await Promise.all([
    getRecetasPage(locale).catch(() => null),
    getRecetas(locale).catch(() => null),
  ]);

  const pageData = recetasPageRes?.data;
  const heroImageUrl = pageData?.hero_imagen ? getStrapiImageUrl(pageData.hero_imagen.url) : null;
  const heroImageMobileUrl = pageData?.hero_imagen_mobile ? getStrapiImageUrl(pageData.hero_imagen_mobile.url) : null;
  const showBanner = Boolean(pageData?.hero_titulo || pageData?.hero_imagen || pageData?.hero_imagen_mobile);
  const testimonios = pageData?.testimonios ?? [];
  const recetas = recetasRes?.data ?? [];

  return (
    <div className={styles.page}>
      {showBanner && (
        <>
          <section className={styles.banner}>
            {heroImageUrl && (
              <Image
                src={heroImageUrl}
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
              {pageData?.hero_subtitulo && (
                <>
                  <Image
                    src="/images/web/recetas/logo.svg"
                    alt=""
                    width={180}
                    height={54}
                    className={styles.bannerLogo}
                    aria-hidden={true}
                  />
                  <p className={styles.bannerSubtitulo}>{pageData.hero_subtitulo}</p>
                </>
              )}
            </div>
          </section>
          <div className={styles.bannerMobileWrapper}>
            {heroImageMobileUrl && (
              <Image
                src={heroImageMobileUrl}
                alt="Recetas Q'ocina"
                fill
                className={styles.bannerMobileApiBg}
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority
                unoptimized
              />
            )}
            <Image
              src="/images/mobile/recetas/hero.svg"
              alt=""
              width={390}
              height={780}
              className={styles.bannerMobileSvg}
              priority
            />
            {pageData?.hero_titulo && (
              <div className={styles.bannerMobileText}>
                <h1 className={styles.bannerTitulo}>{pageData.hero_titulo}</h1>
                {pageData?.hero_subtitulo && (
                  <>
                    <Image
                      src="/images/web/recetas/logo.svg"
                      alt=""
                      width={180}
                      height={54}
                      className={styles.bannerLogo}
                      aria-hidden={true}
                    />
                    <p className={styles.bannerSubtitulo}>{pageData.hero_subtitulo}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <BasesCulinarias />
      {recetas.length > 0 && (
        <ListaRecetas
          recetas={recetas}
          labelTipoReceta={pageData?.filtro_tipo_receta_label ?? undefined}
          labelRegion={pageData?.filtro_region_label ?? undefined}
          labelDieta={pageData?.filtro_dieta_label ?? undefined}
          ctaCargarMas={pageData?.cta_cargar_mas ?? undefined}
          locale={locale}
        />
      )}
      <Testimonios testimonios={testimonios} testimonios_titulo={pageData?.testimonios_titulo ?? undefined} />
    </div>
  );
}
