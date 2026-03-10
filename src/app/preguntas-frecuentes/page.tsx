import PageHero from "@/components/PageHero/PageHero";
import FaqAccordion from "@/components/FaqAccordion/FaqAccordion";
import Subscribe from "@/components/Subscribe/Subscribe";
import { getPreguntasFrecuentes } from "@/lib/api";
import styles from "./page.module.css";

export default async function PreguntasFrecuentesPage() {
  const preguntasRes = await getPreguntasFrecuentes().catch(() => null);
  const preguntas = (preguntasRes?.data ?? []).sort(
    (a, b) => (a.orden ?? 0) - (b.orden ?? 0)
  );

  return (
    <>
      <PageHero backgroundAlt="Preguntas Frecuentes">
        <div className={styles.heroLogoWrapper}>
          <h1 className={styles.heroTitle}>Preguntas Frecuentes</h1>
        </div>
      </PageHero>

      <section className={styles.faqSection}>
        <FaqAccordion items={preguntas} />
      </section>

      <Subscribe
        variant="contact"
        title="¿TIENES ALGUNA DUDA?"
        description="Si tienes más preguntas sobre nuestras bases culinarias Q'ocina en Casa o cómo usarlas en tu cocina, ¡no dudes en dejarlas aquí!"
      />
    </>
  );
}
