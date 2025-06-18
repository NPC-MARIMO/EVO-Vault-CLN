import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getRequests, updateRequest } from "../../store/requestSlice";

export default function Notification() {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.request);
  const userEmail = useSelector((state) => state.auth.user?.email);
  const [particles, setParticles] = useState([]);

  // Generate diamond particles for background
  useEffect(() => {
    if (typeof window !== "undefined") {
      const particlesArray = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 6 + 4,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 5,
      }));
      setParticles(particlesArray);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      dispatch(getRequests(userEmail));
    }
  }, [userEmail, dispatch]);

  const handleAction = (reqId, status) => {
    dispatch(updateRequest({ reqId, action: status, email: userEmail }))
      .unwrap()
      .then(() => dispatch(getRequests(userEmail)))
      .catch((err) => console.error("Update failed:", err));
  };

  return (
    <div className={styles.container}>
      {/* Diamond particle background */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={styles.diamondParticle}
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      <h1 className={styles.heading}>📬 Join Requests</h1>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading requests...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>⚠️ Error loading requests</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && requests.length === 0 && (
        <p className={styles.empty}>No join requests yet 🎉</p>
      )}

      <div className={styles.cardGrid}>
        {requests.map((req) => (
          <div key={req._id} className={styles.card}>
            {/* Sender Info */}
            <div className={styles.user}>
              <img
                src={
                  req.from?.avatar?.url || "https://i.imgur.com/QlRphfQ.jpeg"
                }
                alt="user"
                className={styles.avatarSmall}
              />
              <div>
                <p className={styles.userText}>
                  <strong>{req.from?.name}</strong> ({req.from?.email})
                </p>
              </div>
            </div>

            <p className={styles.inviteText}>invited you to join</p>

            {/* Family Info */}
            <div className={styles.family}>
              <img
                src={req.family?.avatar || "https://i.imgur.com/QlRphfQ.jpeg"}
                alt="family"
                className={styles.familyAvatar}
              />
              <div className={styles.familyText}>
                <h3>{req.family?.name}</h3>
                <p>{req.family?.description}</p>
              </div>
            </div>

            {/* Status + Conditional Actions */}
            <div className={styles.footer}>
              <span
                className={styles.status}
                style={{
                  "--status-color":
                    req.status === "accepted"
                      ? "linear-gradient(135deg, rgba(34,197,94,0.8), rgba(40,167,69,0.8))"
                      : req.status === "rejected"
                      ? "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.8))"
                      : "linear-gradient(135deg, rgba(255,215,0,0.8), rgba(255,165,0,0.8))",
                }}
              >
                Status: {req.status}
              </span>

              {/* Show actions only when status is pending */}
              {req.status === "pending" && (
                <div className={styles.actions}>
                  <button
                    className={`${styles.button} ${styles.accept}`}
                    onClick={() => handleAction(req._id, "accepted")}
                  >
                    <span>✅</span> Accept
                  </button>
                  <button
                    className={`${styles.button} ${styles.reject}`}
                    onClick={() => handleAction(req._id, "rejected")}
                  >
                    <span>❌</span> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
