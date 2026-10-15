# 🔥 CONFIGURACIÓN FIREBASE - PASO A PASO

## 📌 RESUMEN RÁPIDO

Vamos a:
1. ✅ Crear proyecto Firebase (5 min)
2. ✅ Obtener credenciales (2 min)
3. ✅ Actualizar `.env.local` (1 min)
4. ✅ Habilitar Authentication (2 min)
5. ✅ Crear Realtime Database (2 min)
6. ✅ Configurar Storage (2 min)
7. ✅ Aplicar Security Rules (3 min)
8. ✅ Probar localmente (3 min)

**Tiempo total: 20 minutos**

---

## 🚀 PASO 1: Crear Proyecto Firebase

### 1.1 Ir a Firebase Console
```
Abre en navegador: https://console.firebase.google.com/
(Asegúrate de estar con tu cuenta de Google)
```

### 1.2 Crear Nuevo Proyecto
1. Haz clic en **"Agregar proyecto"** (o un **"+"**)
2. Nombre del proyecto: **`almacenmercedes`**
3. Haz clic en **"Continuar"**
4. En "Analytics": Desmarca (no necesitamos)
5. Haz clic en **"Crear proyecto"**

⏳ Espera ~1 minuto a que se cree...

### 1.3 Listo cuando veas
```
✅ Proyecto "almacenmercedes" activado
┌─────────────────────────┐
│ Firebase Console        │
│ > almacenmercedes       │
│   • Authentication      │
│   • Realtime Database   │
│   • Storage             │
└─────────────────────────┘
```

---

## 🔑 PASO 2: Obtener Credenciales Firebase

### 2.1 Ir a Configuración del Proyecto
1. Haz clic en el **⚙️ (engranaje)** en la esquina superior izquierda
2. Selecciona **"Configuración del proyecto"**

### 2.2 Ir a la Pestaña "General"
Ya deberías estar en la pestaña "General"

### 2.3 Buscar "Tus aplicaciones" → "Aplicaciones web"
Desplázate hacia abajo hasta ver:
```
Tus aplicaciones
├─ Aplicaciones web    ← AQUÍ
├─ Aplicaciones iOS
└─ Aplicaciones Android
```

### 2.4 Registrar la App Web
Si no hay ninguna app registrada:
1. Haz clic en **"< >"** (icono web)
2. Nombre: **`almacen-warehouse`**
3. Desmarca "Configurar Firebase Hosting"
4. Clic en **"Registrar aplicación"**

### 2.5 Copiar Credenciales
Verás un bloque de código como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "almacenmercedes.firebaseapp.com",
  projectId: "almacenmercedes",
  storageBucket: "almacenmercedes.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  databaseURL: "https://almacenmercedes-default-rtdb.firebaseio.com"
};
```

**⚠️ COPIA ESTOS VALORES - LOS NECESITAREMOS EN EL SIGUIENTE PASO**

---

## ✏️ PASO 3: Actualizar `.env.local`

### 3.1 Abre el archivo
```bash
Archivo: /Users/ing.carlosjimenez/almacen/.env.local
```

### 3.2 Reemplaza con tus valores
Copia esto y reemplaza con tus valores reales de Firebase:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=almacenmercedes.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=almacenmercedes
REACT_APP_FIREBASE_DATABASE_URL=https://almacenmercedes-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=almacenmercedes.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 3.3 Guardar archivo
- **Ctrl+S** (Windows) o **Cmd+S** (Mac)
- ✅ Listo

---

## 🔐 PASO 4: Habilitar Authentication

### 4.1 En Firebase Console
```
Lado izquierdo:
  > Build
    > Authentication
```

### 4.2 Hacer clic en "Comenzar"
Ve a la pestaña **"Proveedores de acceso"**

### 4.3 Agregar Email/Password
1. Haz clic en **"Email/Contraseña"**
2. Toggle en **"Habilitar"**
3. Clic en **"Guardar"**

### 4.4 (Opcional) Agregar Google Sign-In
1. Haz clic en **"Google"**
2. Toggle en **"Habilitar"**
3. Correo de soporte del proyecto: (dejarlo como está)
4. Clic en **"Guardar"**

✅ Listo

---

## 💾 PASO 5: Crear Realtime Database

### 5.1 En Firebase Console
```
Lado izquierdo:
  > Build
    > Realtime Database
```

### 5.2 Hacer clic en "Crear base de datos"

### 5.3 Elegir ubicación
- Ubicación: **`us-central1`** (o la más cercana a ti)
- Clic en **"Siguiente"**

### 5.4 Elegir reglas de seguridad
- Elige: **"Comenzar en modo de prueba"**
  (Cambiaremos esto después)
- Clic en **"Habilitar"**

⏳ Espera ~30 segundos...

✅ Debería mostrar:
```
🔒 Realtime Database
├─ Ubicación: us-central1
├─ URL: https://almacenmercedes-default-rtdb.firebaseio.com
└─ Estado: ✅ Conectado
```

---

## 📦 PASO 6: Configurar Storage

### 6.1 En Firebase Console
```
Lado izquierdo:
  > Build
    > Storage
```

### 6.2 Hacer clic en "Comenzar"

### 6.3 Elegir ubicación
- Ubicación: **`us-central1`** (igual que la DB)
- Clic en **"Siguiente"**

### 6.4 Reglas de Seguridad (Provisional)
- Elige: **"Comenzar en modo de prueba"**
- Clic en **"Listo"**

✅ Debería mostrar:
```
🗂️ Storage
├─ Ubicación: us-central1
├─ Bucket: almacenmercedes.appspot.com
└─ Estado: ✅ Listo
```

---

## 🔒 PASO 7: Aplicar Security Rules

### 7.1 Realtime Database Rules

1. Ve a: **Realtime Database** → Tab **"Reglas"**
2. Borra todo el contenido
3. Pega esto:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".validate": "newData.hasChildren(['role', 'email'])"
      }
    },
    "products": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'",
      "$productId": {
        ".validate": "newData.hasChildren(['name', 'quantity'])"
      }
    },
    "shipments": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$shipmentId": {
        ".validate": "newData.hasChildren(['status', 'createdBy'])"
      }
    },
    "statistics": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

4. Clic en **"Publicar"**

✅ Debería mostrar: "Reglas publicadas con éxito"

### 7.2 Storage Rules

1. Ve a: **Storage** → Tab **"Reglas"**
2. Borra todo
3. Pega esto:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/photos/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      allow delete: if request.auth.token.role == 'admin';
    }
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin';
      allow delete: if request.auth.token.role == 'admin';
    }
  }
}
```

4. Clic en **"Publicar"**

✅ Debería mostrar: "Reglas publicadas con éxito"

---

## 🧪 PASO 8: Probar Localmente

### 8.1 Reiniciar servidor React
```bash
# Terminal 1: Detener si está corriendo
# Ctrl+C

# Luego:
cd /Users/ing.carlosjimenez/almacen
npm start
```

Debería mostrar:
```
✅ [WAREHOUSE APP] Firebase inicializado correctamente
📍 Proyecto: almacenmercedes
🚀 Local development server running at http://localhost:3000
```

### 8.2 Probar Login
1. Abre: http://localhost:3000
2. Intenta hacer login con:
   ```
   Email: admin@test.com
   Contraseña: password123
   ```
   
   O crea un usuario nuevo directamente.

3. Si entras al Dashboard → ✅ Firebase está conectado

### 8.3 Si no funciona
Abre la consola del navegador (F12 → Console)

Busca mensajes como:
```
✅ [WAREHOUSE APP] Firebase inicializado correctamente
```

Si ves:
```
🔧 [WAREHOUSE APP] Usando autenticación LOCAL (mock)
```

Significa que `.env.local` no se actualizó correctamente. Verifica:
- ¿Guardaste el archivo?
- ¿Reiniciaste `npm start`?
- ¿Las credenciales están correctas?

---

## 🎯 CHECKLIST FINAL

```
Firebase Console Setup:
  ✅ Proyecto "almacenmercedes" creado
  ✅ App web registrada
  ✅ Credenciales obtenidas
  ✅ Authentication habilitado
  ✅ Realtime Database creado
  ✅ Storage configurado
  ✅ Security Rules aplicadas

Local Setup:
  ✅ .env.local actualizado con credenciales
  ✅ npm start reiniciado
  ✅ Login funciona en http://localhost:3000
  ✅ Console muestra "Firebase inicializado"
  ✅ Datos se guardan en Firebase (no en localStorage)
```

---

## 🆘 Troubleshooting

### "Error: No API key provided"
**Causa:** `.env.local` no actualizado correctamente
**Solución:**
```bash
# 1. Verifica que .env.local tenga valores reales
cat /Users/ing.carlosjimenez/almacen/.env.local

# 2. Reinicia npm start
npm start
```

### "Error: Project ID mismatch"
**Causa:** El Project ID en `.env.local` no coincide con Firebase Console
**Solución:**
- Ve a Firebase Console → Configuración del proyecto
- Copia el "ID del proyecto" exactamente
- Actualiza en `.env.local`
- Reinicia `npm start`

### Login no funciona
**Causa:** Authentication no habilitado o credenciales incorrectas
**Solución:**
1. Ve a Firebase Console → Authentication
2. Verifica que "Email/Contraseña" esté habilitado
3. Crea un usuario de prueba:
   - Authentication → Usuarios → Agregar usuario
   - Email: `test@example.com`
   - Contraseña: `password123`
4. Intenta login con ese usuario

### Fotos no se suben
**Causa:** Storage Rules incorrectas o Storage no habilitado
**Solución:**
1. Ve a Firebase Console → Storage
2. Verifica que esté "Disponible"
3. Revisa que Storage Rules incluya permisos `write`
4. Intenta subir foto nuevamente

---

## ✨ ¡Listo!

Una vez que pasen todos los checks, tu aplicación estará:
```
✅ Conectada a Firebase en tiempo real
✅ Con authentication funcionando
✅ Con base de datos activa
✅ Con storage para fotos
✅ Con reglas de seguridad
```

**Siguiente paso:** Deploy a Netlify 🚀

---

**Versión:** 1.0  
**Fecha:** 2026-10-15  
**Estado:** Listo para seguir
