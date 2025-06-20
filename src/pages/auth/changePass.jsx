import React, { useState } from "react";
import styles from "./ChangePass.module.css";
import { updateProfile } from "../../store/authSlice";
import { useDispatch } from "react-redux";

export default function ChangePass() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(updateProfile(formData));
      setIsSubmitted(true);
    }
  };

  return (
    <div className={styles.container}>
      {/* Diamond Particle Background */}
      <div className={styles.particleBackground}></div>

      <div className={styles.card}>
        <div className={styles.header}>
          <svg
            className={styles.logo}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="2" />
            <path
              d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z"
              stroke="#D4AF37"
              strokeWidth="2"
            />
            <path
              d="M12 10V7C12 5.34315 13.3431 4 15 4H16"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 7C12 5.34315 10.6569 4 9 4H8"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 19V16"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="13" r="1" fill="#D4AF37" />
          </svg>
          <h1 className={styles.title}>LEGACY VAULT</h1>
          <h2 className={styles.subtitle}>Change Your Password</h2>
        </div>

        {isSubmitted ? (
          <div className={styles.successMessage}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.successIcon}
            >
              <path
                d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.86"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 4L12 14.01L9 11.01"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3>Password Changed Successfully</h3>
            <p>Your password has been updated securely.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="password">New Password</label>
              <div className={styles.passwordInput}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 7.5V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V7.5M5.2 21H18.8C19.9201 21 20.4802 21 20.908 20.782C21.2843 20.5903 21.5903 20.2843 21.782 19.908C22 19.4802 22 18.9201 22 17.8V16.2C22 15.0799 22 14.5198 21.782 14.092C21.5903 13.7157 21.2843 13.4097 20.908 13.218C20.4802 13 19.9201 13 18.8 13H5.2C4.0799 13 3.51984 13 3.09202 13.218C2.71569 13.4097 2.40973 13.7157 2.21799 14.092C2 14.5198 2 15.0799 2 16.2V17.8C2 18.9201 2 19.4802 2.21799 19.908C2.40973 20.2843 2.71569 20.5903 3.09202 20.782C3.51984 21 4.0799 21 5.2 21Z"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? styles.errorInput : ""}
                  placeholder="Enter new password"
                />
              </div>
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={styles.passwordInput}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 7.5V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V7.5M5.2 21H18.8C19.9201 21 20.4802 21 20.908 20.782C21.2843 20.5903 21.5903 20.2843 21.782 19.908C22 19.4802 22 18.9201 22 17.8V16.2C22 15.0799 22 14.5198 21.782 14.092C21.5903 13.7157 21.2843 13.4097 20.908 13.218C20.4802 13 19.9201 13 18.8 13H5.2C4.0799 13 3.51984 13 3.09202 13.218C2.71569 13.4097 2.40973 13.7157 2.21799 14.092C2 14.5198 2 15.0799 2 16.2V17.8C2 18.9201 2 19.4802 2.21799 19.908C2.40973 20.2843 2.71569 20.5903 3.09202 20.782C3.51984 21 4.0799 21 5.2 21Z"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? styles.errorInput : ""}
                  placeholder="Confirm new password"
                />
              </div>
              {errors.confirmPassword && (
                <span className={styles.error}>{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className={styles.submitButton}>
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
