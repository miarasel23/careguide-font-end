import React, { useState, useEffect } from "react";
import { api, getStoredToken, getStoredUser, clearStoredToken } from "./api";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AuthModal from "./components/AuthModal";
import MyNotesTab from "./components/MyNotesTab";
import AllNotesTab from "./components/AllNotesTab";
import UsersTab from "./components/UsersTab";
import AggregationsTab from "./components/AggregationsTab";
import IndexInspectorTab from "./components/IndexInspectorTab";
import CommunityPostsTab from "./components/CommunityPostsTab";
import UserGuideTab from "./components/UserGuideTab";

import {
  FileText,
  Globe,
  Users,
  Layers,
  Database,
  MessageSquare,
  Lock,
  Home,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

const TAB_METADATA = {
  "my-notes": {
    title: "My Notes",
    shortTitle: "My Notes",
    icon: FileText,
    desc: "Personal notes management with role-based access and ESR indexing",
    category: "Workspace",
  },
  "all-notes": {
    title: "All Notes (Admin)",
    shortTitle: "All Notes",
    icon: Globe,
    desc: "Platform-wide note oversight across all accounts",
    category: "Administration",
  },
  "users": {
    title: "User Management (Admin)",
    shortTitle: "Users",
    icon: Users,
    desc: "Admin CRUD for user accounts, credentials, roles, and interest arrays",
    category: "Administration",
  },
  "aggregations": {
    title: "MongoDB Aggregations",
    shortTitle: "Aggregations",
    icon: Layers,
    desc: "Single collection.aggregate() (Scenario 1) & $lookup join pipeline (Scenario 2)",
    category: "Database",
  },
  "indexing": {
    title: "Database Index Inspector",
    shortTitle: "Index Inspector",
    icon: Database,
    desc: "Live collection index verification, ESR rule validation & zero-waste audit",
    category: "Database",
  },
  "posts": {
    title: "Community Posts",
    shortTitle: "Community",
    icon: MessageSquare,
    desc: "Public discussion feed supporting Scenario 2 foreign collection join",
    category: "Community",
  },
  "guide": {
    title: "Platform User Guide",
    shortTitle: "User Guide",
    icon: BookOpen,
    desc: "Complete operational instructions, demo accounts, API endpoints & architecture breakdown",
    category: "Help",
  },
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("my-notes");

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync profile on load
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      api
        .getProfile()
        .then((res) => {
          if (res?.data) {
            setCurrentUser(res.data);
          }
        })
        .catch(() => {
          clearStoredToken();
          setCurrentUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    clearStoredToken();
    setCurrentUser(null);
    setActiveTab("my-notes");
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
  };

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 992) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  const currentMeta = TAB_METADATA[activeTab] || TAB_METADATA["my-notes"];
  const ActiveIcon = currentMeta.icon;

  return (
    <div
      className={`wrapper ${isSidebarCollapsed ? "sidebar-collapse" : ""} ${
        isMobileOpen ? "sidebar-open" : ""
      }`}
    >
      {/* AdminLTE Main Header Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthModal(true)}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* AdminLTE Main Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileOpen(false);
        }}
        currentUser={currentUser}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Backdrop for Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* AdminLTE Content Wrapper */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="content-header-inner">
            <div className="content-title-box">
              <h1 className="content-title">
                <ActiveIcon size={20} className="content-title-icon" />
                <span>{currentMeta.title}</span>
              </h1>
              <p className="content-subtitle">{currentMeta.desc}</p>
            </div>

            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Home size={12} style={{ marginRight: 4, display: "inline-block" }} />
                <span>Home</span>
              </li>
              <li className="breadcrumb-item">{currentMeta.category}</li>
              <li className="breadcrumb-item active">{currentMeta.shortTitle}</li>
            </ol>
          </div>
        </div>

        {/* Content Body */}
        <section className="content">
          <div className="content-container">
            {/* AdminLTE Info-Boxes (Summary Metrics Bar) */}
            <div className="info-boxes-grid">
              <div
                className={`info-box ${activeTab === "my-notes" ? "info-box-active" : ""}`}
                onClick={() => setActiveTab("my-notes")}
                title="View My Notes"
              >
                <div className="info-box-icon">
                  <FileText size={20} />
                </div>
                <div className="info-box-content">
                  <span className="info-box-text">MY NOTES</span>
                  <span className="info-box-number">Personal</span>
                </div>
              </div>

              {currentUser?.role === "admin" && (
                <div
                  className={`info-box ${activeTab === "users" ? "info-box-active" : ""}`}
                  onClick={() => setActiveTab("users")}
                  title="View User Management"
                >
                  <div className="info-box-icon">
                    <Users size={20} />
                  </div>
                  <div className="info-box-content">
                    <span className="info-box-text">ACCOUNTS</span>
                    <span className="info-box-number">Admin CRUD</span>
                  </div>
                </div>
              )}

              <div
                className={`info-box ${activeTab === "aggregations" ? "info-box-active" : ""}`}
                onClick={() => setActiveTab("aggregations")}
                title="View Aggregations"
              >
                <div className="info-box-icon">
                  <Layers size={20} />
                </div>
                <div className="info-box-content">
                  <span className="info-box-text">AGGREGATIONS</span>
                  <span className="info-box-number">Scenarios 1 &amp; 2</span>
                </div>
              </div>

              <div
                className={`info-box ${activeTab === "indexing" ? "info-box-active" : ""}`}
                onClick={() => setActiveTab("indexing")}
                title="Inspect Database Indexes"
              >
                <div className="info-box-icon">
                  <Database size={20} />
                </div>
                <div className="info-box-content">
                  <span className="info-box-text">ESR INDEXES</span>
                  <span className="info-box-number">7 Verified</span>
                </div>
              </div>
            </div>

            {/* Authentication Guard or Tab Content */}
            {!currentUser &&
            activeTab !== "aggregations" &&
            activeTab !== "indexing" &&
            activeTab !== "posts" &&
            activeTab !== "guide" ? (
              <div className="card card-outline card-dark text-center" style={{ padding: "40px 20px" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#000000",
                    color: "#ffffff",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  <Lock size={20} />
                </div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6, color: "#000000" }}>
                  Authentication Required
                </h2>
                <p style={{ color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto 18px", fontSize: "0.85rem" }}>
                  Please sign in to access personal notes and administrator features. You can use the seeded demo accounts (Admin or Standard User).
                </p>
                <div>
                  <button onClick={() => setShowAuthModal(true)} className="btn btn-dark">
                    Sign In / Select Demo Account
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeTab === "my-notes" && <MyNotesTab currentUser={currentUser} />}
                {activeTab === "all-notes" && currentUser?.role === "admin" && <AllNotesTab />}
                {activeTab === "users" && currentUser?.role === "admin" && <UsersTab />}
                {activeTab === "aggregations" && <AggregationsTab />}
                {activeTab === "indexing" && <IndexInspectorTab />}
                {activeTab === "guide" && (
                  <UserGuideTab
                    currentUser={currentUser}
                    onSelectTab={(tab) => setActiveTab(tab)}
                  />
                )}
                {activeTab === "posts" && (
                  currentUser ? (
                    <CommunityPostsTab currentUser={currentUser} />
                  ) : (
                    <div className="card card-outline card-dark text-center" style={{ padding: "30px" }}>
                      <p style={{ color: "var(--text-secondary)", marginBottom: 12, fontSize: "0.85rem" }}>
                        Sign in to publish new posts to the community feed.
                      </p>
                      <button onClick={() => setShowAuthModal(true)} className="btn btn-dark btn-sm">
                        Sign In
                      </button>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </section>

        {/* Main Footer */}
        <footer className="main-footer">
          <div className="footer-left">
            <strong>Md Rasel Mia</strong> &bull; Phone: <a href="tel:01997709990" style={{ color: "#000000", fontWeight: 600, textDecoration: "none" }}>01997709990</a>
          </div>
          <div className="footer-right">
            Email: <a href="mailto:eng.rasel1994@gmail.com" style={{ color: "#000000", fontWeight: 600, textDecoration: "none" }}>eng.rasel1994@gmail.com</a>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
