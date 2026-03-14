import Image from "next/image";
import { Button } from "@/components/ui";
import styles from "./CocinarConQ.module.css";

export default function CocinarConQ({
  historia_descripcion,
  historia_frase_q,
  historia_cta,
}: {
  historia_descripcion?: string;
  historia_frase_q?: string;
  historia_cta?: { texto: string; url: string; nueva_ventana: boolean } | null;
}) {
  return (
    <section className={styles.cocinarConQ}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/web/home/cocinar/wave_cocinar_con_q.svg"
          alt=""
          width={1920}
          height={864}
          className={styles.waveImage}
          priority={false}
        />

        {historia_frase_q && (
          <p className={styles.historiaFraseQ}>{historia_frase_q}</p>
        )}

        <div className={styles.desktopContent}>
          <div className={styles.textButtonWrapper}>
            <p className={styles.description}>{historia_descripcion}</p>
            {historia_cta && (
              <Button
                href={historia_cta.url}
                variant="yellow"
                className={styles.desktopBtn}>
                {historia_cta.texto}
              </Button>
            )}
          </div>
        </div>

        <div className={styles.mobileContent}>
          <div className={styles.textWrapper}>
            <p className={styles.description}>{historia_descripcion}</p>
          </div>
          {historia_cta && (
            <div className={styles.buttonWrapper}>
              <Button href={historia_cta.url} variant="yellow">
                {historia_cta.texto}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
