# 🧪 PRUEBA LOCAL - VERIFICAR QUE TODO FUNCIONA

**Estado:** Security Rules aplicadas ✅  
**Objetivo:** Verificar que la app funciona correctamente con Firebase real  
**Tiempo:** ~10 minutos  

---

## 🎯 TEST 1: Verificar Configuración Firebase

### 1.1 Ejecutar Script Verificador
```bash
bash /Users/ing.carlosjimenez/almacen/verify-firebase-setup.sh
```

**Resultado esperado:**
```
✅ TODAS LAS VARIABLES CONFIGURADAS (7/7)

Project ID:       almacenmercedes-461d2
Auth Domain:      almacenmercedes-461d2.firebaseapp.com
Database URL:     https://almacenmercedes-461d2-default-rtdb...
Storage Bucket:   almacenmercedes-461d2.firebasestorage.app
```

**✓ Si ves esto:** Firebase está correctamente configurado

---

## 🎯 TEST 2: Verificar Servidor React

### 2.1 Verificar que está corriendo
```bash
curl http://localhost:3000 | grep -o '<title>.*</title>'
```

**Resultado esperado:**
```
<title>Warehouse Management - Gestión de Almacén</title>
```

**✓ Si ves esto:** Servidor está corriendo

### 2.2 Abre en navegador
```
http://localhost:3000
```

Deberías ver:
- Pantalla de login
- Inputs para Email y Contraseña
- Botón "Ingresar"

**✓ Si ves esto:** Frontend está cargando correctamente

---

## 🎯 TEST 3: Verificar Conexión Firebase

### 3.1 Abre la Consola del Navegador
```
Tecla: F12 (Windows) o Cmd+Option+I (Mac)
Tab: Console
```

### 3.2 Busca este mensaje:
```
✅ [WAREHOUSE APP] Firebase inicializado correctamente
```

**✓ Si ves esto:** Firebase está conectado

### 3.3 Si NO ves ese mensaje
Busca algo como:
```
🔧 [WAREHOUSE APP] Usando autenticación LOCAL (mock)
```

Si ves esto:
- ✗ Firebase NO está conectado
- Solución: Verifica .env.local y reinicia `npm start`

---

## 🎯 TEST 4: Probar Autenticación

### 4.1 Intenta hacer login
```
Email:     admin@test.com
Contraseña: password123
```

### 4.2 Haz clic en "Ingresar"

**Resultado esperado:**
```
✅ Entras al Dashboard
✅ Ves el header con tu email
✅ Puedes ver productos/inventario
✅ No hay errores en la consola (F12)
```

**Si funciona:** Autenticación está OK ✓

---

## 🎯 TEST 5: Probar Operaciones de Base de Datos

### 5.1 Como Admin
```
1. Haz login con admin@test.com
2. Intenta crear un producto nuevo
3. Llena: nombre, cantidad, precio
4. Haz clic en "Guardar"
```

**Resultado esperado:**
```
✅ Producto aparece en la lista
✅ Se guarda en Firebase Realtime Database
✅ No hay errores de permisos
```

### 5.2 Como Dispatch User
```
1. Logout y login con dispatch@test.com / password123
2. Ve a "Mis Despachos" o similar
3. Selecciona un producto
4. Llena cantidad y destino
5. Intenta crear un despacho
```

**Resultado esperado:**
```
✅ Despacho se registra
✅ No puedes editar/eliminar productos
✅ Solo puedes crear despachos
```

---

## 🎯 TEST 6: Probar Fotos

### 6.1 Como Admin
```
1. Haz login con admin@test.com
2. Selecciona un producto
3. Intenta subir una foto
4. Espera a que se cargue
```

**Resultado esperado:**
```
✅ Foto se carga a Firebase Storage
✅ Aparece en la galería del producto
✅ Otros usuarios pueden verla
```

### 6.2 Como Dispatch User
```
1. Logout y login con dispatch@test.com
2. Ve a un producto con fotos
3. Intenta ver la foto
```

**Resultado esperado:**
```
✅ Puedes ver la foto
✅ No puedes eliminarla
✅ No puedes subir fotos (depende de reglas)
```

---

## 🎯 TEST 7: Verificar Security Rules

### 7.1 Intentar acceso no autorizado
```
1. Intenta hacer login con un usuario dispatch
2. Intenta editar un producto
```

**Resultado esperado:**
```
❌ Permiso denegado
❌ No puedes guardar cambios
✓ Security Rules están funcionando
```

### 7.2 Intentar lectura sin autenticación
```
1. Abre consola del navegador (F12)
2. Escribe en la consola:
   fetch('https://almacenmercedes-461d2-default-rtdb.europe-west1.firebasedatabase.app/products.json')
     .then(r => r.json())
     .then(d => console.log(d))
```

**Resultado esperado:**
```
❌ Error: Permission denied
✓ No puedes leer sin autenticación
```

---

## 📊 CHECKLIST DE VERIFICACIÓN

### ✅ Configuración Firebase
```
[ ] .env.local tiene 7 variables configuradas
[ ] verify-firebase-setup.sh muestra "7/7"
[ ] No hay errores de API Key
```

### ✅ Servidor React
```
[ ] http://localhost:3000 carga
[ ] Pantalla de login visible
[ ] No hay errores en consola (F12)
[ ] Console muestra "Firebase inicializado"
```

### ✅ Autenticación
```
[ ] Puedo hacer login con admin@test.com
[ ] Puedo hacer logout
[ ] Session se mantiene al recargar
[ ] Error al intentar login con credenciales incorrectas
```

### ✅ Operaciones CRUD
```
[ ] Admin puede crear productos
[ ] Admin puede editar productos
[ ] Admin puede eliminar productos
[ ] Dispatch user puede ver productos
[ ] Dispatch user NO puede editar productos
```

### ✅ Security Rules
```
[ ] Datos en Realtime Database están protegidos
[ ] Storage está protegido
[ ] Users dispatch no pueden modificar productos
[ ] Solo admins pueden eliminar fotos
```

### ✅ Consistencia
```
[ ] Datos persisten después de recargar
[ ] Cambios se sincronizan en tiempo real
[ ] No hay conflictos de datos
```

---

## 🆘 TROUBLESHOOTING

### "Error: API Key is invalid"
- Solución: Verifica que .env.local tenga valores correctos
- Ejecuta: `bash verify-firebase-setup.sh`

### "Permission denied" al crear producto
- Probable: No estás logueado como admin
- Solución: Verifica que usas admin@test.com
- Nota: Los Security Rules pueden tardar 1-2 min en aplicarse

### "Cannot read undefined (reading 'auth')"
- Solución: Reinicia `npm start`
- Espera a que aparezca "Firebase inicializado"

### Las fotos no se suben
- Verificar: Storage Rules están publicadas
- Storage Status: "Publicadas" (color azul)
- Intenta recargar la app

### Datos desaparecen después de recargar
- Problema: Está usando localStorage (mocks)
- Solución: Reinicia `npm start` después de actualizar .env.local

---

## ✨ RESULTADO ESPERADO FINAL

Después de todos los tests:

```
✅ App carga correctamente
✅ Firebase está conectado
✅ Puedo hacer login
✅ Admin puede CRUD productos
✅ Dispatch user puede ver pero no editar
✅ Fotos se suben y cargan
✅ Security Rules protegen datos
✅ Datos persisten en Firebase
✅ No hay errores en consola
✅ Rendimiento es bueno (< 2s por operación)

🎉 LISTO PARA PRODUCCIÓN
```

---

## 📝 NOTAS

- Los Security Rules pueden tardar 1-2 minutos en aplicarse
- Recarga la app si ves "Permission denied" después de aplicarlas
- Firebase Realtime Database muestra cambios en tiempo real
- Storage (fotos) sincroniza automáticamente

---

## 🚀 SIGUIENTE PASO

Si todos los tests pasan:

**Deploy a Netlify** (15 minutos)

Lee: `/Users/ing.carlosjimenez/almacen/FINAL_STEPS.md`

---

**Fecha:** 2026-10-15  
**Estado:** Listo para pruebas  
**Duración esperada:** ~10 minutos
