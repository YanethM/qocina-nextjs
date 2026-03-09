"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarousel } from "@/hooks/useCarousel";
import styles from "./OtrasBasesCulinarias.module.css";

const mobileSlides = [
  { src: "/images/mobile/products/product_detail/card_verde.svg", alt: "Base Verde" },
  { src: "/images/mobile/products/product_detail/card_amarillo.svg", alt: "Base Amarillo" },
  { src: "/images/mobile/products/product_detail/card_rojo.svg", alt: "Base Roja" },
];

export default function OtrasBasesCulinarias() {
  const { current, goTo, handleTouchStart, handleTouchEnd } = useCarousel(mobileSlides.length);

  return (
    <section className={styles.section}>
      <h2 className={styles.titulo}>
        Descubre nuestras otras<br />bases culinarias
      </h2>

      <div className={styles.mobileCards}>
        <div
          className={styles.mobileSlider}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={styles.mobileTrack}
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {mobileSlides.map((slide, i) => (
              <div key={i} className={styles.mobileSlide}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={335}
                  height={200}
                  className={styles.mobileCard}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mobileDots}>
          {mobileSlides.map((_, i) => (
            <button
              key={i}
              className={`${styles.mobileDot} ${i === current ? styles.mobileDotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.cards}>

        <div className={`${styles.cardRow} ${styles.cardVerde}`}>
          <Image
            src="/images/web/products/product_detail/card_verde.svg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.cardBg}
            style={{ objectFit: "fill" }}
            aria-hidden
          />

          <div className={`${styles.productWrapper} ${styles.productWrapperVerde}`}>
            <Image
              src="/images/web/products/product_detail/product1.svg"
              alt="Base verde"
              width={209}
              height={263}
              className={styles.productImg}
            />
          </div>

          <div className={styles.cardText}>
            <h3 className={styles.cardTitulo}>Base Verde</h3>
            <p className={styles.cardDescripcion}>
              La más clásica. Concentra el sabor casero con ajos y cebollas
              caramelizadas, cilantro fresco, ají amarillo peruano, chicha de
              jora y zapallo loche.
            </p>
          </div>

          <Link href="/productos" className={styles.ctaBtn}>
            Ver producto
            <Image
              src="/images/web/home/white_arrow_right.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
            />
          </Link>
        </div>

        <div className={`${styles.cardRow} ${styles.cardAmarillo}`}>
          <Image
            src="/images/web/products/product_detail/card_amarillo.svg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.cardBg}
            style={{ objectFit: "fill" }}
            aria-hidden
          />

          <div className={styles.cardContentAmarillo}>
            <div className={`${styles.cardText} ${styles.cardTextDark}`}>
              <h3 className={styles.cardTitulo}>Base Amarillo</h3>
              <p className={styles.cardDescripcion}>
                La más atrevida. Concentra el sabor casero con ajos y cebollas
                caramelizadas, ají amarillo peruano, ají mirasol y orégano para
                sorprender al primer bocado.
              </p>
            </div>

            <Link href="/productos" className={`${styles.ctaBtn} ${styles.ctaBtnDark}`}>
              Ver producto
              <Image
                src="/images/web/home/arrow_right.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden
              />
            </Link>
          </div>

          <div className={styles.productWrapper}>
            <Image
              src="/images/web/products/product_detail/product2.svg"
              alt="Base amarillo"
              width={209}
              height={263}
              className={styles.productImg}
            />
          </div>
        </div>

        <div className={`${styles.cardRow} ${styles.cardRojo}`}>
          <Image
            src="/images/web/products/product_detail/card_rojo.svg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.cardBg}
            style={{ objectFit: "fill" }}
            aria-hidden
          />

          <div className={`${styles.productWrapper} ${styles.productWrapperVerde}`}>
            <Image
              src="/images/web/products/product_detail/product3.svg"
              alt="Base roja"
              width={209}
              height={263}
              className={styles.productImg}
            />
          </div>

          <div className={styles.cardText}>
            <h3 className={styles.cardTitulo}>Base Roja</h3>
            <p className={styles.cardDescripcion}>
              La más versátil. Concentra del delicioso sabor del tomate, achiote
              y ají panka, cocidos sobre ajos y cebollas sofritas a punto de
              caramelización y su toque de orégano.
            </p>
          </div>

          <Link href="/productos" className={styles.ctaBtn}>
            Ver producto
            <Image
              src="/images/web/home/white_arrow_right.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
            />
          </Link>
        </div>

      </div>
    </section>
  );
}
