import React from "react";
import styles from "./SecurityStatus.module.css";

const SecurityStatus = ({ level = "High", lastScan = "Just now" }) => {
  const getSecurityLevel = () => {
    switch (level.toLowerCase()) {
      case "maximum":
        return { width: "100%", color: "#00FF00", label: "MAXIMUM" };
      case "high":
        return { width: "80%", color: "#7CFC00", label: "HIGH" };
      case "medium":
        return { width: "60%", color: "#FFD700", label: "MEDIUM" };
      case "low":
        return { width: "30%", color: "#FF5555", label: "LOW" };
      default:
        return { width: "80%", color: "#7CFC00", label: "HIGH" };
    }
  };

  const security = getSecurityLevel();

  return (
    <div className={styles.securityStatus}>
      <div className={styles.statusHeader}>
        <h3>VAULT SECURITY</h3>
        <span className={styles.lastScan}>Last scan: {lastScan}</span>
      </div>

      <div className={styles.securityMeter}>
        <div
          className={styles.meterFill}
          style={{
            width: security.width,
            background: security.color,
            boxShadow: `0 0 10px ${security.color}`,
          }}
        ></div>
        <div className={styles.meterNotches}>
          {[0, 25, 50, 75, 100].map((pos) => (
            <div
              key={pos}
              className={styles.notch}
              style={{ left: `${pos}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div className={styles.securityLevel}>
        <span className={styles.levelLabel}>CURRENT LEVEL:</span>
        <span className={styles.levelValue} style={{ color: security.color }}>
          {security.label}
        </span>
      </div>

      <div className={styles.securityFeatures}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}></div>
          <span>Quantum Encryption</span>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}></div>
          <span>Biometric Locks</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityStatus;
