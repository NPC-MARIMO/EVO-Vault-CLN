import React from "react";
import styles from "./SecurityVerification.module.css";

const SecurityVerification = ({
  level = "high",
  lastVerified = "recently",
}) => {
  const getSecurityLevel = () => {
    switch (level.toLowerCase()) {
      case "maximum":
        return {
          width: "100%",
          color: "#00FF00",
          label: "MAXIMUM",
          icon: "🛡️",
        };
      case "high":
        return {
          width: "80%",
          color: "#7CFC00",
          label: "HIGH",
          icon: "🔒",
        };
      case "medium":
        return {
          width: "60%",
          color: "#FFD700",
          label: "MEDIUM",
          icon: "🔐",
        };
      case "low":
        return {
          width: "30%",
          color: "#FF5555",
          label: "LOW",
          icon: "⚠️",
        };
      default:
        return {
          width: "80%",
          color: "#7CFC00",
          label: "HIGH",
          icon: "🔒",
        };
    }
  };

  const security = getSecurityLevel();

  return (
    <div className={styles.securityVerification}>
      <div className={styles.verificationHeader}>
        <h3>Security Verification</h3>
        <span className={styles.lastVerified}>
          Last verified: {lastVerified}
        </span>
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
      </div>

      <div className={styles.securityLevel}>
        <span className={styles.levelIcon}>{security.icon}</span>
        <span className={styles.levelLabel}>CURRENT LEVEL:</span>
        <span className={styles.levelValue} style={{ color: security.color }}>
          {security.label}
        </span>
      </div>

      <div className={styles.securityFeatures}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}></div>
          <span>256-bit Encryption</span>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}></div>
          <span>Biometric Lock</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityVerification;
