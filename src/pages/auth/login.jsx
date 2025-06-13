import React, { useState } from "react";
import styles from "./login.module.css";
import { Link } from "react-router-dom";
import CTA from "../../components/CTA";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/authSlice";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginData))
  };

  return (
    <div className={styles.login}>
      <h1>Login</h1>
      <form style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={loginData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={loginData.password}
          onChange={handleChange}
          required
        />

        <Link to="/forgot-password">Forgot Password</Link>
        <br />

        <CTA title="Login" />
      </form>
      <span>
        Don't have an account? <Link to="/register">Register</Link>
      </span>
    </div>
  );
}
