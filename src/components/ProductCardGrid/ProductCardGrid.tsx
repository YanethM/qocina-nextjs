"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Producto } from "@/types";
import { getStrapiImageUrl } from "@/lib/strapi";
import { useSiteCode } from "@/hooks/useSiteCode";
import styles from "./ProductCardGrid.module.css";
import { formatPrice } from "@/lib/format";

const CARD_COLORS = [styles.cardGreen, styles.cardYellow, styles.cardRed];

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProductCardGrid({ productos, fewClass }: { productos: Producto[]; fewClass?: string }) {
  const siteCode = useSiteCode();

  useEffect(() => {
    if (typeof window === "undefined" || !window.cioanalytics) return;
    window.cioanalytics.track("Product List Viewed", {
      list_id: "productos",
      products: productos.map((p) => ({
        product_id: String(p.id),
        sku: p.sku ?? p.slug,
        name: p.nombre,
        category: p.categoria?.nombre ?? null,
        price: p.precio,
        image_url: p.imagen_principal?.url ?? null,
      })),
    });
  }, []);

  return (
    <div className={`${styles.grid} ${fewClass ?? ""}`}>
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
                  alt={producto.imagen_principal?.alternativeText ?? producto.nombre}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.cardImage}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              )}
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{toTitleCase(producto.nombre)}</h3>
              <p className={styles.cardPrice}>
                {formatPrice(producto.precio, producto.precio_moneda)}
              </p>
              <p className={styles.cardDescription}>{producto.descripcion_corta}</p>
              {producto.descripcion_larga && (
                <p className={styles.cardDescriptionLarga}>{producto.descripcion_larga}</p>
              )}
              <Link
                href={`/${siteCode}/productos/${producto.slug}`}
                className={styles.cardButton}
                onClick={() => {
                  if (typeof window !== "undefined" && window.cioanalytics) {
                    window.cioanalytics.track("Product Clicked", {
                      product_id: String(producto.id),
                      sku: producto.sku ?? producto.slug,
                      name: producto.nombre,
                      category: producto.categoria?.nombre ?? null,
                      price: producto.precio,
                      image_url: imagenUrl ?? null,
                      url: `/${siteCode}/productos/${producto.slug}`,
                    });
                  }
                }}>
                Añadir al carrito
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
