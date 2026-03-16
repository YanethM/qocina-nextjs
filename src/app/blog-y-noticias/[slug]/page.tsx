import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArticuloMarkdown from "@/components/ArticuloMarkdown/ArticuloMarkdown";
import BlogCard from "@/components/BlogCard/BlogCard";
import RelacionadosCarousel from "@/components/RelacionadosCarousel/RelacionadosCarousel";
import Subscribe from "@/components/Subscribe/Subscribe";
import { getArticuloBySlug, getArticulos, getBlogPage, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArticuloDetailPage({ params }: Props) {
  const { slug } = await params;
  const [articulo, articulosRes, blogPageRes] = await Promise.all([
    getArticuloBySlug(slug).catch(() => null),
    getArticulos().catch(() => null),
    getBlogPage().catch(() => null),
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

  return (
    <div className={styles.page}>
      <div className={styles.portada}>
        {articulo.imagen_principal ? (
          <Image
            src={getStrapiImageUrl(articulo.imagen_principal.url)}
            alt={articulo.imagen_principal.alternativeText || articulo.titulo}
            fill
            className={styles.portadaImg}
            priority
            unoptimized
          />
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
              <Link href="/blog-y-noticias" className={styles.relacionadosBtn}>
                {blogPage.relacionadas_cta_ver_todas}
              </Link>
            )}
          </div>
          <div className={styles.relacionados}>
            {otrosArticulos.map((a) => (
              <BlogCard
                key={a.id}
                titulo={a.titulo}
                descripcion_corta={a.descripcion_corta}
                href={`/blog-y-noticias/${a.slug}`}
                imagenUrl={a.imagen_principal?.url ? getStrapiImageUrl(a.imagen_principal.url) : undefined}
              />
            ))}
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
