// Mock de Firebase Auth para desarrollo local
// Simula autenticación sin necesidad de credenciales reales

const STORAGE_KEY = 'mock_users';
const AUTH_KEY = 'mock_current_user';

// Datos de prueba iniciales
const DEFAULT_USERS = {
  'admin@test.com': {
    uid: 'admin-uid-001',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    createdAt: new Date(),
    active: true
  },
  'dispatch@test.com': {
    uid: 'dispatch-uid-001',
    email: 'dispatch@test.com',
    password: 'password123',
    role: 'dispatch',
    createdAt: new Date(),
    active: true
  }
};

// Inicializar almacenamiento local
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  }
}

// Obtener todos los usuarios almacenados
function getUsers() {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : DEFAULT_USERS;
}

// Guardar usuarios
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Mock de createUserWithEmailAndPassword
export const createUserWithEmailAndPassword = async (auth, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();

      if (users[email]) {
        reject(new Error('Firebase: Error (auth/email-already-in-use). The email address is already in use by another account.'));
        return;
      }

      if (password.length < 6) {
        reject(new Error('Firebase: Error (auth/weak-password). Password should be at least 6 characters.'));
        return;
      }

      const newUser = {
        uid: `user-${Date.now()}`,
        email: email,
        password: password,
        role: 'dispatch', // Rol por defecto
        createdAt: new Date(),
        active: true
      };

      users[email] = newUser;
      saveUsers(users);

      resolve({
        user: {
          uid: newUser.uid,
          email: newUser.email
        }
      });
    }, 500); // Simular delay de red
  });
};

// Mock de signInWithEmailAndPassword
export const signInWithEmailAndPassword = async (auth, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const user = users[email];

      if (!user) {
        reject(new Error('Firebase: Error (auth/user-not-found). There is no user record corresponding to this identifier.'));
        return;
      }

      if (user.password !== password) {
        reject(new Error('Firebase: Error (auth/wrong-password). The password is invalid or the user does not have a password.'));
        return;
      }

      // Guardar usuario actual
      const userData = {
        uid: user.uid,
        email: user.email
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));

      // Disparar custom event para que onAuthStateChanged se entere (con pequeño delay para asegurar que se detecte)
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { key: AUTH_KEY } }));
      }, 50);

      resolve({
        user: userData
      });
    }, 500);
  });
};

// Mock de signOut
export const signOut = async (auth) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem(AUTH_KEY);
      // Disparar custom event para que onAuthStateChanged se entere
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { key: AUTH_KEY } }));
      resolve();
    }, 300);
  });
};

// Mock de onAuthStateChanged
export const onAuthStateChanged = (auth, callback) => {
  // Verificación inicial
  const checkAuth = () => {
    const currentUser = localStorage.getItem(AUTH_KEY);
    if (currentUser) {
      try {
        callback(JSON.parse(currentUser));
      } catch (e) {
        callback(null);
      }
    } else {
      callback(null);
    }
  };

  // Llamar inmediatamente
  checkAuth();

  // Usar custom event para cambios en la misma pestaña
  const handleAuthChange = (e) => {
    if (e.detail && e.detail.key === AUTH_KEY) {
      checkAuth();
    }
  };

  // Escuchar custom event
  window.addEventListener('authStateChanged', handleAuthChange);

  // También escuchar storage events para cambios en otras pestañas
  const handleStorageChange = (e) => {
    if (e.key === AUTH_KEY) {
      checkAuth();
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Retornar función unsubscribe
  return () => {
    window.removeEventListener('authStateChanged', handleAuthChange);
    window.removeEventListener('storage', handleStorageChange);
  };
};

// Mock de getDoc para obtener rol del usuario
export const getMockUserRole = async (uid) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getUsers();
      for (const user of Object.values(users)) {
        if (user.uid === uid) {
          resolve(user.role);
          return;
        }
      }
      resolve(null);
    }, 300);
  });
};

// Mock de setDoc para guardar datos del usuario
export const setMockUserData = async (uid, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getUsers();
      for (const key in users) {
        if (users[key].uid === uid) {
          users[key] = { ...users[key], ...data };
          saveUsers(users);
          resolve();
          return;
        }
      }
      resolve();
    }, 300);
  });
};

export default {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getMockUserRole,
  setMockUserData
};
