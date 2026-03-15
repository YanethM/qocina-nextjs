"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
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
}

export default function PackDetailClient({
  id,
  documentId,
  slug,
  nombre,
  descripcion,
  precio,
  precioMoneda,
  sku,
  imagen,
  mostrarDescuento,
  porcentajeDescuento,
}: Props) {
  const { addItem } = useCart();
  const [cantidad, setCantidad] = useState(1);

  const precioConDescuento =
    mostrarDescuento && porcentajeDescuento
      ? precio * (1 - porcentajeDescuento / 100)
      : null;
  const precioFinal = precioConDescuento ?? precio;
  const totalPrice = precioFinal * cantidad;

  return (
    <div className={styles.infoSection}>
      <h1 className={styles.title}>{nombre}</h1>
      <p className={styles.descripcion}>{descripcion}</p>

      {sku && <p className={styles.sku}>SKU: {sku}</p>}

      <div className={styles.priceRow}>
        {precioConDescuento !== null && (
          <span className={styles.priceOriginal}>
            {formatPrice(precio * cantidad, precioMoneda)}
          </span>
        )}
        <div className={styles.priceRight}>
          <span className={styles.price}>
            {formatPrice(totalPrice, precioMoneda)}
          </span>
          {mostrarDescuento && porcentajeDescuento && (
            <div className={styles.discountBadge}>
              <span className={styles.discountPercent}>
                {porcentajeDescuento}%
              </span>
              <span className={styles.discountLabel}>dto</span>
            </div>
          )}
        </div>
      </div>

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
