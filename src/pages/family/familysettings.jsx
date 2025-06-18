import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import styles from "./FamilySettings.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { deleteFamily, getParticularFamily, updateFamily } from "../../store/familySlice";
import { uploadImage } from "../../services/cloudinary";

export default function FamilySettings() {

  const [diamondParticles] = useState(
    Array.from({ length: 25 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 4,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }))
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    joinPolicy: "",
    avatar: "",
  });

  const { selectedFamily, loading, error } = useSelector(
    (state) => state.family
  );

  const { familyId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getParticularFamily(familyId));
  }, [dispatch, familyId]);

  useEffect(() => {
    if (selectedFamily) {
      setFormData({
        name: selectedFamily.name || "",
        description: selectedFamily.description || "",
        joinPolicy: selectedFamily.joinPolicy || "approval",
        avatar: selectedFamily.avatar || "",
      });
      setAvatarPreview(selectedFamily.avatar || "");
    }
  }, [selectedFamily]);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true); // Show loading state during upload
      const uploadedUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
      setAvatarPreview(uploadedUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
      // You could add error handling/show a popup here
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    dispatch(updateFamily({ familyId, formData }))
      .then(() => {
        dispatch(getParticularFamily(familyId));
        setIsLoading(false);
        setIsEditing(false);
      })
      .catch(() => setIsLoading(false));

    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.goldSpinner}></div>
        <p className={styles.loadingText}>Saving your changes...</p>
      </div>
    );
  }
  
  const handleDeleteFamily = async () => {
    if (!familyId) {
      alert("Family ID is missing");
      return;
    }

    try {
      const resultAction = await dispatch(deleteFamily({ familyId }));

      if (deleteFamily.fulfilled.match(resultAction)) {
        // Success case
        navigate("/dashboard");
        showSuccessNotification("Family deleted successfully");
      } else {
        // Error case
        const error = resultAction.payload || resultAction.error.message;
        showErrorNotification(error);
      }
    } catch (err) {
      showErrorNotification("An unexpected error occurred");
    }
  }
  return (
    <div className={styles.container}>
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
              opacity: [0, 0.7, 0],
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.contentWrapper}
      >
        <h1 className={styles.title}>Family Vault Settings</h1>

        <div className={styles.settingsContainer}>
          {/* Basic Information Section */}
          <motion.section
            className={styles.section}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Family Information</h2>
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                className={styles.editButton}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(212, 175, 55, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        strokeWidth="2"
                      />
                      <path
                        d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"
                        strokeWidth="2"
                      />
                    </svg>
                    Edit
                  </>
                )}
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.avatarContainer}>
                <motion.div
                  className={styles.avatarWrapper}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={formData?.avatar}
                    alt="Family Avatar"
                    className={styles.avatar}
                  />
                  {isEditing && (
                    <motion.div
                      className={styles.avatarOverlay}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <label
                        htmlFor="avatar-upload"
                        className={styles.uploadLabel}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx="16" cy="8" r="3" strokeWidth="2" />
                          <path
                            d="M21 15l-3.1-3.1a4 4 0 0 0-5.6 0L8 16"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className={styles.fileInput}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.inputLabel}>
                  Family Name
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={styles.input}
                    required
                  />
                </motion.div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.inputLabel}>
                  Description
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={styles.textarea}
                    rows="3"
                  />
                </motion.div>
              </div>

              {/* Join Policy Settings */}
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Join Policy</label>
                <div className={styles.radioGroup}>
                  <motion.label
                    className={styles.radioLabel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="joinPolicy"
                      value="approval"
                      checked={formData.joinPolicy === "approval"}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioCustom}></span>
                    Require Approval
                  </motion.label>

                  <motion.label
                    className={styles.radioLabel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="joinPolicy"
                      value="auto"
                      checked={formData.joinPolicy === "auto"}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioCustom}></span>
                    Auto-join
                  </motion.label>
                </div>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    className={styles.formActions}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <motion.button
                      type="submit"
                      className={styles.saveButton}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 0 15px rgba(212, 175, 55, 0.5)",
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                          strokeWidth="2"
                        />
                        <path d="M17 21v-8H7v8" strokeWidth="2" />
                        <path d="M7 3v5h8" strokeWidth="2" />
                      </svg>
                      Save Changes
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.section>

          {/* Danger Zone Section */}
          <motion.section
            className={`${styles.section} ${styles.dangerSection}`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h2 className={styles.dangerHeader}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  strokeWidth="2"
                />
                <path d="M12 9v4" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 17h0" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Danger Zone
            </h2>
            <div className={styles.dangerContent}>

              <div className={styles.dangerItem}>
                <h3>Delete Family</h3>
                <p>Permanently delete this family and all its contents</p>
                <motion.button
                onClick={handleDeleteFamily}
                  className={styles.dangerButton}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 15px rgba(217, 83, 79, 0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Delete Family
                </motion.button>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
