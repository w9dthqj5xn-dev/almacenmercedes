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
  const [adminCredentials, setAdminCredentials] = useState(null);
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
      console.error('Error cargando usuarios:', error);
      setMessage('❌ Error al cargar usuarios');
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
      setMessage('❌ Email y contraseña son requeridos');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Si estamos en modo Firebase, pedir credenciales del admin
    if (!isLocalMode && !adminCredentials) {
      const adminEmail = prompt('Para crear un usuario, ingresa tu email de admin:');
      if (!adminEmail) {
        setMessage('❌ Operación cancelada');
        return;
      }
      
      const adminPassword = prompt('Ingresa tu contraseña de admin:');
      if (!adminPassword) {
        setMessage('❌ Operación cancelada');
        return;
      }
      
      setAdminCredentials({ email: adminEmail, password: adminPassword });
      // Volver a ejecutar handleSubmit con las credenciales
      setTimeout(() => {
        e.target.dispatchEvent(new Event('submit', { bubbles: true }));
      }, 0);
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      if (isLocalMode) {
        // Modo local: crear usuario en localStorage
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '{}');
        const uid = `user-${Date.now()}`;
        
        if (mockUsers[formData.email]) {
          setMessage('❌ El email ya está registrado');
          setLoading(false);
          return;
        }

        mockUsers[formData.email] = {
          uid,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          createdAt: new Date().toISOString(),
          active: true
        };

        localStorage.setItem('mock_users', JSON.stringify(mockUsers));
        await authModule.setMockUserData(uid, { role: formData.role });
        
        setMessage('✅ Usuario creado exitosamente');
        setFormData({ email: '', password: '', role: 'dispatch' });
        setShowForm(false);
        loadUsers();
      } else {
        // Modo Firebase: crear usuario con Firebase Auth
        try {
          const { auth_obj } = await import('../config/firebase');
          const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth');
          
          console.log('[UserManagement] Creating new user...');
          // Paso 1: Crear el nuevo usuario (esto cambia el usuario autenticado)
          const { user: newUser } = await createUserWithEmailAndPassword(auth_obj, formData.email, formData.password);
          console.log('[UserManagement] New user created:', newUser.uid);
          
          // Paso 2: Guardar datos en Realtime Database INMEDIATAMENTE
          const userRef = dbRef(rtDatabase_obj, `users/${newUser.uid}`);
          await set(userRef, {
            email: formData.email,
            role: formData.role,
            createdAt: new Date().toISOString(),
            active: true
          });
          console.log('[UserManagement] User data saved to database');

          // Paso 3: Re-autenticar al admin usando las credenciales guardadas
          if (adminCredentials) {
            console.log('[UserManagement] Re-authenticating admin...');
            try {
              await signInWithEmailAndPassword(auth_obj, adminCredentials.email, adminCredentials.password);
              console.log('[UserManagement] Admin re-authenticated successfully');
            } catch (reAuthError) {
              console.error('[UserManagement] Error re-authenticating admin:', reAuthError);
              setMessage('⚠️ Usuario creado, pero hubo un error re-autenticando al admin. Por favor inicia sesión nuevamente.');
              setAdminCredentials(null);
              setLoading(false);
              return;
            }
          }
          
          // Paso 4: Esperar a que onAuthStateChanged se actualice
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Paso 5: Recargar usuarios
          await loadUsers();

          setMessage('✅ Usuario creado exitosamente');
          setFormData({ email: '', password: '', role: 'dispatch' });
          setShowForm(false);
          setAdminCredentials(null);
        } catch (authError) {
          if (authError.code === 'auth/email-already-in-use') {
            setMessage('❌ El email ya está registrado');
          } else if (authError.code === 'auth/weak-password') {
            setMessage('❌ La contraseña es muy débil');
          } else {
            setMessage(`❌ Error: ${authError.message}`);
          }
          setAdminCredentials(null);
        }
      }
    } catch (error) {
      console.error('Error creando usuario:', error);
      setMessage('❌ Error al crear usuario');
      setAdminCredentials(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
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

      setMessage('✅ Usuario eliminado exitosamente');
      loadUsers();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      setMessage('❌ Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Solo el admin puede ver este componente
  if (userRole !== 'admin') {
    return (
      <div className="user-management-error">
        <AlertCircle size={48} />
        <h2>Acceso Denegado</h2>
        <p>Solo los administradores pueden gestionar usuarios</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div className="header-title">
          <Users size={32} />
          <div>
            <h2>Gestión de Usuarios</h2>
            <p>Crea y administra usuarios del sistema</p>
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
          Nuevo Usuario
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
            <h3>{editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="usuario@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Rol</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="dispatch">Despacho</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-success"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Crear Usuario'}
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
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="users-list">
        <h3>Usuarios Registrados ({users.length})</h3>
        
        {users.length === 0 ? (
          <p className="no-users">No hay usuarios registrados</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(userData => (
                <tr key={userData.uid}>
                  <td className="email-cell">{userData.email}</td>
                  <td className="role-cell">
                    <span className={`role-badge role-${userData.role}`}>
                      {userData.role === 'admin' ? 'Administrador' : 'Despacho'}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${userData.active ? 'active' : 'inactive'}`}>
                      {userData.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="created-cell">
                    {userData.createdAt 
                      ? new Date(userData.createdAt).toLocaleDateString('es-MX')
                      : 'N/A'
                    }
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(userData.uid)}
                      disabled={loading}
                      title="Eliminar usuario"
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
    </div>
  );
};

export default UserManagement;
