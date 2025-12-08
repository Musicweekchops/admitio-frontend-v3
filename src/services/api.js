// API Service - Conexión con backend real
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Token management
const getToken = () => localStorage.getItem('admitio_token');
const setToken = (token) => localStorage.setItem('admitio_token', token);
const removeToken = () => localStorage.removeItem('admitio_token');

const getUser = () => {
  const user = localStorage.getItem('admitio_user');
  return user ? JSON.parse(user) : null;
};
const setUser = (user) => localStorage.setItem('admitio_user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('admitio_user');

const getTenant = () => {
  const tenant = localStorage.getItem('admitio_tenant');
  return tenant ? JSON.parse(tenant) : null;
};
const setTenant = (tenant) => localStorage.setItem('admitio_tenant', JSON.stringify(tenant));
const removeTenant = () => localStorage.removeItem('admitio_tenant');

// Headers helper
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Fetch wrapper con manejo de errores
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(options.auth !== false),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Token expirado o inválido
      if (response.status === 401) {
        removeToken();
        removeUser();
        removeTenant();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }
      throw new Error(data.error || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor');
    }
    throw error;
  }
};

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  // Login de usuario (tenant)
  login: async (tenant, email, password) => {
    const data = await fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ tenant, email, password }),
      auth: false,
    });
    
    setToken(data.token);
    setUser(data.user);
    setTenant(data.tenant);
    return data;
  },

  // Login de Super Owner
  adminLogin: async (email, password) => {
    const data = await fetchAPI('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    });
    
    setToken(data.token);
    setUser(data.user);
    removeTenant(); // Super owners no tienen tenant
    return data;
  },

  // Obtener usuario actual
  me: async () => {
    return await fetchAPI('/api/auth/me');
  },

  // Cambiar contraseña
  cambiarPassword: async (passwordActual, passwordNueva) => {
    return await fetchAPI('/api/auth/cambiar-password', {
      method: 'POST',
      body: JSON.stringify({ passwordActual, passwordNueva }),
    });
  },

  // Impersonar usuario (Super Owner)
  impersonar: async (userId) => {
    const data = await fetchAPI(`/api/auth/impersonar/${userId}`, {
      method: 'POST',
    });
    
    // Guardar token original para poder volver
    localStorage.setItem('admitio_original_token', getToken());
    localStorage.setItem('admitio_original_user', localStorage.getItem('admitio_user'));
    
    setToken(data.token);
    setUser(data.user);
    setTenant(data.tenant);
    return data;
  },

  // Salir de impersonación
  salirImpersonacion: async () => {
    const data = await fetchAPI('/api/auth/salir-impersonacion', {
      method: 'POST',
    });
    
    // Restaurar token original
    const originalToken = localStorage.getItem('admitio_original_token');
    const originalUser = localStorage.getItem('admitio_original_user');
    
    if (originalToken) {
      setToken(originalToken);
      localStorage.removeItem('admitio_original_token');
    }
    if (originalUser) {
      localStorage.setItem('admitio_user', originalUser);
      localStorage.removeItem('admitio_original_user');
    }
    removeTenant();
    
    return data;
  },

  // Logout
  logout: () => {
    removeToken();
    removeUser();
    removeTenant();
    localStorage.removeItem('admitio_original_token');
    localStorage.removeItem('admitio_original_user');
  },

  // Helpers
  isAuthenticated: () => !!getToken(),
  getUser,
  getTenant,
  getToken,
};

// ============================================
// SIGNUP API
// ============================================
export const signupAPI = {
  // Verificar disponibilidad de slug
  checkSlug: async (slug) => {
    return await fetchAPI(`/api/signup/check-slug?slug=${encodeURIComponent(slug)}`, {
      auth: false,
    });
  },

  // Registrar nueva institución
  register: async (data) => {
    return await fetchAPI('/api/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false,
    });
  },

  // Verificar cuenta
  verificar: async (token) => {
    return await fetchAPI(`/api/signup/verificar/${token}`, {
      auth: false,
    });
  },

  // Reenviar email de verificación
  reenviarVerificacion: async (email) => {
    return await fetchAPI('/api/signup/reenviar-verificacion', {
      method: 'POST',
      body: JSON.stringify({ email }),
      auth: false,
    });
  },
};

// ============================================
// USUARIOS API (KeyMaster)
// ============================================
export const usuariosAPI = {
  // Listar usuarios del tenant
  list: async () => {
    return await fetchAPI('/api/usuarios');
  },

  // Verificar límite de usuarios
  limite: async () => {
    return await fetchAPI('/api/usuarios/limite');
  },

  // Obtener un usuario
  get: async (id) => {
    return await fetchAPI(`/api/usuarios/${id}`);
  },

  // Crear usuario
  create: async (data) => {
    return await fetchAPI('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar usuario
  update: async (id, data) => {
    return await fetchAPI(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Eliminar usuario
  delete: async (id) => {
    return await fetchAPI(`/api/usuarios/${id}`, {
      method: 'DELETE',
    });
  },

  // Reset de contraseña
  resetPassword: async (id) => {
    return await fetchAPI(`/api/usuarios/${id}/reset-password`, {
      method: 'POST',
    });
  },
};

// ============================================
// LEADS API
// ============================================
export const leadsAPI = {
  // Listar leads
  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await fetchAPI(`/api/leads${query ? `?${query}` : ''}`);
  },

  // Estadísticas
  stats: async () => {
    return await fetchAPI('/api/leads/stats');
  },

  // Obtener un lead
  get: async (id) => {
    return await fetchAPI(`/api/leads/${id}`);
  },

  // Crear lead
  create: async (data) => {
    return await fetchAPI('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar lead
  update: async (id, data) => {
    return await fetchAPI(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Archivar lead
  archivar: async (id) => {
    return await fetchAPI(`/api/leads/${id}/archivar`, {
      method: 'POST',
    });
  },

  // Desarchivar lead (Super Owner)
  desarchivar: async (id, tenantId) => {
    return await fetchAPI(`/api/leads/${id}/desarchivar`, {
      method: 'POST',
      body: JSON.stringify({ tenantId }),
    });
  },

  // Registrar contacto
  contacto: async (id, tipo, descripcion) => {
    return await fetchAPI(`/api/leads/${id}/contacto`, {
      method: 'POST',
      body: JSON.stringify({ tipo, descripcion }),
    });
  },
};

// ============================================
// CARRERAS API
// ============================================
export const carrerasAPI = {
  list: async () => fetchAPI('/api/carreras'),
  create: async (data) => fetchAPI('/api/carreras', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchAPI(`/api/carreras/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchAPI(`/api/carreras/${id}`, { method: 'DELETE' }),
};

// ============================================
// MEDIOS API
// ============================================
export const mediosAPI = {
  list: async () => fetchAPI('/api/medios'),
  create: async (data) => fetchAPI('/api/medios', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchAPI(`/api/medios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchAPI(`/api/medios/${id}`, { method: 'DELETE' }),
};

// ============================================
// NOTIFICACIONES API
// ============================================
export const notificacionesAPI = {
  list: async (leidas) => {
    const query = leidas !== undefined ? `?leidas=${leidas}` : '';
    return await fetchAPI(`/api/notificaciones${query}`);
  },
  marcarLeida: async (id) => fetchAPI(`/api/notificaciones/${id}/leer`, { method: 'PUT' }),
  marcarTodasLeidas: async () => fetchAPI('/api/notificaciones/leer-todas', { method: 'PUT' }),
};

// ============================================
// ADMIN API (Super Owner)
// ============================================
export const adminAPI = {
  // Dashboard global
  dashboard: async () => {
    return await fetchAPI('/api/admin/dashboard');
  },

  // Listar tenants
  tenants: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await fetchAPI(`/api/admin/tenants${query ? `?${query}` : ''}`);
  },

  // Obtener tenant
  getTenant: async (id) => {
    return await fetchAPI(`/api/admin/tenants/${id}`);
  },

  // Crear tenant
  createTenant: async (data) => {
    return await fetchAPI('/api/admin/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar tenant
  updateTenant: async (id, data) => {
    return await fetchAPI(`/api/admin/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Eliminar tenant
  deleteTenant: async (id) => {
    return await fetchAPI(`/api/admin/tenants/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ confirmar: 'ELIMINAR' }),
    });
  },

  // Super Owners
  superOwners: async () => fetchAPI('/api/admin/super-owners'),
  createSuperOwner: async (data) => fetchAPI('/api/admin/super-owners', { method: 'POST', body: JSON.stringify(data) }),
  deleteSuperOwner: async (id) => fetchAPI(`/api/admin/super-owners/${id}`, { method: 'DELETE' }),

  // Auditoría
  auditoria: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await fetchAPI(`/api/admin/auditoria${query ? `?${query}` : ''}`);
  },
};

// ============================================
// HEALTH CHECK
// ============================================
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

export default {
  auth: authAPI,
  signup: signupAPI,
  usuarios: usuariosAPI,
  leads: leadsAPI,
  carreras: carrerasAPI,
  medios: mediosAPI,
  notificaciones: notificacionesAPI,
  admin: adminAPI,
  healthCheck,
};
