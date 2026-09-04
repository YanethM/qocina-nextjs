import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import CioPageTracker from "@/components/CioPageTracker/CioPageTracker";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CartToast from "@/components/CartToast/CartToast";
import CookieBanner from "@/components/CookieBanner/CookieBanner";
import { CartProvider } from "@/context/CartContext";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = localFont({
  src: [
    {
      path: "./fonts/Montserrat-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "./fonts/Montserrat-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

const palmer = localFont({
  src: [
    {
      path: "./fonts/PalmerLakePrint-Regular.ttf",
    },
  ],
  variable: "--font-palmer",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Q'ocina - Sabores que inspiran",
  description:
    "Q'ocina - Productos artesanales, recetas y más. Sabores que inspiran, productos que transforman.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/images/web/footer/logo-qocina.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname");
  const siteCode = requestHeaders.get("x-site-code");
  const isHomePage = Boolean(siteCode && pathname === `/${siteCode}`);
  const hideChrome = process.env.MAINTENANCE_MODE === "true" && isHomePage;

  return (
    <html lang="es">
      <head>
        <Script
          id="cio-snippet"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(){var i="cioanalytics",analytics=(window[i]=window[i]||[]);if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-customerio-analytics-key",i);t.src="https://cdp.customer.io/v1/analytics-js/snippet/"+key+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._writeKey=key;analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.15.3";analytics.load("726ceaf5356b813d3e29",{"integrations":{"Customer.io In-App Plugin":false}});analytics.page();}}();`,
          }}
        />
      </head>
      <body className={`${montserrat.variable} ${palmer.variable}`} suppressHydrationWarning>
        <CartProvider>
          <CioPageTracker />
          {!hideChrome && <Header />}
          <main className={hideChrome ? "main-no-chrome" : undefined}>{children}</main>
          {!hideChrome && <Footer />}
          <CartToast />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
