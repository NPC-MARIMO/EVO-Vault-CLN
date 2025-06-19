import React, { useState } from "react";
import styles from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/authSlice";

export default function Register() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [selectedCrest, setSelectedCrest] = useState(1);
  const [step, setStep] = useState(1);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const completeData = {
      ...formData,
      familyCrest: selectedCrest,
    };
    dispatch(registerUser(completeData)).then(() => navigate('/login'))
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className={styles.register}>
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

      <h1>Establish Your Bloodline</h1>

      <div className={styles.progressSteps}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ""}`}>
          <span>1</span>
          <p>Credentials</p>
        </div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ""}`}>
          <span>2</span>
          <p>Family Crest</p>
        </div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ""}`}>
          <span>3</span>
          <p>Vault Setup</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className={styles.formStep}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Patriarch/Matriarch Name</label>
              <span className={styles.inputBorder}></span>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="username"
                placeholder=" "
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label>Bloodline Identifier</label>
              <span className={styles.inputBorder}></span>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Dynasty Email</label>
              <span className={styles.inputBorder}></span>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Vault Passphrase</label>
              <span className={styles.inputBorder}></span>
            </div>

            <div className={styles.stepActions}>
              <button
                type="button"
                className={styles.nextButton}
                onClick={nextStep}
              >
                Continue to Crest Selection
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.formStep}>
            <h2>Select Your Family Crest</h2>
            <p className={styles.crestDescription}>
              This emblem will represent your bloodline across generations
            </p>

            <div className={styles.crestSelection}>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`${styles.crestOption} ${
                    selectedCrest === num ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedCrest(num)}
                >
                  <div className={styles.crestImage} data-crest={num}></div>
                </div>
              ))}
            </div>

            <div className={styles.stepActions}>
              <button
                type="button"
                className={styles.backButton}
                onClick={prevStep}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                  />
                </svg>
                Back
              </button>
              <button
                type="button"
                className={styles.nextButton}
                onClick={nextStep}
              >
                Continue to Vault Setup
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.formStep}>
            <h2>Configure Your Legacy Vault</h2>

            <div className={styles.vaultOptions}>
              <div className={styles.optionCard}>
                <h3>Generational Transfer</h3>
                <p>Set conditions for wealth transfer to heirs</p>
                <div className={styles.toggleSwitch}>
                  <input type="checkbox" id="generationalTransfer" />
                  <label htmlFor="generationalTransfer"></label>
                </div>
              </div>

              <div className={styles.optionCard}>
                <h3>Time-Locked Assets</h3>
                <p>Restrict access until specific dates or conditions</p>
                <div className={styles.toggleSwitch}>
                  <input type="checkbox" id="timeLocked" />
                  <label htmlFor="timeLocked"></label>
                </div>
              </div>

              <div className={styles.optionCard}>
                <h3>Bloodline Verification</h3>
                <p>DNA-based heir authentication</p>
                <div className={styles.toggleSwitch}>
                  <input type="checkbox" id="dnaAuth" />
                  <label htmlFor="dnaAuth"></label>
                </div>
              </div>
            </div>

            <div className={styles.stepActions}>
              <button
                type="button"
                className={styles.backButton}
                onClick={prevStep}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                  />
                </svg>
                Back
              </button>
              <button type="submit" className={styles.submitButton}>
                Seal the Vault
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </form>

      <div className={styles.footer}>
        <span>
          Already part of a bloodline? <Link to="/login">Access Vault</Link>
        </span>
      </div>

      <div
        className={styles.familyCrestPreview}
        data-crest={selectedCrest}
      ></div>
    </div>
  );
}
