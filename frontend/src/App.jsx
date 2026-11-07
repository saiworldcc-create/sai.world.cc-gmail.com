import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { UserProvider, useUser } from './context/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CookieBanner from './components/common/CookieBanner';
import ChatbotWidget from './components/common/ChatbotWidget';
import PageTransition from './components/common/PageTransition';
import AuthModal from './components/common/AuthModal';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/services/ServicesPage';
import FoodShippingPage from './pages/services/FoodShippingPage';
import BranchesPage from './pages/public/BranchesPage';
import CustomsGuidePage from './pages/tools/CustomsGuidePage';
import ProhibitedItemsPage from './pages/tools/ProhibitedItemsPage';
import CalculatorPage from './pages/tools/CalculatorPage';
import TrackingPage from './pages/tracking/TrackingPage';
import AdvancedTrackingPage from './pages/tracking/AdvancedTrackingPage';
import TrackingFaqsPage from './pages/tracking/TrackingFaqsPage';
import BookPickupPage from './pages/tools/BookPickupPage';
import ContactPage from './pages/public/ContactPage';
import HelpCenterPage from './pages/public/HelpCenterPage';
import PortalPage from './pages/auth/PortalPage';
import PayOnlinePage from './pages/payment/PayOnlinePage';
import NotFoundPage from './pages/auth/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserLoginPage from './pages/user/UserLoginPage';
import UserDashboard from './pages/user/UserDashboard';
import UserRFQ from './pages/user/UserRFQ';
import AirFreightPage from './pages/services/AirFreightPage';
import SeaFreightPage from './pages/services/SeaFreightPage';
import EcommerceLogisticsPage from './pages/services/EcommerceLogisticsPage';
import ExpressCourierPage from './pages/services/ExpressCourierPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';

// Delivery Boy App Pages
import DeliveryLogin from './pages/delivery/DeliveryLogin';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import DeliveryTaskDetail from './pages/delivery/DeliveryTaskDetail';
import DeliveryScanner from './pages/delivery/DeliveryScanner';

// Vendor App Pages
import VendorLogin from './pages/vendor/VendorLogin';
import VendorLayout from './pages/vendor/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorFinancials from './pages/vendor/VendorFinancials';
import VendorSupport from './pages/vendor/VendorSupport';
import VendorRFQ from './pages/vendor/VendorRFQ';
import VendorAPI from './pages/vendor/VendorAPI'; // Phase 14

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { 
    window.scrollTo(0, 0); 
    // Send pageview to Google Analytics
    ReactGA.send({ hitType: "pageview", page: pathname, title: pathname });
  }, [pathname]);
  return null;
}

function ProtectedAdminRoute({ children }) {
  const { isAdmin, loading } = useAdminAuth();
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--accent-teal)' }}></i></div>;
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

function ProtectedUserRoute({ children }) {
  const { isAuth, loading } = useUser();
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--accent-teal)' }}></i></div>;
  return isAuth ? children : <Navigate to="/login" replace />;
}

function ProtectedVendorRoute({ children }) {
  const { isAuth, user, loading } = useUser();
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--accent-teal)' }}></i></div>;
  return isAuth && user?.role === 'vendor' ? children : <Navigate to="/vendor/login" replace />;
}

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDeliveryRoute = location.pathname.startsWith('/delivery');
  const isVendorRoute = location.pathname.startsWith('/vendor') && location.pathname !== '/vendor/login';
  const hideNavbarFooter = isAdminRoute || isDeliveryRoute || isVendorRoute || location.pathname === '/vendor/login';

  return (
    <>
      <ScrollToTop />
      {!hideNavbarFooter && <Navbar />}
      <PageTransition>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/air-freight" element={<AirFreightPage />} />
          <Route path="/sea-freight" element={<SeaFreightPage />} />
          <Route path="/ecommerce-logistics" element={<EcommerceLogisticsPage />} />
          <Route path="/express-courier" element={<ExpressCourierPage />} />
          <Route path="/food-shipping" element={<FoodShippingPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/customs-guide" element={<CustomsGuidePage />} />
          <Route path="/prohibited-items" element={<ProhibitedItemsPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/advanced-tracking" element={<AdvancedTrackingPage />} />
          <Route path="/tracking-faqs" element={<TrackingFaqsPage />} />
          <Route path="/book-pickup" element={<BookPickupPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/pay-online" element={<PayOnlinePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          
          {/* User Routes */}
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/dashboard" element={<ProtectedUserRoute><UserDashboard /></ProtectedUserRoute>} />
          <Route path="/dashboard/rfq" element={<ProtectedUserRoute><UserRFQ /></ProtectedUserRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />

          {/* Delivery Boy App Routes */}
          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route path="/delivery" element={<DeliveryDashboard />} />
          <Route path="/delivery/task/:awb" element={<DeliveryTaskDetail />} />
          <Route path="/delivery/task/*" element={<DeliveryTaskDetail />} />
          <Route path="/delivery/scan" element={<DeliveryScanner />} />

          {/* Vendor Portal Routes */}
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor" element={<ProtectedVendorRoute><VendorLayout /></ProtectedVendorRoute>}>
            <Route index element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="financials" element={<VendorFinancials />} />
            <Route path="support" element={<VendorSupport />} />
            <Route path="rfq" element={<VendorRFQ />} />
            <Route path="api" element={<VendorAPI />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageTransition>
      {!hideNavbarFooter && <ChatbotWidget />}
      {!hideNavbarFooter && <CookieBanner />}
      {!hideNavbarFooter && location.pathname !== '/ecommerce-logistics' && <Footer />}
      {!hideNavbarFooter && <AuthModal />}
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    // Initialize Google Analytics with Measurement ID
    ReactGA.initialize("G-45S420QM0D");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AdminAuthProvider>
          <UserProvider>
            <Router>
              <AppLayout />
            </Router>
          </UserProvider>
        </AdminAuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
