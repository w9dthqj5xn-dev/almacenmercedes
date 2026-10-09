# Prueba de Galería de Fotos

## Pasos para probar la funcionalidad de fotos:

### 1. Limpiar la base de datos local (si es necesario)
Abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.removeItem('mock_firestore');
location.reload();
```

### 2. Crear un nuevo producto con fotos
- Haz click en "➕ Nuevo Producto"
- Completa los datos:
  - **Nombre**: Cable USB
  - **Descripción**: Cable de conexión rápida
  - **Cantidad**: 5
- En la sección "Fotos del Producto", haz click en el área y selecciona 2-3 imágenes

### 3. Guardar el producto
- Haz click en "Guardar Producto"
- El producto debe aparecer en el inventario con:
  - ✅ Primera foto como portada (miniatura)
  - ✅ Badge azul mostrando cantidad de fotos
  - ✅ Efecto hover en la imagen (zoom)

### 4. Ver la galería
- Haz click en la foto del producto
- Debe abrirse una modal fullscreen con:
  - ✅ Imagen grande
  - ✅ Botones de navegación (← →)
  - ✅ Thumbnails abajo
  - ✅ Contador de fotos (ej: 1/3)

### 5. Navegación en galería
- Usa flechas izquierda/derecha para navegar
- Presiona ESC para cerrar
- Haz click en los thumbnails para saltar a una foto

## Problemas comunes

### Las fotos no se muestran
✅ **SOLUCIONADO**: Ahora las fotos se guardan en localStorage como data URLs

### Las fotos desaparecen al recargar
✅ **SOLUCIONADO**: Las fotos se guardan en la base de datos mock y persisten

### El formulario no abre
- Asegúrate de hacer click en "➕ Nuevo Producto"
- Si ya hay un producto seleccionado, cierra el formulario primero

## Datos de prueba
- Email: admin@test.com
- Password: password123
- Rol: Administrador
