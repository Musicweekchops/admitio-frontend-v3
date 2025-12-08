import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leadsAPI, notificacionesAPI, carrerasAPI, mediosAPI } from '../services/api';
import { 
  GraduationCap, Menu, X, Home, Users, UserPlus, BarChart3, Settings, LogOut,
  Bell, Search, Plus, Phone, Mail, Calendar, ChevronRight, AlertCircle,
  CheckCircle, Clock, XCircle, Archive, Eye, Edit, MessageSquare, Filter,
  RefreshCw, TrendingUp, UserCheck, AlertTriangle
} from 'lucide-react';

// Badge de estado
const EstadoBadge = ({ estado }) => {
  const estilos = {
    nuevo: 'bg-blue-100 text-blue-800',
    contactado: 'bg-yellow-100 text-yellow-800',
    en_seguimiento: 'bg-purple-100 text-purple-800',
    examen: 'bg-orange-100 text-orange-800',
    matriculado: 'bg-green-100 text-green-800',
    descartado: 'bg-gray-100 text-gray-800',
  };

  const iconos = {
    nuevo: <Clock className="w-3 h-3" />,
    contactado: <Phone className="w-3 h-3" />,
    en_seguimiento: <RefreshCw className="w-3 h-3" />,
    examen: <Calendar className="w-3 h-3" />,
    matriculado: <CheckCircle className="w-3 h-3" />,
    descartado: <XCircle className="w-3 h-3" />,
  };

  const nombres = {
    nuevo: 'Nuevo',
    contactado: 'Contactado',
    en_seguimiento: 'En seguimiento',
    examen: 'Examen',
    matriculado: 'Matriculado',
    descartado: 'Descartado',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estilos[estado] || 'bg-gray-100'}`}>
      {iconos[estado]}
      {nombres[estado] || estado}
    </span>
  );
};

// Modal para nuevo lead
const NuevoLeadModal = ({ isOpen, onClose, onSuccess, carreras, medios }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    telefono_apoderado: '',
    carrera_id: '',
    medio_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await leadsAPI.create(formData);
      onSuccess();
      onClose();
      setFormData({ nombre: '', email: '', telefono: '', telefono_apoderado: '', carrera_id: '', medio_id: '' });
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
          <h3 className="text-lg font-bold text-gray-900">Nuevo Lead</h3>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="email@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
            <input
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Apoderado</label>
            <input
              type="tel"
              value={formData.telefono_apoderado}
              onChange={(e) => setFormData({ ...formData, telefono_apoderado: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="+56 9 8765 4321"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carrera/Interés *</label>
            <select
              required
              value={formData.carrera_id}
              onChange={(e) => setFormData({ ...formData, carrera_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="">Seleccionar...</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">¿Cómo llegó?</label>
            <select
              value={formData.medio_id}
              onChange={(e) => setFormData({ ...formData, medio_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="">Seleccionar...</option>
              {medios.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
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
              {loading ? 'Creando...' : 'Crear Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, tenant, logout, isKeymaster, isEncargado, isAsistente, isImpersonating, salirImpersonacion } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [medios, setMedios] = useState([]);
  const [notificaciones, setNotificaciones] = useState({ notificaciones: [], noLeidas: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [modalNuevoLead, setModalNuevoLead] = useState(false);

  // Cargar datos
  useEffect(() => {
    cargarDatos();
  }, [filtroEstado]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [statsData, leadsData, carrerasData, mediosData, notifData] = await Promise.all([
        leadsAPI.stats(),
        leadsAPI.list({ estado: filtroEstado || undefined, limit: 20 }),
        carrerasAPI.list(),
        mediosAPI.list(),
        notificacionesAPI.list(),
      ]);

      setStats(statsData);
      setLeads(leadsData.leads || []);
      setCarreras(carrerasData.carreras || []);
      setMedios(mediosData.medios || []);
      setNotificaciones(notifData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: Users, label: 'Leads', href: '/leads' },
    ...(isKeymaster ? [
      { icon: UserPlus, label: 'Usuarios', href: '/usuarios' },
      { icon: BarChart3, label: 'Reportes', href: '/reportes' },
      { icon: Settings, label: 'Configuración', href: '/configuracion' },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de impersonación */}
      {isImpersonating && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Estás viendo como: <strong>{user?.nombre}</strong> ({tenant?.nombre})
          <button
            onClick={salirImpersonacion}
            className="ml-4 px-3 py-1 bg-white text-amber-600 rounded font-medium hover:bg-amber-50"
          >
            Salir
          </button>
        </div>
      )}

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && <span className="font-bold text-xl text-gray-900">Admitio</span>}
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tenant info */}
        {tenant && !sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-gray-200 bg-violet-50">
            <p className="text-sm font-medium text-violet-900">{tenant.nombre}</p>
            <p className="text-xs text-violet-600">Plan {tenant.plan}</p>
          </div>
        )}

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${item.active 
                  ? 'bg-violet-100 text-violet-900' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Toggle collapse */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-violet-600 text-white rounded-full items-center justify-center hover:bg-violet-700"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              <span className="text-violet-600 font-semibold">
                {user?.nombre?.charAt(0) || 'U'}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-600"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar leads..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
              {notificaciones.noLeidas > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificaciones.noLeidas}
                </span>
              )}
            </button>

            {/* Nuevo Lead */}
            {(isKeymaster || isEncargado || isAsistente) && (
              <button
                onClick={() => setModalNuevoLead(true)}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Lead</span>
              </button>
            )}
          </div>
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
                    <span className="text-gray-500 text-sm">Leads Activos</span>
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats?.limite?.disponible !== undefined && stats.limite.limite !== 'ilimitado'
                      ? `${stats.limite.disponible} disponibles`
                      : 'Sin límite'
                    }
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Matriculados</span>
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.porEstado?.matriculado || 0}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats?.total > 0 
                      ? `${Math.round((stats.porEstado?.matriculado || 0) / stats.total * 100)}% conversión`
                      : '0% conversión'
                    }
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Nuevos Hoy</span>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.hoy || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats?.estaSemana || 0} esta semana</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm">Pendientes</span>
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.porEstado?.nuevo || 0}</p>
                  <p className="text-xs text-amber-600 mt-1">Por contactar</p>
                </div>
              </div>

              {/* Alerta de límite */}
              {stats?.limite?.alerta && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800">Estás cerca del límite de leads</p>
                    <p className="text-sm text-amber-600">
                      Has usado {stats.limite.actual} de {stats.limite.limite} leads disponibles ({stats.limite.porcentaje}%)
                    </p>
                  </div>
                </div>
              )}

              {/* Filtros */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Todos los estados</option>
                    <option value="nuevo">Nuevos</option>
                    <option value="contactado">Contactados</option>
                    <option value="en_seguimiento">En seguimiento</option>
                    <option value="examen">Examen</option>
                    <option value="matriculado">Matriculados</option>
                    <option value="descartado">Descartados</option>
                  </select>
                </div>

                <button
                  onClick={cargarDatos}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </button>
              </div>

              {/* Tabla de leads */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Nombre</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">Contacto</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">Interés</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
                        <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                            No hay leads para mostrar
                          </td>
                        </tr>
                      ) : (
                        leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-gray-900">{lead.nombre}</p>
                                <p className="text-sm text-gray-500 md:hidden">{lead.email}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <p className="text-sm text-gray-900">{lead.email}</p>
                              <p className="text-sm text-gray-500">{lead.telefono}</p>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <p className="text-sm text-gray-900">{lead.carrera_nombre || '-'}</p>
                              <p className="text-xs text-gray-500">{lead.medio_nombre}</p>
                            </td>
                            <td className="px-4 py-3">
                              <EstadoBadge estado={lead.estado} />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-1 text-gray-400 hover:text-violet-600" title="Ver">
                                  <Eye className="w-4 h-4" />
                                </button>
                                {(isKeymaster || isEncargado) && !lead.archivado && (
                                  <>
                                    <button className="p-1 text-gray-400 hover:text-violet-600" title="Editar">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-green-600" title="Llamar">
                                      <Phone className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
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

      {/* Modal Nuevo Lead */}
      <NuevoLeadModal
        isOpen={modalNuevoLead}
        onClose={() => setModalNuevoLead(false)}
        onSuccess={cargarDatos}
        carreras={carreras}
        medios={medios}
      />
    </div>
  );
};

export default Dashboard;
