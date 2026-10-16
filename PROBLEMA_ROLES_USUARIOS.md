# Problema: Usuarios sin Rol en Firebase

## 🔴 Problema Identificado

Cuando intentamos crear un usuario nuevo y hacer login, se obtiene el error:

```
❌ Rol desconocido: null
```

### Causa Raíz

Los usuarios en Firebase Authentication existen, pero **no tienen datos de rol en Realtime Database**. 

El flujo es:
1. Firebase Authentication crea el usuario (email + contraseña)
2. La aplicación intenta leer el `role` desde Realtime Database en `users/{uid}`
3. Si no existe ese registro → `role = null` → Error

### Estructura Esperada en Realtime Database

```
users/
  ├─ {admin_uid}/
  │   ├─ email: "carlos@gmail.com"
  │   ├─ role: "admin"
  │   ├─ createdAt: "2026-10-15T..."
  │   └─ active: true
  │
  ├─ {dispatch_uid}/
  │   ├─ email: "despacho1@gmail.com"
  │   ├─ role: "dispatch"
  │   ├─ createdAt: "2026-10-15T..."
  │   └─ active: true
  │
  └─ {new_user_uid}/    ← Este dato no existe aún
      ├─ email: "testuser2@test.com"
      ├─ role: "dispatch"
      ├─ createdAt: "..."
      └─ active: true
```

## ✅ Soluciones

### Opción 1: Crear Usuarios Manualmente en Firebase Console (Rápido)

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Seleccionar proyecto `almacenmercedes-461d2`
3. Ir a **Realtime Database**
4. Click en "+" al lado de `users`
5. Crear manualmente los registros:

```json
{
  "users": {
    "admin-uid-from-auth": {
      "email": "carlos@gmail.com",
      "role": "admin",
      "createdAt": "2026-10-15T00:00:00.000Z",
      "active": true
    },
    "despacho-uid-from-auth": {
      "email": "despacho1@gmail.com",
      "role": "dispatch",
      "createdAt": "2026-10-15T00:00:00.000Z",
      "active": true
    }
  }
}
```

**UID de autenticación:** Lo encuentras en Firebase Console → Authentication → Users

---

### Opción 2: Ejecutar Script para Sincronizar Usuarios

Crear un script que ejecute en Firebase Cloud Functions para sincronizar usuarios:

```javascript
// En Firebase Console → Functions
exports.syncUserRoles = functions.auth.user().onCreate((user) => {
  return admin.database().ref(`users/${user.uid}`).set({
    email: user.email,
    role: 'dispatch', // Rol por defecto
    createdAt: admin.database.ServerValue.TIMESTAMP,
    active: true
  });
});
```

---

### Opción 3: Usar el Registro de Usuario (Recomendado para Desarrollo)

Cuando un usuario se registra desde el login, automáticamente se guarda su rol:

1. Ir a http://localhost:3000
2. Click en "¿No tienes cuenta? Regístrate"
3. Ingresar credenciales
4. Seleccionar rol (dispatch o admin)
5. Click en "Registrarse"

Este flujo **SÍ** guarda el usuario con su rol en Realtime Database.

---

### Opción 4: Corregir la Lógica del Login (Para Usuarios Existentes)

Modificar `Login.js` para no fallar si no hay rol:

```javascript
// Si el usuario no tiene rol, asignar "dispatch" por defecto
const actualRole = role || 'dispatch';

if (actualRole === 'admin') {
  navigate('/admin/dashboard');
} else {
  navigate('/dispatch/home');
}
```

---

## 📋 Paso a Paso: Crear Usuarios de Prueba Correctamente

### Método Rápido (Local - Modo Mock)

La aplicación tiene un **modo mock local** que funciona sin Firebase:

1. Eliminar o comentar las variables de `.env.local`
2. Reiniciar `npm start`
3. La aplicación usará `localStorage` en lugar de Firebase
4. Credenciales de prueba:
   - Admin: `admin@test.com` / `password123`
   - Dispatch: `dispatch@test.com` / `password123`

### Método Real (Firebase)

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Seleccionar proyecto `almacenmercedes-461d2`
3. Ir a **Realtime Database** → **Rules**
4. Verificar que las reglas permiten crear datos:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "auth.uid === $uid || auth != null"
      }
    }
  }
}
```

5. Ir a **Authentication** → Click en un usuario
6. Copiar el `UID`
7. Ir a **Realtime Database** → Crear registro en `users/{UID}`

---

## 🧪 Test Rápido: Verificar que Funciona

### Con Modo Local (Recomendado para desarrollo)

```bash
# 1. Comentar .env.local
cd /Users/ing.carlosjimenez/almacen
cp .env.local .env.local.backup
# Editar .env.local y comentar todas las líneas de REACT_APP_FIREBASE_*

# 2. Reiniciar servidor
npm start

# 3. Login con credenciales de prueba
# Admin: admin@test.com / password123
# Dispatch: dispatch@test.com / password123
```

### Con Firebase Real

1. Asegurar que `users/{uid}` existe en Realtime Database con campo `role`
2. Ir a http://localhost:3000
3. Hacer login
4. Verificar que no aparece error "Rol desconocido"

---

## 📊 Estado Actual

| Usuario | Email | UID | Role | Problema |
|---------|-------|-----|------|----------|
| Admin | carlos@gmail.com | ? | null ❌ | Sin rol en DB |
| Dispatch | despacho1@gmail.com | ? | null ❌ | Sin rol en DB |
| Test User | testuser2@test.com | ? | dispatch | ✅ Creado pero no logueado |

---

## 🔧 Próximos Pasos

1. **Opción A (Rápido):** Pasar a modo LOCAL (comentar `.env.local`)
2. **Opción B (Permanente):** Sincronizar usuarios en Firebase manualmente

Recomendación: **Opción A** para desarrollo rápido, **Opción B** para producción.

---

**Última actualización:** 2026-10-16  
**Status:** ⚠️ Bloqueado por datos de usuario incompletos
