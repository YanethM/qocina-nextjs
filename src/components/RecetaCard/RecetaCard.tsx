import Image from "next/image";
import Link from "next/link";
import { COLOR_MAP, WAVE_MAP, DEFAULT_COLOR, DEFAULT_WAVE } from "@/lib/constants";
import styles from "./RecetaCard.module.css";

export interface RecetaCardProps {
  href: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  imagenAlt?: string;
  colorCard?: string | null;
  ctaText?: string;
}

export default function RecetaCard({
  href,
  titulo,
  descripcion,
  imagenUrl,
  imagenAlt,
  colorCard,
  ctaText = "Ver receta",
}: RecetaCardProps) {
  const accent = (colorCard && COLOR_MAP[colorCard]) ?? DEFAULT_COLOR;
  const wave = (colorCard && WAVE_MAP[colorCard]) ?? DEFAULT_WAVE;

  return (
    <Link href={href} className={styles.card} data-card style={{ "--accent": accent } as React.CSSProperties}>
      <div className={styles.imageWrapper}>
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={imagenAlt ?? titulo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
            className={styles.img}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>

      <div className={styles.waveWrapper}>
        <Image
          src={wave}
          alt=""
          width={424}
          height={58}
          className={styles.waveImg}
          aria-hidden={true}
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{titulo}</h3>
        <p className={styles.description}>{descripcion}</p>
        <div className={styles.cta}>
          <span className={styles.ctaButton} data-btn="white">
            {ctaText}
            <Image
              src="/images/web/recetas/icon_arrow_right.svg"
              alt=""
              width={25}
              height={25}
              aria-hidden={true}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}