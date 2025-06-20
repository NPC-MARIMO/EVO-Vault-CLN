import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Forgot.module.css";
import axios from "axios";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await axios.post(`${import.meta.env.VITE_API_URL}/password/send-mail`, { email });
    console.log(result);
    
    setIsSubmitted(true);
  };

  return (
    <div className={styles.forgotContainer}>
      {/* Diamond Particle Background */}
      <div className={styles.particleBackground}></div>

      <div className={styles.forgotContent}>
        <motion.div
          className={styles.logoContainer}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <svg
            className={styles.logo}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className={styles.appName}>LEGACY VAULT</h1>
        </motion.div>

        {isSubmitted ? (
          <motion.div
            className={styles.successMessage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              className={styles.successIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
            <h2 className={styles.successTitle}>Reset Link Sent</h2>
            <p className={styles.successText}>
              We've sent a password reset link to{" "}
              <span className={styles.emailHighlight}>{email}</span>. Please
              check your inbox.
            </p>
            <button
              className={styles.backButton}
              onClick={() => {
                setEmail("");
                setIsSubmitted(false);
              }}
            >
              Back to Login
            </button>
          </motion.div>
        ) : (
          <motion.div
            className={styles.formContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className={styles.title}>Reset Your Password</h2>
            <p className={styles.subtitle}>
              Enter your email and we'll send you a link to reset your password
            </p>

            <form onSubmit={handleSubmit} className={styles.forgotForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.inputLabel}>
                  Email Address
                </label>
                <div className={styles.inputContainer}>
                  <svg
                    className={styles.inputIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 6L12 13L2 6"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitButton}>
                Send Reset Link
              </button>
            </form>

            <div className={styles.footerLinks}>
              <a href="/login" className={styles.footerLink}>
                Remember your password? Sign in
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
