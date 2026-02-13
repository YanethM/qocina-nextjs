import Image from "next/image";
import styles from "./Subscribe.module.css";

export default function Subscribe() {
  return (
    <section className={styles.section}>
      {/* Onda superior */}
      <div className={styles.waveTop}>
        <img
          src="/images/home/wave_subscribe.png"
          alt=""
          className={styles.waveImg}
        />
      </div>

      {/* Contenido */}
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.textSide}>
            <h2 className={styles.title}>
              SUSCRÍBETE Y OBTÉN 5% DE DESCUENTO
            </h2>
            <p className={styles.description}>
              Recibe en tu correo recetas exclusivas, tips para cocinar fácil
              y sano, y todas las novedades de Q&apos;ocina en Casa.
            </p>
          </div>
          <div className={styles.formSide}>
            <form className={styles.form}>
              <input
                type="email"
                placeholder="Correo electrónico"
                className={styles.input}
                required
              />
              <button type="submit" className={styles.button}>
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}