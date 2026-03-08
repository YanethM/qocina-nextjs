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
    src: "/images/web/home/ingredientes_naturales/image2.png",
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
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.gridImage}
            priority
          />
        </div>

        <div className={styles.imageWrapper2}>
          <img
            src="/images/web/home/ingredientes_naturales/image2.png"
            alt="Ingredientes naturales 2"
            className={styles.image2}
          />
          <div className={styles.contentOverlay}>
            <h2 className={styles.overlayTitle}>
              Ingredientes y procesos a la altura de los grandes sabores.
            </h2>
            <p className={styles.overlayDescription}>
              Nuestras bases culinarias están elaboradas con verduras 100%
              naturales y se procesan bajo los más altos estándares de calidad,
              como en los restaurantes de alta cocina.
            </p>
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
                    <h2 className={styles.mobileOverlayTitle}>
                      Ingredientes y procesos a la altura de los grandes
                      sabores.
                    </h2>
                    <p className={styles.mobileOverlayDescription}>
                      Nuestras bases culinarias están elaboradas con verduras
                      100% naturales y se procesan bajo los más altos estándares
                      de calidad, como en los restaurantes de alta cocina.
                    </p>
                    <Link
                      href={ctaUrl}
                      className={styles.ctaButton}
                      target={ctaNuevaVentana ? "_blank" : "_self"}
                      rel={
                        ctaNuevaVentana ? "noopener noreferrer" : undefined
                      }>
                      {ctaText}
                    </Link>
                  </div>
                </div>
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={660}
                  height={887}
                  className={styles.slideImage}
                  style={{ height: "auto" }}
                  priority
                />
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
