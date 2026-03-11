"use client";

import { useState } from "react";
import Image from "next/image";
import type { Badge, Categoria } from "@/types";
import { COLOR_MAP } from "@/lib/constants";
import Accordion from "@/components/Accordion/Accordion";
import styles from "./ProductoDetailClient.module.css";

const PACK_SIZES = [
  { label: "Unidad", multiplier: 1 },
  { label: "Pack 3", multiplier: 3 },
  { label: "Pack 6", multiplier: 6 },
  { label: "Pack 12", multiplier: 12 },
];

function formatPrice(precio: number, moneda: string): string {
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;
}

function getTitleColor(nombre: string, categoriaSlug: string | null): string {
  const text = `${nombre} ${categoriaSlug ?? ""}`.toLowerCase();
  if (text.includes("roj")) return COLOR_MAP.rojo;
  if (text.includes("verd")) return COLOR_MAP.verde;
  if (text.includes("amarill")) return "#CE171C";
  return COLOR_MAP.rojo;
}

interface Props {
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string | null;
  presentacion: string | null;
  rinde: string | null;
  precio: number;
  precioMoneda: string;
  allImages: string[];
  categoria: Categoria | null;
  badges: Badge[];
}

export default function ProductoDetailClient({
  nombre,
  descripcionCorta,
  descripcionLarga,
  presentacion,
  rinde,
  precio,
  precioMoneda,
  allImages,
  categoria,
  badges,
}: Props) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [packSize, setPackSize] = useState("Unidad");
  const titleColor = getTitleColor(nombre, categoria?.slug ?? null);
  const selectedMultiplier =
    PACK_SIZES.find((p) => p.label === packSize)?.multiplier ?? 1;
  const totalPrice = precio * cantidad * selectedMultiplier;

  return (
    <div className={styles.grid}>
      <div className={styles.imageSection}>
        <div className={styles.mainImageWrapper}>
          {allImages[selectedImg] && (
            <Image
              src={allImages[selectedImg]}
              alt={nombre}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
          )}
        </div>

        {allImages.length > 1 && (
          <div className={styles.thumbnails}>
            {allImages.map((img, i) => (
              <button
                key={i}
                className={`${styles.thumbnail} ${i === selectedImg ? styles.thumbnailActive : ""}`}
                onClick={() => setSelectedImg(i)}
                aria-label={`Ver imagen ${i + 1}`}
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
          {nombre}
        </h1>
        <p className={styles.descripcion}>{descripcionCorta}</p>

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

        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Tamaño del paquete:</span>
          <div className={styles.packSelector}>
            {PACK_SIZES.map((p) => (
              <button
                key={p.label}
                className={`${styles.packBtn} ${packSize === p.label ? styles.packBtnActive : ""}`}
                onClick={() => setPackSize(p.label)}
              >
                <Image
                  src="/images/web/products/product_detail/pack_image.svg"
                  alt=""
                  width={28}
                  height={30}
                  className={styles.packIcon}
                  aria-hidden
                />
                <span className={styles.packLabel}>{p.label}</span>
              </button>
            ))}
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
                  content: <p style={{ whiteSpace: "pre-wrap" }}>{descripcionLarga}</p>,
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

        <button className={styles.addToCart}>Añadir al carrito</button>
      </div>
    </div>
  );
}
