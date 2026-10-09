# 🚀 Guía de Inicio - Sistema de Gestión de Almacén

## ¿Dónde está el servidor?

**URL del servidor:** http://localhost:3000

El servidor ya está corriendo y listo para usar.

---

## 🔐 Credenciales de Prueba

### Rol: Administrador
- **Email:** admin@test.com
- **Contraseña:** password123
- **Permisos:** Crear, editar y eliminar productos

### Rol: Dispatch/Despacho
- **Email:** dispatch@test.com
- **Contraseña:** password123
- **Permisos:** Ver inventario y registrar despachos (solo lectura de productos)

---

## 📱 Funcionalidades por Rol

### 👨‍💼 Administrador (admin@test.com)

1. **Gestionar Inventario**
   - Crear nuevos productos
   - Editar información
   - Eliminar productos
   - Subir múltiples fotos
   - Ver galería de fotos

2. **Búsqueda y Filtros**
   - Buscar por nombre, SKU o descripción
   - Filtrar por rango de stock
   - Resultados en tiempo real

3. **Estadísticas**
   - Ver 3 gráficos interactivos
   - 4 tarjetas de estadísticas
   - Análisis de distribución de stock

4. **Exportar Datos**
   - Inventario a PDF
   - Inventario a CSV
   - Descargas con fecha automática

### 📦 Dispatch (dispatch@test.com)

1. **Ver Inventario**
   - Lista de productos disponibles
   - Ver foto de cada producto
   - Ver stock disponible

2. **Registrar Despachos**
   - Seleccionar producto
   - Ingresa cantidad a despachar
   - Especificar destino
   - Sistema valida stock disponible

3. **Historial de Despachos**
   - Ver todos tus despachos
   - Filtrar por período (Hoy/Semana/Todos)
   - Ordenar resultados
   - Exportar historial a CSV

---

## 🎯 Guía Rápida: Primera Vez

### Paso 1: Crear un Producto
1. Inicia sesión como **admin@test.com**
2. Haz clic en "➕ Nuevo Producto"
3. Completa los campos:
   - Nombre: "Cable USB"
   - Descripción: "Cable rápido"
   - Cantidad: "5"
   - (SKU se genera automáticamente: SKU-0001)
4. En "Fotos del Producto" sube 2-3 imágenes
5. Haz clic en "Guardar Producto"

### Paso 2: Ver el Producto
1. El producto aparecerá en el inventario
2. Haz clic en la foto para ver la galería completa
3. Usa ← → para navegar entre fotos

### Paso 3: Probar Búsqueda y Filtros
1. En "Buscar por nombre, SKU..." escribe "Cable"
2. Ajusta el rango de stock (0-100)
3. Los resultados se actualizan automáticamente

### Paso 4: Exportar
1. Haz clic en "PDF" o "CSV" en la esquina superior derecha
2. Se descarga el archivo con fecha

### Paso 5: Probar Dispatch
1. Cierra sesión
2. Inicia sesión como **dispatch@test.com**
3. Selecciona el producto "Cable USB"
4. Ingresa cantidad: "2"
5. Destino: "Almacén 2"
6. Haz clic en "Despachar"
7. El stock se actualiza automáticamente

### Paso 6: Ver Historial
1. En "Historial de Despachos" verás tus despachos
2. Filtra por "Hoy"
3. Ordena por "Cantidad"
4. Exporta a CSV

---

## 📊 Ejemplos de Uso

### Buscar Producto
```
Escribe en el campo de búsqueda:
- "Cable" → encuentra por nombre
- "SKU-001" → encuentra por SKU
- "rápido" → encuentra por descripción
```

### Filtrar por Stock
```
Mueve los sliders:
- Mínimo: 0
- Máximo: 100
Solo mostrará productos en ese rango
```

### Generar Reporte
```
1. Haz clic en "PDF"
2. Se abre tu descargador
3. Archivo: inventario-2026-10-07.pdf

O en CSV para Excel:
1. Haz clic en "CSV"
2. Archivo: inventario-2026-10-07.csv
```

---

## 🛠️ Estructura del Proyecto

```
src/
├── pages/
│   ├── AdminDashboard.js (Gestión de productos)
│   ├── DispatchHome.js (Despachos)
│   └── Login.js (Autenticación)
├── components/
│   ├── Statistics.js (Gráficos)
│   ├── DispatchHistory.js (Historial)
│   ├── SearchFilters.js (Búsqueda/Filtros)
│   ├── PhotoGallery.js (Galería de fotos)
│   └── Header.js (Navegación)
├── config/
│   ├── firebase.js (Configuración)
│   ├── mockAuth.js (Autenticación local)
│   └── mockFirestore.js (Base de datos local)
├── context/
│   └── AuthContext.js (Contexto de usuario)
├── utils/
│   └── exportData.js (Exportación PDF/CSV)
└── styles/
    ├── Admin.css
    ├── Statistics.css
    ├── DispatchHistory.css
    ├── SearchFilters.css
    └── PhotoGallery.css
```

---

## 🔧 Comandos Útiles

### Iniciar servidor
```bash
npm start
```

### Ver compilación
El servidor se reinicia automáticamente cuando cambias código

### Limpiar localStorage (si algo no funciona)
Abre la consola (F12) y pega:
```javascript
localStorage.removeItem('mock_firestore');
localStorage.removeItem('mock_users');
localStorage.removeItem('currentUser');
location.reload();
```

---

## 📋 Checklist de Funcionalidades

### Admin Dashboard
- [ ] Crear producto con fotos
- [ ] Ver fotos en galería
- [ ] Editar producto existente
- [ ] Eliminar producto
- [ ] Buscar por nombre
- [ ] Buscar por SKU
- [ ] Filtrar por stock
- [ ] Exportar a PDF
- [ ] Exportar a CSV

### Dispatch Dashboard
- [ ] Ver lista de productos
- [ ] Ver foto del producto
- [ ] Registrar despacho
- [ ] Ver historial
- [ ] Filtrar historial por fecha
- [ ] Ordenar historial
- [ ] Exportar historial a CSV

### Estadísticas
- [ ] Ver gráfico Pie
- [ ] Ver gráfico Barras
- [ ] Ver gráfico Línea
- [ ] Ver tarjetas de stats
- [ ] Interactuar con gráficos

---

## 💡 Tips y Trucos

### Búsqueda Rápida
- Empieza a escribir mientras ves el listado
- Los resultados se actualizan mientras escribes

### Filtros Inteligentes
- Puedes combinar búsqueda + filtros
- Ejemplo: Busca "Cable" + Stock 10-50

### Galería de Fotos
- Clic en la foto para abrir galería
- ← → para navegar
- ESC para cerrar
- Clic en thumbnails para saltar

### Exportación
- Siempre se descarga con la fecha del día
- PDF listo para imprimir
- CSV abierto en Excel

---

## 🐛 Solución de Problemas

### Las fotos no se muestran
→ Limpia localStorage y vuelve a crear producto

### El login no funciona
→ Abre consola (F12) y ejecuta:
```javascript
localStorage.removeItem('mock_users');
location.reload();
```

### El búsqueda no funciona
→ Asegúrate de escribir en el campo de búsqueda (lado izquierdo)

### Los filtros no cambian resultados
→ Verifica que haya productos en ese rango de stock

### No puedo descargar el PDF
→ Verifica permisos de descarga del navegador

---

## 📞 Soporte

¿Necesitas ayuda? Revisar:
1. [FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md) - Todas las funciones
2. [IMAGE_COMPRESSION.md](./IMAGE_COMPRESSION.md) - Fotos comprimidas
3. [RESET_SESSION.md](./RESET_SESSION.md) - Limpiar datos

---

## 🎉 ¡Listo!

Ya puedes usar el sistema completo:
- ✅ Registrar productos
- ✅ Subir fotos
- ✅ Buscar y filtrar
- ✅ Ver estadísticas
- ✅ Registrar despachos
- ✅ Exportar reportes

**Servidor corriendo en:** http://localhost:3000

¡Que disfrutes usando el sistema! 🚀
