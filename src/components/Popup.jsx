import React from "react";
import styles from "./Popup.module.css";
import CTA from "./CTA";

export default function Popup({text, handleClick1, handleClick2, cta1, cta2}) {
  return (
    <div className={styles.fullScreen}>
      <div className={styles.popup}>
        <h3>Alert</h3>
        <p>
          {text}
        </p>
        <div>
          {cta1 && <CTA handleClick={handleClick1} title={cta1} /> }
          {cta2 && <CTA handleClick={handleClick2} title={cta2} /> }
        </div>
      </div>
    </div>
  );
}
