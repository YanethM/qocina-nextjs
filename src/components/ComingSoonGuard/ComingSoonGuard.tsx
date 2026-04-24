"use client";

import { useState, useEffect } from "react";
import ComingSoon from "@/components/ComingSoon/ComingSoon";
import { COUNTRY_SELECTED_KEY, VALID_SITE_CODES } from "@/lib/constants";

const VALID = new Set<string>(VALID_SITE_CODES);

export default function ComingSoonGuard() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COUNTRY_SELECTED_KEY);
    if (saved && VALID.has(saved)) setShow(true);
  }, []);

  if (!show) return null;
  return <ComingSoon />;
}
