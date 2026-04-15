import Image from "next/image";
import styles from "./ComingSoon.module.css";

export default function ComingSoon() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <Image
          src="/images/web/footer/logo-qocina.svg"
          alt="Q'ocina"
          width={160}
          height={60}
          priority
        />
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>
          Estamos preparando algo <span className={styles.accent}>especial</span> para ti
        </h1>

        <div className={styles.divider} />

        <p className={styles.description}>
          Estamos trabajando en el cargue de la información de esta página.
          Pronto tendrás todo listo para disfrutar. ¡Vuelve pronto!
        </p>

        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      </div>
    </div>
  );
}
