import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      // NOTE: We'll set this specific to user requests if needed, but for now we set global
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
        const res = await axios.get('/api/v1/users/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/v1/users/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.data.message || 'Login failed' };
  };

  const register = async (name, email, password, phone) => {
    const res = await axios.post('/api/v1/users/register', { name, email, password, phone });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.data.message || 'Registration failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, token, loading, login, register, logout, isAuth: !!user }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
