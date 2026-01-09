import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { removeToken } from "../utils/auth";

interface NavigationProps {
  onLogout?: () => void;
}

function Navigation({ onLogout }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Navigation component is rendering!");

  const handleLogout = () => {
    removeToken();
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "📊" },
    { path: ROUTES.SPENDING_CHARTS, label: "Charts", icon: "📈" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      background: "white",
      borderBottom: "1px solid #e5e7eb",
      padding: "1rem 2rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Logo/Brand */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#22c55e",
            margin: 0
          }}>
            💰 Finance Tracker
          </h2>
        </div>

        {/* Navigation Links */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem"
        }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background: isActive(item.path) ? "#22c55e" : "transparent",
                color: isActive(item.path) ? "white" : "#6b7280",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: isActive(item.path) ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isActive(item.path) ? "0 2px 4px rgba(34, 197, 94, 0.2)" : "none"
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "#f3f4f6";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={onLogout || handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dc2626";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(239, 68, 68, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(239, 68, 68, 0.2)";
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
