import React from 'react';
import styles from "./MemoryMediaCard.module.css";

export default function MemoryMediaCard() {
  return (
    <div className={styles.MemoryMediaCard}>
      <div className={styles.top}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}></div>
          <div className={styles.onlineIndicator}></div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.nameContainer}>
            <strong className={styles.name}>Shivang Pandey</strong>
            <span className={styles.time}>2h ago</span>
          </div>
          <p className={styles.username}>@npc_ryoshi</p>
          <div className={styles.tags}>
            <span className={styles.tag}>#FamilyTrip</span>
            <span className={styles.tag}>#Vacation2023</span>
          </div>
        </div>
        <button className={styles.menuButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className={styles.bottom}>
        <p className={styles.caption}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias ex rem nostrum asperiores nihil illum inventore nulla, deleniti aut commodi porro aliquam harum in assumenda.</p>
        
        <div className={styles.mediaContainer}>
          <div className={styles.mediaImage}></div>
          <div className={styles.mediaOverlay}>
            <button className={styles.mediaButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 8L16 12L10 16V8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>24</span>
          </button>
          <button className={styles.actionButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>5</span>
          </button>
          <button className={styles.actionButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18c0-2-3-2-3-9" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}