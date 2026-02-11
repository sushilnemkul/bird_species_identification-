import { createContext, useState, useEffect, useContext } from 'react';
import { login as loginService, logout as logoutService, checkAuth } from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        try {
            const authData = await checkAuth();
            if (authData) {
                setUser(authData.user);
            }
        } catch (error) {
            console.error("Failed to authenticate", error);
        } finally {
            setLoading(false);
        }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { user, role } = await loginService(email, password);
      
      if (role !== 'admin') {
          return { success: false, error: 'Access Denied: You are not an administrator.' };
      }
      
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
