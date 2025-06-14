import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import CTA from "../../components/CTA";
import { Link, useNavigate } from "react-router-dom";
import DateTimeWeatherCard from "../../components/DateTimeWeatherCard";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../store/authSlice";
import { getFamily } from "../../store/familySlice";
import { getRequests } from "../../store/requestSlice";
import SMCard from "../../components/SMCard";
import FamilyFormModal from "../../components/FamilyFormModal";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { requests } = useSelector((state) => state.request);
  const { families } = useSelector((state) => state.family);

  const [showFamilyForm, setShowFamilyForm] = useState(false);

  // 1. Get user on mount
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // 2. Get families & requests when user loads
  useEffect(() => {
    if (user?.email) {
      dispatch(getFamily(user.email));
      dispatch(getRequests(user.email));
    }
  }, [dispatch, user?.email]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/login");
  };
useEffect(() => {
  console.log("🧠 user.email:", user?.email);
  console.log("📦 requests state:", requests);
  console.log("🏘️ families state:", families);
}, [user, requests, families]);

  return (
    <div className={styles.db}>
      <div className={styles.cards}>
        <SMCard
          title="Number of Families"
          answer={families?.length || 0}
          cta1="View"
          cta2="Create"
          link="families"
          handleClick2={() => setShowFamilyForm(true)}
        />

        <SMCard
          title="Family Requests"
          answer={requests?.length || 0}
          cta1="View"
          link="notifications"
        />
      </div>

      <div className={styles.profile}>
        <div>
          <div className={styles.dp}>
            <img
              src={user?.avatar?.url || "https://i.imgur.com/QlRphfQ.jpeg"}
              alt="Profile"
            />
          </div>
          {user ? (
            <>
              <h1>{user.name}</h1>
              <p>@{user.username}</p>
              <p>{user.bio || `Hello! I am ${user.name}, Nice to meet you`}</p>
            </>
          ) : (
            <p>Loading user...</p>
          )}
          <br />
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/profile">
              <CTA title="View & Edit Profile" handleClick={() => {}} />
            </Link>
            <CTA title="Logout" handleClick={handleLogout} />
          </div>
        </div>
        <DateTimeWeatherCard />
      </div>

      {showFamilyForm && (
        <FamilyFormModal
          user={user}
          onClose={() => setShowFamilyForm(false)}
        />
      )}
    </div>
  );
}
