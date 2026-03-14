import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero/PageHero";
import Productos from "@/components/Productos/Productos";
import { getProductos } from "@/lib/api";
import styles from "./page.module.css";

const pasos = [
  {
    numero: "Primer paso",
    bg: "sectionWhite",
    subtitulo: "Seleccionamos las verduras",
    texto:
      "Gracias a agricultores peruanos, adquirimos y seleccionamos vegetales de la más alta calidad, como cebollas y ajos de Arequipa, ajíes de Ancash, zapallo loche de Lambayeque, entre otros.",
    imagen: "/images/web/nuestro_proceso/section1.svg",
    imageLeft: false,
  },
  {
    numero: "Segundo paso",
    bg: "sectionGray",
    subtitulo: "Picado, pelado y despepitado",
    texto:
      "Se pican, pelan y despepitan los tomates, cebollas, ajíes panca, culantro, zapallo loche y demás ingredientes, dejándolos listos para la cocción.",
    imagen: "/images/web/nuestro_proceso/section2.svg",
    imageLeft: true,
  },
  {
    numero: "Tercer paso",
    bg: "sectionWhite",
    subtitulo: "Cocción",
    texto:
      "Los ingredientes pasan a la cocina, donde se fríen, se caramelizan y se mezclan en sofritos, reducciones y concentrados, utilizando procesos y técnicas complejas de restaurantes de primer nivel que ayudan a mejorar naturalmente el sabor de cada plato. Así, las Bases culinarias o Bases Madre quedan listas de manera artesanal, tal como se preparan en cada casa o restaurante.",
    imagen: "/images/web/nuestro_proceso/section3.svg",
    imageLeft: false,
  },
  {
    numero: "Cuarto paso",
    bg: "sectionGray",
    subtitulo: "Abatido y Congelado",
    texto:
      "Cuando las Bases Madre estén listas, se les reduce la temperatura, de 90°C a -15°C en pocos minutos, para cortar el proceso de cocción drásticamente y preservar los colores, sabores y aromas de las preparaciones. Posteriormente, se mantienen congelados a temperaturas de -20°C de 2 a 3 horas.",
    imagen: "/images/web/nuestro_proceso/section4.svg",
    imageLeft: true,
  },
  {
    numero: "Quinto paso",
    bg: "sectionWhite",
    subtitulo: "Liofilización",
    texto:
      "En este proceso moderno de alta tecnología, se someten los alimentos a temperaturas y presiones muy bajas para secar y eliminar el agua, conservando inalterables el sabor, color, aroma y nutrientes en un 99%. Los ingredientes se secan y se procede a bajar la temperatura. Se elimina el agua de los ingredientes para mantener sus propiedades.",
    imagen: "/images/web/nuestro_proceso/section5.svg",
    imageLeft: false,
  },
  {
    numero: "Sexto paso",
    bg: "sectionGray",
    subtitulo: "Envasado",
    texto:
      "Luego, se tamiza para obtener gránulos y cada Base Culinaria Q'ocina en Casa es envasada en un empaque de 50 g, donde se concentra el delicioso sabor de cada receta, tecnología limpia y verdaderas experiencias culinarias.",
    imagen: "/images/web/nuestro_proceso/section6.svg",
    imageLeft: true,
  },
];

export default async function NuestroProcesoPage() {
  const productosRes = await getProductos().catch(() => null);
  const productos = productosRes?.data?.slice(0, 3) ?? [];

  return (
    <>
      <PageHero
        backgroundImage="/images/web/nuestro_proceso/photo.svg"
        backgroundAlt="Nuestro proceso de producción"
      >
        <div className={styles.heroText}>
          <span className={styles.heroSubtitle}>CONOCE NUESTRO</span>
          <h1 className={styles.heroTitle}>Proceso de producción</h1>
          <div className={styles.heroBtns}>
            <Link href="/productos" className={styles.btnVerProductos}>
              Ver productos
            </Link>
            <Link href="#proceso" className={styles.btnConoceMas}>
              Conoce más
            </Link>
          </div>
        </div>
      </PageHero>

      {pasos.map((paso) => {
        const textContent = (
          <div className={styles.sectionContent}>
            <h2 className={styles.pasoTitulo}>{paso.numero}</h2>
            <h3 className={styles.pasoSubtitulo}>{paso.subtitulo}</h3>
            <p className={styles.pasoTexto}>{paso.texto}</p>
          </div>
        );

        const imageContent = (
          <div className={styles.sectionImageWrapper}>
            <Image
              src={paso.imagen}
              alt={paso.subtitulo}
              fill
              className={styles.sectionImage}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        );

        return (
          <section
            key={paso.numero}
            className={`${styles.section} ${styles[paso.bg as keyof typeof styles]}`}
          >
            {paso.imageLeft ? (
              <>
                {imageContent}
                {textContent}
              </>
            ) : (
              <>
                {textContent}
                {imageContent}
              </>
            )}
          </section>
        );
      })}

      <div className={styles.greenWave}>
        <Image
          src="/images/web/nuestro_proceso/green_wave_process.svg"
          alt=""
          width={1920}
          height={200}
          className={styles.greenWaveImg}
          style={{ height: "auto" }}
        />
      </div>

      <Productos productos={productos} />

      <div className={styles.connectSection}>
        <Image
          src="/images/web/nuestro_proceso/connect_waves.svg"
          alt=""
          width={1920}
          height={400}
          className={styles.connectWaveImg}
          style={{ height: "auto" }}
        />
        <div className={styles.connectContent}>
          <div className={styles.connectInner}>
            <h2 className={styles.connectTitle}>Conecta y disfruta</h2>
            <p className={styles.connectText}>
              En Q&apos;ocina en Casa todo este proceso de producción existe para que tengas sofritos listos para preparar una variedad de platos deliciosos en menos tiempo. <strong>Rico, fácil y sano</strong>... como debe ser.
            </p>
            <div className={styles.heroBtns}>
              <Link href="/recetas" className={styles.btnVerProductos}>
                Ver recetas
              </Link>
              <Link href="/productos" className={styles.btnConoceMas}>
                Comprar ahora
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.connectBackground}>
        <Image
          src="/images/web/nuestro_proceso/connect_background.svg"
          alt=""
          width={1920}
          height={200}
          className={styles.connectBackgroundImg}
          style={{ height: "auto" }}
        />
      </div>
    </>
  );
}
