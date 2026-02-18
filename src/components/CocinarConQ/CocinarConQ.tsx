import Image from "next/image";
import { Button } from "@/components/ui";
import styles from "./CocinarConQ.module.css";

export default function CocinarConQ() {
  return (
    <section className={styles.cocinarConQ}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/web/home/home_cocinar_con_q.png"
          alt="Cocinar con Q'ocina"
          width={1920}
          height={400}
          className={styles.mainImage}
          priority={false}
        />
        <Image
          src="/images/mobile/cocinar/cocinar_con_q.png"
          alt="Cocinar con Q'ocina"
          width={390}
          height={500}
          className={styles.mainImageMobile}
          priority={false}
        />
        <div className={styles.waveTop}>
          <Image
            src="/images/web/home/wave_cocinar_con_q.png"
            alt=""
            width={1920}
            height={200}
            style={{ width: '100%', height: 'auto' }}
            priority={false}
          />
          <div className={styles.contentWrapper}>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/web/home/logo_cocinar_con_q.png"
                alt="Cocinar con Q"
                width={400}
                height={200}
                className={styles.logo}
                priority={false}
              />
            </div>
            <div className={styles.textWrapper}>
              <p className={styles.description}>
                Nuestras bases culinarias recuperan los secretitos de las cocinas de nuestras madres y abuelas.
              </p>
              <Button href="/quienes-somos" variant="yellow">
                Conoce nuestra historia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
