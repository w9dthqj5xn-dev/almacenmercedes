import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import '../styles/Header.css';

const Header = () => {
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="logo">📦 Warehouse</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <User size={20} />
            <div>
              <p className="user-email">{user?.email}</p>
              <p className="user-role">
                {userRole === 'admin' ? '👨‍💼 Administrator' : '📦 Dispatch'}
              </p>
            </div>
          </div>
          
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
