import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import SubmitKyc from './pages/SubmitKyc';
import TrackStatus from './pages/TrackStatus';
import OfficerDashboard from './pages/OfficerDashboard';
import ReviewKyc from './pages/ReviewKyc';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Customer Routes */}
          <Route 
            path="/customer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/submit" 
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <SubmitKyc />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/status" 
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <TrackStatus />
              </ProtectedRoute>
            } 
          />

          {/* Officer Routes */}
          <Route 
            path="/officer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['OFFICER']}>
                <OfficerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer/pending" 
            element={
              <ProtectedRoute allowedRoles={['OFFICER']}>
                <OfficerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer/all" 
            element={
              <ProtectedRoute allowedRoles={['OFFICER']}>
                <OfficerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer/review/:id" 
            element={
              <ProtectedRoute allowedRoles={['OFFICER']}>
                <ReviewKyc />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
