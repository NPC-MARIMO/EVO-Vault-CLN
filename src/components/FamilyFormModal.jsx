import React, { useEffect, useState } from "react";
import styles from "./FamilyFormModal.module.css";
import { uploadImage } from "../services/cloudinary";
import { useDispatch } from "react-redux";
import { createFamily, getFamily } from "../store/familySlice";
import Popup from "./Popup";
import { motion, AnimatePresence } from "framer-motion";

export default function FamilyFormModal({ onClose, user }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [diamondParticles, setDiamondParticles] = useState([]);

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

  // Create diamond particles for background
  useEffect(() => {
    const particles = Array.from({ length: 30 }).map(() => ({
      id: Math.random().toString(36).substring(7),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setDiamondParticles(particles);
  }, []);

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

    setIsLoading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
      setAvatarPreview(uploadedUrl);
    } catch (err) {
      setPopup({
        text: "Image upload failed",
        handleClick1: closePopup,
        cta1: "Try Again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
      setAvatarPreview(uploadedUrl);
    } catch (err) {
      setPopup({
        text: "Image upload failed",
        handleClick1: closePopup,
        cta1: "Try Again",
      });
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      await dispatch(createFamily(formData));
      dispatch(getFamily(user.email));
      setPopup({
        text: "Family Vault Created Successfully",
        handleClick1: () => {
          closePopup();
          onClose();
        },
        cta1: "Explore Vault",
      });
    } catch (err) {
      setPopup({
        text: "Creation failed. Please try again.",
        handleClick1: closePopup,
        cta1: "Okay",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.modalBackdrop} `}>
      {/* Diamond Particle Background */}
      <div className={styles.particleContainer}>
        {diamondParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className={styles.diamondParticle}
            initial={{ opacity: 0 }}
            animate={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              opacity: [0, 0.8, 0],
              rotate: 360,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>

      <AnimatePresence>{popup.text && <Popup {...popup} />}</AnimatePresence>

      <motion.div
        className={styles.modalContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className={styles.header}>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Create New Family Vault
          </motion.h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18"
                stroke="#C4A876"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 6L18 18"
                stroke="#C4A876"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <motion.form
          className={styles.form}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.formGroup}>
            <label className={styles.label}>Family Name</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. The Wanderers"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Family Crest</label>
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
                {isLoading ? (
                  <div className={styles.spinner}>
                    <div className={styles.goldSpinner}></div>
                  </div>
                ) : avatarPreview ? (
                  <motion.img
                    src={avatarPreview}
                    alt="Preview"
                    className={styles.previewImg}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                ) : (
                  <motion.div
                    className={styles.uploadContent}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={styles.uploadIcon}
                    >
                      <path
                        d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
                        stroke="#C4A876"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M17 8L12 3L7 8"
                        stroke="#C4A876"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 3V15"
                        stroke="#C4A876"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>
                      Drag & drop your family crest or click to browse
                    </span>
                    <span className={styles.uploadHint}>
                      PNG, JPG up to 5MB
                    </span>
                  </motion.div>
                )}
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Manifesto</label>
            <textarea
              name="description"
              placeholder="Declare your family's purpose and values..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Initiation Protocol</label>
            <div className={styles.selectWrapper}>
              <select
                name="joinPolicy"
                value={formData.joinPolicy}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value="auto">Automatic Initiation</option>
                <option value="approval">Council Approval Required</option>
              </select>
              <div className={styles.selectArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#C4A876"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <motion.button
              onClick={handleSubmit}
              className={styles.createBtn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <>
                  <span>Forge Vault</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 5L19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Abandon
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
