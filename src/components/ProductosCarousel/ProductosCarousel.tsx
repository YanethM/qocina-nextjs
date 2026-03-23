"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { Producto } from "@/types";
import styles from "./ProductosCarousel.module.css";

const CARD_COLORS = [styles.cardGreen, styles.cardYellow, styles.cardRed];
const ITEMS_PER_PAGE = 3;

function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;
}

export default function ProductosCarousel({
  productos,
}: {
  productos: Producto[];
}) {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
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
                  href={`/productos/${producto.slug}`}
                  className={styles.cardButton}>
                  Añadir al carrito
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
