import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Prevent admin from accessing user routes like request-pickup
  if (!requireAdmin && userRole === 'admin' && window.location.pathname === '/request-pickup') {
    return <Navigate to="/admin" replace />;
  }

  // Prevent non-admin from accessing admin routes
  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;