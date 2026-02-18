"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

function CardItem({
  producto,
  colorClass,
}: {
  producto: Producto;
  colorClass: string;
}) {
  return (
    <Link
      href={`/productos/${producto.documentId}`}
      className={`${styles.card} ${colorClass}`}>
      <div className={styles.imageWrapper}>
        {producto.imagen && (
          <Image
            src={getStrapiImageUrl(producto.imagen.url)}
            alt={producto.imagen.alternativeText ?? producto.nombre}
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
  );
}

const PEEK = 44; // px del siguiente card visibles
const GAP = 12; // gap entre slides

export default function Productos({ productos }: ProductosProps) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Medir el ancho del contenedor para calcular la traducción exacta
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % productos.length);
    }, 3500);
  }, [productos.length]);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  const goTo = (i: number) => {
    setCurrent(i);
    startInterval();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goTo((current + 1) % productos.length);
      } else {
        goTo((current - 1 + productos.length) % productos.length);
      }
    }
    touchStartX.current = null;
  };

  const slideWidth = containerWidth > 0 ? containerWidth - PEEK : 0;
  const translateX = current * (slideWidth + GAP);

  if (productos.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        ¡Atrévete hoy a disfrutar de la Q&apos;ocina con Q!
      </h2>

      {/* Desktop: grid */}
      <div className={styles.grid}>
        {productos.map((producto, index) => (
          <CardItem
            key={producto.id}
            producto={producto}
            colorClass={getCardColor(index)}
          />
        ))}
      </div>

      {/* Mobile: carrusel con peek */}
      <div
        ref={carouselRef}
        className={styles.carousel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${translateX}px)` }}>
          {productos.map((producto, index) => (
            <div key={producto.id} className={styles.slide}>
              <CardItem producto={producto} colorClass={getCardColor(index)} />
            </div>
          ))}
        </div>

        <div className={styles.dotsRow}>
          {productos.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Producto ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
