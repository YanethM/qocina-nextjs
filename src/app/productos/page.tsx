import Link from "next/link";
import Image from "next/image";
import {
  getProductos,
  getProductosPage,
  getCategorias,
  getStrapiImageUrl,
} from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
  title: "Productos - Q'ocina",
  description: "Explora nuestra variedad de productos artesanales",
};

export default async function ProductosPage() {
  const [pageRes, productosRes, categoriasRes] = await Promise.all([
    getProductosPage().catch(() => null),
    getProductos().catch(() => null),
    getCategorias().catch(() => null),
  ]);

  const pageData = pageRes?.data;
  const productos = productosRes?.data ?? [];
  const categorias = categoriasRes?.data ?? [];

  // Mapeo de colores de fondo para las cards basado en el tipo de producto
  const getCardColor = (nombre: string) => {
    if (nombre.toLowerCase().includes('verde')) return styles.cardGreen;
    if (nombre.toLowerCase().includes('amarillo')) return styles.cardYellow;
    if (nombre.toLowerCase().includes('roja')) return styles.cardRed;
    if (nombre.toLowerCase().includes('chupe')) return styles.cardBlue;
    return styles.cardDefault;
  };

  // Formateador de precio según moneda
  const formatPrice = (precio: number, moneda: string) => {
    if (moneda === 'PEN') {
      return `S/ ${precio.toFixed(2)}`;
    }
    return `$${precio.toFixed(2)} USD`;
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          {pageData?.titulo || "Nuestros Productos"}
        </h1>
        <p className={styles.subtitle}>
          {pageData?.descripcion ||
            "Explora nuestra variedad de productos artesanales"}
        </p>
      </section>

      {categorias.length > 0 && (
        <section className={styles.categories}>
          <div className={styles.categoryList}>
            {categorias.map((cat) => (
              <button key={cat.id} className={styles.categoryTag}>
                {cat.nombre}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className={styles.content}>
        <div className={styles.grid}>
          {productos.map((producto) => (
            <div key={producto.id} className={`${styles.card} ${getCardColor(producto.nombre)}`}>
              <div className={styles.cardImage}>
                {producto.imagen && (
                  <Image
                    src={getStrapiImageUrl(producto.imagen.url)}
                    alt={producto.imagen.alternativeText ?? producto.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
                {producto.descripcion_corta && (
                  <span className={styles.cardBadge}>
                    {producto.descripcion_corta.split('!')[0] + '!'}
                  </span>
                )}
              </div>
              
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{producto.nombre}</h3>
                
                <p className={styles.cardPrice}>
                  {formatPrice(producto.precio, producto.precio_moneda)}
                </p>
                
                <p className={styles.cardDescription}>
                  {producto.descripcion_corta || producto.descripcion_larga?.split('\n')[0]}
                </p>
                
                <div className={styles.cardFooter}>
                  <span className={styles.cardMeta}>
                    {producto.presentacion} • {producto.rinde}
                  </span>
                  
                  <Link 
                    href={`/productos/${producto.documentId}`}
                    className={styles.cardButton}
                  >
                    Añadir al carrito
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}