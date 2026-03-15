"use client";

import { useState } from "react";
import Image from "next/image";
import { Premio } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import styles from "./PremiosCarousel.module.css";

interface PremiosCarouselProps {
  titulo?: string | null;
  premios: Premio[];
}

export default function PremiosCarousel({ titulo, premios }: PremiosCarouselProps) {
  const [current, setCurrent] = useState(0);

  const sorted = [...premios].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const premio = sorted[current];

  const imgSrc = premio?.imagen?.formats?.large?.url
    ? getStrapiImageUrl(premio.imagen.formats.large.url)
    : premio?.imagen?.url
    ? getStrapiImageUrl(premio.imagen.url)
    : null;

  return (
    <div className={styles.wrapper}>
      <Image
        src="/images/web/nosotros/premios.svg"
        alt={titulo ?? "Premios"}
        width={1440}
        height={600}
        className={styles.premiosImg}
        style={{ width: "100%", height: "auto", display: "block" }}
        unoptimized
      />

      <div className={styles.overlay}>
        <div className={styles.grid}>
          <div className={styles.col1}>
            {titulo && <p className={styles.seccionTitulo}>{titulo}</p>}
            {sorted.length > 1 && (
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
            )}
          </div>

          <div className={styles.col2}>
            {imgSrc && (
              <div className={styles.imageWrapper}>
                <Image
                  src={imgSrc}
                  alt={premio?.imagen?.alternativeText ?? premio?.titulo ?? "Premio"}
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>
            )}
            {premio?.titulo && (
              <p className={styles.premioNombre}>{premio.titulo}</p>
            )}
          </div>

          <div className={styles.col3}>
            {premio?.descripcion && (
              <p className={styles.premioDescripcion}>{premio.descripcion}</p>
            )}
            <div className={styles.deslizaRow}>
              <p className={styles.desliza}>DESLIZA</p>
              <Image
                src="/images/web/nosotros/desliza_arrow.svg"
                alt=""
                width={201}
                height={41}
                style={{ width: "201px", height: "41px" }}
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
