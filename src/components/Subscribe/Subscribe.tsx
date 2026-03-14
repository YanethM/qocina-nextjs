"use client";

import { useState } from "react";
import WaveSection from "@/components/WaveSection/WaveSection";
import { API_URL } from "@/lib/api";
import styles from "./Subscribe.module.css";

interface SubscribeProps {
  title?: string;
  description?: string;
  formulario_boton?: string;
  variant?: "email" | "contact";
}

export default function Subscribe({ title, description, formulario_boton, variant = "email" }: SubscribeProps = {}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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

  return (
    <section className={styles.section}>
      <WaveSection mobileImageSrc="/images/mobile/bases_culinarias/Modulo.svg">
        <div className={`${styles.container} ${variant === "contact" ? styles.containerContact : ""}`}>
          <div className={styles.textSide}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <div className={styles.formSide}>
            {variant === "contact" ? (
              <form className={styles.formContact}>
                <input
                  type="text"
                  placeholder="Nombre"
                  className={styles.inputContact}
                  required
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className={styles.inputContact}
                  required
                />
                <textarea
                  placeholder="Mensaje"
                  className={`${styles.inputContact} ${styles.textareaContact}`}
                  required
                />
                <div className={styles.submitRowContact}>
                  <button type="submit" className={styles.button}>
                    {formulario_boton ?? "Enviar"}
                  </button>
                </div>
              </form>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Correo electrónico"
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
                  <p className={styles.alertTitle}>¡Suscripción exitosa!</p>
                  <p className={styles.alertText}>Pronto recibirás nuestras novedades en tu correo.</p>
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
