"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./BasesCulinarias.module.css";

const bases = [
  {
    id: "verde",
    src: "/images/web/recetas/base_verde.svg",
    srcActive: "/images/web/recetas/base_verde_detail.svg",
    srcOtherActive: "/images/web/recetas/base_verde_resumida.svg",
    srcMobile: "/images/mobile/recetas/base_verde.svg",
    srcMobileActive: "/images/mobile/recetas/base_verde_detail.svg",
    alt: "Base Verde",
    panelColor: "#6A892C",
    defaultWidth: 480,
  },
  {
    id: "amarilla",
    src: "/images/web/recetas/base_amarilla.svg",
    srcActive: "/images/web/recetas/base_amarilla_detail.svg",
    srcOtherActive: "/images/web/recetas/base_amarilla_resumida.svg",
    srcMobile: "/images/mobile/recetas/base_amarilla.svg",
    srcMobileActive: "/images/mobile/recetas/base_amarilla_detail.svg",
    alt: "Base Amarilla",
    panelColor: "#DE9A0F",
    defaultWidth: 482,
  },
  {
    id: "roja",
    src: "/images/web/recetas/base_roja.svg",
    srcActive: "/images/web/recetas/base_roja_detail.svg",
    srcOtherActive: "/images/web/recetas/base_roja_resumida.svg",
    srcMobile: "/images/mobile/recetas/base_roja.svg",
    srcMobileActive: "/images/mobile/recetas/base_roja_detail.svg",
    alt: "Base Roja",
    panelColor: "#BB1519",
    defaultWidth: 480,
  },
] as const;

const DETALLE_WIDTH = 753;
const RESUMEN_WIDTH = 346;
const DESIGN_HEIGHT = 510;
const DEFAULT_TOTAL_WIDTH = bases.reduce((sum, b) => sum + b.defaultWidth, 0);
const ACTIVE_TOTAL_WIDTH = DETALLE_WIDTH + RESUMEN_WIDTH * 2;

interface BaseCulinariaImagenApi {
  desktopDefault?: string | null;
  desktopDetalle?: string | null;
  desktopResumen?: string | null;
  mobileDefault?: string | null;
  mobileDetalle?: string | null;
}

interface BasesCulinariasProps {
  imagenesApi?: Partial<Record<(typeof bases)[number]["id"], BaseCulinariaImagenApi>>;
}

export default function BasesCulinarias({ imagenesApi }: BasesCulinariasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionAspectRatio = activeId === null
    ? `${DEFAULT_TOTAL_WIDTH} / ${DESIGN_HEIGHT}`
    : `${ACTIVE_TOTAL_WIDTH} / ${DESIGN_HEIGHT}`;

  return (
    <section
      className={styles.section}
      style={{ "--section-aspect-ratio": sectionAspectRatio } as React.CSSProperties}
    >
      {bases.map((base) => {
        const isActive = activeId === base.id;
        const isOtherActive = activeId !== null && !isActive;
        const sectionTotalWidth = activeId === null ? DEFAULT_TOTAL_WIDTH : ACTIVE_TOTAL_WIDTH;
        const apiImagenes = imagenesApi?.[base.id];
        const srcOtherActive: string | undefined = base.srcOtherActive;
        const imageSrc =
          isActive
            ? apiImagenes?.desktopDetalle ?? base.srcActive
            : isOtherActive
            ? apiImagenes?.desktopResumen ?? srcOtherActive ?? apiImagenes?.desktopDefault ?? base.src
            : apiImagenes?.desktopDefault ?? base.src;
        const mobileImageSrc = isActive
          ? apiImagenes?.mobileDetalle ?? base.srcMobileActive
          : apiImagenes?.mobileDefault ?? base.srcMobile;

        const itemWidth = isActive ? DETALLE_WIDTH : isOtherActive ? RESUMEN_WIDTH : base.defaultWidth;
        const itemBasis = `${(itemWidth / sectionTotalWidth) * 100}%`;

        return (
          <div
            key={base.id}
            className={`${styles.item} ${styles.itemClickable}`}
            style={{
              backgroundColor: base.panelColor,
              "--item-basis": itemBasis,
            } as React.CSSProperties}
            onClick={() => setActiveId((prev) => (prev === base.id ? null : base.id))}
          >
            <div className={styles.imageBleed}>
              <Image
                src={imageSrc}
                alt={base.alt}
                fill
                style={{ objectFit: "fill" }}
                sizes="(max-width: 640px) 100vw, 33vw"
                priority
                unoptimized
                className={styles.desktopImage}
              />
            </div>
            <div className={`${styles.mobileImage} ${isActive ? styles.mobileImageActive : ""}`}>
              <Image
                key={mobileImageSrc}
                src={mobileImageSrc}
                alt={base.alt}
                fill
                style={{ objectFit: "fill" }}
                priority={!isActive}
                unoptimized
                className={styles.mobileImageFade}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
