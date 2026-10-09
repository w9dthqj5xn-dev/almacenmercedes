// Mock de Firestore para desarrollo local
// Simula operaciones de base de datos sin necesidad de Firebase real

const DB_KEY = 'mock_firestore';

// Inicializar base de datos
function initializeDB() {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify({
      users: {},
      inventory: {},
      dispatch_history: {}
    }));
  }
}

// Obtener base de datos
function getDB() {
  initializeDB();
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : { users: {}, inventory: {}, dispatch_history: {} };
}

// Guardar base de datos
function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Mock de getDoc
export const getDoc = async (docRef) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { path, docId } = parsePath(docRef);
      const db = getDB();
      const collection = db[path];

      if (collection && collection[docId]) {
        resolve({
          exists: () => true,
          data: () => collection[docId],
          id: docId
        });
      } else {
        resolve({
          exists: () => false,
          data: () => null
        });
      }
    }, 300);
  });
};

// Mock de setDoc
export const setDoc = async (docRef, data, options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { path, docId } = parsePath(docRef);
      const db = getDB();

      if (!db[path]) {
        db[path] = {};
      }

      if (options.merge) {
        db[path][docId] = { ...db[path][docId], ...data };
      } else {
        db[path][docId] = data;
      }

      saveDB(db);
      resolve();
    }, 300);
  });
};

// Mock de updateDoc
export const updateDoc = async (docRef, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { path, docId } = parsePath(docRef);
      const db = getDB();

      if (db[path] && db[path][docId]) {
        db[path][docId] = { ...db[path][docId], ...data };
        saveDB(db);
      }

      resolve();
    }, 300);
  });
};

// Mock de deleteDoc
export const deleteDoc = async (docRef) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { path, docId } = parsePath(docRef);
      const db = getDB();

      if (db[path] && db[path][docId]) {
        delete db[path][docId];
        saveDB(db);
      }

      resolve();
    }, 300);
  });
};

// Mock de getDocs (para queries)
export const getDocs = async (queryRef) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { path } = parsePath(queryRef);
      const db = getDB();
      const collection = db[path] || {};
      const docs = Object.entries(collection).map(([id, data]) => ({
        id,
        data: () => data,
        exists: () => true
      }));

      resolve({
        docs: docs,
        size: docs.length,
        empty: docs.length === 0
      });
    }, 300);
  });
};

// Función auxiliar para parsear referencias
function parsePath(ref) {
  // Simular estructura de docRef: ref contiene información de ruta
  if (ref.path) {
    const parts = ref.path.split('/');
    return {
      path: parts[0],
      docId: parts[1]
    };
  }
  // Para queries
  if (ref._key && ref._key.path) {
    const parts = ref._key.path.segments;
    return { path: parts[0] };
  }
  return { path: '', docId: '' };
}

// Mock de doc()
export const doc = (db, collection, docId) => {
  return {
    path: `${collection}/${docId}`,
    _collection: collection,
    _docId: docId
  };
};

// Mock de collection()
export const collection = (db, collectionName) => {
  return {
    path: collectionName,
    _collection: collectionName
  };
};

// Mock de query()
export const query = (collRef, ...constraints) => {
  return {
    path: collRef.path,
    _collection: collRef._collection,
    _constraints: constraints
  };
};

// Mock de where()
export const where = (field, operator, value) => {
  return { field, operator, value };
};

// Mock de orderBy()
export const orderBy = (field, direction = 'asc') => {
  return { field, direction };
};

// Mock de limit()
export const limit = (count) => {
  return { count };
};

export default {
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  collection,
  query,
  where,
  orderBy,
  limit
};
