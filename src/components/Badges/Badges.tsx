import Image from "next/image";
import { Badge } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import styles from "./Badges.module.css";

interface BadgesProps {
  badges: Badge[];
}

function BadgeItem({ badge }: { badge: Badge }) {
  return (
    <div className={styles.badge}>
      <div className={styles.badgeIcon}>
        {badge.icono && (
          <Image
            src={getStrapiImageUrl(
              badge.icono.formats?.small?.url ?? badge.icono.url
            )}
            alt={badge.icono.alternativeText ?? badge.titulo}
            fill
            style={{ objectFit: "contain" }}
          />
        )}
      </div>
      <span className={styles.badgeTitle}>{badge.titulo}</span>
    </div>
  );
}

export default function Badges({ badges }: BadgesProps) {
  if (badges.length === 0) return null;

  const useMarquee = badges.length > 3;

  return (
    <section className={styles.section}>
      {/* Desktop: grid estático */}
      <div className={styles.badges}>
        {badges.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </div>

      {/* Mobile: marquee infinito (>3) o fila centrada (≤3) */}
      <div className={styles.marqueeWrapper}>
        <div
          className={`${styles.marqueeTrack} ${useMarquee ? styles.marqueeAnimated : ""}`}>
          {badges.map((badge) => (
            <div key={badge.id} className={styles.marqueeItem}>
              <BadgeItem badge={badge} />
            </div>
          ))}
          {/* Copia duplicada para loop sin corte */}
          {useMarquee &&
            badges.map((badge) => (
              <div
                key={`dup-${badge.id}`}
                className={styles.marqueeItem}
                aria-hidden="true">
                <BadgeItem badge={badge} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
