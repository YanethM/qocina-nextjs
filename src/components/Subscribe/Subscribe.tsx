"use client";

import { useState } from "react";
import WaveSection from "@/components/WaveSection/WaveSection";
import { API_URL } from "@/lib/strapi";
import { useLocale } from "@/hooks/useLocale";
import styles from "./Subscribe.module.css";

const COPY = {
  es: {
    namePlaceholder: "Nombre",
    emailPlaceholder: "Correo electrónico",
    messagePlaceholder: "Mensaje",
    sending: "Enviando...",
    submitContact: "Enviar",
    submitEmail: "Suscribirme",
    contactSuccessTitle: "¡Pregunta registrada!",
    contactSuccessText: "Nos pondremos en contacto contigo pronto.",
    emailSuccessTitle: "¡Suscripción exitosa!",
    emailSuccessText: "Pronto recibirás nuestras novedades en tu correo.",
    errorTitle: "Algo salió mal",
    errorText: "Por favor intenta de nuevo.",
  },
  en: {
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Message",
    sending: "Sending...",
    submitContact: "Send",
    submitEmail: "Subscribe",
    contactSuccessTitle: "Question received!",
    contactSuccessText: "We'll get in touch with you soon.",
    emailSuccessTitle: "Subscription successful!",
    emailSuccessText: "You'll soon receive our updates in your inbox.",
    errorTitle: "Something went wrong",
    errorText: "Please try again.",
  },
} as const;

interface SubscribeProps {
  title?: string;
  description?: string;
  placeholder?: string;
  formulario_boton?: string;
  variant?: "email" | "contact";
  mobileWaveImage?: string;
  buttonVariant?: "yellow" | "red";
}

export default function Subscribe({ title, description, placeholder, formulario_boton, variant = "email", mobileWaveImage, buttonVariant = "yellow" }: SubscribeProps = {}) {
  const locale = useLocale();
  const t = COPY[locale];
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
        body: JSON.stringify({ email, tipo: "newsletter", source: "footer" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
      if (typeof window !== "undefined" && window.cioanalytics) {
        window.cioanalytics.identify({ email });
        window.cioanalytics.track("Newsletter Subscribed", { email, source: "footer" });
      }
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
        body: JSON.stringify({ ...contact, tipo: "contacto" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setContact({ nombre: "", email: "", mensaje: "" });
      if (typeof window !== "undefined" && window.cioanalytics) {
        window.cioanalytics.identify({ email: contact.email });
        window.cioanalytics.track("Contact Form Submitted", { inquiry_type: null });
      }
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
                  placeholder={t.namePlaceholder}
                  className={styles.inputContact}
                  value={contact.nombre}
                  onChange={(e) => setContact((p) => ({ ...p, nombre: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  className={styles.inputContact}
                  value={contact.email}
                  onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                  required
                />
                <textarea
                  placeholder={t.messagePlaceholder}
                  className={`${styles.inputContact} ${styles.textareaContact}`}
                  value={contact.mensaje}
                  onChange={(e) => setContact((p) => ({ ...p, mensaje: e.target.value }))}
                  required
                />
                <div className={styles.submitRowContact}>
                  <button type="submit" className={`${styles.button} ${buttonVariant === "red" ? styles.buttonRed : ""}`} disabled={status === "loading"}>
                    {status === "loading" ? t.sending : (formulario_boton ?? t.submitContact)}
                  </button>
                </div>
              </form>
            ) : (
              <form className={styles.form} onSubmit={handleSubmitEmail}>
                <input
                  type="email"
                  placeholder={placeholder ?? t.emailPlaceholder}
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className={`${styles.button} ${buttonVariant === "red" ? styles.buttonRed : ""}`} disabled={status === "loading"}>
                  {status === "loading" ? "..." : (formulario_boton ?? t.submitEmail)}
                </button>
              </form>
            )}
            {status === "success" && (
              <div className={styles.alert}>
                <span className={styles.alertIcon}>✓</span>
                <div>
                  {variant === "contact" ? (
                    <>
                      <p className={styles.alertTitle}>{t.contactSuccessTitle}</p>
                      <p className={styles.alertText}>{t.contactSuccessText}</p>
                    </>
                  ) : (
                    <>
                      <p className={styles.alertTitle}>{t.emailSuccessTitle}</p>
                      <p className={styles.alertText}>{t.emailSuccessText}</p>
                    </>
                  )}
                </div>
              </div>
            )}
            {status === "error" && (
              <div className={`${styles.alert} ${styles.alertError}`}>
                <span className={styles.alertIcon}>!</span>
                <div>
                  <p className={styles.alertTitle}>{t.errorTitle}</p>
                  <p className={styles.alertText}>{t.errorText}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </WaveSection>
    </section>
  );
}
