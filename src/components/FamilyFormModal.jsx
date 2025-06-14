import React, { useEffect, useState } from "react";
import styles from "./FamilyFormModal.module.css";
import { uploadImage } from "../services/cloudinary";
import { useDispatch } from "react-redux";
import { createFamily, getFamily } from "../store/familySlice";
import Popup from "./Popup";

export default function FamilyFormModal({ onClose, user }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    description: "",
    joinPolicy: "auto",
    email: user?.email || "",
  });

  const [popup, setPopup] = useState({
    text: null,
    handleClick1: null,
    handleClick2: null,
    cta1: null,
    cta2: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: user?.email || "",
    }));
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
      setAvatarPreview(uploadedUrl);
    } catch (err) {
      alert("Image upload failed.");
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
      setAvatarPreview(uploadedUrl);
    } catch (err) {
      alert("Image upload failed.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const closePopup = () =>
  setPopup({
    text: null,
    handleClick1: null,
    handleClick2: null,
    cta1: null,
    cta2: null,
  });
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  await dispatch(createFamily(formData));
  dispatch(getFamily(user.email)); // ⬅️ Refresh families
  setPopup({
    text: "Family Created Successfully",
    handleClick1: closePopup,
    cta1: "Close",
  });
};


  return (
    <div className={styles.modalBackdrop}>
      {popup.text && <Popup {...popup} />}
      <div className={styles.modalContent}>
        <h2>Create New Family Vault</h2>
        <form className={styles.form}>
          <label>Family Name</label>
          <input
            name="name"
            type="text"
            placeholder="e.g. The Wanderers"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label>Family Avatar</label>
          <div
            className={`${styles.avatarUpload} ${
              isDragging ? styles.dragging : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              id="avatarUpload"
              hidden
            />
            <label
              htmlFor="avatarUpload"
              className={styles.uploadLabel}
              tabIndex={0}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className={styles.previewImg}
                />
              ) : (
                <span>📁 Drag and drop or click to upload</span>
              )}
            </label>
          </div>

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Tell us something about this vault..."
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
          />

          <label>Join Policy</label>
          <select
            name="joinPolicy"
            value={formData.joinPolicy}
            onChange={handleInputChange}
            required
          >
            <option value="auto">Auto Join</option>
            <option value="approval">Requires Approval</option>
          </select>

          <div className={styles.actions}>
            <button onClick={handleSubmit} className={styles.createBtn}>
              Create Family
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
