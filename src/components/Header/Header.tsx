"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSiteCode } from "@/hooks/useSiteCode";
import { COOKIE_MAX_AGE } from "@/lib/constants";
import CountryModal from "@/components/CountryModal/CountryModal";
import styles from "./Header.module.css";

const NAV_PATHS = [
  { path: "/quienes-somos", label: { es: "Nosotros", en: "About us" } },
  { path: "/productos", label: { es: "Tienda", en: "Shop" } },
  { path: "/recetas", label: { es: "Recetas", en: "Recipes" } },
  { path: "/blog-y-noticias", label: { es: "Blog y Noticias", en: "Blog & News" } },
  { path: "/contacto", label: { es: "Contacto", en: "Contact" } },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [locale, setLocale] = useState("es");
  const [mounted, setMounted] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const { count } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const siteCode = useSiteCode();

  const base = siteCode ? `/${siteCode}` : "";
  const navLinks = NAV_PATHS.map((n) => ({ href: `${base}${n.path}`, label: n.label[locale as "es" | "en"] ?? n.label.es, path: n.path }));

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
    if (match?.[1]) setLocale(match[1]);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const changeLocale = (newLocale: string) => {
    const secureCookies = process.env.NEXT_PUBLIC_SECURE_COOKIES === "true";
    document.cookie = `locale=${newLocale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secureCookies ? "; Secure" : ""}`;
    setLocale(newLocale);
    window.dispatchEvent(new CustomEvent("qocina:locale-change", { detail: newLocale }));
    router.refresh();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href={siteCode ? `/${siteCode}` : "/"} className={styles.logoWrapper} onClick={closeMenu}>
            <Image
              src="/images/web/header/logo_white.svg"
              alt="Q'ocina en casa"
              width={162}
              height={64}
              className={styles.logoImage}
              priority
            />
          </Link>

          <div className={styles.rightGroup}>
            <nav className={styles.nav}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${pathname.includes(link.path) ? styles.navLinkActive : ""}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
            {siteCode && (
              <button
                className={styles.countryBtn}
                onClick={() => setCountryModalOpen(true)}
                aria-label="Cambiar país"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                {siteCode.toUpperCase()}
              </button>
            )}
            <div className={styles.langSelector}>
              <button
                className={`${styles.langBtn} ${locale === "es" ? styles.langActive : ""}`}
                onClick={() => changeLocale("es")}
              >
                ES
              </button>
              <span className={styles.langDivider}>|</span>
              <button
                className={`${styles.langBtn} ${locale === "en" ? styles.langActive : ""}`}
                onClick={() => changeLocale("en")}
              >
                EN
              </button>
            </div>
            <Link href={siteCode ? `/${siteCode}/carrito` : "/"} className={styles.cartWrapper}>
              <div className={styles.cartIconWrapper}>
                <Image
                  src="/images/web/header/shopping_white.svg"
                  alt="Carrito de compras"
                  width={48}
                  height={48}
                  className={styles.cartIcon}
                />
                {mounted && count > 0 && (
                  <span className={styles.cartBadge}>{count > 99 ? "99+" : count}</span>
                )}
              </div>
            </Link>
          </div>

          <div className={styles.mobileActions}>
            <Link href={siteCode ? `/${siteCode}/carrito` : "/"} className={styles.cartWrapper} onClick={closeMenu}>
              <div className={styles.cartIconWrapper}>
                <Image
                  src="/images/web/header/shopping_white.svg"
                  alt="Carrito de compras"
                  width={40}
                  height={40}
                  className={styles.cartIcon}
                />
                {mounted && count > 0 && (
                  <span className={styles.cartBadge}>{count > 99 ? "99+" : count}</span>
                )}
              </div>
            </Link>
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              <span className={`${styles.line} ${menuOpen ? styles.lineTop : ""}`} />
              <span className={`${styles.line} ${menuOpen ? styles.lineMid : ""}`} />
              <span className={`${styles.line} ${menuOpen ? styles.lineBot : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        <nav className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${pathname.includes(link.path) ? styles.mobileNavLinkActive : ""}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileLangSelector}>
            <button
              className={`${styles.langBtn} ${locale === "es" ? styles.langActive : ""}`}
              onClick={() => { changeLocale("es"); closeMenu(); }}
            >
              ES
            </button>
            <span className={styles.langDivider}>|</span>
            <button
              className={`${styles.langBtn} ${locale === "en" ? styles.langActive : ""}`}
              onClick={() => { changeLocale("en"); closeMenu(); }}
            >
              EN
            </button>
            {siteCode && (
              <>
                <span className={styles.langDivider}>|</span>
                <button
                  className={styles.countryBtn}
                  onClick={() => { setCountryModalOpen(true); closeMenu(); }}
                  aria-label="Cambiar país"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  {siteCode.toUpperCase()}
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
      )}

      <CountryModal
        open={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
      />
    </>
  );
}
