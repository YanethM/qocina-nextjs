"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";
import { useSiteCode } from "@/hooks/useSiteCode";
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

  useEffect(() => {
    if (!cleared.current && items.length > 0) {
      setSnapshot([...items]);
      setSnapshotTotal(total);
      setSnapshotMoneda(items[0]?.precioMoneda ?? "COP");
      clearCart();
      cleared.current = true;
    }
  }, [items, total, clearCart]);

  const displayItems = snapshot.length > 0 ? snapshot : items;
  const displayTotal = snapshot.length > 0 ? snapshotTotal : total;
  const displayMoneda = snapshot.length > 0 ? snapshotMoneda : (items[0]?.precioMoneda ?? "COP");

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
        <h1 className={styles.headerTitle}>¡Muchas gracias!</h1>
      </div>

      <div className={styles.body}>
        <div className={styles.leftContent}>
          <p className={styles.successHeading}>Tu pedido se ha realizado con éxito.</p>
          <p className={styles.boldText}>
            Revisa tu correo electrónico para ver la confirmación de tu pedido.
          </p>
          <p className={styles.infoText}>Fecha del pedido: {formatDate(orderDate)}</p>
          {email && (
            <p className={styles.infoText}>
              Hemos enviado los detalles de la confirmación a {email}
            </p>
          )}
          <div className={styles.actions}>
            <Link href={`/${siteCode}/productos`} className={styles.btnPrimary}>
              Seguir comprando
            </Link>
            <Link href={`/${siteCode}`} className={styles.btnSecondary}>
              Ir al inicio
            </Link>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Resumen</h2>
          <div className={styles.summaryList}>
            {displayItems.map((item) => (
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
                <span className={styles.summaryNombre}>{item.nombre}</span>
                <span className={styles.summaryPrecio}>
                  {formatPrice(item.precio * item.cantidad, item.precioMoneda)}
                </span>
              </div>
            ))}
          </div>
          <hr className={styles.divider} />
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatPrice(displayTotal, displayMoneda)}</span>
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
