import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach admin token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sai_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sai_admin_token');
      localStorage.removeItem('sai_admin_user');
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

// ─── Public endpoints ──────────────────────────────────────────────────────
export const trackShipment = (awb) => api.get(`/tracking/${encodeURIComponent(awb)}`);
export const createBooking = (data) => api.post('/bookings', data);
export const sendContact = (data) => api.post('/contact', data);
export const getRates = (country) => api.get('/rates', { params: country ? { country } : {} });
export const getPageContent = (page) => api.get(`/content/${page}`);

// ─── Admin Auth ────────────────────────────────────────────────────────────
export const adminLogin = (data) => api.post('/admin/login', data);
export const getAdminMe = () => api.get('/admin/me');
export const changeAdminPassword = (data) => api.post('/admin/change-password', data);

// ─── Admin Content CMS ─────────────────────────────────────────────────────
export const getAllContentPages = () => api.get('/content');
export const updatePageContent = (page, sections) => api.put(`/content/${page}`, { sections });
export const updatePageSection = (page, section, data) =>
  api.patch(`/content/${page}`, { section, data });

// ─── ImageKit ─────────────────────────────────────────────────────────────
export const getImageKitAuth = () => api.get('/imagekit/auth');
export const listImageKitFiles = (folder = '/sai-couriers') =>
  api.get('/imagekit/files', { params: { folder } });
export const deleteImageKitFile = (fileId) => api.delete(`/imagekit/files/${fileId}`);

export default api;
