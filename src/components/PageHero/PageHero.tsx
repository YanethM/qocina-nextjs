import Image from "next/image";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  backgroundImage?: string;
  backgroundImageMobile?: string;
  backgroundAlt?: string;
  waveImage?: string;
  waveImageMobile?: string;
  waveFullWidth?: boolean;
  overlayContent?: React.ReactNode;
  children?: React.ReactNode;
  mobileHeight?: number;
}

export default function PageHero({ backgroundImage, backgroundImageMobile, backgroundAlt = "", waveImage, waveImageMobile, waveFullWidth, overlayContent, children, mobileHeight }: PageHeroProps) {
  return (
    <div
      className={styles.hero}
      style={mobileHeight ? ({ "--hero-mobile-height": `${mobileHeight}px` } as React.CSSProperties) : undefined}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={backgroundAlt}
          fill
          className={backgroundImageMobile ? `${styles.bgImage} ${styles.bgImageDesktopOnly}` : styles.bgImage}
          sizes="100vw"
          priority
          unoptimized
        />
      )}
      {backgroundImageMobile && (
        <Image
          src={backgroundImageMobile}
          alt={backgroundAlt}
          fill
          className={`${styles.bgImage} ${styles.bgImageMobileOnly}`}
          sizes="100vw"
          priority
          unoptimized
        />
      )}
      <div className={styles.waveOverlay}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={waveImageMobile ?? "/images/mobile/nuestro_proceso/wave.svg"}
          />
          <img
            src={waveImage ?? "/images/web/nuestro_proceso/black_wave.svg"}
            alt=""
            className={`${styles.blackWave} ${waveFullWidth ? styles.blackWaveFull : ""}`}
            aria-hidden
          />
        </picture>
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
