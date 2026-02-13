import Image from "next/image";
import { Testimonio } from "@/types";
import styles from "./Testimonios.module.css";

interface TestimoniosProps {
  testimonios: Testimonio[];
}

export default function Testimonios({ testimonios }: TestimoniosProps) {
  if (testimonios.length === 0) return null;

  return (
    <section className={styles.sectionAlt}>
      <div>
        <h2 className={styles.sectionTitle}>Testimonios</h2>
        <div className={styles.testimoniosWrapper}>
          <div className={styles.testimonios}>
            {testimonios.map((testimonio) => (
              <div key={testimonio.id} className={styles.testimonio}>
                <Image
                  src="/images/home/wave_red.png"
                  alt=""
                  fill
                  className={styles.cardBackgroundImage}
                  priority={false}
                />
                <div className={styles.cardText}>
                  <div className={styles.stars}>
                    {"★".repeat(testimonio.rating)}
                    {"☆".repeat(5 - testimonio.rating)}
                  </div>
                  <p className={styles.testimonioAuthor}>
                    {testimonio.nombre_usuario}
                  </p>
                  <p className={styles.testimonioContent}>
                    &ldquo;{testimonio.texto_testimonio}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.waveBottom}>
            <img
              src="/images/home/wave_testimonial.png"
              alt=""
              className={styles.waveImage}
            />
            <img
              src="/images/home/waves_white.png"
              alt=""
              className={styles.waveWhite}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
