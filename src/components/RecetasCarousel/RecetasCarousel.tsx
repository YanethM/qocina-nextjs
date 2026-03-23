"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Receta } from "@/types";
import { getStrapiImageUrl } from "@/lib/strapi";
import { COLOR_MAP, WAVE_MAP, DEFAULT_COLOR, DEFAULT_WAVE } from "@/lib/constants";
import { useCarousel } from "@/hooks/useCarousel";
import styles from "./RecetasCarousel.module.css";

const GAP = 16;

function CardItem({ receta }: { receta: Receta }) {
  const cardColor = COLOR_MAP[receta.color_card] ?? DEFAULT_COLOR;
  const waveSrc = WAVE_MAP[receta.color_card] ?? DEFAULT_WAVE;

  return (
    <Link
      href={`/recetas/${receta.slug}`}
      className={styles.card}
      data-card
      data-color={receta.color_card}>
      <div className={styles.cardImage}>
        {receta.imagen_principal && (
          <Image
            src={getStrapiImageUrl(receta.imagen_principal.url)}
            alt={receta.imagen_principal.alternativeText ?? receta.titulo ?? ""}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 968px) 50vw, 424px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        )}
      </div>
      <div className={styles.wave}>
        <Image
          src={waveSrc}
          alt=""
          width={424}
          height={80}
          className={styles.waveImg}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className={styles.cardBody} style={{ backgroundColor: cardColor }}>
        <h3 className={styles.cardTitle}>{receta.titulo}</h3>
        <p className={styles.cardDescription}>{receta.descripcion_corta}</p>
        <div className={styles.cardCta}>
          <span className={styles.ctaButton} data-btn="white">
            Ver receta{" "}
            <Image
              src="/images/web/home/arrow_right.svg"
              alt=""
              width={25}
              height={25}
              style={{ height: "auto" }}
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
  recetas_titulo?: string;
  recetas_cta?: { texto: string; url: string; nueva_ventana: boolean } | null;
}

export default function RecetasCarousel({ recetas, recetas_titulo, recetas_cta }: Props) {
  const { current, goTo, handleTouchStart, handleTouchEnd } = useCarousel(recetas.length);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMobile = containerWidth > 0 && containerWidth <= 640;
  const slideWidth = isMobile
    ? containerWidth
    : containerWidth > 0
    ? Math.floor(containerWidth / 2 - GAP / 2)
    : 0;
  const translateX = current * (slideWidth + GAP);

  if (recetas.length === 0) return null;

  return (
    <section className={styles.section}>
      {recetas_titulo && <h2 className={styles.title}>{recetas_titulo}</h2>}

      <div className={styles.grid}>
        {recetas.map((receta) => (
          <CardItem key={receta.id} receta={receta} />
        ))}
      </div>

      <div
        ref={carouselRef}
        className={styles.carousel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${translateX}px)` }}>
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

      {recetas_cta && (
        <div className={styles.verTodas}>
          <Link
            href={recetas_cta.url}
            target={recetas_cta.nueva_ventana ? "_blank" : "_self"}
            rel={recetas_cta.nueva_ventana ? "noopener noreferrer" : undefined}
            className={styles.verTodasBtn}
            data-btn="dark"
          >
            {recetas_cta.texto}{" "}
            <Image
              src="/images/web/home/white_arrow_right.svg"
              alt=""
              width={20}
              height={20}
              style={{ height: "auto" }}
            />
          </Link>
        </div>
      )}
    </section>
  );
}
