import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import Subscribe from "@/components/Subscribe/Subscribe";
import Testimonios from "@/components/Testimonios/Testimonios";
import Productos from "@/components/Productos/Productos";
import CocinarConQ from "@/components/CocinarConQ/CocinarConQ";
import NuestroSecreto from "@/components/NuestroSecreto/NuestroSecreto";
import {
  getBadges,
  getProductos,
  getRecetas,
  getTestimonios,
  getStrapiImageUrl,
} from "@/lib/api";

const COLOR_MAP: Record<string, string> = {
  rojo: "#CE171C",
  verde: "#6A892C",
  amarillo: "#F4A910",
};

const WAVE_MAP: Record<string, string> = {
  rojo: "/images/web/home/wave_red.png",
  verde: "/images/web/home/wave_green.png",
  amarillo: "/images/web/home/wave_yellow.png",
};

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

      {/* Badges / Beneficios */}
      {badges.length > 0 && (
        <section className={styles.beneficios}>
          {/* Texto con wave de fondo */}
          <div className={styles.beneficiosWaveWrapper}>
            <div className={styles.beneficiosWave}>
              <img
                src="/images/web/home/wave_subscribe.png"
                alt=""
                className={styles.beneficiosWaveImg}
              />
            </div>
            <div className={styles.beneficiosTextOverlay}>
              <p>
                Nuestras <strong>Bases Culinarias</strong> son sofritos listos,
                elaborados con vegetales frescos 100% naturales. Inspiradas en las
                recetas de madres y abuelas son preparadas artesanalmente con el
                toque de sabor de <strong>Gastón Acurio</strong>; para que cocines
                en casa <strong>como un experto</strong> platos deliciosos, sanos
                y en menos tiempo.
              </p>
            </div>
          </div>
          <div className={styles.badges}>
            {badges.map((badge) => (
              <div key={badge.id} className={styles.badge}>
                <div className={styles.badgeIcon}>
                  {badge.icono && (
                    <Image
                      src={getStrapiImageUrl(badge.icono.url)}
                      alt={badge.icono.alternativeText || badge.titulo}
                      width={60}
                      height={60}
                    />
                  )}
                </div>
                <span className={styles.badgeTitle}>{badge.titulo}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Productos Destacados */}
      <Productos productos={productos} />

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
      {recetas.length > 0 && (
        <section className={styles.recetasSection}>
          <h2 className={styles.recetasSectionTitle}>Recetas</h2>
          <div className={styles.recetasGrid}>
            {recetas.map((receta) => {
              const cardColor = COLOR_MAP[receta.color_card] || "#CE171C";
              const waveSrc =
                WAVE_MAP[receta.color_card] || "/images/web/home/wave_red.png";

              return (
                <Link
                  key={receta.id}
                  href={`/recetas/${receta.documentId}`}
                  className={styles.recetaCard}
                  data-color={receta.color_card}>
                  <div className={styles.recetaCardImage}>
                    {receta.imagen_principal && (
                      <Image
                        src={getStrapiImageUrl(receta.imagen_principal.url)}
                        alt={
                          receta.imagen_principal.alternativeText ||
                          receta.titulo
                        }
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  {/* Onda PNG entre imagen y body */}
                  <div className={styles.recetaWave}>
                    <img
                      src={waveSrc}
                      alt="Imagen de la receta"
                      className={styles.recetaWaveImg}
                    />
                  </div>
                  <div
                    className={styles.recetaCardBody}
                    style={{ backgroundColor: cardColor }}>
                    <h3 className={styles.recetaCardTitle}>{receta.titulo}</h3>
                    <p className={styles.recetaCardDescription}>
                      {receta.descripcion_corta}
                    </p>
                    <div className={styles.recetaCardCta}>
                      <span className={styles.recetaCtaButton}>
                        Ver receta{" "}
                        <Image
                          src="/images/web/home/arrow_right.png"
                          alt=""
                          width={25}
                          height={25}
                          className={styles.recetaCtaArrow}
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className={styles.recetasVerTodas}>
            <Link href="/recetas" className={styles.verTodasBtn}>
              Ver todas{" "}
              <Image
                src="/images/web/home/white_arrow_right.png"
                alt=""
                width={20}
                height={20}
              />
            </Link>
          </div>
        </section>
      )}

      {/* Testimonios */}
      <Testimonios testimonios={testimonios} />

      {/* Subscribe Component */}
      <Subscribe />
    </>
  );
}
