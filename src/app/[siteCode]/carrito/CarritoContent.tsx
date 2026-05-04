"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getProductos } from "@/lib/api";;
import { useSiteCode } from "@/hooks/useSiteCode";
import { LOCALE_COOKIE } from "@/lib/constants";
import type { Producto } from "@/types";
import styles from "./page.module.css";

const translations = {
  es: {
    steps: ["Carrito", "Envío", "Pago", "Confirmación"],
    emptyTitle: "Tu carrito está vacío",
    emptyText: "Aún no has añadido ningún producto.\n¡Explora nuestras bases culinarias y empieza a cocinar como un experto!",
    emptyBtn: "Ver productos →",
    cartTitle: "Carrito de compras",
    cantidad: "Cantidad",
    sidebarTitle: "Subtotal del pedido",
    promoLabel: "¿Tienes un código promocional?",
    promoPlaceholder: "Código de descuento",
    promoBtn: "Aplicar",
    subtotal: "Subtotal",
    descuento: "Descuento aplicado",
    total: "Total",
    checkoutBtn: "Continuar con el pago",
    addSuggested: "Añade a tu carrito",
    addBtn: "Añadir al carrito",
  },
  en: {
    steps: ["Cart", "Shipping", "Payment", "Confirmation"],
    emptyTitle: "Your cart is empty",
    emptyText: "You haven't added any products yet.\nExplore our culinary bases and start cooking like an expert!",
    emptyBtn: "View products →",
    cartTitle: "Shopping cart",
    cantidad: "Quantity",
    sidebarTitle: "Order Summary",
    promoLabel: "Do you have a promo code?",
    promoPlaceholder: "Discount code",
    promoBtn: "Apply",
    subtotal: "Subtotal",
    descuento: "Discount applied",
    total: "Total",
    checkoutBtn: "Proceed to checkout",
    addSuggested: "Add to your cart",
    addBtn: "Add to cart",
  },
};

function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `$ ${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${moneda}`;
}

const ACTIVE_STEP = 0;

export default function CarritoPage() {
  const siteCode = useSiteCode();
  const cookieLocale = document.cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`))?.[1];
  const locale = cookieLocale === "en" ? "en" : "es";
  const t = translations[locale];
  const { items, removeItem, updateCantidad, addItem, total } = useCart();
  const [codigoPromo, setCodigoPromo] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const moneda = items[0]?.precioMoneda ?? "COP";

  useEffect(() => {
    getProductos()
      .then((res) => setProductos(res.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    if (typeof window === "undefined" || !window.cioanalytics) return;
    const cartId = localStorage.getItem("qocina_cart_id") ?? "";
    window.cioanalytics.track("Cart Viewed", {
      cart_id: cartId,
      products: items.map((i) => ({
        product_id: String(i.id),
        sku: i.sku ?? i.slug,
        name: i.nombre,
        category: i.categoria ?? null,
        price: i.precio,
        quantity: i.cantidad,
        brand: "QCocina",
        image_url: i.imagen ?? null,
      })),
    });
  }, []);

  const cartIds = new Set(items.map((i) => i.id));
  const sugeridos = productos.filter((p) => !cartIds.has(p.id));
  const VISIBLE = 3;
  const showArrows = sugeridos.length > VISIBLE;
  const visible = sugeridos.slice(carouselIdx, carouselIdx + VISIBLE);
  const activeCardIdx = visible.length > 1 ? Math.floor(visible.length / 2) : 0;

  const handleAplicarCodigo = () => {
    setDescuento(0);
  };

  return (
    <>
      <div className={styles.page}>
      <div className={styles.steps}>
        {[
          { img: "/images/web/shopping/carrito.svg", imgGreen: "/images/web/shopping/carrito_green.svg", label: t.steps[0] },
          { img: "/images/web/shopping/envio.svg", imgGreen: "/images/web/shopping/ubicacion_green.svg", label: t.steps[1] },
          { img: "/images/web/shopping/pago.svg", imgGreen: "/images/web/shopping/seguridad_green.svg", label: t.steps[2] },
          { img: "/images/web/shopping/confirmacion.svg", imgGreen: "/images/web/shopping/confirmacion_check.svg", label: t.steps[3] },
        ].map((step, i) => (
          <div key={step.label} className={styles.stepGroup}>
            <div className={`${styles.step} ${i <= ACTIVE_STEP ? styles.stepActive : ""}`}>
              <Image src={i <= ACTIVE_STEP ? step.imgGreen : step.img} alt={step.label} width={48} height={48} className={styles.stepImg} />
              <p className={styles.stepLabel}>{step.label}</p>
            </div>
            {i < 3 && (
              <Image
                src={i <= ACTIVE_STEP ? "/images/web/shopping/linea.svg" : "/images/web/shopping/linea_inactiva.svg"}
                alt="" width={72} height={6} className={styles.stepLine}
              />
            )}
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="#F5F5F0" />
              <path d="M24 27h4l5 20h18l4.5-13H31" stroke="#5A7A2E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="37" cy="52" r="2.5" fill="#5A7A2E"/>
              <circle cx="50" cy="52" r="2.5" fill="#5A7A2E"/>
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>{t.emptyTitle}</h2>
          <p className={styles.emptyText}>
            {t.emptyText.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}
          </p>
          <Link href={`/${siteCode}/productos`} className={styles.emptyBtn}>
            {t.emptyBtn}
          </Link>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.itemsSection}>
            <h2 className={styles.title}>{t.cartTitle}</h2>
            <div className={styles.itemList}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.imagen ? (
                      <Image
                        src={item.imagen}
                        alt={item.nombre}
                        fill
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    ) : (
                      <div className={styles.itemImagePlaceholder} />
                    )}
                  </div>

                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemNombre}>{item.nombre}</h3>
                    <p className={styles.itemDescripcion}>{item.descripcionCorta}</p>
                    <div className={styles.itemCantidad}>
                      <span className={styles.itemCantidadLabel}>{t.cantidad}</span>
                      <button
                        className={styles.cantidadBtn}
                        onClick={() => updateCantidad(item.id, item.cantidad - 1)}
                        aria-label="Reducir"
                      >
                        <Image src="/images/web/shopping/minus.svg" alt="-" width={24} height={24} />
                      </button>
                      <span className={styles.cantidadNum}>{item.cantidad}</span>
                      <button
                        className={styles.cantidadBtn}
                        onClick={() => updateCantidad(item.id, item.cantidad + 1)}
                        aria-label="Aumentar"
                      >
                        <Image src="/images/web/shopping/plus.svg" alt="+" width={24} height={24} />
                      </button>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                      aria-label="Eliminar producto"
                    >
                      <Image src="/images/web/shopping/trash.svg" alt="Eliminar" width={16} height={18} />
                    </button>
                  </div>

                  <div className={styles.itemPrecio}>
                    {formatPrice(item.precio * item.cantidad, item.precioMoneda)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>{t.sidebarTitle}</h2>

            <div className={styles.promoGroup}>
              <p className={styles.promoLabel}>{t.promoLabel}</p>
              <div className={styles.promoRow}>
                <input
                  className={styles.promoInput}
                  placeholder={t.promoPlaceholder}
                  value={codigoPromo}
                  onChange={(e) => setCodigoPromo(e.target.value)}
                />
                <button className={styles.promoBtn} onClick={handleAplicarCodigo}>
                  {t.promoBtn}
                </button>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.subtotalRow}>
              <span>{t.subtotal}</span>
              <span>{formatPrice(total, moneda)}</span>
            </div>
            <div className={styles.subtotalRow}>
              <span>{t.descuento}</span>
              <span>- {formatPrice(descuento, moneda)}</span>
            </div>

            <hr className={styles.divider} />

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>{t.total}</span>
              <span className={styles.totalValue}>{formatPrice(total - descuento, moneda)}</span>
            </div>

            <hr className={styles.divider} />

            <Link href={`/${siteCode}/envio`} className={styles.checkoutBtn}>
              <span>{t.checkoutBtn}</span>
              <Image src="/images/web/home/arrow_right.svg" alt="" width={30} height={18} className={styles.arrowDark} />
              <Image src="/images/web/home/white_arrow_right.svg" alt="" width={30} height={18} className={styles.arrowWhite} />
            </Link>
          </aside>
        </div>
      )}

      </div>

      {sugeridos.length > 0 && (
        <div className={styles.secondSection}>
          <Image
            src="/images/web/shopping/second_section.svg"
            alt=""
            width={1440}
            height={812}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <div className={styles.secondContent}>
            <h2 className={styles.secondTitle}>{t.addSuggested}</h2>
            <div className={styles.secondCarousel}>
              {showArrows && (
                <button
                  className={styles.arrowBtn}
                  onClick={() => setCarouselIdx((i) => Math.max(0, i - 1))}
                  disabled={carouselIdx === 0}
                  aria-label="Anterior"
                >
                  <Image src="/images/web/shopping/left_arrow.svg" alt="←" width={48} height={48} />
                </button>
              )}

              <div className={`${styles.cardsRow} ${!showArrows ? styles.cardsRowCentered : ""}`}>
                {visible.map((producto, idx) => {
                  const isActive = idx === activeCardIdx;
                  const imgUrl = producto.imagen_principal
                    ? getStrapiImageUrl(
                        producto.imagen_principal.formats?.medium?.url ??
                        producto.imagen_principal.url
                      )
                    : null;
                  return (
                    <div
                      key={producto.id}
                      className={`${styles.sugCard} ${isActive ? styles.sugCardActive : ""}`}
                    >
                      <div className={styles.sugCardImage}>
                        {imgUrl && (
                          <Image
                            src={imgUrl}
                            alt={producto.nombre}
                            fill
                            style={{ objectFit: "contain" }}
                            unoptimized
                          />
                        )}
                      </div>
                      <div className={styles.sugCardBody}>
                        <p className={styles.sugNombre}>{producto.nombre}</p>
                        <p className={styles.sugPrecio}>
                          {formatPrice(producto.precio, producto.precio_moneda)}
                        </p>
                        <p className={styles.sugDesc}>{producto.descripcion_corta}</p>
                        <button
                          className={`${styles.sugBtn} ${isActive ? styles.sugBtnActive : ""}`}
                          onClick={() =>
                            addItem({
                              id: producto.id,
                              documentId: producto.documentId,
                              slug: producto.slug,
                              nombre: producto.nombre,
                              descripcionCorta: producto.descripcion_corta,
                              precio: producto.precio,
                              precioMoneda: producto.precio_moneda,
                              imagen: imgUrl,
                              sku: producto.sku ?? null,
                              categoria: producto.categoria?.nombre ?? null,
                            })
                          }
                        >
                          {t.addBtn}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {showArrows && (
                <button
                  className={styles.arrowBtn}
                  onClick={() => setCarouselIdx((i) => Math.min(sugeridos.length - VISIBLE, i + 1))}
                  disabled={carouselIdx + VISIBLE >= sugeridos.length}
                  aria-label="Siguiente"
                >
                  <Image src="/images/web/shopping/right_arrow.svg" alt="→" width={48} height={48} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
