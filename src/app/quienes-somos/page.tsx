import Image from "next/image";
import Productos from "@/components/Productos/Productos";
import { getProductos } from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
  title: "Nosotros - Q'ocina",
  description: "Conoce quiénes somos, nuestra misión, visión y valores.",
};

export default async function NosotrosPage() {
  const productosRes = await getProductos().catch(() => null);
  const productos = productosRes?.data?.slice(0, 3) ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.beneficiosSection}>
        {[
          { src: "/images/web/nosotros/rico.svg", alt: "Rico" },
          { src: "/images/web/nosotros/facil.svg", alt: "Fácil" },
          { src: "/images/web/nosotros/sano.svg", alt: "Sano" },
        ].map(({ src, alt }) => (
          <div key={alt} className={styles.beneficioCard}>
            <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </section>

      <section className={styles.gastonSection}>
        <Image
          src="/images/web/nosotros/gaston.svg"
          alt="Gastón Acurio"
          width={1440}
          height={800}
          className={styles.gastonImage}
          priority
          style={{ width: "100%", height: "auto" }}
        />
      </section>

      <section className={styles.premiosSection}>
        <Image
          src="/images/web/nosotros/premios.svg"
          alt="Premios"
          width={1440}
          height={600}
          className={styles.gastonImage}
          style={{ width: "100%", height: "auto" }}
        />
      </section>

      <Productos
        productos={productos}
        title="Nuestras Bases: Una experiencia rica, fácil y sana."
      />

      <section className={styles.procesoSection}>
        <Image
          src="/images/web/nosotros/proceso.svg"
          alt="Proceso"
          width={1440}
          height={600}
          className={styles.gastonImage}
          style={{ width: "100%", height: "auto" }}
        />
      </section>
    </div>
  );
}
