# 🎓 Admitio Frontend v3

Sistema de Gestión de Admisiones - Frontend React + Vite

## 🚀 Instalación Local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con la URL de tu backend
# VITE_API_URL=http://localhost:3000

# Iniciar en desarrollo
npm run dev
```

## 🌐 Deploy en Render

### 1. Subir a GitHub

```bash
git init
git add .
git commit -m "Admitio Frontend v3"
git remote add origin https://github.com/TU-USUARIO/admitio-frontend.git
git push -u origin main
```

### 2. Crear Static Site en Render

1. Dashboard → **New +** → **Static Site**
2. Conectar repositorio
3. Configurar:

| Campo | Valor |
|-------|-------|
| Name | `admitio-frontend` |
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### 3. Variables de Entorno

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://tu-backend.onrender.com` |

### 4. Configurar CORS en Backend

Asegúrate de que el backend tenga esta variable:
```
CORS_ORIGINS=https://tu-frontend.onrender.com
```

## 📁 Estructura

```
src/
├── App.jsx              # Rutas y providers
├── main.jsx             # Entry point
├── index.css            # Estilos Tailwind
├── context/
│   └── AuthContext.jsx  # Estado de autenticación
├── pages/
│   ├── Landing.jsx      # Página de inicio
│   ├── Login.jsx        # Login usuarios/admin
│   ├── Signup.jsx       # Registro de instituciones
│   ├── Verificar.jsx    # Verificación de cuenta
│   ├── CambiarPassword.jsx # Cambio de contraseña
│   ├── Dashboard.jsx    # Dashboard de usuario
│   ├── Usuarios.jsx     # Gestión de usuarios (KeyMaster)
│   └── AdminDashboard.jsx # Panel Super Owner
└── services/
    └── api.js           # Cliente API
```

## 🔐 Flujos de Autenticación

### Usuario Normal
1. Login con código de institución + email + password
2. Si tiene password temporal → Redirige a /cambiar-password
3. Dashboard con leads y estadísticas

### Super Owner
1. Login desde pestaña "Administrador"
2. Panel con todas las instituciones
3. Puede impersonar usuarios (ver como KeyMaster)

### Registro de Institución
1. Signup → Ingresa datos de institución + KeyMaster
2. Recibe email de verificación
3. Click en enlace → Cuenta activa
4. Login con credenciales

## 🔗 Conexión con Backend

El frontend se conecta al backend mediante el servicio `api.js`:

```javascript
// Ejemplo de uso
import { authAPI, leadsAPI } from './services/api';

// Login
await authAPI.login('mi-institucion', 'email@test.com', 'password');

// Obtener leads
const { leads } = await leadsAPI.list();

// Crear lead
await leadsAPI.create({ nombre: 'Juan', email: 'juan@test.com', telefono: '123456' });
```

## 📱 Páginas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Landing | Público |
| `/login` | Login | Público |
| `/signup` | Registro | Público |
| `/verificar/:token` | Verificar cuenta | Público |
| `/cambiar-password` | Cambiar contraseña | Autenticado |
| `/dashboard` | Dashboard usuario | Autenticado |
| `/usuarios` | Gestión usuarios | KeyMaster |
| `/admin` | Panel admin | Super Owner |

## 🛠️ Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview del build
```

## 📦 Dependencias

- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (iconos)

## 📝 Licencia

Propiedad de MWC Estudio - Todos los derechos reservados
