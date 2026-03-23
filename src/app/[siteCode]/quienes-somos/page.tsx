import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Productos from "@/components/Productos/Productos";
import PremiosCarousel from "@/components/PremiosCarousel/PremiosCarousel";
import { getProductos, getQuienesSomos, getStrapiImageUrl } from "@/lib/api";
import { getLocale } from "@/lib/locale";
import styles from "./page.module.css";

interface Props {
  params: Promise<{ siteCode: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteCode } = await params;
  const res = await getQuienesSomos(undefined, siteCode).catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Nosotros - Q'ocina",
    description: res?.data?.meta_description ?? "Conoce quiénes somos, nuestra misión, visión y valores.",
  };
}

export default async function NosotrosPage({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale();
  const [productosRes, quienesSomosRes] = await Promise.all([
    getProductos(locale, siteCode).catch(() => null),
    getQuienesSomos(locale, siteCode).catch(() => null),
  ]);

  const productos = productosRes?.data?.slice(0, 3) ?? [];
  const data = quienesSomosRes?.data;

  const heroImagen = data?.hero_imagen;
  const heroSrc = heroImagen?.formats?.large?.url
    ? getStrapiImageUrl(heroImagen.formats.large.url)
    : heroImagen?.url
    ? getStrapiImageUrl(heroImagen.url)
    : "/images/web/nosotros/banner.svg";

  const heroSrcMedium = heroImagen?.formats?.medium?.url
    ? getStrapiImageUrl(heroImagen.formats.medium.url)
    : heroSrc;

  const heroSrcSmall = heroImagen?.formats?.small?.url
    ? getStrapiImageUrl(heroImagen.formats.small.url)
    : heroSrcMedium;

  const heroWidth = heroImagen?.formats?.large?.width ?? heroImagen?.width ?? 1440;
  const heroHeight = heroImagen?.formats?.large?.height ?? heroImagen?.height ?? 600;

  return (
    <div className={styles.page}>
      <section className={styles.bannerSection}>
        <picture>
          <source media="(max-width: 500px)" srcSet={heroSrcSmall} />
          <source media="(max-width: 800px)" srcSet={heroSrcMedium} />
          <Image
            src={heroSrc}
            alt={heroImagen?.alternativeText ?? data?.hero_titulo ?? "Nosotros"}
            width={heroWidth}
            height={heroHeight}
            className={styles.bannerImage}
            priority
            style={{ width: "100%", height: "auto" }}
            unoptimized
          />
        </picture>
        <Image
          src="/images/web/nosotros/banner.svg"
          alt=""
          width={1957}
          height={1047}
          className={`${styles.bannerOverlay} ${styles.desktopOnly}`}
          unoptimized
        />
        <Image
          src="/images/mobile/nosotros/banner.svg"
          alt=""
          width={390}
          height={629}
          className={`${styles.bannerOverlay} ${styles.mobileOnly}`}
          unoptimized
        />
        <div className={styles.bannerTextContainer}>
          <div className={styles.bannerTextInner}>
            {data?.hero_titulo && (
              <p className={styles.heroTitulo}>{data.hero_titulo}</p>
            )}
            {data?.hero_subtitulo && (
              <p className={styles.heroSubtitulo}>{data.hero_subtitulo}</p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.secondSection}>
        <Image
          src="/images/web/nosotros/second_section.svg"
          alt=""
          width={1440}
          height={600}
          className={styles.desktopOnly}
          style={{ width: "100%", height: "auto" }}
        />
        <Image
          src="/images/mobile/nosotros/second_section.svg"
          alt=""
          width={390}
          height={600}
          className={styles.mobileOnly}
          style={{ width: "100%", height: "auto" }}
        />
        {(data?.que_es_titulo || data?.que_es_descripcion) && (
          <div className={styles.secondTextOverlay}>
            {data.que_es_titulo && (
              <h2 className={styles.queEsTitulo}>{data.que_es_titulo}</h2>
            )}
            {data.que_es_descripcion && (
              <div className={styles.queEsDescripcion}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className={styles.queEsDescripcionP}>{children}</p>,
                    strong: ({ children }) => <strong className={styles.queEsDescripcionStrong}>{children}</strong>,
                  }}
                >
                  {data.que_es_descripcion}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </section>

      {data?.valores && data.valores.length > 0 && (
        <section className={styles.beneficiosSection}>
          {[...data.valores]
            .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
            .map((valor, index) => {
              const colorConfig = [
                { svg: "/images/web/nosotros/rojo.svg", textColor: "#ffffff" },
                { svg: "/images/web/nosotros/amarillo.svg", textColor: "#000000" },
                { svg: "/images/web/nosotros/verde.svg", textColor: "#ffffff" },
              ];
              const { svg: colorSvg, textColor } = colorConfig[index] ?? colorConfig[0];
              const imgSrc = valor.imagen?.formats?.large?.url
                ? getStrapiImageUrl(valor.imagen.formats.large.url)
                : valor.imagen?.url
                ? getStrapiImageUrl(valor.imagen.url)
                : null;
              return (
                <div key={valor.id} className={styles.beneficioCard}>
                  <div className={styles.beneficioImageTop}>
                    {imgSrc && (
                      <Image
                        src={imgSrc}
                        alt={valor.imagen?.alternativeText ?? valor.titulo}
                        fill
                        style={{ objectFit: "cover" }}
                        loading="lazy"
                        unoptimized
                      />
                    )}
                  </div>
                  <div
                    className={styles.beneficioBottom}
                    style={{ backgroundImage: `url('${colorSvg}')` }}
                  >
                    <div className={styles.beneficioText} style={{ color: textColor }}>
                      <p className={styles.beneficioTitulo}>{valor.titulo}</p>
                      <p className={styles.beneficioDescripcion}>{valor.descripcion}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </section>
      )}

      <section className={styles.gastonSection}>
        <Image
          src="/images/web/nosotros/gaston.svg"
          alt={data?.chef_nombre ?? "Gastón Acurio"}
          width={1440}
          height={800}
          className={`${styles.gastonImage} ${styles.desktopOnly}`}
          loading="lazy"
          unoptimized
          style={{ width: "100%", height: "auto" }}
        />

        <div className={`${styles.gastonPrevWrapper} ${styles.mobileOnly}`}>
          <Image
            src="/images/mobile/nosotros/PREV_GASTON.svg"
            alt=""
            width={390}
            height={500}
            style={{ width: "100%", height: "auto", display: "block" }}
            loading="lazy"
            unoptimized
          />
          {(data?.chef_nombre || data?.chef_titulo) && (
            <div className={styles.gastonMobileTop}>
              {data.chef_nombre && (
                <p className={styles.gastonNombre}>{data.chef_nombre}</p>
              )}
              {data.chef_titulo && (
                <p className={styles.gastonTitulo}>{data.chef_titulo}</p>
              )}
            </div>
          )}
        </div>

        <div className={`${styles.gastonMainWrapper} ${styles.mobileOnly}`}>
          <Image
            src="/images/mobile/nosotros/gaston.svg"
            alt={data?.chef_nombre ?? "Gastón Acurio"}
            width={390}
            height={800}
            style={{ width: "100%", height: "auto", display: "block" }}
            loading="lazy"
            unoptimized
          />
          {(data?.chef_descripcion || data?.chef_cta) && (
            <div className={styles.gastonMobileBottom}>
              {data.chef_descripcion && (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className={styles.gastonDescripcion}>{children}</p>,
                    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
                  }}
                >
                  {data.chef_descripcion}
                </ReactMarkdown>
              )}
              {data.chef_cta && (
                <a
                  href={data.chef_cta.url}
                  className={styles.gastonCta}
                  data-btn="dark"
                  target={data.chef_cta.nueva_ventana ? "_blank" : "_self"}
                  rel={data.chef_cta.nueva_ventana ? "noopener noreferrer" : undefined}
                >
                  {data.chef_cta.texto}
                </a>
              )}
            </div>
          )}
        </div>

        <div className={`${styles.gastonContainer} ${styles.desktopOnly}`}>
          {(data?.chef_nombre || data?.chef_titulo) && (
            <div className={styles.gastonTextOverlay}>
              {data.chef_nombre && (
                <p className={styles.gastonNombre}>{data.chef_nombre}</p>
              )}
              {data.chef_titulo && (
                <p className={styles.gastonTitulo}>{data.chef_titulo}</p>
              )}
            </div>
          )}
          {(data?.chef_descripcion || data?.chef_cta) && (
            <div className={styles.gastonDescripcionOverlay}>
              {data.chef_descripcion && (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className={styles.gastonDescripcion}>{children}</p>,
                    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
                  }}
                >
                  {data.chef_descripcion}
                </ReactMarkdown>
              )}
              {data.chef_cta && (
                <a
                  href={data.chef_cta.url}
                  className={styles.gastonCta}
                  data-btn="dark"
                  target={data.chef_cta.nueva_ventana ? "_blank" : "_self"}
                  rel={data.chef_cta.nueva_ventana ? "noopener noreferrer" : undefined}
                >
                  {data.chef_cta.texto}
                </a>
              )}
            </div>
          )}
        </div>

      </section>

      <section className={styles.premiosSection}>
        <PremiosCarousel
          titulo={data?.premios_titulo}
          premios={data?.premios ?? []}
        />
      </section>

      <Productos
        productos={productos}
        title={data?.productos_titulo ?? undefined}
        subtitle={data?.productos_subtitulo ?? undefined}
        description={data?.productos_descripcion ?? undefined}
        ctaText={data?.productos_cta?.texto ?? undefined}
        ctaUrl={data?.productos_cta?.url ?? undefined}
        ctaNuevaVentana={data?.productos_cta?.nueva_ventana ?? undefined}
        className={styles.productosQuienes}
      />

      <section className={styles.procesoSection}>
        <Image
          src="/images/web/nosotros/proceso.svg"
          alt={data?.proceso_titulo ?? "Proceso"}
          width={1440}
          height={600}
          className={`${styles.gastonImage} ${styles.desktopOnly}`}
          style={{ width: "100%", height: "auto" }}
        />
        <Image
          src="/images/mobile/nosotros/proceso.svg"
          alt={data?.proceso_titulo ?? "Proceso"}
          width={390}
          height={600}
          className={`${styles.gastonImage} ${styles.mobileOnly}`}
          style={{ width: "100%", height: "auto" }}
        />
        {(data?.proceso_titulo || data?.proceso_cta) && (
          <div className={styles.procesoContainer}>
            <div className={styles.procesoOverlay}>
              {data.proceso_titulo && (
                <p className={styles.procesoTitulo}>{data.proceso_titulo}</p>
              )}
              {data.proceso_cta && (
                <a
                  href={data.proceso_cta.url}
                  className={styles.procesoCta}
                  data-btn="yellow"
                  target={data.proceso_cta.nueva_ventana ? "_blank" : "_self"}
                  rel={data.proceso_cta.nueva_ventana ? "noopener noreferrer" : undefined}
                >
                  {data.proceso_cta.texto}
                </a>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
