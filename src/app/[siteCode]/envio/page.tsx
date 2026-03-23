"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { API_URL } from "@/lib/strapi";
import type { Site } from "@/types";
import styles from "./page.module.css";

const STEPS = [
  { img: "/images/web/shopping/carrito.svg", label: "Carrito" },
  { img: "/images/web/shopping/envio.svg", label: "Envío" },
  { img: "/images/web/shopping/pago.svg", label: "Pago" },
  { img: "/images/web/shopping/confirmacion.svg", label: "Confirmación" },
];

const PREFIJOS = ["+57", "+51", "+54", "+52", "+56", "+34", "+1", "+593"];

type Nivel1Option = { regionCode: string; regionName: string };
type Nivel2Option = { cityCode: string; cityName: string };
type Nivel3Option = { districtCode: string; districtName: string };

function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `$ ${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${moneda}`;
}

async function fetchOfix(action: string, params: Record<string, string> = {}) {
  const res = await fetch("/api/ofix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...params }),
  });
  return res.json();
}

export default function EnvioPage() {
  const { items, total } = useCart();
  const moneda = items[0]?.precioMoneda ?? "COP";

  const [sites, setSites] = useState<Site[]>([]);
  const [pais, setPais] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [prefijo, setPrefijo] = useState("+57");
  const [telefono, setTelefono] = useState("");
  const [documento, setDocumento] = useState("");
  const [cuit, setCuit] = useState("");
  const [facturaType, setFacturaType] = useState("8");
  const [direccion, setDireccion] = useState("");
  const [numeroCalle, setNumeroCalle] = useState("");
  const [referencia, setReferencia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [ciudadUS, setCiudadUS] = useState("");

  const [niveles, setNiveles] = useState(0);
  const [isUS, setIsUS] = useState(false);
  const [nivel1Options, setNivel1Options] = useState<Nivel1Option[]>([]);
  const [nivel2Options, setNivel2Options] = useState<Nivel2Option[]>([]);
  const [nivel3Options, setNivel3Options] = useState<Nivel3Option[]>([]);
  const [nivel1, setNivel1] = useState("");
  const [nivel2, setNivel2] = useState("");
  const [nivel3, setNivel3] = useState("");
  const [loadingUbigeo, setLoadingUbigeo] = useState(false);
  const [ubigeoError, setUbigeoError] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then((data: Site[]) => setSites(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!pais || sites.length === 0) return;
    const selectedSite = sites.find((s) => s.code === pais);
    const countryCode = selectedSite?.ofix_country_code ?? pais.toUpperCase();
    const usCountry = countryCode === "US";

    setIsUS(usCountry);
    setNivel1(""); setNivel2(""); setNivel3("");
    setNivel1Options([]); setNivel2Options([]); setNivel3Options([]);
    setNiveles(0);
    setCiudadUS("");
    setUbigeoError(false);
    setLoadingUbigeo(true);

    (async () => {
      try {
        if (usCountry) {
          const data = await fetchOfix("getNivel1", { countryCode });
          setNivel1Options(Array.isArray(data) ? data : []);
        } else {
          const [nivelesData, nivel1Data] = await Promise.all([
            fetchOfix("getNiveles", { countryCode }),
            fetchOfix("getNivel1", { countryCode }),
          ]);
          setNiveles(nivelesData?.nivels ?? 1);
          setNivel1Options(Array.isArray(nivel1Data) ? nivel1Data : []);
        }
      } catch {
        setUbigeoError(true);
      } finally {
        setLoadingUbigeo(false);
      }
    })();
  }, [pais, sites]);

  useEffect(() => {
    if (!nivel1 || isUS || niveles < 2) return;
    const selectedSite = sites.find((s) => s.code === pais);
    const countryCode = selectedSite?.ofix_country_code ?? pais.toUpperCase();

    setNivel2(""); setNivel3("");
    setNivel2Options([]); setNivel3Options([]);

    fetchOfix("getNivel2", { countryCode, departament: nivel1 })
      .then((data) => setNivel2Options(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [nivel1]);

  useEffect(() => {
    if (!nivel2 || isUS || niveles < 3) return;
    const selectedSite = sites.find((s) => s.code === pais);
    const countryCode = selectedSite?.ofix_country_code ?? pais.toUpperCase();

    setNivel3(""); setNivel3Options([]);

    fetchOfix("getNivel3", { countryCode, departament: nivel1, city: nivel2 })
      .then((data) => setNivel3Options(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [nivel2]);

  const selectedSite = sites.find((s) => s.code === pais);
  const countryCode = selectedSite?.ofix_country_code ?? pais.toUpperCase();
  const isAR = countryCode === "AR";
  const zipRequired = isUS || countryCode === "MX";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!pais) e.pais = "Requerido";
    if (!nombre) e.nombre = "Requerido";
    if (!apellido) e.apellido = "Requerido";
    if (!correo) e.correo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) e.correo = "Error";
    if (!telefono) e.telefono = "Requerido";
    if (!isUS && !documento) e.documento = "Requerido";
    if (!direccion) e.direccion = "Requerido";
    if (!numeroCalle) e.numeroCalle = "Requerido";
    if (!nivel1) e.nivel1 = "Requerido";
    if (isUS && !ciudadUS) e.ciudadUS = "Requerido";
    if (!isUS && niveles >= 2 && !nivel2) e.nivel2 = "Requerido";
    if (!isUS && niveles >= 3 && !nivel3) e.nivel3 = "Requerido";
    if (zipRequired && !codigoPostal) e.codigoPostal = "Requerido";
    return e;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setApiError(null);

    try {
      let shippingAddress: Record<string, string>;

      if (isUS) {
        const nivel1Item = nivel1Options.find((o) => o.regionCode === nivel1);
        shippingAddress = {
          street: direccion,
          streetNumber: numeroCalle,
          reference: referencia,
          city: ciudadUS,
          state: nivel1Item?.regionCode ?? nivel1,
          zip: codigoPostal,
          country: countryCode,
        };
      } else {
        const nivel1Item = nivel1Options.find((o) => o.regionCode === nivel1);
        const nivel2Item = nivel2Options.find((o) => o.cityCode === nivel2);
        const nivel3Item = nivel3Options.find((o) => o.districtCode === nivel3);

        const ofixStateCode = nivel1.includes("|") ? nivel1.split("|")[1] : nivel1;

        let ofixLevel2Name = "";
        let ofixLevel3Name = "";
        let ofixAddress3 = "";

        if (niveles >= 3 && nivel3Item) {
          ofixLevel2Name = nivel2Item?.cityName ?? "";
          ofixLevel3Name = nivel3Item.districtName;
          ofixAddress3 = nivel3.includes("|") ? nivel3.split("|")[0] : nivel3;
        } else if (niveles >= 2 && nivel2Item) {
          ofixLevel2Name = nivel2Item.cityName;
          ofixLevel3Name = nivel2Item.cityName;
          ofixAddress3 = nivel2.includes("|") ? nivel2.split("|")[0] : nivel2;
        } else if (nivel1Item) {
          ofixLevel2Name = nivel1Item.regionName;
          ofixLevel3Name = nivel1Item.regionName;
          ofixAddress3 = nivel1.includes("|") ? nivel1.split("|")[0] : nivel1;
        }

        shippingAddress = {
          street: direccion,
          streetNumber: numeroCalle,
          reference: referencia,
          zip: codigoPostal,
          country: countryCode,
          ofixStateCode,
          ofixLevel2Name,
          ofixLevel3Name,
          ofixAddress3,
        };
      }

      const prepareRes = await fetch(`/api/orders/prepare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteCode: pais,
          items: items.map((i) => ({ productId: i.id, quantity: i.cantidad })),
          customerName: `${nombre} ${apellido}`,
          customerEmail: correo,
          customerPhone: `${prefijo}${telefono}`,
          ...(!isUS ? { taxId: documento } : {}),
          ...(cuit ? { cuit } : {}),
          ...(isAR ? { facturaType } : {}),
          shippingAddress,
        }),
      });

      if (!prepareRes.ok) {
        const err = await prepareRes.json();
        const msg = err?.error?.details?.errors?.map((e: { message: string }) => e.message).join(", ")
          ?? err?.error?.message
          ?? "Error al preparar la orden";
        throw new Error(msg);
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
                {sites.map((s) => (
                  <option key={s.id} value={s.code}>{s.nombre}</option>
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
              {!isUS && (
                <div className={styles.field}>
                  <label className={styles.label}>Número de documento*</label>
                  <input
                    className={`${styles.input} ${errors.documento ? styles.inputError : ""}`}
                    placeholder="DNI, Pasaporte o Cédula"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                  />
                </div>
              )}
              {isAR && (
                <>
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
                  <div className={styles.field}>
                    <label className={styles.label}>Tipo de factura*</label>
                    <div className={styles.selectWrapper}>
                      <select
                        className={styles.select}
                        value={facturaType}
                        onChange={(e) => setFacturaType(e.target.value)}
                      >
                        <option value="8">Factura B</option>
                        <option value="7">Factura A</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>3. Domicilio de entrega</span>
              <hr className={styles.sectionLine} />
            </div>

            {ubigeoError && (
              <p className={styles.apiError}>No se pudieron cargar las opciones de ubicación. Verifica tu conexión e intenta de nuevo.</p>
            )}

            <div className={styles.fieldGrid}>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>Calle*</label>
                <input
                  className={`${styles.input} ${errors.direccion ? styles.inputError : ""}`}
                  placeholder="Ej: Avenida Corrientes"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Número*</label>
                <input
                  className={`${styles.input} ${errors.numeroCalle ? styles.inputError : ""}`}
                  placeholder="Ej: 1234"
                  value={numeroCalle}
                  onChange={(e) => setNumeroCalle(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Referencia</label>
                <input
                  className={styles.input}
                  placeholder="Ej: Departamento 4B, Torre A"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{isUS ? "Estado*" : "Región / Departamento*"}</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={`${styles.select} ${errors.nivel1 ? styles.inputError : ""}`}
                    value={nivel1}
                    disabled={!pais || loadingUbigeo || nivel1Options.length === 0}
                    onChange={(e) => setNivel1(e.target.value)}
                  >
                    <option value="">
                      {loadingUbigeo ? "Cargando..." : !pais ? "Primero elige un país" : "Selecciona una opción"}
                    </option>
                    {nivel1Options.map((o) => (
                      <option key={o.regionCode} value={o.regionCode}>{o.regionName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isUS && (
                <div className={styles.field}>
                  <label className={styles.label}>Ciudad*</label>
                  <input
                    className={`${styles.input} ${errors.ciudadUS ? styles.inputError : ""}`}
                    placeholder="Ej: Dallas"
                    value={ciudadUS}
                    onChange={(e) => setCiudadUS(e.target.value)}
                  />
                </div>
              )}

              {!isUS && niveles >= 2 && (
                <div className={styles.field}>
                  <label className={styles.label}>Ciudad / Provincia*</label>
                  <div className={styles.selectWrapper}>
                    <select
                      className={`${styles.select} ${errors.nivel2 ? styles.inputError : ""}`}
                      value={nivel2}
                      disabled={!nivel1 || nivel2Options.length === 0}
                      onChange={(e) => setNivel2(e.target.value)}
                    >
                      <option value="">
                        {!nivel1 ? "Primero elige región" : nivel2Options.length === 0 ? "Cargando..." : "Selecciona una opción"}
                      </option>
                      {nivel2Options.map((o) => (
                        <option key={o.cityCode} value={o.cityCode}>{o.cityName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {!isUS && niveles >= 3 && (
                <div className={styles.field}>
                  <label className={styles.label}>Distrito / Barrio*</label>
                  <div className={styles.selectWrapper}>
                    <select
                      className={`${styles.select} ${errors.nivel3 ? styles.inputError : ""}`}
                      value={nivel3}
                      disabled={!nivel2 || nivel3Options.length === 0}
                      onChange={(e) => setNivel3(e.target.value)}
                    >
                      <option value="">
                        {!nivel2 ? "Primero elige ciudad" : nivel3Options.length === 0 ? "Cargando..." : "Selecciona una opción"}
                      </option>
                      {nivel3Options.map((o) => (
                        <option key={o.districtCode} value={o.districtCode}>{o.districtName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>Código postal{zipRequired ? "*" : ""}</label>
                <input
                  className={`${styles.input} ${errors.codigoPostal ? styles.inputError : ""}`}
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
