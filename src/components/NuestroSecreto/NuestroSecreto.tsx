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

export default async function NuestroSecreto() {
  const badges = await getBadges();

  return (
    <section className={styles.nuestroSecreto}>
      <div className={styles.innerContainer}>
        {/* Columna izquierda - Texto */}
        <div className={styles.textContainer}>
          <h2 className={styles.title}>Nuestro secreto</h2>
          <p className={styles.description}>
            Un <span className={styles.highlight}>proceso único</span> que une lo
            artesanal y lo tecnológico:{" "}
            <span className={styles.highlight}>bases culinarias</span>{" "}
            desarrolladas por el reconocido{" "}
            <span className={styles.highlight}>chef Gastón Acurio</span>, que
            rescata recetas de madres y abuelas, y las combina con{" "}
            <span className={styles.highlight}>secretos de alta cocina</span> que
            garantizan un sabor inigualable.
          </p>

          {/* Badges - grid de imágenes */}
          <div className={styles.badgesGrid}>
            {badges.map((badge) => {
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

          {/* Botón negro */}
          <div className={styles.btnContainer}>
            <Button
              href="/sobre-nosotros"
              variant="primary"
              className={styles.procesoBtn}
            >
              Conoce nuestro proceso
            </Button>
          </div>
        </div>

        {/* Columna derecha - Imagen de Gastón */}
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
          <Button
            href="/sobre-nosotros"
            variant="yellow"
            className={styles.gastonBtn}
          >
            Conoce más sobre Gastón Acurio
          </Button>
        </div>
      </div>
    </section>
  );
}