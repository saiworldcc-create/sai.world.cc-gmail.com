import { useLocation } from 'react-router-dom';

/**
 * PageTransition:
 * Lightweight, hardware-accelerated route page transition wrapper.
 * Plays a quick, premium 300ms fade-and-rise animation upon navigating between routes.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="route-page-transition">
      {children}
    </div>
  );
}
