import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import DispatchHome from './pages/DispatchHome';
import './App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Inicializando aplicación...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dispatch/home"
        element={
          <ProtectedRoute requiredRole="dispatch">
            <DispatchHome />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
