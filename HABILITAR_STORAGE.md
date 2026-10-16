# 🔥 Habilitar Firebase Storage

## ¿Por Qué No Funciona la Subida de Imágenes?

Firebase Storage no está habilitado en tu proyecto. Por eso las imágenes no se suben.

## ✅ Solución: 3 pasos fáciles

### Paso 1: Ir a Firebase Console
1. Abre: https://console.firebase.google.com/project/almacenmercedes-461d2/storage
2. Haz clic en **"Get Started"** (botón azul)

### Paso 2: Configurar Storage
Te pedirá una ubicación para almacenar archivos. Elige:
- **Ubicación**: `europe-west1` (igual a tu Realtime DB)
- **Modo**: Desarrollador (recomendado para empezar)

Luego haz clic en **"Create"** o **"Crear"**

### Paso 3: Esperar (2-3 minutos)
Se está creando el Storage. Verás mensajes de "Loading".
Cuando termine, irá a la página de Storage.

## ✅ Verificar que Está Habilitado

```bash
# En terminal, ejecuta:
firebase deploy --only storage

# Deberías ver:
# ✔ storage: rules for Cloud Storage bucket...released successfully
```

## 🎉 Después de Habilitar

1. Vuelve al navegador
2. Recarga la página (Cmd+R)
3. Intenta guardar producto **CON IMAGEN**
4. ¡Debería funcionar! ✅

## 📋 Lo que va a pasar

```
1. Seleccionas imagen
2. Haces click "Guardar Producto"
3. La imagen se sube a Storage
4. Se obtiene URL de la imagen
5. Se guarda en Realtime DB
6. ¡Listo! Producto guardado con imagen
```

## ⏱️ Tiempo estimado

- Habilitar Storage: 3-5 minutos
- Deploy de reglas: 1 minuto
- Total: ~5 minutos

¡Después de esto, las imágenes funcionarán perfectamente!

---

## 🆘 Si Algo Sale Mal

### "No veo botón Get Started"
→ Storage ya podría estar habilitado
→ Intenta desplegar rules: `firebase deploy --only storage`

### "Error al crear Storage"
→ Asegúrate de estar en la región correcta (europe-west1)
→ Intenta de nuevo en 1-2 minutos

### "Sigue sin funcionar"
→ Copia el error de la consola (F12)
→ Avísame qué dice

---

**¡Haz este paso rápido para que las imágenes funcionen!** 🚀
