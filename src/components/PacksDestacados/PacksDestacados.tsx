"use client";

import Image from "next/image";
import Link from "next/link";
import type { PackDestacado } from "@/types";
import { getStrapiImageUrl } from "@/lib/strapi";
import { useSiteCode } from "@/hooks/useSiteCode";
import AddPackToCartButton from "./AddPackToCartButton";
import styles from "./PacksDestacados.module.css";
import { formatPrice } from "@/lib/format";

interface Props {
  packs: PackDestacado[];
  titulo?: string | null;
  mostrarDescuento?: boolean;
  porcentajeDescuento?: number | null;
}

export default function PacksDestacados({
  packs,
  titulo,
  mostrarDescuento = false,
  porcentajeDescuento,
}: Props) {
  const siteCode = useSiteCode();
  const sorted = [...packs].sort((a, b) => a.orden - b.orden);

  return (
    <section className={styles.section}>
      {titulo && <h2 className={styles.title}>{titulo}</h2>}

      <div
        className={`${styles.grid} ${
          sorted.length <= 2 ? styles.gridFew : ""
        }`}>
        {sorted.map((pack, index) => {
          const isFeatured = index === 1;
          const imagenUrl = pack.imagen
            ? getStrapiImageUrl(pack.imagen.url)
            : null;
          const match = pack.nombre.match(/^(.+?)\s+(\d+)\s*$/);
          const prefix = match ? match[1] : pack.nombre;
          const number = match ? match[2] : null;
          const arrowSrc = isFeatured
            ? "/images/web/home/white_arrow_right.svg"
            : "/images/web/home/arrow_right.svg";

          return (
            <div
              key={pack.id}
              className={`${styles.card} ${isFeatured ? styles.cardFeatured : ""}`}>
              <div className={styles.imageWrapper}>
                {imagenUrl && (
                  <Image
                    src={imagenUrl}
                    alt={pack.nombre}
                    fill
                    sizes="(max-width: 768px) 90vw, 424px"
                    style={{ objectFit: "contain" }}
                    className={styles.image}
                    unoptimized
                  />
                )}

                {mostrarDescuento && porcentajeDescuento && (
                  <div className={styles.discountBadge}>
                    <span className={styles.discountPercent}>{porcentajeDescuento}%</span>
                    <span className={styles.discountLabel}>dto</span>
                  </div>
                )}
              </div>

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

                <p className={styles.packSlug}>{pack.slug}</p>

                <p className={styles.descripcion}>{pack.descripcion}</p>

                <div className={styles.actions}>
                  <AddPackToCartButton
                    id={pack.id}
                    documentId={pack.documentId}
                    slug={pack.slug}
                    nombre={pack.nombre}
                    descripcion={pack.descripcion}
                    precio={pack.precio}
                    precioMoneda={pack.precio_moneda}
                    imagen={imagenUrl}
                    sku={pack.sku ?? null}
                    className={`${styles.btnPrimary} ${isFeatured ? styles.btnPrimaryFeatured : ""}`}
                  />
                  <Link
                    href={`/${siteCode}/packs/${pack.slug}`}
                    className={`${styles.btnSecondary} ${isFeatured ? styles.btnSecondaryFeatured : ""}`}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.cioanalytics) {
                        window.cioanalytics.track("Product Clicked", {
                          product_id: String(pack.id),
                          sku: pack.sku ?? pack.slug,
                          name: pack.nombre,
                          category: null,
                          price: pack.precio,
                          image_url: imagenUrl ?? null,
                          url: `/${siteCode}/packs/${pack.slug}`,
                        });
                      }
                    }}>
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
