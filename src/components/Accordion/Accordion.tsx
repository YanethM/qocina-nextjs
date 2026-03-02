"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Abre un item por defecto */
  defaultOpen?: string;
}

export default function Accordion({ items, defaultOpen }: AccordionProps) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  const toggle = (key: string) =>
    setOpen((prev) => (prev === key ? null : key));

  return (
    <div className={styles.list}>
      {items.map(({ key, label, content }) => (
        <div key={key} className={styles.item}>
          <button
            className={styles.header}
            onClick={() => toggle(key)}
            aria-expanded={open === key}
          >
            <span>{label}</span>
            <Image
              src={
                open === key
                  ? "/images/web/products/arrow_button_up.svg"
                  : "/images/web/products/arrow_button_down.svg"
              }
              alt=""
              width={36}
              height={36}
              aria-hidden
            />
          </button>
          {open === key && (
            <div className={styles.body}>{content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
