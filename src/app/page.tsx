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
import { getLocale } from "@/lib/locale";
import BeneficiosWaveSection from "@/components/BeneficiosWaveSection/BeneficiosWaveSection";
import IngredientesNaturales from "@/components/IngredientesNaturales/IngredientesNaturales";

export default async function Home() {
  const locale = await getLocale();
  const [homeRes, badgesRes, productosRes, recetasRes, testimoniosRes] =
    await Promise.all([
      getHomePage(locale).catch((e) => { console.error("getHomePage error:", e); return null; }),
      getBadges(locale).catch((e) => { console.error("getBadges error:", e); return null; }),
      getProductos(locale).catch((e) => { console.error("getProductos error:", e); return null; }),
      getRecetas(locale).catch((e) => { console.error("getRecetas error:", e); return null; }),
      getTestimonios(locale).catch((e) => { console.error("getTestimonios error:", e); return null; }),
    ]);

  console.log("[HOME] locale:", await getLocale());
  console.log("[HOME] homeRes.data:", homeRes?.data ? "OK" : "NULL");
  console.log("[HOME] productosRes count:", productosRes?.data?.length ?? 0);
  console.log("[HOME] recetasRes count:", recetasRes?.data?.length ?? 0);
  console.log("[HOME] badgesRes count:", badgesRes?.data?.length ?? 0);
  console.log("[HOME] testimoniosRes count:", testimoniosRes?.data?.length ?? 0);

  const slides = homeRes?.data?.slider ?? [];
  const introTexto = homeRes?.data?.intro_texto ?? "";
  const productosTitulo = homeRes?.data?.productos_titulo ?? "";
  const productosCta = homeRes?.data?.productos_cta;
  const badges = badgesRes?.data ?? [];
  const productos = productosRes?.data?.slice(0, 3) ?? [];
  const recetas = recetasRes?.data?.slice(0, 3) ?? [];
  const testimonios = testimoniosRes?.data ?? [];

  return (
    <>
      <HeroBanner slides={slides} />
      <BeneficiosWaveSection
        badges={badges}
        textoBeneficios={introTexto}
      />

      <Productos
        productos={productos}
        title={productosTitulo}
        ctaText={productosCta?.texto}
        ctaUrl={productosCta?.url}
        ctaNuevaVentana={productosCta?.nueva_ventana}
      />

      <IngredientesNaturales
        natural_titulo={homeRes?.data?.natural_titulo}
        natural_descripcion={homeRes?.data?.natural_descripcion}
        natural_frase_q={homeRes?.data?.natural_frase_q}
        natural_cta={homeRes?.data?.natural_cta}
      />

      <NuestroSecreto
        secreto_titulo={homeRes?.data?.secreto_titulo}
        secreto_descripcion={homeRes?.data?.secreto_descripcion}
        secreto_chef_frase_q={homeRes?.data?.secreto_chef_frase_q}
        secreto_cta={homeRes?.data?.secreto_cta}
        secreto_chef_cta={homeRes?.data?.secreto_chef_cta}
      />

      <CocinarConQ
        historia_descripcion={homeRes?.data?.historia_descripcion}
        historia_frase_q={homeRes?.data?.historia_frase_q}
        historia_cta={homeRes?.data?.historia_cta}
      />

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
          loading="eager"
        />
      </section>

      <RecetasCarousel recetas={recetas} />

      <Testimonios testimonios={testimonios} />

      <Subscribe />
    </>
  );
}
