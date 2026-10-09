# Configuración Firebase + Netlify

## Parte 1: Crear Proyecto Firebase

### Paso 1: Crear el proyecto en Firebase Console

1. Ve a https://console.firebase.google.com/
2. Haz clic en "Crear un proyecto"
3. Nombre del proyecto: `almacen-warehouse` (o tu nombre preferido)
4. Acepta los términos y crea el proyecto
5. Espera a que se inicialice

### Paso 2: Configurar Authentication

1. En la consola, ve a **Authentication** > **Comenzar**
2. Habilita **Proveedor de correo/contraseña**
3. Habilita **Google** (para sign-in con Google)

### Paso 3: Crear Base de Datos Realtime

1. Ve a **Realtime Database** > **Crear base de datos**
2. Ubicación: Elige la más cercana a tu región
3. Modo de seguridad: **Comenzar en modo de prueba** (luego configuraremos reglas)
4. Crear

### Paso 4: Configurar Storage para fotos

1. Ve a **Storage** > **Comenzar**
2. Ubicación: La misma que la base de datos
3. Crear

### Paso 5: Obtener las credenciales

1. Ve a **Configuración del proyecto** (ícono de engranaje) > **Configuración general**
2. Desplázate hasta **Tus apps**
3. Haz clic en el icono de **web** (</> )
4. Registra la app con cualquier nombre (ej: "Warehouse App")
5. Copia las credenciales que aparecen en la forma de configuración:

```javascript
{
  apiKey: "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "xxxxxxxxxxxxxxxx",
  appId: "1:xxxxx:web:xxxxxxxxxxxxxxxx"
}
```

---

## Parte 2: Configurar Variables de Entorno

### Local (.env.local)

1. Abre `.env.local` en tu editor
2. Reemplaza los valores demo con los reales de Firebase:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto
REACT_APP_FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_APP_ID=1:xxxxx:web:xxxxxxxxxxxxxxxx
```

### Para Netlify (.env.production)

Crea un archivo `.env.production` con las mismas variables:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto
REACT_APP_FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_APP_ID=1:xxxxx:web:xxxxxxxxxxxxxxxx
```

---

## Parte 3: Configurar Reglas de Seguridad Firebase

### Reglas Realtime Database

En **Realtime Database** > **Reglas**:

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
    }
  }
}
```

### Reglas Storage

En **Storage** > **Reglas**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin' || 
                      request.auth.token.email != null;
      allow delete: if request.auth.token.role == 'admin';
    }
  }
}
```

---

## Parte 4: Configurar Netlify

### Opción A: Conectar desde GitHub (Recomendado)

1. Ve a https://app.netlify.com/
2. Haz clic en "Add new site" > "Import an existing project"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio del proyecto
5. En **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Ve a **Site settings** > **Build & deploy** > **Environment**
7. Agrega las variables de entorno:
   - REACT_APP_FIREBASE_API_KEY
   - REACT_APP_FIREBASE_AUTH_DOMAIN
   - REACT_APP_FIREBASE_PROJECT_ID
   - REACT_APP_FIREBASE_DATABASE_URL
   - REACT_APP_FIREBASE_STORAGE_BUCKET
   - REACT_APP_FIREBASE_MESSAGING_SENDER_ID
   - REACT_APP_FIREBASE_APP_ID

### Opción B: CLI local (Alternativa)

```bash
# Instala Netlify CLI
npm install -g netlify-cli

# Conecta tu sitio
netlify link

# Deploy (opcional)
netlify deploy
```

---

## Parte 5: Autorizar Netlify en Firebase

1. En Firebase Console, ve a **Authentication** > **Usuarios**
2. Agrega el dominio de Netlify a la lista blanca en **Authentication** > **Settings**:
   - En "Authorized JavaScript origins", agrega tu URL de Netlify
   - En "Authorized redirect URIs", agrega `https://tu-dominio-netlify.netlify.app/__/auth/handler`

---

## Parte 6: Prueba Local

```bash
# Instala dependencias
npm install

# Prueba localmente
npm start

# El sitio estará en http://localhost:3000
```

---

## Checklist Final

- [ ] Proyecto Firebase creado
- [ ] Authentication habilitado (Email + Google)
- [ ] Realtime Database creada
- [ ] Storage creado
- [ ] Credenciales copiadas
- [ ] `.env.local` actualizado con credenciales reales
- [ ] `.env.production` creado
- [ ] Reglas de seguridad configuradas
- [ ] Netlify conectado al repositorio
- [ ] Variables de entorno en Netlify
- [ ] Dominio de Netlify autorizado en Firebase
- [ ] Prueba local exitosa
- [ ] Deploy a Netlify exitoso

---

## Posibles Errores y Soluciones

### Error: "Firebase API key not valid"
- Verifica que `REACT_APP_FIREBASE_API_KEY` sea correcto
- Asegúrate de usar `REACT_APP_` como prefijo

### Error: "Cannot connect to Realtime Database"
- Verifica que `REACT_APP_FIREBASE_DATABASE_URL` sea correcto
- Incluye `/` al final de la URL

### Error: "CORS" en Storage
- Agrega tu dominio de Netlify en Firebase Console
- Espera 5-10 minutos para que se aplique

### No aparece contenido después del deploy
- Verifica que `netlify.toml` existe con la configuración correcta
- Reinicia el build en Netlify
- Limpia el caché del navegador (Ctrl+Shift+Delete)
