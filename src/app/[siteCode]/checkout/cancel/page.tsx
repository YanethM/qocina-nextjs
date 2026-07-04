"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSiteCode } from "@/hooks/useSiteCode";
import styles from "./page.module.css";

const ERROR_STEP = 2;

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

function CancelContent() {
  const siteCode = useSiteCode();
  const { items, total } = useCart();
  const moneda = items[0]?.precioMoneda ?? "COP";

  return (
    <div className={styles.page}>
      <div className={styles.steps}>
        {STEPS.map((step, i) => {
          const isError = i === ERROR_STEP;
          const isDone = i < ERROR_STEP;
          let src = step.img;
          if (isError) src = "/images/web/shopping/seguridad_red.svg";
          else if (isDone) src = step.imgGreen;
          return (
            <div key={step.label} className={styles.stepGroup}>
              <div className={`${styles.step} ${isDone ? styles.stepActive : ""} ${isError ? styles.stepError : ""}`}>
                <Image src={src} alt={step.label} width={110} height={74} className={styles.stepImg} />
                <p className={styles.stepLabel}>{step.label}</p>
              </div>
              {i < STEPS.length - 1 && (
                <Image
                  src={isDone ? "/images/web/shopping/linea.svg" : "/images/web/shopping/linea_inactiva.svg"}
                  alt="" width={72} height={6} className={styles.stepLine}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.header}>
        <Image
          src="/images/web/shopping/error.svg"
          alt="Error"
          width={64}
          height={64}
          className={styles.headerIcon}
        />
        <h1 className={styles.headerTitle}>¡Ups! No pudimos completar tu pedido</h1>
      </div>

      <div className={styles.body}>
        <div className={styles.leftContent}>
          <p className={styles.errorHeading}>No pudimos completar tu pedido en este momento.</p>
          <p className={styles.bodyText}>
            Lo sentimos, hubo un problema técnico al intentar procesar tu solicitud.
          </p>
          <p className={styles.bodyText}>No pudimos procesar tu pago en este momento.</p>
          <p className={styles.whatTodoTitle}>¿Qué puedes hacer?</p>
          <ul className={styles.bulletList}>
            <li>Verifica tus datos de pago.</li>
            <li>Intenta con otro método de pago.</li>
            <li>
              Si el problema persiste,{" "}
              <a href="mailto:soporte@qocina.com">contáctanos para poder ayudarte.</a>
            </li>
          </ul>
          <div className={styles.actions}>
            <Link href={`/${siteCode}/envio`} className={styles.btnPrimary}>
              Reintentar pago
            </Link>
            <Link href={`/${siteCode}/carrito`} className={styles.btnSecondary}>
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
            <span>{formatPrice(0, moneda)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Impuestos</span>
            <span>{formatPrice(0, moneda)}</span>
          </div>
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
