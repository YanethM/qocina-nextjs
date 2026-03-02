import Image from "next/image";
import Link from "next/link";
import type { PackDestacado } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import styles from "./PacksDestacados.module.css";

function formatPrice(precio: number, moneda: string): string {
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;
}

interface Props {
  packs: PackDestacado[];
}

export default function PacksDestacados({ packs }: Props) {
  const sorted = [...packs].sort((a, b) => a.orden - b.orden);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>¡Llévate tu pack favorito!</h2>

      <div className={styles.grid}>
        {sorted.map((pack, index) => {
          const isFeatured = index === 1;
          const imagenUrl = pack.imagen
            ? getStrapiImageUrl(pack.imagen.url)
            : null;
          const match = pack.nombre.match(/^(.+?)\s+(\d+)\s*$/);
          const prefix = match ? match[1] : pack.nombre;
          const number = match ? match[2] : null;
          const arrowSrc = isFeatured
            ? "/images/web/home/white_arrow_right.png"
            : "/images/web/home/arrow_right.svg";

          return (
            <div
              key={pack.id}
              className={`${styles.card} ${isFeatured ? styles.cardFeatured : ""}`}>
              {/* Imagen — 424×290, sobresale 174px sobre el card */}
              <div className={styles.imageWrapper}>
                {imagenUrl && (
                  <Image
                    src={imagenUrl}
                    alt={pack.nombre}
                    fill
                    sizes="(max-width: 768px) 90vw, 424px"
                    style={{ objectFit: "contain" }}
                    className={styles.image}
                  />
                )}

                {/* Badge de descuento */}
                <div className={styles.discountBadge}>
                  <span className={styles.discountPercent}>50%</span>
                  <span className={styles.discountLabel}>dto</span>
                </div>
              </div>

              {/* Cuerpo de la card */}
              <div className={styles.cardBody}>
                <h3 className={styles.packName}>
                  {prefix}{" "}
                  {number && (
                    <span
                      className={`${styles.numberBadge} ${isFeatured ? styles.numberBadgeFeatured : ""}`}>
                      {number}
                    </span>
                  )}
                </h3>

                <p className={styles.price}>
                  {formatPrice(pack.precio, pack.precio_moneda)}
                </p>

                <p className={styles.descripcion}>{pack.descripcion}</p>

                <div className={styles.actions}>
                  <button
                    className={`${styles.btnPrimary} ${isFeatured ? styles.btnPrimaryFeatured : ""}`}>
                    Añadir al carrito
                  </button>
                  <Link
                    href={`/productos/${pack.documentId}`}
                    className={`${styles.btnSecondary} ${isFeatured ? styles.btnSecondaryFeatured : ""}`}>
                    Más información
                    <Image
                      src={arrowSrc}
                      alt=""
                      width={24}
                      height={24}
                      className={styles.btnArrow}
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
