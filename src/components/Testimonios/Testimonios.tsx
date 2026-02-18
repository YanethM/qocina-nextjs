"use client";

import Image from "next/image";
import { Testimonio } from "@/types";
import styles from "./Testimonios.module.css";
import { useState, useEffect } from "react";

interface TestimoniosProps {
  testimonios: Testimonio[];
}

export default function Testimonios({ testimonios }: TestimoniosProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [supportsBackdropFilter, setSupportsBackdropFilter] = useState(true);

  useEffect(() => {
    // Detectar soporte de backdrop-filter
    const supports = CSS.supports('backdrop-filter', 'blur(16px)') || 
                     CSS.supports('-webkit-backdrop-filter', 'blur(16px)');
    setSupportsBackdropFilter(supports);
  }, []);

  if (testimonios.length === 0) return null;

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://ec2-23-23-186-243.compute-1.amazonaws.com:1337";

  const getFotoUrl = (testimonio: Testimonio) => {
    if (testimonio.foto_usuario?.url) {
      if (testimonio.foto_usuario.url.startsWith("http")) {
        return testimonio.foto_usuario.url;
      }
      return `${STRAPI_URL}${testimonio.foto_usuario.url}`;
    }
    return null;
  };

  const handleImageError = (testimonioId: number) => {
    setImageErrors((prev) => ({ ...prev, [testimonioId]: true }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className={styles.section}>
      {/* Titulo fuera del background */}
      <h2 className={styles.sectionTitle}>TESTIMONIOS</h2>

      {/* Contenedor con fondo */}
      <div className={styles.backgroundWrapper}>
        {/* Fondo de la sección (imagen con onda verde) */}
        <div className={styles.backgroundImage}>
          <img
            src="/images/web/home/testimonials/testimonials.png"
            alt=""
            className={styles.backgroundImg}
          />
        </div>

        {/* Grid de cards sobre el fondo */}
        <div className={styles.gridWrapper}>
          <div className={styles.grid}>
          {testimonios.map((testimonio, index) => {
            const fotoUrl = getFotoUrl(testimonio);
            const hasImageError = imageErrors[testimonio.id];
            const showImage = fotoUrl && !hasImageError;

            return (
              <div key={testimonio.id} className={styles.card}>
                {/* Foto de fondo del card */}
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
                      unoptimized
                    />
                  ) : (
                    <div className={styles.cardPlaceholder}>
                      <span className={styles.initials}>
                        {getInitials(testimonio.nombre_usuario)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Texto con blur */}
                <div className={styles.cardText}>
                  <div className={styles.stars}>
                    {Array.from({ length: testimonio.rating }, (_, i) => (
                      <span key={i} className={styles.starFilled}>
                        ★
                      </span>
                    ))}
                    {Array.from({ length: 5 - testimonio.rating }, (_, i) => (
                      <span key={`empty-${i}`} className={styles.starEmpty}>
                        ☆
                      </span>
                    ))}
                  </div>
                  <p className={styles.author}>{testimonio.nombre_usuario}</p>
                  <p className={styles.content}>
                    &ldquo;{testimonio.texto_testimonio}&rdquo;
                  </p>
                </div>

                {/* Espacio derecho para la foto */}
                <div className={styles.cardRight}></div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Wave al final de la sección */}
      <div className={styles.waveWrapper}>
        <img
          src="/images/web/home/testimonials/wave_testimonial.png"
          alt=""
          className={styles.waveTestimonial}
        />
        <img
          src="/images/web/home/testimonials/waves_white.png"
          alt=""
          className={styles.wavesWhite}
        />
      </div>
    </section>
  );
}