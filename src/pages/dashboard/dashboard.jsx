import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import CTA from "../../components/CTA";
import { Link, useNavigate } from "react-router-dom";
import DateTimeWeatherCard from "../../components/DateTimeWeatherCard";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../store/authSlice";
import { getFamily } from "../../store/familySlice"; // ✅ Import thunk
import SMCard from "../../components/SMCard";
import FamilyFormModal from "../../components/FamilyFormModal";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { families } = useSelector((state) => state.family); // ✅ Get families
  

  const [showFamilyForm, setShowFamilyForm] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // ✅ Fetch families when user is available
  useEffect(() => {
    if (user?.email) {
      dispatch(getFamily(user.email));
    }
  }, [dispatch, user]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className={styles.db}>
      <div className={styles.cards}>
        <SMCard
          title={"Number of families"}
          answer={families.length || "0"} // ✅ Dynamic count
          cta1="View"
          cta2="Create"
          link="families"
          handleClick2={() => setShowFamilyForm(true)}
        />
      </div>

      <div className={styles.profile}>
        <div>
          <div className={styles.dp}>
            <img src={user?.avatar?.url} alt="Profile" />
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
        <FamilyFormModal user={user} onClose={() => setShowFamilyForm(false)} />
      )}
    </div>
  );
}
