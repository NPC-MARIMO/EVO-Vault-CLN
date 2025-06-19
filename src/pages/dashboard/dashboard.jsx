import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../store/authSlice";
import { get5RandomFamilies, getFamily } from "../../store/familySlice";
import { getRequests } from "../../store/requestSlice";
import FamilyFormModal from "../../components/FamilyFormModal";
import WealthCard from "../../components/WealthCard";
import HeritageClock from "../../components/HeritageClock";
import SecurityStatus from "../../components/SecurityStatus";
import FamilySuggestion from "../../components/FamilySuggestion";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { requests } = useSelector((state) => state.request);
  const { families } = useSelector((state) => state.family);
  const { suggestedFamilies } = useSelector((state) => state.family);

  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [wealthIndex, setWealthIndex] = useState(82);
  const [goldPrice, setGoldPrice] = useState("$2,128.45 ▲1.2%");

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  // Fetch data on mount
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.email) {
      dispatch(getFamily(user.email));
      dispatch(getRequests(user.email));
      dispatch(get5RandomFamilies(user._id));
    }
  }, [dispatch, user?.email]);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() * 20 - 10).toFixed(2);
      const newPrice = (2128.45 + parseFloat(fluctuation)).toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );
      setGoldPrice(
        `${newPrice} ${fluctuation >= 0 ? "▲" : "▼"}${Math.abs(fluctuation)}%`
      );
      setWealthIndex((prev) =>
        Math.min(100, Math.max(70, prev + (Math.random() * 4 - 2)))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className={styles.dashboard}>
      {/* Diamond Particle Background */}
      <div className={styles.diamondParticles}></div>

      {/* Security Laser Grid */}
      <div className={styles.laserGrid}></div>

      {/* Main Content */}
      <div className={styles.contentContainer}>
        {/* Left Panel - Wealth Overview */}
        <div className={styles.wealthPanel}>
          <div className={styles.heritageHeader}>
            <h1>LEGACY VAULT</h1>
            <h2>Generational Wealth Portal</h2>
          </div>

          <div className={styles.wealthOverview}>
            <div className={styles.wealthCardsContainer}>
              <WealthCard
                title="Bloodline Networks"
                value={families?.length || 0}
                trend="+2%"
                icon="family"
                onClickView={() => navigate("/families")}
                onClickAction={() => setShowFamilyForm(true)}
              />

              <WealthCard
                title="Pending Requests"
                value={pendingRequests?.length || 0}
                trend={pendingRequests?.length > 0 ? "New" : "Clear"}
                requestPara={requests?.length || 0}
                icon="request"
                alert={pendingRequests?.length > 0}
                onClickView={() => navigate("/notifications")}
              />
            </div>

            <FamilySuggestion family={suggestedFamilies} />
          </div>
        </div>

        {/* Right Panel - Profile */}
        <div className={styles.profilePanel}>
          <div className={styles.profileHeader}>
            <h3>Dynasty Profile</h3>
            <HeritageClock />
          </div>

          <div className={styles.profileContent}>
            <div className={styles.profileImage}>
              <img
                src={user?.avatar?.url || "https://i.imgur.com/QlRphfQ.jpeg"}
                alt="Profile"
                className={styles.profilePicture}
              />
              <div className={styles.profileBadge}>Verified Bloodline</div>
            </div>

            {user ? (
              <div className={styles.profileInfo}>
                <h1>{user.name}</h1>
                <p className={styles.profileTitle}>Patriarch/Matriarch</p>
                <p className={styles.profileUsername}>@{user.username}</p>

                <div className={styles.profileBio}>
                  {user.bio ||
                    `Custodian of the ${
                      user.name
                    } legacy since ${new Date().getFullYear()}`}
                </div>

                <div className={styles.profileActions}>
                  <button
                    className={styles.profileButton}
                    onClick={() => navigate("/profile")}
                  >
                    <span>Edit Dynasty Profile</span>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                      />
                    </svg>
                  </button>

                  <button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    <span>Secure Logout</span>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.profileLoading}>
                <div className={styles.loadingAnimation}></div>
                <p>Authenticating Bloodline...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Family Form Modal */}
      {showFamilyForm && (
        <FamilyFormModal user={user} onClose={() => setShowFamilyForm(false)} />
      )}
    </div>
  );
}
