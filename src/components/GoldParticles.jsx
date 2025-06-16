import React, { useEffect } from "react";
import styles from "./GoldParticles.module.css";

const GoldParticles = () => {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = styles.particle;

      // Random properties
      const size = Math.random() * 6 + 2;
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
      const opacity = Math.random() * 0.6 + 0.1;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.opacity = opacity;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;

      document.getElementById("particles-container").appendChild(particle);

      // Remove particle after animation completes
      setTimeout(() => {
        particle.remove();
        createParticle(); // Replace with new particle
      }, duration * 1000);
    };

    // Create initial particles
    const particleCount = window.innerWidth / 10;
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }

    // Handle window resize
    const handleResize = () => {
      const container = document.getElementById("particles-container");
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      const newParticleCount = window.innerWidth / 10;
      for (let i = 0; i < newParticleCount; i++) {
        createParticle();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div id="particles-container" className={styles.container}></div>;
};

export default GoldParticles;
