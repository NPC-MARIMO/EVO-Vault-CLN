import React, { useEffect } from "react";
import styles from "./familyList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getFamily } from "../../store/familySlice";
import { useNavigate } from "react-router-dom";
import HeritageBadge from "../../components/HeritageBadge";
import WealthIndicator from "../../components/WealthIndicator";

export default function FamilyList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { families, loading, error } = useSelector((state) => state.family);

  useEffect(() => {
    if (user?.email) {
      dispatch(getFamily(user.email));
    }
  }, [dispatch, user?.email]);

  const handleOpen = (famId) => {
    navigate(`/family/${famId}`);
  };

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingAnimation}></div>
        <p>Authenticating Bloodline Access...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Security Breach Detected</h3>
        <p>{error}</p>
        <button className={styles.securityButton}>
          Contact Vault Security
        </button>
      </div>
    );

  if (!families || families.length === 0)
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIllustration}></div>
        <h3>No Bloodline Networks Established</h3>
        <p>Begin your legacy by creating a new family network</p>
        <button className={styles.createButton}>Establish Bloodline</button>
      </div>
    );

  return (
    <div className={styles.legacyContainer}>
      <div className={styles.heritageHeader}>
        <h1>Bloodline Networks</h1>
        <p>Your connected generational wealth circles</p>
      </div>

      <div className={styles.familyList}>
        {families.map((fam) => (
          <div key={fam._id} className={styles.legacyCard}>
            <div className={styles.cardVisual}>
              <div className={styles.familyCrest}>
                <img src={fam.avatar} alt={fam.name} />
                <HeritageBadge
                  tier={fam.joinPolicy === "open" ? "silver" : "gold"}
                />
              </div>
              <WealthIndicator value={fam.members?.length * 12.7} />
            </div>

            <div className={styles.cardContent}>
              <h2>{fam.name}</h2>
              <p className={styles.familyMotto}>
                {fam.description || "Family motto not established"}
              </p>

              <div className={styles.heritageStats}>
                <div className={styles.statItem}>
                  <span>Members</span>
                  <strong>{fam.members?.length || 0}</strong>
                </div>
                <div className={styles.statItem}>
                  <span>Join Policy</span>
                  <strong className={styles[fam.joinPolicy]}>
                    {fam.joinPolicy}
                  </strong>
                </div>
                <div className={styles.statItem}>
                  <span>Established</span>
                  <strong>{new Date(fam.createdAt).getFullYear()}</strong>
                </div>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                className={styles.viewButton}
                onClick={() => handleOpen(fam._id)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"
                  />
                </svg>
                View Dynasty
              </button>
              <button onClick={() => navigate(`/family/${fam._id}/settings`)} className={styles.manageButton}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                  />
                </svg>
                Manage
              </button>
            </div>

            <div className={styles.cardRibbon}>
              {fam.joinPolicy === "open"
                ? "OPEN LEGACY"
                : "EXCLUSIVE BLOODLINE"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
