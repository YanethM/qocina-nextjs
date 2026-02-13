import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            Q&apos;ocina
          </Link>
          <p className={styles.tagline}>
            Sabores que inspiran, productos que transforman.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Navegación</h4>
            <Link href="/quienes-somos">Quiénes Somos</Link>
            <Link href="/productos">Productos</Link>
            <Link href="/recetas">Recetas</Link>
          </div>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Recursos</h4>
            <Link href="/blog">Blog</Link>
            <Link href="/faq">Preguntas Frecuentes</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Q&apos;ocina. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
