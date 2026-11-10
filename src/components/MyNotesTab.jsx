import React, { useState, useEffect } from "react";
import { api } from "../api";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";

export default function MyNotesTab({ currentUser }) {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchNotes = async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getUserNotes(targetPage, 6);
      setNotes(res.data || []);
      setPage(res.page || targetPage);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(1);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        await api.updateNote(editingId, { title, content });
        setSuccess("Note updated successfully.");
      } else {
        await api.createNote({ title, content });
        setSuccess("Note created successfully.");
      }
      setTitle("");
      setContent("");
      setEditingId(null);
      fetchNotes(1);
    } catch (err) {
      setError(err.message || "Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setError(null);
    setSuccess(null);
    try {
      await api.deleteNote(id);
      setSuccess("Note deleted successfully.");
      fetchNotes(page);
    } catch (err) {
      setError(err.message || "Failed to delete note.");
    }
  };

  return (
    <div>
      {/* AdminLTE Callout: Indexing Strategy */}
      <div className="callout">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Database Index Optimization: </strong>
            <span>Queries are served by compound index </span>
            <code>&#123; userId: 1, createdAt: -1 &#125;</code>
            <span style={{ color: "var(--admin-text-muted)" }}> (ESR Rule Compliant)</span>
          </div>
          <span className="badge badge-dark">OPTIMIZED</span>
        </div>
      </div>

      {/* AdminLTE Card: Note Creator / Editor */}
      <div className="card card-outline card-dark">
        <div className="card-header">
          <h3 className="card-title">
            {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
            <span>{editingId ? "Edit Note" : "Create New Note"}</span>
          </h3>
          <div className="card-tools">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary btn-xs"
              >
                <X size={12} /> Cancel Edit
              </button>
            )}
          </div>
        </div>

        <div className="card-body">
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

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Note Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. System architecture notes"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Note Content</label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note markdown or content here..."
                className="form-control"
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={saving} className="btn btn-dark">
                {saving ? "Saving..." : editingId ? "Update Note" : "Save Note"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* AdminLTE Card: Notes List */}
      <div className="card card-outline card-dark">
        <div className="card-header">
          <h3 className="card-title">
            <FileText size={16} />
            <span>My Notes Collection</span>
          </h3>
          <div className="card-tools">
            <span className="badge badge-secondary" style={{ marginRight: 8 }}>
              Total: {total}
            </span>
            <button
              onClick={() => fetchNotes(page)}
              className="btn btn-secondary btn-xs"
              title="Refresh notes list"
            >
              <RefreshCw size={11} /> Refresh
            </button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--admin-text-muted)" }}>
              Loading notes from database...
            </div>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--admin-text-muted)" }}>
              No notes created yet. Use the form above to create your first secure note.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 14,
              }}
            >
              {notes.map((note) => (
                <div key={note._id} className="note-card">
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 6,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "#000000",
                          margin: 0,
                        }}
                      >
                        {note.title}
                      </h4>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="btn btn-secondary btn-xs"
                          title="Edit note"
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="btn btn-danger btn-xs"
                          title="Delete note"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: "0.825rem",
                        color: "var(--admin-text-dark)",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.4,
                        marginBottom: 10,
                      }}
                    >
                      {note.content}
                    </p>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid var(--admin-border-subtle)",
                      paddingTop: 8,
                      fontSize: "0.7rem",
                      color: "var(--admin-text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Calendar size={11} />
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
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
                disabled={page <= 1 || loading}
                onClick={() => fetchNotes(page - 1)}
                className="btn btn-secondary btn-xs"
              >
                <ChevronLeft size={12} /> Prev
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => fetchNotes(page + 1)}
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
