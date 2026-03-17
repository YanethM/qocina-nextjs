"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./CookieBanner.module.css";

const STORAGE_KEY = "qocina_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Aviso de cookies">
      <div className={styles.content}>
        <p className={styles.text}>
          Usamos cookies propias y de terceros para mejorar tu experiencia de navegación y
          mostrarte contenido personalizado. Puedes aceptarlas o rechazarlas. Más información en
          nuestra{" "}
          <Link href="/politicas-de-cookies" className={styles.link}>
            política de cookies
          </Link>
          .
        </p>
        <div className={styles.actions}>
          <button className={styles.btnReject} onClick={handleReject}>
            Rechazar
          </button>
          <button className={styles.btnAccept} onClick={handleAccept}>
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
