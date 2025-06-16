import React, { useState, useEffect } from "react";
import styles from "./HeritageClock.module.css";

const HeritageClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  return (
    <div className={styles.heritageClock}>
      <div className={styles.clockFace}>
        {/* Clock markers */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={styles.clockMarker}
            style={{ transform: `rotate(${i * 30}deg)` }}
          ></div>
        ))}

        {/* Clock hands */}
        <div
          className={styles.hourHand}
          style={{ transform: `rotate(${hours * 30 + minutes * 0.5}deg)` }}
        ></div>
        <div
          className={styles.minuteHand}
          style={{ transform: `rotate(${minutes * 6}deg)` }}
        ></div>
        <div
          className={styles.secondHand}
          style={{ transform: `rotate(${seconds * 6}deg)` }}
        ></div>

        {/* Center cap */}
        <div className={styles.centerCap}></div>
      </div>

      <div className={styles.clockBranding}>
        <span>PERPETUAL</span>
        <span>HERITAGE</span>
      </div>
    </div>
  );
};

export default HeritageClock;
