import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./FamilyProfile.module.css";
import { getParticularFamily } from "../../store/familySlice";
import { getParticularUser, clearSearchedUser } from "../../store/authSlice";
import { sendRequest } from "../../store/requestSlice";
import { uploadImage } from "../../services/cloudinary";
import { createMemory, fetchFamilyMemories } from "../../store/memorySlice";
import HeritageBadge from "../../components/HeritageBadge";
import LegacyPopup from "../../components/LegacyPopup";
import SecurityVerification from "../../components/SecurityVerification";
import MemoryCard from "../../components/MemoryMediaCard";

const FamilyProfile = () => {
  const { familyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()

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
  const [popup, setPopup] = useState({
    text: null,
    handleClick1: null,
    handleClick2: null,
    cta1: null,
    cta2: null,
  });

  const { selectedFamily, loading, error } = useSelector(
    (state) => state.family
  );
  const { user, searchedUser } = useSelector((state) => state.auth);
  const { familyMemories } = useSelector((state) => state.memory);

  useEffect(() => {
    if (familyId) {
      dispatch(getParticularFamily(familyId));
      dispatch(fetchFamilyMemories(familyId));
    }
    setMemoryData((prev) => ({
      ...prev,
      familyId: familyId,
      createdBy: user?._id,
    }));
  }, [dispatch, familyId, user?._id]);

  const isAdmin =
    selectedFamily?.members?.find(
      (member) => member?.user === user?._id || member.user?._id === user?._id
    )?.role === "admin";

  const handleAddMember = () => setShowModal(true);
  const handleViewMembers = () => {
    navigate(`/family/${familyId}/manage`)
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setPopup({
        text: "Please enter a valid email or username",
        handleClick1: closePopup,
        cta1: "Understood",
      });
      return;
    }
    dispatch(getParticularUser(search));
  };

  const closePopup = () =>
    setPopup({
      text: null,
      handleClick1: null,
      handleClick2: null,
      cta1: null,
      cta2: null,
    });

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
      url: null,
      type: "image",
      familyId,
      createdBy: user?._id,
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
        setPopup({
          text: "Join request sent successfully!",
          handleClick1: closeModal,
          cta1: "Continue",
        });
      })
      .catch((err) => {
        setPopup({
          text: `Failed to send request: ${err.message}`,
          handleClick1: closePopup,
          cta1: "Try Again",
        });
      });
  };

  const handleMemoryInputChange = (e) => {
    const { name, value } = e.target;
    setMemoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

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
        type: file.type.startsWith("image/") ? "image" : "video",
      }));
    } catch (err) {
      setPopup({
        text: "File upload failed. Please try again.",
        handleClick1: closePopup,
        cta1: "Understood",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (
      !file ||
      !(file.type.startsWith("image/") || file.type.startsWith("video/"))
    )
      return;

    try {
      setUploading(true);
      const previewUrl = URL.createObjectURL(file);
      const uploadedUrl = await uploadImage(file);

      setMemoryData((prev) => ({
        ...prev,
        media: file,
        preview: previewUrl,
        url: uploadedUrl,
        type: file.type.startsWith("image/") ? "image" : "video",
      }));
    } catch (err) {
      setPopup({
        text: "File upload failed. Please try again.",
        handleClick1: closePopup,
        cta1: "Understood",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitMemory = async (e) => {
    e.preventDefault();

    if (!memoryData.url) {
      setPopup({
        text: "Please upload a file first",
        handleClick1: closePopup,
        cta1: "Understood",
      });
      return;
    }

    try {
      await dispatch(
        createMemory({
          url: memoryData.url,
          type: memoryData.type,
          familyId,
          createdBy: user._id,
          description: memoryData.description,
        })
      ).unwrap();

      setPopup({
        text: "Memory added to the family vault!",
        handleClick1: closeMemoryModal,
        cta1: "Continue",
      });
      dispatch(fetchFamilyMemories(familyId));
    } catch (err) {
      setPopup({
        text: `Failed to create memory: ${err.message}`,
        handleClick1: closePopup,
        cta1: "Try Again",
      });
    }
  };

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingAnimation}></div>
        <p>Authenticating Bloodline Access...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Security Breach Detected</h3>
        <p>{error}</p>
        <button className={styles.securityButton}>
          Contact Vault Security
        </button>
      </div>
    );

  if (!selectedFamily) return null;

  return (
    <div className={styles.legacyContainer}>
      {popup.text && <LegacyPopup {...popup} />}

      {/* Family Header Section */}
      <div className={styles.familyHeader}>
        <div className={styles.familyBadge}>
          <HeritageBadge
            tier={selectedFamily.joinPolicy === "open" ? "silver" : "gold"}
          />
        </div>

        <div className={styles.familyVisual}>
          <div className={styles.familyCrest}>
            <img
              src={selectedFamily.avatar}
              alt={`${selectedFamily.name} Crest`}
            />
          </div>
          <div className={styles.familyTitles}>
            <h1>{selectedFamily.name}</h1>
            <p className={styles.familyMotto}>
              {selectedFamily.description || "Family motto not established"}
            </p>
          </div>
        </div>

        <SecurityVerification level="maximum" lastVerified="Today" />
      </div>

      {/* Family Stats */}
      <div className={styles.familyStats}>
        <div className={styles.statCard}>
          <span>Members</span>
          <strong>{selectedFamily.members.length}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Join Policy</span>
          <strong className={styles[selectedFamily.joinPolicy]}>
            {selectedFamily.joinPolicy}
          </strong>
        </div>
        <div className={styles.statCard}>
          <span>Established</span>
          <strong>{new Date(selectedFamily.createdAt).getFullYear()}</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        {isAdmin && (
          <button className={styles.addButton} onClick={handleAddMember}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
              />
            </svg>
            Add Bloodline Member
          </button>
        )}
          <button className={styles.viewButton} onClick={handleViewMembers}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"
              />
            </svg>
            {isAdmin ? "Manage Dynasty" : "View Bloodline"}
          </button>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.legacyModal}>
            <div className={styles.modalHeader}>
              <h3>Add Bloodline Member</h3>
              <button onClick={closeModal} className={styles.closeButton}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                  />
                </svg>
              </button>
            </div>

            <div className={styles.modalContent}>
              <p>Search by email or username to add to your bloodline</p>

              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Enter email or username"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
                <button className={styles.searchButton} onClick={handleSearch}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                    />
                  </svg>
                </button>
              </div>

              {searchedUser && (
                <div className={styles.userResult}>
                  <div className={styles.userAvatar}>
                    <img
                      src={
                        searchedUser.avatar?.url ||
                        "https://i.imgur.com/QlRphfQ.jpeg"
                      }
                      alt={searchedUser.username}
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <h4>{searchedUser.username}</h4>
                    <p>{searchedUser.email}</p>
                  </div>
                  <button
                    className={styles.inviteButton}
                    onClick={handleSendRequest}
                  >
                    Send Bloodline Invite
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Family Memories Section */}
      <div className={styles.memoriesSection}>
        <div className={styles.sectionHeader}>
          <h2>Generational Memories</h2>
          <button
            className={styles.addMemoryButton}
            onClick={() => setShowMemoryModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
              />
            </svg>
            Add Memory
          </button>
        </div>

        {familyMemories.length === 0 ? (
          <div className={styles.emptyMemories}>
            <svg width="64" height="64" viewBox="0 0 24 24">
              <path
                fill="#D4AF37"
                d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"
              />
            </svg>
            <h3>No Memories Yet</h3>
            <p>Preserve your family's legacy by adding the first memory</p>
          </div>
        ) : (
          <div className={styles.memoriesGrid}>
            {familyMemories.map((memory) => (
              <MemoryCard key={memory._id} memory={memory} />
            ))}
          </div>
        )}
      </div>

      {/* Add Memory Modal */}
      {showMemoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.legacyModal}>
            <div className={styles.modalHeader}>
              <h3>Preserve a Memory</h3>
              <button onClick={closeMemoryModal} className={styles.closeButton}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitMemory} className={styles.memoryForm}>
              <div className={styles.formGroup}>
                <label>Memory Description</label>
                <textarea
                  name="description"
                  value={memoryData.description}
                  onChange={handleMemoryInputChange}
                  placeholder="Share the story behind this memory..."
                  rows="4"
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
                    {memoryData.type === "image" ? (
                      <img src={memoryData.preview} alt="Memory preview" />
                    ) : (
                      <video controls>
                        <source
                          src={memoryData.preview}
                          type={memoryData.media.type}
                        />
                      </video>
                    )}
                    {uploading && (
                      <div className={styles.uploadOverlay}>
                        <div className={styles.spinner}></div>
                        <p>Securing your memory...</p>
                      </div>
                    )}
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() =>
                        setMemoryData((prev) => ({
                          ...prev,
                          media: null,
                          preview: null,
                          url: null,
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadPrompt}>
                    <svg width="48" height="48" viewBox="0 0 24 24">
                      <path
                        fill="#D4AF37"
                        d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                      />
                      <path
                        fill="#D4AF37"
                        d="M12,12C10.34,12 9,13.34 9,15C9,16.66 10.34,18 12,18C13.66,18 15,16.66 15,15C15,13.34 13.66,12 12,12M12,16C11.45,16 11,15.55 11,15C11,14.45 11.45,14 12,14C12.55,14 13,14.45 13,15C13,15.55 12.55,16 12,16Z"
                      />
                    </svg>
                    <p>Drag & drop a photo or video here</p>
                    <span>or</span>
                    <label className={styles.browseButton}>
                      Browse Files
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        hidden
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeMemoryModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!memoryData.url || uploading}
                >
                  {uploading ? "Preserving..." : "Preserve Memory"}
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
