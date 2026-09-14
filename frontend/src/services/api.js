import axios from 'axios';
import { getShipmentByAwb, createShipment as dbCreateShipment } from './db';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach tokens if present
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('sai_admin_token');
  const userToken = localStorage.getItem('userToken');
  
  if (adminToken && config.url.includes('/admin')) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  } else if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
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

export const createMockShipment = async (data) => {
  const newShipment = dbCreateShipment(data);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, data: newShipment };
};

export const createBooking = (data) => api.post('/bookings', data);
export const sendBookingInvoice = (data) => api.post('/bookings/email-invoice', data);
export const userLogin = (data) => api.post('/users/login', data);
export const userRegister = (data) => api.post('/users/register', data);
export const googleLogin = (token) => api.post('/users/google', { token });
export const getUserMe = () => api.get('/users/me');
export const getUserShipments = () => api.get('/users/shipments');
export const sendContact = (data) => api.post('/contact', data);
export const getRates = (country) => api.get('/rates', { params: country ? { country } : {} });
export const getPageContent = (page) => api.get(`/content/${page}`);

// Admin Contact Messages endpoints
export const getMessages = () => api.get('/contact');
export const updateMessageStatus = (id, readStatus) => api.patch(`/contact/${id}`, { read: readStatus });
export const deleteMessage = (id) => api.delete(`/contact/${id}`);

// ─── Admin Auth ────────────────────────────────────────────────────────────
export const adminLogin = (data) => api.post('/admin/login', data);
export const getAdminMe = () => api.get('/admin/me');
export const getAdminStats = () => api.get('/admin/stats');
export const getCustomers = () => api.get('/admin/customers');
export const changeAdminPassword = (data) => api.post('/admin/change-password', data);
export const getAdminStaff = () => api.get('/admin/staff');
export const createAdminStaff = (data) => api.post('/admin/staff', data);
export const updateAdminStaff = (id, data) => api.put(`/admin/staff/${id}`, data);
export const deleteAdminStaff = (id) => api.delete(`/admin/staff/${id}`);

// ─── Admin Bookings ────────────────────────────────────────────────────────
export const getAdminBookings = () => api.get('/bookings');
export const updateAdminBooking = (id, data) => api.patch(`/bookings/${id}`, data);

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
