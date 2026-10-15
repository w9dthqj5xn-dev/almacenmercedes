# 🔐 SECURITY RULES - APLICAR PASO A PASO

**Estado:** ✅ Firebase configurado  
**Proyecto:** almacenmercedes-461d2  
**Próxima tarea:** Aplicar reglas de seguridad

---

## ⚡ RESUMEN RÁPIDO

Vamos a aplicar 2 conjuntos de reglas:
1. **Realtime Database Rules** (5 min)
2. **Storage Rules** (5 min)

Total: ~10 minutos

---

## 🎯 PASO 1: Realtime Database Rules

### 1.1 Abre Firebase Console
```
1. Ve a: https://console.firebase.google.com/
2. Selecciona proyecto: almacenmercedes-461d2
```

### 1.2 Navega a Realtime Database
```
Lado izquierdo:
  > Build
    > Realtime Database
```

Deberías ver tu base de datos con URL:
```
https://almacenmercedes-461d2-default-rtdb.europe-west1.firebasedatabase.app
```

### 1.3 Haz clic en Tab "Reglas"
En la parte superior de la pantalla:

```
[Datos] [Reglas] ← AQUÍ
```

### 1.4 Borra TODO el contenido
Elimina todo lo que veas en el editor de reglas.

### 1.5 Copia estas reglas EXACTAMENTE

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

### 1.6 Hacer clic en "Publicar"
Botón en la parte inferior derecha:

```
[Guardar como borrador] [Publicar] ← AQUÍ
```

✅ **Esperado:** Mensaje de éxito
```
Reglas publicadas con éxito
```

---

## 🎯 PASO 2: Storage Rules

### 2.1 Navega a Storage
```
Lado izquierdo:
  > Build
    > Storage
```

Deberías ver tu bucket:
```
almacenmercedes-461d2.firebasestorage.app
```

### 2.2 Haz clic en Tab "Reglas"
En la parte superior:

```
[Archivos] [Reglas] ← AQUÍ
```

### 2.3 Borra TODO el contenido

### 2.4 Copia estas reglas EXACTAMENTE

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura de fotos de productos a usuarios autenticados
    match /products/{productId}/photos/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      allow delete: if request.auth.token.role == 'admin';
    }

    // Permitir acceso al resto solo a admins
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin';
      allow delete: if request.auth.token.role == 'admin';
    }
  }
}
```

### 2.5 Hacer clic en "Publicar"
Botón en la parte inferior derecha:

```
[Guardar como borrador] [Publicar] ← AQUÍ
```

✅ **Esperado:** Mensaje de éxito
```
Reglas publicadas con éxito
```

---

## 🧪 VERIFICACIÓN

### ✅ Verificar Realtime Database Rules
```
1. Firebase Console → Realtime Database → Reglas
2. Deberías ver 4 secciones:
   - users
   - products
   - shipments
   - statistics
3. Status: "Publicadas" (color azul)
```

### ✅ Verificar Storage Rules
```
1. Firebase Console → Storage → Reglas
2. Deberías ver:
   - match /products/{productId}/photos/{filename}
   - match /{allPaths=**}
3. Status: "Publicadas" (color azul)
```

---

## 📝 QUÉ HACEN ESTAS REGLAS

### Realtime Database

**users/** 
- Cada usuario puede ver/editar su propio perfil
- Los admins pueden ver y editar todos los usuarios
- Requiere campos: `role` y `email`

**products/**
- Todos los autenticados pueden LEER
- Solo admins pueden CREAR/EDITAR/ELIMINAR
- Requiere campos: `name` y `quantity`

**shipments/**
- Todos los autenticados pueden LEER y ESCRIBIR
- Cualquier usuario puede crear envíos (despachos)
- Requiere campos: `status` y `createdBy`

**statistics/**
- Todos los autenticados pueden LEER
- Solo admins pueden ESCRIBIR
- Para datos de análisis y reportes

### Storage

**products/photos/**
- Todos los autenticados pueden ver fotos
- Todos pueden subir fotos
- Solo admins pueden eliminar

**Resto (all paths)**
- Todos los autenticados pueden leer
- Solo admins pueden escribir
- Solo admins pueden eliminar

---

## 🔒 SEGURIDAD: LO QUE GANAMOS

✅ **Privacidad**
- Los usuarios solo ven sus propios datos
- Los admins ven todo

✅ **Integridad**
- Solo admins pueden modificar productos
- Los usuarios dispatch solo pueden crear envíos

✅ **Acceso Controlado**
- Las fotos requieren autenticación
- Los datos de estadísticas son de solo lectura

✅ **Validación**
- Ciertos campos son obligatorios
- Las estructura de datos está protegida

---

## 🆘 Si algo sale mal

### "Syntax error"
- Verifica que copiaste las reglas EXACTAMENTE
- Especialmente comillas y llaves
- Prueba copiar y pegar de nuevo

### "Not published"
- Haz clic en el botón "Publicar" (no "Guardar como borrador")
- Si sigue sin funcionar, actualiza la página y vuelve a intentar

### "Permission denied" en la app
- Las reglas pueden tomar 1-2 minutos en aplicarse
- Recarga la app (F5)
- Si sigue, verifica que eres usuario autenticado

### Quiero volver a "modo prueba"
- Borra las reglas
- Pega esto:
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```
- Publicar

---

## ✨ DESPUÉS DE PUBLICAR

Una vez aplicadas las reglas:

1. ✅ Base de datos está protegida
2. ✅ Solo usuarios autenticados pueden acceder
3. ✅ Solo admins pueden modificar ciertos datos
4. ✅ Fotos requieren autenticación
5. ✅ Datos estructura están validados

---

## 🎯 CHECKLIST

```
REALTIME DATABASE:
  [ ] Abierto Firebase Console
  [ ] Seleccionado proyecto almacenmercedes-461d2
  [ ] Navegado a Realtime Database → Reglas
  [ ] Copiadas reglas de la database
  [ ] Publicadas con éxito
  
STORAGE:
  [ ] Navegado a Storage → Reglas
  [ ] Copiadas reglas de storage
  [ ] Publicadas con éxito
  
VERIFICACIÓN:
  [ ] Ambas muestran "Publicadas"
  [ ] App sigue funcionando en localhost:3000
  [ ] Login sigue funcionando
```

---

## 📞 PRÓXIMO PASO

Una vez publicadas las reglas:

### Opción A: Probar Localmente (2 min)
```
Abre http://localhost:3000
Intenta login y navegar
Verifica que todo funciona igual
```

### Opción B: Deploy a Netlify (15 min)
```
Lee: FINAL_STEPS.md
Deploy automático desde GitHub
Tu app en vivo en Netlify
```

---

**Versión:** 1.0  
**Fecha:** 2026-10-15  
**Proyecto:** almacenmercedes-461d2  
**Estado:** Listo para publicar reglas
