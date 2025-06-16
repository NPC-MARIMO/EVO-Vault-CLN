import React, { useState, useEffect } from "react";
import styles from "./GoldPriceTicker.module.css";

const GoldPriceTicker = () => {
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching real gold price data
    const fetchGoldPrice = () => {
      setIsLoading(true);
      // In a real app, you would fetch from an API like:
      // fetch('https://api.goldprice.org/v1/current')

      // Mock data for demonstration
      setTimeout(() => {
        const basePrice = 1950 + Math.random() * 100;
        const priceChange = Math.random() * 20 - 10;
        setPrice(basePrice);
        setChange(priceChange);
        setIsLoading(false);
      }, 800);
    };

    fetchGoldPrice();
    const interval = setInterval(fetchGoldPrice, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.ticker}>
      {isLoading ? (
        <div className={styles.loading}>Loading gold price...</div>
      ) : (
        <>
          <span className={styles.label}>GOLD:</span>
          <span className={styles.price}>${price.toFixed(2)}</span>
          <span
            className={`${styles.change} ${
              change >= 0 ? styles.positive : styles.negative
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(2)} (
            {((Math.abs(change) / price) * 100).toFixed(2)}%)
          </span>
        </>
      )}
    </div>
  );
};

export default GoldPriceTicker;
