# 🚀 GUÍA NETLIFY DEPLOYMENT - Paso a Paso

## Fase 1: Conectar Repositorio GitHub a Netlify (Sin credenciales)

### Paso 1.1: Ir a Netlify
1. Abre: https://app.netlify.com/
2. Inicia sesión (o crea cuenta con GitHub)

### Paso 1.2: Crear nuevo sitio
1. Click en **"Add new site"** (botón grande)
2. Selecciona **"Import an existing project"**
3. Elige **"GitHub"**

### Paso 1.3: Autorizar Netlify
1. Click en **"Authorize Netlify by GitHub"**
2. Se abrirá ventana de GitHub
3. Selecciona: **Only select repositories** 
4. Busca: `almacenmercedes`
5. Click **"Install & Authorize"**

### Paso 1.4: Seleccionar repositorio
1. De vuelta en Netlify, verás una lista de repos
2. Busca: **almacenmercedes**
3. Click en él

### Paso 1.5: Configurar Build Settings
Netlify debería detectar automáticamente:

```
Branch to deploy: main
Build command: npm run build
Publish directory: build
```

Si NO detecta, configúralo manualmente:
- Branch: `main`
- Build command: `npm run build`
- Publish directory: `build`

### Paso 1.6: Crear sitio SIN credenciales aún
1. Click en **"Deploy site"**
2. Espera... El build FALLARÁ (es normal, falta Firebase)
3. Esto es OK, lo arreglamos después

---

## Fase 2: Crear Proyecto Firebase

### Paso 2.1: Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Click **"Crear un proyecto"**
3. Nombre: `almacenmercedes`
4. Acepta los términos
5. Click **"Crear proyecto"**
6. Espera a que se inicialice...

### Paso 2.2: Habilitar Authentication
1. En Firebase Console, ve a **"Autenticación"** (sidebar izquierdo)
2. Click en **"Comenzar"**
3. Selecciona **"Correo/Contraseña"** → Habilitar
4. Selecciona **"Google"** → Habilitar

### Paso 2.3: Crear Realtime Database
1. Ve a **"Realtime Database"**
2. Click **"Crear base de datos"**
3. Ubicación: Elige la más cercana (ej: `us-central1`)
4. Modo de seguridad: **"Comenzar en modo de prueba"**
5. Click **"Crear"**

### Paso 2.4: Crear Storage
1. Ve a **"Storage"**
2. Click **"Comenzar"**
3. Ubicación: La misma que BD
4. Click **"Crear"**

### Paso 2.5: Obtener Credenciales
1. Click en **⚙️ Configuración del proyecto** (arriba a la derecha)
2. Tab: **"Configuración general"**
3. Desplázate hasta **"Tus aplicaciones"**
4. Si no hay app web, click **"</>"** para crear una
5. Registra la app con nombre: `Warehouse App`
6. **COPIA TODO ESTO:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "almacenmercedes-xxxxx.firebaseapp.com",
  databaseURL: "https://almacenmercedes-xxxxx.firebaseio.com",
  projectId: "almacenmercedes-xxxxx",
  storageBucket: "almacenmercedes-xxxxx.appspot.com",
  messagingSenderId: "xxxxxxxxxxxxxxxx",
  appId: "1:xxxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
}
```

---

## Fase 3: Agregar Variables a Netlify

### Paso 3.1: Ir a Netlify Site Settings
1. En Netlify, abre tu sitio `almacenmercedes`
2. Click en **"Site settings"** (arriba)
3. Sidebar izquierdo → **"Build & deploy"**
4. Click en **"Environment"**

### Paso 3.2: Agregar Variables de Entorno
1. Click en **"Edit variables"** (o **"Add**" si está vacío)
2. Agrega estas 7 variables (del Paso 2.5):

| Key | Value |
|-----|-------|
| REACT_APP_FIREBASE_API_KEY | `AIzaSy...` |
| REACT_APP_FIREBASE_AUTH_DOMAIN | `almacenmercedes-xxxxx.firebaseapp.com` |
| REACT_APP_FIREBASE_PROJECT_ID | `almacenmercedes-xxxxx` |
| REACT_APP_FIREBASE_DATABASE_URL | `https://almacenmercedes-xxxxx.firebaseio.com` |
| REACT_APP_FIREBASE_STORAGE_BUCKET | `almacenmercedes-xxxxx.appspot.com` |
| REACT_APP_FIREBASE_MESSAGING_SENDER_ID | `xxxxxxxxxxxxxxxx` |
| REACT_APP_FIREBASE_APP_ID | `1:xxxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx` |

3. Click **"Save"**

### Paso 3.3: Triggear nuevo Deploy
1. Arriba, ve a **"Deploys"**
2. Click en **"Trigger deploy"** → **"Deploy site"**
3. Espera a que termine (debería estar VERDE ✓)

---

## Fase 4: Verificación y Autorización

### Paso 4.1: Obtener URL de Netlify
1. En Netlify, ve a **"Deploys"**
2. Busca tu URL (algo como: `almacenmercedes-xxxxx.netlify.app`)
3. Cópiala

### Paso 4.2: Autorizar en Firebase
1. Ve a Firebase Console
2. **"Autenticación"** → **"Configuración"**
3. Desplázate a **"Dominios autorizados"**
4. Click **"Agregar dominio"**
5. Pega tu URL de Netlify: `almacenmercedes-xxxxx.netlify.app`
6. Agrega también:
   - `localhost:3000`
   - `127.0.0.1:3000`
7. Click **"Agregar"**

---

## Fase 5: Prueba en Producción

### Paso 5.1: Abrir tu app en producción
1. Copia URL de Netlify
2. Abrela en navegador: `https://almacenmercedes-xxxxx.netlify.app`
3. Intenta hacer login
4. Verifica que funciona

### Paso 5.2: Verificar Logs
Si algo falla:
1. En Netlify, ve a **"Deploys"**
2. Click en tu último deploy
3. Click en **"Deploy log"** para ver qué salió mal
4. Busca errores en la consola

---

## 🎯 Resumen de Pasos

1. ✅ Código en GitHub
2. ⏳ Conectar GitHub a Netlify (este paso)
3. ⏳ Crear Firebase y obtener credenciales
4. ⏳ Agregar credenciales a Netlify
5. ⏳ Autorizar dominio en Firebase
6. ⏳ Probar en producción

---

## ⏱️ Tiempo Estimado

- Conectar GitHub a Netlify: 5 min
- Crear Firebase: 5 min
- Agregar variables a Netlify: 3 min
- Autorizar dominio: 2 min
- Pruebas: 5 min
- **TOTAL: ~20 minutos**

---

## 🆘 Troubleshooting

### Deploy fallido: "Command failed"
```
Causa: Falta npm install
Solución: Netlify lo hace automáticamente, intenta deploy nuevamente
```

### Deploy fallido: "Environment variables not set"
```
Causa: Variables no guardadas en Netlify
Solución: Verifica en Site settings → Environment que estén allí
```

### Error en consola del navegador: "Firebase not configured"
```
Causa: Falta una variable de entorno
Solución: Revisa que todas las 7 variables estén en Netlify
         Y que estén exactamente con esos nombres (mayúsculas/minúsculas)
```

### Login no funciona en producción pero funciona local
```
Causa: Dominio no autorizado en Firebase
Solución: Agregar dominio de Netlify en Firebase > Auth > Settings
```

---

## ✅ Checklist

- [ ] GitHub repositorio creado y pusheado
- [ ] Cuenta Netlify creada
- [ ] Repositorio conectado a Netlify
- [ ] Proyecto Firebase creado
- [ ] Auth, Database, Storage habilitados
- [ ] Credenciales copiadas
- [ ] 7 variables agregadas a Netlify
- [ ] Deploy completado (Green ✓)
- [ ] Dominio Netlify autorizado en Firebase
- [ ] Login funciona en producción

---

## 🎉 ¡Cuando termines!

Tu app estará disponible en:
```
https://almacenmercedes-xxxxx.netlify.app
```

Completamente deployada con:
- ✅ React corriendo
- ✅ Firebase conectado
- ✅ HTTPS seguro
- ✅ Auto-deploy en cada push a GitHub

