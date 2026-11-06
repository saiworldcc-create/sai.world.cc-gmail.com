import axios from 'axios';
import { getShipmentByAwb, createShipment as dbCreateShipment } from './db';

const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform && window.Capacitor.isNativePlatform()) {
    // Android emulator loopback to host PC port 5000
    if (!envUrl || envUrl.includes('localhost') || envUrl.startsWith('/')) {
      return 'http://10.0.2.2:5000/api/v1';
    }
  }
  return envUrl || '/api/v1';
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach tokens if present
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('sai_admin_token');
  const userToken = localStorage.getItem('userToken');
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  
  if (isAdminRoute && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (!isAdminRoute && userToken) {
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
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('sai_admin_token');
        localStorage.removeItem('sai_admin_user');
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      } else {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        const path = window.location.pathname;
        if (path.startsWith('/vendor') && path !== '/vendor/login') {
          window.location.href = '/vendor/login';
        } else if (path.startsWith('/delivery') && path !== '/delivery/login') {
          window.location.href = '/delivery/login';
        } else if (path.startsWith('/dashboard') && path !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export const trackShipment = (awb) => api.get(`/tracking/${encodeURIComponent(awb)}`);
export const updateDeliveryPreferences = (awb, data) => api.put(`/tracking/preferences/${encodeURIComponent(awb)}`, data);
export const uploadTrackingDocument = (awb, data) => api.put(`/tracking/documents/${encodeURIComponent(awb)}`, data);

export const getAdminShipments = () => api.get('/admin/shipments');
export const getDeliveryPartners = () => api.get('/admin/delivery-partners');
export const assignShipmentToDriver = (id, driverId) => api.put(`/admin/shipments/${id}/assign`, { driverId });

export const createMockShipment = (data) => api.post('/admin/shipments', data);
export const updateShipment = (awb, data) => api.put(`/admin/shipments/${encodeURIComponent(awb)}`, data);

export const createBooking = (data) => api.post('/bookings', data);
export const sendBookingInvoice = (data) => api.post('/bookings/email-invoice', data);
export const userLogin = (data) => api.post('/users/login', data);
export const userRegister = (data) => api.post('/users/register', data);
export const googleLogin = (token) => api.post('/users/google', { token });
export const getUserMe = () => api.get('/users/me');
export const getUserShipments = () => api.get('/users/shipments');
export const sendContact = (data) => api.post('/contact', data);
export const uploadMedia = (formData) => api.post('/imagekit/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getAdminSettings = () => api.get('/admin/settings');
export const updateAdminSetting = (data) => api.post('/admin/settings', data);

export const getRates = (country) => api.get('/rates', { params: country ? { country } : {} });
export const calculateRates = (data) => api.post('/rates/calculate', data);
export const getCountries = () => api.get('/rates/countries');
export const getPageContent = (page) => api.get(`/content/${page}`);

// Admin Contact Messages endpoints
export const getMessages = () => api.get('/contact');

// Delivery Boy App endpoints
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

// Notifications
export const getAdminNotifications = () => api.get('/admin/notifications');
export const markNotificationsRead = () => api.put('/admin/notifications/mark-read');
export const updateAdminStaff = (id, data) => api.put(`/admin/staff/${id}`, data);
export const deleteAdminStaff = (id) => api.delete(`/admin/staff/${id}`);

// ─── Admin Rate Upload ────────────────────────────────────────────────────────
export const uploadRateFile = (carrier, formData) => {
  formData.append('carrier', carrier);
  return api.post('/admin/rates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  });
};
export const applyParsedRates = (carrier, parsedRates) =>
  api.post('/admin/rates/apply', { carrier, parsedRates });

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

// ─── E-Commerce: Shops ────────────────────────────────────────────────────
export const getPublicEcomShops = () => api.get('/ecommerce/shops');
export const getEcomShops = () => api.get('/ecommerce/admin/shops');
export const createEcomShop = (data) => api.post('/ecommerce/admin/shops', data);
export const updateEcomShop = (id, data) => api.put(`/ecommerce/admin/shops/${id}`, data);
export const deleteEcomShop = (id) => api.delete(`/ecommerce/admin/shops/${id}`);

// ─── E-Commerce: Products ─────────────────────────────────────────────────
export const getPublicEcomProducts = (shopId) => api.get('/ecommerce/products', { params: shopId ? { shop: shopId } : {} });
export const getEcomProducts = (shopId) => api.get('/ecommerce/admin/products', { params: shopId ? { shop: shopId } : {} });
export const createEcomProduct = (data) => api.post('/ecommerce/admin/products', data);
export const updateEcomProduct = (id, data) => api.put(`/ecommerce/admin/products/${id}`, data);
export const deleteEcomProduct = (id) => api.delete(`/ecommerce/admin/products/${id}`);

// ─── E-Commerce: Orders ──────────────────────────────────────────────────
export const placePublicEcomOrder = (data) => api.post('/ecommerce/orders', data);
export const getEcomOrders = (status) => api.get('/ecommerce/admin/orders', { params: status ? { status } : {} });
export const updateEcomOrderStatus = (id, data) => api.patch(`/ecommerce/admin/orders/${id}`, data);
export const getNewOrderCount = () => api.get('/ecommerce/admin/orders/new-count');
export const markOrdersSeen = () => api.patch('/ecommerce/admin/orders/mark-seen');

export const getUserEcomOrders = () => api.get('/ecommerce/my-orders');
export const cancelUserEcomOrder = (id) => api.patch(`/ecommerce/my-orders/${id}/cancel`);

// ─── Vendor Admin (Super Admin only) ──────────────────────────────────────
export const getAllVendors = () => api.get('/vendor/all');
export const updateVendorStatus = (shopId, status) => api.put(`/vendor/${shopId}/status`, { kycStatus: status });
export const adminCreateVendor = (vendorData) => api.post('/vendor/admin-create', vendorData);
export const deleteVendor = (shopId) => api.delete(`/vendor/${shopId}`);
export const createVendorLogin = (shopId, data) => api.post(`/vendor/${shopId}/create-login`, data);

// ─── Request For Quotation (RFQ) ──────────────────────────────────────────
export const createRFQ = (data) => api.post('/rfq', data);
export const getBuyerRFQs = () => api.get('/rfq/my-rfqs');
export const acceptVendorCounter = (id) => api.patch(`/rfq/${id}/buyer-accept`);

export const getVendorRFQs = () => api.get('/rfq/vendor-rfqs');
export const vendorCounterOffer = (id, data) => api.patch(`/rfq/${id}/vendor-counter`, data);
export const vendorAcceptRFQ = (id) => api.patch(`/rfq/${id}/vendor-accept`);

export default api;


// --- Delivery Boy App ---
export const getDeliveryTasks = () => api.get('/delivery/tasks');
export const updateDeliveryStatus = (awb, data) =>
  api.put(`/delivery/status/${encodeURIComponent(awb)}`, data)
     .catch(() => api.put(`/delivery/tasks/${encodeURIComponent(awb)}/status`, data));
export const updateLiveLocation = (data) =>
  api.post('/delivery/live-location', data)
     .catch(() => api.post('/delivery/location', data));
export const uploadPOD = (awb, fileData) =>
  api.post(`/delivery/tasks/${encodeURIComponent(awb)}/upload-pod`, fileData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).catch(() => api.post(`/delivery/pod/${encodeURIComponent(awb)}/upload`, fileData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));
