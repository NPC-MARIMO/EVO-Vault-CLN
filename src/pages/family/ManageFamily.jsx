import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./ManageFamily.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFamilyMember,
  getParticularFamily,
  
} from "../../store/familySlice";
import { useParams } from "react-router-dom";

const ManageFamily = () => {
  const dispatch = useDispatch();
  const { familyId } = useParams();

  const { selectedFamily } = useSelector((state) => state.family);

  useEffect(() => {
    if (!selectedFamily || selectedFamily._id !== familyId) {
      dispatch(getParticularFamily(familyId));
    }
  }, [dispatch, familyId, selectedFamily]);

  useEffect(() => {
    if (selectedFamily) {
      console.log(selectedFamily);
    } else {
      console.log("loading");
    }
  }, [selectedFamily]);

  const [diamondParticles] = useState(
    Array.from({ length: 20 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }))
  );

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

      {/* Family Header */}
      {selectedFamily && (
        <>
          <motion.div
            className={styles.familyHeader}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.avatarContainer}>
              <img
                src={selectedFamily.avatar}
                alt={selectedFamily.name}
                className={styles.familyAvatar}
              />
              <div className={styles.avatarBorder}></div>
            </div>
            <h1 className={styles.familyName}>{selectedFamily.name}</h1>
            <p className={styles.familyDescription}>
              {selectedFamily.description}
            </p>
          </motion.div>

          {/* Members Table */}
          <motion.div
            className={styles.membersContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.tableHeader}>
              <h2 className={styles.membersTitle}>Family Members</h2>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.membersTable}>
                <thead>
                  <tr className={styles.tableHeaderRow}>
                    <th className={styles.tableHeaderCell}>Member</th>
                    <th className={styles.tableHeaderCell}>Role</th>
                    <th className={styles.tableHeaderCell}>Joined</th>
                    <th className={styles.tableHeaderCell}>Status</th>
                    <th className={styles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFamily.members?.map((member) => (
                    <motion.tr
                      key={member.user._id}
                      className={styles.tableRow}
                      whileHover={{
                        backgroundColor: "rgba(196, 168, 118, 0.05)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className={styles.tableCell}>
                        <div className={styles.memberInfo}>
                          <img
                            src={member.user.avatar.url}
                            alt={member.user.name}
                            className={styles.memberAvatar}
                          />
                          <div>
                            <p className={styles.memberName}>
                              {member.user.name}
                            </p>
                            <p className={styles.memberEmail}>
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={styles.memberRole}>{member.role}</span>
                      </td>
                      <td className={styles.tableCell}>{member.joinedAt}</td>
                      <td className={styles.tableCell}>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[member.status]
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        {member.role === "admin" && (
                          <div className={styles.actionButtons}>
                            {member.status === "pending" && (
                              <>
                                <button className={styles.approveButton}>
                                  Approve
                                </button>
                                <button className={styles.rejectButton}>
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                dispatch(
                                  deleteFamilyMember({
                                    familyId: selectedFamily._id,
                                    memberId: member.user._id,
                                  })
                                );
                              }}
                              className={styles.removeButton}
                            >
                              {/* Trash Icon */}
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M3 6H5H21"
                                  stroke="#C4A876"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                  stroke="#C4A876"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                            <button className={styles.editButton}>
                              {/* Pencil Icon */}
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                  stroke="#C4A876"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                                  stroke="#C4A876"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ManageFamily;
