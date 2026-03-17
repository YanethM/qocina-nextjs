import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPack, getStrapiImageUrl } from "@/lib/api";
import PackDetailClient from "@/components/PackDetail/PackDetailClient";
import styles from "./page.module.css";

const CARD_COLORS = [
  styles.productoCardGreen,
  styles.productoCardYellow,
  styles.productoCardRed,
];

export default async function PackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPack(slug).catch(() => null);

  if (!result?.pack) notFound();

  const { pack, mostrarDescuento, porcentajeDescuento } = result;
  const imagenUrl = pack.imagen ? getStrapiImageUrl(pack.imagen.url) : null;
  const productos = pack.productos ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {imagenUrl && (
            <div className={styles.heroImageWrapper}>
              <Image
                src={imagenUrl}
                alt={pack.nombre}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 80vw, 400px"
                unoptimized
              />
            </div>
          )}
          <PackDetailClient
            id={pack.id}
            documentId={pack.documentId}
            slug={pack.slug}
            nombre={pack.nombre}
            descripcion={pack.descripcion}
            precio={pack.precio}
            precioMoneda={pack.precio_moneda}
            sku={pack.sku}
            imagen={imagenUrl}
            mostrarDescuento={mostrarDescuento}
            porcentajeDescuento={porcentajeDescuento}
          />
        </div>
      </section>

      {productos.length > 0 && (
        <section className={styles.productosSection}>
          <h2 className={styles.productosTitle}>
            Productos incluidos en este pack
          </h2>
          <div className={styles.productosGrid}>
            {productos.map((producto, index) => {
              const colorClass = CARD_COLORS[index % 3];
              const prodImagenUrl = producto.imagen_principal
                ? getStrapiImageUrl(producto.imagen_principal.url)
                : null;
              return (
                <div
                  key={producto.id}
                  className={`${styles.productoCard} ${colorClass}`}>
                  <div className={styles.productoImageWrapper}>
                    {prodImagenUrl && (
                      <Image
                        src={prodImagenUrl}
                        alt={
                          producto.imagen_principal?.alternativeText ??
                          producto.nombre
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.productoImage}
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    )}
                  </div>
                  <div className={styles.productoBody}>
                    <h3 className={styles.productoNombre}>{producto.nombre}</h3>
                    <p className={styles.productoDesc}>
                      {producto.descripcion_corta}
                    </p>
                    {producto.presentacion && (
                      <p className={styles.productoPresentacion}>
                        {producto.presentacion}
                      </p>
                    )}
                    <Link
                      href={`/productos/${producto.slug}`}
                      className={styles.productoBtn}>
                      Ver producto
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
