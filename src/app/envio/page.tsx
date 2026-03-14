"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { API_URL } from "@/lib/api";
import styles from "./page.module.css";

const STEPS = [
  { img: "/images/web/shopping/carrito.svg", label: "Carrito" },
  { img: "/images/web/shopping/envio.svg", label: "Envío" },
  { img: "/images/web/shopping/pago.svg", label: "Pago" },
  { img: "/images/web/shopping/confirmacion.svg", label: "Confirmación" },
];

const PAISES = [
  "Colombia", "Perú", "Argentina", "México", "Chile", "España", "Estados Unidos",
];

const PREFIJOS = ["+57", "+51", "+54", "+52", "+56", "+34", "+1"];

function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `$ ${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${moneda}`;
}

export default function EnvioPage() {
  const { items, total } = useCart();
  const moneda = items[0]?.precioMoneda ?? "COP";

  const [pais, setPais] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [prefijo, setPrefijo] = useState("+57");
  const [telefono, setTelefono] = useState("");
  const [documento, setDocumento] = useState("");
  const [cuit, setCuit] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [codigoEstado, setCodigoEstado] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!pais) e.pais = "Requerido";
    if (!nombre) e.nombre = "Requerido";
    if (!apellido) e.apellido = "Requerido";
    if (!correo) e.correo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) e.correo = "Error";
    if (!telefono) e.telefono = "Requerido";
    if (!documento) e.documento = "Requerido";
    if (!direccion) e.direccion = "Requerido";
    if (!ciudad) e.ciudad = "Requerido";
    return e;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setApiError(null);

    try {
      const prepareRes = await fetch(`${API_URL}/api/orders/prepare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.cantidad })),
          customerName: `${nombre} ${apellido}`,
          customerEmail: correo,
          customerPhone: `${prefijo}${telefono}`,
          shippingAddress: {
            street: direccion,
            city: ciudad,
            state: estado,
            stateCode: codigoEstado,
            postalCode: codigoPostal,
            country: pais,
          },
        }),
      });

      if (!prepareRes.ok) {
        const err = await prepareRes.json();
        throw new Error(err?.error?.message ?? "Error al preparar la orden");
      }

      const { data: order } = await prepareRes.json();

      const sessionRes = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId }),
      });

      if (!sessionRes.ok) {
        const err = await sessionRes.json();
        throw new Error(err?.error?.message ?? "Error al crear la sesión de pago");
      }

      const { data: session } = await sessionRes.json();

      sessionStorage.setItem("qocina_checkout_email", correo);
      window.location.href = session.checkoutUrl;
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.steps}>
        {STEPS.map((step, i) => (
          <div key={step.label} className={styles.stepGroup}>
            <div className={`${styles.step} ${i === 1 ? styles.stepActive : ""}`}>
              <Image src={step.img} alt={step.label} width={110} height={74} style={{ width: 110, height: 74 }} />
            </div>
            {i < STEPS.length - 1 && <hr className={styles.stepLine} />}
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <h2 className={styles.title}>Detalles de envío</h2>

          <div className={styles.formGroup}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>1. Destino del envío</span>
              <hr className={styles.sectionLine} />
            </div>
            <div className={styles.selectWrapper}>
              <select
                className={`${styles.select} ${errors.pais ? styles.inputError : ""}`}
                value={pais}
                onChange={(e) => setPais(e.target.value)}
              >
                <option value="">País*</option>
                {PAISES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>2. Información del destinatario</span>
              <hr className={styles.sectionLine} />
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre*</label>
                <input
                  className={`${styles.input} ${errors.nombre ? styles.inputError : ""}`}
                  placeholder="Ej: Juan"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Apellido*</label>
                <input
                  className={`${styles.input} ${errors.apellido ? styles.inputError : ""}`}
                  placeholder="Ej: Pérez"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Correo electrónico*</label>
                  {errors.correo && <span className={styles.errorTag}>Error</span>}
                </div>
                <input
                  className={`${styles.input} ${errors.correo ? styles.inputError : ""}`}
                  placeholder="ejemplo@correo.com"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Teléfono de contacto*</label>
                <div className={`${styles.phoneRow} ${errors.telefono ? styles.inputError : ""}`}>
                  <select
                    className={styles.prefijoSelect}
                    value={prefijo}
                    onChange={(e) => setPrefijo(e.target.value)}
                  >
                    {PREFIJOS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <div className={styles.phoneDivider} />
                  <input
                    className={styles.phoneInput}
                    placeholder="300 123 4567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Número de documento*</label>
                <input
                  className={`${styles.input} ${errors.documento ? styles.inputError : ""}`}
                  placeholder="DNI, Pasaporte o Cédula"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Número de CUIT (11 dígitos)</label>
                <input
                  className={styles.input}
                  placeholder="01020304050"
                  value={cuit}
                  onChange={(e) => setCuit(e.target.value)}
                  maxLength={11}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>3. Domicilio de entrega</span>
              <hr className={styles.sectionLine} />
            </div>
            <div className={styles.fieldGridFull}>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>
                  Dirección de envío: calle, número de casa, nombre del edificio, referencia*
                </label>
                <input
                  className={`${styles.input} ${errors.direccion ? styles.inputError : ""}`}
                  placeholder="Calle Falsa 123, Torre A, Oficina 502"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Ciudad*</label>
                <input
                  className={`${styles.input} ${errors.ciudad ? styles.inputError : ""}`}
                  placeholder="Ej: Madrid, Bogotá, CDMX..."
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldGrid3}>
              <div className={styles.field}>
                <label className={styles.label}>Estado / Provincia</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={`${styles.select} ${errors.estado ? styles.inputError : ""}`}
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="">Selecciona tu región</option>
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Código de estado / provincia</label>
                <input
                  className={styles.input}
                  placeholder="Ej: NY, BA, MD (Solo 2 o 3 letras)"
                  value={codigoEstado}
                  onChange={(e) => setCodigoEstado(e.target.value)}
                  maxLength={3}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Código postal</label>
                <input
                  className={styles.input}
                  placeholder="Ej: 28001 o 110111"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value)}
                />
              </div>
            </div>
          </div>

          {apiError && <p className={styles.apiError}>{apiError}</p>}
          <div className={styles.submitRow}>
            <button
              className={styles.checkoutBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              <span>{loading ? "Procesando..." : "Continuar al pago"}</span>
              {!loading && (
                <Image
                  src="/images/web/home/arrow_right.svg"
                  alt=""
                  width={30}
                  height={18}
                  style={{ position: "relative", top: "2px", marginLeft: "-6px" }}
                />
              )}
            </button>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Resumen</h2>
          <div className={styles.summaryList}>
            {items.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.summaryImage}>
                  {item.imagen && (
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  )}
                </div>
                <span className={styles.summaryNombre}>{item.nombre}</span>
                <span className={styles.summaryPrecio}>
                  {formatPrice(item.precio * item.cantidad, item.precioMoneda)}
                </span>
              </div>
            ))}
          </div>
          <hr className={styles.divider} />
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatPrice(total, moneda)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
