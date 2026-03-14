import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "yellow";
  type?: "button" | "submit" | "reset";
  className?: string;
}

const VARIANT_BTN: Record<string, string> = {
  secondary: "dark",
  yellow: "yellow",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;
  const datBtn = VARIANT_BTN[variant] ?? "dark";

  if (href) {
    return (
      <Link href={href} className={buttonClass} data-btn={datBtn}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={buttonClass} data-btn={datBtn}>
      {children}
    </button>
  );
}
