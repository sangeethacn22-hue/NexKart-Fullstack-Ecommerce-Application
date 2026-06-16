import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nexkart_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nexkart_token");
      localStorage.removeItem("nexkart_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
};

// Products API
export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get("/products/featured"),
  getRelated: (id) => api.get(`/products/${id}/related`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Categories API
export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get("/cart"),
  addItem: (productId, quantity) =>
    api.post("/cart/add", { productId, quantity }),
  updateItem: (cartItemId, quantity) =>
    api.put("/cart/update", { cartItemId, quantity }),
  removeItem: (cartItemId) => api.delete(`/cart/remove/${cartItemId}`),
  clearCart: () => api.delete("/cart/clear"),
};

// Orders API
export const orderAPI = {
  placeOrder: (data) => api.post("/orders/place", data),
  getMyOrders: (params) => api.get("/orders", { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
  getAllOrders: (params) => api.get("/orders/admin/all", { params }),
  updateStatus: (id, status) =>
    api.put(`/orders/admin/${id}/status`, { status }),
};

// Reviews API
export const reviewAPI = {
  getProductReviews: (productId, params) =>
    api.get(`/reviews/product/${productId}`, { params }),
  addReview: (productId, data) =>
    api.post(`/reviews/product/${productId}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// Users API
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  getAddresses: () => api.get("/users/addresses"),
  addAddress: (data) => api.post("/users/addresses", data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
};

export default api;
