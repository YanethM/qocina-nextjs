import CarritoWrapper from "./CarritoWrapper";
import { getPacks } from "@/lib/api";
import { getLocale } from "@/lib/locale";

interface Props {
  params: Promise<{ siteCode: string }>;
}

export default async function CarritoPage({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale(siteCode);
  const { allPacks } = await getPacks(locale, siteCode).catch(() => ({ allPacks: [] }));

  return <CarritoWrapper initialPacks={allPacks} />;
}
