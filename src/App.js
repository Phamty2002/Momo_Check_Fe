// src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CheckMomo from './components/CheckMomo';
import Login from './components/Login';
import NavBar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, AuthContext } from './contexts/AuthContext'; // Đảm bảo import AuthContext
import './App.css';

function AppRoutes() {
  const { user } = useContext(AuthContext); // Sử dụng useContext để lấy user

  return (
    <Routes>
      {/* Trang Home: Nếu đã đăng nhập, chuyển hướng đến Check Momo; ngược lại, chuyển đến Login */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/check-momo" replace /> : <Navigate to="/login" replace />}
      />

      {/* Route Đăng Nhập */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/check-momo" replace /> : <Login />} 
      />

      {/* Route Check Momo - Bảo Vệ */}
      <Route 
        path="/check-momo" 
        element={
          <ProtectedRoute>
            <CheckMomo />
          </ProtectedRoute>
        } 
      />

      {/* Bất kỳ route không xác định nào sẽ được chuyển hướng đến Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
