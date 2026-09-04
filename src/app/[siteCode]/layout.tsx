import type { Metadata } from "next";
import { headers } from "next/headers";
import CountryModal from "@/components/CountryModal/CountryModal";
import { SITE_BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ siteCode: string }>;
}

export default async function SiteCodeLayout({ children, params }: Props) {
  const { siteCode } = await params;
  const requestHeaders = await headers();
  const isHomePage = requestHeaders.get("x-pathname") === `/${siteCode}`;
  const hideModal = process.env.MAINTENANCE_MODE === "true" && isHomePage;

  return (
    <>
      {children}
      {!hideModal && <CountryModal />}
    </>
  );
}
