import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword as fbCreateUser, 
  signInWithEmailAndPassword as fbSignIn, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { ref as dbRef, get, set as dbSet } from 'firebase/database';
import { auth_obj, rtDatabase_obj, isLocalMode, authModule } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Seleccionar funciones según modo
  const createUserWithEmailAndPassword = isLocalMode ? authModule.createUserWithEmailAndPassword : fbCreateUser;
  const signInWithEmailAndPassword = isLocalMode ? authModule.signInWithEmailAndPassword : fbSignIn;
  const signOut = isLocalMode ? authModule.signOut : fbSignOut;
  const onAuthChange = isLocalMode ? authModule.onAuthStateChanged : onAuthStateChanged;

  // Obtener datos del usuario
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserRole = useCallback(async (uid) => {
    try {
      if (isLocalMode) {
        const role = await authModule.getMockUserRole(uid);
        return role;
      }
      // Usar Realtime Database en lugar de Firestore
      const userRef = dbRef(rtDatabase_obj, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return snapshot.val().role;
      }
    } catch (err) {
      console.error('Error obteniendo rol:', err);
    }
    return null;
  }, []);

  // Monitorear cambios de autenticación
  useEffect(() => {
    console.log('[AuthContext] Setting up onAuthStateChanged listener');
    const unsubscribe = onAuthChange(auth_obj, async (currentUser) => {
      console.log('[AuthContext] onAuthStateChanged callback:', currentUser);
      if (currentUser) {
        console.log('[AuthContext] Getting role for user:', currentUser.uid);
        const role = await getUserRole(currentUser.uid);
        console.log('[AuthContext] Role received:', role);
        setUser(currentUser);
        setUserRole(role);
      } else {
        console.log('[AuthContext] No user, clearing state');
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('[AuthContext] Cleaning up onAuthStateChanged listener');
      unsubscribe();
    };
  }, [onAuthChange, getUserRole]);

  // Registrar nuevo usuario
  const register = async (email, password, role) => {
    try {
      setError(null);
      const { user: newUser } = await createUserWithEmailAndPassword(auth_obj, email, password);
      
      // Guardar datos del usuario en Realtime Database
      if (isLocalMode) {
        await authModule.setMockUserData(newUser.uid, {
          role: role || 'dispatch'
        });
      } else {
        // Usar Realtime Database en lugar de Firestore
        try {
          const userRef = dbRef(rtDatabase_obj, `users/${newUser.uid}`);
          await dbSet(userRef, {
            email: newUser.email,
            role: role || 'dispatch',
            createdAt: new Date().toISOString(),
            active: true
          });
        } catch (dbErr) {
          console.error('[Register] Error guardando en Database:', dbErr);
          // No fallar si hay error guardando - el usuario fue creado exitosamente
        }
      }

      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      console.log('[AuthContext] login() called with email:', email);
      setError(null);
      console.log('[AuthContext] Calling signInWithEmailAndPassword...');
      const { user: loginUser } = await signInWithEmailAndPassword(auth_obj, email, password);
      console.log('[AuthContext] Sign in successful, user:', loginUser);
      const role = await getUserRole(loginUser.uid);
      console.log('[AuthContext] Role retrieved:', role);
      return { user: loginUser, role };
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth_obj);
      setUser(null);
      setUserRole(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userRole,
    loading,
    error,
    register,
    login,
    logout,
    isAdmin: userRole === 'admin',
    isDispatch: userRole === 'dispatch',
    isLocalMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

