"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/productos", label: "Tienda" },
  { href: "/recetas", label: "Recetas" },
  { href: "/blog-y-noticias", label: "Blog y Noticias" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  const closeMenu = () => setMenuOpen(false);

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
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
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
              className={styles.mobileNavLink}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  );
}
