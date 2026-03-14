import WaveSection from "@/components/WaveSection/WaveSection";
import styles from "./Subscribe.module.css";

interface SubscribeProps {
  title?: string;
  description?: string;
  formulario_boton?: string;
  variant?: "email" | "contact";
}

export default function Subscribe({ title, description, formulario_boton, variant = "email" }: SubscribeProps = {}) {
  return (
    <section className={styles.section}>
      <WaveSection mobileImageSrc="/images/mobile/bases_culinarias/Modulo.svg">
        <div className={`${styles.container} ${variant === "contact" ? styles.containerContact : ""}`}>
          <div className={styles.textSide}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <div className={styles.formSide}>
            {variant === "contact" ? (
              <form className={styles.formContact}>
                <input
                  type="text"
                  placeholder="Nombre"
                  className={styles.inputContact}
                  required
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className={styles.inputContact}
                  required
                />
                <textarea
                  placeholder="Mensaje"
                  className={`${styles.inputContact} ${styles.textareaContact}`}
                  required
                />
                <div className={styles.submitRowContact}>
                  <button type="submit" className={styles.button}>
                    {formulario_boton ?? "Enviar"}
                  </button>
                </div>
              </form>
            ) : (
              <form className={styles.form}>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className={styles.input}
                  required
                />
                <button type="submit" className={styles.button}>
                  {formulario_boton ?? "Suscribirme"}
                </button>
              </form>
            )}
          </div>
        </div>
      </WaveSection>
    </section>
  );
}