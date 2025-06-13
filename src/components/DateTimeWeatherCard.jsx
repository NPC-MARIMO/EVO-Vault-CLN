import React, { useEffect, useState } from 'react';
import styles from './DateTimeWeatherCard.module.css';

const DateTimeWeatherCard = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: '--', condition: 'Loading...', icon: '☀️' });

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);

    // Simulated Weather API
    setTimeout(() => {
      setWeather({ temp: '32°C', condition: 'Sunny', icon: '☀️' });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.datetime}>
        <div className={styles.time}>{dateTime.toLocaleTimeString()}</div>
        <div className={styles.date}>{dateTime.toLocaleDateString()}</div>
      </div>
      <div className={styles.weather}>
        <span className={styles.icon}>{weather.icon}</span>
        <div>
          <div className={styles.temp}>{weather.temp}</div>
          <div className={styles.condition}>{weather.condition}</div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeWeatherCard;
