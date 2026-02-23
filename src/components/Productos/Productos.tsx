"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import { useCarousel } from "@/hooks/useCarousel";
import styles from "./Productos.module.css";

interface ProductosProps {
  productos: Producto[];
  ctaText?: string;
  ctaUrl?: string;
  ctaNuevaVentana?: boolean;
}

function getCardColor(index: number): string {
  const colorOrder = [styles.cardGreen, styles.cardYellow, styles.cardRed];
  return colorOrder[index % 3];
}

function formatPrice(precio: number, moneda: string): string {
  if (moneda === "PEN") {
    return `S/ ${precio.toFixed(2)}`;
  }
  return `${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;
}

function getImageUrl(
  producto: Producto,
  format: "small" | "medium" | "thumbnail",
): string {
  if (producto.imagen_principal?.formats?.[format]?.url) {
    return getStrapiImageUrl(producto.imagen_principal.formats[format].url);
  }
  return getStrapiImageUrl(producto.imagen_principal?.url || "");
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
      href={`/home-page/productos_destacados/${producto.documentId}`}
      className={`${styles.card} ${colorClass}`}>
      <div className={styles.imageWrapper}>
        {producto.imagen_principal && (
          <Image
            src={getImageUrl(producto, "medium")}
            alt={producto.imagen_principal.alternativeText ?? producto.nombre ?? ""}
            fill
            sizes="(max-width: 640px) 245px, (max-width: 1024px) 500px, 424px"
            style={{ objectFit: "contain" }}
            priority
          />
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.nombre}>{producto.nombre}</h3>
        <p className={styles.precio}>
          {formatPrice(producto.precio, producto.precio_moneda)}
        </p>
        {producto.presentacion && (
          <p className={styles.presentacion}>{producto.presentacion}</p>
        )}
        <p className={styles.descripcion}>{producto.descripcion_corta}</p>
        <button
          className={styles.addToCartBtn}
          onClick={(e) => {
            e.preventDefault();
            console.log("Añadir al carrito:", producto.nombre);
          }}>
          Añadir al carrito
        </button>
      </div>
    </Link>
  );
}

const PEEK = 44;
const GAP = 12;

export default function Productos({
  productos,
  ctaText = "Ver todos los productos",
  ctaUrl = "/productos",
  ctaNuevaVentana = false,
}: ProductosProps) {
  const { current, goTo, handleTouchStart, handleTouchEnd } = useCarousel(
    productos.length,
  );
  const carouselRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const slideWidth = containerWidth > 0 ? containerWidth - PEEK : 0;
  const translateX = current * (slideWidth + GAP);

  if (productos.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          ¡Atrévete hoy a disfrutar de la Q&apos;ocina con Q!
        </h2>
      </div>

      <div className={styles.grid}>
        {productos.map((producto, index) => (
          <CardItem
            key={producto.id}
            producto={producto}
            colorClass={getCardColor(index)}
          />
        ))}
      </div>

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

      <div className={styles.verTodas}>
        <Link
          href={ctaUrl}
          className={styles.verTodasBtn}
          target={ctaNuevaVentana ? "_blank" : "_self"}
          rel={ctaNuevaVentana ? "noopener noreferrer" : undefined}>
          {ctaText}{" "}
          <Image
            src="/images/web/home/white_arrow_right.png"
            alt=""
            width={20}
            height={20}
            style={{ height: "auto" }}
          />
        </Link>
      </div>
    </section>
  );
}
