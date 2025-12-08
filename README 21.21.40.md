# Admitio Frontend v3.0

Frontend completo para Admitio - Sistema de Gestión de Admisiones.

## 🚀 Características

- **Landing Page** - Página de inicio con todas las secciones
- **Login** - Inicio de sesión para usuarios y administradores
- **Signup** - Registro de nuevas instituciones
- **Dashboard** - Panel de control para usuarios
- **Admin Dashboard** - Panel de administración (Super Owner)

## 📦 Stack Tecnológico

- React 18
- React Router 6
- Tailwind CSS 3
- Vite 5
- Lucide React (iconos)

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 🌐 Deploy en Render

### Opción 1: Static Site (Recomendado)

1. Crear nuevo **Static Site** en Render
2. Conectar tu repositorio de GitHub
3. Configurar:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Agregar variable de entorno:
   - `VITE_API_URL` = `https://admitio-api.onrender.com`
5. Deploy

### Opción 2: Desde el ZIP

1. Descomprimir el ZIP
2. Subir a GitHub
3. Seguir los pasos de Opción 1

## 🔧 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend | `https://admitio-api.onrender.com` |

## 📁 Estructura del Proyecto

```
src/
├── main.jsx           # Entry point
├── App.jsx            # Rutas y layout
├── index.css          # Estilos globales + Tailwind
├── context/
│   └── AuthContext.jsx    # Estado de autenticación
├── services/
│   └── api.js             # Llamadas a la API
├── pages/
│   ├── Landing.jsx        # Página de inicio
│   ├── Login.jsx          # Login
│   ├── Signup.jsx         # Registro
│   ├── Dashboard.jsx      # Panel usuario
│   └── AdminDashboard.jsx # Panel admin
└── components/           # (futuro)
```

## 🎨 Diseño

- **Tipografías:** Fraunces (display) + Outfit (body)
- **Colores:** Paleta Violet con acentos Emerald y Amber
- **Estilo:** Moderno, con animaciones y glassmorphism

## 🔐 Autenticación

El sistema soporta dos tipos de login:

1. **Usuario normal** - Requiere código de institución + email + password
2. **Administrador (Super Owner)** - Solo email + password

## 📱 Responsive

Todo el frontend es completamente responsive, optimizado para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🚀 Próximos Pasos

1. Conectar formularios con la API real
2. Implementar gestión completa de leads
3. Agregar reportes y gráficos
4. Implementar notificaciones en tiempo real

---

© 2024 Admitio - Hecho con 💜 en Chile
