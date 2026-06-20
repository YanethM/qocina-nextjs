import Image from "next/image";
import { getProductosPage, getStrapiImageUrl } from "@/lib/api";
import { getLocale } from "@/lib/locale";
import ComingSoon from "@/components/ComingSoon/ComingSoon";
import styles from "./page.module.css";
import ProductosNuestroSecreto from "@/components/ProductosNuestroSecreto/ProductosNuestroSecreto";
import PacksDestacados from "@/components/PacksDestacados/PacksDestacados";
import ProductosCarousel from "@/components/ProductosCarousel/ProductosCarousel";
import ProductCardGrid from "@/components/ProductCardGrid/ProductCardGrid";
import { Button } from "@/components/ui";

interface Props {
  params: Promise<{ siteCode: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale();
  const res = await getProductosPage(locale, siteCode).catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Productos - Q'ocina",
    description: res?.data?.meta_description ?? "Explora nuestra variedad de productos artesanales",
  };
}

const RECT_SVGS = [
  "/images/web/products/rectangle1.svg",
  "/images/web/products/rectangle2.svg",
  "/images/web/products/rectangle3.svg",
];

const MOBILE_CARD_SVGS = [
  "/images/mobile/products/card1.svg",
  "/images/mobile/products/card2.svg",
  "/images/mobile/products/card3.svg",
];

const IS_REVERSED = [false, true, false];

export default async function ProductosPage({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale();
  const productosPageRes = await getProductosPage(locale, siteCode).catch(() => null);

  const pageData = productosPageRes?.data;

  if (!pageData) return <ComingSoon />;

  const ayudaImagen = pageData?.ayuda_imagen;
  const ayudaImagenMobile = pageData?.ayuda_imagen_mobile;
  const showAyudaSection = Boolean(
    pageData?.ayuda_titulo || pageData?.ayuda_subtitulo || pageData?.ayuda_cta,
  );
  const ayudaImagenUrl = ayudaImagen
    ? getStrapiImageUrl(
      ayudaImagen.formats?.large?.url ??
        ayudaImagen.formats?.medium?.url ??
        ayudaImagen.formats?.small?.url ??
        ayudaImagen.url,
    )
    : null;
  const ayudaImagenMobileUrl = ayudaImagenMobile
    ? getStrapiImageUrl(
      ayudaImagenMobile.formats?.medium?.url ??
        ayudaImagenMobile.formats?.small?.url ??
        ayudaImagenMobile.url,
    )
    : "/images/web/products/tienes_dudas_mobile.svg";
  const productos = (pageData?.productos_destacados ?? []).filter((p) => p.disponible);
  console.log("[productos] ids:", productos.map((p) => ({ id: p.id, documentId: p.documentId, nombre: p.nombre })));
  const rawPacks = pageData?.packs_destacados;
  const packsDestacados = (Array.isArray(rawPacks) ? rawPacks : []).sort(
    (a, b) => a.orden - b.orden,
  );
  const rawPerfiles = pageData?.perfiles_usuario;
  const perfilesUsuario = (Array.isArray(rawPerfiles) ? rawPerfiles : []).sort(
    (a, b) => a.orden - b.orden,
  );

  return (
    <div className={styles.page}>
      {(pageData?.hero_titulo || pageData?.hero_subtitulo) && (
        <section className={styles.hero}>
          <Image
            src="/images/web/products/container.svg"
            alt="Productos Q'ocina"
            fill
            className={styles.heroImage}
            style={{ objectFit: "cover" }}
            priority
          />
          <div className={styles.heroText}>
            {pageData?.hero_titulo && (
              <p className={styles.heroTitulo}>{pageData.hero_titulo}</p>
            )}
            {pageData?.hero_subtitulo && (
              <p className={styles.heroSubtitulo}>{pageData.hero_subtitulo}</p>
            )}
          </div>
        </section>
      )}

      <section className={styles.content}>
        {pageData?.productos_titulo && (
          <h2 className={styles.sectionTitle}>{pageData.productos_titulo}</h2>
        )}
        {productos.length > 3 ? (
          <ProductosCarousel productos={productos} />
        ) : (
          <ProductCardGrid
            productos={productos}
            fewClass={productos.length <= 2 ? styles.gridFew : undefined}
          />
        )}
      </section>

      {packsDestacados.length > 0 && (
        <PacksDestacados
          packs={packsDestacados}
          titulo={pageData?.packs_titulo}
          mostrarDescuento={pageData?.packs_mostrar_descuento ?? false}
          porcentajeDescuento={pageData?.packs_porcentaje_descuento}
        />
      )}

      <ProductosNuestroSecreto
        titulo={pageData?.secreto_titulo}
        secretoImagen={pageData?.secreto_imagen ?? null}
      />

      <section className={styles.paraQuien}>
        {pageData?.para_quien_titulo && (
          <h2 className={styles.paraQuienTitle}>{pageData.para_quien_titulo}</h2>
        )}

        <div className={styles.paraQuienContainer}>
          {perfilesUsuario.map((perfil, index) => {
            const svgIndex = index % 3;
            const isReversed = IS_REVERSED[svgIndex];
            const imagenUrl = perfil.imagen
              ? getStrapiImageUrl(perfil.imagen.url)
              : null;

            return (
              <div
                key={perfil.id}
                className={`${styles.paraQuienRow} ${isReversed ? styles.paraQuienRowReversed : ""}`}>
                <div
                  className={`${styles.paraQuienRectWrapper} ${
                    isReversed ? styles.paraQuienRectWrapperReversed : ""
                  }`}>
                  <Image
                    src={RECT_SVGS[svgIndex]}
                    alt=""
                    aria-hidden="true"
                    fill
                    className={styles.paraQuienRect}
                  />
                </div>

                <div className={styles.paraQuienMobileCardWrapper}>
                  <Image
                    src={MOBILE_CARD_SVGS[svgIndex]}
                    alt=""
                    aria-hidden="true"
                    fill
                    className={styles.paraQuienMobileCard}
                  />
                </div>

                <div className={styles.paraQuienCircle}>
                  {imagenUrl && (
                    <Image
                      src={imagenUrl}
                      alt={perfil.titulo}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 62vw, 431px"
                    />
                  )}
                </div>

                <div className={styles.paraQuienText}>
                  <h3 className={styles.paraQuienItemTitle}>{perfil.titulo}</h3>
                  <p className={styles.paraQuienItemDesc}>
                    {perfil.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {showAyudaSection && (
        <section className={styles.tieneDudas}>
          <div className={styles.tieneDudasCard}>
            <div className={styles.tieneDudasContent}>
              {pageData?.ayuda_titulo && (
                <h2 className={styles.tieneDudasTitle}>
                  {pageData.ayuda_titulo}
                </h2>
              )}
              {pageData?.ayuda_subtitulo && (
                <p className={styles.tieneDudasDescription}>
                  {pageData.ayuda_subtitulo}
                </p>
              )}
            </div>
            {pageData?.ayuda_cta && (
              <Button
                href={pageData.ayuda_cta.url?.startsWith("/") ? `/${siteCode}${pageData.ayuda_cta.url}` : pageData.ayuda_cta.url}
                variant="yellow"
                target={pageData.ayuda_cta.nueva_ventana ? "_blank" : undefined}
                className={styles.tieneDudasBtn}>
                {pageData.ayuda_cta.texto}
              </Button>
            )}
          </div>

          <div className={styles.tieneDudasImgWrapper}>
            {ayudaImagenUrl ? (
              <Image
                src={ayudaImagenUrl}
                alt={ayudaImagen?.alternativeText ?? ""}
                width={1440}
                height={400}
                className={styles.tieneDudasBgImage}
                style={{ width: "100%", height: "auto" }}
                unoptimized
              />
            ) : (
              <div className={styles.tieneDudasPlaceholder} />
            )}
          </div>

          <div className={styles.tieneDudasMobileImg}>
            <Image
              src={ayudaImagenMobileUrl}
              alt={ayudaImagenMobile?.alternativeText ?? ""}
              width={390}
              height={400}
              className={styles.tieneDudasBgImage}
              style={{ width: "100%", height: "auto" }}
              unoptimized
            />
          </div>
        </section>
      )}
    </div>
  );
}
