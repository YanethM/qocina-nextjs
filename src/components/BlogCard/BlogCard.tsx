import Image from "next/image";
import Link from "next/link";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
  titulo?: string;
  descripcion_corta?: string | null;
  href?: string;
}

export default function BlogCard({
  titulo,
  descripcion_corta,
  href = "#",
}: BlogCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardBgWrapper}>
        <Image
          src="/images/web/noticias/card_background.svg"
          alt=""
          width={424}
          height={320}
          className={styles.cardBgImage}
        />
        <div className={styles.cardOverlay}>
          <div className={styles.cardContent}>
            {titulo && <h3 className={styles.cardTitulo}>{titulo}</h3>}
            {descripcion_corta && (
              <p className={styles.cardDescripcion}>{descripcion_corta}</p>
            )}
          </div>
          <div className={styles.cardBtnWrapper}>
            <Link href={href} className={styles.cardBtn} data-btn="white">
              Leer más
              <Image
                src="/images/web/home/arrow_right.svg"
                alt=""
                width={30}
                height={18}
                className={styles.cardBtnArrow}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
