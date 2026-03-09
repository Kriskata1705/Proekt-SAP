
import axios from 'axios';
// Configure base URL - change this to your Spring Boot backend
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// ==================== USERS API ====================
export const usersAPI = {
  getAll: () => api.get('/users'),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ==================== DOCUMENTS API ====================
export const documentsAPI = {
  getAll: () => api.get('/documents'),
  getOne: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post('/documents', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  export: (id, format = 'txt') => api.get(`/documents/${id}/export?format=${format}`),
};

// ==================== VERSIONS API ====================
export const versionsAPI = {
  getAll: (docId) => api.get(`/documents/${docId}/versions`),
  getOne: (docId, versionId) => api.get(`/documents/${docId}/versions/${versionId}`),
  create: (docId, data) => api.post(`/documents/${docId}/versions`, data),
  update: (docId, versionId, data) => api.put(`/documents/${docId}/versions/${versionId}`, data),
  submit: (docId, versionId) => api.post(`/documents/${docId}/versions/${versionId}/submit`),
  review: (docId, versionId, data) => api.post(`/documents/${docId}/versions/${versionId}/review`, data),
  getDiff: (docId, v1, v2) => api.get(`/documents/${docId}/diff?v1=${v1}&v2=${v2}`),
};

// ==================== COMMENTS API ====================
export const commentsAPI = {
  getAll: (versionId) => api.get(`/versions/${versionId}/comments`),
  create: (versionId, content) => api.post(`/versions/${versionId}/comments`, { content }),
};

// ==================== AUDIT LOGS API ====================
export const auditAPI = {
  getAll: (limit = 100) => api.get(`/audit-logs?limit=${limit}`),
  getByDocument: (docId) => api.get(`/documents/${docId}/audit-logs`),
};

// ==================== STATS API ====================
export const statsAPI = {
  get: () => api.get('/stats'),
};

export default api;
