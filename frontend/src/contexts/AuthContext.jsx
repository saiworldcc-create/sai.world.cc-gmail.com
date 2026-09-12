import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('adminToken', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  // Fetch admin profile on load
  useEffect(() => {
    const fetchAdmin = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/v1/admin/me');
        if (res.data.success) {
          setAdmin(res.data.admin);
        } else {
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to fetch admin', err);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/v1/admin/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setAdmin(res.data.admin);
      return { success: true };
    }
    return { success: false, message: res.data.message || 'Login failed' };
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
