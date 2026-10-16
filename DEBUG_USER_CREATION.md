# Guía de Debug - Creación de Usuarios

## ✅ Cómo Verificar que la Creación de Usuarios Funciona

### 1. Abrir la Consola del Navegador

```
Navegador Chrome/Firefox/Safari:
  Presionar: F12 (Windows) o Cmd+Option+I (Mac)
  O Click derecho → Inspeccionar → Tab "Console"
```

### 2. Ir a la Sección de Usuarios

```
URL: http://localhost:3000/admin/dashboard
Seleccionar: Tab "Usuarios"
Click en: "Crear Nuevo Usuario"
```

### 3. Completar el Formulario de Usuario

```
Email nuevo usuario:      test-user@example.com
Contraseña:               password123
Rol:                      dispatch

Click en: "Crear Usuario"
```

### 4. Verificar Logs en Consola

Deberías ver en la consola (F12 → Console):

```
✅ [UserManagement] Creating new user with email: test-user@example.com

✅ Modal aparece para verificación de admin
```

### 5. Ingresa Credenciales del Admin en el Modal

```
Tu Email de Admin:        admin@test.com
Tu Contraseña de Admin:   password123

Click en: "Verificar y Crear"
```

### 6. Verificar Logs Adicionales

En la consola deberías ver:

```
✅ [UserManagement] New user created successfully: [UID del usuario]

✅ [UserManagement] User data saved to database successfully

✅ [UserManagement] Attempting to re-authenticate admin...

✅ [UserManagement] Admin re-authenticated successfully

✅ [UserManagement] Reloading users list

✅ [UserManagement] User creation completed successfully
```

### 7. Verificar en la Interfaz

```
✅ Modal se cierra automáticamente
✅ Mensaje: "✅ Usuario creado exitosamente"
✅ Nuevo usuario aparece en la lista
✅ Admin permanece autenticado (sin desconectar)
```

---

## 🐛 Troubleshooting - Qué Hacer si No Funciona

### Problema 1: Modal no aparece

**Síntomas:**
- Click en "Crear Usuario" no hace nada
- No aparece el modal de verificación

**Solución:**
```
1. Abrir Console (F12)
2. Buscar errores rojos
3. Verificar que no hay errores de sintaxis
4. Revisar que está en modo Firebase (no local)
```

### Problema 2: Usuario no se crea pero modal sí aparece

**Síntomas:**
- Modal aparece correctamente
- Ingresa credenciales
- Click en "Verificar y Crear"
- Nada pasa

**Solución:**
```
1. Abrir Console (F12)
2. Buscar logs de [UserManagement]
3. Ver cuál es el último log antes de parar
4. Ver si hay error en la consola

Posibles errores:
  ❌ auth/email-already-in-use: El email ya existe
  ❌ auth/weak-password: Contraseña muy corta
  ❌ auth/invalid-email: Email inválido
  ❌ auth/wrong-password: Contraseña del admin incorrecta
  ❌ Firebase error: Verificar conexión a Firebase
```

### Problema 3: Se crea el usuario pero no se muestra en la lista

**Síntomas:**
- Los logs muestran que se creó correctamente
- Pero el usuario no aparece en la tabla

**Solución:**
```
1. Refrescar página (F5)
2. Verificar en Firebase Console si está el usuario
3. Verificar que el rol se guardó correctamente
```

### Problema 4: Admin se desconecta después de crear usuario

**Síntomas:**
- Usuario se crea correctamente
- Pero el admin ve la pantalla de login nuevamente

**Solución:**
```
1. Verificar logs de re-autenticación en consola
2. Revisar que credenciales del admin son correctas
3. Verificar credenciales de Firebase
```

---

## 📊 Logs Esperados (Completo)

Cuando todo funciona correctamente, en la console deberías ver:

```
[UserManagement] Creating new user with email: test-user@example.com
[UserManagement] New user created successfully: nBxZ8qZ8nZqJsR...
[UserManagement] User data saved to database successfully
[UserManagement] Attempting to re-authenticate admin with email: admin@test.com
[UserManagement] Admin re-authenticated successfully
[UserManagement] Reloading users list
[UserManagement] User creation completed successfully
```

---

## 🔍 Qué Verificar en Firebase Console

Si el usuario no se crea, verifica en Firebase:

```
1. Ir a Firebase Console
2. Seleccionar el proyecto
3. Ir a Authentication → Users
   ✅ Verificar que aparezca el nuevo usuario

4. Ir a Realtime Database
   ✅ Verificar que existe en /users/{uid}
   ✅ Verificar que tiene campos: email, role, createdAt, active
```

---

## 📱 Estructura de Datos Esperada

Cuando se crea un usuario correctamente, en Realtime Database debe verse:

```
users/
  └─ {newUserUID}/
      ├─ email: "test-user@example.com"
      ├─ role: "dispatch" (o "admin")
      ├─ createdAt: "2026-10-16T18:13:30.000Z"
      └─ active: true
```

---

## ✅ Checklist de Verificación

- [ ] Console abierta (F12)
- [ ] Logs [UserManagement] aparecen
- [ ] Modal aparece después de hacer click
- [ ] Puedo ingresar credenciales en modal
- [ ] Logs muestran "New user created"
- [ ] Logs muestran "User data saved"
- [ ] Logs muestran "Admin re-authenticated"
- [ ] Mensaje de éxito aparece
- [ ] Nuevo usuario en la lista
- [ ] Admin permanece logueado
- [ ] Nuevo usuario puede iniciar sesión

---

## 🆘 Si Todo Falla

1. **Revisar que Firebase está correctamente configurado:**
   ```
   Archivo: .env.local
   Verificar que REACT_APP_FIREBASE_* están presentes
   ```

2. **Revisar que está en modo Firebase (no local):**
   ```
   Abrir Console
   Buscar: "[WAREHOUSE APP] Inicializando Firebase..."
   Si dice "Usando autenticación LOCAL" → Modo local, no Firebase
   ```

3. **Revisar que tiene conexión a Firebase:**
   ```
   Ir a Firebase Console
   Verificar que el proyecto está activo
   Verificar que Authentication está habilitado
   Verificar que Realtime Database está disponible
   ```

4. **Revisar las Security Rules:**
   ```
   Ir a Realtime Database → Rules
   Verificar que permite crear usuarios
   ```

5. **Buscar en la consola del navegador:**
   ```
   Cualquier error rojo
   Cualquier error de red
   Cualquier error de Firebase
   ```

---

## 💡 Consejos de Debug

1. **Copiar los logs completos y pegarlos en un archivo de texto**
   - Ayuda a ver el flujo completo
   - Más fácil de analizar

2. **Usar DevTools de Chrome:**
   - Network tab para ver las llamadas a Firebase
   - Storage para verificar localStorage

3. **Probar con diferentes emails:**
   - user1@test.com
   - user2@test.com
   - etc.

4. **Probar con credenciales correctas del admin:**
   - Usar el mismo email/contraseña que usó para iniciar sesión

---

**Última actualización:** 2026-10-16  
**Estado:** ✅ Completado
