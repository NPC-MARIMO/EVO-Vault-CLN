import React, { useState, useEffect } from "react";
import styles from "./SecurityMeter.module.css";

const SecurityMeter = ({ level = 85 }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    // Animate the level when component mounts or level changes
    let start = 0;
    const end = level;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      setAnimatedLevel(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // Generate random threats
    const possibleThreats = [
      "Brute Force Attempt",
      "Phishing Alert",
      "Location Anomaly",
      "Device Mismatch",
      "Network Vulnerability",
      "Suspicious Login",
    ];

    const activeThreats = [];
    if (level < 90) activeThreats.push(possibleThreats[0]);
    if (level < 80) activeThreats.push(possibleThreats[1]);
    if (level < 70) activeThreats.push(possibleThreats[3]);

    setThreats(activeThreats);
  }, [level]);

  const getStatusColor = () => {
    if (level >= 85) return "#2ECC71"; // Green
    if (level >= 70) return "#F39C12"; // Orange
    return "#E74C3C"; // Red
  };

  const getStatusText = () => {
    if (level >= 85) return "Secure";
    if (level >= 70) return "Vulnerable";
    return "Compromised";
  };

  return (
    <div className={styles.meterContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>VAULT SECURITY STATUS</h3>
        <div className={styles.status} style={{ color: getStatusColor() }}>
          {getStatusText()}
        </div>
      </div>

      <div className={styles.meter}>
        <div
          className={styles.level}
          style={{
            width: `${animatedLevel}%`,
            background: getStatusColor(),
            boxShadow: `0 0 15px ${getStatusColor()}`,
          }}
        ></div>
        <div className={styles.levelText}>{animatedLevel}%</div>
      </div>

      {threats.length > 0 && (
        <div className={styles.threats}>
          <div className={styles.threatsTitle}>ACTIVE THREATS:</div>
          <ul className={styles.threatList}>
            {threats.map((threat, index) => (
              <li key={index} className={styles.threatItem}>
                <span className={styles.threatIcon}>⚠️</span>
                {threat}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SecurityMeter;
