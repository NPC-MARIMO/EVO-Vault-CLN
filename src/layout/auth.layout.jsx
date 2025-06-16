// AuthLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./authlayout.module.css";

export default function AuthLayout() {
  const [goldPrice, setGoldPrice] = useState("$2,034.28");
  const [wealthScore, setWealthScore] = useState(72);
  const [time, setTime] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const priceInterval = setInterval(() => {
      const fluctuation = (Math.random() * 20 - 10).toFixed(2);
      const newPrice = (2034.28 + parseFloat(fluctuation)).toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );
      setGoldPrice(
        `${newPrice} ${fluctuation >= 0 ? "▲" : "▼"}${Math.abs(fluctuation)}%`
      );
    }, 5000);

    const scoreInterval = setInterval(() => {
      setWealthScore((prev) =>
        Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2)))
      );
    }, 3000);

    const clockInterval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(scoreInterval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div className={styles.auth}>
      {/* Diamond Particle Background */}
      <div className={styles.diamondParticles}></div>

      {/* Left Panel - Vault Experience */}
      <div className={styles.left}>
        {/* Interactive 3D Vault Door */}
        <div className={styles.vaultDoor}>
          <div className={styles.vaultWheel}></div>
          <div className={styles.vaultHandle}></div>
          <div className={styles.vaultRivets}>
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className={styles.rivet}
                style={{
                  transform: `rotate(${i * 10}deg) translateX(180px) rotate(${
                    i * -10
                  }deg)`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Heritage Clock */}
        <div className={styles.heritageClock}>
          <div className={styles.clockFace}>
            <div
              className={styles.clockHand}
              style={{
                transform: `rotate(${
                  time.getHours() * 30 + time.getMinutes() * 0.5
                }deg)`,
              }}
            ></div>
            <div
              className={styles.clockHand}
              style={{
                transform: `rotate(${time.getMinutes() * 6}deg)`,
                height: "40%",
              }}
            ></div>
            <div
              className={styles.clockHand}
              style={{
                transform: `rotate(${time.getSeconds() * 6}deg)`,
                height: "45%",
                width: "1px",
              }}
            ></div>
          </div>
          <div className={styles.clockBranding}>
            <span>EST. 2023</span>
            <span>PERPETUITY</span>
          </div>
        </div>

        <h1>
          <span className={styles.titleMain}>LEGACY</span>
          <span className={styles.titleSub}>ESTATE VAULT</span>
        </h1>

        <h2 data-text="Fortifying Generations of Wealth">
          Fortifying Generations of Wealth
        </h2>

        <p className={styles.tagline}>
          <span className={styles.taglineHighlight}>Multi-generational</span>{" "}
          asset protection with
          <span className={styles.taglineHighlight}> quantum-grade</span>{" "}
          security
        </p>

        {/* Premium Features Dashboard */}
        <div className={styles.premiumFeatures}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}></div>
            <div className={styles.featureContent}>
              <h3>Family Office Portal</h3>
              <p>Unified control center for all family assets</p>
            </div>
          </div>

          <div className={styles.wealthMetrics}>
            <div className={styles.goldTicker}>
              <div className={styles.commodityIcon}></div>
              <div className={styles.commodityInfo}>
                <span>24K GOLD</span>
                <span>{goldPrice}</span>
              </div>
            </div>

            <div className={styles.wealthScore}>
              <div className={styles.scoreHeader}>
                <span>Generational Wealth Index</span>
                <span className={styles.scoreValue}>
                  {wealthScore.toFixed(0)}/100
                </span>
              </div>
              <div className={styles.scoreMeter}>
                <div style={{ width: `${wealthScore}%` }}></div>
                <div className={styles.scoreNotches}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className={styles.notch}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication */}
      <div className={styles.right}>
        <div className={styles.authContainer}>
          <div className={styles.authHeader}>
            <div className={styles.securityBadge}>
              <span>NSA-GRADE ENCRYPTION</span>
              <div className={styles.secureConnection}>
                <div className={styles.securePulse}></div>
                <span>SECURE CHANNEL ACTIVE</span>
              </div>
            </div>
          </div>

          <Outlet />
        </div>
      </div>

      {/* Animated Elements */}
      <div className={styles.goldParticles}></div>
      <div className={styles.laserGrid}></div>
      <div className={styles.securityBeam}></div>
    </div>
  );
}
