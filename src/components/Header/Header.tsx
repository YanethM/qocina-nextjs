"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/tienda", label: "Tienda" },
  { href: "/recetas", label: "Recetas" },
  { href: "/blog-y-noticias", label: "Blog y Noticias" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logoWrapper} onClick={closeMenu}>
            <Image
              src="/images/web/header/logo_white.png"
              alt="Q'ocina en casa"
              width={162}
              height={64}
              className={styles.logoImage}
              priority
            />
          </Link>

          {/* Desktop: nav + carrito */}
          <div className={styles.rightGroup}>
            <nav className={styles.nav}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link href="/carrito" className={styles.cartWrapper}>
              <Image
                src="/images/web/header/shopping_white.png"
                alt="Carrito de compras"
                width={48}
                height={48}
                className={styles.cartIcon}
              />
            </Link>
          </div>

          {/* Mobile: carrito + hamburguesa */}
          <div className={styles.mobileActions}>
            <Link href="/carrito" className={styles.cartWrapper} onClick={closeMenu}>
              <Image
                src="/images/web/header/shopping_white.png"
                alt="Carrito de compras"
                width={40}
                height={40}
                className={styles.cartIcon}
              />
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

      {/* Mobile menu drawer */}
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

      {/* Overlay para cerrar al tocar fuera */}
      {menuOpen && (
        <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  );
}
