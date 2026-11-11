const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("custom_api_url");
    if (custom) return custom;
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname.includes("github.io")) {
      return "https://fagcf-103-77-60-150.run.pinggy-free.link/api/v1";
    }
    if (window.location.hostname.includes("onrender.com")) {
      return "https://careguide-back-end-node.onrender.com/api/v1";
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      if (window.location.port === "3000") {
        return "/api/v1";
      }
      return "http://localhost:8000/api/v1";
    }
  }
  return "/api/v1";
};

export const getApiBaseUrl = getBaseUrl;
export const setCustomApiUrl = (url) => {
  if (url) {
    localStorage.setItem("custom_api_url", url);
  } else {
    localStorage.removeItem("custom_api_url");
  }
};

export const getStoredToken = () => localStorage.getItem("auth_token");
export const setStoredToken = (token) => localStorage.setItem("auth_token", token);
export const clearStoredToken = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem("auth_user", JSON.stringify(user));
};

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `HTTP error ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  getProfile: () => request("/auth/me"),

  // Notes
  getUserNotes: (page = 1, limit = 6) => request(`/notes?page=${page}&limit=${limit}`),
  getAllNotes: (page = 1, limit = 6) => request(`/notes/all?page=${page}&limit=${limit}`),
  getNote: (id) => request(`/notes/${id}`),
  createNote: (payload) => request("/notes", { method: "POST", body: JSON.stringify(payload) }),
  updateNote: (id, payload) => request(`/notes/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: "DELETE" }),

  // Admin User Management
  listUsers: (page = 1, limit = 10) => request(`/admin/users?page=${page}&limit=${limit}`),
  createUser: (payload) => request("/admin/users", { method: "POST", body: JSON.stringify(payload) }),
  getUser: (id) => request(`/admin/users/${id}`),
  updateUser: (id, payload) => request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),

  // Aggregations
  getGroupByInterests: () => request("/aggregations/group-by-interests"),
  getUserPostsWithLookup: (userId) => request(`/aggregations/user-posts/${userId}`),
  getIndexes: () => request("/aggregations/indexes"),

  // Community Posts
  getPosts: (page = 1, limit = 6) => request(`/posts?page=${page}&limit=${limit}`),
  createPost: (payload) => request("/posts", { method: "POST", body: JSON.stringify(payload) }),
};

