import LegalTerms from "@/components/LegalTerms/LegalTerms";
import { getLocale } from "@/lib/locale";

export async function generateMetadata() {
  const locale = await getLocale();

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

export default async function PoliticasPrivacidadPage() {
  const locale = await getLocale();

  return <LegalTerms locale={locale} />;
}
