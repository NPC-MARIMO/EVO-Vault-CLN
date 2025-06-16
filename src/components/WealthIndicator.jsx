import React from "react";
import styles from "./WealthIndicator.module.css";

const WealthIndicator = ({ value }) => {
  // Convert value to a scale of 0-5 diamonds
  const diamondCount = Math.min(5, Math.max(0, Math.floor(value / 20)));

  return (
    <div className={styles.wealthIndicator}>
      <div className={styles.indicatorLabel}>Generational Wealth</div>
      <div className={styles.diamondRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`${styles.diamond} ${
              i < diamondCount ? styles.filled : ""
            }`}
          >
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2L17.5,11H6.5L12,2M12,22L6.5,13H17.5L12,22M2.5,7.5L7.5,9.5L4.3,6.3L2.5,7.5M19.5,7.5L16.7,6.3L13.5,9.5L19.5,7.5M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5Z"
              />
            </svg>
          </div>
        ))}
      </div>
      <div className={styles.wealthValue}>${value.toLocaleString()}</div>
    </div>
  );
};

export default WealthIndicator;
