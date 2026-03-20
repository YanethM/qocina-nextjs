import Link from "next/link";
import Image from "next/image";
import { getProductosPage, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";
import ProductosNuestroSecreto from "@/components/ProductosNuestroSecreto/ProductosNuestroSecreto";
import PacksDestacados from "@/components/PacksDestacados/PacksDestacados";
import ProductosCarousel from "@/components/ProductosCarousel/ProductosCarousel";
import { Button } from "@/components/ui";

export async function generateMetadata() {
  const res = await getProductosPage().catch(() => null);
  return {
    title: res?.data?.meta_title ?? "Productos - Q'ocina",
    description: res?.data?.meta_description ?? "Explora nuestra variedad de productos artesanales",
  };
}

const CARD_COLORS = [styles.cardGreen, styles.cardYellow, styles.cardRed];

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

function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;
}

export default async function ProductosPage() {
  const productosPageRes = await getProductosPage().catch(() => null);

  const pageData = productosPageRes?.data;
  const productos = pageData?.productos_destacados ?? [];
  console.log("[productos] ids:", productos.map((p) => ({ id: p.id, documentId: (p as any).documentId, nombre: p.nombre })));
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

      <section className={styles.content}>
        {pageData?.productos_titulo && (
          <h2 className={styles.sectionTitle}>{pageData.productos_titulo}</h2>
        )}
        {productos.length > 3 ? (
          <ProductosCarousel productos={productos} />
        ) : (
          <div className={`${styles.grid} ${productos.length <= 2 ? styles.gridFew : ""}`}>
            {productos.map((producto, index) => {
              const colorClass = CARD_COLORS[index % 3];
              const imagenUrl = producto.imagen_principal
                ? getStrapiImageUrl(producto.imagen_principal.url)
                : null;

              return (
                <div key={producto.id} className={`${styles.card} ${colorClass}`}>
                  <div className={styles.cardImageWrapper}>
                    {imagenUrl && (
                      <Image
                        src={imagenUrl}
                        alt={
                          producto.imagen_principal?.alternativeText ??
                          producto.nombre
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.cardImage}
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{producto.nombre}</h3>
                    <p className={styles.cardPrice}>
                      {formatPrice(producto.precio, producto.precio_moneda)}
                    </p>
                    {producto.presentacion && (
                      <p className={styles.cardPresentacion}>
                        {producto.presentacion}
                      </p>
                    )}
                    <p className={styles.cardDescription}>
                      {producto.descripcion_corta}
                    </p>
                    <Link
                      href={`/productos/${producto.slug}`}
                      className={styles.cardButton}>
                      Añadir al carrito
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
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
        secretoImagen={pageData?.secreto_imagen ?? null}
      />

      <section className={styles.paraQuien}>
        <h2 className={styles.paraQuienTitle}>¿Para quién es Q&apos;ocina?</h2>

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

      <section className={styles.tieneDudas}>
        <div className={styles.tieneDudasCard}>
          <div className={styles.tieneDudasContent}>
            <h2 className={styles.tieneDudasTitle}>
              {pageData?.ayuda_titulo ?? "¿Tienes dudas o necesitas ayuda?"}
            </h2>
            <p className={styles.tieneDudasDescription}>
              {pageData?.ayuda_subtitulo ?? "Resolvemos preguntas rápidas sobre productos, envíos y preparación."}
            </p>
          </div>
          <Button
            href={pageData?.ayuda_cta?.url ?? "/contacto"}
            variant="yellow"
            target={pageData?.ayuda_cta?.nueva_ventana ? "_blank" : undefined}
            className={styles.tieneDudasBtn}>
            {pageData?.ayuda_cta?.texto ?? "Resuelve aquí tus dudas"}
          </Button>
        </div>

        <div className={styles.tieneDudasImgWrapper}>
          <Image
            src="/images/web/products/tienes_dudas_web.svg"
            alt="¿Tienes dudas?"
            width={1440}
            height={400}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <Image
          src="/images/web/products/tienes_dudas_mobile.svg"
          alt=""
          width={390}
          height={400}
          className={styles.tieneDudasMobileImg}
          style={{ width: "100%", height: "auto" }}
        />
      </section>
    </div>
  );
}
