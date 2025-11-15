// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../utils/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   useEffect(() => {
//     if (token) {
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const fetchUser = async () => {
//     try {
//       const response = await api.get('/auth/me');
//       setUser(response.data.data);
//     } catch (error) {
//       console.error('Failed to fetch user:', error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     const response = await api.post('/auth/login', { email, password });
//     const { token, user } = response.data;
    
//     localStorage.setItem('token', token);
//     setToken(token);
//     setUser(user);
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
//     return response.data;
//   };

//   const register = async (name, email, password) => {
//     const response = await api.post('/auth/register', { name, email, password });
//     const { token, user } = response.data;
    
//     localStorage.setItem('token', token);
//     setToken(token);
//     setUser(user);
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
//     return response.data;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     delete api.defaults.headers.common['Authorization'];
//   };

//   const updatePreferences = async (preferences) => {
//     const response = await api.put('/auth/preferences', preferences);
//     setUser(response.data.data);
//     return response.data;
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//     updatePreferences,
//     isAuthenticated: !!user
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };



import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    
    return response.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    
    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updatePreferences = useCallback(async (preferences) => {
    const response = await api.put('/auth/preferences', preferences);
    setUser(response.data.data);
    return response.data;
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};