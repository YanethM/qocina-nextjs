"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarousel } from "@/hooks/useCarousel";
import styles from "./IngredientesNaturales.module.css";

interface IngredientesNaturalesProps {
  natural_titulo?: string;
  natural_descripcion?: string;
  natural_frase_q?: string;
  natural_cta?: {
    texto: string;
    url: string;
    nueva_ventana: boolean;
  } | null;
}

const images = [
  {
    src: "/images/web/home/ingredientes_naturales/image1.svg",
    alt: "Ingredientes naturales 1",
  },
  {
    src: "/images/web/home/ingredientes_naturales/image2.png",
    alt: "Ingredientes naturales 2",
  },
];

export default function IngredientesNaturales({
  natural_titulo,
  natural_descripcion,
  natural_frase_q,
  natural_cta,
}: IngredientesNaturalesProps) {
  const { current, goTo, handleTouchStart, handleTouchEnd } = useCarousel(
    images.length,
  );

  const ctaText = natural_cta?.texto;
  const ctaUrl = natural_cta?.url ?? "/productos";
  const ctaNuevaVentana = natural_cta?.nueva_ventana ?? false;

  return (
    <section className={styles.section}>
      <div className={styles.desktopContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/web/home/ingredientes_naturales/image1.svg"
            alt="Ingredientes naturales 1"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.gridImage}
            priority
          />
          {natural_frase_q && (
            <p className={styles.naturalFraseQ}>{natural_frase_q}</p>
          )}
        </div>

        <div className={styles.imageWrapper2}>
          <img
            src="/images/web/home/ingredientes_naturales/image2.png"
            alt="Ingredientes naturales 2"
            className={styles.image2}
          />
          <div className={styles.contentOverlay}>
            {natural_titulo && <h2 className={styles.overlayTitle}>{natural_titulo}</h2>}
            {natural_descripcion && <p className={styles.overlayDescription}>{natural_descripcion}</p>}
            {ctaText && (
              <Link
                href={ctaUrl}
                className={styles.ctaButton} data-btn="dark"
                target={ctaNuevaVentana ? "_blank" : "_self"}
                rel={ctaNuevaVentana ? "noopener noreferrer" : undefined}>
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div
        className={styles.mobileSlider}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        <div
          className={styles.sliderTrack}
          style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === 1 ? styles.slide2 : ""}`}>
              {index === 1 ? (
                <div className={styles.mobileImageContainer}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={778}
                    height={1079}
                    className={styles.slideImage}
                    style={{ height: "auto" }}
                  />
                  <div className={styles.mobileContentOverlay}>
                    {natural_titulo && <h2 className={styles.mobileOverlayTitle}>{natural_titulo}</h2>}
                    {natural_descripcion && <p className={styles.mobileOverlayDescription}>{natural_descripcion}</p>}
                    {ctaText && (
                      <Link
                        href={ctaUrl}
                        className={styles.ctaButton} data-btn="dark"
                        target={ctaNuevaVentana ? "_blank" : "_self"}
                        rel={ctaNuevaVentana ? "noopener noreferrer" : undefined}>
                        {ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles.mobileImageContainer}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={660}
                    height={887}
                    className={styles.slideImage}
                    style={{ height: "auto" }}
                    priority
                  />
                  {natural_frase_q && (
                    <p className={styles.naturalFraseQ}>{natural_frase_q}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.dotsContainer}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === current ? styles.dotActive : ""}`}
              onClick={() => goTo(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
