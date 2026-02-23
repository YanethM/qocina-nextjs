"use client";

import Image from "next/image";
import { Testimonio } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import styles from "./Testimonios.module.css";
import { useState } from "react";

interface TestimoniosProps {
  testimonios: Testimonio[];
}

export default function Testimonios({ testimonios }: TestimoniosProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  if (testimonios.length === 0) return null;

  const handleImageError = (testimonioId: number) => {
    setImageErrors((prev) => ({ ...prev, [testimonioId]: true }));
  };

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>TESTIMONIOS</h2>

      <div className={styles.backgroundWrapper}>
        <div className={styles.gridWrapper}>
          <div className={styles.grid}>
            {testimonios.map((testimonio, index) => {
              const fotoUrl = getStrapiImageUrl(testimonio.foto_usuario?.url);
              const showImage = fotoUrl && !imageErrors[testimonio.id];

              return (
                <div key={testimonio.id} className={styles.card}>
                  <div className={styles.cardBg}>
                    {showImage ? (
                      <Image
                        src={fotoUrl}
                        alt={testimonio.nombre_usuario}
                        fill
                        className={styles.cardBgImage}
                        sizes="424px"
                        priority={index < 2}
                        onError={() => handleImageError(testimonio.id)}
                      />
                    ) : (
                      <div className={styles.cardPlaceholder}>
                        <span className={styles.initials}>
                          {getInitials(testimonio.nombre_usuario)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardText}>
                    <div className={styles.stars}>
                      {Array.from({ length: testimonio.rating }, (_, i) => (
                        <span key={i} className={styles.starFilled}>★</span>
                      ))}
                      {Array.from({ length: 5 - testimonio.rating }, (_, i) => (
                        <span key={`empty-${i}`} className={styles.starEmpty}>☆</span>
                      ))}
                    </div>
                    <p className={styles.author}>{testimonio.nombre_usuario}</p>
                    <p className={styles.content}>
                      &ldquo;{testimonio.texto_testimonio}&rdquo;
                    </p>
                  </div>

                  <div className={styles.cardRight} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.waveWrapper}>
        <Image
          src="/images/web/home/testimonials/wave_testimonial.png"
          alt=""
          width={1440}
          height={280}
          className={styles.waveTestimonial}
          style={{ width: "100%", height: "auto" }}
        />
        <Image
          src="/images/web/home/testimonials/waves_white.png"
          alt=""
          width={1440}
          height={100}
          className={styles.wavesWhite}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </section>
  );
}
