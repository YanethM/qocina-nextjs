import Image from "next/image";
import styles from "./page.module.css";

export const metadata = {
  title: "Nosotros - Q'ocina",
  description: "Conoce quiénes somos, nuestra misión, visión y valores.",
};

export default function NosotrosPage() {
  return (
    <div className={styles.page}>
      <section className={styles.gastonSection}>
        <Image
          src="/images/web/nosotros/gaston.svg"
          alt="Gastón Acurio"
          width={1440}
          height={800}
          className={styles.gastonImage}
          priority
          style={{ width: "100%", height: "auto" }}
        />
      </section>

      <section className={styles.premiosSection}>
        <Image
          src="/images/web/nosotros/premios.svg"
          alt="Premios"
          width={1440}
          height={600}
          className={styles.gastonImage}
          style={{ width: "100%", height: "auto" }}
        />
      </section>

      <section className={styles.procesoSection}>
        <Image
          src="/images/web/nosotros/proceso.svg"
          alt="Proceso"
          width={1440}
          height={600}
          className={styles.gastonImage}
          style={{ width: "100%", height: "auto" }}
        />
      </section>
    </div>
  );
}
