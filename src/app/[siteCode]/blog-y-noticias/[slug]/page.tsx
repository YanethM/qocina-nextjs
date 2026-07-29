import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocale } from "@/lib/locale";
import ArticuloMarkdown from "@/components/ArticuloMarkdown/ArticuloMarkdown";
import BlogCard from "@/components/BlogCard/BlogCard";
import RelacionadosCarousel from "@/components/RelacionadosCarousel/RelacionadosCarousel";
import Subscribe from "@/components/Subscribe/Subscribe";
import { getArticuloBySlug, getArticulos, getBlogPage, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ siteCode: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, siteCode } = await params;
  const locale = await getLocale(siteCode);
  const articulo = await getArticuloBySlug(slug, locale, siteCode).catch(() => null);
  return {
    title: articulo?.meta_title ?? articulo?.titulo ?? "Artículo - Q'ocina",
    description: articulo?.meta_description ?? articulo?.descripcion_corta ?? articulo?.descripcion ?? "Lee este artículo",
  };
}

export default async function ArticuloDetailPage({ params }: Props) {
  const { slug, siteCode } = await params;
  const locale = await getLocale(siteCode);
  const [articulo, articulosRes, blogPageRes] = await Promise.all([
    getArticuloBySlug(slug, locale, siteCode).catch(() => null),
    getArticulos(locale, siteCode).catch(() => null),
    getBlogPage(locale, siteCode).catch(() => null),
  ]);
  const blogPage = blogPageRes?.data ?? null;

  if (!articulo) notFound();

  const categoriaId = articulo.categoria_blog?.id ?? null;
  const otrosArticulos = (articulosRes?.data ?? [])
    .filter((a) => {
      if (a.slug === slug) return false;
      if (categoriaId !== null) return a.categoria_blog?.id === categoriaId;
      return true;
    })
    .sort((a, b) => a.orden - b.orden);
  const portadaDesktop = articulo.imagen_banner_desktop ?? articulo.imagen_principal;
  const portadaMobile = articulo.imagen_banner_mobile ?? portadaDesktop;

  return (
    <div className={styles.page}>
      <div className={styles.portada}>
        {portadaDesktop ? (
          <>
            <Image
              src={getStrapiImageUrl(portadaDesktop.url)}
              alt={portadaDesktop.alternativeText || articulo.titulo}
              fill
              className={`${styles.portadaImg} ${styles.portadaImgDesktop}`}
              priority
              quality={90}
            />
            {portadaMobile && (
              <Image
                src={getStrapiImageUrl(portadaMobile.url)}
                alt={portadaMobile.alternativeText || articulo.titulo}
                fill
                className={`${styles.portadaImg} ${styles.portadaImgMobile}`}
                priority
                quality={90}
              />
            )}
          </>
        ) : (
          <div className={styles.portadaPlaceholder} />
        )}
      </div>

      <div className={styles.heroBg}>
        <Image
          src="/images/web/noticias/noticia_detail/background.svg"
          alt=""
          fill
          className={styles.heroBgImg}
          priority
        />
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitulo}>{articulo.titulo}</h1>

        <div className={styles.card}>
          {articulo.descripcion_corta && (
            <p className={styles.cardDescripcion}>
              {articulo.descripcion_corta}
            </p>
          )}
          {articulo.contenido && (
            <div className={styles.cardContenido}>
              <ArticuloMarkdown content={articulo.contenido} />
            </div>
          )}
          <p className={styles.cardCta}>
            <strong>¿Ya lo probaste? ¡Compártelo con nosotros!</strong>
            <br />
            Sigue nuestra cuenta oficial{" "}
            <strong>@Q&apos;ocinaenCasa</strong> y comparte tus creaciones. Usa
            el hashtag <strong>#AtreveteAMás</strong> para mostrar cómo
            transformas tus platos con nuestras bases.
          </p>
        </div>
      </div>

      {otrosArticulos.length > 0 && (
        <div className={styles.relacionadosSection}>
          <div className={styles.relacionadosHeader}>
            <h2 className={styles.relacionadosTitulo}>Noticias relacionadas</h2>
            {blogPage?.relacionadas_cta_ver_todas && (
              <Link href={`/${siteCode}/blog-y-noticias`} className={styles.relacionadosBtn}>
                {blogPage.relacionadas_cta_ver_todas}
              </Link>
            )}
          </div>
          <div className={styles.relacionados}>
            {otrosArticulos.map((a) => {
              const desktopImage = a.imagen_banner_desktop ?? a.imagen_principal;
              const mobileImage = a.imagen_banner_mobile ?? desktopImage;

              return (
                <BlogCard
                  key={a.id}
                  titulo={a.titulo}
                  descripcion_corta={a.descripcion_corta}
                  href={`/${siteCode}/blog-y-noticias/${a.slug}`}
                  imagenUrl={desktopImage?.url ? getStrapiImageUrl(desktopImage.url) : undefined}
                  imagenMobileUrl={mobileImage?.url ? getStrapiImageUrl(mobileImage.url) : undefined}
                  ctaText={blogPage?.cta_cargar_mas ?? undefined}
                />
              );
            })}
          </div>
          <div className={styles.relacionadosCarousel}>
            <RelacionadosCarousel
              articulos={otrosArticulos}
              ctaVerTodas={blogPage?.relacionadas_cta_ver_todas}
            />
          </div>
        </div>
      )}

      <Subscribe
        title={blogPage?.newsletter_titulo ?? "¡No te pierdas ni un solo consejo!"}
        description={blogPage?.newsletter_descripcion ?? "Recibe en tu correo todos los tips de cocina y novedades."}
        placeholder={blogPage?.newsletter_placeholder}
        formulario_boton={blogPage?.newsletter_cta_texto}
      />
    </div>
  );
}
