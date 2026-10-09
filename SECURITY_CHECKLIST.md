# 🔐 SEGURIDAD: Checklist antes de hacer Commit

## ⚠️ IMPORTANTE

Nunca hagas commit de:
- ❌ `.env.local` (credenciales locales)
- ❌ `.env.production` (si contiene secretos)
- ❌ Claves API de Firebase
- ❌ Tokens de autenticación
- ❌ Contraseñas

## ✅ Lo que SÍ puedes hacer commit:

- ✅ `.env.example` (template sin valores)
- ✅ `netlify.toml` (configuración pública)
- ✅ Código fuente
- ✅ README.md

---

## 🔍 Verificación de Seguridad

Antes de `git push`, ejecuta:

```bash
# 1. Ver qué archivos se van a commitear
git status

# 2. Verificar que no haya secretos
git diff --cached | grep -i "apikey\|secret\|password"

# 3. Si ves secretos expuestos en tu último commit:
git log --pretty=format:"%h %s" -1
git reset HEAD~1  # Deshace el commit
```

---

## 📋 Archivos que NO deben tener secretos

```bash
# Estos archivos NUNCA deben contener valores reales:
cat > .env.example << 'EOF'
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
EOF
```

---

## 🚀 Para Netlify

Las variables de entorno se configuran en:
**Netlify Dashboard** → **Site settings** → **Build & deploy** → **Environment**

No necesitas .env.production en el repositorio.

---

## 🔑 Si accidentalmente expusiste secretos:

1. **Inmediatamente**: Invalida la clave en Firebase Console
2. Regenera una nueva clave API
3. Actualiza `.env.local` con la nueva clave
4. Considera hacer commit de limpieza (aunque la historia de Git conserva los datos)

Para limpiar el historio (⚠️ avanzado):
```bash
git filter-branch --tree-filter 'rm -f .env.local' HEAD
```

**Mejor alternativa**: Usa [git-secret](https://git-secret.io/) o [sealed-secrets](https://github.com/bitnami-labs/sealed-secrets)

---

## 📝 Pre-commit Hook (Opcional)

Crear `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Prevenir commit de .env.local

if git diff --cached --name-only | grep -E "\.env\.local|\.env\.production"; then
  echo "❌ ERROR: No puedes hacer commit de archivos .env"
  echo "Este archivo contiene secretos y no debe ser versionado."
  exit 1
fi

if git diff --cached | grep -i "apikey\|secret\|password"; then
  echo "❌ ERROR: Posibles secretos detectados en el commit"
  exit 1
fi
```

Hacer ejecutable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## 🎯 Workflow seguro

```bash
# 1. Trabajar localmente
npm start

# 2. Antes de commit, verificar
git status
git diff --cached

# 3. Si todo está bien
git add .
git commit -m "Tu mensaje"

# 4. Push
git push origin main
```

---

## ✨ GitHub Secret Scanning

Si usas GitHub, habilita:
- **Settings** → **Security & analysis** → **Secret scanning**
- GitHub alertará si detecta secrets en los commits

---

## 🔑 Regenerar claves si fueron expuestas

En Firebase Console:

1. **Project Settings** → **Service Accounts**
2. **Java, Python, etc.** → **Generate new private key**
3. O en **Web apps** → **Regenerar clave**

Luego actualiza `.env.local` y redeploy a Netlify.

