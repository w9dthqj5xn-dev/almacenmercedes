# 🧪 Cómo Probar el Sistema de Creación de Usuarios

## ⚡ Prueba Rápida (5 minutos)

### Paso 1: Configurar para Modo LOCAL
```bash
cd /Users/ing.carlosjimenez/almacen

# Hacer backup de credenciales de Firebase
cp .env.local .env.local.firebase_backup

# Crear .env.local sin Firebase
cat > .env.local << 'ENVFILE'
# MODO LOCAL - Comentadas las credenciales de Firebase
# Descomenta para usar Firebase real

# REACT_APP_FIREBASE_API_KEY=...
# REACT_APP_FIREBASE_PROJECT_ID=almacenmercedes-461d2
# etc...
ENVFILE
```

### Paso 2: Iniciar Servidor
```bash
npm start
# Esperar a que compile (30-60 segundos)
# Debería abrir en http://localhost:3000 automáticamente
```

### Paso 3: Iniciar Sesión como Admin
1. Abrir navegador en `http://localhost:3000`
2. Email: `admin@test.com`
3. Contraseña: `password123`
4. Click en "Iniciar Sesión"

### Paso 4: Crear Nuevo Usuario
1. Click en pestaña "Usuarios" (parte de arriba)
2. Click en botón "Nuevo Usuario"
3. Completar formulario:
   - Email: `testuser@test.com`
   - Contraseña: `password123`
   - Rol: Despacho (ya está seleccionado)
4. Click en "Crear Usuario"

### Paso 5: Verificar Resultado
- ✅ Debe aparecer mensaje verde: "✅ Usuario creado exitosamente"
- ✅ Admin debe permanecer autenticado (no debe ir a login)
- ✅ Nuevo usuario debe aparecer en la tabla
- ✅ Contador debe cambiar de "2" a "3"

### Paso 6: Probar Nuevo Usuario
1. Click en "Cerrar Sesión"
2. Login con nuevas credenciales:
   - Email: `testuser@test.com`
   - Contraseña: `password123`
3. Debe ver el panel de "Despacho"

---

## 🔍 Prueba Avanzada (20 minutos)

### Con Consola del Navegador (F12)

```javascript
// Abrir Developer Tools: F12 o Cmd+Shift+I

// Ir a pestaña: Console
// Buscar logs con [UserManagement]
```

Cuando creas un usuario, DEBES ver estos logs:

```
✅ [UserManagement] Creating new user with email: testuser@test.com
✅ [UserManagement] New user created successfully: [UID]
✅ [UserManagement] User data saved to database successfully
✅ [UserManagement] User creation completed successfully
```

### Verificar localStorage

```javascript
// En la consola del navegador (F12 > Console)

// Ver usuarios en localStorage:
JSON.parse(localStorage.getItem('mock_users'));

// Debería mostrar:
{
  "admin@test.com": {...},
  "dispatch@test.com": {...},
  "testuser@test.com": {...}  // El nuevo
}
```

### Prueba de Errores

#### Error 1: Email duplicado
```
1. Intentar crear usuario con email que ya existe: admin@test.com
2. Resultado: Error rojo "Email already in use"
```

#### Error 2: Contraseña muy corta
```
1. Email: newuser@test.com
2. Contraseña: "123" (menos de 6 caracteres)
3. Resultado: Error rojo "Password should be at least 6 characters"
```

#### Error 3: Formato de email inválido
```
1. Email: "notemail"
2. Resultado: Puede pasar o fallar (depende de validación)
```

---

## 🚀 Prueba con Firebase Real

### Paso 1: Habilitar Firebase

```bash
# Restaurar credenciales de Firebase
cp .env.local.firebase_backup .env.local

# Verificar que tiene:
# REACT_APP_FIREBASE_API_KEY=...
# REACT_APP_FIREBASE_PROJECT_ID=almacenmercedes-461d2
```

### Paso 2: Preparar Firebase Console

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Seleccionar proyecto `almacenmercedes-461d2`
3. Ir a **Realtime Database**
4. Verificar estructura:
   ```
   users/
     └─ {uid del admin}/
         ├─ email: "..."
         ├─ role: "admin"
         ├─ createdAt: "..."
         └─ active: true
   ```

### Paso 3: Crear Usuario

1. `npm start`
2. Login como admin
3. Crear usuario
4. **Ahora SÍ verás el MODAL de verificación**
5. Ingresa tus credenciales de admin
6. Click "Verificar y Crear"

### Paso 4: Verificar en Firebase Console

1. Ir a Firebase Console
2. **Authentication** → Debe estar el nuevo usuario
3. **Realtime Database** → Debe estar en `users/{uid}`

---

## 📋 Checklist de Prueba

### Configuración
- [ ] .env.local configurado correctamente
- [ ] `npm start` compila sin errores
- [ ] Navegador abre en http://localhost:3000

### Login
- [ ] Admin puede iniciar sesión
- [ ] Admin ve el dashboard
- [ ] Botón "Usuarios" está disponible

### Crear Usuario
- [ ] Formulario se abre correctamente
- [ ] Puedo ingresar email y contraseña
- [ ] Puedo seleccionar rol
- [ ] Click en "Crear Usuario" funciona

### Verificación
- [ ] Mensaje de éxito aparece
- [ ] Nuevo usuario aparece en tabla
- [ ] Admin NO se desconecta
- [ ] Contador de usuarios aumenta

### Login del Nuevo Usuario
- [ ] Puedo cerrar sesión
- [ ] Puedo iniciar con nuevo usuario
- [ ] Se redirige al panel correcto

### Errores (Casos Negativos)
- [ ] Email duplicado → Error
- [ ] Contraseña corta → Error
- [ ] Email inválido → Error (o no valida)

---

## 🐛 Troubleshooting

### Problema: "No aparece el modal"

**En modo LOCAL:**
- Normal. El modal NO aparece porque no necesita verificación
- Solo aparece en Firebase Real

**En modo Firebase:**
- Verifica que .env.local tiene REACT_APP_FIREBASE_*
- Reinicia `npm start`

### Problema: "Usuario no se crea"

**En modo LOCAL:**
- Abre F12 (Developer Tools)
- Mira la pestaña "Console"
- Busca errores rojos
- Ver `DEBUG_USER_CREATION.md`

**En modo Firebase:**
- Verifica que Firebase Realtime Database está habilitado
- Verifica las Security Rules
- Verifica que tienes conexión a internet

### Problema: "No puedo iniciar sesión con nuevo usuario"

**En modo LOCAL:**
- Abre `localStorage` en Developer Tools
- Verifica que el usuario está en `mock_users`
- Verifica que tiene campo `role`

**En modo Firebase:**
- Verifica en Firebase Console → Authentication
- Verifica en Firebase Console → Realtime Database → users/{uid}
- Debe tener campo `role`

### Problema: "Admin se desconecta"

**Esto no debería pasar.**
- Indica que la re-autenticación falló
- Ver logs en consola (F12)
- Leer `DEBUG_USER_CREATION.md`

---

## 📊 Resultado Esperado

Cuando todo funciona correctamente:

```
1. Admin login ✅
2. Ver lista de usuarios (0 o más) ✅
3. Click "Nuevo Usuario" ✅
4. Llenar formulario ✅
5. Click "Crear Usuario" ✅
6. Ver mensaje de éxito ✅
7. Nuevo usuario en tabla ✅
8. Admin sigue logueado ✅
9. Cerrar sesión ✅
10. Login con nuevo usuario ✅
11. Ver panel del nuevo rol ✅
```

Si todo esto funciona → ✅ **Sistema correcto**

---

## 📞 Ayuda

Si tienes problemas:

1. Leer `DEBUG_USER_CREATION.md` - Guía paso a paso
2. Leer `PROBLEMA_ROLES_USUARIOS.md` - Problemas comunes
3. Revisar `VERIFICACION_EXITOSA.md` - Cómo se vio en la prueba real
4. Abrir Developer Tools (F12) y buscar errores

---

**Última actualización:** 2026-10-16  
**Estado:** ✅ Listos para probar
