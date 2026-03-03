import { getReceta } from "@/lib/api";
import { notFound } from "next/navigation";
import RecetaDetail from "@/components/RecetaDetail/RecetaDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function RecetaDetailPage({ params }: Props) {
  const { id } = await params;

  try {
    const res = await getReceta(id);
    const receta = res?.data;

    if (!receta) {
      console.error("[RecetaDetail] No data for id:", id);
      return notFound();
    }

    return <RecetaDetail receta={receta} />;
  } catch (err) {
    console.error("[RecetaDetail] Error fetching receta:", id, err);
    return notFound();
  }
}

