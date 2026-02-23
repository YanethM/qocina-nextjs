import Image from "next/image";
import Link from "next/link";
import styles from "./RecetaCard.module.css";

export interface RecetaCardProps {
  href: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  imagenAlt?: string;
  /** Color de fondo del body y del wave. Default: #CE171C */
  accentColor?: string;
}

export default function RecetaCard({
  href,
  titulo,
  descripcion,
  imagenUrl,
  imagenAlt,
  accentColor = "#CE171C",
}: RecetaCardProps) {
  return (
    <Link href={href} className={styles.card} style={{ "--accent": accentColor } as React.CSSProperties}>
      {/* Imagen */}
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
        {/* Wave overlay */}
        <div className={styles.wave} />
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{titulo}</h3>
        <p className={styles.description}>{descripcion}</p>
        <div className={styles.cta}>
          <span className={styles.ctaButton}>
            Ver receta&nbsp;&nbsp;→
          </span>
        </div>
      </div>
    </Link>
  );
}