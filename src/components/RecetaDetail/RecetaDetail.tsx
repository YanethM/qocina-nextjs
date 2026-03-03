import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/api";
import { COLOR_MAP } from "@/lib/constants";
import type { Receta } from "@/types";
import styles from "./RecetaDetail.module.css";

interface Props {
  receta: Receta;
}

function getColorFromCard(color: string | undefined): string {
  if (!color) return COLOR_MAP.rojo;
  return COLOR_MAP[color] ?? COLOR_MAP.rojo;
}

export default function RecetaDetail({ receta }: Props) {
  const heroImage =
    receta.imagen_principal?.url ?? receta.imagen?.url ?? null;
  const accentColor = getColorFromCard(receta.color_card);

  const ingredientes =
    Array.isArray(receta.ingredientes) ? receta.ingredientes : [];
  const pasos = receta.pasos ?? [];
  const tips = receta.tips ?? [];

  const totalTime =
    (receta.tiempo_preparacion ?? 0) + (receta.tiempo_coccion ?? 0);

  return (
    <article className={styles.page}>
      <div className={styles.hero}>
        {heroImage && (
          <Image
            src={getStrapiImageUrl(heroImage)}
            alt={receta.titulo}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="100vw"
          />
        )}
      </div>

      <div className={styles.wavesWrapper}>
        <Image
          src="/images/web/recetas/recetas_detail/baner_waves.svg"
          alt=""
          width={1440}
          height={657}
          className={styles.bannerWaves}
          aria-hidden
        />

        {ingredientes.length > 0 && (
          <section className={styles.ingredientesOverWaves}>
            <h2 className={styles.ingredientesTitle}>INGREDIENTES</h2>
            <div className={styles.ingredientesBox}>
              <div className={styles.ingredientesColumns}>
                <ul className={styles.ingredientesCol}>
                  {ingredientes
                    .slice(0, Math.ceil(ingredientes.length / 2))
                    .map((ing) => (
                      <li key={ing.id} className={styles.ingredienteRow}>
                        <Image
                          src="/images/web/recetas/recetas_detail/checkmark.svg"
                          alt=""
                          width={20}
                          height={20}
                          className={styles.checkIcon}
                          aria-hidden
                        />
                        <span className={styles.ingredienteText}>
                          {ing.cantidad} {ing.unidad} {ing.nombre}
                          {ing.es_opcional && (
                            <span className={styles.opcionalWhite}> (opcional)</span>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
                <ul className={styles.ingredientesCol}>
                  {ingredientes
                    .slice(Math.ceil(ingredientes.length / 2))
                    .map((ing) => (
                      <li key={ing.id} className={styles.ingredienteRow}>
                        <Image
                          src="/images/web/recetas/recetas_detail/checkmark.svg"
                          alt=""
                          width={20}
                          height={20}
                          className={styles.checkIcon}
                          aria-hidden
                        />
                        <span className={styles.ingredienteText}>
                          {ing.cantidad} {ing.unidad} {ing.nombre}
                          {ing.es_opcional && (
                            <span className={styles.opcionalWhite}> (opcional)</span>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className={styles.ingredientesImgWrapper}>
                <Image
                  src="/images/web/recetas/recetas_detail/Productos.svg"
                  alt="Productos Q'ocina"
                  width={300}
                  height={260}
                  className={styles.ingredientesImg}
                />
              </div>
            </div>
          </section>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title} style={{ color: accentColor }}>
            {receta.titulo}
          </h1>

          {receta.descripcion_corta && (
            <p className={styles.descripcionCorta}>{receta.descripcion_corta}</p>
          )}

          {receta.texto_base_utilizada && (
            <p className={styles.baseUtilizada} style={{ color: accentColor }}>
              {receta.texto_base_utilizada}
            </p>
          )}

          <div className={styles.meta}>
            {receta.tiempo_preparacion != null && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Preparación</span>
                <span className={styles.metaValue}>
                  {receta.tiempo_preparacion} min
                </span>
              </div>
            )}
            {receta.tiempo_coccion != null && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Cocción</span>
                <span className={styles.metaValue}>
                  {receta.tiempo_coccion} min
                </span>
              </div>
            )}
            {totalTime > 0 && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Tiempo total</span>
                <span className={styles.metaValue}>{totalTime} min</span>
              </div>
            )}
            {receta.porciones != null && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Porciones</span>
                <span className={styles.metaValue}>{receta.porciones}</span>
              </div>
            )}
            {receta.dificultad && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Dificultad</span>
                <span className={styles.metaValue}>{receta.dificultad}</span>
              </div>
            )}
          </div>
        </div>

        {pasos.length > 0 && (
          <div className={styles.pasosSection}>
              <h2 className={styles.sectionTitle}>Preparación</h2>
              <ol className={styles.pasosList}>
                {pasos
                  .sort((a, b) => a.numero - b.numero)
                  .map((paso) => (
                    <li key={paso.id} className={styles.pasoItem}>
                      <div
                        className={styles.pasoNumero}
                        style={{ backgroundColor: accentColor }}
                      >
                        {paso.numero}
                      </div>
                      <div className={styles.pasoContent}>
                        <h3 className={styles.pasoTitulo}>{paso.titulo}</h3>
                        <p className={styles.pasoDescripcion}>
                          {paso.descripcion}
                        </p>
                      </div>
                    </li>
                  ))}
              </ol>
            </div>
          )}

        {tips.length > 0 && (
          <div className={styles.tipsSection}>
            <h2 className={styles.sectionTitle}>Tips</h2>
            <div className={styles.tipsList}>
              {tips
                .sort((a, b) => a.numero - b.numero)
                .map((tip) => (
                  <div key={tip.id} className={styles.tipCard}>
                    <span
                      className={styles.tipIcon}
                      style={{ backgroundColor: accentColor }}
                    >
                      💡
                    </span>
                    <p className={styles.tipText}>{tip.descripcion}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
