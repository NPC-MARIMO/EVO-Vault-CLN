import React from "react";
import styles from "./CTA.module.css";

export default function CTA({
  title,
  handleClick,
  variant = "primary",
  disabled = false,
  loading = false,
}) {
  // Determine which class variants to apply
  const variantClass =
    variant === "secondary"
      ? styles.secondary
      : variant === "danger"
      ? styles.danger
      : "";

  const disabledClass = disabled ? styles.disabled : "";
  const loadingClass = loading ? styles.loading : "";

  return (
    <div
      className={`${styles.cta} ${variantClass} ${disabledClass} ${loadingClass}`}
    >
      <button onClick={handleClick} disabled={disabled || loading}>
        {title}
      </button>
    </div>
  );
}
