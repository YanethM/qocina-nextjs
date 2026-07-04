"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Badge, Categoria } from "@/types";
import { DEFAULT_COLOR } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/hooks/useLocale";
import Accordion from "@/components/Accordion/Accordion";
import styles from "./ProductoDetailClient.module.css";
import { formatPrice } from "@/lib/format";

const translations = {
  es: { addToCart: "Añadir al carrito" },
  en: { addToCart: "Add to cart" },
};

interface Props {
  id: number;
  documentId: string;
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string | null;
  presentacion: string | null;
  rinde: string | null;
  precio: number;
  precioMoneda: string;
  allImages: string[];
  imagenPrincipal: string | null;
  categoria: Categoria | null;
  badges: Badge[];
  sku: string | null;
  color?: string | null;
}

export default function ProductoDetailClient({
  id,
  documentId,
  slug,
  nombre,
  descripcionCorta,
  descripcionLarga,
  presentacion,
  rinde,
  precio,
  precioMoneda,
  allImages,
  imagenPrincipal,
  categoria,
  badges,
  sku,
  color,
}: Props) {
  const { addItem } = useCart();
  const locale = useLocale();
  const t = translations[locale];
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.cioanalytics) return;
    window.cioanalytics.track("Product Viewed", {
      product_id: String(id),
      sku: sku ?? slug,
      name: nombre,
      category: categoria?.nombre ?? null,
      price: precio,
      currency: precioMoneda,
      brand: "QCocina",
      quantity: 1,
      image_url: imagenPrincipal ?? null,
      url: typeof window !== "undefined" ? window.location.href : null,
      value: precio,
    });
  }, []);
  const [fading, setFading] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [cantidad, setCantidad] = useState(1);

  const changeImage = (i: number) => {
    if (i === selectedImg) return;
    setFading(true);
    setTimeout(() => {
      setSelectedImg(i);
      setFading(false);
    }, 180);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };
  const titleColor = color ?? DEFAULT_COLOR;
  const totalPrice = precio * cantidad;

  return (
    <div className={styles.grid}>
      <div className={styles.imageSection}>
        <div
          className={styles.mainImageWrapper}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <div
            className={styles.zoomInner}
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: zoom ? "scale(2)" : "scale(1)",
              transition: zoom ? "transform 0.1s ease" : "transform 0.3s ease",
            }}
          >
            {allImages[selectedImg] && (
              <Image
                src={allImages[selectedImg]}
                alt={nombre}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                quality={90}
                className={fading ? styles.imgFadeOut : styles.imgFadeIn}
              />
            )}
          </div>
        </div>

        {allImages.length > 1 && (
          <div className={styles.thumbnails}>
            {allImages.map((img, i) => (
              <button
                key={i}
                className={`${styles.thumbnail} ${i === selectedImg ? styles.thumbnailActive : ""}`}
                onClick={() => changeImage(i)}
                aria-label={`Ver imagen ${i + 1}`}
                style={{ borderColor: i === selectedImg ? titleColor : "transparent" }}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="80px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.infoSection}>
        <h1 className={styles.title} style={{ color: titleColor }}>
          {nombre.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
        {descripcionLarga && (
          <div
            className={styles.descripcion}
            dangerouslySetInnerHTML={{ __html: descripcionLarga }}
          />
        )}

        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Cantidad:</span>
          <div className={styles.quantitySelector}>
            <button
              className={styles.quantityBtn}
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              aria-label="Reducir cantidad"
            >
              <Image
                src="/images/web/products/product_detail/menos.svg"
                alt=""
                width={24}
                height={24}
                className={styles.quantityIcon}
                aria-hidden
              />
            </button>
            <span className={styles.quantityValue}>{cantidad}</span>
            <button
              className={styles.quantityBtn}
              onClick={() => setCantidad(cantidad + 1)}
              aria-label="Aumentar cantidad"
            >
              <Image
                src="/images/web/products/product_detail/mas.svg"
                alt=""
                width={24}
                height={24}
                className={styles.quantityIcon}
                aria-hidden
              />
            </button>
          </div>
        </div>

        <div className={styles.details}>
          {presentacion && (
            <p className={styles.detail}>
              <strong>Presentación</strong>: {presentacion}
            </p>
          )}
          {rinde && (
            <p className={styles.detail}>
              <strong>Rinde</strong>: {rinde}
            </p>
          )}
          <p className={styles.detail}>
            <strong>Precio</strong>: {formatPrice(totalPrice, precioMoneda)}
          </p>
        </div>

        <Accordion
          items={[
            ...(descripcionLarga
              ? [{
                  key: "uso",
                  label: "¿Cómo se usa este sofrito?",
                  content: <div dangerouslySetInnerHTML={{ __html: descripcionLarga }} />,
                }]
              : []),
            ...(badges.length > 0
              ? [{
                  key: "beneficios",
                  label: "Beneficios que se sienten en el paladar de toda la familia",
                  content: (
                    <ul className={styles.beneficiosList}>
                      {badges.map((b) => (
                        <li key={b.id}>{b.nombre}</li>
                      ))}
                    </ul>
                  ),
                }]
              : []),
          ]}
        />

        <button
          className={styles.addToCart}
          onClick={() =>
            addItem(
              {
                id,
                documentId,
                slug,
                nombre,
                descripcionCorta,
                precio,
                precioMoneda,
                imagen: imagenPrincipal,
                sku: sku ?? null,
                categoria: categoria?.nombre ?? null,
                color: color ?? null,
              },
              cantidad
            )
          }
        >
          {t.addToCart}
        </button>
      </div>
    </div>
  );
}
