import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Row 1: Logo + Nav + Cart */}
      <div className={styles.topRow}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/web/footer/logo-qocina.png"
            alt="Q'ocina en Casa"
            width={162}
            height={64}
            priority
          />
        </Link>

        <div className={styles.navCart}>
          <nav className={styles.nav}>
            <Link href="/sobre-nosotros">Sobre nosotros</Link>
            <Link href="/productos">Productos</Link>
            <Link href="/recetas">Recetas</Link>
            <Link href="/actualidad">Actualidad</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>

          <Link href="/carrito" className={styles.cartIcon} aria-label="Carrito">
            <Image src="/images/web/footer/carrito.png" alt="Carrito" width={36} height={36} />
          </Link>
        </div>
      </div>

      {/* Row 2: Payment badges + Social icons */}
      <div className={styles.middleRow}>
        <div className={styles.paymentSection}>
          <span className={styles.secureText}>Compra en línea 100% seguro</span>
          <Image
            src="/images/web/footer/mastercard-securecode.png"
            alt="MasterCard SecureCode"
            width={200}
            height={60}
            className={styles.paymentBadge}
            style={{ height: "auto" }}
          />
          <Image
            src="/images/web/footer/verified-by-visa.png"
            alt="Verified by VISA"
            width={200}
            height={60}
            className={styles.paymentBadge}
            style={{ height: "auto" }}
          />
        </div>
        <div className={styles.socialIcons}>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok">
            <Image
              src="/images/web/footer/tiktok.png"
              alt="TikTok"
              width={28}
              height={28}
              style={{ height: "auto" }}
            />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube">
            <Image
              src="/images/web/footer/youtube.png"
              alt="YouTube"
              width={28}
              height={28}
              style={{ height: "auto" }}
            />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook">
            <Image
              src="/images/web/footer/facebook.png"
              alt="Facebook"
              width={28}
              height={28}
              style={{ height: "auto" }}
            />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp">
            <Image
              src="/images/web/footer/whatsapp.png"
              alt="WhatsApp"
              width={28}
              height={28}
              style={{ height: "auto" }}
            />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram">
            <Image
              src="/images/web/footer/instagram.png"
              alt="Instagram"
              width={28}
              height={28}
              style={{ height: "auto" }}
            />
          </a>
        </div>
      </div>


      {/* Row 3: Copyright + Policy links */}
      <div className={styles.bottomRow}>
        <p className={styles.copyright}>
          &copy; All rights reserved. Fuxion {new Date().getFullYear()}.
        </p>
        <nav className={styles.policyLinks}>
          <Link href="/preguntas-frecuentes">Preguntas frecuentes</Link>
          <Link href="/politicas-de-privacidad">Políticas de privacidad</Link>
          <Link href="/politicas-de-cookies">Políticas de cookies</Link>
        </nav>
      </div>
    </footer>
  );
}
