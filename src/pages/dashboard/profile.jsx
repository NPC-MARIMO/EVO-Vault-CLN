import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, updateProfile } from "../../store/authSlice";
import { uploadImage } from "../../services/cloudinary";
import HeritageBadge from "../../components/HeritageBadge";
import SecurityVerification from "../../components/SecurityVerification";
import LegacyPopup from "../../components/LegacyPopup";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [popup, setPopup] = useState({
    text: null,
    handleClick1: null,
    handleClick2: null,
    cta1: null,
    cta2: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    avatar: null,
  });

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        bio: user.bio || "",
        avatar: user.avatar?.url || null,
      });
      setAvatarPreview(user.avatar?.url || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImage(file);
      setForm((prev) => ({ ...prev, avatar: uploadedUrl }));
      setAvatarPreview(uploadedUrl);
    } catch (err) {
      setPopup({
        text: "Image upload failed. Please try again.",
        handleClick1: closePopup,
        cta1: "Understood",
      });
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImage(file);
      setForm((prev) => ({ ...prev, avatar: uploadedUrl }));
      setAvatarPreview(uploadedUrl);
    } catch (err) {
      setPopup({
        text: "Image upload failed. Please try again.",
        handleClick1: closePopup,
        cta1: "Understood",
      });
    }
  };

  const closePopup = () =>
    setPopup({
      text: null,
      handleClick1: null,
      handleClick2: null,
      cta1: null,
      cta2: null,
    });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      setPopup({
        text: "Passwords do not match",
        handleClick1: closePopup,
        cta1: "Try Again",
      });
      return;
    }

    const updatedPayload = {
      name: form.name,
      username: form.username,
      bio: form.bio,
      avatar: form.avatar,
      email: form.email,
    };

    if (form.password.trim() && form.confirmPassword.trim()) {
      updatedPayload.password = form.password;
      updatedPayload.confirmPassword = form.confirmPassword;
    }

    dispatch(updateProfile(updatedPayload));
    setPopup({
      text: "Dynasty Profile Updated Successfully",
      handleClick1: closePopup,
      cta1: "Continue",
    });
  };

  return (
    <div className={styles.legacyProfile}>
      {popup.text && <LegacyPopup {...popup} />}

      <div className={styles.heritageHeader}>
        <h1>Dynasty Profile</h1>
        <p>Manage your bloodline's digital identity</p>
      </div>

      <div className={styles.profileContainer}>
        {/* Profile Display Section */}
        <div className={styles.profileDisplay}>
          <div className={styles.heritageBadgeContainer}>
            <HeritageBadge tier="gold" />
          </div>

          <div className={styles.avatarContainer}>
            <div
              className={styles.avatarFrame}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Dynasty Crest" />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <svg width="48" height="48" viewBox="0 0 24 24">
                    <path
                      fill="#D4AF37"
                      d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              hidden
              id="avatarUpload"
            />
            <label htmlFor="avatarUpload" className={styles.uploadButton}>
              Update Crest
            </label>
          </div>

          <div className={styles.profileInfo}>
            <h2>{form.name || "Patriarch/Matriarch"}</h2>
            <p className={styles.username}>@{form.username || "bloodline"}</p>
            <div className={styles.verifiedEmail}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#00FF00"
                  d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,11.99L19.53,6.84L21,8.37L12,15.36L7,10.37L8.5,8.84L12,11.99Z"
                />
              </svg>
              <span>{form.email}</span>
            </div>
            <p className={styles.bio}>
              {form.bio || "Custodian of a distinguished bloodline"}
            </p>
          </div>
        </div>

        {/* Security Verification */}
        <SecurityVerification level="maximum" lastVerified="Today" />

        {/* Edit Profile Form */}
        <div className={styles.editForm}>
          <h3>Edit Dynasty Profile</h3>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Patriarch/Matriarch Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name of bloodline head"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Bloodline Identifier</label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Unique family identifier"
              />
            </div>

            <div className={styles.passwordSection}>
              <h4>Change Vault Passphrase</h4>
              <div className={styles.formGroup}>
                <label>New Passphrase</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 12 characters"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm Passphrase</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your passphrase"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Bloodline Motto</label>
              <textarea
                name="bio"
                rows="3"
                value={form.bio}
                onChange={handleChange}
                placeholder="A short declaration of your family's values"
              ></textarea>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton}>
                Seal Updates
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
