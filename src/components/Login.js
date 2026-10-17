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
        setError(`❌ Unknown role: ${role}`);
      }
    } catch (err) {
      console.error('[Login] Login error:', err);
      const errorMsg = err.message || 'Error logging in';
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
        setError('❌ Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const { role } = await register(email, password, registerRole);
      setError('✅ Account created successfully! Logging in...');
      
      // Auto login después de registrar con un pequeño delay
      setTimeout(async () => {
        try {
          setLoading(true);
          console.log('[Login] Attempting auto-login after registration');
          await login(email, password);
          console.log('[Login] Auto-login successful, redirecting...');
          
          // Redirigir según el rol
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'dispatch') {
            navigate('/dispatch/home');
          } else {
            setError(`❌ Unknown role: ${role}`);
          }
        } catch (loginErr) {
          console.error('[Login] Auto-login error:', loginErr);
          const errorMsg = loginErr.message || 'Error logging in automatically';
          setError(`❌ ${errorMsg}`);
          setLoading(false);
        }
      }, 500);
    } catch (err) {
      const errorMsg = err.message || 'Registration error';
      setError(`❌ ${errorMsg}`);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/mercedes-logo.jpeg" alt="Mercedes Group Logo" className="login-logo" />
          <h1>Mercedes Group</h1>
          <p>Warehouse Management</p>
        </div>

        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="login-form">
          {error && (
            <div className={`error-alert ${error.includes('✅') ? 'success' : ''}`}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@warehouse.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
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
              <label htmlFor="role">User Role</label>
              <select 
                id="role"
                value={registerRole}
                onChange={(e) => setRegisterRole(e.target.value)}
                disabled={loading}
              >
                <option value="dispatch">Dispatch</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (isRegisterMode ? 'Registering...' : 'Logging in...') : (isRegisterMode ? 'Create Account' : 'Log In')}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
