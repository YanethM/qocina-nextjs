"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { getProductos, getStrapiImageUrl } from "@/lib/api";
import type { Producto } from "@/types";
import styles from "./page.module.css";

function formatPrice(precio: number, moneda: string): string {
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `$ ${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${moneda}`;
}

const STEPS = [
  { img: "/images/web/shopping/carrito.svg", label: "Carrito" },
  { img: "/images/web/shopping/envio.svg", label: "Envío" },
  { img: "/images/web/shopping/pago.svg", label: "Pago" },
  { img: "/images/web/shopping/confirmacion.svg", label: "Confirmación" },
];

export default function CarritoPage() {
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
        {STEPS.map((step, i) => (
          <div key={step.label} className={styles.stepGroup}>
            <div className={`${styles.step} ${i === 0 ? styles.stepActive : ""}`}>
              <Image src={step.img} alt={step.label} width={110} height={74} style={{ width: 110, height: 74 }} />
            </div>
            {i < STEPS.length - 1 && (
              <hr className={styles.stepLine} />
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
          <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
          <p className={styles.emptyText}>
            Aún no has añadido ningún producto.<br />
            ¡Explora nuestras bases culinarias y empieza a cocinar como un experto!
          </p>
          <Link href="/productos" className={styles.emptyBtn}>
            Ver productos →
          </Link>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.itemsSection}>
            <h2 className={styles.title}>Carrito de compras</h2>
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
                      <span className={styles.itemCantidadLabel}>Cantidad</span>
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
            <h2 className={styles.sidebarTitle}>Subtotal del pedido</h2>

            <div className={styles.promoGroup}>
              <p className={styles.promoLabel}>¿Tienes un código promocional?</p>
              <div className={styles.promoRow}>
                <input
                  className={styles.promoInput}
                  placeholder="Código de descuento"
                  value={codigoPromo}
                  onChange={(e) => setCodigoPromo(e.target.value)}
                />
                <button className={styles.promoBtn} onClick={handleAplicarCodigo}>
                  Aplicar
                </button>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span>{formatPrice(total, moneda)}</span>
            </div>
            <div className={styles.subtotalRow}>
              <span>Descuento aplicado</span>
              <span>- {formatPrice(descuento, moneda)}</span>
            </div>

            <hr className={styles.divider} />

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatPrice(total - descuento, moneda)}</span>
            </div>

            <Link href="/envio" className={styles.checkoutBtn}>
              <span>Continuar con el pago</span>
              <Image
                src="/images/web/home/arrow_right.svg"
                alt=""
                width={30}
                height={18}
                style={{ position: "relative", top: "2px", marginLeft: "-6px" }}
              />
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
            <h2 className={styles.secondTitle}>Añade a tu carrito</h2>
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
                              slug: producto.slug,
                              nombre: producto.nombre,
                              descripcionCorta: producto.descripcion_corta,
                              precio: producto.precio,
                              precioMoneda: producto.precio_moneda,
                              imagen: imgUrl,
                            })
                          }
                        >
                          Añadir al carrito
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
