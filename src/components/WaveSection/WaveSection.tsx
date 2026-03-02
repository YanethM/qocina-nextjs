import styles from "./WaveSection.module.css";

interface WaveSectionProps {
  children: React.ReactNode;
  imageSrc?: string;
  mobileImageSrc?: string;
  className?: string;
}

export default function WaveSection({
  children,
  imageSrc = "/images/web/home/wave_subscribe.svg",
  mobileImageSrc,
  className,
}: WaveSectionProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div className={styles.wave}>
        <img src={imageSrc} alt="" className={`${styles.waveImg} ${mobileImageSrc ? styles.waveImgDesktop : ""}`} />
        {mobileImageSrc && (
          <img src={mobileImageSrc} alt="" className={`${styles.waveImg} ${styles.waveImgMobile}`} />
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
