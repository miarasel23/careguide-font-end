import React, { useState, useEffect } from "react";
import { api } from "../api";
import { Users, UserPlus, Edit2, Trash2, ChevronLeft, ChevronRight, Check, AlertCircle, X } from "lucide-react";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Add User State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [newInterests, setNewInterests] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editInterests, setEditInterests] = useState("");

  const fetchUsers = async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listUsers(targetPage, 8);
      setUsers(res.data || []);
      setPage(res.page || targetPage);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const interestsArray = newInterests.split(",").map((i) => i.trim()).filter(Boolean);
      await api.createUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        interests: interestsArray,
      });
      setSuccess("User added.");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewInterests("");
      setShowAddForm(false);
      fetchUsers(1);
    } catch (err) {
      setError(err.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditInterests((user.interests || []).join(", "));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const interestsArray = editInterests.split(",").map((i) => i.trim()).filter(Boolean);
      await api.updateUser(editingUser._id, {
        name: editName,
        email: editEmail,
        role: editRole,
        interests: interestsArray,
      });
      setSuccess("User updated.");
      setEditingUser(null);
      fetchUsers(page);
    } catch (err) {
      setError(err.message || "Failed to update user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Delete user '${userEmail}'?`)) return;
    try {
      await api.deleteUser(userId);
      setSuccess("User deleted.");
      fetchUsers(page);
    } catch (err) {
      setError(err.message || "Failed to delete user.");
    }
  };

  return (
    <div>
      {/* RBAC Info Bar (Black & White) */}
      <div style={{ background: "#f9fafb", border: "1px solid #000000", borderRadius: 4, padding: "8px 12px", marginBottom: 14, fontSize: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong>Admin User Management: </strong>
          <span>Add, remove, update, and list users. Query supported by index </span>
          <code>&#123; createdAt: -1 &#125;</code>
        </div>
        <span className="role-badge role-admin">ADMIN ONLY</span>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={14} /> <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <Check size={14} /> <span>{success}</span>
        </div>
      )}

      {/* Add User Modal / Box */}
      {showAddForm && (
        <div className="card" style={{ border: "2px solid #000000" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 className="card-title" style={{ margin: 0, fontSize: "1rem" }}>
              <UserPlus size={15} /> Add New User
            </h3>
            <button onClick={() => setShowAddForm(false)} className="btn btn-secondary btn-sm">
              <X size={12} /> Cancel
            </button>
          </div>

          <form onSubmit={handleCreateUser}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="david@example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="form-select">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Interests (Comma-separated)</label>
              <input
                type="text"
                value={newInterests}
                onChange={(e) => setNewInterests(e.target.value)}
                placeholder="chess, reading, python"
                className="form-input"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 16
        }}>
          <div className="card" style={{ maxWidth: 440, width: "100%", margin: 0, border: "2px solid #000000" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 className="card-title" style={{ margin: 0, fontSize: "1rem" }}>
                <Edit2 size={15} /> Edit: {editingUser.name}
              </h3>
              <button onClick={() => setEditingUser(null)} className="btn btn-secondary btn-sm" style={{ padding: "3px 6px" }}>
                <X size={12} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="form-select">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Interests (Comma-separated)</label>
                <input
                  type="text"
                  value={editInterests}
                  onChange={(e) => setEditInterests(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {submitting ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setEditingUser(null)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table Card */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>
              <Users size={15} /> Registered Users
            </h2>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Total: <strong>{total}</strong> users
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
              <UserPlus size={12} /> Add User
            </button>
            <button onClick={() => fetchUsers(page)} className="btn btn-secondary btn-sm">
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text-muted)", fontSize: "0.825rem" }}>
            Loading users...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Interests</th>
                  <th>Created</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === "admin" ? "role-admin" : "role-user"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {(u.interests || []).map((interest, idx) => (
                        <span key={idx} className="interest-pill">
                          {interest}
                        </span>
                      ))}
                    </td>
                    <td style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 4 }}>
                        <button
                          onClick={() => handleStartEdit(u)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "3px 6px" }}
                          title="Edit"
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id, u.email)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: "3px 6px" }}
                          title="Delete"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="pagination-bar">
          <div>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => fetchUsers(page - 1)}
              disabled={page <= 1 || loading}
              className="btn btn-secondary btn-sm"
            >
              <ChevronLeft size={12} /> Previous
            </button>
            <button
              onClick={() => fetchUsers(page + 1)}
              disabled={page >= totalPages || loading}
              className="btn btn-secondary btn-sm"
            >
              Next <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
