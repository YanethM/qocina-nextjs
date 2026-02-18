import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import Subscribe from "@/components/Subscribe/Subscribe";
import Testimonios from "@/components/Testimonios/Testimonios";
import Productos from "@/components/Productos/Productos";
import CocinarConQ from "@/components/CocinarConQ/CocinarConQ";
import NuestroSecreto from "@/components/NuestroSecreto/NuestroSecreto";
import Badges from "@/components/Badges/Badges";
import WaveSection from "@/components/WaveSection/WaveSection";
import RecetasCarousel from "@/components/RecetasCarousel/RecetasCarousel";
import {
  getBadges,
  getProductos,
  getRecetas,
  getTestimonios,
} from "@/lib/api";

export default async function Home() {
  const [badgesRes, productosRes, recetasRes, testimoniosRes] =
    await Promise.all([
      getBadges().catch(() => null),
      getProductos().catch(() => null),
      getRecetas().catch(() => null),
      getTestimonios().catch(() => null),
    ]);

  const badges = badgesRes?.data ?? [];
  const productos = productosRes?.data?.slice(0, 3) ?? [];
  const recetas = recetasRes?.data?.slice(0, 3) ?? [];
  const testimonios = testimoniosRes?.data ?? [];

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Prueba las bases culinarias con el toQue de sabor de Gastón
              Acurio.
            </h1>
            <Link href="/productos" className={styles.heroBtn}>
              Explorar productos
            </Link>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroSlogan}>
              <span className={styles.heroSloganText}>ATRÉVETE</span>
              <span className={styles.heroSloganText}>A QOCINAR</span>
              <span className={styles.heroSloganText}>
                CON &quot;<span className={styles.heroQ}>Q</span>&quot;
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* Beneficios - Wave con texto */}
      <WaveSection>
        <p className={styles.beneficiosText}>
          Nuestras <strong>Bases Culinarias</strong> son sofritos listos,
          elaborados con vegetales frescos 100% naturales. Inspiradas en las
          recetas de madres y abuelas son preparadas artesanalmente con el
          toque de sabor de <strong>Gastón Acurio</strong>; para que cocines
          en casa <strong>como un experto</strong> platos deliciosos, sanos
          y en menos tiempo.
        </p>
      </WaveSection>

      {/* Badges / Beneficios */}
      <Badges badges={badges} />


      {/* Productos Destacados */}
      <Productos productos={productos} />

      {/* Métodos de pago */}
      <div className={styles.cardsWrapper}>
        <Image
          src="/images/web/other/cards.png"
          alt="Métodos de pago aceptados"
          width={800}
          height={80}
          className={styles.cardsImage}
        />
      </div>

      {/* Nuestro Secreto */}
      <NuestroSecreto />

      {/* Cocinar con Q */}
      <CocinarConQ />

      {/* Amazon Banner */}
      <section className={styles.amazonBanner}>
        <Image
          src="/images/web/home/amazon_web.png"
          alt="Disponible en Amazon"
          width={1920}
          height={400}
          className={styles.amazonWeb}
          priority={false}
        />
        <Image
          src="/images/mobile/amazon/amazon.svg"
          alt="Disponible en Amazon"
          width={390}
          height={400}
          className={styles.amazonMobile}
          priority={false}
        />
      </section>

      {/* Recetas Destacadas */}
      <RecetasCarousel recetas={recetas} />

      {/* Testimonios */}
      <Testimonios testimonios={testimonios} />

      {/* Subscribe Component */}
      <Subscribe />
    </>
  );
}
