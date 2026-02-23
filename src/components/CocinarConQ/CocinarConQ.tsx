import Image from "next/image";
import { Button } from "@/components/ui";
import styles from "./CocinarConQ.module.css";

export default function CocinarConQ() {
  return (
    <section className={styles.cocinarConQ}>
      <div className={styles.imageWrapper}>
        {/* Imagen Desktop de fondo */}
        <Image
          src="/images/web/home/cocinar/home_cocinar_con_q.svg"
          alt="Cocinar con Q'ocina"
          width={1920}
          height={400}
          className={styles.mainImage}
          priority={false}
        />
        
        {/* Wave superior decorativa */}
        <div className={styles.waveTop}>
          <Image
            src="/images/web/home/cocinar/wave_cocinar_con_q.svg"
            alt=""
            width={1920}
            height={200}
            style={{ width: '100%', height: 'auto' }}
            priority={false}
          />
        </div>

        {/* Contenido Desktop */}
        <div className={styles.desktopContent}>
          {/* Logo */}
          <div className={styles.logoWrapper}>
            <Image
              src="/images/web/home/cocinar/logo_cocinar_con_q.svg"
              alt="Cocinar con Q"
              width={263}
              height={180}
              className={styles.logo}
              priority={false}
            />
          </div>
          
          {/* Texto y botón - layout de 650x124 */}
          <div className={styles.textButtonWrapper}>
            <p className={styles.description}>
              Nuestras bases culinarias recuperan los secretitos de las cocinas de nuestras madres y abuelas.
            </p>
            <Button href="/quienes-somos" variant="yellow" className={styles.desktopBtn}>
              Conoce nuestra historia
            </Button>
          </div>
        </div>
        
        {/* Imagen Mobile */}
        <div className={styles.mobileImageContainer}>
          <Image
            src="/images/mobile/cocinar/wave_cocinar_con_q.svg"
            alt="Cocinar con Q'ocina"
            width={390}
            height={500}
            className={styles.mainImageMobile}
            priority={false}
          />
          
          {/* Contenido móvil */}
          <div className={styles.mobileContent}>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/web/home/cocinar/logo_cocinar_con_q.svg"
                alt="Cocinar con Q"
                width={263}
                height={180}
                className={styles.logo}
                priority={false}
              />
            </div>
            
            <div className={styles.textWrapper}>
              <p className={styles.description}>
                Nuestras bases culinarias recuperan los secretitos de las cocinas de nuestras madres y abuelas.
              </p>
            </div>
            
            <div className={styles.buttonWrapper}>
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