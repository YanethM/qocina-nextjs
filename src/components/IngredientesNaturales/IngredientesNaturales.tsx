"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarousel } from "@/hooks/useCarousel";
import styles from "./IngredientesNaturales.module.css";

interface IngredientesNaturalesProps {
  natural_cta?: {
    id: number;
    texto: string;
    url: string;
    nueva_ventana: boolean;
  };
}

const images = [
  {
    src: "/images/web/home/ingredientes_naturales/image1.svg",
    alt: "Ingredientes naturales 1",
  },
  {
    src: "/images/web/home/ingredientes_naturales/image1.svg",
    alt: "Ingredientes naturales 2",
  },
];

export default function IngredientesNaturales({
  natural_cta,
}: IngredientesNaturalesProps) {
  const { current, goTo, handleTouchStart, handleTouchEnd } = useCarousel(
    images.length,
  );

  const ctaText = natural_cta?.texto || "Explora nuestras bases culinarias";
  const ctaUrl = natural_cta?.url || "/productos";
  const ctaNuevaVentana = natural_cta?.nueva_ventana || false;

  return (
    <section className={styles.section}>
      <div className={styles.desktopContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/web/home/ingredientes_naturales/image1.svg"
            alt="Ingredientes naturales 1"
            fill
            className={styles.gridImage}
            sizes="(max-width: 1024px) 44vw, 660px"
            priority
          />
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/images/web/home/ingredientes_naturales/image1.svg"
            alt="Ingredientes naturales 2"
            fill
            className={styles.gridImage}
            sizes="(max-width: 1024px) 44vw, 660px"
            priority
          />
          <div className={styles.buttonOverlay}>
            <Link
              href={ctaUrl}
              className={styles.ctaButton}
              target={ctaNuevaVentana ? "_blank" : "_self"}
              rel={ctaNuevaVentana ? "noopener noreferrer" : undefined}>
              {ctaText}
            </Link>
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
            <div key={index} className={styles.slide}>
              <Image
                src={image.src}
                alt={image.alt}
                width={660}
                height={887}
                className={styles.slideImage}
                style={{ height: "auto" }}
                priority={index === 0}
              />
              {index === 1 && (
                <div className={styles.mobileButtonContainer}>
                  <Link
                    href={ctaUrl}
                    className={styles.ctaButton}
                    target={ctaNuevaVentana ? "_blank" : "_self"}
                    rel={ctaNuevaVentana ? "noopener noreferrer" : undefined}>
                    {ctaText}
                  </Link>
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
