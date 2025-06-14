import React, { useEffect } from "react";
import styles from "./Notification.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getRequests, updateRequest } from "../../store/requestSlice";

export default function Notification() {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.request);
  const userEmail = useSelector((state) => state.auth.user?.email);

  useEffect(() => {
    if (userEmail) {
      dispatch(getRequests(userEmail));
    }
  }, [userEmail, dispatch]);

  const handleAction = (reqId, status) => {
    console.log(reqId, status);
    dispatch(updateRequest({ reqId, action: status, email: userEmail }))
      .unwrap()
      .then(() => dispatch(getRequests(userEmail)))
      .catch((err) => console.error("Update failed:", err));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>📬 Join Requests</h1>

      {loading && <p className={styles.loading}>Loading requests...</p>}
      {error && <p className={styles.error}>{error}</p>}
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
              <span className={styles.status}>Status: {req.status}</span>

              {/* Show actions only when status is pending */}
              {req.status === "pending" && (
                <div className={styles.actions}>
                  <button
                    className={styles.accept}
                    onClick={() => handleAction(req._id, "accepted")}
                  >
                    ✅ Accept
                  </button>
                  <button
                    className={styles.reject}
                    onClick={() => handleAction(req._id, "rejected")}
                  >
                    ❌ Reject
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
