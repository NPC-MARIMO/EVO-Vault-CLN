import React from "react";
import styles from "./FamilySuggestion.module.css";
import { div } from "framer-motion/m";
import { useDispatch, useSelector } from "react-redux";
import { sendRequest, updateRequest } from "../store/requestSlice";

const FamilyCard = ({ family }) => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleConnect = async (family) => {
    
  };

  

  return (
    <div className={styles.familyCard}>
      <h2 className={styles.title}>Discover Noble Families</h2>
      {family &&
        family.map((family) => (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <img
                src={family.avatar}
                alt={family.name}
                className={styles.familyAvatar}
              />
              <div className={styles.familyInfo}>
                <h3 className={styles.familyName}>{family.name}</h3>
                <p className={styles.familyDescription}>{family.description}</p>
              </div>
            </div>
            <div className={styles.familyStats}>
              <div className={styles.statItem}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{family.members.length} Members</span>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button
                onClick={() => handleConnect(family)}
                className={styles.connectButton}
              >
                Connect
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

// Example usage:
// <FamilyCard family={{
//   name: "Ryoshi Dynasty",
//   description: "Patriarch/Matriarch - \"Scars on the back are a swordsman's shame\"",
//   avatar: "/path/to/avatar.jpg",
//   members: 42
// }} />

export default FamilyCard;
