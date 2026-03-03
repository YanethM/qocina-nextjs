import { getRecetaBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import RecetaDetail from "@/components/RecetaDetail/RecetaDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function RecetaDetailPage({ params }: Props) {
  const { slug } = await params;

  try {
    const receta = await getRecetaBySlug(slug);

    if (!receta) {
      console.error("[RecetaDetail] No data for slug:", slug);
      return notFound();
    }

    return <RecetaDetail receta={receta} />;
  } catch (err) {
    console.error("[RecetaDetail] Error fetching receta:", slug, err);
    return notFound();
  }
}

