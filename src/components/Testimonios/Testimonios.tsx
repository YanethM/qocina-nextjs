"use client";

import Image from "next/image";
import { Testimonio } from "@/types";
import { getStrapiImageUrl } from "@/lib/strapi";
import styles from "./Testimonios.module.css";
import { useState } from "react";
import { useCarousel } from "@/hooks/useCarousel";

interface TestimoniosProps {
  testimonios: Testimonio[];
  testimonios_titulo?: string;
  waveImage?: string;
}

export default function Testimonios({ testimonios, testimonios_titulo, waveImage = "/images/web/home/testimonials/testimonials.svg" }: TestimoniosProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const hasSingleRow = testimonios.length <= 2;
  const { current, goTo, handleTouchStart, handleTouchEnd } = useCarousel(
    testimonios.length,
  );

  if (testimonios.length === 0) return null;

  const handleImageError = (testimonioId: number) => {
    setImageErrors((prev) => ({ ...prev, [testimonioId]: true }));
  };

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const abbreviateName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return name;
    return `${parts[0]} ${parts.slice(1).map((p) => `${p[0]}.`).join(" ")}`;
  };

  return (
    <section className={styles.section}>
      {testimonios_titulo && <h2 className={styles.sectionTitle}>{testimonios_titulo}</h2>}

      <div className={styles.visualLayer}>
        <div className={styles.bgImage}>
          <Image
            src={waveImage}
            alt=""
            width={1920}
            height={900}
            className={styles.bgImg}
            priority={false}
            unoptimized
          />
        </div>

        <div className={styles.contentLayer}>
          <div
            className={styles.backgroundWrapper}
            data-single-row={hasSingleRow ? "true" : "false"}>
            <div className={styles.gridWrapper}>
              <div
                className={styles.grid}
                data-count={testimonios.length}
                data-single-row={hasSingleRow ? "true" : "false"}>
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

                      <div className={styles.cardText}>
                        <div className={styles.stars}>
                          {Array.from({ length: testimonio.rating }, (_, i) => (
                            <span key={i} className={styles.starFilled}>★</span>
                          ))}
                          {Array.from({ length: 5 - testimonio.rating }, (_, i) => (
                            <span key={`empty-${i}`} className={styles.starEmpty}>☆</span>
                          ))}
                        </div>
                        <p className={styles.author}>{abbreviateName(testimonio.nombre_usuario)}</p>
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
        </div>
      </div>

      <div className={styles.mobileSection}>
        <Image
          src="/images/mobile/testimonials/testimonials_waves.svg"
          alt=""
          fill
          className={styles.mobileBg}
          style={{ objectFit: "cover" }}
        />

        <div
          className={styles.mobileSlider}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}>
          <div
            className={styles.sliderTrack}
            style={{ transform: `translateX(-${current * 100}vw)` }}>
            {testimonios.map((testimonio, index) => {
              const fotoUrl = getStrapiImageUrl(testimonio.foto_usuario?.url);
              const showImage = fotoUrl && !imageErrors[testimonio.id];

              return (
                <div key={testimonio.id} className={styles.slide}>
                  <div className={styles.mobileCard}>
                    <div className={styles.cardBg}>
                      {showImage ? (
                        <Image
                          src={fotoUrl}
                          alt={testimonio.nombre_usuario}
                          fill
                          className={styles.cardBgImage}
                          sizes="289px"
                          priority={index === 0}
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

                    <div className={styles.mobileCardText}>
                      <div className={styles.stars}>
                        {Array.from({ length: testimonio.rating }, (_, i) => (
                          <span key={i} className={styles.starFilled}>★</span>
                        ))}
                        {Array.from({ length: 5 - testimonio.rating }, (_, i) => (
                          <span key={`empty-${i}`} className={styles.starEmpty}>☆</span>
                        ))}
                      </div>
                      <p className={styles.author}>{abbreviateName(testimonio.nombre_usuario)}</p>
                      <p className={styles.content}>
                        &ldquo;{testimonio.texto_testimonio}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.dotsContainer}>
            {testimonios.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === current ? styles.dotActive : ""}`}
                onClick={() => goTo(index)}
                aria-label={`Ir a testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
