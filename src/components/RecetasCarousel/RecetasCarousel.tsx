"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Receta } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import styles from "./RecetasCarousel.module.css";

const COLOR_MAP: Record<string, string> = {
  rojo: "#CE171C",
  verde: "#6A892C",
  amarillo: "#F4A910",
};

const WAVE_MAP: Record<string, string> = {
  rojo: "/images/web/home/wave_red.png",
  verde: "/images/web/home/wave_green.png",
  amarillo: "/images/web/home/wave_yellow.png",
};

function CardItem({ receta }: { receta: Receta }) {
  const cardColor = COLOR_MAP[receta.color_card] || "#CE171C";
  const waveSrc =
    WAVE_MAP[receta.color_card] || "/images/web/home/wave_red.png";

  return (
    <Link
      href={`/recetas/${receta.documentId}`}
      className={styles.card}
      data-color={receta.color_card}>
      <div className={styles.cardImage}>
        {receta.imagen_principal && (
          <Image
            src={getStrapiImageUrl(receta.imagen_principal.url)}
            alt={receta.imagen_principal.alternativeText ?? receta.titulo}
            fill
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
      <div className={styles.wave}>
        <img src={waveSrc} alt="" className={styles.waveImg} />
      </div>
      <div className={styles.cardBody} style={{ backgroundColor: cardColor }}>
        <h3 className={styles.cardTitle}>{receta.titulo}</h3>
        <p className={styles.cardDescription}>{receta.descripcion_corta}</p>
        <div className={styles.cardCta}>
          <span className={styles.ctaButton}>
            Ver receta{" "}
            <Image
              src="/images/web/home/arrow_right.png"
              alt=""
              width={25}
              height={25}
              className={styles.ctaArrow}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

interface Props {
  recetas: Receta[];
}

export default function RecetasCarousel({ recetas }: Props) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % recetas.length);
    }, 3500);
  }, [recetas.length]);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  const goTo = (i: number) => {
    setCurrent(i);
    startInterval();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goTo((current + 1) % recetas.length);
      } else {
        goTo((current - 1 + recetas.length) % recetas.length);
      }
    }
    touchStartX.current = null;
  };

  if (recetas.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recetas</h2>

      {/* Desktop: grid de 3 columnas */}
      <div className={styles.grid}>
        {recetas.map((receta) => (
          <CardItem key={receta.id} receta={receta} />
        ))}
      </div>

      {/* Mobile: carrusel con dots */}
      <div
        className={styles.carousel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${current * 100}%)` }}>
          {recetas.map((receta) => (
            <div key={receta.id} className={styles.slide}>
              <CardItem receta={receta} />
            </div>
          ))}
        </div>

        <div className={styles.dotsRow}>
          {recetas.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Ir a receta ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.verTodas}>
        <Link href="/recetas" className={styles.verTodasBtn}>
          Ver todas{" "}
          <Image
            src="/images/web/home/white_arrow_right.png"
            alt=""
            width={20}
            height={20}
          />
        </Link>
      </div>
    </section>
  );
}
