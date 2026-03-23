import {
  getPreguntasFrecuentes,
  getCategoriasFaq,
  getFaqPage,
} from "@/lib/api";
import FaqClient from "@/components/FaqClient/FaqClient";
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
  const todas = preguntasRes?.data ?? [];
  const categorias = (categoriasRes?.data ?? []).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

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
        <FaqClient categorias={categorias} todas={todas} preguntasPorCategoria={{}} ctaCargarMas="Cargar más" />
      </section>
    </div>
  );
}
