import styles from "./WaveSection.module.css";

interface WaveSectionProps {
  children: React.ReactNode;
  imageSrc?: string;
  className?: string;
}

export default function WaveSection({
  children,
  imageSrc = "/images/web/home/wave_subscribe.png",
  className,
}: WaveSectionProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div className={styles.wave}>
        <img src={imageSrc} alt="" className={styles.waveImg} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
