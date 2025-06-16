// Login.jsx
import React, { useState } from "react";
import styles from "./login.module.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/authSlice";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [authMethod, setAuthMethod] = useState("password");

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
    dispatch(loginUser(loginData));
  };

  return (
    <div className={styles.login}>
      <div className={styles.securityIndicator}>
        <div className={styles.sslVisualizer}>
          <div className={styles.sslActive}></div>
          <span>Secure SSL Connection</span>
        </div>
        <div className={styles.threatMeter}>
          <span>Threat Defense</span>
          <div className={styles.meter}>
            <div style={{ width: "85%" }}></div>
          </div>
        </div>
      </div>

      <h1>Access Your Legacy</h1>

      <div className={styles.authMethods}>
        <button
          className={`${styles.authMethod} ${
            authMethod === "password" ? styles.active : ""
          }`}
          onClick={() => setAuthMethod("password")}
        >
          Password
        </button>
        <button
          className={`${styles.authMethod} ${
            authMethod === "biometric" ? styles.active : ""
          }`}
          onClick={() => setAuthMethod("biometric")}
        >
          Biometric
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {authMethod === "password" ? (
          <>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder=" "
                value={loginData.email}
                onChange={handleChange}
                required
              />
              <label>Email</label>
              <span className={styles.inputBorder}></span>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                placeholder=" "
                value={loginData.password}
                onChange={handleChange}
                required
              />
              <label>Password</label>
              <span className={styles.inputBorder}></span>
            </div>
          </>
        ) : (
          <div className={styles.biometricAuth}>
            <div className={styles.fingerprint}></div>
            <p>Scan your fingerprint or face</p>
          </div>
        )}

        <div className={styles.options}>
          <Link to="/forgot-password">Forgot Credentials?</Link>
          <div className={styles.twoFactor}>
            <input type="checkbox" id="twoFactor" defaultChecked />
            <label htmlFor="twoFactor">Two-Factor Authentication</label>
          </div>
        </div>

        <button type="submit" className={styles.loginButton}>
          Unlock Vault
          <span className={styles.buttonGlow}></span>
        </button>
      </form>

      <div className={styles.footer}>
        <span>
          No legacy vault? <Link to="/register">Establish Bloodline</Link>
        </span>
        <button className={styles.panicButton}>Panic Room</button>
      </div>

      <div className={styles.familyCrest}></div>
    </div>
  );
}
