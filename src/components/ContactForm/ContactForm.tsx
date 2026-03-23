"use client";

import { useState } from "react";
import { API_URL } from "@/lib/strapi";
import styles from "./ContactForm.module.css";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
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
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ nombre: "", correo: "", mensaje: "" });
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
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={handleChange}
          required
        />
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          name="mensaje"
          placeholder="Mensaje"
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
            {status === "loading" ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>

      <div className={`${styles.toast} ${status === "success" || status === "error" ? styles.toastVisible : ""} ${status === "error" ? styles.toastError : ""}`}>
        <div className={styles.toastContent}>
          <span className={styles.toastIcon}>{status === "success" ? "✓" : "!"}</span>
          <div>
            <p className={styles.toastTitle}>
              {status === "success" ? "¡Mensaje enviado!" : "Algo salió mal"}
            </p>
            <p className={styles.toastText}>
              {status === "success"
                ? "Nos pondremos en contacto contigo pronto."
                : "Por favor intenta de nuevo."}
            </p>
          </div>
        </div>
        <button className={styles.toastClose} onClick={() => setStatus("idle")} aria-label="Cerrar">✕</button>
      </div>
    </>
  );
}
