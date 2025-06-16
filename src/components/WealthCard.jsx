import React from "react";
import styles from "./WealthCard.module.css";

const WealthCard = ({
  title,
  value,
  unit = "",
  trend,
  icon,
  alert = false,
  progress,
  onClickView,
  onClickAction,
}) => {
  const getIcon = () => {
    switch (icon) {
      case "family":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#D4AF37"
              d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"
            />
          </svg>
        );
      case "request":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#D4AF37"
              d="M10,21H14A2,2 0 0,1 12,23A2,2 0 0,1 10,21M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M17,11A5,5 0 0,0 12,6A5,5 0 0,0 7,11V18H17V11M9,13V15H11V13H9M13,13V15H15V13H13Z"
            />
          </svg>
        );
      case "wealth":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#D4AF37"
              d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z"
            />
          </svg>
        );
      case "gold":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#D4AF37"
              d="M22.1,21.5L2.4,1.7L1.1,3L6.1,8C5.1,10.3 4.5,12.8 4.5,14.5C4.5,18.6 7.9,22 12,22C14.2,22 16.2,21 17.6,19.5L20.8,22.7L22.1,21.5M8.3,13.5C8.3,12.3 8.7,11.1 9.2,10L13.9,14.5C14,15.4 13.4,16.5 12,16.5C10.1,16.5 8.3,15.3 8.3,13.5M12,20C8.7,20 6,17.3 6,14C6,12.8 6.4,11.6 7.2,10.5L9.7,13C9.5,13.6 9.5,14.3 9.5,14.5C9.5,16.4 10.6,18.5 12,18.5C12.9,18.5 13.5,17.9 13.5,17C13.5,16.8 13.4,16.5 13.4,16.5L16.4,19.5C15.3,19.9 13.8,20 12,20M10.5,5.3L9,3.8C10.4,3.3 11.2,3 12,3C16.4,3 20,6.7 20,11.5C20,12.9 19.7,14.2 19.2,15.4L17.7,13.9C17.9,13.3 18,12.7 18,11.5C18,8.2 15.3,5.5 12,5.5C11.5,5.5 10.9,5.4 10.5,5.3M12,8C13.4,8 14.5,9.2 14.5,10.7C14.5,11.4 14.2,12 13.7,12.4L15.3,14C16.3,13.1 17,11.9 17,10.7C17,8.3 14.9,6.5 12,6.5C10.6,6.5 9.3,7.1 8.4,8L10.1,9.7C10.4,8.9 11.1,8 12,8Z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.wealthCard} ${alert ? styles.alert : ""}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>{getIcon()}</div>
        <h3>{title}</h3>
        {trend && (
          <span
            className={`${styles.trend} ${
              trend === "New" || trend === "Excellent" ? styles.positive : ""
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className={styles.cardValue}>
        {value}
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>

      {progress && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <div className={styles.cardActions}>
        {onClickView && (
          <button className={styles.viewButton} onClick={onClickView}>
            View Details
          </button>
        )}
        {onClickAction && (
          <button className={styles.actionButton} onClick={onClickAction}>
            Take Action
          </button>
        )}
      </div>

      {alert && <div className={styles.alertPulse}></div>}
    </div>
  );
};

export default WealthCard;
