import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLoginScreen } from '../pages/LoginPage';
import { DashboardLayout } from '../components/DashboardLayout';
import { Dashboard } from '../pages/Dashboard';
import { Notifications } from '../pages/Notifications';
import { AllHubs } from '../pages/hub/AllHub';

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
        
        {/* Hubs Routes */}
        <Route path="hubs">
          <Route index element={<Navigate to="/hubs/all-hubs" replace />} />
          <Route path="all-hubs" element={<AllHubs />} />
          {/* <Route path="add-hub-zone" element={<AddHubZone />} />
          <Route path="add-hub-manager" element={<AddHubManager />} />
          <Route path="hub-performance" element={<HubPerformance />} />
          <Route path="hub-zone" element={<HubZone />} /> */}
        </Route>
     
    
      </Route>

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};