"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { API_URL } from "@/lib/api";
import type { Site } from "@/types";
import styles from "./page.module.css";

const STEPS = [
  { img: "/images/web/shopping/carrito.svg", label: "Carrito" },
  { img: "/images/web/shopping/envio.svg", label: "Envío" },
  { img: "/images/web/shopping/pago.svg", label: "Pago" },
  { img: "/images/web/shopping/confirmacion.svg", label: "Confirmación" },
];

const PREFIJOS = ["+57", "+51", "+54", "+52", "+56", "+34", "+1", "+593"];

const ESTADOS: Record<string, { name: string; code: string }[]> = {
  pe: [
    { name: "Amazonas", code: "AMA" }, { name: "Áncash", code: "ANC" },
    { name: "Apurímac", code: "APU" }, { name: "Arequipa", code: "ARE" },
    { name: "Ayacucho", code: "AYA" }, { name: "Cajamarca", code: "CAJ" },
    { name: "Callao", code: "CAL" }, { name: "Cusco", code: "CUS" },
    { name: "Huancavelica", code: "HUV" }, { name: "Huánuco", code: "HUC" },
    { name: "Ica", code: "ICA" }, { name: "Junín", code: "JUN" },
    { name: "La Libertad", code: "LAL" }, { name: "Lambayeque", code: "LAM" },
    { name: "Lima", code: "LIM" }, { name: "Loreto", code: "LOR" },
    { name: "Madre de Dios", code: "MDD" }, { name: "Moquegua", code: "MOQ" },
    { name: "Pasco", code: "PAS" }, { name: "Piura", code: "PIU" },
    { name: "Puno", code: "PUN" }, { name: "San Martín", code: "SAM" },
    { name: "Tacna", code: "TAC" }, { name: "Tumbes", code: "TUM" },
    { name: "Ucayali", code: "UCA" },
  ],
  us: [
    { name: "Alabama", code: "AL" }, { name: "Alaska", code: "AK" },
    { name: "Arizona", code: "AZ" }, { name: "Arkansas", code: "AR" },
    { name: "California", code: "CA" }, { name: "Colorado", code: "CO" },
    { name: "Connecticut", code: "CT" }, { name: "Delaware", code: "DE" },
    { name: "Florida", code: "FL" }, { name: "Georgia", code: "GA" },
    { name: "Hawaii", code: "HI" }, { name: "Idaho", code: "ID" },
    { name: "Illinois", code: "IL" }, { name: "Indiana", code: "IN" },
    { name: "Iowa", code: "IA" }, { name: "Kansas", code: "KS" },
    { name: "Kentucky", code: "KY" }, { name: "Louisiana", code: "LA" },
    { name: "Maine", code: "ME" }, { name: "Maryland", code: "MD" },
    { name: "Massachusetts", code: "MA" }, { name: "Michigan", code: "MI" },
    { name: "Minnesota", code: "MN" }, { name: "Mississippi", code: "MS" },
    { name: "Missouri", code: "MO" }, { name: "Montana", code: "MT" },
    { name: "Nebraska", code: "NE" }, { name: "Nevada", code: "NV" },
    { name: "New Hampshire", code: "NH" }, { name: "New Jersey", code: "NJ" },
    { name: "New Mexico", code: "NM" }, { name: "New York", code: "NY" },
    { name: "North Carolina", code: "NC" }, { name: "North Dakota", code: "ND" },
    { name: "Ohio", code: "OH" }, { name: "Oklahoma", code: "OK" },
    { name: "Oregon", code: "OR" }, { name: "Pennsylvania", code: "PA" },
    { name: "Rhode Island", code: "RI" }, { name: "South Carolina", code: "SC" },
    { name: "South Dakota", code: "SD" }, { name: "Tennessee", code: "TN" },
    { name: "Texas", code: "TX" }, { name: "Utah", code: "UT" },
    { name: "Vermont", code: "VT" }, { name: "Virginia", code: "VA" },
    { name: "Washington", code: "WA" }, { name: "West Virginia", code: "WV" },
    { name: "Wisconsin", code: "WI" }, { name: "Wyoming", code: "WY" },
  ],
  es: [
    { name: "Álava", code: "VI" }, { name: "Albacete", code: "AB" },
    { name: "Alicante", code: "A" }, { name: "Almería", code: "AL" },
    { name: "Asturias", code: "O" }, { name: "Ávila", code: "AV" },
    { name: "Badajoz", code: "BA" }, { name: "Barcelona", code: "B" },
    { name: "Burgos", code: "BU" }, { name: "Cáceres", code: "CC" },
    { name: "Cádiz", code: "CA" }, { name: "Cantabria", code: "S" },
    { name: "Castellón", code: "CS" }, { name: "Ciudad Real", code: "CR" },
    { name: "Córdoba", code: "CO" }, { name: "Cuenca", code: "CU" },
    { name: "Girona", code: "GI" }, { name: "Granada", code: "GR" },
    { name: "Guadalajara", code: "GU" }, { name: "Guipúzcoa", code: "SS" },
    { name: "Huelva", code: "H" }, { name: "Huesca", code: "HU" },
    { name: "Islas Baleares", code: "PM" }, { name: "Jaén", code: "J" },
    { name: "La Rioja", code: "LO" }, { name: "Las Palmas", code: "GC" },
    { name: "León", code: "LE" }, { name: "Lleida", code: "L" },
    { name: "Lugo", code: "LU" }, { name: "Madrid", code: "M" },
    { name: "Málaga", code: "MA" }, { name: "Murcia", code: "MU" },
    { name: "Navarra", code: "NA" }, { name: "Ourense", code: "OR" },
    { name: "Palencia", code: "P" }, { name: "Pontevedra", code: "PO" },
    { name: "Salamanca", code: "SA" }, { name: "Santa Cruz de Tenerife", code: "TF" },
    { name: "Segovia", code: "SG" }, { name: "Sevilla", code: "SE" },
    { name: "Soria", code: "SO" }, { name: "Tarragona", code: "T" },
    { name: "Teruel", code: "TE" }, { name: "Toledo", code: "TO" },
    { name: "Valencia", code: "V" }, { name: "Valladolid", code: "VA" },
    { name: "Vizcaya", code: "BI" }, { name: "Zamora", code: "ZA" },
    { name: "Zaragoza", code: "Z" },
  ],
  mx: [
    { name: "Aguascalientes", code: "AGU" }, { name: "Baja California", code: "BCN" },
    { name: "Baja California Sur", code: "BCS" }, { name: "Campeche", code: "CAM" },
    { name: "Chiapas", code: "CHP" }, { name: "Chihuahua", code: "CHH" },
    { name: "Ciudad de México", code: "CMX" }, { name: "Coahuila", code: "COA" },
    { name: "Colima", code: "COL" }, { name: "Durango", code: "DUR" },
    { name: "Guanajuato", code: "GUA" }, { name: "Guerrero", code: "GRO" },
    { name: "Hidalgo", code: "HID" }, { name: "Jalisco", code: "JAL" },
    { name: "México", code: "MEX" }, { name: "Michoacán", code: "MIC" },
    { name: "Morelos", code: "MOR" }, { name: "Nayarit", code: "NAY" },
    { name: "Nuevo León", code: "NLE" }, { name: "Oaxaca", code: "OAX" },
    { name: "Puebla", code: "PUE" }, { name: "Querétaro", code: "QUE" },
    { name: "Quintana Roo", code: "ROO" }, { name: "San Luis Potosí", code: "SLP" },
    { name: "Sinaloa", code: "SIN" }, { name: "Sonora", code: "SON" },
    { name: "Tabasco", code: "TAB" }, { name: "Tamaulipas", code: "TAM" },
    { name: "Tlaxcala", code: "TLA" }, { name: "Veracruz", code: "VER" },
    { name: "Yucatán", code: "YUC" }, { name: "Zacatecas", code: "ZAC" },
  ],
  ar: [
    { name: "Buenos Aires", code: "BA" }, { name: "Catamarca", code: "CT" },
    { name: "Chaco", code: "CC" }, { name: "Chubut", code: "CH" },
    { name: "Ciudad Autónoma de Buenos Aires", code: "CF" },
    { name: "Córdoba", code: "CB" }, { name: "Corrientes", code: "CN" },
    { name: "Entre Ríos", code: "ER" }, { name: "Formosa", code: "FO" },
    { name: "Jujuy", code: "JY" }, { name: "La Pampa", code: "LP" },
    { name: "La Rioja", code: "LR" }, { name: "Mendoza", code: "MZ" },
    { name: "Misiones", code: "MN" }, { name: "Neuquén", code: "NQ" },
    { name: "Río Negro", code: "RN" }, { name: "Salta", code: "SA" },
    { name: "San Juan", code: "SJ" }, { name: "San Luis", code: "SL" },
    { name: "Santa Cruz", code: "SC" }, { name: "Santa Fe", code: "SF" },
    { name: "Santiago del Estero", code: "SE" },
    { name: "Tierra del Fuego", code: "TF" }, { name: "Tucumán", code: "TM" },
  ],
  co: [
    { name: "Amazonas", code: "AMA" }, { name: "Antioquia", code: "ANT" },
    { name: "Arauca", code: "ARA" }, { name: "Atlántico", code: "ATL" },
    { name: "Bolívar", code: "BOL" }, { name: "Boyacá", code: "BOY" },
    { name: "Caldas", code: "CAL" }, { name: "Caquetá", code: "CAQ" },
    { name: "Casanare", code: "CAS" }, { name: "Cauca", code: "CAU" },
    { name: "Cesar", code: "CES" }, { name: "Chocó", code: "CHO" },
    { name: "Córdoba", code: "COR" }, { name: "Cundinamarca", code: "CUN" },
    { name: "Guainía", code: "GUA" }, { name: "Guaviare", code: "GUV" },
    { name: "Huila", code: "HUI" }, { name: "La Guajira", code: "LAG" },
    { name: "Magdalena", code: "MAG" }, { name: "Meta", code: "MET" },
    { name: "Nariño", code: "NAR" }, { name: "Norte de Santander", code: "NSA" },
    { name: "Putumayo", code: "PUT" }, { name: "Quindío", code: "QUI" },
    { name: "Risaralda", code: "RIS" }, { name: "San Andrés y Providencia", code: "SAP" },
    { name: "Santander", code: "SAN" }, { name: "Sucre", code: "SUC" },
    { name: "Tolima", code: "TOL" }, { name: "Valle del Cauca", code: "VAC" },
    { name: "Vaupés", code: "VAU" }, { name: "Vichada", code: "VID" },
  ],
  ec: [
    { name: "Azuay", code: "A" }, { name: "Bolívar", code: "B" },
    { name: "Cañar", code: "F" }, { name: "Carchi", code: "C" },
    { name: "Chimborazo", code: "H" }, { name: "Cotopaxi", code: "X" },
    { name: "El Oro", code: "O" }, { name: "Esmeraldas", code: "E" },
    { name: "Galápagos", code: "W" }, { name: "Guayas", code: "G" },
    { name: "Imbabura", code: "I" }, { name: "Loja", code: "L" },
    { name: "Los Ríos", code: "R" }, { name: "Manabí", code: "M" },
    { name: "Morona Santiago", code: "S" }, { name: "Napo", code: "N" },
    { name: "Orellana", code: "D" }, { name: "Pastaza", code: "Y" },
    { name: "Pichincha", code: "P" }, { name: "Santa Elena", code: "SE" },
    { name: "Santo Domingo de los Tsáchilas", code: "SD" },
    { name: "Sucumbíos", code: "U" }, { name: "Tungurahua", code: "T" },
    { name: "Zamora Chinchipe", code: "Z" },
  ],
  cl: [
    { name: "Arica y Parinacota", code: "AP" }, { name: "Tarapacá", code: "TA" },
    { name: "Antofagasta", code: "AN" }, { name: "Atacama", code: "AT" },
    { name: "Coquimbo", code: "CO" }, { name: "Valparaíso", code: "VS" },
    { name: "Metropolitana de Santiago", code: "RM" },
    { name: "O'Higgins", code: "LI" }, { name: "Maule", code: "ML" },
    { name: "Ñuble", code: "NB" }, { name: "Biobío", code: "BI" },
    { name: "La Araucanía", code: "AR" }, { name: "Los Ríos", code: "LR" },
    { name: "Los Lagos", code: "LL" }, { name: "Aysén", code: "AI" },
    { name: "Magallanes", code: "MA" },
  ],
};

function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  if (moneda === "PEN") return `S/ ${precio.toFixed(2)}`;
  return `$ ${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${moneda}`;
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
  const [direccion, setDireccion] = useState("");
  const [numeroCalle, setNumeroCalle] = useState("");
  const [referencia, setReferencia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [codigoEstado, setCodigoEstado] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then((data: Site[]) => setSites(data))
      .catch(() => {});
  }, []);

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
    if (!numeroCalle) e.numeroCalle = "Requerido";
    if (!ciudad) e.ciudad = "Requerido";
    if (!codigoPostal) e.codigoPostal = "Requerido";
    return e;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setApiError(null);

    try {
      const selectedSite = sites.find((s) => s.code === pais);
      const countryCode = selectedSite?.ofix_country_code ?? pais.toUpperCase();

      const prepareRes = await fetch(`/api/orders/prepare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteCode: pais,
          items: items.map((i) => ({ productId: i.id, quantity: i.cantidad })),
          customerName: `${nombre} ${apellido}`,
          customerEmail: correo,
          customerPhone: `${prefijo}${telefono}`,
          taxId: documento,
          ...(cuit ? { cuit } : {}),
          shippingAddress: {
            street: direccion,
            streetNumber: numeroCalle,
            reference: referencia,
            district: ciudad,
            zip: codigoPostal,
            country: countryCode,
          },
        }),
      });

      if (!prepareRes.ok) {
        const err = await prepareRes.json();
        console.error("[orders/prepare] error:", JSON.stringify(err, null, 2));
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
                onChange={(e) => { setPais(e.target.value); setEstado(""); setCodigoEstado(""); }}
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
                <label className={styles.label}>Distrito / Barrio*</label>
                <input
                  className={`${styles.input} ${errors.ciudad ? styles.inputError : ""}`}
                  placeholder="Ej: San Nicolás, Chapinero"
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
                    disabled={!pais}
                    onChange={(e) => {
                      const selected = (ESTADOS[pais] ?? []).find(s => s.name === e.target.value);
                      setEstado(e.target.value);
                      setCodigoEstado(selected?.code ?? "");
                    }}
                  >
                    <option value="">{pais ? "Selecciona tu región" : "Primero elige un país"}</option>
                    {(ESTADOS[pais] ?? [])
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name, "es"))
                      .map((s) => (
                        <option key={s.code} value={s.name}>{s.name}</option>
                      ))}
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
                <label className={styles.label}>Código postal*</label>
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
