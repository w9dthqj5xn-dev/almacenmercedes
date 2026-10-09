# Compresión de Imágenes - Solución al Error de Quota

## Problema Original
```
QuotaExceededError: Setting the value of 'mock_firestore' exceeded the quota.
```

**Causa:** localStorage tiene un límite de ~5-10MB. Las imágenes sin comprimir excedían este límite.

## Solución Implementada

Se agregó compresión automática de imágenes usando Canvas API:

### Características de compresión:
- ✅ **Redimensionamiento**: Limita imágenes a máximo 800px (mantiene proporciones)
- ✅ **Compresión JPEG**: Usa calidad 70% para balance entre tamaño y calidad
- ✅ **Compresión de datos**: Reduce data URLs en ~70-80%

### Comparación de tamaño:
| Tipo | Tamaño original | Tamaño comprimido | Reducción |
|------|-----------------|-------------------|-----------|
| Foto 3000x2000px | ~2.5MB | ~300-400KB | 85-90% |
| Foto 1920x1080px | ~1.2MB | ~150-200KB | 85% |

## Cómo funciona

1. Usuario selecciona fotos
2. `handlePhotoChange()` → llama `compressImage()` para cada foto
3. `compressImage()`:
   - Lee la imagen con FileReader
   - Crea un Canvas
   - Redimensiona manteniendo proporciones (max 800px)
   - Exporta como JPEG 70%
   - Retorna data URL comprimida
4. Data URL comprimida se guarda en localStorage
5. Se muestra preview comprimido en el formulario

## Ventajas
- ✅ Ahora puedes guardar múltiples fotos sin error
- ✅ Carga más rápido
- ✅ Usa menos espacio en localStorage
- ✅ Las fotos siguen siendo de buena calidad visualmente
- ✅ Funciona igual en modo local y Firebase real

## Notas técnicas
- Limitamos a 800px porque es suficiente para thumbnails y vista en tablet
- Calidad 70% es el sweet spot entre tamaño y calidad
- Se recomienda un máximo de 5-10 fotos por producto en modo local
- En Firebase real, no hay este límite

## Próximas mejoras posibles
- [ ] Agregar barra de progreso al comprimir
- [ ] Permitir elegir nivel de compresión (calidad)
- [ ] Mostrar tamaño de foto antes/después
- [ ] Usar IndexedDB para almacenamiento ilimitado en lugar de localStorage
