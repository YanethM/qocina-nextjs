"use client";

import { useState } from "react";
import { API_URL } from "@/lib/strapi";
import { useLocale } from "@/hooks/useLocale";
import styles from "./ContactForm.module.css";

type Status = "idle" | "loading" | "success" | "error";

const COPY = {
  es: {
    namePlaceholder: "Nombre",
    emailPlaceholder: "Correo electrónico",
    messagePlaceholder: "Mensaje",
    sending: "Enviando...",
    submit: "Enviar",
    successTitle: "¡Mensaje enviado!",
    successText: "Nos pondremos en contacto contigo pronto.",
    errorTitle: "Algo salió mal",
    errorText: "Por favor intenta de nuevo.",
    close: "Cerrar",
  },
  en: {
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Message",
    sending: "Sending...",
    submit: "Send",
    successTitle: "Message sent!",
    successText: "We'll get in touch with you soon.",
    errorTitle: "Something went wrong",
    errorText: "Please try again.",
    close: "Close",
  },
} as const;

export default function ContactForm() {
  const locale = useLocale();
  const t = COPY[locale];
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/contacto/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.correo,
          mensaje: form.mensaje,
          tipo: "contacto",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ nombre: "", correo: "", mensaje: "" });
      if (typeof window !== "undefined" && window.cioanalytics) {
        window.cioanalytics.identify({ email: form.correo });
        window.cioanalytics.track("Contact Form Submitted", { inquiry_type: null });
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          name="nombre"
          placeholder={t.namePlaceholder}
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          type="email"
          name="correo"
          placeholder={t.emailPlaceholder}
          value={form.correo}
          onChange={handleChange}
          required
        />
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          name="mensaje"
          placeholder={t.messagePlaceholder}
          value={form.mensaje}
          onChange={handleChange}
          required
        />
        <div className={styles.submitRow}>
          <button
            type="submit"
            className={styles.submitBtn}
            data-btn="yellow"
            disabled={status === "loading"}
          >
            {status === "loading" ? t.sending : t.submit}
          </button>
        </div>
      </form>

      <div className={`${styles.toast} ${status === "success" || status === "error" ? styles.toastVisible : ""} ${status === "error" ? styles.toastError : ""}`}>
        <div className={styles.toastContent}>
          <span className={styles.toastIcon}>{status === "success" ? "✓" : "!"}</span>
          <div>
            <p className={styles.toastTitle}>
              {status === "success" ? t.successTitle : t.errorTitle}
            </p>
            <p className={styles.toastText}>
              {status === "success" ? t.successText : t.errorText}
            </p>
          </div>
        </div>
        <button className={styles.toastClose} onClick={() => setStatus("idle")} aria-label={t.close}>✕</button>
      </div>
    </>
  );
}
