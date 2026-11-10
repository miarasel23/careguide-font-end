import React from "react";
import {
  BookOpen,
  Key,
  Shield,
  Layers,
  Database,
  ExternalLink,
  CheckCircle2,
  Server,
  FileText,
  Users,
  Code2,
} from "lucide-react";

export default function UserGuideTab({ currentUser, onSelectTab }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Welcome Banner */}
      <div className="card card-outline card-dark">
        <div className="card-header">
          <h3 className="card-title">
            <BookOpen size={18} />
            <span>Secure Notes Platform — Comprehensive User &amp; Evaluation Guide</span>
          </h3>
          <div className="card-tools">
            <span className="badge badge-dark">CARE GUIDE INTERVIEW</span>
          </div>
        </div>

        <div className="card-body">
          <div className="callout">
            This platform was built to satisfy all constraints of the <strong>Backend Technical Interview Task</strong>:
            Python FastAPI adhering to the <strong>Care Guide Interview Architecture</strong>, <strong>Strict MongoDB ESR Indexing</strong> (Zero Unnecessary Indexes), and <strong>MongoDB Aggregation Pipelines</strong> (Scenarios 1 &amp; 2), paired with a responsive <strong>React.js (AdminLTE 3 + Tailwind CSS)</strong> dashboard.
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="btn btn-dark btn-sm"
              style={{ textDecoration: "none" }}
            >
              <ExternalLink size={12} /> Interactive Swagger API Docs (:8000/docs)
            </a>
            <button
              onClick={() => onSelectTab("indexing")}
              className="btn btn-secondary btn-sm"
            >
              <Database size={12} /> Live Index Audit (ESR Rule)
            </button>
            <button
              onClick={() => onSelectTab("aggregations")}
              className="btn btn-secondary btn-sm"
            >
              <Layers size={12} /> Aggregation Pipelines (Scenarios 1 &amp; 2)
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Demo Accounts & RBAC Matrix */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {/* Demo Accounts Card */}
        <div className="card card-outline card-dark">
          <div className="card-header">
            <h4 className="card-title">
              <Key size={15} />
              <span>Pre-Seeded Demo Accounts</span>
            </h4>
            <div className="card-tools">
              <span className="badge badge-secondary">Instant Sign In</span>
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Scope</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="badge badge-dark">ADMIN</span>
                    </td>
                    <td><code>admin@example.com</code></td>
                    <td><code>Admin@123</code></td>
                    <td style={{ fontSize: "0.75rem" }}>Full platform access, All Notes, User CRUD, Aggregations</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="badge badge-secondary">USER</span>
                    </td>
                    <td><code>user@example.com</code></td>
                    <td><code>User@123</code></td>
                    <td style={{ fontSize: "0.75rem" }}>Personal Notes CRUD, Community Feed, Aggregations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RBAC Rules Matrix */}
        <div className="card card-outline card-dark">
          <div className="card-header">
            <h4 className="card-title">
              <Shield size={15} />
              <span>Role-Based Access Control (RBAC)</span>
            </h4>
            <div className="card-tools">
              <span className="badge badge-dark">JWT Bearer</span>
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Capability / Endpoint</th>
                    <th>Standard User</th>
                    <th>Administrator</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Manage Personal Notes (CRUD)</td>
                    <td><CheckCircle2 size={13} style={{ color: "#000" }} /> Allowed</td>
                    <td><CheckCircle2 size={13} style={{ color: "#000" }} /> Allowed</td>
                  </tr>
                  <tr>
                    <td>View All Platform Notes</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>Forbidden (403)</td>
                    <td><CheckCircle2 size={13} style={{ color: "#000" }} /> Allowed</td>
                  </tr>
                  <tr>
                    <td>User Management (Create/Edit/Delete)</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>Forbidden (403)</td>
                    <td><CheckCircle2 size={13} style={{ color: "#000" }} /> Allowed</td>
                  </tr>
                  <tr>
                    <td>Scenario 1 &amp; 2 Aggregations</td>
                    <td><CheckCircle2 size={13} style={{ color: "#000" }} /> Allowed</td>
                    <td><CheckCircle2 size={13} style={{ color: "#000" }} /> Allowed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Database Indexing Strategy Walkthrough */}
      <div className="card card-outline card-dark">
        <div className="card-header">
          <h4 className="card-title">
            <Database size={15} />
            <span>MongoDB Indexing Strategy (Strict ESR Rule Compliance)</span>
          </h4>
          <div className="card-tools">
            <span className="badge badge-dark">7 Custom Indexes Total</span>
          </div>
        </div>

        <div className="card-body">
          <div className="callout">
            <strong>Critical Constraint Evaluated:</strong> "DO NOT MAKE ANY UNNECESSARY INDEXES. You will be evaluated on the efficiency of your indexing strategy."
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Index Key Pattern</th>
                  <th>Index Type</th>
                  <th>ESR Justification &amp; Query Optimization</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>users</code></td>
                  <td><code>&#123; email: 1 &#125;</code></td>
                  <td><span className="badge badge-dark">UNIQUE</span></td>
                  <td>Guarantees unique account identity and enables O(1) B-tree lookup during login and registration.</td>
                </tr>
                <tr>
                  <td><code>users</code></td>
                  <td><code>&#123; createdAt: -1 &#125;</code></td>
                  <td><span className="badge badge-secondary">DESCENDING</span></td>
                  <td>Serves admin paginated user list sorted newest first without triggering an in-memory sort stage.</td>
                </tr>
                <tr>
                  <td><code>users</code></td>
                  <td><code>&#123; interests: 1 &#125;</code></td>
                  <td><span className="badge badge-secondary">MULTIKEY</span></td>
                  <td>Indexes elements of the <code>interests</code> array for Scenario 1 aggregation ($match non-empty and $unwind).</td>
                </tr>
                <tr>
                  <td><code>notes</code></td>
                  <td><code>&#123; userId: 1, createdAt: -1 &#125;</code></td>
                  <td><span className="badge badge-dark">COMPOUND (ESR)</span></td>
                  <td><strong>Exact ESR rule:</strong> Equality on <code>userId</code> filters to the user's notes, Sort on <code>createdAt: -1</code> streams results without in-memory sorting.</td>
                </tr>
                <tr>
                  <td><code>notes</code></td>
                  <td><code>&#123; createdAt: -1 &#125;</code></td>
                  <td><span className="badge badge-secondary">DESCENDING</span></td>
                  <td>Serves platform-wide global notes listing for admin oversight with chronological sorting.</td>
                </tr>
                <tr>
                  <td><code>posts</code></td>
                  <td><code>&#123; userId: 1, createdAt: -1 &#125;</code></td>
                  <td><span className="badge badge-dark">COMPOUND</span></td>
                  <td>Optimizes foreign collection join in Scenario 2 ($lookup matches <code>userId</code> and sorts user posts).</td>
                </tr>
                <tr>
                  <td><code>posts</code></td>
                  <td><code>&#123; createdAt: -1 &#125;</code></td>
                  <td><span className="badge badge-secondary">DESCENDING</span></td>
                  <td>Serves public community discussion feed pagination chronologically.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Aggregation Scenarios Walkthrough */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {/* Scenario 1 Box */}
        <div className="card card-outline card-dark">
          <div className="card-header">
            <h4 className="card-title">
              <Layers size={15} />
              <span>Scenario 1: Group Users by Interests</span>
            </h4>
            <div className="card-tools">
              <span className="badge badge-dark">1 aggregate() call</span>
            </div>
          </div>

          <div className="card-body">
            <p style={{ fontSize: "0.825rem", color: "var(--admin-text-dark)", marginBottom: 8 }}>
              Groups all users by individual interests and counts users per interest using a single pipeline.
            </p>
            <div className="code-box">
              {`db.users.aggregate([
  { $match: { interests: { $exists: true, $ne: [] } } },
  { $unwind: "$interests" },
  { $group: { 
      _id: "$interests", 
      userCount: { $sum: 1 }, 
      users: { $push: { name: "$name", email: "$email", role: "$role" } } 
    } 
  },
  { $sort: { _id: 1 } },
  { $project: { _id: 0, interest: "$_id", userCount: 1, users: 1 } }
])`}
            </div>
            <button onClick={() => onSelectTab("aggregations")} className="btn btn-secondary btn-xs">
              Open Interactive Scenario 1 &rarr;
            </button>
          </div>
        </div>

        {/* Scenario 2 Box */}
        <div className="card card-outline card-dark">
          <div className="card-header">
            <h4 className="card-title">
              <Layers size={15} />
              <span>Scenario 2: User Posts ($lookup Join)</span>
            </h4>
            <div className="card-tools">
              <span className="badge badge-dark">$lookup pipeline</span>
            </div>
          </div>

          <div className="card-body">
            <p style={{ fontSize: "0.825rem", color: "var(--admin-text-dark)", marginBottom: 8 }}>
              Joins posts from a separate collection for a user in a single pipeline without multiple queries.
            </p>
            <div className="code-box">
              {`db.users.aggregate([
  { $match: { _id: ObjectId(userId) } },
  { $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "userId",
      as: "posts"
    }
  },
  { $project: {
      _id: 1, name: 1, email: 1, role: 1, interests: 1,
      postsCount: { $size: "$posts" },
      posts: 1
    }
  }
])`}
            </div>
            <button onClick={() => onSelectTab("aggregations")} className="btn btn-secondary btn-xs">
              Open Interactive Scenario 2 &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Care Guide Interview Architecture Layout */}
      <div className="card card-outline card-dark">
        <div className="card-header">
          <h4 className="card-title">
            <Server size={15} />
            <span>Care Guide Interview Architecture Structure</span>
          </h4>
          <div className="card-tools">
            <span className="badge badge-dark">FastAPI Python</span>
          </div>
        </div>

        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            <div style={{ background: "#fafafa", border: "1px solid #dee2e6", padding: 12, borderRadius: 4 }}>
              <strong>core/</strong>
              <p style={{ fontSize: "0.775rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                <code>config.py</code> (Pydantic v2 Settings) and <code>database.py</code> (PyMongo client with in-memory Mongomock fallback &amp; index initializer).
              </p>
            </div>
            <div style={{ background: "#fafafa", border: "1px solid #dee2e6", padding: 12, borderRadius: 4 }}>
              <strong>modules/apiResponse/</strong>
              <p style={{ fontSize: "0.775rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Care Guide Interview unified response envelope: <code>custom_response()</code>, <code>ApiResponseCode</code>, and global exception handlers.
              </p>
            </div>
            <div style={{ background: "#fafafa", border: "1px solid #dee2e6", padding: 12, borderRadius: 4 }}>
              <strong>modules/{'{domain}'}/</strong>
              <p style={{ fontSize: "0.775rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Modular domain segregation: <code>models.py</code> (indexes &amp; schema), <code>schemas.py</code>, <code>repository.py</code>, and <code>routers.py</code>.
              </p>
            </div>
            <div style={{ background: "#fafafa", border: "1px solid #dee2e6", padding: 12, borderRadius: 4 }}>
              <strong>services/ &amp; seeds/</strong>
              <p style={{ fontSize: "0.775rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                CORS policy, JWT decoding with RBAC middlewares (<code>require_admin</code>), native Bcrypt hashing, and seeder suite.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Information Card */}
      <div className="card card-outline card-dark">
        <div className="card-header">
          <h4 className="card-title">
            <CheckCircle2 size={15} />
            <span>Developer &amp; Candidate Submission Details</span>
          </h4>
          <div className="card-tools">
            <span className="badge badge-dark">AUTHOR</span>
          </div>
        </div>

        <div className="card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#000000" }}>
                Md Rasel Mia
              </div>
              <div style={{ fontSize: "0.825rem", color: "var(--admin-text-dark)", marginTop: 2 }}>
                Phone: <strong>01997709990</strong> &bull; Email: <strong>eng.rasel1994@gmail.com</strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="tel:01997709990" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>
                Call: 01997709990
              </a>
              <a href="mailto:eng.rasel1994@gmail.com" className="btn btn-dark btn-sm" style={{ textDecoration: "none" }}>
                Email: eng.rasel1994@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

