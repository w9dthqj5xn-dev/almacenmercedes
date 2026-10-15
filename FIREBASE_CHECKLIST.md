# ✅ FIREBASE - CHECKLIST INTERACTIVO

**Estado Actual:** ⏳ En configuración  
**Progreso:** 30% (3/10 pasos completados)

---

## 📋 LOS 10 PASOS A SEGUIR

### ✅ PASO 1: Crear Proyecto Firebase
**Estado:** LISTO PARA HACER  
**Tiempo:** 5 minutos  
**Acción:** 
```
1. Abre: https://console.firebase.google.com/
2. Click en "Agregar proyecto"
3. Nombre: almacenmercedes
4. Click "Crear proyecto"
5. Espera a que se inicialice (~1 min)
```
**Verificación:** Cuando veas el dashboard de Firebase con el proyecto "almacenmercedes"

---

### ✅ PASO 2: Registrar Aplicación Web
**Estado:** LISTO PARA HACER  
**Tiempo:** 2 minutos  
**Acción:**
```
1. En Firebase Console (esquina superior izquierda):
   ⚙️ Configuración del proyecto
2. Tab: "General"
3. Desplázate a "Tus aplicaciones"
4. Haz clic en "</>" (ícono web)
5. Nombre: almacen-warehouse
6. Desmarca: "Configurar Firebase Hosting"
7. Click "Registrar aplicación"
```
**Verificación:** Verás un código de configuración con tus credenciales

---

### ✅ PASO 3: Copiar Credenciales Firebase
**Estado:** LISTO PARA HACER  
**Tiempo:** 1 minuto  
**Acción:**
```
En la pantalla anterior, verás algo como:

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "almacenmercedes.firebaseapp.com",
  projectId: "almacenmercedes",
  storageBucket: "almacenmercedes.appspot.com",
  messagingSenderId: "...",
  appId: "1:...:web:...",
  databaseURL: "https://almacenmercedes-default-rtdb.firebaseio.com"
};

COPIA ESTOS 7 VALORES
```
**Verificación:** Tengas los 7 valores listos para copiar

---

### ✅ PASO 4: Actualizar .env.local
**Estado:** LISTO PARA HACER  
**Tiempo:** 2 minutos  
**Acción:**
```bash
# Abre el archivo:
/Users/ing.carlosjimenez/almacen/.env.local

# Reemplaza TODO el contenido con:
REACT_APP_FIREBASE_API_KEY=AIzaSy[COPIA TU VALOR AQUI]
REACT_APP_FIREBASE_AUTH_DOMAIN=almacenmercedes.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=almacenmercedes
REACT_APP_FIREBASE_DATABASE_URL=https://almacenmercedes-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=almacenmercedes.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=[COPIA TU VALOR AQUI]
REACT_APP_FIREBASE_APP_ID=1:[COPIA TU VALOR AQUI]

# Guarda: Cmd+S (Mac) o Ctrl+S (Windows)
```
**Verificación:** Archivo guardado sin errores

---

### ✅ PASO 5: Habilitar Authentication
**Estado:** LISTO PARA HACER  
**Tiempo:** 2 minutos  
**Acción:**
```
1. Firebase Console → Build (lado izquierdo)
2. Haz clic en "Authentication"
3. Click en "Comenzar"
4. Click en "Email/Contraseña"
5. Toggle en "Habilitar"
6. Click "Guardar"
```
**Verificación:** "Email/Contraseña" muestre estado "Habilitado"

---

### ✅ PASO 6: Crear Realtime Database
**Estado:** LISTO PARA HACER  
**Tiempo:** 2 minutos  
**Acción:**
```
1. Firebase Console → Build
2. Click en "Realtime Database"
3. Click en "Crear base de datos"
4. Ubicación: us-central1 (o la más cercana)
5. Click "Siguiente"
6. Reglas: "Comenzar en modo de prueba"
7. Click "Habilitar"
8. Espera ~30 segundos
```
**Verificación:** Ves URL como `https://almacenmercedes-default-rtdb.firebaseio.com`

---

### ✅ PASO 7: Configurar Storage
**Estado:** LISTO PARA HACER  
**Tiempo:** 2 minutos  
**Acción:**
```
1. Firebase Console → Build
2. Click en "Storage"
3. Click en "Comenzar"
4. Ubicación: us-central1
5. Click "Siguiente"
6. Reglas: "Comenzar en modo de prueba"
7. Click "Listo"
8. Espera ~30 segundos
```
**Verificación:** Ves "Bucket: almacenmercedes.appspot.com"

---

### ✅ PASO 8: Aplicar Security Rules (Realtime DB)
**Estado:** LISTO PARA HACER  
**Tiempo:** 2 minutos  
**Acción:**
```
1. Firebase Console → Realtime Database
2. Tab "Reglas"
3. Borra TODO el contenido
4. PEGA ESTO EXACTAMENTE:

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

5. Click "Publicar"
```
**Verificación:** Mensaje "Reglas publicadas con éxito"

---

### ✅ PASO 9: Aplicar Security Rules (Storage)
**Estado:** LISTO PARA HACER  
**Tiempo:** 2 minutos  
**Acción:**
```
1. Firebase Console → Storage
2. Tab "Reglas"
3. Borra TODO
4. PEGA ESTO EXACTAMENTE:

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

5. Click "Publicar"
```
**Verificación:** Mensaje "Reglas publicadas con éxito"

---

### ✅ PASO 10: Probar Localmente
**Estado:** LISTO PARA HACER  
**Tiempo:** 3 minutos  
**Acción:**
```bash
# En terminal:
cd /Users/ing.carlosjimenez/almacen

# Reinicia el servidor (si está corriendo, presiona Ctrl+C primero)
npm start

# Espera a que se inicie y veas:
# ✅ [WAREHOUSE APP] Firebase inicializado correctamente
# 📍 Proyecto: almacenmercedes
# 🚀 Local development server running at http://localhost:3000
```

Luego:
```
1. Abre: http://localhost:3000
2. Intenta login:
   Email: admin@test.com
   Contraseña: password123
   (O crea un usuario nuevo)
3. Si entras → ✅ Firebase funciona
4. Abre la consola (F12 → Console)
5. Busca: "✅ [WAREHOUSE APP] Firebase inicializado correctamente"
```

**Verificación:**
- ✅ Puedas hacer login
- ✅ Veas "Firebase inicializado" en la consola
- ✅ Los datos se guarden en Firebase (no en localStorage)

---

## 🚀 ÓRDENES DE ACCIONES

### Opción A: Hacerlo YO ahora (rápido)
Si me das permiso, puedo:
- ✅ Ayudarte a copiar las credenciales
- ✅ Actualizar automáticamente .env.local
- ✅ Verificar que todo esté correcto
- ✅ Testear que funciona

**Tiempo:** 5 minutos después que completes los primeros 7 pasos en Firebase

---

### Opción B: Hacerlo TÚ ahora (aprendes más)
Sigue paso a paso el documento: 
👉 `/Users/ing.carlosjimenez/almacen/FIREBASE_SETUP_PASO_A_PASO.md`

**Tiempo:** 20 minutos total

---

### Opción C: Hacerlo juntos
Yo te guío mientras TÚ haces los clicks.

---

## 📊 PROGRESO VISUAL

```
┌─────────────────────────────────────────┐
│         CONFIGURACIÓN FIREBASE          │
├─────────────────────────────────────────┤
│                                         │
│  1. Crear Proyecto      ⏳ PENDIENTE    │
│  2. Registrar App Web   ⏳ PENDIENTE    │
│  3. Copiar Credenciales ⏳ PENDIENTE    │
│  4. Actualizar .env     ⏳ PENDIENTE    │
│  5. Habilitar Auth      ⏳ PENDIENTE    │
│  6. Crear Database      ⏳ PENDIENTE    │
│  7. Configurar Storage  ⏳ PENDIENTE    │
│  8. DB Rules            ⏳ PENDIENTE    │
│  9. Storage Rules       ⏳ PENDIENTE    │
│  10. Probar Local       ⏳ PENDIENTE    │
│                                         │
│  Progreso: 0/10 = 0%                   │
│  ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 💡 TIPS

✨ **Usa este documento como checklist**
- ✅ Marca cada paso mientras lo completas
- 📝 Anota cualquier problema
- 🆘 Pregunta si algo no funciona

✨ **Si algo sale mal**
- Revisa el paso de nuevo (es fácil errores de copiar/pegar)
- Verifica que firebase console muestre el proyecto correcto
- Prueba con el script verificador:
  ```bash
  bash /Users/ing.carlosjimenez/almacen/verify-firebase-setup.sh
  ```

✨ **Documentación disponible**
- 📖 FIREBASE_SETUP_PASO_A_PASO.md → Guía completa
- 🔒 FIREBASE_SECURITY_RULES.md → Reglas de seguridad
- 🧪 verify-firebase-setup.sh → Verificar configuración

---

**¿Por dónde empezamos?**

Dime cuál opción prefieres:
1. **YO te ayudo** - Eres más rápido
2. **TÚ sigues la guía** - Aprendes todo
3. **JUNTOS** - Lo mejor de ambos

