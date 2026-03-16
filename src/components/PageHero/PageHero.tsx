import Image from "next/image";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  backgroundImage?: string;
  backgroundAlt?: string;
  waveImage?: string;
  waveFullWidth?: boolean;
  overlayContent?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHero({ backgroundImage, backgroundAlt = "", waveImage, waveFullWidth, overlayContent, children }: PageHeroProps) {
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
          unoptimized
        />
      )}
      <div className={styles.waveOverlay}>
        <img
          src={waveImage ?? "/images/web/nuestro_proceso/black_wave.svg"}
          alt=""
          className={`${styles.blackWave} ${waveFullWidth ? styles.blackWaveFull : ""}`}
          aria-hidden
        />
        {overlayContent && (
          <div className={styles.overlayContent}>{overlayContent}</div>
        )}
        {children && (
          <div className={styles.content}>{children}</div>
        )}
      </div>
    </div>
  );
}
