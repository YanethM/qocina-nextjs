import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${palmer.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
