import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Importar mocks para desarrollo local
import * as mockAuth from './mockAuth';
import * as mockFirestore from './mockFirestore';

// Credenciales de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Detectar si tenemos credenciales válidas
const hasValidCredentials = Object.values(firebaseConfig).every(val => val && val.length > 0);
const isUsingMockAuth = !hasValidCredentials;

let app, auth, db, storage, rtDatabase;

if (isUsingMockAuth) {
  // Modo desarrollo: usar mocks locales
  console.log('🔧 [WAREHOUSE APP] Usando autenticación LOCAL (mock)');
  console.log('📝 [WAREHOUSE APP] Las credenciales de Firebase no están configuradas.');
  console.log('📝 [WAREHOUSE APP] Para usar Firebase real, crea un proyecto en https://console.firebase.google.com');
  console.log('📝 [WAREHOUSE APP] y actualiza las variables de entorno en .env.local');
  
  // Crear objetos dummy para compatibilidad
  app = { name: 'mock-app' };
  auth = { _isMock: true };
  db = { _isMock: true };
  storage = { _isMock: true };
  rtDatabase = { _isMock: true };
  
  // Inicializar datos de prueba en localStorage
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('mock_users')) {
      const DEFAULT_USERS = {
        'admin@test.com': {
          uid: 'admin-uid-001',
          email: 'admin@test.com',
          password: 'password123',
          role: 'admin',
          createdAt: new Date().toISOString(),
          active: true
        },
        'dispatch@test.com': {
          uid: 'dispatch-uid-001',
          email: 'dispatch@test.com',
          password: 'password123',
          role: 'dispatch',
          createdAt: new Date().toISOString(),
          active: true
        }
      };
      localStorage.setItem('mock_users', JSON.stringify(DEFAULT_USERS));
      console.log('✅ [WAREHOUSE APP] Usuarios de prueba inicializados en localStorage');
    }
    
    if (!localStorage.getItem('mock_firestore')) {
      localStorage.setItem('mock_firestore', JSON.stringify({
        users: {},
        inventory: {},
        dispatch_history: {}
      }));
      console.log('✅ [WAREHOUSE APP] Base de datos local inicializada');
    }
  }
} else {
  // Modo producción: usar Firebase real
  console.log('🚀 [WAREHOUSE APP] Inicializando Firebase en producción...');
  console.log(`📍 Proyecto: ${firebaseConfig.projectId}`);
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  rtDatabase = getDatabase(app);
  console.log('✅ [WAREHOUSE APP] Firebase inicializado correctamente');
}

export const auth_obj = auth;
export const db_obj = db;
export const storage_obj = storage;
export const rtDatabase_obj = rtDatabase;
export const isLocalMode = isUsingMockAuth;

export default app;
