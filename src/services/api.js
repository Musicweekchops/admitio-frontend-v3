// src/services/api.js - Cliente API para Admitio
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helpers para localStorage
const getToken = () => localStorage.getItem('admitio_token');
const getUser = () => JSON.parse(localStorage.getItem('admitio_user') || 'null');
const getTenant = () => JSON.parse(localStorage.getItem('admitio_tenant') || 'null');

const setAuth = (token, user, tenant = null) => {
  localStorage.setItem('admitio_token', token);
  localStorage.setItem('admitio_user', JSON.stringify(user));
  if (tenant) localStorage.setItem('admitio_tenant', JSON.stringify(tenant));
};

const clearAuth = () => {
  localStorage.removeItem('admitio_token');
  localStorage.removeItem('admitio_user');
  localStorage.removeItem('admitio_tenant');
  localStorage.removeItem('admitio_impersonating');
};

// Fetch wrapper con auth
async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  // Manejar respuestas vacías
  const text = await response.text();
  let data = null;
  
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Si no es JSON, devolver el texto
      data = { message: text };
    }
  }
  
  if (!response.ok) {
    const error = new Error(data?.error || data?.message || `Error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
}

// API de Autenticación
export const authAPI = {
  // Login de usuario (con tenant)
  async login(tenantSlug, email, password) {
    const data = await fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ tenantSlug, email, password }),
    });
    setAuth(data.token, data.user, data.tenant);
    return data;
  },

  // Login de Super Owner
  async adminLogin(email, password) {
    const data = await fetchAPI('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuth(data.token, data.user);
    return data;
  },

  // Obtener usuario actual
  async me() {
    return fetchAPI('/api/auth/me');
  },

  // Cambiar contraseña
  async cambiarPassword(passwordActual, passwordNueva) {
    return fetchAPI('/api/auth/cambiar-password', {
      method: 'POST',
      body: JSON.stringify({ passwordActual, passwordNueva }),
    });
  },

  // Logout
  logout() {
    clearAuth();
  },

  // Helpers
  getToken,
  getUser,
  getTenant,
  isAuthenticated: () => !!getToken(),
};

// API de Leads
export const leadsAPI = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/api/leads${query ? `?${query}` : ''}`);
  },

  async stats() {
    return fetchAPI('/api/leads/stats');
  },

  async get(id) {
    return fetchAPI(`/api/leads/${id}`);
  },

  async create(leadData) {
    return fetchAPI('/api/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  async update(id, leadData) {
    return fetchAPI(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },

  async delete(id) {
    return fetchAPI(`/api/leads/${id}`, {
      method: 'DELETE',
    });
  },

  async archivar(id) {
    return fetchAPI(`/api/leads/${id}/archivar`, {
      method: 'PUT',
    });
  },

  async restaurar(id) {
    return fetchAPI(`/api/leads/${id}/restaurar`, {
      method: 'PUT',
    });
  },

  async registrarContacto(id, tipo, notas) {
    return fetchAPI(`/api/leads/${id}/contacto`, {
      method: 'POST',
      body: JSON.stringify({ tipo, notas }),
    });
  },
};

// API de Usuarios
export const usuariosAPI = {
  async list() {
    return fetchAPI('/api/usuarios');
  },

  async get(id) {
    return fetchAPI(`/api/usuarios/${id}`);
  },

  async create(userData) {
    return fetchAPI('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async update(id, userData) {
    return fetchAPI(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async delete(id) {
    return fetchAPI(`/api/usuarios/${id}`, {
      method: 'DELETE',
    });
  },

  async resetPassword(id) {
    return fetchAPI(`/api/usuarios/${id}/reset-password`, {
      method: 'POST',
    });
  },

  async limite() {
    return fetchAPI('/api/usuarios/limite');
  },
};

// API de Carreras
export const carrerasAPI = {
  async list() {
    return fetchAPI('/api/carreras');
  },

  async create(data) {
    return fetchAPI('/api/carreras', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return fetchAPI(`/api/carreras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id) {
    return fetchAPI(`/api/carreras/${id}`, {
      method: 'DELETE',
    });
  },
};

// API de Medios
export const mediosAPI = {
  async list() {
    return fetchAPI('/api/medios');
  },

  async create(data) {
    return fetchAPI('/api/medios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return fetchAPI(`/api/medios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id) {
    return fetchAPI(`/api/medios/${id}`, {
      method: 'DELETE',
    });
  },
};

// API de Admin (Super Owner)
export const adminAPI = {
  async listTenants() {
    return fetchAPI('/api/admin/tenants');
  },

  async getTenant(id) {
    return fetchAPI(`/api/admin/tenants/${id}`);
  },

  async createTenant(data) {
    return fetchAPI('/api/admin/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTenant(id, data) {
    return fetchAPI(`/api/admin/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async toggleTenant(id) {
    return fetchAPI(`/api/admin/tenants/${id}/toggle`, {
      method: 'PUT',
    });
  },

  async impersonate(tenantId) {
    const data = await fetchAPI(`/api/admin/impersonate/${tenantId}`, {
      method: 'POST',
    });
    // Guardar estado de impersonación
    localStorage.setItem('admitio_impersonating', 'true');
    setAuth(data.token, data.user, data.tenant);
    return data;
  },

  async stats() {
    return fetchAPI('/api/admin/stats');
  },
};

// API de Signup
export const signupAPI = {
  async register(data) {
    return fetchAPI('/api/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async verify(token) {
    return fetchAPI(`/api/signup/verificar/${token}`);
  },

  async resendVerification(email) {
    return fetchAPI('/api/signup/reenviar-verificacion', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
};

export default {
  authAPI,
  leadsAPI,
  usuariosAPI,
  carrerasAPI,
  mediosAPI,
  adminAPI,
  signupAPI,
  healthCheck,
};
