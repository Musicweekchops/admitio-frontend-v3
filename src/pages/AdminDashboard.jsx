import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { 
  GraduationCap, Menu, X, Home, Building2, Users, Activity, Settings, LogOut,
  Plus, Search, ExternalLink, Edit, Power, Trash2, Eye, AlertCircle, 
  TrendingUp, UserCheck, BarChart3, RefreshCw, Crown, Shield
} from 'lucide-react';

// Modal para crear tenant
const NuevoTenantModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    plan: 'free',
    keymaster_nombre: '',
    keymaster_email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generarSlug = (nombre) => {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  };

  const handleNombreChange = (e) => {
    const nombre = e.target.value;
    setFormData({
      ...formData,
      nombre,
      slug: generarSlug(nombre),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminAPI.createTenant(formData);
      alert(`Institución creada!\n\nCredenciales del KeyMaster:\nEmail: ${formData.keymaster_email}\nContraseña: ${result.keymaster.passwordTemporal}`);
      onSuccess();
      onClose();
      setFormData({ nombre: '', slug: '', plan: 'free', keymaster_nombre: '', keymaster_email: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Nueva Institución</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Institución *</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={handleNombreChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Colegio San José"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código (URL) *</label>
            <div className="flex items-center">
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                placeholder="colegio-san-jose"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{formData.slug}.admitio.cl</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
            >
              <option value="free">Free (1 usuario, 10 leads)</option>
              <option value="pro">Pro (3 usuarios, 500 leads)</option>
              <option value="institucion">Institución (10 usuarios, ilimitado)</option>
            </select>
          </div>

          <hr className="my-4" />
          <p className="text-sm font-medium text-gray-700">Datos del KeyMaster</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={formData.keymaster_nombre}
              onChange={(e) => setFormData({ ...formData, keymaster_nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.keymaster_email}
              onChange={(e) => setFormData({ ...formData, keymaster_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="admin@colegio.cl"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Institución'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isSupremo, impersonar } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalNuevoTenant, setModalNuevoTenant] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [dashData, tenantsData] = await Promise.all([
        adminAPI.dashboard(),
        adminAPI.tenants(),
      ]);
      setDashboard(dashData);
      setTenants(tenantsData.tenants || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspenderTenant = async (tenant) => {
    if (!confirm(`¿${tenant.activo ? 'Suspender' : 'Activar'} ${tenant.nombre}?`)) return;
    
    try {
      await adminAPI.updateTenant(tenant.id, { activo: !tenant.activo });
      cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminarTenant = async (tenant) => {
    if (!confirm(`¿Eliminar ${tenant.nombre}? Esta acción no se puede deshacer.`)) return;
    
    try {
      await adminAPI.deleteTenant(tenant.id);
      cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImpersonar = async (tenant) => {
    try {
      // Obtener el keymaster del tenant
      const tenantData = await adminAPI.getTenant(tenant.id);
      const keymaster = tenantData.usuarios?.find(u => u.rol === 'keymaster');
      
      if (!keymaster) {
        alert('No se encontró el KeyMaster de esta institución');
        return;
      }

      await impersonar(keymaster.id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tenantsFiltrados = tenants.filter(t => 
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.slug.toLowerCase().includes(busqueda.toLowerCase())
  );

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin', active: true },
    { icon: Building2, label: 'Instituciones', href: '/admin/tenants' },
    ...(isSupremo ? [
      { icon: Shield, label: 'Super Owners', href: '/admin/super-owners' },
    ] : []),
    { icon: Activity, label: 'Auditoría', href: '/admin/auditoria' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-white">Admitio</span>
              <span className="block text-xs text-violet-400">Panel Admin</span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${item.active 
                  ? 'bg-violet-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.nombre}</p>
              <p className="text-xs text-violet-400">
                {isSupremo ? 'Super Owner Supremo' : 'Super Owner'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
          </div>

          <button
            onClick={() => setModalNuevoTenant(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Institución</span>
          </button>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Instituciones</span>
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{dashboard?.tenants?.activos || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{dashboard?.tenants?.inactivos || 0} inactivas</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Usuarios</span>
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{dashboard?.usuarios?.total || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">En todas las instituciones</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Total Leads</span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{dashboard?.leads?.activos || 0}</p>
                  <p className="text-xs text-green-600 mt-1">+{dashboard?.leads?.hoy || 0} hoy</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Matriculados</span>
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{dashboard?.leads?.matriculados || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Total histórico</p>
                </div>
              </div>

              {/* Distribución por plan */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-500">Plan Free</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboard?.porPlan?.free || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-4 border border-violet-200">
                  <p className="text-sm text-violet-600">Plan Pro</p>
                  <p className="text-2xl font-bold text-violet-900">{dashboard?.porPlan?.pro || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <p className="text-sm text-emerald-600">Plan Institución</p>
                  <p className="text-2xl font-bold text-emerald-900">{dashboard?.porPlan?.institucion || 0}</p>
                </div>
              </div>

              {/* Búsqueda y tabla */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Instituciones</h2>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm w-48"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Institución</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Plan</th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Usuarios</th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Leads</th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
                        <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tenantsFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                            No hay instituciones para mostrar
                          </td>
                        </tr>
                      ) : (
                        tenantsFiltrados.map((tenant) => (
                          <tr key={tenant.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-gray-900">{tenant.nombre}</p>
                                <p className="text-sm text-gray-500">{tenant.slug}.admitio.cl</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`
                                inline-flex px-2 py-1 rounded-full text-xs font-medium
                                ${tenant.plan === 'free' ? 'bg-gray-100 text-gray-800' : ''}
                                ${tenant.plan === 'pro' ? 'bg-violet-100 text-violet-800' : ''}
                                ${tenant.plan === 'institucion' ? 'bg-emerald-100 text-emerald-800' : ''}
                              `}>
                                {tenant.plan}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-900">
                              {tenant.total_usuarios || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-900">
                              {tenant.total_leads || 0}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`
                                inline-flex px-2 py-1 rounded-full text-xs font-medium
                                ${tenant.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                              `}>
                                {tenant.activo ? 'Activo' : 'Suspendido'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <button 
                                  onClick={() => handleImpersonar(tenant)}
                                  className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded"
                                  title="Ver como KeyMaster"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleSuspenderTenant(tenant)}
                                  className={`p-2 rounded ${tenant.activo ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                                  title={tenant.activo ? 'Suspender' : 'Activar'}
                                >
                                  <Power className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEliminarTenant(tenant)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal Nuevo Tenant */}
      <NuevoTenantModal
        isOpen={modalNuevoTenant}
        onClose={() => setModalNuevoTenant(false)}
        onSuccess={cargarDatos}
      />
    </div>
  );
};

export default AdminDashboard;
