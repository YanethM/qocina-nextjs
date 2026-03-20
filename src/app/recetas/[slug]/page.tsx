import { getRecetaBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import RecetaDetail from "@/components/RecetaDetail/RecetaDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const receta = await getRecetaBySlug(slug).catch(() => null);
  return {
    title: receta?.meta_title ?? receta?.titulo ?? "Receta - Q'ocina",
    description: receta?.meta_description ?? receta?.descripcion_corta ?? "Descubre esta receta",
  };
}

export default async function RecetaDetailPage({ params }: Props) {
  const { slug } = await params;

  let receta;

  try {
    receta = await getRecetaBySlug(slug);

    if (!receta) {
      console.error("[RecetaDetail] No data for slug:", slug);
      return notFound();
    }
  } catch (err) {
    console.error("[RecetaDetail] Error fetching receta:", slug, err);
    return notFound();
  }

  return <RecetaDetail receta={receta} />;
}

