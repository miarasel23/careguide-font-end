import React, { useState } from "react";
import { Menu, User, LogOut, Server } from "lucide-react";
import ApiSettingsModal from "./ApiSettingsModal";

export default function Navbar({
  currentUser,
  onLogout,
  onOpenAuth,
  onToggleSidebar,
}) {
  const [showApiModal, setShowApiModal] = useState(false);

  return (
    <>
      <nav className="main-header navbar navbar-expand">
        {/* LEFT SIDE: Hamburger Pushmenu Toggle */}
        <div className="navbar-left">
          <button
            onClick={onToggleSidebar}
            className="nav-link btn-pushmenu"
            title="Toggle Sidebar Navigation"
            aria-label="Toggle Sidebar Navigation"
            type="button"
          >
            <Menu size={16} />
          </button>
        </div>

        {/* RIGHT SIDE: User Name, API Pill, and Actions */}
        <div className="navbar-right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setShowApiModal(true)}
            className="btn btn-outline-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, padding: "3px 8px" }}
            title="Configure Backend API Server Endpoint"
            type="button"
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#28a745" }} />
            <Server size={11} />
            <span>API Server</span>
          </button>

          {currentUser ? (
            <div className="navbar-profile-section">
              <div className="navbar-user-pill">
                <div className="navbar-user-avatar">
                  <User size={12} />
                </div>
                <div className="navbar-user-text">
                  <span className="navbar-user-name">{currentUser.name}</span>
                  <span className="navbar-user-email">{currentUser.email}</span>
                </div>
                <span className={`badge ${currentUser.role === "admin" ? "badge-dark" : "badge-secondary"}`}>
                  {currentUser.role.toUpperCase()}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="btn btn-outline-dark btn-sm navbar-logout-btn"
                title="Sign out of account"
                type="button"
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="navbar-profile-section">
              <button
                onClick={onOpenAuth}
                className="btn btn-dark btn-sm"
                type="button"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      </nav>

      <ApiSettingsModal isOpen={showApiModal} onClose={() => setShowApiModal(false)} />
    </>
  );
}
