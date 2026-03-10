import { notFound } from "next/navigation";
import Image from "next/image";
import ArticuloMarkdown from "@/components/ArticuloMarkdown/ArticuloMarkdown";
import BlogCard from "@/components/BlogCard/BlogCard";
import Subscribe from "@/components/Subscribe/Subscribe";
import { getArticuloBySlug, getArticulos, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArticuloDetailPage({ params }: Props) {
  const { slug } = await params;
  const [articulo, articulosRes] = await Promise.all([
    getArticuloBySlug(slug).catch(() => null),
    getArticulos().catch(() => null),
  ]);

  if (!articulo) notFound();

  const otrosArticulos = (articulosRes?.data ?? [])
    .filter((a) => a.slug !== slug)
    .sort((a, b) => a.orden - b.orden);

  return (
    <div className={styles.page}>
      <div className={styles.portada}>
        {articulo.imagen ? (
          <Image
            src={getStrapiImageUrl(articulo.imagen.url)}
            alt={articulo.imagen.alternativeText || articulo.titulo}
            fill
            className={styles.portadaImg}
            priority
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

          {otrosArticulos.length > 0 && (
            <div className={styles.relacionados}>
              {otrosArticulos.map((a) => (
                <BlogCard
                  key={a.id}
                  titulo={a.titulo}
                  descripcion_corta={a.descripcion_corta}
                  href={`/blog-y-noticias/${a.slug}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Subscribe
        title="¡No te pierdas ni un solo consejo!"
        description="Recibe en tu correo todos los tips de cocina y novedades. Además, si te suscribes ahora, obtendrás un 10% de descuento en tu próxima compra"
      />
    </div>
  );
}
