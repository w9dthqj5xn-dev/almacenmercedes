# 📦 Warehouse Management System

Sistema completo de gestión de almacén con roles diferenciados (Administrador y Despacho), autenticación Firebase y despliegue en Netlify.

## ✨ Características

### 👨‍💼 Panel Administrativo
- ✅ Dashboard completo del almacén
- ✅ Registro de productos con fotos múltiples
- ✅ Descripción detallada y SKU
- ✅ Gestión de inventario
- ✅ Edición y eliminación de productos
- ✅ Visualización de estadísticas de despacho
- ✅ Seguimiento de productos más/menos despachados

### 📦 Panel de Despacho
- ✅ Despachar mercancía desde inventario
- ✅ Seleccionar producto y cantidad
- ✅ Registrar destino del envío
- ✅ Historial de despachos realizados
- ✅ Resumen de inventario disponible
- ✅ **SIN acceso a**: eliminar, modificar nombres, cambiar existencias

### 🔐 Seguridad
- Autenticación Firebase
- Roles diferenciados (admin/dispatch)
- Rutas protegidas
- Control de permisos por rol

## 🚀 Requisitos Previos

- Node.js 14+ y npm
- Cuenta Firebase
- Git (opcional)

## 📋 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd /Users/ing.carlosjimenez/almacen
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Ve a "Configuración del proyecto" > "Claves de API web"
4. Copia las credenciales

### 4. Crear archivo `.env.local`

```bash
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
REACT_APP_FIREBASE_APP_ID=tu_app_id
```

### 5. Configurar Firebase en consola

**Activar autenticación:**
- Ir a Firebase Console > Authentication
- Activar "Email/Password"

**Crear Firestore Database:**
- Ir a Firebase Console > Firestore Database
- Crear base de datos en modo "iniciar en modo de prueba"
- Crear colecciones: `users`, `inventory`, `dispatch_history`

**Configurar Storage:**
- Ir a Firebase Console > Storage
- Crear bucket para fotos

**Crear usuarios de prueba:**

```sql
-- Usuario Admin
email: admin@test.com
password: password123

-- Usuario Despacho
email: dispatch@test.com
password: password123
```

Luego crear los documentos en Firestore:

**Colección `users`:**
```json
{
  "admin_uid": {
    "email": "admin@test.com",
    "role": "admin",
    "createdAt": "timestamp",
    "active": true
  },
  "dispatch_uid": {
    "email": "dispatch@test.com",
    "role": "dispatch",
    "createdAt": "timestamp",
    "active": true
  }
}
```

## 🎯 Usar en Desarrollo

```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

### Credenciales de Prueba
- **Admin**: admin@test.com / password123
- **Despacho**: dispatch@test.com / password123

## 📦 Compilar para Producción

```bash
npm run build
```

Esto crea una carpeta `build/` lista para despliegue.

## 🌐 Desplegar en Netlify

### Opción 1: Conectar con Git

1. Sube el proyecto a GitHub
2. Ve a [Netlify](https://app.netlify.com/)
3. Clickea "New site from Git"
4. Selecciona tu repositorio
5. Configura:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Agrega variables de entorno en Netlify (Settings > Environment)
7. Deploy

### Opción 2: Deploying manual

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

## 📁 Estructura del Proyecto

```
almacen/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   └── Header.js
│   ├── config/
│   │   └── firebase.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── AdminDashboard.js
│   │   └── DispatchHome.js
│   ├── styles/
│   │   ├── Admin.css
│   │   ├── Auth.css
│   │   ├── Dispatch.css
│   │   └── Header.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## 🔄 Flujo de Trabajo

### Admin
1. Login con admin@test.com
2. Accede a Dashboard
3. Agrega productos con fotos
4. Edita/elimina productos
5. Ve estadísticas de despacho

### Despacho
1. Login con dispatch@test.com
2. Accede a Home de Despacho
3. Selecciona producto y cantidad
4. Registra destino
5. Despacha (esto actualiza el inventario automáticamente)
6. Ve historial de despachos

## 🛠️ Próximas Mejoras (Futuro)

- [ ] Estadísticas avanzadas y gráficos
- [ ] Exportar reportes a PDF/Excel
- [ ] Sistema de notificaciones
- [ ] Códigos QR para productos
- [ ] Dashboard de análisis más detallado
- [ ] Roles adicionales (gerente, auditor)
- [ ] Integración con sistema de compras
- [ ] API REST para terceros
- [ ] Autenticación con 2FA
- [ ] Auditoría completa de cambios

## 🐛 Solucionar Problemas

### Error: "Firebase is not initialized"
- Verifica que `.env.local` tenga las credenciales correctas
- Reinicia el servidor: `npm start`

### Error: "Permission denied" en Firestore
- En Firebase Console, ve a Firestore > Reglas
- Cambia a modo "Iniciar en modo de prueba" (solo para desarrollo)

### Las fotos no se suben
- Verifica que Storage esté activado en Firebase
- Comprueba los permisos en Firebase Console

## 📞 Soporte

Para reportar problemas o sugerencias, abre un issue en el repositorio.

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---

**Creado con ❤️ usando React, Firebase y Netlify**
