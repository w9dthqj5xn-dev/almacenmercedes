# 🐛 Guía de Debugging

## Si la aplicación no inicia correctamente:

### 1️⃣ **Abre la Consola del Navegador**
- Presiona `F12` (Windows/Linux) o `Cmd + Option + I` (Mac)
- Ve a la pestaña "Console"

### 2️⃣ **Verifica los errores**
Deberías ver mensajes como:
```
✅ Usando autenticación LOCAL (mock). Las credenciales de Firebase no están configuradas.
📝 Para usar Firebase real, actualiza .env.local con tus credenciales.
```

### 3️⃣ **Si hay errores de login:**

**Error: "Firebase: Error (auth/user-not-found)"**
- Significa que el usuario no existe en el localStorage
- **Solución**: Crea un usuario nuevo en la pantalla de registro

**Error: "Firebase: Error (auth/wrong-password)"**
- La contraseña es incorrecta
- Asegúrate de escribir exactamente: `password123`

**Error: "Firebase: Error (auth/weak-password)"**
- La contraseña debe tener mínimo 6 caracteres

### 4️⃣ **Verificar que localStorage funciona:**

En la consola, ejecuta:
```javascript
console.log(localStorage.getItem('mock_users'));
```

Deberías ver algo como:
```json
{
  "admin@test.com": {...},
  "dispatch@test.com": {...}
}
```

### 5️⃣ **Limpiar localStorage y reiniciar:**

Si algo se daña, limpia todo con:
```javascript
localStorage.clear();
location.reload();
```

---

## 📊 Usuarios de Prueba Disponibles

### Admin
- **Email**: `admin@test.com`
- **Contraseña**: `password123`
- **Rol**: Administrador

### Dispatch
- **Email**: `dispatch@test.com`
- **Contraseña**: `password123`
- **Rol**: Usuario de Despacho

---

## ✅ Checklist de Funcionamiento

- [ ] El servidor está corriendo en `http://localhost:3000`
- [ ] La página de login carga sin errores
- [ ] Puedes ingresar email y contraseña
- [ ] El botón "Iniciar Sesión" funciona
- [ ] Ves un mensaje de error específico si falla
- [ ] Puedes cambiar a "Regístrate" mode
- [ ] Puedes crear una nueva cuenta

---

## 🔧 Solucionar Problemas Específicos

### "Página en blanco o no carga"
1. Abre la consola (F12)
2. Verifica que no hay errores JavaScript en rojo
3. Recarga la página (Cmd + R o Ctrl + R)

### "El botón no responde"
1. Verifica que escribiste bien el email
2. Verifica que la contraseña tiene al menos 6 caracteres
3. Abre la consola y busca mensajes de error

### "No puedo registrar un usuario"
1. El email debe ser válido (ej: test@example.com)
2. La contraseña debe tener al menos 6 caracteres
3. Selecciona un rol (Admin o Dispatch)
4. Verifica la consola para ver el error exacto

---

## 🚀 Próximos Pasos

Si todo funciona bien:
1. ✅ Prueba como Admin: acceso a Dashboard
2. ✅ Prueba como Dispatch: acceso a Home de Despacho
3. ✅ Crea productos (modo Admin)
4. ✅ Realiza despachos (modo Dispatch)

¡Si aún hay problemas, toma una captura de pantalla del error y comparte! 📸
