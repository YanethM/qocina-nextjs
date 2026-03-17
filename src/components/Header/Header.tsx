"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/quienes-somos", label: "Nosotros" },
  { href: "/productos", label: "Tienda" },
  { href: "/recetas", label: "Recetas" },
  { href: "/blog-y-noticias", label: "Blog y Noticias" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [locale, setLocale] = useState("es");
  const { count } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
    if (match?.[1]) setLocale(match[1]);
  }, []);

  const changeLocale = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    setLocale(newLocale);
    router.refresh();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logoWrapper} onClick={closeMenu}>
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
                  className={`${styles.navLink} ${pathname.startsWith(link.href) ? styles.navLinkActive : ""}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
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
            <Link href="/carrito" className={styles.cartWrapper}>
              <div className={styles.cartIconWrapper}>
                <Image
                  src="/images/web/header/shopping_white.svg"
                  alt="Carrito de compras"
                  width={48}
                  height={48}
                  className={styles.cartIcon}
                />
                {count > 0 && (
                  <span className={styles.cartBadge}>{count > 99 ? "99+" : count}</span>
                )}
              </div>
            </Link>
          </div>

          <div className={styles.mobileActions}>
            <Link href="/carrito" className={styles.cartWrapper} onClick={closeMenu}>
              <div className={styles.cartIconWrapper}>
                <Image
                  src="/images/web/header/shopping_white.svg"
                  alt="Carrito de compras"
                  width={40}
                  height={40}
                  className={styles.cartIcon}
                />
                {count > 0 && (
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
              className={`${styles.mobileNavLink} ${pathname.startsWith(link.href) ? styles.mobileNavLinkActive : ""}`}
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
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  );
}
