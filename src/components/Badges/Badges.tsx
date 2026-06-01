import Image from "next/image";
import { Badge } from "@/types";
import { getStrapiImageUrl } from "@/lib/strapi";
import styles from "./Badges.module.css";

interface BadgesProps {
  badges: Badge[];
  className?: string;
  variant?: "default" | "row";
}

function BadgeItem({ badge, rowVariant = false }: { badge: Badge; rowVariant?: boolean }) {
  return (
    <div className={`${styles.badge} ${rowVariant ? styles.badgeRowItem : ""}`}>
      <div
        className={`${styles.badgeIcon} ${rowVariant ? styles.badgeRowIcon : ""}`}
        style={{ backgroundColor: "transparent" }}
      >
        {badge.icono && (
          <Image
            src={getStrapiImageUrl(
              badge.icono.formats?.small?.url ?? badge.icono.url,
            )}
            alt={badge.icono.alternativeText ?? badge.nombre ?? ""}
            fill
            sizes="(max-width: 640px) 72px, 140px"
            style={{ objectFit: "contain" }}
            unoptimized
          />
        )}
      </div>
    </div>
  );
}

export default function Badges({ badges, className, variant = "default" }: BadgesProps) {
  if (badges.length === 0) return null;

  const isRow = variant === "row";
  const useRowMarquee = isRow && badges.length > 8;
  const useMobileMarquee = badges.length > 3;

  return (
    <section className={`${styles.badgesSection} ${className || ""}`}>
      <div className={`${styles.badges} ${isRow && useRowMarquee ? styles.badgesHidden : ""} ${isRow && !useRowMarquee ? styles.badgesRow : ""}`}>
        {badges.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} rowVariant={isRow && !useRowMarquee} />
        ))}
      </div>

      <div className={`${styles.marqueeWrapper} ${useRowMarquee ? styles.marqueeWrapperRow : ""}`}>
        <div
          className={`${styles.marqueeTrack} ${(useRowMarquee || useMobileMarquee) ? styles.marqueeAnimated : ""}`}>
          {badges.map((badge) => (
            <div key={badge.id} className={styles.marqueeItem}>
              <BadgeItem badge={badge} />
            </div>
          ))}
          {(useRowMarquee || useMobileMarquee) &&
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
