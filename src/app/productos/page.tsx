import Link from "next/link";
import Image from "next/image";
import { getProductos, getProductosPage, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";
import ProductosNuestroSecreto from "@/components/ProductosNuestroSecreto/ProductosNuestroSecreto";

export const metadata = {
  title: "Productos - Q'ocina",
  description: "Explora nuestra variedad de productos artesanales",
};

const CARD_COLORS = [styles.cardGreen, styles.cardYellow, styles.cardRed];

function formatPrice(precio: number, moneda: string): string {
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;
}

export default async function ProductosPage() {
  const [, productosRes] = await Promise.all([
    getProductosPage().catch(() => null),
    getProductos().catch(() => null),
  ]);

  const productos = productosRes?.data ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/web/products/container.svg"
          alt="Productos Q'ocina"
          fill
          className={styles.heroImage}
          style={{ objectFit: "cover" }}
          priority
        />
      </section>

      <section className={styles.content}>
        <h2 className={styles.sectionTitle}>
          ¡Atrévete hoy a disfrutar de la Q&apos;ocina con Q!
        </h2>
        <div className={styles.grid}>
          {productos.map((producto, index) => {
            const colorClass = CARD_COLORS[index % 3];
            const imagenUrl = producto.imagen_principal
              ? getStrapiImageUrl(producto.imagen_principal.url)
              : null;

            return (
              <div key={producto.id} className={`${styles.card} ${colorClass}`}>
                <div className={styles.cardImageWrapper}>
                  {imagenUrl && (
                    <Image
                      src={imagenUrl}
                      alt={
                        producto.imagen_principal?.alternativeText ??
                        producto.nombre
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.cardImage}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{producto.nombre}</h3>
                  <p className={styles.cardPrice}>
                    {formatPrice(producto.precio, producto.precio_moneda)}
                  </p>
                  {producto.presentacion && (
                    <p className={styles.cardPresentacion}>
                      {producto.presentacion}
                    </p>
                  )}
                  <p className={styles.cardDescription}>
                    {producto.descripcion_corta}
                  </p>
                  <Link
                    href={`/productos/${producto.documentId}`}
                    className={styles.cardButton}>
                    Añadir al carrito
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ProductosNuestroSecreto />

      <section className={styles.paraQuien}>
        <Image
          src="/images/web/products/para_quien.svg"
          alt="¿Para quién es Q'ocina?"
          width={1440}
          height={900}
          style={{ width: "100%", height: "auto" }}
        />
      </section>
    </div>
  );
}
