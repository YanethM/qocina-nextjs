"use client";

import Image from "next/image";
import Link from "next/link";
import { Producto } from "@/types";
import { getStrapiImageUrl, stripHtml } from "@/lib/strapi";
import { useCarousel } from "@/hooks/useCarousel";
import { useSiteCode } from "@/hooks/useSiteCode";
import styles from "./OtrasBasesCulinarias.module.css";

interface Props {
  productos: Producto[];
  locale?: string;
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
  const text = `${producto.slug} ${producto.nombre}`.toLowerCase();
  if (text.includes("verd")) return 0;
  if (text.includes("amarill")) return 1;
  return 2;
}

export default function OtrasBasesCulinarias({ productos, locale }: Props) {
  const siteCode = useSiteCode();
  const { current, goTo, handleTouchStart, handleTouchEnd } = useCarousel(productos.length);
  const isEnglish = locale === "en";
  const ctaText = isEnglish ? "View product" : "Ver producto";

  if (productos.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.titulo}>
        {isEnglish ? <>Discover our other<br />cooking bases</> : <>Descubre nuestras otras<br />bases culinarias</>}
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
              const nombre = stripHtml(producto.nombre);
              const descripcion = stripHtml(producto.descripcion_corta);
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
                          alt={nombre}
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
                        {nombre.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                      </h3>
                      <p className={`${styles.mobileCardDescripcion} ${config.textDark ? styles.cardTextDark : ""}`}>
                        {descripcion}
                      </p>
                      <Link
                        href={`/${siteCode}/productos/${producto.slug}`}
                        className={`${styles.ctaBtn} ${config.textDark ? styles.ctaBtnDark : ""}`}
                      >
                        {ctaText}
                        <Image src={config.arrowSrc} alt="" width={30} height={18} style={{ position: "relative", top: "3.69px", left: "-6px" }} aria-hidden />
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
          const nombre = stripHtml(producto.nombre);
          const descripcion = stripHtml(producto.descripcion_corta);

          const productImg = (
            <div className={`${styles.productWrapper} ${config.wrapperClass}`}>
              {imgSrc && (
                <Image
                  src={imgSrc}
                  alt={nombre}
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
                <h3 className={styles.cardTitulo}>{nombre.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</h3>
                <p className={styles.cardDescripcion}>{descripcion}</p>
              </div>
              <Link href={`/${siteCode}/productos/${producto.slug}`} className={`${styles.ctaBtn} ${config.textDark ? styles.ctaBtnDark : ""}`}>
                {ctaText}
                <Image src={config.arrowSrc} alt="" width={30} height={18} style={{ position: "relative", top: "3.69px", left: "-6px" }} aria-hidden />
              </Link>
            </div>
          ) : (
            <>
              <div className={`${styles.cardText} ${config.textDark ? styles.cardTextDark : ""}`}>
                <h3 className={styles.cardTitulo}>{nombre.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</h3>
                <p className={styles.cardDescripcion}>{descripcion}</p>
              </div>
              <Link href={`/${siteCode}/productos/${producto.slug}`} className={`${styles.ctaBtn} ${config.textDark ? styles.ctaBtnDark : ""}`}>
                {ctaText}
                <Image src={config.arrowSrc} alt="" width={30} height={18} style={{ position: "relative", top: "3.69px", left: "-6px" }} aria-hidden />
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
