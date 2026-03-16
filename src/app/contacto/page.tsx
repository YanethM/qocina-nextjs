import Image from "next/image";
import ContactForm from "@/components/ContactForm/ContactForm";
import { getContactoPage, getStrapiImageUrl } from "@/lib/api";
import styles from "./page.module.css";

export default async function ContactoPage() {
  const res = await getContactoPage().catch(() => null);
  const data = res?.data ?? null;

  return (
    <div className={styles.page}>
      <div className={styles.bgSection}>
      <div className={styles.mainContent}>
        <div className={styles.hero}>
          {data?.imagen?.url && (
            <div className={styles.imageCol}>
              <Image
                src={getStrapiImageUrl(data.imagen.url)}
                alt={data.imagen.alternativeText ?? ""}
                width={data.imagen.width ?? 480}
                height={data.imagen.height ?? 480}
                className={styles.mujerImg}
                priority
                unoptimized
              />
            </div>
          )}

          <div className={styles.contentCol}>
            {data?.titulo && (
              <h1 className={styles.titulo}>{data.titulo}</h1>
            )}
            {data?.descripcion && (
              <p className={styles.texto}>{data.descripcion}</p>
            )}
            <ContactForm />
          </div>
        </div>

        <div className={styles.whatsappSection}>
          {data?.whatsapp_texto && (
            <p className={styles.whatsappText}>{data.whatsapp_texto}</p>
          )}
          {data?.whatsapp_url && (
            <a
              href={data.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              {data.whatsapp_cta_texto}
              <Image
                src="/images/web/home/white_arrow_right.svg"
                alt=""
                width={25}
                height={25}
              />
            </a>
          )}
        </div>
      </div>
      </div>

      <div className={styles.wavesBottom}>
        <Image
          src="/images/web/contacto/contacto_waves.svg"
          alt=""
          width={1440}
          height={200}
          style={{ width: "100%", height: "auto" }}
          priority
        />
      </div>
    </div>
  );
}
