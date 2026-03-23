"use client";

import { useState } from "react";
import WaveSection from "@/components/WaveSection/WaveSection";
import { API_URL } from "@/lib/strapi";
import styles from "./Subscribe.module.css";

interface SubscribeProps {
  title?: string;
  description?: string;
  placeholder?: string;
  formulario_boton?: string;
  variant?: "email" | "contact";
  mobileWaveImage?: string;
}

export default function Subscribe({ title, description, placeholder, formulario_boton, variant = "email", mobileWaveImage }: SubscribeProps = {}) {
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState({ nombre: "", email: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmitEmail = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/contacto/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const handleSubmitContact = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/contacto/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setContact({ nombre: "", email: "", mensaje: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className={styles.section}>
      <WaveSection mobileImageSrc={mobileWaveImage ?? "/images/mobile/bases_culinarias/Modulo.svg"}>
        <div className={`${styles.container} ${variant === "contact" ? styles.containerContact : ""}`}>
          <div className={styles.textSide}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <div className={styles.formSide}>
            {variant === "contact" ? (
              <form className={styles.formContact} onSubmit={handleSubmitContact}>
                <input
                  type="text"
                  placeholder="Nombre"
                  className={styles.inputContact}
                  value={contact.nombre}
                  onChange={(e) => setContact((p) => ({ ...p, nombre: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className={styles.inputContact}
                  value={contact.email}
                  onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                  required
                />
                <textarea
                  placeholder="Mensaje"
                  className={`${styles.inputContact} ${styles.textareaContact}`}
                  value={contact.mensaje}
                  onChange={(e) => setContact((p) => ({ ...p, mensaje: e.target.value }))}
                  required
                />
                <div className={styles.submitRowContact}>
                  <button type="submit" className={styles.button} disabled={status === "loading"}>
                    {status === "loading" ? "Enviando..." : (formulario_boton ?? "Enviar")}
                  </button>
                </div>
              </form>
            ) : (
              <form className={styles.form} onSubmit={handleSubmitEmail}>
                <input
                  type="email"
                  placeholder={placeholder ?? "Correo electrónico"}
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className={styles.button} disabled={status === "loading"}>
                  {status === "loading" ? "..." : (formulario_boton ?? "Suscribirme")}
                </button>
              </form>
            )}
            {status === "success" && (
              <div className={styles.alert}>
                <span className={styles.alertIcon}>✓</span>
                <div>
                  {variant === "contact" ? (
                    <>
                      <p className={styles.alertTitle}>¡Pregunta registrada!</p>
                      <p className={styles.alertText}>Nos pondremos en contacto contigo pronto.</p>
                    </>
                  ) : (
                    <>
                      <p className={styles.alertTitle}>¡Suscripción exitosa!</p>
                      <p className={styles.alertText}>Pronto recibirás nuestras novedades en tu correo.</p>
                    </>
                  )}
                </div>
              </div>
            )}
            {status === "error" && (
              <div className={`${styles.alert} ${styles.alertError}`}>
                <span className={styles.alertIcon}>!</span>
                <div>
                  <p className={styles.alertTitle}>Algo salió mal</p>
                  <p className={styles.alertText}>Por favor intenta de nuevo.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </WaveSection>
    </section>
  );
}
