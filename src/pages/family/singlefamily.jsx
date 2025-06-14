import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./FamilyProfile.module.css";
import CTA from "../../components/CTA";
import { getParticularFamily } from "../../store/familySlice";
import { getParticularUser, clearSearchedUser } from "../../store/authSlice";
import { sendRequest } from "../../store/requestSlice";

const FamilyProfile = () => {
  const { familyId } = useParams();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const { selectedFamily, loading, error } = useSelector(
    (state) => state.family
  );

  const { user, searchedUser, searchedUserLoading, searchedUserError } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (familyId) {
      dispatch(getParticularFamily(familyId));
    }
  }, [dispatch, familyId]);

  const handleAddMember = () => {
    setShowModal(true);
  };

  const handleViewMembers = () => {
    alert("View members clicked!");
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
  
const handleSendRequest = () => {
  console.log("Send Request Clicked");

  const payload = {
    from: user._id,
    to: searchedUser._id,
    familyId,
  };

  console.log("Payload to send:", payload);

  dispatch(sendRequest(payload))
    .then((res) => {
      alert("Join request sent!");
      closeModal();
    })
    .catch((err) => {
      alert(`Failed to send request: ${err}`);
      console.log(err)
    });
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
            <CTA title={"Add Members"} handleClick={handleAddMember} />
            <CTA title={"Manage"} handleClick={handleViewMembers} />
          </div>
        </div>
      </div>

      {/* Modal */}
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

            {/* Loading */}
            {searchedUserLoading && (
              <p style={{ color: "gray" }}>Searching...</p>
            )}

            {/* Error */}
            {searchedUserError && (
              <p style={{ color: "red" }}>{searchedUserError}</p>
            )}

            {/* Search Result */}
            {searchedUser && (
              <div className={styles.searchResultCard}>
                <div className={styles.resultHeader}>
                  <img
                    src={
                      searchedUser.avatar.url ||
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
                <CTA
                  title={"Add to Family"}
                  handleClick={handleSendRequest} // <-- No () here
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyProfile;
