import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usuariosAPI } from '../services/api';
import { 
  GraduationCap, Menu, X, Home, Users, UserPlus, BarChart3, Settings, LogOut,
  Plus, Search, Edit, Trash2, Key, AlertCircle, CheckCircle, ChevronRight,
  Shield, UserCheck, Clock, AlertTriangle, Crown
} from 'lucide-react';

// Modal para crear/editar usuario
const UsuarioModal = ({ isOpen, onClose, onSuccess, usuario = null, limite }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'encargado',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      });
    } else {
      setFormData({ nombre: '', email: '', rol: 'encargado' });
    }
    setResultado(null);
    setError('');
  }, [usuario, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (usuario) {
        await usuariosAPI.update(usuario.id, formData);
        onSuccess();
        onClose();
      } else {
        const result = await usuariosAPI.create(formData);
        setResultado(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCerrar = () => {
    if (resultado) {
      onSuccess();
    }
    onClose();
    setResultado(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {resultado ? (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¡Usuario Creado!</h3>
              <p className="text-gray-600 mb-4">
                Se ha enviado un email a <strong>{formData.email}</strong> con las credenciales de acceso.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left mb-4">
                <p className="text-sm font-medium text-amber-800 mb-2">Contraseña temporal:</p>
                <p className="font-mono text-lg text-amber-900 bg-amber-100 px-3 py-2 rounded">
                  {resultado.passwordTemporal}
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  Guarda esta contraseña por si el email no llega. El usuario deberá cambiarla en su primer inicio de sesión.
                </p>
              </div>
            </div>
            <button
              onClick={handleCerrar}
              className="w-full py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              Entendido
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!usuario && limite && !limite.permitido && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700 text-sm">
                <AlertTriangle className="w-4 h-4" />
                Has alcanzado el límite de usuarios ({limite.limite}). Actualiza tu plan para agregar más.
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  disabled={!!usuario}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  disabled={usuario?.rol === 'keymaster'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
                >
                  <option value="encargado">Encargado - Ve y contacta leads asignados</option>
                  <option value="asistente">Asistente - Solo crea leads</option>
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
                  disabled={loading || (!usuario && limite && !limite.permitido)}
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : usuario ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Usuarios = () => {
  const navigate = useNavigate();
  const { user, tenant, logout, isKeymaster } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [limite, setLimite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalUsuario, setModalUsuario] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (!isKeymaster) {
      navigate('/dashboard');
      return;
    }
    cargarDatos();
  }, [isKeymaster]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuariosData, limiteData] = await Promise.all([
        usuariosAPI.list(),
        usuariosAPI.limite(),
      ]);
      setUsuarios(usuariosData.usuarios || []);
      setLimite(limiteData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (usuario) => {
    if (!confirm(`¿Eliminar a ${usuario.nombre}?`)) return;
    
    try {
      await usuariosAPI.delete(usuario.id);
      cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResetPassword = async (usuario) => {
    if (!confirm(`¿Resetear la contraseña de ${usuario.nombre}?`)) return;
    
    try {
      const result = await usuariosAPI.resetPassword(usuario.id);
      alert(`Contraseña reseteada.\n\nNueva contraseña temporal:\n${result.passwordTemporal}\n\nSe ha enviado un email al usuario.`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioEditar(usuario);
    setModalUsuario(true);
  };

  const abrirModalNuevo = () => {
    setUsuarioEditar(null);
    setModalUsuario(true);
  };

  const cerrarModal = () => {
    setModalUsuario(false);
    setUsuarioEditar(null);
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Leads', href: '/leads' },
    { icon: UserPlus, label: 'Usuarios', href: '/usuarios', active: true },
    { icon: BarChart3, label: 'Reportes', href: '/reportes' },
    { icon: Settings, label: 'Configuración', href: '/configuracion' },
  ];

  const getRolInfo = (rol) => {
    const roles = {
      keymaster: { label: 'KeyMaster', color: 'bg-violet-100 text-violet-800', icon: Crown },
      encargado: { label: 'Encargado', color: 'bg-blue-100 text-blue-800', icon: Shield },
      asistente: { label: 'Asistente', color: 'bg-gray-100 text-gray-800', icon: UserCheck },
    };
    return roles[rol] || roles.asistente;
  };

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
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && <span className="font-bold text-xl text-gray-900">Admitio</span>}
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {tenant && !sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-gray-200 bg-violet-50">
            <p className="text-sm font-medium text-violet-900">{tenant.nombre}</p>
            <p className="text-xs text-violet-600">Plan {tenant.plan}</p>
          </div>
        )}

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

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-violet-600 text-white rounded-full items-center justify-center hover:bg-violet-700"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              <span className="text-violet-600 font-semibold">{user?.nombre?.charAt(0)}</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
              </div>
            )}
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-600" title="Cerrar sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Gestión de Usuarios</h1>
          </div>

          <button
            onClick={abrirModalNuevo}
            disabled={limite && !limite.permitido}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Usuario</span>
          </button>
        </header>

        <div className="p-4 lg:p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Límite de usuarios */}
          {limite && (
            <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${limite.alerta ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <Users className={`w-5 h-5 ${limite.alerta ? 'text-amber-600' : 'text-gray-600'}`} />
                <div>
                  <p className={`font-medium ${limite.alerta ? 'text-amber-800' : 'text-gray-900'}`}>
                    {limite.actual} de {limite.limite === 'ilimitado' ? '∞' : limite.limite} usuarios
                  </p>
                  <p className={`text-sm ${limite.alerta ? 'text-amber-600' : 'text-gray-500'}`}>
                    {limite.limite === 'ilimitado' 
                      ? 'Sin límite en tu plan'
                      : `${limite.disponible} disponibles`
                    }
                  </p>
                </div>
              </div>
              {!limite.permitido && (
                <Link
                  to="/configuracion/plan"
                  className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700"
                >
                  Actualizar Plan
                </Link>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
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
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Usuario</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Rol</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">Estado</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">Último acceso</th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usuariosFiltrados.map((u) => {
                      const rolInfo = getRolInfo(u.rol);
                      return (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                                <span className="text-violet-600 font-semibold">{u.nombre.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{u.nombre}</p>
                                <p className="text-sm text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${rolInfo.color}`}>
                              <rolInfo.icon className="w-3 h-3" />
                              {rolInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${u.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {u.activo ? 'Activo' : 'Inactivo'}
                            </span>
                            {u.debe_cambiar_password && (
                              <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <Clock className="w-3 h-3" />
                                Password temporal
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-500">
                            {u.ultimo_login 
                              ? new Date(u.ultimo_login).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                              : 'Nunca'
                            }
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {u.rol !== 'keymaster' && (
                                <>
                                  <button 
                                    onClick={() => abrirModalEditar(u)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    title="Editar"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleResetPassword(u)}
                                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                                    title="Reset contraseña"
                                  >
                                    <Key className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleEliminar(u)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <UsuarioModal
        isOpen={modalUsuario}
        onClose={cerrarModal}
        onSuccess={cargarDatos}
        usuario={usuarioEditar}
        limite={limite}
      />
    </div>
  );
};

export default Usuarios;
