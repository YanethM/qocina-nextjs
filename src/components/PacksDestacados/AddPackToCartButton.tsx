"use client";

import { useCart } from "@/context/CartContext";
import { useLocale } from "@/hooks/useLocale";

const translations = {
  es: { addToCart: "Añadir al carrito" },
  en: { addToCart: "Add to cart" },
};

interface Props {
  id: number;
  documentId: string;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioMoneda: string;
  imagen: string | null;
  sku: string | null;
  color?: string | null;
  className?: string;
}

export default function AddPackToCartButton({
  id,
  documentId,
  slug,
  nombre,
  descripcion,
  precio,
  precioMoneda,
  imagen,
  sku,
  color,
  className,
}: Props) {
  const { addItem } = useCart();
  const locale = useLocale();
  const t = translations[locale];

  return (
    <button
      className={className}
      onClick={() =>
        addItem({
          id,
          documentId,
          slug,
          nombre,
          descripcionCorta: descripcion,
          precio,
          precioMoneda,
          imagen,
          sku: sku ?? null,
          categoria: null,
          color: color ?? null,
        })
      }>
      {t.addToCart}
    </button>
  );
}
