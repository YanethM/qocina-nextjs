"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/types";
import { getStrapiImageUrl } from "@/lib/strapi";
import { useCarousel } from "@/hooks/useCarousel";
import { useSiteCode } from "@/hooks/useSiteCode";
import styles from "./Productos.module.css";
import { formatPrice } from "@/lib/format";

interface ProductosProps {
  productos: Producto[];
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaNuevaVentana?: boolean;
  addToCartText?: string;
  className?: string;
}

const FALLBACK_COLORS = [styles.cardGreen, styles.cardYellow, styles.cardRed];

function getFallbackColor(index: number): string {
  return FALLBACK_COLORS[index % 3];
}

function isLightColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return true;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
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
  fallbackColorClass,
  priority = false,
  addToCartText = "Añadir al carrito",
}: {
  producto: Producto;
  fallbackColorClass: string;
  priority?: boolean;
  addToCartText?: string;
}) {
  const siteCode = useSiteCode();
  const apiColor = producto.color ?? null;
  const lightBg = apiColor ? isLightColor(apiColor) : fallbackColorClass === styles.cardYellow;
  const cardStyle = apiColor
    ? { background: apiColor, color: lightBg ? "#000000" : "#ffffff" }
    : undefined;
  const btnStyle = lightBg
    ? { backgroundColor: "#1a1a1a", color: "#ffffff" }
    : undefined;

  return (
    <Link
      href={`/${siteCode}/productos/${producto.slug}`}
      className={`${styles.card} ${apiColor ? "" : fallbackColorClass}`}
      style={cardStyle}
      onClick={() => {
        if (typeof window !== "undefined" && window.cioanalytics) {
          window.cioanalytics.track("Product Clicked", {
            product_id: String(producto.id),
            sku: producto.sku ?? producto.slug,
            name: producto.nombre,
            category: producto.categoria?.nombre ?? null,
            price: producto.precio,
            image_url: producto.imagen_principal?.url ?? null,
            url: `/${siteCode}/productos/${producto.slug}`,
          });
        }
      }}>
      <div className={styles.imageWrapper}>
        {producto.imagen_principal && (
          <Image
            src={getImageUrl(producto, "medium")}
            alt={producto.imagen_principal.alternativeText ?? producto.nombre ?? ""}
            fill
            sizes="(max-width: 640px) 245px, (max-width: 1024px) 500px, 424px"
            style={{ objectFit: "contain" }}
            priority={priority}
            unoptimized
          />
        )}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardText}>
          <h3 className={styles.nombre}>{toTitleCase(producto.nombre)}</h3>
          <p className={styles.precio}>
            {formatPrice(producto.precio, producto.precio_moneda)}
          </p>
          {producto.descripcion_corta && (
            <p className={styles.descripcion}>{producto.descripcion_corta}</p>
          )}
          {producto.descripcion_larga && (
            <div
              className={styles.descripcionLarga}
              dangerouslySetInnerHTML={{ __html: producto.descripcion_larga }}
            />
          )}
        </div>
        <button
          className={styles.addToCartBtn}
          style={btnStyle}>
          {addToCartText}
        </button>
      </div>
    </Link>
  );
}

const GAP = 16;

export default function Productos({
  productos,
  title,
  subtitle,
  description,
  ctaText,
  ctaUrl,
  ctaNuevaVentana,
  addToCartText,
  className,
}: ProductosProps) {
  const siteCode = useSiteCode();
  const resolvedCtaUrl = ctaUrl?.startsWith("/") ? `/${siteCode}${ctaUrl}` : ctaUrl;
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

  const isMobile = containerWidth > 0 && containerWidth <= 640;
  const slideWidth = isMobile
    ? containerWidth
    : containerWidth > 0
    ? Math.floor(containerWidth / 2 - GAP / 2)
    : 0;
  const translateX = current * (slideWidth + GAP);

  if (productos.length === 0) return null;

  return (
    <section className={`${styles.section}${className ? ` ${className}` : ``}`}>
      <div className={styles.header}>
        {title && <p className={styles.title}>{title}</p>}
        {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <div className={styles.grid}>
        {productos.map((producto, index) => (
          <CardItem
            key={producto.id}
            producto={producto}
            fallbackColorClass={getFallbackColor(index)}
            priority={index === 0}
            addToCartText={addToCartText}
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
              <CardItem producto={producto} fallbackColorClass={getFallbackColor(index)} priority={index === 0} addToCartText={addToCartText} />
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

      {resolvedCtaUrl && ctaText && (
        <div className={styles.verTodas}>
          <Link
            href={resolvedCtaUrl}
            className={styles.verTodasBtn}
            data-btn="dark"
            target={ctaNuevaVentana ? "_blank" : "_self"}
            rel={ctaNuevaVentana ? "noopener noreferrer" : undefined}>
            {ctaText}{" "}
            <Image
              src="/images/web/home/white_arrow_right.svg"
              alt=""
              width={20}
              height={20}
              style={{ height: "auto" }}
            />
          </Link>
        </div>
      )}
    </section>
  );
}
