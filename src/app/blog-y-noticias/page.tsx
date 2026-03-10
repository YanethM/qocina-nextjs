import Image from "next/image";
import PageHero from "@/components/PageHero/PageHero";
import BlogCard from "@/components/BlogCard/BlogCard";
import Subscribe from "@/components/Subscribe/Subscribe";
import { getBlogPage, getArticulos } from "@/lib/api";
import styles from "./page.module.css";

export default async function BlogYNoticiasPage() {
  const [pageRes, articulosRes] = await Promise.all([
    getBlogPage().catch(() => null),
    getArticulos().catch(() => null),
  ]);

  const pageData = pageRes?.data;
  const articulos = (articulosRes?.data ?? []).sort(
    (a, b) => a.orden - b.orden
  );

  return (
    <>
      <PageHero backgroundAlt="Blog y Noticias">
        <div className={styles.heroLogoWrapper}>
          <Image
            src="/images/web/noticias/blog_logo.svg"
            alt="Blog y Noticias"
            width={400}
            height={200}
            className={styles.heroLogo}
            style={{ height: "auto" }}
            priority
          />
        </div>
      </PageHero>

      <section className={styles.publicacionesSection}>
        <h2 className={styles.publicacionesTitulo}>
          {pageData?.publicaciones_titulo || "Últimas publicaciones"}
        </h2>

        <div className={styles.cardsGrid}>
          {articulos.map((articulo) => (
            <BlogCard
              key={articulo.id}
              titulo={articulo.titulo}
              descripcion_corta={articulo.descripcion_corta}
              href={`/blog-y-noticias/${articulo.slug}`}
            />
          ))}
        </div>
      </section>

      <Subscribe
        title="¿Te falta inspiración para cocinar hoy?"
        description="Únete a nuestra comunidad y recibe recetas fáciles, consejos prácticos y 10% de descuento en tu próxima compra."
      />
    </>
  );
}
