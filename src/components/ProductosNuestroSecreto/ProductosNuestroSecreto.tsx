"use client";

import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiImage, SecretoSeccion } from "@/types";
import styles from "./ProductosNuestroSecreto.module.css";

interface Props {
  titulo?: string | null;
  secretoImagen?: StrapiImage | null;
  secciones?: SecretoSeccion[] | null;
}

export default function ProductosNuestroSecreto({ titulo, secretoImagen, secciones }: Props) {
  const defaultOpen =
    secciones?.find((s) => s.expandida_por_defecto)?.id ?? secciones?.[0]?.id ?? 0;
  const [openId, setOpenId] = useState<number>(defaultOpen);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? 0 : id));
  };

  const imageUrl =
    secretoImagen?.url ??
    secretoImagen?.formats?.large?.url ??
    secretoImagen?.formats?.medium?.url ??
    secretoImagen?.formats?.small?.url;
  const imageSrc = imageUrl ? getStrapiImageUrl(imageUrl) : null;
  const imageAlt = secretoImagen?.alternativeText ?? "Nuestro secreto del sabor";

  if (!secciones || secciones.length === 0) return null;

  return (
    <section className={styles.section}>
      {titulo && <h2 className={styles.title}>{titulo}</h2>}

      <div className={styles.body}>
        {imageSrc && (
          <div className={styles.imageWrapper}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 900px) 100vw, (max-width: 1200px) 480px, 611px"
              className={styles.image}
              quality={90}
            />
          </div>
        )}

        <div className={styles.accordion}>
          {secciones.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className={styles.accordionItem}>
                <button
                  className={styles.accordionHeader}
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.accordionTitle}>{item.titulo}</span>
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
                    <ReactMarkdown>{item.contenido}</ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

