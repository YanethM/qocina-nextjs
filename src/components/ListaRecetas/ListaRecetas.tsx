"use client";

import { useState, useRef, useEffect } from "react";
import RecetaCard from "@/components/RecetaCard/RecetaCard";
import { getStrapiImageUrl } from "@/lib/api";
import type { Receta } from "@/types";
import styles from "./ListaRecetas.module.css";

interface ListaRecetasProps {
  recetas: Receta[];
}

/* ── Filter options ── */
const TIPOS_RECETA = ["Piqueos", "Sopas y caldos", "Entradas", "Platos de fondo"];
const COCINA_REGION = ["Perú", "Fusión latinoamericana", "Fusión USA", "Fusión Europea"];
const TIPOS_DIETA = ["Vegana", "Vegetariana"];

const PAGE_SIZE = 6;

/* ── Dropdown ── */
function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        className={`${styles.dropdownTrigger} ${open ? styles.open : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value || label}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronUp : ""}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className={styles.dropdownMenu} role="listbox">
          {value && (
            <li
              className={`${styles.dropdownItem} ${styles.clearItem}`}
              onClick={() => { onChange(""); setOpen(false); }}
            >
              Todos
            </li>
          )}
          {options.map((opt) => (
            <li
              key={opt}
              className={`${styles.dropdownItem} ${value === opt ? styles.active : ""}`}
              role="option"
              aria-selected={value === opt}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function ListaRecetas({ recetas }: ListaRecetasProps) {
  const [tipoReceta, setTipoReceta] = useState("");
  const [cocina, setCocina] = useState("");
  const [dieta, setDieta] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = recetas.filter((r) => {
    if (tipoReceta && r.tipo_receta !== tipoReceta) return false;
    if (cocina && r.cocina_region !== cocina) return false;
    if (dieta && r.tipo_dieta !== dieta) return false;
    return true;
  });

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const handleFilterChange = () => setVisible(PAGE_SIZE);

  return (
    <section className={styles.section}>
      {/* Header row */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>
            Recetas fáciles,<br />rápidas y sanas
          </h2>
          <p className={styles.subtitle}>
            Descubre preparaciones latinas con ese sabor casero y un toque extra
            que despierta recuerdos y conecta al primer bocado.
          </p>
        </div>

        <div className={styles.filters}>
          <Dropdown
            label="Tipo de Receta"
            options={TIPOS_RECETA}
            value={tipoReceta}
            onChange={(v) => { setTipoReceta(v); handleFilterChange(); }}
          />
          <Dropdown
            label="Cocina por Región"
            options={COCINA_REGION}
            value={cocina}
            onChange={(v) => { setCocina(v); handleFilterChange(); }}
          />
          <Dropdown
            label="Tipo de dieta"
            options={TIPOS_DIETA}
            value={dieta}
            onChange={(v) => { setDieta(v); handleFilterChange(); }}
          />
        </div>
      </div>

      {/* Grid */}
      {shown.length > 0 ? (
        <div className={styles.grid}>
          {shown.map((receta) => {
            const imgUrl = receta.imagen_principal
              ? getStrapiImageUrl(receta.imagen_principal.url)
              : null;
            return (
              <RecetaCard
                key={receta.id}
                href={`/recetas/${receta.documentId}`}
                titulo={receta.titulo}
                descripcion={receta.descripcion_corta}
                imagenUrl={imgUrl}
                imagenAlt={receta.imagen_principal?.alternativeText ?? receta.titulo}
              />
            );
          })}
        </div>
      ) : (
        <p className={styles.empty}>No encontramos recetas con estos filtros.</p>
      )}

      {/* Load more */}
      {hasMore && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Cargar más recetas
          </button>
        </div>
      )}
    </section>
  );
}