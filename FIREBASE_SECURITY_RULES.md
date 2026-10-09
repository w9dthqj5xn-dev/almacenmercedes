# Reglas de Seguridad Firebase

## 📋 Reglas Realtime Database

Ir a: Firebase Console → Realtime Database → Reglas

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

## 🖼️ Reglas Storage

Ir a: Firebase Console → Storage → Reglas

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura de fotos de productos a usuarios autenticados
    match /products/{productId}/photos/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin' || request.auth.uid != null;
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

## 📝 Explicación de Reglas

### Realtime Database

- **users**: Cada usuario puede leer/modificar su propio perfil. Admins pueden ver todos.
- **products**: Todos pueden leer. Solo admins pueden escribir/modificar.
- **shipments**: Todos autenticados pueden leer/escribir (despacho necesita crear envíos).
- **statistics**: Solo lectura para todos. Escritura solo para admins.

### Storage

- **products/**: Todos pueden leer fotos. Admins pueden escribir/borrar. Usuarios pueden escribir.
- El resto: Solo admins.

---

## ✅ Pasos para Aplicar

1. Firebase Console → Realtime Database
2. Click en "Reglas"
3. Borra todo y pega las reglas de arriba
4. Click en "Publicar"
5. Firebase Console → Storage
6. Click en "Reglas"
7. Borra todo y pega las reglas de Storage
8. Click en "Publicar"

---

## 🔒 Seguridad: Custom Claims (Opcional avanzado)

Para mayor seguridad, puedes usar Custom Claims en los tokens de Firebase.

En Firebase Cloud Functions o Admin SDK:

```javascript
// Establecer role como custom claim
admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log('Custom claims set for user', uid);
  });
```

Luego en las reglas:

```json
".write": "request.auth.token.role == 'admin'"
```

---

## 📚 Recursos

- [Firebase Realtime Database Rules](https://firebase.google.com/docs/rules)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication Security](https://firebase.google.com/docs/auth/security)
