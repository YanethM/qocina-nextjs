import Image from "next/image";
import Button from "@/components/ui/Button";
import styles from "./NuestroSecreto.module.css";
import type { Badge } from "@/types";

interface NuestroSecretoProps {
  secreto_titulo?: string;
  secreto_descripcion?: string;
  secreto_badges?: Badge[];
  secreto_chef_frase_q?: string;
  secreto_cta?: { texto: string; url: string; nueva_ventana: boolean } | null;
  secreto_chef_cta?: { texto: string; url: string; nueva_ventana: boolean } | null;
  secreto_chef_imagen_url?: string;
  siteCode?: string;
  locale?: string;
}

export default function NuestroSecreto({ secreto_titulo, secreto_descripcion, secreto_badges, secreto_chef_frase_q, secreto_cta, secreto_chef_cta, secreto_chef_imagen_url, siteCode, locale }: NuestroSecretoProps) {
  const hasContent = secreto_titulo || secreto_descripcion || secreto_chef_frase_q || secreto_cta || secreto_chef_cta;
  if (!hasContent) return null;

  const badges = secreto_badges ?? [];

  const staticGastonImageSrc =
    locale === "en"
      ? "/images/web/home/secret/gaston_en.svg"
      : "/images/web/home/secret/gaston.svg";

  const gastonImageSrc = secreto_chef_imagen_url || staticGastonImageSrc;
  const mobileGastonImageSrc =
    secreto_chef_imagen_url || "/images/mobile/nuestro_secreto/cocinar_con_q.svg";

  return (
    <section className={styles.nuestroSecreto}>
      <div className={styles.innerContainer}>
        <div className={styles.textContainer}>
          {secreto_titulo && <h2 className={styles.title}>{secreto_titulo}</h2>}
          {secreto_descripcion && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: secreto_descripcion }}
            />
          )}

          <div className={styles.badgesGrid}>
            {badges.map((badge: any) => {
              const icono = badge.icono;
              const formats = icono?.formats;
              
              const imageUrl = formats?.small?.url || formats?.thumbnail?.url || icono?.url;
              const fullImageUrl = imageUrl ? `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}` : null;

              if (!fullImageUrl) return null;

              return (
                <div key={badge.id} className={styles.badgeItem}>
                  <Image
                    src={fullImageUrl}
                    alt={badge.nombre}
                    width={97}
                    height={97}
                    className={styles.badgeImage}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {secreto_cta && (
            <div className={styles.btnContainer}>
              <Button
                href={secreto_cta.url?.startsWith("/") ? `/${siteCode}${secreto_cta.url}` : secreto_cta.url}
                variant="primary"
                className={styles.procesoBtn}
              >
                {secreto_cta.texto}
              </Button>
            </div>
          )}
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={gastonImageSrc}
            alt="Chef Gastón Acurio"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className={styles.waveImage}
            priority={false}
            quality={90}
          />
          <Image
            src={mobileGastonImageSrc}
            alt="Nuestro secreto"
            width={390}
            height={700}
            className={styles.mobileSecretoImage}
            priority={false}
            quality={90}
          />
          {secreto_chef_frase_q && (
            <p className={styles.chefFraseQ}>{secreto_chef_frase_q}</p>
          )}
          {secreto_chef_cta && (
            <Button
              href={secreto_chef_cta.url?.startsWith("/") ? `/${siteCode}${secreto_chef_cta.url}` : secreto_chef_cta.url}
              variant="yellow"
              className={styles.gastonBtn}
            >
              {secreto_chef_cta.texto}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
