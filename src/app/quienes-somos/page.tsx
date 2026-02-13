import Image from "next/image";
import { getQuienesSomos, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
  title: "Quiénes Somos - Q'ocina",
  description: "Conoce la historia y valores de Q'ocina",
};

export default async function QuienesSomosPage() {
  const res = await getQuienesSomos().catch(() => null);
  const data = res?.data;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>{data?.titulo || "Quiénes Somos"}</h1>
        <p className={styles.subtitle}>
          {data?.descripcion || "Conoce nuestra historia"}
        </p>
      </section>

      <section className={styles.content}>
        <div className={styles.grid}>
          {data?.imagen && (
            <div className={styles.imageWrapper}>
              <Image
                src={getStrapiImageUrl(data.imagen.url)}
                alt={data.imagen.alternativeText || "Quiénes Somos"}
                width={600}
                height={400}
                style={{ objectFit: "cover", borderRadius: "12px" }}
              />
            </div>
          )}
          <div className={styles.text}>
            {data?.contenido && (
              <div dangerouslySetInnerHTML={{ __html: data.contenido }} />
            )}
          </div>
        </div>

        {(data?.mision || data?.vision || (data?.valores && data.valores.length > 0)) && (
          <div className={styles.values}>
            {data?.mision && (
              <div className={styles.valueCard}>
                <h3>Misión</h3>
                <p>{data.mision}</p>
              </div>
            )}
            {data?.vision && (
              <div className={styles.valueCard}>
                <h3>Visión</h3>
                <p>{data.vision}</p>
              </div>
            )}
            {data?.valores && data.valores.length > 0 && (
              <div className={styles.valueCard}>
                <h3>Valores</h3>
                <ul>
                  {data.valores.map((valor) => (
                    <li key={valor.id}>
                      <strong>{valor.titulo}:</strong> {valor.descripcion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
