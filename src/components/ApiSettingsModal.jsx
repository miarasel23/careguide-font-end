import React, { useState } from "react";
import { getApiBaseUrl, setCustomApiUrl } from "../api";
import { Server, Check, RotateCcw, X, ExternalLink } from "lucide-react";

export default function ApiSettingsModal({ isOpen, onClose }) {
  const [currentUrl, setCurrentUrl] = useState(getApiBaseUrl());
  const [testStatus, setTestStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch(`${currentUrl.replace(/\/+$/, "")}/../health`);
      if (res.ok) {
        setTestStatus({ ok: true, message: "Backend is online and responding (200 OK)!" });
      } else {
        setTestStatus({ ok: false, message: `Server returned HTTP ${res.status}` });
      }
    } catch (err) {
      // Try testing with /auth/login options
      try {
        const res2 = await fetch(`${currentUrl.replace(/\/+$/, "")}/auth/me`);
        setTestStatus({ ok: true, message: "Connected to API server!" });
      } catch (err2) {
        setTestStatus({ ok: false, message: `Failed to connect: ${err.message}` });
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setCustomApiUrl(currentUrl.trim());
    window.location.reload();
  };

  const handleReset = () => {
    setCustomApiUrl(null);
    window.location.reload();
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="modal-header-custom">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Server size={18} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>API Server Connection</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" type="button">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body-custom" style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: 13, color: "#6c757d", marginBottom: 12 }}>
            The frontend connects to this backend REST API endpoint for authentication, notes CRUD, and MongoDB aggregations:
          </p>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Active Backend Base URL:
            </label>
            <input
              type="text"
              className="form-control"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              placeholder="https://example.com/api/v1"
              style={{ fontSize: 13, fontFamily: "monospace" }}
            />
          </div>

          {testStatus && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                fontSize: 12,
                marginBottom: 12,
                background: testStatus.ok ? "#d4edda" : "#f8d7da",
                color: testStatus.ok ? "#155724" : "#721c24",
                border: `1px solid ${testStatus.ok ? "#c3e6cb" : "#f5c6cb"}`,
              }}
            >
              {testStatus.message}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <button
              onClick={handleTest}
              disabled={isTesting}
              className="btn btn-outline-dark btn-sm"
              type="button"
            >
              {isTesting ? "Testing..." : "Test Connection"}
            </button>
            <button
              onClick={() => setCurrentUrl("https://fagcf-103-77-60-145.run.pinggy-free.link/api/v1")}
              className="btn btn-secondary btn-sm"
              type="button"
            >
              Use Live Tunnel
            </button>
            <button
              onClick={() => setCurrentUrl("http://localhost:8000/api/v1")}
              className="btn btn-secondary btn-sm"
              type="button"
            >
              Use Localhost:8000
            </button>
          </div>

          <div style={{ fontSize: 11, color: "#adb5bd", borderTop: "1px solid #dee2e6", paddingTop: 10 }}>
            <span>Preset targets:</span>
            <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
              <li><strong>Live Tunnel:</strong> <code>https://fagcf-103-77-60-145.run.pinggy-free.link/api/v1</code></li>
              <li><strong>Local Dev:</strong> <code>http://localhost:8000/api/v1</code></li>
            </ul>
          </div>
        </div>

        <div className="modal-footer-custom" style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px" }}>
          <button onClick={handleReset} className="btn btn-outline-secondary btn-sm" type="button">
            <RotateCcw size={12} /> Reset to Default
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm" type="button">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-dark btn-sm" type="button">
              <Check size={12} /> Save &amp; Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

