// This is Header.ts - NO JSX allowed, must use React.createElement()
import React from "react";
import styles from "../../pages/Dashboard.module.css";

interface HeaderProps {
  onLogout: () => void;
}

// Using .ts file means we MUST use React.createElement() instead of JSX
// This is much more verbose and harder to read
export const DashboardHeader = ({ onLogout }: HeaderProps) => {
  return React.createElement(
    'div',
    { className: styles.header },
    React.createElement('h1', { className: styles.title }, 'Finance Tracker'),
    React.createElement('p', { className: styles.subtitle }, 'Expense Tracker'),
    React.createElement(
      'div',
      { className: styles.logoutButton },
      React.createElement(
        'button',
        { onClick: onLogout, className: styles.logoutBtn },
        'Logout'
      )
    )
  );
};

