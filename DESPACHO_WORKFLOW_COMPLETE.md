# 📤 Sistema de Despacho - Documentación Completa

## ✅ Estado: COMPLETAMENTE FUNCIONAL

El sistema de despacho permite que usuarios con rol `dispatch` realicen despachos de productos, reduciendo automáticamente el inventario.

---

## 🔐 Permisos y Reglas de Seguridad

### Usuarios Admin (`role: 'admin'`)
- ✅ Ver todos los usuarios
- ✅ Crear/editar/eliminar usuarios
- ✅ Crear/editar/eliminar productos
- ✅ Ver historial completo de despachos
- ✅ Filtrar despachos por usuario y producto

### Usuarios Dispatch (`role: 'dispatch'`)
- ✅ Ver inventario disponible (lectura)
- ✅ Hacer despachos (crear registros en `dispatches`)
- ✅ Actualizar `quantity` y `dispatched` en productos
- ✅ Ver historial de despachos
- ❌ NO pueden crear productos
- ❌ NO pueden eliminar productos
- ❌ NO pueden crear/eliminar usuarios

---

## 📊 Estructura de Datos en Firebase

### Colección `products`
```javascript
products/
├── product-1792111597360/
│   ├── name: "DFHFH"
│   ├── description: "FDHDFH"
│   ├── quantity: 8          // Cantidad disponible (decrece al despachar)
│   ├── sku: "SKU-0001"       // Automático, no editable
│   ├── dispatched: 3         // Cantidad total despachada
│   └── timestamp: 1792111597360
└── product-1792111790000/
    ├── name: "Producto Prueba Firebase"
    ├── quantity: 25
    ├── dispatched: 0
    └── ...
```

### Colección `dispatches`
```javascript
dispatches/
├── DESP-1792193418103/
│   ├── id: "DESP-1792193418103"
│   ├── productId: "product-1792111597360"    // FK a products
│   ├── productName: "DFHFH"
│   ├── productSku: "SKU-0001"
│   ├── quantity: 3
│   ├── userEmail: "dispatch.test@test.com"
│   ├── createdAt: "2026-10-16T23:30:18.103Z"
│   └── date: "16/10/2026"
├── DESP-1792193439380/
│   ├── quantity: 1
│   └── ... (similar structure)
└── DESP-1792193474869/
    ├── quantity: 2
    └── ... (similar structure)
```

### Colección `users`
```javascript
users/
├── qwe123.../
│   ├── email: "admin@test.com"
│   ├── role: "admin"
│   └── createdAt: "2026-10-14..."
└── xyz789.../
    ├── email: "dispatch.test@test.com"
    ├── role: "dispatch"
    └── createdAt: "2026-10-16..."
```

---

## 🔒 Reglas de Seguridad (database.rules.json)

### Products - Reglas de Lectura/Escritura
```json
"products": {
  ".read": "auth != null",                    // Todos los autenticados pueden leer
  ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'",
  "$productId": {
    ".read": true,
    ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'",
    "quantity": {
      ".write": "auth.uid === null ? false : root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'dispatch'"
    },
    "dispatched": {
      ".write": "auth.uid === null ? false : root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'dispatch'"
    },
    ".validate": "newData.hasChildren(['name', 'quantity'])"
  }
}
```

**Explicación:**
- **Lectura**: Cualquier usuario autenticado puede leer productos
- **Escritura (admin)**: Solo admin puede crear/editar/eliminar productos completos
- **Escritura (quantity y dispatched)**: Admin Y dispatch pueden actualizar estos campos
- **Validación**: Debe tener al menos `name` y `quantity`

### Dispatches - Reglas de Lectura/Escritura
```json
"dispatches": {
  ".read": "auth != null",                    // Todos los autenticados pueden leer
  ".write": "auth != null",                   // Todos los autenticados pueden escribir
  "$dispatchId": {
    ".validate": "newData.hasChildren(['productId', 'quantity', 'userEmail'])"
  }
}
```

**Explicación:**
- **Lectura**: Cualquier usuario autenticado puede ver el historial de despachos
- **Escritura**: Cualquier usuario autenticado puede crear despachos
- **Validación**: Debe contener `productId`, `quantity` y `userEmail`

---

## 🔄 Flujo de Despacho (Paso a Paso)

### 1️⃣ Usuario Dispatch abre panel
```
GET /dispatch/home
→ Carga DispatchHome.js
→ useEffect() llama loadData()
```

### 2️⃣ Sistema carga inventario
```javascript
// DispatchHome.js - loadInventory()
const productsRef = dbRef(rtDatabase_obj, 'products');
const snapshot = await get(productsRef);
// Transforma datos y muestra en grid de productos
```

### 3️⃣ Usuario selecciona producto y cantidad
```javascript
// DispatchHome.js - handleDispatch()
const dispatchId = `DESP-${Date.now()}`;
const dispatchRecord = {
  productId: product.id,
  productName: product.name,
  quantity: 2,                    // ← Usuario ingresa
  userEmail: user.email,
  createdAt: new Date().toISOString(),
  date: new Date().toLocaleDateString('es-ES')
};
```

### 4️⃣ Sistema guarda despacho en Firebase
```javascript
// Guardar en /dispatches/{dispatchId}
const dispatchRef = dbRef(rtDatabase_obj, `dispatches/${dispatchId}`);
await dbSet(dispatchRef, dispatchRecord);
```

### 5️⃣ Sistema actualiza inventario
```javascript
// Actualizar en /products/{productId}
const newQuantity = product.quantity - dispatchQuantity;
const productRef = dbRef(rtDatabase_obj, `products/${product.id}`);
await dbUpdate(productRef, {
  quantity: newQuantity,           // 11 → 9
  dispatched: (product.dispatched || 0) + dispatchQuantity  // 0 → 2
});
```

### 6️⃣ Sistema recarga datos y muestra éxito
```javascript
await loadData();  // Refresca inventario y historial
setDispatchSuccess('✅ Despacho registrado: 2 DFHFH despachados');
```

### 7️⃣ Admin ve despacho en "Equipos Despachados"
```javascript
// AdminDashboard.js → DispatchedEquipment.js
const dispatchesRef = dbRef(rtDatabase_obj, 'dispatches');
const snapshot = await get(dispatchesRef);
// Muestra en tabla con datos completos
```

---

## 📝 Campos Importantes

### Al crear Despacho
```javascript
{
  id: string,                    // Ejemplo: "DESP-1792193474869"
  productId: string,             // Referencia al producto
  productName: string,           // Nombre del producto
  productSku: string,            // SKU del producto
  quantity: number,              // Cantidad despachada
  userEmail: string,             // Email del usuario que hizo despacho
  createdAt: ISO string,         // Timestamp ISO
  date: string                   // Formato "16/10/2026"
}
```

### Al actualizar Producto
```javascript
{
  quantity: number,              // Nuevo stock disponible
  dispatched: number             // Total despachado
}
```

---

## 🧪 Casos de Prueba

### ✅ Caso 1: Despacho Exitoso
```
1. Usuario dispatch abre inventario
2. Ve producto: "DFHFH" con quantity: 11
3. Ingresa cantidad: 2
4. Hace clic "Confirmar Despacho"
5. ✅ RESULTADO: 
   - quantity: 11 → 9
   - dispatched: 0 → 2
   - Aparece en historial
```

### ✅ Caso 2: Validación de Cantidad
```
1. Usuario intenta despachar más del disponible
2. Ingresa: 20 (cuando solo hay 9 disponibles)
3. Hace clic "Confirmar Despacho"
4. ✅ RESULTADO: Error "No hay suficiente stock. Disponible: 9"
```

### ✅ Caso 3: Admin ve historial
```
1. Admin va a Dashboard → "Equipos Despachados"
2. Ve tabla con todos los despachos
3. Puede filtrar por usuario: "dispatch.test@test.com"
4. Puede filtrar por producto: "DFHFH"
5. ✅ RESULTADO: Muestra despachos filtrados correctamente
```

### ✅ Caso 4: Permisos respetados
```
1. Usuario dispatch NO ve botón "Eliminar" en productos
2. Usuario dispatch NO puede crear nuevos productos
3. Usuario dispatch SÍ puede leer inventario
4. Usuario dispatch SÍ puede hacer despachos
5. ✅ RESULTADO: Permisos funcionando correctamente
```

---

## 🛠️ Comandos Útiles

### Desplegar reglas de seguridad
```bash
cd /Users/ing.carlosjimenez/almacen
firebase deploy --only database
```

### Ver logs de despachos en consola
```javascript
// El navegador mostrará:
// ✅ Despacho registrado: 2 DFHFH despachados
```

### Verificar datos en Firebase Console
```
1. Ve a: https://console.firebase.google.com/project/almacenmercedes-461d2
2. Realtime Database
3. Expande "dispatches"
4. Verás todos los registros con estructura completa
```

---

## 📊 Estadísticas del Sistema

- **Total Despachos**: Se calcula en tiempo real (total de registros en `dispatches`)
- **Total Cantidad**: Suma de todos los campos `quantity` en despachos
- **Stock Disponible**: `product.quantity`
- **Total Despachado**: `product.dispatched`

---

## ⚠️ Limitaciones Actuales

1. **Permisos granulares limitados**: Las reglas de Firebase no permiten validar a nivel de campo individual dentro de un update
2. **Admin puede leer todo**: Admin tiene acceso a todos los datos
3. **Dispatch puede ver otros usuarios**: Dispatch ve despachos de otros usuarios (por diseño, para historial compartido)

---

## 🔮 Mejoras Futuras

1. Agregar restricciones por departamento/sede
2. Implementar aprobaciones de despachos (workflow)
3. Alertas automáticas cuando stock es bajo
4. Exportar despachos a reportes mensuales
5. Sincronización con sistema de contabilidad

---

## 📞 Soporte

Si hay problemas:
1. Verificar que Firebase Realtime Database esté activo
2. Verificar que las reglas estén desplegadas correctamente
3. Revisar consola del navegador (F12) para mensajes de error
4. Comprobar que el usuario tiene rol `dispatch` asignado

---

**Última actualización**: 2026-10-16
**Estado**: ✅ PRODUCCIÓN LISTA
