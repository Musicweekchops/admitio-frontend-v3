import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Trash2,
  Edit,
  Power,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNewTenantModal, setShowNewTenantModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Demo data
  const stats = [
    { label: 'Clientes Activos', value: '12', icon: Building2, color: 'violet' },
    { label: 'Total Usuarios', value: '156', icon: Users, color: 'blue' },
    { label: 'Total Leads', value: '3,847', icon: BarChart3, color: 'emerald' },
    { label: 'MRR', value: '$450K', icon: DollarSign, color: 'amber' },
  ];

  const tenants = [
    { id: 1, name: 'ProJazz Escuela de Música', slug: 'projazz', plan: 'pro', users: 8, leads: 1247, active: true },
    { id: 2, name: 'Conservatorio del Sur', slug: 'conservatorio-sur', plan: 'institution', users: 25, leads: 890, active: true },
    { id: 3, name: 'Academia Voz y Arte', slug: 'voz-arte', plan: 'pro', users: 5, leads: 456, active: true },
    { id: 4, name: 'Escuela de Rock Santiago', slug: 'rock-santiago', plan: 'free', users: 2, leads: 89, active: false },
  ];

  const planColors = {
    free: 'bg-slate-100 text-slate-600',
    pro: 'bg-violet-100 text-violet-700',
    institution: 'bg-emerald-100 text-emerald-700',
  };

  const colorClasses = {
    violet: { bg: 'bg-violet-50', icon: 'bg-violet-500' },
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-500' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-500' },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 to-slate-800 z-50
        transition-transform duration-300 flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-white">Admitio</span>
              <span className="block text-xs text-violet-300">Panel Admin</span>
            </div>
          </Link>
          
          <button 
            className="lg:hidden p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Building2, label: 'Clientes' },
            { icon: BarChart3, label: 'Reportes Globales' },
            { icon: Settings, label: 'Configuración' },
          ].map((item, i) => (
            <button
              key={i}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${item.active 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
              <span className="text-violet-300 font-semibold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.nombre || 'Admin'}</p>
              <p className="text-violet-300 text-xs">Super Owner</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl w-80">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar clientes..."
                  className="bg-transparent outline-none flex-1 text-sm"
                />
              </div>
            </div>

            <button 
              onClick={() => setShowNewTenantModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nuevo Cliente</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
              Panel de Administración 🎯
            </h1>
            <p className="text-slate-600">
              Gestiona todos los clientes de Admitio desde aquí.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className={`${colorClasses[stat.color].bg} rounded-2xl p-5 lg:p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${colorClasses[stat.color].icon} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="font-display text-3xl lg:text-4xl font-bold text-slate-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tenants Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-800">Clientes</h2>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-2">
                <option>Todos los planes</option>
                <option>Free</option>
                <option>Pro</option>
                <option>Institution</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Cliente</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Plan</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Usuarios</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Leads</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Estado</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-semibold">
                            {tenant.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{tenant.name}</p>
                            <p className="text-sm text-slate-500">{tenant.slug}.admitio.cl</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${planColors[tenant.plan]}`}>
                          {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{tenant.users}</td>
                      <td className="px-5 py-4 text-slate-600">{tenant.leads.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tenant.active 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tenant.active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {tenant.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Ver">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Suspender">
                            <Power className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* New Tenant Modal */}
      {showNewTenantModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-slate-800">Nuevo Cliente</h3>
              <button 
                onClick={() => setShowNewTenantModal(false)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="form-label">Nombre de la institución</label>
                <input type="text" className="form-input" placeholder="Escuela de Música" />
              </div>
              <div>
                <label className="form-label">Código (slug)</label>
                <input type="text" className="form-input" placeholder="escuela-musica" />
              </div>
              <div>
                <label className="form-label">Email del administrador</label>
                <input type="email" className="form-input" placeholder="admin@escuela.cl" />
              </div>
              <div>
                <label className="form-label">Nombre del administrador</label>
                <input type="text" className="form-input" placeholder="María González" />
              </div>
              <div>
                <label className="form-label">Plan</label>
                <select className="form-input">
                  <option value="free">Gratuito</option>
                  <option value="pro">Profesional</option>
                  <option value="institution">Institución</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowNewTenantModal(false)}
                  className="btn btn-secondary flex-1 justify-center"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-1 justify-center">
                  Crear Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
