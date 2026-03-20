import PageHero from "@/components/PageHero/PageHero";
import Subscribe from "@/components/Subscribe/Subscribe";
import { getBlogPage, getArticulos, getStrapiImageUrl } from "@/lib/api";
import BlogGrid from "./BlogGrid";
import styles from "./page.module.css";

export async function generateMetadata() {
  const res = await getBlogPage().catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Blog y Noticias - Q'ocina",
    description: res?.data?.meta_description ?? "Artículos y noticias de Q'ocina",
  };
}

export default async function BlogYNoticiasPage() {
  const [pageRes, articulosRes] = await Promise.all([
    getBlogPage().catch(() => null),
    getArticulos().catch(() => null),
  ]);

  const pageData = pageRes?.data;
  const articulos = (articulosRes?.data ?? []).sort(
    (a, b) => a.orden - b.orden
  );
  const heroImageUrl = pageData?.hero_imagen?.url
    ? getStrapiImageUrl(pageData.hero_imagen.url)
    : undefined;

  return (
    <>
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

      <Subscribe
        title={pageData?.newsletter_titulo ?? undefined}
        description={pageData?.newsletter_descripcion ?? undefined}
        placeholder={pageData?.newsletter_placeholder ?? undefined}
        formulario_boton={pageData?.newsletter_cta_texto ?? undefined}
      />
    </>
  );
}
