import Link from "next/link";
import Image from "next/image";
import { getRecetas, getRecetasPage, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
  title: "Recetas - Q'ocina",
  description: "Descubre nuestras mejores recetas",
};

const COLOR_MAP: Record<string, string> = {
  rojo: "#CE171C",
  verde: "#6A892C",
  amarillo: "#F4A910",
};

interface Receta {
  id: number;
  documentId: string;
  titulo: string;
  slug: string;
  descripcion_corta: string;
  descripcion_larga: string;
  tiempo_preparacion: number;
  tiempo_coccion: number;
  porciones: number;
  dificultad: string;
  tipo_receta: string;
  cocina_region: string;
  tipo_dieta: string;
  color_card: string;
  texto_base_utilizada: string;
  destacada: boolean;
  orden: number;
  video_url: string;
  meta_title: string;
  meta_description: string;
  imagen?: {
    url: string;
    alternativeText?: string;
  };
}

export default async function RecetasPage() {
  const [pageRes, recetasRes] = await Promise.all([
    getRecetasPage().catch(() => null),
    getRecetas().catch(() => null),
  ]);

  const pageData = pageRes?.data;
  const recetas: Receta[] = recetasRes?.data ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          {pageData?.titulo || "Nuestras Recetas"}
        </h1>
        <p className={styles.subtitle}>
          {pageData?.descripcion || "Inspírate con nuestras mejores recetas"}
        </p>
      </section>

      <section className={styles.content}>
        <div className={styles.grid}>
          {recetas.map((receta) => {
            const cardColor = COLOR_MAP[receta.color_card] || "#CE171C";

            return (
              <Link
                key={receta.id}
                href={`/recetas/${receta.documentId}`}
                className={styles.card}
              >
                <div className={styles.cardImage}>
                  {receta.imagen && (
                    <Image
                      src={getStrapiImageUrl(receta.imagen.url)}
                      alt={receta.imagen.alternativeText || receta.titulo}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  {/* Onda decorativa entre imagen y body */}
                  <div
                    className={styles.wave}
                    style={{ backgroundColor: cardColor }}
                  />
                </div>

                <div
                  className={styles.cardBody}
                  style={{ backgroundColor: cardColor }}
                >
                  <h3 className={styles.cardTitle}>{receta.titulo}</h3>
                  <p className={styles.cardDescription}>
                    {receta.descripcion_corta}
                  </p>
                  <div className={styles.cardCta}>
                    <span className={styles.ctaButton}>
                      Ver receta <span className={styles.ctaArrow}>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}