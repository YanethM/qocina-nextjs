"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Premio } from "@/types";
import { getStrapiImageUrl } from "@/lib/api";
import styles from "./PremiosCarousel.module.css";

interface PremiosCarouselProps {
  titulo?: string | null;
  premios: Premio[];
}

const AUTO_PLAY_INTERVAL = 4000;
const DESCRIPCION_LIMIT = 150;

function PremioModal({ premio, imgSrc, onClose }: {
  premio: Premio;
  imgSrc: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">✕</button>

        {imgSrc && (
          <div className={styles.modalImageWrapper}>
            <Image
              src={imgSrc}
              alt={premio?.imagen_premio?.alternativeText ?? premio?.nombre ?? "Premio"}
              fill
              style={{ objectFit: "contain" }}
              unoptimized
            />
          </div>
        )}

        {premio?.nombre && (
          <p className={styles.modalNombre}>
            {premio.nombre}
            {premio.anio && (
              <span style={{ fontWeight: 400 }}> ({premio.anio})</span>
            )}
          </p>
        )}

        {premio?.descripcion && (
          <p className={styles.modalDescripcion}>{premio.descripcion}</p>
        )}
      </div>
    </div>,
    document.body
  );
}

export default function PremiosCarousel({ titulo, premios }: PremiosCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const isHovered = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sorted = [...premios].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const total = sorted.length;
  const premio = sorted[current];

  const imgSrc = premio?.imagen_premio?.formats?.large?.url
    ? getStrapiImageUrl(premio.imagen_premio.formats.large.url)
    : premio?.imagen_premio?.url
    ? getStrapiImageUrl(premio.imagen_premio.url)
    : null;

  const descripcion = premio?.descripcion ?? "";
  const isLong = descripcion.length > DESCRIPCION_LIMIT;

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  const startAutoPlay = useCallback(() => {
    if (total <= 1) return;
    intervalRef.current = setInterval(() => {
      if (!isHovered.current) goNext();
    }, AUTO_PLAY_INTERVAL);
  }, [goNext, total]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopAutoPlay();
      if (diff > 0) goNext();
      else goPrev();
      startAutoPlay();
    }
    touchStartX.current = null;
  };

  const handleDeslizaClick = () => {
    stopAutoPlay();
    goNext();
    startAutoPlay();
  };

  if (total === 0) return null;

  const dotsEl = total > 1 && (
    <div className={styles.dotsRow}>
      {sorted.map((_, i) => (
        <button
          key={i}
          className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
          onClick={() => { stopAutoPlay(); setCurrent(i); startAutoPlay(); }}
          aria-label={`Premio ${i + 1}`}
        />
      ))}
    </div>
  );

  return (
    <>
      <div
        className={styles.wrapper}
        onMouseEnter={() => { isHovered.current = true; }}
        onMouseLeave={() => { isHovered.current = false; }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src="/images/web/nosotros/premios.svg"
          alt={titulo ?? "Premios"}
          width={1440}
          height={600}
          className={styles.premiosImg}
          style={{ width: "100%", height: "auto", display: "block" }}
          unoptimized
        />

        <div className={styles.overlay}>
          <div className={styles.grid}>
            <div className={styles.col1}>
              {titulo && <p className={styles.seccionTitulo}>{titulo}</p>}
              <div className={styles.dotsDesktop}>{dotsEl}</div>
            </div>

            <div className={styles.col2}>
              {imgSrc && (
                <div className={styles.imageWrapper}>
                  <Image
                    src={imgSrc}
                    alt={premio?.imagen_premio?.alternativeText ?? premio?.nombre ?? "Premio"}
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>
              )}
              {premio?.nombre && (
                <p className={styles.premioNombre}>
                  {premio.nombre}
                  {premio.anio && (
                    <span style={{ fontWeight: 400 }}> ({premio.anio})</span>
                  )}
                </p>
              )}
            </div>

            <div className={styles.col3}>
              {descripcion && (
                <>
                  <p className={styles.premioDescripcion}>{descripcion}</p>
                  {isLong && (
                    <button
                      className={styles.verMas}
                      onClick={() => setModalOpen(true)}
                    >
                      Ver más
                    </button>
                  )}
                </>
              )}
              {total > 1 && (
                <button className={styles.deslizaRow} onClick={handleDeslizaClick} aria-label="Siguiente premio">
                  <p className={styles.desliza}>DESLIZA</p>
                  <Image
                    src="/images/web/nosotros/desliza_arrow.svg"
                    alt=""
                    width={201}
                    height={41}
                    style={{ width: "auto", height: "41px" }}
                    unoptimized
                  />
                </button>
              )}
            </div>

            <div className={styles.dotsMobile}>{dotsEl}</div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <PremioModal
          premio={premio}
          imgSrc={imgSrc}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
