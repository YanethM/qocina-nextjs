"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";

const STEPS = [
  { img: "/images/web/shopping/carrito.svg", label: "Carrito" },
  { img: "/images/web/shopping/envio.svg", label: "Envío" },
  { img: "/images/web/shopping/pago.svg", label: "Pago" },
  { img: "/images/web/shopping/confirmacion.svg", label: "Confirmación" },
];

function formatPrice(precio: number, moneda: string): string {
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `$${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${moneda}`;
}

function CancelContent() {
  const { items, total } = useCart();
  const moneda = items[0]?.precioMoneda ?? "COP";

  return (
    <div className={styles.page}>
      <div className={styles.steps}>
        {STEPS.map((step, i) => (
          <div key={step.label} className={styles.stepGroup}>
            <div className={`${styles.step} ${i === 2 ? styles.stepActive : ""}`}>
              <Image src={step.img} alt={step.label} width={110} height={74} style={{ width: 110, height: 74 }} />
            </div>
            {i < STEPS.length - 1 && <hr className={styles.stepLine} />}
          </div>
        ))}
      </div>

      <div className={styles.header}>
        <Image
          src="/images/web/error.svg"
          alt="Error"
          width={64}
          height={64}
          className={styles.headerIcon}
        />
        <h1 className={styles.headerTitle}>¡Ups! Algo no salió como esperábamos</h1>
      </div>

      <div className={styles.body}>
        <div className={styles.leftContent}>
          <p className={styles.errorHeading}>No pudimos completar tu pedido en este momento.</p>
          <p className={styles.bodyText}>
            Lo sentimos, hubo un problema técnico al intentar procesar tu solicitud.
          </p>
          <p className={styles.bodyText}>No se ha realizado ningún cargo a tu tarjeta.</p>
          <p className={styles.whatTodoTitle}>¿Qué puedes hacer?</p>
          <ul className={styles.bulletList}>
            <li>Verifica los datos de tu tarjeta.</li>
            <li>Intenta con otro método de pago.</li>
            <li>
              Si el problema persiste, contacta a nuestro{" "}
              <a href="mailto:soporte@qocina.com">equipo de soporte.</a>
            </li>
          </ul>
          <div className={styles.actions}>
            <Link href="/envio" className={styles.btnPrimary}>
              Reintentar pago
            </Link>
            <Link href="/carrito" className={styles.btnSecondary}>
              Volver al carrito
            </Link>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Resumen</h2>
          <div className={styles.summaryList}>
            {items.map((item) => (
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
            <span className={styles.totalValue}>{formatPrice(total, moneda)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Cargando...</div>}>
      <CancelContent />
    </Suspense>
  );
}
