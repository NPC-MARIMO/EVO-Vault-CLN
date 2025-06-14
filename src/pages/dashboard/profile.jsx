import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import CTA from "../../components/CTA";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, updateProfile } from "../../store/authSlice";
import { uploadImage } from "../../services/cloudinary";
import Popup from "../../components/Popup";

export default function Profile() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [popup, setPopup] = useState({
    text : null,
    handleClick1 : null,
    handleClick2 : null,
    cta1 : null,
    cta2 : null
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    avatar: null, // final Cloudinary URL
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
        avatar: user.avatar.url || null,
      });
      setAvatarPreview(user.avatar || null);
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
      alert("Image upload failed.");
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
      alert("Image upload failed.");
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

    const updatedPayload = {
      name: form.name,
      username: form.username,
      bio: form.bio,
      avatar: form.avatar,
      email : form.email
    };

    if (form.password.trim() && form.confirmPassword.trim()) {
      updatedPayload.password = form.password;
      updatedPayload.confirmPassword = form.confirmPassword;
    }

    dispatch(updateProfile(updatedPayload));
    setPopup({
       text:"Profile Updated Successfully",
        handleClick1 : closePopup, 
        cta1 : "Close", })
  };

  return (
    <div className={styles.pf}>
      {/* popup */}
      {popup.text && <Popup {...popup} />}
    
      <div className={styles.top}>
        <div className={styles.profile}>
          <div className={styles.dp}>
            <img src={form.avatar} alt="Profile" />
          </div>
          <div className={styles.name}>
            <h1>{form.name || "Your Name"}</h1>
            <p>@{form.username || "username"}</p>
            <p>{form.email} (can't be changed!)</p>
            <p>{form.bio}</p>
          </div>
        </div>
      </div>

      <div className={styles.edit}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label>Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.group}>
            <label>Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className={styles.group}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className={styles.group}>
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className={styles.group}>
            <label>Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={form.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          <div
            className={styles.avatarUpload}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {avatarPreview ? (
              <img
                style={{ borderRadius: 0 }}
                src={avatarPreview}
                alt="Avatar Preview"
              />
            ) : (
              <p>Drag & drop avatar here</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              hidden
            />
            <button
              type="button"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
            >
              Upload Avatar
            </button>
          </div>

          <CTA title="Save Changes" className={styles.saveBtn} />
        </form>
      </div>
    </div>
  );
}
