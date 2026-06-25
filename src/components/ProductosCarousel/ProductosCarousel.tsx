"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { Producto } from "@/types";
import { useSiteCode } from "@/hooks/useSiteCode";
import { useLocale } from "@/hooks/useLocale";
import styles from "./ProductosCarousel.module.css";
import { formatPrice } from "@/lib/format";

const translations = {
  es: { addToCart: "Añadir al carrito" },
  en: { addToCart: "Add to cart" },
};

const CARD_COLORS = [styles.cardGreen, styles.cardYellow, styles.cardRed];
const ITEMS_PER_PAGE = 3;

export default function ProductosCarousel({
  productos,
}: {
  productos: Producto[];
}) {
  const siteCode = useSiteCode();
  const locale = useLocale();
  const t = translations[locale];
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");

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
  const totalPages = Math.ceil(productos.length / ITEMS_PER_PAGE);

  const go = (newPage: number) => {
    setDir(newPage > page ? "next" : "prev");
    setPage(newPage);
  };

  const visible = productos.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  return (
    <div className={styles.wrapper}>
      <div
        key={page}
        className={`${styles.grid} ${dir === "next" ? styles.slideInRight : styles.slideInLeft}`}>
        {visible.map((producto, index) => {
          const globalIndex = page * ITEMS_PER_PAGE + index;
          const colorClass = CARD_COLORS[globalIndex % 3];
          const imagenUrl = producto.imagen_principal?.url
            ? getStrapiImageUrl(producto.imagen_principal.url)
            : null;

          return (
            <div
              key={producto.id}
              className={`${styles.card} ${colorClass}`}>
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
                    unoptimized
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
                  {t.addToCart}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.nav}>
        <button
          className={styles.navBtn}
          onClick={() => go(page - 1)}
          disabled={page === 0}
          aria-label="Anterior">
          ‹
        </button>

        <div className={styles.dots}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === page ? styles.dotActive : ""}`}
              onClick={() => go(i)}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>

        <button
          className={styles.navBtn}
          onClick={() => go(page + 1)}
          disabled={page === totalPages - 1}
          aria-label="Siguiente">
          ›
        </button>
      </div>
    </div>
  );
}
