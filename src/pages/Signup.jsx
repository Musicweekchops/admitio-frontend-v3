import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupAPI } from '../services/api';
import { 
  GraduationCap, Building, User, Mail, Lock, Eye, EyeOff, 
  AlertCircle, CheckCircle, ArrowLeft, ArrowRight, Loader
} from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Institución
    nombre: '',
    slug: '',
    // KeyMaster
    keymaster_nombre: '',
    keymaster_email: '',
    password: '',
    passwordConfirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugStatus, setSlugStatus] = useState({ checking: false, available: null, message: '' });
  const [success, setSuccess] = useState(false);

  // Generar slug automáticamente
  const generarSlug = (nombre) => {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  };

  // Verificar disponibilidad del slug
  useEffect(() => {
    const checkSlug = async () => {
      if (!formData.slug || formData.slug.length < 3) {
        setSlugStatus({ checking: false, available: null, message: '' });
        return;
      }

      setSlugStatus({ checking: true, available: null, message: '' });

      try {
        const result = await signupAPI.checkSlug(formData.slug);
        setSlugStatus({
          checking: false,
          available: result.disponible,
          message: result.disponible ? 'Disponible' : result.mensaje || 'No disponible',
        });
      } catch (err) {
        setSlugStatus({
          checking: false,
          available: false,
          message: err.message,
        });
      }
    };

    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [formData.slug]);

  const handleNombreChange = (e) => {
    const nombre = e.target.value;
    setFormData({
      ...formData,
      nombre,
      slug: generarSlug(nombre),
    });
  };

  // Validaciones
  const validacionesPassword = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    match: formData.password === formData.passwordConfirm && formData.passwordConfirm !== '',
  };

  const passwordValida = Object.values(validacionesPassword).every(Boolean);

  const puedeAvanzarStep1 = formData.nombre && formData.slug && slugStatus.available;
  const puedeAvanzarStep2 = formData.keymaster_nombre && formData.keymaster_email && passwordValida;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!puedeAvanzarStep2) {
      setError('Por favor completa todos los campos correctamente');
      return;
    }

    setLoading(true);
    setError('');

    try {
     await signupAPI.register({
  nombreInstitucion: formData.nombre,
  slug: formData.slug,
  nombreKeymaster: formData.keymaster_nombre,
  emailKeymaster: formData.keymaster_email,
  password: formData.password,
});
      
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro exitoso!</h2>
          <p className="text-gray-600 mb-6">
            Hemos enviado un email de verificación a <strong>{formData.keymaster_email}</strong>. 
            Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
          </p>
          
          <div className="bg-violet-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-violet-600 mb-1">Tu institución:</p>
            <p className="font-bold text-violet-900">{formData.nombre}</p>
            <p className="text-sm text-violet-600">{formData.slug}.admitio.cl</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/verificar"
              className="block w-full py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 text-center"
            >
              Ya verifiqué mi cuenta
            </Link>
            <Link
              to="/login"
              className="block text-violet-600 hover:text-violet-700 font-medium"
            >
              Ir al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 to-violet-900 p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">Admitio</span>
          </Link>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Comienza gratis hoy
          </h1>
          <p className="text-violet-200 text-lg mb-8">
            Registra tu institución en menos de 2 minutos y empieza a gestionar tus admisiones de forma profesional.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-5 h-5 text-violet-300" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-5 h-5 text-violet-300" />
              <span>Configuración instantánea</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-5 h-5 text-violet-300" />
              <span>Soporte incluido</span>
            </div>
          </div>
        </div>

        <div className="text-violet-200 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-white font-medium hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">Admitio</span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-violet-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-violet-600' : 'bg-gray-200'}`} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 1 ? 'Datos de tu institución' : 'Tu cuenta de administrador'}
          </h2>
          <p className="text-gray-600 mb-6">
            {step === 1 
              ? 'Ingresa los datos básicos de tu colegio o escuela'
              : 'Crea tu cuenta de KeyMaster (administrador principal)'
            }
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Institución */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la institución *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={handleNombreChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="Colegio San José"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código único (URL) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 pr-10 ${
                        slugStatus.available === true ? 'border-green-500' :
                        slugStatus.available === false ? 'border-red-500' :
                        'border-gray-300'
                      }`}
                      placeholder="colegio-san-jose"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {slugStatus.checking && <Loader className="w-5 h-5 text-gray-400 animate-spin" />}
                      {!slugStatus.checking && slugStatus.available === true && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {!slugStatus.checking && slugStatus.available === false && <AlertCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${
                    slugStatus.available === true ? 'text-green-600' :
                    slugStatus.available === false ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {slugStatus.message || `Tu URL: ${formData.slug || 'tu-institucion'}.admitio.cl`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!puedeAvanzarStep1}
                  className="w-full py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: KeyMaster */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tu nombre completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.keymaster_nombre}
                      onChange={(e) => setFormData({ ...formData, keymaster_nombre: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.keymaster_email}
                      onChange={(e) => setFormData({ ...formData, keymaster_email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.passwordConfirm}
                      onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                </div>

                {/* Requisitos de contraseña */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-medium text-gray-600 mb-2">Requisitos:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <div className={`flex items-center gap-1 text-xs ${validacionesPassword.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3" /> 8+ caracteres
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${validacionesPassword.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3" /> 1 mayúscula
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${validacionesPassword.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3" /> 1 minúscula
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${validacionesPassword.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="w-3 h-3" /> 1 número
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${validacionesPassword.match ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className="w-3 h-3" /> Las contraseñas coinciden
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !puedeAvanzarStep2}
                    className="flex-1 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Registrando...' : 'Crear cuenta'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-gray-600 lg:hidden">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium">
              Inicia sesión
            </Link>
          </p>

          {/* Back to home */}
          <p className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
