# Resetear la Sesión Local

Si encuentras que el login no funciona después de cerrar el navegador, sigue estos pasos:

## Opción 1: Limpiar completamente desde la consola del navegador
Abre la consola del navegador (F12) y copia/pega esto:

```javascript
// Limpiar toda la base de datos
localStorage.removeItem('mock_firestore');
localStorage.removeItem('mock_users');
localStorage.removeItem('currentUser');

// Recargar la página
location.reload();
```

Esto reiniciará:
- ✅ Los usuarios de prueba (admin@test.com / password123)
- ✅ La base de datos de inventario (vacía)
- ✅ La sesión actual

## Opción 2: Limpiar desde el terminal
```bash
# En el directorio del proyecto
node -e "console.log('LocalStorage limpiado')" && \
open http://localhost:3000
```

## Credenciales de prueba después del reset:
- **Email Admin**: admin@test.com
- **Password**: password123
- **Email Dispatch**: dispatch@test.com
- **Password**: password123

## Si aún no funciona:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Application" → LocalStorage
3. Verifica que existan estas keys:
   - `mock_users` (debe tener los dos usuarios)
   - `mock_firestore` (debe tener la estructura vacía)

4. Si faltan, ejecuta el script de limpieza de arriba

## Notas:
- Los datos en localStorage se pierden al limpiar, así que ten cuidado
- Los cambios en el código se aplican automáticamente (hot reload)
- Si ves errores en la consola, reporta el mensaje de error
