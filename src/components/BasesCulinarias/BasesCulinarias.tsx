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
    alt: "Base Verde",
  },
  {
    id: "amarilla",
    src: "/images/web/recetas/base_amarilla.svg",
    srcActive: "/images/web/recetas/base_amarilla_detail.svg",
    srcOtherActive: "/images/web/recetas/base_amarilla_verde_detail.svg",
    alt: "Base Amarilla",
  },
  {
    id: "roja",
    src: "/images/web/recetas/base_roja.svg",
    srcActive: "/images/web/recetas/base_roja_detail.svg",
    srcOtherActive: undefined,
    alt: "Base Roja",
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
            />
          </div>
        );
      })}
    </section>
  );
}
