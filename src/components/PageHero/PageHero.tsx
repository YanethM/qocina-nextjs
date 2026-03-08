import Image from "next/image";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  backgroundImage?: string;
  backgroundAlt?: string;
  children?: React.ReactNode;
}

export default function PageHero({ backgroundImage, backgroundAlt = "", children }: PageHeroProps) {
  return (
    <div className={styles.hero}>
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={backgroundAlt}
          fill
          className={styles.bgImage}
          sizes="100vw"
          priority
        />
      )}
      <div className={styles.waveOverlay}>
        <img
          src="/images/web/nuestro_proceso/black_wave.svg"
          alt=""
          className={styles.blackWave}
          aria-hidden
        />
        {children && (
          <div className={styles.content}>{children}</div>
        )}
      </div>
    </div>
  );
}
