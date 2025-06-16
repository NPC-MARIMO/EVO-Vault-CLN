import React, { useState } from "react";
import styles from "./VaultDoor.module.css";

const VaultDoor = () => {
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.vaultDoor}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => {
        if (!isHovered) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate angle for rotation
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
        setRotation(angle);
      }}
    >
      <div
        className={styles.door}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className={styles.dial}></div>
        <div className={styles.handle}></div>
        <div className={styles.bands}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={styles.band}
              style={{ transform: `rotate(${i * 60}deg)` }}
            ></div>
          ))}
        </div>
      </div>
      <div className={styles.doorFrame}></div>
    </div>
  );
};

export default VaultDoor;
