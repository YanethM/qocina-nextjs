"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard/BlogCard";
import { getStrapiImageUrl } from "@/lib/api";
import type { Articulo } from "@/types";
import styles from "./page.module.css";

interface BlogGridProps {
  articulos: Articulo[];
  ctaVerTodas?: string | null;
}

const INITIAL_COUNT = 6;

export default function BlogGrid({ articulos, ctaVerTodas }: BlogGridProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? articulos : articulos.slice(0, INITIAL_COUNT);
  const hasMore = articulos.length > INITIAL_COUNT;

  return (
    <>
      <div className={styles.cardsGrid}>
        {visible.map((articulo) => (
          <BlogCard
            key={articulo.id}
            titulo={articulo.titulo}
            descripcion_corta={articulo.descripcion_corta}
            href={`/blog-y-noticias/${articulo.slug}`}
            imagenUrl={
              articulo.imagen_principal?.url
                ? getStrapiImageUrl(articulo.imagen_principal.url)
                : undefined
            }
          />
        ))}
      </div>
      {!showAll && hasMore && ctaVerTodas && (
        <div className={styles.verTodasWrapper}>
          <button className={styles.verTodasBtn} onClick={() => setShowAll(true)}>
            {ctaVerTodas}
          </button>
        </div>
      )}
    </>
  );
}
