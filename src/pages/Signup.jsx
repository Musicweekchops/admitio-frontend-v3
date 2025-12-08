import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Building2, 
  User,
  Eye, 
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  Sparkles,
  Globe
} from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Institución
    institutionName: '',
    slug: '',
    
    // Step 2: Administrador
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    
    // Step 3: Plan
    plan: 'free',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');

    // Auto-generate slug from institution name
    if (name === 'institutionName') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 30);
      setFormData(prev => ({ ...prev, slug }));
      setSlugAvailable(null);
    }

    if (name === 'slug') {
      setSlugAvailable(null);
    }
  };

  const checkSlugAvailability = async () => {
    if (!formData.slug || formData.slug.length < 3) {
      setError('El código debe tener al menos 3 caracteres');
      return;
    }

    setCheckingSlug(true);
    try {
      // Simulated check - in production, this calls the API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, assume slug is available unless it's "demo" or "test"
      const unavailable = ['demo', 'test', 'admin', 'api', 'app', 'www'];
      setSlugAvailable(!unavailable.includes(formData.slug));
    } catch (err) {
      setError('Error verificando disponibilidad');
    } finally {
      setCheckingSlug(false);
    }
  };

  const validateStep = () => {
    setError('');

    if (step === 1) {
      if (!formData.institutionName.trim()) {
        setError('Ingresa el nombre de tu institución');
        return false;
      }
      if (!formData.slug || formData.slug.length < 3) {
        setError('El código debe tener al menos 3 caracteres');
        return false;
      }
      if (slugAvailable === false) {
        setError('Este código ya está en uso');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.adminName.trim()) {
        setError('Ingresa tu nombre');
        return false;
      }
      if (!formData.adminEmail.trim()) {
        setError('Ingresa tu email');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      // Simulated registration - in production, this calls the API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success! Redirect to login
      navigate('/login', { 
        state: { 
          message: '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.',
          tenant: formData.slug 
        } 
      });
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { 
      id: 'free', 
      name: 'Gratuito', 
      price: '$0', 
      desc: '2 usuarios, 100 leads',
      icon: '🎁'
    },
    { 
      id: 'pro', 
      name: 'Profesional', 
      price: '$49.990', 
      desc: '15 usuarios, 2,000 leads',
      icon: '🚀',
      popular: true
    },
    { 
      id: 'institution', 
      name: 'Institución', 
      price: '$99.990', 
      desc: '50 usuarios, 10,000 leads',
      icon: '🏛️'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 to-violet-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm text-white/90 mb-6">
            <Sparkles className="w-4 h-4" />
            Sin tarjeta de crédito
          </div>
          
          <h1 className="font-display text-4xl font-bold text-white mb-6">
            Comienza gratis hoy
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Regístrate en menos de 2 minutos y empieza a gestionar tus admisiones de manera profesional.
          </p>
          
          <div className="space-y-4">
            {[
              'Configuración instantánea',
              'Plan gratuito para siempre',
              'Soporte incluido',
              'Sin compromisos',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
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

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 rounded transition-all ${
                    step > s ? 'bg-violet-600' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-slate-800 mb-2">
              {step === 1 && 'Tu institución'}
              {step === 2 && 'Tu cuenta'}
              {step === 3 && 'Elige tu plan'}
            </h2>
            <p className="text-slate-600">
              {step === 1 && 'Ingresa los datos de tu institución educativa'}
              {step === 2 && 'Crea tu cuenta de administrador'}
              {step === 3 && 'Selecciona el plan que mejor se adapte a ti'}
            </p>
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
            {/* Step 1: Institution */}
            {step === 1 && (
              <>
                <div>
                  <label className="form-label">
                    Nombre de la institución
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleChange}
                      placeholder="Escuela de Música ProJazz"
                      className="form-input pl-12"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    Código único (URL)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      onBlur={checkSlugAvailability}
                      placeholder="mi-escuela"
                      className="form-input pl-12 pr-24"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {checkingSlug && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
                      {!checkingSlug && slugAvailable === true && (
                        <span className="text-emerald-500 text-sm flex items-center gap-1">
                          <Check className="w-4 h-4" /> Disponible
                        </span>
                      )}
                      {!checkingSlug && slugAvailable === false && (
                        <span className="text-red-500 text-sm">No disponible</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Tu URL será: <span className="font-mono bg-slate-100 px-1 rounded">{formData.slug || 'mi-escuela'}.admitio.cl</span>
                  </p>
                </div>
              </>
            )}

            {/* Step 2: Admin Account */}
            {step === 2 && (
              <>
                <div>
                  <label className="form-label">
                    Tu nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      placeholder="María González"
                      className="form-input pl-12"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="form-input pl-12"
                    />
                  </div>
                </div>

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
                      placeholder="Mínimo 6 caracteres"
                      className="form-input pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repite la contraseña"
                      className="form-input pl-12"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Plan Selection */}
            {step === 3 && (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.plan === plan.id
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-violet-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={formData.plan === plan.id}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{plan.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{plan.name}</span>
                            {plan.popular && (
                              <span className="px-2 py-0.5 bg-violet-500 text-white text-xs font-semibold rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-slate-500">{plan.desc}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-xl font-bold text-slate-800">{plan.price}</span>
                        <span className="text-slate-500 text-sm">/mes</span>
                      </div>
                    </div>
                  </label>
                ))}
                
                <p className="text-sm text-slate-500 text-center mt-4">
                  Puedes cambiar de plan en cualquier momento
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary flex-1 justify-center"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atrás
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary flex-1 justify-center"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1 justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Crear cuenta
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-500">o</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-violet-600 hover:text-violet-700 font-semibold">
              Inicia sesión
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

export default Signup;
