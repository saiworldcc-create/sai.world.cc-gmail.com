import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { UserProvider, useUser } from './context/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CookieBanner from './components/common/CookieBanner';
import ChatbotWidget from './components/common/ChatbotWidget';
import PageTransition from './components/common/PageTransition';
import AuthModal from './components/common/AuthModal';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FoodShippingPage from './pages/FoodShippingPage';
import BranchesPage from './pages/BranchesPage';
import CustomsGuidePage from './pages/CustomsGuidePage';
import ProhibitedItemsPage from './pages/ProhibitedItemsPage';
import CalculatorPage from './pages/CalculatorPage';
import TrackingPage from './pages/TrackingPage';
import AdvancedTrackingPage from './pages/AdvancedTrackingPage';
import TrackingFaqsPage from './pages/TrackingFaqsPage';
import BookPickupPage from './pages/BookPickupPage';
import ContactPage from './pages/ContactPage';
import PortalPage from './pages/PortalPage';
import PayOnlinePage from './pages/PayOnlinePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserLoginPage from './pages/user/UserLoginPage';
import UserDashboard from './pages/user/UserDashboard';
import AirFreightPage from './pages/AirFreightPage';
import SeaFreightPage from './pages/SeaFreightPage';
import EcommerceLogisticsPage from './pages/EcommerceLogisticsPage';
import ExpressCourierPage from './pages/ExpressCourierPage';

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

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
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
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/pay-online" element={<PayOnlinePage />} />
          
          {/* User Routes */}
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/dashboard" element={<ProtectedUserRoute><UserDashboard /></ProtectedUserRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageTransition>
      {!isAdminRoute && <ChatbotWidget />}
      {!isAdminRoute && <CookieBanner />}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <AuthModal />}
    </>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize Google Analytics with Measurement ID
    ReactGA.initialize("G-45S420QM0D");
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AdminAuthProvider>
        <UserProvider>
          <Router>
            <AppLayout />
          </Router>
        </UserProvider>
      </AdminAuthProvider>
    </GoogleOAuthProvider>
  );
}
