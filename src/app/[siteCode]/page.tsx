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
  getProductos,
  getRecetas,
  getTestimonios,
  getHomePage,
  getStrapiImageUrl,
} from "@/lib/api";
import { getLocale } from "@/lib/locale";
import BeneficiosWaveSection from "@/components/BeneficiosWaveSection/BeneficiosWaveSection";
import IngredientesNaturales from "@/components/IngredientesNaturales/IngredientesNaturales";
import VideoSection from "@/components/VideoSection/VideoSection";

interface Props {
  params: Promise<{ siteCode: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteCode: _siteCode } = await params;
  const locale = await getLocale(_siteCode);
  const res = await getHomePage(locale, _siteCode).catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Q'ocina En Casa",
    description: res?.data?.meta_description ?? "Bases culinarias artesanales con el toque de Gastón Acurio",
  };
}

export default async function Home({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale(siteCode);

  const [homeRes, productosRes, recetasRes, testimoniosRes] = await Promise.all([
    getHomePage(locale).catch((e) => { console.error("getHomePage error:", e); return null; }),
    getProductos(locale, siteCode).catch((e) => { console.error("getProductos error:", e); return null; }),
    getRecetas(locale, undefined, siteCode).catch((e) => { console.error("getRecetas error:", e); return null; }),
    getTestimonios(locale).catch((e) => { console.error("getTestimonios error:", e); return null; }),
  ]);

  const subscribeCopy = locale === "en"
    ? {
        title: "Get Inspired with Every Recipe.",
        description: "Share your email and be the first to receive new recipes, product launches, special offers, and cooking tips inspired by authentic Peruvian flavor.",
        boton: "Subscribe Now",
      }
    : {
        title: "Inspírate con cada receta.",
        description: "Déjanos tu correo y sé el primero en recibir recetas, lanzamientos, promociones y consejos para cocinar con el auténtico sabor peruano.",
        boton: "Quiero suscribirme",
      };

  const slides = homeRes?.data?.slider ?? [];
  const introTexto = homeRes?.data?.intro_texto ?? "";
  const productosTitulo = homeRes?.data?.productos_titulo ?? "";
  const productosCta = homeRes?.data?.productos_cta;
  const badges = homeRes?.data?.intro_badges ?? [];
  const productos = productosRes?.data?.slice(0, 3) ?? [];
  const recetas = recetasRes?.data?.slice(0, 3) ?? [];
  const testimonios = testimoniosRes?.data ?? [];

  const historiaImagenUrl = getStrapiImageUrl(homeRes?.data?.historia_imagen?.url) || undefined;
  const secretoChefImagenUrl = getStrapiImageUrl(homeRes?.data?.secreto_chef_imagen?.url) || undefined;
  const naturalImagenUrl = getStrapiImageUrl(homeRes?.data?.natural_imagen?.url) || undefined;


  return (
    <>
      <div className={styles.versionclass}>v1</div>
      <HeroBanner slides={slides} />
      {homeRes?.data?.video_url && homeRes?.data?.video_cover && (
        <VideoSection
          titulo={homeRes.data.video_titulo}
          descripcion={homeRes.data.video_descripcion}
          videoUrl={homeRes.data.video_url}
          cover={homeRes.data.video_cover}
        />
      )}
      {(badges.length > 0 || introTexto) && (
        <BeneficiosWaveSection badges={badges} textoBeneficios={introTexto} />
      )}

      <Productos
        productos={productos}
        title={productosTitulo}
        ctaText={productosCta?.texto}
        ctaUrl={productosCta?.url}
        ctaNuevaVentana={productosCta?.nueva_ventana}
      />

      {(homeRes?.data?.natural_titulo ||
        homeRes?.data?.natural_descripcion ||
        homeRes?.data?.natural_frase_q ||
        homeRes?.data?.natural_cta) && (
        <IngredientesNaturales
          natural_titulo={homeRes.data.natural_titulo}
          natural_descripcion={homeRes.data.natural_descripcion}
          natural_frase_q={homeRes.data.natural_frase_q}
          natural_cta={homeRes.data.natural_cta}
          natural_imagen_url={naturalImagenUrl}
        />
      )}

      <NuestroSecreto
        secreto_titulo={homeRes?.data?.secreto_titulo}
        secreto_descripcion={homeRes?.data?.secreto_descripcion}
        secreto_badges={homeRes?.data?.secreto_badges}
        secreto_chef_frase_q={homeRes?.data?.secreto_chef_frase_q}
        secreto_cta={homeRes?.data?.secreto_cta}
        secreto_chef_cta={homeRes?.data?.secreto_chef_cta}
        secreto_chef_imagen_url={secretoChefImagenUrl}
        siteCode={siteCode}
        locale={locale}
      />

      <CocinarConQ
        historia_descripcion={homeRes?.data?.historia_descripcion}
        historia_frase_q={homeRes?.data?.historia_frase_q}
        historia_cta={homeRes?.data?.historia_cta}
        historia_imagen_url={historiaImagenUrl}
        siteCode={siteCode}
        locale={locale}
      />

      {(homeRes?.data?.amazon_titulo ||
        homeRes?.data?.amazon_descripcion ||
        homeRes?.data?.amazon_cta) && (
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
          <div className={styles.amazonOverlay}>
            {homeRes.data.amazon_titulo && (
              <h2 className={styles.amazonTitulo}>
                {homeRes.data.amazon_titulo}
              </h2>
            )}
            {homeRes.data.amazon_descripcion && (
              <p className={styles.amazonDescripcion}>
                {homeRes.data.amazon_descripcion}
              </p>
            )}
            {homeRes.data.amazon_cta && (
              <a
                href={homeRes.data.amazon_cta.url}
                target={
                  homeRes.data.amazon_cta.nueva_ventana ? "_blank" : "_self"
                }
                rel={
                  homeRes.data.amazon_cta.nueva_ventana
                    ? "noopener noreferrer"
                    : undefined
                }
                className={styles.amazonCta}
                data-btn="dark">
                {homeRes.data.amazon_cta.texto}
              </a>
            )}
          </div>
        </section>
      )}

      <RecetasCarousel
        recetas={recetas}
        recetas_titulo={homeRes?.data?.recetas_titulo}
        recetas_ver_receta_cta={homeRes?.data?.recetas_ver_receta_cta}
        recetas_cta={homeRes?.data?.recetas_cta}
      />

      <Testimonios
        testimonios={testimonios}
        testimonios_titulo={homeRes?.data?.testimonios_titulo}
      />

      <Subscribe
        title={subscribeCopy.title}
        description={subscribeCopy.description}
        formulario_boton={subscribeCopy.boton}
      />
    </>
  );
}
