import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const updatePreferences = async (preferences) => {
    const response = await api.put('/auth/preferences', preferences);
    setUser(response.data.data);
    return response.data;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updatePreferences,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};