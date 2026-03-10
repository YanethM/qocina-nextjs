"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
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
        <button type="submit" className={styles.submitBtn}>
          Enviar
        </button>
      </div>
    </form>
  );
}
