"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BlogCard from "@/components/BlogCard/BlogCard";
import { getStrapiImageUrl } from "@/lib/api";
import type { Articulo } from "@/types";
import styles from "./RelacionadosCarousel.module.css";

interface Props {
  articulos: Articulo[];
  ctaVerTodas?: string | null;
}

const MAX_SLIDES = 3;

export default function RelacionadosCarousel({ articulos, ctaVerTodas }: Props) {
  const [current, setCurrent] = useState(0);
  const visible = articulos.slice(0, MAX_SLIDES);
  const hasMore = articulos.length > MAX_SLIDES;
  const total = visible.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  if (total === 0) return null;

  return (
    <div className={styles.carousel}>
      <div className={styles.trackWrapper}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {visible.map((a) => (
            <div key={a.id} className={styles.slide}>
              <BlogCard
                titulo={a.titulo}
                descripcion_corta={a.descripcion_corta}
                href={`/blog-y-noticias/${a.slug}`}
                imagenUrl={a.imagen_principal?.url ? getStrapiImageUrl(a.imagen_principal.url) : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.arrow} onClick={prev} aria-label="Anterior">
          <Image src="/images/web/home/arrow_right.svg" alt="" width={24} height={16} className={styles.arrowLeft} />
        </button>

        <div className={styles.dots}>
          {visible.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ir a noticia ${i + 1}`}
            />
          ))}
        </div>

        <button className={styles.arrow} onClick={next} aria-label="Siguiente">
          <Image src="/images/web/home/arrow_right.svg" alt="" width={24} height={16} />
        </button>
      </div>

      {hasMore && ctaVerTodas && (
        <div className={styles.verMasWrapper}>
          <Link href="/blog-y-noticias" className={styles.verMasBtn}>
            {ctaVerTodas}
          </Link>
        </div>
      )}
    </div>
  );
}
