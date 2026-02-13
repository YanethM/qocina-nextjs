import Link from "next/link";
import Image from "next/image";
import {
  getArticulos,
  getBlogPage,
  getCategoriasBlog,
  getStrapiImageUrl,
} from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
  title: "Blog - Q'ocina",
  description: "Artículos, tips y novedades de Q'ocina",
};

export default async function BlogListPage() {
  const [pageRes, articulosRes, categoriasRes] = await Promise.all([
    getBlogPage().catch(() => null),
    getArticulos().catch(() => null),
    getCategoriasBlog().catch(() => null),
  ]);

  const pageData = pageRes?.data;
  const articulos = articulosRes?.data ?? [];
  const categorias = categoriasRes?.data ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>{pageData?.titulo || "Blog"}</h1>
        <p className={styles.subtitle}>
          {pageData?.descripcion || "Artículos, tips y novedades"}
        </p>
      </section>

      {categorias.length > 0 && (
        <section className={styles.categories}>
          <div className={styles.categoryList}>
            {categorias.map((cat) => (
              <span key={cat.id} className={styles.categoryTag}>
                {cat.nombre}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className={styles.content}>
        <div className={styles.grid}>
          {articulos.map((articulo) => (
            <Link
              key={articulo.id}
              href={`/blog/${articulo.documentId}`}
              className={styles.card}
            >
              <div className={styles.cardImage}>
                {articulo.imagen && (
                  <Image
                    src={getStrapiImageUrl(articulo.imagen.url)}
                    alt={articulo.imagen.alternativeText || articulo.titulo}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className={styles.cardBody}>
                {articulo.categoria_blog && (
                  <span className={styles.cardCategory}>
                    {articulo.categoria_blog.nombre}
                  </span>
                )}
                <h3 className={styles.cardTitle}>{articulo.titulo}</h3>
                <p className={styles.cardDescription}>
                  {articulo.descripcion}
                </p>
                <div className={styles.cardMeta}>
                  {articulo.fecha && (
                    <span>
                      {new Date(articulo.fecha).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {articulo.autor && <span>Por {articulo.autor}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
