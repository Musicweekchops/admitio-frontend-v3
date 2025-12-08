// API Service para Admitio
// Conecta con el backend en Render

const API_URL = import.meta.env.VITE_API_URL || 'https://admitio-api.onrender.com';

// Helper para hacer requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('admitio_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// AUTH
// ============================================
export const authAPI = {
  // Login para usuarios normales (de un tenant)
  login: async (tenant, email, password) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ tenant, email, password }),
    });
    if (data.token) {
      localStorage.setItem('admitio_token', data.token);
      localStorage.setItem('admitio_user', JSON.stringify(data.user));
      localStorage.setItem('admitio_tenant', JSON.stringify(data.tenant));
    }
    return data;
  },

  // Login para Super Owner (admin global)
  adminLogin: async (email, password) => {
    const data = await request('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('admitio_token', data.token);
      localStorage.setItem('admitio_user', JSON.stringify(data.user));
    }
    return data;
  },

  // Obtener usuario actual
  me: async () => {
    return request('/api/auth/me');
  },

  // Renovar token
  refresh: async () => {
    const data = await request('/api/auth/refresh', { method: 'POST' });
    if (data.token) {
      localStorage.setItem('admitio_token', data.token);
    }
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('admitio_token');
    localStorage.removeItem('admitio_user');
    localStorage.removeItem('admitio_tenant');
  },

  // Verificar si hay sesión
  isAuthenticated: () => {
    return !!localStorage.getItem('admitio_token');
  },

  // Obtener usuario guardado
  getUser: () => {
    const user = localStorage.getItem('admitio_user');
    return user ? JSON.parse(user) : null;
  },

  // Obtener tenant guardado
  getTenant: () => {
    const tenant = localStorage.getItem('admitio_tenant');
    return tenant ? JSON.parse(tenant) : null;
  },
};

// ============================================
// SIGNUP (Registro de nuevos tenants)
// ============================================
export const signupAPI = {
  // Registrar nuevo tenant (institución)
  register: async (data) => {
    return request('/api/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verificar disponibilidad de slug
  checkSlug: async (slug) => {
    return request(`/api/signup/check-slug?slug=${encodeURIComponent(slug)}`);
  },
};

// ============================================
// LEADS
// ============================================
export const leadsAPI = {
  // Listar leads
  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/leads${query ? `?${query}` : ''}`);
  },

  // Obtener un lead
  get: async (id) => {
    return request(`/api/leads/${id}`);
  },

  // Crear lead
  create: async (data) => {
    return request('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar lead
  update: async (id, data) => {
    return request(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Registrar contacto
  contact: async (id, data) => {
    return request(`/api/leads/${id}/contacto`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Estadísticas
  stats: async () => {
    return request('/api/leads/stats/summary');
  },
};

// ============================================
// ADMIN (Super Owner)
// ============================================
export const adminAPI = {
  // Dashboard
  dashboard: async () => {
    return request('/api/admin/dashboard');
  },

  // Listar tenants
  tenants: async () => {
    return request('/api/admin/tenants');
  },

  // Crear tenant
  createTenant: async (data) => {
    return request('/api/admin/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar tenant
  updateTenant: async (id, data) => {
    return request(`/api/admin/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Eliminar tenant
  deleteTenant: async (id) => {
    return request(`/api/admin/tenants/${id}`, {
      method: 'DELETE',
    });
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
  leads: leadsAPI,
  admin: adminAPI,
  healthCheck,
};
