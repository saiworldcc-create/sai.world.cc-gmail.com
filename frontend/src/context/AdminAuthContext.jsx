import { createContext, useContext, useState, useEffect } from 'react';
import { getAdminMe } from '../services/api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sai_admin_token');
    if (token) {
      getAdminMe()
        .then((res) => setAdmin(res.admin))
        .catch(() => {
          localStorage.removeItem('sai_admin_token');
          localStorage.removeItem('sai_admin_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, adminData) => {
    localStorage.setItem('sai_admin_token', token);
    localStorage.setItem('sai_admin_user', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('sai_admin_token');
    localStorage.removeItem('sai_admin_user');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, isAdmin: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
