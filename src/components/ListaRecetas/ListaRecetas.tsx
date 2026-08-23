"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import RecetaCard from "@/components/RecetaCard/RecetaCard";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getRecetas } from "@/lib/api";
import { useSiteCode } from "@/hooks/useSiteCode";
import type { Receta } from "@/types";
import styles from "./ListaRecetas.module.css";

interface ListaRecetasProps {
  recetas: Receta[];
  hideFilters?: boolean;
  titulo?: string;
  subtitulo?: string;
  labelTipoReceta?: string;
  labelRegion?: string;
  labelDieta?: string;
  tiposRecetaOptions?: string[];
  cocinaRegionOptions?: string[];
  tiposDietaOptions?: string[];
  ctaCargarMas?: string;
  ctaVerTodas?: string;
  locale?: string;
  siteCode?: string;
  colorCardFilter?: string | null;
  onClearColorCardFilter?: () => void;
}

function distinctValues(recetas: Receta[], field: "tipo_receta" | "cocina_region" | "tipo_dieta") {
  return Array.from(new Set(recetas.map((r) => r[field]).filter((v): v is string => Boolean(v))));
}

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
export default function ListaRecetas({
  recetas,
  hideFilters = false,
  titulo = "Recetas fáciles, rápidas y sanas",
  subtitulo = "Descubre preparaciones latinas con ese sabor casero y un toque extra que despierta recuerdos y conecta al primer bocado.",
  labelTipoReceta,
  labelRegion,
  labelDieta,
  tiposRecetaOptions,
  cocinaRegionOptions,
  tiposDietaOptions,
  ctaCargarMas,
  ctaVerTodas = "Ver todas las recetas",
  locale,
  siteCode,
  colorCardFilter,
  onClearColorCardFilter,
}: ListaRecetasProps) {
  const urlSiteCode = useSiteCode();
  const sc = siteCode ?? urlSiteCode;
  const isEnglish = locale === "en";
  const tiposReceta = useMemo(
    () => tiposRecetaOptions ?? distinctValues(recetas, "tipo_receta"),
    [recetas, tiposRecetaOptions],
  );
  const cocinaRegion = useMemo(
    () => cocinaRegionOptions ?? distinctValues(recetas, "cocina_region"),
    [recetas, cocinaRegionOptions],
  );
  const tiposDieta = useMemo(
    () => tiposDietaOptions ?? distinctValues(recetas, "tipo_dieta"),
    [recetas, tiposDietaOptions],
  );
  const [filters, setFilters] = useState({ tipoReceta: "", cocina: "", dieta: "" });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [resultadoFiltrado, setResultadoFiltrado] = useState<Receta[] | null>(null);
  const [loading, setLoading] = useState(false);
  const showFilters = !hideFilters && Boolean(labelTipoReceta || labelRegion || labelDieta);

  const hasDropdownFilters = !!(filters.tipoReceta || filters.cocina || filters.dieta);
  const hasActiveFilters = hasDropdownFilters || !!colorCardFilter;
  const baseResultado = hasDropdownFilters ? (resultadoFiltrado ?? []) : recetas;
  const resultado = colorCardFilter
    ? baseResultado.filter((r) => r.color_card === colorCardFilter)
    : baseResultado;

  const applyFilter = (next: { tipoReceta: string; cocina: string; dieta: string }) => {
    setFilters(next);
    setVisible(PAGE_SIZE);
    if (!next.tipoReceta && !next.cocina && !next.dieta) {
      setResultadoFiltrado(null);
      return;
    }
    setLoading(true);
    getRecetas(locale, {
      tipo_receta: next.tipoReceta || undefined,
      cocina_region: next.cocina || undefined,
      tipo_dieta: next.dieta || undefined,
    }, siteCode)
      .then((res) => setResultadoFiltrado(res.data ?? []))
      .catch(() => setResultadoFiltrado([]))
      .finally(() => setLoading(false));
  };

  const clearFilters = () => {
    applyFilter({ tipoReceta: "", cocina: "", dieta: "" });
    onClearColorCardFilter?.();
  };

  const [prevColorCardFilter, setPrevColorCardFilter] = useState(colorCardFilter);
  if (colorCardFilter !== prevColorCardFilter) {
    setPrevColorCardFilter(colorCardFilter);
    setVisible(PAGE_SIZE);
  }

  const shown = resultado.slice(0, visible);
  const hasMore = visible < resultado.length;

  return (
    <section className={styles.section}>
      {hideFilters ? (
        <h2 className={styles.tituloSimple}>Recetas</h2>
      ) : (
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>{titulo}</h2>
            <p className={styles.subtitle}>{subtitulo}</p>
          </div>

          {showFilters && (
            <div className={styles.filters}>
              {tiposReceta.length > 0 && (
                <Dropdown
                  label={labelTipoReceta ?? (isEnglish ? "Type of Recipe" : "Tipo de Receta")}
                  options={tiposReceta}
                  value={filters.tipoReceta}
                  onChange={(v) => applyFilter({ ...filters, tipoReceta: v })}
                />
              )}
              {cocinaRegion.length > 0 && (
                <Dropdown
                  label={labelRegion ?? (isEnglish ? "Cuisine by Region" : "Cocina por Región")}
                  options={cocinaRegion}
                  value={filters.cocina}
                  onChange={(v) => applyFilter({ ...filters, cocina: v })}
                />
              )}
              {tiposDieta.length > 0 && (
                <Dropdown
                  label={labelDieta ?? (isEnglish ? "Diet Type" : "Tipo de dieta")}
                  options={tiposDieta}
                  value={filters.dieta}
                  onChange={(v) => applyFilter({ ...filters, dieta: v })}
                />
              )}
            </div>
          )}
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
                href={`/${sc}/recetas/${receta.slug}`}
                titulo={receta.titulo}
                descripcion={receta.descripcion_corta ?? receta.descripcion}
                imagenUrl={imgUrl}
                imagenAlt={receta.imagen_principal?.alternativeText ?? receta.titulo}
                colorCard={receta.color_card}
                ctaText={ctaCargarMas}
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
            {ctaVerTodas}
          </button>
        </div>
      ) : null}

      {!loading && hasMore && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            {ctaCargarMas ?? "Cargar más recetas"}
          </button>
        </div>
      )}
    </section>
  );
}
