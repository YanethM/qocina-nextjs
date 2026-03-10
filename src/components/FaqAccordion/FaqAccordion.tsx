"use client";

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { PreguntaFrecuente } from "@/types";
import styles from "./FaqAccordion.module.css";

interface Props {
  items: PreguntaFrecuente[];
}

export default function FaqAccordion({ items }: Props) {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
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
      })}
    </div>
  );
}
