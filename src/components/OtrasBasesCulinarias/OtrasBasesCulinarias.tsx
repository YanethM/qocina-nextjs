"use client";

import Image from "next/image";
import Link from "next/link";
import { Producto } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import { useCarousel } from "@/hooks/useCarousel";
import styles from "./OtrasBasesCulinarias.module.css";

interface Props {
  productos: Producto[];
}

const cardConfigs = [
  {
    bgSrc: "/images/web/products/product_detail/card_verde.svg",
    mobileBgSrc: "/images/mobile/products/product_detail/card_verde.svg",
    rowClass: styles.cardVerde,
    wrapperClass: styles.productWrapperVerde,
    textDark: false,
    arrowSrc: "/images/web/home/white_arrow_right.svg",
    reversed: false,
  },
  {
    bgSrc: "/images/web/products/product_detail/card_amarillo.svg",
    mobileBgSrc: "/images/mobile/products/product_detail/card_amarillo.svg",
    rowClass: styles.cardAmarillo,
    wrapperClass: styles.productWrapperVerde,
    textDark: true,
    arrowSrc: "/images/web/home/arrow_right.svg",
    reversed: true,
  },
  {
    bgSrc: "/images/web/products/product_detail/card_rojo.svg",
    mobileBgSrc: "/images/mobile/products/product_detail/card_rojo.svg",
    rowClass: styles.cardRojo,
    wrapperClass: styles.productWrapperVerde,
    textDark: false,
    arrowSrc: "/images/web/home/white_arrow_right.svg",
    reversed: false,
  },
];

function getConfigIndex(producto: Producto): number {
  const slug = producto.slug.toLowerCase();
  if (slug.includes("chupe")) return 0;
  if (slug.includes("sofrito")) return 1;
  return 2;
}

export default function OtrasBasesCulinarias({ productos }: Props) {
  const { current, goTo, handleTouchStart, handleTouchEnd } = useCarousel(productos.length);

  if (productos.length === 0) return null;

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
            {productos.map((producto) => {
              const config = cardConfigs[getConfigIndex(producto)];
              const imgSrc = producto.imagen_principal?.url
                ? getStrapiImageUrl(producto.imagen_principal.url)
                : null;
              return (
                <div key={producto.id} className={styles.mobileSlide}>
                  <div className={`${styles.mobileCard} ${config.rowClass}`}>
                    <Image
                      src={config.mobileBgSrc}
                      alt=""
                      fill
                      className={styles.cardBg}
                      style={{ objectFit: "fill" }}
                      aria-hidden
                    />
                    {imgSrc && (
                      <div className={styles.mobileImgWrapper}>
                        <Image
                          src={imgSrc}
                          alt={producto.nombre}
                          width={220}
                          height={270}
                          className={styles.mobileProductImg}
                          style={{ objectFit: "contain" }}
                          unoptimized
                        />
                      </div>
                    )}
                    <div className={styles.mobileCardContent}>
                      <h3 className={`${styles.mobileCardTitulo} ${config.textDark ? styles.cardTextDark : ""}`}>
                        {producto.nombre}
                      </h3>
                      <p className={`${styles.mobileCardDescripcion} ${config.textDark ? styles.cardTextDark : ""}`}>
                        {producto.descripcion_corta}
                      </p>
                      <Link
                        href={`/productos/${producto.slug}`}
                        className={`${styles.ctaBtn} ${config.textDark ? styles.ctaBtnDark : ""}`}
                      >
                        Ver producto
                        <Image src={config.arrowSrc} alt="" width={16} height={16} aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.mobileDots}>
          {productos.map((_, i) => (
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
        {productos.map((producto) => {
          const config = cardConfigs[getConfigIndex(producto)];
          const imgSrc = producto.imagen_principal?.url
            ? getStrapiImageUrl(producto.imagen_principal.url)
            : null;

          const productImg = (
            <div className={`${styles.productWrapper} ${config.wrapperClass}`}>
              {imgSrc && (
                <Image
                  src={imgSrc}
                  alt={producto.nombre}
                  width={209}
                  height={263}
                  className={styles.productImg}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              )}
            </div>
          );

          const textAndBtn = config.reversed ? (
            <div className={styles.cardContentAmarillo}>
              <div className={`${styles.cardText} ${config.textDark ? styles.cardTextDark : ""}`}>
                <h3 className={styles.cardTitulo}>{producto.nombre}</h3>
                <p className={styles.cardDescripcion}>{producto.descripcion_corta}</p>
              </div>
              <Link href={`/productos/${producto.slug}`} className={`${styles.ctaBtn} ${config.textDark ? styles.ctaBtnDark : ""}`}>
                Ver producto
                <Image src={config.arrowSrc} alt="" width={20} height={20} aria-hidden />
              </Link>
            </div>
          ) : (
            <>
              <div className={`${styles.cardText} ${config.textDark ? styles.cardTextDark : ""}`}>
                <h3 className={styles.cardTitulo}>{producto.nombre}</h3>
                <p className={styles.cardDescripcion}>{producto.descripcion_corta}</p>
              </div>
              <Link href={`/productos/${producto.slug}`} className={`${styles.ctaBtn} ${config.textDark ? styles.ctaBtnDark : ""}`}>
                Ver producto
                <Image src={config.arrowSrc} alt="" width={20} height={20} aria-hidden />
              </Link>
            </>
          );

          return (
            <div key={producto.id} className={`${styles.cardRow} ${config.rowClass}`}>
              <Image
                src={config.bgSrc}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.cardBg}
                style={{ objectFit: "fill" }}
                aria-hidden
              />
              {config.reversed ? (
                <>
                  {textAndBtn}
                  {productImg}
                </>
              ) : (
                <>
                  {productImg}
                  {textAndBtn}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
