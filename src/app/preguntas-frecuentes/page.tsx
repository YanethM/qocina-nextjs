import Image from "next/image";
import PageHero from "@/components/PageHero/PageHero";
import FaqClient from "@/components/FaqClient/FaqClient";
import Subscribe from "@/components/Subscribe/Subscribe";
import {
  getPreguntasFrecuentes,
  getPreguntasFrecuentesByCategoria,
  getCategoriasFaq,
  getFaqPage,
  getStrapiImageUrl,
} from "@/lib/api";
import styles from "./page.module.css";

export async function generateMetadata() {
  const res = await getFaqPage().catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Preguntas Frecuentes - Q'ocina",
    description: res?.data?.meta_description ?? "Encuentra respuestas a tus preguntas sobre Q'ocina",
  };
}

export default async function PreguntasFrecuentesPage() {
  const [pageRes, categoriasRes] = await Promise.all([
    getFaqPage().catch(() => null),
    getCategoriasFaq().catch(() => null),
  ]);

  const pageData = pageRes?.data ?? null;
  const categorias = (categoriasRes?.data ?? []).sort(
    (a, b) => (a.orden ?? 0) - (b.orden ?? 0)
  );

  const [todasRes, ...porCategoriaRes] = await Promise.all([
    getPreguntasFrecuentes().catch(() => null),
    ...categorias.map((cat) =>
      getPreguntasFrecuentesByCategoria(cat.slug).catch(() => null)
    ),
  ]);

  const todas = (todasRes?.data ?? []).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  const preguntasPorCategoria: Record<string, typeof todas> = {};
  categorias.forEach((cat, i) => {
    const res = porCategoriaRes[i];
    preguntasPorCategoria[cat.slug] = (res?.data ?? []).sort(
      (a, b) => (a.orden ?? 0) - (b.orden ?? 0)
    );
  });

  const heroImageUrl = pageData?.hero_imagen?.url
    ? getStrapiImageUrl(pageData.hero_imagen.url)
    : null;
  const heroImageMobileUrl = pageData?.hero_imagen_mobile?.url
    ? getStrapiImageUrl(pageData.hero_imagen_mobile.url)
    : null;
  const showHero = Boolean(
    pageData?.hero_imagen ||
      pageData?.hero_imagen_mobile ||
      pageData?.hero_titulo ||
      pageData?.hero_descripcion,
  );
  const showSubscribe = Boolean(pageData?.meta_title && pageData?.meta_description);

  const heroText = (
    <>
      {pageData?.hero_etiqueta && (
        <p className={styles.heroLabel}>{pageData.hero_etiqueta}</p>
      )}
      {pageData?.hero_titulo && (
        <h1 className={styles.heroTitle}>{pageData.hero_titulo}</h1>
      )}
      {pageData?.hero_descripcion && (
        <p className={styles.heroDescription}>{pageData.hero_descripcion}</p>
      )}
    </>
  );

  return (
    <>
      {showHero && (
        <div className={styles.desktopHero}>
          <PageHero
            backgroundImage={heroImageUrl ?? undefined}
            backgroundAlt={pageData?.hero_imagen?.alternativeText ?? "Preguntas Frecuentes"}
            overlayContent={
              <div className={styles.heroLogoWrapper}>{heroText}</div>
            }
          />
        </div>
      )}

      {showHero && (
        <div className={styles.mobileHero}>
          {heroImageMobileUrl && (
            <div className={styles.heroImageWrapper}>
              <Image
                src={heroImageMobileUrl}
                alt={pageData?.hero_imagen_mobile?.alternativeText ?? ""}
                fill
                className={styles.heroImage}
                priority
                unoptimized
              />
            </div>
          )}
          <div className={styles.heroBannerWrapper}>
            <img
              src="/images/mobile/faq/banner.svg"
              alt=""
              className={styles.heroBanner}
              aria-hidden
            />
            <div className={styles.heroText}>{heroText}</div>
          </div>
        </div>
      )}

      <section className={styles.faqSection}>
        <FaqClient
          categorias={categorias}
          todas={todas}
          preguntasPorCategoria={preguntasPorCategoria}
          ctaCargarMas={pageData?.cta_cargar_mas ?? "Cargar más"}
        />
      </section>

      {showSubscribe && (
        <Subscribe
          variant="contact"
          title={pageData.meta_title}
          description={pageData.meta_description}
          mobileWaveImage="/images/mobile/faq/union.svg"
        />
      )}
    </>
  );
}
