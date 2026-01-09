// This is what Header.tsx would look like if we used .ts instead of .tsx
// We CANNOT use JSX syntax in .ts files - TypeScript will throw an error

import React from "react";
import styles from "../../pages/Dashboard.module.css";

interface HeaderProps {
  onLogout: () => void;
}

// Option 1: Using React.createElement (verbose, not recommended)
export const DashboardHeaderTS = ({ onLogout }: HeaderProps) => {
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

// Option 2: Using JSX (THIS WILL NOT WORK IN .ts FILES - TypeScript error!)
// export const DashboardHeaderJSX = ({ onLogout }: HeaderProps) => {
//   return (
//     <div className={styles.header}>
//       <h1 className={styles.title}>Finance Tracker</h1>
//       <p className={styles.subtitle}>Expense Tracker</p>
//       <div className={styles.logoutButton}>
//         <button onClick={onLogout} className={styles.logoutBtn}>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

