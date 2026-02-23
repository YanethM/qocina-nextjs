"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseCarouselOptions {
  intervalMs?: number;
}

export function useCarousel(itemCount: number, options: UseCarouselOptions = {}) {
  const { intervalMs = 3500 } = options;
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (itemCount <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % itemCount);
    }, intervalMs);
  }, [itemCount, intervalMs]);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    startInterval();
  }, [startInterval]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? (current + 1) % itemCount : (current - 1 + itemCount) % itemCount);
    }
    touchStartX.current = null;
  };

  return { current, goTo, handleTouchStart, handleTouchEnd };
}
