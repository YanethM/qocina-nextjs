import Image from "next/image";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
  href?: string;
}

export default function BlogCard({ href = "#" }: BlogCardProps) {
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
        <div className={styles.cardBtnWrapper}>
          <a href={href} className={styles.cardBtn}>
            Leer más
            <Image
              src="/images/web/home/arrow_right.svg"
              alt=""
              width={30}
              height={18}
              className={styles.cardBtnArrow}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
