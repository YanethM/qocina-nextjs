"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ProductosNuestroSecreto.module.css";

const items = [
  {
    id: 1,
    titulo: "Descubre el proceso detrás del sabor",
    contenido: (
      <>
        <p>
          Nuestra base roja no se hizo a la carrera. Se cocina{" "}
          <strong>slow and sabroso</strong>, como manda la buena cocina latina
          que siempre se atreve a innovar. Primero se doran los ingredientes
          hasta que griten &quot;¡listo!&quot;. Luego, se liofiliza (sí, así de
          pro).
        </p>
        <p>
          ¿El resultado? Una base práctica, saludable y con ese cariño que solo
          tiene lo hecho en casa... pero lista en segundos.
        </p>
      </>
    ),
  },
  {
    id: 2,
    titulo: "¿Qué es la liofilización y por qué importa?",
    contenido: (
      <p>
        La liofilización es un proceso de deshidratación en frío que conserva el
        sabor, color, aroma y nutrientes de los alimentos. A diferencia del
        secado tradicional, no usa calor, lo que significa que tu base llega a
        ti con toda su esencia intacta.
      </p>
    ),
  },
  {
    id: 3,
    titulo: "¿Por qué esta base culinaria?",
    contenido: (
      <p>
        Porque cocinar rico no debería ser complicado. Esta base te da el
        arranque sabroso que necesitas para preparar tus platos favoritos en
        minutos, sin sacrificar calidad ni autenticidad.
      </p>
    ),
  },
];

export default function ProductosNuestroSecreto() {
  const [openId, setOpenId] = useState<number>(1);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? 0 : id));
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Nuestro secreto del sabor</h2>

      <div className={styles.body}>
        {/* Imagen izquierda */}
        <div className={styles.imageWrapper}>
          <Image
            src="/images/web/products/nuestro_secreto.svg"
            alt="Nuestro secreto del sabor"
            width={611}
            height={510}
            className={styles.image}
          />
        </div>

        {/* Acordeones derecha */}
        <div className={styles.accordion}>
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className={styles.accordionItem}>
                <button
                  className={styles.accordionHeader}
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.accordionTitle}>{item.titulo}</span>
                  <span className={styles.arrowBtn}>
                    <Image
                      src={
                        isOpen
                          ? "/images/web/products/arrow_button_up.svg"
                          : "/images/web/products/arrow_button_down.svg"
                      }
                      alt={isOpen ? "Cerrar" : "Abrir"}
                      width={40}
                      height={40}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div className={styles.accordionContent}>
                    <hr className={styles.divider} />
                    {item.contenido}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}