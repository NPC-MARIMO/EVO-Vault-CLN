import React, { memo, useEffect, useState, useRef } from "react";
import styles from "./MemoryMediaCard.module.css";
import { useSelector } from "react-redux";

const MemoryMediaCard = ({ memory, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    memory.description
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const menuRef = useRef(null);
  const mediaContainerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const canUserSee = () => {
    return user && user._id === memory?.uploadedBy?._id;
  };

  const canUserView = canUserSee();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(memory._id, editedDescription);
    setIsEditing(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Create a dedicated fullscreen container
      const fsContainer = document.createElement("div");
      fsContainer.className = styles.fullscreenContainer;

      // Clone the image
      const imgClone = new Image();
      imgClone.src = memory.url;
      imgClone.className = styles.fullscreenImage;
      imgClone.alt = memory.description;

      // Add exit button
      const exitButton = document.createElement("button");
      exitButton.className = styles.fullscreenExitButton;
      exitButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18" stroke="#D4AF37" stroke-width="2"/>
          <path d="M6 6L18 18" stroke="#D4AF37" stroke-width="2"/>
        </svg>
      `;
      exitButton.onclick = () => document.exitFullscreen();

      fsContainer.appendChild(imgClone);
      fsContainer.appendChild(exitButton);
      document.body.appendChild(fsContainer);

      fsContainer.requestFullscreen().then(() => {
        // Adjust image size after entering fullscreen
        const resizeImage = () => {
          const scale = Math.min(
            window.innerWidth / imgClone.naturalWidth,
            window.innerHeight / imgClone.naturalHeight
          );
          imgClone.style.width = `${imgClone.naturalWidth * scale}px`;
          imgClone.style.height = `${imgClone.naturalHeight * scale}px`;
        };

        resizeImage();
        window.addEventListener("resize", resizeImage);

        fsContainer.onfullscreenchange = () => {
          if (!document.fullscreenElement) {
            window.removeEventListener("resize", resizeImage);
            document.body.removeChild(fsContainer);
          }
        };
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className={styles.MemoryMediaCard}>
      {/* Diamond particle background would be implemented here */}
      <div className={styles.diamondParticles}></div>

      <div className={styles.top}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <img src={memory.uploadedBy.avatar.url} alt="" />
          </div>
          <div className={styles.onlineIndicator}></div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.nameContainer}>
            <strong className={styles.name}>{memory.uploadedBy.name}</strong>
            <span className={styles.time}>
              {new Date(memory.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className={styles.username}>@{memory.uploadedBy.email}</p>
        </div>
        <div className={styles.menuWrapper} ref={menuRef}>
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {menuOpen && (
            <div className={styles.menu}>
              {canUserView && (
                <>
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      setIsEditing(true);
                      setMenuOpen(false);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Edit icon */}
                    </svg>
                    Edit
                  </button>
                  <button
                    className={`${styles.menuItem} ${styles.deleteItem}`}
                    onClick={() => {
                      onDelete(memory._id);
                      setMenuOpen(false);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Delete icon */}
                    </svg>
                    Delete
                  </button>
                </>
              )}
              {/* Add the new Download button */}
              <a download={memory.description} href={memory.url}>
                <button className={styles.menuItem}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15V3"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download
                </button>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.caption}>{memory.description}</p>

        <div
          className={styles.mediaContainer}
          ref={mediaContainerRef}
          onClick={toggleFullscreen}
        >
          <div className={styles.mediaImage}>
            <img src={memory.url} alt={memory.description} />
          </div>
          <div className={styles.mediaOverlay}>
            <button
              className={styles.mediaButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isFullscreen ? (
                  // Exit fullscreen icon
                  <>
                    <path
                      d="M8 16V20C8 20.5304 8.21071 21.0391 8.58579 21.4142C8.96086 21.7893 9.46957 22 10 22H14C14.5304 22 15.0391 21.7893 15.4142 21.4142C15.7893 21.0391 16 20.5304 16 20V16"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 8V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V8"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12H6"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18 12H22"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 18V22"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 2V6"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : (
                  // Enter fullscreen icon
                  <>
                    <path
                      d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V8"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 16V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H16"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V16"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Gold decorative elements */}
      <div className={styles.goldBorder}></div>
      <div className={styles.goldCorner}></div>

      {/* Edit Modal */}
      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeModal}
              onClick={() => setIsEditing(false)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="#D4AF37"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="#D4AF37"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h3 className={styles.modalTitle}>Edit Description</h3>
            <form onSubmit={handleEditSubmit}>
              <textarea
                className={styles.editTextarea}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Enter new description..."
                rows="4"
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MemoryMediaCard);
