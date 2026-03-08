import Image from "next/image";
import PageHero from "@/components/PageHero/PageHero";
import BlogCard from "@/components/BlogCard/BlogCard";
import styles from "./page.module.css";

const cards = Array.from({ length: 6 }, (_, i) => i + 1);

export default function BlogYNoticiasPage() {
  return (
    <>
      <PageHero backgroundAlt="Blog y Noticias">
        <div className={styles.heroLogoWrapper}>
          <Image
            src="/images/web/noticias/blog_logo.svg"
            alt="Blog y Noticias"
            width={400}
            height={200}
            className={styles.heroLogo}
            style={{ height: "auto" }}
            priority
          />
        </div>
      </PageHero>

      <section className={styles.publicacionesSection}>
        <h2 className={styles.publicacionesTitulo}>Últimas publicaciones</h2>

        <div className={styles.cardsGrid}>
          {cards.map((i) => (
            <BlogCard key={i} />
          ))}
        </div>
      </section>
    </>
  );
}
