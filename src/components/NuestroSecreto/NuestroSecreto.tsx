import Image from "next/image";
import styles from "./NuestroSecreto.module.css";

export default function NuestroSecreto() {
  return (
    <section className={styles.nuestroSecreto}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/home/wave_secret_section.png"
          alt=""
          width={1000}
          height={600}
          className={styles.waveImage}
          priority={false}
        />
        <div className={styles.cocineroWrapper}>
          <Image
            src="/images/home/cocinero_secret_section.png"
            alt="Cocinero"
            width={500}
            height={600}
            className={styles.cocineroImage}
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
