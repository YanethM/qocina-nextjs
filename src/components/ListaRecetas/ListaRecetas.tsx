"use client";

import { useState, useRef, useEffect } from "react";
import RecetaCard from "@/components/RecetaCard/RecetaCard";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getRecetas } from "@/lib/api";;
import type { Receta } from "@/types";
import styles from "./ListaRecetas.module.css";

interface ListaRecetasProps {
  recetas: Receta[];
  hideFilters?: boolean;
  labelTipoReceta?: string;
  labelRegion?: string;
  labelDieta?: string;
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
export default function ListaRecetas({ recetas, hideFilters = false, labelTipoReceta, labelRegion, labelDieta }: ListaRecetasProps) {
  const [filters, setFilters] = useState({ tipoReceta: "", cocina: "", dieta: "" });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [resultado, setResultado] = useState<Receta[]>(recetas);
  const [loading, setLoading] = useState(false);

  const hasActiveFilters = !!(filters.tipoReceta || filters.cocina || filters.dieta);

  const applyFilter = (next: { tipoReceta: string; cocina: string; dieta: string }) => {
    setFilters(next);
    setVisible(PAGE_SIZE);
    if (!next.tipoReceta && !next.cocina && !next.dieta) {
      setResultado(recetas);
      return;
    }
    setLoading(true);
    getRecetas(undefined, {
      tipo_receta: next.tipoReceta || undefined,
      cocina_region: next.cocina || undefined,
      tipo_dieta: next.dieta || undefined,
    })
      .then((res) => setResultado(res.data ?? []))
      .catch(() => setResultado([]))
      .finally(() => setLoading(false));
  };

  const clearFilters = () => applyFilter({ tipoReceta: "", cocina: "", dieta: "" });

  const shown = resultado.slice(0, visible);
  const hasMore = visible < resultado.length;

  return (
    <section className={styles.section}>
      {hideFilters ? (
        <h2 className={styles.tituloSimple}>Recetas</h2>
      ) : (
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
              label={labelTipoReceta ?? "Tipo de Receta"}
              options={TIPOS_RECETA}
              value={filters.tipoReceta}
              onChange={(v) => applyFilter({ ...filters, tipoReceta: v })}
            />
            <Dropdown
              label={labelRegion ?? "Cocina por Región"}
              options={COCINA_REGION}
              value={filters.cocina}
              onChange={(v) => applyFilter({ ...filters, cocina: v })}
            />
            <Dropdown
              label={labelDieta ?? "Tipo de dieta"}
              options={TIPOS_DIETA}
              value={filters.dieta}
              onChange={(v) => applyFilter({ ...filters, dieta: v })}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Buscando recetas...</p>
        </div>
      ) : shown.length > 0 ? (
        <div className={styles.grid} data-count={shown.length}>
          {shown.map((receta) => {
            const imgUrl = receta.imagen_principal
              ? getStrapiImageUrl(receta.imagen_principal.url)
              : null;
            return (
              <RecetaCard
                key={receta.id}
                href={`/recetas/${receta.slug}`}
                titulo={receta.titulo}
                descripcion={receta.descripcion_corta ?? receta.descripcion}
                imagenUrl={imgUrl}
                imagenAlt={receta.imagen_principal?.alternativeText ?? receta.titulo}
              />
            );
          })}
        </div>
      ) : hasActiveFilters ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍽️</div>
          <h3 className={styles.emptyTitle}>No encontramos recetas</h3>
          <p className={styles.emptySubtitle}>No hay recetas que coincidan con los filtros seleccionados.</p>
          <button className={styles.emptyBtn} onClick={clearFilters}>
            Ver todas las recetas
          </button>
        </div>
      ) : null}

      {!loading && hasMore && (
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