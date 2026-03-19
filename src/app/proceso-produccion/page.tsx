import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero/PageHero";
import Productos from "@/components/Productos/Productos";
import { getProcesoProduccion, getStrapiImageUrl } from "@/lib/api";
import type { PasoProceso } from "@/types";
import styles from "./page.module.css";

export async function generateMetadata() {
  const res = await getProcesoProduccion().catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Proceso de producción - Q'ocina",
    description: res?.data?.meta_description ?? "",
  };
}

export default async function NuestroProcesoPage() {
  const procesoRes = await getProcesoProduccion().catch(() => null);
  const pasos: PasoProceso[] = procesoRes?.data?.pasos ?? [];
  const productosDestacados = procesoRes?.data?.productos_destacados ?? [];
  const productosCta = procesoRes?.data?.productos_cta;
  const heroImagen = getStrapiImageUrl(procesoRes?.data?.hero_imagen?.url);

  return (
    <>
      <PageHero
        backgroundImage={heroImagen || "/images/web/nuestro_proceso/photo.svg"}
        backgroundAlt="Nuestro proceso de producción"
      >
        <div className={styles.heroText}>
          <span className={styles.heroSubtitle}>{procesoRes?.data?.hero_titulo ?? "CONOCE NUESTRO"}</span>
          <h1 className={styles.heroTitle}>{procesoRes?.data?.hero_subtitulo ?? "Proceso de producción"}</h1>
          <div className={styles.heroBtns}>
            {procesoRes?.data?.hero_cta_primario && (
              <Link
                href={procesoRes.data.hero_cta_primario.url}
                className={styles.btnVerProductos}
                data-btn="dark"
                target={procesoRes.data.hero_cta_primario.nueva_ventana ? "_blank" : undefined}
              >
                {procesoRes.data.hero_cta_primario.texto}
              </Link>
            )}
            {procesoRes?.data?.hero_cta_secundario && (
              <Link
                href={procesoRes.data.hero_cta_secundario.url}
                className={styles.btnConoceMas}
                data-btn="white"
                target={procesoRes.data.hero_cta_secundario.nueva_ventana ? "_blank" : undefined}
              >
                {procesoRes.data.hero_cta_secundario.texto}
              </Link>
            )}
          </div>
        </div>
      </PageHero>

      {pasos.map((paso, index) => {
        const imageLeft = paso.alineacion === "izquierda";
        const bg = index % 2 === 0 ? styles.sectionWhite : styles.sectionGray;
        const imageSrc = getStrapiImageUrl(paso.imagen?.url);

        const textContent = (
          <div className={styles.sectionContent}>
            <h2 className={styles.pasoTitulo}>{paso.etiqueta}</h2>
            <h3 className={styles.pasoSubtitulo}>{paso.titulo}</h3>
            <p className={styles.pasoTexto}>{paso.descripcion}</p>
          </div>
        );

        const imageContent = imageSrc ? (
          <div className={styles.sectionImageWrapper}>
            <Image
              src={imageSrc}
              alt={paso.titulo}
              fill
              className={styles.sectionImage}
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </div>
        ) : null;

        return (
          <section
            key={paso.id}
            className={`${styles.section} ${bg}`}
          >
            {imageLeft ? (
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

      {productosDestacados.length > 0 && (
        <Productos
          productos={productosDestacados}
          title={procesoRes?.data?.productos_titulo ?? undefined}
        />
      )}
      {productosDestacados.length === 0 && productosCta && (
        <div className={styles.productosCta}>
          <Link
            href={productosCta.url}
            className={styles.btnVerProductos}
            data-btn="dark"
            target={productosCta.nueva_ventana ? "_blank" : undefined}
          >
            {productosCta.texto}
          </Link>
        </div>
      )}

      <div className={styles.connectSection}>
        <Image
          src="/images/web/nuestro_proceso/connect_waves.svg"
          alt=""
          width={1920}
          height={400}
          className={`${styles.connectWaveImg} ${styles.connectWaveDesktop}`}
          style={{ height: "auto" }}
        />
        <Image
          src="/images/mobile/nosotros/union.svg"
          alt=""
          width={390}
          height={400}
          className={`${styles.connectWaveImg} ${styles.connectWaveMobile}`}
          style={{ height: "auto" }}
        />
        <div className={styles.connectContent}>
          <div className={styles.connectInner}>
            <h2 className={styles.connectTitle}>{procesoRes?.data?.cta_final_titulo ?? "Conecta y disfruta"}</h2>
            <p className={styles.connectText}>{procesoRes?.data?.cta_final_descripcion}</p>
            <div className={styles.heroBtns}>
              {procesoRes?.data?.cta_final_primario && (
                <Link
                  href={procesoRes.data.cta_final_primario.url}
                  className={styles.btnVerProductos}
                  data-btn="dark"
                  target={procesoRes.data.cta_final_primario.nueva_ventana ? "_blank" : undefined}
                >
                  {procesoRes.data.cta_final_primario.texto}
                </Link>
              )}
              {procesoRes?.data?.cta_final_secundario && (
                <Link
                  href={procesoRes.data.cta_final_secundario.url}
                  className={styles.btnConoceMas}
                  data-btn="white"
                  target={procesoRes.data.cta_final_secundario.nueva_ventana ? "_blank" : undefined}
                >
                  {procesoRes.data.cta_final_secundario.texto}
                </Link>
              )}
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
