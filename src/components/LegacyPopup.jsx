import React from "react";
import styles from "./LegacyPopup.module.css";

const LegacyPopup = ({ text, handleClick1, handleClick2, cta1, cta2 }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.legacyPopup}>
        <div className={styles.popupHeader}>
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path
              fill="#D4AF37"
              d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"
            />
          </svg>
          <h3>Legacy Vault Notification</h3>
        </div>

        <div className={styles.popupContent}>
          <p>{text}</p>
        </div>

        <div className={styles.popupActions}>
          {handleClick1 && (
            <button className={styles.popupButton} onClick={handleClick1}>
              {cta1 || "Confirm"}
            </button>
          )}
          {handleClick2 && (
            <button
              className={`${styles.popupButton} ${styles.secondaryButton}`}
              onClick={handleClick2}
            >
              {cta2 || "Cancel"}
            </button>
          )}
        </div>

        <div className={styles.securityStamp}>
          <span>SECURE CHANNEL</span>
          <div className={styles.stampLine}></div>
        </div>
      </div>
    </div>
  );
};

export default LegacyPopup;
