import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./authlayout.module.css";

export default function AuthLayout() {
  return (
    <div className={styles.auth}>
      <div className={styles.left}>
        <h1>Legacy</h1>
        <h2>A Vault for Your Bloodline’s Gold</h2>
        <p>Because your legacy deserves more than just a folder — it deserves a fortress</p>
      </div>
      <div className={styles.right}>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
