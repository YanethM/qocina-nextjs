"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./BasesCulinarias.module.css";

const bases = [
  {
    id: "verde",
    src: "/images/web/recetas/base_verde.svg",
    srcActive: "/images/web/recetas/base_verde_detail.svg",
    alt: "Base Verde",
    triggersActive: true,
  },
  {
    id: "amarilla",
    src: "/images/web/recetas/base_amarilla.svg",
    srcActive: "/images/web/recetas/base_amarilla_verde_detail.svg",
    alt: "Base Amarilla",
    triggersActive: false,
  },
  {
    id: "roja",
    src: "/images/web/recetas/base_roja.svg",
    srcActive: "/images/web/recetas/base_roja_verde_detail.svg",
    alt: "Base Roja",
    triggersActive: false,
  },
];

export default function BasesCulinarias() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.section}>
      {bases.map((base) => (
        <div
          key={base.id}
          className={`${styles.item} ${base.triggersActive ? styles.itemClickable : ""} ${base.triggersActive && expanded ? styles.itemActive : ""}`}
          onClick={() => {
            if (base.triggersActive) setExpanded((prev) => !prev);
          }}
        >
          <Image
            src={expanded ? base.srcActive : base.src}
            alt={base.alt}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, 33vw"
            priority
          />
        </div>
      ))}
    </section>
  );
}
