"use client";

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { CategoriaFaq, PreguntaFrecuente } from "@/types";
import styles from "./FaqClient.module.css";

interface Props {
  categorias: CategoriaFaq[];
  todas: PreguntaFrecuente[];
  preguntasPorCategoria: Record<string, PreguntaFrecuente[]>;
  ctaCargarMas: string;
}

const PAGE_SIZE = 5;

export default function FaqClient({ categorias, todas, preguntasPorCategoria, ctaCargarMas }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  const sinCategoria = todas.filter(
    (p) => !categorias.some((cat) => preguntasPorCategoria[cat.slug]?.find((q) => q.id === p.id))
  );

  const allItems: PreguntaFrecuente[] = [
    ...categorias.flatMap((cat) => preguntasPorCategoria[cat.slug] ?? []),
    ...sinCategoria,
  ];

  const visibleItems = allItems.slice(0, visible);
  const hasMore = visible < allItems.length;

  const renderItems = (items: PreguntaFrecuente[]) =>
    items.map((item) => {
      const isOpen = openId === item.id;
      return (
        <div key={item.id} className={styles.accordionItem}>
          <button
            className={styles.accordionHeader}
            onClick={() => toggle(item.id)}
            aria-expanded={isOpen}
          >
            <span className={styles.accordionTitle}>{item.pregunta}</span>
            <span className={styles.arrowBtn}>
              <Image
                src={
                  isOpen
                    ? "/images/web/products/arrow_button_up.svg"
                    : "/images/web/products/arrow_button_down.svg"
                }
                alt={isOpen ? "Cerrar" : "Abrir"}
                width={40}
                height={40}
              />
            </span>
          </button>
          {isOpen && (
            <div className={styles.accordionContent}>
              <hr className={styles.divider} />
              <ReactMarkdown>{item.respuesta}</ReactMarkdown>
            </div>
          )}
        </div>
      );
    });

  return (
    <div className={styles.wrapper}>
      {categorias.map((cat) => {
        const catItems = (preguntasPorCategoria[cat.slug] ?? []).filter((p) =>
          visibleItems.some((v) => v.id === p.id)
        );
        if (catItems.length === 0) return null;
        return (
          <div key={cat.id} className={styles.section}>
            <h2 className={styles.categoryTitle}>{cat.nombre}</h2>
            <div className={styles.accordion}>{renderItems(catItems)}</div>
          </div>
        );
      })}

      {sinCategoria.filter((p) => visibleItems.some((v) => v.id === p.id)).length > 0 && (
        <div className={styles.section}>
          <div className={styles.accordion}>
            {renderItems(sinCategoria.filter((p) => visibleItems.some((v) => v.id === p.id)))}
          </div>
        </div>
      )}

      {hasMore && (
        <div className={styles.loadMoreRow}>
          <button className={styles.loadMoreBtn} onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            {ctaCargarMas}
          </button>
        </div>
      )}
    </div>
  );
}
