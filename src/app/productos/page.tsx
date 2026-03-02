import Link from "next/link";
import Image from "next/image";
import { getProductos, getProductosPage, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";
import ProductosNuestroSecreto from "@/components/ProductosNuestroSecreto/ProductosNuestroSecreto";
import PacksDestacados from "@/components/PacksDestacados/PacksDestacados";
import { Button } from "@/components/ui";

export const metadata = {
  title: "Productos - Q'ocina",
  description: "Explora nuestra variedad de productos artesanales",
};

const CARD_COLORS = [styles.cardGreen, styles.cardYellow, styles.cardRed];

// SVGs de fondo desktop: uno por fila según índice
const RECT_SVGS = [
  "/images/web/products/rectangle1.svg",
  "/images/web/products/rectangle2.svg",
  "/images/web/products/rectangle1.svg",
];

// SVGs de fondo mobile
const MOBILE_CARD_SVGS = [
  "/images/mobile/products/card1.svg",
  "/images/mobile/products/card2.svg",
  "/images/mobile/products/card3.svg",
];

// Flechas decorativas para cada fila (pares de flechas)
const ARROW_SVGS = [
  { left: "/images/web/products/flecha1.svg", right: "/images/web/products/flecha2.svg" },
  { left: "/images/web/products/flecha3.svg", right: "/images/web/products/flecha4.svg" },
  { left: "/images/web/products/flecha5.svg", right: "/images/web/products/flecha6.svg" },
];

// rectangle2 → círculo a la derecha; rectangle1 y rectangle3 → izquierda
const IS_REVERSED = [false, true, false];

function formatPrice(precio: number, moneda: string): string {
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`;
}

export default async function ProductosPage() {
  const [productosPageRes, productosRes] = await Promise.all([
    getProductosPage().catch(() => null),
    getProductos().catch(() => null),
  ]);

  const productos = productosRes?.data ?? [];
  const rawPacks = productosPageRes?.data?.packs_destacados;
  const packsDestacados = (Array.isArray(rawPacks) ? rawPacks : []).sort(
    (a, b) => a.orden - b.orden,
  );
  const rawPerfiles = productosPageRes?.data?.perfiles_usuario;
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
        <p className={styles.heroText}>
          Inspírate y cocina fácil con<br />nuestras bases culinarias.
        </p>
      </section>

      <section className={styles.content}>
        <h2 className={styles.sectionTitle}>
          ¡Atrévete hoy a disfrutar de la Q&apos;ocina con Q!
        </h2>
        <div className={styles.grid}>
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
                    href={`/productos/${producto.documentId}`}
                    className={styles.cardButton}>
                    Añadir al carrito
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {packsDestacados.length > 0 && (
        <PacksDestacados packs={packsDestacados} />
      )}

      <ProductosNuestroSecreto secretoImagen={productosPageRes?.data?.secreto_imagen ?? null} />

      <section className={styles.paraQuien}>
        <h2 className={styles.paraQuienTitle}>¿Para quién es Q&apos;ocina?</h2>

        <div className={styles.paraQuienContainer}>
          {perfilesUsuario.map((perfil, index) => {
            const svgIndex = Math.min(index, 2);
            const isReversed = IS_REVERSED[svgIndex];
            const arrowPair = ARROW_SVGS[svgIndex];
            const imagenUrl = perfil.imagen
              ? getStrapiImageUrl(perfil.imagen.url)
              : null;

            return (
              <div key={perfil.id} className={styles.paraQuienRow}>
                {/* Fondo SVG — desktop */}
                <img
                  src={RECT_SVGS[svgIndex]}
                  alt=""
                  aria-hidden="true"
                  className={styles.paraQuienRect}
                />

                {/* Fondo SVG — mobile */}
                <img
                  src={MOBILE_CARD_SVGS[svgIndex]}
                  alt=""
                  aria-hidden="true"
                  className={styles.paraQuienMobileCard}
                />

                {/* Flechas decorativas */}
                <img
                  src={arrowPair.left}
                  alt=""
                  aria-hidden="true"
                  className={`${styles.paraQuienArrow} ${styles.paraQuienArrowLeft}`}
                />
                <img
                  src={arrowPair.right}
                  alt=""
                  aria-hidden="true"
                  className={`${styles.paraQuienArrow} ${styles.paraQuienArrowRight}`}
                />

                {/* Círculo con foto */}
                <div
                  className={`${styles.paraQuienCircle} ${
                    isReversed
                      ? styles.paraQuienCircleRight
                      : styles.paraQuienCircleLeft
                  }`}>
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

                {/* Texto */}
                <div
                  className={`${styles.paraQuienText} ${
                    isReversed
                      ? styles.paraQuienTextLeft
                      : styles.paraQuienTextRight
                  }`}>
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

      {/* Tienes dudas */}
      <section className={styles.tieneDudas}>
        {/* Desktop: imagen con padding de página */}
        <div className={styles.tieneDudasImgWrapper}>
          <Image
            src="/images/web/products/tienes_dudas_web.svg"
            alt="¿Tienes dudas?"
            width={1440}
            height={400}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Mobile: card negro con texto y botón */}
        <div className={styles.tieneDudasCard}>
          <div className={styles.tieneDudasContent}>
            <h2 className={styles.tieneDudasTitle}>
              ¿Tienes dudas o necesitas ayuda?
            </h2>
            <p className={styles.tieneDudasDescription}>
              Resolvemos preguntas rápidas sobre productos, envíos y preparación.
            </p>
          </div>
          <Button href="/contacto" variant="yellow" className={styles.tieneDudasBtn}>
            Resuelve aquí tus dudas
          </Button>
        </div>

        {/* Mobile: imagen decorativa debajo del recuadro negro */}
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