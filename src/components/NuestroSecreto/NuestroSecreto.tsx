import Image from "next/image";
import Button from "@/components/ui/Button";
import styles from "./NuestroSecreto.module.css";

async function getBadges() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/badges?populate=icono`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error('Error al cargar badges');
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
}

interface NuestroSecretoProps {
  secreto_titulo?: string;
  secreto_descripcion?: string;
  secreto_chef_frase_q?: string;
  secreto_cta?: { texto: string; url: string; nueva_ventana: boolean } | null;
  secreto_chef_cta?: { texto: string; url: string; nueva_ventana: boolean } | null;
}

export default async function NuestroSecreto({ secreto_titulo, secreto_descripcion, secreto_chef_frase_q, secreto_cta, secreto_chef_cta }: NuestroSecretoProps) {
  const badges = await getBadges();

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
                href={secreto_cta.url}
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
            src="/images/web/home/secret/gaston.svg"
            alt="Chef Gastón Acurio"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className={styles.waveImage}
            priority={false}
          />
          <Image
            src="/images/mobile/nuestro_secreto/secreto.svg"
            alt="Nuestro secreto"
            width={390}
            height={500}
            className={styles.mobileSecretoImage}
            style={{ height: "auto" }}
            priority={false}
          />
          {secreto_chef_frase_q && (
            <p className={styles.chefFraseQ}>{secreto_chef_frase_q}</p>
          )}
          {secreto_chef_cta && (
            <Button
              href={secreto_chef_cta.url}
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