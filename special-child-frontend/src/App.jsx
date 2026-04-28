import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard    from './pages/Dashboard';
import { isLoggedIn } from './services/authService';

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  return !isLoggedIn() ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="*" element={<Navigate to={isLoggedIn() ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}