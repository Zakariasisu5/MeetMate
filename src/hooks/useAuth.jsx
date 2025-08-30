import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('matchmaker_bot_token');
      if (token) {
        const response = await authAPI.getProfile();
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('matchmaker_bot_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('matchmaker_bot_token', token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { user, token } = response.data;
      
      localStorage.setItem('matchmaker_bot_token', token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('matchmaker_bot_token');
    setUser(null);
    setError(null);
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isOrganizer: user?.role === 'ORGANIZER' || user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

