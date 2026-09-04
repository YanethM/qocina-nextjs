import Image from "next/image";
import styles from "./EnConstruccion.module.css";

const COPY = {
  es: {
    titulo: "Estamos preparando algo nuevo",
    descripcion: "Vuelve pronto para descubrir sabores que inspiran.",
  },
  en: {
    titulo: "We're cooking up something new",
    descripcion: "Come back soon to discover flavors that inspire.",
  },
} as const;

interface Props {
  locale?: string;
}

export default function EnConstruccion({ locale = "es" }: Props) {
  const copy = COPY[locale === "en" ? "en" : "es"];

  return (
    <div className={styles.wrapper}>
      <Image
        src="/images/web/footer/logo-qocina.svg"
        alt="Q'ocina"
        width={180}
        height={68}
        priority
        className={styles.logo}
      />
      <h1 className={`${styles.titulo} font-palmer`}>{copy.titulo}</h1>
      <p className={styles.descripcion}>{copy.descripcion}</p>
    </div>
  );
}
