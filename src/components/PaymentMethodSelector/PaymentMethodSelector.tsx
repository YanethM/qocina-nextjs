"use client";

import Image from "next/image";
import type { PaymentGateway } from "@/types";
import styles from "./PaymentMethodSelector.module.css";

interface Props {
  gateways: PaymentGateway[];
  value: string | null;
  onChange: (gateway: string) => void;
  disabled?: boolean;
}

export default function PaymentMethodSelector({ gateways, value, onChange, disabled }: Props) {
  if (gateways.length === 0) return null;

  return (
    <div className={styles.grid} role="radiogroup">
      {gateways.map((g) => {
        const selected = g.gateway === value;
        return (
          <button
            key={g.gateway}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(g.gateway)}
            className={`${styles.card} ${selected ? styles.cardSelected : ""}`}
          >
            {g.logoUrl ? (
              <Image src={g.logoUrl} alt={g.displayName} width={64} height={32} className={styles.logo} unoptimized />
            ) : (
              <span className={styles.name}>{g.displayName}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
