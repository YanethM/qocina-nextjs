import Image from "next/image";
import PageHero from "@/components/PageHero/PageHero";
import FaqClient from "@/components/FaqClient/FaqClient";
import Subscribe from "@/components/Subscribe/Subscribe";
import { getLocale } from "@/lib/locale";
import {
  getPreguntasFrecuentes,
  getPreguntasFrecuentesByCategoria,
  getCategoriasFaq,
  getFaqPage,
  getStrapiImageUrl,
} from "@/lib/api";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ siteCode: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteCode } = await params;
  const res = await getFaqPage(undefined, siteCode).catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Preguntas Frecuentes - Q'ocina",
    description: res?.data?.meta_description ?? "Encuentra respuestas a tus preguntas sobre Q'ocina",
  };
}

export default async function PreguntasFrecuentesPage({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale();
  const [pageRes, categoriasRes] = await Promise.all([
    getFaqPage(locale, siteCode).catch(() => null),
    getCategoriasFaq(locale, siteCode).catch(() => null),
  ]);

  const pageData = pageRes?.data ?? null;
  const categorias = (categoriasRes?.data ?? []).sort(
    (a, b) => (a.orden ?? 0) - (b.orden ?? 0)
  );

  const [todasRes, ...porCategoriaRes] = await Promise.all([
    getPreguntasFrecuentes(locale, siteCode).catch(() => null),
    ...categorias.map((cat) =>
      getPreguntasFrecuentesByCategoria(cat.slug, locale, siteCode).catch(() => null)
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
      <div className={styles.desktopHero}>
        <PageHero
          backgroundImage={heroImageUrl ?? undefined}
          backgroundAlt={pageData?.hero_imagen?.alternativeText ?? "Preguntas Frecuentes"}
          overlayContent={
            <div className={styles.heroLogoWrapper}>{heroText}</div>
          }
        />
      </div>

      <div className={styles.mobileHero}>
        {heroImageUrl && (
          <div className={styles.heroImageWrapper}>
            <Image
              src={heroImageUrl}
              alt={pageData?.hero_imagen?.alternativeText ?? ""}
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

      <section className={styles.faqSection}>
        <FaqClient
          categorias={categorias}
          todas={todas}
          preguntasPorCategoria={preguntasPorCategoria}
          ctaCargarMas={pageData?.cta_cargar_mas ?? "Cargar más"}
        />
      </section>

      <Subscribe
        variant="contact"
        title={pageData?.meta_title || "¿TIENES ALGUNA DUDA?"}
        description={pageData?.meta_description || ""}
        mobileWaveImage="/images/mobile/faq/union.svg"
      />
    </>
  );
}
