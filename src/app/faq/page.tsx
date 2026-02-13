import {
  getPreguntasFrecuentes,
  getCategoriasFaq,
  getFaqPage,
} from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
  title: "Preguntas Frecuentes - Q'ocina",
  description: "Resolvemos tus dudas más comunes",
};

export default async function FaqPage() {
  const [pageRes, preguntasRes, categoriasRes] = await Promise.all([
    getFaqPage().catch(() => null),
    getPreguntasFrecuentes().catch(() => null),
    getCategoriasFaq().catch(() => null),
  ]);

  const pageData = pageRes?.data;
  const preguntas = preguntasRes?.data ?? [];
  const categorias = categoriasRes?.data ?? [];

  // Group questions by category
  const grouped = categorias.map((cat) => ({
    ...cat,
    preguntas: preguntas.filter(
      (p) => p.categoria_faq?.id === cat.id
    ),
  }));

  const sinCategoria = preguntas.filter((p) => !p.categoria_faq);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          {pageData?.titulo || "Preguntas Frecuentes"}
        </h1>
        <p className={styles.subtitle}>
          {pageData?.descripcion || "Resolvemos tus dudas más comunes"}
        </p>
      </section>

      <section className={styles.content}>
        {grouped.map(
          (cat) =>
            cat.preguntas.length > 0 && (
              <div key={cat.id} className={styles.category}>
                <h2 className={styles.categoryTitle}>{cat.nombre}</h2>
                <div className={styles.faqList}>
                  {cat.preguntas.map((pregunta) => (
                    <details key={pregunta.id} className={styles.faqItem}>
                      <summary className={styles.faqQuestion}>
                        {pregunta.pregunta}
                      </summary>
                      <div className={styles.faqAnswer}>
                        {pregunta.respuesta}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )
        )}

        {sinCategoria.length > 0 && (
          <div className={styles.category}>
            <h2 className={styles.categoryTitle}>General</h2>
            <div className={styles.faqList}>
              {sinCategoria.map((pregunta) => (
                <details key={pregunta.id} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    {pregunta.pregunta}
                  </summary>
                  <div className={styles.faqAnswer}>
                    {pregunta.respuesta}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
