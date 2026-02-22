import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  if (!token || !adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
