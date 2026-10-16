// Utilidad para guardar imágenes en Base de Datos cuando Storage no está disponible

import { ref as dbRef, set } from 'firebase/database';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Intenta subir imagen a Firebase Storage
 * Si falla, intenta guardar en base de datos como base64
 */
export const uploadImage = async (storage, rtDatabase, file, productId) => {
  try {
    // Intento 1: Subir a Storage
    if (storage) {
      try {
        const timestamp = Date.now();
        const uniqueName = `${timestamp}_${Math.random().toString(36).substring(7)}_${file.name}`;
        const storageRef = ref(storage, `products/${uniqueName}`);
        
        console.log(`📤 Subiendo a Storage: ${uniqueName}`);
        const uploadTask = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(uploadTask.ref);
        
        console.log(`✅ Imagen guardada en Storage: ${url}`);
        return { 
          url, 
          method: 'storage',
          path: uploadTask.ref.fullPath 
        };
      } catch (storageError) {
        console.warn('⚠️ Storage no disponible, intentando base de datos...', storageError.message);
        if (!storageError.message?.includes('not been set up')) {
          throw storageError; // Re-lanzar si es otro error
        }
      }
    }

    // Intento 2: Guardar en Base de Datos como base64
    if (rtDatabase) {
      try {
        console.log(`📤 Guardando imagen en Base de Datos (base64)...`);
        
        // Convertir archivo a base64
        const base64 = await fileToBase64(file);
        
        const imageId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const imageRef = dbRef(rtDatabase, `products/${productId}/images/${imageId}`);
        
        await set(imageRef, {
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64,
          uploadedAt: new Date().toISOString()
        });
        
        console.log(`✅ Imagen guardada en Base de Datos`);
        return {
          url: `data:${file.type};base64,${base64}`,
          method: 'database',
          imageId,
          productId
        };
      } catch (dbError) {
        console.error('❌ Error guardando en base de datos:', dbError);
        throw new Error('No se pudo guardar la imagen en Storage ni en Base de Datos');
      }
    }

    throw new Error('Storage y Base de Datos no disponibles');

  } catch (error) {
    console.error('❌ Error en uploadImage:', error);
    throw error;
  }
};

/**
 * Convierte un File a base64
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Extraer solo la parte base64 (sin el prefijo data:...)
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Obtiene una imagen desde base de datos si está en formato base64
 */
export const getImageUrl = (imageData) => {
  if (!imageData) return null;
  
  // Si ya es una URL de Storage
  if (imageData.url?.startsWith('https://')) {
    return imageData.url;
  }
  
  // Si es base64, retornar directamente
  if (imageData.url?.startsWith('data:')) {
    return imageData.url;
  }
  
  return imageData;
};

/**
 * Calcula el tamaño máximo permitido considerando base64
 * Base64 es ~33% más grande que el archivo original
 */
export const getMaxAllowedSize = (isUsingDatabase = true) => {
  const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB para Storage
  const MAX_DATABASE_SIZE = 100 * 1024; // 100KB para Database (con overhead de base64)
  
  return isUsingDatabase ? MAX_DATABASE_SIZE : MAX_STORAGE_SIZE;
};
