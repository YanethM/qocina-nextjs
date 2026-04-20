import type { Metadata } from "next";
import CountryModal from "@/components/CountryModal/CountryModal";
import { SITE_BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
};

export default function SiteCodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CountryModal />
    </>
  );
}
