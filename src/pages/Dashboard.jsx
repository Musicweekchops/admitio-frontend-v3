import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  ChevronRight,
  Clock,
  ChevronLeft
} from 'lucide-react';

// Sidebar Component
const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Users, label: 'Leads', count: 247 },
    { icon: UserCheck, label: 'Matriculados', count: 89 },
    { icon: BarChart3, label: 'Reportes' },
    { icon: Settings, label: 'Configuración' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 z-50
        transition-all duration-300 flex flex-col
        ${collapsed ? 'w-20' : 'w-72'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <span className="font-display text-xl font-bold text-white">Admitio</span>
            )}
          </Link>
          
          {/* Mobile Close */}
          <button 
            className="lg:hidden p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Collapse Button (Desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            hidden lg:flex w-full items-center justify-center gap-2 p-3 mx-4 rounded-xl mb-4 transition-all font-medium
            ${collapsed 
              ? 'bg-violet-700 text-white hover:bg-violet-800 w-12' 
              : 'bg-violet-100/10 text-violet-300 hover:bg-violet-100/20 w-[calc(100%-2rem)]'}
          `}
        >
          {collapsed ? <ChevronRight size={20} /> : <><ChevronLeft size={20} /><span className="text-sm">Colapsar</span></>}
        </button>

        {/* Tenant Info */}
        {!collapsed && tenant && (
          <div className="px-4 mb-6">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-white font-medium text-sm truncate">{tenant.nombre}</p>
              <p className="text-slate-400 text-xs truncate">{tenant.slug}.admitio.cl</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${item.active 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      item.active ? 'bg-white/20' : 'bg-slate-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-violet-300 font-semibold">
                {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.nombre}</p>
                <p className="text-slate-400 text-xs truncate">{user?.rol}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={`
              mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-red-400 hover:bg-red-500/10 transition-all
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

// Main Dashboard Content
const Dashboard = () => {
  const { user, tenant } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Demo data
  const stats = [
    { label: 'Leads Activos', value: '247', change: '+12%', up: true, color: 'violet' },
    { label: 'Matriculados', value: '89', change: '+8%', up: true, color: 'emerald' },
    { label: 'Tasa Conversión', value: '36%', change: '+3%', up: true, color: 'blue' },
    { label: 'Pendientes Hoy', value: '14', change: '-5', up: false, color: 'amber' },
  ];

  const recentLeads = [
    { name: 'María García', email: 'maria@email.com', career: 'Piano', status: 'nueva', time: 'Hace 5 min' },
    { name: 'Juan Pérez', email: 'juan@email.com', career: 'Guitarra', status: 'contactado', time: 'Hace 1 hora' },
    { name: 'Ana López', email: 'ana@email.com', career: 'Canto', status: 'seguimiento', time: 'Hace 2 horas' },
    { name: 'Carlos Ruiz', email: 'carlos@email.com', career: 'Batería', status: 'examen', time: 'Hace 3 horas' },
  ];

  const statusColors = {
    nueva: 'bg-amber-100 text-amber-700',
    contactado: 'bg-blue-100 text-blue-700',
    seguimiento: 'bg-violet-100 text-violet-700',
    examen: 'bg-purple-100 text-purple-700',
  };

  const colorClasses = {
    violet: { bg: 'bg-violet-50', icon: 'bg-violet-500', text: 'text-violet-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-500', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-500', text: 'text-amber-600' },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content */}
      <main className={`
        transition-all duration-300 min-h-screen
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
      `}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              {/* Search */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl w-80">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar leads..."
                  className="bg-transparent outline-none flex-1 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Add Lead Button */}
              <button className="btn btn-primary">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nuevo Lead</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
              ¡Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}! 👋
            </h1>
            <p className="text-slate-600">
              Aquí tienes un resumen de tus admisiones de hoy.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className={`${colorClasses[stat.color].bg} rounded-2xl p-5 lg:p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${colorClasses[stat.color].icon} rounded-xl flex items-center justify-center`}>
                    {i === 0 && <Users className="w-5 h-5 text-white" />}
                    {i === 1 && <UserCheck className="w-5 h-5 text-white" />}
                    {i === 2 && <BarChart3 className="w-5 h-5 text-white" />}
                    {i === 3 && <Clock className="w-5 h-5 text-white" />}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                    {stat.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className={`font-display text-3xl lg:text-4xl font-bold ${colorClasses[stat.color].text} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Leads & Chart */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-800">Leads Recientes</h2>
                <button className="text-violet-600 text-sm font-medium hover:underline">
                  Ver todos
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {recentLeads.map((lead, i) => (
                  <div key={i} className="p-4 lg:p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-semibold">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{lead.name}</p>
                          <p className="text-sm text-slate-500">{lead.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">{lead.time}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-slate-600">🎵 {lead.career}</span>
                      <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Conversion Chart Placeholder */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">Conversiones</h2>
                <div className="h-48 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 70].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-md transition-all hover:from-violet-500 hover:to-violet-300"
                        style={{ height: `${h}%` }}
                      ></div>
                      <span className="text-[10px] text-slate-400">
                        {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
                <h2 className="font-display text-lg font-semibold text-amber-800 mb-4">⚡ Pendientes Hoy</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <Phone className="w-5 h-5 text-amber-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">5 llamadas</p>
                      <p className="text-xs text-slate-500">Leads sin contactar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <Mail className="w-5 h-5 text-amber-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">9 seguimientos</p>
                      <p className="text-xs text-slate-500">Recordatorios activos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
