"use client";

import { useState } from "react";
import Image from "next/image";
import type { Producto } from "@/types";
import { useCart } from "@/context/CartContext";
import Accordion from "@/components/Accordion/Accordion";
import styles from "./PackDetailClient.module.css";

function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;
}

interface Props {
  id: number;
  documentId: string;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioMoneda: string;
  sku: string | null;
  imagen: string | null;
  mostrarDescuento: boolean;
  porcentajeDescuento: number | null;
  productos?: Producto[];
  firstProduct?: Producto | null;
}

export default function PackDetailClient({
  id,
  documentId,
  slug,
  nombre,
  descripcion,
  precio,
  precioMoneda,
  imagen,
  mostrarDescuento,
  porcentajeDescuento,
  productos = [],
  firstProduct,
}: Props) {
  const { addItem } = useCart();
  const [cantidad, setCantidad] = useState(1);

  const precioConDescuento =
    mostrarDescuento && porcentajeDescuento
      ? precio * (1 - porcentajeDescuento / 100)
      : null;
  const precioFinal = precioConDescuento ?? precio;
  const totalPrice = precioFinal * cantidad;

  const packNumber = nombre.match(/\d+/)?.[0] ?? null;
  const packPrefix = packNumber ? nombre.replace(/\s*\d+\s*$/, "").trim() : nombre;

  const contenidoMap = new Map<string, number>();
  productos.forEach((p) => {
    contenidoMap.set(p.nombre, (contenidoMap.get(p.nombre) ?? 0) + 1);
  });
  const contenido = Array.from(contenidoMap.entries())
    .map(([n, c]) => `${c} ${n}`)
    .join(", ");

  const productRef = firstProduct ?? productos[0] ?? null;
  const presentacion = productRef?.presentacion ?? null;
  const rinde = productRef?.rinde ?? null;
  const descripcionLarga = productRef?.descripcion_larga ?? null;
  const badges = productRef?.badges ?? [];

  return (
    <div className={styles.infoSection}>
      <h1 className={styles.title}>
        {packPrefix}{" "}
        {packNumber && <span className={styles.numberBadge}>{packNumber}</span>}
      </h1>
      <p className={styles.descripcion}>{descripcion}</p>

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
          <button className={`${styles.packBtn} ${styles.packBtnActive}`}>
            <Image
              src="/images/web/products/product_detail/pack_image.svg"
              alt=""
              width={28}
              height={30}
              className={styles.packIcon}
              aria-hidden
            />
            <span className={styles.packLabel}>{nombre}</span>
          </button>
        </div>
      </div>

      <div className={styles.details}>
        {contenido && (
          <p className={styles.detail}>
            <strong>Contenido del Pack</strong>: ({contenido})
          </p>
        )}
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

      {precioConDescuento !== null && (
        <div className={styles.priceRow}>
          <span className={styles.priceOriginal}>
            {formatPrice(precio * cantidad, precioMoneda)}
          </span>
          <div className={styles.priceRight}>
            <span className={styles.price}>
              {formatPrice(totalPrice, precioMoneda)}
            </span>
            {mostrarDescuento && porcentajeDescuento && (
              <div className={styles.discountBadge}>
                <span className={styles.discountPercent}>{porcentajeDescuento}%</span>
                <span className={styles.discountLabel}>dto</span>
              </div>
            )}
          </div>
        </div>
      )}

      <Accordion
        items={[
          ...(descripcionLarga
            ? [
                {
                  key: "uso",
                  label: "¿Cómo se usa este sofrito?",
                  content: (
                    <p style={{ whiteSpace: "pre-wrap" }}>{descripcionLarga}</p>
                  ),
                },
              ]
            : []),
          ...(badges.length > 0
            ? [
                {
                  key: "beneficios",
                  label: "Beneficios que se sienten en el paladar de toda la familia",
                  content: (
                    <ul className={styles.beneficiosList}>
                      {badges.map((b) => (
                        <li key={b.id}>{b.nombre}</li>
                      ))}
                    </ul>
                  ),
                },
              ]
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
              descripcionCorta: descripcion,
              precio: precioFinal,
              precioMoneda,
              imagen,
            },
            cantidad,
          )
        }
      >
        Añadir al carrito
      </button>
    </div>
  );
}
