import React, { useState } from "react";
import { api, setStoredToken, setStoredUser } from "../api";
import { Lock, AlertCircle, X, Shield, User } from "lucide-react";

export default function AuthModal({ onAuthSuccess, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [interests, setInterests] = useState("chess, reading");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickFill = (roleType) => {
    if (roleType === "admin") {
      setIsRegister(false);
      setEmail("admin@example.com");
      setPassword("Admin@123");
    } else {
      setIsRegister(false);
      setEmail("user@example.com");
      setPassword("User@123");
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      if (isRegister) {
        const interestsArray = interests.split(",").map((i) => i.trim()).filter(Boolean);
        res = await api.register({
          name,
          email,
          password,
          role,
          interests: interestsArray,
        });
      } else {
        res = await api.login({ email, password });
      }

      if (res?.data?.token && res?.data?.user) {
        setStoredToken(res.data.token);
        setStoredUser(res.data.user);
        onAuthSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1050,
      padding: 16
    }}>
      <div className="card card-outline card-dark" style={{ maxWidth: 440, width: "100%", margin: 0, boxShadow: "0 10px 25px rgba(0,0,0,0.4)" }}>
        <div className="card-header">
          <h3 className="card-title">
            <Lock size={16} />
            <span>{isRegister ? "AdminLTE Register" : "AdminLTE Sign In"}</span>
          </h3>
          <div className="card-tools">
            {onClose && (
              <button onClick={onClose} className="btn btn-secondary btn-xs">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Quick Fill Box */}
          <div className="callout" style={{ padding: "8px 12px", marginBottom: 14 }}>
            <div style={{ fontSize: "0.7rem", color: "#000000", marginBottom: 6, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Quick Demo Fill:
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className="btn btn-secondary btn-xs"
                style={{ flex: 1 }}
              >
                <Shield size={11} /> Admin (admin@example.com)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("user")}
                className="btn btn-secondary btn-xs"
                style={{ flex: 1 }}
              >
                <User size={11} /> User (user@example.com)
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="form-control"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control"
              />
            </div>

            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label">Account Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Interests (Comma-separated)</label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="chess, reading, coding"
                    className="form-control"
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn btn-dark" style={{ width: "100%", marginTop: 8 }}>
              {loading ? "Authenticating..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: 14, textAlign: "center", fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
            {isRegister ? "Already registered? " : "New here? "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              style={{ background: "none", border: "none", color: "#000000", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}
            >
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
