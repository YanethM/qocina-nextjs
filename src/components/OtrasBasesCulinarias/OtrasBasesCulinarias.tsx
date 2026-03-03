import Image from "next/image";
import Link from "next/link";
import styles from "./OtrasBasesCulinarias.module.css";

export default function OtrasBasesCulinarias() {
  return (
    <section className={styles.section}>
      <h2 className={styles.titulo}>
        Descubre nuestras otras<br />bases culinarias
      </h2>

      <div className={styles.cards}>

        <div className={`${styles.cardRow} ${styles.cardVerde}`}>
          <Image
            src="/images/web/products/product_detail/card_verde.svg"
            alt=""
            fill
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

      </div>
    </section>
  );
}
