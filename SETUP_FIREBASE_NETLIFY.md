# 🚀 GUÍA RÁPIDA: Configurar Firebase + Netlify

## PASO 1: Crear Proyecto Firebase (5 minutos)

### 1.1 Ir a Firebase Console
```
Abre: https://console.firebase.google.com/
Haz clic en "Crear un proyecto"
```

### 1.2 Configurar el proyecto
- **Nombre del proyecto:** `almacen-warehouse` (o tu nombre)
- **Google Analytics:** Desactiva (opcional)
- Haz clic en "Crear proyecto"

### 1.3 Habilitar servicios
Una vez creado el proyecto:

**Authentication:**
1. Click en "Desarrollar" (sidebar) → "Authentication"
2. Click en "Comenzar"
3. Proveedor: Email/Contraseña → Habilitar
4. Proveedor: Google → Habilitar

**Realtime Database:**
1. Click en "Realtime Database"
2. Click en "Crear base de datos"
3. Ubicación: Elige la más cercana
4. Modo de seguridad: "Modo de prueba"
5. Crear

**Storage:**
1. Click en "Storage"
2. Click en "Comenzar"
3. Ubicación: La misma que la BD
4. Crear

### 1.4 Obtener credenciales

1. Click en **Configuración del proyecto** (⚙️ arriba a la derecha)
2. Tab: "Configuración general"
3. Desplázate hasta "Tus aplicaciones"
4. Click en el icono **web** (`</>`), o crea una nueva app web
5. **Registra la app** con un nombre (ej: "Warehouse App")
6. **Copia el código de configuración** que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  databaseURL: "https://tu-proyecto.firebaseio.com",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "xxxxxxxxxxxxxxxx",
  appId: "1:xxxxx:web:xxxxxxxxxxxxxxxx"
};
```

---

## PASO 2: Configurar variables de entorno locales (2 minutos)

### 2.1 Abrir `.env.local`

El archivo está en la raíz del proyecto: `/Users/ing.carlosjimenez/almacen/.env.local`

### 2.2 Reemplazar con tus credenciales

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto
REACT_APP_FIREBASE_DATABASE_URL=https://tu-proyecto.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_APP_ID=1:xxxxx:web:xxxxxxxxxxxxxxxx
```

**Nota:** Reemplaza `tu-proyecto` con el ID real de tu proyecto Firebase.

### 2.3 Guardar el archivo

---

## PASO 3: Prueba local (2 minutos)

```bash
cd /Users/ing.carlosjimenez/almacen

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La app estará en: http://localhost:3000

**Prueba el login:**
- Email: (crea un usuario nuevo)
- O usa Google Sign-In

---

## PASO 4: Configurar Netlify (5 minutos)

### 4.1 Conectar repositorio (si no lo has hecho)

1. Ve a https://app.netlify.com/
2. "Add new site" → "Import an existing project"
3. Selecciona GitHub (o tu proveedor)
4. Autoriza Netlify
5. Selecciona tu repositorio
6. Click en "Deploy site"

### 4.2 Agregar variables de entorno

1. En Netlify, ve a **Site settings** (o tu sitio específico)
2. Click en **Build & deploy** → **Environment**
3. Click en **Edit variables**
4. Agrega estas 7 variables (copia del paso 1.4):

| Variable | Valor |
|----------|-------|
| REACT_APP_FIREBASE_API_KEY | `AIzaSy...` |
| REACT_APP_FIREBASE_AUTH_DOMAIN | `tu-proyecto.firebaseapp.com` |
| REACT_APP_FIREBASE_PROJECT_ID | `tu-proyecto` |
| REACT_APP_FIREBASE_DATABASE_URL | `https://tu-proyecto.firebaseio.com` |
| REACT_APP_FIREBASE_STORAGE_BUCKET | `tu-proyecto.appspot.com` |
| REACT_APP_FIREBASE_MESSAGING_SENDER_ID | `123456789...` |
| REACT_APP_FIREBASE_APP_ID | `1:123...` |

5. Guardar

### 4.3 Esperar deploy

Netlify hará un nuevo deploy automáticamente. Espera a que termine.

---

## PASO 5: Autorizar dominio en Firebase (2 minutos)

1. Ve a Firebase Console → **Authentication** → **Settings**
2. Desplázate a **Authorized domains**
3. Click en "Add domain"
4. Agrega tu URL de Netlify: `tu-sitio.netlify.app`

También agrega:
- `localhost:3000` (para desarrollo local)
- `127.0.0.1:3000` (para desarrollo local)

---

## PASO 6: Prueba en producción (1 minuto)

1. Ve a tu URL de Netlify: `https://tu-sitio.netlify.app`
2. Intenta hacer login
3. Verifica que puedas:
   - Hacer login/logout
   - Subir fotos
   - Ver datos en tiempo real

---

## ✅ Checklist Final

- [ ] Proyecto Firebase creado
- [ ] Authentication habilitado
- [ ] Realtime Database creado
- [ ] Storage creado
- [ ] Credenciales copiadas
- [ ] `.env.local` actualizado
- [ ] `npm start` funciona localmente
- [ ] Repositorio en GitHub
- [ ] Sitio creado en Netlify
- [ ] Variables de entorno en Netlify
- [ ] Dominio de Netlify en Firebase
- [ ] Deploy a Netlify completo
- [ ] Login funciona en producción

---

## 🔧 Troubleshooting

### Error: "Cannot connect to database"
```
✓ Verifica que databaseURL es correcto
✓ Verifica que la BD Realtime existe en Firebase
✓ Espera 5 minutos a que se propague
```

### Error: "Firebase API key not valid"
```
✓ Verifica que copiaste la API key correctamente
✓ Asegúrate de que apiKey está configurada
✓ Revisa que no hay espacios extra
```

### Error: "CORS" en Storage
```
✓ Agrega tu dominio de Netlify en Firebase
✓ Espera 5-10 minutos
✓ Limpia el caché del navegador (Ctrl+Shift+Delete)
```

### No ve cambios después del deploy
```
✓ Ve a Netlify → Deploys → Trigger deploy
✓ O haz un push a GitHub para triggerar deployment
✓ Limpia el caché del navegador
```

---

## 📞 Soporte

Si tienes problemas:
1. Verifica la consola (F12 en el navegador)
2. Mira los logs en Netlify (Site → Deploys)
3. Revisa Firebase Console → Logs
4. Ejecuta el script de verificación:
   ```bash
   bash verify-config.sh
   ```

---

## 🎯 Resumen de URLs importantes

| Servicio | URL |
|----------|-----|
| Firebase Console | https://console.firebase.google.com/ |
| Netlify Dashboard | https://app.netlify.com/ |
| Tu app local | http://localhost:3000 |
| Tu app producción | https://tu-sitio.netlify.app |

