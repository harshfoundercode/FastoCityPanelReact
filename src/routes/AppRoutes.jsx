import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLoginScreen } from '../pages/LoginPage';
import { DashboardLayout } from '../components/DashboardLayout';
import { Dashboard } from '../pages/Dashboard';
import { Notifications } from '../pages/Notifications';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Login (No Sidebar) */}
      <Route path="/login" element={<AdminLoginScreen />} />

      {/* All routes with Sidebar - DashboardLayout wraps everything */}
      <Route path="/" element={<DashboardLayout />}>
        {/* Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Notifications */}
        <Route path="notifications" element={<Notifications />} />
        
        
     
    
      </Route>

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};