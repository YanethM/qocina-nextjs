"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./BasesCulinarias.module.css";

const bases = [
  {
    id: "verde",
    src: "/images/web/recetas/base_verde.svg",
    srcActive: "/images/web/recetas/base_verde_detail.svg",
    srcOtherActive: undefined,
    srcMobile: "/images/mobile/recetas/base_verde.svg",
    srcMobileActive: "/images/mobile/recetas/base_verde_detail.svg",
    alt: "Base Verde",
    label: "Base culinaria Verde",
    labelColor: "#fff",
    description: "Perfecto para mariscos, arroces y platos frescos.",
    descriptionColor: "#fff",
  },
  {
    id: "amarilla",
    src: "/images/web/recetas/base_amarilla.svg",
    srcActive: "/images/web/recetas/base_amarilla_detail.svg",
    srcOtherActive: "/images/web/recetas/base_amarilla_verde_detail.svg",
    srcMobile: "/images/mobile/recetas/base_amarilla.svg",
    srcMobileActive: "/images/mobile/recetas/base_amarilla_detail.svg",
    alt: "Base Amarilla",
    label: "Base culinaria Amarilla",
    labelColor: "#000",
    description: "Perfecto para mariscos, arroces y platos frescos.",
    descriptionColor: "#000",
  },
  {
    id: "roja",
    src: "/images/web/recetas/base_roja.svg",
    srcActive: "/images/web/recetas/base_roja_detail.svg",
    srcOtherActive: undefined,
    srcMobile: "/images/mobile/recetas/base_roja.svg",
    srcMobileActive: "/images/mobile/recetas/base_roja_detail.svg",
    alt: "Base Roja",
    label: "Base culinaria Roja",
    labelColor: "#fff",
    description: "Perfecto para mariscos, arroces y platos frescos.",
    descriptionColor: "#fff",
  },
];

export default function BasesCulinarias() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className={styles.section}>
      {bases.map((base) => {
        const isActive = activeId === base.id;
        const imageSrc =
          isActive
            ? base.srcActive
            : activeId !== null && base.srcOtherActive
            ? base.srcOtherActive
            : base.src;
        const mobileImageSrc = isActive ? base.srcMobileActive : base.srcMobile;

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
            {isActive && (
              <div className={styles.desktopOverlay}>
                <div className={styles.desktopOverlayContent}>
                  <p className={styles.desktopLabel} style={{ color: base.labelColor }}>{base.label}</p>
                  <p className={styles.desktopDescription} style={{ color: base.descriptionColor }}>{base.description}</p>
                </div>
              </div>
            )}
            <div className={styles.mobileImage}>
              <div className={`${styles.mobileOverlay} ${isActive ? styles.mobileOverlayActive : ""}`}>
                <p className={styles.mobileLabel} style={{ color: base.labelColor }}>{base.label}</p>
                {isActive && (
                  <p className={styles.mobileDescription} style={{ color: base.descriptionColor }}>{base.description}</p>
                )}
              </div>
              <Image
                src={mobileImageSrc}
                alt={base.alt}
                width={390}
                height={480}
                style={{ width: "100%", height: "auto", display: "block" }}
                priority
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
