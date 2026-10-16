# Arquitectura - Warehouse Management System

## Flujo de Autenticación

```
┌─────────────────────────────────────┐
│  Usuario No Autenticado             │
│  (Página de Login)                  │
└──────────────┬──────────────────────┘
               │
               ├──→ Email + Password
               │
               ↓
┌─────────────────────────────────────┐
│  Firebase Authentication            │
│  (firebase/auth)                    │
└──────────────┬──────────────────────┘
               │
               ├──→ ✅ Login Exitoso
               │
               ↓
┌─────────────────────────────────────┐
│  Obtener Rol del Usuario            │
│  (Realtime Database: /users/{uid})  │
└──────────────┬──────────────────────┘
               │
               ├──→ role: "admin" ──→ Admin Dashboard
               │
               └──→ role: "dispatch" → Dispatch Dashboard
```

## Estructura de Datos en Firebase

```
almacenmercedes-461d2 (Proyecto Firebase)
│
├── 🔐 Authentication
│   └── Users registrados con email/password
│
├── 📊 Realtime Database
│   ├── /users
│   │   └── {uid}
│   │       ├── email: "admin@example.com"
│   │       ├── role: "admin"
│   │       ├── name: "Administrador"
│   │       └── created: ISO timestamp
│   │
│   └── /products
│       └── {productId}
│           ├── name: "Producto A"
│           ├── description: "Descripción"
│           ├── quantity: 100
│           ├── sku: "SKU-0001"
│           ├── photos: ["url1", "url2"]
│           ├── dispatched: 0
│           ├── created: ISO timestamp
│           └── lastUpdated: ISO timestamp
│
└── 🖼️ Storage (Bucket)
    └── products/
        ├── 1699564800000_abc123_photo1.jpg
        ├── 1699564800000_def456_photo2.png
        └── ...
```

## Componentes React

```
App.js
├── Router (React Router v6)
├── Routes:
│   ├── /login → LoginPage.js
│   ├── /admin → AdminDashboard.js
│   └── /dispatch → DispatchDashboard.js
│
├── Componentes Compartidos:
│   ├── Header.js (nombre usuario + logout)
│   ├── PhotoGallery.js (galería de imágenes)
│   └── SearchFilters.js (búsqueda y filtrado)
│
├── Componentes Admin:
│   ├── UserManagement.js (CRUD de usuarios)
│   └── AdminDashboard.js con:
│       ├── Tabla de productos
│       ├── Formulario agregar/editar
│       ├── Exportar CSV/PDF
│       └── Gestión de usuarios
│
├── Componentes Dispatch:
│   └── DispatchDashboard.js (vista lectura)
│
└── Utilidades:
    ├── imageStorage.js (subir imágenes)
    ├── exportData.js (PDF/CSV)
    └── firebase.js (configuración)
```

## Flujo de Subida de Imágenes

```
Usuario selecciona imagen(es)
           ↓
   onPhotoSelect()
   ├── Compress image
   └── Show preview
           ↓
  Usuario hace submit
           ↓
  handleSubmit() en AdminDashboard
           ↓
  uploadImage() en imageStorage.js
           ↓
  ┌─────────────────────────────────┐
  │ Intentar subir a Storage        │
  │ (Firebase Cloud Storage)        │
  └────────────┬────────────────────┘
               │
        ✅ Éxito ✗ Fallo
               │        │
               ↓        ↓
           URL      ┌─────────────────────────────────┐
                    │ Fallback: Base64 en Database    │
                    │ (Realtime Database)             │
                    └────────────┬────────────────────┘
                                 │
                                 ↓
                            Data URL
                                 │
                    ┌────────────┴────────────┐
                    ↓                         ↓
              Guardar en              Mostrar en
              /products/...           Interfaz
```

## Seguridad - Firebase Rules

### Database Rules (database.rules.json)
```
/users
├── .read: auth != null
└── .write: root.child('users').child(auth.uid).child('role').val() === 'admin'
            || auth.uid === $uid

/products
├── .read: auth != null
└── .write: root.child('users').child(auth.uid).child('role').val() === 'admin'
```

### Storage Rules (storage.rules)
```
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if request.auth != null
      allow write: if isAdmin()  // Solo admin puede subir
      allow delete: if isAdmin()
    }
    match /{allPaths=**} {
      allow read, write: if false  // Bloquear acceso a otros
    }
  }
}
```

## Estados de Carga y Fallback

```
┌────────────────────────────────────┐
│ Producto con Imagen                │
└────────────┬───────────────────────┘
             │
      handleSubmit()
             │
      Storage Habilitado?
       ↙ Sí          ↘ No
      │               │
      ↓               ↓
  Firebase        Base64 en
  Storage         Database
      │               │
      └───────┬───────┘
              │
              ↓
      ProductId guardado
              │
    photos: ["URL1", "URL2"]
              │
              ↓
     Disponible en Galería
              │
      ✅ Éxito
```

## Flujo de Roles y Permisos

```
┌──────────────────────────────────────┐
│ ADMIN                                │
├──────────────────────────────────────┤
│ • Ver todos los productos            │
│ • Crear productos                    │
│ • Editar productos                   │
│ • Eliminar productos                 │
│ • Subir imágenes                     │
│ • Gestionar usuarios                 │
│ • Crear nuevos admins/dispatchers    │
│ • Exportar datos (CSV/PDF)           │
│ • Ver estadísticas                   │
│ • Escribir en Database y Storage     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ DISPATCH                             │
├──────────────────────────────────────┤
│ ✓ Ver inventario                     │
│ ✓ Ver detalles de productos          │
│ ✓ Ver fotos de productos             │
│ ✗ Crear productos                    │
│ ✗ Editar productos                   │
│ ✗ Eliminar productos                 │
│ ✗ Subir imágenes                     │
│ ✗ Gestionar usuarios                 │
│ ✗ Exportar datos                     │
│ • Solo lectura en Database y Storage │
└──────────────────────────────────────┘
```

## Ciclo de Desarrollo

```
npm start
    ↓
    ├── Modo Local (DEFAULT)
    │   └── Usa localStorage
    │       (desarrollo sin Firebase)
    │
    └── Modo Firebase (si isLocalMode=false)
        ├── Authentication
        ├── Realtime Database
        └── Storage (si habilitado)
         
npm run build
    ↓
Producción (Netlify)
    ├── Variables de entorno Firebase
    ├── CORS habilitado
    └── Storage + Database
```

## Diagrama Completo de Interacción

```
┌─────────────────────────────────────────────────────────────────┐
│                        APLICACIÓN WEB                           │
│  (React + Webpack)                                              │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ LoginPage    │→ │ AdminDash    │→ │ DispatchDash │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
        ┌───────────▼──────────┐  ┌────▼──────────────┐
        │ Firebase Projects    │  │ External APIs    │
        │ almacenmercedes-461d2│  │ (si necesario)   │
        │                      │  │                  │
        │ ├─ Authentication    │  │ ├─ Email         │
        │ ├─ Realtime DB       │  │ ├─ Analytics     │
        │ └─ Storage (opcional)│  │ └─ Monitoring    │
        └──────────────────────┘  └──────────────────┘
```

## Checklist de Integración

- [x] Firebase Authentication conectado
- [x] Realtime Database conectado
- [x] Storage configurado (pendiente habilitar en console)
- [x] Reglas de seguridad desplegadas
- [x] Componentes React implementados
- [x] Rutas configuradas
- [x] Roles y permisos funcionando
- [x] Gestión de usuarios working
- [x] CRUD de productos complete
- [x] Subida de imágenes con fallback
- [x] Exportación CSV/PDF
- [x] Build optimizado
- [ ] Testing en Firebase Console con Storage habilitado
- [ ] Despliegue a Netlify
- [ ] Configuración de dominio personalizado
