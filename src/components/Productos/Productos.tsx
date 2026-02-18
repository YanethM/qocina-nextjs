"use client";

import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import styles from "./Productos.module.css";

interface ProductosProps {
  productos: Producto[];
}

function getCardColor(index: number): string {
  const colorOrder = [styles.cardGreen, styles.cardYellow, styles.cardRed];
  return colorOrder[index % 3];
}

function formatPrice(precio: number, moneda: string): string {
  if (moneda === "PEN") {
    return `S/ ${precio.toFixed(2)}`;
  }
  return `$${precio.toFixed(2)} USD`;
}

export default function Productos({ productos }: ProductosProps) {
  if (productos.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>¡Atrévete hoy a disfrutar de la Q'ocina con Q!</h2>
      <div className={styles.grid}>
        {productos.map((producto, index) => (
          <Link
            key={producto.id}
            href={`/productos/${producto.documentId}`}
            className={`${styles.card} ${getCardColor(index)}`}
          >
            <div className={styles.imageWrapper}>
              {producto.imagen && (
                <Image
                  src={getStrapiImageUrl(producto.imagen.url)}
                  alt={producto.imagen.alternativeText || producto.nombre}
                  fill
                  style={{ objectFit: "contain" }}
                />
              )}
            </div>
            <h3 className={styles.nombre}>{producto.nombre}</h3>
            <p className={styles.precio}>
              {formatPrice(producto.precio, producto.precio_moneda)}
            </p>
            <p className={styles.descripcion}>{producto.descripcion_corta}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}