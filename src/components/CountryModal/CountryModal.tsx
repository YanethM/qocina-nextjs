"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Site } from "@/types";
import styles from "./CountryModal.module.css";

const STORAGE_KEY = "qocina_country_selected";
const COOKIE_KEY = "site-code";

const FLAG_EMOJI: Record<string, string> = {
  pe: "🇵🇪",
  us: "🇺🇸",
  es: "🇪🇸",
  mx: "🇲🇽",
  ar: "🇦🇷",
  co: "🇨🇴",
  ec: "🇪🇨",
  cl: "🇨🇱",
};

export default function CountryModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    fetch("/api/sites")
      .then((r) => r.json())
      .then((data: Site[]) => {
        setSites(Array.isArray(data) ? data.filter((s) => s.activo) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [visible]);

  const handleSelect = (code: string) => {
    localStorage.setItem(STORAGE_KEY, code);
    document.cookie = `${COOKIE_KEY}=${code}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    setVisible(false);
    router.push(`/${code}`);
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Selecciona tu país">
      <div className={styles.modal}>
        <div className={styles.logo}>
          <Image
            src="/images/web/footer/logo-qocina.svg"
            alt="Q'ocina"
            width={140}
            height={52}
            priority
          />
        </div>

        <h2 className={styles.title}>¿Desde dónde nos visitas?</h2>

        <p className={styles.subtitle}>
          Selecciona tu país para ver precios, productos y contenido personalizado para ti
        </p>

        {loading ? (
          <div className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        ) : (
          <div className={styles.grid}>
            {sites.map((site) => (
              <button
                key={site.code}
                className={styles.countryBtn}
                onClick={() => handleSelect(site.code)}
              >
                <span className={styles.flag}>{FLAG_EMOJI[site.code] ?? "🌎"}</span>
                <span className={styles.countryName}>{site.nombre}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
