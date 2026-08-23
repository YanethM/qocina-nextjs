"use client";

import { useState } from "react";
import BasesCulinarias from "@/components/BasesCulinarias/BasesCulinarias";
import ListaRecetas from "@/components/ListaRecetas/ListaRecetas";
import type { Receta } from "@/types";

type BaseId = "verde" | "amarilla" | "roja";

const BASE_TO_COLOR_CARD: Record<BaseId, string> = {
  verde: "verde",
  amarilla: "amarillo",
  roja: "rojo",
};

interface BaseCulinariaImagenApi {
  desktopDefault?: string | null;
  desktopDetalle?: string | null;
  desktopResumen?: string | null;
  mobileDefault?: string | null;
  mobileDetalle?: string | null;
}

interface RecetasFiltroPorBaseProps {
  imagenesApi?: Partial<Record<BaseId, BaseCulinariaImagenApi>>;
  recetas: Receta[];
  titulo?: string;
  subtitulo?: string;
  labelTipoReceta?: string;
  labelRegion?: string;
  labelDieta?: string;
  tiposRecetaOptions?: string[];
  cocinaRegionOptions?: string[];
  tiposDietaOptions?: string[];
  ctaCargarMas?: string;
  locale?: string;
  siteCode?: string;
}

export default function RecetasFiltroPorBase({
  imagenesApi,
  recetas,
  ...listaRecetasProps
}: RecetasFiltroPorBaseProps) {
  const [activeBase, setActiveBase] = useState<BaseId | null>(null);
  const colorCardFilter = activeBase ? BASE_TO_COLOR_CARD[activeBase] : null;

  return (
    <>
      <BasesCulinarias
        imagenesApi={imagenesApi}
        activeId={activeBase}
        onActiveChange={(id) => setActiveBase(id as BaseId | null)}
      />
      {recetas.length > 0 && (
        <ListaRecetas
          {...listaRecetasProps}
          recetas={recetas}
          colorCardFilter={colorCardFilter}
          onClearColorCardFilter={() => setActiveBase(null)}
        />
      )}
    </>
  );
}
