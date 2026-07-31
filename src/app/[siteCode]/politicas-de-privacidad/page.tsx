import LegalTerms from "@/components/LegalTerms/LegalTerms";
import { getLocale } from "@/lib/locale";

interface Props {
  params: Promise<{ siteCode: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale(siteCode);

  if (locale === "en") {
    return {
      title: "Terms and Conditions | Q'ocina en Casa",
      description:
        "Terms and conditions of the Q'ocina en Casa virtual store by FUXION BIOTECH S.A.C.",
    };
  }

  return {
    title: "Términos y Condiciones | Q'ocina en Casa",
    description:
      "Términos y condiciones de la tienda virtual Q'ocina en Casa de FUXION BIOTECH S.A.C.",
  };
}

export default async function PoliticasPrivacidadPage({ params }: Props) {
  const { siteCode } = await params;
  const locale = await getLocale(siteCode);

  return <LegalTerms locale={locale} />;
}
