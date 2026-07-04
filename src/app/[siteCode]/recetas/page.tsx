import Image from "next/image";
import {
  getRecetasPage,
  getRecetas,
  getProductos,
  getStrapiImageUrl,
  getTiposReceta,
  getCocinaRegiones,
  getTiposDieta,
  getTestimonios,
} from "@/lib/api";
import { getLocale } from "@/lib/locale";
import ComingSoon from "@/components/ComingSoon/ComingSoon";
import styles from "./page.module.css";
import BasesCulinarias from "@/components/BasesCulinarias/BasesCulinarias";
import Testimonios from "@/components/Testimonios/Testimonios";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";

interface Props {
  params: Promise<{ siteCode: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale(siteCode);
  const res = await getRecetasPage(locale, siteCode).catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Recetas - Q'ocina",
    description: res?.data?.meta_description ?? "Descubre nuestras mejores recetas",
  };
}

export default async function RecetasPage({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale(siteCode);
  const [recetasPageRes, recetasRes, productosRes, tiposRecetaRes, cocinaRegionesRes, tiposDietaRes, testimoniosRes] = await Promise.all([
    getRecetasPage(locale, siteCode).catch(() => null),
    getRecetas(locale, undefined, siteCode).catch(() => null),
    getProductos(locale, siteCode).catch(() => null),
    getTiposReceta(locale, siteCode).catch(() => null),
    getCocinaRegiones(locale, siteCode).catch(() => null),
    getTiposDieta(locale, siteCode).catch(() => null),
    getTestimonios(locale, siteCode).catch(() => null),
  ]);

  const pageData = recetasPageRes?.data;
  const recetas = recetasRes?.data ?? [];
  const productos = productosRes?.data ?? [];
  const tiposRecetaOptions = (tiposRecetaRes?.data ?? []).map((t) => t.nombre);
  const cocinaRegionOptions = (cocinaRegionesRes?.data ?? []).map((t) => t.nombre);
  const tiposDietaOptions = (tiposDietaRes?.data ?? []).map((t) => t.nombre);

  if (!pageData && recetas.length === 0) return <ComingSoon />;

  const heroImageUrl = pageData?.hero_imagen ? getStrapiImageUrl(pageData.hero_imagen.url) : null;
  const heroImageMobileUrl = pageData?.hero_imagen_mobile ? getStrapiImageUrl(pageData.hero_imagen_mobile.url) : heroImageUrl;
  const showBanner = Boolean(pageData?.hero_titulo || pageData?.hero_imagen || pageData?.hero_imagen_mobile);
  const testimonios = testimoniosRes?.data ?? [];
  const logoSrc = locale === "en"
    ? "/images/web/recetas/logo_en.svg"
    : "/images/web/recetas/logo.svg";

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
                quality={90}
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
              <Image
                src={logoSrc}
                alt=""
                width={277}
                height={225}
                className={styles.bannerLogo}
                aria-hidden={true}
              />
            </div>
          </section>
          <div className={styles.bannerMobileWrapper}>
            {heroImageMobileUrl && (
              <Image
                src={heroImageMobileUrl}
                alt="Recetas Q'ocina"
                fill
                className={styles.bannerMobileApiBg}
                style={{ objectFit: "cover", objectPosition: "75% top" }}
                priority
                quality={90}
              />
            )}
            <Image
              src="/images/mobile/recetas/hero.svg"
              alt=""
              fill
              className={styles.bannerMobileSvg}
              priority
            />
            {pageData?.hero_titulo && (
              <div className={styles.bannerMobileText}>
                <h1 className={styles.bannerTitulo}>{pageData.hero_titulo}</h1>
                <Image
                  src={logoSrc}
                  alt=""
                  width={277}
                  height={225}
                  className={styles.bannerLogo}
                  aria-hidden={true}
                />
              </div>
            )}
          </div>
        </>
      )}

      <BasesCulinarias productos={productos} />
      {recetas.length > 0 && (
        <ListaRecetas
          recetas={recetas}
          titulo={pageData?.hero_subtitulo ?? undefined}
          subtitulo={pageData?.descripcion ?? undefined}
          labelTipoReceta={pageData?.filtro_tipo_receta_label ?? undefined}
          labelRegion={pageData?.filtro_region_label ?? undefined}
          labelDieta={pageData?.filtro_dieta_label ?? undefined}
          tiposRecetaOptions={tiposRecetaOptions}
          cocinaRegionOptions={cocinaRegionOptions}
          tiposDietaOptions={tiposDietaOptions}
          ctaCargarMas={pageData?.cta_cargar_mas ?? undefined}
          locale={locale}
          siteCode={siteCode}
        />
      )}
      <Testimonios testimonios={testimonios} testimonios_titulo={pageData?.testimonios_titulo ?? undefined} />
    </div>
  );
}
