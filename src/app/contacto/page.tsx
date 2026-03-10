import Image from "next/image";
import ContactForm from "@/components/ContactForm/ContactForm";
import styles from "./page.module.css";

export default function ContactoPage() {
  return (
    <div className={styles.page}>
      <div className={styles.backgroundWaves}>
        <Image
          src="/images/web/contacto/contact_background.svg"
          alt=""
          fill
          priority
        />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.hero}>
          <div className={styles.imageCol}>
            <Image
              src="/images/web/contacto/mujer.svg"
              alt="Mujer cocinando"
              width={480}
              height={480}
              className={styles.mujerImg}
              priority
            />
          </div>

          <div className={styles.contentCol}>
            <h1 className={styles.titulo}>¿Cómo podemos ayudarte?</h1>
            <p className={styles.texto}>
              En <strong>Q&apos;ocina en Casa</strong>, estamos siempre disponibles
              para ayudarte.
            </p>
            <p className={styles.texto}>
              Tienes preguntas sobre nuestras <strong>bases</strong>, necesitas
              asistencia con tu pedido, o quieres saber más sobre la entrega de
              tus productos, completa el formulario y nos pondremos en contacto.
            </p>
            <ContactForm />
          </div>
        </div>

        <div className={styles.whatsappSection}>
          <p className={styles.whatsappText}>
            También puedes hablar con nosotros a través
            <br />
            de nuestro canal de <strong>Whatsapp</strong>.
          </p>
          <a
            href="https://wa.me/51999999999"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            Contáctanos
            <Image
              src="/images/web/home/white_arrow_right.svg"
              alt=""
              width={25}
              height={25}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
