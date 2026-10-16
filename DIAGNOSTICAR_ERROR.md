# 🔍 Cómo Diagnosticar el Error de "Guardando..."

Si el botón se queda en "Guardando..." cuando intentas guardar un producto, sigue estos pasos:

## 1️⃣ Abre la Consola del Navegador

1. En Chrome: **F12** o **Cmd+Option+I** (Mac)
2. Ve a la pestaña **Console**
3. Intenta guardar el producto nuevamente
4. **Mira qué errores salen en rojo**

## 2️⃣ Errores Comunes y Soluciones

### Error: "Permission denied"
```
❌ Error: Permission denied: Missing or insufficient permissions
```
**Solución:**
- Las reglas de Firebase no están permitiendo el acceso
- Ejecuta: `firebase deploy --only database`
- Luego recarga la página (Ctrl+R)

### Error: "Storage error"
```
❌ Error: Firebase Storage error
```
**Solución:**
- El archivo es demasiado grande (máx 5MB)
- O no tiene permiso de escritura en Storage
- Intenta con una imagen más pequeña

### Error: "Network error"
```
❌ TypeError: Cannot read property 'ref' of undefined
```
**Solución:**
- Firebase no está conectado
- Verifica que .env.local tiene las credenciales correctas
- Recarga la página

### Error: "Auth error"
```
❌ Error: User not authenticated
```
**Solución:**
- Tu sesión expiró
- Logout y vuelve a login

## 3️⃣ Verificar que Firebase Está Conectado

Copia y pega esto en la consola:

```javascript
// Ver si Firebase está conectado
firebase.database().ref('products').once('value').then(snapshot => {
  console.log('✅ Firebase conectado, productos:', snapshot.val());
}).catch(error => {
  console.error('❌ Error:', error.message);
});
```

## 4️⃣ Verificar Reglas de Firebase

```bash
# Ver reglas actuales
firebase database:get /

# Deploy las reglas correctas
firebase deploy --only database
```

## 5️⃣ Solución Rápida: Usar Modo Local

Si Firebase no funciona, prueba en modo local:

1. En `src/config/firebase.js` línea 5, cambia:
   ```javascript
   const DEMO_MODE = false;  // Cambia a true
   ```

2. Guarda y recarga la página (Ctrl+R)

3. Ahora debería funcionar con localStorage

## 6️⃣ Ver Logs en Tiempo Real

Para ver exactamente qué está pasando, copia esto en la consola:

```javascript
// Ver cada operación
console.clear();
console.log('🔍 Observando operaciones...');

// Cuando hagas click en guardar, verás esto:
// "Guardando producto: {object}"
// "Imagen subida exitosamente: products/xxx"
// "URL obtenida: https://..."
// "Nuevo producto creado en Firebase: product-xxx"
```

## 7️⃣ Si Nada Funciona

Envía:
1. Captura de pantalla con el error en rojo
2. El error completo de la consola
3. Si estás en modo local o Firebase

---

## 📋 Checklist de Verificación

- [ ] La consola NO muestra errores rojos
- [ ] Firebase está conectado (puedes hacer consulta)
- [ ] Las reglas de Firebase fueron deploye
- [ ] La imagen es menor a 5MB
- [ ] Recargaste la página después de cambios
- [ ] No hay pop-ups de error en la pantalla

---

## 🚀 Próximo Paso

1. Abre Console (F12)
2. Intenta guardar producto
3. Copia el error (si existe)
4. Avísame qué dice

