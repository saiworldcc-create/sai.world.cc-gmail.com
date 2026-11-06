import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Synchronize token state and headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('userToken', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('userToken');
    }
  }, [token]);

  // Fetch user profile on load
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/users/me');
        if (res && res.success) {
          setUser(res.user);
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('User profile session verification:', err.message);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/users/login', { email, password });
      if (res && res.success) {
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await api.post('/users/register', { name, email, password, phone });
      if (res && res.success) {
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res?.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await api.post('/users/google', { token: googleToken });
      if (res && res.success) {
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res?.message || 'Google login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Google login failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <UserContext.Provider value={{ user, token, loading, login, loginUser: login, register, loginWithGoogle, logout, isAuth: !!user, isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
