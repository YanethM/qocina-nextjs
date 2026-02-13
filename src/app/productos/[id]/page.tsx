import Image from "next/image";
import { getProducto, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetailPage({ params }: Props) {
  const { id } = await params;
  const res = await getProducto(id).catch(() => null);
  const producto = res?.data;

  if (!producto) {
    return (
      <div className={styles.notFound}>
        <h1>Producto no encontrado</h1>
        <p>El producto que buscas no existe o fue eliminado.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.imageWrapper}>
            {producto.imagen && (
              <Image
                src={getStrapiImageUrl(producto.imagen.url)}
                alt={producto.imagen.alternativeText || producto.nombre}
                width={600}
                height={500}
                style={{ objectFit: "cover", borderRadius: "12px" }}
              />
            )}
          </div>
          <div className={styles.info}>
            <h1 className={styles.title}>{producto.nombre}</h1>
            <p className={styles.description}>{producto.descripcion}</p>
            {producto.contenido && (
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: producto.contenido }}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
