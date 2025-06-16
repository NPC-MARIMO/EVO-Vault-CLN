import React from "react";
import styles from "./HeritageBadge.module.css";

const HeritageBadge = ({ tier = "silver" }) => {
  const getTierColor = () => {
    switch (tier) {
      case "gold":
        return {
          background: "linear-gradient(135deg, #D4AF37 0%, #F5D680 100%)",
          text: "#000",
        };
      case "platinum":
        return {
          background: "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)",
          text: "#000",
        };
      default: // silver
        return {
          background: "linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)",
          text: "#000",
        };
    }
  };

  const tierColor = getTierColor();

  return (
    <div
      className={styles.heritageBadge}
      style={{
        background: tierColor.background,
        color: tierColor.text,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"
        />
      </svg>
      <span>{tier.toUpperCase()}</span>
    </div>
  );
};

export default HeritageBadge;
