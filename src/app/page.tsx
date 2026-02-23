import Image from "next/image";
import styles from "./page.module.css";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import Subscribe from "@/components/Subscribe/Subscribe";
import Testimonios from "@/components/Testimonios/Testimonios";
import Productos from "@/components/Productos/Productos";
import CocinarConQ from "@/components/CocinarConQ/CocinarConQ";
import NuestroSecreto from "@/components/NuestroSecreto/NuestroSecreto";
import RecetasCarousel from "@/components/RecetasCarousel/RecetasCarousel";
import {
  getBadges,
  getProductos,
  getRecetas,
  getTestimonios,
  getHomePage,
} from "@/lib/api";
import BeneficiosWaveSection from "@/components/BeneficiosWaveSection/BeneficiosWaveSection";
import IngredientesNaturales from "@/components/IngredientesNaturales/IngredientesNaturales";

export default async function Home() {
  const [homeRes, badgesRes, productosRes, recetasRes, testimoniosRes] =
    await Promise.all([
      getHomePage().catch(() => null),
      getBadges().catch(() => null),
      getProductos().catch(() => null),
      getRecetas().catch(() => null),
      getTestimonios().catch(() => null),
    ]);

  const slides = homeRes?.data?.slider ?? [];
  const badges = badgesRes?.data ?? [];
  const productos = productosRes?.data?.slice(0, 3) ?? [];
  const recetas = recetasRes?.data?.slice(0, 3) ?? [];
  const testimonios = testimoniosRes?.data ?? [];

  return (
    <>
      {/* Hero */}
      <HeroBanner slides={slides} />
      {/* Beneficios - Wave con texto */}
      <BeneficiosWaveSection
        badges={badges}
        textoBeneficios="Nuestras <strong>Bases Culinarias</strong> son sofritos listos, elaborados con vegetales frescos 100% naturales. Inspiradas en las recetas de madres y abuelas son preparadas artesanalmente con el toque de sabor de <strong>Gastón Acurio</strong>; para que cocines en casa <strong>como un experto</strong> platos deliciosos, sanos y en menos tiempo."
      />

      {/* Productos Destacados */}
      <Productos productos={productos} />

      {/* Ingredientes naturales */}
      <IngredientesNaturales />

      {/* Nuestro Secreto */}
      <NuestroSecreto />

      {/* Cocinar con Q */}
      <CocinarConQ />

      {/* Amazon Banner */}
      <section className={styles.amazonBanner}>
        <Image
          src="/images/web/home/amazon/amazon.svg"
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
