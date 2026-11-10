import React, { useState, useEffect } from "react";
import { api } from "../api";
import { MessageSquare, Plus, Calendar, User, ChevronLeft, ChevronRight, Check, AlertCircle, RefreshCw } from "lucide-react";

export default function CommunityPostsTab({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);

  const fetchPosts = async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPosts(targetPage, 6);
      setPosts(res.data || []);
      setPage(res.page || targetPage);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load public posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPublishing(true);
    setError(null);
    setSuccess(null);

    try {
      await api.createPost({ title, content });
      setSuccess("Post published. It is now queryable via Scenario 2 $lookup.");
      setTitle("");
      setContent("");
      fetchPosts(1);
    } catch (err) {
      setError(err.message || "Failed to publish post.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div>
      {/* AdminLTE Callout: Scenario 2 Connection */}
      <div className="callout">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Scenario 2 Data Source: </strong>
            <span>Public posts feed. Foreign field <code>userId</code> is indexed via </span>
            <code>&#123; userId: 1, createdAt: -1 &#125;</code>
          </div>
          <span className="badge badge-dark">PUBLIC FEED</span>
        </div>
      </div>

      {/* AdminLTE Card: Publish Post */}
      <div className="card card-outline card-dark">
        <div className="card-header">
          <h3 className="card-title">
            <Plus size={16} />
            <span>Publish New Public Post</span>
          </h3>
          <div className="card-tools">
            <span className="badge badge-secondary">
              Author: {currentUser.name}
            </span>
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

          <form onSubmit={handlePublish}>
            <div className="form-group">
              <label className="form-label">Post Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Overview of Database Indexing Strategies"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Post Content</label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write post content here..."
                className="form-control"
              />
            </div>

            <button type="submit" disabled={publishing} className="btn btn-dark">
              {publishing ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        </div>
      </div>

      {/* AdminLTE Card: Public Posts Feed */}
      <div className="card card-outline card-dark">
        <div className="card-header">
          <h3 className="card-title">
            <MessageSquare size={16} />
            <span>Community Feed</span>
          </h3>
          <div className="card-tools">
            <span className="badge badge-secondary" style={{ marginRight: 8 }}>
              Total: {total} Posts
            </span>
            <button onClick={() => fetchPosts(page)} className="btn btn-secondary btn-xs">
              <RefreshCw size={11} /> Refresh
            </button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--admin-text-muted)" }}>
              Loading community posts...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--admin-text-muted)" }}>
              No public posts published yet.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {posts.map((post) => (
                <div key={post._id} className="note-card">
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 6, color: "#000000" }}>
                      {post.title}
                    </h4>
                    <p style={{ fontSize: "0.825rem", color: "var(--admin-text-dark)", whiteSpace: "pre-wrap", marginBottom: 12, lineHeight: 1.45 }}>
                      {post.content}
                    </p>
                  </div>

                  <div style={{ borderTop: "1px solid var(--admin-border-subtle)", paddingTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "var(--admin-text-dark)", marginBottom: 3 }}>
                      <User size={11} />
                      <span>Author: <strong>{post.authorName || "User"}</strong></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "var(--admin-text-muted)" }}>
                      <Calendar size={11} />
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleString() : "Recently"}</span>
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
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total posts)
            </span>
            <div className="pagination-controls">
              <button
                onClick={() => fetchPosts(page - 1)}
                disabled={page <= 1 || loading}
                className="btn btn-secondary btn-xs"
              >
                <ChevronLeft size={12} /> Prev
              </button>
              <button
                onClick={() => fetchPosts(page + 1)}
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
