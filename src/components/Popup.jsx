import React, { useEffect } from "react";
import styles from "./Popup.module.css";
import CTA from "./CTA";

export default function Popup({
  text,
  handleClick1,
  handleClick2,
  cta1,
  cta2,
}) {
  // Prevent background scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className={styles.fullScreen}>
      <div className={styles.popup}>
        <h3>Alert</h3>
        <p>{text}</p>
        <div>
          {cta1 && (
            <CTA handleClick={handleClick1} title={cta1} variant="primary" />
          )}
          {cta2 && (
            <CTA handleClick={handleClick2} title={cta2} variant="secondary" />
          )}
        </div>
      </div>
    </div>
  );
}
