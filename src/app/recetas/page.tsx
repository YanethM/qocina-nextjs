import Image from "next/image";
import { getRecetasPage, getTestimonios, getRecetas } from "@/lib/api";
import styles from "./page.module.css";
import BasesCulinarias from "@/components/BasesCulinarias/BasesCulinarias";
import Testimonios from "@/components/Testimonios/Testimonios";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";

export const metadata = {
  title: "Recetas - Q'ocina",
  description: "Descubre nuestras mejores recetas",
};

export default async function RecetasPage() {
  const [, testimoniosRes, recetasRes] = await Promise.all([
    getRecetasPage().catch(() => null),
    getTestimonios().catch(() => null),
    getRecetas().catch(() => null),
  ]);

  const testimonios = testimoniosRes?.data ?? [];
  const recetas = recetasRes?.data ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.banner}>
        <Image
          src="/images/web/recetas/banner.svg"
          alt="Recetas Q'ocina"
          fill
          className={styles.bannerImage}
          style={{ objectFit: "cover" }}
          priority
        />
      </section>

      <BasesCulinarias />
      <ListaRecetas recetas={recetas} />
      <Testimonios testimonios={testimonios} />
    </div>
  );
}