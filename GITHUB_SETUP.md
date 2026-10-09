# 🚀 Crear Repositorio en GitHub y Subirlo

## Paso 1: Crear repositorio en GitHub

### 1.1 Ir a GitHub
1. Ve a https://github.com/
2. Inicia sesión con tu cuenta (o crea una si no tienes)

### 1.2 Crear nuevo repositorio
1. Click en el **+** (arriba a la derecha)
2. Click en "New repository"

### 1.3 Configurar el repositorio
```
Repository name: almacen-warehouse
Description: Warehouse Management System with Firebase and Netlify
Visibility: Public (o Private si prefieres)
Initialize with: NO selecciones nada (ya tenemos commits)
```

4. Click en "Create repository"

### 1.4 Copiar la URL
Después de crear, verás una URL como:
```
https://github.com/tu-usuario/almacen-warehouse.git
```

Cópiala.

---

## Paso 2: Conectar tu repositorio local con GitHub

### 2.1 En la terminal

Reemplaza `tu-usuario` y `tu-repo` con tus datos:

```bash
cd /Users/ing.carlosjimenez/almacen

# Agregar el remote (conexión a GitHub)
git remote add origin https://github.com/tu-usuario/almacen-warehouse.git

# Verificar que está conectado
git remote -v
```

Deberías ver:
```
origin  https://github.com/tu-usuario/almacen-warehouse.git (fetch)
origin  https://github.com/tu-usuario/almacen-warehouse.git (push)
```

### 2.2 Renombrar rama si es necesario
```bash
# Verificar rama actual
git branch

# Si la rama se llama 'master', cambiarla a 'main'
git branch -M main
```

---

## Paso 3: Subir el código a GitHub

```bash
# Subir todos los commits
git push -u origin main
```

Cuando te pida autenticación:
- **Con HTTPS**: Te pedirá usuario y contraseña (o personal access token)
- **Con SSH**: Necesitas haber configurado claves SSH

### 🔐 Si usas HTTPS y GitHub te pide contraseña:

GitHub ya no acepta contraseñas directas. Necesitas un **Personal Access Token**:

1. Ve a https://github.com/settings/tokens
2. Click en "Generate new token"
3. Selecciona `repo` (para repositorios públicos/privados)
4. Copia el token
5. Cuando GitHub te pida contraseña, pega el token

Alternativamente, usa SSH (más fácil):

---

## Alternativa: Usar SSH (Recomendado)

### 3.1 Generar claves SSH (si no las tienes)

```bash
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"
```

- Press Enter para cada pregunta (ubicación default)
- Contraseña: deja vacío o ingresa una (es opcional)

### 3.2 Agregar clave pública a GitHub

```bash
# Copiar la clave pública
cat ~/.ssh/id_ed25519.pub
```

1. Ve a https://github.com/settings/keys
2. Click en "New SSH key"
3. Pega la clave
4. Click en "Add SSH key"

### 3.3 Cambiar URL del remote a SSH

```bash
git remote set-url origin git@github.com:tu-usuario/almacen-warehouse.git

# Verificar
git remote -v
```

### 3.4 Subir

```bash
git push -u origin main
```

No te pedirá contraseña.

---

## Paso 4: Verificar en GitHub

1. Ve a tu repositorio: `https://github.com/tu-usuario/almacen-warehouse`
2. Deberías ver todos tus archivos
3. Verifica que aparezca el README.md

---

## Próximos pasos: Conectar a Netlify

Una vez que el repositorio esté en GitHub:

1. Ve a https://app.netlify.com/
2. Click en "Add new site" → "Import an existing project"
3. Selecciona GitHub
4. Autoriza Netlify para acceder a tus repositorios
5. Selecciona `almacen-warehouse`
6. Netlify detectará automáticamente:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Click en "Deploy site"

### Agregar variables de entorno en Netlify

Una vez desplegado:
1. En Netlify, ve a **Site settings**
2. **Build & deploy** → **Environment**
3. Agrega las 7 variables de Firebase (igual que con .env.local)
4. Netlify redeploy automáticamente

---

## 🎯 Comandos rápidos de referencia

```bash
# Ver estado
git status

# Ver commits
git log --oneline

# Ver remotes
git remote -v

# Agregar cambios (después de editar)
git add .
git commit -m "Tu mensaje"

# Subir cambios
git push origin main

# Descargar cambios (cuando trabajes desde otra máquina)
git pull origin main
```

---

## 🆘 Solucionar problemas

### Error: "fatal: not a git repository"
```bash
cd /Users/ing.carlosjimenez/almacen
git status
```

### Error: "remote origin already exists"
```bash
# Ver qué URL tiene
git remote -v

# Cambiar URL
git remote set-url origin https://github.com/tu-usuario/almacen-warehouse.git
```

### Error: "Authentication failed"
- Verifica tu token/contraseña
- Si usas HTTPS: usa Personal Access Token
- Si usas SSH: verifica que la clave pública está en GitHub

### El push no completa
```bash
# Intenta de nuevo
git push -u origin main --verbose
```

---

## ✅ Checklist

- [ ] Cuenta GitHub creada
- [ ] Repositorio creado en GitHub
- [ ] URL del repositorio copiada
- [ ] Remote "origin" agregado localmente
- [ ] SSH o Personal Access Token configurado
- [ ] `git push -u origin main` exitoso
- [ ] Archivos visibles en GitHub
- [ ] README.md y documentación visible
- [ ] Repositorio conectado a Netlify
- [ ] Variables de entorno en Netlify agregadas
- [ ] Deploy en Netlify en progreso/completado

