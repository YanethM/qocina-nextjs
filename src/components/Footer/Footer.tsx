"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteCode } from "@/hooks/useSiteCode";
import styles from "./Footer.module.css";

export default function Footer() {
  const siteCode = useSiteCode();

  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <Link href={`/${siteCode}`} className={styles.logo}>
          <Image
            src="/images/web/footer/logo-qocina.svg"
            alt="Q'ocina en Casa"
            width={162}
            height={64}
            priority
          />
        </Link>

        <div className={styles.navCart}>
          <nav className={styles.nav}>
            <Link href={`/${siteCode}/quienes-somos`}>Sobre nosotros</Link>
            <Link href={`/${siteCode}/productos`}>Productos</Link>
            <Link href={`/${siteCode}/recetas`}>Recetas</Link>
            <Link href={`/${siteCode}/blog-y-noticias`}>Actualidad</Link>
            <Link href={`/${siteCode}/contacto`}>Contacto</Link>
          </nav>

          <Link href={`/${siteCode}/carrito`} className={styles.cartIcon} aria-label="Carrito">
            <Image src="/images/web/footer/carrito.svg" alt="Carrito" width={36} height={36} />
          </Link>
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.paymentSection}>
          <span className={styles.secureText}>Compra en línea 100% seguro</span>
          <Image
            src="/images/web/footer/mastercard-securecode.svg"
            alt="MasterCard SecureCode"
            width={200}
            height={60}
            className={styles.paymentBadge}
          />
          <Image
            src="/images/web/footer/verified-by-visa.svg"
            alt="Verified by VISA"
            width={200}
            height={60}
            className={styles.paymentBadge}
          />
        </div>
        <div className={styles.socialIcons}>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <Image src="/images/web/footer/tiktok.svg" alt="TikTok" width={28} height={28} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <Image src="/images/web/footer/youtube.svg" alt="YouTube" width={28} height={28} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Image src="/images/web/footer/facebook.svg" alt="Facebook" width={28} height={28} />
          </a>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <Image src="/images/web/footer/whatsapp.svg" alt="WhatsApp" width={28} height={28} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Image src="/images/web/footer/instagram.svg" alt="Instagram" width={28} height={28} />
          </a>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <p className={styles.copyright}>
          &copy; All rights reserved. Fuxion {new Date().getFullYear()}.
        </p>
        <nav className={styles.policyLinks}>
          <Link href={`/${siteCode}/preguntas-frecuentes`}>Preguntas frecuentes</Link>
          <Link href={`/${siteCode}/politicas-de-privacidad`}>Políticas de privacidad</Link>
          <Link href={`/${siteCode}/politicas-de-cookies`}>Políticas de cookies</Link>
        </nav>
      </div>
    </footer>
  );
}
