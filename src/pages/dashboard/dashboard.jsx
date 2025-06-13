import React, { useEffect } from "react";
import styles from "./dashboard.module.css";
import CTA from "../../components/CTA";
import { Link, useNavigate } from "react-router-dom";
import DateTimeWeatherCard from "../../components/DateTimeWeatherCard";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../store/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  console.log(user);
  

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className={styles.db}>
      <div></div>
      <div className={styles.profile}>
        <div>
          <div className={styles.dp}>
            <img src={user?.avatar.url} alt="Profile" />
          </div>
          {user ? (
            <>
              <h1>{user.name}</h1>
              <p  >@{user.username}</p>
              <p>{user.bio || "Hello! I am " + user.name + ", Nice to meet you"}</p>
            </>
          ) : (
            <p>Loading user...</p>
          )}

          <Link to="/profile">
            <CTA title="View & Edit Profile" handleClick={() => {}} />
          </Link>
          <CTA title="Logout" handleClick={handleLogout} />
        </div>
        <DateTimeWeatherCard />
      </div>
    </div>
  );
}
