import Image from "next/image";
import { getReceta, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RecetaDetailPage({ params }: Props) {
  const { id } = await params;
  const res = await getReceta(id).catch(() => null);
  const receta = res?.data;

  if (!receta) {
    return (
      <div className={styles.notFound}>
        <h1>Receta no encontrada</h1>
        <p>La receta que buscas no existe o fue eliminada.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        {receta.imagen && (
          <Image
            src={getStrapiImageUrl(receta.imagen.url)}
            alt={receta.imagen.alternativeText || receta.titulo}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        )}
        <div className={styles.heroOverlay}>
          <h1 className={styles.title}>{receta.titulo}</h1>
          <p className={styles.description}>{receta.descripcion}</p>
          <div className={styles.meta}>
            {receta.tiempo && <span>{receta.tiempo}</span>}
            {receta.porciones && <span>{receta.porciones} porciones</span>}
            {receta.dificultad && <span>{receta.dificultad}</span>}
          </div>
        </div>
      </section>

      <section className={styles.content}>
        {receta.ingredientes && (
          <div className={styles.section}>
            <h2>Ingredientes</h2>
            <div dangerouslySetInnerHTML={{ __html: receta.ingredientes }} />
          </div>
        )}

        {receta.preparacion && (
          <div className={styles.section}>
            <h2>Preparación</h2>
            <div dangerouslySetInnerHTML={{ __html: receta.preparacion }} />
          </div>
        )}

        {receta.contenido && (
          <div className={styles.section}>
            <div dangerouslySetInnerHTML={{ __html: receta.contenido }} />
          </div>
        )}
      </section>
    </div>
  );
}
