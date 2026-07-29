"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard/BlogCard";
import { getStrapiImageUrl } from "@/lib/strapi";
import { useSiteCode } from "@/hooks/useSiteCode";
import type { Articulo } from "@/types";
import styles from "./page.module.css";

interface BlogGridProps {
  articulos: Articulo[];
  ctaVerTodas?: string | null;
  ctaLeerMas?: string | null;
}

const INITIAL_COUNT = 6;

export default function BlogGrid({ articulos, ctaVerTodas, ctaLeerMas }: BlogGridProps) {
  const siteCode = useSiteCode();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? articulos : articulos.slice(0, INITIAL_COUNT);
  const hasMore = articulos.length > INITIAL_COUNT;

  return (
    <>
      <div className={styles.cardsGrid}>
        {visible.map((articulo) => {
          const desktopImage = articulo.imagen_banner_desktop ?? articulo.imagen_principal;
          const mobileImage = articulo.imagen_banner_mobile ?? desktopImage;

          return (
            <BlogCard
              key={articulo.id}
              titulo={articulo.titulo}
              descripcion_corta={articulo.descripcion_corta}
              href={`/${siteCode}/blog-y-noticias/${articulo.slug}`}
              imagenUrl={desktopImage?.url ? getStrapiImageUrl(desktopImage.url) : undefined}
              imagenMobileUrl={mobileImage?.url ? getStrapiImageUrl(mobileImage.url) : undefined}
              ctaText={ctaLeerMas ?? undefined}
            />
          );
        })}
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
