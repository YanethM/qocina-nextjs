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

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
}
