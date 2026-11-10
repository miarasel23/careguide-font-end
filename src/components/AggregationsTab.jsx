import React, { useState, useEffect } from "react";
import { api } from "../api";
import { Layers, Users, FileText, RefreshCw, AlertCircle } from "lucide-react";

export default function AggregationsTab() {
  const [activeScenario, setActiveScenario] = useState("scenario1");

  // Scenario 1 State
  const [interestGroups, setInterestGroups] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [error1, setError1] = useState(null);

  // Scenario 2 State
  const [usersList, setUsersList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userPostsData, setUserPostsData] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState(null);

  const fetchScenario1 = async () => {
    setLoading1(true);
    setError1(null);
    try {
      const res = await api.getGroupByInterests();
      setInterestGroups(res.data || []);
    } catch (err) {
      setError1(err.message || "Failed to load Scenario 1 aggregation.");
    } finally {
      setLoading1(false);
    }
  };

  const fetchUsersForDropdown = async () => {
    try {
      const res = await api.listUsers(1, 50);
      const list = res.data || [];
      setUsersList(list);
      if (list.length > 0 && !selectedUserId) {
        setSelectedUserId(list[0]._id);
      }
    } catch {
      // Ignore
    }
  };

  const fetchScenario2 = async (userId) => {
    if (!userId) return;
    setLoading2(true);
    setError2(null);
    try {
      const res = await api.getUserPostsWithLookup(userId);
      setUserPostsData(res.data || null);
    } catch (err) {
      setError2(err.message || "Failed to load Scenario 2 lookup aggregation.");
    } finally {
      setLoading2(false);
    }
  };

  useEffect(() => {
    fetchScenario1();
    fetchUsersForDropdown();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchScenario2(selectedUserId);
    }
  }, [selectedUserId]);

  return (
    <div>
      {/* Sub-tab selection (AdminLTE Nav Tabs) */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setActiveScenario("scenario1")}
          className={`tab-btn ${activeScenario === "scenario1" ? "active" : ""}`}
        >
          <Users size={14} /> Scenario 1: Group by Interests
        </button>
        <button
          onClick={() => setActiveScenario("scenario2")}
          className={`tab-btn ${activeScenario === "scenario2" ? "active" : ""}`}
        >
          <Layers size={14} /> Scenario 2: User Posts ($lookup)
        </button>
      </div>

      {/* =========================================================================
          SCENARIO 1: GROUP BY INTERESTS
          ========================================================================= */}
      {activeScenario === "scenario1" && (
        <div>
          <div className="card card-outline card-dark">
            <div className="card-header">
              <h3 className="card-title">
                <Users size={16} />
                <span>Scenario 1: Users Grouped by Interests</span>
              </h3>
              <div className="card-tools">
                <span className="badge badge-dark" style={{ marginRight: 8 }}>
                  1 AGGREGATE() CALL
                </span>
                <button onClick={fetchScenario1} className="btn btn-secondary btn-xs">
                  <RefreshCw size={11} /> Run Aggregation
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="callout">
                <strong>Interview Constraint:</strong> Exactly one <code>collection.aggregate()</code> call &bull; 
                <strong> Supporting Index:</strong> Multikey index <code>&#123; interests: 1 &#125;</code>
              </div>

              <div className="code-box">
                {`// EXACTLY ONE collection.aggregate() call:
db.users.aggregate([
  { $match: { interests: { $exists: true, $ne: [] } } },
  { $unwind: "$interests" },
  { $group: { _id: "$interests", userCount: { $sum: 1 }, users: { $push: { name: "$name", email: "$email", role: "$role" } } } },
  { $sort: { _id: 1 } },
  { $project: { _id: 0, interest: "$_id", userCount: 1, users: 1 } }
])`}
              </div>

              {error1 && (
                <div className="alert alert-error">
                  <AlertCircle size={14} /> <span>{error1}</span>
                </div>
              )}

              {loading1 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "var(--admin-text-muted)" }}>
                  Executing aggregation pipeline on MongoDB...
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginTop: 16 }}>
                  {interestGroups.map((group, idx) => (
                    <div key={idx} className="note-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span className="interest-pill" style={{ padding: "3px 8px" }}>
                          {group.interest}
                        </span>
                        <span className="badge badge-dark">
                          {group.userCount} {group.userCount === 1 ? "user" : "users"}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {(group.users || []).map((u, uIdx) => (
                          <div
                            key={uIdx}
                            style={{
                              background: "#f8f9fa",
                              border: "1px solid var(--admin-border-light)",
                              borderRadius: 4,
                              padding: "6px 10px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: "0.8rem",
                            }}
                          >
                            <div>
                              <strong>{u.name}</strong>
                              <div style={{ fontSize: "0.7rem", color: "var(--admin-text-muted)", fontFamily: "var(--font-mono)" }}>
                                {u.email}
                              </div>
                            </div>
                            <span className={`badge ${u.role === "admin" ? "badge-dark" : "badge-secondary"}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCENARIO 2: USER POSTS ($lookup)
          ========================================================================= */}
      {activeScenario === "scenario2" && (
        <div>
          <div className="card card-outline card-dark">
            <div className="card-header">
              <h3 className="card-title">
                <Layers size={16} />
                <span>Scenario 2: User Profile with Joined Posts ($lookup)</span>
              </h3>
              <div className="card-tools">
                <span className="badge badge-dark">FOREIGN JOIN</span>
              </div>
            </div>

            <div className="card-body">
              <div className="callout">
                <strong>Interview Constraint:</strong> Single aggregation pipeline with a <code>$lookup</code> stage &bull; 
                <strong> Supporting Index:</strong> Compound index on foreign collection <code>&#123; userId: 1, createdAt: -1 &#125;</code>
              </div>

              <div className="code-box">
                {`// Single aggregation pipeline with $lookup stage:
db.users.aggregate([
  { $match: { _id: ObjectId("${selectedUserId || "..."}") } },
  { $lookup: { from: "posts", localField: "_id", foreignField: "userId", as: "posts" } },
  { $project: { _id: 1, name: 1, email: 1, role: 1, interests: 1, postsCount: { $size: "$posts" }, posts: 1 } }
])`}
              </div>

              {/* Selector Box */}
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Select User Account for $lookup Pipeline:</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="form-control"
                  >
                    {usersList.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email}) &bull; {u.role.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => fetchScenario2(selectedUserId)}
                  className="btn btn-dark"
                  style={{ marginTop: 22 }}
                >
                  <RefreshCw size={12} /> Execute $lookup
                </button>
              </div>

              {error2 && (
                <div className="alert alert-error">
                  <AlertCircle size={14} /> <span>{error2}</span>
                </div>
              )}

              {loading2 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "var(--admin-text-muted)" }}>
                  Executing $lookup pipeline on MongoDB...
                </div>
              ) : userPostsData ? (
                <div className="card card-outline card-dark" style={{ marginTop: 14 }}>
                  <div className="card-header">
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#000000", margin: 0 }}>
                        {userPostsData.name}
                      </h4>
                      <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
                        {userPostsData.email} &bull;{" "}
                        <span className={`badge ${userPostsData.role === "admin" ? "badge-dark" : "badge-secondary"}`}>
                          {userPostsData.role.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#000000" }}>
                        {userPostsData.postsCount}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "var(--admin-text-muted)", textTransform: "uppercase" }}>
                        Posts Joined
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div style={{ marginBottom: 14 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", marginRight: 6 }}>Interests:</span>
                      {(userPostsData.interests || []).map((i, idx) => (
                        <span key={idx} className="interest-pill">
                          {i}
                        </span>
                      ))}
                    </div>

                    <h5 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                      <FileText size={13} /> Joined Posts Collection ($lookup result)
                    </h5>

                    {(userPostsData.posts || []).length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px", background: "#f8f9fa", border: "1px solid var(--admin-border-light)", borderRadius: 4, color: "var(--admin-text-muted)", fontSize: "0.8rem" }}>
                        No posts found for this user in the separate posts collection.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {(userPostsData.posts || []).map((p) => (
                          <div
                            key={p._id}
                            style={{
                              background: "#ffffff",
                              border: "1px solid var(--admin-border-light)",
                              borderRadius: 4,
                              padding: 12,
                            }}
                          >
                            <h6 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#000000", marginBottom: 4 }}>
                              {p.title}
                            </h6>
                            <p style={{ fontSize: "0.825rem", color: "var(--admin-text-dark)", whiteSpace: "pre-wrap", marginBottom: 6 }}>
                              {p.content}
                            </p>
                            <div style={{ fontSize: "0.7rem", color: "var(--admin-text-muted)" }}>
                              Published: {p.createdAt ? new Date(p.createdAt).toLocaleString() : "Recently"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
