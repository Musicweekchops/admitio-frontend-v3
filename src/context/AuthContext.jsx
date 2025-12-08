import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Cargar usuario al iniciar
  useEffect(() => {
    const initAuth = async () => {
      const token = authAPI.getToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authAPI.me();
        setUser(data.user);
        setTenant(data.tenant);
        setIsImpersonating(!!localStorage.getItem('admitio_original_token'));
      } catch (err) {
        console.error('Error cargando usuario:', err);
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login de usuario (tenant)
  const login = async (tenantSlug, email, password) => {
    setError(null);
    try {
      const data = await authAPI.login(tenantSlug, email, password);
      setUser(data.user);
      setTenant(data.tenant);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login de Super Owner
  const adminLogin = async (email, password) => {
    setError(null);
    try {
      const data = await authAPI.adminLogin(email, password);
      setUser(data.user);
      setTenant(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setTenant(null);
    setIsImpersonating(false);
  };

  // Impersonar usuario
  const impersonar = async (userId) => {
    try {
      const data = await authAPI.impersonar(userId);
      setUser(data.user);
      setTenant(data.tenant);
      setIsImpersonating(true);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Salir de impersonación
  const salirImpersonacion = async () => {
    try {
      await authAPI.salirImpersonacion();
      // Recargar datos del super owner
      const data = await authAPI.me();
      setUser(data.user);
      setTenant(null);
      setIsImpersonating(false);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Actualizar usuario después de cambio de contraseña
  const actualizarUsuario = (nuevosDatos) => {
    setUser(prev => ({ ...prev, ...nuevosDatos }));
  };

  // Helpers
  const isAuthenticated = !!user;
  const isSuperOwner = user?.rol === 'super_owner' || user?.rol === 'super_owner_supremo';
  const isSupremo = user?.rol === 'super_owner_supremo';
  const isKeymaster = user?.rol === 'keymaster';
  const isEncargado = user?.rol === 'encargado';
  const isAsistente = user?.rol === 'asistente';
  const debeCambiarPassword = user?.debeCambiarPassword;

  const value = {
    user,
    tenant,
    loading,
    error,
    isAuthenticated,
    isSuperOwner,
    isSupremo,
    isKeymaster,
    isEncargado,
    isAsistente,
    isImpersonating,
    debeCambiarPassword,
    login,
    adminLogin,
    logout,
    impersonar,
    salirImpersonacion,
    actualizarUsuario,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
