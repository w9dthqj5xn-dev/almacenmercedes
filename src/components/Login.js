import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [registerRole, setRegisterRole] = useState('dispatch');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      console.log('[Login] Attempting login with:', email);
      const { role } = await login(email, password);
      console.log('[Login] Login successful, role:', role);
      
      // Redirigir según el rol
      if (role === 'admin') {
        console.log('[Login] Redirecting to admin dashboard');
        navigate('/admin/dashboard');
      } else if (role === 'dispatch') {
        console.log('[Login] Redirecting to dispatch home');
        navigate('/dispatch/home');
      } else {
        console.error('[Login] Unknown role:', role);
        setError(`❌ Rol desconocido: ${role}`);
      }
    } catch (err) {
      console.error('[Login] Login error:', err);
      const errorMsg = err.message || 'Error al iniciar sesión';
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      if (password.length < 6) {
        setError('❌ La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      await register(email, password, registerRole);
      setError('✅ Cuenta creada exitosamente! Iniciando sesión...');
      
      // Auto login después de registrar
      setTimeout(() => {
        handleLogin(e);
      }, 1000);
    } catch (err) {
      const errorMsg = err.message || 'Error al registrarse';
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <LogIn size={40} />
          <h1>Warehouse Management</h1>
          <p>Sistema de Gestión de Almacén</p>
        </div>

        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="login-form">
          {error && (
            <div className={`error-alert ${error.includes('✅') ? 'success' : ''}`}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@almacen.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {isRegisterMode && (
            <div className="form-group">
              <label htmlFor="role">Rol de Usuario</label>
              <select 
                id="role"
                value={registerRole}
                onChange={(e) => setRegisterRole(e.target.value)}
                disabled={loading}
              >
                <option value="dispatch">Despacho (Dispatch)</option>
                <option value="admin">Administrador (Admin)</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (isRegisterMode ? 'Registrando...' : 'Iniciando sesión...') : (isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión')}
          </button>

          <button
            type="button"
            className="toggle-mode-btn"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
            }}
            disabled={loading}
          >
            {isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </form>

        {!isRegisterMode && (
          <div className="demo-credentials">
            <p><strong>📌 Credenciales de Demostración:</strong></p>
            <p>Admin: admin@test.com / password123</p>
            <p>Despacho: dispatch@test.com / password123</p>
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              💡 Si las credenciales no existen, puedes crear una nueva cuenta arriba.
            </p>
          </div>
        )}

        {isRegisterMode && (
          <div className="demo-credentials">
            <p><strong>📝 Crear Nueva Cuenta:</strong></p>
            <p>Ingresa un email y contraseña para registrarte</p>
            <p>Selecciona el rol que deseas (Admin o Despacho)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
