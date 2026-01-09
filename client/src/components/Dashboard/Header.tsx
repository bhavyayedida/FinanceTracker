import React from "react";
import styles from "../../pages/Dashboard.module.css";

interface HeaderProps {
  onLogout: () => void;
}

export const DashboardHeader: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Finance Tracker</h1>
      <p className={styles.subtitle}>Expense Tracker</p>
      <div className={styles.logoutButton}>
        <button onClick={onLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
};

