"use client";

import { useState } from "react";
import Image from "next/image";
import { Premio } from "@/types";
import styles from "./PremiosCarousel.module.css";

interface PremiosCarouselProps {
  titulo?: string | null;
  premios: Premio[];
}

export default function PremiosCarousel({ titulo, premios }: PremiosCarouselProps) {
  const [current, setCurrent] = useState(0);

  const sorted = [...premios].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const currentPremio = sorted[current];

  return (
    <div className={styles.wrapper}>
      <Image
        src="/images/web/nosotros/premios.svg"
        alt={titulo ?? "Premios"}
        width={1440}
        height={600}
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      <div className={styles.overlay}>
        <div className={styles.overlayInner}>
          <div className={styles.left}>
            {titulo && <p className={styles.seccionTitulo}>{titulo}</p>}
          </div>
          <div className={styles.right}>
            {currentPremio?.titulo && (
              <p className={styles.premioNombre}>{currentPremio.titulo}</p>
            )}
          </div>
        </div>

        {sorted.length > 1 && (
          <div className={styles.dotsContainer}>
            <div className={styles.dotsRow}>
              {sorted.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Premio ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
