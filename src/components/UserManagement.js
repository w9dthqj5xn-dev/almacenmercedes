import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref as dbRef, get, set } from 'firebase/database';
import { rtDatabase_obj, isLocalMode, authModule } from '../config/firebase';
import { Users, Plus, Trash2, AlertCircle, Check } from 'lucide-react';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminAuthForm, setAdminAuthForm] = useState({
    email: '',
    password: ''
  });
  const [pendingUserData, setPendingUserData] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'dispatch'
  });

  // Cargar usuarios existentes
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      if (isLocalMode) {
        // Modo local: cargar usuarios de localStorage
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '{}');
        const userList = Object.entries(mockUsers).map(([uid, userData]) => ({
          uid,
          ...userData
        }));
        setUsers(userList);
      } else {
        // Modo Firebase: cargar de Realtime Database
        const usersRef = dbRef(rtDatabase_obj, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userList = Object.entries(usersData).map(([uid, userData]) => ({
            uid,
            ...userData
          }));
          setUsers(userList);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage('❌ Error loading users');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setMessage('❌ Email and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('❌ Password must be at least 6 characters long');
      return;
    }

    // Normalizar email: minúsculas y sin espacios
    const normalizedEmail = formData.email.toLowerCase().trim();
    const normalizedFormData = {
      ...formData,
      email: normalizedEmail
    };

    // Si estamos en modo Firebase, pedir credenciales del admin
    if (!isLocalMode) {
      setPendingUserData(normalizedFormData);
      setShowAdminAuthModal(true);
      return;
    }

    // Modo local: crear el usuario directamente
    await createUser(normalizedFormData, null);
  };

  const handleAdminAuthSubmit = async (e) => {
    e.preventDefault();
    
    if (!adminAuthForm.email || !adminAuthForm.password) {
      setMessage('❌ Admin email and password are required');
      return;
    }

    // Crear el usuario con las credenciales del admin
    if (pendingUserData) {
      await createUser(pendingUserData, adminAuthForm);
    }
  };

  const createUser = async (userData, adminCreds) => {
    try {
      setLoading(true);
      setMessage('');

      if (isLocalMode) {
        // Modo local: crear usuario en localStorage
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '{}');
        const uid = `user-${Date.now()}`;
        
        if (mockUsers[userData.email]) {
          setMessage('❌ Email is already registered');
          setLoading(false);
          return;
        }

        mockUsers[userData.email] = {
          uid,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          createdAt: new Date().toISOString(),
          active: true
        };

        localStorage.setItem('mock_users', JSON.stringify(mockUsers));
        await authModule.setMockUserData(uid, { role: userData.role });
        
        setMessage('✅ User created successfully');
        setFormData({ email: '', password: '', role: 'dispatch' });
        setShowForm(false);
        loadUsers();
      } else {
        // Modo Firebase: crear usuario con Firebase Auth
        try {
          const { auth_obj } = await import('../config/firebase');
          const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth');
          
          console.log('[UserManagement] Creating new user with email:', userData.email);
          
          // Paso 1: Crear el nuevo usuario (esto cambia el usuario autenticado a newUser)
          let newUser;
          try {
            const result = await createUserWithEmailAndPassword(auth_obj, userData.email, userData.password);
            newUser = result.user;
            console.log('[UserManagement] New user created successfully:', newUser.uid);
          } catch (createError) {
            console.error('[UserManagement] Error creating user:', createError.code, createError.message);
            if (createError.code === 'auth/email-already-in-use') {
              setMessage('❌ Email is already registered');
            } else if (createError.code === 'auth/weak-password') {
              setMessage('❌ Password is too weak');
            } else {
              setMessage(`❌ Error creating user: ${createError.message}`);
            }
            throw createError;
          }
          
          // Paso 1.5: En modo LOCAL (mockAuth), también guardar en localStorage
          if (isLocalMode) {
            const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '{}');
            mockUsers[userData.email] = {
              uid: newUser.uid,
              email: userData.email,
              password: userData.password,
              role: userData.role,
              createdAt: new Date().toISOString(),
              active: true
            };
            localStorage.setItem('mock_users', JSON.stringify(mockUsers));
            console.log('[UserManagement] User also saved to localStorage for mockAuth');
          }
          
          // Paso 2: Guardar datos en Realtime Database INMEDIATAMENTE
          try {
            const userRef = dbRef(rtDatabase_obj, `users/${newUser.uid}`);
            await set(userRef, {
              email: userData.email,
              role: userData.role,
              createdAt: new Date().toISOString(),
              active: true
            });
            console.log('[UserManagement] User data saved to database successfully');
          } catch (dbError) {
            console.error('[UserManagement] Error saving user data:', dbError);
            setMessage(`❌ Error saving user data: ${dbError.message}`);
            throw dbError;
          }

          // Paso 3: Re-autenticar al admin usando las credenciales guardadas
          if (adminCreds) {
            console.log('[UserManagement] Attempting to re-authenticate admin with email:', adminCreds.email);
            try {
              await signInWithEmailAndPassword(auth_obj, adminCreds.email, adminCreds.password);
              console.log('[UserManagement] Admin re-authenticated successfully');
            } catch (reAuthError) {
              console.error('[UserManagement] Error re-authenticating admin:', reAuthError.code, reAuthError.message);
              // El usuario fue creado exitosamente, pero el admin no pudo re-autenticarse
              // Mostrar mensaje de alerta pero no fallar completamente
              setMessage('⚠️ Usuario creado exitosamente, pero hubo un error re-autenticando. Por favor inicia sesión nuevamente.');
            }
          } else {
            console.warn('[UserManagement] No admin credentials provided for re-authentication');
          }
          
          // Paso 4: Esperar a que onAuthStateChanged se actualice
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Paso 5: Recargar usuarios
          console.log('[UserManagement] Reloading users list');
          await loadUsers();

          console.log('[UserManagement] User creation completed successfully');
          setMessage('✅ User created successfully');
          setFormData({ email: '', password: '', role: 'dispatch' });
          setShowForm(false);
          setShowAdminAuthModal(false);
          setAdminAuthForm({ email: '', password: '' });
          setPendingUserData(null);
          
        } catch (authError) {
          // El error ya fue manejado en los bloques try-catch internos
          console.error('[UserManagement] Final catch block - error already handled above');
        } finally {
          setShowAdminAuthModal(false);
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage(`❌ Error creating user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setLoading(true);

      if (isLocalMode) {
        // Modo local: eliminar de localStorage
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '{}');
        const userToDelete = users.find(u => u.uid === uid);
        if (userToDelete && mockUsers[userToDelete.email]) {
          delete mockUsers[userToDelete.email];
          localStorage.setItem('mock_users', JSON.stringify(mockUsers));
        }
      } else {
        // Modo Firebase: eliminar de Realtime Database
        const userRef = dbRef(rtDatabase_obj, `users/${uid}`);
        await set(userRef, null);
      }

      setMessage('✅ User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('❌ Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  // Solo el admin puede ver este componente
  if (userRole !== 'admin') {
    return (
      <div className="user-management-error">
        <AlertCircle size={48} />
        <h2>Access Denied</h2>
        <p>Only administrators can manage users</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div className="header-title">
          <Users size={32} />
          <div>
            <h2>User Management</h2>
            <p>Create and manage system users</p>
          </div>
        </div>
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ email: '', password: '', role: 'dispatch' });
          }}
        >
          <Plus size={20} />
          New User
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          <Check size={20} />
          {message}
        </div>
      )}

      {showForm && (
        <div className="user-form-container">
          <form onSubmit={handleSubmit} className="user-form">
            <h3>{editingId ? 'Edit User' : 'Create New User'}</h3>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="dispatch">Dispatch</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-success"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Create User'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ email: '', password: '', role: 'dispatch' });
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="users-list">
        <h3>Registered Users ({users.length})</h3>
        
        {users.length === 0 ? (
          <p className="no-users">No users registered</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(userData => (
                <tr key={userData.uid}>
                  <td className="email-cell">{userData.email}</td>
                  <td className="role-cell">
                    <span className={`role-badge role-${userData.role}`}>
                      {userData.role === 'admin' ? 'Administrator' : 'Dispatch'}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${userData.active ? 'active' : 'inactive'}`}>
                      {userData.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="created-cell">
                    {userData.createdAt 
                      ? new Date(userData.createdAt).toLocaleDateString('en-US')
                      : 'N/A'
                    }
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(userData.uid)}
                      disabled={loading}
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdminAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content admin-auth-modal">
            <div className="modal-header">
              <h3>Verificación de Administrador</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAdminAuthModal(false);
                  setPendingUserData(null);
                  setAdminAuthForm({ email: '', password: '' });
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>Para crear un nuevo usuario, necesitamos verificar tu identidad como administrador.</p>
              
              <form onSubmit={handleAdminAuthSubmit} className="admin-auth-form">
                <div className="form-group">
                  <label htmlFor="admin-email">Tu Email de Admin</label>
                  <input
                    id="admin-email"
                    type="email"
                    value={adminAuthForm.email}
                    onChange={(e) => setAdminAuthForm({
                      ...adminAuthForm,
                      email: e.target.value
                    })}
                    placeholder="admin@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-password">Tu Contraseña de Admin</label>
                  <input
                    id="admin-password"
                    type="password"
                    value={adminAuthForm.password}
                    onChange={(e) => setAdminAuthForm({
                      ...adminAuthForm,
                      password: e.target.value
                    })}
                    placeholder="••••••"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="submit" 
                    className="btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Verificando...' : 'Verificar y Crear'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setShowAdminAuthModal(false);
                      setPendingUserData(null);
                      setAdminAuthForm({ email: '', password: '' });
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
