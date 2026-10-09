# 🚀 GUÍA DE INICIO RÁPIDO - Warehouse Management

## ✅ Proyecto Creado Exitosamente

Tu aplicación de gestión de almacén está lista. Aquí está lo que necesitas hacer:

---

## 📌 PASO 1: Configurar Firebase (IMPORTANTE)

### A. Crear Proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto (ej: "warehouse-management")
4. Acepta los términos y crea el proyecto

### B. Obtener Credenciales
1. En Firebase Console, ve a **⚙️ Configuración del proyecto**
2. Ve a la pestaña **"Aplicaciones"** → **Web** (icono `</>`
3. Registra tu aplicación web
4. Copia las credenciales que aparecen

### C. Configurar `.env.local`
Abre el archivo `.env.local` en la raíz del proyecto y reemplaza:

```bash
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 📲 PASO 2: Activar Servicios en Firebase

### Autenticación
1. En Firebase → **Authentication**
2. Haz clic en **Get started**
3. Selecciona **Email/Password** y actívalo
4. En **Users**, crea dos usuarios de prueba:
   - Email: `admin@test.com` | Contraseña: `password123`
   - Email: `dispatch@test.com` | Contraseña: `password123`

### Firestore Database
1. Firebase → **Firestore Database**
2. Haz clic en **Create database**
3. Selecciona **Start in test mode** (para desarrollo)
4. Crea estas colecciones vacías:
   - `users`
   - `inventory`
   - `dispatch_history`

### Cloud Storage
1. Firebase → **Storage**
2. Haz clic en **Get started**
3. Aceptar reglas por defecto (para pruebas)

---

## 🔐 PASO 3: Crear Usuarios en Firestore

Después de crear los usuarios en Authentication, ve a **Firestore → Colección "users"** y crea estos documentos:

**Documento 1 - Admin:**
- ID del documento: (el UID del usuario admin@test.com)
- Contenido:
```json
{
  "email": "admin@test.com",
  "role": "admin",
  "active": true,
  "createdAt": "2024-10-07"
}
```

**Documento 2 - Despacho:**
- ID del documento: (el UID del usuario dispatch@test.com)
- Contenido:
```json
{
  "email": "dispatch@test.com",
  "role": "dispatch",
  "active": true,
  "createdAt": "2024-10-07"
}
```

> **Nota:** El UID lo encuentras en Firebase → Authentication → Users (columna UID)

---

## 🎮 PASO 4: Ejecutar la Aplicación

```bash
cd /Users/ing.carlosjimenez/almacen
npm start
```

La aplicación se abrirá en `http://localhost:3000`

### Credenciales de Prueba
```
👨‍💼 Admin:
   Email: admin@test.com
   Contraseña: password123

📦 Despacho:
   Email: dispatch@test.com
   Contraseña: password123
```

---

## 🏗️ ESTRUCTURA DEL PROYECTO

```
almacen/
├── src/
│   ├── components/
│   │   ├── Login.js              ← Pantalla de login
│   │   └── Header.js             ← Header con info de usuario
│   ├── pages/
│   │   ├── AdminDashboard.js     ← Dashboard del admin
│   │   └── DispatchHome.js       ← Pantalla de despacho
│   ├── context/
│   │   └── AuthContext.js        ← Gestión de autenticación
│   ├── config/
│   │   └── firebase.js           ← Configuración Firebase
│   ├── styles/
│   │   ├── Admin.css
│   │   ├── Auth.css
│   │   ├── Dispatch.css
│   │   └── Header.css
│   ├── App.js                    ← Componente principal
│   └── index.js                  ← Punto de entrada
├── .env.local                    ← Variables de entorno
├── package.json
├── netlify.toml                  ← Config para Netlify
└── README.md
```

---

## ✨ CARACTERÍSTICAS IMPLEMENTADAS

### 👨‍💼 ADMIN
- ✅ Registrar productos con fotos múltiples
- ✅ Editar productos
- ✅ Eliminar productos
- ✅ Ver inventario completo
- ✅ Ver estadísticas de despachos
- ✅ Dashboard con resumen

### 📦 DESPACHO
- ✅ Despachar mercancía
- ✅ Seleccionar producto y cantidad
- ✅ Registrar destino del envío
- ✅ Ver historial de despachos
- ✅ Ver resumen de inventario
- ❌ NO puede eliminar/modificar productos

---

## 🌐 DESPLEGAR EN NETLIFY (Próximo Paso)

Cuando esté todo listo:

```bash
# 1. Compilar para producción
npm run build

# 2. Instalar Netlify CLI
npm install -g netlify-cli

# 3. Desplegar
netlify deploy --prod --dir=build
```

O conectar tu repositorio de GitHub directamente en Netlify.

---

## 🐛 Solucionar Problemas

**Error: "Firebase is not initialized"**
→ Verifica que `.env.local` tenga las credenciales correctas

**Error: "Permission denied"**
→ En Firebase, ve a Firestore → Rules y usa modo "test"

**Las fotos no se suben**
→ Verifica que Storage esté activado en Firebase

---

## 📞 Próximas Opciones de Mejora

Cuando quieras agregar:
- ✨ Estadísticas y gráficos avanzados
- 📊 Exportar reportes (PDF/Excel)
- 🔔 Sistema de notificaciones
- 📱 Códigos QR
- 🔐 Autenticación 2FA
- 📈 Análisis más detallados

¡Solo dime y lo implementamos!

---

## 🎯 Resumen

1. ✅ Proyecto creado con React
2. ✅ Firebase configurado
3. ⏳ **AHORA:** Completa la configuración de Firebase
4. ⏳ Ejecuta `npm start` cuando esté lista
5. ⏳ Prueba con los usuarios de prueba
6. ⏳ Sube a Netlify cuando esté listo

---

**¿Necesitas ayuda con Firebase? ¡Avísame! Puedo guiarte paso a paso.**
