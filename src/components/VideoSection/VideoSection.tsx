"use client";

import { useState } from "react";
import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getYouTubeId } from "@/lib/youtube";
import type { StrapiImage } from "@/types";
import styles from "./VideoSection.module.css";

interface VideoSectionProps {
  titulo?: string;
  descripcion?: string;
  videoUrl: string;
  cover: StrapiImage;
}

export default function VideoSection({
  titulo,
  descripcion,
  videoUrl,
  cover,
}: VideoSectionProps) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) return null;

  return (
    <section className={styles.section}>
      {titulo && <h2 className={styles.titulo}>{titulo}</h2>}
      {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
      <div className={styles.videoWrapper}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={titulo || "Video"}
            className={styles.iframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className={styles.playButton}
            aria-label="Reproducir video"
            onClick={() => setPlaying(true)}>
            <Image
              src={getStrapiImageUrl(cover.url)}
              alt={cover.alternativeText || titulo || "Video"}
              fill
              sizes="(max-width: 768px) 100vw, 960px"
              className={styles.coverImage}
            />
            <span className={styles.playIcon} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
