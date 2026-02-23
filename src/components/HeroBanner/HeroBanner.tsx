"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { HeroSlide } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import styles from "./HeroBanner.module.css";
import Image from "next/image";

export default function HeroBanner({ slides = [] }: { slides?: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];
  const { imagen, imagen_mobile } = slide;

  // Desktop: usar imagen.url directamente como solicitaste
  const bgDesktop = getStrapiImageUrl(imagen?.url);
  
  // Mobile: usar imagen_mobile.url
  const bgMobile = getStrapiImageUrl(imagen_mobile?.url);

  return (
    <section
      className={styles.hero}
      style={{
        ["--hero-bg-desktop" as string]: bgDesktop ? `url(${bgDesktop})` : undefined,
        ["--hero-bg-mobile" as string]: bgMobile ? `url(${bgMobile})` : undefined,
      }}>
      <div className={styles.heroContent}>
        {/* Texto izquierdo */}
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{slide.titulo}</h1>

          {slide.cta && (
            <Link
              href={slide.cta.url}
              className={styles.heroBtn}
              target={slide.cta.nueva_ventana ? "_blank" : "_self"}>
              <span className={styles.heroBtnText}>{slide.cta.texto}</span>
            </Link>
          )}
        </div>

        {/* Slogan derecho */}
        <div className={styles.heroSlogan}>
          <Image
            src="/images/web/home/banner/slogan_qocina.svg"
            alt="ATRÉVETE A QOCINAR CON Q"
            width={277}
            height={225}
            className={styles.sloganImage}
            style={{ height: "auto" }}
            priority
          />
          <Image
            src="/images/web/home/banner/libros.svg"
            alt=""
            width={380}
            height={227}
            className={styles.librosImage}
            style={{ height: "auto" }}
            priority
          />
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}