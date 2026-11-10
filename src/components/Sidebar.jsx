import React, { useState } from "react";
import {
  FileText,
  Globe,
  Users,
  Layers,
  Database,
  MessageSquare,
  X,
  Search,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  onSelectTab,
  currentUser,
  isOpen,
  onClose,
}) {
  const [filterQuery, setFilterQuery] = useState("");

  const handleNavClick = (tabKey) => {
    onSelectTab(tabKey);
    if (onClose) {
      onClose();
    }
  };

  const navItems = [
    {
      section: "WORKSPACE",
      items: [
        {
          key: "my-notes",
          label: "My Notes",
          icon: FileText,
          badge: "CRUD",
          adminOnly: false,
        },
      ],
    },
    {
      section: "ADMINISTRATION",
      adminOnly: true,
      items: [
        {
          key: "all-notes",
          label: "All Notes (Admin)",
          icon: Globe,
          badge: "GLOBAL",
          adminOnly: true,
        },
        {
          key: "users",
          label: "Users (Admin)",
          icon: Users,
          badge: "MANAGE",
          adminOnly: true,
        },
      ],
    },
    {
      section: "DATABASE & ANALYTICS",
      items: [
        {
          key: "aggregations",
          label: "Aggregations",
          icon: Layers,
          badge: "Pipelines",
          adminOnly: false,
        },
        {
          key: "indexing",
          label: "Database Indexes",
          icon: Database,
          badge: "ESR",
          adminOnly: false,
        },
      ],
    },
    {
      section: "COMMUNITY",
      items: [
        {
          key: "posts",
          label: "Community Posts",
          icon: MessageSquare,
          badge: "Feed",
          adminOnly: false,
        },
      ],
    },
    {
      section: "DOCUMENTATION",
      items: [
        {
          key: "guide",
          label: "User Guide",
          icon: BookOpen,
          badge: "DOCS",
          adminOnly: false,
        },
      ],
    },
  ];

  const isAdmin = currentUser?.role === "admin";

  return (
    <aside className="main-sidebar sidebar-dark-primary">
      {/* Mobile-only close header */}
      <div className="sidebar-mobile-bar d-lg-none">
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Navigation
        </span>
        <button
          onClick={onClose}
          className="sidebar-close-btn"
          title="Close Navigation"
          aria-label="Close Navigation"
          type="button"
        >
          <X size={15} />
        </button>
      </div>

      {/* Sidebar Content Container - Directly starting with search and navigation */}
      <div className="sidebar" style={{ paddingTop: 14 }}>
        {/* Sidebar Search */}
        <div className="sidebar-search">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sidebar"
              placeholder="Search menu..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar" type="button" aria-label="Search">
                <Search size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-1">
          <ul className="nav nav-pills nav-sidebar flex-column">
            {navItems.map((sec, sIdx) => {
              if (sec.adminOnly && !isAdmin) return null;

              const visibleItems = sec.items.filter((item) => {
                if (item.adminOnly && !isAdmin) return false;
                if (!filterQuery.trim()) return true;
                return item.label.toLowerCase().includes(filterQuery.toLowerCase());
              });

              if (visibleItems.length === 0) return null;

              return (
                <React.Fragment key={sIdx}>
                  <li className="nav-header">{sec.section}</li>
                  {visibleItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <li key={item.key} className="nav-item">
                        <button
                          type="button"
                          onClick={() => handleNavClick(item.key)}
                          className={`nav-link ${isActive ? "active" : ""}`}
                        >
                          <span className="nav-link-left">
                            <IconComponent size={15} className="nav-icon" />
                            <span className="nav-link-text">{item.label}</span>
                          </span>
                          <span className="nav-link-right">
                            {item.badge && (
                              <span className={`badge ${isActive ? "badge-dark" : "badge-secondary"}`}>
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight size={12} className="nav-arrow" />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
