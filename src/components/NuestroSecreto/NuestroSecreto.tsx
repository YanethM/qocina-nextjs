import Image from "next/image";
import Button from "@/components/ui/Button";
import styles from "./NuestroSecreto.module.css";

export default function NuestroSecreto() {
  return (
    <section className={styles.nuestroSecreto}>
      <div className={styles.innerContainer}>
        {/* Columna izquierda - Texto */}
        <div className={styles.textContainer}>
          <h2 className={styles.title}>Nuestro secreto</h2>
          <p className={styles.description}>
            Un <span className={styles.highlight}>proceso único</span> que une lo
            artesanal y lo tecnológico:{" "}
            <span className={styles.highlight}>bases culinarias</span>{" "}
            desarrolladas por el reconocido{" "}
            <span className={styles.highlight}>chef Gastón Acurio</span>, que
            rescata recetas de madres y abuelas, y las combina con{" "}
            <span className={styles.highlight}>secretos de alta cocina</span> que
            garantizan un sabor inigualable.
          </p>

          {/* Badges - imagen única */}
          <div className={styles.badgesContainer}>
            <Image
              src="/images/web/home/secret/badges.png"
              alt="Libre de preservantes, sin colorantes artificiales, sin saborizantes artificiales, sin grasa trans, libre de gluten, cultivos peruanos 100% naturales, clean label"
              width={420}
              height={140}
              className={styles.badgesImage}
            />
          </div>

          {/* Botón negro */}
          <div className={styles.btnContainer}>
            <Button
              href="/sobre-nosotros"
              variant="primary"
              className={styles.procesoBtn}
            >
              Conoce nuestro proceso
            </Button>
          </div>
        </div>

        {/* Columna derecha - Imagen de Gastón */}
        <div className={styles.imageWrapper}>
          {/* Desktop */}
          <Image
            src="/images/web/home/secret/gaston.png"
            alt="Chef Gastón Acurio"
            fill
            className={styles.waveImage}
            priority={false}
          />
          {/* Mobile */}
          <Image
            src="/images/mobile/nuestro_secreto/secreto.png"
            alt="Nuestro secreto"
            width={390}
            height={500}
            className={styles.mobileSecretoImage}
            priority={false}
          />
          <Button
            href="/sobre-nosotros"
            variant="yellow"
            className={styles.gastonBtn}
          >
            Conoce más sobre Gastón Acurio
          </Button>
        </div>
      </div>
    </section>
  );
}