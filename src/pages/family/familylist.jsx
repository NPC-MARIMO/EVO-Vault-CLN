import React, { useEffect } from "react";
import styles from "./familyList.module.css";
import { useDispatch, useSelector } from "react-redux";
import CTA from "../../components/CTA";
import { getFamily } from "../../store/familySlice";
import { useNavigate } from "react-router-dom"; // 💡 import navigation hook

export default function FamilyList() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 🧭

  const { user } = useSelector((state) => state.auth);
  const { families, loading, error } = useSelector((state) => state.family);

  useEffect(() => {
    if (user?.email) {
      dispatch(getFamily(user.email));
    }
  }, [dispatch, user?.email]);

  if (loading) return <p className={styles.loading}>Loading families...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!families || families.length === 0) return <p className={styles.noFamilies}>No families found 🥲</p>;

  // 🔥 handle navigation
  const handleOpen = (famId) => {
    navigate(`/family/${famId}`);
  };

  return (
    <div className={styles.familyListContainer}>
      {families.map((fam) => (
        <div key={fam._id}>
          <div className={styles.familyCard}>
            <img src={fam.avatar} alt={fam.name} className={styles.familyAvatar} />
            <div className={styles.familyDetails}>
              <h2 className={styles.familyName}>{fam.name}</h2>
              <p className={styles.familyDesc}>{fam.description}</p>
              <div className={styles.familyMeta}>
                <span className={styles.policy}>
                  Join Policy: <strong>{fam.joinPolicy}</strong>
                </span>
                <span className={styles.members}>
                  Members: <strong>{fam.members?.length ?? 0}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            {/* 🧠 Call the handler with fam._id */}
            <CTA title={"Open"} handleClick={() =>handleOpen(fam._id)} />
            <CTA title={"Edit"} />
          </div>
        </div>
      ))}
    </div>
  );
}
