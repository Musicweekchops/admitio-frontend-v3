import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Building2, 
  Eye, 
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, adminLogin } = useAuth();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    tenant: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isAdmin) {
        await adminLogin(formData.email, formData.password);
        navigate('/admin');
      } else {
        if (!formData.tenant) {
          throw new Error('Ingresa el código de tu institución');
        }
        await login(formData.tenant, formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 to-violet-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="font-display text-2xl font-bold">Admitio</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold text-white mb-6">
            Bienvenido de vuelta
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Accede a tu cuenta para continuar gestionando tus admisiones de manera inteligente.
          </p>
          
          <div className="space-y-4">
            {[
              'Dashboard con métricas en tiempo real',
              'Gestión de leads centralizada',
              'Seguimiento automatizado',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2024 Admitio. Todos los derechos reservados.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-slate-800">Admitio</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-slate-800 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-slate-600">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          {/* Toggle Admin/User */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                !isAdmin
                  ? 'bg-white text-violet-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Usuario
            </button>
            <button
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                isAdmin
                  ? 'bg-white text-violet-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              Administrador
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-scale-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tenant Field (only for users) */}
            {!isAdmin && (
              <div>
                <label className="form-label">
                  Código de institución
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="tenant"
                    value={formData.tenant}
                    onChange={handleChange}
                    placeholder="mi-escuela"
                    className="form-input pl-12"
                    required={!isAdmin}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Ejemplo: si accedes a <span className="font-mono bg-slate-100 px-1 rounded">projazz.admitio.cl</span>, escribe <span className="font-mono bg-slate-100 px-1 rounded">projazz</span>
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="form-label">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="form-input pl-12"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="form-label">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button type="button" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-large w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-500">o</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link to="/signup" className="text-violet-600 hover:text-violet-700 font-semibold">
              Registra tu institución
            </Link>
          </p>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
