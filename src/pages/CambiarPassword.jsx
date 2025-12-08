import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { GraduationCap, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const CambiarPassword = () => {
  const navigate = useNavigate();
  const { user, actualizarUsuario, isSuperOwner } = useAuth();
  
  const [formData, setFormData] = useState({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirmar: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validaciones = {
    minLength: formData.passwordNueva.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.passwordNueva),
    hasLowercase: /[a-z]/.test(formData.passwordNueva),
    hasNumber: /[0-9]/.test(formData.passwordNueva),
    match: formData.passwordNueva === formData.passwordConfirmar && formData.passwordConfirmar !== '',
  };

  const passwordValida = Object.values(validaciones).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordValida) {
      setError('La contraseña no cumple con los requisitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.cambiarPassword(formData.passwordActual, formData.passwordNueva);
      setSuccess(true);
      actualizarUsuario({ debeCambiarPassword: false });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate(isSuperOwner ? '/admin' : '/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Contraseña actualizada!</h2>
          <p className="text-gray-600 mb-4">Tu contraseña ha sido cambiada exitosamente.</p>
          <p className="text-sm text-gray-500">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="font-bold text-2xl text-gray-900">Admitio</span>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cambiar Contraseña</h1>
          <p className="text-gray-600">
            {user?.debeCambiarPassword 
              ? 'Debes cambiar tu contraseña temporal antes de continuar.'
              : 'Ingresa tu nueva contraseña.'
            }
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                type={showPasswords.actual ? 'text' : 'password'}
                required
                value={formData.passwordActual}
                onChange={(e) => setFormData({ ...formData, passwordActual: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 pr-10"
                placeholder="Tu contraseña temporal"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, actual: !showPasswords.actual })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.actual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.nueva ? 'text' : 'password'}
                required
                value={formData.passwordNueva}
                onChange={(e) => setFormData({ ...formData, passwordNueva: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 pr-10"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, nueva: !showPasswords.nueva })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.nueva ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmar ? 'text' : 'password'}
                required
                value={formData.passwordConfirmar}
                onChange={(e) => setFormData({ ...formData, passwordConfirmar: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 pr-10"
                placeholder="Repite tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirmar: !showPasswords.confirmar })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Requisitos */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Requisitos de la contraseña:</p>
            <div className={`flex items-center gap-2 text-sm ${validaciones.minLength ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle className={`w-4 h-4 ${validaciones.minLength ? '' : 'opacity-30'}`} />
              Mínimo 8 caracteres
            </div>
            <div className={`flex items-center gap-2 text-sm ${validaciones.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle className={`w-4 h-4 ${validaciones.hasUppercase ? '' : 'opacity-30'}`} />
              Al menos una mayúscula
            </div>
            <div className={`flex items-center gap-2 text-sm ${validaciones.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle className={`w-4 h-4 ${validaciones.hasLowercase ? '' : 'opacity-30'}`} />
              Al menos una minúscula
            </div>
            <div className={`flex items-center gap-2 text-sm ${validaciones.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle className={`w-4 h-4 ${validaciones.hasNumber ? '' : 'opacity-30'}`} />
              Al menos un número
            </div>
            <div className={`flex items-center gap-2 text-sm ${validaciones.match ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle className={`w-4 h-4 ${validaciones.match ? '' : 'opacity-30'}`} />
              Las contraseñas coinciden
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !passwordValida}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambiarPassword;
