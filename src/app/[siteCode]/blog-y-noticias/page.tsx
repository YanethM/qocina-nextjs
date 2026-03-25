import PageHero from "@/components/PageHero/PageHero";
import Subscribe from "@/components/Subscribe/Subscribe";
import { getBlogPage, getArticulos, getStrapiImageUrl } from "@/lib/api";
import { getLocale } from "@/lib/locale";
import BlogGrid from "./BlogGrid";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ siteCode: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteCode } = await params;
  const res = await getBlogPage(undefined, siteCode).catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Blog y Noticias - Q'ocina",
    description: res?.data?.meta_description ?? "Artículos y noticias de Q'ocina",
  };
}

export default async function BlogYNoticiasPage({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale();
  const [pageRes, articulosRes] = await Promise.all([
    getBlogPage(locale, siteCode).catch(() => null),
    getArticulos(locale, siteCode).catch(() => null),
  ]);

  const pageData = pageRes?.data;
  const articulos = (articulosRes?.data ?? []).sort(
    (a, b) => a.orden - b.orden
  );
  const heroImageUrl = pageData?.hero_imagen?.url
    ? getStrapiImageUrl(pageData.hero_imagen.url)
    : undefined;
  const showHero = Boolean(
    pageData?.hero_titulo || pageData?.hero_imagen || pageData?.hero_imagen_mobile,
  );
  const showSubscribe = Boolean(
    pageData?.newsletter_titulo &&
      pageData?.newsletter_descripcion &&
      pageData?.newsletter_placeholder &&
      pageData?.newsletter_cta_texto,
  );

  return (
    <>
      {showHero && (
        <PageHero
          backgroundImage={heroImageUrl}
          backgroundAlt="Blog y Noticias"
          waveImage="/images/web/noticias/hero_wave.svg"
          overlayContent={
            pageData?.hero_titulo ? (
              <p className={styles.heroTitulo}>{pageData.hero_titulo}</p>
            ) : undefined
          }
        />
      )}

      <section className={styles.publicacionesSection}>
        {pageData?.publicaciones_titulo && (
          <h2 className={styles.publicacionesTitulo}>
            {pageData.publicaciones_titulo}
          </h2>
        )}

        <BlogGrid
          articulos={articulos}
          ctaVerTodas={pageData?.relacionadas_cta_ver_todas}
        />
      </section>

      {showSubscribe && (
        <Subscribe
          title={pageData.newsletter_titulo}
          description={pageData.newsletter_descripcion}
          placeholder={pageData.newsletter_placeholder}
          formulario_boton={pageData.newsletter_cta_texto}
        />
      )}
    </>
  );
}
