import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

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
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario al iniciar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = authAPI.getUser();
        const savedTenant = authAPI.getTenant();
        
        if (savedUser) {
          setUser(savedUser);
          setTenant(savedTenant);
          
          // Verificar que el token siga válido
          try {
            const response = await authAPI.me();
            setUser(response.user);
            if (response.tenant) {
              setTenant(response.tenant);
            }
          } catch (e) {
            // Token inválido, limpiar
            authAPI.logout();
            setUser(null);
            setTenant(null);
          }
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login normal (usuario de tenant)
  const login = async (tenantSlug, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authAPI.login(tenantSlug, email, password);
      setUser(response.user);
      setTenant(response.tenant);
      return response;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Login admin (Super Owner)
  const adminLogin = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authAPI.adminLogin(email, password);
      setUser(response.user);
      setTenant(null);
      return response;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setTenant(null);
    setError(null);
  };

  // Verificar si es super owner
  const isSuperOwner = () => {
    return user?.rol === 'super_owner';
  };

  // Verificar si es keymaster
  const isKeymaster = () => {
    return user?.rol === 'keymaster' || user?.rol === 'super_owner';
  };

  const value = {
    user,
    tenant,
    loading,
    error,
    login,
    adminLogin,
    logout,
    isAuthenticated: !!user,
    isSuperOwner,
    isKeymaster,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
