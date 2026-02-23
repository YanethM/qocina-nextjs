import { Badge } from "@/types";
import Badges from "@/components/Badges/Badges";
import WaveSection from "@/components/WaveSection/WaveSection";
import styles from "./BeneficiosWaveSection.module.css";

interface BeneficiosWaveSectionProps {
  badges: Badge[];
  textoBeneficios: string;
}

export default function BeneficiosWaveSection({
  badges,
  textoBeneficios,
}: BeneficiosWaveSectionProps) {
  return (
    <section className={styles.section}>
      <WaveSection>
        <p
          className={styles.beneficiosText}
          dangerouslySetInnerHTML={{ __html: textoBeneficios }}
        />
      </WaveSection>
      <div className={styles.badgesContainer}>
        <Badges badges={badges} />
      </div>
    </section>
  );
}
