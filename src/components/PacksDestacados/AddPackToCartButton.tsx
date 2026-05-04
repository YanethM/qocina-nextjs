"use client";

import { useCart } from "@/context/CartContext";

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
  className,
}: Props) {
  const { addItem } = useCart();

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
        })
      }>
      Añadir al carrito
    </button>
  );
}
