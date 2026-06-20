"use client";

import { useState } from "react";
import Image from "next/image";
import type { Producto } from "@/types";
import { COLOR_MAP } from "@/lib/constants";
import styles from "./BasesCulinarias.module.css";

const bases = [
  {
    id: "verde",
    colorKey: "verde",
    src: "/images/web/recetas/base_verde.svg",
    srcActive: "/images/web/recetas/base_verde_detail.svg",
    srcOtherActive: undefined,
    srcMobile: "/images/mobile/bases_culinarias/green_base.svg",
    srcMobileActive: "/images/mobile/bases_culinarias/green_base_detail.svg",
    alt: "Base Verde",
    label: "Base culinaria Verde",
    description: "Perfecto para mariscos, arroces y platos frescos.",
    detailColor: "#fff",
  },
  {
    id: "amarilla",
    colorKey: "amarillo",
    src: "/images/web/recetas/base_amarilla.svg",
    srcActive: "/images/web/recetas/base_amarilla_detail.svg",
    srcOtherActive: "/images/web/recetas/base_amarilla_resumida.svg",
    srcMobile: "/images/mobile/bases_culinarias/yellow_base.svg",
    srcMobileActive: "/images/mobile/bases_culinarias/yellow_base_detail.svg",
    alt: "Base Amarilla",
    label: "Base culinaria Amarilla",
    description: "Perfecto para mariscos, arroces y platos frescos.",
    detailColor: "#1a1a1a",
  },
  {
    id: "roja",
    colorKey: "rojo",
    src: "/images/web/recetas/base_roja.svg",
    srcActive: "/images/web/recetas/base_roja_detail.svg",
    srcOtherActive: "/images/web/recetas/base_roja_resumida.svg",
    srcMobile: "/images/mobile/bases_culinarias/red_base.svg",
    srcMobileActive: "/images/mobile/bases_culinarias/red_base_detail.svg",
    alt: "Base Roja",
    label: "Base culinaria Roja",
    description: "Perfecto para mariscos, arroces y platos frescos.",
    detailColor: "#fff",
  },
] as const;

interface BasesCulinariasProps {
  productos?: Producto[];
}

export default function BasesCulinarias({ productos = [] }: BasesCulinariasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className={styles.section}>
      {bases.map((base) => {
        const isActive = activeId === base.id;
        const isOtherActive = activeId !== null && !isActive;
        const imageSrc =
          isActive
            ? base.srcActive
            : isOtherActive && base.srcOtherActive
            ? base.srcOtherActive
            : base.src;
        const mobileImageSrc = isActive ? base.srcMobileActive : base.srcMobile;

        const colorHex = COLOR_MAP[base.colorKey];
        const producto = productos.find(
          (p) => p.color?.toUpperCase() === colorHex?.toUpperCase(),
        );
        const labelText = producto?.nombre ?? base.label;
        const descriptionText = producto?.descripcion_corta ?? base.description;

        return (
          <div
            key={base.id}
            className={`${styles.item} ${styles.itemClickable} ${isActive ? styles.itemActive : ""}`}
            onClick={() => setActiveId((prev) => (prev === base.id ? null : base.id))}
          >
            <Image
              src={imageSrc}
              alt={base.alt}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 100vw, 33vw"
              priority
              className={styles.desktopImage}
            />
            <div className={styles.mobileImage}>
              <Image
                src={mobileImageSrc}
                alt={base.alt}
                width={390}
                height={480}
                style={{ width: "100%", height: "auto", display: "block" }}
                priority
              />
            </div>

            {isActive ? (
              <div className={styles.detailOverlay} style={{ color: base.detailColor }}>
                <h3 className={styles.detailTitle}>{base.alt}</h3>
                <p className={styles.detailDescription}>{descriptionText}</p>
              </div>
            ) : (
              <p
                className={`${styles.label} ${isOtherActive ? styles.labelCentered : ""}`}
              >
                {labelText}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
