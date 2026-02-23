"use client";

import Link from "next/link";
import Image from "next/image";
import { Receta } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import { COLOR_MAP, WAVE_MAP, DEFAULT_COLOR, DEFAULT_WAVE } from "@/lib/constants";
import { useCarousel } from "@/hooks/useCarousel";
import styles from "./RecetasCarousel.module.css";

function CardItem({ receta }: { receta: Receta }) {
  const cardColor = COLOR_MAP[receta.color_card] ?? DEFAULT_COLOR;
  const waveSrc = WAVE_MAP[receta.color_card] ?? DEFAULT_WAVE;

  return (
    <Link
      href={`/home-page/recetas_destacadas/${receta.documentId}`}
      className={styles.card}
      data-color={receta.color_card}>
      <div className={styles.cardImage}>
        {receta.imagen_principal && (
          <Image
            src={getStrapiImageUrl(receta.imagen_principal.url)}
            alt={receta.imagen_principal.alternativeText ?? receta.titulo ?? ""}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 968px) 50vw, 424px"
            style={{ objectFit: "cover" }}
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
          <span className={styles.ctaButton}>
            Ver receta{" "}
            <Image
              src="/images/web/home/arrow_right.png"
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
}

export default function RecetasCarousel({ recetas }: Props) {
  const { current, goTo, handleTouchStart, handleTouchEnd } = useCarousel(recetas.length);

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
            style={{ height: "auto" }}
          />
        </Link>
      </div>
    </section>
  );
}
