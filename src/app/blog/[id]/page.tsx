import Image from "next/image";
import { getArticulo, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArticuloDetailPage({ params }: Props) {
  const { id } = await params;
  const res = await getArticulo(id).catch(() => null);
  const articulo = res?.data;

  if (!articulo) {
    return (
      <div className={styles.notFound}>
        <h1>Artículo no encontrado</h1>
        <p>El artículo que buscas no existe o fue eliminado.</p>
      </div>
    );
  }

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        {articulo.categoria_blog && (
          <span className={styles.category}>
            {articulo.categoria_blog.nombre}
          </span>
        )}
        <h1 className={styles.title}>{articulo.titulo}</h1>
        <p className={styles.description}>{articulo.descripcion}</p>
        <div className={styles.meta}>
          {articulo.fecha && (
            <span>
              {new Date(articulo.fecha).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          {articulo.autor && <span>Por {articulo.autor}</span>}
        </div>
      </header>

      {articulo.imagen && (
        <div className={styles.featuredImage}>
          <Image
            src={getStrapiImageUrl(articulo.imagen.url)}
            alt={articulo.imagen.alternativeText || articulo.titulo}
            width={1000}
            height={500}
            style={{ objectFit: "cover", borderRadius: "12px" }}
            priority
          />
        </div>
      )}

      {articulo.contenido && (
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: articulo.contenido }}
        />
      )}
    </article>
  );
}
