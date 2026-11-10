import React, { useState, useEffect } from "react";
import { api } from "../api";
import { Globe, Calendar, User, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

export default function AllNotesTab() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllNotes = async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAllNotes(targetPage, 6);
      setNotes(res.data || []);
      setPage(res.page || targetPage);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load global notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotes(1);
  }, []);

  return (
    <div>
      {/* AdminLTE Callout: RBAC Privilege */}
      <div className="callout">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Administrator Privilege: </strong>
            <span>Viewing all platform notes. Backed by single-field index </span>
            <code>&#123; createdAt: -1 &#125;</code>
          </div>
          <span className="badge badge-dark">ADMIN ONLY</span>
        </div>
      </div>

      {/* AdminLTE Card: Global Notes */}
      <div className="card card-outline card-dark">
        <div className="card-header">
          <h3 className="card-title">
            <Globe size={16} />
            <span>Platform-Wide Notes Directory</span>
          </h3>
          <div className="card-tools">
            <span className="badge badge-secondary" style={{ marginRight: 8 }}>
              Total Notes: {total}
            </span>
            <button
              onClick={() => fetchAllNotes(page)}
              className="btn btn-secondary btn-xs"
              title="Refresh notes list"
            >
              <RefreshCw size={11} /> Refresh
            </button>
          </div>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={14} /> <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--admin-text-muted)" }}>
              Loading platform notes...
            </div>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--admin-text-muted)" }}>
              No platform notes found.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {notes.map((note) => (
                <div key={note._id} className="note-card">
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 6, color: "#000000" }}>
                      {note.title}
                    </h4>
                    <p style={{ fontSize: "0.825rem", color: "var(--admin-text-dark)", whiteSpace: "pre-wrap", marginBottom: 12, lineHeight: 1.45 }}>
                      {note.content}
                    </p>
                  </div>

                  <div style={{ borderTop: "1px solid var(--admin-border-subtle)", paddingTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "var(--admin-text-dark)", marginBottom: 3 }}>
                      <User size={11} />
                      <span>Author: <strong>{note.authorName || "User"}</strong> ({note.authorEmail || note.userId})</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "var(--admin-text-muted)" }}>
                      <Calendar size={11} />
                      <span>{note.createdAt ? new Date(note.createdAt).toLocaleString() : "Recently"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer: Pagination */}
        <div className="card-footer">
          <div className="pagination-bar" style={{ margin: 0, padding: 0, border: "none" }}>
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total notes)
            </span>
            <div className="pagination-controls">
              <button
                onClick={() => fetchAllNotes(page - 1)}
                disabled={page <= 1 || loading}
                className="btn btn-secondary btn-xs"
              >
                <ChevronLeft size={12} /> Prev
              </button>
              <button
                onClick={() => fetchAllNotes(page + 1)}
                disabled={page >= totalPages || loading}
                className="btn btn-secondary btn-xs"
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
