"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";
import { useSiteCode } from "@/hooks/useSiteCode";
import { getOrder } from "@/lib/api";
import type { Order } from "@/types";
import styles from "./page.module.css";

const ACTIVE_STEP = 3;

const STEPS = [
  { img: "/images/web/shopping/carrito.svg", imgGreen: "/images/web/shopping/carrito_green.svg", label: "Carrito" },
  { img: "/images/web/shopping/envio.svg", imgGreen: "/images/web/shopping/ubicacion_green.svg", label: "Envío" },
  { img: "/images/web/shopping/pago.svg", imgGreen: "/images/web/shopping/seguridad_green.svg", label: "Pago" },
  { img: "/images/web/shopping/confirmacion.svg", imgGreen: "/images/web/shopping/confirmacion_check.svg", label: "Confirmación" },
];

function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `$${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${moneda}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SuccessContent() {
  const siteCode = useSiteCode();
  const { items, total, clearCart } = useCart();
  const cleared = useRef(false);
  const [snapshot, setSnapshot] = useState<CartItem[]>([]);
  const [snapshotTotal, setSnapshotTotal] = useState(0);
  const [snapshotMoneda, setSnapshotMoneda] = useState("COP");
  const [orderDate] = useState(() => new Date());
  const [email] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("qocina_checkout_email") ?? "";
    }
    return "";
  });
  const [orderId] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("qocina_checkout_order_id") ?? "";
    }
    return "";
  });
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!cleared.current && items.length > 0) {
      setSnapshot([...items]);
      setSnapshotTotal(total);
      setSnapshotMoneda(items[0]?.precioMoneda ?? "COP");
      clearCart();
      cleared.current = true;
    }
  }, [items, total, clearCart]);

  useEffect(() => {
    if (!orderId || !siteCode) return;
    getOrder(orderId, siteCode)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [orderId, siteCode]);

  const displayItems = snapshot.length > 0 ? snapshot : items;
  const displayTotal = snapshot.length > 0 ? snapshotTotal : total;
  const displayMoneda = snapshot.length > 0 ? snapshotMoneda : (items[0]?.precioMoneda ?? "COP");

  const finalEmail = order?.customerEmail || email;
  const finalOrderNumber = order?.orderNumber || (orderId ? `#${orderId}` : "");
  const finalDate = order?.paidAt ? new Date(order.paidAt) : orderDate;
  const finalMoneda = order?.currency || displayMoneda;
  const finalTotal = order ? order.total : displayTotal;
  const finalShipping = order?.shipping ?? 0;
  const finalTax = order?.tax ?? 0;
  const summaryItems = order?.items?.length
    ? order.items.map((oi) => ({
        id: oi.id,
        nombre: oi.name,
        cantidad: oi.quantity,
        precio: oi.price,
        precioMoneda: finalMoneda,
        imagen: displayItems.find(
          (di) => di.nombre.toLowerCase() === oi.name.toLowerCase()
        )?.imagen ?? null,
      }))
    : displayItems;

  return (
    <div className={styles.page}>
      <div className={styles.steps}>
        {STEPS.map((step, i) => (
          <div key={step.label} className={styles.stepGroup}>
            <div className={`${styles.step} ${i <= ACTIVE_STEP ? styles.stepActive : ""}`}>
              <Image src={i <= ACTIVE_STEP ? step.imgGreen : step.img} alt={step.label} width={110} height={74} className={styles.stepImg} />
              <p className={styles.stepLabel}>{step.label}</p>
            </div>
            {i < STEPS.length - 1 && (
              <Image
                src={i <= ACTIVE_STEP ? "/images/web/shopping/linea.svg" : "/images/web/shopping/linea_inactiva.svg"}
                alt="" width={72} height={6} className={styles.stepLine}
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles.header}>
        <Image
          src="/images/web/success.svg"
          alt="Éxito"
          width={64}
          height={64}
          className={styles.headerIcon}
        />
        <h1 className={styles.headerTitle}>¡Gracias por elegir Q&rsquo;ocina en Casa!</h1>
      </div>

      <div className={styles.body}>
        <div className={styles.leftContent}>
          <p className={styles.successHeading}>Tu pedido se ha realizado con éxito.</p>
          <p className={styles.boldText}>
            Revisa tu correo electrónico para ver la confirmación de tu pedido.
          </p>
          <div className={styles.checklist}>
            {finalEmail && (
              <div className={styles.checklistItem}>
                <Image src="/images/web/recetas/recetas_detail/checkmark.svg" alt="" width={20} height={16} />
                <p className={styles.infoText}>
                  Enviamos los detalles de la confirmación a: <strong>{finalEmail}</strong>
                </p>
              </div>
            )}
            <div className={styles.checklistItem}>
              <Image src="/images/web/recetas/recetas_detail/checkmark.svg" alt="" width={20} height={16} />
              <p className={styles.infoText}>
                Fecha del pedido: <strong>{formatDate(finalDate)}</strong>
              </p>
            </div>
            {finalOrderNumber && (
              <div className={styles.checklistItem}>
                <Image src="/images/web/recetas/recetas_detail/checkmark.svg" alt="" width={20} height={16} />
                <p className={styles.infoText}>
                  Número de pedido: <strong>{finalOrderNumber}</strong>
                </p>
              </div>
            )}
          </div>
          <div className={styles.actions}>
            <Link href={`/${siteCode}/recetas`} className={styles.btnSecondary}>
              Explorar recetas
            </Link>
            <Link href={`/${siteCode}/productos`} className={styles.btnPrimary}>
              Volver a la tienda
            </Link>
            <Link href={`/${siteCode}/blog-y-noticias`} className={styles.btnOutline}>
              Descubrir tips y novedades de Q&rsquo;ocina
            </Link>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Resumen</h2>
          <div className={styles.summaryList}>
            {summaryItems.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.summaryImage}>
                  {item.imagen && (
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  )}
                </div>
                <div className={styles.summaryInfo}>
                  <span className={styles.summaryNombre}>{item.nombre}</span>
                  <span className={styles.summaryPrecio}>
                    {formatPrice(item.precio, item.precioMoneda)}
                  </span>
                </div>
                <span className={styles.summaryCantidad}>{item.cantidad}</span>
              </div>
            ))}
          </div>
          <hr className={styles.divider} />
          <div className={styles.summaryRow}>
            <span>Costo de envío</span>
            <span>{formatPrice(finalShipping, finalMoneda)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Impuestos</span>
            <span>{formatPrice(finalTax, finalMoneda)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatPrice(finalTotal, finalMoneda)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
