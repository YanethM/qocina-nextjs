import Link from "next/link";
import Image from "next/image";
import {
  getProductos,
  getProductosPage,
  getCategorias,
  getStrapiImageUrl,
} from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
  title: "Productos - Q'ocina",
  description: "Explora nuestra variedad de productos artesanales",
};

export default async function ProductosPage() {
  const [pageRes, productosRes, categoriasRes] = await Promise.all([
    getProductosPage().catch(() => null),
    getProductos().catch(() => null),
    getCategorias().catch(() => null),
  ]);

  const pageData = pageRes?.data;
  const productos = productosRes?.data ?? [];
  const categorias = categoriasRes?.data ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          {pageData?.titulo || "Nuestros Productos"}
        </h1>
        <p className={styles.subtitle}>
          {pageData?.descripcion ||
            "Explora nuestra variedad de productos artesanales"}
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
          {productos.map((producto) => (
            <Link
              key={producto.id}
              href={`/productos/${producto.documentId}`}
              className={styles.card}
            >
              <div className={styles.cardImage}>
                {producto.imagen && (
                  <Image
                    src={getStrapiImageUrl(producto.imagen.url)}
                    alt={
                      producto.imagen.alternativeText || producto.nombre
                    }
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{producto.nombre}</h3>
                <p className={styles.cardDescription}>
                  {producto.descripcion}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
