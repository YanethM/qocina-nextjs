"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./CartToast.module.css";

export default function CartToast() {
  const { toastVisible, toastNombre, dismissToast } = useCart();

  return (
    <div className={`${styles.toast} ${toastVisible ? styles.visible : ""}`}>
      <div className={styles.content}>
        <span className={styles.check}>✓</span>
        <div className={styles.text}>
          <p className={styles.title}>¡Producto añadido!</p>
          <p className={styles.nombre}>{toastNombre}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <Link href="/carrito" className={styles.verCarrito} onClick={dismissToast}>
          Ver carrito
        </Link>
        <button className={styles.close} onClick={dismissToast} aria-label="Cerrar">
          ✕
        </button>
      </div>
    </div>
  );
}
