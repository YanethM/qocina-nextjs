"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSiteCode } from "@/hooks/useSiteCode";
import { useLocale } from "@/hooks/useLocale";
import { formatPrice } from "@/lib/format";
import styles from "./page.module.css";

const ERROR_STEP = 2;

const translations = {
  es: {
    steps: ["Carrito", "Envío", "Pago", "Confirmación"],
    headerAlt: "Error",
    headerTitle: "¡Ups! No pudimos completar tu pedido",
    errorHeading: "No pudimos completar tu pedido en este momento.",
    bodyText1: "Lo sentimos, hubo un problema técnico al intentar procesar tu solicitud.",
    bodyText2: "No pudimos procesar tu pago en este momento.",
    whatTodoTitle: "¿Qué puedes hacer?",
    bullet1: "Verifica tus datos de pago.",
    bullet2: "Intenta con otro método de pago.",
    bullet3Pre: "Si el problema persiste,",
    bullet3Link: "contáctanos para poder ayudarte.",
    retryPayment: "Reintentar pago",
    backToCart: "Volver al carrito",
    resumen: "Resumen",
    shipping: "Costo de envío",
    taxes: "Impuestos",
    total: "Total",
    loading: "Cargando...",
  },
  en: {
    steps: ["Cart", "Shipping", "Payment", "Confirmation"],
    headerAlt: "Error",
    headerTitle: "Oops! We couldn't complete your order",
    errorHeading: "We couldn't complete your order right now.",
    bodyText1: "We're sorry, there was a technical issue while processing your request.",
    bodyText2: "We couldn't process your payment at this time.",
    whatTodoTitle: "What can you do?",
    bullet1: "Check your payment details.",
    bullet2: "Try a different payment method.",
    bullet3Pre: "If the problem persists,",
    bullet3Link: "contact us for help.",
    retryPayment: "Retry payment",
    backToCart: "Back to cart",
    resumen: "Summary",
    shipping: "Shipping cost",
    taxes: "Taxes",
    total: "Total",
    loading: "Loading...",
  },
};

const STEP_IMAGES = [
  { img: "/images/web/shopping/carrito.svg", imgGreen: "/images/web/shopping/carrito_green.svg" },
  { img: "/images/web/shopping/envio.svg", imgGreen: "/images/web/shopping/ubicacion_green.svg" },
  { img: "/images/web/shopping/pago.svg", imgGreen: "/images/web/shopping/seguridad_green.svg" },
  { img: "/images/web/shopping/confirmacion.svg", imgGreen: "/images/web/shopping/confirmacion_check.svg" },
];

function CancelContent() {
  const siteCode = useSiteCode();
  const locale = useLocale();
  const t = translations[locale];
  const STEPS = STEP_IMAGES.map((img, i) => ({ ...img, label: t.steps[i] }));
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
          alt={t.headerAlt}
          width={64}
          height={64}
          className={styles.headerIcon}
        />
        <h1 className={styles.headerTitle}>{t.headerTitle}</h1>
      </div>

      <div className={styles.body}>
        <div className={styles.leftContent}>
          <p className={styles.errorHeading}>{t.errorHeading}</p>
          <p className={styles.bodyText}>
            {t.bodyText1}
          </p>
          <p className={styles.bodyText}>{t.bodyText2}</p>
          <p className={styles.whatTodoTitle}>{t.whatTodoTitle}</p>
          <ul className={styles.bulletList}>
            <li>{t.bullet1}</li>
            <li>{t.bullet2}</li>
            <li>
              {t.bullet3Pre}{" "}
              <a href="mailto:soporte@qocina.com">{t.bullet3Link}</a>
            </li>
          </ul>
          <div className={styles.actions}>
            <Link href={`/${siteCode}/envio`} className={styles.btnPrimary}>
              {t.retryPayment}
            </Link>
            <Link href={`/${siteCode}/carrito`} className={styles.btnSecondary}>
              {t.backToCart}
            </Link>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>{t.resumen}</h2>
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
            <span>{t.shipping}</span>
            <span>{formatPrice(0, moneda)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>{t.taxes}</span>
            <span>{formatPrice(0, moneda)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>{t.total}</span>
            <span className={styles.totalValue}>{formatPrice(total, moneda)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LoadingFallback() {
  const locale = useLocale();
  return (
    <div style={{ padding: "80px", textAlign: "center" }}>{translations[locale].loading}</div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CancelContent />
    </Suspense>
  );
}
