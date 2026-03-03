import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/api";
import type { Receta } from "@/types";
import styles from "./RecetaDetail.module.css";

interface Props {
  receta: Receta;
}

function parsePorciones(porciones: string | number | null | undefined): number {
  if (porciones == null) return 0;
  const str = String(porciones);
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function RecetaDetail({ receta }: Props) {
  const heroImage =
    receta.imagen_principal?.url ?? receta.imagen?.url ?? null;

  const ingredientes =
    Array.isArray(receta.ingredientes) ? receta.ingredientes : [];
  const pasos = receta.pasos ?? [];
  const tips = receta.tips ?? [];

  const totalTime =
    (receta.tiempo_preparacion ?? 0) + (receta.tiempo_coccion ?? 0);

  const porcionesNum = parsePorciones(receta.porciones);

  return (
    <article className={styles.page}>
      <div className={styles.heroSection}>
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
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{receta.titulo}</h1>
            {receta.porciones != null && (
              <div className={styles.porcionesHero}>
                <span className={styles.porcionesLabel}>
                  Porciones ({receta.porciones})
                </span>
                <div className={styles.porcionesIcons}>
                  {Array.from({ length: porcionesNum }).map((_, i) => (
                    <Image
                      key={i}
                      src="/images/web/recetas/recetas_detail/porcion.svg"
                      alt=""
                      width={28}
                      height={28}
                      className={styles.porcionIcon}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.wavesWrapper}>
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
      </div>

      <div className={styles.content}>
  

        {pasos.length > 0 && (
          <div className={styles.pasosSection}>
            <h2 className={styles.preparacionTitle}>PREPARACIÓN</h2>
            <div className={styles.preparacionLayout}>
              <div className={styles.preparacionSidebar}>
                {receta.texto_base_utilizada && (
                  <div className={styles.sidebarItem}>
                    <Image
                      src="/images/web/recetas/recetas_detail/icon1.svg"
                      alt=""
                      width={40}
                      height={40}
                      aria-hidden
                    />
                    <span className={styles.sidebarLabel}>Preparación utilizando nuestra</span>
                    <span className={styles.sidebarValue}>{receta.texto_base_utilizada}</span>
                  </div>
                )}
                {receta.dificultad && (
                  <div className={styles.sidebarItem}>
                    <Image
                      src="/images/web/recetas/recetas_detail/icon2.svg"
                      alt=""
                      width={40}
                      height={40}
                      aria-hidden
                    />
                    <span className={styles.sidebarLabel}>Esta receta tiene un nivel</span>
                    <span className={styles.sidebarValue}>{receta.dificultad}</span>
                    <div className={styles.difficultyBar}>
                      <div
                        className={styles.difficultyFill}
                        style={{
                          width:
                            receta.dificultad.toLowerCase() === 'fácil' || receta.dificultad.toLowerCase() === 'facil'
                              ? '33%'
                              : receta.dificultad.toLowerCase() === 'intermedio'
                                ? '66%'
                                : '100%',
                        }}
                      />
                    </div>
                  </div>
                )}
                {totalTime > 0 && (
                  <div className={styles.sidebarItem}>
                    <Image
                      src="/images/web/recetas/recetas_detail/icon3.svg"
                      alt=""
                      width={40}
                      height={40}
                      aria-hidden
                    />
                    <span className={styles.sidebarLabel}>Tiempo aproximado</span>
                    <span className={styles.sidebarValue}>{totalTime} min</span>
                  </div>
                )}
              </div>

              <ol className={styles.pasosList}>
                {pasos
                  .sort((a, b) => a.numero - b.numero)
                  .map((paso) => (
                    <li key={paso.id} className={styles.pasoItem}>
                      <span className={styles.pasoNumero}>{paso.numero}</span>
                      <p className={styles.pasoDescripcion}>
                        {paso.descripcion}
                      </p>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      {tips.length > 0 && (
        <div className={styles.tipsSection}>
          <div className={styles.tipsWaveTop} />
          <div className={styles.tipsBody}>
            <div className={styles.tipsHeader}>
              <Image
                src="/images/web/recetas/recetas_detail/checkmark.svg"
                alt=""
                width={40}
                height={40}
                aria-hidden
              />
              <h2 className={styles.tipsTitle}>TIPS</h2>
            </div>
            <div className={styles.tipsList}>
              {tips
                .sort((a, b) => a.numero - b.numero)
                .map((tip) => (
                  <div key={tip.id} className={styles.tipCard}>
                    <span className={styles.tipNumero}>{tip.numero}</span>
                    <p className={styles.tipText}>{tip.descripcion}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
