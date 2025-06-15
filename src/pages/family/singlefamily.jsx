import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./FamilyProfile.module.css";
import CTA from "../../components/CTA";
import { getParticularFamily } from "../../store/familySlice";
import { getParticularUser, clearSearchedUser } from "../../store/authSlice";
import { sendRequest } from "../../store/requestSlice";
import MemoryMediaCard from "../../components/MemoryMediaCard";
import { uploadImage } from "../../services/cloudinary";
import { createMemory } from "../../store/memorySlice";

const FamilyProfile = () => {
  const { familyId } = useParams();
  const dispatch = useDispatch();

  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [search, setSearch] = useState("");
  const [memoryData, setMemoryData] = useState({
    description: "",
    media: null,
    preview: null,
    url: null,
    type: "image",
    familyId: null,
    createdBy: null,
  });

  const [isDragging, setIsDragging] = useState(false);

  const { selectedFamily, loading, error } = useSelector(
    (state) => state.family
  );
  const { user, searchedUser, searchedUserLoading, searchedUserError } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (familyId) {
      dispatch(getParticularFamily(familyId));
    }
    setMemoryData({
      ...memoryData,
      familyId: familyId,
      createdBy: user._id,
    });
  }, [dispatch, familyId]);

  const isAdmin =
    selectedFamily?.members?.find(
      (member) => member.user === user._id || member.user?._id === user._id
    )?.role === "admin";

  const handleAddMember = () => setShowModal(true);

  const handleViewMembers = () => {
    alert(isAdmin ? "Manage clicked!" : "View clicked!");
  };

  const handleSearch = () => {
    if (!search.trim()) return alert("Please enter a valid email or username.");
    dispatch(getParticularUser(search));
  };

  const closeModal = () => {
    setShowModal(false);
    setSearch("");
    dispatch(clearSearchedUser());
  };

  const closeMemoryModal = () => {
    setShowMemoryModal(false);
    setMemoryData({
      description: "",
      media: null,
      preview: null,
    });
  };

  const handleSendRequest = () => {
    const payload = {
      from: user._id,
      to: searchedUser._id,
      familyId,
    };

    dispatch(sendRequest(payload))
      .then(() => {
        alert("Join request sent!");
        closeModal();
      })
      .catch((err) => {
        alert(`Failed to send request: ${err}`);
        console.log(err);
      });
  };

  const handleMemoryInputChange = (e) => {
    const { name, value } = e.target;
    setMemoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Then modify your upload functions:
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const previewUrl = URL.createObjectURL(file);
      const uploadedUrl = await uploadImage(file);

      setMemoryData((prev) => ({
        ...prev,
        media: file,
        preview: previewUrl,
        url: uploadedUrl,
      }));
    } catch (err) {
      alert("File upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  console.log(memoryData);

  // Add similar try/catch/finally to handleDrop

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];

    if (
      !file ||
      !(file.type.startsWith("image/") || file.type.startsWith("video/"))
    ) {
      return;
    }

    try {
      // First create a preview URL
      const previewUrl = URL.createObjectURL(file);

      // Then upload to Cloudinary
      const uploadedUrl = await uploadImage(file);

      setMemoryData((prev) => ({
        ...prev,
        media: file,
        preview: previewUrl,
        url: uploadedUrl, // Store the Cloudinary URL
      }));
    } catch (err) {
      alert("File upload failed. Please try again.");
      console.error(err);
    }
  };
  const handleSubmitMemory = async (e) => {
    e.preventDefault();

    if (!memoryData.url) {
      alert("Please upload a file first");
      return;
    }

    try {
      await dispatch(
        createMemory({
          url: memoryData.url,
          type: memoryData.media.type.startsWith("image/") ? "image" : "video",
          familyId: familyId,
          createdBy: user._id,
          description: memoryData.description,
        })
      ).unwrap();

      closeMemoryModal();
      alert("Memory created successfully!");
    } catch (err) {
      alert(`Failed to create memory: ${err}`);
      console.error(err);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading family details...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!selectedFamily) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.avatarSection}>
          <img
            src={selectedFamily.avatar}
            alt={`${selectedFamily.name} Avatar`}
            className={styles.avatar}
          />
        </div>
        <div className={styles.details}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h2 className={styles.familyName}>{selectedFamily.name}</h2>
              <p className={styles.description}>{selectedFamily.description}</p>
            </div>
            <div>
              <p>
                {selectedFamily.members.length <= 1 ? "Member" : "Members"}:{" "}
                {selectedFamily.members.length}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {isAdmin && (
              <CTA title={"Add Member"} handleClick={handleAddMember} />
            )}
            <CTA
              title={isAdmin ? "Manage" : "View"}
              handleClick={handleViewMembers}
            />
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Add a Member</h3>
            <input
              type="text"
              placeholder="Search by email or username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.modalActions}>
              <CTA handleClick={handleSearch} title={"Search"} />
              <button onClick={closeModal} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>

            {searchedUserLoading && (
              <p style={{ color: "gray" }}>Searching...</p>
            )}

            {searchedUserError && (
              <p style={{ color: "red" }}>{searchedUserError}</p>
            )}

            {searchedUser && (
              <div className={styles.searchResultCard}>
                <div className={styles.resultHeader}>
                  <img
                    src={
                      searchedUser.avatar?.url ||
                      "https://i.imgur.com/QlRphfQ.jpeg"
                    }
                    alt="Profile"
                    className={styles.resultAvatar}
                  />
                  <div className={styles.resultDetails}>
                    <h4>{searchedUser.username}</h4>
                    <p>{searchedUser.email}</p>
                  </div>
                </div>
                <CTA title={"Add to Family"} handleClick={handleSendRequest} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.memories}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h1>Memories</h1>
          <CTA title={"+"} handleClick={() => setShowMemoryModal(true)} />
        </div>
        <div className={styles.memContainer}>
          <MemoryMediaCard />
          <MemoryMediaCard />
          <MemoryMediaCard />
        </div>
      </div>
      {showMemoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Create New Memory</h3>
              <button onClick={closeMemoryModal} className={styles.closeButton}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitMemory} className={styles.memoryForm}>
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.inputLabel}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={memoryData.description}
                  onChange={handleMemoryInputChange}
                  className={styles.textarea}
                  rows="4"
                  placeholder="Share what makes this memory special..."
                  required
                />
              </div>

              <div
                className={`${styles.uploadArea} ${
                  isDragging ? styles.dragging : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {memoryData.preview ? (
                  <div className={styles.previewContainer}>
                    {memoryData.media.type.startsWith("image/") ? (
                      <img
                        src={memoryData.preview}
                        alt="Preview"
                        className={styles.previewImage}
                      />
                    ) : (
                      <div className={styles.videoWrapper}>
                        <video controls className={styles.previewVideo}>
                          <source
                            src={memoryData.preview}
                            type={memoryData.media.type}
                          />
                        </video>
                      </div>
                    )}
                    <div className={styles.previewOverlay}>
                      {uploading && (
                        <div className={styles.uploadProgress}>
                          <p>Uploading your file...</p>
                          {/* You could add a progress bar here */}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setMemoryData((prev) => ({
                            ...prev,
                            media: null,
                            preview: null,
                          }))
                        }
                        className={styles.removeMediaBtn}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18 6L6 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.uploadContent}>
                    <div className={styles.uploadIcon}>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                          stroke="#FF6B6B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 8L12 3L7 8"
                          stroke="#FF6B6B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 3V15"
                          stroke="#FF6B6B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className={styles.uploadText}>
                      Drag & drop a photo or video here
                    </p>
                    <p className={styles.uploadSubtext}>or</p>
                    <label
                      htmlFor="media-upload"
                      className={styles.uploadLabel}
                    >
                      <span className={styles.uploadBtn}>Browse Files</span>
                      <input
                        id="media-upload"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                      />
                    </label>
                    <p className={styles.fileHint}>
                      Supports JPG, PNG, MP4 up to 50MB
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={closeMemoryModal}
                  className={styles.secondaryButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={!memoryData.media}
                >
                  Create Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyProfile;
