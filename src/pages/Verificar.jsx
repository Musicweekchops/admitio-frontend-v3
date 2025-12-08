import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { signupAPI } from '../services/api';
import { GraduationCap, CheckCircle, XCircle, Loader, Mail } from 'lucide-react';

const Verificar = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [estado, setEstado] = useState('verificando'); // verificando, exito, error
  const [mensaje, setMensaje] = useState('');
  const [tenant, setTenant] = useState(null);
  const [emailReenvio, setEmailReenvio] = useState('');
  const [reenviando, setReenviando] = useState(false);

  useEffect(() => {
    if (token) {
      verificarCuenta();
    }
  }, [token]);

  const verificarCuenta = async () => {
    try {
      const result = await signupAPI.verificar(token);
      setEstado('exito');
      setTenant(result.tenant);
      setMensaje(result.message);
    } catch (err) {
      setEstado('error');
      setMensaje(err.message);
    }
  };

  const handleReenviar = async (e) => {
    e.preventDefault();
    setReenviando(true);
    
    try {
      await signupAPI.reenviarVerificacion(emailReenvio);
      alert('Se ha enviado un nuevo enlace de verificación a tu email.');
    } catch (err) {
      alert(err.message);
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="font-bold text-2xl text-gray-900">Admitio</span>
        </div>

        {/* Verificando */}
        {estado === 'verificando' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verificando tu cuenta</h2>
            <p className="text-gray-600">Por favor espera un momento...</p>
          </div>
        )}

        {/* Éxito */}
        {estado === 'exito' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Cuenta verificada!</h2>
            <p className="text-gray-600 mb-6">{mensaje}</p>
            
            {tenant && (
              <div className="bg-violet-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-violet-600 mb-1">Tu institución:</p>
                <p className="font-bold text-violet-900">{tenant.nombre}</p>
                <p className="text-sm text-violet-600">{tenant.slug}.admitio.cl</p>
              </div>
            )}

            <Link
              to="/login"
              className="block w-full py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-violet-800 text-center"
            >
              Iniciar Sesión
            </Link>
          </div>
        )}

        {/* Error */}
        {estado === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error de verificación</h2>
            <p className="text-gray-600 mb-6">{mensaje}</p>

            {/* Formulario para reenviar */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-3">
                ¿El enlace expiró? Ingresa tu email para recibir uno nuevo:
              </p>
              <form onSubmit={handleReenviar} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={emailReenvio}
                    onChange={(e) => setEmailReenvio(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                    placeholder="tu-email@ejemplo.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={reenviando}
                  className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {reenviando ? 'Enviando...' : 'Reenviar enlace'}
                </button>
              </form>
            </div>

            <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium">
              Volver al login
            </Link>
          </div>
        )}

        {/* Sin token */}
        {!token && (
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verifica tu cuenta</h2>
            <p className="text-gray-600 mb-6">
              Revisa tu correo electrónico y haz clic en el enlace de verificación que te enviamos.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-3">
                ¿No recibiste el email? Ingresa tu correo para reenviar:
              </p>
              <form onSubmit={handleReenviar} className="space-y-3">
                <input
                  type="email"
                  required
                  value={emailReenvio}
                  onChange={(e) => setEmailReenvio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  placeholder="tu-email@ejemplo.com"
                />
                <button
                  type="submit"
                  disabled={reenviando}
                  className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {reenviando ? 'Enviando...' : 'Reenviar enlace'}
                </button>
              </form>
            </div>

            <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium">
              Volver al login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verificar;
